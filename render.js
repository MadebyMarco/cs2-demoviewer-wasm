//code for drawing circles,
// draw image of map onto canvas and then use that to determine ct and T spawns for initial circle positions;
document.addEventListener("click", (e) => {
  if (e.target.id == "file_picker") {
    document.getElementById("wrapper").remove();
  }
  document.body.innerHTML = `<canvas id="canvas"></canvas>`;

  const canvas = document.querySelector("canvas");
  canvas.width = 1200;
  canvas.height = 900;
  const ctx = canvas.getContext("2d");
  const circlePosition = { x: 100, y: 75 };
  ctx.beginPath();
  ctx.arc(circlePosition.x, circlePosition.y, 10, 0, 2 * Math.PI);
  ctx.stroke();
});

function MoveCircleTo(x = 0, y = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(circlePosition.x, circlePosition.y, 25, 0, 2 * Math.PI);
  ctx.stroke();
}
