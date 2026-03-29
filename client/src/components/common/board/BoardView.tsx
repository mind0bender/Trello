import type { BoardFull, ListWithCards } from "@/types";
import { useFetcher } from "react-router-dom";
import { useCallback, useMemo, useState, type JSX } from "react";
import ListView from "../list/ListView";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";

const BoardView = ({ board }: { board: BoardFull }): JSX.Element => {
  const [lists, setLists] = useState<ListWithCards[]>(board.lists);

  const [activeList, setActiveList] = useState<ListWithCards | null>(null);

  const listIds: string[] = useMemo(
    (): string[] => lists.map((list: ListWithCards): string => list.id),
    [lists],
  );

  const dragStartHandler = useCallback((e: DragStartEvent): void => {
    console.log(e);
    if (e.active.data.current?.type === "list") {
      setActiveList(e.active.data.current.list);
    }
  }, []);

  const fetcher = useFetcher();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
  );

  const dragEndHandler = useCallback(
    (e: DragEndEvent): void => {
      const { active, over } = e;

      if (!over) return;

      const activeListId = active.id;
      const overListId = over.id;

      if (activeListId === overListId) return;

      const formData = new FormData();
      formData.append("list1Id", String(activeListId));
      formData.append("list2Id", String(overListId));
      formData.append("boardId", String(board.id));

      fetcher.submit(formData, {
        method: "post",
      });

      setLists((prevLists: ListWithCards[]): ListWithCards[] => {
        const oldIndex = prevLists.findIndex(
          (l: ListWithCards): boolean => l.id === active.id,
        );
        const newIndex = prevLists.findIndex(
          (l: ListWithCards): boolean => l.id === over.id,
        );

        if (oldIndex === -1 || newIndex === -1) return prevLists;

        return arrayMove(prevLists, oldIndex, newIndex);
      });
    },
    [board.id, fetcher],
  );

  return (
    <div className="w-full flex flex-col grow">
      <div>
        <h1 className="text-xl font-semibold px-4 py-4">{board.title}</h1>
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={dragStartHandler}
        onDragEnd={dragEndHandler}
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
        {createPortal(
          <DragOverlay modifiers={[]}>
            {activeList && <ListView list={activeList} />}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
};

export default BoardView;
