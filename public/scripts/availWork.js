/*************************************************
 *         Shared Workspace: Phase 2
 *
 *         Final Project
 *         By Bradley Killins
 *         SODV1201
 *
 *         Client-side Script: availWork.js
 *
 *   All functions for displaying, sorting and
 *   filtering the available workspaces.
 **************************************************/

/* SaveAvailWorkspaces - gets availWorkspaces from db then
 *                       saves them to sessionStorage
 */
const SaveAvailWorkspaces = async () => {
  //retrieve availWorkspaces
  const sessId = sessionStorage.getItem("sessId");
  const fetchRes = await getFetch(`/api/availWorkspaces/${sessId}`);
  if (!fetchRes.success) {
    if (fetchRes.msg == "expiredSess") document.location = "/expired";
    console.log(fetchRes.msg);
  } else {
    //update sessId
    sessionStorage.setItem("sessId", fetchRes.newSessId);
    //check if availWorkspaces array is empty
    if (!fetchRes.availWorks.length) {
      document.querySelector(
        "#noWorkspaces"
      ).innerHTML = `I'm sorry but there are no available Workspaces right now.`;
    }
  }
  sessionStorage.setItem(
    "availWorkspaces",
    JSON.stringify(fetchRes.availWorks)
  );
  sessionStorage.setItem(
    "displayWorkspaces",
    JSON.stringify(fetchRes.availWorks)
  );
};

/* PopulateWorkTable - shows all workspaces within the dataset in a table
 *    @Params - dataset: the array of workspaces to display in table
 */
const PopulateWorkTable = (dataset) => {
  //load the dataset from sessionStorage
  const workspaces = JSON.parse(sessionStorage.getItem(dataset));
  if (!workspaces.length) {
    document.querySelector(
      "#noWorkspaces"
    ).innerHTML = `Sorry there are no available workspaces. Try changing the filter settings. 
            <br/> There also may not be any Workspaces available.`;
  }

  const container = document.querySelector("#availWorkCards");
  let cards = "";
  workspaces.forEach((workspace) => {
    const address = workspace.address;
    const neighbor = workspace.neighbor;
    let type = workspace.type;
    const occ = workspace.occ;
    const sqFeet = workspace.sqFeet;
    let term = workspace.term;
    const price = workspace.price;
    const availDate = workspace.availDate;
    const parking = workspace.parking;
    const smoke = workspace.smoke;
    const transit = workspace.transit;
    const owner = workspace.userId;

    if (type === "meet") type = "Meeting Room";
    if (type === "office") type = "Private Office";
    if (type === "desk") type = "Desk in Open Area";

    if (term === "day") term = "Day";
    if (term === "week") term = "Week";
    if (term === "month") term = "Month";

    cards += `<div class="card">
                <div class="cardGroup">
                    <div class="cardLine"><span class="bold">Address: </span>${address}</div>
                    <div class="cardLine"><span class="bold">Neighborhood: </span>${neighbor}</div>
                    <div class="cardLine"><span class="bold">Parking Available: </span>${
                      parking ? "Yes" : "No"
                    }</div>
                    <div class="cardLine"><span class="bold">Transit Nearby: </span>${
                      transit ? "Yes" : "No"
                    }</div>
                    <div class="cardLine"><span class="bold">Office Square Feet: </span>${sqFeet} ft<sup>2</sup></div>
                </div>
                <div class="cardGroup">
                    <div class="cardLine"><span class="bold">Type: </span>${type}</div>
                    <div class="cardLine"><span class="bold">Max Occupancy: </span>${occ}</div>
                    <div class="cardLine"><span class="bold">Rental Term: </span>${term}</div>
                    <div class="cardLine"><span class="bold">Smoking Allowed: </span
                      >${smoke ? "Yes" : "No"}</div
                    >
                    <div class="cardLine"><span class="bold">Available on: </span
                      >${availDate.slice(0, 10)}</div
                    >
                    <div class="cardLine"><span class="bold">Price: </span
                      >$${Number.parseFloat(price).toFixed(2)}</div
                    >
                </div>
                <div class="cardGroup">
                    <div class="cardLine"><button class="btn" id="${owner}" onclick="ShowOwnerInfo(this.id);"
                    >Contact Owner</button></span></div>
                </div>
            </div>`;
  });
  container.innerHTML = cards;
  /* For adding average workspace ratings**
  <div class="cardLine"><span class="bold">Average Rating: </span>4.3</div>
                    <div class="cardLine"><span class="bold">My Rating: </span>
                        <select>
                            <option value="0">...</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
  */
};

/* FirstLoadWorkTable - run on load of coworkerShow, sets availWorkspaces
 *                      then populates the table
 */
const FirstLoadWorkTable = async () => {
  //
  await SaveAvailWorkspaces();
  PopulateWorkTable("availWorkspaces");
};

/* InsertFilterInput - Dynamically changes the filterTerm input depending
 *                     on the filterBy selection
 */
const InsertFilterInput = () => {
  const filSelect = document.querySelector("#filterBy");
  const insertPoint = document.querySelector("#filterTermInput");
  let insertInput;
  if (filSelect.options[filSelect.selectedIndex].value === "none") {
    insertInput = `<label for="filterTerm">Filter Term: </label>
            <input type="text" id="filterTerm" disabled />`;
  }

  if (
    filSelect.options[filSelect.selectedIndex].value === "address" ||
    filSelect.options[filSelect.selectedIndex].value === "neighbor"
  ) {
    insertInput = `<label for="filterTerm">Filter Term: </label>
                <input type="text" id="filterTerm" required maxlength="100" />`;
  }

  if (filSelect.options[filSelect.selectedIndex].value === "type") {
    insertInput = `<label for="filterTerm">Filter Type: </label>
          <select name="filterTerm" id="filterTerm">
            <option value="meet">Meeting Room</option>
            <option value="office">Private Office</option>
            <option value="desk">Open Area Desk</option>
          </select>`;
  }

  if (
    filSelect.options[filSelect.selectedIndex].value === "occ" ||
    filSelect.options[filSelect.selectedIndex].value === "sqFeet" ||
    filSelect.options[filSelect.selectedIndex].value === "price"
  ) {
    insertInput = `<label for="filterTerm">Filter Term: </label>
            <input type="number" id="filterTerm" required min="1" />`;
  }

  if (filSelect.options[filSelect.selectedIndex].value === "term") {
    insertInput = `<label for="filterTerm">Term: </label>
          <select name="filterTerm" id="filterTerm">
            <option value="day">1 Day</option>
            <option value="week">1 Week</option>
            <option value="month">1 Month</option>
          </select>`;
  }

  if (filSelect.options[filSelect.selectedIndex].value === "availDate") {
    insertInput = `<label for="filterTerm">This Date: </label>
          <input type="date" id="filterTerm" required />`;
  }

  if (
    filSelect.options[filSelect.selectedIndex].value === "parking" ||
    filSelect.options[filSelect.selectedIndex].value === "smoke" ||
    filSelect.options[filSelect.selectedIndex].value === "transit"
  ) {
    insertInput = `Select:
        <label for="filterTermYes"
          >Yes
          <input
            type="radio"
            class="radio"
            id="filterTermYes"
            name="filterTerm"
            checked
        /></label>
        <label for="filterTermNo"
          >No 
          <input 
            type="radio" 
            class="radio" 
            id="filterTermNo" 
            name="filterTerm"
        /></label>`;
  }

  insertPoint.innerHTML = insertInput;
};

/* FilterReady - Gets the selected filerBy and filerTerm, then
 *      feeds that to the Filter function
 */
const FilterReady = () => {
  document.querySelector("#noWorkspaces").innerHTML = "";
  //get filterBy and filterTerm from DOM
  const filSelect = document.querySelector("#filterBy");
  const filterBy = filSelect.options[filSelect.selectedIndex].value;

  let filterInput;
  //input box only filterBy options
  if (
    filterBy === "address" ||
    filterBy === "neighbor" ||
    filterBy === "occ" ||
    filterBy === "price" ||
    filterBy === "sqFeet" ||
    filterBy === "availDate"
  ) {
    filterInput = document.querySelector("#filterTerm").value;
  }
  //select list filterBy options
  if (filterBy === "type" || filterBy === "term") {
    let filSelect = document.querySelector("#filterTerm");
    filterInput = filSelect.options[filSelect.selectedIndex].value;
  }

  if (
    filterBy === "parking" ||
    filterBy === "smoke" ||
    filterBy === "transit"
  ) {
    document.querySelector("#filterTermYes").checked
      ? (filterInput = true)
      : (filterInput = false);
  }

  //run the filter
  Filter(filterBy, filterInput);
};

/* Filter - Filters the workspace table by a column and term then updates the table
 *    @Params - filterBy: the column to filter
 *              filterInput: the term/input to filter for
 */
const Filter = (filterBy, filterInput) => {
  //retrieve availWorkspaces from sessionStorage
  const originalData = JSON.parse(sessionStorage.getItem("availWorkspaces"));
  let filteredData;

  if (filterBy === "none") {
    filteredData = originalData;
  } else if (
    filterBy === "parking" ||
    filterBy === "smoke" ||
    filterBy === "transit"
  ) {
    filteredData = originalData.filter((e) => e[filterBy] === filterInput);
  } else if (
    filterBy === "sqFeet" ||
    filterBy === "occ" ||
    filterBy === "price"
  ) {
    filteredData = originalData.filter(
      (e) => Number.parseFloat(e[filterBy]) === Number.parseFloat(filterInput)
    );
  } else {
    filteredData = originalData.filter((e) =>
      e[filterBy].toLowerCase().includes(filterInput.toLowerCase())
    );
  }

  //store filtered data in displayWorkspaces
  sessionStorage.setItem("displayWorkspaces", JSON.stringify(filteredData));
  //display the filtered data
  PopulateWorkTable("displayWorkspaces");
};

/* Sort - Sorts the workspaces being displayed in the table by a column
 *    @Params - sortBy: the column to sort by
 *            - order: either ascending or descending
 */
const Sort = (order) => {
  const sortSelect = document.querySelector("#sortBy");
  const sortBy = sortSelect.options[sortSelect.selectedIndex].value;
  let currentDisplay = JSON.parse(sessionStorage.getItem("displayWorkspaces"));
  if (order === "asc") {
    if (
      sortBy === "address" ||
      sortBy === "neighbor" ||
      sortBy === "type" ||
      sortBy === "term" ||
      sortBy === "availDate"
    ) {
      currentDisplay.sort((a, b) => {
        if (a[sortBy] > b[sortBy]) return 1;
        else if (a[sortBy] < b[sortBy]) return -1;
        else return 0;
      });
    }

    if (sortBy === "parking" || sortBy === "smoke" || sortBy === "transit") {
      currentDisplay.sort((a, b) => {
        if (a[sortBy] && !b[sortBy]) return 1;
        else if (!a[sortBy] && b[sortBy]) return -1;
        else return 0;
      });
    }

    if (sortBy === "occ" || sortBy === "sqFeet" || sortBy === "price") {
      currentDisplay.sort((a, b) => {
        if (parseFloat(a[sortBy]) > parseFloat(b[sortBy])) return 1;
        else if (parseFloat(a[sortBy]) < parseFloat(b[sortBy])) return -1;
        else return 0;
      });
    }
  }
  //order === "desc"
  else {
    if (
      sortBy === "address" ||
      sortBy === "neighbor" ||
      sortBy === "type" ||
      sortBy === "term" ||
      sortBy === "availDate"
    ) {
      currentDisplay.sort((a, b) => {
        if (a[sortBy] > b[sortBy]) return -1;
        else if (a[sortBy] < b[sortBy]) return 1;
        else return 0;
      });
    }

    if (sortBy === "parking" || sortBy === "smoke" || sortBy === "transit") {
      currentDisplay.sort((a, b) => {
        if (a[sortBy] && !b[sortBy]) return -1;
        else if (!a[sortBy] && b[sortBy]) return 1;
        else return 0;
      });
    }

    if (sortBy === "occ" || sortBy === "sqFeet" || sortBy === "price") {
      currentDisplay.sort((a, b) => {
        if (parseFloat(a[sortBy]) > parseFloat(b[sortBy])) return -1;
        else if (parseFloat(a[sortBy]) < parseFloat(b[sortBy])) return 1;
        else return 0;
      });
    }
  }
  sessionStorage.setItem("displayWorkspaces", JSON.stringify(currentDisplay));
  PopulateWorkTable("displayWorkspaces");
};

/* ShowOwnerInfo - Displays the owner contact info in a popUp
 *
 */
const ShowOwnerInfo = async (userId) => {
  document.querySelector("#popUp").classList.remove("popUpHide");
  const popUpMsg = document.querySelector("#popMsg");
  const sessId = sessionStorage.getItem("sessId");
  const fetchRes = await getFetch(`/api/user/${userId}/${sessId}`);
  if (!fetchRes.success) {
    if (fetchRes.msg == "expiredSess") document.location = "/expired";
    console.log(fetchRes.msg);
  } else {
    //update sessId
    sessionStorage.setItem("sessId", fetchRes.newSessId);
    const user = fetchRes.user[0];
    const info = `Owner: ${user.firstName} ${user.lastName}\n
                  Phone: ${user.phone}\n
                  Email: ${user.email}`;
    popUpMsg.innerText = info;
  }
};

const backToMenu = () => {
  const userType = sessionStorage.getItem("userType");
  if (userType === "Owner")
    document.querySelector("#availBack").innerHTML =
      "<a href='/ownerMenu'>Back to Main Menu</a>";
};
backToMenu();
//call formListener from general.js
FormListener("#filterForm", FilterReady);
