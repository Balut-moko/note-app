export type TNote = {
  userId: number;
  cards: TCard[];
};

export type TInvokeNote = {
  user_id: number;
  cards: TCard[];
};

export type TCard = {
  id: number;
  content: string;
  updated: string;
  created: string;
  unread: number;
  stared: number;
};
