import { CheckCircle2, Volume2, HelpCircle, Activity, Disc } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { pitchDetectionService } from '../services/pitchDetectionService';
import { useAppStore } from '../store/useAppStore';
import { useUserProfileStore } from '../store/useUserProfileStore';

const STRINGS = [
  { name: 'G', frequency: 196.00, color: 'from-red-500/20 to-red-500/10 border-red-500/30 text-red-400', activeBg: 'bg-red-500/20 border-red-500 shadow-red-500/20', emoji: '🔴' },
  { name: 'D', frequency: 293.66, color: 'from-orange-500/20 to-orange-500/10 border-orange-500/30 text-orange-400', activeBg: 'bg-orange-500/20 border-orange-500 shadow-orange-500/20', emoji: '🟠' },
  { name: 'A', frequency: 440.00, color: 'from-green-500/20 to-green-500/10 border-green-500/30 text-green-400', activeBg: 'bg-green-500/20 border-green-500 shadow-green-500/20', emoji: '🟢' },
  { name: 'E', frequency: 659.25, color: 'from-blue-500/20 to-blue-500/10 border-blue-500/30 text-blue-400', activeBg: 'bg-blue-500/20 border-blue-500 shadow-blue-500/20', emoji: '🔵' },
];

export default function ViolinTuner() {
  const [searchParams] = useSearchParams();
  const fromPlan = searchParams.get('from') === 'plan';
  const activeProfileId = useUserProfileStore((state) => state.activeProfileId);
  const recordPracticeSession = useAppStore((state) => state.recordPracticeSession);
  const [currentString, setCurrentString] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [centsOff, setCentsOff] = useState(0);
  const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null);
  const [tunedStrings, setTunedStrings] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isTransitioningRef = useRef(false);
  const stableHitsRef = useRef(0);
  const recordedRef = useRef(false);
  const startedAtRef = useRef(Date.now());

  const handleStringSelect = (index: number) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    
    setCurrentString(index);
    if (isListening) {
      setIsListening(false);
      pitchDetectionService.stop();
    }
    setCentsOff(0);
    setDetectedFrequency(null);
    stableHitsRef.current = 0;
    
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 200);
  };

  const startListening = async () => {
    if (isTransitioningRef.current || isListening) return;
    setIsListening(true);
    
    try {
      await pitchDetectionService.start((_noteName: string, frequency: number) => {
        const targetFreq = STRINGS[currentString].frequency;
        const nextCents = Math.round(1200 * Math.log2(frequency / targetFreq));
        
        // Filter out extreme noise spikes
        if (Math.abs(nextCents) < 150) {
          setCentsOff(nextCents);
          setDetectedFrequency(frequency);

          if (Math.abs(nextCents) <= 5) {
            stableHitsRef.current += 1;
            if (stableHitsRef.current >= 4) {
              const stringName = STRINGS[currentString].name;
              setTunedStrings((previous) => previous.includes(stringName) ? previous : [...previous, stringName]);
            }
          } else {
            stableHitsRef.current = 0;
          }
        }
      });
    } catch (error) {
      console.error('Failed to start pitch detection:', error);
      setIsListening(false);
    }
  };

  useEffect(() => {
    if (tunedStrings.length < STRINGS.length || recordedRef.current) return;

    recordedRef.current = true;
    pitchDetectionService.stop();
    setIsListening(false);
    setComplete(true);
    recordPracticeSession({
      profileId: activeProfileId,
      startedAt: new Date(startedAtRef.current).toISOString(),
      durationSeconds: Math.max(30, Math.round((Date.now() - startedAtRef.current) / 1000)),
      activity: 'tuner',
      title: 'Four-string tuning check',
      notesPlayed: STRINGS.length,
      correctNotes: STRINGS.length,
      accuracy: 100,
      hardestNotes: [],
      completed: true,
    });
  }, [activeProfileId, recordPracticeSession, tunedStrings]);

  const stopListening = () => {
    pitchDetectionService.stop();
    setIsListening(false);
    setDetectedFrequency(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      pitchDetectionService.stop();
    };
  }, []);

  const getTuningStatus = () => {
    if (!isListening || detectedFrequency === null) return 'idle';
    if (Math.abs(centsOff) <= 5) return 'perfect';
    if (Math.abs(centsOff) <= 15) return 'close';
    return 'off';
  };

  const getStatusColor = () => {
    const status = getTuningStatus();
    if (status === 'perfect') return 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]';
    if (status === 'close') return 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]';
    if (status === 'off') return 'text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]';
    return 'text-slate-500';
  };

  const getStatusMessage = () => {
    const status = getTuningStatus();
    if (status === 'perfect') return 'Tuned! Perfectly in pitch';
    if (status === 'close') return centsOff > 0 ? 'Too sharp! Turn peg down' : 'Too flat! Turn peg up';
    if (status === 'off') return centsOff > 0 ? 'Sharp! Turn peg down (loosen)' : 'Flat! Turn peg up (tighten)';
    return isListening ? 'Play string to measure pitch' : 'Ready to tune';
  };

  // Needle angle rotation (from -90 to +90 degrees representing -50 to +50 cents)
  const needleAngle = Math.max(-90, Math.min(90, (centsOff / 50) * 90));

  return (
    <div className="modern-glow-card max-w-2xl mx-auto bg-slate-950 p-6 text-slate-100 border border-slate-800">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-teal-400">Tuning Assistant</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mt-1">🎻 Orbit Pitch Tuner</h2>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Tuning Progress</span>
          <span className="text-sm font-extrabold text-teal-400">{tunedStrings.length} / {STRINGS.length} tuned</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 rounded-xl bg-slate-900/50 p-3 border border-slate-850">
        <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
          <span>G, D, A, E setup check</span>
          <span>{Math.round((tunedStrings.length / STRINGS.length) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-800">
          <div className="h-full bg-gradient-to-r from-purple-500 to-teal-400 transition-all duration-300" style={{ width: `${(tunedStrings.length / STRINGS.length) * 100}%` }} />
        </div>
      </div>

      {complete && (
        <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5 text-center flex flex-col items-center" role="status">
          <CheckCircle2 className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]" size={36} />
          <h3 className="mt-2 text-xl font-bold text-white">Violin Tuned Successfully</h3>
          <p className="mt-1 text-sm text-slate-400">All four strings are perfectly calibrated and ready for practice!</p>
          {fromPlan && (
            <Link to="/practice-plan" className="mt-4 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-500 transition-colors">
              Continue Practice Plan
            </Link>
          )}
        </div>
      )}

      {/* String Selector Buttons */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {STRINGS.map((string, index) => {
          const isSelected = currentString === index;
          const isTuned = tunedStrings.includes(string.name);
          return (
            <button
              key={string.name}
              onClick={() => handleStringSelect(index)}
              aria-label={`${string.name} string${isTuned ? ', tuned' : ''}`}
              className={`flex flex-col items-center justify-center py-4 rounded-2xl border transition-all ${
                isSelected
                  ? string.activeBg
                  : 'bg-slate-900/30 border-slate-850 hover:border-slate-800 text-slate-300'
              }`}
            >
              <span className="text-2xl mb-1">{string.emoji}</span>
              <span className="text-lg font-black">{string.name}</span>
              <span className={`text-[10px] mt-1 font-semibold ${isTuned ? 'text-teal-400' : 'text-slate-500'}`}>
                {isTuned ? '✓ Tuned' : `${Math.round(string.frequency)} Hz`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Diagnostic Panel */}
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] bg-slate-900/30 border border-slate-850 rounded-2xl p-6 mb-6">
        
        {/* Semi-circular needle gauge */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-48 h-32 flex items-center justify-center">
            {/* SVG Arc Gauge */}
            <svg viewBox="0 0 200 120" className="w-full h-full">
              {/* Background Arc */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#1e293b"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Zones Tick Marks */}
              <path d="M 20 100 A 80 80 0 0 1 80 43" fill="none" stroke="#f43f5e" strokeWidth="12" strokeDasharray="3 6" /> {/* Flat Zone */}
              <path d="M 80 43 A 80 80 0 0 1 120 43" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="3 6" /> {/* Tuned Zone */}
              <path d="M 120 43 A 80 80 0 0 1 180 100" fill="none" stroke="#3b82f6" strokeWidth="12" strokeDasharray="3 6" /> {/* Sharp Zone */}
              
              {/* Center Line Marker */}
              <line x1="100" y1="20" x2="100" y2="10" stroke="#10b981" strokeWidth="3" />

              {/* Needle */}
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="20"
                stroke="#8b5cf6"
                strokeWidth="4"
                strokeLinecap="round"
                style={{
                  transform: `rotate(${needleAngle}deg)`,
                  transformOrigin: '100px 100px',
                  transition: 'transform 0.1s ease-out',
                }}
                className="drop-shadow-[0_0_4px_rgba(139,92,246,0.5)]"
              />
              {/* Needle Hub */}
              <circle cx="100" cy="100" r="10" fill="#0f172a" stroke="#8b5cf6" strokeWidth="3" />
            </svg>
            <div className="absolute bottom-1 text-center">
              <span className={`text-4xl font-black ${getStatusColor()}`}>
                {centsOff > 0 ? `+${centsOff}` : centsOff}
              </span>
              <span className="text-[10px] block font-bold text-slate-500 uppercase tracking-widest mt-0.5">Cents</span>
            </div>
          </div>
        </div>

        {/* Real-time details & peg assistance */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Activity className="h-3.5 w-3.5 text-teal-400" /> Live Diagnostics
            </h4>
            
            <div className="grid grid-cols-2 gap-2 text-sm bg-slate-950/40 p-3 rounded-xl border border-slate-850">
              <div>
                <span className="text-[10px] text-slate-500 block">Target Frequency</span>
                <span className="font-bold text-white">{STRINGS[currentString].frequency} Hz</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Detected Frequency</span>
                <span className="font-bold text-white">
                  {detectedFrequency !== null ? `${detectedFrequency.toFixed(1)} Hz` : '--'}
                </span>
              </div>
            </div>
          </div>

          {/* Graphical Peg Turner */}
          <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-850 min-h-[72px]">
            {isListening && detectedFrequency !== null && Math.abs(centsOff) > 5 ? (
              <>
                <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 ${
                  centsOff > 0 ? 'animate-[spin_4s_linear_infinite_reverse]' : 'animate-[spin_4s_linear_infinite]'
                }`}>
                  <Disc className={`h-5 w-5 ${centsOff > 0 ? 'text-rose-500' : 'text-blue-400'}`} />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white">
                    {centsOff > 0 ? 'Turn Peg Towards Scroll' : 'Turn Peg Towards Fingerboard'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {centsOff > 0 ? 'Loosen string slightly' : 'Tighten string slowly'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <Volume2 className="h-5 w-5 text-slate-500 shrink-0" />
                <div className="text-xs text-slate-500">
                  {isListening ? 'Pluck the string to get visual turning directions.' : 'Start listening to enable turning assistance.'}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Listening Toggle Button */}
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={complete}
        className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-xl ${
          complete
            ? 'bg-emerald-600/50 text-emerald-300 border border-emerald-500/20 cursor-not-allowed'
            : isListening
            ? 'bg-rose-600 hover:bg-rose-500 border border-rose-500/20'
            : 'bg-purple-600 hover:bg-purple-500 border border-purple-500/20 shadow-purple-600/10'
        }`}
      >
        {complete ? '✓ Calibration Complete' : isListening ? '⏹ Stop Listening' : '🎤 Start Listening'}
      </button>

      {/* Simple Guide */}
      <div className="mt-4 p-4 rounded-xl bg-slate-900/20 border border-slate-850 flex gap-3 text-xs text-slate-400">
        <HelpCircle className="h-5 w-5 text-teal-400 shrink-0" />
        <div>
          <span className="font-bold text-slate-300">Tuning guidelines:</span> Pluck gently and let the note ring. If the needle points Left (Flat), tighten the peg. If it points Right (Sharp), loosen the peg.
        </div>
      </div>
    </div>
  );
}
