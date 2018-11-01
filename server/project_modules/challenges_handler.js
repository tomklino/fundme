const randomString = require('randomstring')
const debug = require('nice_debug')("CHALLENGES_HANDLER_DEBUG")

const CHALLENGE_TABLE_FIELDS = [
  "challenge_id",
  "challenge_name",
  "project_id",
  "challenge_type",
  "challenge_description",
  "assignee",
  "creator",
  "account_token"
]
const CREATE_NEW_CHALLENGE_STATEMENT = "INSERT INTO `Challenges` (" +
  CHALLENGE_TABLE_FIELDS.join(',') + ") VALUES (" +
  CHALLENGE_TABLE_FIELDS.map(f => '?').join(',') + ")"
const QUERY_CHALLENGES = "SELECT " +
  CHALLENGE_TABLE_FIELDS.join(',') + " FROM `Challenges`"
const QUERY_CHALLENGES_WITH_NAME_RESOLUTION = "SELECT " +
  CHALLENGE_TABLE_FIELDS.map(f => "`Challenges`." + f).join(',') + "," +
  "`assignees`.`github_login` AS assignee_name," +
  "`creators`.`github_login` AS creator_name " +
  "FROM `Challenges` " +
  "LEFT JOIN `Users` `assignees` " +
  "ON `Challenges`.`assignee` = `assignees`.`user_id` " +
  "LEFT JOIN `Users` `creators` " +
  "ON `Challenges`.`creator` = `creators`.`user_id`"

const QUERY_CHALLENGES_BY_PROJECT_ID = QUERY_CHALLENGES + " WHERE `project_id`=?"
const QUERY_CHALLENGES_WITH_NAME_RESOLUTION_BY_PROJECT_ID =
  QUERY_CHALLENGES_WITH_NAME_RESOLUTION + " WHERE `project_id`=?"
const QUERY_CHALLENGES_BY_CHALLENGE_ID = QUERY_CHALLENGES + " WHERE `challenge_id`=?"
const UPDATE_CHALLENGE_ASSIGNEE = 'UPDATE `Challenges` SET `assignee`=? WHERE `challenge_id`=?;'
const UPDATE_CHALLENGE_ACCOUNT =
  "UPDATE `Challenges` SET `account_token` = ? WHERE `challenge_id` = ?"

function generateChallengeId() {
  return "C-" + randomString.generate(8)
}

function mapDataToResult(mysql_columns) {
  debug(2, "mapDataToResult mysql_columns:", mysql_columns)
  return {
    id: mysql_columns.challenge_id,
    name: mysql_columns.challenge_name,
    project_id: mysql_columns.project_id,
    challenge_type: mysql_columns.challenge_type,
    assignee: mysql_columns.assignee ?
      {
        id: mysql_columns.assignee,
        username: mysql_columns.assignee_name
      } : null,
    creator: mysql_columns.creator ?
      {
        id: mysql_columns.creator,
        username: mysql_columns.creator_name
      } : null,
    pledged: mysql_columns.pledged
  }
}

function challengeHandlerFactory({
  mysqlConnectionPool, wallet
}) {
  if(mysqlConnectionPool === undefined) {
    console.error("challengeHandlerFactory: mysql connection pool not provided")
    return;
  }

  async function assignUserToChallenge({
    challenge_id, user_id
  }) {
    try {
      debug(1, "executring query:", UPDATE_CHALLENGE_ASSIGNEE, "args:", challenge_id, user_id)
      await mysqlConnectionPool.execute(UPDATE_CHALLENGE_ASSIGNEE, [
        user_id,
        challenge_id
      ])
      return challenge_id;
    } catch(e) {
      console.error("ERROR: challenge_handler.js: " + e.code)
      throw e;
    }
  }

  async function createNewChallenge({
    challenge_name,
    project_id,
    challenge_type,
    challenge_description,
    creator
  }) {
    challenge_id = generateChallengeId();
    try {
      await mysqlConnectionPool.execute(CREATE_NEW_CHALLENGE_STATEMENT, [
        challenge_id,
        challenge_name,
        project_id,
        challenge_type,
        challenge_description ? challenge_description : "",
        null, // assignee
        creator,
        null // account_token
      ])
    } catch(e) {
      console.error("ERROR: challenge_handler.js: " + e.code)
      throw e;
    }
    return challenge_id;
  }

  async function queryChallenge({ challenge_id }) {
    let [ rows ] = await mysqlConnectionPool.query(
      QUERY_CHALLENGES_BY_CHALLENGE_ID, [ challenge_id ]
    )
    return rows.map(mapDataToResult)
  }

  async function queryChallenges({ project_id }) {
    debug(1, `queryChallenges called with ${project_id}`)
    debug(1, "mysql query:", QUERY_CHALLENGES_WITH_NAME_RESOLUTION_BY_PROJECT_ID)
    let [ rows ] = await mysqlConnectionPool.query(
        QUERY_CHALLENGES_WITH_NAME_RESOLUTION_BY_PROJECT_ID, [ project_id ])
    let rows_with_pledges = await Promise.all(
      rows.map(async (challenge) => {
        debug(2, "challenge:", challenge)
        if(challenge.account_token) {
          debug(2, "challenge has account_token")
          challenge['pledged'] = await wallet.getWalletTotal({
            account_token: challenge.account_token
          })
          debug(1, "pledged", challenge['pledged'])
        }
        return challenge;
      })
    )
    let results = rows.map(mapDataToResult)
    return results;
  }

  async function getOrCreateChallengeAccount({ challenge_id }) {
    try {
      var [ [ challenge ] ] =
        await mysqlConnectionPool.query(QUERY_CHALLENGES_BY_CHALLENGE_ID, [
          challenge_id
        ])
    } catch(err) {
      console.error("ERROR: challenge_handler.js: " + err.code);
      throw err
    }

    if(challenge.account_token) {
      return challenge.account_token
    }

    const account_token = await wallet.createAccount({
      account_name: `challenge account ${challenge_id}`
    })

    await updateChallengeAccount({ challenge_id, account_token })

    return account_token;
  }

  async function updateChallengeAccount({ challenge_id, account_token }) {
    try {
      await mysqlConnectionPool.execute(UPDATE_CHALLENGE_ACCOUNT, [
        account_token, challenge_id
      ])
    } catch(err) {
      console.error("ERROR: challenge_handler.js: " + err.code)
      throw err;
    }
  }

  return {
    assignUserToChallenge,
    createNewChallenge,
    queryChallenge,
    queryChallenges,
    updateChallengeAccount,
    getOrCreateChallengeAccount
  }
}

module.exports = challengeHandlerFactory;
