import BoardView from "@/components/common/board/BoardView";
import type { BoardFull } from "@/types";
import { GripVertical } from "lucide-react";
import { Suspense, type JSX } from "react";
import { Await, useLoaderData } from "react-router-dom";

const BoardPage = (): JSX.Element => {
  const { board } = useLoaderData() as {
    board: BoardFull;
  };
  return (
    <Suspense fallback={<BoardPageSkeleton />}>
      <Await resolve={board}>
        {(resolvedBoard: BoardFull): JSX.Element => (
          <BoardView board={resolvedBoard} />
        )}
      </Await>
    </Suspense>
  );
};

function BoardPageSkeleton(): JSX.Element {
  return (
    <div className="w-full flex flex-col grow">
      <div>
        <h1 className="text-xl font-semibold px-4 py-4">Loading Board...</h1>
      </div>
      <div className="flex gap-4 px-4">
        {[1, 2, 3].map(
          (list: number): JSX.Element => (
            <div
              key={list}
              style={{
                animationDelay: `${list / 3}s`,
              }}
              className="flex gap-4 justify-start items-center w-80 flex-col rounded-lg border bg-neutral-900/80 p-4 border-neutral-400/80 animate-pulse opacity-80"
            >
              <h2 className="w-full mb-4 font-semibold text-neutral-100 flex justify-between items-center">
                <span>Loading List...</span>
                <GripVertical
                  className={`cursor-grab active:cursor-grabbing text-stone-500`}
                />
              </h2>
              {Array.from(
                { length: list },
                (_: unknown, i: number): number => i,
              ).map((v): JSX.Element => {
                return (
                  <div
                    key={v}
                    className="cursor-grab rounded-lg bg-neutral-900 border border-neutral-700 p-4 shadow-sm hover:shadow-md w-full"
                  >
                    <h3 className="font-medium text-neutral-100">
                      Loading Cards...
                    </h3>
                  </div>
                );
              })}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default BoardPage;
