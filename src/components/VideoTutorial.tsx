import { useState } from 'react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  videoUrl?: string;
  youtubeId?: string;
  category: 'basics' | 'technique' | 'songs';
  attribution?: string;
}

const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'How to Hold Your Violin',
    description: 'Learn the proper way to hold your violin comfortably and safely',
    duration: '16:27',
    thumbnail: '🎻',
    category: 'basics',
    youtubeId: 'nM6pbrgjy2c',
    attribution: 'Nicola Benedetti',
  },
  {
    id: '2',
    title: 'Holding the Bow',
    description: 'Master the correct bow hold for beautiful sound',
    duration: '12:00',
    thumbnail: '🏹',
    category: 'basics',
    youtubeId: 'LIZ_TPH1l2w',
    attribution: 'Violin Lounge TV',
  },
  {
    id: '3',
    title: 'Your First Sound',
    description: 'Play your first note on the violin with confidence',
    duration: '10:00',
    thumbnail: '🎵',
    category: 'basics',
    youtubeId: 'placeholder',
    attribution: 'Find Creative Commons video',
  },
  {
    id: '4',
    title: 'Tuning Your Violin',
    description: 'Keep your violin sounding perfect with proper tuning',
    duration: '8:00',
    thumbnail: '🔧',
    category: 'basics',
    youtubeId: 'Ga5e1uyRI7g',
    attribution: 'TakeLessons',
  },
  {
    id: '5',
    title: 'Reading Music Notes',
    description: 'Learn to read sheet music notes for violin',
    duration: '15:00',
    thumbnail: '📝',
    category: 'basics',
    youtubeId: 'placeholder',
    attribution: 'Find Creative Commons video',
  },
  {
    id: '6',
    title: 'Playing Twinkle Twinkle',
    description: 'Learn your first song step by step',
    duration: '12:00',
    thumbnail: '⭐',
    category: 'songs',
    youtubeId: 'placeholder',
    attribution: 'Find Creative Commons video',
  },
];

export default function VideoTutorial() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'basics' | 'technique' | 'songs'>('all');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);

  const filteredTutorials = selectedCategory === 'all' 
    ? tutorials 
    : tutorials.filter(t => t.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All', icon: '📚' },
    { id: 'basics', label: 'Basics', icon: '🎻' },
    { id: 'technique', label: 'Technique', icon: '🎯' },
    { id: 'songs', label: 'Songs', icon: '🎵' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">🎬 Video Tutorials</h2>
      
      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl p-4 mb-6 border-2 border-blue-200">
        <h3 className="font-bold text-blue-900 mb-2">🎯 Learn by Watching:</h3>
        <p className="text-blue-800 text-sm">
          Watch these step-by-step videos to learn violin basics. Follow along with your violin!
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id as any)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Tutorial Grid */}
      {!selectedTutorial ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTutorials.map((tutorial) => (
            <button
              key={tutorial.id}
              onClick={() => setSelectedTutorial(tutorial)}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 hover:shadow-lg transition-all hover:scale-105 text-left border-2 border-transparent hover:border-purple-300"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl bg-white rounded-xl p-3 shadow-sm">
                  {tutorial.thumbnail}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{tutorial.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{tutorial.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>⏱️ {tutorial.duration}</span>
                    <span>•</span>
                    <span className="capitalize">{tutorial.category}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Video Player View */
        <div>
          <button
            onClick={() => setSelectedTutorial(null)}
            className="mb-4 text-purple-600 hover:text-purple-800 font-medium flex items-center gap-2"
          >
            ← Back to tutorials
          </button>

          {/* Video Player */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 mb-4 border-4 border-purple-300">
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              {selectedTutorial.youtubeId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedTutorial.youtubeId}`}
                  title={selectedTutorial.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : selectedTutorial.videoUrl ? (
                <video
                  controls
                  className="w-full h-full"
                  poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23663399'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='white' font-size='12'%3E{selectedTutorial.thumbnail}%3C/text%3E%3C/svg%3E"
                >
                  <source src={selectedTutorial.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-8xl mb-4">{selectedTutorial.thumbnail}</div>
                    <div className="text-2xl font-bold mb-2">{selectedTutorial.title}</div>
                    <div className="text-gray-300 mb-4">Video coming soon!</div>
                    <div className="bg-purple-600/20 rounded-lg p-4 mb-4">
                      <p className="text-sm text-purple-200">
                        This video will show you step-by-step how to {selectedTutorial.title.toLowerCase()}
                      </p>
                    </div>
                    <button className="px-6 py-3 bg-white text-purple-600 rounded-full font-bold hover:bg-purple-50 transition-colors">
                      🎬 Coming Soon
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tutorial Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedTutorial.title}</h3>
            <p className="text-gray-600 mb-4">{selectedTutorial.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span>⏱️ {selectedTutorial.duration}</span>
              <span>•</span>
              <span className="capitalize">{selectedTutorial.category}</span>
            </div>

            {/* Attribution */}
            {selectedTutorial.attribution && (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-sm text-blue-800">
                  <span className="font-bold">Video by:</span> {selectedTutorial.attribution}
                </p>
              </div>
            )}

            {/* Practice Tips */}
            <div className="mt-6 bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
              <h4 className="font-bold text-yellow-900 mb-2">💡 Practice Tips:</h4>
              <ul className="text-yellow-800 text-sm space-y-1">
                <li>• Watch the video all the way through first</li>
                <li>• Then watch again and try to follow along</li>
                <li>• Pause and rewind as needed</li>
                <li>• Practice each step until you're comfortable</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      {!selectedTutorial && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
          <h3 className="font-bold text-green-900 mb-2">🎓 Learning Tips:</h3>
          <ul className="text-green-800 space-y-1 text-sm">
            <li>• Start with the basics videos in order</li>
            <li>• Practice each skill before moving to the next</li>
            <li>• Don't rush - take your time with each video</li>
            <li>• Come back and rewatch videos as needed</li>
          </ul>
        </div>
      )}
    </div>
  );
}
