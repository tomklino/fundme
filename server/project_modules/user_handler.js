const randomString = require('randomstring')
const debug = require('nice_debug')("USER_HANDLER_DEBUG");

const QUERY_USER_BY_ID =
  "SELECT * FROM `Users` WHERE `user_id`=?"
const QUERY_USER_BY_GITHUB_ID =
  "SELECT * FROM `Users` WHERE `github_id`=?"
const CREATE_NEW_USER_STATEMENT =
  "INSERT INTO `Users` (user_id, github_id, github_login, github_access_token) VALUES (?,?,?,?)"
const UPDATE_USER_ACCOUNT =
  "UPDATE `Users` SET `account_token` = ? WHERE `user_id` = ?"

function generateUserId() {
  return "U-" + randomString.generate(7);
}

function userHandlerFactory({ mysqlConnectionPool, wallet, options }) {
  options = options || {};
  const { newUserGift } = options;
  async function updateUserAccount({ user_id, account_token }) {
    debug(1, "updateUserAccount: user_id:", user_id, "account_token:", account_token)
    try {
      await mysqlConnectionPool.execute(UPDATE_USER_ACCOUNT, [
        account_token, user_id
      ])
    } catch(err) {
      debug(1, err)
      throw err;
    }
    return true;
  }

  async function isUserIdExists({ user_id }) {
    return ( (await findUserById({ user_id })) !== null )
  }

  async function isGitHubIdExists({ github_id }) {
    return ( (await findUserByGithubId({ github_id })) !== null )
  }

  async function createUser({ github_id, github_login, github_access_token }) {
    if ( (await isGitHubIdExists({ github_id })) ) {
      debug(1, "cannot create user: github_id exists")
      const error = new Error("github id exists already");
      error.code = "ERROR_USER_EXIST"
      throw error;
    }

    const user_id = generateUserId();
    debug(1, "creating a user with the following arguments: ",
      user_id, github_id, github_login, github_access_token);

    try {
      await mysqlConnectionPool.execute(CREATE_NEW_USER_STATEMENT, [
        user_id,
        github_id,
        github_login,
        github_access_token
      ])
    } catch(err) {
      debug(1, err)
      throw err;
    }

    //NOTE: deliberatly not using await. we return the user_id to the client
    //      and wait for account creation in the backgound
    wallet.createAccount({ account_name: `user account ${user_id}`})
      .then((account_token) => {
        updateUserAccount({ user_id, account_token })
        if(newUserGift) {
          debug(1, "newUserGift:", newUserGift)
          wallet.addCoupon({ account_token, value: newUserGift })
        }
      })
      .catch((err) => {
        debug(1, "error while creating account for user", user_id, err.code)
      })

    return user_id;
  }

  async function findUserById({ user_id }) {
    debug(1, "findUserById: user_id:", user_id)
    const [ rows ] = await mysqlConnectionPool.query(QUERY_USER_BY_ID, [
      user_id
    ]);

    if (rows.length === 0) {
      return null
    }
    debug(1, "findUserById returning:", rows[0])
    return rows[0]
  }

  async function findUserByGithubId({ github_id }) {
    const [ rows ] = await mysqlConnectionPool.query(QUERY_USER_BY_GITHUB_ID, [
      github_id
    ]);

    if (rows.length === 0) {
      return null
    }
    return rows[0].user_id
  }

  return {
    createUser,
    findUserById,
    updateUserAccount,
    findUserByGithubId
  }
}

module.exports = userHandlerFactory;
