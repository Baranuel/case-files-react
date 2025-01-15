import { schema } from "@/schema";
import { Zero } from "@rocicorp/zero";
import { ZeroProvider } from "@rocicorp/zero/react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

const zero = new Zero({
  userID:'test123',
  schema:schema,
  server: 'http://localhost:4848',
  kvStore:'mem'
})

function RootComponent() {
  return (
    <ZeroProvider zero={zero}>

    <div className="flex flex-col h-screen">
      <div style={{viewTransitionName: 'root-header'}} className="z-50 p-4 border-b bg-[#2c2420] text-[#ECD5B8]">
        <Link
          params={{ userId: "sss" }}
          to="/lobby/$userId"
          activeProps={{
            className: "font-bold",
          }}
          >
          Lobby
        </Link>
      </div>
      <div className="flex-1 bg-[#ECD5B8]">
        <Outlet />
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
      </ZeroProvider>
  );
}
