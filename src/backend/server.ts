import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
  }),
);
app.use(express.json());
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
interface Usuario {
  id: number;
  nome: string;
  sala: string;
}

const pseudoBancoUsuario: Usuario[] = [];
let id = 0;
let idUsuario = 0;

app.post("/entrar", (req, res) => {
  const { sala, nome } = req.body || {};

  console.log("sala: ", sala);
  console.log("nome: ", nome);

  //TODO: fazer uma validação mais seria que isso
  if (!sala || !nome) {
    res.send({ error: "Dados invalidos para entrar" });
  }

  let usuario = pseudoBancoUsuario.find(
    ({ nome: nomeUsuario, sala: salaUsuario }) =>
      nomeUsuario === nome && salaUsuario === sala,
  );

  if (!usuario) {
    usuario = {
      id: idUsuario,
      nome,
      sala,
    };
    idUsuario += 1;
    pseudoBancoUsuario.push(usuario);
  }

  return res.send(usuario);
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
