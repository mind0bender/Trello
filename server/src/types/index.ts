import type { BoardGetPayload } from "../generated/prisma/models";

export type FullBoard = BoardGetPayload<{
  include: {
    lists: {
      include: {
        cards: {
          include: {
            labels: { include: { label: true } };
            members: { include: { member: true } };
            checklist: true;
          };
        };
      };
    };
  };
}>;
