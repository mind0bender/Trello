import { Kanban, LayoutGrid, Search, User } from "lucide-react";
import type { JSX } from "react";
import { Button } from "../ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Link } from "react-router";

const Navbar = (): JSX.Element => {
  return (
    <nav className="w-full p-2 flex justify-between items-center border-b border-b-neutral-600">
      <Link to={"/"} className="flex gap-2 justify-center items-center">
        <LayoutGrid size={20} />
        <div className="bg-blue-500 rounded-sm p-0.5">
          <Kanban size={20} />
        </div>
        <h2 className="font-bold text-neutral-100">Trello</h2>
      </Link>
      <div className="flex gap-2 justify-center items-center">
        <InputGroup className="max-w-xs border-neutral-500">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Button className="bg-blue-400 text-neutral-900">Create</Button>
      </div>
      <div>
        <div className="rounded-full border bg-blue-400 text-neutral-800 p-1 border-none">
          <User size={20} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
