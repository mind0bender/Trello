import type { JSX } from "react";
import { useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/sortable";
import type { Card, ListWithCards } from "@/types";
import { TaskCard } from "../task/Task";
import { CSS } from "@dnd-kit/utilities";
import { Grab } from "lucide-react";

interface ListViewProps {
  list: ListWithCards;
}

const ListView = ({ list }: ListViewProps): JSX.Element => {
  const { id, cards, title, boardId, position } = list;
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: "list",
      list,
      position,
      boardId,
    },
  });

  const { ref: droppableRef } = useDroppable({
    id: id,
    type: "card",
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        className="flex justify-center items-center w-80 flex-col rounded-lg border bg-neutral-900/80 p-4 border-blue-400/80"
        id={boardId}
      >
        <Grab size={40} className="text-neutral-500" />
      </div>
    );

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
