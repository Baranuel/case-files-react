import { createFileRoute, redirect } from "@tanstack/react-router";

import { Board } from "@/features/canvas-board/components/Board";

export const Route = createFileRoute("/board/$boardId")({
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

  return (
      <Board />
  );
}
