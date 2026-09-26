import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { CLOSE_PHASES, CLOSE_ROLES } from '../data/closePlaybookData';
import { getScreenEntry } from '../utils/screenIndex';
import { getCloseProgress, saveCloseProgress } from '../utils/storage';
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
              {entry.moduleShortCode} › {entry.screen.name}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

export default function CloseCockpit({ onOpenScreen }) {
  const [period, setPeriod] = useState(defaultClosePeriod());
  const [progress, setProgress] = useState({});
  const [expandedPhaseId, setExpandedPhaseId] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  useEffect(() => {
    getCloseProgress().then(setProgress);
  }, []);

  const done = useMemo(() => progress[period] || {}, [progress, period]);
  const statuses = useMemo(() => phaseStatuses(CLOSE_PHASES, done), [done]);
  const overall = useMemo(() => overallProgress(CLOSE_PHASES, done), [done]);
  const upNext = useMemo(() => nextTask(CLOSE_PHASES, done), [done]);
  const currentPhaseId = upNext ? upNext.phase.id : null;
  const openPhaseId = expandedPhaseId ?? currentPhaseId;

  const handleToggle = (taskId) => {
    const result = toggleTask(CLOSE_PHASES, done, taskId);
    if (!result.changed) return;
    triggerHaptic(result.done[taskId] ? 'success' : 'light');
    const updated = { ...progress, [period]: result.done };
    setProgress(updated);
    saveCloseProgress(updated);
  };

  const resetPeriod = () => {
    const updated = { ...progress };
    delete updated[period];
    setProgress(updated);
    saveCloseProgress(updated);
  };

  const perform = (task, phase) => {
    triggerHaptic('light');
    onOpenScreen(task.screenId, `PHASE ${phase.number} · ${task.title.toUpperCase()}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Period + overall progress */}
      <View style={styles.header}>
        <View style={styles.periodRow}>
          <TouchableOpacity onPress={() => setPeriod(shiftPeriod(period, -1))} style={styles.periodBtn}>
            <Ionicons name="chevron-back" size={18} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.periodCenter}>
            <Text style={styles.periodLabel}>Month-End Close</Text>
            <Text style={styles.periodValue}>{periodLabel(period)}</Text>
          </View>
          <TouchableOpacity onPress={() => setPeriod(shiftPeriod(period, 1))} style={styles.periodBtn}>
            <Ionicons name="chevron-forward" size={18} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${overall.pct}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {overall.completed} of {overall.total} tasks signed off · {overall.pct}%
        </Text>
      </View>

      {/* Next action */}
      {upNext ? (
        <View style={styles.nextCard}>
          <Text style={styles.nextLabel}>
            UP NEXT · PHASE {upNext.phase.number} ({upNext.phase.window})
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
        const icon = st.complete ? 'checkmark-circle' : st.locked ? 'lock-closed' : 'ellipse-outline';
        const color = st.complete ? COLORS.success : st.locked ? COLORS.textMuted : COLORS.gold;
        return (
          <View key={phase.id} style={[styles.phaseCard, isOpen && styles.phaseCardOpen]}>
            <TouchableOpacity
              style={styles.phaseHeader}
              onPress={() => setExpandedPhaseId(isOpen ? '' : phase.id)}
              activeOpacity={0.7}
            >
              <Ionicons name={icon} size={20} color={color} />
              <View style={styles.phaseHeaderText}>
                <Text style={styles.phaseTitle}>
                  Phase {phase.number}: {phase.title}
                </Text>
                <Text style={styles.phaseMeta}>
                  {phase.window} · {st.completed}/{st.total} signed off{st.locked ? ' · locked' : ''}
                </Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
  },
  periodRow: { flexDirection: 'row', alignItems: 'center' },
  periodBtn: { padding: 6 },
  periodCenter: { flex: 1, alignItems: 'center' },
  periodLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600', letterSpacing: 0.5 },
  periodValue: { fontSize: 18, color: COLORS.text, fontWeight: '700' },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.surfaceLight,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: COLORS.success },
  progressText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 6, textAlign: 'center' },
  nextCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${COLORS.gold}80`,
    padding: 14,
    marginBottom: 14,
  },
  nextLabel: { fontSize: 10, fontWeight: '700', color: COLORS.gold, letterSpacing: 0.5 },
  nextTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginTop: 4 },
  phaseCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
    overflow: 'hidden',
  },
  phaseCardOpen: { borderColor: COLORS.primaryLight },
  phaseHeader: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  phaseHeaderText: { flex: 1, marginLeft: 10 },
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
    backgroundColor: COLORS.primaryDark,
    borderRadius: 8,
    paddingVertical: 9,
    marginTop: 12,
  },
  performText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13, marginLeft: 6 },
  linkedScreen: { fontSize: 11, color: COLORS.textMuted, marginTop: 6, textAlign: 'center' },
  resetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8, padding: 10 },
  resetText: { fontSize: 12, color: COLORS.textSecondary, marginLeft: 6 },
});
