import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { LAYOUT, RADII } from '../theme/layout';
import { ProgressRing, GaugeBar } from './ui';
import { CLOSE_PHASES, CLOSE_ROLES } from '../data/closePlaybookData';
import { getScreenEntry } from '../utils/screenIndex';
import { getCloseProgress, saveCloseProgress } from '../utils/storage';
import {
  ALL_PROPERTIES,
  DEFAULT_PROGRESS_KEY,
  defaultTimeline,
  migrateCloseProgress,
  phaseSchedule,
  windowStatus,
  formatRange,
  formatOffsets,
} from '../utils/propertyTimeline';
import { STATUS_STYLE } from './CloseTimelineStrip';
import {
  defaultClosePeriod,
  periodLabel,
  shiftPeriod,
  phaseStatuses,
  nextTask,
  overallProgress,
  toggleTask,
} from '../utils/closeEngine';
import { triggerHaptic } from '../utils/haptics';
import { CLOSE_TASK_ASC } from '../data/gaapLinksData';
import { ascLinksForTopics } from '../utils/ascLinks';
import GaapButton from './gaap/GaapButton';

function TaskRow({ task, signedAt, locked, expanded, onToggleExpand, onToggleDone, onPerform }) {
  const entry = getScreenEntry(task.screenId);
  return (
    <View style={[styles.taskCard, signedAt && styles.taskCardDone]}>
      <View style={styles.taskTop}>
        <TouchableOpacity
          style={[styles.checkbox, signedAt && styles.checkboxDone, locked && !signedAt && styles.checkboxLocked]}
          onPress={onToggleDone}
          accessibilityLabel={signedAt ? 'Clear sign-off' : 'Sign off task'}
          disabled={locked && !signedAt}
        >
          {signedAt ? (
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          ) : locked ? (
            <Ionicons name="lock-closed" size={11} color={COLORS.textMuted} />
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity style={styles.taskTitleWrap} onPress={onToggleExpand} activeOpacity={0.7}>
          <Text style={[styles.taskTitle, signedAt && styles.taskTitleDone]}>{task.title}</Text>
          <View style={styles.taskMetaRow}>
            <Text style={styles.ownerChip}>{CLOSE_ROLES[task.owner]}</Text>
            {task.critical ? <Text style={styles.criticalChip}>CRITICAL</Text> : null}
            {signedAt ? <Text style={styles.signedText}>Signed {new Date(signedAt).toLocaleDateString()}</Text> : null}
          </View>
        </TouchableOpacity>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textSecondary} />
      </View>

      {expanded && (
        <View style={styles.taskBody}>
          <Text style={styles.label}>WHAT TO DO</Text>
          <Text style={styles.body}>{task.instructions}</Text>
          <Text style={[styles.label, { color: COLORS.success }]}>CONTROL CHECK</Text>
          <Text style={styles.body}>{task.controlCheck}</Text>
          <Text style={[styles.label, { color: COLORS.warning }]}>EVIDENCE FOR THE CLOSE BINDER</Text>
          <Text style={styles.body}>{task.evidence}</Text>
          <Text style={[styles.label, { color: COLORS.yardi }]}>YARDI VOYAGER EQUIVALENT</Text>
          <Text style={styles.body}>{task.yardiEquivalent}</Text>
          <TouchableOpacity style={styles.performBtn} onPress={onPerform} activeOpacity={0.8}>
            <Ionicons name="play-circle" size={16} color="#FFFFFF" />
            <Text style={styles.performText}>Perform Task — open SOP</Text>
          </TouchableOpacity>
          {entry ? (
            <Text style={styles.linkedScreen} numberOfLines={2}>
              {entry.moduleShortCode} › {entry.name}
            </Text>
          ) : null}
          <GaapButton links={ascLinksForTopics(CLOSE_TASK_ASC[task.id], 'close')} contextLabel={task.title} />
        </View>
      )}
    </View>
  );
}

// `properties` / `selectedPropertyId` come from the app shell. Sign-offs are kept per property and
// period; each property's timeline turns the phase windows into real due dates.
export default function CloseCockpit({ onOpenScreen, properties = [], selectedPropertyId = ALL_PROPERTIES, onManageProperties }) {
  const [period, setPeriod] = useState(defaultClosePeriod());
  const [progress, setProgress] = useState({});
  const [expandedPhaseId, setExpandedPhaseId] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [localPropertyId, setLocalPropertyId] = useState(null);

  useEffect(() => {
    getCloseProgress().then((raw) => {
      const migrated = migrateCloseProgress(raw, properties, selectedPropertyId);
      setProgress(migrated);
      if (migrated !== raw) saveCloseProgress(migrated);
    });
    // Migration only needs the list as it was at first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The property whose close is shown: the header selection, or a local pick under "All Properties".
  const property =
    properties.find((p) => p.id === selectedPropertyId) ||
    properties.find((p) => p.id === localPropertyId) ||
    properties[0] ||
    null;
  const progressKey = property ? property.id : DEFAULT_PROGRESS_KEY;
  const timeline = property ? property.timeline : defaultTimeline();
  const schedule = useMemo(() => phaseSchedule(period, timeline), [period, timeline]);
  const today = new Date();

  const done = useMemo(() => (progress[progressKey] || {})[period] || {}, [progress, progressKey, period]);
  const statuses = useMemo(() => phaseStatuses(CLOSE_PHASES, done), [done]);
  const overall = useMemo(() => overallProgress(CLOSE_PHASES, done), [done]);
  const upNext = useMemo(() => nextTask(CLOSE_PHASES, done), [done]);
  const currentPhaseId = upNext ? upNext.phase.id : null;
  const openPhaseId = expandedPhaseId ?? currentPhaseId;

  const handleToggle = (taskId) => {
    const result = toggleTask(CLOSE_PHASES, done, taskId);
    if (!result.changed) return;
    triggerHaptic(result.done[taskId] ? 'success' : 'light');
    const updated = { ...progress, [progressKey]: { ...(progress[progressKey] || {}), [period]: result.done } };
    setProgress(updated);
    saveCloseProgress(updated);
  };

  const resetPeriod = () => {
    const forProperty = { ...(progress[progressKey] || {}) };
    delete forProperty[period];
    const updated = { ...progress, [progressKey]: forProperty };
    setProgress(updated);
    saveCloseProgress(updated);
  };

  const perform = (task, phase) => {
    triggerHaptic('light');
    onOpenScreen(task.screenId, `PHASE ${phase.number} · ${task.title.toUpperCase()}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.column}>
      {/* Property whose close is shown */}
      <View style={styles.propertyBar}>
        {selectedPropertyId === ALL_PROPERTIES && properties.length > 1 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.propertyChips}>
            {properties.map((p) => {
              const on = property && p.id === property.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  style={[styles.propertyChip, on && styles.propertyChipOn]}
                  onPress={() => setLocalPropertyId(p.id)}
                  accessibilityState={{ selected: on }}
                >
                  <Text style={[styles.propertyChipText, on && styles.propertyChipTextOn]} numberOfLines={1}>
                    {p.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.propertyNameRow}>
            <Ionicons name="business-outline" size={14} color={COLORS.close} />
            <Text style={styles.propertyName} numberOfLines={1}>
              {property ? property.name : 'Default close timeline'}
            </Text>
          </View>
        )}
        {onManageProperties ? (
          <TouchableOpacity onPress={() => onManageProperties(property ? property.id : null)} style={styles.manageBtn}>
            <Ionicons name="calendar-outline" size={13} color={COLORS.primaryLight} />
            <Text style={styles.manageText}>{property ? 'Edit timeline' : 'Add property'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Period + overall progress gauge + phase milestones */}
      <View style={styles.header}>
        <View style={styles.periodRow}>
          <TouchableOpacity onPress={() => setPeriod(shiftPeriod(period, -1))} style={styles.periodBtn} accessibilityLabel="Previous period">
            <Ionicons name="chevron-back" size={16} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.periodCenter}>
            <Text style={styles.periodLabel}>MONTH-END CLOSE</Text>
            <Text style={styles.periodValue}>{periodLabel(period)}</Text>
          </View>
          <TouchableOpacity onPress={() => setPeriod(shiftPeriod(period, 1))} style={styles.periodBtn} accessibilityLabel="Next period">
            <Ionicons name="chevron-forward" size={16} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.gaugeRow}>
          <ProgressRing pct={overall.pct} size={96} segments={48} thickness={3.5} color={overall.pct === 100 ? COLORS.success : COLORS.close}>
            <Text style={styles.gaugePct}>{overall.pct}%</Text>
            <Text style={styles.gaugeCaption}>closed</Text>
          </ProgressRing>
          <View style={styles.gaugeStats}>
            <View style={styles.statRow}>
              <Text style={styles.statValue}>{overall.completed}</Text>
              <Text style={styles.statLabel}> / {overall.total} tasks signed off</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statValue}>{statuses.filter((x) => x.complete).length}</Text>
              <Text style={styles.statLabel}> / {CLOSE_PHASES.length} phases locked</Text>
            </View>
            <View style={styles.gaugeBarWrap}>
              <GaugeBar pct={overall.pct} color={overall.pct === 100 ? COLORS.success : COLORS.close} />
            </View>
          </View>
        </View>

        <View style={styles.milestones}>
          {CLOSE_PHASES.map((phase, idx) => {
            const st = statuses[idx];
            const pct = st.total ? Math.round((st.completed / st.total) * 100) : 0;
            const color = st.complete ? COLORS.success : st.locked ? COLORS.textMuted : COLORS.close;
            return (
              <TouchableOpacity
                key={phase.id}
                style={styles.milestone}
                onPress={() => setExpandedPhaseId(phase.id)}
                accessibilityLabel={`Phase ${phase.number}: ${pct}% complete`}
              >
                <ProgressRing pct={pct} size={34} segments={20} thickness={2.5} color={color}>
                  {st.complete ? (
                    <Ionicons name="checkmark" size={13} color={COLORS.success} />
                  ) : st.locked ? (
                    <Ionicons name="lock-closed" size={10} color={COLORS.textMuted} />
                  ) : (
                    <Text style={[styles.milestoneNum, { color }]}>{phase.number}</Text>
                  )}
                </ProgressRing>
                <Text style={styles.milestoneLabel}>P{phase.number}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Next action */}
      {upNext ? (
        <View style={styles.nextCard}>
          <Text style={styles.nextLabel}>
            UP NEXT · PHASE {upNext.phase.number} · DUE {formatRange(schedule[upNext.phase.number - 1].start, schedule[upNext.phase.number - 1].end).toUpperCase()}
          </Text>
          <Text style={styles.nextTitle}>{upNext.task.title}</Text>
          <TouchableOpacity style={styles.performBtn} onPress={() => perform(upNext.task, upNext.phase)}>
            <Ionicons name="play-circle" size={16} color="#FFFFFF" />
            <Text style={styles.performText}>Perform Task — open SOP</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.nextCard, { borderColor: COLORS.success }]}>
          <Text style={[styles.nextLabel, { color: COLORS.success }]}>CLOSE COMPLETE</Text>
          <Text style={styles.nextTitle}>GL locked and investor package delivered for {periodLabel(period)}.</Text>
        </View>
      )}

      {/* Phases */}
      {CLOSE_PHASES.map((phase, idx) => {
        const st = statuses[idx];
        const isOpen = phase.id === openPhaseId;
        const color = st.complete ? COLORS.success : st.locked ? COLORS.textMuted : COLORS.close;
        const pct = st.total ? Math.round((st.completed / st.total) * 100) : 0;
        const sched = schedule[idx];
        const due = STATUS_STYLE[windowStatus(sched, today, st.complete)];
        return (
          <View key={phase.id} style={[styles.phaseCard, isOpen && styles.phaseCardOpen, !st.locked && !st.complete && styles.phaseCardActive]}>
            <TouchableOpacity
              style={styles.phaseHeader}
              onPress={() => setExpandedPhaseId(isOpen ? '' : phase.id)}
              activeOpacity={0.7}
            >
              <ProgressRing pct={pct} size={40} segments={24} thickness={2.5} color={color}>
                {st.complete ? (
                  <Ionicons name="checkmark" size={15} color={COLORS.success} />
                ) : st.locked ? (
                  <Ionicons name="lock-closed" size={12} color={COLORS.textMuted} />
                ) : (
                  <Text style={[styles.phaseRingPct, { color }]}>{pct}%</Text>
                )}
              </ProgressRing>
              <View style={styles.phaseHeaderText}>
                <Text style={styles.phaseTitle}>
                  Phase {phase.number}: {phase.title}
                </Text>
                <Text style={styles.phaseMeta}>
                  {formatRange(sched.start, sched.end)} ({formatOffsets(sched.startOffset, sched.endOffset, timeline.basis)}) · {st.completed}/{st.total} signed off
                  {st.locked ? ' · locked' : ''}
                </Text>
                <View style={[styles.duePill, { borderColor: `${due.color}66`, backgroundColor: `${due.color}14` }]}>
                  <Ionicons name={due.icon} size={11} color={due.color} />
                  <Text style={[styles.dueText, { color: due.color }]}>{due.label}</Text>
                </View>
              </View>
              <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>

            {isOpen && (
              <View style={styles.phaseBody}>
                <Text style={styles.body}>{phase.objective}</Text>
                <View style={styles.gateBox}>
                  <Ionicons name="lock-closed-outline" size={13} color={COLORS.gold} />
                  <Text style={styles.gateText}>Lock gate: {phase.lockGate}</Text>
                </View>
                {st.locked ? (
                  <Text style={styles.lockedNote}>
                    Locked: sign off every task in Phase {phase.number - 1} first. Subledgers close in sequence, so this phase depends on the previous lock.
                  </Text>
                ) : null}
                {phase.tasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    signedAt={done[task.id]}
                    locked={st.locked}
                    expanded={expandedTaskId === task.id}
                    onToggleExpand={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                    onToggleDone={() => handleToggle(task.id)}
                    onPerform={() => perform(task, phase)}
                  />
                ))}
              </View>
            )}
          </View>
        );
      })}

      {overall.completed > 0 && (
        <TouchableOpacity style={styles.resetBtn} onPress={resetPeriod}>
          <Ionicons name="refresh" size={14} color={COLORS.textSecondary} />
          <Text style={styles.resetText}>Reset sign-offs for {periodLabel(period)}</Text>
        </TouchableOpacity>
      )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  propertyBar: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  propertyChips: { gap: 6, paddingRight: 8 },
  propertyChip: {
    maxWidth: 200,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  propertyChipOn: { borderColor: `${COLORS.close}99`, backgroundColor: COLORS.closeSoft },
  propertyChipText: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted },
  propertyChipTextOn: { color: COLORS.text },
  propertyNameRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  propertyName: { flex: 1, fontSize: 13.5, fontWeight: '800', color: COLORS.text },
  manageBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginLeft: 'auto' },
  manageText: { fontSize: 12, fontWeight: '800', color: COLORS.primaryLight },
  duePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADII.pill,
    borderWidth: 1,
  },
  dueText: { fontSize: 10.5, fontWeight: '800' },
  content: { padding: 16, paddingBottom: 40 },
  column: { width: '100%', maxWidth: LAYOUT.READING_MAX, alignSelf: 'center' },
  header: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
  },
  periodRow: { flexDirection: 'row', alignItems: 'center' },
  periodBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  periodCenter: { flex: 1, alignItems: 'center' },
  periodLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '800', letterSpacing: 1.1 },
  periodValue: { fontSize: 19, color: COLORS.text, fontWeight: '800', letterSpacing: -0.3, marginTop: 1 },
  gaugeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  gaugePct: { fontSize: 20, fontWeight: '800', color: COLORS.text, letterSpacing: -0.5 },
  gaugeCaption: { fontSize: 9.5, fontWeight: '700', color: COLORS.textMuted, letterSpacing: 0.8, textTransform: 'uppercase' },
  gaugeStats: { flex: 1, marginLeft: 18 },
  statRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 },
  statValue: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.textSecondary },
  gaugeBarWrap: { flexDirection: 'row', marginTop: 6 },
  milestones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  milestone: { alignItems: 'center' },
  milestoneNum: { fontSize: 12, fontWeight: '800' },
  milestoneLabel: { fontSize: 9.5, color: COLORS.textMuted, fontWeight: '700', marginTop: 4, letterSpacing: 0.4 },
  nextCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${COLORS.close}66`,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.close,
    padding: 14,
    marginBottom: 14,
  },
  nextLabel: { fontSize: 10, fontWeight: '800', color: COLORS.close, letterSpacing: 0.9 },
  nextTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginTop: 4 },
  phaseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
    overflow: 'hidden',
  },
  phaseCardOpen: { borderColor: COLORS.borderLight },
  phaseCardActive: { borderColor: `${COLORS.close}88` },
  phaseRingPct: { fontSize: 9.5, fontWeight: '800' },
  phaseHeader: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  phaseHeaderText: { flex: 1, marginLeft: 12 },
  phaseTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  phaseMeta: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  phaseBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surfaceInput,
    paddingTop: 10,
  },
  gateBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${COLORS.gold}12`,
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
  },
  gateText: { fontSize: 12, color: COLORS.text, marginLeft: 6, flex: 1, lineHeight: 17 },
  lockedNote: { fontSize: 12, color: COLORS.warning, marginBottom: 8, lineHeight: 17 },
  taskCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    marginTop: 8,
  },
  taskCardDone: { borderColor: `${COLORS.success}70` },
  taskTop: { flexDirection: 'row', alignItems: 'flex-start' },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  checkboxDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  checkboxLocked: { borderColor: COLORS.border },
  taskTitleWrap: { flex: 1, marginRight: 6 },
  taskTitle: { fontSize: 13, fontWeight: '600', color: COLORS.text, lineHeight: 18 },
  taskTitleDone: { color: COLORS.textSecondary },
  taskMetaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 4 },
  ownerChip: { fontSize: 10, color: COLORS.info, marginRight: 8 },
  criticalChip: { fontSize: 9, fontWeight: '700', color: COLORS.danger, marginRight: 8 },
  signedText: { fontSize: 10, color: COLORS.success },
  taskBody: { marginTop: 8, paddingLeft: 32 },
  label: { fontSize: 10, fontWeight: '700', color: COLORS.textSecondary, letterSpacing: 0.5, marginTop: 8, marginBottom: 3 },
  body: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  performBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.close,
    borderRadius: RADII.pill,
    paddingVertical: 9,
    marginTop: 12,
  },
  performText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13, marginLeft: 6 },
  linkedScreen: { fontSize: 11, color: COLORS.textMuted, marginTop: 6, textAlign: 'center' },
  resetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8, padding: 10 },
  resetText: { fontSize: 12, color: COLORS.textSecondary, marginLeft: 6 },
});
