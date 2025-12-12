'use server';
/**
 * @fileOverview An AI flow for updating a ZVision component's capabilities based on natural language.
 *
 * - updateComponent - A function that takes a component schema and a user request and returns a plan for modification.
 * - UpdateComponentInput - The input type for the updateComponent function.
 * - UpdateComponentOutput - The return type for the updateComponent function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const UpdateComponentInputSchema = z.object({
  componentType: z.string().describe('The type of the component to be updated, e.g., "InputDoor".'),
  componentSchema: z.string().describe('The current full JSON schema of the component.'),
  request: z.string().describe('The user\'s natural language request for changes.'),
});
export type UpdateComponentInput = z.infer<typeof UpdateComponentInputSchema>;

const UpdateComponentOutputSchema = z.object({
  trigger: z.string().describe('The event that will start the process, e.g., "onSubmit"'),
  action: z.string().describe('The primary action the component will perform, e.g., "classifyText"'),
  data: z.string().describe('The data that will be passed between actions or events.'),
  sideEffects: z.string().describe('Any side effects or additional actions, e.g., "Route to NotesFrame"'),
  filesTouched: z.array(z.string()).describe('A list of files that will be modified.'),
});
export type UpdateComponentOutput = z.infer<typeof UpdateComponentOutputSchema>;


export async function updateComponent(input: UpdateComponentInput): Promise<UpdateComponentOutput> {
  return updateComponentFlow(input);
}

// MOCKED FLOW: In a real scenario, this would use a powerful model.
// For now, it returns a predictable, mocked response for UI development.
const updateComponentFlow = ai.defineFlow(
  {
    name: 'updateComponentFlow',
    inputSchema: UpdateComponentInputSchema,
    outputSchema: UpdateComponentOutputSchema,
  },
  async (input) => {
    // Simulate a delay to mimic network and model processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // This is a mocked response based on a potential user request.
    // A real implementation would parse the input.request and generate this dynamically.
    if (input.request.toLowerCase().includes('classify')) {
         return {
            trigger: `onSend (from ${input.componentType})`,
            action: 'Classify text into categories: "note", "time".',
            data: 'The original user input text.',
            sideEffects: `Add new output events 'toNotes' and 'toToday' to the Router component.`,
            filesTouched: ['src/lib/zvision/initial-data.ts'],
        };
    }

    // Default mock response
    return {
      trigger: 'onTap',
      action: 'Log a message to the console.',
      data: 'Static message: "Button clicked!"',
      sideEffects: 'None',
      filesTouched: ['src/lib/zvision/initial-data.ts'],
    };
  }
);
