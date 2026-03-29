import { boardLoader } from "@/routes/board.loader";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";

const BoardPage = () => {
  const { board } = useLoaderData<typeof boardLoader>();
  return (
    <Suspense fallback={<div>Loading board...</div>}>
      <Await resolve={board}>
        {(resolvedBoard) => <div>{JSON.stringify(resolvedBoard)}</div>}
      </Await>
    </Suspense>
  );
};

export default BoardPage;
