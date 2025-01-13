import { useCanvas } from "@/app/providers/CanvasProvider";
import { Folder } from './Folder/Folder';
import { PaperLayers } from "./Folder/PaperLayers";
import { ElementType } from "@/types";


export function SelectedItem() {
  const { selectedItemId, visibleElements } = useCanvas();
  const element = visibleElements.find(el => el.id === selectedItemId);

  const getTitle = (type: ElementType | undefined) => {
    if(!type) return 'Selected Item'
    if(type === 'person') return 'Suspect'
    if(type === 'location') return 'Location'

  }
  
  const mainContent = (
    <>
      <h1 className="text-2xl font-bold text-[#8B4513] mb-6">{getTitle(element?.type)} #{element?.id.slice(-5, -1)}</h1>

      <div className="flex gap-4 my-2 p-2 bg-[#ECD5B8] rounded-lg">
        <img className="w-[150px] pt-2 border border-black bg-[#E4C18D] rounded-md" src={element?.imageUrl ?? ''}></img> 
        <div className="flex flex-col ">
          <h3 className="text-sm font-bold text-[#8B4513]">Name</h3>
          <p className="text-base text-[#8B4513]">{element?.title}</p>
        </div>
      </div>

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
    <div style={{viewTransitionName: 'selected-item-wrapper'}} className={ `flex w-full h-full relative ${!selectedItemId ? '-rotate-[12deg]' : 'rotate-0'}` }>
      <Folder isOpen={!!selectedItemId} />
      <PaperLayers
        isOpen={!!selectedItemId}
      >
        {mainContent}
      </PaperLayers>
    </div>
  );
}
