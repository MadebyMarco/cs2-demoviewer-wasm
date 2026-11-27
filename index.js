let demoData;
let grenadeData;
let tick = 0;
let intervalID;
let demoTickDelay = 1000 / 60;

const playerInfo = {};
const tSideNum = 2;
const ctSideNum = 3;

const Colors = {
    tSide: "rgb(255, 164, 0)",
    tSideOutline: "rgb(217, 140, 0)",
    ctSide: "rgb(15,0,255)",
    ctSideOutline: "rgb(9, 0, 155)",
    dead: "rgb(220,220,220)",
    firing: "rgb(255, 207, 151)",
    defusing: "rgb(219, 44, 181)",
  }
 
async function run_wasm() {
  // Load the Wasm file by awaiting the Promise returned by `wasm_bindgen`
  // `wasm_bindgen` was imported in `index.html`
  await wasm_bindgen("./pkg/demoparser2_bg.wasm");
  // Create a worker in JS. The worker also uses Rust functions
  var myWorker = new Worker("./worker.js");
  // Instantly Load Demo of 2D demo
  const demo = await fetch("./resources/complexity-vs-boss-ancient.dem");
  const arrayBuffer = await demo.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  myWorker.postMessage({ fileBytes: uint8Array });
  myWorker.onmessage = (file) => {
    initalizeDemoViewer(file);
  }

// For picking files of your own
//   document.getElementById("file_picker").addEventListener(
//     "change",
//     function () {
//       const reader = new FileReader();
//       reader.onload = function (event) {
//         const uint8Array = new Uint8Array(event.target.result);
//         myWorker.postMessage({ fileBytes: uint8Array });
//         myWorker.onmessage = function (e) {
//           initalizeDemoViewer(e);
//         };
//       };
//       reader.readAsArrayBuffer(this.files[0]);
//     },
//     false
//   );
}
run_wasm();

function initalizeDemoViewer(e) {
  demoData = e.data[0];
  grenadeData = e.data[1];
  console.log(demoData);
  console.log(grenadeData);
  console.log(e);
  console.log(playerInfo);
  initializePlayerInfo(demoData);
  updatePlayerInfoAtTick(demoData, tick);
  // Need to get header info so I can show rounds, and calc scale based on map
  renderCanvas();
  updatePlayerHUDS(playerInfo);
  document.getElementById("play").addEventListener("click", play);
  document.getElementById("pause").addEventListener("click", pause);
  document.getElementById("seek-bar").addEventListener("input",seekBar);
}

// assign color at tick render based off player team num but not when assigning once like this
function initializePlayerInfo(demoData) {
  for (let i = 0; i < 10; i++) {
    playerInfo[demoData.get("name")[i]] = {};
  }
}

function updatePlayerInfoAtTick(demoData, tickStart = 0) {
  for (let i = tickStart * 10; i < tickStart * 10 + 10; i++) {
    const name = demoData.get("name")[i];
    for (const data of demoData) {
      //what is data 0 and data 1 doing?
      playerInfo[name][data[0]] = data[1][i];
    }
  }
}

function renderCanvas() {
  document.getElementById("wrapper").remove();
  
  document.body.innerHTML = `


<div id="ctSideInfo" height="500" width="320">
  <div class = "playerHUD">
    <P class="medium name"> Player Name</P>  
    <div class="health-background"></div>
    <div class="health-bar"></div>
    <div class="armor-bar"></div>
    <div class="weapon"></div>
    <div class="ammo"></div>
    <div class="grenade-belt"></div>
    <div class="balance"></div>
  </div>

  <div class = "playerHUD">
    <P class="medium name"> Player Name</P>  
    <div class="health-background"></div>
    <div class="health-bar"></div>
    <div class="armor-bar"></div>
    <div class="weapon"></div>
    <div class="ammo"></div>
    <div class="grenade-belt"></div>
    <div class="balance"></div>
  </div>

  <div class = "playerHUD">
    <P class="medium name"> Player Name</P>  
    <div class="health-background"></div>
    <div class="health-bar"></div>
    <div class="armor-bar"></div>
    <div class="weapon"></div>
    <div class="ammo"></div>
    <div class="grenade-belt"></div>
    <div class="balance"></div>
  </div>


  <div class = "playerHUD">
    <P class="medium name"> Player Name</P>  
    <div class="health-background"></div>
    <div class="health-bar"></div>
    <div class="armor-bar"></div>
    <div class="weapon"></div>
    <div class="ammo"></div>
    <div class="grenade-belt"></div>
    <div class="balance"></div>
  </div>

  <div class = "playerHUD">
    <P class="medium name"> Player Name</P>  
    <div class="health-background"></div>
    <div class="health-bar"></div>
    <div class="armor-bar"></div>
    <div class="weapon"></div>
    <div class="ammo"></div>
    <div class="grenade-belt"></div>
    <div class="balance"></div>
  </div>
</div>
  
  <div class="match-info">
  <div class="death-announcement"></div>
  <div class="round-timer"></div>
  <div class="round-counter"></div>
</div>
  <canvas id="canvas"></canvas>
  <canvas id="grenadeCanvas"></canvas>

<div id="tSideInfo" height="500" width="320">
   <div class = "playerHUD">
    <P class="medium name"> Player Name</P>  
    <div class="health-background"></div>
    <div class="health-bar"></div>
    <div class="armor-bar"></div>
    <div class="weapon"></div>
    <div class="ammo"></div>
    <div class="grenade-belt"></div>
    <div class="balance"></div>
  </div>

  <div class = "playerHUD">
    <P class="medium name"> Player Name</P>  
    <div class="health-background"></div>
    <div class="health-bar"></div>
    <div class="armor-bar"></div>
    <div class="weapon"></div>
    <div class="ammo"></div>
    <div class="grenade-belt"></div>
    <div class="balance"></div>
  </div>

  <div class = "playerHUD">
    <P class="medium name"> Player Name</P>  
    <div class="health-background"></div>
    <div class="health-bar"></div>
    <div class="armor-bar"></div>
    <div class="weapon"></div>
    <div class="ammo"></div>
    <div class="grenade-belt"></div>
    <div class="balance"></div>
  </div>


  <div class = "playerHUD">
    <P class="medium name"> Player Name</P>  
    <div class="health-background"></div>
    <div class="health-bar"></div>
    <div class="armor-bar"></div>
    <div class="weapon"></div>
    <div class="ammo"></div>
    <div class="grenade-belt"></div>
    <div class="balance"></div>
  </div>

  <div class = "playerHUD">
    <P class="medium name"> Player Name</P>  
    <div class="health-background"></div>
    <div class="health-bar"></div>
    <div class="armor-bar"></div>
    <div class="weapon"></div>
    <div class="ammo"></div>
    <div class="grenade-belt"></div>
    <div class="balance"></div>
  </div>
</div>

  <div class="buttons">
    <button id="play">Play</button>
    <button id="pause">Pause</button>
</div>

<div class ="play-slider">
<input id ="seek-bar" type="range" min="0" max=${demoData.get("tick")[demoData.get("tick").length - 1]} value="0">
</div>
    `;
  const grenadeCanvas = document.getElementById("grenadeCanvas");
  const canvas = document.getElementById("canvas");
  canvas.width = 1200;
  canvas.height = 900;
  grenadeCanvas.width = canvas.width;
  grenadeCanvas.height = canvas.height;
}

function assignPlayerHUDS(players) {
  const ctHUDS = document.getElementById("ctSideInfo").querySelectorAll(".playerHUD");
  const tHUDS = document.getElementById("tSideInfo").querySelectorAll(".playerHUD");
  let ctCounter = 0;
  let tCounter = 0;
  for (const player in players) {
    if(players[player].team_num == tSideNum) {
      tHUDS[tCounter].id = player;
      tHUDS[tCounter].firstElementChild.textContent = player;
      players[player].HUD = tHUDS[tCounter];
      tCounter++;
      continue;
    }
    ctHUDS[ctCounter].id = player;
    ctHUDS[ctCounter].firstElementChild.textContent = player;
    players[player].HUD = ctHUDS[ctCounter];
    ctCounter++;
  }
}


function updatePlayerHUDS(player) {
  const [,,healthBar,ArmorBar, weapon, ammo, grenades, balance] = player.HUD.children; //update players info
  healthBar.style.width = `${player.health}%`;
  ArmorBar.style.width = `${player.armor_value}%`;
  // grenades.textContent = `${player.inventory.toString()}`
  // weapon.textContent = player.active_weapon_name;
  // ammo.textContent = `${player.active_weapon_ammo} / ${player.total_ammo_left}`;
  balance.textContent = `${player.balance}`;
}


// x, y, map obj, canvas x, canvas y
function getScaledCoordinates(player) {
  const negativeMapWidthX = 2300.97;
  const negativeMapHeightY = 2531.07;
  const totalMapWidthX = 1395.97 + 2300.97;
  const totalMapHeightY = 4303.04;
  // const scaleX = 1200 / totalMapWidthX;
  // const scaleY = 900 / totalMapHeightY;
  const canvas = document.getElementById("canvas");
  const scaleX = canvas.width / totalMapWidthX;
  const scaleY = canvas.height / totalMapHeightY;
  // these should be calculated elsewhere but here for now
  let playerX;
  let playerY;

  playerX = player.X + negativeMapWidthX;

  playerY = player.Y + negativeMapHeightY;

  playerX = playerX * scaleX;
  playerY = canvas.height - playerY * scaleY;

  return { X: playerX, Y: playerY };
}

// potentially go through x and Y and scale each coordinate

function renderPlayerAtPosition(player = { X: 0, Y: 0 }) {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  const scaledCoordinates = getScaledCoordinates(player);
  const radius = 10;
  ctx.beginPath();
  ctx.font = "10px helvetica";

  ctx.fillStyle = Colors.ctSide;
  ctx.strokeStyle = Colors.ctSideOutline;

  if (player.team_num == tSideNum) {
    ctx.fillStyle = Colors.tSide;
    ctx.strokeStyle = Colors.tSideOutline;
  }

  if (!player.is_alive) {
    ctx.fillStyle = Colors.dead;
  }

  if(player.is_defusing == true) ctx.fillStyle = Colors.defusing;

  ctx.fillText(
    player.name,
    scaledCoordinates.X - player.name.length * 2,
    scaledCoordinates.Y - 15
  );
  ctx.arc(scaledCoordinates.X, scaledCoordinates.Y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
  // Calculating coordinates on circle perimeter using yaw to show where people are looking 
  const theta = (player.yaw * -1) * Math.PI / 180;
  scaledCoordinates.aimingX = scaledCoordinates.X + radius * Math.cos(theta);
  scaledCoordinates.aimingY = scaledCoordinates.Y + radius * Math.sin(theta);
  ctx.beginPath();
  ctx.arc(scaledCoordinates.aimingX, scaledCoordinates.aimingY, radius * 0.30, 0, 2 * Math.PI);
  ctx.fillStyle = Colors.defusing;
  ctx.fill();
  // ***** Render List *****
  // firing
  // jumping
  // alive / dead
  // defusing
  // yaw / direction player is looking
}
let grenadeCounter = 0;
function renderGrenades(grenadeInfo) {
  if (grenadeInfo[grenadeCounter].tick != tick) return;
  console.log(grenadeInfo[grenadeCounter]);
  grenadeCounter++;
  // need to use the same scale for grenades
  // I want grenades to leave a trail when thrown that last for a second until they pop
  // I will achieve the trail design by comparing current x and y to next x and y, and if it is changing then I will make a trail until it is equal
  if (grenadeInfo[tick].x != grenadeInfo[tick + 1].x) {
    // draw a dash
  }
}


function play() {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  if (!intervalID) {
    intervalID = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      updatePlayerInfoAtTick(demoData, tick);
      renderGrenades(grenadeData);
      for (const player in playerInfo) {
        renderPlayerAtPosition(playerInfo[player], player);
      }
      tick = tick + 1;
    }, demoTickDelay);
  }
}
function pause() {
  clearInterval(intervalID);
  intervalID = null;
}

function seekBar() {
  tick = +document.getElementById("seek-bar").value;
}

function de_MAP(name, image, negativeX, positiveX, negativeY, positiveY) {
  const totalX = -1 * negativeX + positiveX;
  const totalY = -1 * negativeY + positiveY;

  return {
    name,
    image,
    negativeX,
    positiveX,
    negativeY,
    positiveY,
    totalY,
    totalX,
  };
}

const maps = {
  ancient: de_MAP(
    "ancient",
    "./Ancient_Radar_cropeed.jpg",
    -2300.97,
    1396.97,
    -2531.07,
    4303.04 - 2531.07
  ),
  mirage: de_MAP("mirage"),
};
console.log(maps);
