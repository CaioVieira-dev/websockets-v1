import { Express } from "express";
import { Server } from "socket.io";
import { entrarNoPoker, registerSocketFunctions } from "./poker.api.ts";

export function getRoutes(app: Express, pokerIo: Server) {
  app.post("/entrar", entrarNoPoker);

  registerSocketFunctions(pokerIo);
}
