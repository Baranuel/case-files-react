import { createFileRoute, useNavigate, useSearch, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { Button } from "@/app/components/ui/Button";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { ZeroSchema } from "@/schema";
import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { FaLock, FaSpinner, } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

export const Route = createFileRoute("/request-access")({
  component: RequestAccess,
  beforeLoad: async ({ context }) => {
    if(!context.auth) return
    const { getToken } = context.auth;
    const token = await getToken({ template: "casefiles" });

    if (!token) {
      throw redirect({ to: "/sign-in" });
    }
  },
  validateSearch: z.object({
    boardId: z.string().optional(),
  }),
});



function RequestAccess() {
  const { boardId } = useSearch({ from: "/request-access" });
  const { userId } = useAuth();
  const navigate = useNavigate();

  const z = useZero<ZeroSchema>();
  const [isLoading, setIsLoading] = useState(false);

  const [board, boardQueryStatus] = useQuery(
    z.query.board.where("id", "=", boardId!).one());

  const [boards, boardsQueryStatus] = useQuery(
    z.query.board
  );

  const [collaboration, collaborationsQueryStatus] = useQuery(
    z.query.collaboration
      .where((q) =>
        q.and(q.cmp("boardId", "=", boardId!), q.cmp("userId", "=", userId!))
      )
      .one(),
    true
  );

  const handleRequestAccess = async () => {
    if (!boardId || !userId) return;

    setIsLoading(true);
    try {
      await z.mutate.collaboration.insert({
        id: crypto.randomUUID(),
        boardId,
        boardCreatorId: board?.creatorId!,
        userId,
        status: "pending",
      });
    } catch (error) {
      console.error("Failed to request access:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(! boardId || boardQueryStatus.type === "unknown")  return
    if (!board && boardQueryStatus.type === "complete") navigate({ to: "/not-found" });

    if (collaboration?.status === "accepted") {
      navigate({ to: "/board/$boardId", params: { boardId: boardId! } });
    }
  }, [collaboration?.status, navigate, boardId, board, boardQueryStatus.type]);

  if (
    collaborationsQueryStatus.type !== "complete" ||
    boardQueryStatus.type !== "complete"
  )
    return (
      <div className="flex-1 w-full flex items-center justify-center">

      </div>
    );


  if(collaboration?.status === 'pending') {
    return (
      <div className="min-h-[calc(100vh-4rem-100px)] w-full flex items-center justify-center bg-[#FFF6EB]">
        <div className="max-w-md w-full p-8 bg-[#FDFBF7] rounded-lg border-2 border-[#8B4513] shadow-xl">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[#8B4513] flex items-center justify-center shadow-lg">
              <FaSpinner className="text-[#FDFBF7] text-2xl animate-spin" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#8B4513] mb-2">
                Access Request Sent
              </h1>
              <p className="text-[#8B4513]/80">
                Your request is pending. You will be redirected to the board once it is approved.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(collaboration?.status === 'rejected') {
    return (
      <div className="min-h-[calc(100vh-4rem-100px)] w-full flex items-center justify-center bg-[#FFF6EB]">
        <div className="max-w-md w-full p-8 bg-[#FDFBF7] rounded-lg border-2 border-[#8B4513] shadow-xl">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
              <FaTimes className="text-[#FDFBF7] text-2xl" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#8B4513] mb-2">
                Access Request Rejected
              </h1>
              <p className="text-[#8B4513]/80">
                Your request was rejected. Please try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem-100px)] w-full flex items-center justify-center bg-[#FFF6EB]">
      <div className="max-w-md w-full p-8 bg-[#FDFBF7] rounded-lg border-2 border-[#8B4513] shadow-xl">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-[#8B4513] flex items-center justify-center shadow-lg">
            <FaLock className="text-[#FDFBF7] text-2xl" />
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#8B4513] mb-2">
              Request Access
            </h1>
            <p className="text-[#8B4513]/80">
              You need permission to access this detective board.
            </p>
          </div>

          <Button
            onClick={handleRequestAccess}
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            Request Access
          </Button>
        </div>
      </div>
    </div>
  );
}
