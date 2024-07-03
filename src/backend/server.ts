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
const pokerIo = new Server(httpServer, {
  path: "/poker/",
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const port = 3000;

interface UsuarioPoker {
  id: number;
  nome: string;
  sala: string;
  carta?: string;
}

let pseudoBancoUsuarioPoker: UsuarioPoker[] = [];
let idUsuarioPoker = 0;
let cartasAbertas = false;
let possibleCards = ["1", "2", "3", "5", "8", "13", "21"];

app.post("/entrar", (req, res) => {
  const { sala, nome } = req.body || {};

  //TODO: fazer uma validação mais seria que isso
  if (!sala || !nome) {
    res.send({ error: "Dados invalidos para entrar" });
  }

  let usuario = pseudoBancoUsuarioPoker.find(
    ({ nome: nomeUsuario, sala: salaUsuario }) =>
      nomeUsuario === nome && salaUsuario === sala,
  );

  if (!usuario) {
    usuario = {
      id: idUsuarioPoker,
      nome,
      sala,
    };
    idUsuarioPoker += 1;
    pseudoBancoUsuarioPoker.push(usuario);
  }

  return res.send(usuario);
});

//TODO: mover funções do poker para um arquivo especifico, porque ta começando a me incomodar
pokerIo.on("connection", (socket) => {
  //TODO: corrigir problema onde ao entrar jogadores antigos não veem o novo
  socket.emit("setCarta", pseudoBancoUsuarioPoker);
  socket.emit("setCartasPossiveis", possibleCards);
  pokerIo.emit("setCartasAbertas", cartasAbertas);

  socket.on("setCarta", (dados) => {
    const { id, nome, carta }: { id: number; nome: string; carta: string } =
      dados;

    const novoEstado = pseudoBancoUsuarioPoker.map((usuarioPoker) => {
      if (usuarioPoker.id === id && usuarioPoker.nome === nome) {
        return {
          ...usuarioPoker,
          carta,
        };
      }
      return usuarioPoker;
    });

    pseudoBancoUsuarioPoker = novoEstado;
    pokerIo.emit("setCarta", pseudoBancoUsuarioPoker);
  });
  socket.on("limparTodasCartas", () => {
    const novoEstado = pseudoBancoUsuarioPoker.map((usuarioPoker) => {
      return {
        id: usuarioPoker.id,
        nome: usuarioPoker.nome,
        sala: usuarioPoker.sala,
      };
    });

    pseudoBancoUsuarioPoker = novoEstado;
    cartasAbertas = false;

    pokerIo.emit("setCarta", pseudoBancoUsuarioPoker);
    pokerIo.emit("setCartasAbertas", cartasAbertas);
  });

  socket.on("toggleAbrirCartas", () => {
    cartasAbertas = !cartasAbertas;
    pokerIo.emit("setCartasAbertas", cartasAbertas);
  });

  socket.on("removerJogadores", () => {
    pseudoBancoUsuarioPoker = [];
    cartasAbertas = false;

    pokerIo.emit("voltarParaSelecaoDeSala");
  });

  socket.on("setCartasPossiveis", (dados: string[]) => {
    possibleCards = dados;

    pokerIo.emit("setCartasPossiveis", possibleCards);
  });
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
