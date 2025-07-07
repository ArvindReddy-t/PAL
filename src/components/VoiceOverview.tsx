import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIResponseHandler } from "@/utils/AIResponseHandler";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  module?: string;
  critical?: boolean;
  url?: string;
}

// TypeScript compatibility for browsers/environments missing these types
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onaudioend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

declare global {
  interface Window {
    webkitSpeechRecognition: unknown;
    SpeechRecognition: unknown;
  }
}

const VoiceOverview = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const geminiApiKey = "AIzaSyA_qGG7EyoIxN7NQFU2TgFBruVz4aUavlY";

  // Add new state for animating message
  const [animatingMessage, setAnimatingMessage] = useState<Message | null>(null);
  const [animatingText, setAnimatingText] = useState("");

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window.webkitSpeechRecognition || window.SpeechRecognition) as { new (): SpeechRecognition };
      const recognitionInstance = new SpeechRecognitionConstructor();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    // Provide modular initial overview
    provideModularOverview();
  }, []);

  const handleMessageClick = (url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Update provideModularOverview for brief, cinematic alerts
  const provideModularOverview = () => {
    const now = new Date();
    setLastUpdated(now);

    // Use brief, eye-catching alert text
    const overviewMessages: Message[] = [
      // GitLab block first
      {
        id: `${now.getTime()}_gitlab`,
        text: "5 GitLab issues (1 due today)",
        isUser: false,
        timestamp: now,
        module: "gitlab",
        url: "https://goto/gitlab"
      },
      // Others block
      {
        id: `${now.getTime()}_others`,
        text: [
          "you have 2 meeting conflicts today.",
          "1 mandatory training is due by tomorrow."
        ].join("\n\n"),
        isUser: false,
        timestamp: now,
        module: "Others",
        critical: true,
        url: ""
      },
      // Approvals block
      {
        id: `${now.getTime()}_access`,
        text: [
          "2 change tasks scheduled today are still waiting for your approval.",
          "4 BBS requests are pending with you.",
          "2 AGNES requests have been waiting for your review for a week.",
          "3 HRi shift allowance requests are in your queue.",
          "Your affirmations are overdue. Please submit ASAP"
        ].join("\n\n"),
        isUser: false,
        timestamp: now,
        module: "Approvals",
        critical: false,
        url: "https://accessmanagement.company.com"
      },
      // Communications block
      {
        id: `${now.getTime()}_email`,
        text: [
          "Joe and Beste are waiting for your reply since a week.",
          "Jack sent 4 remainders for a budget approval please review and respond at the earliest."
        ].join("\n\n"),
        isUser: false,
        timestamp: now,
        module: "communications",
        critical: true,
        url: "https://outlook.office.com"
      },
      // ServiceNow block last (will show at the bottom visually)
      {
        id: `${now.getTime()}_servicenow_combined`,
        text: [
          "INC123456 (Sev-4): MC channel Incident_34 opened, your group’s response needed—please attend ASAP.",
          "SLA Breach: 3 assigned incidents have breached SLA. Immediate review required.",
          "Change Task: 1 change task ends in 1 hour. Please check."
        ].join("\n\n"),
        isUser: false,
        timestamp: now,
        module: "servicenow",
        critical: true,
        url: "https://gsnow.ubs.net"
      }
    ];

    setMessages([]);
    let idx = 0;
    const showNextMessage = () => {
      if (idx >= overviewMessages.length) return;
      const msg = overviewMessages[idx];
      setAnimatingMessage(msg);
      setAnimatingText("");
      const words = msg.text.split(" ");
      let wordIdx = 0;
      const animate = () => {
        setAnimatingText(words.slice(0, wordIdx + 1).join(" "));
        if (wordIdx < words.length - 1) {
          wordIdx++;
          setTimeout(animate, 120);
        } else {
          // After animation, add to messages at the top
          setTimeout(() => {
            setMessages(prev => [msg, ...prev]);
            setAnimatingMessage(null);
            setAnimatingText("");
            idx++;
            setTimeout(showNextMessage, 400); // Short pause before next alert
          }, 600);
        }
      };
      animate();
    };
    showNextMessage();
  };

  const handleUserMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Check if it's work-related
    const aiHandler = new AIResponseHandler(geminiApiKey);
    const isWorkRelated = text.toLowerCase().includes('email') || 
                         text.toLowerCase().includes('ticket') || 
                         text.toLowerCase().includes('meeting') ||
                         text.toLowerCase().includes('task') ||
                         text.toLowerCase().includes('gitlab') ||
                         text.toLowerCase().includes('calendar') ||
                         text.toLowerCase().includes('overview') ||
                         text.toLowerCase().includes('summary');

    if (!isWorkRelated) {
      const confirmMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "This question doesn't seem work-related. Would you like me to search the web for an answer? Please say 'yes' or 'no'.",
        isUser: false,
        timestamp: new Date()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, confirmMessage]);
        // speakText(confirmMessage.text); // Removed speakText
      }, 500);
      return;
    }

    // Handle work-related questions
    const aiResponse = await aiHandler.getAIResponse(text);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse.response,
      isUser: false,
      timestamp: new Date()
    };

    setTimeout(() => {
      setMessages(prev => [...prev, aiMessage]);
      // speakText(aiResponse.response); // Removed speakText
    }, 1000);
  };

  const speakText = (text: string) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleUserMessage(inputText);
      setInputText("");
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden text-black font-frutiger font-light" style={{ backgroundColor: 'rgb(142,141,131)' }}>
      <CardHeader className="pb-2 bg-white flex-shrink-0" />
      
      <CardContent className="flex-1 flex flex-col gap-3 overflow-hidden bg-white">
        <ScrollArea className="flex-1 flex flex-col justify-start">
          <div className="flex flex-col gap-2 pr-2 h-full justify-start">
            {animatingMessage && (
              <div
                key={animatingMessage.id + '-animating'}
                className={`p-2 rounded-lg text-sm font-frutiger text-black font-semibold bg-yellow-100 animate-pulse`}
                style={{ minHeight: 32 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {animatingMessage.module && (
                      <Badge className="mb-1 text-xs bg-yellow-300 text-black font-frutiger font-semibold">
                        {animatingMessage.module.toUpperCase()}
                      </Badge>
                    )}
                    <div className="text-sm">{animatingText}</div>
                  </div>
                </div>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-2 rounded-lg text-sm font-frutiger text-black ${
                  message.isUser
                    ? 'bg-gray-200 ml-6'
                    : 'bg-white mr-6 cursor-pointer hover:shadow-sm'
                }`}
                onClick={() => !message.isUser && handleMessageClick(message.url)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {message.module && !message.isUser && (
                      <Badge className="mb-1 text-xs bg-gray-300 text-black font-frutiger font-semibold" variant={message.critical ? "destructive" : "secondary"}>
                        {message.module.toUpperCase()}
                      </Badge>
                    )}
                    <div className="text-sm whitespace-pre-line">{message.text}</div>
                  </div>
                </div>
                <div className="text-xs mt-1 opacity-70 text-black">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex-shrink-0 space-y-2">
          <form onSubmit={handleTextSubmit} className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about work overview or any question..."
              className="text-sm bg-white border-gray-300 text-black font-frutiger"
            />
            <Button type="submit" size="sm" className="bg-gray-800 hover:bg-gray-900 text-white font-frutiger font-semibold">
              Send
            </Button>
          </form>

          <div className="flex gap-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              variant={isListening ? "destructive" : "default"}
              size="sm"
              className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-frutiger font-semibold"
            >
              {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
              {isListening ? "Stop" : "Listen"}
            </Button>
            
            <Button
              onClick={isSpeaking ? stopSpeaking : () => {}}
              variant={isSpeaking ? "destructive" : "secondary"}
              size="sm"
              className="flex-1 bg-white border border-gray-300 text-black hover:bg-gray-50 font-frutiger font-semibold"
              disabled={!isSpeaking}
            >
              {isSpeaking ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
              {isSpeaking ? "Stop" : "Speak"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceOverview;
