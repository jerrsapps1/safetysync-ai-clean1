import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  User, 
  Calendar, 
  ArrowLeft,
  Share2,
  Bookmark
} from "lucide-react";
import { Link, useParams } from "wouter";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: number;
  publishDate: string;
  author: string;
  tags: string[];
  featured: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Complete Guide to OSHA Compliance in 2025: Essential Requirements for Construction Companies',
    slug: 'complete-osha-compliance-guide-2025-construction',
    excerpt: 'Navigate the latest OSHA regulations with confidence. This comprehensive guide covers all essential requirements, common violations, and proven strategies to maintain 100% compliance in construction environments.',
    content: `
# The Complete Guide to OSHA Compliance in 2025: Essential Requirements for Construction Companies

## Introduction

OSHA compliance has never been more critical for construction companies. With updated regulations, increased penalties, and heightened enforcement activity in 2025, maintaining compliance is essential for protecting workers and avoiding costly violations.

## Key OSHA Standards for Construction

### 29 CFR 1926 - Construction Standards

The construction industry operates under specific OSHA standards outlined in 29 CFR 1926. These standards cover:

- **Fall Protection (1926.501)**: Required for work at heights over 6 feet
- **Personal Protective Equipment (1926.95-106)**: Hard hats, safety glasses, protective footwear
- **Scaffolding (1926.450-454)**: Proper construction and inspection requirements
- **Excavation (1926.650-652)**: Trenching and excavation safety protocols
- **Electrical Safety (1926.400-449)**: Safe electrical practices on construction sites

### New Requirements for 2025

Recent updates include:
- Enhanced reporting requirements for incidents
- Stricter fall protection enforcement
- Updated training documentation standards
- Expanded PPE requirements for certain activities

## Common OSHA Violations in Construction

Based on 2024 enforcement data, the most frequent violations include:

1. **Fall Protection** - 29% of all violations
2. **Scaffolding** - 18% of violations  
3. **Ladders** - 14% of violations
4. **PPE** - 12% of violations
5. **Electrical** - 10% of violations

## Best Practices for Compliance

### 1. Implement a Comprehensive Safety Program

- Develop written safety policies
- Conduct regular safety meetings
- Maintain training records
- Perform site inspections

### 2. Training and Documentation

- Provide job-specific training
- Document all training activities
- Maintain certification records
- Implement competent person programs

### 3. Technology Solutions

Modern compliance management platforms can help automate:
- Training tracking and reminders
- Inspection scheduling and documentation
- Incident reporting and investigation
- Certification management

## Conclusion

OSHA compliance in construction requires ongoing attention and systematic approach. By understanding the requirements, implementing best practices, and leveraging technology solutions, construction companies can maintain compliance while protecting their workforce.

For more information on automating your OSHA compliance processes, contact SafetySync.AI to learn how our platform can help streamline your safety management.
    `,
    category: 'Compliance',
    readTime: 12,
    publishDate: '2025-01-08',
    author: 'Sarah Mitchell, CSHO',
    tags: ['OSHA', 'Construction Safety', 'Compliance', 'Regulations'],
    featured: true
  },
  {
    id: '2',
    title: 'How AI is Revolutionizing Workplace Safety Management: 5 Game-Changing Benefits',
    slug: 'ai-workplace-safety-management-benefits',
    excerpt: 'Discover how artificial intelligence is transforming safety management across industries. Learn about predictive analytics, automated compliance tracking, and intelligent risk assessment.',
    content: `
# How AI is Revolutionizing Workplace Safety Management: 5 Game-Changing Benefits

## The AI Revolution in Workplace Safety

Artificial Intelligence is transforming workplace safety management, offering unprecedented capabilities for predicting, preventing, and managing safety risks. Here are five game-changing benefits organizations are experiencing.

## 1. Predictive Risk Analytics

AI analyzes historical incident data, environmental factors, and behavioral patterns to predict potential safety risks before they occur.

**Key Benefits:**
- 85% reduction in preventable incidents
- Early warning systems for high-risk activities
- Data-driven safety decisions

## 2. Automated Compliance Tracking

Machine learning algorithms automatically track compliance requirements and alert managers to upcoming deadlines.

**Features:**
- Real-time compliance monitoring
- Automatic certification tracking
- Regulatory update notifications

## 3. Intelligent Training Recommendations

AI personalizes safety training based on individual roles, risk exposure, and learning patterns.

**Advantages:**
- Personalized learning paths
- Improved training effectiveness
- Reduced training time

## 4. Smart Incident Investigation

AI assists in incident investigation by analyzing patterns, identifying root causes, and suggesting corrective actions.

**Capabilities:**
- Pattern recognition across incidents
- Root cause analysis
- Preventive action recommendations

## 5. Real-Time Monitoring and Alerts

IoT sensors combined with AI provide real-time monitoring of workplace conditions and worker behavior.

**Benefits:**
- Immediate hazard detection
- Real-time safety alerts
- Continuous monitoring capabilities

## Implementation Considerations

When implementing AI in safety management:
- Start with high-impact use cases
- Ensure data quality and integration
- Train staff on new technologies
- Maintain human oversight

## Conclusion

AI is revolutionizing workplace safety by providing predictive insights, automating routine tasks, and enabling proactive risk management. Organizations that embrace these technologies are seeing significant improvements in safety outcomes and operational efficiency.
    `,
    category: 'Technology',
    readTime: 8,
    publishDate: '2025-01-05',
    author: 'Michael Chen, P.E.',
    tags: ['AI', 'Safety Technology', 'Automation', 'Risk Management'],
    featured: true
  },
  {
    id: '3',
    title: 'Common OSHA Violations in Manufacturing: How to Avoid $2.4M in Penalties',
    slug: 'common-osha-violations-manufacturing-avoid-penalties',
    excerpt: 'Manufacturing facilities face unique safety challenges. Learn about the most frequent OSHA violations in manufacturing and practical strategies to prevent costly penalties.',
    content: `
# Common OSHA Violations in Manufacturing: How to Avoid $2.4M in Penalties

## Introduction

Manufacturing facilities face unique safety challenges that can result in significant OSHA penalties. In 2024, manufacturing companies paid over $2.4 million in fines for preventable violations. This guide outlines the most common violations and prevention strategies.

## Top Manufacturing OSHA Violations

### 1. Lockout/Tagout (LOTO) - 29 CFR 1910.147

**Common Issues:**
- Inadequate written procedures
- Insufficient employee training
- Failure to verify energy isolation

**Prevention Strategies:**
- Develop comprehensive LOTO procedures
- Conduct regular training and competency assessments
- Implement verification protocols

### 2. Machine Guarding - 29 CFR 1910.212

**Frequent Violations:**
- Missing or inadequate guards
- Improper guard design
- Bypassed safety devices

**Best Practices:**
- Regular guard inspections
- Proper guard selection and installation
- Employee training on guard importance

### 3. Respiratory Protection - 29 CFR 1910.134

**Common Problems:**
- Inadequate fit testing
- Missing medical evaluations
- Improper equipment maintenance

**Compliance Steps:**
- Implement comprehensive respiratory protection program
- Conduct annual fit testing
- Maintain detailed records

### 4. Hazard Communication - 29 CFR 1910.1200

**Typical Issues:**
- Incomplete Safety Data Sheets
- Inadequate employee training
- Missing chemical inventories

**Solutions:**
- Maintain current SDS library
- Conduct comprehensive training
- Regular chemical inventory updates

### 5. Electrical Safety - 29 CFR 1910.303-308

**Common Violations:**
- Improper grounding
- Inadequate electrical training
- Missing electrical safety procedures

**Prevention Measures:**
- Regular electrical inspections
- Qualified electrician training
- Comprehensive electrical safety program

## Financial Impact of Violations

Recent OSHA penalties in manufacturing:
- Willful violations: Up to $164,742 per violation
- Serious violations: Up to $16,474 per violation
- Repeat violations: Up to $164,742 per violation

## Creating a Compliance Culture

### Leadership Commitment
- Visible safety leadership
- Adequate resource allocation
- Regular safety communications

### Employee Engagement
- Safety committees
- Near-miss reporting
- Recognition programs

### Continuous Improvement
- Regular safety audits
- Trend analysis
- Corrective action tracking

## Technology Solutions

Modern manufacturing facilities are leveraging technology to improve compliance:
- Digital training platforms
- Automated compliance tracking
- Real-time monitoring systems
- Mobile inspection tools

## Conclusion

Preventing OSHA violations in manufacturing requires a systematic approach combining proper procedures, training, and technology. By addressing these common violation areas proactively, manufacturers can protect workers and avoid costly penalties.

For automated compliance management solutions specifically designed for manufacturing, consider exploring platforms that can help streamline your safety management processes.
    `,
    category: 'Manufacturing',
    readTime: 10,
    publishDate: '2025-01-03',
    author: 'Jennifer Rodriguez, CIH',
    tags: ['Manufacturing Safety', 'OSHA Penalties', 'Compliance', 'Prevention'],
    featured: false
  }
];

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">Article Not Found</h1>
            <p className="text-blue-500 mb-8">The requested blog post could not be found.</p>
            <Link href="/blog">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          <div className="mb-4">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-4xl font-bold text-blue-800 mb-4 leading-tight">
              {post.title}
            </h1>
          </div>
          
          <div className="flex items-center justify-between text-sm text-blue-500 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(post.publishDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {post.readTime} min read
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              {post.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-bold mb-6 mt-8">{paragraph.substring(2)}</h1>;
                } else if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-semibold mb-4 mt-6">{paragraph.substring(3)}</h2>;
                } else if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-semibold mb-3 mt-4">{paragraph.substring(4)}</h3>;
                } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return <p key={index} className="font-semibold mb-2">{paragraph.slice(2, -2)}</p>;
                } else if (paragraph.startsWith('- ')) {
                  return <li key={index} className="mb-1">{paragraph.substring(2)}</li>;
                } else if (paragraph.trim() === '') {
                  return <br key={index} />;
                } else {
                  return <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>;
                }
              })}
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Ready to Transform Your Safety Management?</h3>
            <p className="text-blue-500 mb-4">
              Discover how SafetySync.AI can help automate your compliance processes and improve safety outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Start Free Trial
              </Button>
              <Button variant="outline">
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}