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
