// Predict-then-reveal drill: a real RealPage screen is shown as a task; the learner picks the
// application, then the tab/section, then the list. Each step is revealed before the next, and the
// final reveal shows the real path, the rule that predicts it — or the exception that breaks it.
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { RADII } from '../../theme/layout';
import { triggerHaptic } from '../../utils/haptics';
import { getCompassProgress, saveCompassProgress } from '../../utils/storage';
import {
  buildDeck,
  grade,
  stageOptionsFor,
  indexTasksByObject,
  getException,
  getObject,
  STAGES,
} from '../../utils/compassEngine';
import { ALL_TASKS } from '../../data/tasksData';
import { SectionLabel } from '../ui';
import { RuleCard, ExceptionCard, PathCrumbs } from './RuleCard';

const DECK_SIZE = 10;
const APP_FILTERS = [
  { key: null, label: 'All apps' },
  { key: 'Accounts Payable', label: 'AP' },
  { key: 'Accounts Receivable', label: 'AR' },
  { key: 'General Ledger', label: 'GL' },
  { key: 'Cash Management', label: 'Cash' },
  { key: 'Company', label: 'Company' },
  { key: 'Reports', label: 'Reports' },
  { key: 'Job Cost & Reserves', label: 'Job Cost' },
  { key: 'Spend Management', label: 'Spend' },
  { key: 'Financial Close Management', label: 'FCM' },
];
const STEP_ORDER = ['app', 'stage', 'submenu'];
const TASKS_BY_OBJECT = indexTasksByObject(ALL_TASKS);

function missLabel(key) {
  if (key.startsWith('E')) {
    const e = getException(key);
    return e ? `${e.id} · ${e.title}` : key;
  }
  if (key.startsWith('A:')) {
    const o = getObject(key.slice(2));
    return o ? `Noun rule · ${o.label} → ${o.app}` : key;
  }
  if (key.startsWith('S:')) return `Stage rule · ${STAGES[key.slice(2)]?.label || key}`;
  return key;
}

function ChoiceButton({ label, hint, state, onPress, disabled }) {
  // state: null | 'picked-right' | 'picked-wrong' | 'answer'
  const color =
    state === 'picked-right' || state === 'answer' ? COLORS.success : state === 'picked-wrong' ? COLORS.danger : COLORS.borderLight;
  return (
    <TouchableOpacity
      style={[styles.choice, state && { borderColor: color, backgroundColor: `${color}18` }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: Boolean(state) }}
    >
      <Text style={styles.choiceText}>{label}</Text>
      {hint ? <Text style={styles.choiceHint}>{hint}</Text> : null}
      {state ? (
        <Ionicons
          name={state === 'picked-wrong' ? 'close-circle' : 'checkmark-circle'}
          size={16}
          color={color}
          style={styles.choiceIcon}
        />
      ) : null}
    </TouchableOpacity>
  );
}

export default function CompassDrill({ onOpenScreen, onOpenInExplorer, onOpenMastery }) {
  const [seed, setSeed] = useState(() => Date.now());
  const [appFilter, setAppFilter] = useState(null);
  const [trapsOnly, setTrapsOnly] = useState(false);
  const deck = useMemo(
    () => buildDeck({ seed, size: DECK_SIZE, app: appFilter, trapShare: trapsOnly ? 0.9 : 0.3 }),
    [seed, appFilter, trapsOnly]
  );
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState({});
  const [session, setSession] = useState({ answered: 0, correct: 0 });
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    let alive = true;
    getCompassProgress().then((p) => alive && setProgress(p));
    return () => {
      alive = false;
    };
  }, []);

  const q = deck[index];
  const step = STEP_ORDER.find((k) => picks[k] == null) || 'reveal';
  const result = useMemo(() => (q && step === 'reveal' ? grade(q, picks) : null), [q, step, picks]);

  const newDeck = useCallback((patch = {}) => {
    if ('app' in patch) setAppFilter(patch.app);
    if ('traps' in patch) setTrapsOnly(patch.traps);
    setSeed(Date.now());
    setIndex(0);
    setPicks({});
  }, []);

  const pick = (key, value) => {
    if (!q || picks[key] != null) return;
    triggerHaptic(value === q.answer[key] ? 'success' : 'light');
    const next = { ...picks, [key]: value };
    setPicks(next);
    if (key === 'submenu') {
      const g = grade(q, next);
      setSession((s) => ({ answered: s.answered + 1, correct: s.correct + (g.all ? 1 : 0) }));
      setProgress((p) => {
        if (!p) return p;
        const missKey = g.all ? null : q.screen.exc || q.prediction.rules.find((r) => r.startsWith('A:') || r.startsWith('S:'));
        const updated = {
          answered: p.answered + 1,
          correct: p.correct + (g.all ? 1 : 0),
          steps: {
            app: p.steps.app + (g.app ? 1 : 0),
            stage: p.steps.stage + (g.stage ? 1 : 0),
            submenu: p.steps.submenu + (g.submenu ? 1 : 0),
          },
          misses: missKey ? { ...p.misses, [missKey]: (p.misses[missKey] || 0) + 1 } : p.misses,
        };
        saveCompassProgress(updated);
        return updated;
      });
    }
  };

  const next = () => {
    setPicks({});
    setIndex((i) => i + 1);
  };

  const stateFor = (key, value) => {
    if (picks[key] == null) return null;
    if (value === picks[key]) return value === q.answer[key] ? 'picked-right' : 'picked-wrong';
    return value === q.answer[key] ? 'answer' : null;
  };

  const weakSpots = progress
    ? Object.entries(progress.misses)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
    : [];
  const relatedTask = q ? (TASKS_BY_OBJECT.get(q.screen.object) || [])[0] : null;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {APP_FILTERS.map((f) => (
          <TouchableOpacity
            key={f.label}
            style={[styles.filterChip, appFilter === f.key && styles.filterChipOn]}
            onPress={() => newDeck({ app: f.key })}
          >
            <Text style={[styles.filterText, appFilter === f.key && styles.filterTextOn]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.filterChip, trapsOnly && styles.trapChipOn]} onPress={() => newDeck({ traps: !trapsOnly })}>
          <Ionicons name="warning-outline" size={12} color={trapsOnly ? COLORS.warning : COLORS.textMuted} />
          <Text style={[styles.filterText, trapsOnly && { color: COLORS.warning }]}> Exceptions</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.scoreRow}>
        <Text style={styles.scoreText}>
          Card {Math.min(index + 1, deck.length)}/{deck.length} · Session {session.correct}/{session.answered}
        </Text>
        {progress && progress.answered ? (
          <Text style={styles.scoreText}>
            All-time {Math.round((progress.correct / progress.answered) * 100)}% of {progress.answered}
          </Text>
        ) : null}
      </View>

      {!q ? (
        <View style={styles.card}>
          <SectionLabel icon="flag-outline">Deck complete</SectionLabel>
          <Text style={styles.prompt}>
            {session.correct} of {session.answered} fully correct.
          </Text>
          {weakSpots.length ? (
            <>
              <Text style={styles.subhead}>Your weak spots</Text>
              {weakSpots.map(([k, n]) => (
                <Text key={k} style={styles.weak}>
                  {n}× {missLabel(k)}
                </Text>
              ))}
            </>
          ) : null}
          <TouchableOpacity style={styles.primaryBtn} onPress={() => newDeck()}>
            <Text style={styles.primaryBtnText}>New deck</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.card}>
          <SectionLabel icon="clipboard-outline">Task</SectionLabel>
          <Text style={styles.prompt}>{q.prompt}</Text>

          <Text style={styles.stepTitle}>1 · Which application?</Text>
          <View style={styles.choices}>
            {q.choices.apps.map((a) => (
              <ChoiceButton key={a} label={a} state={stateFor('app', a)} disabled={picks.app != null} onPress={() => pick('app', a)} />
            ))}
          </View>

          {picks.app != null ? (
            <>
              <Text style={styles.stepTitle}>2 · Which tab or section? (in {q.answer.app})</Text>
              <View style={styles.choices}>
                {stageOptionsFor(q.answer.app).map((o) => (
                  <ChoiceButton
                    key={o.key}
                    label={o.label}
                    hint={o.hint}
                    state={stateFor('stage', o.key)}
                    disabled={picks.stage != null}
                    onPress={() => pick('stage', o.key)}
                  />
                ))}
              </View>
            </>
          ) : null}

          {picks.stage != null ? (
            <>
              <Text style={styles.stepTitle}>3 · Which list or submenu?</Text>
              <View style={styles.choices}>
                {q.choices.submenus.map((s) => (
                  <ChoiceButton
                    key={s}
                    label={s}
                    state={stateFor('submenu', s)}
                    disabled={picks.submenu != null}
                    onPress={() => pick('submenu', s)}
                  />
                ))}
              </View>
            </>
          ) : null}

          {result ? (
            <View style={styles.reveal}>
              <SectionLabel icon="navigate-outline" color={COLORS.info}>
                Real path
              </SectionLabel>
              <PathCrumbs parts={result.explanation.realPath} />
              <Text style={styles.screenName}>{q.screen.name}</Text>
              <View style={styles.tally}>
                {STEP_ORDER.map((k, i) => (
                  <View key={k} style={styles.tallyItem}>
                    <Ionicons name={result[k] ? 'checkmark-circle' : 'close-circle'} size={14} color={result[k] ? COLORS.success : COLORS.danger} />
                    <Text style={styles.tallyText}>Step {i + 1}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.verdict}>{result.explanation.verdict}</Text>
              {result.explanation.exception ? <ExceptionCard exception={result.explanation.exception} /> : null}
              {!result.explanation.rulesRight ? (
                <Text style={styles.rulesSaid}>The rules alone would say: {result.explanation.rulesPredicted || '—'}</Text>
              ) : null}
              <SectionLabel icon="git-branch-outline" style={styles.rulesLabel}>
                Rules that fired
              </SectionLabel>
              {result.explanation.rules.map((r) => (
                <RuleCard key={r.id} rule={r} highlight={!result.all && result.explanation.rulesRight} />
              ))}
              <View style={styles.actions}>
                <TouchableOpacity style={styles.secondaryBtn} onPress={() => onOpenScreen && onOpenScreen(q.screen.id, 'Deduction Compass')}>
                  <Ionicons name="list-outline" size={14} color={COLORS.text} />
                  <Text style={styles.secondaryBtnText}>Screen SOP</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => onOpenInExplorer && onOpenInExplorer(q.screen.entry.moduleId, q.screen.id)}
                >
                  <Ionicons name="desktop-outline" size={14} color={COLORS.text} />
                  <Text style={styles.secondaryBtnText}>In Explorer</Text>
                </TouchableOpacity>
                {relatedTask ? (
                  <TouchableOpacity style={styles.secondaryBtn} onPress={() => onOpenMastery && onOpenMastery(relatedTask)}>
                    <Ionicons name="school-outline" size={14} color={COLORS.text} />
                    <Text style={styles.secondaryBtnText} numberOfLines={1}>
                      Mastery: {relatedTask.name}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
              <TouchableOpacity style={styles.primaryBtn} onPress={next}>
                <Text style={styles.primaryBtnText}>{index + 1 < deck.length ? 'Next task' : 'Finish deck'}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },
  filters: { gap: 6, paddingBottom: 10 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  filterChipOn: { borderColor: `${COLORS.info}88`, backgroundColor: COLORS.infoSoft },
  trapChipOn: { borderColor: `${COLORS.warning}88`, backgroundColor: COLORS.warningSoft },
  filterText: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted },
  filterTextOn: { color: COLORS.text },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  scoreText: { fontSize: 11.5, color: COLORS.textMuted, fontWeight: '600' },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },
  prompt: { fontSize: 18, lineHeight: 25, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  stepTitle: { fontSize: 12.5, fontWeight: '800', color: COLORS.textSecondary, marginTop: 14, marginBottom: 8 },
  choices: { gap: 8 },
  choice: {
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingRight: 32,
  },
  choiceText: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  choiceHint: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  choiceIcon: { position: 'absolute', right: 10, top: 11 },
  reveal: { marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: COLORS.border },
  screenName: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  tally: { flexDirection: 'row', gap: 14, marginTop: 10 },
  tallyItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tallyText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  verdict: { fontSize: 13, lineHeight: 19, color: COLORS.text, marginTop: 10, marginBottom: 10 },
  rulesSaid: { fontSize: 12, color: COLORS.textMuted, marginBottom: 10 },
  rulesLabel: { marginTop: 4 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '100%',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.surfaceLight,
  },
  secondaryBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.text, flexShrink: 1 },
  primaryBtn: {
    marginTop: 14,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: RADII.md,
    backgroundColor: COLORS.warning,
  },
  primaryBtnText: { fontSize: 14, fontWeight: '800', color: COLORS.textInverse },
  subhead: { fontSize: 12.5, fontWeight: '800', color: COLORS.textSecondary, marginTop: 10, marginBottom: 4 },
  weak: { fontSize: 12.5, color: COLORS.text, marginTop: 4 },
});
