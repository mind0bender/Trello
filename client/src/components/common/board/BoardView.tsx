import type { BoardFull, ListWithCards } from "@/types";
import { useMemo, type JSX } from "react";
import ListView from "../list/ListView";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

const BoardView = ({
  board: { lists, title },
}: {
  board: BoardFull;
}): JSX.Element => {
  const listIds: string[] = useMemo(
    (): string[] => lists.map((list: ListWithCards): string => list.id),
    [lists],
  );
  return (
    <div className="w-full flex flex-col grow">
      <div>
        <h1 className="text-xl font-semibold px-4 py-4">{title}</h1>
      </div>
      <DndContext
        onDragEnd={(e: DragEndEvent): void => {
          if (e) return;
        }}
      >
        <div className="flex gap-4 px-4">
          <SortableContext items={listIds}>
            {lists.map(
              (list: ListWithCards): JSX.Element => (
                <ListView list={list} key={list.id} />
              ),
            )}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};

export default BoardView;
