import { ReactNode, createContext, useEffect } from "react";
import { getSocket } from "../utils/socket";
import { gameState } from "./Poker.d";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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

    if (jogador) {
      socket.connect();
    }
    socket.on("setCarta", setCarta);
    socket.on("setCartasAbertas", _setCartasAbertas);
    socket.on("voltarParaSelecaoDeSala", onVoltarParaSelecaoDeSala);

    return () => {
      socket.off("setCarta", setCarta);
      socket.off("setCartasAbertas", _setCartasAbertas);
      socket.off("voltarParaSelecaoDeSala", onVoltarParaSelecaoDeSala);
      if (jogador) {
        socket.disconnect();
      }
    };
  }, [jogador, navigate, setCartasAbertas, setGame]);

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
