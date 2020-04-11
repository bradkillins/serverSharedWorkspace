/*************************************************
 *         Shared Workspace: Phase 2
 *
 *         Final Project
 *         By Bradley Killins
 *         SODV1201
 *
 *         General functions used by other APIs
 *
 **************************************************/

const q = require("../queries");

/** GenRanId - a pseudo random alpha-numeric character generator
 *  @Params length - how many random characters to generate
 */
module.exports.GenRanId = (length) => {
  const charSet =
    "abcdefghijklmnopqrstuvwyxz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += charSet[Math.floor(Math.random() * charSet.length)];
  }
  return id;
};

/** setCurrentDateTime - gets the current sql formatted DateTime
 */
module.exports.setCurrentDateTime = () => {
  const now = new Date();
  return `${now.getFullYear()}-${
    now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1
  }-${now.getDate() < 10 ? "0" + now.getDate() : now.getDate()}T${
    now.getHours() < 10 ? "0" + now.getHours() : now.getHours()
  }:${now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()}:${
    now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds()
  }`;
};

module.exports.validSess = async (sessId) => {
  if (sessId == "null") {
    return false;
  }
  const now = this.setCurrentDateTime();
  const diffOb = await q.queryDb(q.sessTimeDiff(now, sessId));
  return diffOb[0].diff > 900 ? false : true;
};
