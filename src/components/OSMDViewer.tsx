import { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { Play, Square, Pause, Mic, MicOff } from 'lucide-react';
import { audioService } from '../services/audioService';
import { pitchDetectionService } from '../services/pitchDetectionService';

interface OSMDViewerProps {
  xmlStr: string;
  onReady?: () => void;
}

type PitchStatus = 'waiting' | 'perfect' | 'high' | 'low';

export function OSMDViewer({ xmlStr, onReady }: OSMDViewerProps) {
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const playbackRef = useRef<NodeJS.Timeout | null>(null);
  
  // Practice Mode State
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const isPracticeModeRef = useRef(false);
  const [pitchStatus, setPitchStatus] = useState<PitchStatus>('waiting');
  const [currentExpectedPitch, setCurrentExpectedPitch] = useState<string>('-');
  const [detectedPitch, setDetectedPitch] = useState<string>('-');

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
    
    if (isPracticeModeRef.current) {
      pitchDetectionService.stop();
      setIsPracticeMode(false);
      isPracticeModeRef.current = false;
    }
  };

  const togglePlayback = async (practice: boolean = false) => {
    if (isPlaying) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (playbackRef.current) clearTimeout(playbackRef.current);
      if (isPracticeModeRef.current) {
        pitchDetectionService.stop();
        setIsPracticeMode(false);
        isPracticeModeRef.current = false;
      }
      return;
    }

    const osmd = osmdRef.current;
    if (!osmd) return;

    if (!practice) {
      await audioService.initialize();
    } else {
      setIsPracticeMode(true);
      isPracticeModeRef.current = true;
      try {
        await pitchDetectionService.start((noteName: string) => {
          setDetectedPitch(noteName);
        });
      } catch (err) {
        console.error('Mic access denied', err);
        setIsPracticeMode(false);
        isPracticeModeRef.current = false;
        return; // Abort practice mode if mic fails
      }
    }
    
    setIsPlaying(true);
    isPlayingRef.current = true;
    
    if (osmd.cursor.iterator.EndReached) {
      osmd.cursor.reset();
    }
    osmd.cursor.show();

    const playNextNote = () => {
      if (!osmdRef.current || osmdRef.current.cursor.iterator.EndReached || !isPlayingRef.current) {
        stopPlayback();
        return;
      }

      const notes = osmdRef.current.cursor.NotesUnderCursor();
      if (notes && notes.length > 0) {
        const note = notes[0];
        if (note.Pitch) {
          const pitchObj = note.Pitch as any;
          const key = pitchObj.fundamentalNote !== undefined ? pitchObj.fundamentalNote : pitchObj.Step?.toString() || 'C';
          const alter = pitchObj.Alteration || pitchObj.alteration || 0;
          const octave = pitchObj.Octave || pitchObj.octave || 4;
          
          let acc = '';
          if (alter === 1) acc = '#';
          if (alter === -1) acc = 'b';
          
          const pitchStr = `${key}${acc}${octave}`;
          
          if (!isPracticeModeRef.current) {
            audioService.playNote(pitchStr, '8n');
          } else {
            setCurrentExpectedPitch(pitchStr);
            // In a real app we'd compare frequencies or mapped string values over the note duration
            // For now, we update state to indicate we are waiting for pitch
            setPitchStatus('waiting');
          }
        }
      }

      osmdRef.current.cursor.next();

      // Extend duration in practice mode to give user time to play
      const duration = isPracticeModeRef.current ? 1500 : 500;
      playbackRef.current = setTimeout(playNextNote, duration);
    };

    playNextNote();
  };

  // Compare expected vs detected in practice mode
  useEffect(() => {
    if (!isPracticeMode || currentExpectedPitch === '-') return;
    
    // Very basic comparison logic
    if (detectedPitch === '-' || detectedPitch === '') {
      setPitchStatus('waiting');
    } else {
      // Remove octave for easier comparison (e.g. C#4 -> C#)
      const expectedBase = currentExpectedPitch.replace(/[0-9]/g, '');
      const detectedBase = detectedPitch.replace(/[0-9]/g, '');
      
      if (expectedBase === detectedBase) {
        setPitchStatus('perfect');
      } else {
        // Ideally map notes to indices to determine high/low
        setPitchStatus('high'); // Placeholder logic
      }
    }
  }, [detectedPitch, currentExpectedPitch, isPracticeMode]);

  return (
    <div className="flex flex-col h-full w-full relative">
      <div className="flex justify-center p-4 bg-gray-100 border-b border-gray-200 gap-4 shadow-sm z-10 sticky top-0 items-center">
        
        {isPracticeMode && (
          <div className="flex items-center gap-3 mr-auto bg-gray-800 text-white px-4 py-2 rounded-xl">
            <span className="text-sm text-gray-400">Target: <strong className="text-white text-lg">{currentExpectedPitch}</strong></span>
            <span className="text-sm text-gray-400">You: <strong className="text-blue-400 text-lg">{detectedPitch}</strong></span>
            
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase
              ${pitchStatus === 'perfect' ? 'bg-green-500 text-white' : 
                pitchStatus === 'high' ? 'bg-red-500 text-white' : 
                pitchStatus === 'low' ? 'bg-yellow-500 text-white' : 'bg-gray-600'}`}>
              {pitchStatus}
            </span>
          </div>
        )}
        
        {!isPracticeMode && (
          <button 
            onClick={() => togglePlayback(false)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold shadow-md transition-colors"
          >
            {isPlaying ? <><Pause size={18} /> Pause Auto-Play</> : <><Play size={18} /> Auto-Play</>}
          </button>
        )}

        <button 
          onClick={() => togglePlayback(true)}
          className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold shadow-md transition-colors ${
            isPracticeMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-gray-800 hover:bg-gray-700 text-white'
          }`}
          disabled={isPlaying && !isPracticeMode}
        >
          {isPracticeMode ? <><MicOff size={18} /> Stop Practice</> : <><Mic size={18} /> Practice (Mic)</>}
        </button>

        <button 
          onClick={stopPlayback}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full font-bold shadow-md transition-colors ml-auto md:ml-0"
        >
          <Square size={18} /> Stop
        </button>
      </div>
      <div ref={containerRef} className="flex-1 w-full bg-white p-4 overflow-auto" />
    </div>
  );
}
