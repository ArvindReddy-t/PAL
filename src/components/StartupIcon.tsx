
import { Bot } from "lucide-react";

interface StartupIconProps {
  onOpen: () => void;
}

const StartupIcon = ({ onOpen }: StartupIconProps) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onOpen}
        className="group relative w-16 h-16 bg-white hover:bg-gray-100 text-ubs-red rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
        aria-label="Open PAL Dashboard"
      >
        <Bot className="h-8 w-8 text-ubs-red" />
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
            Wanna see your work day?
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default StartupIcon;
