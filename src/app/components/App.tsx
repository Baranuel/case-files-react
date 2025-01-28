import { routeTree } from "@/routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { ConfigProvider } from "antd";
import '@/index.css'
import { theme } from "@/styles/theme";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    auth: null,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const App = () => {
  const auth = useAuth();
  return (
    <ConfigProvider
      theme={theme}
    >
      <RouterProvider router={router} context={{ auth }} />
    </ConfigProvider>
  );
};
