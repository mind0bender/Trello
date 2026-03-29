import { FolderKanban, Users } from "lucide-react";
import type { JSX } from "react";
import { NavLink, Outlet } from "react-router";

const Dashboard = (): JSX.Element => {
  return (
    <main className="grow w-full flex">
      <div className="p-4 sm:p-8 flex flex-col border-r border-neutral-600">
        <div className="py-2 font-semibold">Trello Workspaces</div>
        <ul className="flex flex-col gap-2 justify-start items-start">
          <li className="flex w-full justify-start">
            <NavLink
              className={({ isActive }): string =>
                `flex gap-2 justify-start items-center grow px-2 sm:pr-10 py-1.5 rounded-md ${isActive && "bg-blue-500/20 text-blue-400"}`
              }
              to={"/boards"}
            >
              <FolderKanban size={20} />
              Boards
            </NavLink>
          </li>
          <li className="flex w-full justify-start">
            <NavLink
              className={({ isActive }): string =>
                `flex gap-2 justify-start items-center grow px-2 sm:pr-10 py-1.5 rounded-md ${isActive && "bg-blue-500/20 text-blue-400"}`
              }
              to={"/members"}
            >
              <Users size={20} />
              Members
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="p-4 sm:p-8 flex flex-col grow">
        <Outlet />
      </div>
    </main>
  );
};

export default Dashboard;
