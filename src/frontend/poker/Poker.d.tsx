export type jogador = {
  nome: string;
  id: number;
};

export type gameState = jogador & {
  carta: string | null;
};
