import { Card } from "./Card";

export type PlayerProps = {
  name: string;
  card?: number | null;
  resetPlayerHand?: () => void;
  cartasAbertas: boolean;
};

export function Player({
  name,
  card,
  resetPlayerHand,
  cartasAbertas,
}: PlayerProps) {
  return (
    <div className="flex w-full items-center gap-2 rounded-xl bg-slate-400 py-8">
      <p className="px-2 text-3xl">{name}</p>
      <div className="" onClick={resetPlayerHand}>
        <Card number={card || 0} mini cartasAbertas={cartasAbertas} />
      </div>
    </div>
  );
}
