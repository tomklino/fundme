const randomString = require('randomstring')
const debug = require('nice_debug')("CHALLENGES_HANDLER_DEBUG")

const CHALLENGE_TABLE_FIELDS = [ "challenge_id", "challenge_name", "project_id", "challenge_type", "amout_pledged", "currency_symbol" ]
const CREATE_NEW_CHALLENGE_STATEMENT = "INSERT INTO `Challenges` (" +
  CHALLENGE_TABLE_FIELDS.join(',') + ") VALUES (" +
  CHALLENGE_TABLE_FIELDS.map(f => '?').join(',') + ")"
const QUERY_CHALLENGES = "SELECT " +
  CHALLENGE_TABLE_FIELDS.join(',') + " FROM `Challenges`"
const QUERY_CHALLENGES_BY_PROJECT_ID = QUERY_CHALLENGES + " WHERE `project_id`=?"

function generateChallengeId() {
  return "C-" + randomString.generate(8)
}

function mapDataToResult({
  challenge_id, challenge_name, project_id, challenge_type, amout_pledged, currency_symbol }) {
  return {
    id: challenge_id,
    name: challenge_name,
    project_id,
    challenge_type,
    amout_pledged,
    currency_symbol
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
    createNewChallenge: async function({
      challenge_name,
      project_id,
      challenge_type
    }) {
      challenge_id = generateChallengeId();
      try {
        //TODO make sure project_id actually exists in projects table before adding challenge
        await mysqlConnectionPool.execute(CREATE_NEW_CHALLENGE_STATEMENT, [
          challenge_id,
          challenge_name,
          project_id,
          challenge_type,
          0, //amout_pledged
          "USD"
        ])
      } catch(e) {
        console.error("ERROR: challenge_handler.js: " + e.code)
        throw e;
      }
      return challenge_id;
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
