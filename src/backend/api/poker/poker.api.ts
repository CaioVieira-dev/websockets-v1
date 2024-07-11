import { RequestHandler } from "express";
import { Server } from "socket.io";

export interface UsuarioPoker {
  id: number;
  name: string;
  room: string;
  card?: string;
}

let idUsuarioPoker = 0;

let pseudoBancoUsuarioPoker: UsuarioPoker[] = [];
let cardsAreOpened = false;
let possibleCards = ["1", "2", "3", "5", "8", "13", "21"];

export const entrarNoPoker: RequestHandler = (req, res) => {
  const { room, name } = req.body || {};

  //TODO: fazer uma validação mais seria que isso
  if (!room || !name) {
    res.send({ error: "Dados invalidos para entrar" });
  }

  let usuario = pseudoBancoUsuarioPoker.find(
    ({ name: userName, room: userRoom }) =>
      userName === name && userRoom === room,
  );

  if (!usuario) {
    usuario = {
      id: idUsuarioPoker,
      name,
      room,
    };
    idUsuarioPoker += 1;
    pseudoBancoUsuarioPoker.push(usuario);
  }

  return res.send(usuario);
};

export function registerSocketFunctions(pokerIo: Server) {
  pokerIo.on("connection", (socket) => {
    pokerIo.emit("setGame", pseudoBancoUsuarioPoker);
    socket.emit("setPossibleCards", possibleCards);
    pokerIo.emit("setCardsAreOpen", cardsAreOpened);

    socket.on("setGame", (data) => {
      const { id, name, card }: { id: number; name: string; card: string } =
        data;

      const novoEstado = pseudoBancoUsuarioPoker.map((usuarioPoker) => {
        if (usuarioPoker.id === id && usuarioPoker.name === name) {
          return {
            ...usuarioPoker,
            card,
          };
        }
        return usuarioPoker;
      });

      pseudoBancoUsuarioPoker = novoEstado;
      pokerIo.emit("setGame", pseudoBancoUsuarioPoker);
    });
    socket.on("clearBoard", () => {
      const novoEstado = pseudoBancoUsuarioPoker.map((usuarioPoker) => {
        return {
          id: usuarioPoker.id,
          name: usuarioPoker.name,
          room: usuarioPoker.room,
        };
      });

      pseudoBancoUsuarioPoker = novoEstado;
      cardsAreOpened = false;

      pokerIo.emit("setGame", pseudoBancoUsuarioPoker);
      pokerIo.emit("setCardsAreOpen", cardsAreOpened);
    });

    socket.on("toggleCardsAreOpened", () => {
      cardsAreOpened = !cardsAreOpened;
      pokerIo.emit("setCardsAreOpen", cardsAreOpened);
    });

    socket.on("removePlayers", () => {
      pseudoBancoUsuarioPoker = [];
      cardsAreOpened = false;

      pokerIo.emit("backToRoomSelection");
    });

    socket.on("setPossibleCards", (data: string[]) => {
      possibleCards = data;

      pokerIo.emit("setPossibleCards", possibleCards);
    });
  });
}
