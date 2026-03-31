import type { Card, List } from "@/types";
import { swapCardsAction } from "./card.action";
import { swapListsAction } from "./list.action";

export const swapListOrCardAction = async ({
  request,
}: {
  request: Request;
}): Promise<Card | List> => {
  const formData = await request.clone().formData();

  const intent = formData.get("intent");

  if (!intent) {
    throw new Response("Missing required fields", { status: 400 });
  }

  switch (intent) {
    case "move-card": {
      return swapCardsAction({ request });
    }
    case "move-list": {
      return swapListsAction({ request });
    }
    default: {
      throw new Response("Invalid intent", { status: 400 });
    }
  }
};
