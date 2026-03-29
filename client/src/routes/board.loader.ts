import type { Board } from "@/types";
import { api } from "../libs/api/axios";
import type { AxiosResponse } from "axios";

export const boardsLoader = (): { boards: Promise<Board[]> } => {
  try {
    const boardsPromise = api
      .get("/api/boards")
      .then((res: AxiosResponse): Board[] => res.data.data);

    return { boards: boardsPromise };
  } catch {
    throw new Response("Failed to load boards", { status: 500 });
  }
};
