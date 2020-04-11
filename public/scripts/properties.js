/**************************************************
 *         Shared Workspace: Phase 2
 *
 *         Final Project
 *         By Bradley Killins
 *         SODV1201
 *
 *         Client-side Script: properties.js
 *
 *   All Property related functions for creating,
 *   saving, editing, and displaying properties.
 ***************************************************/

/* CreateNewProperty - instantiates a new property object and saves it to the
 *                     properties array in local storage, and to currentProperty
 *                     in sessionStorage.
 */
const CreateNewProperty = async () => {
  const sessId = sessionStorage.getItem("sessId");
  const newProp = {
    sessId: sessId,
    address: document.querySelector("#address").value,
    neighbor: document.querySelector("#neighborhood").value,
    sqFeet: document.querySelector("#sqFeet").value,
    parking: document.querySelector("#parkingYes").checked ? 1 : 0,
    transit: document.querySelector("#transitYes").checked ? 1 : 0,
    listed: document.querySelector("#listYes").checked ? 1 : 0
  };

  const fetchRes = await postFetch("/api/property/new", newProp);

  if (fetchRes.success) {
    //update sessId
    const newSessId = fetchRes.newSessId;
    sessionStorage.setItem("sessId", newSessId);
    //provide feedback to user
    document.querySelector(".formFeedback").innerHTML = `${fetchRes.msg}`;
    document.querySelector("#addProperty").reset();
    setTimeout(() => {
      document.querySelector(".formFeedback").innerHTML = "";
    }, 5000);
  } else {
    if (fetchRes.msg == "expiredSess") document.location = "/expired";
    document.querySelector(".formFeedback").innerHTML = `${fetchRes.msg}<br/>
    Please <a href="/contact">contact</a> the site admin if this keeps happening.`;
    document.querySelector("#addProperty").reset();
    setTimeout(() => {
      document.querySelector(".formFeedback").innerHTML = "";
    }, 10000);
  }
};

/* ShowProperties - gets the properties with sessId then
 *              fills in the #propertiesTable
 */
const ShowProperties = async () => {
  const sessId = sessionStorage.getItem("sessId");
  const userName = sessionStorage.getItem("userName");
  const fetchRes = await getFetch(`/api/properties/${sessId}`);

  if (!fetchRes.success) {
    if (fetchRes.msg == "expiredSess") document.location = "/expired";
    console.log(fetchRes.msg);
  } else {
    //update sessId
    const newSessId = fetchRes.newSessId;
    sessionStorage.setItem("sessId", newSessId);
    //check if properties array is empty
    if (!fetchRes.properties.length) {
      document.querySelector(
        "#noProperties"
      ).innerHTML = `I'm sorry ${userName}, but there are no properties saved under you're account.`;
    }

    const propertiesTable = document.querySelector("#propertiesTable");
    fetchRes.properties.forEach((e) => {
      let parking = "No";
      if (e.parking) {
        parking = "Yes";
      }
      let transit = "No";
      if (e.transit) {
        transit = "Yes";
      }
      let listed = "No";
      if (e.listed) {
        listed = "Yes";
      }

      let result = `<tbody><tr>
          <td><button name="${e.propId}" onclick="EditSelected('prop', this.name, '/editProp');">Edit</button></td>
          <td>${e.address}</td>
          <td>${e.neighbor}</td>
          <td>${e.sqFeet}</td>
          <td>${parking}</td>
          <td>${transit}</td>
          <td>${listed}</td>
          <td>${e.numOfWork} Workspaces
          <button name="${e.propId}" onclick="EditSelected('prop', this.name, '/showPropWorkspaces');">View/Add/Modify</button></td>
          </tr></tbody>`;
      propertiesTable.insertAdjacentHTML("beforeend", result);
    });
  }
};

/* PopulatePropEdit - populates the edit form with the current
 *                Property details
 */
const PopulatePropEdit = async () => {
  //get form elements
  const address = document.querySelector("#address");
  const neighbor = document.querySelector("#neighborhood");
  const sqFeet = document.querySelector("#sqFeet");
  const parkingYes = document.querySelector("#parkingYes");
  const parkingNo = document.querySelector("#parkingNo");
  const transitYes = document.querySelector("#transitYes");
  const transitNo = document.querySelector("#transitNo");
  const listYes = document.querySelector("#listYes");
  const listNo = document.querySelector("#listNo");
  //populate form with current values
  const propId = sessionStorage.getItem("propId");
  const currentProp = await getFetch(`/api/property/${propId}`);
  address.value = currentProp.address;
  neighbor.value = currentProp.neighbor;
  sqFeet.value = currentProp.sqFeet;
  if (currentProp.parking == 1) {
    parkingYes.checked = true;
  } else {
    parkingNo.checked = true;
  }
  if (currentProp.transit == 1) {
    transitYes.checked = true;
  } else {
    transitNo.checked = true;
  }
  if (currentProp.listed == 1) {
    listYes.checked = true;
  } else {
    listNo.checked = true;
  }
};

/** EditProp - Takes form input and updates property in db
 */
const EditProp = async () => {
  //retrieve the propId from sessionStorage
  let propId = sessionStorage.getItem("propId");
  //get sessId from sessionStorage
  const sessId = sessionStorage.getItem("sessId");
  //create updated prop object
  const updatedProp = {
    sessId: sessId,
    propId: propId,
    address: document.querySelector("#address").value,
    neighbor: document.querySelector("#neighborhood").value,
    sqFeet: document.querySelector("#sqFeet").value,
    parking: document.querySelector("#parkingYes").checked ? 1 : 0,
    transit: document.querySelector("#transitYes").checked ? 1 : 0,
    listed: document.querySelector("#listYes").checked ? 1 : 0
  };

  const fetchRes = await putFetch("/api/property", updatedProp);

  if (fetchRes.success) {
    //update sessId
    const newSessId = fetchRes.newSessId;
    sessionStorage.setItem("sessId", newSessId);
    //provide feedback to user
    document.querySelector(".formFeedback").innerHTML = `${fetchRes.msg}`;
    setTimeout(() => {
      document.location = "/showProp";
    }, 1000);
  } else {
    if (fetchRes.msg == "expiredSess") document.location = "/expired";
    document.querySelector(".formFeedback").innerHTML = `${fetchRes.msg}<br/>
    Please <a href="/contact">contact</a> the site admin if this keeps happening.`;
    document.querySelector("#editProperty").reset();
    setTimeout(() => {
      document.querySelector(".formFeedback").innerHTML = "";
    }, 10000);
  }
};

const ConfirmDeleteProp = () => {
  const confirm = `<h2>Confirm Delete?</h2>
  <p><br/>Warning this will also delete all associated workspaces with this property.
  <br/>This is permanent and cannot be undone!!<br/>&nbsp</p>
  <div class="formSubmitLine">
    <button type="button" onclick="DeleteProp();" class="btnRed">Delete</button>
    <button type="button" onclick="ClosePopup();" class="btn">Cancel</button>  
  </div>`;
  OpenPopup(confirm);
};

/* DeleteProp - Removes the property from db
 */
const DeleteProp = async () => {
  const sessId = sessionStorage.getItem("sessId");
  const propId = sessionStorage.getItem("propId");
  //delete Prop
  const fetchRes = await deleteFetch(`/api/property/${propId}/${sessId}`);

  ClosePopup();
  if (fetchRes.success) {
    //update sessId
    const newSessId = fetchRes.newSessId;
    sessionStorage.setItem("sessId", newSessId);
    //provide feedback to user
    document.querySelector(".formFeedback").innerHTML = `${fetchRes.msg}`;
    setTimeout(() => {
      document.location = "/showProp";
    }, 1000);
  } else {
    if (fetchRes.msg == "expiredSess") document.location = "/expired";
    document.querySelector(".formFeedback").innerHTML = `${fetchRes.msg}<br/>
    Please <a href="/contact">contact</a> the site admin if this keeps happening.`;
    setTimeout(() => {
      document.querySelector(".formFeedback").innerHTML = "";
    }, 8000);
  }
};

//call formListener from general.js
FormListener("#addProperty", CreateNewProperty);
FormListener("#editProperty", EditProp);
