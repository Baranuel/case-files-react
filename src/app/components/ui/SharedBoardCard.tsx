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

export function SharedBoardCard({ board, onHoverPreload }: SharedBoardCardProps) {
  const z = useZero<ZeroSchema>();

  const [collaborations] = useQuery(
    z.query.collaboration.where((q) =>
      q.and(q.cmp("boardId", "=", board.id), q.cmp("status", "=", "accepted"))
    ).related("user")
  );

  const collaborators = collaborations.map((c) => c.user);

  return (
    <motion.div className="relative group">
      <Link
        to="/board/$boardId"
        params={{ boardId: board.id }}
        onMouseEnter={() => onHoverPreload?.(board.id)}
        className="block w-full bg-[#FDFBF7] rounded-lg hover:shadow-xl hover:-translate-y-1 transition-all"
      >
        <div className="h-full min-h-32 p-4 flex flex-col gap-3 border border-[#8B4513]/30 rounded-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-[#2c2420] text-base font-serif font-medium">
              {board.title}
            </h2>
            <div className="text-xs font-mono text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
              Shared Case
            </div>
          </div>

          <p className="text-xs font-mono text-[#2c2420]/60">
            Opened on {dayjs(board.createdAt).format("MMM DD, YYYY")}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#2c2420]/80">Detectives</span>
              <div className="flex -space-x-2">
                {collaborators?.map((user, i) => (
                  <img
                    key={i}
                    src={user?.imageUrl ?? ""}
                    alt={`Detective ${i + 1}`}
                    className="w-6 h-6 rounded-full border-2 border-[#FDFBF7] object-cover shadow-sm"
                    />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
