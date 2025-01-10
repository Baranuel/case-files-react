interface FolderProps {
  isOpen?: boolean;
}

export const Folder = ({ isOpen = false }: FolderProps) => {
  return (
    <div
      style={{
        zIndex: 20,
        viewTransitionName: "selected-item-folder",
        transitionDuration: "0.3s",
      }}
      className={` w-full min-w-[400px] h-full bg-[#E4C18D] rounded-sm py-4 pr-4 shadow-lg ${isOpen ? "-translate-x-[calc(102%)]" : "-translate-x-[35%]"} relative`}
    >
      {/* Tab */}
      <div className="absolute -right-8 top-8 w-8 h-24 bg-[#E4C18D] rounded-r-lg border-r border-t border-b border-[#C4A475] flex items-center justify-center">
        <div className="w-1 h-16 bg-[#C4A475] rounded-full" />
      </div>

      {/* Folder content */}
      <div className="w-full h-full border-2 border-[#C4A475] rounded-r-lg pr-4 bg-[#F5DEB3] p-6 relative">
        {/* Coffee Stains */}
        <div className="absolute top-24 left-32 w-20 h-20 rounded-full bg-[#8B4513] opacity-10 blur-sm" />
        <div className="absolute bottom-16 right-24 w-16 h-16 rounded-full bg-[#8B4513] opacity-15 blur-sm" />
        
        {/* Existing content */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-24 h-24 bg-gray-300 rounded-lg shadow-inner flex items-center justify-center">
            <span className="text-4xl text-gray-500">📷</span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-[#8B4513] text-2xl font-bold">Long Case #247</h2>
            <p className="text-[#8B4513] opacity-75">Last modified: 12/25/2023</p>
          </div>
        </div>
        
        {/* Additional Details */}
        <div className="mb-6 text-[#8B4513] opacity-75 text-sm">
          <p>Status: Under Investigation</p>
          <p>Priority: High</p>
          <p>Assigned to: Agent Smith</p>
        </div>

        <div className="space-y-4">
          <div className="h-3 bg-[#C4A475] rounded-full w-full opacity-30" />
          <div className="h-3 bg-[#C4A475] rounded-full w-5/6 opacity-30" />
          <div className="h-3 bg-[#C4A475] rounded-full w-4/6 opacity-30" />
        </div>

        <div className="mt-8 flex gap-3">
          <div className="w-16 h-16 bg-[#C4A475] rounded-lg opacity-30" />
          <div className="w-16 h-16 bg-[#C4A475] rounded-lg opacity-30" />
          <div className="w-16 h-16 bg-[#C4A475] rounded-lg opacity-30" />
        </div>

        {/* Confidential Stamp - moved to bottom */}
        <div className="absolute -rotate-12 bottom-12 right-8 border-4 border-red-600 rounded px-4 py-2 text-red-600 font-bold text-xl opacity-80">
          CONFIDENTIAL
        </div>
      </div>
    </div>
  );
};
