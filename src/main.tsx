import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

const isDev = import.meta.env.MODE === "development";

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ClerkProvider
      afterSignOutUrl={
        isDev ? "http://localhost:3001" : "https://casefiles.honoserver.com"
      }
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
    >
      <RouterProvider router={router} />
    </ClerkProvider>
  );
}
