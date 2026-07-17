import { useState } from 'react';

interface SongVersionToggleProps {
  hasFullVersion: boolean;
  onVersionChange: (useFullVersion: boolean) => void;
  disabled?: boolean;
}

export default function SongVersionToggle({ hasFullVersion, onVersionChange, disabled = false }: SongVersionToggleProps) {
  const [useFullVersion, setUseFullVersion] = useState(false);

  const handleToggle = () => {
    const newValue = !useFullVersion;
    setUseFullVersion(newValue);
    onVersionChange(newValue);
  };

  if (!hasFullVersion) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 bg-purple-50 rounded-lg p-3 mb-4">
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          useFullVersion ? 'bg-purple-600' : 'bg-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
            useFullVersion ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900">
          {useFullVersion ? 'Full Version' : 'Simple Version'}
        </span>
        <span className="text-xs text-gray-600">
          {useFullVersion ? 'Complete arrangement' : 'Main melody only'}
        </span>
      </div>
    </div>
  );
}
