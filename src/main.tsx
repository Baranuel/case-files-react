import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";
import { App } from "./app/components/App";
import { BASE_URL } from "./constants";
const rootElement = document.getElementById("app")!;


if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <ClerkProvider
    afterSignOutUrl={BASE_URL}
    publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
    signInForceRedirectUrl={BASE_URL+'/lobby'}>
      <App/>
    </ClerkProvider>
  );
}
