import { cn } from "@/utils/cn";
import { useLocation, useRouterState } from "@tanstack/react-router";
import Navigation from "./Navigation";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouterState();
  const isBoard = router.location.pathname.includes("board") 
  
  return (
    <div
      className={cn("h-full  w-fit-content bg-[#FFF6EB] flex flex-col", {
      })}
    >
      <Navigation />
      <main className="flex-1 flex w-screen min-h-[calc(100vh-4rem-100px)] overflow-hidden">{children}</main>
      {!isBoard && (
        <footer className="h-[100px] w-full bg-[#2C2421] flex justify-center items-center">
          <p className="text-white">Developed by <a href="https://www.linkedin.com/in/samuel-baran-1706a9225/" target="_blank" rel="noopener noreferrer" className="text-white underline">Samuel Baran</a></p>
        </footer>
      )}
    </div>
  );
};
