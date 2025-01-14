import { useCanvas } from "@/app/providers/CanvasProvider";
import { Tool } from "@/types";
import { FaLocationDot } from "react-icons/fa6";
import { FiMove } from "react-icons/fi";
import { IoPersonSharp } from "react-icons/io5";
import { TbArrowUpDashed } from "react-icons/tb"


const tools: { id: Tool; icon: JSX.Element; label: string }[] = [
  {
    id: "select",
    icon: <FiMove />,
    label: "Select",
  },
    {
        id: "person",
        icon: <IoPersonSharp />,
        label: "Person",
    },
    {
        id: "location",
        icon: <FaLocationDot />,
        label: "Location",
    },
    {
      id:'line',
      icon:<TbArrowUpDashed/>,
      label:"Line" 
    }
];

export const Toolbar = () => {
  const { tool: selectedTool, setTool } = useCanvas();

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#2C2420] p-2 rounded-lg border border-amber-700/50 shadow-lg">
      <div className="flex flex-col gap-2 relative">
        <div
          className="absolute w-10 h-10 bg-amber-700 rounded-lg transition-transform duration-200"
          style={{
            transform: `translateY(${tools.findIndex(t => t.id === selectedTool) * (40 + 8)}px)`,
          }}
        />
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setTool(tool.id)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all relative hover:bg-amber-900/30`}
            title={tool.label}
          >
            <span className={ `text-xl text-amber-300 relative z-10 ${selectedTool !== tool.id  &&  "text-amber-300/50 shadow-inner"}` }>{tool.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
}; 