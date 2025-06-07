"use client";

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Bookmarks, MessageSquare, PlusCircle, Trash2 } from "lucide-react";

// Mock data types
interface Bookmark {
  id: string;
  page: number;
  label: string;
}

interface StudyNote {
  id: string;
  text: string;
  page?: number; // Optional page link
}

export function StudyAidsSidebar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]); // Mock search results
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: "b1", page: 5, label: "Key Concept Intro" },
    { id: "b2", page: 12, label: "Important Diagram" },
  ]);
  const [studyNotes, setStudyNotes] = useState<StudyNote[]>([
    { id: "n1", text: "Remember to review Chapter 3 equations." },
    { id: "n2", text: "Research this topic further.", page: 8 },
  ]);
  const [newNote, setNewNote] = useState("");

  const handleSearch = () => {
    // Mock search functionality
    if (searchTerm.trim()) {
      setSearchResults([
        `Found "${searchTerm}" on page 3`,
        `Another instance of "${searchTerm}" on page 7`,
      ]);
    } else {
      setSearchResults([]);
    }
  };

  const addBookmark = () => {
    // Mock add bookmark - in real app, would get current page
    const newBookmark: Bookmark = {
      id: `b${bookmarks.length + 1}`,
      page: Math.floor(Math.random() * 20) + 1, // Random page for mock
      label: `New Bookmark page ${Math.floor(Math.random() * 20) + 1}`,
    };
    setBookmarks([...bookmarks, newBookmark]);
  };
  
  const removeBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };

  const addStudyNote = () => {
    if (newNote.trim()) {
      const newStudyNote: StudyNote = {
        id: `n${studyNotes.length + 1}`,
        text: newNote,
      };
      setStudyNotes([...studyNotes, newStudyNote]);
      setNewNote("");
    }
  };

  const removeStudyNote = (id: string) => {
    setStudyNotes(studyNotes.filter(sn => sn.id !== id));
  };

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

        <AccordionItem value="bookmarks">
          <AccordionTrigger className="font-headline text-base">
            <Bookmarks className="mr-2 h-5 w-5" /> Bookmarks
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <Button variant="outline" size="sm" onClick={addBookmark} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Bookmark (Current Page)
            </Button>
            <ScrollArea className="h-32">
              {bookmarks.length > 0 ? (
                bookmarks.map((bookmark) => (
                  <div key={bookmark.id} className="text-sm p-2 hover:bg-accent rounded flex justify-between items-center">
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

      </Accordion>
    </div>
  );
}
