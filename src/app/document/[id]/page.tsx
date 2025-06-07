"use client"; // This page uses client-side state for view modes

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { mockPdfDocuments } from '@/constants/mockData';
import type { PdfDocument } from '@/types';
import { ViewerToolbar } from '@/components/viewer/ViewerToolbar';
import { StudyAidsSidebar } from '@/components/viewer/StudyAidsSidebar';
import { AiSuggestionsClient } from '@/components/viewer/AiSuggestionsClient';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DocumentViewerPage() {
  const params = useParams();
  const id = params.id as string;
  const [document, setDocument] = useState<PdfDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNightMode, setIsNightMode] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'continuous'>('continuous');


  useEffect(() => {
    if (id) {
      const foundDocument = mockPdfDocuments.find(doc => doc.id === id);
      setDocument(foundDocument || null);
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><p>Loading document...</p></div>;
  }

  if (!document) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-center">
        <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold font-headline mb-2">Document Not Found</h1>
        <p className="text-muted-foreground">The document you are looking for does not exist or could not be loaded.</p>
      </div>
    );
  }
  
  const toggleNightMode = () => setIsNightMode(!isNightMode);

  return (
    <div className={cn("flex flex-col h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] overflow-hidden rounded-lg border shadow-md", isNightMode ? "dark-viewer-theme" : "")}>
      <style jsx global>{`
        .dark-viewer-theme {
          --viewer-bg: hsl(270, 15%, 10%);
          --viewer-text: hsl(210, 30%, 85%);
          --viewer-border: hsl(270, 15%, 20%);
        }
        .dark-viewer-theme .pdf-content-area {
          background-color: var(--viewer-bg);
          color: var(--viewer-text);
          border-color: var(--viewer-border);
        }
        .dark-viewer-theme .study-aids-sidebar {
          background-color: hsl(270, 20%, 15%); /* Slightly lighter than viewer bg */
          border-left-color: var(--viewer-border);
        }
        .dark-viewer-theme .viewer-toolbar {
           background-color: hsl(270, 20%, 15%);
           border-bottom-color: var(--viewer-border);
        }
      `}</style>

      <ViewerToolbar 
        documentName={document.name}
        onToggleNightMode={toggleNightMode}
        isNightMode={isNightMode}
        onSetViewMode={setViewMode}
        currentViewMode={viewMode}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Main PDF Content Area (Mock) */}
        <ScrollArea className="flex-grow h-full">
           <div className={cn(
              "p-6 pdf-content-area transition-colors duration-300",
              isNightMode ? "bg-[var(--viewer-bg)] text-[var(--viewer-text)]" : "bg-gray-100 dark:bg-gray-800",
              viewMode === 'single' ? 'max-w-3xl mx-auto' : ''
            )}
            style={{minHeight: viewMode === 'single' ? '11in' : 'auto'}} // Mock page height
            >
            <h2 className="text-2xl font-bold font-headline mb-4">{document.name}</h2>
            <p className="text-sm mb-2">This is a mock PDF viewer. The actual PDF content would be rendered here.</p>
            <p className={cn("whitespace-pre-wrap", viewMode === 'continuous' ? 'columns-1 md:columns-2 gap-8' : '')}>
              {document.content}
              {/* Add more mock content to demonstrate scrolling */}
              {"\n\n".repeat(viewMode === 'continuous' ? 20 : 5)} 
              End of mock content. 
              In a real application, this area would display the pages of your PDF document. 
              You would be able to scroll, zoom, and interact with the content. 
              The snipping tool would allow you to select portions of this content to save as an image.
              Annotations like highlighting, underlining, and adding text boxes would modify this view.
            </p>
          </div>
        </ScrollArea>

        {/* Study Aids Sidebar */}
        <div className={cn("w-80 h-full flex-shrink-0 study-aids-sidebar transition-colors duration-300", isNightMode ? "bg-[hsl(270,20%,15%)] border-[var(--viewer-border)]" : "bg-card border-l")}>
          <StudyAidsSidebar />
        </div>
      </div>
      <div className="p-2 border-t">
        <AiSuggestionsClient documentContent={document.content} documentTitle={document.name} />
      </div>
    </div>
  );
}
