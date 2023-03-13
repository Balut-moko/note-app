export interface formData {
  card_id: number | null;
  content: string;
  pic_id: string;
  updated: string;
}

export interface UserNames {
  [user_id: number]: string;
}

export type TUser = {
  readonly id: number;
  readonly name: string;
};

export type TCard = {
  readonly id: number;
  content: string;
  pic_id: number;
  updated: string;
  readonly created: string;
  unread: boolean;
  starred: boolean;
};
export type ReadFilter = "all" | "read" | "unread" | "None";
export type StarFilter = "all" | "starred" | "unStarred" | "None";
