// Task Manager — pure functions for rearranging, editing, adding, and removing
// both Daily Hub tasks and Month-End Close checklist tasks.
// Fully unit-tested in Node.

import { ALL_TASKS } from '../data/tasksData';
import { CLOSE_PHASES } from '../data/closePlaybookData';

// ---------------------------------------------------------------------------
// Daily Hub Tasks
// ---------------------------------------------------------------------------

/**
 * Reorders a task in the list by moving it up (direction = -1) or down (direction = 1).
 * When withinPhase is true or phase is provided, the swap occurs within tasks of that phase.
 */
export function reorderDailyTask(tasks, taskId, direction, phase = null) {
  if (!Array.isArray(tasks)) return [];
  const list = [...tasks];
  
  if (phase && phase !== 'All') {
    const phaseIndices = [];
    list.forEach((t, i) => {
      if (t.phase === phase) phaseIndices.push(i);
    });
    const subIdx = phaseIndices.findIndex((idx) => list[idx].id === taskId);
    if (subIdx === -1) return list;
    const targetSubIdx = subIdx + direction;
    if (targetSubIdx < 0 || targetSubIdx >= phaseIndices.length) return list;
    
    const actualIdxA = phaseIndices[subIdx];
    const actualIdxB = phaseIndices[targetSubIdx];
    const temp = list[actualIdxA];
    list[actualIdxA] = list[actualIdxB];
    list[actualIdxB] = temp;
    return list;
  }

  const idx = list.findIndex((t) => t.id === taskId);
  if (idx === -1) return list;
  const targetIdx = idx + direction;
  if (targetIdx < 0 || targetIdx >= list.length) return list;
  
  const temp = list[idx];
  list[idx] = list[targetIdx];
  list[targetIdx] = temp;
  return list;
}

/**
 * Updates a daily task with new properties.
 */
export function updateDailyTask(tasks, taskId, updates) {
  if (!Array.isArray(tasks)) return [];
  return tasks.map((t) => {
    if (t.id !== taskId) return t;
    return {
      ...t,
      ...updates,
      id: t.id, // preserve id
    };
  });
}

/**
 * Adds a new daily task.
 */
export function addDailyTask(tasks, newTask, insertAtBeginning = false) {
  const list = Array.isArray(tasks) ? [...tasks] : [];
  const id = newTask.id || `daily_custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const task = {
    id,
    name: (newTask.name || 'Untitled Task').trim(),
    phase: newTask.phase || 'Daily Operations',
    category: newTask.category || 'General',
    frequency: newTask.frequency || 'Daily',
    priority: newTask.priority || 'Medium',
    rpModule: newTask.rpModule || 'GL',
    purpose: newTask.purpose || '',
    rootCause: newTask.rootCause || '',
    actionSOP: Array.isArray(newTask.actionSOP) ? newTask.actionSOP : (newTask.actionSOP ? [newTask.actionSOP] : []),
    navigation: newTask.navigation || { realpage: [], yardi: [] },
    downstreamImpact: newTask.downstreamImpact || {},
    proTips: Array.isArray(newTask.proTips) ? newTask.proTips : [],
    commonPitfalls: Array.isArray(newTask.commonPitfalls) ? newTask.commonPitfalls : [],
    isCustom: true,
    ...newTask,
  };
  return insertAtBeginning ? [task, ...list] : [...list, task];
}

/**
 * Removes a daily task by id.
 */
export function removeDailyTask(tasks, taskId) {
  if (!Array.isArray(tasks)) return [];
  return tasks.filter((t) => t.id !== taskId);
}

/**
 * Resets daily tasks to the standard factory list.
 */
export function getDefaultDailyTasks() {
  return ALL_TASKS.map((t) => ({ ...t }));
}

// ---------------------------------------------------------------------------
// Month-End Close Checklist Tasks
// ---------------------------------------------------------------------------

/**
 * Reorders a task within a close phase.
 */
export function reorderCloseTask(phases, phaseId, taskIndex, direction) {
  if (!Array.isArray(phases)) return [];
  return phases.map((phase) => {
    if (phase.id !== phaseId) return phase;
    const tasks = [...phase.tasks];
    const targetIndex = taskIndex + direction;
    if (targetIndex < 0 || targetIndex >= tasks.length) return phase;
    const temp = tasks[taskIndex];
    tasks[taskIndex] = tasks[targetIndex];
    tasks[targetIndex] = temp;
    return { ...phase, tasks };
  });
}

/**
 * Updates a task inside a close phase.
 */
export function updateCloseTask(phases, phaseId, taskId, updates) {
  if (!Array.isArray(phases)) return [];
  return phases.map((phase) => {
    if (phase.id !== phaseId) return phase;
    const tasks = phase.tasks.map((t) => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        ...updates,
        id: t.id, // preserve id
      };
    });
    return { ...phase, tasks };
  });
}

/**
 * Adds a new task to a specific close phase.
 */
export function addCloseTask(phases, phaseId, newTask) {
  if (!Array.isArray(phases)) return [];
  const id = newTask.id || `close_custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const task = {
    id,
    title: (newTask.title || 'Untitled Close Task').trim(),
    owner: newTask.owner || 'offshore',
    instructions: newTask.instructions || '',
    controlCheck: newTask.controlCheck || '',
    evidence: newTask.evidence || '',
    screenId: newTask.screenId || null,
    yardiEquivalent: newTask.yardiEquivalent || '',
    critical: Boolean(newTask.critical),
    isCustom: true,
    ...newTask,
  };

  return phases.map((phase) => {
    if (phase.id !== phaseId) return phase;
    return {
      ...phase,
      tasks: [...phase.tasks, task],
    };
  });
}

/**
 * Removes a task from a close phase.
 */
export function removeCloseTask(phases, phaseId, taskId) {
  if (!Array.isArray(phases)) return [];
  return phases.map((phase) => {
    if (phase.id !== phaseId) return phase;
    return {
      ...phase,
      tasks: phase.tasks.filter((t) => t.id !== taskId),
    };
  });
}

/**
 * Resets close phases to the standard factory list.
 */
export function getDefaultClosePhases() {
  return CLOSE_PHASES.map((p) => ({
    ...p,
    tasks: p.tasks.map((t) => ({ ...t })),
  }));
}
