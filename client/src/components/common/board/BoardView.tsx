import type { BoardFull, Card, ListWithCards } from "@/types";
import { Form, useFetcher, useNavigation } from "react-router-dom";
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
  closestCorners,
  defaultDropAnimation,
  type DropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TaskCard } from "../task/Task";
import { X } from "lucide-react";

const BoardView = ({ board }: { board: BoardFull }): JSX.Element => {
  const [lists, setLists] = useState<ListWithCards[]>(board.lists);

  const [activeList, setActiveList] = useState<ListWithCards | null>(null);

  const listIds: string[] = useMemo(
    (): string[] => lists.map((list: ListWithCards): string => list.id),
    [lists],
  );

  const [isListDraggable, setIsListDraggable] = useState<boolean>(false);
  const [isCardDraggable, setIsCardDraggable] = useState<boolean>(false);
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const dragStartHandler = useCallback((e: DragStartEvent): void => {
    if (e.active.data.current?.type === "list") {
      setIsListDraggable(true);
      setActiveList(e.active.data.current.list);
    } else if (e.active.data.current?.type === "card") {
      setIsCardDraggable(true);
      setActiveCard(e.active.data.current.card);
    }
  }, []);

  const moveListFetcher = useFetcher();
  const moveCardFetcher = useFetcher();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
  );

  const findContainer = useCallback(
    (id: string): string => {
      const list: ListWithCards = lists.find((l: ListWithCards): boolean => {
        if (l.id === id) return true;
        return l.cards.some((c: Card): boolean => c.id === id);
      }) as ListWithCards;
      return list.id;
    },
    [lists],
  );

  const dragEndHandler = useCallback(
    (e: DragEndEvent): void => {
      const { active, over } = e;

      if (!over) return;

      if (active.data.current!.type === "list") {
        const activeListId = active.id;
        const overListId = over.data.current?.listId || over.id;

        setIsListDraggable(false);
        if (activeListId === overListId) return;

        const formData = new FormData();
        formData.append("list1Id", String(activeListId));
        formData.append("list2Id", String(overListId));
        formData.append("boardId", String(board.id));
        formData.append("intent", String("move-list"));

        moveListFetcher.submit(formData, {
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
      } else if (active.data.current?.type === "card") {
        setIsCardDraggable(false);
        if (!over) return;

        if (active.data.current?.type !== "card") return;

        const activeContainer: string = findContainer(active.id as string);
        const overContainer: string = findContainer(over.id as string);

        const cardId: string = active.data.current?.cardId;
        const sourceListId: string = activeContainer;
        const destinationListId: string = overContainer;
        const newPosition: number =
          over.data.current?.type === "card"
            ? over.data.current?.position
            : (lists.find(
                (l: ListWithCards): boolean => l.id === destinationListId,
              )?.cards.length || 0) + 1;

        const destination: {
          listId: string;
          position: number;
        } = {
          listId: over.data.current?.listId,
          position:
            over.data.current?.type === "card"
              ? over.data.current?.position - 1
              : over.data.current?.list.cards.length,
        };

        setLists((prev: ListWithCards[]): ListWithCards[] => {
          const sourceListIndex = prev.findIndex(
            (l: ListWithCards): boolean => l.id === activeContainer,
          );
          const destListIndex = prev.findIndex(
            (l: ListWithCards): boolean => l.id === overContainer,
          );

          if (sourceListIndex === -1 || destListIndex === -1) return prev;

          const sourceList = prev[sourceListIndex];
          const destList = prev[destListIndex];

          const sourceCards = [...sourceList.cards];
          const destCards =
            sourceListIndex === destListIndex
              ? sourceCards
              : [...destList.cards];

          const fromIndex = sourceCards.findIndex(
            (c: Card): boolean => c.id === cardId,
          );
          if (fromIndex === -1) return prev;

          const [movedCard] = sourceCards.splice(fromIndex, 1);

          let toIndex = destination.position;

          if (toIndex === undefined || toIndex === null) {
            toIndex = destCards.length;
          }

          if (sourceListIndex === destListIndex) {
            if (sourceListIndex === destListIndex) {
              const list = prev[sourceListIndex];
              const cards = [...list.cards];

              const fromIndex = cards.findIndex(
                (c: Card): boolean => c.id === cardId,
              );
              if (fromIndex === -1) return prev;
              let toIndex = destination.position;

              if (toIndex === undefined || toIndex === null) {
                toIndex = cards.length - 1;
              }

              return prev.map((l: ListWithCards, i: number): ListWithCards => {
                if (i !== sourceListIndex) return l;

                return {
                  ...l,
                  cards: arrayMove(cards, fromIndex, toIndex),
                };
              });
            }
          }

          destCards.splice(toIndex, 0, movedCard);

          return prev.map((list: ListWithCards, i: number): ListWithCards => {
            if (i === sourceListIndex) {
              return { ...list, cards: sourceCards };
            }
            if (i === destListIndex) {
              return { ...list, cards: destCards };
            }
            return list;
          });
        });
        const formData: FormData = new FormData();
        formData.append("cardId", cardId);
        formData.append("sourceListId", sourceListId);
        formData.append("destListId", destinationListId);
        formData.append("newPosition", String(newPosition));
        formData.append("intent", String("move-card"));

        moveCardFetcher.submit(formData, {
          method: "POST",
        });
      }
    },
    [board.id, moveListFetcher, moveCardFetcher, findContainer, lists],
  );

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  return (
    <div className="w-full flex flex-col grow bg-linear-135 from-blue-800 to-blue-400">
      <div>
        <h1 className="text-xl font-semibold px-4 py-4">{board.title}</h1>
      </div>
      <div className="overflow-x-auto grow flex">
        <DndContext
          sensors={sensors}
          onDragStart={dragStartHandler}
          onDragEnd={dragEndHandler}
          collisionDetection={closestCorners}
        >
          <div className="flex gap-4 px-4 grow">
            <SortableContext
              items={listIds}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex gap-4 h-fit">
                {lists.map(
                  (list: ListWithCards): JSX.Element => (
                    <ListView key={list.id} list={list} />
                  ),
                )}
                <CreateNewList boardId={board.id} />
              </div>
            </SortableContext>
          </div>
          {createPortal(
            isListDraggable && (
              <DragOverlay modifiers={[]} dropAnimation={dropAnimation}>
                {activeList && <ListView list={activeList} />}
              </DragOverlay>
            ),
            document.body,
          )}
          {createPortal(
            isCardDraggable && (
              <DragOverlay modifiers={[]} dropAnimation={dropAnimation}>
                {activeCard && <TaskCard card={activeCard} position={-1} />}
              </DragOverlay>
            ),
            document.body,
          )}
        </DndContext>
      </div>
    </div>
  );
};

interface CreateNewListProps {
  boardId: string;
}

function CreateNewList({ boardId }: CreateNewListProps): JSX.Element {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (!isOpen) {
    return (
      <div className="flex px-4 hfit">
        <div
          onClick={(): void => setIsOpen(true)}
          className="flex justify-center items-center min-w-80 flex-col rounded-lg bg-neutral-50/30 text-neutral-50 p-4 cursor-pointer text-sm font-semibold hover:bg-neutral-50/20 h-fit duration-200"
        >
          Create New List
        </div>
      </div>
    );
  }

  return (
    <Form
      method="POST"
      className="flex justify-center items-start gap-2 min-w-80 flex-col rounded-lg bg-neutral-900/80 text-neutral-50 p-4 cursor-pointer text-sm font-semibold hover:bg-neutral-50/20 h-fit duration-200"
    >
      <Input
        onClick={(): void => setIsOpen(true)}
        placeholder="Enter List name..."
      />
      <Input name="boardId" hidden defaultValue={boardId} />
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-indigo-400 hover:bg-indigo-600 px-3 py-1 rounded text-sm disabled:opacity-50 text-neutral-900"
        >
          {isSubmitting ? "Adding..." : "Add List"}
        </Button>

        <Button
          type="button"
          variant={"ghost"}
          onClick={(): void => setIsOpen(false)}
        >
          <X />
        </Button>
      </div>
    </Form>
  );
}

export default BoardView;
