import { useLocation, useRouterState } from "@tanstack/react-router";

export const Layout = ({ children }: { children: React.ReactNode }) => {

    const router = useRouterState();
    const showFooter = !router.location.pathname.includes('board')
  return (
    <div className="min-h-[calc(100vh-4rem)] h-full w-full bg-[#FFF6EB] flex flex-col">
      <main className="flex-1">
        {children}
        </main>
      {showFooter && <footer className="min-h-[150px] bg-[#2C2421]"></footer>}
    </div>
  );
};
