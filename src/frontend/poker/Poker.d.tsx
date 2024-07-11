export type player = {
  name: string;
  id: number;
};

export type gameState = player & {
  card: string | null;
};
