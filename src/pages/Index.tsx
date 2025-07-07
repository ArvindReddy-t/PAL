
import { useState } from "react";
import Header from "@/components/Header";
import VoiceOverview from "@/components/VoiceOverview";
import Footer from "@/components/Footer";
import GitLabIssues from "@/components/GitLabIssues";
import CalendarMeetings from "@/components/CalendarMeetings";
import TaskOverview from "@/components/TaskOverview";
import MandatoryTraining from "@/components/MandatoryTraining";
import GreetingCard from "@/components/GreetingCard";
import CommunicationsModule from "@/components/CommunicationsModule";
import ServiceNowModule from "@/components/ServiceNowModule";
import ResourceManagement from "@/components/ResourceManagement";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import StartupIcon from "@/components/StartupIcon";

const Index = () => {
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [minimizedModules, setMinimizedModules] = useState<string[]>([
    'mandatorytraining',
    'communications', 
    'calendar', 
    'servicenow', 
    'resources', 
    'gitlab', 
    'todo'
  ]);
  const [activeModules, setActiveModules] = useState<string[]>(['voiceoverview']);
  const [latestClickedModule, setLatestClickedModule] = useState<string | null>(null);

  const handleOpenApp = () => {
    setIsAppOpen(true);
  };

  const handleCloseApp = () => {
    setIsAppOpen(false);
  };

  const handleRestoreModule = (module: string) => {
    setMinimizedModules(minimizedModules.filter(m => m !== module));
    setActiveModules([...activeModules, module]);
    setLatestClickedModule(module);
  };

  const handleMinimizeModule = (module: string) => {
    setActiveModules(activeModules.filter(m => m !== module));
    setMinimizedModules([...minimizedModules, module]);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  if (!isAppOpen) {
    return <StartupIcon onOpen={handleOpenApp} />;
  }

  const containerStyle = isMaximized 
    ? "fixed inset-4 bg-black/50 z-50 flex items-center justify-center"
    : "fixed bottom-4 right-4 z-50";

  const windowStyle = isMaximized
    ? "bg-white rounded-lg shadow-2xl w-full max-w-5xl h-full max-h-[85vh] overflow-hidden font-frutiger font-light flex flex-col text-[hsl(var(--ubs-dark-grey))]"
    : "bg-white rounded-lg shadow-2xl font-frutiger font-light flex flex-col overflow-hidden text-[hsl(var(--ubs-dark-grey))]";

  const windowSize = isMaximized ? {} : { width: '486px', height: '624px' };

  const renderModule = (moduleId: string) => {
    switch (moduleId) {
      case 'voiceoverview':
        return <VoiceOverview key={moduleId} />;
      case 'gitlab':
        return <GitLabIssues key={moduleId} onMinimize={() => handleMinimizeModule('gitlab')} />;
      case 'calendar':
        return <CalendarMeetings key={moduleId} onMinimize={() => handleMinimizeModule('calendar')} />;
      case 'todo':
        return <TaskOverview key={moduleId} onMinimize={() => handleMinimizeModule('todo')} />;
      case 'mandatorytraining':
        return <MandatoryTraining key={moduleId} onMinimize={() => handleMinimizeModule('mandatorytraining')} />;
      case 'communications':
        return <CommunicationsModule key={moduleId} onMinimize={() => handleMinimizeModule('communications')} />;
      case 'servicenow':
        return <ServiceNowModule key={moduleId} onMinimize={() => handleMinimizeModule('servicenow')} />;
      case 'resources':
        return <ResourceManagement key={moduleId} onMinimize={() => handleMinimizeModule('resources')} />;
      default:
        return null;
    }
  };

  return (
    <div className={containerStyle}>
      <div className={windowStyle} style={windowSize}>
        <Header onClose={handleCloseApp} onMaximize={handleMaximize} isMaximized={isMaximized} />
        
        <ResizablePanelGroup direction="vertical" className="flex-1 overflow-hidden">
          <ResizablePanel defaultSize={75} minSize={50} className="overflow-hidden">
            <main className="h-full overflow-hidden font-frutiger font-light text-[hsl(var(--ubs-dark-grey))]">
              <div className="h-full overflow-y-auto">
                <div className="p-4 space-y-4 font-frutiger font-light text-[hsl(var(--ubs-dark-grey))]">
                  {/* Always show VoiceOverview first */}
                  <VoiceOverview key="voiceoverview" />
                  
                  {/* Show latest clicked module below VoiceOverview */}
                  {latestClickedModule && activeModules.includes(latestClickedModule) && (
                    <div key={`latest-${latestClickedModule}`}>
                      {renderModule(latestClickedModule)}
                    </div>
                  )}
                  
                  {/* Show other active modules (excluding VoiceOverview and latest clicked) */}
                  {activeModules
                    .filter(moduleId => moduleId !== 'voiceoverview' && moduleId !== latestClickedModule)
                    .map((moduleId) => (
                      <div key={moduleId}>
                        {renderModule(moduleId)}
                      </div>
                    ))}
                </div>
              </div>
            </main>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} minSize={15} maxSize={50}>
            <Footer 
              minimizedModules={minimizedModules} 
              activeModules={activeModules}
              onRestoreModule={handleRestoreModule} 
              onMinimizeModule={handleMinimizeModule}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Index;
