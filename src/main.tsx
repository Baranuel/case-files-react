import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";
import { App } from "./app/components/App";
import { BASE_URL } from "./constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const rootElement = document.getElementById("app")!;


if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  const queryClient = new QueryClient(); 

  const clerkPublishableKey =  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
  
  root.render(
    <QueryClientProvider client={queryClient}>
    <ClerkProvider
    afterSignOutUrl={BASE_URL}
    publishableKey={clerkPublishableKey}
  >
      <App/>
    </ClerkProvider>
    </QueryClientProvider>
  );
}
