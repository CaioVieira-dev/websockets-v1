import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import { getSocket } from "../utils/socket";
import { gameState } from "./Poker.d";
import { useNavigate, useParams } from "react-router-dom";
import { Socket } from "socket.io-client";

type PokerContextType = {
  socket: Socket;
  possibleCards: string[];
};

export const PokerContext = createContext<PokerContextType | null>(null);

type PokerProviderProps = {
  children: ReactNode;
  setGame: React.Dispatch<React.SetStateAction<gameState[]>>;
  setCardsAreOpened: React.Dispatch<React.SetStateAction<boolean>>;
  player: {
    usuario: unknown;
    roomId: string;
  };
};

export function PokerProvider({
  children,
  setGame,
  setCardsAreOpened,
  player,
}: PokerProviderProps) {
  const navigate = useNavigate();
  const [possibleCards, setPossibleCards] = useState<string[]>([]);
  const { roomId } = useParams();
  const socket = useMemo(
    () =>
      getSocket({
        path: "/poker/",
        roomId: player?.roomId ?? roomId,
      }),
    [player?.roomId, roomId],
  );

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

    if (player?.roomId) {
      socket.on("setGame", _setGame);
      socket.on("setCardsAreOpen", _setCardsAreOpen);
      socket.on("backToRoomSelection", onBackToSelectionRoom);
      socket.on("setPossibleCards", _setPossibleCards);
    }

    return () => {
      if (player) {
        socket.disconnect();
      }
      if (player?.roomId) {
        socket.off("setGame", _setGame);
        socket.off("setCardsAreOpen", _setCardsAreOpen);
        socket.off("backToRoomSelection", onBackToSelectionRoom);
        socket.off("setPossibleCards", _setPossibleCards);
      }
    };
  }, [player, navigate, setCardsAreOpened, setGame, socket]);

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
