import { api } from "@/libs/api/axios";
import type { ApiResponse, BoardFull } from "@/types";
import type { AxiosResponse } from "axios";
import type { LoaderFunction, LoaderFunctionArgs } from "react-router";

export const boardLoader: LoaderFunction = ({
  params,
}: LoaderFunctionArgs): { board: Promise<BoardFull> } => {
  const { boardId } = params;

  if (!boardId) {
    throw new Response("Board ID missing", { status: 400 });
  }

  const boardPromise = api
    .get<ApiResponse<BoardFull>>(`/api/boards/${boardId}/full`)
    .then((res: AxiosResponse<ApiResponse<BoardFull>>): BoardFull => {
      if (!res.data.success) {
        throw new Error(res.data.message);
      }
      return res.data.data;
    });

  return {
    board: boardPromise,
  };
};
