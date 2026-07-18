import { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { Play, Square, Pause } from 'lucide-react';
import { audioService } from '../services/audioService';

interface OSMDViewerProps {
  xmlStr: string;
  onReady?: () => void;
}

export function OSMDViewer({ xmlStr, onReady }: OSMDViewerProps) {
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const playbackRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize OSMD
    osmdRef.current = new OpenSheetMusicDisplay(containerRef.current, {
      autoResize: true,
      backend: 'svg',
      drawTitle: true,
      drawSubtitle: true,
      drawComposer: true,
      drawLyricist: true,
      drawCredits: true,
      drawPartNames: false,
    });

    const loadScore = async () => {
      try {
        if (xmlStr) {
          await osmdRef.current?.load(xmlStr);
          osmdRef.current?.render();
          if (onReady) onReady();
        }
      } catch (err) {
        console.error('Failed to load MusicXML in OSMD', err);
      }
    };

    loadScore();

    return () => {
      stopPlayback();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [xmlStr, onReady]);

  const stopPlayback = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    if (playbackRef.current) clearTimeout(playbackRef.current);
    osmdRef.current?.cursor.hide();
    osmdRef.current?.cursor.reset();
  };

  const togglePlayback = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (playbackRef.current) clearTimeout(playbackRef.current);
      return;
    }

    const osmd = osmdRef.current;
    if (!osmd) return;

    await audioService.initialize();
    setIsPlaying(true);
    isPlayingRef.current = true;
    
    if (osmd.cursor.iterator.EndReached) {
      osmd.cursor.reset();
    }
    osmd.cursor.show();

    const playNextNote = () => {
      if (!osmdRef.current || osmdRef.current.cursor.iterator.EndReached || !isPlayingRef.current) {
        setIsPlaying(false);
        isPlayingRef.current = false;
        osmdRef.current?.cursor.hide();
        return;
      }

      const notes = osmdRef.current.cursor.NotesUnderCursor();
      if (notes && notes.length > 0) {
        // Try to get the pitch of the first note
        const note = notes[0];
        if (note.Pitch) {
          // Bypass strict TS for internal OSMD Pitch object in this demo
          const pitchObj = note.Pitch as any;
          const key = pitchObj.fundamentalNote !== undefined ? pitchObj.fundamentalNote : pitchObj.Step?.toString() || 'C';
          const alter = pitchObj.Alteration || pitchObj.alteration || 0;
          const octave = pitchObj.Octave || pitchObj.octave || 4;
          
          let acc = '';
          if (alter === 1) acc = '#';
          if (alter === -1) acc = 'b';
          
          const pitchStr = `${key}${acc}${octave}`;
          
          audioService.playNote(pitchStr, '8n');
        }
      }

      osmdRef.current.cursor.next();

      playbackRef.current = setTimeout(playNextNote, 500);
    };

    playNextNote();
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="flex justify-center p-4 bg-gray-100 border-b border-gray-200 gap-4 shadow-sm z-10 sticky top-0">
        <button 
          onClick={togglePlayback}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold shadow-md transition-colors"
        >
          {isPlaying ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Play</>}
        </button>
        <button 
          onClick={stopPlayback}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full font-bold shadow-md transition-colors"
        >
          <Square size={18} /> Stop
        </button>
      </div>
      <div ref={containerRef} className="flex-1 w-full bg-white p-4 overflow-auto" />
    </div>
  );
}
