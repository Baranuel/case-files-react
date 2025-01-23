import { Lobby } from "@/app/components/pages/Lobby";
import { createFileRoute, redirect } from "@tanstack/react-router";

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
  return <Lobby/>
}