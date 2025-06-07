
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Bookmark, MessageSquare, PlusCircle, Trash2, Timer, ListTree, Loader2, AlertCircle, Play, Pause, RotateCcw } from "lucide-react";
import type { TocEntry } from '@/types';
import { extractTableOfContents } from '@/ai/flows/extract-table-of-contents-flow';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from '@/lib/utils';

// Mock data types
interface BookmarkItem {
  id: string;
  page: number;
  label: string;
}

interface StudyNote {
  id: string;
  text: string;
  page?: number; // Optional page link
}

interface StudyAidsSidebarProps {
  documentContent: string;
  documentName: string; // For context if needed by AI
}

const POMODORO_DEFAULT_MINUTES = 25;

export function StudyAidsSidebar({ documentContent, documentName }: StudyAidsSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([
    { id: "b1", page: 5, label: "Key Concept Intro" },
    { id: "b2", page: 12, label: "Important Diagram" },
  ]);
  const [studyNotes, setStudyNotes] = useState<StudyNote[]>([
    { id: "n1", text: "Remember to review Chapter 3 equations." },
    { id: "n2", text: "Research this topic further.", page: 8 },
  ]);
  const [newNote, setNewNote] = useState("");
  const [justAddedBookmarkId, setJustAddedBookmarkId] = useState<string | null>(null);

  // TOC State
  const [tocItems, setTocItems] = useState<TocEntry[] | null>(null);
  const [isTocLoading, setIsTocLoading] = useState(false);
  const [tocError, setTocError] = useState<string | null>(null);

  // Pomodoro Timer State
  const [timerMinutes, setTimerMinutes] = useState(POMODORO_DEFAULT_MINUTES);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerIntervalId, setTimerIntervalId] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setSearchResults([
        `Found "${searchTerm}" on page 3 (mock)`,
        `Another instance of "${searchTerm}" on page 7 (mock)`,
      ]);
    } else {
      setSearchResults([]);
    }
  };

  const addBookmark = () => {
    const newBookmarkId = `b${bookmarks.length + 1}${Date.now()}`;
    const newBookmark: BookmarkItem = {
      id: newBookmarkId,
      page: Math.floor(Math.random() * 20) + 1,
      label: `New Bookmark page ${Math.floor(Math.random() * 20) + 1}`,
    };
    setBookmarks([...bookmarks, newBookmark]);
    setJustAddedBookmarkId(newBookmarkId);
    setTimeout(() => setJustAddedBookmarkId(null), 1000); // Remove highlight after 1s
  };
  
  const removeBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const addStudyNote = () => {
    if (newNote.trim()) {
      const newStudyNote: StudyNote = {
        id: `n${studyNotes.length + 1}${Date.now()}`,
        text: newNote,
      };
      setStudyNotes([...studyNotes, newStudyNote]);
      setNewNote("");
    }
  };

  const removeStudyNote = (id: string) => {
    setStudyNotes(studyNotes.filter(sn => sn.id !== id));
  };

  const handleGenerateToc = async () => {
    setIsTocLoading(true);
    setTocError(null);
    setTocItems(null);
    try {
      const result = await extractTableOfContents({ documentContent });
      setTocItems(result);
    } catch (err) {
      console.error("Error generating TOC:", err);
      setTocError("Failed to generate Table of Contents. The AI model might be busy or the content too complex. Please try again later.");
    } finally {
      setIsTocLoading(false);
    }
  };

  // Pomodoro Timer Logic
  const startTimer = useCallback(() => {
    if (isTimerRunning || (timerMinutes === 0 && timerSeconds === 0)) return;
    
    setIsTimerRunning(true);
    if (timerMinutes === POMODORO_DEFAULT_MINUTES && timerSeconds === 0 && !isTimerRunning) {
      // If starting fresh or reset, ensure we have full minutes
      setTimerSeconds(0); // Ensure seconds are 0 if minutes are full
    }


    const id = setInterval(() => {
      setTimerSeconds(prevSeconds => {
        if (prevSeconds > 0) return prevSeconds - 1;
        setTimerMinutes(prevMinutes => {
          if (prevMinutes > 0) return prevMinutes - 1;
          // Timer finished
          clearInterval(id);
          setIsTimerRunning(false);
          // Optionally, play a sound or show a notification
          alert("Focus session complete!"); 
          return 0; 
        });
        return 59; // Reset seconds to 59 when a minute passes
      });
    }, 1000);
    setTimerIntervalId(id);
  }, [isTimerRunning, timerMinutes, timerSeconds]);

  const pauseTimer = useCallback(() => {
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
    }
    setIsTimerRunning(false);
  }, [timerIntervalId]);

  const resetTimer = useCallback(() => {
    if (timerIntervalId) {
      clearInterval(timerIntervalId);
    }
    setIsTimerRunning(false);
    setTimerMinutes(POMODORO_DEFAULT_MINUTES);
    setTimerSeconds(0);
    setTimerIntervalId(null);
  }, [timerIntervalId]);

  useEffect(() => {
    // Cleanup interval on component unmount
    return () => {
      if (timerIntervalId) {
        clearInterval(timerIntervalId);
      }
    };
  }, [timerIntervalId]);


  return (
    <div className="w-full h-full bg-card border-l p-4 flex flex-col space-y-4">
      <Accordion type="multiple" defaultValue={["search", "bookmarks", "notes"]} className="w-full">
        
        <AccordionItem value="search">
          <AccordionTrigger className="font-headline text-base">
            <Search className="mr-2 h-5 w-5" /> Full-Text Search
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <div className="flex space-x-2">
              <Input
                placeholder="Search document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button size="icon" onClick={handleSearch} aria-label="Search">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-24">
              {searchResults.length > 0 ? (
                searchResults.map((result, index) => (
                  <p key={index} className="text-xs p-1 hover:bg-accent rounded">{result}</p>
                ))
              ) : (
                <p className="text-xs text-muted-foreground p-1">No results yet.</p>
              )}
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="toc">
          <AccordionTrigger className="font-headline text-base">
            <ListTree className="mr-2 h-5 w-5" /> Table of Contents
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <Button variant="outline" size="sm" onClick={handleGenerateToc} disabled={isTocLoading} className="w-full">
              {isTocLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : "Generate TOC (AI)"}
            </Button>
            {tocError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{tocError}</AlertDescription>
              </Alert>
            )}
            <ScrollArea className="h-40">
              {tocItems && tocItems.length > 0 && (
                <ul className="space-y-1 text-sm">
                  {tocItems.map((item, index) => (
                    <li 
                      key={index} 
                      className="p-1 hover:bg-accent rounded cursor-pointer"
                      style={{ marginLeft: `${(item.level -1) * 1}rem` }} // Indentation
                      onClick={() => alert(`Navigate to: ${item.title} (mock)`)} // Mock navigation
                    >
                      {item.title}
                    </li>
                  ))}
                </ul>
              )}
              {tocItems && tocItems.length === 0 && !isTocLoading && !tocError && (
                <p className="text-xs text-muted-foreground p-1">No table of contents could be extracted.</p>
              )}
              {!tocItems && !isTocLoading && !tocError && (
                <p className="text-xs text-muted-foreground p-1">Click button to generate TOC.</p>
              )}
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="bookmarks">
          <AccordionTrigger className="font-headline text-base">
            <Bookmark className="mr-2 h-5 w-5" /> Bookmarks
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <Button variant="outline" size="sm" onClick={addBookmark} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Bookmark (Current Page)
            </Button>
            <ScrollArea className="h-32">
              {bookmarks.length > 0 ? (
                bookmarks.map((bookmark) => (
                  <div 
                    key={bookmark.id} 
                    className={cn(
                      "text-sm p-2 hover:bg-accent rounded flex justify-between items-center transition-all duration-500",
                      justAddedBookmarkId === bookmark.id ? "bg-primary/20 scale-[1.02]" : ""
                    )}
                  >
                    <span>Pg {bookmark.page}: {bookmark.label}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeBookmark(bookmark.id)}>
                      <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground p-1">No bookmarks added.</p>
              )}
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="notes">
          <AccordionTrigger className="font-headline text-base">
            <MessageSquare className="mr-2 h-5 w-5" /> Study Notes
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <Textarea
              placeholder="Type your study note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[60px]"
            />
            <Button variant="outline" size="sm" onClick={addStudyNote} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Note
            </Button>
            <ScrollArea className="h-32">
              {studyNotes.length > 0 ? (
                studyNotes.map((note) => (
                  <div key={note.id} className="text-sm p-2 my-1 bg-muted/50 rounded flex justify-between items-center">
                    <div>
                      {note.text}
                      {note.page && <span className="text-xs text-muted-foreground ml-2">(Page {note.page})</span>}
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeStudyNote(note.id)}>
                      <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground p-1">No study notes yet.</p>
              )}
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="focus-timer">
          <AccordionTrigger className="font-headline text-base">
            <Timer className="mr-2 h-5 w-5" /> Focus Timer
          </AccordionTrigger>
          <AccordionContent className="space-y-3 text-center">
            <div className="text-4xl font-bold font-mono text-primary">
              {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
            </div>
            <div className="flex justify-center space-x-2">
              {!isTimerRunning ? (
                <Button onClick={startTimer} disabled={timerMinutes === 0 && timerSeconds === 0} className="flex-1">
                  <Play className="mr-2 h-4 w-4" /> Start
                </Button>
              ) : (
                <Button onClick={pauseTimer} variant="outline" className="flex-1">
                  <Pause className="mr-2 h-4 w-4" /> Pause
                </Button>
              )}
              <Button onClick={resetTimer} variant="outline" size="icon" aria-label="Reset Timer">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
             <p className="text-xs text-muted-foreground">Current session: {POMODORO_DEFAULT_MINUTES} minutes.</p>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}
