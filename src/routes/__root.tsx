import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="flex flex-col w-full h-full">
        <Link
          params={{ userId: "sss" }}
          to="/lobby/$userId"
          activeProps={{
            className: "font-bold",
          }}
        >
          Lobby
        </Link>
        <div className="flex-1">
      <Outlet />
        </div>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
