const chai = require('chai');
const cp = require("child_process");
const fs = require('fs');
const mysql = require('mysql2/promise');

const expect = chai.expect;

const userHandlerFactory = require('../project_modules/user_handler.js')

const mysqlConnectionPool = mysql.createPool({
  connectionLimit: 10,
  host: process.env['MYSQL_HOSTNAME'],
  user: process.env['MYSQL_USER'],
  password: process.env['MYSQL_PASSWORD'],
  database: process.env['MYSQL_DATABASE']
})

//NOTE this returns the db to blank.
//okay for now, but in the future a mysql dump with some data will be useful
const testing_db_file_location = __dirname + "/db_for_testing.sql";
const mysql_conf_file = __dirname + "/mysql_testing.cnf"

const userHandler = userHandlerFactory({ mysqlConnectionPool })

function resetDB() {
  command =
    "mysql" +
    " --defaults-extra-file=" + mysql_conf_file +
    " --host " + process.env['MYSQL_HOSTNAME'] +
    " -D fundme < " + testing_db_file_location;
  cp.execSync(command);
}

function closePool() {
  mysqlConnectionPool.end();
}

describe("tests the user_handler", () => {
  beforeEach(resetDB);
  after(resetDB);
  after(closePool);

  it("returns null when searching for a user with an id that does not exists", (done) => {
    userHandler.findUserById({ user_id: "U-1234567" })
      .then((result) => {
        expect(result).to.be.null;
        done()
      })
  })

  it("reutrn null when searching for a github_id that does not exist", (done) => {
    userHandler.findUserByGithubId({ github_userid: "63881565" })
      .then((result) => {
        expect(result).to.be.null;
        done();
      })
  })

  it("creates a user", (done) => {
    userHandler.createUser({
      github_id: "67788733",
      github_login: "tomee_lee_jones",
      github_access_token: "71bce1ae5c2eec4511abf1f251c17e20e0ced596"
    }).then((result) => {
      expect(result).to.be.a('string');
      done()
    })
  })

  it("throws an error when trying to create a user with a github id that exists", (done) => {
    userHandler.createUser({
      github_id: "67788773",
      github_login: "tomee_lee_jones",
      github_access_token: "71bce1ae5c2eec4511abf1f251c17e20e0ced596"
    }).then((result) => {
      done("returned a result instead of an error")
    }).catch((error) => {
      done();
    })
  })
})
