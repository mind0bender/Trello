import { type ActionFunctionArgs, redirect } from "react-router-dom";
import { createBoard } from "../lib/api/boards";

export async function createBoardAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const title: string = formData.get("title") as string;
  const background: string | undefined = formData.get("background") as
    | string
    | undefined;

  if (!title?.trim()) {
    return { error: "Board title is required" };
  }

  try {
    const board = await createBoard(title, background);
    return redirect(`/api/boards/${board.id}`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error creating board:", err);
      return { error: err.message };
    }
    return {
      error: "Something went wrong",
    };
  }
}
