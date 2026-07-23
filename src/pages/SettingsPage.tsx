import { useAppStore } from '../store/useAppStore';
import GoogleSignIn from '../components/GoogleSignIn';
import { useUserProfileStore } from '../store/useUserProfileStore';

export default function SettingsPage() {
  const settings = useAppStore((state) => state.settings);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const signInWithGoogle = useUserProfileStore((state) => state.signInWithGoogle);
  const isAuthenticated = useUserProfileStore((state) => state.isAuthenticated);
  const googleUser = useUserProfileStore((state) => state.googleUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-lg text-gray-700 mb-6">Customize your learning experience</p>

        <div className="space-y-6">
          {/* Display Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Display</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Show Fingerboard Labels</p>
                  <p className="text-sm text-gray-600">Display note names on the fingerboard</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.showFingerboardLabels}
                  aria-label="Show fingerboard labels"
                  onClick={() => updateSettings({ showFingerboardLabels: !settings.showFingerboardLabels })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.showFingerboardLabels ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.showFingerboardLabels ? 'translate-x-6' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Show Note Names</p>
                  <p className="text-sm text-gray-600">Display note names on strings</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.showNoteNames}
                  aria-label="Show note names"
                  onClick={() => updateSettings({ showNoteNames: !settings.showNoteNames })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.showNoteNames ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.showNoteNames ? 'translate-x-6' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-600">Use dark theme</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.darkMode}
                  aria-label="Use dark mode"
                  onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.darkMode ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Audio</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="audio-volume" className="font-medium text-gray-900 mb-2 block">Volume</label>
                <input
                  id="audio-volume"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={settings.audioVolume}
                  onChange={(e) => updateSettings({ audioVolume: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <p className="text-sm text-gray-600 mt-1">{Math.round(settings.audioVolume)}%</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Use Sharps</p>
                  <p className="text-sm text-gray-600">Display sharps instead of flats</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.useSharps}
                  aria-label="Use sharps instead of flats"
                  onClick={() => updateSettings({ useSharps: !settings.useSharps })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.useSharps ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    settings.useSharps ? 'translate-x-6' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Practice Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Practice</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="animation-speed" className="font-medium text-gray-900 mb-2 block">Animation Speed</label>
                <input
                  id="animation-speed"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.animationSpeed}
                  onChange={(e) => updateSettings({ animationSpeed: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <p className="text-sm text-gray-600 mt-1">{settings.animationSpeed}x</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Language</h2>
            <label htmlFor="app-language" className="block text-sm font-medium text-gray-700 mb-2">
              Interface language
            </label>
            <select
              id="app-language"
              value={settings.language ?? 'en'}
              onChange={(event) => updateSettings({ language: event.target.value })}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
            </select>
            <p className="mt-2 text-sm text-gray-600">Core navigation and new learning experiences will follow this preference as translations are completed.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cloud backup</h2>
            {isAuthenticated && googleUser ? (
              <p className="rounded-xl bg-green-50 p-4 text-green-900">
                Signed in as <strong>{googleUser.email || googleUser.name}</strong>. Profile changes sync automatically.
              </p>
            ) : (
              <GoogleSignIn onSignIn={signInWithGoogle} />
            )}
          </div>

          {/* Finger Colors */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Finger Colors</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Index (1)</p>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: settings.fingerColors.index }}></div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Middle (2)</p>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: settings.fingerColors.middle }}></div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Ring (3)</p>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: settings.fingerColors.ring }}></div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Pinky (4)</p>
                <div className="w-8 h-8 rounded" style={{ backgroundColor: settings.fingerColors.pinky }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
