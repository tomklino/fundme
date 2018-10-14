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
]
const CREATE_NEW_CHALLENGE_STATEMENT = "INSERT INTO `Challenges` (" +
  CHALLENGE_TABLE_FIELDS.join(',') + ") VALUES (" +
  CHALLENGE_TABLE_FIELDS.map(f => '?').join(',') + ")"
const QUERY_CHALLENGES = "SELECT " +
  CHALLENGE_TABLE_FIELDS.join(',') + " FROM `Challenges`"
const QUERY_CHALLENGES_BY_PROJECT_ID = QUERY_CHALLENGES + " WHERE `project_id`=?"
const QUERY_CHALLENGES_BY_CHALLENGE_ID = QUERY_CHALLENGES + " WHERE `challenge_id`=?"
const UPDATE_CHALLENGE_ASSIGNEE = 'UPDATE `Challenges` SET `assignee`=? WHERE `challenge_id`=?;'

function generateChallengeId() {
  return "C-" + randomString.generate(8)
}

function mapDataToResult({
  challenge_id, assignee, creator, challenge_name, project_id, challenge_type }) {
  return {
    id: challenge_id,
    name: challenge_name,
    project_id,
    challenge_type,
    assignee,
    creator
  }
}

function challengeHandlerFactory({
  mysqlConnectionPool
}) {
  if(mysqlConnectionPool === undefined) {
    console.error("challengeHandlerFactory: mysql connection pool not provided")
    return;
  }
  return {
    assignUserToChallenge: async function({
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
    },

    createNewChallenge: async function({
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
          null,
          creator
        ])
      } catch(e) {
        console.error("ERROR: challenge_handler.js: " + e.code)
        throw e;
      }
      return challenge_id;
    },

    queryChallenge: async function({ challenge_id }) {
      let [ rows ] = await mysqlConnectionPool.query(
        QUERY_CHALLENGES_BY_CHALLENGE_ID, [ challenge_id ]
      )
      return rows.map(mapDataToResult)
    },

    queryChallenges: async function({ project_id }) {
      debug(1, `queryChallenges called with ${project_id}`)
      let [ rows ] = await mysqlConnectionPool.query(
          QUERY_CHALLENGES_BY_PROJECT_ID, [ project_id ])
      return rows.map(mapDataToResult)
    }
  }
}

module.exports = challengeHandlerFactory;
