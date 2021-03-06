/*************************************************
 *         Shared Workspace: Phase 2
 *
 *         Final Project
 *         By Bradley Killins
 *         SODV1201
 *
 *         Client-side Script: workspaces.js
 *
 *   All Workspace related functions for creating,
 *   saving, editing, and displaying workspaces.
 **************************************************/

/* CreateNewWorkspace - creates a new workspace and saves it to the db
 */
const CreateNewWorkspace = async () => {
  const sessId = sessionStorage.getItem("sessId");
  const propId = sessionStorage.getItem("propId");

  const type = document.querySelector("#type");
  const term = document.querySelector("#term");

  const newWork = {
    sessId: sessId,
    propId: propId,
    type: type.options[type.selectedIndex].value,
    occ: document.querySelector("#occ").value,
    availDate: document.querySelector("#availDate").value,
    term: term.options[term.selectedIndex].value,
    price: document.querySelector("#price").value,
    smoke: document.querySelector("#smokeYes").checked ? 1 : 0,
    listed: document.querySelector("#listYes").checked ? 1 : 0
  };

  const fetchRes = await postFetch("/api/workspace/new", newWork);

  if (fetchRes.success) {
    //update sessId
    const newSessId = fetchRes.newSessId;
    sessionStorage.setItem("sessId", newSessId);
    //provide feedback to user
    document.querySelector(".formFeedback").innerHTML = `${fetchRes.msg}`;
    document.querySelector("#addWorkspace").reset();
    setTimeout(() => {
      document.querySelector(".formFeedback").innerHTML = "";
    }, 5000);
  } else {
    if (fetchRes.msg == "expiredSess") document.location = "/expired";
    document.querySelector(".formFeedback").innerHTML = fetchRes.msg;
    setTimeout(() => {
      document.querySelector(".formFeedback").innerHTML = "";
    }, 10000);
  }
};

/* ShowWorkspaces - Builds a table that shows all workspaces in a property
 *                  Displays an appropriate message if no workspaces found.
 */
const ShowWorkspaces = async () => {
  await DisplayPropName();
  const propId = sessionStorage.getItem("propId");
  const sessId = sessionStorage.getItem("sessId");

  const fetchRes = await getFetch(`/api/workspaces/${propId}/${sessId}`);
  const workspaces = fetchRes.workspaces;

  if (!fetchRes.success) {
    if (fetchRes.msg == "expiredSess") document.location = "/expired";
    console.log(fetchRes.msg);
  } else {
    //valid session
    //update sessId
    const newSessId = fetchRes.newSessId;
    sessionStorage.setItem("sessId", newSessId);
    if (!workspaces.length) {
      document.querySelector("#noWorkspaces").innerHTML = `There 
          are no Workspaces for this Property`;
    }

    const workspacesTable = document.querySelector("#workspacesTable");
    workspaces.forEach((e) => {
      let type;
      if (e.type === "meet") type = "Meeting Room";
      if (e.type === "office") type = "Private Office";
      if (e.type === "desk") type = "Open Area Desk";

      const smoke = e.smoke == 1 ? "Yes" : "No";

      let term;
      if (e.term === "day") term = "1 Day";
      if (e.term === "week") term = "1 Week";
      if (e.term === "month") term = "1 Month";

      const listed = e.listed == 1 ? "Yes" : "No";

      let result = `<tbody>
              <tr>
                <td>
                  <button 
                    class="btn"
                    id="w${e.workId}"
                    name="${e.workId}"
                    >Edit
                  </button>
                </td>
                <td>${type}</td>
                <td>${e.occ}</td>
                <td>${smoke}</td>
                <td>${e.availDate.slice(0, 10)}</td>
                <td>${term}</td>
                <td class="r-text">$${(Math.round(e.price * 100) / 100).toFixed(
                  2
                )}</td>
                <td>${listed}</td>
              </tr></tbody>`;
      workspacesTable.insertAdjacentHTML("beforeend", result);
      function edWork() {
        EditSelected("work", this.name, "/editWork");
      }
      document
        .querySelector(`#w${e.workId}`)
        .addEventListener("click", edWork, false);
    });
  }
};

/* PopulateWork - populates the edit workspace form with data
 */
const PopulateWorkEdit = async () => {
  const workId = sessionStorage.getItem("workId");
  const sessId = sessionStorage.getItem("sessId");
  const fetchRes = await getFetch(`/api/workspace/${workId}/${sessId}`);
  if (!fetchRes.success) {
    console.log(fetchRes.msg);
    if (fetchRes.msg == "expiredSess") document.location = "/expired";
    document.querySelector("#errFeedback").innerHTML = fetchRes.msg;
  } else {
    //update sessId
    sessionStorage.setItem("sessId", fetchRes.newSessId);
    const currentWork = fetchRes.workspace;

    //populate form with current values
    //get form elements
    const type = document.querySelector("#type");
    const occ = document.querySelector("#occ");
    const smokeYes = document.querySelector("#smokeYes");
    const smokeNo = document.querySelector("#smokeNo");
    const availDate = document.querySelector("#availDate");
    const term = document.querySelector("#term");
    const price = document.querySelector("#price");
    const listYes = document.querySelector("#listYes");
    const listNo = document.querySelector("#listNo");

    //fill in form
    if (currentWork.type === "meet") type.options[0].selected = true;
    if (currentWork.type === "office") type.options[1].selected = true;
    if (currentWork.type === "desk") type.options[2].selected = true;
    occ.value = currentWork.occ;
    currentWork.smoke ? (smokeYes.checked = true) : (smokeNo.checked = true);
    availDate.value = currentWork.availDate.slice(0, 10);
    if (currentWork.term === "day") term.options[0].selected = true;
    if (currentWork.term === "week") term.options[1].selected = true;
    if (currentWork.term === "month") term.options[2].selected = true;
    price.value = (Math.round(currentWork.price * 100) / 100).toFixed(2);
    currentWork.listed ? (listYes.checked = true) : (listNo.checked = true);
    //add event listeners
    document
      .querySelector("#popClose")
      .addEventListener("click", ClosePopup, false);
    document
      .querySelector("#conDelBtn")
      .addEventListener("click", ConfirmDeleteWork, false);
  }
};

/* EditCurrentWork - Gets form input and updates the workspace
 */
const EditCurrentWork = async () => {
  //retrieve the workId from sessionStorage
  let workId = sessionStorage.getItem("workId");
  //get sessId from sessionStorage
  const sessId = sessionStorage.getItem("sessId");
  //create updated work object

  const type = document.querySelector("#type");
  const term = document.querySelector("#term");

  const updatedWork = {
    sessId: sessId,
    workId: workId,
    type: type.options[type.selectedIndex].value,
    occ: document.querySelector("#occ").value,
    availDate: document.querySelector("#availDate").value,
    term: term.options[term.selectedIndex].value,
    price: document.querySelector("#price").value,
    smoke: document.querySelector("#smokeYes").checked ? 1 : 0,
    listed: document.querySelector("#listYes").checked ? 1 : 0
  };

  const fetchRes = await putFetch("/api/workspace", updatedWork);

  if (fetchRes.success) {
    //update sessId
    const newSessId = fetchRes.newSessId;
    sessionStorage.setItem("sessId", newSessId);
    //provide feedback to user
    document.querySelector(".formFeedback").innerHTML = fetchRes.msg;
    setTimeout(() => {
      document.location = "/showPropWorkspaces";
    }, 1000);
  } else {
    if (fetchRes.msg == "expiredSess") document.location = "/expired";
    document.querySelector(".formFeedback").innerHTML = fetchRes.msg;
    setTimeout(() => {
      document.querySelector(".formFeedback").innerHTML = "";
    }, 10000);
  }
};

const ConfirmDeleteWork = () => {
  const confirm = `<h2>Confirm Delete?</h2>
  <p><br/>Warning this will delete this workspaces.
  <br/>This is permanent and cannot be undone!!<br/>&nbsp</p>
  <div class="formSubmitLine">
    <button id="delBtn" class="btnRed">Delete</button>
    <button id="canBtn" class="btn">Cancel</button>  
  </div>`;
  OpenPopup(confirm);
  document
    .querySelector("#delBtn")
    .addEventListener("click", DeleteWork, false);
  document
    .querySelector("#canBtn")
    .addEventListener("click", ClosePopup, false);
};

/* DeleteWork - Removes the workspace from the db
 */
const DeleteWork = async () => {
  const sessId = sessionStorage.getItem("sessId");
  const workId = sessionStorage.getItem("workId");
  //delete Work
  const fetchRes = await deleteFetch(`/api/workspace/${workId}/${sessId}`);
  ClosePopup();
  if (fetchRes.success) {
    //update sessId
    sessionStorage.setItem("sessId", fetchRes.newSessId);
    //provide feedback to user
    document.querySelector(".formFeedback").innerHTML = `${fetchRes.msg}`;
    setTimeout(() => {
      document.location = "/showPropWorkspaces";
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

//displays the current property address in #titleProp
const DisplayPropName = async () => {
  const propId = sessionStorage.getItem("propId");
  const sessId = sessionStorage.getItem("sessId");
  const fetchRes = await getFetch(`/api/property/${propId}/${sessId}`);
  if (fetchRes.success) {
    //update sessId
    sessionStorage.setItem("sessId", fetchRes.newSessId);
    //set workspace name
    document.querySelector("#titleProp").innerText = fetchRes.property.address;
  } else {
    if (fetchRes.msg == "expiredSess") document.location = "/expired";
    document.querySelector("#errFeedback").innerHTML = `${fetchRes.msg}<br/>
    Please <a href="/contact">contact</a> the site admin if this keeps happening.`;
    setTimeout(() => {
      document.querySelector("#errFeedback").innerHTML = "";
    }, 8000);
  }
};

//call formListener from general.js
FormListener("#addWorkspace", CreateNewWorkspace);
FormListener("#editWorkspace", EditCurrentWork);
