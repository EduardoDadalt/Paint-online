const express = require("express");
const http = require("http");
const SocketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const sockets = SocketIO(server);
var x,
  lastchange = { x: 0, y: 1, color: "#fff", tam: 3 },
  clients = [],
  changes = [];
app.use(express.static("public"));
sockets.on("connection", socket => {
  socket.on("name", function(name) {
    var obj = { name: name, socket: socket.id };
    clients.push(obj);
    console.log(obj.name + " se conectou"); //Show on the console who connected
    console.log(clients);
  });

  socket.emit("init", changes);
  socket.on("client", clientchanges => {
    changes.push(clientchanges);
    lastchange = clientchanges;
    socket.broadcast.emit("att", lastchange);
  });
  socket.on("disconnect", function() {
    for (x = 0; x < clients.length; x++) {
      if (clients[x].socket.includes(socket.id)) {
        console.log(clients[x].name + " se desconectou"); //Show on the console who disconnected
        clients.splice(x, 1); //Delete the person who disconnected from the list
      }
    }
  });
});

setInterval(() => {
  console.log(clients); //Show all people what is connected in server
}, 1000 * 15);

server.listen(3000, () => {
  console.log("Server is open in 3000");
});
