
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Calendar, CheckCircle, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface GreetingCardProps {
  onDismiss: () => void;
  onSetAgenda: () => void;
}

const GreetingCard = ({ onDismiss, onSetAgenda }: GreetingCardProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Good morning!";
    if (currentHour < 18) return "Good afternoon!";
    return "Good evening!";
  };

  const steps = [
    {
      title: "Welcome to PAL",
      content: `${getGreeting()} Hey there! How are you doing today?`,
      description: "Would you like me to set your agenda for today and give you an overview of your tasks?"
    },
    {
      title: "Your Dashboard",
      content: "Your personalized dashboard is ready to help you manage your workday efficiently.",
      description: "View your emails, meetings, tickets, and tasks all in one place."
    },
    {
      title: "AI Assistant",
      content: "I'm here to help you with questions about your work data and daily tasks.",
      description: "Ask me about your schedule, pending items, or any work-related queries."
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Card className="mb-6 border-ubs-red/20 bg-gradient-to-r from-ubs-red/5 to-transparent text-black font-frutiger font-light">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-ubs-red flex items-center gap-2">
            <Bot className="h-5 w-5" />
            PAL - Personal Assistant
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0"
            >
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {!isCollapsed && (
        <CardContent>
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {steps[currentStep].title}
              </h3>
              <p className="text-gray-700 mb-2">
                {steps[currentStep].content}
              </p>
              <p className="text-sm text-gray-600">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep ? 'bg-ubs-red' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {currentStep === 0 && (
              <div className="flex gap-3">
                <Button 
                  onClick={onSetAgenda}
                  className="bg-ubs-red hover:bg-ubs-red-dark"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Set My Agenda
                </Button>
                <Button 
                  variant="outline" 
                  onClick={onDismiss}
                  className="border-ubs-red text-ubs-red hover:bg-ubs-red/5"
                >
                  Maybe Later
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default GreetingCard;
