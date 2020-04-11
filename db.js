/********************************************
            Database Server 
*********************************************/

const sql = require("mssql");

//Import Database Settings:
const dbSettings = require(__dirname + "/config").dbConfig;

//export the connection object and give feedback if successful or not
module.exports = new sql.ConnectionPool(dbSettings)
  .connect()
  .then((connection) => {
    console.log("Connected to Database: ", dbSettings.database);
    return connection;
  })
  .catch((error) => console.log("Database Connection Error: ", error));
