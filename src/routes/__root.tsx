import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 border-b bg-[#2c2420] text-[#ECD5B8]">
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
      <div className="flex-1 overflow-auto bg-[#ECD5B8]">
        <Outlet />
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
