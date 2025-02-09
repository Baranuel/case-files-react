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
import Navigation from "@/app/components/ui/Navigation";
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
  const isProd = import.meta.env.PROD;
  const {userId, getToken} = useAuth();

  console.log(import.meta.env.ZERO_AUTH_JWK)
  // Memoize the Zero instance to prevent recreation on re-renders
  const zero = useMemo(() => new Zero({
    userID: userId ?? 'anon',
    schema,
    server: isProd
      ? import.meta.env.VITE_ZERO_SERVER_URL_PROD
      : import.meta.env.VITE_ZERO_SERVER_URL_DEV,
    kvStore: "mem",
    auth: async (err) => {
      if(err === 'invalid-token') return await getToken({template:'casefiles'}) ?? token!
      return token!
    },
  }), [userId, token, isProd, getToken]);





  return (
    <ZeroProvider zero={zero}>
        <Layout>
           <Outlet />
        </Layout>
      {/* {!isProd && <TanStackRouterDevtools position="bottom-right" />} */}
    </ZeroProvider>
  );
}
