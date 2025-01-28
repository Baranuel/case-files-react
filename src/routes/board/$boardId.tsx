import { createFileRoute, redirect, useNavigate, useParams } from "@tanstack/react-router";

import { Board } from "@/features/canvas-board/components/Board";
import { ZeroSchema } from "@/schema";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/board/$boardId")({
  component: RouteComponent,
  beforeLoad: async ({ context, params }) => {
    if (!context.auth) {
      throw redirect({ to: "/sign-in" });
    }
    
    const { getToken } = context.auth;
    const token = await getToken({ template: "casefiles" });

    if (!token) {
      throw redirect({ to: "/sign-in" });
    }

    return { boardId: params.boardId };
  },
});

function RouteComponent() {
  const zero = useZero<ZeroSchema>();
  const navigate = useNavigate();
  const { boardId } = useParams({ strict: false });
  const [board, queryStatus] = useQuery(zero.query.board.where("id", "=", boardId!).one(), true);
  const {type} = queryStatus

  useEffect(() => {
    if(type !== 'complete') return;
    if(!board) navigate({to: '/lobby'})

  }, [type]);

   !!boardId && zero.query.element.related("content").where("boardId", "=", boardId).preload()



  return <Board  />;
}
