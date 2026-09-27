// Study mode: flashcards built from the audit & interview traps of the chosen scope (all Topics,
// real-estate Topics, core property standards, bookmarked Topics or one Topic). Spaced repetition
// (utils/studyEngine) decides what is due; progress persists on the device (utils/useStudy).
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { LAYOUT, RADII } from '../../theme/layout';
import { ASC_TOPICS, getAscEntry } from '../../utils/ascIndex';
import { loadSeries, getLoadedCard } from '../../data/asc/ascLoader';
import { buildDeck, progressFor, trapId, todayIso, MASTERED_BOX, MAX_BOX, INTERVALS } from '../../utils/studyEngine';
import useStudy from '../../utils/useStudy';
import { triggerHaptic } from '../../utils/haptics';
import { GaugeBar, ModuleLoading, BackButton, SwipeBackView } from '../ui';
import { TopicBadge } from './AscCardView';

const SESSION_SIZE = 20;

// When "Got it" schedules the card next (mirrors studyEngine.grade).
function nextReview(rec) {
  const days = INTERVALS[Math.min(MAX_BOX, Math.max(1, (rec ? rec.box : 0) + 1))];
  return days === 1 ? 'tomorrow' : `in ${days} days`;
}

const SCOPES = [
  { key: 'all', label: 'All US GAAP' },
  { key: 're', label: 'Real Estate' },
  { key: 'core', label: 'Core RE' },
  { key: 'saved', label: '★ Saved' },
];

function scopeTopics(scope, bookmarks) {
  if (scope.topic) return [scope.topic];
  if (scope.key === 'core') return ASC_TOPICS.filter((e) => e.re === 'core').map((e) => e.topic);
  if (scope.key === 're') return ASC_TOPICS.filter((e) => e.re).map((e) => e.topic);
  if (scope.key === 'saved') return bookmarks.filter((t) => getAscEntry(t));
  return ASC_TOPICS.map((e) => e.topic);
}

/** Loads the series files for a set of Topics and returns their traps as flashcards. */
function useTrapItems(topics) {
  const key = topics.join(',');
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let alive = true;
    const list = key ? key.split(',') : [];
    const series = Array.from(new Set(list.map((t) => getAscEntry(t).series)));
    setItems(null);
    setError(null);
    Promise.all(series.map(loadSeries))
      .then(() => {
        if (!alive) return;
        const out = [];
        for (const t of list) {
          const card = getLoadedCard(t);
          if (!card) continue;
          for (const trap of card.auditTraps) {
            out.push({ id: trapId(t, trap.q), topic: t, title: card.title, q: trap.q, a: trap.a });
          }
        }
        setItems(out);
      })
      .catch((e) => alive && setError(e));
    return () => {
      alive = false;
    };
  }, [key, attempt]);
  return { items, error, retry: () => setAttempt((n) => n + 1) };
}

export default function StudySession({ initialTopic = null, onClose, onOpenTopic }) {
  const { study, ready, grade, toggleBookmark } = useStudy();
  const [scope, setScope] = useState(initialTopic ? { key: 'topic', topic: initialTopic } : { key: 'all' });
  const [deck, setDeck] = useState(null); // active session cards
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState({ got: 0, again: 0 });

  const topics = useMemo(() => scopeTopics(scope, study.bookmarks), [scope, study.bookmarks]);
  const { items, error, retry } = useTrapItems(topics);
  const today = todayIso();
  const stats = useMemo(() => (items ? progressFor(study, items.map((i) => i.id), today) : null), [items, study, today]);
  const nextDue = useMemo(() => {
    if (!items) return null;
    const dues = items.map((i) => study.cards[i.id]).filter(Boolean).map((r) => r.due).sort();
    return dues.find((d) => d > today) || null;
  }, [items, study, today]);

  const start = () => {
    triggerHaptic('light');
    setDeck(buildDeck(items, study, { today, limit: SESSION_SIZE }));
    setIndex(0);
    setRevealed(false);
    setResults({ got: 0, again: 0 });
  };

  const answer = (knewIt) => {
    triggerHaptic(knewIt ? 'success' : 'light');
    grade(deck[index].id, knewIt);
    setResults((r) => ({ got: r.got + (knewIt ? 1 : 0), again: r.again + (knewIt ? 0 : 1) }));
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  const handleBack = deck ? () => setDeck(null) : onClose;
  const backLabel = deck ? 'Overview' : 'Exit';

  const header = (
    <View style={styles.header}>
      <BackButton
        label={backLabel}
        onPress={handleBack}
        style={styles.backBtn}
        accessibilityLabel={deck ? 'Back to study overview' : 'Exit study mode'}
      />
      <Ionicons name="school" size={17} color={COLORS.gold} />
      <Text style={styles.headerTitle}>Study mode</Text>
      {deck && index < deck.length ? (
        <Text style={styles.headerMeta}>
          {index + 1} / {deck.length}
        </Text>
      ) : null}
    </View>
  );

  // ── Active session ──
  if (deck && index < deck.length) {
    const item = deck[index];
    const entry = getAscEntry(item.topic);
    const rec = study.cards[item.id];
    return (
      <SwipeBackView enabled={Boolean(handleBack)} onBack={handleBack} style={styles.flex}>
        {header}
        <View style={styles.progressWrap}>
          <GaugeBar pct={(index / deck.length) * 100} color={COLORS.gold} height={4} />
        </View>
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.reading}>
            <TouchableOpacity style={styles.cardTop} onPress={() => onOpenTopic && onOpenTopic(item.topic)} disabled={!onOpenTopic}>
              <TopicBadge entry={entry} />
              <View style={styles.flexPad}>
                <Text style={styles.cardTopic}>{entry.title}</Text>
                <Text style={styles.cardBox}>
                  {rec ? `Box ${rec.box} · reviewed ${rec.seen}×` : 'New card'}
                  {study.bookmarks.includes(item.topic) ? '  ★' : ''}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.qBox}>
              <Text style={styles.qLabel}>QUESTION</Text>
              <Text style={styles.qText}>{item.q}</Text>
            </View>
            {revealed ? (
              <View style={styles.aBox}>
                <Text style={styles.aLabel}>ANSWER</Text>
                <Text selectable style={styles.aText}>
                  {item.a}
                </Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.revealBtn} onPress={() => setRevealed(true)} activeOpacity={0.85}>
                <Ionicons name="eye-outline" size={17} color={COLORS.text} />
                <Text style={styles.revealText}>Show answer</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
        {revealed ? (
          <View style={styles.answerBar}>
            <TouchableOpacity style={[styles.answerBtn, styles.againBtn]} onPress={() => answer(false)} accessibilityLabel="Review again">
              <Ionicons name="refresh" size={17} color={COLORS.danger} />
              <Text style={[styles.answerText, { color: COLORS.danger }]}>Review again</Text>
              <Text style={styles.answerHint}>tomorrow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.answerBtn, styles.gotBtn]} onPress={() => answer(true)} accessibilityLabel="Got it">
              <Ionicons name="checkmark-circle" size={17} color={COLORS.success} />
              <Text style={[styles.answerText, { color: COLORS.success }]}>Got it</Text>
              <Text style={styles.answerHint}>{nextReview(rec)}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </SwipeBackView>
    );
  }

  // ── Session summary ──
  if (deck) {
    return (
      <SwipeBackView enabled={Boolean(handleBack)} onBack={handleBack} style={styles.flex}>
        {header}
        <ScrollView contentContainerStyle={styles.body}>
          <View style={styles.reading}>
            <Text style={styles.summaryIcon}>🎯</Text>
            <Text style={styles.summaryTitle}>Session complete</Text>
            <Text style={styles.summaryText}>
              {results.got} got it · {results.again} to review again tomorrow
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => setDeck(null)}>
              <Text style={styles.primaryText}>Back to study overview</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SwipeBackView>
    );
  }

  // ── Overview / scope picker ──
  const scopeLabel = scope.topic ? `ASC ${scope.topic} · ${getAscEntry(scope.topic).title}` : SCOPES.find((s) => s.key === scope.key).label;
  const available = stats ? stats.due + stats.fresh : 0;
  return (
    <SwipeBackView enabled={Boolean(handleBack)} onBack={handleBack} style={styles.flex}>
      {header}
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.reading}>
          <Text style={styles.intro}>
            Flashcards from the audit and interview traps on every card. “Got it” spaces the next review out (1 → 3 → 7 → 14 → 30 days); “Review
            again” brings it back tomorrow. Cards reaching box {MASTERED_BOX} count as mastered.
          </Text>
          <View style={styles.scopeRow}>
            {scope.topic ? (
              <View style={[styles.scopeChip, styles.scopeChipOn]}>
                <Text style={[styles.scopeText, styles.scopeTextOn]}>ASC {scope.topic}</Text>
              </View>
            ) : null}
            {SCOPES.map((s) => {
              const on = !scope.topic && scope.key === s.key;
              return (
                <TouchableOpacity key={s.key} style={[styles.scopeChip, on && styles.scopeChipOn]} onPress={() => setScope({ key: s.key })}>
                  <Text style={[styles.scopeText, on && styles.scopeTextOn]}>
                    {s.label}
                    {s.key === 'saved' ? ` ${study.bookmarks.length}` : ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {!items || !ready ? (
            <ModuleLoading label="flashcards" error={error} onRetry={retry} color={COLORS.gold} />
          ) : !items.length ? (
            <Text style={styles.empty}>
              {scope.key === 'saved' ? 'No saved Topics yet — tap the ☆ on any card to save it for study.' : 'No cards in this scope.'}
            </Text>
          ) : (
            <>
              <Text style={styles.scopeTitle}>{scopeLabel}</Text>
              <View style={styles.statRow}>
                <Stat label="Due today" value={stats.due} color={COLORS.warning} />
                <Stat label="New" value={stats.fresh} color={COLORS.info} />
                <Stat label="Mastered" value={`${stats.mastered}/${stats.total}`} color={COLORS.success} />
              </View>
              <GaugeBar pct={stats.total ? (stats.mastered / stats.total) * 100 : 0} color={COLORS.success} />
              {stats.seen ? (
                <Text style={styles.caption}>
                  {stats.seen} of {stats.total} studied{nextDue ? ` · next scheduled review ${nextDue}` : ''}
                </Text>
              ) : null}
              {available ? (
                <TouchableOpacity style={styles.primaryBtn} onPress={start} activeOpacity={0.85}>
                  <Ionicons name="play" size={16} color={COLORS.textInverse} />
                  <Text style={styles.primaryText}>Start — {Math.min(SESSION_SIZE, available)} cards</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.empty}>All caught up for this scope{nextDue ? ` — next review on ${nextDue}` : ''}.</Text>
              )}
              {scope.topic ? (
                <TouchableOpacity style={styles.linkBtn} onPress={() => toggleBookmark(scope.topic)}>
                  <Text style={styles.linkText}>{study.bookmarks.includes(scope.topic) ? '★ Saved for study' : '☆ Save this Topic for study'}</Text>
                </TouchableOpacity>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>
    </SwipeBackView>
  );
}

function Stat({ label, value, color }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  flexPad: { flex: 1, marginLeft: 11 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    marginRight: 10,
  },
  headerTitle: { flex: 1, fontSize: 15, fontWeight: '800', color: COLORS.text, marginLeft: 7 },
  headerMeta: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  progressWrap: { flexDirection: 'row', paddingHorizontal: 14, paddingTop: 8 },
  body: { padding: 16, paddingBottom: 40 },
  reading: { width: '100%', maxWidth: LAYOUT.READING_MAX, alignSelf: 'center' },
  intro: { fontSize: 12.5, lineHeight: 19, color: COLORS.textSecondary, marginBottom: 14 },
  scopeRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14 },
  scopeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceLight,
    marginRight: 7,
    marginBottom: 7,
  },
  scopeChipOn: { borderColor: `${COLORS.gold}99`, backgroundColor: `${COLORS.gold}22` },
  scopeText: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  scopeTextOn: { color: COLORS.text },
  scopeTitle: { fontSize: 15, fontWeight: '800', color: COLORS.text, marginBottom: 10 },
  statRow: { flexDirection: 'row', marginBottom: 12 },
  stat: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    marginRight: 8,
  },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 9.5, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 0.8, marginTop: 2 },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.gold,
    marginTop: 18,
  },
  primaryText: { fontSize: 14, fontWeight: '800', color: COLORS.textInverse, marginLeft: 7 },
  linkBtn: { alignSelf: 'center', paddingVertical: 12 },
  linkText: { fontSize: 13, fontWeight: '700', color: COLORS.gold },
  caption: { fontSize: 11.5, color: COLORS.textMuted, marginTop: 8 },
  empty: { fontSize: 13, color: COLORS.textMuted, lineHeight: 19, marginTop: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  cardTopic: { fontSize: 14, fontWeight: '800', color: COLORS.text },
  cardBox: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  qBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  qLabel: { fontSize: 10, fontWeight: '800', color: COLORS.danger, letterSpacing: 1, marginBottom: 6 },
  qText: { fontSize: 16.5, lineHeight: 25, fontWeight: '700', color: COLORS.text },
  revealBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    marginTop: 14,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.surfaceLight,
  },
  revealText: { fontSize: 14, fontWeight: '800', color: COLORS.text, marginLeft: 7 },
  aBox: {
    marginTop: 12,
    backgroundColor: COLORS.successSoft,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: `${COLORS.success}40`,
    padding: 16,
  },
  aLabel: { fontSize: 10, fontWeight: '800', color: COLORS.success, letterSpacing: 1, marginBottom: 6 },
  aText: { fontSize: 14.5, lineHeight: 22, color: COLORS.text },
  answerBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  answerBtn: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADII.lg,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  againBtn: { borderColor: `${COLORS.danger}66`, backgroundColor: COLORS.dangerSoft },
  gotBtn: { borderColor: `${COLORS.success}66`, backgroundColor: COLORS.successSoft },
  answerText: { fontSize: 14, fontWeight: '800', marginTop: 2 },
  answerHint: { fontSize: 10.5, color: COLORS.textMuted, marginTop: 1 },
  summaryIcon: { fontSize: 38, textAlign: 'center', marginTop: 20 },
  summaryTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginTop: 8 },
  summaryText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 6 },
});
