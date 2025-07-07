
import { BookOpen, Clock, AlertTriangle, CheckCircle, Calendar, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TrainingModule {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  status: "pending" | "overdue" | "completed";
  priority: "high" | "medium" | "low";
  estimatedTime: string;
  description: string;
  updatedTime: string;
}

interface MandatoryTrainingProps {
  onMinimize?: () => void;
}

const MandatoryTraining = ({ onMinimize }: MandatoryTrainingProps) => {
  const lastUpdated = new Date();
  
  const trainings: TrainingModule[] = [
    {
      id: "1",
      title: "Cybersecurity Awareness",
      category: "Compliance",
      dueDate: "2024-12-31",
      status: "pending",
      priority: "high",
      estimatedTime: "4 hours",
      description: "Understand the latest cybersecurity threats and how to protect company data.",
      updatedTime: "2 hours ago"
    },
    {
      id: "2",
      title: "Data Privacy Fundamentals",
      category: "Compliance",
      dueDate: "2024-12-25",
      status: "overdue",
      priority: "high",
      estimatedTime: "3 hours",
      description: "Learn about data privacy regulations and best practices.",
      updatedTime: "1 day ago"
    },
    {
      id: "3",
      title: "Effective Communication",
      category: "Professional Development",
      dueDate: "2025-01-15",
      status: "pending",
      priority: "medium",
      estimatedTime: "2 hours",
      description: "Improve your communication skills for better collaboration.",
      updatedTime: "3 days ago"
    },
    {
      id: "4",
      title: "Project Management Basics",
      category: "Skills Development",
      dueDate: "2025-01-20",
      status: "pending",
      priority: "low",
      estimatedTime: "5 hours",
      description: "Learn the fundamentals of project management.",
      updatedTime: "1 week ago"
    },
    {
      id: "5",
      title: "Diversity and Inclusion",
      category: "HR & Culture",
      dueDate: "2024-12-28",
      status: "completed",
      priority: "medium",
      estimatedTime: "3 hours",
      description: "Promote diversity and inclusion in the workplace.",
      updatedTime: "2 weeks ago"
    }
  ];

  const pendingCount = trainings.filter(training => training.status === "pending").length;
  const overdueCount = trainings.filter(training => training.status === "overdue").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "overdue": return "bg-red-100 text-red-700";
      case "completed": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityIndicator = (priority: string) => {
    switch (priority) {
      case "high": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "medium": return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "low": return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      default: return null;
    }
  };

  return (
    <Card className="h-full flex flex-col bg-white border border-gray-200 overflow-hidden text-black font-frutiger font-light">
      <CardHeader className="pb-2 bg-white flex-shrink-0 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-pal-red font-dm-sans">
              <BookOpen className="h-5 w-5" />
              Mandatory Training
            </CardTitle>
            <Badge className="bg-blue-600 text-white">
              {pendingCount} pending
            </Badge>
            {overdueCount > 0 && (
              <Badge className="bg-red-600 text-white">
                {overdueCount} overdue
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-xs text-pal-black">
              <Clock className="h-3 w-3" />
              Updated: {lastUpdated.toLocaleTimeString()}
            </div>
            {onMinimize && (
              <Button 
                onClick={onMinimize}
                variant="ghost" 
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100"
              >
                <Minus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden bg-white p-4">
        <ScrollArea className="flex-1">
          <div className="space-y-3 pr-2">
            {trainings.map((training) => (
              <div 
                key={training.id} 
                className={`p-3 rounded-lg border ${
                  training.status === 'overdue' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
                } hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getPriorityIndicator(training.priority)}
                      <span className="font-medium text-sm text-gray-800">{training.title}</span>
                      <Badge className={`text-xs ${getStatusColor(training.status)}`}>
                        {training.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      Category: {training.category}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Due Date: {training.dueDate}
                      </div>
                      <div className="text-xs text-pal-red">
                        Updated: {training.updatedTime}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {training.status === "pending" && (
                      <Button variant="outline" size="sm">
                        <Calendar className="h-3 w-3 mr-2" />
                        Schedule
                      </Button>
                    )}
                    {training.status === "overdue" && (
                      <Button variant="destructive" size="sm">
                        <AlertTriangle className="h-3 w-3 mr-2" />
                        Take Now
                      </Button>
                    )}
                    {training.status === "completed" && (
                      <Button variant="secondary" size="sm" disabled>
                        <CheckCircle className="h-3 w-3 mr-2" />
                        Completed
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MandatoryTraining;
