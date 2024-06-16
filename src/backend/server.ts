import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: "/messages/",
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const port = 3000;

interface Banco {
  id: number;
  message: string;
  createdAt: Date;
}

const pseudoBanco: Banco[] = [];
let id = 0;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  socket.emit("enter", pseudoBanco);

  socket.on("message", (data) => {
    console.log(data);
    pseudoBanco.push({
      message: data,
      createdAt: new Date(),
      id,
    });
    id += 1;
  });
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
