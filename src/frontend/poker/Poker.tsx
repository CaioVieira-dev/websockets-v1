import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { gameState } from "./Poker.d";
import { CardOptions } from "../components/CardOptions";
import { Configuracoes } from "../components/Configuracoes";
import { Players } from "../components/Players";
import { PokerProvider } from "./PokerProvider";

export function Poker() {
  const location = useLocation();
  const jogador = useMemo(() => location.state, [location]);
  const [game, setGame] = useState<gameState[]>([]);
  const [cartasAbertas, setCartasAbertas] = useState(false);

  return (
    <PokerProvider
      jogador={jogador}
      setCartasAbertas={setCartasAbertas}
      setGame={setGame}
    >
      <div className="flex h-full flex-col gap-4 bg-slate-900 px-16 py-16">
        <CardOptions jogador={jogador} />
        <Configuracoes />
        <Players jogador={jogador} game={game} cartasAbertas={cartasAbertas} />
      </div>
    </PokerProvider>
  );
}
