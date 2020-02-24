var x,
  y,
  change,
  canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d");
const socket = io();
socket.on("connect", function() {});
do {
  name = prompt("Digite o seu name:");
} while (name == null || name == "");
socket.emit("name", name);
socket.on("init", allsubmits => {
  console.log(allsubmits.length); //Draw all changes
  for (x = 0; x < allsubmits.length; x++) {
    ctx.fillStyle = allsubmits[x].color;
    ctx.fillRect(
      allsubmits[x].x,
      allsubmits[x].y,
      allsubmits[x].tam,
      allsubmits[x].tam
    );
  }
});
function Mandar(mv) {
  change = {
    tam:
      document.getElementById("tam").value > 30 //Limit brush size in 30
        ? (document.getElementById("tam").value = 30)
        : document.getElementById("tam").value,
    x: Math.round(mv.offsetX - this.tam.value * 0.5),
    y: Math.round(mv.offsetY - this.tam.value * 0.5),
    color: document.getElementById("cor").value
  };
  ctx.fillStyle = change.color;
  ctx.fillRect(change.x, change.y, change.tam, change.tam); //Draw the changes made by me
  socket.emit("client", change);
}
canvas.addEventListener("mousemove", function(mv) {
  if (mv.buttons == 1) Mandar(mv);
});
canvas.addEventListener("touchmove", function(tm) {
  if (tm.touches.length == 1) Mandar(tm.touches[0]);
});
socket.on("att", att => {
  //Receive and draw live changes from other players
  ctx.fillStyle = att.color;
  ctx.fillRect(att.x, att.y, att.tam, att.tam);
});
function brush() {
  document.getElementById("tam").value = 5;
  document.getElementById("cor").value = "#000000";
}
function eraser() {
  document.getElementById("tam").value = 30;
  document.getElementById("cor").value = "#ffffff";
}
