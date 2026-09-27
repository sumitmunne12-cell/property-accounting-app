// Unit tests for task management (reordering, editing, adding, removing tasks).
// Run: npm test
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  reorderDailyTask,
  updateDailyTask,
  addDailyTask,
  removeDailyTask,
  getDefaultDailyTasks,
  reorderCloseTask,
  updateCloseTask,
  addCloseTask,
  removeCloseTask,
  getDefaultClosePhases,
} from '../../src/utils/taskManager.js';
import {
  phaseStatuses,
  overallProgress,
  toggleTask,
} from '../../src/utils/closeEngine.js';

test('reorderDailyTask swaps tasks up and down correctly', () => {
  const initial = [
    { id: 't1', name: 'Task 1', phase: 'Pre-AME' },
    { id: 't2', name: 'Task 2', phase: 'Pre-AME' },
    { id: 't3', name: 'Task 3', phase: 'AME-1' },
  ];

  // Move t1 down -> t2, t1, t3
  const down = reorderDailyTask(initial, 't1', 1);
  assert.equal(down[0].id, 't2');
  assert.equal(down[1].id, 't1');
  assert.equal(down[2].id, 't3');

  // Move t2 down when it's at index 0 -> t1, t2, t3
  const up = reorderDailyTask(down, 't1', -1);
  assert.equal(up[0].id, 't1');
  assert.equal(up[1].id, 't2');

  // Boundary checks: moving first task up or last task down does nothing
  assert.deepEqual(reorderDailyTask(initial, 't1', -1), initial);
  assert.deepEqual(reorderDailyTask(initial, 't3', 1), initial);
});

test('reorderDailyTask handles phase-scoped reordering', () => {
  const initial = [
    { id: 't1', name: 'Task 1', phase: 'Pre-AME' },
    { id: 't2', name: 'Task 2', phase: 'Daily Operations' },
    { id: 't3', name: 'Task 3', phase: 'Pre-AME' },
  ];

  // Moving t1 down within 'Pre-AME' swaps t1 with t3, leaving t2 in place
  const res = reorderDailyTask(initial, 't1', 1, 'Pre-AME');
  assert.equal(res[0].id, 't3');
  assert.equal(res[1].id, 't2');
  assert.equal(res[2].id, 't1');
});

test('updateDailyTask modifies task properties while keeping id intact', () => {
  const initial = [
    { id: 't1', name: 'Old Name', priority: 'Low' },
    { id: 't2', name: 'Other', priority: 'Medium' },
  ];

  const updated = updateDailyTask(initial, 't1', { name: 'New Name', priority: 'High', id: 'hack' });
  assert.equal(updated[0].name, 'New Name');
  assert.equal(updated[0].priority, 'High');
  assert.equal(updated[0].id, 't1'); // id unchanged
  assert.equal(updated[1].name, 'Other');
});

test('addDailyTask and removeDailyTask manage task collection', () => {
  const initial = [{ id: 't1', name: 'Task 1' }];

  const added = addDailyTask(initial, { name: 'Custom Task', priority: 'High', phase: 'Daily Operations' });
  assert.equal(added.length, 2);
  assert.ok(added[1].id.startsWith('daily_custom_'));
  assert.equal(added[1].name, 'Custom Task');
  assert.equal(added[1].isCustom, true);

  const removed = removeDailyTask(added, 't1');
  assert.equal(removed.length, 1);
  assert.equal(removed[0].name, 'Custom Task');
});

test('reorderCloseTask moves close tasks within the target phase', () => {
  const phases = [
    {
      id: 'phase1',
      title: 'Phase 1',
      tasks: [
        { id: 'p1_t1', title: 'Task A' },
        { id: 'p1_t2', title: 'Task B' },
        { id: 'p1_t3', title: 'Task C' },
      ],
    },
    {
      id: 'phase2',
      title: 'Phase 2',
      tasks: [{ id: 'p2_t1', title: 'Task D' }],
    },
  ];

  // Move Task A down -> Task B, Task A, Task C in phase1
  const moved = reorderCloseTask(phases, 'phase1', 0, 1);
  assert.equal(moved[0].tasks[0].id, 'p1_t2');
  assert.equal(moved[0].tasks[1].id, 'p1_t1');
  assert.equal(moved[0].tasks[2].id, 'p1_t3');
  assert.equal(moved[1].tasks.length, 1);

  // Boundary: Move Task B up when at top
  const noChange = reorderCloseTask(phases, 'phase1', 0, -1);
  assert.deepEqual(noChange, phases);
});

test('updateCloseTask updates task within target phase', () => {
  const phases = [
    {
      id: 'phase1',
      tasks: [{ id: 'p1_t1', title: 'Original', critical: false }],
    },
  ];

  const updated = updateCloseTask(phases, 'phase1', 'p1_t1', {
    title: 'Edited Title',
    critical: true,
  });
  assert.equal(updated[0].tasks[0].title, 'Edited Title');
  assert.equal(updated[0].tasks[0].critical, true);
  assert.equal(updated[0].tasks[0].id, 'p1_t1');
});

test('addCloseTask and removeCloseTask manage close tasks', () => {
  const phases = [
    {
      id: 'phase1',
      tasks: [{ id: 'p1_t1', title: 'Task 1' }],
    },
  ];

  const withNew = addCloseTask(phases, 'phase1', {
    title: 'New Close Check',
    owner: 'reviewer',
    critical: true,
  });
  assert.equal(withNew[0].tasks.length, 2);
  assert.equal(withNew[0].tasks[1].title, 'New Close Check');
  assert.equal(withNew[0].tasks[1].owner, 'reviewer');
  assert.equal(withNew[0].tasks[1].critical, true);
  assert.ok(withNew[0].tasks[1].id.startsWith('close_custom_'));

  const removed = removeCloseTask(withNew, 'phase1', 'p1_t1');
  assert.equal(removed[0].tasks.length, 1);
  assert.equal(removed[0].tasks[0].title, 'New Close Check');
});

test('closeEngine functions work seamlessly with customized close phases', () => {
  const customPhases = [
    {
      id: 'phase1',
      tasks: [
        { id: 'c1', title: 'Custom Close 1' },
        { id: 'c2', title: 'Custom Close 2' },
      ],
    },
    {
      id: 'phase2',
      tasks: [{ id: 'c3', title: 'Custom Close 3' }],
    },
  ];

  let done = {};
  const s1 = phaseStatuses(customPhases, done);
  assert.equal(s1[0].locked, false);
  assert.equal(s1[1].locked, true); // phase 2 locked because phase 1 not complete

  // Complete c1
  done = toggleTask(customPhases, done, 'c1').done;
  assert.equal(overallProgress(customPhases, done).completed, 1);
  assert.equal(overallProgress(customPhases, done).total, 3);

  // Complete c2 -> phase 2 unlocks
  done = toggleTask(customPhases, done, 'c2').done;
  const s2 = phaseStatuses(customPhases, done);
  assert.equal(s2[0].complete, true);
  assert.equal(s2[1].locked, false);

  // Complete c3 in phase 2
  done = toggleTask(customPhases, done, 'c3').done;
  assert.equal(overallProgress(customPhases, done).pct, 100);
});
