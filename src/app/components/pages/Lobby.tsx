import { Board, Collaboration, User, ZeroSchema } from "@/schema";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaPlus, FaTrash, FaBell } from "react-icons/fa6";
import { Input, InputRef, Modal, Button, Drawer } from "antd";
import { PendingRequest } from "../ui/PendingRequest";
import { DetectiveBoardCard } from "../ui/DetectiveBoardCard";
import { SharedBoardCard } from "../ui/SharedBoardCard";
import { FaTimes } from "react-icons/fa";
import posthog from "posthog-js";

export function Lobby() {
  const { userId } = useAuth();
  const z = useZero<ZeroSchema>();
  const inputRef = useRef<InputRef | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Queries
  const [boards, boardStatus] = useQuery(z.query.board.where("creatorId", "=", userId!));
  const [user, userStatus] = useQuery(z.query.user.where("id", "=", userId!).one());

  const [pendingCollaborations, pendingCollaborationStatus] = useQuery(
    z.query.collaboration.where(q => q.and(
      q.cmp('status', '=', 'pending'),
      q.cmp('boardCreatorId', '=', userId!),
    )).related("user")
  );
  const [acceptedCollaborationBoards, acceptedCollaborationBoardsStatus] = useQuery(
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
    posthog.capture('create_board', { userId: userId! });
    z.mutateBatch(async tx => {
      const boardId = crypto.randomUUID();
      await tx.board.insert({
        id: boardId,
        creatorId: userId!,
        title,
      });

      await tx.collaboration.insert({
        id: crypto.randomUUID(),
        boardId,
        userId: userId!,
        status: 'accepted',
        boardCreatorId: userId!,
      });
    })


    handleCloseModal();
  }, [z.mutate.board, z.mutate.collaboration, userId, title]);

  const handleDeleteBoard = useCallback(
    async (boardId: string) => {
      posthog.capture('delete_board', { boardId, userId: userId! });
      await z.mutate.board.delete({ id: boardId });
    },
    [z.mutate.board, userId]
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



  if (boardStatus.type === 'unknown' || pendingCollaborationStatus.type === 'unknown' || acceptedCollaborationBoardsStatus.type === 'unknown' || userStatus.type === 'unknown') {
    return  <div className="min-h-screen w-full bg-[#FFF6EB] p-12"/>
  }


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
    <div className="min-h-[calc(100vh-164px)] w-full bg-[#FFF6EB] p-12 md:p-4">
      <Modal
        destroyOnClose
        afterOpenChange={handleAfterOpenChange}
        title="Create New Case"
        okText="Create"
        okButtonProps={{
          disabled: title.length === 0,
        }}
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
          <h3 className="text-2xl font-black leading-tighter bg-[#FFF6EB] bg-clip-text text-transparent">
            Pending Collaborations
          </h3>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={400}
        closeIcon={<FaTimes className="text-xl text-[#FFF6EB]" />}
        styles={{
          header: {
            backgroundColor: '#2C2421',
            borderBottom: '2px solid rgba(139, 69, 19, 0.1)',
            padding: '16px 24px',
          },
          body: {
            backgroundColor: '#FFF6EB',
            padding: '24px',
          },
        }}
      >
        {pendingCollaborations.length > 0 ? (
          <div className="flex flex-col gap-4">
            {pendingCollaborations.map(collaboration => (
              <PendingRequest key={collaboration.id} collaboration={collaboration as Collaboration & {user: User}} />
            ))}
          </div>
        ) : (
          <div className="p-6 h-full flex items-center justify-center  rounded-xl text-xl text-center">
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

        <div className="flex">
          {/* Main Content */}
          <div className="flex-1">
            <h3 className="text-5xl md:text-4xl font-black leading-tighter bg-gradient-to-r from-[#B4540A] to-[#eb8415] bg-clip-text text-transparent mb-8">
              Detective Boards
            </h3>

            {renderSharedBoards()}

            {/* Board Grid */}
            <div className="flex gap-4">
              <h4 className="text-2xl font-serif text-[#8B4513] mb-6">Your Cases {boards.length}/{user?.maxBoards}</h4>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 bg-[#f6e6dc] rounded-lg p-4">
              <Button
                onClick={handleOpenModal}
                disabled={boards.length >= (user?.maxBoards ?? 2)}
                className={`h-full min-h-48 flex items-center gap-2 text-base font-semibold border-2 border-dashed ${
                  boards.length >= (user?.maxBoards ?? 2)
                    ? "bg-[#FDFBF7]/50 text-[#8B4513]/50 border-[#8B4513]/50" 
                    : "bg-[#FDFBF7] text-[#8B4513] border-[#8B4513]"
                }`}
              >
                <FaPlus className={`rounded-full text-2xl p-1 ${
                  boards.length >= (user?.maxBoards ?? 2)
                    ? "bg-[#8B4513]/50 text-white/50"
                    : "bg-[#8B4513] text-white" 
                }`} />
                Create New Case
              </Button>
                {boards.map((board) => (
                  <DetectiveBoardCard
                    key={board.id}
                    board={board}
                    onHoverPreload={handleOnHoverPreloadContents}
                    onDelete={handleDeleteBoard}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
