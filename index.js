var globalArray;
var users;

var yearChoice = ``;
var yearList = [];
var successLaunchSwitch = document.querySelector(".success-launch-switch");
var uniqueArray;
var selectedYear = document.querySelector(".selected-year-btn");
var successLandSwitch = document.querySelector(".success-land-switch");

var landSuccess = sessionStorage.getItem("landSuccess");
var launchSuccess = sessionStorage.getItem("launchSuccess");
var year = sessionStorage.getItem("year");

// setting onload Values

landSuccess == null && sessionStorage.setItem("landSuccess", "");
launchSuccess == null && sessionStorage.setItem("launchSuccess", "");
year == null && sessionStorage.setItem("year", "");
landSuccess = sessionStorage.getItem("landSuccess");
launchSuccess = sessionStorage.getItem("launchSuccess");
year = sessionStorage.getItem("year");
if (year != null) {
  if (sessionStorage.getItem("year") == "") {
    selectedYear.innerHTML = "All";
  } else {
    selectedYear.innerHTML = sessionStorage.getItem("year");
  }
}
if (sessionStorage.getItem("launchSuccess") == "true") {
  successLaunchSwitch.checked = true;
}

if (sessionStorage.getItem("landSuccess") == "true") {
  successLandSwitch.checked = true;
}

async function globalURL() {
  try {
    let res = await fetch("https://api.spaceXdata.com/v3/launches?limit=100");
    globalArray = await res.json();
    for (i = 0; i < globalArray.length; i++) {
      yearList.push(globalArray[i].launch_year);
    }
  } catch (error) {
    console.log(error);
  }
}
globalURL();

var url = `https://api.spacexdata.com/v3/launches?limit=100&launch_success=${launchSuccess}&land_success=${landSuccess}&launch_year=${year}`;

function updateURL() {
  url = `https://api.spacexdata.com/v3/launches?limit=100&launch_success=${sessionStorage.getItem(
    "launchSuccess"
  )}&land_success=${sessionStorage.getItem(
    "landSuccess"
  )}&launch_year=${sessionStorage.getItem("year")}`;

  console.log(url);
}
successLaunchSwitch.addEventListener("change", () => {
  if (successLaunchSwitch.checked == true) {
    launchSuccess = "true";
  } else {
    launchSuccess = "";
  }

  sessionStorage.setItem("launchSuccess", launchSuccess);
  updateURL();

  renderUsers();
});
successLandSwitch.addEventListener("change", () => {
  if (successLandSwitch.checked == true) {
    landSuccess = "true";
  } else {
    landSuccess = "";
  }
  sessionStorage.setItem("landSuccess", landSuccess);
  updateURL();

  renderUsers();
});

function selectThis(event) {
  if (event.target.innerHTML === "All") {
    year = "";
  } else {
    year = event.target.innerHTML;
  }

  selectedYear.innerHTML = event.target.innerHTML;
  sessionStorage.setItem("year", year);
  updateURL();

  renderUsers();
}
async function getUsers() {
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}
async function renderUsers() {
  users = await getUsers();

  let html = "";
  users.forEach((user) => {
    let htmlSegment = `
                        
                      
 <div class="card user h-100" style="width: 18rem;border:1px solid black;margin:30px 0">
<a style="" target="_blank" href="${user.links.mission_patch}"><img class="card-img-top" src="${user.links.mission_patch_small}" alt="Card image cap"> </a>
  
 
  <ul class="list-group list-group-flush">
    <li class="list-group-item">Flight Number: ${user.flight_number} </li>
    <li class="list-group-item">Fligth Name: ${user.mission_name} </li>
    <li class="list-group-item">Rocket Name: ${user.rocket.rocket_name} </li>
    <li class="list-group-item">Rocket Type: ${user.rocket.rocket_type} </li>
    <li class="list-group-item">Rocket Type: ${user.rocket.second_stage.payloads[0].nationality} </li>
    <li class="list-group-item">🚀 Launch Year: ${user.launch_year} </li>
    <li class="list-group-item">Details: ${user.details} </li>
     
     
  </ul>
   <div class="card-body">
    <a target="_blank" href="${user.links.article_link}" class="card-link">Article</a>
    <a target="_blank" href="${user.links.wikipedia}" class="card-link">Wikipedia</a>
    <a target="_blank" href="${user.links.video_link}" class="card-link">Video</a>
   
    
  </div>
</div>
         `;

    html += htmlSegment;
  });

  let cardsContent = document.querySelector(".cards-content");
  cardsContent.innerHTML =
    `<div style="display:flex;flex-wrap: wrap;justify-content:space-evenly;"> ` +
    html +
    `</div>`;
}

setTimeout(() => {
  uniqueArray = [...new Set(yearList.map((event) => event))];

  uniqueArray.forEach((ele) => {
    yearChoice += `<li onclick="selectThis(event)"><a class="dropdown-item" href="#">${ele}</a></li>`;
  });
  console.log(yearChoice);
}, 2000);
setTimeout(() => {
  let optionList = document.querySelector(".dropdown-menu");
  optionList.innerHTML =
    `<li onclick="selectThis(event)"><a class="dropdown-item" href="#">All</a></li>` +
    yearChoice;
}, 3000);

renderUsers();
