import { GoogleGenAI, Type } from '@google/genai';
import {
  AIAnalysisResponse,
  Complaint,
  ComplaintCategory,
  Department,
  IssueCluster,
  LanguageCode,
  Priority,
} from '../src/types';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

export const CATEGORY_DEPARTMENT_MAP: Record<ComplaintCategory, Department> = {
  'Roads & Infrastructure': 'PWD / Municipal Roads',
  'Garbage & Sanitation': 'Sanitation Department',
  'Water Supply': 'Water Supply & Sewerage Board',
  'Drainage': 'Stormwater & Drainage Department',
  'Streetlights': 'Electrical & Lighting Department',
  'Traffic': 'Traffic Police & Transport',
  'Public Health': 'Public Health & Sanitation',
  'Public Transport': 'General Municipal Administration',
  'Parks & Public Spaces': 'Parks & Horticulture Department',
  'Electricity': 'Power Distribution Corporation',
  'Other': 'General Municipal Administration',
};

// Heuristic fallback analyzer in case of offline/missing key
function heuristicAnalyze(
  text: string,
  imageDescription?: string
): AIAnalysisResponse {
  const lower = (text + ' ' + (imageDescription || '')).toLowerCase();

  // Language detection
  let detectedLanguage = 'English';
  let languageCode: LanguageCode = 'en';

  if (/[\u0900-\u097F]/.test(text)) {
    // Devanagari script: check Marathi vs Hindi markers
    if (
      lower.includes('आहे') ||
      lower.includes('नाही') ||
      lower.includes('झाला') ||
      lower.includes('कचरा') ||
      lower.includes('खड्डा') ||
      lower.includes('आमच्या') ||
      lower.includes('भागात')
    ) {
      detectedLanguage = 'Marathi';
      languageCode = 'mr';
    } else {
      detectedLanguage = 'Hindi';
      languageCode = 'hi';
    }
  } else if (/[\u0980-\u09FF]/.test(text)) {
    detectedLanguage = 'Bengali';
    languageCode = 'bn';
  } else if (/[\u0C00-\u0C7F]/.test(text)) {
    detectedLanguage = 'Telugu';
    languageCode = 'te';
  } else if (/[\u0B80-\u0BFF]/.test(text)) {
    detectedLanguage = 'Tamil';
    languageCode = 'ta';
  } else if (/[\u0A80-\u0AFF]/.test(text)) {
    detectedLanguage = 'Gujarati';
    languageCode = 'gu';
  } else if (/[\u0C80-\u0CFF]/.test(text)) {
    detectedLanguage = 'Kannada';
    languageCode = 'kn';
  } else if (/[\u0D00-\u0D7F]/.test(text)) {
    detectedLanguage = 'Malayalam';
    languageCode = 'ml';
  } else if (/[\u0A00-\u0A7F]/.test(text)) {
    detectedLanguage = 'Punjabi';
    languageCode = 'pa';
  }

  // Category determination
  let category: ComplaintCategory = 'Other';
  let priority: Priority = 'MEDIUM';
  let priorityScore = 65;
  let priorityReason = 'Standard municipal maintenance request.';

  if (
    lower.includes('pothole') ||
    lower.includes('road') ||
    lower.includes('khadda') ||
    lower.includes('खड्डा') ||
    lower.includes('crater') ||
    lower.includes('asphalt') ||
    lower.includes('footpath') ||
    lower.includes('bridge')
  ) {
    category = 'Roads & Infrastructure';
  } else if (
    lower.includes('garbage') ||
    lower.includes('kachra') ||
    lower.includes('कचरा') ||
    lower.includes('waste') ||
    lower.includes('dump') ||
    lower.includes('stench') ||
    lower.includes('smell') ||
    lower.includes('rot') ||
    lower.includes('sanitation')
  ) {
    category = 'Garbage & Sanitation';
  } else if (
    lower.includes('water') ||
    lower.includes('pani') ||
    lower.includes('पाणी') ||
    lower.includes('drinking') ||
    lower.includes('pipeline') ||
    lower.includes('pipe') ||
    lower.includes('tap') ||
    lower.includes('leak')
  ) {
    category = 'Water Supply';
  } else if (
    lower.includes('drain') ||
    lower.includes('gutter') ||
    lower.includes('sewage') ||
    lower.includes('manhole') ||
    lower.includes('nala') ||
    lower.includes('waterlog')
  ) {
    category = 'Drainage';
  } else if (
    lower.includes('streetlight') ||
    lower.includes('light') ||
    lower.includes('lamp') ||
    lower.includes('dark') ||
    lower.includes('blackout') ||
    lower.includes('pole')
  ) {
    category = 'Streetlights';
  } else if (
    lower.includes('traffic') ||
    lower.includes('signal') ||
    lower.includes('jam') ||
    lower.includes('parking')
  ) {
    category = 'Traffic';
  } else if (
    lower.includes('electric') ||
    lower.includes('spark') ||
    lower.includes('wire') ||
    lower.includes('transformer') ||
    lower.includes('shock') ||
    lower.includes('current')
  ) {
    category = 'Electricity';
  } else if (
    lower.includes('park') ||
    lower.includes('garden') ||
    lower.includes('bench') ||
    lower.includes('playground') ||
    lower.includes('tree')
  ) {
    category = 'Parks & Public Spaces';
  }

  // Priority scoring heuristics
  const hasAccident =
    lower.includes('accident') ||
    lower.includes('fall') ||
    lower.includes('fell') ||
    lower.includes('fallen') ||
    lower.includes('gir') ||
    lower.includes('padla') ||
    lower.includes('injury') ||
    lower.includes('hurt') ||
    lower.includes('blood');

  const hasUrgentRisk =
    lower.includes('danger') ||
    lower.includes('spark') ||
    lower.includes('fire') ||
    lower.includes('disease') ||
    lower.includes('sick') ||
    lower.includes('ill') ||
    lower.includes('hospital') ||
    lower.includes('poison') ||
    lower.includes('child') ||
    lower.includes('college') ||
    lower.includes('school');

  if (hasAccident || (category === 'Electricity' && lower.includes('spark'))) {
    priority = 'CRITICAL';
    priorityScore = 94;
    priorityReason =
      'Immediate public safety risk with active accident reports near high footfall zones.';
  } else if (
    hasUrgentRisk ||
    (category === 'Water Supply' && (lower.includes('foul') || lower.includes('smell') || lower.includes('dirty')))
  ) {
    priority = 'HIGH';
    priorityScore = 87;
    priorityReason =
      'Elevated health/safety hazard affecting multiple residents or vulnerable institutions.';
  } else if (lower.includes('week') || lower.includes('days') || lower.includes('frequently')) {
    priority = 'MEDIUM';
    priorityScore = 68;
    priorityReason = 'Recurring civic inconvenience requiring scheduled department remediation.';
  } else {
    priority = 'LOW';
    priorityScore = 48;
    priorityReason = 'Routine civic maintenance grievance.';
  }

  // Summary generation
  let summary = text.slice(0, 110);
  if (text.length > 110) summary += '...';
  if (category === 'Roads & Infrastructure' && (lower.includes('pothole') || lower.includes('khadda'))) {
    summary = 'Severe road damage and deep pothole causing vehicular hazard.';
  } else if (category === 'Garbage & Sanitation') {
    summary = 'Unattended garbage accumulation and sanitation hazard.';
  } else if (category === 'Water Supply') {
    summary = 'Disrupted or contaminated municipal water supply reported.';
  }

  return {
    grievance_summary: summary,
    category,
    department: CATEGORY_DEPARTMENT_MAP[category] || 'General Municipal Administration',
    priority,
    priority_score: priorityScore,
    priority_reason: priorityReason,
    language: detectedLanguage,
    language_code: languageCode,
    keywords: text.split(/\s+/).filter((w) => w.length > 3).slice(0, 5),
    location_context: text.includes('College') ? 'Near ABC College' : 'Citizen Reported Zone',
  };
}

export async function analyzeComplaintWithGemini(
  grievance: string,
  imageBase64?: string,
  imageMimeType?: string
): Promise<AIAnalysisResponse> {
  const ai = getGenAI();

  if (!ai) {
    console.log('Gemini API client not initialized. Using intelligent heuristic engine.');
    return heuristicAnalyze(grievance);
  }

  try {
    const prompt = `You are JanSetu AI's grievance triage engine for Indian citizens.
Analyze this citizen's grievance accurately. The citizen may describe the problem in English, Hindi, Marathi, Bengali, Telugu, Tamil, Gujarati, Kannada, Malayalam, or Punjabi.

Grievance: "${grievance}"

Your tasks:
1. "grievance_summary": Create a concise, professional 1-sentence English summary of the issue.
2. "category": Choose EXACTLY ONE from:
   - "Roads & Infrastructure"
   - "Garbage & Sanitation"
   - "Water Supply"
   - "Drainage"
   - "Streetlights"
   - "Traffic"
   - "Public Health"
   - "Public Transport"
   - "Parks & Public Spaces"
   - "Electricity"
   - "Other"
3. "department": Choose the appropriate responsible Indian civic department:
   - "PWD / Municipal Roads"
   - "Sanitation Department"
   - "Water Supply & Sewerage Board"
   - "Stormwater & Drainage Department"
   - "Electrical & Lighting Department"
   - "Traffic Police & Transport"
   - "Public Health & Sanitation"
   - "Parks & Horticulture Department"
   - "Power Distribution Corporation"
   - "General Municipal Administration"
4. "priority": Determine priority level based on public safety, accident risk, children/college vulnerability, disease risk, and urgency:
   - "LOW"
   - "MEDIUM"
   - "HIGH"
   - "CRITICAL"
5. "priority_score": Integer between 10 and 100. (e.g., accidents/live wires = 90-100, contaminated water = 85-95, streetlight outage = 70-85, aesthetic = 30-50).
6. "priority_reason": Clear, transparent explanation of WHY this priority was assigned (e.g., "Reported accidents and immediate public safety risk near a college.").
7. "language": Human name of detected input language (e.g., "Marathi", "Hindi", "English", "Bengali", "Telugu", "Tamil", "Gujarati", "Kannada", "Malayalam", "Punjabi").
8. "language_code": Two-letter code: "en" | "hi" | "mr" | "bn" | "te" | "ta" | "gu" | "kn" | "ml" | "pa".
9. "keywords": Array of 3 to 6 key terms extracted from the problem.
10. "location_context": Any landmark, street, colony, or area mentioned in the grievance text.`;

    const contents: any[] = [];
    if (imageBase64) {
      contents.push({
        parts: [
          {
            inlineData: {
              mimeType: imageMimeType || 'image/jpeg',
              data: imageBase64.replace(/^data:image\/[a-z]+;base64,/, ''),
            },
          },
          { text: prompt },
        ],
      });
    } else {
      contents.push(prompt);
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contents[0],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            grievance_summary: { type: Type.STRING },
            category: {
              type: Type.STRING,
              enum: [
                'Roads & Infrastructure',
                'Garbage & Sanitation',
                'Water Supply',
                'Drainage',
                'Streetlights',
                'Traffic',
                'Public Health',
                'Public Transport',
                'Parks & Public Spaces',
                'Electricity',
                'Other',
              ],
            },
            department: {
              type: Type.STRING,
              enum: [
                'PWD / Municipal Roads',
                'Sanitation Department',
                'Water Supply & Sewerage Board',
                'Stormwater & Drainage Department',
                'Electrical & Lighting Department',
                'Traffic Police & Transport',
                'Public Health & Sanitation',
                'Parks & Horticulture Department',
                'Power Distribution Corporation',
                'General Municipal Administration',
              ],
            },
            priority: {
              type: Type.STRING,
              enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
            },
            priority_score: { type: Type.INTEGER },
            priority_reason: { type: Type.STRING },
            language: { type: Type.STRING },
            language_code: {
              type: Type.STRING,
              enum: ['en', 'hi', 'mr', 'bn', 'te', 'ta', 'gu', 'kn', 'ml', 'pa'],
            },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            location_context: { type: Type.STRING },
          },
          required: [
            'grievance_summary',
            'category',
            'department',
            'priority',
            'priority_score',
            'priority_reason',
            'language',
            'language_code',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return {
      grievance_summary: parsed.grievance_summary || grievance.slice(0, 100),
      category: parsed.category || 'Roads & Infrastructure',
      department: parsed.department || CATEGORY_DEPARTMENT_MAP[parsed.category as ComplaintCategory] || 'PWD / Municipal Roads',
      priority: parsed.priority || 'MEDIUM',
      priority_score: Number(parsed.priority_score) || 75,
      priority_reason: parsed.priority_reason || 'AI assessed public risk and civic impact.',
      language: parsed.language || 'English',
      language_code: parsed.language_code || 'en',
      keywords: parsed.keywords || [],
      location_context: parsed.location_context || '',
    };
  } catch (error) {
    console.error('Error in Gemini analysis, falling back to heuristic engine:', error);
    return heuristicAnalyze(grievance);
  }
}

// Tokenize and calculate Jaccard & keyword similarity
export function calculateSemanticSimilarity(text1: string, text2: string): number {
  const t1 = text1.toLowerCase().replace(/[^\w\s\u0900-\u0D7F]/gi, '');
  const t2 = text2.toLowerCase().replace(/[^\w\s\u0900-\u0D7F]/gi, '');

  const words1 = new Set(t1.split(/\s+/).filter((w) => w.length > 2));
  const words2 = new Set(t2.split(/\s+/).filter((w) => w.length > 2));

  if (words1.size === 0 || words2.size === 0) return 0;

  let intersection = 0;
  for (const w of words1) {
    if (words2.has(w)) {
      intersection++;
    }
  }

  const union = new Set([...words1, ...words2]).size;
  const jaccard = intersection / union;

  // Domain boost for key civic location / problem terms
  let boost = 0;
  const civicTokens = ['pothole', 'college', 'road', 'garbage', 'water', 'market', 'station', 'drain', 'light', 'khadda', 'कचरा', 'खड्डा', 'पाणी'];
  for (const token of civicTokens) {
    if ((t1.includes(token) && t2.includes(token))) {
      boost += 0.18;
    }
  }

  const score = Math.min(Math.round((jaccard * 0.65 + boost) * 100), 96);
  return score;
}

export function detectDuplicatesAndClusters(
  newGrievance: string,
  newSummary: string,
  category: ComplaintCategory,
  existingComplaints: Complaint[],
  clusters: IssueCluster[]
): {
  isDuplicate: boolean;
  duplicateOfId?: string;
  similarityScore: number;
  matchingClusterId?: string;
  matchingClusterTitle?: string;
  similarCount: number;
} {
  let highestSimilarity = 0;
  let bestMatchComplaint: Complaint | null = null;
  let similarCount = 0;

  for (const complaint of existingComplaints) {
    const sim1 = calculateSemanticSimilarity(newGrievance, complaint.grievance);
    const sim2 = calculateSemanticSimilarity(newSummary, complaint.summary);
    const sim = Math.max(sim1, sim2);

    if (sim >= 60 && complaint.category === category) {
      similarCount++;
      if (sim > highestSimilarity) {
        highestSimilarity = sim;
        bestMatchComplaint = complaint;
      }
    }
  }

  // Check cluster titles
  let matchingCluster = clusters.find((c) => {
    if (c.category !== category) return false;
    const sim = calculateSemanticSimilarity(newGrievance, c.title + ' ' + c.summary);
    return sim >= 55;
  });

  if (!matchingCluster && bestMatchComplaint?.clusterId) {
    matchingCluster = clusters.find((c) => c.id === bestMatchComplaint?.clusterId);
  }

  const isDuplicate = highestSimilarity >= 75;

  return {
    isDuplicate,
    duplicateOfId: bestMatchComplaint?.id,
    similarityScore: highestSimilarity || (matchingCluster ? 84 : 0),
    matchingClusterId: matchingCluster?.id || (isDuplicate ? bestMatchComplaint?.clusterId : undefined),
    matchingClusterTitle: matchingCluster?.title || (isDuplicate ? bestMatchComplaint?.clusterTitle : undefined),
    similarCount: similarCount || (matchingCluster ? matchingCluster.complaintCount : 0),
  };
}
