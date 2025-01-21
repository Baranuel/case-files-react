import { Loading } from "@/app/components/ui/Loading";
import { ZeroSchema } from "@/schema";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useZero } from "@rocicorp/zero/react";
import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";

export function Lobby() {
  const { userId } = useAuth();
  const z = useZero<ZeroSchema>();
  const navigate = useNavigate();

  const [boards, boardsStatus] = useQuery(z.query.board.where("creatorId", "=", userId!));

  
  const handleCreateBoard = useCallback(async () => {
    const randomID = crypto.randomUUID();
    await z.mutate.board.insert({
      id: randomID,
      creatorId: userId!,
      title: "New Board" + Math.random().toString(36).substring(7),
    });
  }, [z.mutate.board, userId]);
  
  const handleDeleteBoard =  useCallback(
    async(boardId: string) => {
      try {
        const r = await z.mutate.board.delete({
          id: boardId,
        });
        console.log(r)
      } catch (e) {
        console.log(e)
      }
    },
    [z.mutate.board]
  );
  
  if(boardsStatus.type !== 'complete') return     <div className="min-h-[calc(80vh-4rem)] mx-auto px-4 py-8"/>
  
  return (
    <div className="min-h-[calc(80vh-4rem)] mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#2c2420] mb-8">Your Boards</h1>
        <div className="grid grid-cols-4 gap-6">
          {/* Create New Board Button */}
          <button
            onClick={handleCreateBoard}
            className="group h-48 border-2 border-dashed border-[#2c2420] rounded-lg hover:border-[#B4540A] transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="h-full flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#2c2420] group-hover:bg-[#B4540A] flex items-center justify-center transition-colors duration-200">
                <FaPlus className="text-white" />
              </div>
              <p className="mt-4 text-[#2c2420] font-medium group-hover:text-[#B4540A]">
                Create New Board
              </p>
            </div>
          </button>

          {/* Existing Boards */}
          {boards.map((board) => (
            <>
              <div className="flex items-center justify-between">
                <button
                  key={board.id}
                  onClick={() => navigate({ to: `/board/${board.id}` })}
                  className="group bg-[#FFF0DF] rounded-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 overflow-hidden p-4 flex-grow"
                >
                  <div className="h-48 flex flex-col justify-between backdrop-blur-sm">
                    <div>
                      <h2 className="text-[#333] text-xl font-semibold mb-2">
                        {board.title}
                      </h2>
                      <p className="text-[#333]/70 text-sm">
                        Created {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#333]/60 text-sm">
                        {0} elements
                      </span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg
                          className="w-5 h-5 text-[#333]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBoard(board.id);
                    }}
                    className="w-16 h-12 border-2 border-solid border-red-600 rounded-lg bg-red-500 text-white hover:bg-red-700 transition-all duration-200 mt-2"
                  >
                    Delete
                  </button>
                </button>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
