import type { Card } from "@/types";
import { useDraggable } from "@dnd-kit/react";
import type { JSX } from "react";

type TaskProps = {
  card: Card;
};

export function TaskCard({
  card: { id, createdAt, title, listId, dueDate, description, position },
}: TaskProps): JSX.Element {
  const { ref } = useDraggable({
    id,
  });

  return (
    <div
      ref={ref}
      className="cursor-grab rounded-lg bg-neutral-900 border border-neutral-700 p-4 shadow-sm hover:shadow-md"
    >
      <h3 className="font-medium text-neutral-100">{title}</h3>
      <p className="mt-2 text-sm text-neutral-400">{description}</p>
    </div>
  );
}
