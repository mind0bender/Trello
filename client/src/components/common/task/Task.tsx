import type { Card } from "@/types";
import type { JSX } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grab } from "lucide-react";

type TaskProps = {
  card: Card;
  position: number;
};

export function TaskCard({ card, position }: TaskProps): JSX.Element {
  const { id, title, description } = card;
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
      type: "card",
      cardId: id,
      card: card,
      listId: card.listId,
      position: position,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        className="cursor-grab rounded-lg bg-neutral-900 border border-blue-400 p-4 shadow-sm hover:shadow-md relative flex justify-center items-center flex-col"
        ref={setNodeRef}
      >
        <Grab
          size={40}
          className="text-neutral-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <div className="sticky top-0 scale-0">
          <h3 className="font-medium text-neutral-100">{title}</h3>
          <p className="mt-2 text-sm text-neutral-400">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={style}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      className="cursor-grab rounded-lg bg-neutral-900 border border-neutral-700 p-4 shadow-sm hover:shadow-md z-10"
    >
      <h3 className="font-medium text-neutral-100">{title}</h3>
      <p className="mt-2 text-sm text-neutral-400">{description}</p>
    </div>
  );
}
