import type { JSX } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router";

const RootLayout = (): JSX.Element => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-neutral-800 text-neutral-300">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default RootLayout;
