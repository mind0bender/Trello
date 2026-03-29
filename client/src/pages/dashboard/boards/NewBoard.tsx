import { useLoaderData } from "react-router-dom";

type Board = {
  id: string;
  title: string;
};

export default function BoardsPage() {
  const boards = useLoaderData() as Board[];

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Your Boards</h1>
        <p className="text-zinc-400 text-sm">
          Manage and organize your projects
        </p>
      </div>

      {/* Create Board */}
      <div className="mb-8">
        <CreateBoardForm />
      </div>

      {/* Boards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards.map((board) => (
          <a
            key={board.id}
            href={`/boards/${board.id}`}
            className="p-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition cursor-pointer"
          >
            <h2 className="font-medium">{board.title}</h2>
          </a>
        ))}
      </div>

      {/* Empty State */}
      {boards.length === 0 && (
        <div className="text-center text-zinc-500 mt-10">
          No boards yet. Create one to get started.
        </div>
      )}
    </div>
  );
}
