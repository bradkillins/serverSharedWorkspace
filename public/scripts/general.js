/*******************************************
 *          Shared Workspace: Phase 2
 *
 *          Final Project
 *          By Bradley Killins
 *          SODV1201
 *
 *          Client-side Script: general.js
 *
 *    General functions that are used on the
 *    majority of pages.
 ********************************************/

/**postFetch - Sends a POST fetch request using
 *             application/json.
 * @param url The url to send POST fetch
 * @param body The data to store in body of POST
 */
const postFetch = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    //console.log("Fetch data returned: ", data);
    return data;
  } catch (err) {
    console.log("Fetch error: ", err);
    const e = { success: false, msg: err };
    return e;
  }
};

/**putFetch - Sends a PUT fetch request using
 *             application/json.
 * @param url The url to send PUT fetch
 * @param body The data to store in body of PUT
 */
const putFetch = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    //console.log("Fetch data returned: ", data);
    return data;
  } catch (err) {
    console.log("Fetch error: ", err);
    const e = { success: false, msg: err };
    return e;
  }
};

/**deleteFetch - Sends a DELETE fetch request
 * @param url The url to send DELETE fetch
 */
const deleteFetch = async (url) => {
  try {
    const response = await fetch(url, {
      method: "DELETE"
    });
    const data = await response.json();
    //console.log("Fetch data returned: ", data);
    return data;
  } catch (err) {
    console.log("Fetch error: ", err);
    const e = { success: false, msg: err };
    return e;
  }
};

/**getFetch - Sends a GET fetch request
 * @param url The url to send GET fetch
 */
const getFetch = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    //console.log("Fetch data returned: ", data);
    return data;
  } catch (err) {
    console.log("Fetch error: ", err);
    const e = { success: false, msg: err };
    return e;
  }
};

/* DisplayUserName - displays the current user name
 *                      in #displayUserName
 */
const DisplayUserName = async () => {
  const displayName = document.querySelector("#displayUserName");
  const name = sessionStorage.getItem("userName");
  displayName.innerText = name;
};

//call DisplayUserName if element exists
if (document.querySelector("#displayUserName")) DisplayUserName();

/* FormListener - adds an event listener to the form with selector listening
 *              for submit, then blocks the page from refreshing and runs a function.
 *    @Params - selector: the selector of the form to add listener
 *              func: the name of the function to run * do not include ()
 */
const FormListener = (selector, func) => {
  //Only add the event listener if the selector exists on the current page.
  if (document.querySelector(selector))
    document.querySelector(selector).addEventListener("submit", (event) => {
      event.preventDefault(); //Stops the page from refreshing when submitting the form.
      func(); //The function to run when the form is submitted.
    });
};

/* OpenPopup - Displays the owner contact info in a popUp
 *
 */
const OpenPopup = (display) => {
  document.querySelector("#popUp").classList.remove("popUpHide");
  document.querySelector("#popMsg").innerHTML = display;
};

/* ClosePopup - closes the popUp
 */
const ClosePopup = () => {
  document.querySelector("#popUp").classList.add("popUpHide");
};

/** EditSelected - save selected item's id in sessionStorage
 *                  then navigates to appropriate page
 *    @params idType - either "prop" or "work"
 *    @params id - the item's id
 *    @params location - the edit page to load
 */
const EditSelected = (idType, id, location) => {
  //saves selected Id to sessionStorage
  sessionStorage.setItem(`${idType == "prop" ? "propId" : "workId"}`, id);
  //load edit page
  document.location = location;
};
