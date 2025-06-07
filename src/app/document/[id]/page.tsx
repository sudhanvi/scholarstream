
"use client"; // This page uses client-side state for view modes

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { mockPdfDocuments } from '@/constants/mockData';
import type { PdfDocument } from '@/types';
import { ViewerToolbar } from '@/components/viewer/ViewerToolbar';
import { StudyAidsSidebar } from '@/components/viewer/StudyAidsSidebar';
import { AiSuggestionsClient } from '@/components/viewer/AiSuggestionsClient';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button'; 
import { AlertTriangle, Minimize } from 'lucide-react'; 
import { cn } from '@/lib/utils';

export default function DocumentViewerPage() {
  const params = useParams();
  const id = params.id as string;
  const [document, setDocument] = useState<PdfDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNightMode, setIsNightMode] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'continuous'>('continuous');
  const [isReaderMode, setIsReaderMode] = useState(false); 


  useEffect(() => {
    if (id) {
      // In a real app, fetch document by ID from a backend service here.
      const foundDocument = mockPdfDocuments.find(doc => doc.id === id);
      setDocument(foundDocument || null);
      setIsLoading(false);
    }
  }, [id]);

  const toggleNightMode = () => setIsNightMode(!isNightMode);
  const toggleReaderMode = () => setIsReaderMode(prev => !prev);

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
  
  return (
    <div className={cn(
      "flex flex-col rounded-lg border shadow-md overflow-hidden h-full", // Use h-full to fill parent main area
      isNightMode ? "dark-viewer-theme" : ""
      // Reader mode will hide internal toolbars, making content area expand.
      // No specific height change needed here for reader mode if parent controls height well.
      )}>
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

      {!isReaderMode && (
        <ViewerToolbar 
          documentName={document.name}
          onToggleNightMode={toggleNightMode}
          isNightMode={isNightMode}
          onSetViewMode={setViewMode}
          currentViewMode={viewMode}
          onToggleReaderMode={toggleReaderMode}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <ScrollArea className="flex-grow h-full">
           <div className={cn(
              "p-6 pdf-content-area transition-colors duration-300",
              isNightMode ? "bg-[var(--viewer-bg)] text-[var(--viewer-text)]" : "bg-gray-100 dark:bg-gray-800",
              viewMode === 'single' && !isReaderMode ? 'max-w-3xl mx-auto' : '', 
              isReaderMode ? 'max-w-none' : '' 
            )}
            style={{minHeight: viewMode === 'single' ? '11in' : 'auto'}} 
            >
            <h2 className="text-2xl font-bold font-headline mb-4">{document.name}</h2>
            <p className="text-sm mb-2">This is a mock PDF viewer. The actual PDF content would be rendered here.</p>
            <p className={cn("whitespace-pre-wrap", viewMode === 'continuous' && !isReaderMode ? 'columns-1 md:columns-2 gap-8' : '')}>
              {document.content}
              {"\\n\\n".repeat(viewMode === 'continuous' || isReaderMode ? 20 : 5)} 
              End of mock content. 
              In a real application, this area would display the pages of your PDF document. 
              You would be able to scroll, zoom, and interact with the content. 
              The snipping tool would allow you to select portions of this content to save as an image.
              Annotations like highlighting, underlining, and adding text boxes would modify this view.
            </p>
          </div>
        </ScrollArea>

        {!isReaderMode && (
          <div className={cn(
            "w-80 h-full flex-shrink-0 study-aids-sidebar transition-colors duration-300", 
            isNightMode ? "bg-[hsl(270,20%,15%)] border-[var(--viewer-border)]" : "bg-card border-l"
            )}>
            <StudyAidsSidebar />
          </div>
        )}
      </div>

      {!isReaderMode && (
        <div className="p-2 border-t">
          <AiSuggestionsClient documentContent={document.content} documentTitle={document.name} />
        </div>
      )}
      
      {isReaderMode && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-20 right-6 z-50 bg-background/80 backdrop-blur-sm hover:bg-background text-foreground"
          onClick={toggleReaderMode}
          aria-label="Exit Reader Mode"
        >
          <Minimize className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
