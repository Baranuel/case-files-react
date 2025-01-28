import { ZeroSchema } from "@/schema";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ElementType, useCallback, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { Button } from "../ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import {Input, Modal} from 'antd'


export function Lobby() {
  const { userId } = useAuth();
  const z = useZero<ZeroSchema>();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  const [boards, boardsStatus] = useQuery(
    z.query.board.where("creatorId", "=", userId!)
  )

  const [elements, elementsStatus] = useQuery(
    z.query.element.related("board")
  )


  const detectiveBoards = boards.sort((a, b) => {
    return dayjs(a.createdAt).diff(dayjs(b.createdAt))
  })

  const findElementsByBoardId = (boardId: string) => {
    return elements.reduce((acc, element) => {
      if (element.boardId === boardId) {
        acc++;
      }
      return acc;
    }, 0);
  }

  const handleCloseModal = () => {
    setOpen(false);
    setTitle('');
  }

  const handleCreateBoard = useCallback(async () => {
    await z.mutate.board.insert({
      id: crypto.randomUUID(),
      creatorId: userId!,
      title
    });
    handleCloseModal();
  }, [z.mutate.board, userId, title]);


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

      <Modal
            destroyOnClose
            title="Create New Board"
            open={open}
            onOk={handleCreateBoard}
            onCancel={handleCloseModal}
      >
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Board Title" />
      </Modal>

      <div className="max-w-7xl mx-auto">
        <h3 className="text-5xl md:text-4xl font-black leading-tighter bg-gradient-to-r from-[#B4540A] to-[#eb8415]  bg-clip-text text-transparent mb-6">
          Detective Boards
        </h3>

        <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <button
            onClick={() => setOpen(true)}
            className="h-64 border-2 border-dashed border-[#8B4513] rounded-lg hover:border-[#B4540A] hover:shadow-xl hover:-translate-y-1 bg-[#FDFBF7] transition-all "
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
          {detectiveBoards.map((board, index) => (
            <motion.div
            layout
            key={board.id}
            className="relative group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            >
              <Link
                to="/board/$boardId"
                params={{boardId: board.id}}
                className="w-full h-64 bg-[#FDFBF7] rounded-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                <div className="h-full p-6 flex flex-col  gap-4 border border-[#8B4513] rounded-lg ">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <h2 className="text-[#2c2420] text-lg text-left font-serif font-bold">
                        {board.title}
                      </h2>
                    </div>
                      <p className="text-sm font-mono text-[#2c2420]/60">
                        Opened on {dayjs(board.createdAt).format('MMM DD, YYYY')}
                      </p>
                      <div className="border-t border-dashed border-[#8B4513]/30" />
                  </div>
                    <div className="h-full flex items-end justify-between grow mt-6 gap-4">
                      <span className="text-base  text-[#8B4513]">
                        {findElementsByBoardId(board.id)} Elements
                      </span>
                      <div className="text-base font-bold text-amber-700">
                        CONFIDENTIAL
                      </div>
                    </div>
                  </div>
                </Link>

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
