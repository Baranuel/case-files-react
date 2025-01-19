

export const Layout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className="h-[calc(100vh-4rem)] w-full bg-[#FFF6EB] ">
        {children}
        </div>
    )
}