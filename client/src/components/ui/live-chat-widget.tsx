import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Clock,
  CheckCircle,
  Minimize2,
  Maximize2
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

interface LiveChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function LiveChatWidget({ isOpen, onToggle, onClose }: LiveChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! Welcome to SafetySync support. How can I help you today?',
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'online' | 'away' | 'busy'>('online');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "How does SafetySync work?",
    "What's the pricing?",
    "Can I get a demo?",
    "Integration questions",
    "Technical support"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      setIsTyping(false);
      const agentResponse = generateAgentResponse(newMessage);
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: agentResponse,
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 1500);

    // Update message status
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 500);
  };

  const generateAgentResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('price') || lowerText.includes('cost')) {
      return "Our pricing starts at $99/month for up to 100 employees. We also offer Professional ($199/month) and Enterprise plans. Would you like me to connect you with our sales team for a detailed quote?";
    }
    
    if (lowerText.includes('demo')) {
      return "I'd be happy to schedule a demo for you! Our product demonstrations typically last 30 minutes and cover all key features. Would you prefer this week or next week?";
    }
    
    if (lowerText.includes('integration')) {
      return "SafetySync integrates with most popular HR systems including BambooHR, Workday, and ADP. We also offer REST API access. What system are you looking to integrate with?";
    }
    
    if (lowerText.includes('osha') || lowerText.includes('compliance')) {
      return "SafetySync helps with all aspects of OSHA compliance including training tracking, certification management, and audit-ready reports. What specific compliance challenge are you facing?";
    }
    
    return "Thanks for your question! Let me connect you with one of our specialists who can provide detailed information. In the meantime, you can also check our FAQ section or schedule a demo.";
  };

  const handleQuickReply = (reply: string) => {
    setNewMessage(reply);
    // Automatically send the quick reply message
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: reply,
        sender: 'user',
        timestamp: new Date(),
        status: 'sending'
      };

      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setIsTyping(true);

      // Simulate agent response
      setTimeout(() => {
        setIsTyping(false);
        const agentResponse = generateAgentResponse(reply);
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: agentResponse,
          sender: 'agent',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, agentMessage]);
      }, 1500);

      // Update message status
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
        ));
      }, 500);
    }, 100);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onToggle}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-80 h-96 shadow-xl transition-all duration-300 ${isMinimized ? 'h-14' : 'h-96'}`}>
        {/* Header */}
        <CardHeader className="p-4 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                  agentStatus === 'online' ? 'bg-green-500' : 
                  agentStatus === 'away' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
              </div>
              <div>
                <CardTitle className="text-sm">SafetySync Support</CardTitle>
                <CardDescription className="text-xs text-blue-100">
                  {agentStatus === 'online' ? 'Online now' : 
                   agentStatus === 'away' ? 'Away' : 'Busy'}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 text-white hover:bg-blue-500"
              >
                {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0 text-white hover:bg-blue-500"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="p-0 flex-1 overflow-hidden">
              <div className="h-64 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.sender === 'user' && message.status && (
                          <div className="ml-2">
                            {message.status === 'sending' && <Clock className="w-3 h-3 opacity-70" />}
                            {message.status === 'delivered' && <CheckCircle className="w-3 h-3 opacity-70" />}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-bl-none">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {messages.length === 1 && (
                <div className="px-4 pb-2">
                  <div className="text-xs text-gray-500 mb-2">Quick questions:</div>
                  <div className="flex flex-wrap gap-1">
                    {quickReplies.slice(0, 3).map((reply) => (
                      <Button
                        key={reply}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6 px-2"
                        onClick={() => handleQuickReply(reply)}
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} size="sm" disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}