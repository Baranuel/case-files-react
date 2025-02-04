import { createFileRoute, redirect, useNavigate, useParams } from "@tanstack/react-router";

import { Board } from "@/features/canvas-board/components/Board";
import { ZeroSchema } from "@/schema";
import { useQuery, useZero } from "@rocicorp/zero/react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

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
  const { user } = useUser();
  const userId = user?.id;

  const { boardId } = useParams({ strict: false });

  const [board, queryStatus] = useQuery(zero.query.board.where("id", "=", boardId!).one(), true);
  const [collaboration, collaborationsQueryStatus] = useQuery(zero.query.collaboration.where(q => q.and(
    q.cmp('boardId', '=', boardId!),
    q.cmp('userId', '=', userId!),
  )).one(), true);
  const {type} = queryStatus


  useEffect(() => {
    if(type !== 'complete' || collaborationsQueryStatus?.type !== 'complete') return;
    if(!board) navigate({to: '/not-found'})

    if(board && !collaboration || collaboration?.status === 'rejected' || collaboration?.status === 'pending') {
      navigate({to: '/request-access', search: {boardId}})
    }
  }, [type, collaborationsQueryStatus]);




  return <Board  />;
}
