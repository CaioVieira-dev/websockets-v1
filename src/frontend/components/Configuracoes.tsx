import { useCallback, useContext } from "react";
import { PokerContext } from "../poker/PokerProvider";

export function Configuracoes() {
  const { socket } = useContext(PokerContext);

  const limparTodasCartas = useCallback(() => {
    socket.emit("limparTodasCartas");
  }, [socket]);
  const toggleCartasAbertas = useCallback(() => {
    socket.emit("toggleAbrirCartas");
  }, [socket]);

  return (
    <div className="flex w-full justify-between gap-2">
      <div
        onClick={() => {}}
        className="rounded-md bg-slate-500 p-4 transition-colors hover:cursor-pointer hover:bg-slate-700"
      >
        Remover jogadores
      </div>
      <div
        onClick={() => {}}
        className="rounded-md bg-slate-500 p-4 transition-colors hover:cursor-pointer hover:bg-slate-700"
      >
        Configurar cartas
      </div>
      <div
        onClick={toggleCartasAbertas}
        className="rounded-md bg-slate-500 p-4 transition-colors hover:cursor-pointer hover:bg-slate-700"
      >
        Virar todos
      </div>
      <div
        onClick={limparTodasCartas}
        className="rounded-md bg-red-500 p-4 transition-colors hover:cursor-pointer hover:bg-red-800"
      >
        Remover todos
      </div>
    </div>
  );
}
