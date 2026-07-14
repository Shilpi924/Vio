import type { ViolinString, FingerNumber } from '../types';
import { VIOLIN_STRING_COLORS, STRING_NOTE_POSITIONS } from '../data/violinData';

interface ViolinFingerboardProps {
  showLabels?: boolean;
  showNoteNames?: boolean;
  highlightNote?: { string: ViolinString; finger: FingerNumber };
  onNoteClick?: (string: ViolinString, finger: FingerNumber, note: string) => void;
  className?: string;
}

export default function ViolinFingerboard({
  showLabels = true,
  showNoteNames = true,
  highlightNote,
  onNoteClick,
  className = '',
}: ViolinFingerboardProps) {
  const strings: ViolinString[] = ['G', 'D', 'A', 'E'];
  const fingers: FingerNumber[] = [0, 1, 2, 3, 4];

  const isHighlighted = (string: ViolinString, finger: FingerNumber) => {
    return highlightNote && highlightNote.string === string && highlightNote.finger === finger;
  };

  const getNoteName = (string: ViolinString, finger: FingerNumber) => {
    return STRING_NOTE_POSITIONS[string][finger];
  };

  const getFingerLabel = (finger: FingerNumber) => {
    if (finger === 0) return 'O'; // Open string
    return finger.toString();
  };

  return (
    <div className={`violin-fingerboard ${className}`}>
      <div className="bg-gradient-to-b from-amber-900 to-amber-950 rounded-lg p-6 shadow-xl">
        {/* Title */}
        <h3 className="text-white text-center text-lg font-semibold mb-4">Violin Fingerboard</h3>
        
        {/* Fingerboard */}
        <div className="relative bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg p-4 shadow-inner">
          {/* Nut (top of fingerboard) */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-amber-800 rounded-t-lg"></div>
          
          {/* Strings and positions */}
          <div className="space-y-3">
            {strings.map((string) => (
              <div key={string} className="relative flex items-center">
                {/* String label */}
                {showLabels && (
                  <div className="w-8 text-right pr-2">
                    <span className="text-amber-900 font-bold text-sm">{string}</span>
                  </div>
                )}
                
                {/* String line */}
                <div 
                  className="flex-1 h-1 rounded-full relative"
                  style={{ backgroundColor: VIOLIN_STRING_COLORS[string] }}
                >
                  {/* Finger positions */}
                  <div className="absolute inset-0 flex justify-between px-2">
                    {fingers.map((finger) => {
                      const note = getNoteName(string, finger);
                      const highlighted = isHighlighted(string, finger);
                      
                      return (
                        <div
                          key={finger}
                          onClick={() => onNoteClick?.(string, finger, note)}
                          className={`
                            relative cursor-pointer transition-all duration-200
                            ${highlighted ? 'transform scale-110' : 'hover:scale-105'}
                          `}
                        >
                          {/* Finger position marker */}
                          <div
                            className={`
                              w-6 h-6 rounded-full flex items-center justify-center
                              border-2 shadow-md
                              ${highlighted 
                                ? 'bg-green-500 border-green-600' 
                                : 'bg-white border-amber-400 hover:border-amber-500'
                              }
                            `}
                          >
                            <span className="text-xs font-semibold text-amber-900">
                              {getFingerLabel(finger)}
                            </span>
                          </div>
                          
                          {/* Note name */}
                          {showNoteNames && (
                            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                              <span className={`text-xs font-medium ${
                                highlighted ? 'text-green-600' : 'text-amber-700'
                              }`}>
                                {note}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          {showLabels && (
            <div className="mt-6 flex justify-center gap-6 text-xs text-amber-800">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-white border-2 border-amber-400"></div>
                <span>Finger position</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-green-600"></div>
                <span>Current note</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold">O</span>
                <span>= Open string</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Instructions */}
        <div className="mt-4 text-amber-100 text-xs text-center">
          <p>Click on finger positions to hear the note</p>
          <p className="mt-1">Strings: G (lowest) → D → A → E (highest)</p>
        </div>
      </div>
    </div>
  );
}
