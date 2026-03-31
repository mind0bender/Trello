import { api } from "@/lib/api/axios";
import type { ApiResponse, Card } from "@/types";

export const swapCardsAction = async ({
  request,
}: {
  request: Request;
}): Promise<Card> => {
  const formData = await request.formData();

  const cardId = formData.get("cardId");
  const sourceListId = formData.get("sourceListId");
  const destListId = formData.get("destListId");
  const newPosition = formData.get("newPosition");

  if (!cardId || !sourceListId || !destListId || newPosition === null) {
    throw new Response("Missing required fields", { status: 400 });
  }

  const res = await api.post<ApiResponse<Card>>("/api/cards/move", {
    cardId,
    sourceListId,
    destListId,
    newPosition: Number(newPosition),
  });

  if (!res.data.success) {
    console.error(res.data);
    throw new Response(res.data.message || "Swap failed", {
      status: res.status,
    });
  }

  return res.data.data;
};

export const createCardAction = async ({
  request,
  params,
}: {
  request: Request;
  params: { boardId?: string };
}): Promise<Card> => {
  const formData = await request.formData();

  const title = formData.get("title");
  const boardId = params.boardId || formData.get("boardId");

  if (!title || !boardId) {
    throw new Response("Missing required fields", { status: 400 });
  }

  const res = await api.post<ApiResponse<Card>>(
    "/api/card",
    {
      title,
      boardId,
    },
    {
      validateStatus: () => true,
    },
  );

  if (!res.data.success) {
    throw new Response(res.data.message || "Failed to create list", {
      status: res.status,
    });
  }

  return res.data.data;
};
