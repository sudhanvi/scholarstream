
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShareDialog } from "./ShareDialog";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ZoomIn,
  ZoomOut,
  Scissors,
  Share2,
  File,
  Columns,
  ChevronsUpDown,
  Glasses,
  Minimize,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface ViewerToolbarProps {
  documentName: string;
  onSetViewMode: (mode: 'single' | 'continuous') => void;
  currentViewMode: 'single' | 'continuous';
  onToggleReaderMode?: () => void;
  onExitReaderMode?: () => void;
  isReaderModeActive: boolean;
  onHideToolbarInReaderMode?: () => void;
}

export function ViewerToolbar({
  documentName,
  onSetViewMode,
  currentViewMode,
  onToggleReaderMode,
  onExitReaderMode,
  isReaderModeActive,
  onHideToolbarInReaderMode
}: ViewerToolbarProps) {
  const { toast } = useToast();
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleSnip = () => {
    toast({
      title: "Region Snip Tool (Mock)",
      description: "In a full version, you could drag to select an area of the page to save as a PNG. Text/image selection snipping from highlighted content would be a separate feature, likely via a context menu.",
    });
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 50));

  return (
    <div className={cn(
        "bg-card border-b p-2 shadow-sm flex flex-wrap items-center justify-between gap-2 viewer-toolbar",
        isReaderModeActive ? "rounded-none" : "rounded-t-lg"
      )}>
      <h2 className="text-sm font-medium font-headline truncate px-2 py-1" title={documentName}>
        {documentName}
      </h2>
      <div className="flex items-center gap-1 flex-wrap">
        <Button variant="ghost" size="icon" onClick={handleZoomOut} aria-label="Zoom Out">
          <ZoomOut className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-20 text-xs">
              {zoomLevel}% <ChevronsUpDown className="ml-1 h-3 w-3"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {[50, 75, 100, 125, 150, 200].map(level => (
              <DropdownMenuItem key={level} onSelect={() => setZoomLevel(level)}>
                {level}%
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon" onClick={handleZoomIn} aria-label="Zoom In">
          <ZoomIn className="h-5 w-5" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button variant="ghost" size="icon" onClick={() => onSetViewMode('single')} aria-label="Single Page View" className={currentViewMode === 'single' ? 'bg-accent' : ''}>
          <File className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onSetViewMode('continuous')} aria-label="Continuous Scroll View" className={currentViewMode === 'continuous' ? 'bg-accent' : ''}>
          <Columns className="h-5 w-5" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {isReaderModeActive ? (
          <>
            {onExitReaderMode && (
              <Button variant="ghost" size="icon" onClick={onExitReaderMode} aria-label="Exit Reader Mode">
                <Minimize className="h-5 w-5" />
              </Button>
            )}
            <Separator orientation="vertical" className="h-6 mx-1" />
            <ThemeToggle />
            {onHideToolbarInReaderMode && (
              <Button variant="ghost" size="icon" onClick={onHideToolbarInReaderMode} aria-label="Hide Toolbar" className="ml-1">
                <X className="h-5 w-5" />
              </Button>
            )}
          </>
        ) : (
          onToggleReaderMode && (
            <Button variant="ghost" size="icon" onClick={onToggleReaderMode} aria-label="Enter Reader Mode">
              <Glasses className="h-5 w-5" />
            </Button>
          )
        )}

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button variant="ghost" size="icon" onClick={handleSnip} aria-label="Snip Tool">
          <Scissors className="h-5 w-5" />
        </Button>
        <ShareDialog documentName={documentName}>
          <Button variant="ghost" size="icon" aria-label="Share Document">
            <Share2 className="h-5 w-5" />
          </Button>
        </ShareDialog>
      </div>
    </div>
  );
}
