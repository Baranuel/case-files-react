import { Button } from "@/app/components/ui/Button";
import { Layout } from "@/app/components/ui/Layout";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/not-found")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center gap-4">
      <h1 className="text-8xl font-bold text-[#B4540A]">404</h1>
      <p className="text-2xl text-[#2C2421]">Oops! Board not found</p>
      <p className="text-lg text-gray-600">
        The board you are looking for doesn't exist or has been removed.
      </p>
      <Link to="/lobby">
        <Button variant="primary" className="">
          Go to Lobby
        </Button>
      </Link>
    </div>
  );
}
