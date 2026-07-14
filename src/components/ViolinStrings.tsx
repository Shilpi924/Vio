import type { ViolinString } from '../types';
import { VIOLIN_STRING_FREQUENCIES, VIOLIN_STRING_COLORS } from '../data/violinData';

interface ViolinStringsProps {
  activeString?: ViolinString;
  onStringClick?: (string: ViolinString) => void;
  showLabels?: boolean;
  className?: string;
}

export default function ViolinStrings({
  activeString,
  onStringClick,
  showLabels = true,
  className = '',
}: ViolinStringsProps) {
  const strings: { name: ViolinString; label: string; frequency: number }[] = [
    { name: 'G', label: 'G (G3)', frequency: VIOLIN_STRING_FREQUENCIES.G },
    { name: 'D', label: 'D (D4)', frequency: VIOLIN_STRING_FREQUENCIES.D },
    { name: 'A', label: 'A (A4)', frequency: VIOLIN_STRING_FREQUENCIES.A },
    { name: 'E', label: 'E (E5)', frequency: VIOLIN_STRING_FREQUENCIES.E },
  ];

  return (
    <div className={`violin-strings ${className}`}>
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-lg p-6 shadow-xl">
        <h3 className="text-white text-center text-lg font-semibold mb-4">Violin Strings</h3>
        
        {/* String visualization */}
        <div className="relative bg-gradient-to-b from-amber-100 to-amber-200 rounded-lg p-6 shadow-inner">
          {/* Bridge (bottom) */}
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-amber-800 rounded-b-lg"></div>
          
          {/* Strings */}
          <div className="space-y-6">
            {strings.map((string, index) => {
              const isActive = activeString === string.name;
              const stringThickness = index === 3 ? 'h-1' : index === 2 ? 'h-1.5' : index === 1 ? 'h-2' : 'h-2.5';
              
              return (
                <div
                  key={string.name}
                  onClick={() => onStringClick?.(string.name)}
                  className={`
                    relative cursor-pointer transition-all duration-200
                    ${isActive ? 'transform scale-105' : 'hover:scale-102'}
                  `}
                >
                  {/* String */}
                  <div
                    className={`
                      ${stringThickness} rounded-full shadow-md
                      ${isActive 
                        ? 'bg-green-500 shadow-green-500/50' 
                        : 'hover:bg-amber-600'
                      }
                    `}
                    style={{ 
                      backgroundColor: isActive ? undefined : VIOLIN_STRING_COLORS[string.name],
                      boxShadow: isActive ? '0 0 20px rgba(34, 197, 94, 0.6)' : undefined
                    }}
                  ></div>
                  
                  {/* String label */}
                  {showLabels && (
                    <div className="absolute -left-24 top-1/2 transform -translate-y-1/2">
                      <span className={`text-sm font-medium ${
                        isActive ? 'text-green-600' : 'text-amber-900'
                      }`}>
                        {string.label}
                      </span>
                    </div>
                  )}
                  
                  {/* Frequency */}
                  {showLabels && (
                    <div className="absolute -right-24 top-1/2 transform -translate-y-1/2">
                      <span className={`text-xs ${
                        isActive ? 'text-green-600' : 'text-amber-700'
                      }`}>
                        {string.frequency} Hz
                      </span>
                    </div>
                  )}
                  
                  {/* Vibration effect when active */}
                  {isActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-8 bg-green-400/20 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          {showLabels && (
            <div className="mt-6 flex justify-center gap-4 text-xs text-amber-800">
              <div className="flex items-center gap-1">
                <div className="w-8 h-0.5 bg-amber-600 rounded"></div>
                <span>Thickest (G)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-8 h-0.5 bg-amber-400 rounded"></div>
                <span>Thinnest (E)</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Instructions */}
        <div className="mt-4 text-gray-300 text-xs text-center">
          <p>Click on strings to hear the open string note</p>
          <p className="mt-1">Strings are tuned in perfect fifths: G → D → A → E</p>
        </div>
      </div>
    </div>
  );
}
