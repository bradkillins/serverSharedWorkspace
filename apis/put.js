/*************************************************
 *         Shared Workspace: Phase 2
 *
 *         Final Project
 *         By Bradley Killins
 *         SODV1201
 *
 *         PUT API functions
 *
 **************************************************/

const q = require("../queries");
const gen = require("./general");

//api/property
module.exports.property = async (req, res) => {
  const sessId = req.body.sessId;
  //check if session expired
  const valid = await gen.validSess(sessId);
  if (!valid) {
    res.send({ success: false, msg: "expiredSess" });
  } else if (!req.body.address || !req.body.neighbor || !req.body.sqFeet) {
    res.send({
      success: false,
      msg: "Please enter all information in the form. Try again."
    });
  }
  //valid session
  else {
    //update sessId
    const newSessId = gen.GenRanId(64);
    await q.queryDb(
      q.updateSess(req.body.sessId, newSessId, gen.setCurrentDateTime())
    );
    //db
    const dbRes = await q.queryDb(
      q.updateProp(
        req.body.propId,
        req.body.address,
        req.body.neighbor,
        req.body.sqFeet,
        req.body.parking,
        req.body.transit,
        req.body.listed
      )
    );
    if (!dbRes) {
      res.send({
        success: true,
        msg: "Property Updated.",
        newSessId: newSessId
      });
    } else {
      res.send({
        success: false,
        msg: `Please <a href="/contact">contact</a> the site admin. Database error.`,
        newSessId: newSessId
      });
    }
  }
};

//api/workspace
module.exports.workspace = async (req, res) => {
  const sessId = req.body.sessId;
  //check if session expired
  const valid = await gen.validSess(sessId);
  if (!valid) {
    res.send({ success: false, msg: "expiredSess" });
  }
  //valid session
  //check if all fields filled in
  else if (
    !req.body.type ||
    !req.body.occ ||
    !req.body.availDate ||
    !req.body.term ||
    !req.body.price
  ) {
    res.send({
      success: false,
      msg: "Please enter all information in the form. Try again."
    });
  } else {
    //update sessId
    const newSessId = gen.GenRanId(64);
    await q.queryDb(
      q.updateSess(req.body.sessId, newSessId, gen.setCurrentDateTime())
    );
    //send query to db
    const dbRes = await q.queryDb(
      q.updateWork(
        req.body.workId,
        req.body.type,
        req.body.occ,
        req.body.availDate,
        req.body.term,
        req.body.price,
        req.body.smoke,
        req.body.listed
      )
    );
    //send response
    if (!dbRes) {
      res.send({
        success: true,
        msg: "Workspace Updated.",
        newSessId: newSessId
      });
    } else {
      res.send({
        success: false,
        msg: `Please <a href="/contact">contact</a> the site admin. Database error.`,
        newSessId: newSessId
      });
    }
  }
};
