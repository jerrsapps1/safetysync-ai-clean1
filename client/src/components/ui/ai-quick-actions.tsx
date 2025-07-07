import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Zap, 
  Brain, 
  FileText, 
  Calendar, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Search,
  Send,
  Lightbulb,
  Target,
  Clock,
  Shield,
  BookOpen,
  BarChart3,
  Sparkles,
  ArrowRight,
  Download,
  Bell,
  Eye,
  Settings
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  category: 'automation' | 'analysis' | 'compliance' | 'training' | 'reporting';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  action: () => void;
  icon: React.ReactNode;
}

interface AIInsight {
  id: string;
  type: 'recommendation' | 'alert' | 'opportunity' | 'trend';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  timestamp: string;
}

interface AIQuickActionsProps {
  onActionExecute?: (actionId: string) => void;
  currentPage?: string;
}

export function AIQuickActions({ onActionExecute, currentPage = 'dashboard' }: AIQuickActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'actions' | 'insights' | 'chat'>('actions');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{role: 'user' | 'ai', content: string, timestamp: string}>>([
    {
      role: 'ai',
      content: 'Hello! I\'m your AI compliance assistant. I can help you with training schedules, regulatory updates, compliance gaps, and automated reporting. What would you like to work on?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: 'generate-training-schedule',
      title: 'Generate Smart Training Schedule',
      description: 'Create optimized training calendar based on certification deadlines and employee availability',
      category: 'automation',
      priority: 'high',
      estimatedTime: '2 min',
      icon: <Calendar className="w-4 h-4" />,
      action: () => console.log('Generating training schedule...')
    },
    {
      id: 'compliance-gap-analysis',
      title: 'Instant Compliance Gap Analysis',
      description: 'AI analysis of current compliance status with actionable recommendations',
      category: 'analysis',
      priority: 'high',
      estimatedTime: '30 sec',
      icon: <Target className="w-4 h-4" />,
      action: () => console.log('Running compliance analysis...')
    },
    {
      id: 'auto-assign-training',
      title: 'Auto-Assign Training',
      description: 'Intelligently assign training based on roles, deadlines, and regulatory requirements',
      category: 'automation',
      priority: 'medium',
      estimatedTime: '1 min',
      icon: <Users className="w-4 h-4" />,
      action: () => console.log('Auto-assigning training...')
    },
    {
      id: 'evaluation-reminder-check',
      title: 'Check Missing Training Evaluations',
      description: 'Scan for required evaluations missing from practical skill training records',
      category: 'compliance',
      priority: 'high',
      estimatedTime: '30 sec',
      icon: <FileText className="w-4 h-4" />,
      action: () => console.log('Checking missing evaluations...')
    },
    {
      id: 'regulatory-updates',
      title: 'Latest Regulatory Updates',
      description: 'Get personalized OSHA and industry regulation updates relevant to your business',
      category: 'compliance',
      priority: 'medium',
      estimatedTime: '1 min',
      icon: <Bell className="w-4 h-4" />,
      action: () => console.log('Fetching regulatory updates...')
    },
    {
      id: 'bulk-certification-check',
      title: 'Bulk Certification Status Check',
      description: 'Verify all employee certifications and flag expiring ones',
      category: 'automation',
      priority: 'high',
      estimatedTime: '45 sec',
      icon: <CheckCircle className="w-4 h-4" />,
      action: () => console.log('Checking certifications...')
    },
    {
      id: 'smart-report-builder',
      title: 'Smart Report Builder',
      description: 'AI-powered report generation with intelligent insights and recommendations',
      category: 'reporting',
      priority: 'medium',
      estimatedTime: '2 min',
      icon: <FileText className="w-4 h-4" />,
      action: () => console.log('Building smart report...')
    },
    {
      id: 'training-effectiveness',
      title: 'Training Effectiveness Analysis',
      description: 'Analyze training completion rates and suggest improvements',
      category: 'analysis',
      priority: 'low',
      estimatedTime: '3 min',
      icon: <TrendingUp className="w-4 h-4" />,
      action: () => console.log('Analyzing training effectiveness...')
    },
    {
      id: 'safety-meeting-agenda',
      title: 'Generate Safety Meeting Agenda',
      description: 'Create data-driven meeting agendas based on current compliance status',
      category: 'automation',
      priority: 'medium',
      estimatedTime: '1 min',
      icon: <BookOpen className="w-4 h-4" />,
      action: () => console.log('Creating meeting agenda...')
    }
  ];

  const aiInsights: AIInsight[] = [
    {
      id: '1',
      type: 'alert',
      title: 'Certification Deadline Clustering',
      description: '15 employees have certifications expiring within the next 30 days. Consider bulk renewal scheduling.',
      confidence: 92,
      actionable: true,
      timestamp: '2025-01-06T11:30:00Z'
    },
    {
      id: '2',
      type: 'alert',
      title: 'Missing Training Evaluations Detected',
      description: '7 employees completed practical training but are missing required evaluation documentation. Upload needed for audit compliance.',
      confidence: 98,
      actionable: true,
      timestamp: '2025-01-06T10:15:00Z'
    },
    {
      id: '2b',
      type: 'recommendation',
      title: 'Annual Evaluation Upload Reminder',
      description: '12 employees eligible for yearly evaluation uploads. Best practice to maintain comprehensive training records.',
      confidence: 85,
      actionable: true,
      timestamp: '2025-01-06T10:10:00Z'
    },
    {
      id: '3',
      type: 'trend',
      title: 'Compliance Score Trending Up',
      description: 'Overall compliance has improved 12% this quarter. Current initiatives are working well.',
      confidence: 95,
      actionable: false,
      timestamp: '2025-01-06T09:45:00Z'
    },
    {
      id: '4',
      type: 'opportunity',
      title: 'Cross-Training Potential',
      description: '8 employees qualified for additional safety roles. Cross-training could improve coverage.',
      confidence: 78,
      actionable: true,
      timestamp: '2025-01-06T08:20:00Z'
    }
  ];

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || isProcessing) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setIsProcessing(true);

    // Add user message
    setChatHistory(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }]);

    // Simulate AI processing
    setTimeout(() => {
      let aiResponse = '';
      
      // Simple keyword-based responses for demo
      if (userMessage.toLowerCase().includes('training')) {
        aiResponse = 'I can help with training management! Based on your current data, you have 3 overdue training assignments and 15 certifications expiring soon. Would you like me to create an optimized training schedule or auto-assign the overdue trainings?';
      } else if (userMessage.toLowerCase().includes('compliance')) {
        aiResponse = 'Your current compliance score is 87%. I\'ve identified 5 areas for improvement: fall protection renewals, hazcom updates, emergency procedure reviews, safety meeting documentation, and equipment inspection logs. Shall I prioritize these for you?';
      } else if (userMessage.toLowerCase().includes('report')) {
        aiResponse = 'I can generate several types of reports: compliance summary, training status, certification tracking, department analysis, or audit preparation. Which type would be most helpful right now?';
      } else if (userMessage.toLowerCase().includes('schedule')) {
        aiResponse = 'I can create intelligent schedules for training, renewals, meetings, or audits. Based on your team\'s availability and certification deadlines, I recommend prioritizing fall protection training for the manufacturing team next week. Shall I create the schedule?';
      } else {
        aiResponse = 'I understand you need help with compliance management. I can assist with training schedules, certification tracking, regulatory updates, automated reporting, and compliance gap analysis. What specific task would you like to tackle first?';
      }

      setChatHistory(prev => [...prev, {
        role: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString()
      }]);
      
      setIsProcessing(false);
    }, 1000 + Math.random() * 2000);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'recommendation': return <Lightbulb className="w-4 h-4 text-blue-500" />;
      case 'opportunity': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'trend': return <BarChart3 className="w-4 h-4 text-purple-500" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'automation': return 'bg-blue-100 text-blue-800';
      case 'analysis': return 'bg-purple-100 text-purple-800';
      case 'compliance': return 'bg-red-100 text-red-800';
      case 'training': return 'bg-green-100 text-green-800';
      case 'reporting': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredActions = quickActions.filter(action => 
    currentPage === 'dashboard' || action.category === 'automation' || action.priority === 'high'
  );

  return (
    <div className={`fixed right-4 top-20 z-50 transition-all duration-300 ${
      isExpanded ? 'w-96' : 'w-14'
    }`}>
      <Card className="shadow-lg border-2 border-blue-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 transition-opacity ${
              isExpanded ? 'opacity-100' : 'opacity-0'
            }`}>
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="text-sm">AI Assistant</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-shrink-0"
            >
              {isExpanded ? <Eye className="w-4 h-4" /> : <Zap className="w-4 h-4 text-blue-600" />}
            </Button>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={activeTab === 'actions' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('actions')}
                className="flex-1 text-xs"
              >
                Actions
              </Button>
              <Button
                variant={activeTab === 'insights' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('insights')}
                className="flex-1 text-xs"
              >
                Insights
              </Button>
              <Button
                variant={activeTab === 'chat' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('chat')}
                className="flex-1 text-xs"
              >
                Chat
              </Button>
            </div>

            {/* Quick Actions Tab */}
            {activeTab === 'actions' && (
              <ScrollArea className="h-80">
                <div className="space-y-3">
                  {filteredActions.map((action) => (
                    <Card key={action.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {action.icon}
                            <h4 className="text-sm font-medium">{action.title}</h4>
                          </div>
                          <Badge className={`text-xs ${getCategoryColor(action.category)}`}>
                            {action.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{action.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{action.estimatedTime}</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              action.action();
                              onActionExecute?.(action.id);
                            }}
                            className="text-xs"
                          >
                            <ArrowRight className="w-3 h-3 mr-1" />
                            Go
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* AI Insights Tab */}
            {activeTab === 'insights' && (
              <ScrollArea className="h-80">
                <div className="space-y-3">
                  {aiInsights.map((insight) => (
                    <Card key={insight.id} className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getInsightIcon(insight.type)}
                            <h4 className="text-sm font-medium">{insight.title}</h4>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {insight.confidence}% confident
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{insight.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {new Date(insight.timestamp).toLocaleTimeString()}
                          </span>
                          {insight.actionable && (
                            <Button size="sm" variant="outline" className="text-xs">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Act on this
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* AI Chat Tab */}
            {activeTab === 'chat' && (
              <div className="space-y-3">
                <ScrollArea className="h-64 border rounded-lg p-2">
                  <div className="space-y-3">
                    {chatHistory.map((message, index) => (
                      <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-2 rounded-lg text-xs ${
                          message.role === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 p-2 rounded-lg text-xs">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                <div className="flex space-x-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about compliance, training, or reports..."
                    className="text-xs"
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                    disabled={isProcessing}
                  />
                  <Button 
                    size="sm" 
                    onClick={handleChatSubmit}
                    disabled={!chatInput.trim() || isProcessing}
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}