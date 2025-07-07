
import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, X, Minimize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MessageList from "./MessageList";
import VoiceControls from "./VoiceControls";
import { AIResponseHandler } from "@/utils/AIResponseHandler";
import { Message } from "@/types/VoiceAssistant";

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  // Use hardcoded API key (moved from UI)
  const geminiApiKey = "AIzaSyA_qGG7EyoIxN7NQFU2TgFBruVz4aUavlY";

  const handleUserMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Get AI response
    const aiHandler = new AIResponseHandler(geminiApiKey);
    const aiResponse = await aiHandler.getAIResponse(text);
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponse.response,
      isUser: false,
      timestamp: new Date(),
      followUpQuestions: aiResponse.followUp
    };

    setTimeout(() => {
      setMessages(prev => [...prev, aiMessage]);
      speakText(aiResponse.response);
    }, 1000);
  };

  const handleFollowUpClick = (question: string) => {
    handleUserMessage(question);
  };

  const speakText = (text: string) => {
    setIsSpeaking(true);
    if ((window as any).voiceControlsSpeakText) {
      (window as any).voiceControlsSpeakText(text, () => setIsSpeaking(false));
    } else {
      // Fallback to Web Speech API
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartListening = () => {
    setIsListening(true);
  };

  const handleStopListening = () => {
    setIsListening(false);
  };

  const handleStopSpeaking = () => {
    setIsSpeaking(false);
    window.speechSynthesis.cancel();
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleUserMessage(inputText);
      setInputText("");
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Set up speech recognition result handling
  useEffect(() => {
    const handleSpeechResult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleUserMessage(transcript);
    };

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.onresult = handleSpeechResult;
      (window as any).speechRecognition = recognition;
    }
  }, []);

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-12 h-12 rounded-full bg-ubs-red hover:bg-ubs-red-dark text-white shadow-lg"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-[500px]">
      <Card className="h-full flex flex-col shadow-xl">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-ubs-red flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              PAL 
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="h-6 w-6 p-0"
                title="Clear Chat"
              >
                <X className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6 p-0"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-3 gap-3 overflow-hidden">
          <MessageList 
            messages={messages} 
            onFollowUpClick={handleFollowUpClick} 
          />

          <form onSubmit={handleTextSubmit} className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about work or anything..."
              className="text-xs h-8"
            />
            <Button type="submit" size="sm" className="h-8 px-2">
              Send
            </Button>
          </form>

          <VoiceControls
            isListening={isListening}
            isSpeaking={isSpeaking}
            onStartListening={handleStartListening}
            onStopListening={handleStopListening}
            onStopSpeaking={handleStopSpeaking}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAssistant;
