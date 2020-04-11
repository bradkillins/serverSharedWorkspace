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

/* SaveAvailWorkspaces - Builds an array of all available workspaces
 *               and saves it as "availWorkspaces" in sessionStorage
 */
const SaveAvailWorkspaces = () => {
  //retrieve properties
  const properties = JSON.parse(localStorage.getItem("properties"));
  let availProps = properties.filter((e) => e.listed);
  let availWork = [];
  availProps.forEach((prop) => {
    prop.workspace.forEach((work) => {
      if (work.listed) {
        work.address = prop.address;
        work.neighbor = prop.neighbor;
        work.sqFeet = prop.sqFeet;
        work.parking = prop.parking;
        work.transit = prop.transit;
        work.owner = prop.owner;
        availWork.push(work);
      }
    });
  });
  sessionStorage.setItem("availWorkspaces", JSON.stringify(availWork));
  sessionStorage.setItem("displayWorkspaces", JSON.stringify(availWork));
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

  const table = document.querySelector("#availWorkTable");
  let body =
    //table headers
    `<tbody>
              <tr>
                  <th>
                      Address<button onclick="Sort('address', 'asc');">&uarr;</button
                      ><button onclick="Sort('address', 'des');">&darr;</button>
                  </th>
                  <th>
                      Neighborhood<button onclick="Sort('neighbor', 'asc');">&uarr;</button
                      ><button onclick="Sort('neighbor', 'des');">&darr;</button>
                  </th>
                  <th>
                      Type<button onclick="Sort('type', 'asc');">&uarr;</button
                      ><button onclick="Sort('type', 'des');">&darr;</button>
                  </th>
                  <th>
                      Occupancy<button onclick="Sort('occ', 'asc');">&uarr;</button
                      ><button onclick="Sort('occ', 'des');">&darr;</button>
                  </th>
                  <th>
                      SqFeet<button onclick="Sort('sqFeet', 'asc');">&uarr;</button
                      ><button onclick="Sort('sqFeet', 'des');">&darr;</button>
                  </th>
                  <th>
                      Term<button onclick="Sort('term', 'asc');">&uarr;</button
                      ><button onclick="Sort('term', 'des');">&darr;</button>
                  </th>
                  <th>
                      Price<button onclick="Sort('price', 'asc');">&uarr;</button
                      ><button onclick="Sort('price', 'des');">&darr;</button>
                  </th>
                  <th>
                      Available Date<button onclick="Sort('availDate', 'asc');">&uarr;</button
                      ><button onclick="Sort('availDate', 'des');">&darr;</button>
                  </th>
                  <th>
                      Parking Garage<button onclick="Sort('parking', 'asc');">&uarr;</button
                      ><button onclick="Sort('parking', 'des');">&darr;</button>
                  </th>
                  <th>
                      Smoking<button onclick="Sort('smoke', 'asc');">&uarr;</button
                      ><button onclick="Sort('smoke', 'des');">&darr;</button>
                  </th>
                  <th>
                      Transit<button onclick="Sort('transit', 'asc');">&uarr;</button
                      ><button onclick="Sort('transit', 'des');">&darr;</button>
                  </th>
                  <th>Contact</th>
              </tr>
          </tbody>`;

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
    const owner = workspace.owner;

    if (type === "meet") type = "Meeting Room";
    if (type === "office") type = "Private Office";
    if (type === "desk") type = "Desk in Open Area";

    if (term === "day") term = "Day";
    if (term === "week") term = "Week";
    if (term === "month") term = "Month";

    body += `<tbody>
                      <tr>
                          <td>${address}</td>
                          <td>${neighbor}</td>
                          <td>${type}</td>
                          <td>${occ}</td>
                          <td>${sqFeet}</td>
                          <td>${term}</td>
                          <td>$${price}</td>
                          <td>${availDate}</td>
                          <td>${parking ? "Yes" : "No"}</td>
                          <td>${smoke ? "Yes" : "No"}</td>
                          <td>${transit ? "Yes" : "No"}</td>
                          <td><button id="${owner}" onclick="ShowOwnerInfo(this.id);">View</button></td>
                      </tr>
                  </tbody>`;
  });
  table.innerHTML = body;
};

/* FirstLoadWorkTable - run on load of coworkerShow, sets availWorkspaces
 *                      then populates the table
 */
const FirstLoadWorkTable = () => {
  //
  SaveAvailWorkspaces();
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
    filSelect.options[filSelect.selectedIndex].value === "sqFeet"
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
  console.log("filterBy = " + filterBy);
  console.log("filterInput = " + filterInput);
  let filteredData;

  if (filterBy === "none") {
    filteredData = originalData;
  } else if (
    filterBy === "parking" ||
    filterBy === "smoke" ||
    filterBy === "transit"
  ) {
    filteredData = originalData.filter((e) => e[filterBy] === filterInput);
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
const Sort = (sortBy, order) => {
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
  } else {
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
const ShowOwnerInfo = (email) => {
  document.querySelector("#popUp").classList.remove("popUpHide");
  const popUpMsg = document.querySelector("#popMsg");
  const users = JSON.parse(localStorage.getItem("users"));
  let owner;
  users.forEach((user) => {
    if (user.email === email) owner = user;
  });
  let info = `Owner: ${owner.fName} ${owner.lName}\n
                  Phone: ${owner.phone}\n
                  Email: ${owner.email}`;
  popUpMsg.innerText = info;
};

//call formListener from general.js
FormListener("#filterForm", FilterReady);
