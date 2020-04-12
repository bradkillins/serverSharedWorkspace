/***********************************************
 *         Shared Workspace: Phase 2
 *
 *         Final Project
 *         By Bradley Killins
 *         SODV1201
 *
 *         Database Queries and functions.
 *
 ***********************************************/

//import Database connection:
const db = require("./db");

/** queryDb - Sends a query to the Database
 * @param query - the query to send
 */
module.exports.queryDb = async (query) => {
  try {
    //console.log("Query: ", query);
    const dbConn = await db;
    const result = await dbConn.request().query(query);
    //console.log("Full db response: ", result);
    return result.recordset;
  } catch (err) {
    console.log("Database Query Error:", err);
    return "Db Error";
  }
};

/***********************************************
 *     Queries for Users and Login/Signup
 *
 ***********************************************/

/** insertNewUser - Query to insert new User.
 */
module.exports.insertNewUser = (
  email,
  firstName,
  lastName,
  phone,
  type,
  password
) => {
  return `INSERT INTO Users
  VALUES
    ('${email}', '${firstName}', '${lastName}', '${phone}', '${type}');
  INSERT INTO Login
  VALUES
    ((SELECT userId FROM Users WHERE email LIKE '${email}'), '${email}', '${password}', NULL, NULL);`;
};

/** updateFirstSess - Query to Update the Login Table with
 *                    sess details for the first time
 */
module.exports.updateFirstSess = (email, sessId, lastSessTime) => {
  return `UPDATE Login
  SET sessId = '${sessId}',
  lastSessTime = '${lastSessTime}'
  WHERE email LIKE '${email}';`;
};

/** updateSess - Query to Update the Login Table with sess details on subsequent activity*/
module.exports.updateSess = (oldSessId, newSessId, lastSessTime) => {
  return `UPDATE Login
  SET sessId = '${newSessId}',
  lastSessTime = '${lastSessTime}'
  WHERE sessId LIKE '${oldSessId}';`;
};

/** selectUserNameType - Query that selects user first name and type Where email*/
module.exports.selectUserNameType = (email) => {
  return `SELECT firstName, type FROM Users WHERE email LIKE '${email}';`;
};

module.exports.sessTimeDiff = (now, sessId) => {
  return `SELECT DATEDIFF(ss, (SELECT lastSessTime FROM Login WHERE sessId LIKE '${sessId}'), '${now}') AS diff;`;
};

module.exports.selectUser = (userId) => {
  return `SELECT * FROM Users WHERE userId = ${userId};`;
};

module.exports.checkUserType = (sessId) => {
  return `SELECT type FROM Users as u JOIN Login as l ON l.userId = u.userId WHERE sessId LIKE '${sessId}';`;
};

/***********************************************
 *     Queries for Properties
 *
 ***********************************************/

/** selectUserProperties - gets all properties from associated user with sessId */
module.exports.selectUserProperties = (sessId) => {
  return `SELECT 
	p.propId,	address, neighbor, sqFeet, parking,	transit, p.listed, COUNT(workId) AS numOfWork 
FROM Properties AS p 
	LEFT JOIN Workspaces AS w ON p.propId = w.propId
WHERE userId = (SELECT userId FROM Login WHERE sessId LIKE '${sessId}')
GROUP BY p.propId, address, neighbor, sqFeet, parking, transit, p.listed;`;
};

/** insertNewProp - adds a new property to the properties table */
module.exports.insertNewProp = (
  sessId,
  address,
  neighbor,
  sqFeet,
  parking,
  transit,
  listed
) => {
  return `INSERT INTO Properties 
  VALUES 
  ((SELECT userId FROM Login WHERE sessId LIKE '${sessId}'), 
    '${address}', '${neighbor}', ${sqFeet}, ${parking}, ${transit}, ${listed})`;
};

/** updateProp - updates a property with propId */
module.exports.updateProp = (
  propId,
  address,
  neighbor,
  sqFeet,
  parking,
  transit,
  listed
) => {
  return `UPDATE Properties
  SET address = '${address}',
  neighbor = '${neighbor}',
  sqFeet = ${sqFeet},
  parking = ${parking},
  transit = ${transit},
  listed = ${listed}
  WHERE propId = ${propId};`;
};

/** deleteProp - deletes a prop with propId */
module.exports.deleteProp = (propId) => {
  return `DELETE Properties WHERE propId = ${propId};`;
};

/***********************************************
 *     Queries for Workspaces
 *
 ***********************************************/

/** insertNewWork - adds a new workspace to the workspaces table */
module.exports.insertNewWork = (
  propId,
  type,
  occ,
  availDate,
  term,
  price,
  smoke,
  listed
) => {
  return `INSERT INTO Workspaces 
  VALUES 
  (${propId}, '${type}', ${occ}, '${availDate}', '${term}', ${price}, ${smoke}, ${listed})`;
};

/** selectPropWorkspaces - selects all workspaces with propId */
module.exports.selectPropWorkspaces = (propId) => {
  return `SELECT * FROM Workspaces WHERE propId = '${propId}'`;
};

/** updateWork - updates a workspace with workId */
module.exports.updateWork = (
  workId,
  type,
  occ,
  availDate,
  term,
  price,
  smoke,
  listed
) => {
  return `UPDATE Workspaces
  SET type = '${type}',
  occ = ${occ},
  availDate = '${availDate}',
  term = '${term}',
  price = ${price},
  smoke = ${smoke},
  listed = ${listed}
  WHERE workId = ${workId};`;
};

/** deleteWork - deletes a workspace with workId */
module.exports.deleteWork = (workId) => {
  return `DELETE Workspaces WHERE workId = ${workId};`;
};

// availWorkspaces
module.exports.selectAvailWorks = () => {
  return `SELECT * FROM AvailWorkspaces;`;
};
