// OpenAI integration module
// Provides shared types and utilities for OpenAI API integration

import { z } from 'zod';

export enum OpenAIModel {
	GPT_4 = 'gpt-4',
	GPT_4_TURBO = 'gpt-4-turbo',
	GPT_41_NANO = 'gpt-4o-mini',
	GPT_3_5_TURBO = 'gpt-3.5-turbo',
	TEXT_EMBEDDING_3_LARGE = 'text-embedding-3-large',
	TEXT_EMBEDDING_3_SMALL = 'text-embedding-3-small'
}

// Schema for call analysis requests
export const callAnalysisSchema = z.object({
	transcript: z.string(),
	callId: z.string(),
	purpose: z.enum(['order_extraction', 'call_summary', 'success_analysis']).optional()
});

export type CallAnalysisRequest = z.infer<typeof callAnalysisSchema>;
