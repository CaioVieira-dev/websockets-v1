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
  possibleCards: string[];
};

export const PokerContext = createContext<PokerContextType | null>(null);

type PokerProviderProps = {
  children: ReactNode;
  setGame: React.Dispatch<React.SetStateAction<gameState[]>>;
  setCardsAreOpened: React.Dispatch<React.SetStateAction<boolean>>;
  player: unknown;
};

export function PokerProvider({
  children,
  setGame,
  setCardsAreOpened,
  player,
}: PokerProviderProps) {
  const navigate = useNavigate();
  const [possibleCards, setPossibleCards] = useState<string[]>([]);

  useEffect(() => {
    function _setGame(data: []) {
      setGame(data);
    }
    function _setCardsAreOpen(data: boolean) {
      setCardsAreOpened(data);
    }
    function onBackToSelectionRoom() {
      return navigate("/");
    }
    function _setPossibleCards(data: []) {
      setPossibleCards(data);
    }

    if (player) {
      socket.connect();
    }
    socket.on("setGame", _setGame);
    socket.on("setCardsAreOpen", _setCardsAreOpen);
    socket.on("backToRoomSelection", onBackToSelectionRoom);
    socket.on("setPossibleCards", _setPossibleCards);

    return () => {
      socket.off("setGame", _setGame);
      socket.off("setCardsAreOpen", _setCardsAreOpen);
      socket.off("backToRoomSelection", onBackToSelectionRoom);
      socket.off("setPossibleCards", _setPossibleCards);
      if (player) {
        socket.disconnect();
      }
    };
  }, [player, navigate, setCardsAreOpened, setGame]);

  return (
    <PokerContext.Provider
      value={{
        socket,
        possibleCards,
      }}
    >
      {children}
    </PokerContext.Provider>
  );
}
