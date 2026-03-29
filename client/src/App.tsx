import { type JSX } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./components/layout/rootLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Boards from "./pages/dashboard/boards/Boards";
import { boardsLoader } from "./routes/boards.loader";
import { createBoardAction } from "./routes/boards.action";
import { boardLoader } from "./routes/board.loader";
import BoardPage from "./pages/dashboard/boards/Board";
import { swapListsAction } from "./routes/list.action";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        element: <Dashboard />,
        children: [
          {
            loader: boardsLoader,
            action: createBoardAction,
            path: "boards",
            element: <Boards />,
          },
        ],
      },
      {
        path: "/boards/:boardId",
        element: <BoardPage />,
        loader: boardLoader,
        action: swapListsAction,
      },
    ],
  },
]);

function App(): JSX.Element {
  return <RouterProvider router={router} />;
}

export default App;
