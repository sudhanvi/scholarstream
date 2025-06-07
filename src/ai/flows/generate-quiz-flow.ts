
'use server';
/**
 * @fileOverview An AI flow to generate a quiz from document text.
 *
 * - generateQuiz - A function that handles the quiz generation.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizInputSchema = z.object({
  documentContent: z.string().describe('The full text content of the document to generate a quiz from.'),
  numQuestions: z.number().optional().default(5).describe('The desired number of questions for the quiz. Defaults to 5.'),
  // We'll start with mixed type for simplicity, can add specific types later
  // quizType: z.enum(['multiple-choice', 'short-answer', 'mixed']).optional().default('mixed').describe('The type of questions to generate.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const QuizQuestionSchema = z.object({
  id: z.string().describe('A unique identifier for the question (e.g., "q1").'),
  questionText: z.string().describe('The text of the quiz question.'),
  questionType: z.enum(['multiple-choice', 'short-answer']).describe('The type of the question.'),
  options: z.array(z.string()).optional().describe('An array of answer options for multiple-choice questions. Should typically contain 3-4 options.'),
  correctAnswer: z.string().describe('The correct answer. For multiple-choice, this should exactly match one of the provided options. For short-answer, this is the expected answer string.'),
  explanation: z.string().optional().describe('An optional brief explanation for why the answer is correct.'),
});

const GenerateQuizOutputSchema = z.object({
  title: z.string().describe('A title for the generated quiz, often based on the document content.'),
  questions: z.array(QuizQuestionSchema).describe('An array of quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const generateQuizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizInputSchema},
  output: {schema: GenerateQuizOutputSchema},
  prompt: `You are an AI assistant skilled at creating educational quizzes from text content.
Based on the following document content, generate a quiz with approximately {{numQuestions}} questions.
The quiz should help a student test their understanding of the key concepts in the document.
Include a mix of multiple-choice and short-answer questions.
For multiple-choice questions, provide 3 or 4 distinct options, one of which is the correct answer.
Ensure the "correctAnswer" field for multiple-choice questions exactly matches the text of the correct option.
Provide a unique "id" for each question (e.g., "q1", "q2").
Generate a "title" for the quiz.
Optionally, provide a brief "explanation" for each answer.

Document Content:
{{{documentContent}}}

Output the result as a JSON object adhering to the specified output schema.
Example of a multiple-choice question structure:
{
  "id": "q1",
  "questionText": "What is the capital of France?",
  "questionType": "multiple-choice",
  "options": ["Berlin", "Madrid", "Paris", "Rome"],
  "correctAnswer": "Paris",
  "explanation": "Paris is the capital and most populous city of France."
}
Example of a short-answer question structure:
{
  "id": "q2",
  "questionText": "Who wrote 'Hamlet'?",
  "questionType": "short-answer",
  "correctAnswer": "William Shakespeare",
  "explanation": "William Shakespeare is widely regarded as the greatest writer in the English language."
}
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input: GenerateQuizInput) => {
    const {output} = await generateQuizPrompt(input);
    // Ensure IDs are unique if not already, though the model should handle this
    // based on the "unique identifier" instruction.
    if (output?.questions) {
      output.questions.forEach((q, index) => {
        if (!q.id) q.id = `gen_q${index + 1}`;
      });
    }
    return output!;
  }
);
