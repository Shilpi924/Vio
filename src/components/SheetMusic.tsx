import { useEffect, useRef } from 'react';
import { Renderer, Stave, StaveNote, Formatter, Accidental, Voice } from 'vexflow';
import type { Note } from '../types';

interface SheetMusicProps {
  notes: Note[];
  title?: string;
  composer?: string;
  width?: number;
  height?: number;
  showFingerings?: boolean;
  className?: string;
}

// Helpers to convert our note formats to VexFlow formats
const getVexFlowDuration = (durationInBeats: number): string => {
  if (durationInBeats >= 4) return 'w';
  if (durationInBeats >= 2) return 'h';
  if (durationInBeats >= 1.5) return 'qd';
  if (durationInBeats >= 1) return 'q';
  if (durationInBeats >= 0.5) return '8';
  return '16';
};

const getVexFlowKey = (noteStr: string): { key: string; accidental: string | null } => {
  const match = noteStr.match(/([A-G])([#b]?)(-?\d+)/);
  if (!match) return { key: 'c/4', accidental: null };
  const [, letter, accidental, octave] = match;
  return {
    key: `${letter.toLowerCase()}/${octave}`,
    accidental: accidental || null,
  };
};

export default function SheetMusic({
  notes,
  title,
  composer,
  width = 600,
  height = 200,
  showFingerings = true,
  className = '',
}: SheetMusicProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || notes.length === 0) return;

    // Clear previous rendering
    containerRef.current.innerHTML = '';

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();

    const stave = new Stave(10, 40, width - 20);
    stave.addClef('treble').addTimeSignature('4/4');
    stave.setContext(context).draw();

    if (notes.length === 0) return;

    try {
      const vexNotes = notes.map((noteObj) => {
        const { key, accidental } = getVexFlowKey(noteObj.note);
        const vfDuration = getVexFlowDuration(noteObj.duration);

        const vfNote = new StaveNote({
          keys: [key],
          duration: vfDuration,
          autoStem: true,
        });

        if (accidental) {
          vfNote.addModifier(new Accidental(accidental));
        }

        return vfNote;
      });

      const formatter = new Formatter();
      const voice = new Voice({ numBeats: 4, beatValue: 4 }).setStrict(false).addTickables(vexNotes);
      formatter.joinVoices([voice]);
      formatter.formatToStave([voice], stave);
      
      voice.draw(context, stave);
    } catch (e) {
      console.error("VexFlow rendering error", e);
    }

  }, [notes, title, composer, width, height, showFingerings]);

  return (
    <div className={`sheet-music-container ${className}`}>
      <div ref={containerRef} className="bg-white rounded-lg shadow-inner p-4 overflow-x-auto"></div>
    </div>
  );
}
