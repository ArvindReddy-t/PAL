
import { Info, X, Maximize } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onClose?: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
}

const Header = ({ onClose, onMaximize, isMaximized }: HeaderProps) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const toggleInfo = () => {
    setIsInfoOpen(!isInfoOpen);
  };

  return (
    <>
      <header className="bg-white text-[hsl(var(--ubs-dark-grey))] px-6 py-4 flex items-center justify-between shadow-sm font-frutiger font-light" style={{ fontWeight: 300 }}>
        <div className="flex items-center">
          <img src="/UBSLOGO.png" alt="UBS Logo" className="h-8 w-auto mr-3" />
          <span className="text-xl font-frutiger font-light text-black ml-2" style={{ fontWeight: 300 }}>
            PAL
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={toggleInfo}
            className="w-8 h-8 hover:bg-[hsl(var(--ubs-light-grey))] rounded-full flex items-center justify-center transition-colors duration-200"
            title="Information"
          >
            <Info className="h-5 w-5 text-[hsl(var(--ubs-dark-grey))]" />
          </button>
          {onMaximize && (
            <button
              onClick={onMaximize}
              className="w-8 h-8 hover:bg-[hsl(var(--ubs-light-grey))] rounded-full flex items-center justify-center transition-colors duration-200"
              title={isMaximized ? "Minimize" : "Maximize"}
            >
              <Maximize className="h-5 w-5 text-[hsl(var(--ubs-dark-grey))]" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 hover:bg-[hsl(var(--ubs-light-grey))] rounded-full flex items-center justify-center transition-colors duration-200"
              title="Close PAL"
            >
              <X className="h-5 w-5 text-[hsl(var(--ubs-dark-grey))]" />
            </button>
          )}
        </div>
      </header>

      {isInfoOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={toggleInfo}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-ubs-black font-ubs-headline mb-2">
                About PAL Dashboard
              </h3>
              <p className="text-sm text-ubs-black mb-4 font-frutiger">
                Personal Assistant Lite (PAL) is your centralized dashboard for managing work tasks and communications efficiently.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-ubs-black text-sm font-frutiger font-semibold">Quick Actions</h4>
                <p className="text-xs text-ubs-medium-grey font-frutiger">
                  Each module provides quick action buttons (red circles with white icons) for immediate task management.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-ubs-black text-sm font-frutiger font-semibold">Real-time Updates</h4>
                <p className="text-xs text-ubs-medium-grey font-frutiger">
                  The dashboard automatically refreshes to show your latest emails, tickets, issues, and meetings.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-ubs-black text-sm font-frutiger font-semibold">Global Search</h4>
                <p className="text-xs text-ubs-medium-grey font-frutiger">
                  Use the search bar in the header to quickly find information across all integrated services.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-ubs-black text-sm font-frutiger font-semibold">AI Assistant</h4>
                <p className="text-xs text-ubs-medium-grey font-frutiger">
                  Use the voice assistant to ask questions about your work data and get instant responses.
                </p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <span className="text-xs text-ubs-medium-grey font-frutiger italic">Version 1.0 • UBS Technology</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
