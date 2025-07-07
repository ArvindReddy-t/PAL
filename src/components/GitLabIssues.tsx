
import { GitBranch, Edit, FileText, Eye, Minus, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ActionButton from "./ActionButton";
import ModuleInfoTooltip from "./ModuleInfoTooltip";

interface GitLabIssue {
  issueId: string;
  title: string;
  projectName: string;
  status: string;
  labels: string[];
  dueDate: string;
  priority: string;
  assignee: string;
  updatedTime: string;
}

interface GitLabIssuesProps {
  onMinimize?: () => void;
}

const GitLabIssues = ({ onMinimize }: GitLabIssuesProps) => {
  const lastUpdated = new Date();
  
  const issues: GitLabIssue[] = [
    {
      issueId: "#142",
      title: "Implement user authentication flow",
      projectName: "PAL Dashboard",
      status: "In Progress",
      priority: "High",
      assignee: "John Doe",
      labels: ["frontend", "authentication"],
      dueDate: "Dec 28",
      updatedTime: "5 min ago"
    },
    {
      issueId: "#156",
      title: "Fix API response caching issue",
      projectName: "Backend Services",
      status: "To Do",
      priority: "Critical",
      assignee: "Sarah Johnson",
      labels: ["backend", "bug", "high-priority"],
      dueDate: "Dec 30",
      updatedTime: "15 min ago"
    },
    {
      issueId: "#134",
      title: "Update documentation for new features",
      projectName: "PAL Dashboard",
      status: "Review",
      priority: "Medium",
      assignee: "Mike Chen",
      labels: ["documentation"],
      dueDate: "Jan 2",
      updatedTime: "2 hours ago"
    },
    {
      issueId: "#167",
      title: "Optimize database queries for performance",
      projectName: "Backend Services",
      status: "To Do",
      priority: "High",
      assignee: "Lisa Rodriguez",
      labels: ["backend", "performance"],
      dueDate: "Jan 5",
      updatedTime: "1 day ago"
    },
    {
      issueId: "#189",
      title: "Add unit tests for user service",
      projectName: "PAL Dashboard",
      status: "In Progress",
      priority: "Medium",
      assignee: "David Kim",
      labels: ["testing", "backend"],
      dueDate: "Dec 29",
      updatedTime: "3 hours ago"
    }
  ];

  const quickActions = [
    "Change Status - Update issue status",
    "Add Comment - Post a comment on issue",
    "View in GitLab - Open issue in GitLab"
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-100 text-red-700 border-red-200";
      case "High": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "Review": return "bg-purple-100 text-purple-700";
      case "To Do": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleChangeStatus = (issue: GitLabIssue) => {
    console.log("Change status for:", issue.issueId);
  };

  const handleAddComment = (issue: GitLabIssue) => {
    console.log("Add comment for:", issue.issueId);
  };

  const handleViewInGitLab = (issue: GitLabIssue) => {
    console.log("View in GitLab:", issue.issueId);
  };

  const criticalIssues = issues.filter(issue => issue.priority === "Critical").length;
  const highPriorityIssues = issues.filter(issue => issue.priority === "High").length;

  return (
    <Card className="h-full flex flex-col bg-white border border-gray-200 overflow-hidden text-black font-frutiger font-light">
      <CardHeader className="pb-2 bg-white flex-shrink-0 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-pal-red font-dm-sans">
              <GitBranch className="h-5 w-5" />
              GitLab Issues
            </CardTitle>
            <Badge className="bg-orange-600 text-white">
              {issues.length} issues
            </Badge>
            {criticalIssues > 0 && (
              <Badge className="bg-red-600 text-white">
                {criticalIssues} critical
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
            <ModuleInfoTooltip title="GitLab Issues" quickActions={quickActions} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden bg-white p-4">
        <ScrollArea className="flex-1">
          <div className="space-y-3 pr-2">
            {issues.map((issue, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${
                  issue.priority === 'Critical' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
                } hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-medium text-green-600">{issue.issueId}</span>
                      <Badge className={`text-xs ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-medium text-pal-black mb-1">{issue.title}</h3>
                    <div className="text-xs text-gray-600 mb-2">
                      <div className="flex gap-4">
                        <span>Project: {issue.projectName}</span>
                        <span>Assignee: {issue.assignee}</span>
                      </div>
                      <div className="flex gap-4 mt-1">
                        <span>Due: {issue.dueDate}</span>
                        <span className="text-pal-red">Updated: {issue.updatedTime}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {issue.labels.map((label, labelIndex) => (
                        <span
                          key={labelIndex}
                          className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded border"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-1 ml-3">
                    <ActionButton
                      icon={Edit}
                      label="Change Status"
                      onClick={() => handleChangeStatus(issue)}
                    />
                    <ActionButton
                      icon={FileText}
                      label="Add Comment"
                      onClick={() => handleAddComment(issue)}
                    />
                    <ActionButton
                      icon={Eye}
                      label="View in GitLab"
                      onClick={() => handleViewInGitLab(issue)}
                    />
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

export default GitLabIssues;
