
export interface PdfDocument {
  id: string;
  name: string;
  thumbnailUrl: string;
  fileSize: string;
  lastOpened: string; // ISO date string (e.g., "2023-10-26T10:00:00.000Z")
  content: string; // Full content or summary for AI processing
  isFavorite?: boolean;
  url?: string; // URL if it's a web PDF
}

export interface SuggestedResource {
  title: string;
  url: string;
  description: string;
}

export interface TocEntry {
  title: string;
  level: number; // Indentation level, e.g., 1 for main chapter, 2 for sub-section
}

// New types for AI-Generated Quizzes
export type QuizQuestionType = 'multiple-choice' | 'short-answer';

export interface QuizQuestion {
  id: string;
  questionText: string;
  questionType: QuizQuestionType;
  options?: string[]; // For multiple-choice
  correctAnswer: string; // Text of the correct option for MC, or the answer string for short-answer
  explanation?: string; // Optional explanation for the answer
}

export interface GeneratedQuiz {
  title: string;
  questions: QuizQuestion[];
}
