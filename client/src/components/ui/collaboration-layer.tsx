import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Plus, 
  X, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Edit3,
  Send,
  Pin,
  Flag,
  User,
  MapPin
} from "lucide-react";

interface Annotation {
  id: string;
  x: number;
  y: number;
  author: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  type: 'comment' | 'issue' | 'approved' | 'question';
  resolved: boolean;
  replies: Reply[];
  priority: 'low' | 'medium' | 'high';
  category: string;
}

interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface CollaborationLayerProps {
  documentId: string;
  teamMembers: TeamMember[];
  onAnnotationAdd?: (annotation: Annotation) => void;
  onAnnotationUpdate?: (annotation: Annotation) => void;
  onAnnotationDelete?: (annotationId: string) => void;
}

export function CollaborationLayer({
  documentId,
  teamMembers,
  onAnnotationAdd,
  onAnnotationUpdate,
  onAnnotationDelete
}: CollaborationLayerProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: '1',
      x: 25,
      y: 15,
      author: 'Sarah Johnson',
      content: 'This section needs additional safety protocol documentation. The current risk assessment appears incomplete.',
      timestamp: '2025-01-06T10:30:00Z',
      type: 'issue',
      resolved: false,
      replies: [
        {
          id: 'r1',
          author: 'Mike Chen',
          content: 'I agree. Let me add the missing fall protection requirements.',
          timestamp: '2025-01-06T10:35:00Z'
        }
      ],
      priority: 'high',
      category: 'Safety Protocol'
    },
    {
      id: '2',
      x: 65,
      y: 40,
      author: 'David Wilson',
      content: 'Excellent compliance coverage for this department. Ready for approval.',
      timestamp: '2025-01-06T09:45:00Z',
      type: 'approved',
      resolved: true,
      replies: [],
      priority: 'low',
      category: 'Compliance Review'
    },
    {
      id: '3',
      x: 45,
      y: 75,
      author: 'Lisa Martinez',
      content: 'Question: Are the emergency evacuation procedures up to date? Last review was 6 months ago.',
      timestamp: '2025-01-06T11:15:00Z',
      type: 'question',
      resolved: false,
      replies: [],
      priority: 'medium',
      category: 'Emergency Procedures'
    }
  ]);

  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const [newAnnotationPosition, setNewAnnotationPosition] = useState<{x: number, y: number} | null>(null);
  const [newAnnotationContent, setNewAnnotationContent] = useState('');
  const [newAnnotationType, setNewAnnotationType] = useState<'comment' | 'issue' | 'approved' | 'question'>('comment');
  const [newAnnotationPriority, setNewAnnotationPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newAnnotationCategory, setNewAnnotationCategory] = useState('General');
  const [replyContent, setReplyContent] = useState('');
  const [activeUsers, setActiveUsers] = useState<string[]>(['Sarah Johnson', 'Mike Chen']);
  const [showResolved, setShowResolved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random user activity
      const randomUsers = teamMembers.filter(m => m.isOnline).map(m => m.name);
      const activeCount = Math.floor(Math.random() * randomUsers.length) + 1;
      setActiveUsers(randomUsers.slice(0, activeCount));
    }, 10000);

    return () => clearInterval(interval);
  }, [teamMembers]);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (isAddingAnnotation && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setNewAnnotationPosition({ x, y });
    }
  };

  const handleAddAnnotation = () => {
    if (newAnnotationPosition && newAnnotationContent.trim()) {
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        x: newAnnotationPosition.x,
        y: newAnnotationPosition.y,
        author: 'Current User',
        content: newAnnotationContent,
        timestamp: new Date().toISOString(),
        type: newAnnotationType,
        resolved: false,
        replies: [],
        priority: newAnnotationPriority,
        category: newAnnotationCategory
      };

      setAnnotations([...annotations, newAnnotation]);
      onAnnotationAdd?.(newAnnotation);
      
      // Reset form
      setNewAnnotationContent('');
      setNewAnnotationPosition(null);
      setIsAddingAnnotation(false);
    }
  };

  const handleAddReply = (annotationId: string) => {
    if (replyContent.trim()) {
      const updatedAnnotations = annotations.map(annotation => {
        if (annotation.id === annotationId) {
          const newReply: Reply = {
            id: Date.now().toString(),
            author: 'Current User',
            content: replyContent,
            timestamp: new Date().toISOString()
          };
          return {
            ...annotation,
            replies: [...annotation.replies, newReply]
          };
        }
        return annotation;
      });

      setAnnotations(updatedAnnotations);
      setReplyContent('');
    }
  };

  const handleResolveAnnotation = (annotationId: string) => {
    const updatedAnnotations = annotations.map(annotation => {
      if (annotation.id === annotationId) {
        return { ...annotation, resolved: !annotation.resolved };
      }
      return annotation;
    });

    setAnnotations(updatedAnnotations);
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    setAnnotations(annotations.filter(a => a.id !== annotationId));
    onAnnotationDelete?.(annotationId);
    setSelectedAnnotation(null);
  };

  const getAnnotationIcon = (type: string) => {
    switch (type) {
      case 'issue': return <AlertTriangle className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'question': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getAnnotationColor = (type: string, priority: string) => {
    if (type === 'approved') return 'bg-green-500';
    if (type === 'issue') {
      switch (priority) {
        case 'high': return 'bg-red-500';
        case 'medium': return 'bg-orange-500';
        case 'low': return 'bg-yellow-500';
        default: return 'bg-red-500';
      }
    }
    if (type === 'question') return 'bg-blue-500';
    return 'bg-blue-400';
  };

  const filteredAnnotations = showResolved ? annotations : annotations.filter(a => !a.resolved);

  return (
    <div className="space-y-6">
      {/* Collaboration Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Collaboration
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={isAddingAnnotation ? "default" : "outline"}
                size="sm"
                onClick={() => setIsAddingAnnotation(!isAddingAnnotation)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Annotation
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResolved(!showResolved)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showResolved ? 'Hide' : 'Show'} Resolved
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Active Users */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium">Active Now:</span>
            <div className="flex items-center gap-2">
              {activeUsers.map((user, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">{user}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div className="flex flex-wrap gap-2">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="text-xs">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{member.name}</span>
                <Badge variant={member.isOnline ? "default" : "secondary"} className="text-xs">
                  {member.role}
                </Badge>
                {member.isOnline && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Annotation Canvas */}
      <Card>
        <CardHeader>
          <CardTitle>Document Review Canvas</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={containerRef}
            className={`relative bg-gray-50 rounded-lg min-h-96 border-2 ${
              isAddingAnnotation ? 'border-blue-500 border-dashed cursor-crosshair' : 'border-gray-200'
            }`}
            onClick={handleContainerClick}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
            </div>

            {/* Instructions */}
            {isAddingAnnotation && (
              <div className="absolute top-4 left-4 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm">
                Click anywhere to add an annotation
              </div>
            )}

            {/* Annotations */}
            {filteredAnnotations.map((annotation) => (
              <div
                key={annotation.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${annotation.x}%`,
                  top: `${annotation.y}%`
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAnnotation(annotation.id);
                }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg ${
                  getAnnotationColor(annotation.type, annotation.priority)
                } ${annotation.resolved ? 'opacity-50' : ''}`}>
                  {getAnnotationIcon(annotation.type)}
                </div>
                {annotation.replies.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs">
                    {annotation.replies.length}
                  </Badge>
                )}
              </div>
            ))}

            {/* New Annotation Marker */}
            {newAnnotationPosition && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${newAnnotationPosition.x}%`,
                  top: `${newAnnotationPosition.y}%`
                }}
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                  <Plus className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* New Annotation Form */}
      {newAnnotationPosition && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Add New Annotation</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNewAnnotationPosition(null);
                  setIsAddingAnnotation(false);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Type</label>
                <select 
                  className="w-full mt-1 p-2 border rounded"
                  value={newAnnotationType}
                  onChange={(e) => setNewAnnotationType(e.target.value as any)}
                >
                  <option value="comment">Comment</option>
                  <option value="issue">Issue</option>
                  <option value="question">Question</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <select 
                  className="w-full mt-1 p-2 border rounded"
                  value={newAnnotationPriority}
                  onChange={(e) => setNewAnnotationPriority(e.target.value as any)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  value={newAnnotationCategory}
                  onChange={(e) => setNewAnnotationCategory(e.target.value)}
                  placeholder="e.g., Safety Protocol"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={newAnnotationContent}
                onChange={(e) => setNewAnnotationContent(e.target.value)}
                placeholder="Add your comment, question, or issue description..."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNewAnnotationPosition(null)}>
                Cancel
              </Button>
              <Button onClick={handleAddAnnotation}>
                Add Annotation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Annotation Detail */}
      {selectedAnnotation && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getAnnotationIcon(annotations.find(a => a.id === selectedAnnotation)?.type || 'comment')}
                Annotation Details
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAnnotation(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {annotations.filter(a => a.id === selectedAnnotation).map((annotation) => (
              <div key={annotation.id} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={annotation.authorAvatar} />
                      <AvatarFallback>
                        {annotation.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{annotation.author}</p>
                      <p className="text-sm text-blue-500">
                        {new Date(annotation.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getAnnotationColor(annotation.type, annotation.priority)} text-white`}>
                      {annotation.type}
                    </Badge>
                    <Badge variant="outline">
                      {annotation.priority}
                    </Badge>
                    <Badge variant="secondary">
                      {annotation.category}
                    </Badge>
                  </div>
                </div>

                <p className="text-blue-600">{annotation.content}</p>

                <div className="flex items-center gap-2">
                  <Button
                    variant={annotation.resolved ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleResolveAnnotation(annotation.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {annotation.resolved ? 'Resolved' : 'Mark Resolved'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAnnotation(annotation.id)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>

                {/* Replies */}
                {annotation.replies.length > 0 && (
                  <div className="space-y-3">
                    <Separator />
                    <h4 className="font-medium">Replies ({annotation.replies.length})</h4>
                    <ScrollArea className="max-h-64">
                      <div className="space-y-3">
                        {annotation.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {reply.author.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{reply.author}</span>
                                <span className="text-xs text-blue-400">
                                  {new Date(reply.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-blue-600 mt-1">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {/* Add Reply */}
                <div className="space-y-2">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Add a reply..."
                    rows={2}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAddReply(annotation.id)}
                    disabled={!replyContent.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Annotation Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Annotation Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {annotations.filter(a => a.type === 'issue' && !a.resolved).length}
              </p>
              <p className="text-sm text-blue-500">Open Issues</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {annotations.filter(a => a.type === 'question' && !a.resolved).length}
              </p>
              <p className="text-sm text-blue-500">Questions</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {annotations.filter(a => a.type === 'approved').length}
              </p>
              <p className="text-sm text-blue-500">Approved</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-500">
                {annotations.reduce((sum, a) => sum + a.replies.length, 0)}
              </p>
              <p className="text-sm text-blue-500">Total Replies</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}