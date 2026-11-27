importScripts("./pkg/demoparser2.js");

const { parseTicks, parseEvents, parseGrenades, parseHeader } = wasm_bindgen;

// We compiled with `--target no-modules`, which does not create a module. The generated bindings
// can be loaded in web workers in all modern browsers.

async function run_in_worker() {
  // Load the Wasm file by awaiting the Promise returned by `wasm_bindgen`
  await wasm_bindgen("./pkg/demoparser2_bg.wasm");
  console.log(
    "worker.js has loaded Wasm file → Functions defined with Rust are now available"
  );
}

run_in_worker();

onmessage = async function (e) {
  let result = parseTicks(
    e.data.fileBytes, //file
    [
      "X",
      "Y",
      "health",
      "balance",
      "team_num",
      "is_alive",
      "yaw",
      "m_bPlayerFireEventIsPrimary",
      "is_defusing",
      "WEAPON",
      "weapon_name",
      "inventory",
      "has_helmet",
      "has_defuser",
      "active_weapon_name",
      "active_weapon_ammo",
      "total_ammo_left",
      "game_time",
      "armor_value",
      "flash_duration",

    ], //wanted props
    undefined, //wanted ticks
    undefined, //wanted players
    true // structure of array output, this outputs a map wi
  );

  let resultEvent = parseEvents(e.data.fileBytes,
     ["flashbang_detonate",
      "hegrenade_detonate",
      "smokegrenade_detonate",
      "smokegrenade_expired",
      "inferno_startburn",
      "inferno_expire",
      "weapon_fire",
      "player_death",
      "bomb_planted",
      "bomb_exploded",
      "bomb_dropped",
      "bomb_pickup",
      "round_freeze_end",
      "round_announce_match_start",
      "round_officially_ended",
      ]);

  

  let resultGrenades = parseGrenades(e.data.fileBytes, ["X", "Y","entityid", "ENTITYID"], false);
  let resultHeader = parseHeader(e.data.fileBytes);
  postMessage([result, resultGrenades, resultEvent, listGameEvents(e.data.fileBytes), listUpdatedFields(e.data.fileBytes),resultHeader]);
};
