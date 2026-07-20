import { useState, useEffect } from 'react';
import { Upload, Music, Link as LinkIcon, AlertCircle, Play, Search } from 'lucide-react';
import { OSMDViewer } from '../components/OSMDViewer';
import { useNavigate } from 'react-router-dom';
import { publicDomainAPI, PublicDomainScore } from '../services/PublicDomainAPI';

export default function SongUploadPage() {
  const [xmlContent, setXmlContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // API Catalog State
  const [scores, setScores] = useState<PublicDomainScore[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchScores = async () => {
      setIsSearching(true);
      try {
        const results = await publicDomainAPI.searchScores(searchQuery, difficultyFilter);
        setScores(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };
    fetchScores();
  }, [searchQuery, difficultyFilter]);

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
    } catch {
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
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden h-[400px]">
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
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden h-[400px] flex flex-col">
             <div className="absolute inset-0 bg-gradient-to-bl from-blue-900/20 to-transparent" />
             <div className="relative z-10 flex flex-col h-full">
               <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                 <LinkIcon className="text-blue-400" /> Public Domain API
               </h2>
               
               <div className="flex gap-2 mb-4">
                 <div className="relative flex-1">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                   <input
                     type="text"
                     placeholder="Search composers, titles..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-blue-500"
                   />
                 </div>
                 <select 
                   value={difficultyFilter}
                   onChange={(e) => setDifficultyFilter(e.target.value)}
                   className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                 >
                   <option value="All">All Levels</option>
                   <option value="Beginner">Beginner</option>
                   <option value="Intermediate">Intermediate</option>
                   <option value="Advanced">Advanced</option>
                 </select>
               </div>

               <div className="space-y-2 overflow-y-auto flex-1 pr-2">
                 {isSearching ? (
                   <p className="text-gray-500 text-center py-4">Searching...</p>
                 ) : scores.length === 0 ? (
                   <p className="text-gray-500 text-center py-4">No scores found.</p>
                 ) : (
                   scores.map((score) => (
                     <button
                       key={score.id}
                       onClick={() => loadFromAPI(score.url, score.title)}
                       className="w-full flex items-center justify-between p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl border border-gray-700/50 transition-all group"
                     >
                       <div className="text-left flex-1 min-w-0 pr-4">
                         <p className="font-bold text-gray-200 truncate">{score.title}</p>
                         <p className="text-xs text-gray-500 truncate">{score.composer} • {score.difficulty}</p>
                       </div>
                       <Play className="text-gray-600 group-hover:text-blue-400 transition-colors flex-shrink-0" size={18} />
                     </button>
                   ))
                 )}
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
