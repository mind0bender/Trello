import { useMemo, useState, type JSX } from "react";
import { useDroppable } from "@dnd-kit/react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Card, ListWithCards } from "@/types";
import { TaskCard } from "../task/Task";
import { CSS } from "@dnd-kit/utilities";
import {
  Delete,
  Grab,
  GripVertical,
  Plus,
  Trash,
  Trash2,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Form, useNavigation } from "react-router";
import { Button } from "@/components/ui/button";

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
          <div className="flex justify-center items-center gap-2 ">
            <Trash2
              className="text-neutral-400 hover:text-red-500 cursor-pointer"
              size={18}
            />
            <div
              ref={setActivatorNodeRef}
              {...listeners}
              {...attributes}
              className="flex justify-center items-center"
            >
              <GripVertical
                className={`cursor-grab active:cursor-grabbing ${isDragging ? "text-stone-300" : "text-stone-500"}`}
              />
            </div>
          </div>
        </h2>
        <div ref={droppableRef} className="flex flex-1 flex-col gap-4">
          {cards.map((card: Card, idx): JSX.Element => {
            return <TaskCard key={card.id} card={card} position={idx + 1} />;
          })}
          <CreateNewCard listId={list.id} />
        </div>
      </div>
    </SortableContext>
  );
};

interface CreateNewCardProps {
  listId: string;
}

const CreateNewCard = ({ listId }: CreateNewCardProps): JSX.Element => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (!isOpen) {
    return (
      <div
        onClick={(): void => setIsOpen(true)}
        className="flex justify-start gap-4 items-center w-full rounded-lg text-neutral-400 hover:text-neutral-200 p-4 cursor-pointer text-sm font-semibold hover:bg-neutral-50/20 h-fit duration-200"
      >
        <Plus />
        Add a Card
      </div>
    );
  }
  return (
    <Form method="post" className="w-full">
      <Input
        placeholder="Enter a title"
        className="rounded-lg bg-neutral-900 border border-neutral-700 p-4 shadow-sm z-10 px-4 py-5"
      />
      <Input hidden name="listId" value={listId} />
      <div className="mt-2 text-sm text-neutral-400 flex justify-start items-center gap-2">
        <Button
          variant={"secondary"}
          className="bg-blue-400 rounded-sm px-4 py-4 cursor-pointer"
        >
          Add Card
        </Button>
        <Button
          variant={"ghost"}
          className="text-neutral-400 hover:text-red-500 rounded-sm hover:bg-neutral-50/20 cursor-pointer"
          onClick={(): void => setIsOpen(false)}
        >
          <X />
        </Button>
      </div>
    </Form>
  );
};

export default ListView;
