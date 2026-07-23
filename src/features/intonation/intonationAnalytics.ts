import type { IntonationNoteResult, PracticeSession, ViolinString } from '../../types';

export interface IntonationMetric {
  key: string;
  label: string;
  attempts: number;
  passRate: number;
  centerScore: number;
  averageCents: number;
  averageStruggle: number;
}

export interface IntonationTrendPoint {
  id: string;
  date: string;
  score: number;
  accuracy: number;
}

export interface IntonationInsights {
  hasData: boolean;
  centerScore: number;
  averageCents: number;
  biasLabel: string;
  strongestNote: string | null;
  rescueNote: string | null;
  sessionCount: number;
  noteMetrics: IntonationMetric[];
  stringMetrics: IntonationMetric[];
  fingerMetrics: IntonationMetric[];
  trend: IntonationTrendPoint[];
  improvement: number | null;
}

const scoreResult = (result: IntonationNoteResult): number =>
  result.passed ? Math.max(0, 100 - Math.abs(result.cents) * 4) : 0;

const summarize = (
  results: IntonationNoteResult[],
  keyFor: (result: IntonationNoteResult) => string,
  labelFor: (result: IntonationNoteResult) => string = keyFor,
): IntonationMetric[] => {
  const groups = new Map<string, { label: string; results: IntonationNoteResult[] }>();
  results.forEach((result) => {
    const key = keyFor(result);
    const group = groups.get(key) ?? { label: labelFor(result), results: [] };
    group.results.push(result);
    groups.set(key, group);
  });

  return [...groups.entries()].map(([key, group]) => ({
    key,
    label: group.label,
    attempts: group.results.length,
    passRate: Math.round((group.results.filter((result) => result.passed).length / group.results.length) * 100),
    centerScore: Math.round(group.results.reduce((sum, result) => sum + scoreResult(result), 0) / group.results.length),
    averageCents: Math.round(group.results.reduce((sum, result) => sum + result.cents, 0) / group.results.length),
    averageStruggle: Math.round(group.results.reduce((sum, result) => sum + result.struggleFrames, 0) / group.results.length),
  }));
};

export function buildIntonationInsights(sessions: PracticeSession[]): IntonationInsights {
  const intonationSessions = sessions
    .filter((session) => session.intonationDetails?.length)
    .slice()
    .sort((left, right) => new Date(left.startedAt).getTime() - new Date(right.startedAt).getTime());
  const results = intonationSessions.flatMap((session) => session.intonationDetails ?? []);

  if (!results.length) {
    return {
      hasData: false,
      centerScore: 0,
      averageCents: 0,
      biasLabel: 'No pattern yet',
      strongestNote: null,
      rescueNote: null,
      sessionCount: 0,
      noteMetrics: [],
      stringMetrics: [],
      fingerMetrics: [],
      trend: [],
      improvement: null,
    };
  }

  const noteMetrics = summarize(results, (result) => result.note);
  const stringMetrics = summarize(
    results,
    (result) => result.string,
    (result) => `${result.string} string`,
  );
  const fingerMetrics = summarize(
    results,
    (result) => String(result.finger),
    (result) => `Finger ${result.finger}`,
  );
  const averageCents = Math.round(results.reduce((sum, result) => sum + result.cents, 0) / results.length);
  const trend = intonationSessions.slice(-8).map((session) => {
    const details = session.intonationDetails ?? [];
    return {
      id: session.id,
      date: new Date(session.startedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: Math.round(details.reduce((sum, result) => sum + scoreResult(result), 0) / details.length),
      accuracy: session.accuracy,
    };
  });
  const firstHalf = trend.slice(0, Math.max(1, Math.floor(trend.length / 2)));
  const secondHalf = trend.slice(Math.max(1, Math.floor(trend.length / 2)));
  const average = (points: IntonationTrendPoint[]) =>
    points.reduce((sum, point) => sum + point.score, 0) / Math.max(1, points.length);
  const orderedNotes = [...noteMetrics].sort((left, right) => right.centerScore - left.centerScore);

  return {
    hasData: true,
    centerScore: Math.round(results.reduce((sum, result) => sum + scoreResult(result), 0) / results.length),
    averageCents,
    biasLabel: Math.abs(averageCents) <= 2 ? 'Centered' : averageCents > 0 ? 'Tends sharp' : 'Tends flat',
    strongestNote: orderedNotes[0]?.label ?? null,
    rescueNote: orderedNotes[orderedNotes.length - 1]?.label ?? null,
    sessionCount: intonationSessions.length,
    noteMetrics,
    stringMetrics: (['D', 'A'] as ViolinString[])
      .map((stringName) => stringMetrics.find((metric) => metric.key === stringName))
      .filter((metric): metric is IntonationMetric => Boolean(metric)),
    fingerMetrics: ['1', '2', '3']
      .map((finger) => fingerMetrics.find((metric) => metric.key === finger))
      .filter((metric): metric is IntonationMetric => Boolean(metric)),
    trend,
    improvement: trend.length >= 2 ? Math.round(average(secondHalf) - average(firstHalf)) : null,
  };
}
