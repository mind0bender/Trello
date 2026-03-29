import type { JSX } from "react";
import { useDroppable } from "@dnd-kit/react";
import type { Card, ListWithCards } from "@/types";
import { TaskCard } from "../task/Task";

interface ListViewProps {
  list: ListWithCards;
}

const ListView = ({
  list: { id, cards, title, boardId },
}: ListViewProps): JSX.Element => {
  const { ref } = useDroppable({
    id: id,
  });

  return (
    <div
      className="flex w-80 flex-col rounded-lg border border-neutral-900 bg-neutral-900/80 p-4"
      id={boardId}
    >
      <h2 className="mb-4 font-semibold text-neutral-100">{title}</h2>
      <div ref={ref} className="flex flex-1 flex-col gap-4">
        {cards.map((card: Card): JSX.Element => {
          return <TaskCard key={card.id} card={card} />;
        })}
      </div>
    </div>
  );
};

export default ListView;
