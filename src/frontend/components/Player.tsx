import { Card } from "./Card";

export type PlayerProps = {
  name: string;
  card?: string | null;
  resetPlayerHand?: () => void;
  cardsAreOpened: boolean;
};

export function Player({
  name,
  card,
  resetPlayerHand,
  cardsAreOpened,
}: PlayerProps) {
  return (
    <div className="flex min-h-32 w-full items-center justify-between border-slate-400 px-8 [&:not(:last-child)]:border-b-2">
      <p className="px-2 text-3xl">{name}</p>
      <div className="px-4" onClick={resetPlayerHand}>
        <Card symbol={card || ""} mini cardsAreOpened={cardsAreOpened} />
      </div>
    </div>
  );
}
