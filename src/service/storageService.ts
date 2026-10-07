import type { ClassificationResult, HistoryRecord, UserStats } from '../types';

const STATS_KEY = 'ecosnap_user_stats';
const HISTORY_KEY = 'ecosnap_scan_history';

const INITIAL_STATS: UserStats = {
  totalScans: 0,
  confirmedDisposals: 0,
  ecoPoints: 0,
  currentStreakDays: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  categoryCounts: {
    recyclable: 0,
    wet: 0,
    dry: 0,
    ewaste: 0
  },
  totalImpactCo2eGrams: 0
};

const INITIAL_HISTORY: HistoryRecord[] = [];

export const getUserStats = (): UserStats => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) {
      localStorage.setItem(STATS_KEY, JSON.stringify(INITIAL_STATS));
      return INITIAL_STATS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_STATS;
  }
};

export const saveUserStats = (stats: UserStats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save stats to localStorage', err);
  }
};

export const getScanHistory = (): HistoryRecord[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(INITIAL_HISTORY));
      return INITIAL_HISTORY;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_HISTORY;
  }
};

export const recordScanAndDisposal = (
  classification: ClassificationResult
): { updatedStats: UserStats; pointsAwarded: number } => {
  const currentStats = getUserStats();
  const currentHistory = getScanHistory();

  const today = new Date().toISOString().split('T')[0];
  const lastActive = currentStats.lastActiveDate;

  // Streak logic
  let newStreak = currentStats.currentStreakDays;
  if (lastActive !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (lastActive === yesterday) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }
  } else if (newStreak === 0) {
    newStreak = 1;
  }

  const category = classification.item.category;
  const pointsAwarded = classification.item.ecoPoints || 10;
  const impactCo2Grams = classification.item.estimatedImpactCo2eGrams || 100;

  const updatedStats: UserStats = {
    ...currentStats,
    totalScans: currentStats.totalScans + 1,
    confirmedDisposals: currentStats.confirmedDisposals + 1,
    ecoPoints: currentStats.ecoPoints + pointsAwarded,
    currentStreakDays: newStreak,
    lastActiveDate: today,
    categoryCounts: {
      ...currentStats.categoryCounts,
      [category]: (currentStats.categoryCounts[category] || 0) + 1
    },
    totalImpactCo2eGrams: currentStats.totalImpactCo2eGrams + impactCo2Grams
  };

  const newHistoryRecord: HistoryRecord = {
    id: `hist-${Date.now()}`,
    result: classification,
    timestamp: new Date().toISOString(),
    userActionTaken: 'disposed'
  };

  saveUserStats(updatedStats);

  try {
    const updatedHistory = [newHistoryRecord, ...currentHistory];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error('Failed to save history record', e);
  }

  return { updatedStats, pointsAwarded };
};

export const clearAllHistoryAndStats = (): void => {
  try {
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Error resetting storage', e);
  }
};
