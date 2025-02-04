import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa6";
import { Popconfirm } from "antd";
import dayjs from "dayjs";
import { Board, ZeroSchema } from "@/schema";
import { useZero, useQuery } from "@rocicorp/zero/react";
import { useQuery as useReactQuery } from "@tanstack/react-query";
import { BASE_API_URL } from "@/constants";

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
  const [collaborators] = useQuery(
    z.query.collaboration.where((q) =>
      q.and(q.cmp("boardId", "=", board.id), q.cmp("status", "=", "accepted"))
    )
  );

  const uniqueUserIds = [...new Set(collaborators.map(c => c.userId))];

  const { data: userImages, isLoading } = useReactQuery({
    queryKey: ["userImages", uniqueUserIds],
    queryFn: async () => {
      const promises = uniqueUserIds.map(async (id) => {
        const res = await fetch(`${BASE_API_URL}/${id}`);
        return (await res.json()).imageUrl;
      });
      return Promise.all(promises);
    },
    enabled: uniqueUserIds.length > 0,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return (
    <motion.div className="relative group">
      <Link
        to="/board/$boardId"
        params={{ boardId: board.id }}
        onMouseEnter={() => onHoverPreload(board.id)}
        className="w-full bg-[#FDFBF7] rounded-lg hover:shadow-xl hover:-translate-y-1 transition-all"
      >
        <div className="h-full min-h-40 p-6 flex flex-col gap-4 border border-[#8B4513] rounded-lg">
          <div>
            <h2 className="text-[#2c2420] text-lg font-serif font-bold">{board.title}</h2>
            <p className="text-sm font-mono text-[#2c2420]/60 mt-2">
              Opened on {dayjs(board.createdAt).format("MMM DD, YYYY")}
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono">Detectives</span>
              <div className="flex -space-x-2">
                {!isLoading ? (
                  userImages?.map((image, i) => (
                    <img
                      key={i}
                      src={image}
                      alt={`Detective ${i + 1}`}
                      className="w-6 h-6 rounded-full border-2 border-[#FDFBF7] object-cover"
                    />
                  ))
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
                )}
              </div>
            </div>
            <div className="font-bold text-xs text-amber-700">CONFIDENTIAL</div>
          </div>
        </div>
      </Link>

      <Popconfirm
        title="Delete Board"
        description="Are you sure you want to delete this board?"
        onConfirm={() => onDelete(board.id)}
        okText="Delete"
        cancelText="Cancel"
      >
        <button
          title="Delete Board"
          className="absolute top-2 right-2 p-2 rounded-full bg-[#FDFBF7]/80 
                   hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <FaTrash className="text-red-500 hover:text-red-600 w-4 h-4" />
        </button>
      </Popconfirm>
    </motion.div>
  );
}
