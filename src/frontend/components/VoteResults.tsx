import { useMemo } from "react";
import { gameState } from "../poker/Poker.d";
import { Card } from "./Card";

type VoteResultsProps = {
  game: gameState[];
};

export function VoteResults({ game }: VoteResultsProps) {
  const mostVotedCards = useMemo(() => {
    const cardCountMap = game?.reduce<Record<string, number>>((acc, cur) => {
      if (cur.card === null || cur.card === undefined) {
        return acc;
      }

      if (acc?.[cur.card]) {
        acc[cur.card] += 1;
      } else {
        acc[cur.card] = 1;
      }

      return acc;
    }, {});

    const mostVotes = Math.max(...Object.values(cardCountMap));

    const mostVotedCards = Object.entries(cardCountMap).filter(
      ([, votes]) => votes === mostVotes,
    );

    return mostVotedCards.map(([card]) => card);
  }, [game]);

  return (
    <div className="flex h-full min-h-32 items-center justify-between rounded-3xl bg-slate-200 px-8 py-2">
      <p className="px-2 text-3xl">Mais votados: </p>
      <div className="flex flex-wrap justify-end gap-2">
        {mostVotedCards.map((card, index) => (
          <Card symbol={card} mini key={`most-voted-${card}-${index}`} />
        ))}
      </div>
    </div>
  );
}
