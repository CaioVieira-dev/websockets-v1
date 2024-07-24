import { useCallback, useContext } from "react";

import { Player } from "./Player";
import { CardOptionsProps } from "./CardOptions";
import { gameState } from "../poker/Poker.d";
import { PokerContext } from "../poker/PokerProvider";

type PlayersProps = CardOptionsProps & {
  game: gameState[];
  cardsAreOpened: boolean;
};

export function Players({ game, player, cardsAreOpened }: PlayersProps) {
  const { socket } = useContext(PokerContext) || {};

  const resetPlayerHand = useCallback(() => {
    socket?.emit("setGame", {
      id: player.id,
      name: player.name,
      card: null,
    });
  }, [player.id, player.name, socket]);

  const currPlayer = game.find((playeHand) => playeHand.id === player.id);
  const otherPlayers = game.filter((playerHand) => playerHand.id !== player.id);

  return (
    <div className="flex h-full w-full flex-col rounded-3xl bg-slate-200">
      <div className="flex w-full items-center justify-between border-b-2 border-slate-400 px-8 py-4">
        <p className="px-2 text-3xl">Nome</p>
        <p className="px-2 text-3xl">Pontos</p>
      </div>
      <Player
        name={currPlayer?.name || ""}
        card={currPlayer?.card}
        resetPlayerHand={resetPlayerHand}
        cardsAreOpened
      />

      {otherPlayers?.map?.((playerHand) => (
        <Player
          name={playerHand.name}
          key={`player-${playerHand.id}`}
          card={playerHand.card}
          cardsAreOpened={cardsAreOpened}
        />
      ))}
    </div>
  );
}
