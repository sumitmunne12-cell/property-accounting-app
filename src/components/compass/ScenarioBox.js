// Scenario box: type a situation in plain words; the deterministic matcher (synonyms → business
// object → tie-breakers → stage verb → record state) walks steps 1-2-3 and lands on real screens.
import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { RADII } from '../../theme/layout';
import useDebouncedValue from '../../utils/useDebouncedValue';
import { matchScenario, indexTasksByObject, SCENARIO_EXAMPLES, formatPath } from '../../utils/compassEngine';
import { SCREEN_COUNT } from '../../utils/screenIndex';
import { ALL_TASKS } from '../../data/tasksData';
import { SectionLabel } from '../ui';
import { RuleCard, ExceptionCard } from './RuleCard';

const TASKS_BY_OBJECT = indexTasksByObject(ALL_TASKS);
const STEP_COLORS = [COLORS.info, COLORS.close, COLORS.success];

export default function ScenarioBox({ onOpenScreen, onSearchAll, onOpenMastery }) {
  const [text, setText] = useState('');
  const debounced = useDebouncedValue(text, 300);
  const result = useMemo(() => matchScenario(debounced), [debounced]);
  const tasks = result && result.prediction.object ? TASKS_BY_OBJECT.get(result.prediction.object) || [] : [];

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.inputBox}>
        <Ionicons name="chatbox-ellipses-outline" size={16} color={COLORS.textMuted} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="e.g. site entered the wrong invoice date and the batch is already posted"
          placeholderTextColor={COLORS.textMuted}
          multiline
          autoCorrect={false}
          accessibilityLabel="Describe the situation"
        />
        {text ? (
          <TouchableOpacity onPress={() => setText('')} accessibilityLabel="Clear">
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {!result ? (
        <View>
          <SectionLabel icon="sparkles-outline" style={styles.examplesLabel}>
            Try a situation
          </SectionLabel>
          <View style={styles.examples}>
            {SCENARIO_EXAMPLES.map((ex) => (
              <TouchableOpacity key={ex} style={styles.example} onPress={() => setText(ex)}>
                <Text style={styles.exampleText}>{ex}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View>
          {result.normalized !== result.input ? (
            <Text style={styles.readAs}>Read as: “{result.normalized}”</Text>
          ) : null}

          {result.steps.map((s, i) => (
            <View key={s.n} style={[styles.stepCard, { borderLeftColor: STEP_COLORS[i] }]}>
              <Text style={styles.stepQ}>
                Step {s.n} · {s.question}
              </Text>
              <Text style={styles.stepA}>{s.answer}</Text>
              {s.detail ? <Text style={styles.stepDetail}>{s.detail}</Text> : null}
              {s.rules.map((r) => (
                <RuleCard key={r.id} rule={r} />
              ))}
            </View>
          ))}

          {result.prediction.app ? (
            <Text style={styles.landing}>Lands on: Applications › {formatPath(result.prediction)}</Text>
          ) : null}

          {result.alternates.length ? (
            <View style={styles.block}>
              <SectionLabel icon="git-compare-outline">Also consider</SectionLabel>
              {result.alternates.map((a) => (
                <Text key={a.object} style={styles.alt}>
                  {a.label}: {formatPath(a)}
                </Text>
              ))}
            </View>
          ) : null}

          {result.exceptions.length ? (
            <View style={styles.block}>
              <SectionLabel icon="warning-outline" color={COLORS.warning}>
                Exceptions that apply
              </SectionLabel>
              {result.exceptions.map((e) => (
                <ExceptionCard key={e.id} exception={e} compact={result.exceptions.length > 2} />
              ))}
            </View>
          ) : null}

          <View style={styles.block}>
            <SectionLabel icon="desktop-outline">Candidate screens</SectionLabel>
            {result.candidates.length ? (
              result.candidates.map((c) => (
                <TouchableOpacity key={c.id} style={styles.candidate} onPress={() => onOpenScreen && onOpenScreen(c.id, 'Deduction Compass')}>
                  <View style={styles.flex}>
                    <Text style={styles.candName}>{c.name}</Text>
                    <Text style={styles.candPath} numberOfLines={2}>
                      {formatPath(c)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.empty}>No screen matches these words on that path. Name the record and the action (e.g. “void check”).</Text>
            )}
            {tasks.length && onOpenMastery ? (
              <TouchableOpacity style={styles.linkRow} onPress={() => onOpenMastery(tasks[0])}>
                <Ionicons name="school-outline" size={14} color={COLORS.primaryLight} />
                <Text style={styles.linkText}>Daily Hub mastery: {tasks[0].name}</Text>
              </TouchableOpacity>
            ) : null}
            {onSearchAll ? (
              <TouchableOpacity style={styles.linkRow} onPress={() => onSearchAll(result.input)}>
                <Ionicons name="search-outline" size={14} color={COLORS.primaryLight} />
                <Text style={styles.linkText}>Search all {SCREEN_COUNT.toLocaleString()} screens in Triage & Search</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.surfaceInput,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputIcon: { marginTop: 2 },
  input: { flex: 1, minHeight: 44, fontSize: 14, lineHeight: 20, color: COLORS.text, padding: 0 },
  examplesLabel: { marginTop: 16 },
  examples: { gap: 8 },
  example: {
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  exampleText: { fontSize: 13, color: COLORS.textSecondary },
  readAs: { fontSize: 11.5, color: COLORS.textMuted, fontStyle: 'italic', marginTop: 10 },
  stepCard: {
    marginTop: 12,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 3,
    backgroundColor: COLORS.surface,
    padding: 12,
  },
  stepQ: { fontSize: 11, fontWeight: '800', letterSpacing: 0.6, color: COLORS.textMuted, textTransform: 'uppercase' },
  stepA: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginTop: 4 },
  stepDetail: { fontSize: 12.5, lineHeight: 18, color: COLORS.textSecondary, marginTop: 4, marginBottom: 6 },
  landing: { fontSize: 12.5, fontWeight: '700', color: COLORS.info, marginTop: 12 },
  block: { marginTop: 16 },
  alt: { fontSize: 12.5, color: COLORS.text, marginBottom: 4 },
  candidate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 10,
    marginBottom: 8,
  },
  candName: { fontSize: 13.5, fontWeight: '700', color: COLORS.text },
  candPath: { fontSize: 11.5, color: COLORS.textMuted, marginTop: 2 },
  empty: { fontSize: 12.5, color: COLORS.textMuted },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  linkText: { flex: 1, fontSize: 12.5, fontWeight: '700', color: COLORS.primaryLight },
});
