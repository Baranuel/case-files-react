import { createFileRoute } from "@tanstack/react-router";

import { Board } from "@/features/canvas-board/components/Board";
import { useAuth, useClerk, useUser } from '@clerk/clerk-react'
import { useCallback } from "react";

export const Route = createFileRoute("/board/$boardId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { boardId } = Route.useParams();

  return (
      <Board boardId={boardId} />
  );
}
