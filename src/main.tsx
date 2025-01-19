import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";
import { App } from "./app/components/App";
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
      <App/>
    </ClerkProvider>
  );
}
