// Executive card viewer for one ASC Topic, shared by the GAAP Codex tab and the
// "📖 First-Principles GAAP" pop-up on catalog screens. Four tabs:
//   1 First Principle & Analogy · 2 Mechanics & DR/CR · 3 Audit Defense · 4 Official Codification Text
// The header renders from the index at once; the card loads its FASB series file on demand and the
// official text loads only when tab 4 is opened.
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { MONO, RADII, LAYOUT } from '../../theme/layout';
import { useAscCard } from '../../utils/useAscData';
import { JournalTable } from '../Ledger';
import { SectionLabel, ModuleLoading } from '../ui';
import OfficialTextReader from './OfficialTextReader';
import useStudy from '../../utils/useStudy';
import { isMastered, trapId } from '../../utils/studyEngine';

export const CARD_TABS = [
  { key: 'principle', num: '1', label: 'First Principle & Analogy', short: 'Principle', icon: 'bulb-outline' },
  { key: 'mechanics', num: '2', label: 'Mechanics & DR/CR', short: 'DR/CR', icon: 'swap-horizontal-outline' },
  { key: 'audit', num: '3', label: 'Audit Defense', short: 'Audit', icon: 'shield-checkmark-outline' },
  { key: 'text', num: '4', label: 'Official Codification Text', short: 'Official Text', icon: 'document-text-outline' },
];

const totalsOf = (entry) =>
  entry.lines.reduce((acc, l) => ({ debit: acc.debit + (l.debit || 0), credit: acc.credit + (l.credit || 0) }), { debit: 0, credit: 0 });

const RE_LABEL = { core: 'CORE REAL ESTATE', support: 'REAL ESTATE RELEVANT' };

export function TopicBadge({ entry, size = 'md' }) {
  const big = size === 'lg';
  return (
    <View style={[styles.badge, big && styles.badgeLg, { borderColor: `${entry.color}88`, backgroundColor: `${entry.color}1F` }]}>
      <Text style={[styles.badgeAsc, { color: entry.color }]}>ASC</Text>
      <Text style={[styles.badgeNum, big && styles.badgeNumLg, { color: entry.color }]}>{entry.topic}</Text>
    </View>
  );
}

function Bullets({ items, color }) {
  return items.map((t, i) => (
    <View key={i} style={styles.bulletRow}>
      <View style={[styles.bulletDot, { backgroundColor: color }]} />
      <Text style={styles.bulletText}>{t}</Text>
    </View>
  ));
}

function ParagraphLink({ id, label, excerpt, color, onPress }) {
  return (
    <TouchableOpacity style={styles.paraLink} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.paraLinkHead}>
        <Text style={[styles.paraLinkId, { color }]}>{id}</Text>
        {label ? (
          <Text style={styles.paraLinkLabel} numberOfLines={1}>
            {label}
          </Text>
        ) : null}
        <Ionicons name="open-outline" size={13} color={COLORS.textMuted} />
      </View>
      {excerpt ? <Text style={styles.paraLinkExcerpt}>{excerpt}</Text> : null}
    </TouchableOpacity>
  );
}

function PrincipleTab({ card }) {
  return (
    <>
      <SectionLabel icon="bulb-outline" color={card.color}>First-principles economic truth</SectionLabel>
      <View style={[styles.truthBox, { borderLeftColor: card.color }]}>
        <Text style={styles.truthText}>{card.truth}</Text>
      </View>

      <SectionLabel icon="sparkles-outline" color={COLORS.gold} style={styles.gap}>
        The everyday analogy
      </SectionLabel>
      <View style={styles.analogyBox}>
        <Text style={styles.analogyTitle}>“{card.analogy.title}”</Text>
        <Text style={styles.analogyStory}>{card.analogy.story}</Text>
      </View>

      {card.propertyLens ? (
        <>
          <SectionLabel icon="business-outline" color={COLORS.success} style={styles.gap}>
            Where it hits the property ledger
          </SectionLabel>
          <View style={styles.lensBox}>
            <Text style={styles.lensText}>{card.propertyLens}</Text>
          </View>
        </>
      ) : null}

      <SectionLabel icon="analytics-outline" style={styles.gap}>
        At a glance
      </SectionLabel>
      <View style={styles.glanceRow}>
        <Glance label="Measurement basis" value={card.measurement.basis} wide />
      </View>
      <View style={styles.glanceRow}>
        <Glance
          label="Subtopics in source"
          value={`${card.stats.subtopics}${card.missingSubtopics && card.missingSubtopics.length ? ` · ${card.missingSubtopics.length} missing` : ''}`}
        />
        <Glance label="Paragraphs" value={card.stats.paragraphs.toLocaleString()} />
        <Glance label="Glossary terms" value={card.stats.glossaryTerms.toLocaleString()} last />
      </View>
      {card.glossary.length ? (
        <Text style={styles.glossaryLine} numberOfLines={3}>
          <Text style={styles.glossaryLead}>Defined terms: </Text>
          {card.glossary.slice(0, 18).join(' · ')}
          {card.glossary.length > 18 ? ` · +${card.glossary.length - 18} more` : ''}
        </Text>
      ) : null}
    </>
  );
}

function Glance({ label, value, wide, last }) {
  return (
    <View style={[styles.glance, (wide || last) && styles.glanceLast]}>
      <Text style={styles.glanceLabel}>{label.toUpperCase()}</Text>
      <Text style={styles.glanceValue}>{value}</Text>
    </View>
  );
}

function MechanicsTab({ card, openParagraph }) {
  return (
    <>
      <SectionLabel icon="flag-outline" color={card.color}>Recognition triggers — when you book it</SectionLabel>
      <Bullets items={card.recognition} color={card.color} />

      <SectionLabel icon="calculator-outline" color={COLORS.warning} style={styles.gap}>
        Measurement — how you value it
      </SectionLabel>
      <View style={styles.measureBox}>
        <View style={styles.basisPill}>
          <Text style={styles.basisText}>{card.measurement.basis}</Text>
        </View>
        <Text style={styles.measureLabel}>INITIAL</Text>
        <Text style={styles.measureText}>{card.measurement.initial}</Text>
        <Text style={styles.measureLabel}>SUBSEQUENT</Text>
        <Text style={styles.measureText}>{card.measurement.subsequent}</Text>
      </View>

      <SectionLabel icon="swap-horizontal-outline" color={COLORS.success} style={styles.gap}>
        Journal entry mechanics
      </SectionLabel>
      {card.journalEntries.map((je, i) => (
        <View key={i} style={styles.jeBox}>
          <Text style={styles.jeTitle}>{je.label}</Text>
          <Text style={styles.jeScenario}>{je.scenario}</Text>
          <JournalTable entry={{ lines: je.lines, memo: je.memo }} totals={totalsOf(je)} />
        </View>
      ))}

      {card.anchors.length ? (
        <>
          <SectionLabel icon="bookmark-outline" style={styles.gap}>
            Codification anchors
          </SectionLabel>
          {card.anchors.map((a) => (
            <ParagraphLink key={a.id} id={a.id} label={a.label} color={card.color} onPress={() => openParagraph(a.id)} />
          ))}
        </>
      ) : null}
    </>
  );
}

function AuditTab({ card, openParagraph, study, onStudy }) {
  const [open, setOpen] = useState(() => new Set([0]));
  const mastered = useMemo(
    () => card.auditTraps.filter((t) => isMastered(study.cards[trapId(card.topic, t.q)])).length,
    [card, study]
  );
  const toggle = (i) => {
    const next = new Set(open);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setOpen(next);
  };
  return (
    <>
      <SectionLabel icon="shield-checkmark-outline" color={COLORS.danger}>Audit & interview traps</SectionLabel>
      {onStudy ? (
        <TouchableOpacity style={styles.drillBtn} onPress={onStudy} activeOpacity={0.85} accessibilityLabel="Drill these traps as flashcards">
          <Ionicons name="school-outline" size={16} color={COLORS.gold} />
          <Text style={styles.drillText}>Drill these traps</Text>
          <Text style={styles.drillMeta}>
            {mastered}/{card.auditTraps.length} mastered
          </Text>
          <Ionicons name="chevron-forward" size={15} color={COLORS.gold} />
        </TouchableOpacity>
      ) : null}
      {card.auditTraps.map((t, i) => {
        const on = open.has(i);
        return (
          <TouchableOpacity key={i} style={[styles.trap, on && styles.trapOpen]} onPress={() => toggle(i)} activeOpacity={0.85}>
            <View style={styles.trapHead}>
              <Text style={styles.trapQ}>
                <Text style={styles.trapQMark}>Q{i + 1}. </Text>
                {t.q}
              </Text>
              <Ionicons name={on ? 'chevron-up' : 'chevron-down'} size={15} color={COLORS.textMuted} />
            </View>
            {on ? <Text style={styles.trapA}>{t.a}</Text> : null}
          </TouchableOpacity>
        );
      })}

      <SectionLabel icon="document-attach-outline" color={COLORS.gold} style={styles.gap}>
        Cite it — key official paragraphs
      </SectionLabel>
      {card.keyParagraphs.length ? (
        card.keyParagraphs.map((p) => (
          <ParagraphLink
            key={p.id}
            id={p.id}
            label={`${p.subtopic} › ${p.section}`}
            excerpt={p.excerpt}
            color={card.color}
            onPress={() => openParagraph(p.id)}
          />
        ))
      ) : (
        <Text style={styles.muted}>This Topic's official text is status or supplementary material only — see the Official Text tab.</Text>
      )}
      <Text style={styles.sourceNote}>
        Source: {card.source} · {card.stats.paragraphs.toLocaleString()} paragraphs, {card.stats.words.toLocaleString()} words
        {card.stats.pendingContent ? ` · ${card.stats.pendingContent} pending-content updates` : ''}
      </Text>
    </>
  );
}

const REVIEW_TEXT = {
  'cpa-reviewed': 'Reviewed by a CPA',
  'self-reviewed': 'AI-drafted, technically re-read — pending CPA sign-off',
  'ai-draft': 'AI-drafted, automated checks only — pending CPA review',
};

// Every card says who has checked it; the official text tab is always the authority.
function ReviewFooter({ review }) {
  if (!review) return null;
  const cpa = review.status === 'cpa-reviewed';
  return (
    <View style={styles.reviewBox}>
      <Ionicons name={cpa ? 'shield-checkmark' : 'information-circle-outline'} size={13} color={cpa ? COLORS.success : COLORS.textMuted} />
      <Text style={styles.reviewText}>
        <Text style={[styles.reviewLead, cpa && { color: COLORS.success }]}>{REVIEW_TEXT[review.status] || review.status}</Text>
        {review.by && cpa ? ` · ${review.by}` : ''}
        {review.date ? ` · ${review.date}` : ''}
        {review.notes ? `\n${review.notes}` : ''}
        {cpa ? '' : '\nEducational synthesis — confirm against the official text before relying on it.'}
      </Text>
    </View>
  );
}

/**
 * @param topic        ASC Topic number ("842")
 * @param initialTab   'principle' | 'mechanics' | 'audit' | 'text'
 * @param paragraph    optional paragraph id to open in the Official Text tab
 * @param nonce        changes force the initial tab/paragraph to re-apply for the same topic
 * @param onBack       optional back handler (phone list → card navigation)
 * @param headerExtra  optional node rendered under the title (e.g., related-topic chips)
 * @param actions      optional node rendered in the header's right side
 * @param onStudy      optional; shows "Drill these traps" on the Audit tab (study mode for this Topic)
 */
export default function AscCardView({ topic, initialTab = 'principle', paragraph = null, nonce = 0, onBack, headerExtra, actions, onStudy }) {
  const { entry, card, error, retry } = useAscCard(topic);
  const { study, toggleBookmark } = useStudy();
  const [tab, setTab] = useState(paragraph ? 'text' : initialTab);
  const [target, setTarget] = useState({ id: paragraph, nonce });

  useEffect(() => {
    setTab(paragraph ? 'text' : initialTab);
    setTarget({ id: paragraph, nonce: Date.now() });
  }, [topic, initialTab, paragraph, nonce]);

  if (!entry) return <Text style={styles.missing}>ASC {topic} is not in the Codex index.</Text>;

  const openParagraph = (id) => {
    setTarget({ id, nonce: Date.now() });
    setTab('text');
  };
  const saved = study.bookmarks.includes(entry.topic);

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          {onBack ? (
            <TouchableOpacity onPress={onBack} style={styles.backBtn} accessibilityLabel="Back to the Codex list" hitSlop={8}>
              <Ionicons name="chevron-back" size={18} color={COLORS.text} />
            </TouchableOpacity>
          ) : null}
          <TopicBadge entry={entry} size="lg" />
          <View style={styles.headerText}>
            <Text style={styles.kicker}>
              {entry.series}s · {entry.category.toUpperCase()}
              {entry.re ? <Text style={{ color: COLORS.success }}>{`  ·  ${RE_LABEL[entry.re]}`}</Text> : null}
              {entry.legacy ? <Text style={{ color: COLORS.warning }}>  ·  SUPERSEDED / LEGACY</Text> : null}
            </Text>
            <Text style={styles.title}>{entry.title}</Text>
            {tab !== 'text' ? <Text style={styles.tag}>{entry.tag}</Text> : null}
          </View>
          <TouchableOpacity
            onPress={() => toggleBookmark(entry.topic)}
            style={styles.starBtn}
            hitSlop={8}
            accessibilityLabel={saved ? `Remove ASC ${entry.topic} from saved` : `Save ASC ${entry.topic} for study`}
            accessibilityState={{ selected: saved }}
          >
            <Ionicons name={saved ? 'star' : 'star-outline'} size={19} color={saved ? COLORS.gold : COLORS.textMuted} />
          </TouchableOpacity>
          {actions}
        </View>
        {headerExtra}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow} accessibilityRole="tablist">
          {CARD_TABS.map((t) => {
            const on = t.key === tab;
            return (
              <TouchableOpacity
                key={t.key}
                style={[styles.tabBtn, on && { backgroundColor: `${entry.color}22`, borderColor: `${entry.color}99` }]}
                onPress={() => setTab(t.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
              >
                <Text style={[styles.tabNum, on && { color: entry.color }]}>{t.num}</Text>
                <Text style={[styles.tabText, on && styles.tabTextOn]}>{t.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {tab === 'text' ? (
        <OfficialTextReader topic={entry.topic} color={entry.color} targetParagraph={target.id} targetNonce={target.nonce} />
      ) : !card ? (
        <ModuleLoading label={`${entry.series}s series cards`} error={error} onRetry={retry} color={entry.color} />
      ) : (
        <ScrollView style={styles.flex} contentContainerStyle={styles.body}>
          <View style={styles.reading}>
            {tab === 'principle' ? <PrincipleTab card={card} /> : null}
            {tab === 'mechanics' ? <MechanicsTab card={card} openParagraph={openParagraph} /> : null}
            {tab === 'audit' ? <AuditTab card={card} openParagraph={openParagraph} study={study} onStudy={onStudy} /> : null}
            <ReviewFooter review={card.review} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  missing: { color: COLORS.danger, fontSize: 13, padding: 16 },
  header: {
    paddingTop: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 14 },
  backBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
    marginTop: 6,
  },
  headerText: { flex: 1, marginLeft: 12 },
  starBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', marginLeft: 4, marginTop: 2 },
  kicker: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 0.9 },
  title: { fontSize: 18, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3, marginTop: 2 },
  tag: { fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 18, marginTop: 3 },
  badge: {
    width: 50,
    paddingVertical: 5,
    borderRadius: RADII.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  badgeLg: { width: 58, paddingVertical: 7 },
  badgeAsc: { fontSize: 8.5, fontWeight: '800', letterSpacing: 1 },
  badgeNum: { fontFamily: MONO, fontSize: 15, fontWeight: '800' },
  badgeNumLg: { fontSize: 18 },
  tabRow: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 10 },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceLight,
    marginRight: 7,
  },
  tabNum: { fontFamily: MONO, fontSize: 11, fontWeight: '800', color: COLORS.textMuted, marginRight: 6 },
  tabText: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  tabTextOn: { color: COLORS.text },
  body: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  reading: { width: '100%', maxWidth: LAYOUT.READING_MAX, alignSelf: 'center' },
  gap: { marginTop: 22 },
  truthBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 3,
    padding: 14,
  },
  truthText: { fontSize: 14.5, lineHeight: 22, color: COLORS.text, fontWeight: '500' },
  analogyBox: {
    backgroundColor: `${COLORS.gold}10`,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: `${COLORS.gold}40`,
    padding: 14,
  },
  analogyTitle: { fontSize: 14, fontWeight: '800', color: COLORS.gold, marginBottom: 6 },
  analogyStory: { fontSize: 13.5, lineHeight: 21, color: COLORS.text },
  lensBox: {
    backgroundColor: COLORS.successSoft,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: `${COLORS.success}40`,
    padding: 12,
  },
  lensText: { fontSize: 13, lineHeight: 20, color: COLORS.text },
  glanceRow: { flexDirection: 'row', marginBottom: 8 },
  glance: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    marginRight: 8,
  },
  glanceLast: { marginRight: 0 },
  glanceLabel: { fontSize: 9.5, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 0.8 },
  glanceValue: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginTop: 3 },
  glossaryLine: { fontSize: 11.5, color: COLORS.textMuted, lineHeight: 17, marginTop: 4 },
  glossaryLead: { fontWeight: '800', color: COLORS.textSecondary },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  bulletDot: { width: 6, height: 6, borderRadius: 3, marginTop: 7, marginRight: 10 },
  bulletText: { flex: 1, fontSize: 13, lineHeight: 20, color: COLORS.text },
  measureBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
  },
  basisPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.warningSoft,
    marginBottom: 8,
  },
  basisText: { fontSize: 11.5, fontWeight: '800', color: COLORS.warning },
  measureLabel: { fontSize: 9.5, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 0.9, marginTop: 6 },
  measureText: { fontSize: 13, lineHeight: 19, color: COLORS.text, marginTop: 2 },
  jeBox: { marginBottom: 14 },
  jeTitle: { fontSize: 13, fontWeight: '800', color: COLORS.text, marginBottom: 3 },
  jeScenario: { fontSize: 12.5, lineHeight: 18, color: COLORS.textSecondary, marginBottom: 8 },
  paraLink: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    marginBottom: 8,
  },
  paraLinkHead: { flexDirection: 'row', alignItems: 'center' },
  paraLinkId: { fontFamily: MONO, fontSize: 12, fontWeight: '800', marginRight: 8 },
  paraLinkLabel: { flex: 1, fontSize: 11, color: COLORS.textMuted },
  paraLinkExcerpt: { fontSize: 12, lineHeight: 18, color: COLORS.textSecondary, marginTop: 5 },
  trap: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 8,
  },
  trapOpen: { borderColor: `${COLORS.danger}55` },
  drillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: `${COLORS.gold}55`,
    backgroundColor: COLORS.goldSoft,
  },
  drillText: { flex: 1, fontSize: 13, fontWeight: '800', color: COLORS.text, marginLeft: 8 },
  drillMeta: { fontSize: 11, fontWeight: '700', color: COLORS.gold, marginRight: 4 },
  trapHead: { flexDirection: 'row', alignItems: 'flex-start' },
  trapQ: { flex: 1, fontSize: 13, lineHeight: 19, fontWeight: '700', color: COLORS.text, marginRight: 8 },
  trapQMark: { color: COLORS.danger, fontFamily: MONO },
  trapA: { fontSize: 13, lineHeight: 20, color: COLORS.textSecondary, marginTop: 8 },
  muted: { fontSize: 12, color: COLORS.textMuted },
  sourceNote: { fontSize: 10.5, color: COLORS.textMuted, marginTop: 14, lineHeight: 15 },
  reviewBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  reviewText: { flex: 1, fontSize: 10.5, color: COLORS.textMuted, lineHeight: 15, marginLeft: 6 },
  reviewLead: { fontWeight: '800', color: COLORS.textSecondary },
});
