export interface PdfDocument {
  id: string;
  name: string;
  thumbnailUrl: string;
  fileSize: string;
  lastOpened: string;
  content: string; // Full content or summary for AI processing
  isFavorite?: boolean;
  url?: string; // URL if it's a web PDF
}

export interface SuggestedResource {
  title: string;
  url: string;
  description: string;
}
