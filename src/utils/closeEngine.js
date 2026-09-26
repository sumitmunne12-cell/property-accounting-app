// Month-end close sequencing rules (pure functions, unit-tested in Node).
//
// A phase is unlocked only when every task in all earlier phases is signed off — the strict
// subledger locking order (AP → AR → Cash → Accruals → Intercompany → Review → Final lock).

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const periodKey = (year, monthIndex) => `${year}-${String(monthIndex + 1).padStart(2, '0')}`;

export const periodLabel = (key) => {
  const [y, m] = key.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
};

export const shiftPeriod = (key, delta) => {
  const [y, m] = key.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return periodKey(d.getFullYear(), d.getMonth());
};

// The period being closed: before the 15th we are closing last month, afterwards this month.
export const defaultClosePeriod = (now = new Date()) => {
  const d = now.getDate() < 15 ? new Date(now.getFullYear(), now.getMonth() - 1, 1) : now;
  return periodKey(d.getFullYear(), d.getMonth());
};

export function phaseStatuses(phases, done = {}) {
  let priorComplete = true;
  return phases.map((phase) => {
    const total = phase.tasks.length;
    const completed = phase.tasks.filter((t) => done[t.id]).length;
    const complete = completed === total;
    const locked = !priorComplete;
    const status = { id: phase.id, total, completed, complete, locked };
    priorComplete = priorComplete && complete;
    return status;
  });
}

export function isTaskUnlocked(phases, done, taskId) {
  const statuses = phaseStatuses(phases, done);
  const idx = phases.findIndex((p) => p.tasks.some((t) => t.id === taskId));
  return idx >= 0 && !statuses[idx].locked;
}

// The next unsigned task in the first incomplete (and therefore unlocked) phase.
export function nextTask(phases, done = {}) {
  for (const phase of phases) {
    const pending = phase.tasks.find((t) => !done[t.id]);
    if (pending) return { phase, task: pending };
  }
  return null;
}

export function overallProgress(phases, done = {}) {
  const total = phases.reduce((n, p) => n + p.tasks.length, 0);
  const completed = phases.reduce((n, p) => n + p.tasks.filter((t) => done[t.id]).length, 0);
  return { total, completed, pct: total ? Math.round((completed / total) * 100) : 0 };
}

// Toggle a sign-off. Signing off is only allowed in unlocked phases; clearing is always allowed
// (it re-locks later phases, whose sign-offs are kept but no longer count until re-completed).
export function toggleTask(phases, done = {}, taskId, nowIso = new Date().toISOString()) {
  if (done[taskId]) {
    const next = { ...done };
    delete next[taskId];
    return { done: next, changed: true };
  }
  if (!isTaskUnlocked(phases, done, taskId)) return { done, changed: false };
  return { done: { ...done, [taskId]: nowIso }, changed: true };
}
