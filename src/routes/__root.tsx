import {
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import {
  useAuth,
} from "@clerk/clerk-react";
import { Zero } from "@rocicorp/zero";
import { schema } from "@/schema";
import { ZeroProvider } from "@rocicorp/zero/react";
import { RouterContext } from "@/types/router-context";
import { Layout } from "@/app/components/ui/Layout";
import { useMemo } from "react";


export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  loader: async ({context}) => {
    if(context.auth){
      return await context.auth.getToken({ template: "casefiles" });
    }
  },
});

function RootComponent() {
  const token = Route.useLoaderData()
  const {userId, getToken} = useAuth();

  const zero = useMemo(() => new Zero({
    userID: userId ?? 'anon',
    schema,
    server: import.meta.env.VITE_ZERO_SERVER_URL,
    kvStore: "mem",
    auth: async (err) => {
      if(err === 'invalid-token') return await getToken({template:'casefiles'}) ?? token!
      console.log('token', token)
      return token!
    },
  }), [userId, token, getToken]);





  return (
    <ZeroProvider zero={zero}>
        <Layout>
           <Outlet />
        </Layout>
    </ZeroProvider>
  );
}
