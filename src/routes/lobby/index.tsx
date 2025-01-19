import { Loading } from "@/app/components/Loading";
import { ZeroSchema } from "@/schema";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";

export const Route = createFileRoute("/lobby/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if(!context.auth) return
    const { getToken } = context.auth;
    const token = await getToken({ template: "casefiles" });

    if (!token) {
      throw redirect({ to: "/sign-in" });
    }
  },
});

function RouteComponent() {
  const { userId, isLoaded } = useAuth();
  const z = useZero<ZeroSchema>();
  
  const [boards] = useQuery(
    useMemo(
      () => z.query.board.where("creatorId", "=", userId!),
      [z.query.board, userId]
    )
  );

  const handleCreateBoard = useCallback(async () => {
    const randomID = crypto.randomUUID();
    await z.mutate.board.insert({
      id: randomID,
      creatorId: userId!,
      title: "New Board",
    });
  }, [z.mutate.board, userId]);

  if (!isLoaded) return <Loading />;

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Board Button */}
        <button
          onClick={handleCreateBoard}
          className="h-48 border-2 border-dashed border-[#2c2420] rounded-lg hover:border-[#ECD5B8] transition-colors duration-200"
        >
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="w-12 h-12 rounded-full bg-[#2c2420] group-hover:bg-[#ECD5B8] flex items-center justify-center transition-colors duration-200">
            </div>
            <p className="mt-4 text-[#2c2420] font-medium">
              Create New Board
            </p>
          </div>
        </button>

        {/* Existing Boards */}
        {boards.map((board) => (
          <Link
            key={board.id}
            params={{ boardId: board.id }}
            to="/board/$boardId"
            className="group bg-[#2c2420] rounded-lg hover:shadow-xl transition-all duration-200 overflow-hidden"
          >
            <div className="h-48 p-6 flex flex-col justify-between">
              <div>
                <h2 className="text-[#ECD5B8] text-xl font-semibold mb-2">
                  {board.title}
                </h2>
                <p className="text-[#ECD5B8]/70 text-sm">
                  Created {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#ECD5B8]/60 text-sm">
                  { 0} elements
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}