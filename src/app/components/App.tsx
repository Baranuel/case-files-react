import { routeTree } from "@/routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useAuthentication } from "../hooks/use-authentication";
import { useAuth, useClerk } from "@clerk/clerk-react";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: null
  }
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const App = () => {
    const auth = useAuth()

  return <RouterProvider router={router} context={{auth}} />;
};
