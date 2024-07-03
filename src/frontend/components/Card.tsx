export type CardProps = {
  symbol: string | null;
  mini?: boolean;
  selectCard?: (cardNumber: string) => void;
  cartasAbertas?: boolean;
};

export function Card({
  symbol,
  mini,
  selectCard,
  cartasAbertas = true,
}: CardProps) {
  if (!symbol) {
    return null;
  }

  return (
    <div
      onClick={() => selectCard?.(symbol)}
      className={`flex transition-colors ${mini ? "h-20 w-12" : "h-60 w-2/12"} items-center justify-center rounded-lg bg-slate-300 hover:cursor-pointer hover:bg-slate-400`}
    >
      <p
        className={`font-sans ${mini ? "text-[3rem] leading-[2rem]" : "text-[7rem] leading-[6rem]"}`}
      >
        {cartasAbertas && symbol}
      </p>
    </div>
  );
}
