import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { getRoutes } from "./api/poker/poker.routes.ts";

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

getRoutes(app, pokerIo);

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
