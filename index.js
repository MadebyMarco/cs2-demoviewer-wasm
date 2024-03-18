
async function run_wasm() {
    // Load the Wasm file by awaiting the Promise returned by `wasm_bindgen`
    // `wasm_bindgen` was imported in `index.html`
    await wasm_bindgen('./pkg/demoparser2_bg.wasm');
    // Create a worker in JS. The worker also uses Rust functions
    var myWorker = new Worker('./worker.js');
    document.getElementById("file_picker").addEventListener(
        "change",
        function () {
            const reader = new FileReader();
            reader.onload = function (event) {
                const uint8Array = new Uint8Array(event.target.result);
                myWorker.postMessage({ fileBytes: uint8Array});
                myWorker.onmessage = function (e) {
                    console.log(e.data)
                };               
            };
            reader.readAsArrayBuffer(this.files[0]);
        },
        false
    );
}
run_wasm();
