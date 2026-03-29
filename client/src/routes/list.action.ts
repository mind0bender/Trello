import { api } from "@/libs/api/axios";
import type { ApiResponse, List } from "@/types";

export const swapListsAction = async ({
  request,
}: {
  request: Request;
}): Promise<List> => {
  const formData = await request.formData();

  const list1Id = formData.get("list1Id");
  const list2Id = formData.get("list2Id");
  const boardId = formData.get("boardId");

  const res = await api.post<ApiResponse<List>>("/api/lists/swap", {
    list1Id,
    list2Id,
    boardId,
  });

  if (!res.data.success) {
    console.error(res.data);
    throw new Response(res.data.message || "Swap failed", {
      status: res.status,
    });
  }

  return res.data.data;
};
