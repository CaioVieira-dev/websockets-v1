import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { gameState } from "./Poker.d";
import { CardOptions } from "../components/CardOptions";
import { Settings } from "../components/Settings";
import { Players } from "../components/Players";
import { PokerProvider } from "./PokerProvider";

export function Poker() {
  const location = useLocation();
  const player = useMemo(() => location.state, [location]);
  const [game, setGame] = useState<gameState[]>([]);
  const [cardsAreOpened, setCardsAreOpened] = useState(false);

  return (
    <PokerProvider
      player={player}
      setCardsAreOpened={setCardsAreOpened}
      setGame={setGame}
    >
      <div className="flex h-full flex-col gap-4 bg-slate-900 px-16 py-16">
        <CardOptions player={player} />
        <Settings />
        <Players player={player} game={game} cardsAreOpened={cardsAreOpened} />
      </div>
    </PokerProvider>
  );
}
