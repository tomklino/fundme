const randomString = require('randomstring')
const debug = require('nice_debug')("PROJECT_HANDLER_DEBUG")

const CREATE_NEW_PROJECT_STATEMENT =
  "INSERT INTO `Projects` (project_id, name, online_repo, user_id) VALUES (?,?,?,?)"
const QUERY_PROJECT_BY_ID =
  "SELECT * FROM `Projects` WHERE `project_id`=?"
const QUERY_PROJECTS_BY_NAME =
  "SELECT * FROM `Projects` WHERE `name` LIKE ?"

function generateProjectId() {
  return "P-" + randomString.generate(7);
}

function projectHandlerFactory({
  mysqlConnectionPool
}) {
  if(mysqlConnectionPool === undefined) {
    console.error("projectHandlerFactory: mysql connection pool not provided")
    return;
  }
  return {
    //TODO implement mechanism to prevent projects with the same name
    createNewProject: async function({
      name,
      username,
      user_id
    }) {
      debug(1, `createNewProject called with name ${name}`)
      id = generateProjectId();
      let online_repo = `https://www.github.com/${username}/${name}`
      try {
        await mysqlConnectionPool.execute(CREATE_NEW_PROJECT_STATEMENT, [
          id,
          name,
          online_repo,
          user_id
        ])
      } catch(e) {
        console.error("ERROR: project_handler.js: " + e.code)
        throw e;
      }
      return id;
    },

    queryProjectsByName: async function({
      name
    }) {
      debug(1, `queryProjectsByName called with name ${name}`)
      var [rows] = await mysqlConnectionPool.query(QUERY_PROJECTS_BY_NAME, [
        "%" + name + "%"
      ])
      return rows.map(({project_id, name, online_repo}) => {
        return {
          id: project_id,
          name,
          online_repo
        }
      })
    },

    queryProjectsById: async function({
      id
    }) {
      debug(1, `queryProjectsById called with id ${id}`)
      var [rows] = await mysqlConnectionPool.query(QUERY_PROJECT_BY_ID, [id])
      return rows.map(({project_id, name, online_repo}) => {
        return {
          id: project_id,
          name,
          online_repo
        }
      })
    }
  }
}

module.exports = projectHandlerFactory;
