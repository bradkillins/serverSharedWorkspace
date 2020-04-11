const q = require("../queries");
const gen = require("./general");

//api/property/:propId/:sessId
module.exports.property = async (req, res) => {
  //validate sessId
  const sessId = req.params.sessId;
  //check if session expired
  const valid = await gen.validSess(sessId);
  if (!valid) {
    res.send({ success: false, msg: "expiredSess" });
  }
  //valid session
  else {
    //update sessId
    const newSessId = gen.GenRanId(64);
    await q.queryDb(
      q.updateSess(req.params.sessId, newSessId, gen.setCurrentDateTime())
    );
    //send query to db
    const dbRes = await q.queryDb(q.deleteProp(req.params.propId));
    //respond appropriately with new sessId
    if (!dbRes) {
      res.send({
        success: true,
        msg: "Property Deleted.",
        newSessId: newSessId
      });
    } else {
      res.send({
        success: false,
        msg: "Unexpected response from the Database",
        newSessId: newSessId
      });
    }
  }
};

//api/workspace/:workId/:sessId
module.exports.workspace = async (req, res) => {
  //validate sessId
  const sessId = req.params.sessId;
  //check if session expired
  const valid = await gen.validSess(sessId);
  if (!valid) {
    res.send({ success: false, msg: "expiredSess" });
  }
  //valid session
  else {
    //update sessId
    const newSessId = gen.GenRanId(64);
    await q.queryDb(
      q.updateSess(req.params.sessId, newSessId, gen.setCurrentDateTime())
    );
    //send query to db
    const dbRes = await q.queryDb(q.deleteWork(req.params.workId));
    //respond appropriately with new sessId
    if (!dbRes) {
      res.send({
        success: true,
        msg: "Workspace Deleted.",
        newSessId: newSessId
      });
    } else {
      res.send({
        success: false,
        msg: "Unexpected response from the Database",
        newSessId: newSessId
      });
    }
  }
};
