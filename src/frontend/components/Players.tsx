import { useCallback, useContext } from "react";

import { Player } from "./Player";
import { CardOptionsProps } from "./CardOptions";
import { gameState } from "../poker/Poker.d";
import { PokerContext } from "../poker/PokerProvider";

type PlayersProps = CardOptionsProps & {
  game: gameState[];
  cartasAbertas: boolean;
};

export function Players({ game, jogador, cartasAbertas }: PlayersProps) {
  const { socket } = useContext(PokerContext) || {};

  const resetPlayerHand = useCallback(() => {
    socket?.emit("setCarta", {
      id: jogador.id,
      nome: jogador.nome,
      carta: null,
    });
  }, [jogador.id, jogador.nome, socket]);

  const currPlayer = game.find((playeHand) => playeHand.id === jogador.id);
  const otherPlayers = game.filter(
    (playerHand) => playerHand.id !== jogador.id,
  );

  //TODO: ajeitar a cor, porque no hover a carta ta sumindo
  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-3xl bg-slate-300">
      <Player
        name={currPlayer?.nome || ""}
        card={currPlayer?.carta}
        resetPlayerHand={resetPlayerHand}
        cartasAbertas={cartasAbertas}
      />

      {otherPlayers?.map?.((playerHand) => (
        <Player
          name={playerHand.nome}
          key={`player-${playerHand.id}`}
          card={playerHand.carta}
          cartasAbertas={cartasAbertas}
        />
      ))}
    </div>
  );
}
