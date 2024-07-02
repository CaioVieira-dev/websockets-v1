import { ReactNode, createContext, useEffect } from "react";
import { getSocket } from "../utils/socket";
import { gameState } from "./Poker.d";

const socket = getSocket({
  path: "/poker/",
});

export const PokerContext = createContext({ socket });

type PokerProviderProps = {
  children: ReactNode;
  setGame: React.Dispatch<React.SetStateAction<gameState[]>>;
  setCartasAbertas: React.Dispatch<React.SetStateAction<boolean>>;
  jogador: unknown;
};

export function PokerProvider({
  children,
  setGame,
  setCartasAbertas,
  jogador,
}: PokerProviderProps) {
  useEffect(() => {
    function setCarta(data: []) {
      setGame(data);
    }
    function _setCartasAbertas(data: boolean) {
      setCartasAbertas(data);
    }

    if (jogador) {
      socket.connect();
    }
    socket.on("setCarta", setCarta);
    socket.on("setCartasAbertas", _setCartasAbertas);

    return () => {
      socket.off("setCarta", setCarta);
      socket.off("setCartasAbertas", _setCartasAbertas);
      if (jogador) {
        socket.disconnect();
      }
    };
  }, [jogador, setCartasAbertas, setGame]);

  return (
    <PokerContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </PokerContext.Provider>
  );
}
