import { ZeroSchema } from "@/schema";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { Button } from "../ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
export function Lobby() {
  const { userId } = useAuth();
  const z = useZero<ZeroSchema>();
  const navigate = useNavigate();

  const [boards, boardsStatus] = useQuery(
    z.query.board.where("creatorId", "=", userId!)
  );

  const handleCreateBoard = useCallback(async () => {
    await z.mutate.board.insert({
      id: crypto.randomUUID(),
      creatorId: userId!,
      title: `Case #${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0")}`,
    });
  }, [z.mutate.board, userId]);


  console.log(dayjs(boards[0]?.createdAt));

  const handleDeleteBoard = useCallback(
    async (boardId: string) => {
      await z.mutate.board.delete({ id: boardId });
    },
    [z.mutate.board]
  );

  if (boardsStatus.type !== "complete") {
    return <div className="min-h-[calc(80vh-4rem)] mx-auto px-4 py-8" />;
  }

  return (
    <div className="h-full w-full bg-[#FFF6EB] p-12">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-5xl md:text-4xl font-black leading-tighter bg-gradient-to-r from-[#B4540A] to-[#eb8415]  bg-clip-text text-transparent mb-6">
          Detective Boards
        </h3>

        <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <button
            onClick={handleCreateBoard}
            className="group h-64 border-2 border-dashed border-[#8B4513] rounded-lg hover:border-[#B4540A] hover:shadow-xl hover:-translate-y-1 bg-[#FDFBF7] transition-all "
          >
            <div className="flex flex-col items-center justify-center h-full p-6">
              <div className="w-16 h-16 rounded-full bg-[#8B4513] flex items-center justify-center shadow-lg">
                <FaPlus className="text-[#FDFBF7] text-2xl" />
              </div>
              <p className="mt-4 text-[#2c2420] font-serif text-lg">
                Open New Case
              </p>
            </div>
          </button>
        <AnimatePresence>
          {boards.map((board, index) => (
            <motion.div
            layout
            key={board.id}
            className="relative group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            >
              <button
                onClick={() => navigate({ to: `/board/${board.id}` })}
                className="w-full h-64 bg-[#FDFBF7] rounded-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                <div className="h-full p-6 flex flex-col justify-between border border-[#8B4513] rounded-lg bg-[url('/paper-texture.jpg')] bg-cover">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <h2 className="text-[#2c2420] text-xl font-serif font-bold">
                        {board.title}
                      </h2>
                    </div>
                    <p className="text-[#2c2420]/60 text-sm font-mono">
                      Opened on {dayjs(board.createdAt).format('MMM DD, YYYY')}
                    </p>
                    <div className="mt-4 border-t border-dashed border-[#8B4513]/30" />
                  </div>
                  <div className="text-xs text-[#8B4513] font-mono">
                    CONFIDENTIAL
                  </div>
                </div>
              </button>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBoard(board.id);
                }}
                className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                >
                <FaTrash />
              </Button>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
