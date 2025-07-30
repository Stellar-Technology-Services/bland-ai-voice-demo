/**
 * Bland AI Event Stream API
 *
 * Provides Server-Sent Events (SSE) for real-time call updates.
 * Streams live events from Bland AI including call status, transcript updates, and completion.
 */

import type { RequestHandler } from './$types';
import { createEventStream } from '$lib/server/services/blandai';

/**
 * GET /api/bland/events?callId=xxx
 * Stream real-time events for a specific call
 */
export const GET: RequestHandler = async ({ url }) => {
	const callId = url.searchParams.get('callId');

	try {
		// Create the event stream from Bland AI
		const blandStream = await createEventStream(callId || undefined);

		// Create a readable stream that we can control
		const stream = new ReadableStream({
			start(controller) {
				// Send initial connection message
				const data = `data: ${JSON.stringify({
					type: 'connection',
					message: 'Connected to event stream',
					callId: callId || 'all'
				})}\n\n`;
				controller.enqueue(new TextEncoder().encode(data));
			},

			async pull(controller) {
				if (!blandStream) {
					controller.close();
					return;
				}

				const reader = blandStream.getReader();

				try {
					while (true) {
						const { done, value } = await reader.read();

						if (done) {
							controller.close();
							break;
						}

						// Parse the SSE data from Bland AI (optimized)
						const chunk = new TextDecoder().decode(value);
						const lines = chunk.split('\n');

						// Pre-allocate encoder for better performance
						const encoder = new TextEncoder();
						const timestamp = new Date().toISOString(); // Single timestamp for batch

						for (const line of lines) {
							if (line.startsWith('data: ')) {
								try {
									const jsonStr = line.substring(6);
									// Quick validation before parsing
									if (jsonStr.length > 0 && (jsonStr.startsWith('{') || jsonStr.startsWith('['))) {
										const eventData = JSON.parse(jsonStr);

										// Optimized formatting with pre-allocated timestamp
										const formattedData = `data: ${JSON.stringify({
											type: 'call_event',
											timestamp,
											callId,
											...eventData
										})}\n\n`;

										controller.enqueue(encoder.encode(formattedData));
									}
								} catch (error) {
									// Skip malformed JSON (reduced logging for performance)
									if (process.env.NODE_ENV === 'development') {
										console.warn('Failed to parse event data:', line.substring(0, 100));
									}
								}
							}
						}
					}
				} catch (error) {
					console.error('Error reading from Bland AI stream:', error);

					// Send error event
					const errorData = `data: ${JSON.stringify({
						type: 'error',
						message: 'Stream connection lost',
						timestamp: new Date().toISOString()
					})}\n\n`;
					controller.enqueue(new TextEncoder().encode(errorData));
					controller.close();
				} finally {
					reader.releaseLock();
				}
			},

			cancel() {
				// Cleanup when client disconnects
				console.log('Event stream cancelled by client');
			}
		});

		return new Response(stream, {
			headers: {
				'Content-Type': 'text/event-stream; charset=utf-8',
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				Connection: 'keep-alive',
				'X-Accel-Buffering': 'no', // Disable nginx buffering
				'Content-Encoding': 'identity', // Disable compression for SSE
				'Access-Control-Allow-Origin':
					process.env.NODE_ENV === 'production' ? 'https://bland-ai-voice-demo.vercel.app' : '*',
				'Access-Control-Allow-Headers': 'Cache-Control, Content-Type',
				'Access-Control-Allow-Methods': 'GET'
			}
		});
	} catch (error) {
		console.error('Failed to create event stream:', error);

		// Return error stream
		const errorStream = new ReadableStream({
			start(controller) {
				const data = `data: ${JSON.stringify({
					type: 'error',
					message: error instanceof Error ? error.message : 'Failed to connect to event stream',
					timestamp: new Date().toISOString()
				})}\n\n`;
				controller.enqueue(new TextEncoder().encode(data));
				controller.close();
			}
		});

		return new Response(errorStream, {
			status: 500,
			headers: {
				'Content-Type': 'text/event-stream; charset=utf-8',
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				'Content-Encoding': 'identity',
				'Access-Control-Allow-Origin':
					process.env.NODE_ENV === 'production' ? 'https://bland-ai-voice-demo.vercel.app' : '*',
				'Access-Control-Allow-Headers': 'Cache-Control, Content-Type'
			}
		});
	}
};
