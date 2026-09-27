// Track B: the "GAAP Codex" tab — all 99 FASB ASC Topics organized by series (100s–900s) with
// fuzzy search by number, title or alias ("842", "Lease", "Derivatives", "VIE", "Stock Comp"),
// a Real Estate / All US GAAP filter, saved Topics, the four-tab card viewer and study mode
// (flashcards from the audit traps). Phones navigate list → card / study; desktop shows the list
// and the card (or the study session) side by side.
//
// Only the ~50 KB index is used to render this tab; cards and official text load on demand.
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SectionList,
  ScrollView,
  TouchableOpacity,
  Platform,
  BackHandler,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { LAYOUT, MONO, RADII } from '../../theme/layout';
import {
  ASC_SERIES,
  ASC_TOPICS,
  ASC_TOPIC_COUNT,
  ASC_FILTERS,
  filterCount,
  groupBySeries,
  searchAsc,
  getAscEntry,
} from '../../utils/ascIndex';
import { PRIMARY_RE_TOPICS } from '../../utils/ascLinks';
import useDebouncedValue from '../../utils/useDebouncedValue';
import { triggerHaptic } from '../../utils/haptics';
import AscCardView, { TopicBadge } from './AscCardView';
import StudySession from './StudySession';
import useStudy from '../../utils/useStudy';
import { masteredByTopic } from '../../utils/studyEngine';
import { GlossaryTermModal } from './GlossaryTerm';
import { useAscGlossary } from '../../utils/useAscData';
import { searchGlossary } from '../../utils/ascGlossary';

const MAX_GLOSSARY_RESULTS = 15;

const GlossaryRow = memo(function GlossaryRow({ entry, onPress }) {
  const first = entry.defs.length ? entry.defs[0] : null;
  const text = first ? first.text : entry.master ? entry.master.text : '';
  const codes = entry.defs.flatMap((d) => d.topics);
  return (
    <TouchableOpacity style={styles.termRow} onPress={() => onPress(entry)} activeOpacity={0.8} accessibilityLabel={`Glossary ${entry.term}`}>
      <Ionicons name="book-outline" size={15} color={COLORS.gold} style={styles.termIcon} />
      <View style={styles.rowText}>
        <Text style={styles.rowTitle} numberOfLines={1}>
          {entry.term}
        </Text>
        <Text style={styles.rowTag} numberOfLines={2}>
          {text}
        </Text>
        <Text style={styles.metaText} numberOfLines={1}>
          {codes.length ? `Defined in ${codes.slice(0, 4).join(', ')}${codes.length > 4 ? ` +${codes.length - 4}` : ''}` : 'Master Glossary'}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const TOTAL_PARAGRAPHS = ASC_TOPICS.reduce((n, e) => n + e.paragraphs, 0);
const TOTAL_TRAPS = ASC_TOPICS.reduce((n, e) => n + e.traps, 0);
const FILTER_COUNTS = Object.fromEntries(ASC_FILTERS.map((f) => [f.key, filterCount(f.key)]));
const RE_BADGE = { core: 'CORE RE', support: 'REAL ESTATE' };

const TopicRow = memo(function TopicRow({ entry, selected, onPress, saved = false, mastered = 0 }) {
  return (
    <TouchableOpacity
      style={[styles.row, selected && { borderColor: `${entry.color}AA`, backgroundColor: `${entry.color}12` }]}
      onPress={() => onPress(entry.topic)}
      activeOpacity={0.8}
      accessibilityLabel={`ASC ${entry.topic} ${entry.title}`}
    >
      <TopicBadge entry={entry} />
      <View style={styles.rowText}>
        <View style={styles.rowTitleLine}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {entry.title}
          </Text>
          {saved ? <Ionicons name="star" size={12} color={COLORS.gold} style={styles.rowStar} /> : null}
        </View>
        <Text style={styles.rowTag} numberOfLines={2}>
          {entry.tag}
        </Text>
        <View style={styles.rowMeta}>
          {entry.re ? (
            <View style={[styles.pill, entry.re === 'core' ? styles.pillCore : styles.pillRe]}>
              <Text style={[styles.pillText, { color: entry.re === 'core' ? COLORS.success : COLORS.info }]}>{RE_BADGE[entry.re]}</Text>
            </View>
          ) : null}
          {entry.legacy ? (
            <View style={[styles.pill, styles.pillLegacy]}>
              <Text style={[styles.pillText, { color: COLORS.warning }]}>SUPERSEDED</Text>
            </View>
          ) : null}
          <Text style={styles.metaText}>
            {entry.paragraphs.toLocaleString()} ¶ · {entry.sourceSubtopics} subtopic{entry.sourceSubtopics === 1 ? '' : 's'}
          </Text>
          {mastered ? (
            <Text style={styles.masteredText}>
              {' '}
              · {mastered}/{entry.traps} mastered
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
});

function Welcome({ onOpen, onStudy }) {
  return (
    <ScrollView contentContainerStyle={styles.welcome}>
      <Text style={styles.welcomeIcon}>📖</Text>
      <Text style={styles.welcomeTitle}>US GAAP Codex</Text>
      <Text style={styles.welcomeText}>
        Every one of the {ASC_TOPIC_COUNT} FASB Accounting Standards Codification Topics as a first-principles master card: the economic truth, an
        analogy you won't forget, recognition and measurement triggers, balanced journal entries, audit and interview traps, and the complete
        official text.
      </Text>
      <TouchableOpacity style={styles.welcomeStudy} onPress={onStudy} activeOpacity={0.85}>
        <Ionicons name="school" size={16} color={COLORS.gold} />
        <Text style={styles.welcomeStudyText}>Study the {TOTAL_TRAPS} audit & interview traps as flashcards</Text>
        <Ionicons name="chevron-forward" size={15} color={COLORS.gold} />
      </TouchableOpacity>
      <Text style={styles.welcomeLabel}>START WITH THE PROPERTY CORE</Text>
      {PRIMARY_RE_TOPICS.map((t) => {
        const e = getAscEntry(t);
        return <TopicRow key={t} entry={e} selected={false} onPress={onOpen} />;
      })}
    </ScrollView>
  );
}

export default function GaapCodex({ focus }) {
  const { width } = useWindowDimensions();
  const wide = width >= LAYOUT.DESKTOP_MIN;
  const [query, setQuery] = useState('');
  const q = useDebouncedValue(query.trim(), 120);
  const [filter, setFilter] = useState('all');
  const [series, setSeries] = useState(null);
  const [selected, setSelected] = useState(null); // { topic, paragraph, nonce }
  const [term, setTerm] = useState(null); // glossary entry shown in the sheet
  const [studying, setStudying] = useState(null); // { topic | null, nonce } while study mode is open
  const [savedOnly, setSavedOnly] = useState(false);
  const { glossary, loading: glossaryLoading } = useAscGlossary(Boolean(q));
  const { study } = useStudy();
  const mastery = useMemo(() => masteredByTopic(study), [study]);
  const masteredTotal = useMemo(() => Object.values(mastery).reduce((n, v) => n + v, 0), [mastery]);

  useEffect(() => {
    if (focus && focus.topic) setSelected({ topic: focus.topic, paragraph: focus.paragraph || null, nonce: focus.nonce });
  }, [focus]);

  // Android back button leaves study mode, then returns from a card to the list on phones.
  useEffect(() => {
    if (!studying && (wide || !selected)) return undefined;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (studying) setStudying(null);
      else setSelected(null);
      return true;
    });
    return () => sub.remove();
  }, [wide, selected, studying]);

  const { results, reference } = useMemo(() => searchAsc(q, { filter }), [q, filter]);
  const visible = useMemo(
    () => results.filter((e) => (!series || e.series === series) && (!savedOnly || study.bookmarks.includes(e.topic))),
    [results, series, savedOnly, study.bookmarks]
  );
  const glossaryHits = useMemo(
    () => (q && glossary && !reference ? searchGlossary(glossary, q, { limit: MAX_GLOSSARY_RESULTS }) : { results: [], total: 0 }),
    [q, glossary, reference]
  );
  const sections = useMemo(() => {
    if (!q) return groupBySeries(visible).map((g) => ({ key: g.series, title: `${g.series}s · ${g.category}`, color: g.color, data: g.data }));
    const out = [];
    if (visible.length) out.push({ key: 'results', title: `${visible.length} matching Topic${visible.length === 1 ? '' : 's'}`, data: visible });
    if (glossaryHits.results.length) {
      out.push({
        key: 'glossary',
        title: `FASB glossary · ${glossaryHits.total} term${glossaryHits.total === 1 ? '' : 's'}`,
        color: COLORS.gold,
        data: glossaryHits.results.map((g) => ({ glossaryTerm: g })),
      });
    }
    return out;
  }, [q, visible, glossaryHits]);

  const open = useCallback((topic, paragraph = null) => {
    triggerHaptic('light');
    setStudying(null);
    setSelected({ topic, paragraph, nonce: Date.now() });
  }, []);
  const startStudy = useCallback((topic = null) => {
    triggerHaptic('light');
    setStudying({ topic, nonce: Date.now() });
  }, []);

  const selectedTopic = selected ? selected.topic : null;
  const renderItem = useCallback(
    ({ item }) =>
      item.glossaryTerm ? (
        <GlossaryRow entry={item.glossaryTerm} onPress={setTerm} />
      ) : (
        <TopicRow
          entry={item}
          selected={wide && !studying && item.topic === selectedTopic}
          onPress={open}
          saved={study.bookmarks.includes(item.topic)}
          mastered={mastery[item.topic] || 0}
        />
      ),
    [wide, studying, selectedTopic, open, study.bookmarks, mastery]
  );

  const card = selected ? (
    <AscCardView
      key={selected.topic}
      topic={selected.topic}
      paragraph={selected.paragraph}
      nonce={selected.nonce}
      onBack={wide ? undefined : () => setSelected(null)}
      onStudy={() => startStudy(selected.topic)}
    />
  ) : null;

  const studyView = studying ? (
    <StudySession key={studying.nonce} initialTopic={studying.topic} onClose={() => setStudying(null)} onOpenTopic={(topic) => open(topic)} />
  ) : null;

  const termSheet = (
    <GlossaryTermModal
      entry={term}
      onClose={() => setTerm(null)}
      onOpenTopic={(topic) => {
        setTerm(null);
        open(topic);
      }}
    />
  );

  // Phones: study mode covers the card without unmounting it, so "Back" returns to the same tab.
  if (!wide && (studyView || card)) {
    return (
      <View style={styles.flex}>
        {card ? <View style={studyView ? styles.hidden : styles.flex}>{card}</View> : null}
        {studyView}
      </View>
    );
  }

  const list = (
    <View style={wide ? styles.listPane : styles.flex}>
      <View style={styles.top}>
        <View style={styles.titleRow}>
          <Ionicons name="library" size={18} color={COLORS.gold} />
          <Text style={styles.heading}>US GAAP Codex</Text>
          {wide ? (
            <Text style={styles.headingMeta}>
              {ASC_TOPIC_COUNT} Topics · {TOTAL_PARAGRAPHS.toLocaleString()} ¶
            </Text>
          ) : null}
          <TouchableOpacity
            style={[styles.studyBtn, studying && styles.studyBtnOn]}
            onPress={() => (studying ? setStudying(null) : startStudy())}
            accessibilityLabel="Study mode"
            accessibilityState={{ selected: Boolean(studying) }}
          >
            <Ionicons name="school" size={14} color={COLORS.gold} />
            <Text style={styles.studyText}>Study</Text>
            <Text style={styles.studyMeta}>
              {masteredTotal}/{TOTAL_TRAPS}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={15} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder='Search "842", "Lease", "Derivatives", "VIE", "Stock Comp"…'
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={() => visible[0] && open(visible[0].topic, reference ? reference.paragraph || null : null)}
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={8} accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={17} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.filterRow}>
          {ASC_FILTERS.map((f) => {
            const on = f.key === filter;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.filterBtn, on && styles.filterBtnOn]}
                onPress={() => setFilter(f.key)}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
              >
                <Text style={[styles.filterText, on && styles.filterTextOn]} numberOfLines={1}>
                  {f.short} <Text style={styles.filterCount}>{FILTER_COUNTS[f.key]}</Text>
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.filterCaption}>{ASC_FILTERS.find((f) => f.key === filter).label}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.seriesRow}>
          <TouchableOpacity
            style={[styles.seriesChip, savedOnly && styles.savedChipOn]}
            onPress={() => setSavedOnly((v) => !v)}
            accessibilityLabel="Show saved Topics only"
            accessibilityState={{ selected: savedOnly }}
          >
            <Ionicons name={savedOnly ? 'star' : 'star-outline'} size={12} color={COLORS.gold} style={styles.savedIcon} />
            <Text style={[styles.seriesText, savedOnly && styles.seriesTextOn]}>Saved {study.bookmarks.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.seriesChip, !series && styles.seriesChipOn]} onPress={() => setSeries(null)}>
            <Text style={[styles.seriesText, !series && styles.seriesTextOn]}>All series</Text>
          </TouchableOpacity>
          {ASC_SERIES.map((s) => {
            const on = s.series === series;
            return (
              <TouchableOpacity
                key={s.series}
                style={[styles.seriesChip, on && { borderColor: s.color, backgroundColor: `${s.color}22` }]}
                onPress={() => setSeries(on ? null : s.series)}
              >
                <Text style={[styles.seriesNum, { color: s.color }]}>{s.series}s</Text>
                <Text style={[styles.seriesText, on && styles.seriesTextOn]}>{s.category}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {reference && reference.paragraph ? (
          <TouchableOpacity style={styles.refBanner} onPress={() => open(reference.topic, reference.paragraph)}>
            <Ionicons name="document-text-outline" size={14} color={COLORS.gold} />
            <Text style={styles.refText}>
              Open paragraph <Text style={styles.refId}>{reference.paragraph}</Text> in the official text
            </Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.gold} />
          </TouchableOpacity>
        ) : null}
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(e) => (e.glossaryTerm ? `g:${e.glossaryTerm.term}` : e.topic)}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            {section.color ? <View style={[styles.sectionDot, { backgroundColor: section.color }]} /> : null}
            <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
            <Text style={styles.sectionCount}>{section.data.length}</Text>
          </View>
        )}
        stickySectionHeadersEnabled
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={14}
        windowSize={9}
        ListEmptyComponent={
          <View style={styles.empty}>
            {savedOnly && !q ? (
              <>
                <Ionicons name="star-outline" size={32} color={COLORS.textMuted} />
                <Text style={styles.emptyTitle}>No saved Topics{series ? ` in the ${series}s` : ''}</Text>
                <Text style={styles.emptySub}>Tap the ☆ on any card to save it here and in the study deck.</Text>
              </>
            ) : (
              <>
                <Ionicons name="search-outline" size={32} color={COLORS.textMuted} />
                <Text style={styles.emptyTitle}>No Topic matches{q ? ` “${q}”` : ''}</Text>
                <Text style={styles.emptySub}>
                  Try a Topic number (842), a keyword (lease, revenue){savedOnly ? ', turn off Saved' : ''} or switch the filter to All US GAAP.
                </Text>
              </>
            )}
          </View>
        }
        ListFooterComponent={
          <Text style={styles.footer}>
            {q && glossaryLoading ? 'Searching the FASB glossary…\n' : ''}
            FASB Accounting Standards Codification® · cards and official text load on demand when opened
          </Text>
        }
      />
    </View>
  );

  if (!wide) {
    return (
      <View style={styles.flex}>
        {list}
        {termSheet}
      </View>
    );
  }
  return (
    <View style={styles.split}>
      {list}
      <View style={styles.detailPane}>{studyView || card || <Welcome onOpen={open} onStudy={() => startStudy()} />}</View>
      {termSheet}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hidden: { display: 'none' },
  split: { flex: 1, flexDirection: 'row' },
  listPane: { width: 380, flexGrow: 0, flexShrink: 0, borderRightWidth: 1, borderRightColor: COLORS.border },
  detailPane: { flex: 1, minWidth: 0 },
  top: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  heading: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginLeft: 8, flex: 1 },
  headingMeta: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  studyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 32,
    paddingHorizontal: 10,
    marginLeft: 10,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: `${COLORS.gold}66`,
    backgroundColor: COLORS.goldSoft,
  },
  studyBtnOn: { borderColor: COLORS.gold },
  studyText: { fontSize: 12, fontWeight: '800', color: COLORS.text, marginLeft: 5 },
  studyMeta: { fontFamily: MONO, fontSize: 10, fontWeight: '700', color: COLORS.gold, marginLeft: 6 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceInput,
    borderRadius: RADII.md,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    ...Platform.select({ web: { outlineStyle: 'none' }, default: {} }),
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    marginLeft: 8,
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 10,
    padding: 3,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.surfaceInput,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterBtnOn: { backgroundColor: `${COLORS.gold}22`, borderColor: `${COLORS.gold}80` },
  filterText: { fontSize: 11.5, fontWeight: '700', color: COLORS.textMuted },
  filterTextOn: { color: COLORS.text },
  filterCount: { fontSize: 10.5, fontWeight: '800', color: COLORS.gold },
  filterCaption: { fontSize: 10.5, color: COLORS.textMuted, fontWeight: '600', marginTop: 5, marginLeft: 4 },
  seriesRow: { paddingTop: 8, paddingBottom: 2 },
  seriesChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceLight,
    marginRight: 6,
  },
  seriesChipOn: { borderColor: COLORS.borderLight, backgroundColor: COLORS.surfaceHighlight },
  savedChipOn: { borderColor: COLORS.gold, backgroundColor: COLORS.goldSoft },
  savedIcon: { marginRight: 5 },
  seriesNum: { fontFamily: MONO, fontSize: 11, fontWeight: '800', marginRight: 5 },
  seriesText: { fontSize: 11.5, fontWeight: '600', color: COLORS.textSecondary },
  seriesTextOn: { color: COLORS.text },
  refBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: `${COLORS.gold}55`,
    backgroundColor: COLORS.goldSoft,
  },
  refText: { flex: 1, fontSize: 12, color: COLORS.text, marginHorizontal: 8 },
  refId: { fontFamily: MONO, fontWeight: '800', color: COLORS.gold },
  listContent: { paddingHorizontal: 12, paddingBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingTop: 14,
    paddingBottom: 7,
    backgroundColor: COLORS.background,
  },
  sectionDot: { width: 7, height: 7, borderRadius: 3.5, marginRight: 7 },
  sectionTitle: { flex: 1, fontSize: 10.5, fontWeight: '800', color: COLORS.textSecondary, letterSpacing: 0.9 },
  sectionCount: { fontSize: 10.5, fontWeight: '800', color: COLORS.textMuted },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 11,
    marginBottom: 7,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  rowText: { flex: 1, marginLeft: 11 },
  rowTitleLine: { flexDirection: 'row', alignItems: 'center' },
  rowTitle: { flex: 1, fontSize: 13.5, fontWeight: '700', color: COLORS.text },
  rowStar: { marginLeft: 6 },
  masteredText: { fontSize: 10.5, fontWeight: '700', color: COLORS.success },
  rowTag: { fontSize: 11.5, color: COLORS.textSecondary, lineHeight: 16, marginTop: 2 },
  rowMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 6 },
  pill: { paddingHorizontal: 6, paddingVertical: 1.5, borderRadius: RADII.sm, marginRight: 6 },
  pillCore: { backgroundColor: COLORS.successSoft },
  pillRe: { backgroundColor: COLORS.infoSoft },
  pillLegacy: { backgroundColor: COLORS.warningSoft },
  pillText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.6 },
  metaText: { fontSize: 10.5, color: COLORS.textMuted },
  empty: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  termRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 11,
    marginBottom: 7,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: `${COLORS.gold}33`,
    backgroundColor: COLORS.surface,
  },
  termIcon: { marginTop: 2 },
  emptyTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginTop: 10 },
  emptySub: { fontSize: 12, color: COLORS.textMuted, marginTop: 4, textAlign: 'center' },
  footer: { fontSize: 10.5, color: COLORS.textMuted, textAlign: 'center', marginTop: 14 },
  welcome: { padding: 28, maxWidth: LAYOUT.READING_MAX, width: '100%', alignSelf: 'center' },
  welcomeIcon: { fontSize: 34 },
  welcomeTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginTop: 6 },
  welcomeText: { fontSize: 13.5, lineHeight: 21, color: COLORS.textSecondary, marginTop: 8, marginBottom: 22 },
  welcomeLabel: { fontSize: 10.5, fontWeight: '800', color: COLORS.gold, letterSpacing: 1, marginBottom: 8 },
  welcomeStudy: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
    paddingHorizontal: 12,
    marginBottom: 22,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: `${COLORS.gold}55`,
    backgroundColor: COLORS.goldSoft,
  },
  welcomeStudyText: { flex: 1, fontSize: 13, fontWeight: '800', color: COLORS.text, marginHorizontal: 8 },
});
