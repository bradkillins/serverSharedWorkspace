/*****************************************************
 *         Shared Workspace: Phase 2
 *
 *         Final Project
 *         By Bradley Killins
 *         SODV1201
 *
 *         Dependencies:
 *           body-parser
 *           express
 *           express-handlebars
 *           mssql
 *
 *  Please configure application setting in config.js
 *
 ******************************************************/

/******************************
 *       Server Setup
 ******************************/

const express = require("express");
const app = express();
const port = require("./config").port;

app.listen(port, () => {
  console.log("Listening on Port: ", port);
});

/************************************
 *   HTML Template Engine Setup
 *               ---
 *   Using Handlebars as view engine
 *   HTML templates stored in views
 ************************************/

const hbs = require("express-handlebars");

//set the file extension for views to .hbs and loads express-handlebars as the view engine
//the default layout is layout.hbs in the views folder
//all other views are injected into the body variable of layout.hbs
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views"
  })
);
app.set("view engine", "hbs");

/*******************************
 *          Routing
 *******************************/
//set static folder
app.use(express.static("./public"));

//import api routes from routes.js
app.use(require("./routes"));

app.use("/", (req, res) => {
  res.status(404).render("err", {
    title: "Error: 404",
    errId: "404 - Not Found",
    message: "Specified page or resource not found."
  });
});
