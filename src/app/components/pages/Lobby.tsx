import { ZeroSchema } from "@/schema";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ElementType, useCallback, useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import { Alert, Input, InputRef, Modal, Popconfirm } from "antd";
import { Button } from "../ui/Button";

export function Lobby() {
  const { userId } = useAuth();
  const z = useZero<ZeroSchema>();
  const controller = new AbortController();
  const inputRef = useRef<InputRef | null>(null);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const [boards, boardsStatus] = useQuery(
    z.query.board.where("creatorId", "=", userId!)
  );

  const [pendingCollaborations, pendingCollaborationsStatus] = useQuery(
    z.query.collaboration.where(q => q.and(
      q.cmp('status', '=', 'pending'),
    ))
  );


  const [elements, elementsStatus] = useQuery(z.query.element.related("board"));

  const handleOnHoverPreloadContents = useCallback(
    (boardId: string) => {
      z.query.element
        .related("content")
        .where("boardId", "=", boardId)
        .preload();
        
        z.query.collaboration.where(q => q.and(
          q.cmp('boardId', '=', boardId),
          q.cmp('userId', '=', userId!),
        )).preload();

        z.query.board.where('id', '=', boardId).preload();
      },
    [z.query.element, z.query.collaboration, userId]
  );

  const detectiveBoards = boards;
  const findElementsByBoardId = (boardId: string) => {
    return elements.reduce((acc, element) => {
      if (element.boardId === boardId) {
        acc++;
      }
      return acc;
    }, 0);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setTitle("");
  };

  const handleOpenModal = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleCreateBoard = useCallback(async () => {
    const boardId = crypto.randomUUID();

    await z.mutate.board.insert({
      id: boardId,
      creatorId: userId!,
      title,
    });
    await z.mutate.collaboration.insert({
      id: crypto.randomUUID(),
      boardId,
      userId: userId!,
      status: 'accepted',
      boardCreatorId: userId!,
    });
    handleCloseModal();
  }, [z.mutate.board, userId, title, handleCloseModal]);

  const handleDeleteBoard = useCallback(
    async (boardId: string) => {
      await z.mutate.board.delete({ id: boardId });
    },
    [z.mutate.board]
  );

  useEffect(() => {
    window.addEventListener(
      "keydown",
      (e) => {
        e.key === "Enter" && handleCreateBoard();
      },
      { signal: controller.signal }
    );

    return () => {
      controller.abort();
    };
  }, [handleCreateBoard, handleCloseModal]);

  const handleAfterOpenChange = useCallback(
    (open: boolean) => {
      if (!inputRef.current) return;
      if (open) {
        inputRef.current?.focus();
      }
    },
    [inputRef]
  );

  if (boardsStatus.type !== "complete") {
    return <div className="min-h-[calc(80vh-4rem)] mx-auto px-4 py-8" />;
  }

  return (
    <div className="h-full w-full bg-[#FFF6EB] p-12">
      <Modal
        destroyOnClose
        afterOpenChange={handleAfterOpenChange}
        title="Create New Board"
        okText="Create"
        open={open}
        onOk={handleCreateBoard}
        onCancel={handleCloseModal}
      >
        <Input
          ref={inputRef}
          value={title}
          autoFocus
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Board Title"
        />
      </Modal>

      <div className="max-w-7xl mx-auto">
        <h3 className="text-5xl md:text-4xl font-black leading-tighter bg-gradient-to-r from-[#B4540A] to-[#eb8415]  bg-clip-text text-transparent mb-6">
          Detective Boards
        </h3>

        {pendingCollaborations.length > 0 && (
          <div className="mb-4 space-y-4">
            {pendingCollaborations.map((collab) => (
              <div key={collab.id} className="flex items-center justify-between p-4 bg-[#FDFBF7] rounded-lg border border-[#8B4513]">
                <div>
                  <h4 className="font-medium text-[#2c2420]">Collaboration Request</h4>
                  <p className="text-sm text-[#2c2420]/60">
                    {collab.boardCreatorId} has invited you to collaborate on their board
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    // onClick={() => handleAcceptCollaboration(collab.id)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accept
                  </Button>
                  <Button 
                    // onClick={() => handleRejectCollaboration(collab.id)}
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        

        <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <button
            onClick={handleOpenModal}
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
                  params={{ boardId: board.id }}
                  onMouseEnter={() => handleOnHoverPreloadContents(board.id)}
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
                        Opened on{" "}
                        {dayjs(board.createdAt).format("MMM DD, YYYY")}
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

                <Popconfirm
                  title="Delete Board"
                  description="Are you sure you want to delete this board?"
                  onConfirm={async () => await handleDeleteBoard(board.id)}
                  okText="Delete"
                  cancelText="Cancel"
                  placement="right"
                  color="var(--color-bg-primary)"
                  icon={
                    <FaTrash className="text-red-500 hover:text-red-600 text-sm mr-2 mt-1" />
                  }
                  okButtonProps={{
                    className: "bg-red-500 hover:bg-red-600",
                    type: "primary",
                    danger: true,
                  }}
                >
                  <button
                    className="absolute top-2 right-2 p-2 rounded-full bg-[#FDFBF7]/80 
                             hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Delete Board"
                  >
                    <FaTrash className="text-red-500 hover:text-red-600 w-4 h-4" />
                  </button>
                </Popconfirm>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
