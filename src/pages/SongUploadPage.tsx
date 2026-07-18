import { useState } from 'react';
import { Upload, Music, Link as LinkIcon, AlertCircle, Play } from 'lucide-react';
import { OSMDViewer } from '../components/OSMDViewer';
import { useNavigate } from 'react-router-dom';

const SAMPLE_PUBLIC_DOMAIN_SCORES = [
  {
    title: 'Twinkle Twinkle Little Star',
    composer: 'Traditional',
    url: 'https://raw.githubusercontent.com/w3c/musicxml/gh-pages/docs/tutorial/bravura.xml'
  }
  // Ideally, you would fetch a JSON list from an external public domain API here.
];

export default function SongUploadPage() {
  const [xmlContent, setXmlContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xml') && !file.name.endsWith('.musicxml')) {
      setError('Please upload a valid .musicxml or .xml file.');
      return;
    }

    setFileName(file.name);
    setError(null);
    setIsRendering(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      setXmlContent(e.target?.result as string);
      setIsRendering(false);
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
      setIsRendering(false);
    };
    reader.readAsText(file);
  };

  const loadFromAPI = async (url: string, title: string) => {
    try {
      setIsRendering(true);
      setError(null);
      setFileName(title);
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch score');
      
      const xml = await response.text();
      setXmlContent(xml);
    } catch (err) {
      setError('Failed to load score from external API.');
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-4xl font-bold">Import & Discover</h1>
            <p className="text-gray-400">Play any song by importing MusicXML or exploring public domain scores.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* File Upload Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent" />
            <div className="relative z-10 w-full">
              <Upload size={48} className="mx-auto mb-4 text-purple-400" />
              <h2 className="text-2xl font-bold mb-2">Import Local File</h2>
              <p className="text-gray-400 mb-6">Drag and drop your .musicxml file here, or click to browse.</p>
              
              <label className="cursor-pointer inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-purple-900/50">
                <Music size={20} />
                Select MusicXML File
                <input 
                  type="file" 
                  accept=".xml,.musicxml" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>

          {/* External API Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-bl from-blue-900/20 to-transparent" />
             <div className="relative z-10">
               <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                 <LinkIcon className="text-blue-400" /> Public Domain API
               </h2>
               <p className="text-gray-400 mb-6">Instantly load free scores from external open libraries.</p>
               
               <div className="space-y-3">
                 {SAMPLE_PUBLIC_DOMAIN_SCORES.map((score, idx) => (
                   <button
                     key={idx}
                     onClick={() => loadFromAPI(score.url, score.title)}
                     className="w-full flex items-center justify-between p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700/50 transition-all group"
                   >
                     <div className="text-left">
                       <p className="font-bold text-gray-200">{score.title}</p>
                       <p className="text-sm text-gray-500">{score.composer}</p>
                     </div>
                     <Play className="text-gray-600 group-hover:text-blue-400 transition-colors" />
                   </button>
                 ))}
               </div>
             </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 mb-8">
            <AlertCircle />
            {error}
          </div>
        )}

        {/* Viewer Section */}
        {xmlContent && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold">{fileName}</h3>
                <p className="text-gray-400">Preview and Play</p>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-green-900/50 transition-all flex items-center gap-2">
                <Play size={18} /> Start Practice
              </button>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden min-h-[500px]">
              {isRendering ? (
                <div className="flex items-center justify-center h-[500px] text-gray-950 font-bold">
                  Rendering Score...
                </div>
              ) : (
                <OSMDViewer xmlStr={xmlContent} />
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
