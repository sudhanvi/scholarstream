
"use client";

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
import { useReaderMode } from '@/contexts/ReaderModeContext';

export default function DocumentViewerPage() {
  const params = useParams();
  const id = params.id as string;
  const [document, setDocument] = useState<PdfDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'single' | 'continuous'>('continuous');
  const { isReaderMode, setIsReaderMode } = useReaderMode();
  const [isToolbarVisibleInReaderMode, setIsToolbarVisibleInReaderMode] = useState(false);


  useEffect(() => {
    if (id) {
      const foundDocument = mockPdfDocuments.find(doc => doc.id === id);
      setDocument(foundDocument || null);
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    return () => {
      setIsReaderMode(false);
      setIsToolbarVisibleInReaderMode(false);
    };
  }, [id, setIsReaderMode]);

  const handleToggleReaderMode = () => {
    const newReaderModeState = !isReaderMode;
    setIsReaderMode(newReaderModeState);
    if (newReaderModeState) {
      setIsToolbarVisibleInReaderMode(false);
    } else {
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
    <div className="flex flex-col rounded-lg border shadow-md overflow-hidden h-full bg-card text-card-foreground">
      {!isReaderMode && (
        <ViewerToolbar
          documentName={document.name}
          onSetViewMode={setViewMode}
          currentViewMode={viewMode}
          onToggleReaderMode={handleToggleReaderMode}
          isReaderModeActive={false}
        />
      )}

      {isReaderMode && !isToolbarVisibleInReaderMode && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 z-[60] bg-background/80 backdrop-blur-sm hover:bg-background text-foreground"
          onClick={() => setIsToolbarVisibleInReaderMode(true)}
          aria-label="Show Toolbar"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {isReaderMode && isToolbarVisibleInReaderMode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <ViewerToolbar
            documentName={document.name}
            onSetViewMode={setViewMode}
            currentViewMode={viewMode}
            onExitReaderMode={handleToggleReaderMode}
            isReaderModeActive={true}
            onHideToolbarInReaderMode={() => setIsToolbarVisibleInReaderMode(false)}
          />
        </div>
      )}

      <div className={cn("flex flex-1 overflow-hidden", isReaderMode && isToolbarVisibleInReaderMode ? "pt-16" : "pt-0")}>
        <ScrollArea className="flex-grow h-full">
           <div className={cn(
              "p-6 transition-colors duration-300 bg-muted text-foreground",
              viewMode === 'single' && !isReaderMode ? 'max-w-3xl mx-auto' : '',
              isReaderMode ? 'max-w-none' : ''
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
          <div className="w-80 h-full flex-shrink-0 bg-card border-l text-card-foreground">
            <StudyAidsSidebar documentContent={document.content} documentName={document.name} />
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
