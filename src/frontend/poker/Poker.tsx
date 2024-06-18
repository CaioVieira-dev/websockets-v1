export function Poker() {
  return (
    <div className="flex h-full flex-col gap-4 bg-slate-900 px-16 py-16">
      <CardOptions />
      <Players />
    </div>
  );
}

type CardProps = {
  number: number;
  mini?: boolean;
};
function Card({ number, mini }: CardProps) {
  return (
    <div
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

function CardOptions() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Card number={1} />
      <Card number={2} />
      <Card number={3} />
      <Card number={5} />
      <Card number={8} />
      <Card number={13} />
      <Card number={21} />
    </div>
  );
}

type PlayerProps = {
  name: string;
};

function Players() {
  return (
    <div className="flex h-full w-full flex-col gap-2 rounded-3xl bg-slate-300">
      <Player name="Testerson" />
      <Player name="Zé das Couve" />
    </div>
  );
}

function Player({ name }: PlayerProps) {
  return (
    <div className="flex w-full items-center gap-2 rounded-xl bg-slate-400 py-8">
      <p className="px-2 text-3xl">{name}</p>
      <Card number={1} mini />
    </div>
  );
}
