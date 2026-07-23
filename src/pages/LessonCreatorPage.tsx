import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import type { Note } from '../types';

const NOTE_PATTERN = /^[A-G](#|b)?-?\d$/;

export default function LessonCreatorPage() {
  const navigate = useNavigate();
  const addCustomLesson = useAppStore((state) => state.addCustomLesson);
  const [title, setTitle] = useState('');
  const [tempo, setTempo] = useState(80);
  const [notes, setNotes] = useState('D4 E4 F#4 G4');
  const [error, setError] = useState('');

  const createLesson = (event: React.FormEvent) => {
    event.preventDefault();
    const tokens = notes.split(/[\s,]+/).filter(Boolean);
    const invalid = tokens.find((note) => !NOTE_PATTERN.test(note));
    if (!title.trim() || tokens.length < 2 || invalid) {
      setError(invalid
        ? `${invalid} is not a valid note. Use names such as D4, F#4 or Bb4.`
        : 'Add a title and at least two notes.');
      return;
    }

    const lessonNotes: Note[] = tokens.map((note) => ({
      note,
      duration: 1,
      finger: 0,
      hand: 'left',
    }));
    const id = `custom-${Date.now()}`;
    addCustomLesson({
      id,
      title: title.trim(),
      tempo,
      notes: lessonNotes,
      difficulty: 'beginner',
      category: 'My lessons',
      source: 'user-uploaded',
      sourceName: 'Created in Violin Mentor',
      synopsis: 'A custom practice sequence.',
      practiceTip: 'Listen once, then use guided practice.',
    });
    navigate(`/lessons/${id}`);
  };

  return (
    <main className="min-h-screen bg-[#fffdf8] px-4 py-10">
      <form onSubmit={createLesson} className="mx-auto max-w-2xl rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-purple-700">Lesson creator</p>
        <h1 className="mt-2 text-4xl font-black">Build a focused note exercise</h1>
        <p className="mt-3 text-slate-600">Create a short sequence, then practice it with the same listening and microphone tools as built-in lessons.</p>

        <div className="mt-7 space-y-5">
          <div>
            <label htmlFor="lesson-title" className="block font-bold">Exercise title</label>
            <input id="lesson-title" value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3" placeholder="D major warm-up" />
          </div>
          <div>
            <label htmlFor="lesson-notes" className="block font-bold">Notes</label>
            <textarea id="lesson-notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 font-mono" aria-describedby="notes-help" />
            <p id="notes-help" className="mt-2 text-sm text-slate-500">Separate notes with spaces or commas. Octave numbers are required.</p>
          </div>
          <div>
            <label htmlFor="lesson-tempo" className="block font-bold">Tempo: {tempo} BPM</label>
            <input id="lesson-tempo" type="range" min="40" max="160" value={tempo} onChange={(event) => setTempo(Number(event.target.value))} className="mt-2 w-full" />
          </div>
        </div>

        {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-800">{error}</p>}
        <button type="submit" className="btn-primary mt-7 w-full bg-purple-950 hover:bg-purple-900">Create and practice</button>
      </form>
    </main>
  );
}
