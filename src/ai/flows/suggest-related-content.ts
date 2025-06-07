
'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting related content (PDFs and learning materials)
 * based on the content of the currently viewed document.
 *
 * @requires genkit
 * @requires zod
 *
 * @exports suggestRelatedContent - A function that triggers the flow and returns suggested content.
 * @exports SuggestRelatedContentInput - The input type for the suggestRelatedContent function.
 * @exports SuggestRelatedContentOutput - The output type for the suggestRelatedContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


const SuggestRelatedContentInputSchema = z.object({
  documentContent: z.string().describe('The content of the current document.'),
  userQuery: z.string().optional().describe('An optional user query to refine the search.'),
});

export type SuggestRelatedContentInput = z.infer<typeof SuggestRelatedContentInputSchema>;

const SuggestedResourceSchema = z.object({
  title: z.string().describe('Title of the suggested resource.'),
  url: z.string().describe('URL of the suggested resource. Should be a valid web address.'),
  description: z.string().describe('A brief description of the resource.'),
});

const SuggestRelatedContentOutputSchema = z.array(SuggestedResourceSchema).describe('An array of suggested learning materials.');

export type SuggestRelatedContentOutput = z.infer<typeof SuggestRelatedContentOutputSchema>;


export async function suggestRelatedContent(input: SuggestRelatedContentInput): Promise<SuggestRelatedContentOutput> {
  return suggestRelatedContentFlow(input);
}

const suggestRelatedContentPrompt = ai.definePrompt({
  name: 'suggestRelatedContentPrompt',
  input: {schema: SuggestRelatedContentInputSchema},
  output: {schema: SuggestRelatedContentOutputSchema},
  prompt: `You are an AI assistant designed to suggest related learning materials.

  Based on the following document content:
  {{documentContent}}

  {% if userQuery %}The user has also specified the following query: {{userQuery}}.{% endif %}

  Suggest a list of relevant learning materials.  Each item in the array should have a title, a URL and a description.
  The response should be a JSON array.
  `,
});

const suggestRelatedContentFlow = ai.defineFlow(
  {
    name: 'suggestRelatedContentFlow',
    inputSchema: SuggestRelatedContentInputSchema,
    outputSchema: SuggestRelatedContentOutputSchema,
  },
  async input => {
    const {output} = await suggestRelatedContentPrompt(input);
    return output!;
  }
);
