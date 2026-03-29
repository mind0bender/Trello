export type Board = {
  id: string;
  title: string;
  background?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type List = {
  id: string;
  title: string;
  boardId: string;
  position: number;
  createdAt: string;
};

export type Card = {
  id: string;
  title: string;
  description?: string | null;
  listId: string;
  position: number;
  dueDate?: string | null;
  createdAt: string;
};

export type ChecklistItem = {
  id: string;
  content: string;
  done: boolean;
};

export type Checklist = {
  id: string;
  title: string;
  cardId: string;
  items: ChecklistItem[];
};

export type Label = {
  id: string;
  name: string;
  color: string;
  boardId: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
};

export type ListWithCards = List & {
  cards: Card[];
};

export type BoardWithLists = Board & {
  lists: List[];
};

export type BoardFull = Board & {
  lists: ListWithCards[];
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};
