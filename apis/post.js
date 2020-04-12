/*************************************************
 *         Shared Workspace: Phase 2
 *
 *         Final Project
 *         By Bradley Killins
 *         SODV1201
 *
 *         POST API functions
 *
 **************************************************/

const q = require("../queries");
const gen = require("./general");

//api/user/new
module.exports.newUser = async (req, res) => {
  const currentUsers = await q.queryDb("SELECT * FROM Users;");
  //check if user already exists in DB
  if (currentUsers.findIndex((user) => user.email == req.body.email) != -1) {
    res.send({ success: false, msg: "User already exists." });
  } else if (
    !req.body.email ||
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.phone ||
    !req.body.type ||
    !req.body.password
  ) {
    res.send({
      success: false,
      msg: "Please enter all information in the form. Try again."
    });
  } else if (req.body.password.length < 8) {
    res.send({
      success: false,
      msg: "Password must be 8 or more characters. Try again."
    });
  } else {
    const dbRes = await q.queryDb(
      q.insertNewUser(
        req.body.email,
        req.body.firstName,
        req.body.lastName,
        req.body.phone,
        req.body.type,
        req.body.password
      )
    );
    if (!dbRes) {
      res.send({ success: true, msg: "New User Created." });
    } else {
      res.send({
        success: false,
        msg: "Unexpected response from the Database"
      });
    }
  }
};

//api/login
module.exports.login = async (req, res) => {
  //check if email exists
  const currentUsers = await q.queryDb("SELECT * FROM Login;");
  const loginIndex = currentUsers.findIndex(
    (user) => user.email == req.body.email
  );
  //if not matching email
  if (loginIndex == -1) {
    res.send({ success: false, msg: `No user with email ${req.body.email}` });
  } //found match, validate password
  else {
    //valid password:
    if (currentUsers[loginIndex].password == req.body.password) {
      //create sessId and lastSessTime
      const sessId = gen.GenRanId(64);
      //send to database
      const dbRes = await q.queryDb(
        q.updateFirstSess(req.body.email, sessId, gen.setCurrentDateTime())
      );
      const userInfo = await q.queryDb(q.selectUserNameType(req.body.email));
      if (!dbRes) {
        res.send({
          success: true,
          msg: "Login Successful.",
          sessId: sessId,
          type: userInfo[0].type,
          firstName: userInfo[0].firstName
        });
      } else {
        res.send({ success: false, msg: "Unexpected response from Database." });
      }
    } else {
      //invalid password:
      res.send({ success: false, msg: "Incorrect Login Information." });
    }
  }
};

//api/property/new
module.exports.newProp = async (req, res) => {
  const sessId = req.body.sessId;
  console.log(req.body);
  //const userType = await q.queryDb(q.checkUserType(sessId));
  //console.log(userType);

  //check if session expired
  const valid = await gen.validSess(sessId);
  if (!valid) {
    res.send({ success: false, msg: "expiredSess" });
  }
  //valid session
  //else if() {}
  else if (!req.body.address || !req.body.neighbor || !req.body.sqFeet) {
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
    //add new property to db
    const dbRes = await q.queryDb(
      q.insertNewProp(
        newSessId,
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
        msg: "New Property Created.",
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

//api/workspace/new
module.exports.newWork = async (req, res) => {
  const sessId = req.body.sessId;
  //check if session expired
  const valid = await gen.validSess(sessId);
  if (!valid) {
    res.send({ success: false, msg: "expiredSess" });
    //check if all fields filled in
  } else if (
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
  }
  //valid session
  else {
    //update sessId
    const newSessId = gen.GenRanId(64);
    await q.queryDb(
      q.updateSess(req.body.sessId, newSessId, gen.setCurrentDateTime())
    );
    //add new property to db
    const dbRes = await q.queryDb(
      q.insertNewWork(
        req.body.propId,
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
        msg: "New Workspace Created.",
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
