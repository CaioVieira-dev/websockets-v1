import { useCallback, useEffect, useState } from "react";
import { getSocket } from "../utils/socket";

type player = {
  player: string;
  id: number;
};

type gameState = player & {
  card: number | null;
};

const socket = getSocket({
  path: "/poker/",
});

export function Poker() {
  const [player, setPlayer] = useState<player>({ player: "Testerson", id: 1 });
  const [game, setGame] = useState<gameState[]>([
    { player: "testerson", id: 1, card: 1 },
    { player: "Zé", id: 2, card: 3 },
  ]);

  useEffect(() => {
    function onEnterRoom(data: []) {
      console.log("data: ", data);
    }

    socket.on("enter", onEnterRoom);

    return () => {
      socket.off("enter", onEnterRoom);
    };
  }, []);

  return (
    <div className="flex h-full flex-col gap-4 bg-slate-900 px-16 py-16">
      <CardOptions game={game} setGame={setGame} player={player} />
      <Players player={player} game={game} setGame={setGame} />
      <button
        onClick={() =>
          setPlayer((curr) =>
            curr.id === 1
              ? { player: "Zé", id: 2 }
              : { player: "testerson", id: 1 },
          )
        }
      >
        troca player
      </button>
    </div>
  );
}

type CardProps = {
  number: number | null;
  mini?: boolean;
  selectCard?: (cardNumber: number) => void;
};
function Card({ number, mini, selectCard }: CardProps) {
  if (!number) {
    return null;
  }

  return (
    <div
      onClick={() => selectCard?.(number)}
      className={`flex ${mini ? "h-20 w-12" : "h-60 w-2/12"} items-center justify-center rounded-lg bg-slate-300 hover:cursor-pointer hover:bg-slate-400`}
    >
      <p
        className={`font-sans ${mini ? "text-[3rem] leading-[2rem]" : "text-[7rem] leading-[6rem]"}`}
      >
        {number}
      </p>
    </div>
  );
}

type CardOptionsProps = {
  game: gameState[];
  player: player;
  setGame: React.Dispatch<React.SetStateAction<gameState[]>>;
};

const possibleCards = [1, 2, 3, 5, 8, 13, 21];

function CardOptions({ game, player, setGame }: CardOptionsProps) {
  const selectCard = useCallback(
    (cardNumber: number) => {
      const newGame = [];

      for (const playerHand of game) {
        const newPlayerHand = { ...playerHand };
        if (playerHand?.id === player?.id) {
          newPlayerHand.card = cardNumber;
        }

        newGame.push(newPlayerHand);
      }

      setGame(newGame);
    },
    [game, player?.id, setGame],
  );

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {possibleCards.map((val) => (
        <Card number={val} key={`card-${val}`} selectCard={selectCard} />
      ))}
    </div>
  );
}

type PlayersProps = CardOptionsProps;

function Players({ game, player, setGame }: PlayersProps) {
  const resetPlayerHand = useCallback(() => {
    const newGame = [];

    for (const playerHand of game) {
      const newPlayerHand = { ...playerHand };
      if (playerHand?.id === player?.id) {
        newPlayerHand.card = null;
      }

      newGame.push(newPlayerHand);
    }

    setGame(newGame);
  }, [game, player?.id, setGame]);

  const currPlayer = game.find((playeHand) => playeHand.id === player.id);
  const otherPlayers = game.filter((playerHand) => playerHand.id !== player.id);

  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-3xl bg-slate-300">
      <Player
        name={currPlayer?.player || ""}
        card={currPlayer?.card}
        resetPlayerHand={resetPlayerHand}
      />

      {otherPlayers?.map?.((playerHand) => (
        <Player
          name={playerHand.player}
          key={`player-${playerHand.id}`}
          card={playerHand.card}
        />
      ))}
    </div>
  );
}

type PlayerProps = {
  name: string;
  card?: number | null;
  resetPlayerHand?: () => void;
};

function Player({ name, card, resetPlayerHand }: PlayerProps) {
  return (
    <div className="flex w-full items-center gap-2 rounded-xl bg-slate-400 py-8">
      <p className="px-2 text-3xl">{name}</p>
      <div className="" onClick={resetPlayerHand}>
        <Card number={card || 0} mini />
      </div>
    </div>
  );
}
