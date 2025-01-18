import {
  Link,
  Outlet,
  createRootRoute,
  useParams,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import {
  ClerkProvider,
  SignIn,
  SignInButton,
  useAuth,
  useClerk,
  UserButton,
} from "@clerk/clerk-react";
import { Zero } from "@rocicorp/zero";
import { useEffect, useState } from "react";
import { schema } from "@/schema";
import { ZeroProvider } from "@rocicorp/zero/react";
import Navigation from "@/app/components/Navigation";
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const isProd = import.meta.env.PROD;
  const { getToken, userId} = useAuth();
  const [token, setToken] = useState<string | null>(null);


  const getAuthToken = async () => {
    const token = await getToken({ template: "casefiles" });
    return token
  };


  useEffect(() => {
    getAuthToken().then( t => setToken(t));
  }, []);

  
    const zero = new Zero({
      userID: userId ?? 'anon',
      schema,
      server: isProd
        ? import.meta.env.VITE_ZERO_SERVER_URL_PROD
        : import.meta.env.VITE_ZERO_SERVER_URL_DEV,
      kvStore: "mem",
      auth: async (err) => {
        if(err === 'invalid-token') return await getAuthToken() ?? token!
        return token!
      },
    });





  return (
    <ZeroProvider zero={zero}>
      <div className="flex-1 bg-[#ECD5B8] flex flex-col h-screen">
        <Navigation />
        <Outlet />
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </ZeroProvider>
  );
}
