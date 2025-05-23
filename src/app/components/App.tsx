import { routeTree } from "@/routeTree.gen";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { ConfigProvider } from "antd";
import "@/index.css";
import { theme } from "@/styles/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
      theme={{
        token: {
          colorPrimary: "#B4540A",
        },
        components: {
          DatePicker: {
            colorBgBase: "#FFF0DF",
            addonBg: "#FFF0DF",
            colorTextPlaceholder: "#8B4513",
            colorTextDisabled: "#A8A8A8",
            colorBgContainer: "#FFF0DF",
            colorBorder: "#C4A475",
            colorBorderSecondary: "#C4A475",
            colorPrimaryHover: "#B4540A",
            colorPrimaryActive: "#B4540A",
          },
          Message: {
            colorSuccess: "#B4540A",
          },
        },
      }}
    >
        <RouterProvider router={router} context={{ auth }} />
    </ConfigProvider>
  );
};
