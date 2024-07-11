import { useCallback, useContext } from "react";
import { player } from "../poker/Poker.d";
import { Card } from "./Card";
import { PokerContext } from "../poker/PokerProvider";

export type CardOptionsProps = {
  player: player;
};

export function CardOptions({ player }: CardOptionsProps) {
  const { socket, possibleCards } = useContext(PokerContext) || {};
  const selectCard = useCallback(
    (card: string) => {
      socket?.emit("setGame", {
        id: player.id,
        name: player.name,
        card,
      });
    },
    [player.id, player.name, socket],
  );

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {possibleCards?.map((val) => (
        <Card symbol={val} key={`card-${val}`} selectCard={selectCard} />
      ))}
    </div>
  );
}
