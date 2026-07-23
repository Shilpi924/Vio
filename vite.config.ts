import Anthropic from '@anthropic-ai/sdk';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const MAX_REQUEST_BYTES = 50_000;

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

function normalizeLearnerContext(value: unknown): string {
  if (!value || typeof value !== 'object') return '';
  return JSON.stringify(value).slice(0, 2_000);
}

function claudeChatPlugin(apiKey: string): Plugin {
  return {
    name: 'claude-chat-api',
    configureServer(server) {
      server.middlewares.use('/api/chat', (request, response) => {
        if (request.method !== 'POST') {
          response.statusCode = 405;
          response.setHeader('Content-Type', 'application/json');
          response.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';

        request.on('data', (chunk: Buffer) => {
          body += chunk.toString();
          if (body.length > MAX_REQUEST_BYTES) {
            request.destroy();
          }
        });

        request.on('end', async () => {
          response.setHeader('Content-Type', 'application/json');

          if (!apiKey) {
            response.statusCode = 503;
            response.end(JSON.stringify({
              error: 'Claude is not configured. Add ANTHROPIC_API_KEY to .env.local and restart the app.',
            }));
            return;
          }

          try {
            const parsed = JSON.parse(body) as { messages?: ChatMessage[]; learnerContext?: unknown };
            const messages = parsed.messages
              ?.filter((message): message is ChatMessage =>
                (message.role === 'user' || message.role === 'assistant') &&
                typeof message.content === 'string' &&
                message.content.trim().length > 0,
              )
              .slice(-20)
              .map((message) => ({ ...message, content: message.content.slice(0, 4_000) }));

            if (!messages?.length || messages[messages.length - 1].role !== 'user') {
              response.statusCode = 400;
              response.end(JSON.stringify({ error: 'A user message is required.' }));
              return;
            }

            const anthropic = new Anthropic({ apiKey });
            const result = await anthropic.messages.create({
              model: 'claude-haiku-4-5',
              max_tokens: 500,
              system: `You are Violin Mentor, a friendly and encouraging violin teacher for children and families. Give accurate, age-appropriate, concise guidance about violin technique, music theory, practice, and musical learning. Use recorded learner context only when relevant and never invent progress. Prioritize safety and recommend an in-person teacher for pain, injury, or technique that needs physical assessment.\nLearner context: ${normalizeLearnerContext(parsed.learnerContext) || 'No recorded practice context yet.'}`,
              messages,
            });
            const reply = result.content
              .filter((block) => block.type === 'text')
              .map((block) => block.text)
              .join('\n')
              .trim();

            if (!reply) {
              throw new Error('Claude returned an empty response.');
            }

            response.statusCode = 200;
            response.end(JSON.stringify({ reply }));
          } catch (error) {
            console.error('Claude chat request failed:', error instanceof Error ? error.message : error);
            response.statusCode = 502;
            response.end(JSON.stringify({
              error: 'Claude could not answer right now. Check the API key and try again.',
            }));
          }
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['og.png', 'icon-192.png', 'icon-512.png'],
        manifest: {
          name: 'Violin Mentor',
          short_name: 'Violin Mentor',
          description: 'Purposeful violin practice with guided lessons and microphone feedback.',
          theme_color: '#2e1065',
          background_color: '#fffdf8',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          categories: ['education', 'music'],
          icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
        workbox: {
          navigateFallback: '/index.html',
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/www\.youtube\.com\//,
              handler: 'NetworkOnly',
            },
          ],
        },
      }),
      claudeChatPlugin(env.ANTHROPIC_API_KEY),
    ],
    build: {
      outDir: 'dist',
    },
  };
});
