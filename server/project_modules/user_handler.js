const randomString = require('randomstring')
const debug = require('nice_debug')("USER_HANDLER_DEBUG");

const QUERY_USER_BY_ID =
  "SELECT * FROM `Users` WHERE `user_id`=?"
const QUERY_USER_BY_GITHUB_ID =
  "SELECT * FROM `Users` WHERE `github_id`=?"

function userHandlerFactory({ mysqlConnectionPool }) {
  async function isUserIdExists({ user_id }) {
    if( (await findUserById({ user_id })) === null ) {
      return false;
    }
    return true;
  }

  async function createUser({ user_id, github_id, github_login, github_access_token }) {

  }

  async function findUserById({ user_id }) {
    const [ rows ] = await mysqlConnectionPool.query(QUERY_USER_BY_ID, [
      user_id
    ]);

    if (rows.length === 0) {
      return null
    }
    return rows[0]
  }

  async function findUserByGithubId({ github_id }) {
    const [ rows ] = await mysqlConnectionPool.query(QUERY_USER_BY_GITHUB_ID, [
      github_id
    ]);

    if (rows.length === 0) {
      return null
    }
    return rows[0]
  }

  return {
    createUser,
    findUserById,
    findUserByGithubId
  }
}

module.exports = userHandlerFactory;
