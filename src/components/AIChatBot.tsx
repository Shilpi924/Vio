import { useState } from 'react';
import Markdown from 'markdown-to-jsx';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

type ChatMessage = {
  text: string;
  isUser: boolean;
};

export default function AIChatBot() {
  const statistics = useAppStore((state) => state.statistics);
  const sessions = useAppStore((state) => state.practiceSessions);
  const profile = useUserProfileStore((state) => state.profiles[state.activeProfileId]);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: "Hello! I'm your violin learning assistant. Ask me anything about violin techniques, music theory, or practice tips!", isUser: false }
  ]);

  const handleSend = async () => {
    const text = message.trim();
    if (!text || isSending) return;

    const conversation = [...messages, { text, isUser: true }];
    setMessages(conversation);
    setMessage('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversation.slice(1).map((chatMessage) => ({
            role: chatMessage.isUser ? 'user' : 'assistant',
            content: chatMessage.text,
          })),
          learnerContext: {
            skillLevel: profile?.skillLevel,
            learningGoal: profile?.learningGoal,
            completedLessons: profile?.completedLessons.slice(-10),
            practiceMinutes: Math.round(statistics.totalPracticeTime / 60),
            accuracy: statistics.accuracy,
            hardestNotes: statistics.hardestMeasures.slice(0, 8),
            recentSessions: sessions.slice(0, 5).map((session) => ({
              title: session.title,
              accuracy: session.accuracy,
              hardestNotes: session.hardestNotes,
            })),
          },
        }),
      });
      const data = await response.json() as { reply?: string; error?: string };

      if (!response.ok || !data.reply) {
        throw new Error(data.error || 'The chatbot could not answer.');
      }

      setMessages((previous) => [...previous, { text: data.reply!, isUser: false }]);
    } catch (error) {
      setMessages((previous) => [...previous, {
        text: error instanceof Error ? error.message : 'The chatbot could not answer. Please try again.',
        isUser: false,
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      void handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <section className="mb-4 bg-white rounded-xl shadow-2xl p-4 w-80 h-96 flex flex-col" aria-label="Violin Mentor AI chat">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Violin Mentor AI</h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg p-3 mb-3 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-3 py-2 rounded-lg text-sm ${
                  msg.isUser 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}>
                  {msg.isUser ? msg.text : <Markdown>{msg.text}</Markdown>}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              aria-label="Ask a violin question"
              placeholder="Type your question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
            />
            <button 
              type="button"
              onClick={() => void handleSend()}
              disabled={isSending || !message.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isSending ? 'Thinking…' : 'Send'}
            </button>
          </div>
        </section>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-colors"
        aria-label={isOpen ? 'Close Violin Mentor AI' : 'Open Violin Mentor AI'}
        aria-expanded={isOpen}
      >
        💬
      </button>
    </div>
  );
}
