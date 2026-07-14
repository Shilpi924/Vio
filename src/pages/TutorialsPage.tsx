import { useState } from 'react';
import { violinTutorials, getTutorialsByCategory, type Tutorial } from '../data/tutorials';

export default function TutorialsPage() {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isPlaying, setIsPlaying] = useState(false);

  const categories = ['all', 'basics', 'technique', 'music-theory', 'practice', 'advanced'];

  const filteredTutorials = selectedCategory === 'all' 
    ? violinTutorials 
    : getTutorialsByCategory(selectedCategory as Tutorial['category']);

  const getDifficultyColor = (difficulty: Tutorial['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
    }
  };

  const getCategoryColor = (category: Tutorial['category']) => {
    switch (category) {
      case 'basics': return 'bg-blue-100 text-blue-800';
      case 'technique': return 'bg-purple-100 text-purple-800';
      case 'music-theory': return 'bg-indigo-100 text-indigo-800';
      case 'practice': return 'bg-pink-100 text-pink-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
    }
  };

  if (selectedTutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedTutorial(null)}
            className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-colors"
          >
            ← Back to Tutorials
          </button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedTutorial.category)}`}>
                {selectedTutorial.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedTutorial.difficulty)}`}>
                {selectedTutorial.difficulty}
              </span>
              <span className="text-gray-500 text-sm">
                {selectedTutorial.duration} min
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedTutorial.title}</h1>
            <p className="text-lg text-gray-700 mb-8">{selectedTutorial.description}</p>

            {/* Audio/Video Player */}
            <div className="mb-8 bg-gray-100 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">🎵 Audio Guide</h3>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                </button>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    {isPlaying ? '🎵' : '🎧'}
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-600 transition-all"
                        style={{ width: isPlaying ? '45%' : '0%' }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{isPlaying ? '1:23' : '0:00'}</span>
                      <span>3:00</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Listen to the audio guide while following the tutorial. The audio provides step-by-step instructions and demonstrations.
              </p>
            </div>

            <div className="space-y-8">
              {selectedTutorial.sections.map((section, index) => (
                <div key={index} className="border-l-4 border-purple-500 pl-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h2>
                  <div className="text-gray-700 whitespace-pre-line mb-4">{section.content}</div>
                  
                  {section.tips && section.tips.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
                      <ul className="list-disc list-inside text-blue-800 space-y-1">
                        {section.tips.map((tip, tipIndex) => (
                          <li key={tipIndex}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.commonMistakes && section.commonMistakes.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-4 mb-4">
                      <h3 className="font-semibold text-red-900 mb-2">⚠️ Common Mistakes</h3>
                      <ul className="list-disc list-inside text-red-800 space-y-1">
                        {section.commonMistakes.map((mistake, mistakeIndex) => (
                          <li key={mistakeIndex}>{mistake}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {section.practiceExercise && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold text-green-900 mb-2">🎯 Practice Exercise</h3>
                      <p className="text-green-800">{section.practiceExercise}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Violin Tutorials</h1>
        <p className="text-lg text-gray-700 mb-6">Learn violin with step-by-step tutorials designed for beginners and intermediate players.</p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Tutorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <div
              key={tutorial.id}
              onClick={() => setSelectedTutorial(tutorial)}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(tutorial.category)}`}>
                  {tutorial.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                  {tutorial.difficulty}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">{tutorial.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{tutorial.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>⏱️ {tutorial.duration} min</span>
                <span>📚 {tutorial.sections.length} sections</span>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-purple-600 font-medium">🎵 Includes audio guide</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
