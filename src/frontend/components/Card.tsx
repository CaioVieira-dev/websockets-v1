export type CardProps = {
  number: number | null;
  mini?: boolean;
  selectCard?: (cardNumber: number) => void;
  cartasAbertas?: boolean;
};

export function Card({
  number,
  mini,
  selectCard,
  cartasAbertas = true,
}: CardProps) {
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
