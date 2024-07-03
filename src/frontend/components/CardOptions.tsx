import { useCallback, useContext } from "react";
import { jogador } from "../poker/Poker.d";
import { Card } from "./Card";
import { PokerContext } from "../poker/PokerProvider";

export type CardOptionsProps = {
  jogador: jogador;
};

export function CardOptions({ jogador }: CardOptionsProps) {
  const { socket, cartasPossiveis } = useContext(PokerContext) || {};
  const selectCard = useCallback(
    (card: string) => {
      socket?.emit("setCarta", {
        id: jogador.id,
        nome: jogador.nome,
        carta: card,
      });
    },
    [jogador.id, jogador.nome, socket],
  );

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {cartasPossiveis?.map((val) => (
        <Card symbol={val} key={`card-${val}`} selectCard={selectCard} />
      ))}
    </div>
  );
}
