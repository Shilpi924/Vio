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
    <fieldset>
      <legend className="mb-3 text-lg font-bold text-slate-950">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map(([option, label]) => (
          <label key={option} className={`flex min-h-12 cursor-pointer items-center rounded-xl border px-4 py-3 ${value === option ? 'border-purple-600 bg-purple-50 text-purple-950' : 'border-slate-200 bg-white text-slate-700'}`}>
            <input className="mr-3 accent-purple-700" type="radio" name={legend} value={option} checked={value === option} onChange={() => onChange(option)} />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('9-12');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('beginner');
  const [learningGoal, setLearningGoal] = useState<LearningGoal>('fun');
  const [practiceFrequency, setPracticeFrequency] = useState<PracticeFrequency>('few-times-week');
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);

  return (
    <main className="min-h-screen bg-[#fffdf8] px-4 py-10">
      <form
        className="mx-auto max-w-3xl rounded-3xl border border-purple-100 bg-white p-6 shadow-xl sm:p-9"
        onSubmit={(event) => {
          event.preventDefault();
          onComplete({ ageGroup, skillLevel, learningGoal, practiceFrequency, favoriteGenres });
        }}
      >
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-700">Set up your plan</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-950">Tell us how you want to learn</h1>
        <p className="mt-3 text-slate-600">These choices set recommended content and practice targets. You can change them later.</p>

        <div className="mt-8 space-y-8">
          <ChoiceGroup legend="Age group" options={ageOptions} value={ageGroup} onChange={setAgeGroup} />
          <ChoiceGroup legend="Current experience" options={skillOptions} value={skillLevel} onChange={setSkillLevel} />
          <ChoiceGroup legend="Main learning goal" options={goalOptions} value={learningGoal} onChange={setLearningGoal} />
          <ChoiceGroup legend="Realistic practice schedule" options={frequencyOptions} value={practiceFrequency} onChange={setPracticeFrequency} />

          <fieldset>
            <legend className="mb-3 text-lg font-bold text-slate-950">Music you enjoy <span className="font-normal text-slate-500">(optional)</span></legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {genreOptions.map((genre) => (
                <label key={genre} className={`flex min-h-12 cursor-pointer items-center rounded-xl border px-4 py-3 ${favoriteGenres.includes(genre) ? 'border-purple-600 bg-purple-50' : 'border-slate-200'}`}>
                  <input
                    type="checkbox"
                    className="mr-3 accent-purple-700"
                    checked={favoriteGenres.includes(genre)}
                    onChange={() => setFavoriteGenres((current) => current.includes(genre) ? current.filter((item) => item !== genre) : [...current, genre])}
                  />
                  {genre}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <button type="submit" className="mt-9 min-h-12 w-full rounded-xl bg-purple-700 px-5 py-3 text-lg font-bold text-white hover:bg-purple-800">
          Build my learning plan
        </button>
      </form>
    </main>
  );
}
