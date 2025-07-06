import OpenAI from "openai";
import * as cheerio from "cheerio";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

interface CloneDetectionResult {
  url: string;
  similarityScore: number;
  analysis: {
    contentSimilarity: number;
    structureSimilarity: number;
    designSimilarity: number;
    brandingSimilarity: number;
  };
  suspiciousElements: string[];
  recommendation: 'low_risk' | 'medium_risk' | 'high_risk' | 'potential_clone';
  aiAnalysis: string;
  timestamp: string;
}

interface WebsiteFingerprint {
  title: string;
  metaDescription: string;
  headings: string[];
  keyPhrases: string[];
  structuralElements: string[];
  colorScheme: string[];
  uniqueIdentifiers: string[];
}

export class AICloneDetector {
  private originalFingerprint: WebsiteFingerprint | null = null;

  async generateWebsiteFingerprint(html: string, url: string): Promise<WebsiteFingerprint> {
    const $ = cheerio.load(html);
    
    // Extract structural and content elements
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const headings = $('h1, h2, h3').map((_, el) => $(el).text().trim()).get();
    
    // Extract key phrases and unique identifiers
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const keyPhrases = await this.extractKeyPhrases(bodyText);
    
    const structuralElements = [
      `nav-items-${$('nav a').length}`,
      `sections-${$('section').length}`,
      `cards-${$('.card, [class*="card"]').length}`,
      `buttons-${$('button, [class*="button"]').length}`,
      `forms-${$('form').length}`
    ];

    // Extract color scheme and branding elements
    const colorScheme = this.extractColorScheme($);
    const uniqueIdentifiers = [
      title,
      $('meta[property="og:site_name"]').attr('content') || '',
      $('.logo, [class*="logo"]').text().trim(),
      $('[class*="brand"]').text().trim()
    ].filter(Boolean);

    return {
      title,
      metaDescription,
      headings: headings.slice(0, 10), // Limit to first 10 headings
      keyPhrases: keyPhrases.slice(0, 20), // Limit to top 20 key phrases
      structuralElements,
      colorScheme,
      uniqueIdentifiers
    };
  }

  async setOriginalWebsite(html: string, url: string): Promise<void> {
    this.originalFingerprint = await this.generateWebsiteFingerprint(html, url);
  }

  async detectClone(suspectHtml: string, suspectUrl: string): Promise<CloneDetectionResult> {
    if (!this.originalFingerprint) {
      throw new Error('Original website fingerprint not set. Call setOriginalWebsite first.');
    }

    const suspectFingerprint = await this.generateWebsiteFingerprint(suspectHtml, suspectUrl);
    
    // Calculate similarity scores
    const analysis = {
      contentSimilarity: this.calculateContentSimilarity(this.originalFingerprint, suspectFingerprint),
      structureSimilarity: this.calculateStructureSimilarity(this.originalFingerprint, suspectFingerprint),
      designSimilarity: this.calculateDesignSimilarity(this.originalFingerprint, suspectFingerprint),
      brandingSimilarity: this.calculateBrandingSimilarity(this.originalFingerprint, suspectFingerprint)
    };

    const overallSimilarity = (
      analysis.contentSimilarity * 0.3 +
      analysis.structureSimilarity * 0.2 +
      analysis.designSimilarity * 0.2 +
      analysis.brandingSimilarity * 0.3
    );

    // Get AI analysis
    const aiAnalysis = await this.getAIAnalysis(this.originalFingerprint, suspectFingerprint, analysis);
    
    // Identify suspicious elements
    const suspiciousElements = this.identifySuspiciousElements(this.originalFingerprint, suspectFingerprint);
    
    // Determine risk level
    const recommendation = this.determineRiskLevel(overallSimilarity, analysis, suspiciousElements);

    return {
      url: suspectUrl,
      similarityScore: Math.round(overallSimilarity * 100) / 100,
      analysis,
      suspiciousElements,
      recommendation,
      aiAnalysis,
      timestamp: new Date().toISOString()
    };
  }

  private async extractKeyPhrases(text: string): Promise<string[]> {
    if (!openai) {
      console.warn('OpenAI API key not available, using fallback key phrase extraction');
      return this.extractKeyPhrasesBasic(text);
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Extract the most important and unique key phrases from the website content. Focus on business-specific terms, product names, unique value propositions, and distinctive features. Return only a JSON array of strings."
          },
          {
            role: "user",
            content: `Extract key phrases from this website content (limit to 20 most important): ${text.substring(0, 3000)}`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500
      });

      const result = JSON.parse(response.choices[0].message.content || '{"phrases": []}');
      return result.phrases || [];
    } catch (error) {
      console.error('Error extracting key phrases:', error);
      return [];
    }
  }

  private extractKeyPhrasesBasic(text: string): string[] {
    // Basic keyword extraction without AI
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const commonWords = new Set(['this', 'that', 'with', 'have', 'will', 'been', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were']);
    
    const uniqueWords = words.filter(word => !commonWords.has(word));
    const wordCount = new Map();
    
    uniqueWords.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });
    
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word]) => word);
  }

  private extractColorScheme($ : cheerio.CheerioAPI): string[] {
    const colors = new Set<string>();
    
    // Extract colors from common CSS classes and inline styles
    $('[style*="color"], [style*="background"], [class*="bg-"], [class*="text-"]').each((_, el) => {
      const style = $(el).attr('style') || '';
      const className = $(el).attr('class') || '';
      
      // Extract hex colors from style
      const hexMatches = style.match(/#[0-9a-fA-F]{3,6}/g);
      if (hexMatches) hexMatches.forEach(color => colors.add(color));
      
      // Extract common color class names
      const colorClasses = className.match(/(?:bg-|text-)(red|blue|green|yellow|purple|pink|gray|black|white|orange|teal|cyan|indigo)-?\d*/g);
      if (colorClasses) colorClasses.forEach(cls => colors.add(cls));
    });

    return Array.from(colors).slice(0, 10);
  }

  private calculateContentSimilarity(original: WebsiteFingerprint, suspect: WebsiteFingerprint): number {
    const titleSim = this.stringSimilarity(original.title, suspect.title);
    const descSim = this.stringSimilarity(original.metaDescription, suspect.metaDescription);
    const headingSim = this.arrayOverlap(original.headings, suspect.headings);
    const phraseSim = this.arrayOverlap(original.keyPhrases, suspect.keyPhrases);
    
    return (titleSim * 0.3 + descSim * 0.2 + headingSim * 0.25 + phraseSim * 0.25);
  }

  private calculateStructureSimilarity(original: WebsiteFingerprint, suspect: WebsiteFingerprint): number {
    return this.arrayOverlap(original.structuralElements, suspect.structuralElements);
  }

  private calculateDesignSimilarity(original: WebsiteFingerprint, suspect: WebsiteFingerprint): number {
    return this.arrayOverlap(original.colorScheme, suspect.colorScheme);
  }

  private calculateBrandingSimilarity(original: WebsiteFingerprint, suspect: WebsiteFingerprint): number {
    return this.arrayOverlap(original.uniqueIdentifiers, suspect.uniqueIdentifiers);
  }

  private stringSimilarity(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array.from({ length: str2.length + 1 }, (_, i) => [i]);
    matrix[0] = Array.from({ length: str1.length + 1 }, (_, i) => i);

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2[i - 1] === str1[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private arrayOverlap(arr1: string[], arr2: string[]): number {
    if (arr1.length === 0 && arr2.length === 0) return 1;
    if (arr1.length === 0 || arr2.length === 0) return 0;
    
    const set1 = new Set(arr1.map(s => s.toLowerCase()));
    const set2 = new Set(arr2.map(s => s.toLowerCase()));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  private async getAIAnalysis(original: WebsiteFingerprint, suspect: WebsiteFingerprint, analysis: any): Promise<string> {
    if (!openai) {
      return this.getBasicAnalysis(original, suspect, analysis);
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert in website clone detection and intellectual property analysis. Analyze the comparison between an original website and a suspect website to determine if it's a potential clone. Provide a detailed, professional analysis."
          },
          {
            role: "user",
            content: `Analyze this website comparison:

Original Website:
- Title: ${original.title}
- Meta Description: ${original.metaDescription}
- Key Headings: ${original.headings.join(', ')}
- Key Phrases: ${original.keyPhrases.join(', ')}
- Unique Identifiers: ${original.uniqueIdentifiers.join(', ')}

Suspect Website:
- Title: ${suspect.title}
- Meta Description: ${suspect.metaDescription}
- Key Headings: ${suspect.headings.join(', ')}
- Key Phrases: ${suspect.keyPhrases.join(', ')}
- Unique Identifiers: ${suspect.uniqueIdentifiers.join(', ')}

Similarity Scores:
- Content: ${(analysis.contentSimilarity * 100).toFixed(1)}%
- Structure: ${(analysis.structureSimilarity * 100).toFixed(1)}%
- Design: ${(analysis.designSimilarity * 100).toFixed(1)}%
- Branding: ${(analysis.brandingSimilarity * 100).toFixed(1)}%

Provide a detailed analysis of whether this appears to be a clone, including specific concerns and recommendations.`
          }
        ],
        max_tokens: 800
      });

      return response.choices[0].message.content || 'Analysis could not be generated.';
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      return 'AI analysis unavailable due to technical error.';
    }
  }

  private getBasicAnalysis(original: WebsiteFingerprint, suspect: WebsiteFingerprint, analysis: any): string {
    const overallSimilarity = (analysis.contentSimilarity + analysis.structureSimilarity + analysis.designSimilarity + analysis.brandingSimilarity) / 4;
    
    if (overallSimilarity > 0.8) {
      return `High similarity detected (${(overallSimilarity * 100).toFixed(1)}%). This website shows significant similarities to your original site across multiple dimensions including content, structure, design, and branding. This could indicate a potential clone that requires investigation.`;
    } else if (overallSimilarity > 0.6) {
      return `Moderate similarity detected (${(overallSimilarity * 100).toFixed(1)}%). Some similarities found in content and structure. While this may not be a direct clone, it's worth monitoring for potential intellectual property concerns.`;
    } else if (overallSimilarity > 0.4) {
      return `Low to moderate similarity (${(overallSimilarity * 100).toFixed(1)}%). Some common elements detected, but likely within normal industry standards. Continue monitoring if concerned.`;
    } else {
      return `Low similarity (${(overallSimilarity * 100).toFixed(1)}%). This website appears to be sufficiently different from your original site. No immediate clone concerns detected.`;
    }
  }

  private identifySuspiciousElements(original: WebsiteFingerprint, suspect: WebsiteFingerprint): string[] {
    const suspicious: string[] = [];
    
    // Check for exact title match
    if (original.title && suspect.title && original.title.toLowerCase() === suspect.title.toLowerCase()) {
      suspicious.push('Identical page title');
    }
    
    // Check for exact meta description match
    if (original.metaDescription && suspect.metaDescription && 
        original.metaDescription.toLowerCase() === suspect.metaDescription.toLowerCase()) {
      suspicious.push('Identical meta description');
    }
    
    // Check for high overlap in unique identifiers
    const brandOverlap = this.arrayOverlap(original.uniqueIdentifiers, suspect.uniqueIdentifiers);
    if (brandOverlap > 0.7) {
      suspicious.push('High branding similarity');
    }
    
    // Check for identical key phrases
    const exactPhraseMatches = original.keyPhrases.filter(phrase => 
      suspect.keyPhrases.some(suspectPhrase => 
        phrase.toLowerCase() === suspectPhrase.toLowerCase()
      )
    );
    if (exactPhraseMatches.length > 3) {
      suspicious.push(`${exactPhraseMatches.length} identical key phrases`);
    }
    
    return suspicious;
  }

  private determineRiskLevel(similarity: number, analysis: any, suspiciousElements: string[]): CloneDetectionResult['recommendation'] {
    if (similarity > 0.8 || suspiciousElements.length > 3) {
      return 'potential_clone';
    } else if (similarity > 0.6 || suspiciousElements.length > 2) {
      return 'high_risk';
    } else if (similarity > 0.4 || suspiciousElements.length > 1) {
      return 'medium_risk';
    } else {
      return 'low_risk';
    }
  }
}

export const cloneDetector = new AICloneDetector();