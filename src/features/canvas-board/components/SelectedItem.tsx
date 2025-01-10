import { useCanvas } from "@/app/providers/CanvasProvider";
import { Folder } from './Folder/Folder';
import { PaperLayers } from "./Folder/PaperLayers";


export function SelectedItem() {
  const { selectedItemId } = useCanvas();
  
  const mainContent = (
    <>
      <h1 className="text-2xl font-bold text-[#8B4513] mb-6">Selected Item</h1>
      
      <div className="space-y-4">
        <div className="bg-[#ECD5B8] p-4 rounded-lg border border-[#D4B492]">
          <label className="block text-[#8B4513] text-sm font-bold mb-2">
            Case Title
          </label>
          <input 
            type="text" 
            className="w-full bg-[#F5E6D3] text-[#8B4513] p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#D4B492] border border-[#D4B492]"
            placeholder="Enter case title..."
          />
        </div>

        <div className="bg-[#ECD5B8] p-4 rounded-lg border border-[#D4B492]">
          <label className="block text-[#8B4513] text-sm font-bold mb-2">
            Description
          </label>
          <textarea 
            className="w-full bg-[#F5E6D3] text-[#8B4513] p-2 rounded h-24 focus:outline-none focus:ring-2 focus:ring-[#D4B492] border border-[#D4B492]"
            placeholder="Enter case description..."
          />
        </div>

        <div className="bg-[#ECD5B8] p-4 rounded-lg border border-[#D4B492]">
          <label className="block text-[#8B4513] text-sm font-bold mb-2">
            Status
          </label>
          <select className="w-full bg-[#F5E6D3] text-[#8B4513] p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#D4B492] border border-[#D4B492]">
            <option>Open</option>
            <option>In Progress</option>
            <option>Closed</option>
          </select>
        </div>

        <div className="bg-[#ECD5B8] p-4 rounded-lg border border-[#D4B492]">
          <label className="block text-[#8B4513] text-sm font-bold mb-2">
            Priority
          </label>
          <div className="flex gap-4">
            <button className="bg-[#F5E6D3] px-4 py-2 rounded text-[#8B4513] hover:bg-[#E8D1B9] border border-[#D4B492]">Low</button>
            <button className="bg-[#F5E6D3] px-4 py-2 rounded text-[#8B4513] hover:bg-[#E8D1B9] border border-[#D4B492]">Medium</button>
            <button className="bg-[#F5E6D3] px-4 py-2 rounded text-[#8B4513] hover:bg-[#E8D1B9] border border-[#D4B492]">High</button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex w-full h-full relative">
      <Folder isOpen={!!selectedItemId} />
      <PaperLayers
        isOpen={!!selectedItemId}
      >
        {mainContent}
      </PaperLayers>
    </div>
  );
}
