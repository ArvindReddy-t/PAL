import { useState } from "react";
import { Mail, User, ChevronDown, ChevronRight, Minus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ActionButton from "./ActionButton";
import ModuleInfoTooltip from "./ModuleInfoTooltip";

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  isUnread: boolean;
  isImportant: boolean;
  mentionedUsers?: string[];
  chatType?: 'teams' | 'slack' | 'email';
}

interface CommunicationsModuleProps {
  onMinimize?: () => void;
}

const CommunicationsModule = ({ onMinimize }: CommunicationsModuleProps) => {
  const [isToMeOpen, setIsToMeOpen] = useState(true);
  const [isMentionsOpen, setIsMentionsOpen] = useState(true);

  // Emails where user is in TO address
  const toMeEmails: Email[] = [
    {
      id: "1",
      from: "Sarah Johnson",
      subject: "Q4 Budget Review Meeting",
      preview: "Hi Team, Can we schedule the quarterly budget review for next week?",
      time: "2 hours ago",
      isUnread: true,
      isImportant: true,
      chatType: 'email'
    },
    {
      id: "2", 
      from: "IT Security Team",
      subject: "Security Patch Deployment Notice",
      preview: "Dear Team, Please note that security patches will be deployed tonight.",
      time: "4 hours ago",
      isUnread: true,
      isImportant: true,
      chatType: 'email'
    },
    {
      id: "3",
      from: "HR Department",
      subject: "Holiday Schedule Update",
      preview: "Team, Please review the updated holiday schedule for Q1 2025.",
      time: "1 day ago",
      isUnread: false,
      isImportant: false,
      chatType: 'email'
    }
  ];

  // Emails mentioning "Aravind Reddy"
  const mentionEmails: Email[] = [
    {
      id: "4",
      from: "Project Manager",
      subject: "Sprint Review - Action Items",
      preview: "Following up on yesterday's sprint review. Aravind Reddy needs to review the test cases and provide feedback by EOD.",
      time: "6 hours ago",
      isUnread: false,
      isImportant: false,
      mentionedUsers: ["Aravind Reddy"],
      chatType: 'teams'
    },
    {
      id: "5",
      from: "Client Relations",
      subject: "Client Feedback - Project Alpha",
      preview: "The client has provided positive feedback on Project Alpha. Aravind Reddy's work on the backend integration was particularly appreciated.",
      time: "1 day ago",
      isUnread: true,
      isImportant: false,
      mentionedUsers: ["Aravind Reddy"],
      chatType: 'slack'
    },
    {
      id: "6",
      from: "Tech Lead",
      subject: "Code Review Request",
      preview: "Hi team, please review the latest pull request. Aravind Reddy, your input on the database optimization would be valuable.",
      time: "2 days ago",
      isUnread: false,
      isImportant: true,
      mentionedUsers: ["Aravind Reddy"],
      chatType: 'email'
    }
  ];

  const quickActions = [
    "Reply to Urgent - 2 high priority emails need immediate response",
    "Review Mentions - You are mentioned in 3 messages across platforms",
    "Archive Read - Clean up processed emails"
  ];

  const getChatTypeIcon = (type?: string) => {
    switch (type) {
      case 'teams': return '💬';
      case 'slack': return '📱';
      default: return '📧';
    }
  };

  const renderPreviewWithMentions = (preview: string, mentionedUsers?: string[]) => {
    if (!mentionedUsers || mentionedUsers.length === 0) {
      return preview;
    }

    let formattedPreview = preview;
    mentionedUsers.forEach(user => {
      const userPattern = new RegExp(`\\b${user.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      formattedPreview = formattedPreview.replace(
        userPattern, 
        `<span class="bg-blue-100 text-blue-800 px-1 rounded font-medium">${user}</span>`
      );
    });

    return <div dangerouslySetInnerHTML={{ __html: formattedPreview }} />;
  };

  const renderEmailList = (emails: Email[]) => (
    <div className="space-y-3">
      {emails.map((email) => (
        <div
          key={email.id}
          className={`p-3 rounded-lg border transition-colors ${
            email.isUnread 
              ? 'bg-blue-50 border-blue-200' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500">
                  {getChatTypeIcon(email.chatType)} {email.chatType?.toUpperCase() || 'EMAIL'}
                </span>
                <span className="text-sm font-medium text-gray-900">{email.from}</span>
                {email.isUnread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
              <h3 className="text-sm font-medium text-gray-800 mb-1">{email.subject}</h3>
              <div className="text-xs text-gray-600 mb-2">
                {renderPreviewWithMentions(email.preview, email.mentionedUsers)}
              </div>
              <span className="text-xs text-gray-500">{email.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col text-black font-frutiger font-light">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Mail className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900 font-helvetica">Communications</h2>
          <Badge className="ml-2 bg-blue-600">
            {toMeEmails.filter(email => email.isUnread).length + mentionEmails.filter(email => email.isUnread).length} unread
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <ModuleInfoTooltip title="Communications Module" quickActions={quickActions} />
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

      <ScrollArea className="flex-1">
        <div className="space-y-4 pr-4">
          {/* Direct Emails Section */}
          <Collapsible open={isToMeOpen} onOpenChange={setIsToMeOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              {isToMeOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Direct Emails (To Me)</span>
              <Badge className="ml-auto bg-blue-600 text-white">
                {toMeEmails.length}
              </Badge>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              {renderEmailList(toMeEmails)}
            </CollapsibleContent>
          </Collapsible>

          {/* Mentions Section */}
          <Collapsible open={isMentionsOpen} onOpenChange={setIsMentionsOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 w-full p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              {isMentionsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <User className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Mentions (Aravind Reddy)</span>
              <Badge className="ml-auto bg-green-600 text-white">
                {mentionEmails.length}
              </Badge>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              {renderEmailList(mentionEmails)}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CommunicationsModule;
