import { api, request } from "./axios";

export const createBoard = (
  title: string,
  background?: string,
): Promise<{ id: string }> =>
  request<{ id: string }>(api.post("/api/boards", { title, background }));

export const getBoards = (): Promise<{ id: string; title: string }[]> =>
  request<{ id: string; title: string }[]>(api.get("/api/boards"));
