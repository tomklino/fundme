const randomString = require('randomstring')

const CREATE_NEW_PROJECT_STATEMENT =
  "INSERT INTO `Projects` (project_id, name, online_repo) VALUES (?,?,?)"
const QUERY_PROJECT_BY_ID =
  "SELECT * FROM `Projects` WHERE `project_id`=?"

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
      online_repo = null
    }) {
      id = generateProjectId();
      await mysqlConnectionPool.execute(CREATE_NEW_PROJECT_STATEMENT, [
        id,
        name,
        online_repo
      ])
      return id;
    },

    queryProjectsById: async function({
      id
    }) {
      var [rows, fields] = await mysqlConnectionPool.query(QUERY_PROJECT_BY_ID, [id])
      return {
        id: rows[0].project_id,
        name: rows[0].name,
        online_repo: rows[0].online_repo
      }
    }
  }
}

module.exports = projectHandlerFactory;
