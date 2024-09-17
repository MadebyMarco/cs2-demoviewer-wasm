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
    e.data.fileBytes,
    [
      "X",
      "Y",
      "health",
      "balance",
      "team_num",
      "is_alive",
      "yaw",
      "is_player_fire_event_primary",
      "fire_seq_start_time",
      "next_primary_attack_tick",
      "active_weapon_name",
      "active_weapon_ammo",
      "total_ammo_left",
      "game_time",
    ],
    undefined,
    undefined,
    true
  );

  let resultGrenades = parseGrenades(e.data.fileBytes);
  postMessage([result, resultGrenades]);
};
