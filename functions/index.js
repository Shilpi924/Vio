const Anthropic = require('@anthropic-ai/sdk').default;
const { defineSecret } = require('firebase-functions/params');
const { onRequest } = require('firebase-functions/v2/https');

const anthropicApiKey = defineSecret('ANTHROPIC_API_KEY');
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4_000;

function normalizeMessages(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((message) =>
      message &&
      (message.role === 'user' || message.role === 'assistant') &&
      typeof message.content === 'string' &&
      message.content.trim().length > 0,
    )
    .slice(-MAX_MESSAGES)
    .map((message) => ({
      role: message.role,
      content: message.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }));
}

exports.chat = onRequest(
  {
    secrets: [anthropicApiKey],
    region: 'us-west1',
    timeoutSeconds: 30,
    memory: '256MiB',
    maxInstances: 10,
  },
  async (request, response) => {
    response.set('Content-Type', 'application/json');
    response.set('Cache-Control', 'no-store');

    if (request.method !== 'POST') {
      response.status(405).send({ error: 'Method not allowed' });
      return;
    }

    const messages = normalizeMessages(request.body?.messages);
    if (!messages.length || messages[messages.length - 1].role !== 'user') {
      response.status(400).send({ error: 'A user message is required.' });
      return;
    }

    try {
      const anthropic = new Anthropic({ apiKey: anthropicApiKey.value() });
      const result = await anthropic.messages.create({
        model: 'claude-haiku-4-5',
        max_tokens: 500,
        system: 'You are Violin Mentor, a friendly and encouraging violin teacher for children and families. Give accurate, age-appropriate, concise guidance about violin technique, music theory, practice, and musical learning. Prioritize safety and recommend an in-person teacher for pain, injury, or technique that needs physical assessment.',
        messages,
      });
      const reply = result.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('\n')
        .trim();

      if (!reply) throw new Error('Claude returned an empty response.');

      response.status(200).send({ reply });
    } catch (error) {
      console.error('Claude chat request failed:', error instanceof Error ? error.message : error);
      response.status(502).send({
        error: 'Claude could not answer right now. Check the API configuration and try again.',
      });
    }
  },
);
