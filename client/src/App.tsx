import { type JSX } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./components/layout/rootLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Boards from "./pages/dashboard/boards/Boards";
import { boardsLoader } from "./routes/board.loader";
import { createBoardAction } from "./routes/board.action";

const router = createBrowserRouter([
  {
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
            children: [
              {
                path: "new",
              },
            ],
          },
        ],
      },
    ],
  },
]);

function App(): JSX.Element {
  return <RouterProvider router={router} />;
}

export default App;
