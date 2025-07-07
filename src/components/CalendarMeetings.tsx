import { Calendar, Video, Check, Eye, ChevronRight, ChevronDown, Plus, Clock, Minus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import ActionButton from "./ActionButton";
import ModuleInfoTooltip from "./ModuleInfoTooltip";

interface Meeting {
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  isOnline: boolean;
  day: "today" | "tomorrow";
  priority?: "high" | "medium" | "low";
}

interface CalendarMeetingsProps {
  onMinimize?: () => void;
}

const CalendarMeetings = ({ onMinimize }: CalendarMeetingsProps) => {
  const [showTomorrow, setShowTomorrow] = useState(false);
  const lastUpdated = new Date();

  const allMeetings: Meeting[] = [
    {
      title: "Weekly Team Standup",
      startTime: "2:00 PM",
      endTime: "2:30 PM",
      location: "Teams Meeting",
      organizer: "Sarah Johnson",
      isOnline: true,
      day: "today"
    },
    {
      title: "Q4 Budget Review Meeting",
      startTime: "3:30 PM",
      endTime: "4:30 PM",
      location: "Conference Room A",
      organizer: "Michael Chen",
      isOnline: false,
      day: "today"
    },
    {
      title: "Client Presentation Prep",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      location: "Zoom Meeting",
      organizer: "Lisa Rodriguez",
      isOnline: true,
      day: "tomorrow"
    },
    {
      title: "Sprint Planning Session",
      startTime: "2:00 PM",
      endTime: "3:30 PM",
      location: "Teams Meeting",
      organizer: "David Kim",
      isOnline: true,
      day: "tomorrow"
    },
    {
      title: "1:1 with Manager",
      startTime: "4:00 PM",
      endTime: "4:30 PM",
      location: "Conference Room B",
      organizer: "Emma Thompson",
      isOnline: false,
      day: "tomorrow"
    }
  ];

  const quickActions = [
    "Join Meeting - Join online meeting link",
    "Accept/Decline - Respond to meeting invite",
    "View Details - See full meeting details",
    "Schedule New - Create a new meeting",
    "Check Availability - View free time slots"
  ];

  const displayedMeetings = showTomorrow 
    ? allMeetings.filter(meeting => meeting.day === "tomorrow")
    : allMeetings.filter(meeting => meeting.day === "today");

  const todayCount = allMeetings.filter(m => m.day === "today").length;
  const tomorrowCount = allMeetings.filter(m => m.day === "tomorrow").length;
  const totalCount = allMeetings.length;

  const handleJoinMeeting = (meeting: Meeting) => {
    console.log("Join meeting:", meeting.title);
  };

  const handleAcceptDecline = (meeting: Meeting) => {
    console.log("Accept/Decline meeting:", meeting.title);
  };

  const handleViewDetails = (meeting: Meeting) => {
    console.log("View details for:", meeting.title);
  };

  const handleScheduleNew = () => {
    console.log("Schedule new meeting");
  };

  const handleCheckAvailability = () => {
    console.log("Check availability");
  };

  const toggleTomorrowView = () => {
    setShowTomorrow(!showTomorrow);
  };

  return (
    <Card className="h-full flex flex-col bg-white border border-gray-200 overflow-hidden text-black font-frutiger font-light">
      <CardHeader className="pb-2 bg-white flex-shrink-0 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-pal-red font-dm-sans">
              <Calendar className="h-5 w-5" />
              Calendar Meetings
            </CardTitle>
            <Badge className="bg-green-600 text-white">
              {totalCount} meetings
            </Badge>
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
            <ModuleInfoTooltip title="Calendar Meetings" quickActions={quickActions} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-gray-500">
            {showTomorrow ? `Tomorrow's meetings (${tomorrowCount})` : `Today's meetings (${todayCount})`}
          </div>
          <button
            onClick={toggleTomorrowView}
            className="flex items-center text-xs text-ubs-red hover:text-ubs-red-dark transition-colors"
          >
            {showTomorrow ? (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Show Today
              </>
            ) : (
              <>
                <ChevronRight className="h-3 w-3 mr-1" />
                Show Tomorrow
              </>
            )}
          </button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-3 pr-2">
            {displayedMeetings.map((meeting, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${
                  meeting.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
                } hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-800 mb-1">{meeting.title}</h3>
                    <div className="flex gap-4 text-xs text-gray-600 mb-1">
                      <span>{meeting.startTime} - {meeting.endTime}</span>
                      <span className="flex items-center gap-1">
                        {meeting.isOnline && <Video className="h-3 w-3" />}
                        {meeting.location}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">Organizer: {meeting.organizer}</span>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <ActionButton
                      icon={Video}
                      label="Join Meeting"
                      onClick={() => handleJoinMeeting(meeting)}
                    />
                    <ActionButton
                      icon={Check}
                      label="Accept/Decline"
                      onClick={() => handleAcceptDecline(meeting)}
                    />
                    <ActionButton
                      icon={Eye}
                      label="View Details"
                      onClick={() => handleViewDetails(meeting)}
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

export default CalendarMeetings;
