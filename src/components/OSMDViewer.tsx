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

const PITCH_CLASSES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const normalizePitch = (pitch: string): string => pitch.trim().replace(/♭/g, 'b').toUpperCase();

const pitchToMidi = (pitch: string): number | null => {
  const match = normalizePitch(pitch).match(/^([A-G])([#B]?)(-?\d+)$/);
  if (!match) return null;

  const [, letter, accidental, octaveText] = match;
  const baseIndex = PITCH_CLASSES.indexOf(letter);
  const accidentalOffset = accidental === '#' ? 1 : accidental === 'B' ? -1 : 0;
  return (Number(octaveText) + 1) * 12 + baseIndex + accidentalOffset;
};

export const pitchesMatch = (expected: string, detected: string): boolean => {
  if (normalizePitch(expected) === normalizePitch(detected)) return true;
  const expectedMidi = pitchToMidi(expected);
  return expectedMidi !== null && expectedMidi === pitchToMidi(detected);
};

export const comparePitches = (expected: string, detected: string): PitchStatus => {
  if (pitchesMatch(expected, detected)) return 'perfect';

  const expectedMidi = pitchToMidi(expected);
  const detectedMidi = pitchToMidi(detected);
  if (expectedMidi === null || detectedMidi === null) return 'waiting';
  return detectedMidi > expectedMidi ? 'high' : 'low';
};

export const formatScorePitch = (pitch: any): string => {
  // OSMD stores octaves relative to its internal octave (middle A is A1),
  // so use its formatter with the MusicXML/standard-pitch offset when available.
  if (typeof pitch.ToStringShort === 'function') {
    return pitch.ToStringShort(3);
  }

  const fundamental = pitch.FundamentalNote ?? pitch.fundamentalNote ?? pitch.Step ?? 'C';
  const fundamentalNames: Record<number, string> = { 0: 'C', 2: 'D', 4: 'E', 5: 'F', 7: 'G', 9: 'A', 11: 'B' };
  const key = typeof fundamental === 'number' ? fundamentalNames[fundamental] ?? 'C' : String(fundamental);
  const alteration = pitch.AccidentalHalfTones ?? pitch.Alteration ?? pitch.alteration ?? 0;
  const octave = pitch.Octave ?? pitch.octave ?? 4;
  const accidental = alteration === 1 ? '#' : alteration === -1 ? 'b' : '';
  return `${key}${accidental}${octave}`;
};

export function OSMDViewer({ xmlStr, onReady }: OSMDViewerProps) {
  const osmdRef = useRef<OpenSheetMusicDisplay | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const playbackRef = useRef<NodeJS.Timeout | null>(null);
  const expectedPitchRef = useRef('-');
  const advancePracticeRef = useRef<() => void>(() => undefined);
  
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
    expectedPitchRef.current = '-';
  };

  const finishPlayback = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    if (playbackRef.current) {
      clearTimeout(playbackRef.current);
      playbackRef.current = null;
    }
    osmdRef.current?.cursor.hide();

    if (isPracticeModeRef.current) {
      pitchDetectionService.stop();
      setIsPracticeMode(false);
      isPracticeModeRef.current = false;
    }
    expectedPitchRef.current = '-';
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
          const expectedPitch = expectedPitchRef.current;
          if (expectedPitch === '-') return;

          const status = comparePitches(expectedPitch, noteName);
          setPitchStatus(status);
          if (status === 'perfect') {
            expectedPitchRef.current = '-';
            advancePracticeRef.current();
          }
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
        finishPlayback();
        return;
      }

      const notes = osmdRef.current.cursor.NotesUnderCursor();
      if (notes && notes.length > 0) {
        const note = notes[0];
        if (note.Pitch) {
          const pitchObj = note.Pitch as any;
          const pitchStr = formatScorePitch(pitchObj);
          
          if (!isPracticeModeRef.current) {
            audioService.playNote(pitchStr, '8n');
          } else {
            setCurrentExpectedPitch(pitchStr);
            expectedPitchRef.current = pitchStr;
            setPitchStatus('waiting');
            return;
          }
        }
      }

      osmdRef.current.cursor.next();

      if (isPracticeModeRef.current) {
        // Skip rests and empty cursor positions without advancing playable notes on a timer.
        playNextNote();
      } else {
        playbackRef.current = setTimeout(playNextNote, 500);
      }
    };

    advancePracticeRef.current = () => {
      if (!isPracticeModeRef.current || !isPlayingRef.current || !osmdRef.current) return;
      osmdRef.current.cursor.next();
      playNextNote();
    };

    playNextNote();
  };

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
