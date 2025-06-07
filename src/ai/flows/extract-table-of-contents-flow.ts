
'use server';
/**
 * @fileOverview An AI flow to extract a table of contents from document text.
 *
 * - extractTableOfContents - A function that handles the TOC extraction.
 * - ExtractTocInput - The input type for the extractTableOfContents function.
 * - ExtractTocOutput - The return type for the extractTableOfContents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTocInputSchema = z.object({
  documentContent: z.string().describe('The full text content of the document.'),
});
export type ExtractTocInput = z.infer<typeof ExtractTocInputSchema>;

const TocEntrySchema = z.object({
  title: z.string().describe('The title of the section or chapter.'),
  level: z.number().optional().describe('Indentation level, e.g., 1 for main chapter, 2 for sub-section. Defaults to 1 if not determinable.'),
});

const ExtractTocOutputSchema = z.array(TocEntrySchema).describe('An array of table of contents entries, ordered as they appear in the document.');
export type ExtractTocOutput = z.infer<typeof ExtractTocOutputSchema>;

export async function extractTableOfContents(input: ExtractTocInput): Promise<ExtractTocOutput> {
  return extractTableOfContentsFlow(input);
}

const extractTocPrompt = ai.definePrompt({
  name: 'extractTableOfContentsPrompt',
  input: {schema: ExtractTocInputSchema},
  output: {schema: ExtractTocOutputSchema},
  prompt: `You are an AI assistant skilled at analyzing document text and extracting a hierarchical table of contents.
Based on the following document content, identify major sections and sub-sections.
Prioritize headings that appear to be part of a structured outline.
For each entry, provide a "title" (string) and a "level" (number, e.g., 1 for a main chapter, 2 for a sub-section within that chapter).
If a clear hierarchy isn't obvious for a heading, assign it level 1.
The entries should be in the order they likely appear in the document.
Do not attempt to guess page numbers. Focus only on the textual structure.

Document Content:
{{{documentContent}}}

Output the result as a JSON array of objects, where each object has a "title" and "level".
Example:
[
  { "title": "Chapter 1: Introduction", "level": 1 },
  { "title": "1.1 Background", "level": 2 },
  { "title": "Chapter 2: Methodology", "level": 1 }
]
`,
});

const extractTableOfContentsFlow = ai.defineFlow(
  {
    name: 'extractTableOfContentsFlow',
    inputSchema: ExtractTocInputSchema,
    outputSchema: ExtractTocOutputSchema,
  },
  async input => {
    // For very long documents, consider truncating or summarizing input if necessary,
    // but for now, we'll pass the whole content.
    // Be mindful of token limits for the model.
    const {output} = await extractTocPrompt(input);
    return output!;
  }
);
