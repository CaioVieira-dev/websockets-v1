import { ReactNode, createContext, useEffect, useState } from "react";
import { getSocket } from "../utils/socket";
import { gameState } from "./Poker.d";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

const socket = getSocket({
  path: "/poker/",
});

type PokerContextType = {
  socket: Socket;
  cartasPossiveis: string[];
};

export const PokerContext = createContext<PokerContextType | null>(null);

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
  const navigate = useNavigate();
  const [cartasPossiveis, setCartasPossiveis] = useState<string[]>([]);

  useEffect(() => {
    function setCarta(data: []) {
      setGame(data);
    }
    function _setCartasAbertas(data: boolean) {
      setCartasAbertas(data);
    }
    function onVoltarParaSelecaoDeSala() {
      return navigate("/");
    }
    function _setCartasPossiveis(data: []) {
      setCartasPossiveis(data);
    }

    if (jogador) {
      socket.connect();
    }
    socket.on("setCarta", setCarta);
    socket.on("setCartasAbertas", _setCartasAbertas);
    socket.on("voltarParaSelecaoDeSala", onVoltarParaSelecaoDeSala);
    socket.on("setCartasPossiveis", _setCartasPossiveis);

    return () => {
      socket.off("setCarta", setCarta);
      socket.off("setCartasAbertas", _setCartasAbertas);
      socket.off("voltarParaSelecaoDeSala", onVoltarParaSelecaoDeSala);
      socket.off("setCartasPossiveis", _setCartasPossiveis);
      if (jogador) {
        socket.disconnect();
      }
    };
  }, [jogador, navigate, setCartasAbertas, setGame]);

  return (
    <PokerContext.Provider
      value={{
        socket,
        cartasPossiveis,
      }}
    >
      {children}
    </PokerContext.Provider>
  );
}
