let demoData;
let grenadeData;
const playerInfo = {};
async function run_wasm() {
  // Load the Wasm file by awaiting the Promise returned by `wasm_bindgen`
  // `wasm_bindgen` was imported in `index.html`
  await wasm_bindgen("./pkg/demoparser2_bg.wasm");
  // Create a worker in JS. The worker also uses Rust functions
  var myWorker = new Worker("./worker.js");

  document.getElementById("file_picker").addEventListener(
    "change",
    function () {
      const reader = new FileReader();
      reader.onload = function (event) {
        const uint8Array = new Uint8Array(event.target.result);
        myWorker.postMessage({ fileBytes: uint8Array });
        myWorker.onmessage = function (e) {
          demoData = e.data[0];
          grenadeData = e.data[1];
          headerData = e.data[2];
          eventData = e.data[3];
          console.log(demoData);
          assignPlayers(demoData);
          console.log(playerInfo);
          updatePlayerInfoAtTick(demoData);
          // Need to get header info so I can show rounds, and calc scale based on map
          console.log(playerInfo);
          renderCanvas();
          document.getElementById("play").addEventListener("click", play);
          document.getElementById("pause").addEventListener("click", pause);
        };
      };
      reader.readAsArrayBuffer(this.files[0]);
    },
    false
  );
}
run_wasm();

function assignPlayers(demoData) {
  for (let i = 0; i < 10; i++) {
    const pendingTeamNum = demoData.get("team_num")[i];
    let rgbColor = `rgb(15,0,255)`;
    let rgbStrokeColor = `rgb(9, 0, 155)`;
    if (pendingTeamNum == 2) {
      rgbColor = `rgb(255, 164, 0)`;
      rgbStrokeColor = `rgb(217, 140, 0)`;
    }
    const deadColor = `rgb(220,220,220)`;

    playerInfo[demoData.get("name")[i]] = {
      rgbColor: rgbColor,
      rgbStrokeColor: rgbStrokeColor,
      deadColor,
    };
  }
}

function updatePlayerInfoAtTick(demoData, tickStart = 0) {
  for (let i = tickStart * 10; i < tickStart * 10 + 10; i++) {
    const name = demoData.get("name")[i];
    // const X = demoData.get("X")[i];
    // const Y = demoData.get("Y")[i];
    // const health = demoData.get("health")[i];
    // const isAlive = demoData.get("is_alive")[i];
    // playerInfo[name].X = X;
    // playerInfo[name].Y = Y;
    // playerInfo[name].health = health;
    // playerInfo[name].isAlive = isAlive;

    // automates this above process
    // data is an array with [name of data, dataset itself]
    for (const data of demoData) {
      playerInfo[name][data[0]] = data[1][i];
    }
  }
}

function renderCanvas() {
  document.getElementById("wrapper").remove();
  document.body.innerHTML = `
<svg id="ctSideInfo" height="500" width="320">
 <text class="medium" x="0" y="35">Player Name</text>
 <rect width="320" height="30" style="fill:rgb(0,0,0);" y="40"/>
 <rect width="300" height="10" style="fill:rgb(128,128,128);" y="50" x="10" />
 <rect width="210" height="10" style="fill:rgb(255,255,255);" y="50" x="10" />
 
 <text class="medium" x="0" y="95">Player Name</text>
 <rect width="320" height="30" style="fill:rgb(0,0,0);" y="100"/>
 <rect width="300" height="10" style="fill:rgb(128,128,128);" y="110" x="10" />
 <rect width="210" height="10" style="fill:rgb(255,255,255);" y="110" x="10" />
 
 <text class="medium" x="0" y="155">Player Name</text>
 <rect width="320" height="30" style="fill:rgb(0,0,0);" y="160"/>
 <rect width="300" height="10" style="fill:rgb(128,128,128);" y="170" x="10" />
 <rect width="210" height="10" style="fill:rgb(255,255,255);" y="170" x="10" />
 
 <text class="medium" x="0" y="215">Player Name</text>
 <rect width="320" height="30" style="fill:rgb(0,0,0);" y="220"/>
 <rect width="300" height="10" style="fill:rgb(128,128,128);" y="230" x="10" />
 <rect width="210" height="10" style="fill:rgb(255,255,255);" y="230" x="10" />
 
 <text class="medium" x="0" y="275">Player Name</text>
 <rect width="320" height="30" style="fill:rgb(0,0,0);" y="280"/>
 <rect width="300" height="10" style="fill:rgb(128,128,128);" y="290" x="10" />
 <rect width="210" height="10" style="fill:rgb(255,255,255);" y="290" x="10" />
 
</svg>
  
  
  <canvas id="canvas"></canvas>
  <canvas id="grenadeCanvas"></canvas>

<svg id="tSideInfo" height="500" width="320">
 <text class="medium" x="0" y="35">Player Name</text>
 <rect width="320" height="30" style="fill:rgb(0,0,0);" y="40"/>
 <rect width="300" height="10" style="fill:rgb(128,128,128);" y="50" x="10" />
 <rect width="210" height="10" style="fill:rgb(255,255,255);" y="50" x="10" />
 
 <text class="medium" x="0" y="95">Player Name</text>
 <rect width="320" height="30" style="fill:rgb(0,0,0);" y="100"/>
 <rect width="300" height="10" style="fill:rgb(128,128,128);" y="110" x="10" />
 <rect width="210" height="10" style="fill:rgb(255,255,255);" y="110" x="10" />
 
 <text class="medium" x="0" y="155">Player Name</text>
 <rect width="320" height="30" style="fill:rgb(0,0,0);" y="160"/>
 <rect width="300" height="10" style="fill:rgb(128,128,128);" y="170" x="10" />
 <rect width="210" height="10" style="fill:rgb(255,255,255);" y="170" x="10" />
 
 <text class="medium" x="0" y="215">Player Name</text>
 <rect width="320" height="30" style="fill:rgb(0,0,0);" y="220"/>
 <rect width="300" height="10" style="fill:rgb(128,128,128);" y="230" x="10" />
 <rect width="210" height="10" style="fill:rgb(255,255,255);" y="230" x="10" />
 
 <text class="medium" x="0" y="275">Player Name</text>
 <rect width="320" height="30" style="fill:rgb(0,0,0);" y="280"/>
 <rect width="300" height="10" style="fill:rgb(128,128,128);" y="290" x="10" />
 <rect width="210" height="10" style="fill:rgb(255,255,255);" y="290" x="10" />
 
</svg>

  <div class="buttons">
    <button id="play">Play</button>
    <button id="pause">Pause</button>
</div>
    `;
  const grenadeCanvas = document.getElementById("grenadeCanvas");
  canvas.width = 1200;
  canvas.height = 900;
  grenadeCanvas.width = canvas.width;
  grenadeCanvas.height = canvas.height;
}

function getScaledCoordinates(player) {
  const negativeMapWidthX = 2300.97;
  const negativeMapHeightY = 2531.07;
  const totalMapWidthX = 1395.97 + 2300.97;
  const totalMapHeightY = 4303.04;
  const scaleX = 1200 / totalMapWidthX;
  const scaleY = 900 / totalMapHeightY;
  // these should be calculated elsewhere but here for now
  let playerX;
  let playerY;

  playerX = player.X + negativeMapWidthX;

  playerY = player.Y + negativeMapHeightY;

  playerX = playerX * scaleX;
  playerY = 900 - playerY * scaleY;

  return { X: playerX, Y: playerY };
}

// potentially go through x and Y and scale each coordinate

function renderPlayerAtPosition(playerInfo = { X: 0, Y: 0 }, name = "") {
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  const scaledCoordinates = getScaledCoordinates(playerInfo);
  ctx.beginPath();
  ctx.font = "10px helvetica";
  ctx.fillStyle = playerInfo.rgbColor;
  ctx.strokeStyle = playerInfo.rgbStrokeColor;
  if (!playerInfo.is_alive) {
    ctx.fillStyle = playerInfo.deadColor;
    ctx.strokeStyle = playerInfo.deadColor;
  }
  ctx.fillText(
    name,
    scaledCoordinates.X - name.length * 2,
    scaledCoordinates.Y - 15
  );
  ctx.arc(scaledCoordinates.X, scaledCoordinates.Y, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
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

let tick = 0;
let intervalID;
let demoTickDelay = 1000 / 60;
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
      // tick = tick + 10, this is a problem because the tick is increasing by 10, when its really at tick 1.
      // the solution is to add 10 to tick at updatePlayerInfoAtTick itself
      tick = tick + 1;
    }, demoTickDelay);
  }
}
function pause() {
  clearInterval(intervalID);
  intervalID = null;
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
