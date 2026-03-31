import { FolderKanban } from "lucide-react";
import BoardPreview from "../../../components/common/board/BoardPreview";
import { Await, useLoaderData } from "react-router-dom";
import type { Board } from "../../../types";
import { Suspense, useState, type JSX, type ReactNode } from "react";
import { Form, useNavigation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { boardsLoader } from "@/routes/boards.loader";

const Boards = (): JSX.Element => {
  const { boards } = useLoaderData<typeof boardsLoader>();

  return (
    <div className="px-8 sm:px-12">
      <div className="flex flex-col gap-8 justify-center items-center">
        {/* Header */}
        <div className="flex justify-center items-center gap-4">
          <div className="aspect-square text-4xl text-neutral-900 font-semibold flex justify-center items-center bg-indigo-400 rounded-md w-16 h-16">
            T
          </div>
          <div>
            <div className="text-3xl font-semibold">Trello Workspace</div>
          </div>
        </div>

        <hr className="border-t border-t-neutral-600 w-2/3" />

        <div className="flex flex-col gap-4 w-full max-w-5xl">
          <div className="flex gap-2 items-center">
            <FolderKanban />
            Your Boards
          </div>

          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Suspense
              fallback={
                <div className="flex cursor-pointer flex-col rounded-md overflow-hidden border border-neutral-600 h-32 sm:h-40 aspect-video overflow-y-auto justify-center items-center bg-neutral-700">
                  Loading Boards...
                </div>
              }
            >
              <Await resolve={boards}>
                {(resolvedBoards: Board[]): ReactNode =>
                  resolvedBoards.map(
                    (b: Board): JSX.Element => (
                      <BoardPreview
                        key={b.id}
                        id={b.id}
                        title={b.title}
                        background={b.background || ""}
                      />
                    ),
                  )
                }
              </Await>
            </Suspense>

            <CreateNewBoardForm />
          </div>
        </div>
      </div>
    </div>
  );
};

function CreateNewBoardForm(): JSX.Element | null {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (!isOpen) {
    return (
      <div
        onClick={(): void => setIsOpen(true)}
        className="flex cursor-pointer flex-col rounded-md overflow-hidden border border-neutral-600 h-32 sm:h-40 aspect-video overflow-y-auto justify-center items-center bg-neutral-700"
      >
        Create New Board
      </div>
    );
  }

  return (
    <Form
      method="post"
      className="w-full h-screen flex flex-col justify-center items-center fixed top-0 left-0"
    >
      <Card className="flex flex-col gap-4 border border-neutral-600 bg-neutral-900 text-neutral-100 p-6 w-1/2 h-fit max-w-sm fixed">
        <h2 className="text-lg font-semibold">Create New Board</h2>
        <Input
          name="title"
          placeholder="Enter board title..."
          autoFocus
          required
          className="bg-neutral-800 text-sm px-2 py-1 rounded outline-none border-neutral-400"
        />
        <Input
          name="background"
          defaultValue={`https://images.pexels.com/photos/13382071/pexels-photo-13382071.jpeg`}
          placeholder="Background URL"
          className="bg-neutral-800 text-sm px-2 py-1 rounded outline-none border-neutral-400"
        />
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-500 hover:bg-indigo-600 px-3 py-1 rounded text-sm disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>

          <Button
            type="button"
            variant={"ghost"}
            onClick={(): void => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </Form>
  );
}

export default Boards;
