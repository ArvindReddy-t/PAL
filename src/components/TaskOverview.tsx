import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, Mail, Ticket, GitBranch, Calendar, Key, UserCheck, Minus } from "lucide-react";

interface TaskOverviewProps {
  onMinimize?: () => void;
}

const TaskOverview = ({ onMinimize }: TaskOverviewProps) => {
  const lastUpdated = new Date();
  
  const summary = {
    totalTasks: 12,
    overdueTasks: 3,
    todayTasks: 5,
    emails: 8,
    tickets: 7,
    meetings: 4,
    gitlabIssues: 5,
    accessRequests: 3,
    accessApprovals: 2
  };

  const overdueTasks = [
    "Network connectivity issues in Building A - Due yesterday",
    "Q4 Budget Review completion - Due 2 days ago",
    "Client presentation preparation - Due today"
  ];

  const upcomingDeadlines = [
    "Sprint Planning Session - Due in 2 hours",
    "Security Protocol Review - Due tomorrow",
    "Monthly report submission - Due in 3 days"
  ];

  return (
    <Card className="h-full flex flex-col bg-white border border-gray-200 overflow-hidden text-black font-frutiger font-light">
      <CardHeader className="pb-2 bg-white flex-shrink-0 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-pal-red font-dm-sans">
            <AlertCircle className="h-5 w-5" />
            Task Overview & Reminders
          </CardTitle>
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
      
      <CardContent className="flex-1 overflow-hidden bg-white p-4">
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Ticket className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-semibold text-blue-900">{summary.tickets}</div>
                <div className="text-xs text-blue-600">Active Tickets</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Mail className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-semibold text-green-900">{summary.emails}</div>
                <div className="text-xs text-green-600">Unread Emails</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-semibold text-purple-900">{summary.meetings}</div>
                <div className="text-xs text-purple-600">Today's Meetings</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
              <GitBranch className="h-5 w-5 text-orange-600" />
              <div>
                <div className="font-semibold text-orange-900">{summary.gitlabIssues}</div>
                <div className="text-xs text-orange-600">GitLab Issues</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg">
              <Key className="h-5 w-5 text-cyan-600" />
              <div>
                <div className="font-semibold text-cyan-900">{summary.accessRequests}</div>
                <div className="text-xs text-cyan-600">Access Requests</div>
              </div>
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
              <UserCheck className="h-5 w-5 text-indigo-600" />
              <div>
                <div className="font-semibold text-indigo-900">{summary.accessApprovals}</div>
                <div className="text-xs text-indigo-600">Pending Approvals</div>
              </div>
            </div>
          </div>

          {/* Overdue Tasks Alert */}
          {overdueTasks.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold text-red-800">Overdue Tasks</h3>
                <Badge variant="destructive" className="ml-auto">
                  {overdueTasks.length}
                </Badge>
              </div>
              <ul className="space-y-2">
                {overdueTasks.map((task, index) => (
                  <li key={index} className="text-sm text-red-700 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Upcoming Deadlines */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">Upcoming Deadlines</h3>
            </div>
            <ul className="space-y-2">
              {upcomingDeadlines.map((deadline, index) => (
                <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  {deadline}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskOverview;
