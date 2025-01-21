import { Lobby } from "@/app/components/pages/Lobby";
import { Loading } from "@/app/components/ui/Loading";
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
  return <Lobby/>
}