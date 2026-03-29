import type { JSX } from "react";
import { useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/sortable";
import type { Card, ListWithCards } from "@/types";
import { TaskCard } from "../task/Task";
import { CSS } from "@dnd-kit/utilities";

interface ListViewProps {
  list: ListWithCards;
}

const ListView = ({
  list: { id, cards, title, boardId },
}: ListViewProps): JSX.Element => {
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const { ref: droppableRef } = useDroppable({
    id: id,
    type: "card",
  });

  return (
    <div
      style={style}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      className="flex w-80 flex-col rounded-lg border border-neutral-900 bg-neutral-900/80 p-4"
      id={boardId}
    >
      <h2 className="mb-4 font-semibold text-neutral-100">{title}</h2>
      <div ref={droppableRef} className="flex flex-1 flex-col gap-4">
        {cards.map((card: Card): JSX.Element => {
          return <TaskCard key={card.id} card={card} />;
        })}
      </div>
    </div>
  );
};

export default ListView;
