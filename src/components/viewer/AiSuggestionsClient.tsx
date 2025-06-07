
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input'; // Added Input
import { Label } from '@/components/ui/label'; // Added Label
import { suggestRelatedContent } from '@/ai/flows/suggest-related-content';
import type { SuggestRelatedContentInput, SuggestRelatedContentOutput } from '@/ai/flows/suggest-related-content';
import { Lightbulb, ExternalLink, Loader2, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


interface AiSuggestionsClientProps {
  documentContent: string;
  documentTitle: string;
}

export function AiSuggestionsClient({ documentContent, documentTitle }: AiSuggestionsClientProps) {
  const [suggestions, setSuggestions] = useState<SuggestRelatedContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCardOpen, setIsCardOpen] = useState(true);
  const [customQuery, setCustomQuery] = useState(''); // New state for user's custom query

  const handleFetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    if (!isCardOpen) setIsCardOpen(true); 
    try {
      let queryForAI = `Find content related to "${documentTitle}"`;
      if (customQuery.trim()) {
        queryForAI = `Regarding "${documentTitle}", ${customQuery.trim()}`;
      }

      const input: SuggestRelatedContentInput = {
        documentContent: documentContent,
        userQuery: queryForAI,
      };
      const result = await suggestRelatedContent(input);
      setSuggestions(result);
    } catch (err) {
      console.error("Error fetching AI suggestions:", err);
      setError("Failed to fetch suggestions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseCard = () => {
    setIsCardOpen(false);
    setSuggestions(null);
    setError(null);
    setIsLoading(false);
    setCustomQuery(''); // Reset custom query
  };

  const handleShowCard = () => {
    setIsCardOpen(true);
  };

  if (!isCardOpen) {
    return (
      <div className="flex justify-center p-4 mt-4">
        <Button onClick={handleShowCard}>
          <Lightbulb className="mr-2 h-5 w-5" />
          Show AI Suggestions
        </Button>
      </div>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="font-headline flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-primary" />
            AI-Powered Suggestions
          </CardTitle>
          <CardDescription>
            Discover related materials. You can refine the search below.
          </CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={handleCloseCard} aria-label="Close AI Suggestions" className="ml-auto">
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <Label htmlFor="ai-custom-query">Refine your search (optional):</Label>
          <Input 
            id="ai-custom-query"
            placeholder="e.g., 'explain quantum entanglement applications'"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
          />
        </div>

        <Button onClick={handleFetchSuggestions} disabled={isLoading} className="w-full mb-4">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Suggest Related Content"
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {suggestions && suggestions.length === 0 && !isLoading && (
          <p className="text-sm text-muted-foreground text-center">No suggestions found for this query.</p>
        )}

        {suggestions && suggestions.length > 0 && (
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {suggestions.map((item, index) => (
                <Card key={index} className="bg-accent/50 dark:bg-accent/20">
                  <CardHeader className="p-3">
                    <CardTitle className="text-base font-medium flex justify-between items-center">
                      {item.title}
                      <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${item.title} in new tab`}>
                        <ExternalLink className="h-4 w-4 text-primary hover:underline" />
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
