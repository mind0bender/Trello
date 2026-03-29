import type { BoardFull } from "@/types";
import { Suspense, type JSX } from "react";
import { Await, useLoaderData } from "react-router-dom";

const BoardPage = (): JSX.Element => {
  const { board } = useLoaderData() as {
    board: BoardFull;
  };
  return (
    <Suspense fallback={<div>Loading board...</div>}>
      <Await resolve={board}>
        {(resolvedBoard: BoardFull): JSX.Element => (
          <div>{JSON.stringify(resolvedBoard)}</div>
        )}
      </Await>
    </Suspense>
  );
};

export default BoardPage;
