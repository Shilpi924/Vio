import { ArrowRight, Music2, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sampleLessons } from '../data/lessons';

export default function PerformanceModePage() {
  const navigate = useNavigate();
  const performancePieces = sampleLessons.filter((lesson) => lesson.difficulty !== 'beginner').slice(0, 6);

  return (
    <main className="min-h-screen bg-[#fffdf8] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-purple-700">Performance mode</p>
        <h1 className="mt-2 text-4xl font-black">Play without visual hand-holding</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Warm up with guided practice first. When ready, open a piece and listen once before playing it independently.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {performancePieces.map((lesson) => (
            <button
              type="button"
              key={lesson.id}
              onClick={() => navigate(`/lessons/${lesson.id}`)}
              className="group flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-5 text-left shadow-sm transition hover:border-purple-300 hover:shadow-lg"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-purple-100 text-purple-900">
                <Music2 aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-lg font-black">{lesson.title}</span>
                <span className="mt-1 block text-sm capitalize text-slate-500">{lesson.difficulty} · {lesson.tempo} BPM</span>
              </span>
              <ArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white">
          <Radio aria-hidden="true" className="text-purple-300" />
          <h2 className="mt-3 text-2xl font-black">A useful performance rule</h2>
          <p className="mt-2 text-slate-300">Keep going after a mistake. Performance practice trains recovery, not perfection.</p>
        </div>
      </div>
    </main>
  );
}
