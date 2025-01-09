import { createFileRoute } from "@tanstack/react-router";
import { ReplicacheProvider } from "../../providers/ReplicacheProvider";
import useWebSocket from "react-use-websocket";
import { CanvasProvider } from "../../providers/CanvasProvider";
import { TriggerReplicachePull } from "../../components/TriggerReplicachePull";

export const Route = createFileRoute("/app/$boardId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { boardId } = Route.useParams();

  return (
    <ReplicacheProvider boardId={boardId}>
      <TriggerReplicachePull boardId={boardId} />
      <CanvasProvider>
        <div>Hello {boardId}</div>
      </CanvasProvider>
    </ReplicacheProvider>
  );
}
