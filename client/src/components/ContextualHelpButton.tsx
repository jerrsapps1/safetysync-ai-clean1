import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HelpCircle, MessageSquare, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface ContextualHelpButtonProps {
  currentPage: string;
  userQuestion?: string;
}

interface HelpResponse {
  answer: string;
  relatedFeatures: string[];
  quickActions: Array<{
    label: string;
    action: string;
  }>;
}

export function ContextualHelpButton({ currentPage, userQuestion }: ContextualHelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<HelpResponse | null>(null);
  const { toast } = useToast();

  const getContextualPrompt = (page: string, userQuestion: string) => {
    const pageContext = {
      "unified-dashboard": "The user is on the main dashboard with widgets showing compliance statistics, employee data, and safety metrics.",
      "company-profile": "The user is setting up their company profile with business information, industry selection, and organizational details.",
      "employees": "The user is managing employee records, viewing employee lists, and handling employee data.",
      "osha-compliance": "The user is configuring OSHA training standards and compliance requirements.",
      "ai-document-processor": "The user is uploading and processing training documents using AI extraction.",
      "certificates": "The user is generating and managing employee certificates and certifications.",
      "training": "The user is managing training programs, sessions, and employee training assignments.",
      "reports": "The user is viewing and generating compliance reports and analytics.",
      "employee-portal": "The user is in the employee portal viewing individual employee profiles and certificates.",
      "notifications": "The user is managing notifications and alert settings.",
      "settings": "The user is configuring workspace settings and preferences."
    };

    const context = pageContext[page as keyof typeof pageContext] || "The user is in the SafetySync.AI workspace.";
    
    return `You are an AI assistant for SafetySync.AI, a comprehensive OSHA compliance and safety management platform. 

Current context: ${context}

User question: "${userQuestion}"

Please provide:
1. A helpful, specific answer to their question
2. 2-3 related features they might find useful
3. 1-2 quick actions they can take right now

Respond in JSON format:
{
  "answer": "Clear, actionable answer to their question",
  "relatedFeatures": ["Feature 1", "Feature 2", "Feature 3"],
  "quickActions": [
    {"label": "Action description", "action": "specific_action_name"},
    {"label": "Another action", "action": "another_action_name"}
  ]
}

Keep responses focused on OSHA compliance, safety management, training documentation, and platform features.`;
  };

  const handleGetHelp = async () => {
    if (!question.trim()) {
      toast({
        title: "Please enter a question",
        description: "Type your question to get AI-powered assistance.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/contextual-help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          currentPage,
          question: question.trim(),
          prompt: getContextualPrompt(currentPage, question.trim())
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI assistance');
      }

      const data = await response.json();
      setResponse(data.response);
      
      toast({
        title: "AI Assistance Ready",
        description: "Your contextual help has been generated.",
      });
    } catch (error) {
      console.error('Error getting AI help:', error);
      toast({
        title: "Error",
        description: "Failed to get AI assistance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    // Emit custom events that the parent component can listen to
    window.dispatchEvent(new CustomEvent('contextual-help-action', { 
      detail: { action, currentPage } 
    }));
    
    toast({
      title: "Action Triggered",
      description: `Executing: ${action}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-100 hover:text-blue-200 hover:bg-blue-600/50 border-blue-400"
          title="Get AI-powered help"
        >
          <HelpCircle className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 border-blue-700">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
            AI-Powered Help
          </DialogTitle>
          <DialogDescription className="text-blue-100">
            Get contextual assistance for your current workspace
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">
              What do you need help with?
            </label>
            <Textarea
              placeholder="e.g., How do I upload training documents? What's the best way to track compliance?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="bg-black/20 border-blue-700 text-white placeholder:text-blue-200"
              rows={3}
            />
          </div>
          
          <Button
            onClick={handleGetHelp}
            disabled={isLoading || !question.trim()}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Getting AI Assistance...
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 mr-2" />
                Get Help
              </>
            )}
          </Button>
          
          {response && (
            <div className="space-y-4 pt-4 border-t border-blue-700">
              <div>
                <h4 className="font-medium text-white mb-2">AI Response:</h4>
                <div className="bg-black/20 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-blue-100 text-sm leading-relaxed">
                    {response.answer}
                  </p>
                </div>
              </div>
              
              {response.relatedFeatures.length > 0 && (
                <div>
                  <h4 className="font-medium text-white mb-2">Related Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {response.relatedFeatures.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-700/50 text-blue-100">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {response.quickActions.length > 0 && (
                <div>
                  <h4 className="font-medium text-white mb-2">Quick Actions:</h4>
                  <div className="space-y-2">
                    {response.quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action.action)}
                        className="w-full justify-start bg-black/10 border-blue-600 text-white hover:bg-blue-600/20"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}