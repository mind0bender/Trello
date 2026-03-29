import type { BoardFull, ListWithCards } from "@/types";
import type { JSX } from "react";
import ListView from "../list/ListView";

const BoardView = ({ board }: { board: BoardFull }): JSX.Element => {
  return (
    <div className="w-full flex flex-col grow">
      <div>
        <h1 className="text-xl font-semibold px-4 py-4">{board.title}</h1>
      </div>
      <div className="flex gap-4 px-4">
        {board.lists.map(
          (list: ListWithCards): JSX.Element => (
            <ListView list={list} key={list.id} />
          ),
        )}
      </div>
    </div>
  );
};

export default BoardView;
