const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let turnoActual = 1;
let numSala = Math.floor(Math.random() * 10) + 1;


io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Enviar el turno actual al nuevo cliente
  socket.emit("turnoUpdate", turnoActual, numSala);

  // Escuchar cuando un cliente solicite el siguiente turno
  socket.on("siguienteTurno", () => {
    turnoActual++;
    numSala = Math.floor(Math.random() * 10) + 1;
    io.emit("turnoUpdate", turnoActual, numSala);
  });

  socket.on("reiniciar", () => {
    turnoActual = 1;
    numSala = Math.floor(Math.random() * 10) + 1;
    io.emit("turnoUpdate", turnoActual, numSala);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/cliente/index.html");
});

server.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
