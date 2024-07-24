import { useCallback, useContext } from "react";
import { CardsSettings } from "./CardsSettings";
import { PokerContext } from "../poker/PokerProvider";

export function Settings() {
  const { socket } = useContext(PokerContext) || {};

  const removePlayers = useCallback(() => {
    socket?.emit("removePlayers");
  }, [socket]);
  const clearBoard = useCallback(() => {
    socket?.emit("clearBoard");
  }, [socket]);
  const toggleCardsAreOpened = useCallback(() => {
    socket?.emit("toggleCardsAreOpened");
  }, [socket]);

  return (
    <div className="flex w-full justify-between gap-2">
      <div
        onClick={removePlayers}
        className="rounded-md bg-slate-200 p-4 transition-colors hover:cursor-pointer hover:bg-slate-400"
      >
        Remover jogadores
      </div>
      <CardsSettings />
      <div
        onClick={toggleCardsAreOpened}
        className="rounded-md bg-slate-200 p-4 transition-colors hover:cursor-pointer hover:bg-slate-400"
      >
        Virar todos
      </div>
      <div
        onClick={clearBoard}
        className="rounded-md bg-red-500 p-4 transition-colors hover:cursor-pointer hover:bg-red-800"
      >
        Remover todos
      </div>
    </div>
  );
}
