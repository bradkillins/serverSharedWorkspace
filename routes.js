/***********************
 *   Routes
 **********************/

const express = require("express");
const bodyParser = require("body-parser");
const urlParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

const router = express.Router(); //this holds all routes and is exported

/************************
 *    View Routes
 ************************/

//home
router.get("/", (req, res) => {
  res.render("home", {
    title: "Welcome",
    scripts: "<script>sessionStorage.clear()</script>"
  });
});

//contact
router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us" });
});

//legal
router.get("/legal", (req, res) => {
  res.render("legal", { title: "Legal Information" });
});

//login
router.get("/login", (req, res) => {
  res.render("login", {
    title: "Login",
    scripts:
      "<script src='/scripts/general.js'></script><script src='/scripts/users.js'></script>"
  });
});

//signup
router.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Sign Up",
    scripts:
      "<script src='/scripts/general.js'></script><script src='/scripts/users.js'></script>"
  });
});

//ownerMenu
router.get("/ownerMenu", (req, res) => {
  res.render("ownerMenu", {
    title: "Main Menu",
    scripts: "<script src='/scripts/general.js'></script>"
  });
});

//addProp
router.get("/addProp", (req, res) => {
  res.render("addProp", {
    title: "Add Property",
    scripts: `<script src='/scripts/general.js'></script>
      <script src='/scripts/properties.js'></script>`
  });
});

//editProp
router.get("/editProp", (req, res) => {
  res.render("editProp", {
    title: "Edit Property",
    scripts: `<script src='/scripts/general.js'></script>
      <script src='/scripts/properties.js'></script>
      <script>PopulatePropEdit()</script>`
  });
});

//showProp
router.get("/showProp", (req, res) => {
  res.render("showProp", {
    title: "My Properties",
    scripts: `<script src='/scripts/general.js'></script>
      <script src='/scripts/properties.js'></script>
      <script>ShowProperties()</script>`
  });
});

//addWork
router.get("/addWork", (req, res) => {
  res.render("addWork", {
    title: "Add Workspace",
    scripts: `<script src='/scripts/general.js'></script>
      <script src='/scripts/workspaces.js'></script>
      <script>DisplayPropName();</script>`
  });
});

//editWork
router.get("/editWork", (req, res) => {
  res.render("editWork", {
    title: "Edit Workspace",
    scripts: `<script src='/scripts/general.js'></script>
      <script src='/scripts/workspaces.js'></script>
      <script>PopulateWorkEdit()</script>`
  });
});

//showPropWorkspaces
router.get("/showPropWorkspaces", (req, res) => {
  res.render("showPropWorkspaces", {
    title: "Workspaces",
    scripts: `<script src='/scripts/general.js'></script>
      <script src='/scripts/workspaces.js'></script>
      <script>ShowWorkspaces()</script>`
  });
});

//coworkerMenu
router.get("/coworkerMenu", (req, res) => {
  res.render("coworkerMenu", {
    title: "Main Menu",
    scripts: "<script src='/scripts/general.js'></script>"
  });
});

//availWorkspaces
router.get("/availWorkspaces", (req, res) => {
  res.render("availWorkspaces", {
    title: "Available Workspaces",
    scripts: `<script src='/scripts/general.js'></script>
      <script src='/scripts/availWork.js'></script>
      <script>FirstLoadWorkTable()</script>`
  });
});

//expired session
router.get("/expired", (req, res) => {
  res.render("expired", {
    title: "Expired Session",
    scripts: "<script>sessionStorage.clear()</script>"
  });
});

/************************************************************************************************
 *              API Routes
 *
 *  POST:   //api/user/new                   - create new user
 *  POST:   //api/login                      - validates user login and creates session
 *  POST:   //api/property/new               - create new property
 *  POST:   //api/workspace/new              - create new workspace
 *  PUT:    //api/property                   - edit property with propId in req.body
 *  PUT:    //api/workspace                  - edit workspace with workId in req.body
 *  DELETE: //api/property/:propId           - delete a property with id
 *  DELETE: //api/workspace/:workId          - delete a workspace with id
 *  GET:    //api/properties/:sessId         - gets all properties of a certain user
 *  GET:    //api/property/:propId           - gets a property by propId
 *  GET:    //api/workspaces/:propId/:sessId - gets all workspaces tied to a certain property
 *  GET:    //api/workspace/:workId          - gets a workspace by workId
 *  GET:    //api/availWorkspaces/:sessId    - gets all available workspaces
 *
 *************************************************************************************************/

const post = require("./apis/post");

router.post("/api/user/new", jsonParser, post.newUser);
router.post("/api/login", jsonParser, post.login);
router.post("/api/property/new", jsonParser, post.newProp);
router.post("/api/workspace/new", jsonParser, post.newWork);

const get = require("./apis/get");

router.get("/api/properties/:sessId", urlParser, get.userProperties);
router.get("/api/property/:propId", urlParser, get.property);
router.get("/api/workspaces/:propId/:sessId", urlParser, get.propWorkspaces);
router.get("/api/workspace/:workId", urlParser, get.workspace);

const put = require("./apis/put");

router.put("/api/property", jsonParser, put.property);
router.put("/api/workspace", jsonParser, put.workspace);

const del = require("./apis/delete");

router.delete("/api/property/:propId/:sessId", urlParser, del.property);
router.delete("/api/workspace/:workId/:sessId", urlParser, del.workspace);

module.exports = router;
