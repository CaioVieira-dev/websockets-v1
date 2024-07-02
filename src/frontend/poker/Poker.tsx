import { useCallback, useEffect, useMemo, useState } from "react";
import { getSocket } from "../utils/socket";
import { useLocation } from "react-router-dom";

type jogador = {
  nome: string;
  id: number;
};

type gameState = jogador & {
  carta: number | null;
};

const socket = getSocket({
  path: "/poker/",
});

export function Poker() {
  const location = useLocation();
  const jogador = useMemo(() => location.state, [location]);
  const [game, setGame] = useState<gameState[]>([]);
  const [cartasAbertas, setCartasAbertas] = useState(false);

  useEffect(() => {
    function setCarta(data: []) {
      setGame(data);
    }
    function _setCartasAbertas(data: boolean) {
      setCartasAbertas(data);
    }

    if (jogador) {
      socket.connect();
    }
    socket.on("setCarta", setCarta);
    socket.on("setCartasAbertas", _setCartasAbertas);

    return () => {
      socket.off("setCarta", setCarta);
      socket.off("setCartasAbertas", _setCartasAbertas);
      if (jogador) {
        socket.disconnect();
      }
    };
  }, [jogador]);

  return (
    <div className="flex h-full flex-col gap-4 bg-slate-900 px-16 py-16">
      <CardOptions jogador={jogador} />
      <Configuracoes />
      <Players jogador={jogador} game={game} cartasAbertas={cartasAbertas} />
    </div>
  );
}

type CardProps = {
  number: number | null;
  mini?: boolean;
  selectCard?: (cardNumber: number) => void;
  cartasAbertas?: boolean;
};
function Card({ number, mini, selectCard, cartasAbertas = true }: CardProps) {
  if (!number) {
    return null;
  }

  return (
    <div
      onClick={() => selectCard?.(number)}
      className={`flex transition-colors ${mini ? "h-20 w-12" : "h-60 w-2/12"} items-center justify-center rounded-lg bg-slate-300 hover:cursor-pointer hover:bg-slate-400`}
    >
      <p
        className={`font-sans ${mini ? "text-[3rem] leading-[2rem]" : "text-[7rem] leading-[6rem]"}`}
      >
        {cartasAbertas && number}
      </p>
    </div>
  );
}

type CardOptionsProps = {
  jogador: jogador;
};

const possibleCards = [1, 2, 3, 5, 8, 13, 21];

function CardOptions({ jogador }: CardOptionsProps) {
  const selectCard = useCallback(
    (cardNumber: number) => {
      socket.emit("setCarta", {
        id: jogador.id,
        nome: jogador.nome,
        carta: cardNumber,
      });
    },
    [jogador.id, jogador.nome],
  );

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {possibleCards.map((val) => (
        <Card number={val} key={`card-${val}`} selectCard={selectCard} />
      ))}
    </div>
  );
}

type PlayersProps = CardOptionsProps & {
  game: gameState[];
  cartasAbertas: boolean;
};

function Players({ game, jogador, cartasAbertas }: PlayersProps) {
  const resetPlayerHand = useCallback(() => {
    socket.emit("setCarta", {
      id: jogador.id,
      nome: jogador.nome,
      carta: null,
    });
  }, [jogador.id, jogador.nome]);

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

type PlayerProps = {
  name: string;
  card?: number | null;
  resetPlayerHand?: () => void;
  cartasAbertas: boolean;
};

function Player({ name, card, resetPlayerHand, cartasAbertas }: PlayerProps) {
  return (
    <div className="flex w-full items-center gap-2 rounded-xl bg-slate-400 py-8">
      <p className="px-2 text-3xl">{name}</p>
      <div className="" onClick={resetPlayerHand}>
        <Card number={card || 0} mini cartasAbertas={cartasAbertas} />
      </div>
    </div>
  );
}

function Configuracoes() {
  const limparTodasCartas = useCallback(() => {
    socket.emit("limparTodasCartas");
  }, []);
  const toggleCartasAbertas = useCallback(() => {
    socket.emit("toggleAbrirCartas");
  }, []);

  return (
    <div className="flex w-full justify-between gap-2">
      <div
        onClick={() => {}}
        className="rounded-md bg-slate-500 p-4 transition-colors hover:cursor-pointer hover:bg-slate-700"
      >
        Remover jogadores
      </div>
      <div
        onClick={() => {}}
        className="rounded-md bg-slate-500 p-4 transition-colors hover:cursor-pointer hover:bg-slate-700"
      >
        Configurar cartas
      </div>
      <div
        onClick={toggleCartasAbertas}
        className="rounded-md bg-slate-500 p-4 transition-colors hover:cursor-pointer hover:bg-slate-700"
      >
        Virar todos
      </div>
      <div
        onClick={limparTodasCartas}
        className="rounded-md bg-red-500 p-4 transition-colors hover:cursor-pointer hover:bg-red-800"
      >
        Remover todos
      </div>
    </div>
  );
}
