
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
import { AlertTriangle, Menu, X } from 'lucide-react'; 
import { cn } from '@/lib/utils';

export default function DocumentViewerPage() {
  const params = useParams();
  const id = params.id as string;
  const [document, setDocument] = useState<PdfDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNightMode, setIsNightMode] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'continuous'>('continuous');
  const [isReaderMode, setIsReaderMode] = useState(false); 
  const [isToolbarVisibleInReaderMode, setIsToolbarVisibleInReaderMode] = useState(false);


  useEffect(() => {
    if (id) {
      // In a real app, fetch document by ID from a backend service here.
      const foundDocument = mockPdfDocuments.find(doc => doc.id === id);
      setDocument(foundDocument || null);
      setIsLoading(false);
    }
  }, [id]);

  const toggleNightMode = () => setIsNightMode(!isNightMode);
  
  const toggleReaderMode = () => {
    const newReaderModeState = !isReaderMode;
    setIsReaderMode(newReaderModeState);
    if (newReaderModeState) { // Entering reader mode
      setIsToolbarVisibleInReaderMode(false);
    } else { // Exiting reader mode
      setIsToolbarVisibleInReaderMode(false); 
    }
  };

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
      "flex flex-col rounded-lg border shadow-md overflow-hidden h-full", 
      isNightMode ? "dark-viewer-theme" : ""
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
          background-color: hsl(270, 20%, 15%); 
          border-left-color: var(--viewer-border);
        }
        .dark-viewer-theme .viewer-toolbar {
           background-color: hsl(270, 20%, 15%);
           border-bottom-color: var(--viewer-border);
        }
      `}</style>

      {/* Standard Toolbar for Non-Reader Mode */}
      {!isReaderMode && (
        <ViewerToolbar 
          documentName={document.name}
          onToggleNightMode={toggleNightMode}
          isNightMode={isNightMode}
          onSetViewMode={setViewMode}
          currentViewMode={viewMode}
          onToggleReaderMode={toggleReaderMode} // To enter reader mode
          isReaderModeActive={false}
        />
      )}

      {/* Persistent Toggle for Toolbar in Reader Mode */}
      {isReaderMode && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 z-[60] bg-background/80 backdrop-blur-sm hover:bg-background text-foreground" // Increased z-index
          onClick={() => setIsToolbarVisibleInReaderMode(prev => !prev)}
          aria-label={isToolbarVisibleInReaderMode ? "Hide Toolbar" : "Show Toolbar"}
        >
          {isToolbarVisibleInReaderMode ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}
      
      {/* Toolbar that appears IN Reader Mode */}
      {isReaderMode && isToolbarVisibleInReaderMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"> {/* Wrapper for positioning and styling */}
          <ViewerToolbar
            documentName={document.name}
            onToggleNightMode={toggleNightMode}
            isNightMode={isNightMode}
            onSetViewMode={setViewMode}
            currentViewMode={viewMode}
            onExitReaderMode={toggleReaderMode} // To exit reader mode
            isReaderModeActive={true}
            // Pass other necessary props for reader mode toolbar
          />
        </div>
      )}

      <div className="flex flex-1 overflow-hidden pt-0"> {/* Ensure no top padding if toolbar is fixed */}
        <ScrollArea className="flex-grow h-full">
           <div className={cn(
              "p-6 pdf-content-area transition-colors duration-300",
              isNightMode ? "bg-[var(--viewer-bg)] text-[var(--viewer-text)]" : "bg-gray-100 dark:bg-gray-800",
              viewMode === 'single' && !isReaderMode ? 'max-w-3xl mx-auto' : '', 
              isReaderMode ? 'max-w-none pt-16' : '' // Add padding top if reader mode toolbar is visible and fixed
            )}
            style={{minHeight: viewMode === 'single' && !isReaderMode ? '11in' : 'auto'}} 
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
    </div>
  );
}
