/*************************************************
 *         Shared Workspace: Phase 2
 *
 *         Final Project
 *         By Bradley Killins
 *         SODV1201
 *
 *         GET API functions
 *
 **************************************************/

const q = require("../queries");
const gen = require("./general");

//api/properties/:sessId
module.exports.userProperties = async (req, res) => {
  const sessId = req.params.sessId;
  //check if session expired
  const valid = await gen.validSess(sessId);
  if (!valid) {
    res.send({ success: false, msg: "expiredSess" });
  }
  //valid session
  else {
    const newSessId = gen.GenRanId(64);
    await q.queryDb(
      q.updateSess(req.params.sessId, newSessId, gen.setCurrentDateTime())
    );
    const properties = await q.queryDb(q.selectUserProperties(newSessId));
    res.send({
      success: true,
      msg: "Retrieved user Properties",
      newSessId: newSessId,
      properties: properties
    });
  }
};

//api/property/:propId/:sessId
module.exports.property = async (req, res) => {
  const propId = req.params.propId;
  const sessId = req.params.sessId;
  //check if session expired
  const valid = await gen.validSess(sessId);
  if (!valid) {
    res.send({ success: false, msg: "expiredSess" });
  }
  //valid session
  else {
    //update sess
    const newSessId = gen.GenRanId(64);
    await q.queryDb(q.updateSess(sessId, newSessId, gen.setCurrentDateTime()));
    //get property from db
    const property = await q.queryDb(q.selectProperty(propId));
    //failed db query
    if (!property || property == "Db Error") {
      res.send({
        success: false,
        msg: "Database Error, <a href='/contact'>contact</a> the site admin.",
        newSessId: newSessId,
        property: property
      });
    }
    //no property found in db
    else if (property.length < 1) {
      res.send({
        success: false,
        msg:
          "No matching property found! This should not happen. Please <a href='/contact'>contact</a> a site admin.",
        newSessId: newSessId,
        property: property
      });
    }
    //successful db query
    else {
      res.send({
        success: true,
        msg: "Retrieved Property Id: " + propId,
        newSessId: newSessId,
        property: property[0]
      });
    }
  }
};

//api/workspaces/:propId/:sessId
module.exports.propWorkspaces = async (req, res) => {
  const sessId = req.params.sessId;
  const propId = req.params.propId;
  //check if session expired
  const valid = await gen.validSess(sessId);
  if (!valid) {
    res.send({ success: false, msg: "expiredSess" });
  }
  //valid session
  else {
    const newSessId = gen.GenRanId(64);
    await q.queryDb(
      q.updateSess(req.params.sessId, newSessId, gen.setCurrentDateTime())
    );
    const workspaces = await q.queryDb(q.selectPropWorkspaces(propId));
    res.send({
      success: true,
      msg: "Retrieved Workspaces for a property.",
      newSessId: newSessId,
      workspaces: workspaces
    });
  }
};

//api/workspace/:workId  **** add session verification ****
module.exports.workspace = async (req, res) => {
  const workId = req.params.workId;
  const workspace = await q.queryDb(
    `SELECT * FROM Workspaces WHERE workId LIKE '${workId}'`
  );
  res.send(workspace[0]);
};

//api/availWorkspaces/:sessId
module.exports.availWorkspaces = async (req, res) => {
  const sessId = req.params.sessId;
  //check if session expired
  const valid = await gen.validSess(sessId);
  if (!valid) {
    res.send({ success: false, msg: "expiredSess" });
  }
  //valid session
  else {
    //update session
    const newSessId = gen.GenRanId(64);
    await q.queryDb(
      q.updateSess(req.params.sessId, newSessId, gen.setCurrentDateTime())
    );
    //query db for availWorkspaces
    const availWorks = await q.queryDb(q.selectAvailWorks());
    res.send({
      success: true,
      msg: "Retrieved Workspaces for a property.",
      newSessId: newSessId,
      availWorks: availWorks
    });
  }
};

//api/user/:userId/:sessId
module.exports.user = async (req, res) => {
  const sessId = req.params.sessId;
  //check if session expired
  const valid = await gen.validSess(sessId);
  if (!valid) {
    res.send({ success: false, msg: "expiredSess" });
  }
  //valid session
  else {
    //update session
    const newSessId = gen.GenRanId(64);
    await q.queryDb(
      q.updateSess(req.params.sessId, newSessId, gen.setCurrentDateTime())
    );
    //query db for user
    const user = await q.queryDb(q.selectUser(req.params.userId));
    res.send({
      success: true,
      msg: "Retrieved User.",
      newSessId: newSessId,
      user: user
    });
  }
};
