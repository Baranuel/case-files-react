import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { Board, ZeroSchema } from "@/schema";
import { BASE_API_URL } from "@/constants";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { useQuery as useReactQuery } from "@tanstack/react-query";

interface SharedBoardCardProps {
  board: Board;
  onHoverPreload?: (boardId: string) => void;
}

export function SharedBoardCard({
  board,
  onHoverPreload,
}: SharedBoardCardProps) {
  const z = useZero<ZeroSchema>();
  const [collaborators] = useQuery(
    z.query.collaboration.where((q) =>
      q.and(q.cmp("boardId", "=", board.id), q.cmp("status", "=", "accepted"))
    )
  );

  const uniqueUserIds = [...new Set(collaborators.map((c) => c.userId))];

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
    <Link
      to="/board/$boardId"
      params={{ boardId: board.id }}
      onMouseEnter={() => onHoverPreload?.(board.id)}
    >
      <motion.div
        className=" bg-[#FDFBF7] h-full min-h-40 items-center rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all border border-[#8B4513]/20 p-6 flex  gap-3"
      >
        <div className="flex-1 min-w-0">
          <h3
            className="text-base font-serif text-[#2c2420] font-bold truncate 
                       group-hover:text-[#8B4513] transition-colors"
          >
            {board.title}
          </h3>
          <span className="mt-1 text-xs font-mono text-[#2c2420]/60">
            {dayjs(board.createdAt).format("MMM DD")}
          </span>
        </div>

        <div>
          <p className="text-sm font-mono text-[#2c2420]/70">Detectives</p>
          <div className="flex -space-x-2 mt-2">
            {!isLoading ? (
              userImages?.map((image, i) => (
                <img
                  key={i}
                  src={image}
                  alt={`Detective ${i + 1}`}
                  className="w-6 h-6 rounded-full border-2 border-[#FDFBF7] object-cover shadow-sm"
                />
              ))
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-[#FDFBF7] bg-gray-200 animate-pulse" />
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
