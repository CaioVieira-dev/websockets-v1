export type CardProps = {
  symbol: string | null;
  mini?: boolean;
  selectCard?: (cardNumber: string) => void;
  cardsAreOpened?: boolean;
};

export function Card({
  symbol,
  mini,
  selectCard,
  cardsAreOpened = true,
}: CardProps) {
  if (!symbol) {
    return null;
  }

  return (
    <div
      onClick={() => selectCard?.(symbol)}
      className={`flex transition-colors ${mini ? "min-h-28 min-w-20 px-1 py-6" : "min-h-52 min-w-40 px-2"} items-center justify-center rounded-lg bg-slate-300 hover:cursor-pointer hover:bg-slate-400`}
    >
      <p
        className={`font-sans ${mini ? "text-[3rem] leading-[2rem]" : "text-[6.5rem] leading-[6rem]"}`}
      >
        {cardsAreOpened && symbol}
      </p>
    </div>
  );
}
