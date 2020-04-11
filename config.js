/*************************************************
 *         Shared Workspace: Phase 2
 *
 *         Final Project
 *         By Bradley Killins
 *         SODV1201
 *
 *         Application config
 *
 **************************************************/

//Node Server settings:

module.exports.port = 5080; //Enter desired port for application server

//Database Server Settings

const dbName = "Brad_SharedWorkspace"; //Enter the name of the database

module.exports.dbConfig = {
  user: "brad", //Enter db server user name
  password: "admin123", //Enter db server password
  server: "localhost", //Enter db server domain
  port: 1433, //Enter db server port (default = 1433)
  database: dbName,
  options: { enableArithAbort: true }
};
