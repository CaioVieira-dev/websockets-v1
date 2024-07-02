import { useCallback, useContext } from "react";
import { jogador } from "../poker/Poker.d";
import { Card } from "./Card";
import { PokerContext } from "../poker/PokerProvider";

export type CardOptionsProps = {
  jogador: jogador;
};

const possibleCards = [1, 2, 3, 5, 8, 13, 21];

export function CardOptions({ jogador }: CardOptionsProps) {
  const { socket } = useContext(PokerContext);
  const selectCard = useCallback(
    (cardNumber: number) => {
      socket.emit("setCarta", {
        id: jogador.id,
        nome: jogador.nome,
        carta: cardNumber,
      });
    },
    [jogador.id, jogador.nome, socket],
  );

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {possibleCards.map((val) => (
        <Card number={val} key={`card-${val}`} selectCard={selectCard} />
      ))}
    </div>
  );
}
