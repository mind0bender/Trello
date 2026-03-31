import { useMemo, type JSX } from "react";
import { useDroppable } from "@dnd-kit/react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Card, ListWithCards } from "@/types";
import { TaskCard } from "../task/Task";
import { CSS } from "@dnd-kit/utilities";
import { Grab, GripVertical } from "lucide-react";

interface ListViewProps {
  list: ListWithCards;
}

const ListView = ({ list }: ListViewProps): JSX.Element => {
  const { id, cards, title, boardId, position } = list;
  const {
    setActivatorNodeRef,
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
      listId: list.id,
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

  const cardIds: string[] = useMemo(
    (): string[] => list.cards.map((card: Card): string => card.id),
    [list.cards],
  );

  if (isDragging)
    return (
      <div
        ref={setNodeRef}
        className="flex justify-center items-center min-w-80 flex-col rounded-lg border bg-neutral-900/80 p-4 border-blue-400/80"
        id={boardId}
      >
        <Grab size={40} className="text-neutral-500" />
      </div>
    );

  return (
    <SortableContext
      items={cardIds}
      id={id}
      strategy={verticalListSortingStrategy}
    >
      <div
        style={style}
        ref={setNodeRef}
        className="flex min-w-80 flex-col rounded-lg border border-neutral-900 bg-neutral-900/80 p-4 touch-none h-fit"
        id={boardId}
      >
        <h2 className="mb-4 font-semibold text-neutral-100 flex justify-between items-center">
          {title}
          <div ref={setActivatorNodeRef} {...listeners} {...attributes}>
            <GripVertical
              className={`cursor-grab active:cursor-grabbing ${isDragging ? "text-stone-300" : "text-stone-500"}`}
            />
          </div>
        </h2>
        <div ref={droppableRef} className="flex flex-1 flex-col gap-4">
          {cards.map((card: Card, idx): JSX.Element => {
            return <TaskCard key={card.id} card={card} position={idx + 1} />;
          })}
        </div>
      </div>
    </SortableContext>
  );
};

export default ListView;
