import type { JSX } from "react";
import { Link } from "react-router";

interface BoardPreviewProps {
  background: string;
  title: string;
  id: string;
}

const BoardPreview = ({
  background,
  title,
  id,
}: BoardPreviewProps): JSX.Element => {
  return (
    <Link
      to={`/boards/${id}`}
      className="flex flex-col rounded-md overflow-hidden border border-neutral-600 h-24 aspect-video"
    >
      <div className="bg-linear-45 from-fuchsia-400 to-violet-400 flex grow relative">
        {background + "lol"}
        <img
          src={background}
          alt="board background"
          className="w-full grow absolute top-0 left-0"
        />
      </div>
      <div className="w-full px-2 py-1 z-10 bg-neutral-900">{title}</div>
    </Link>
  );
};

export default BoardPreview;
