
import { Mail, Ticket, GitBranch, Calendar, CheckSquare, Package, Bot, MessageSquare, BookOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FooterProps {
  minimizedModules: string[];
  activeModules: string[];
  onRestoreModule: (module: string) => void;
  onMinimizeModule: (module: string) => void;
}

const Footer = ({ minimizedModules, activeModules, onRestoreModule, onMinimizeModule }: FooterProps) => {
  const moduleIcons = {
    communications: { icon: Mail, label: "Communications", color: "text-blue-600" },
    servicenow: { icon: Ticket, label: "ServiceNow", color: "text-red-600" },
    resources: { icon: Package, label: "Resource Management", color: "text-green-600" },
    gitlab: { icon: GitBranch, label: "GitLab Issues", color: "text-orange-600" },
    calendar: { icon: Calendar, label: "Calendar", color: "text-green-600" },
    todo: { icon: CheckSquare, label: "Todo List", color: "text-indigo-600" },
    mandatorytraining: { icon: BookOpen, label: "Mandatory Training", color: "text-blue-600" }
  };

  // Get all available modules
  const allModules = Object.keys(moduleIcons);
  
  if (allModules.length === 0) return null;

  return (
    <div className="bg-[hsl(var(--ubs-light-grey))] border-t border-[hsl(var(--ubs-medium-grey))] h-full overflow-hidden font-frutiger font-light text-[hsl(var(--ubs-medium-grey))]" style={{ fontWeight: 300 }}>
      <ScrollArea className="h-full">
        <div className="p-3">
          <div className="grid grid-cols-2 gap-2">
            {allModules.map((module) => {
              const moduleData = moduleIcons[module as keyof typeof moduleIcons];
              if (!moduleData) return null;
              
              const { icon: Icon, label } = moduleData;
              const isMinimized = minimizedModules.includes(module);
              const isActive = activeModules.includes(module);
              
              // Determine button styling based on state
              const buttonClasses = isMinimized 
                ? "flex items-center gap-2 px-3 py-3 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors text-left font-frutiger font-light shadow-sm text-[hsl(var(--ubs-medium-grey))]"
                : "flex items-center gap-2 px-3 py-3 bg-ubs-red hover:bg-ubs-red-dark text-white rounded-lg transition-colors text-left font-frutiger font-light shadow-sm";
              
              const iconClasses = isMinimized 
                ? "h-4 w-4 text-[hsl(var(--ubs-medium-grey))] flex-shrink-0"
                : "h-4 w-4 text-white flex-shrink-0";
              
              const textClasses = isMinimized 
                ? "text-xs truncate font-frutiger font-light"
                : "text-xs text-white truncate font-frutiger font-light";
              
              const handleClick = () => {
                if (isMinimized) {
                  onRestoreModule(module);
                } else {
                  onMinimizeModule(module);
                }
              };
              
              const title = isMinimized ? `Expand ${label}` : `Collapse ${label}`;
              
              return (
                <button
                  key={module}
                  onClick={handleClick}
                  className={buttonClasses}
                  title={title}
                  style={{ fontWeight: 300 }}
                >
                  <Icon className={iconClasses} />
                  <span className={textClasses} style={{ fontWeight: 300 }}>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Footer;
