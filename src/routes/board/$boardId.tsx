import { createFileRoute } from "@tanstack/react-router";

import { Board } from "@/features/canvas-board/components/Board";

export const Route = createFileRoute("/board/$boardId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { boardId } = Route.useParams();

  return <Board boardId={boardId} />
}
