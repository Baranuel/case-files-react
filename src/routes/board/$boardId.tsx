import { createFileRoute } from "@tanstack/react-router";
import { CanvasProvider } from "@/app/providers/CanvasProvider";
import { ReplicacheProvider } from "@/app/providers/ReplicacheProvider";

import { TriggerReplicachePull } from "@/components/TriggerReplicachePull";
import { Canvas } from "@/features/canvas-board/components/Canvas";

export const Route = createFileRoute("/board/$boardId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { boardId } = Route.useParams();

  return (
    <ReplicacheProvider boardId={boardId}>
      <TriggerReplicachePull boardId={boardId} />
      <CanvasProvider>
        <Canvas />
      </CanvasProvider>
    </ReplicacheProvider>
  );
}
