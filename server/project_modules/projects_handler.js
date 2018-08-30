const randomString = require('randomstring')
const debug = require('nice_debug')("PROJECT_HANDLER_DEBUG")

//TODO: consider importing all of the statements from a seperate file
const CREATE_NEW_PROJECT_STATEMENT =
  "INSERT INTO `Projects` (project_id, name, online_repo, user_id, description) VALUES (?,?,?,?,?)"
const QUERY_PROJECTS =
  "SELECT `project_id`, `name`, `description`, `online_repo`, `Users`.`user_id`, `github_login` FROM `Projects` INNER JOIN `Users` ON `Projects`.`user_id` = `Users`.`user_id`"
const QUERY_PROJECT_BY_ID =
  QUERY_PROJECTS + " WHERE `project_id`=?"
const QUERY_PROJECTS_BY_NAME =
  QUERY_PROJECTS + " WHERE `name` LIKE ?"

function generateProjectId() {
  return "P-" + randomString.generate(7);
}

function mapDataToResult({
  project_id, name, description, online_repo, user_id, github_login }) {
  return {
    id: project_id,
    name,
    description,
    owner: {
      id: user_id,
      username: github_login
    },
    online_repo
  }
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
      user_id,
      description = null
    }) {
      debug(1, `createNewProject called with name ${name}`)
      id = generateProjectId();
      let online_repo = `https://www.github.com/${username}/${name}`
      try {
        await mysqlConnectionPool.execute(CREATE_NEW_PROJECT_STATEMENT, [
          id,
          name,
          online_repo,
          user_id,
          description
        ])
      } catch(e) {
        console.error("ERROR: project_handler.js: " + e.code)
        throw e;
      }
      return id;
    },

    queryProjects: async function() {
      debug(1, `queryProjects called`)
      var [ rows ] = await mysqlConnectionPool.query(QUERY_PROJECTS)
      debug(2, `found ${rows.length} from db`)
      return rows.map(mapDataToResult)
    },

    queryProjectsByName: async function({
      name
    }) {
      debug(1, `queryProjectsByName called with name ${name}`)
      var [ rows ] = await mysqlConnectionPool.query(QUERY_PROJECTS_BY_NAME, [
        "%" + name + "%"
      ])
      return rows.map(mapDataToResult)
    },


    queryProjectsById: async function({
      id
    }) {
      debug(1, `queryProjectsById called with id ${id}`)
      var [ rows ] = await mysqlConnectionPool.query(QUERY_PROJECT_BY_ID, [id])
      return rows.map(mapDataToResult)
    }
  }
}

module.exports = projectHandlerFactory;
