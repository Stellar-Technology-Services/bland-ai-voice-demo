import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { OpenAIModel } from '$shared/openai';

export const openai = new OpenAI({
	apiKey: OPENAI_API_KEY,
	timeout: 60000, // 60 seconds timeout
	maxRetries: 2,  // Retry failed requests twice
	defaultHeaders: {
		'User-Agent': 'bland-ai-voice-demo/1.0'
	}
});

export async function generateText({
	systemPrompt = 'You are a helpful assistant',
	prompt,
	model = OpenAIModel.GPT_41_NANO,
	json = false,
	schema = { definition: z.any(), name: 'default' },
	temperature = 0,
	maxTokens = 2048,
	seed
}: {
	systemPrompt: string;
	prompt: string;
	model?: OpenAIModel;
	json?: boolean;
	schema?: { definition: z.ZodType<any>; name: string };
	temperature?: number;
	maxTokens?: number;
	seed?: number;
}) {
	const params: any = {
		messages: [
			{ role: 'system', content: systemPrompt },
			{ role: 'user', content: prompt }
		],
		model,
		max_tokens: maxTokens,
		seed
	};

	if (temperature !== 0) {
		params.temperature = temperature;
	}

	if (json) {
		params.response_format = zodResponseFormat(schema.definition, schema.name);
	}

	const completion = await openai.chat.completions.create(params);

	if (completion.choices[0]?.message?.content) {
		if (json) {
			try {
				return JSON.parse(completion.choices[0].message.content);
			} catch (parseError) {
				throw new Error(`OpenAI returned invalid JSON: ${parseError instanceof Error ? parseError.message : 'Parse error'}`);
			}
		}
		return completion.choices[0].message.content;
	}

	throw new Error('No completion found');
}
