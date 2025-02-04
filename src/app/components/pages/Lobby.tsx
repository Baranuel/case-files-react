import { Board, ZeroSchema } from "@/schema";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash, FaBell } from "react-icons/fa6";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import { Alert, Input, InputRef, Modal, Popconfirm, Button, Drawer } from "antd";
import { PendingRequest } from "../ui/PendingRequest";
import { DetectiveBoardCard } from "../ui/DetectiveBoardCard";
import { SharedBoardCard } from "../ui/SharedBoardCard";

export function Lobby() {
  const { userId } = useAuth();
  const z = useZero<ZeroSchema>();
  const inputRef = useRef<InputRef | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Queries
  const [boards] = useQuery(z.query.board.where("creatorId", "=", userId!));

  const [pendingCollaborations] = useQuery(
    z.query.collaboration.where(q => q.and(
      q.cmp('status', '=', 'pending'),
      q.cmp('boardCreatorId', '=', userId!),
    ))
  );
  const [acceptedCollaborationBoards] = useQuery(
    z.query.collaboration.where(q => q.and(
      q.cmp('status', '=', 'accepted'),
      q.cmp('userId', '=', userId!),
      q.cmp('boardCreatorId', '!=', userId!),
    )).related("board", q => q.where(q => q.cmp('creatorId', '!=', userId!)))
  );

  // Handlers
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
    [z.query.element, z.query.collaboration, z.query.board, userId]
  );



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
  }, [z.mutate.board, z.mutate.collaboration, userId, title]);

  const handleDeleteBoard = useCallback(
    async (boardId: string) => {
      await z.mutate.board.delete({ id: boardId });
    },
    [z.mutate.board]
  );

  const handleCloseModal = () => {
    setOpen(false);
    setTitle("");
  };

  const handleOpenModal = () => setOpen(true);
  
  const handleAfterOpenChange = useCallback(
    (open: boolean) => {
      if (open && inputRef.current) {
        inputRef.current.focus();
      }
    },
    []
  );

  // Effects
  useEffect(() => {
    const controller = new AbortController();
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") handleCreateBoard();
    };

    window.addEventListener("keydown", handleEnter, { signal: controller.signal });
    return () => controller.abort();
  }, [handleCreateBoard]);

  // Render Methods
  const renderSharedBoards = () => {
    if (acceptedCollaborationBoards.length === 0) return null;
    return (
      <div className="mb-16">
        <h4 className="text-2xl font-serif text-[#8B4513] mb-6">Shared Cases</h4>
        <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-2 gap-2">
          {acceptedCollaborationBoards.map(collaboration => (
            <SharedBoardCard
              key={collaboration.id}
              board={collaboration.board as Board}
              onHoverPreload={handleOnHoverPreloadContents}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF6EB] p-12">
      <Modal
        destroyOnClose
        afterOpenChange={handleAfterOpenChange}
        title="Create New Case"
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
          placeholder="Case Title"
        />
      </Modal>

      <Drawer
        title={
          <h3 className="text-2xl font-black leading-tighter bg-gradient-to-r from-[#B4540A] to-[#eb8415] bg-clip-text text-transparent">
            Pending Collaborations
          </h3>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={400}
        styles={{
          header: {
            borderBottom: '2px solid rgba(139, 69, 19, 0.1)',
            padding: '16px 24px',
          },
          body: {
            backgroundColor: '#FFF6EB',
            padding: '24px',
          }
        }}
      >
        {pendingCollaborations.length > 0 ? (
          <div className="flex flex-col gap-4">
            {pendingCollaborations.map(collaboration => (
              <PendingRequest key={collaboration.id} collaboration={collaboration} />
            ))}
          </div>
        ) : (
          <div className="p-6 bg-[#FDFBF7] rounded-xl border-2 border-[#8B4513]/30 text-center">
            <p className="text-[#8B4513]/70 font-serif">No pending requests</p>
          </div>
        )}
      </Drawer>

      <div className="max-w-7xl mx-auto">
        <div className="fixed right-8 top-20 z-10">
          <Button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#8B4513] text-[#FDFBF7] hover:bg-[#B4540A] border-none h-12 w-12 rounded-full shadow-lg"
            style={{ padding: 0 }}
          >
            <FaBell className="text-xl" />
            {pendingCollaborations.length > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">
                  {pendingCollaborations.length}
                </span>
              </div>
            )}
          </Button>
        </div>

        <div className="flex gap-12">
          {/* Main Content */}
          <div className="flex-1">
            <h3 className="text-5xl md:text-4xl font-black leading-tighter bg-gradient-to-r from-[#B4540A] to-[#eb8415] bg-clip-text text-transparent mb-8">
              Detective Boards
            </h3>

            {renderSharedBoards()}

            {/* Board Grid */}
            <div className="flex  gap-4">
              <h4 className="text-2xl font-serif text-[#8B4513] mb-6">Your Cases</h4>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-1 lg:grid-cols-2 gap-2">
              <Button
                onClick={handleOpenModal}
                className="h-full min-h-32 bg-[#FDFBF7] text-[#8B4513] border-dashed border-2 border-[#8B4513] flex items-center gap-2 hover:bg-[#B4540A] hover:text-[#FDFBF7] text-base font-semibold"
                >
                  <FaPlus className="bg-[#8B4513] text-[#FDFBF7] rounded-full text-2xl p-1"  />
                  Create New Case
              </Button>
              <AnimatePresence>
                {boards.map((board) => (
                  <DetectiveBoardCard
                    key={board.id}
                    board={board}
                    onHoverPreload={handleOnHoverPreloadContents}
                    onDelete={handleDeleteBoard}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
