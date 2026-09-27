// Tab 4 of the GAAP card: the complete official Codification text of one Topic.
// The Topic's text file (up to ~1.7 MB) is loaded only when this tab opens. Paragraphs render in a
// virtualized FlatList one section at a time; subtopic/section chips, find-in-text and
// jump-to-paragraph (from the card's key paragraphs or a "842-20-25-1" search) navigate it.
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { MONO, RADII } from '../../theme/layout';
import { useAscText, useAscGlossary } from '../../utils/useAscData';
import { buildTermMatcher, splitByTerms, findGlossaryTerm } from '../../utils/ascGlossary';
import { getAscEntry } from '../../utils/ascIndex';
import useDebouncedValue from '../../utils/useDebouncedValue';
import { ModuleLoading } from '../ui';
import { GlossaryTermCard } from './GlossaryTerm';

const TABLE_PREVIEW_ROWS = 40;
const MAX_FIND_RESULTS = 200;

const flatten = (lines) =>
  (lines || []).map((l) => (typeof l === 'string' ? l.replace(/^\t+/, '') : l.tbl.map((r) => r.join(' ')).join(' '))).join(' ');

function defaultSection(doc) {
  // Open on the first substantive section rather than the ASU status table.
  const st = doc.subtopics[0];
  const idx = st ? st.sections.findIndex((s) => s.code !== '00' && s.code !== 'S00') : -1;
  return { sub: 0, sec: Math.max(0, idx) };
}

const TableBlock = memo(function TableBlock({ rows }) {
  const [all, setAll] = useState(false);
  const shown = all ? rows : rows.slice(0, TABLE_PREVIEW_ROWS);
  return (
    <View style={styles.tableWrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View>
          {shown.map((row, i) => (
            <View key={i} style={[styles.tableRow, i === 0 && styles.tableHead, i % 2 === 1 && styles.tableZebra]}>
              {row.map((cell, j) => (
                <Text key={j} selectable style={[styles.tableCell, j === 0 && styles.tableCellFirst, i === 0 && styles.tableHeadText]}>
                  {cell}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      {rows.length > TABLE_PREVIEW_ROWS ? (
        <TouchableOpacity onPress={() => setAll(!all)} style={styles.tableMore}>
          <Text style={styles.tableMoreText}>{all ? 'Show fewer rows' : `Show all ${rows.length} rows`}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

function Line({ line, matcher, seen, onTerm }) {
  if (typeof line !== 'string') return <TableBlock rows={line.tbl} />;
  const depth = /^\t*/.exec(line)[0].length;
  const body = line.slice(depth);
  if (body === 'PENDING CONTENT') {
    return (
      <View style={styles.pendingBadge}>
        <Ionicons name="time-outline" size={11} color={COLORS.warning} />
        <Text style={styles.pendingText}>PENDING CONTENT</Text>
      </View>
    );
  }
  if (body.startsWith('Transition date:')) return <Text style={styles.transition}>{body}</Text>;
  const parts = matcher ? splitByTerms(body, matcher, seen) : null;
  return (
    <Text selectable style={[styles.line, depth ? { marginLeft: depth * 14 } : null]}>
      {parts
        ? parts.map((part, i) =>
            part.term ? (
              <Text key={i} style={styles.termLink} onPress={() => onTerm(part.term)} accessibilityRole="button">
                {part.text}
              </Text>
            ) : (
              part.text
            )
          )
        : body}
    </Text>
  );
}

const Block = memo(function Block({ block, color, highlighted, matcher, onTerm }) {
  if (block.h !== undefined) {
    return (
      <Text style={[styles.heading, block.l > 2 && styles.subHeading, { marginLeft: Math.max(0, block.l - 3) * 10 }]}>
        {block.h}
      </Text>
    );
  }
  const superseded = block.p && /^(\[?Paragraph|Subparagraph) (superseded|not used)/i.test(block.t[0] || '');
  // Mark each defined term once per paragraph (never the term a glossary entry is defining).
  const seen = new Set(block.g ? [block.g] : []);
  return (
    <View style={[styles.block, highlighted && { borderColor: color, backgroundColor: `${color}14` }, superseded && styles.superseded]}>
      {block.p ? <Text style={[styles.paraId, { color }]}>{block.p}</Text> : null}
      {block.g ? <Text style={styles.term}>{block.g}</Text> : null}
      {block.t.map((line, i) => (
        <Line key={i} line={line} matcher={superseded ? null : matcher} seen={seen} onTerm={onTerm} />
      ))}
    </View>
  );
});

// Subtopics the source export does not include, derived at build time from the Topic's own
// Overview list (see asc_codification/MISSING_SUBTOPICS.md).
function CoverageNote({ entry }) {
  const [open, setOpen] = useState(false);
  const own = entry.missing || [];
  const related = entry.relatedMissing || [];
  if (!own.length && !related.length) return null;
  const PREVIEW = 3;
  const list = (items) => (open ? items : items.slice(0, PREVIEW)).join(' · ');
  const more = own.length > PREVIEW || related.length > PREVIEW;
  return (
    <TouchableOpacity style={styles.coverage} onPress={() => setOpen(!open)} activeOpacity={more ? 0.8 : 1} disabled={!more}>
      <Ionicons name="information-circle-outline" size={13} color={COLORS.textMuted} />
      <View style={styles.flex}>
        {own.length ? (
          <Text style={styles.coverageText}>
            <Text style={styles.coverageLead}>Not in your source export ({own.length}): </Text>
            {list(own)}
            {!open && own.length > PREVIEW ? ` · +${own.length - PREVIEW} more` : ''}
          </Text>
        ) : null}
        {related.length ? (
          <Text style={[styles.coverageText, own.length ? styles.coverageGap : null]}>
            <Text style={styles.coverageLead}>Industry subtopics under Topic {entry.topic}, also missing ({related.length}): </Text>
            {list(related)}
            {!open && related.length > PREVIEW ? ` · +${related.length - PREVIEW} more` : ''}
          </Text>
        ) : null}
        <Text style={[styles.coverageText, styles.coverageGap]}>
          Add them by saving a FASB export in asc_codification/markdown/supplements/ — see MISSING_SUBTOPICS.md.
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function OfficialTextReader({ topic, color = COLORS.info, targetParagraph = null, targetNonce = 0 }) {
  const { text, loading, error, retry } = useAscText(topic, true);
  const entry = getAscEntry(topic);
  const [pos, setPos] = useState({ sub: 0, sec: 0 });
  const [highlight, setHighlight] = useState(null);
  const [pendingScroll, setPendingScroll] = useState(null);
  const [find, setFind] = useState('');
  const [noteOpen, setNoteOpen] = useState(false);
  const [openTerm, setOpenTerm] = useState(null);
  const { glossary } = useAscGlossary(Boolean(openTerm));
  const debouncedFind = useDebouncedValue(find.trim(), 200);
  const listRef = useRef(null);

  // Paragraph id -> location, built once per loaded Topic.
  const locator = useMemo(() => {
    const map = new Map();
    if (!text) return map;
    text.subtopics.forEach((st, sub) =>
      st.sections.forEach((sec, s) =>
        sec.blocks.forEach((b, i) => {
          if (b.p && !map.has(b.p)) map.set(b.p, { sub, sec: s, index: i });
        })
      )
    );
    return map;
  }, [text]);

  // Terms this Topic defines (its Glossary sections) become tappable in the text.
  const { matcher, localDefs } = useMemo(() => {
    const defs = new Map();
    if (text) {
      for (const st of text.subtopics) {
        for (const sec of st.sections) {
          for (const b of sec.blocks) {
            if (!b.g) continue;
            const def = b.t.map((l) => (typeof l === 'string' ? l.replace(/^\t+/, '') : '')).join('\n');
            const e = defs.get(b.g) || { term: b.g, defs: [], master: null };
            const code = `${topic}-${st.code}`;
            const same = e.defs.find((d) => d.text === def);
            if (same) {
              if (!same.topics.includes(code)) same.topics.push(code);
            } else e.defs.push({ text: def, topics: [code] });
            defs.set(b.g, e);
          }
        }
      }
    }
    return { matcher: buildTermMatcher(Array.from(defs.keys())), localDefs: defs };
  }, [text, topic]);
  const termEntry = openTerm ? findGlossaryTerm(glossary, openTerm) || localDefs.get(openTerm) || null : null;

  // Reset to the default section when the Topic changes.
  useEffect(() => {
    if (text) setPos(defaultSection(text));
    setFind('');
    setHighlight(null);
  }, [text]);

  const jumpTo = (id) => {
    const loc = locator.get(id);
    if (!loc) return false;
    setFind('');
    setPos({ sub: loc.sub, sec: loc.sec });
    setHighlight(id);
    setPendingScroll({ index: loc.index, nonce: Date.now() });
    return true;
  };

  useEffect(() => {
    if (text && targetParagraph) jumpTo(targetParagraph);
    // jumpTo only depends on locator, which is derived from text
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, targetParagraph, targetNonce]);

  useEffect(() => {
    if (!pendingScroll || !listRef.current) return undefined;
    const t = setTimeout(() => {
      try {
        listRef.current.scrollToIndex({ index: pendingScroll.index, animated: false, viewPosition: 0.1 });
      } catch {
        // onScrollToIndexFailed retries once the rows are measured
      }
    }, 60);
    return () => clearTimeout(t);
  }, [pendingScroll, pos]);

  const results = useMemo(() => {
    if (!text || debouncedFind.length < 2) return null;
    const q = debouncedFind.toLowerCase();
    const out = [];
    text.subtopics.forEach((st, sub) =>
      st.sections.forEach((sec, s) =>
        sec.blocks.forEach((b) => {
          if (out.length >= MAX_FIND_RESULTS || !b.t) return;
          const body = flatten(b.t);
          const hay = `${b.p || b.g || ''} ${body}`.toLowerCase();
          const at = hay.indexOf(q);
          if (at < 0) return;
          const start = Math.max(0, at - 60);
          out.push({
            key: `${sub}-${s}-${b.p || b.g || out.length}`,
            id: b.p || null,
            label: b.p || b.g || `${st.code} ${sec.title}`,
            where: `${st.code} ${st.title} › ${sec.title}`,
            snippet: `${start ? '…' : ''}${hay.slice(start, at + q.length + 120).trim()}…`,
            sub,
            sec: s,
          });
        })
      )
    );
    return out;
  }, [text, debouncedFind]);

  if (!text) {
    return (
      <View style={styles.center}>
        <ModuleLoading label={`ASC ${topic} official text`} error={error} onRetry={retry} color={color} />
        {loading ? <Text style={styles.loadingHint}>Loaded on demand — nothing is downloaded until you open this tab.</Text> : null}
      </View>
    );
  }

  const st = text.subtopics[pos.sub] || text.subtopics[0];
  const sec = (st && st.sections[pos.sec]) || (st && st.sections[0]);
  const note = sec ? sec.note || text.notes[sec.code] : null;
  const header = (
    <View>
      {entry ? <CoverageNote entry={entry} /> : null}
      {note ? (
        <TouchableOpacity style={styles.note} onPress={() => setNoteOpen(!noteOpen)} activeOpacity={0.8}>
          <Text style={styles.noteLabel}>
            GENERAL NOTE · {sec.title.toUpperCase()} <Ionicons name={noteOpen ? 'chevron-up' : 'chevron-down'} size={10} />
          </Text>
          {noteOpen ? <Text style={styles.noteText}>{note}</Text> : null}
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <View style={styles.flex}>
      <View style={styles.controls}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {text.subtopics.map((s, i) => {
            const on = i === pos.sub;
            return (
              <TouchableOpacity
                key={s.code}
                style={[styles.chip, on && { borderColor: color, backgroundColor: `${color}22` }]}
                onPress={() => {
                  setPos({ sub: i, sec: Math.max(0, s.sections.findIndex((x) => x.code !== '00' && x.code !== 'S00')) });
                  setHighlight(null);
                }}
              >
                <Text style={[styles.chipCode, on && { color }]}>
                  {topic}-{s.code}
                </Text>
                <Text style={[styles.chipText, on && styles.chipTextOn]} numberOfLines={1}>
                  {s.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {st.sections.map((s, i) => {
            const on = i === pos.sec;
            const n = s.blocks.filter((b) => b.p).length;
            return (
              <TouchableOpacity
                key={`${s.code}-${i}`}
                style={[styles.secChip, on && { borderColor: `${color}AA`, backgroundColor: `${color}18` }]}
                onPress={() => {
                  setPos({ sub: pos.sub, sec: i });
                  setHighlight(null);
                }}
              >
                <Text style={[styles.secChipText, on && styles.chipTextOn]}>
                  {s.code} {s.title}
                  <Text style={styles.secCount}> {n}</Text>
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.findBar}>
          <Ionicons name="search" size={14} color={COLORS.textMuted} />
          <TextInput
            style={styles.findInput}
            value={find}
            onChangeText={setFind}
            placeholder={`Find in ASC ${topic} or jump to a paragraph (${topic}-10-25-1)`}
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={() => jumpTo(find.trim().toUpperCase().replace(/^ASC\s*/, ''))}
          />
          {find ? (
            <TouchableOpacity onPress={() => setFind('')} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {results ? (
        <FlatList
          key="results"
          data={results}
          keyExtractor={(r) => r.key}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <Text style={styles.resultsCount}>
              {results.length >= MAX_FIND_RESULTS ? `First ${MAX_FIND_RESULTS}` : results.length} match{results.length === 1 ? '' : 'es'} for “{debouncedFind}”
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.result}
              onPress={() => {
                if (!item.id || !jumpTo(item.id)) {
                  setFind('');
                  setPos({ sub: item.sub, sec: item.sec });
                }
              }}
            >
              <Text style={[styles.paraId, { color }]}>{item.label}</Text>
              <Text style={styles.resultWhere}>{item.where}</Text>
              <Text style={styles.resultSnippet} numberOfLines={3}>
                {item.snippet}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No text in ASC {topic} matches “{debouncedFind}”.</Text>}
        />
      ) : (
        <FlatList
          key={`sec-${pos.sub}-${pos.sec}`}
          ref={listRef}
          data={sec ? sec.blocks : []}
          keyExtractor={(b, i) => `${i}-${b.p || b.g || ''}`}
          renderItem={({ item }) => (
            <Block block={item} color={color} highlighted={Boolean(item.p) && item.p === highlight} matcher={matcher} onTerm={setOpenTerm} />
          )}
          extraData={highlight}
          ListHeaderComponent={header}
          contentContainerStyle={styles.listContent}
          initialNumToRender={12}
          maxToRenderPerBatch={12}
          windowSize={9}
          removeClippedSubviews={Platform.OS === 'android'}
          onScrollToIndexFailed={(info) => {
            listRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: false });
            setTimeout(() => {
              try {
                listRef.current?.scrollToIndex({ index: info.index, animated: false, viewPosition: 0.1 });
              } catch {
                // give up quietly; the paragraph stays highlighted
              }
            }, 120);
          }}
          ListEmptyComponent={<Text style={styles.empty}>This section has no paragraphs in the source library.</Text>}
          ListFooterComponent={<Text style={styles.footer}>FASB Accounting Standards Codification® · Topic {topic} · source: asc_codification/markdown</Text>}
        />
      )}

      {termEntry ? (
        <View style={styles.termSheet}>
          <View style={styles.termSheetHead}>
            <Ionicons name="book-outline" size={13} color={COLORS.gold} />
            <Text style={styles.termSheetKicker}>DEFINED TERM</Text>
            <TouchableOpacity onPress={() => setOpenTerm(null)} hitSlop={10} accessibilityLabel="Close definition">
              <Ionicons name="close" size={19} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.termSheetBody} contentContainerStyle={styles.termSheetContent}>
            <GlossaryTermCard entry={termEntry} loadingMore={!glossary} />
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { paddingVertical: 24, alignItems: 'center' },
  loadingHint: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  controls: {
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  chipRow: { paddingHorizontal: 14, paddingBottom: 6 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 280,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.surfaceLight,
    marginRight: 6,
  },
  chipCode: { fontFamily: MONO, fontSize: 11, fontWeight: '800', color: COLORS.textSecondary, marginRight: 6 },
  chipText: { fontSize: 11.5, fontWeight: '600', color: COLORS.textSecondary, flexShrink: 1 },
  chipTextOn: { color: COLORS.text },
  secChip: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  secChipText: { fontSize: 11, fontWeight: '600', color: COLORS.textMuted },
  secCount: { fontSize: 10, color: COLORS.textMuted, fontWeight: '800' },
  findBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    marginTop: 2,
    paddingHorizontal: 10,
    height: 36,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceInput,
  },
  findInput: {
    ...Platform.select({ web: { outlineStyle: 'none' }, default: {} }),
    flex: 1,
    color: COLORS.text,
    fontSize: 12.5,
    marginLeft: 8,
  },
  listContent: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 40 },
  coverage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceLight,
    marginBottom: 10,
  },
  coverageText: { fontSize: 11, color: COLORS.textMuted, lineHeight: 16, marginLeft: 6 },
  coverageLead: { fontWeight: '800', color: COLORS.textSecondary },
  coverageGap: { marginTop: 4 },
  note: { paddingVertical: 8, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  noteLabel: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 0.8 },
  noteText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, marginTop: 6 },
  heading: { fontSize: 13.5, fontWeight: '800', color: COLORS.text, marginTop: 14, marginBottom: 6 },
  subHeading: { fontSize: 12.5, fontWeight: '700', color: COLORS.textSecondary },
  block: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  superseded: { opacity: 0.55 },
  paraId: { fontFamily: MONO, fontSize: 11.5, fontWeight: '800', marginBottom: 4 },
  term: { fontSize: 13, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  line: { fontSize: 13, color: COLORS.text, lineHeight: 20, marginBottom: 4 },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.warningSoft,
    marginTop: 6,
    marginBottom: 4,
  },
  pendingText: { fontSize: 10, fontWeight: '800', color: COLORS.warning, marginLeft: 4, letterSpacing: 0.6 },
  transition: { fontSize: 11, color: COLORS.textMuted, fontStyle: 'italic', marginBottom: 6 },
  tableWrap: { marginVertical: 6, borderRadius: RADII.sm, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' },
  tableRow: { flexDirection: 'row' },
  tableHead: { backgroundColor: COLORS.surfaceInput },
  tableZebra: { backgroundColor: COLORS.surfaceLight },
  tableCell: { width: 170, paddingHorizontal: 8, paddingVertical: 5, fontSize: 11, color: COLORS.textSecondary },
  tableCellFirst: { width: 230, color: COLORS.text },
  tableHeadText: { fontWeight: '800', color: COLORS.text },
  tableMore: { paddingVertical: 7, alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.border },
  tableMoreText: { fontSize: 11.5, fontWeight: '700', color: COLORS.info },
  resultsCount: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8 },
  result: { paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  resultWhere: { fontSize: 10.5, color: COLORS.textMuted, marginBottom: 3 },
  resultSnippet: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 17 },
  empty: { fontSize: 12.5, color: COLORS.textMuted, paddingVertical: 20, textAlign: 'center' },
  termLink: {
    color: COLORS.info,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationColor: `${COLORS.info}99`,
  },
  termSheet: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    maxHeight: '58%',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: `${COLORS.gold}66`,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  termSheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  termSheetKicker: { flex: 1, fontSize: 10, fontWeight: '800', color: COLORS.gold, letterSpacing: 1, marginLeft: 6 },
  termSheetBody: { flexGrow: 0 },
  termSheetContent: { padding: 14 },
  footer: { fontSize: 10.5, color: COLORS.textMuted, textAlign: 'center', marginTop: 16 },
});
