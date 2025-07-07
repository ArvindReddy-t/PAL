
import { useState } from "react";
import { Package, User, Key, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronRight, Minus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AccessRequest {
  id: string;
  requester: string;
  resource: string;
  type: 'System Access' | 'Application' | 'Network' | 'Database';
  status: 'Pending' | 'Approved' | 'Rejected' | 'In Review';
  priority: 'High' | 'Medium' | 'Low';
  requestDate: string;
  dueDate: string;
  description: string;
}

interface ResourceManagementProps {
  onMinimize?: () => void;
}

const ResourceManagement = ({ onMinimize }: ResourceManagementProps) => {
  const [isPendingOpen, setIsPendingOpen] = useState(true);
  const [isMyRequestsOpen, setIsMyRequestsOpen] = useState(true);
  const [isApprovalsOpen, setIsApprovalsOpen] = useState(true);

  const accessRequests: AccessRequest[] = [
    {
      id: "1",
      requester: "John Smith",
      resource: "Production Database Access",
      type: 'Database',
      status: 'Pending',
      priority: 'High',
      requestDate: '2024-01-15',
      dueDate: '2024-01-17',
      description: 'Need read access to production database for debugging critical issue'
    },
    {
      id: "2",
      requester: "Sarah Wilson",
      resource: "Adobe Creative Cloud License",
      type: 'Application',
      status: 'In Review',
      priority: 'Medium',
      requestDate: '2024-01-14',
      dueDate: '2024-01-20',
      description: 'Marketing team member needs access to design tools for upcoming campaign'
    },
    {
      id: "3",
      requester: "Mike Johnson",
      resource: "VPN Access - Remote Work",
      type: 'Network',
      status: 'Approved',
      priority: 'High',
      requestDate: '2024-01-13',
      dueDate: '2024-01-15',
      description: 'Remote work setup requiring secure VPN connection'
    }
  ];

  const myRequests: AccessRequest[] = [
    {
      id: "4",
      requester: "Aravind Reddy",
      resource: "AWS Console Access",
      type: 'System Access',
      status: 'Pending',
      priority: 'High',
      requestDate: '2024-01-16',
      dueDate: '2024-01-18',
      description: 'Need access to AWS console for cloud infrastructure management'
    },
    {
      id: "5",
      requester: "Aravind Reddy",
      resource: "GitLab Admin Rights",
      type: 'Application',
      status: 'Approved',
      priority: 'Medium',
      requestDate: '2024-01-12',
      dueDate: '2024-01-15',
      description: 'Repository management and user administration'
    }
  ];

  const pendingApprovals: AccessRequest[] = [
    {
      id: "6",
      requester: "Lisa Chen",
      resource: "Jira Project Admin",
      type: 'Application',
      status: 'In Review',
      priority: 'Medium',
      requestDate: '2024-01-15',
      dueDate: '2024-01-19',
      description: 'Project management and team coordination'
    },
    {
      id: "7",
      requester: "David Brown",
      resource: "Financial System Access",
      type: 'System Access',
      status: 'Pending',
      priority: 'High',
      requestDate: '2024-01-14',
      dueDate: '2024-01-16',
      description: 'Quarterly financial reporting and budget analysis'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'In Review': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const renderRequestList = (requests: AccessRequest[], showActions = false) => (
    <div className="space-y-3">
      {requests.map((request) => (
        <div key={request.id} className="p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-800">{request.resource}</span>
                <Badge className={getPriorityColor(request.priority)}>
                  {request.priority}
                </Badge>
                <Badge className={getStatusColor(request.status)}>
                  {request.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                <User className="h-3 w-3" />
                <span>{request.requester}</span>
                <span>•</span>
                <span>{request.type}</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{request.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Requested: {request.requestDate}
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Due: {request.dueDate}
                </div>
              </div>
            </div>
            {showActions && request.status === 'Pending' && (
              <div className="flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="h-full flex flex-col bg-white border border-gray-200 overflow-hidden text-black font-frutiger font-light">
      <CardHeader className="pb-2 bg-white flex-shrink-0 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-ubs-red font-dm-sans">
            <Package className="h-5 w-5" />
            Resource Management
            <Badge className="bg-orange-600 text-white">
              {accessRequests.filter(r => r.status === 'Pending').length + pendingApprovals.filter(r => r.status === 'Pending').length} pending
            </Badge>
          </CardTitle>
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
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden bg-white p-4">
        <ScrollArea className="flex-1">
          <div className="space-y-4 pr-2">
            {/* My Requests Section */}
            <Collapsible open={isMyRequestsOpen} onOpenChange={setIsMyRequestsOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                {isMyRequestsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <User className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">My Access Requests</span>
                <Badge className="ml-auto bg-blue-600 text-white">
                  {myRequests.length}
                </Badge>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                {renderRequestList(myRequests)}
              </CollapsibleContent>
            </Collapsible>

            {/* Pending Requests Section */}
            <Collapsible open={isPendingOpen} onOpenChange={setIsPendingOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                {isPendingOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <Key className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Team Access Requests</span>
                <Badge className="ml-auto bg-yellow-600 text-white">
                  {accessRequests.length}
                </Badge>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                {renderRequestList(accessRequests)}
              </CollapsibleContent>
            </Collapsible>

            {/* Pending Approvals Section */}
            <Collapsible open={isApprovalsOpen} onOpenChange={setIsApprovalsOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                {isApprovalsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Pending My Approval</span>
                <Badge className="ml-auto bg-green-600 text-white">
                  {pendingApprovals.length}
                </Badge>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                {renderRequestList(pendingApprovals, true)}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ResourceManagement;
