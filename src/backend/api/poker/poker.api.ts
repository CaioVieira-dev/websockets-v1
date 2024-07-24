import { RequestHandler } from "express";
import { Server, Socket } from "socket.io";

export interface UsuarioPoker {
  id: number;
  name: string;
  room: string;
  card?: string;
}

let idUsuarioPoker = 0;

const rooms: Record<string, UsuarioPoker[]> = {};
const possibleCardsInRooms: Record<string, string[]> = {};
const cardsAreOpenedInRooms: Record<string, boolean> = {};
const cardsAreOpened = false;
const possibleCards = ["1", "2", "3", "5", "8", "13", "21"];

export const entrarNoPoker: RequestHandler = (req, res) => {
  const { room, name, roomId: reqRoomId } = req.body || {};
  let roomId = reqRoomId;
  //TODO: fazer uma validação mais seria que isso
  if ((!room && !roomId) || !name) {
    res.send({ error: "Dados invalidos para entrar" });
  }

  if (!roomId) {
    const newRoomId = makeUniqueId(8, Object.keys(rooms));
    rooms[newRoomId] = [];
    possibleCardsInRooms[newRoomId] = possibleCards;
    cardsAreOpenedInRooms[newRoomId] = cardsAreOpened;
    roomId = newRoomId;
    //TODO: criar expiração automatica da sala pra salvar memoria
  }

  let usuario = rooms[roomId].find(
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
    rooms[roomId].push(usuario);
  }

  return res.send({ ...usuario, roomId });
};

function addPlayerToGame(pokerIo: Server, socket: Socket, roomId: string) {
  const game = rooms[roomId];
  const possibleCards = possibleCardsInRooms[roomId];
  const cardsAreOpened = cardsAreOpenedInRooms[roomId];

  pokerIo.to(roomId).emit("setGame", game);
  socket.emit("setPossibleCards", possibleCards);
  pokerIo.to(roomId).emit("setCardsAreOpen", cardsAreOpened);
}

function registerEvents(pokerIo: Server, socket: Socket, roomId: string) {
  socket.on("setGame", (data) => {
    const { id, name, card }: { id: number; name: string; card: string } = data;

    const novoEstado = rooms[roomId].map((usuarioPoker) => {
      if (usuarioPoker.id === id && usuarioPoker.name === name) {
        return {
          ...usuarioPoker,
          card,
        };
      }
      return usuarioPoker;
    });

    rooms[roomId] = novoEstado;
    pokerIo.to(roomId).emit("setGame", rooms[roomId]);
  });
  socket.on("clearBoard", () => {
    const novoEstado = rooms[roomId].map((usuarioPoker) => {
      return {
        id: usuarioPoker.id,
        name: usuarioPoker.name,
        room: usuarioPoker.room,
      };
    });

    rooms[roomId] = novoEstado;
    cardsAreOpenedInRooms[roomId] = false;

    pokerIo.to(roomId).emit("setGame", rooms[roomId]);
    pokerIo.to(roomId).emit("setCardsAreOpen", cardsAreOpenedInRooms[roomId]);
  });

  socket.on("toggleCardsAreOpened", () => {
    cardsAreOpenedInRooms[roomId] = !cardsAreOpenedInRooms[roomId];
    pokerIo.to(roomId).emit("setCardsAreOpen", cardsAreOpenedInRooms[roomId]);
  });

  socket.on("removePlayers", () => {
    rooms[roomId] = [];
    cardsAreOpenedInRooms[roomId] = false;
    pokerIo.to(roomId).emit("backToRoomSelection");
  });

  socket.on("setPossibleCards", (data: string[]) => {
    possibleCardsInRooms[roomId] = data;

    pokerIo.to(roomId).emit("setPossibleCards", possibleCardsInRooms[roomId]);
  });
}

export function registerSocketFunctions(pokerIo: Server) {
  pokerIo.on("connection", (socket) => {
    const roomId = socket.handshake.headers["room-id"];
    if (typeof roomId !== "string") {
      //TODO: atirar erro aqui
      return;
    }

    socket.join(roomId);

    addPlayerToGame(pokerIo, socket, roomId);
    registerEvents(pokerIo, socket, roomId);
  });
}

function makeid(length: number): string {
  let result = "";
  const characters = "ABCDEFGHJKMNPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i <= length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function makeUniqueId(lenght: number, currentIds: string[]) {
  const id = makeid(lenght);
  if (currentIds.includes(id)) {
    return makeUniqueId(lenght, currentIds);
  }

  return id;
}
