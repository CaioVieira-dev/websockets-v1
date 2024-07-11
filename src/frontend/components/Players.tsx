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

  //TODO: ajeitar a cor, porque no hover a carta ta sumindo
  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-3xl bg-slate-300">
      <Player
        name={currPlayer?.name || ""}
        card={currPlayer?.card}
        resetPlayerHand={resetPlayerHand}
        cardsAreOpened={cardsAreOpened}
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
