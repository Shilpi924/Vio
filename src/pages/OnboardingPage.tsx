import { useState } from 'react';
import type { AgeGroup, LearningGoal, PersonalizationData, PracticeFrequency, SkillLevel } from '../types/userProfile';

interface OnboardingPageProps {
  onComplete: (data: PersonalizationData) => void;
}

const ageOptions: Array<[AgeGroup, string]> = [['5-8', '5–8'], ['9-12', '9–12'], ['13-17', '13–17'], ['18+', '18+']];
const skillOptions: Array<[SkillLevel, string]> = [['beginner', 'New to violin'], ['intermediate', 'Some experience'], ['advanced', 'Advanced']];
const goalOptions: Array<[LearningGoal, string]> = [['fun', 'Play for enjoyment'], ['classical', 'Classical repertoire'], ['folk', 'Folk music'], ['jazz', 'Jazz'], ['exams', 'Prepare for exams'], ['professional', 'Professional growth']];
const frequencyOptions: Array<[PracticeFrequency, string]> = [['daily', 'Daily'], ['few-times-week', 'A few times a week'], ['weekly', 'Weekly'], ['occasional', 'Occasionally']];
const genreOptions = ['Classical', 'Folk', 'Film music', 'Jazz', 'Sacred', 'Children’s songs'];

function ChoiceGroup<T extends string>({ legend, options, value, onChange }: {
  legend: string;
  options: Array<[T, string]>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="border-0 p-0 m-0">
      <legend className="mb-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">{legend}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map(([option, label]) => {
          const isSelected = value === option;
          return (
            <label
              key={option}
              className={`relative flex min-h-[64px] cursor-pointer flex-col justify-center rounded-2xl border px-5 py-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md
                ${isSelected 
                  ? 'border-purple-500 bg-purple-500/10 text-purple-950 dark:text-purple-100 ring-2 ring-purple-500/20' 
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
            >
              <input 
                className="sr-only" 
                type="radio" 
                name={legend} 
                value={option} 
                checked={isSelected} 
                onChange={() => onChange(option)} 
              />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-base">{label}</span>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300
                  ${isSelected 
                    ? 'border-purple-600 bg-purple-600' 
                    : 'border-slate-300 bg-transparent'
                  }`}
                >
                  {isSelected && (
                    <span className="block h-2 w-2 rounded-full bg-white" />
                  )}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('13-17');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('beginner');
  const [learningGoal, setLearningGoal] = useState<LearningGoal>('fun');
  const [practiceFrequency, setPracticeFrequency] = useState<PracticeFrequency>('few-times-week');
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-12 flex items-center justify-center transition-colors duration-300">
      <form
        className="mx-auto w-full max-w-3xl rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-8 shadow-2xl sm:p-12"
        onSubmit={(event) => {
          event.preventDefault();
          onComplete({ ageGroup, skillLevel, learningGoal, practiceFrequency, favoriteGenres });
        }}
      >
        <div className="text-center sm:text-left">
          <p className="text-sm font-black uppercase tracking-[0.25em] text-purple-600 dark:text-purple-400">Set up your plan</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Tell us how you want to learn
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            These choices set recommended content and practice targets. You can change them later.
          </p>
        </div>

        <div className="mt-10 space-y-10">
          <ChoiceGroup legend="Age group" options={ageOptions} value={ageGroup} onChange={setAgeGroup} />
          <ChoiceGroup legend="Current experience" options={skillOptions} value={skillLevel} onChange={setSkillLevel} />
          <ChoiceGroup legend="Main learning goal" options={goalOptions} value={learningGoal} onChange={setLearningGoal} />
          <ChoiceGroup legend="Realistic practice schedule" options={frequencyOptions} value={practiceFrequency} onChange={setPracticeFrequency} />

          <fieldset className="border-0 p-0 m-0">
            <legend className="mb-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Music you enjoy <span className="font-normal text-slate-400 text-sm">(optional)</span>
            </legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {genreOptions.map((genre) => {
                const isSelected = favoriteGenres.includes(genre);
                return (
                  <label 
                    key={genre} 
                    className={`relative flex min-h-[56px] cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all duration-300 hover:scale-[1.02]
                      ${isSelected 
                        ? 'border-purple-500 bg-purple-500/10 text-purple-950 dark:text-purple-100 ring-2 ring-purple-500/20' 
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => setFavoriteGenres((current) => current.includes(genre) ? current.filter((item) => item !== genre) : [...current, genre])}
                    />
                    <span className="font-semibold text-sm">{genre}</span>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all duration-300
                      ${isSelected 
                        ? 'border-purple-600 bg-purple-600' 
                        : 'border-slate-300 bg-transparent'
                      }`}
                    >
                      {isSelected && (
                        <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>

        <button 
          type="submit" 
          className="mt-12 w-full min-h-[56px] rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-lg font-bold shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
        >
          Build my learning plan
        </button>
      </form>
    </main>
  );
}
