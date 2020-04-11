/*******************************************
 *         Shared Workspace: Phase 2
 *
 *         Final Project
 *         By Bradley Killins
 *         SODV1201
 *
 *        Client-side Script: users.js
 *
 *   All User related functions for login
 *   and creating new users.
 *******************************************/

/* CreateNewUser - instantiates a new user with values from the login form
 *                 and sends to api then provides feedback if successful or not
 */
const CreateNewUser = async () => {
  //store form data in newUser object
  const newUser = {
    firstName: document.querySelector("#fName").value,
    lastName: document.querySelector("#lName").value,
    phone: document.querySelector("#userPhone").value,
    email: document.querySelector("#userEmail").value,
    password: document.querySelector("#userPass").value,
    type: document.querySelector("#coworker").checked ? "Coworker" : "Owner"
  };
  //fetch api
  const fetchResult = await postFetch("/api/user/new", newUser);
  //successfully created new user:
  if (fetchResult.success) {
    document.querySelector(".formFeedback").innerHTML = `${fetchResult.msg}<br/>
    Re-directing to <a href='/login'>login</a> page in 5 seconds...`;
    document.querySelector("#signup").reset();
    setTimeout(() => {
      document.location = "/login";
    }, 5000);
  } //unsuccessful signup:
  else {
    document.querySelector(".formFeedback").innerHTML = `${fetchResult.msg}<br/>
    Please try again, or <a href='/login'>login</a> if you already have an account.`;
    document.querySelector("#signup").reset();
  }
};

/* Login - Checks to see if the given email and password match a stored user
 *         if they do, set user to currentUser in sessionStorage then load menu
 */
const Login = async () => {
  //save form data to loginData object
  const loginData = {
    email: document.querySelector("#userEmail").value,
    password: document.querySelector("#userPass").value
  };
  //fetch api
  const fetchResult = await postFetch("/api/login", loginData);
  console.log(fetchResult);
  //successful login
  if (fetchResult.success) {
    //set sessId and firstName into sessionStorage
    sessionStorage.setItem("sessId", fetchResult.sessId);
    sessionStorage.setItem("userName", fetchResult.firstName);
    //redirect to appropriate main menu
    if (fetchResult.type == "Coworker") document.location = "/coworkerMenu";
    else document.location = "/ownerMenu";
  }
  //unsuccessful login
  else {
    document.querySelector(".formFeedback").innerHTML = `${fetchResult.msg}<br/>
    Please try again, or <a href='/signup'>sign up</a> if you don't have an account.`;
    document.querySelector("#login").reset();
  }
};

//call formListener from general.js
FormListener("#signup", CreateNewUser);
FormListener("#login", Login);
