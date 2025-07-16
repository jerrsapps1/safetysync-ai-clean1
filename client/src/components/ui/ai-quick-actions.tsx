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
  Settings,
  RefreshCw,
  X
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
      content: 'Hello! I\'m SYNC (Safety & Compliance Navigation Center), your AI compliance assistant. I operate within OSHA guidelines and can help with training schedules, regulatory updates, compliance gaps, equipment procedures, and automated reporting. I cannot override safety protocols but will escalate complex decisions to qualified experts. What would you like to work on?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Add debug logging
  useEffect(() => {
    console.log('AI Quick Actions component mounted, isExpanded:', isExpanded);
  }, [isExpanded]);
  
  // Enhanced actions with workspace integration
  const executeAction = async (actionId: string) => {
    setIsProcessing(true);
    
    try {
      switch(actionId) {
        case 'generate-training-schedule':
          // Simulate API call to generate training schedule
          await new Promise(resolve => setTimeout(resolve, 2000));
          console.log('Training schedule generated successfully');
          break;
        case 'compliance-gap-analysis':
          // Simulate compliance analysis
          await new Promise(resolve => setTimeout(resolve, 500));
          console.log('Compliance gap analysis completed');
          break;
        case 'auto-assign-training':
          // Simulate auto-assignment
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('Training auto-assigned successfully');
          break;
        case 'evaluation-reminder-check':
          // Simulate evaluation check
          await new Promise(resolve => setTimeout(resolve, 500));
          console.log('Missing evaluations identified');
          break;
        case 'bulk-certification-check':
          // Simulate bulk certification check
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('Certification status checked');
          break;
        default:
          console.log(`Action ${actionId} executed`);
      }
      
      onActionExecute?.(actionId);
    } finally {
      setIsProcessing(false);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'generate-training-schedule',
      title: 'Generate Smart Training Schedule',
      description: 'Create optimized training calendar based on certification deadlines and employee availability',
      category: 'automation',
      priority: 'high',
      estimatedTime: '2 min',
      icon: <Calendar className="w-4 h-4" />,
      action: () => executeAction('generate-training-schedule')
    },
    {
      id: 'compliance-gap-analysis',
      title: 'Instant Compliance Gap Analysis',
      description: 'AI analysis of current compliance status with actionable recommendations',
      category: 'analysis',
      priority: 'high',
      estimatedTime: '30 sec',
      icon: <Target className="w-4 h-4" />,
      action: () => executeAction('compliance-gap-analysis')
    },
    {
      id: 'auto-assign-training',
      title: 'Auto-Assign Training',
      description: 'Intelligently assign training based on roles, deadlines, and regulatory requirements',
      category: 'automation',
      priority: 'medium',
      estimatedTime: '1 min',
      icon: <Users className="w-4 h-4" />,
      action: () => executeAction('auto-assign-training')
    },
    {
      id: 'evaluation-reminder-check',
      title: 'Check Missing Training Evaluations',
      description: 'Scan for required evaluations missing from practical skill training records',
      category: 'compliance',
      priority: 'high',
      estimatedTime: '30 sec',
      icon: <FileText className="w-4 h-4" />,
      action: () => executeAction('evaluation-reminder-check')
    },
    {
      id: 'regulatory-updates',
      title: 'Latest Regulatory Updates',
      description: 'Get personalized OSHA and industry regulation updates relevant to your business',
      category: 'compliance',
      priority: 'medium',
      estimatedTime: '1 min',
      icon: <Bell className="w-4 h-4" />,
      action: () => executeAction('regulatory-updates')
    },
    {
      id: 'bulk-certification-check',
      title: 'Bulk Certification Status Check',
      description: 'Verify all employee certifications and flag expiring ones',
      category: 'automation',
      priority: 'high',
      estimatedTime: '45 sec',
      icon: <CheckCircle className="w-4 h-4" />,
      action: () => executeAction('bulk-certification-check')
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
      } else if (userMessage.toLowerCase().includes('help') || userMessage.toLowerCase().includes('support') || userMessage.toLowerCase().includes('issue')) {
        aiResponse = 'I understand you need assistance beyond my current capabilities. I\'m creating a help desk ticket for you - ticket number will be provided shortly. A qualified expert will review your request and provide support during business hours.';
        
        // Create help desk ticket
        try {
          const ticketData = {
            userId: 1, // Default user ID for demo
            title: `SYNC AI Escalation: ${userMessage.slice(0, 50)}...`,
            description: `User requested assistance with: ${userMessage}\n\nSYNC AI Response: This request requires expert attention and has been escalated automatically.`,
            priority: 'medium' as const,
            category: 'sync_escalation',
            syncContext: {
              userMessage,
              timestamp: new Date().toISOString(),
              conversationHistory: chatHistory.slice(-5) // Last 5 messages for context
            }
          };
          
          fetch('/api/help-desk/tickets', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(ticketData),
          })
          .then(response => response.json())
          .then(ticket => {
            setChatHistory(prev => [...prev, {
              role: 'ai',
              content: `Help desk ticket created successfully! Ticket #${ticket.ticketNumber}. An expert will review your request and contact you during business hours. You can reference this ticket number for follow-up.`,
              timestamp: new Date().toISOString()
            }]);
          })
          .catch(error => {
            console.error('Error creating help desk ticket:', error);
            setChatHistory(prev => [...prev, {
              role: 'ai',
              content: 'I encountered an issue creating your help desk ticket. Please contact support directly at support@safetysync.ai or try again later.',
              timestamp: new Date().toISOString()
            }]);
          });
        } catch (error) {
          console.error('Error creating help desk ticket:', error);
        }
      } else {
        aiResponse = 'I understand you need help with compliance management. I can assist with training schedules, certification tracking, regulatory updates, automated reporting, and compliance gap analysis. For complex issues beyond my capabilities, I can create a help desk ticket for expert review. What specific task would you like to tackle first?';
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
    <div className="fixed right-4 bottom-4 z-[9999]">
      {!isExpanded ? (
        // Collapsed state - floating action button
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('AI Assistant button clicked - expanding');
            setIsExpanded(true);
          }}
          className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-xl border-2 border-blue-200"
          title="Open AI Assistant"
        >
          <Zap className="w-8 h-8 animate-pulse" />
        </Button>
      ) : (
        // Expanded state - full widget
        <Card className="w-96 shadow-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="text-sm">AI Assistant</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('AI Assistant button clicked - collapsing');
                  setIsExpanded(false);
                }}
                title="Minimize AI Assistant"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
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
                            onClick={() => action.action()}
                            className="text-xs"
                            disabled={isProcessing}
                          >
                            {isProcessing ? (
                              <>
                                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                Working...
                              </>
                            ) : (
                              <>
                                <ArrowRight className="w-3 h-3 mr-1" />
                                Go
                              </>
                            )}
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
        </Card>
      )}
    </div>
  );
}