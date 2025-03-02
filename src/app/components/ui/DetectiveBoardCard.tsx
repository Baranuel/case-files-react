import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaCopy, FaTrash } from "react-icons/fa6";
import { message, Popconfirm } from "antd";
import dayjs from "dayjs";
import { Board, ZeroSchema } from "@/schema";
import { useZero, useQuery } from "@rocicorp/zero/react";


interface DetectiveBoardCardProps {
  board: Board;
  onHoverPreload: (boardId: string) => void;
  onDelete: (boardId: string) => Promise<void>;
}

export function DetectiveBoardCard({
  board,
  onHoverPreload,
  onDelete,
}: DetectiveBoardCardProps) {
  const z = useZero<ZeroSchema>();
  const [messageApi, contextHolder] = message.useMessage();


  const [collaborations] = useQuery(
    z.query.collaboration
      .where((q) =>
        q.and(q.cmp("boardId", "=", board.id), q.cmp("status", "=", "accepted"))
      )
      .related("user")
  );

  const collaborators = collaborations.map((c) => c.user);

  return (
    <motion.div className="relative group bg-[#FDFBF7] rounded-lg overflow-hidden">
      {contextHolder}
      <Link
        to="/board/$boardId"
        params={{ boardId: board.id }}
        onMouseEnter={() => onHoverPreload(board.id)}
        className="w-full bg-[#FDFBF7] rounded-lg hover:shadow-xl hover:-translate-y-1 transition-all"
      >
        <div className="h-full min-h-48 p-6 flex flex-col gap-4 border border-[#8B4513] overflow-hidden rounded-lg">
          <div>
            <h2 className="text-[#2c2420] text-lg font-serif font-bold">
              {board.title}
            </h2>
            <p className="text-sm font-mono text-[#2c2420]/60 mt-2">
              Opened on {dayjs(board.createdAt).format("MMM DD, YYYY")}
            </p>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono">Detectives</span>
              <div className="flex -space-x-2">
                {collaborators?.map((user, i) => (
                  <img
                    key={i}
                    src={user?.imageUrl ?? ""}
                    alt={`Detective ${i + 1}`}
                    className="w-6 h-6 rounded-full border-2 border-[#FDFBF7] object-cover"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="font-bold text-xs text-amber-700">CONFIDENTIAL</div>
        </div>
      </Link>
      <div className="absolute top-0 p-4 right-0 hidden gap-2 md:flex group-hover:flex ">
        <button
          title="Copy Board ID"
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(`${window.location.origin}/request-access?boardId=${board.id}`);
            messageApi.success({
              content: "Copied to clipboard, you can share it with your partners",
            });
          }}
          className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:scale-110"
        >
          <FaCopy className="text-blue-500 w-4 h-4 transition-colors duration-200" />
        </button>
        <Popconfirm
          title="Delete Board"
          description="Are you sure you want to delete this board?"
          onConfirm={() => onDelete(board.id)}
          okText="Delete"
          cancelText="Cancel"
        >
          <button 
            title="Delete Board" 
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:scale-110"
          >
            <FaTrash className="text-red-500 w-4 h-4 transition-colors duration-200" />
          </button>
        </Popconfirm>
      </div>
    </motion.div>
  );
}
