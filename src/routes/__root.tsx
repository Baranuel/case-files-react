import {
  Link,
  Outlet,
  createRootRoute,
  createRootRouteWithContext,
  useParams,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import {
  useAuth,
} from "@clerk/clerk-react";
import { Zero } from "@rocicorp/zero";
import { useEffect, useState } from "react";
import { schema } from "@/schema";
import { ZeroProvider } from "@rocicorp/zero/react";
import Navigation from "@/app/components/Navigation";
import { RouterContext } from "@/types/router-context";


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


    const zero = new Zero({
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
    });





  return (
    <ZeroProvider zero={zero}>
      <div className="flex-1 bg-[#FFF6EB] flex flex-col h-screen">
        <Navigation />
        <Outlet />
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </ZeroProvider>
  );
}
