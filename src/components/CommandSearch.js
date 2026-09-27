import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  SectionList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { ALL_TASKS } from '../data/tasksData';
import { EXCEPTION_PLAYBOOKS, EXCEPTION_CODE_NOTE } from '../data/exceptionsPlaybookData';
import { GLOSSARY_TERMS } from '../data/glossaryData';
import { PDF_CATALOG } from '../data/pdfCatalogData';
import { triggerHaptic } from '../utils/haptics';
import { searchScreens, SCREEN_COUNT } from '../utils/screenIndex';
import { searchAsc, ASC_TOPIC_COUNT } from '../utils/ascIndex';
import useDebouncedValue from '../utils/useDebouncedValue';
import ExceptionTriageWizard from './ExceptionTriageWizard';
import { TopicBadge } from './gaap/AscCardView';
import { AscCardModal } from './gaap/GaapButton';
import { GlossaryTermModal } from './gaap/GlossaryTerm';
import { useAscGlossary } from '../utils/useAscData';
import { searchGlossary } from '../utils/ascGlossary';

const MAX_SCREEN_RESULTS = 50;
const MAX_GLOSSARY_RESULTS = 40;
const MAX_ASC_RESULTS = 8;
const MAX_FASB_TERMS = 12;
const RE_LABEL = { core: 'CORE RE', support: 'REAL ESTATE' };

// `initialQuery` = { text, nonce } lets other tabs (the Deduction Compass) open a search.
export default function CommandSearch({ onSelectTask, onOpenScreen, initialQuery }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery ? initialQuery.text : '');
  useEffect(() => {
    if (initialQuery && initialQuery.text) setSearchQuery(initialQuery.text);
  }, [initialQuery]);
  const debouncedQuery = useDebouncedValue(searchQuery, 150);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All'); // 'All' | 'Manuals' | 'Exceptions' | 'Tasks' | 'Screens' | 'Glossary'
  const [expandedExceptionId, setExpandedExceptionId] = useState('ex_po_variance');
  const [expandedManualId, setExpandedManualId] = useState(null);
  const [ascOpen, setAscOpen] = useState(null); // { topic, paragraph }
  const [fasbTerm, setFasbTerm] = useState(null); // FASB glossary entry in the sheet
  // The FASB glossary (~0.6 MB) loads the first time something is typed.
  const { glossary: fasbGlossary } = useAscGlossary(Boolean(debouncedQuery.trim()));

  const normalizedQuery = debouncedQuery.trim().toLowerCase();

  // Filter Tasks
  const filteredTasks = ALL_TASKS.filter((t) => {
    if (!normalizedQuery) return false;
    return (
      t.name.toLowerCase().includes(normalizedQuery) ||
      t.category.toLowerCase().includes(normalizedQuery) ||
      t.purpose.toLowerCase().includes(normalizedQuery) ||
      t.rootCause.toLowerCase().includes(normalizedQuery)
    );
  });

  // Filter Exceptions
  const filteredExceptions = EXCEPTION_PLAYBOOKS.filter((ex) => {
    if (!normalizedQuery) return true; // Show all playbooks when query empty
    return (
      ex.title.toLowerCase().includes(normalizedQuery) ||
      ex.code.toLowerCase().includes(normalizedQuery) ||
      ex.symptom.toLowerCase().includes(normalizedQuery) ||
      ex.rootCause.some((c) => c.toLowerCase().includes(normalizedQuery))
    );
  });


  // Filter 57 PDF Manuals
  const filteredManuals = PDF_CATALOG.filter((doc) => {
    if (!normalizedQuery) return false;
    return (
      doc.title.toLowerCase().includes(normalizedQuery) ||
      doc.category.toLowerCase().includes(normalizedQuery) ||
      doc.summary.toLowerCase().includes(normalizedQuery) ||
      doc.chapters.some((ch) => ch.toLowerCase().includes(normalizedQuery))
    );
  });

  // Fuzzy screen search over the compact pre-computed index (utils/screenIndex); no module detail is loaded
  const screenSearch = useMemo(
    () => searchScreens(debouncedQuery, { limit: MAX_SCREEN_RESULTS }),
    [debouncedQuery]
  );
  const filteredScreens = screenSearch.results;

  // US GAAP Codex: Topic number, title, alias ("VIE", "ROU") or a paragraph reference ("842-20-25-1")
  const ascSearch = useMemo(
    () => (debouncedQuery.trim() ? searchAsc(debouncedQuery, { limit: MAX_ASC_RESULTS }) : { results: [], total: 0, reference: null }),
    [debouncedQuery]
  );

  const fasbSearch = useMemo(
    () => (fasbGlossary && debouncedQuery.trim() ? searchGlossary(fasbGlossary, debouncedQuery, { limit: MAX_FASB_TERMS }) : { results: [], total: 0 }),
    [fasbGlossary, debouncedQuery]
  );

  // Filter Glossary
  const filteredGlossary = useMemo(() => {
    if (!normalizedQuery) return [];
    return GLOSSARY_TERMS.filter(
      (g) =>
        g.term.toLowerCase().includes(normalizedQuery) ||
        (g.acronym && g.acronym.toLowerCase() === normalizedQuery) ||
        g.definition.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);


  const show = (cat) => activeCategoryFilter === 'All' || activeCategoryFilter === cat;
  const sections = [];
  if (show('ASC') && ascSearch.results.length) {
    sections.push({
      key: 'asc',
      title: 'US GAAP Standards (ASC)',
      icon: 'library',
      color: COLORS.gold,
      count: ascSearch.total,
      note: ascSearch.reference && ascSearch.reference.paragraph ? `Opens paragraph ${ascSearch.reference.paragraph} in the official text.` : null,
      data: ascSearch.results.map((e) => ({ key: `a:${e.topic}`, type: 'asc', e })),
    });
  }
  if (show('Manuals') && filteredManuals.length) {
    sections.push({ key: 'manuals', title: 'Matching RealPage PDF Manuals', icon: 'document-text', color: COLORS.info, count: filteredManuals.length, data: filteredManuals.map((doc) => ({ key: `m:${doc.id}`, type: 'manual', doc })) });
  }
  if (show('Exceptions') && filteredExceptions.length) {
    sections.push({ key: 'exceptions', title: 'Exception Triage Playbooks', icon: 'alert-circle', color: COLORS.danger, count: filteredExceptions.length, note: EXCEPTION_CODE_NOTE, data: filteredExceptions.map((ex) => ({ key: `x:${ex.id}`, type: 'exception', ex })) });
  }
  if (show('Tasks') && filteredTasks.length) {
    sections.push({ key: 'tasks', title: 'Matching Tasks', icon: 'checkbox-outline', color: COLORS.success, count: filteredTasks.length, data: filteredTasks.map((t) => ({ key: `t:${t.id}`, type: 'task', t })) });
  }
  if (show('Screens') && filteredScreens.length) {
    sections.push({
      key: 'screens',
      title: 'Matching RealPage Screens',
      icon: 'desktop-outline',
      color: COLORS.info,
      count: screenSearch.total,
      note: screenSearch.total > MAX_SCREEN_RESULTS ? `Showing the best ${MAX_SCREEN_RESULTS} of ${screenSearch.total} matches — refine your search.` : null,
      data: filteredScreens.map((entry) => ({ key: `s:${entry.id}`, type: 'screen', entry })),
    });
  }
  if ((show('ASC') || show('Glossary')) && fasbSearch.results.length) {
    sections.push({
      key: 'fasb',
      title: 'FASB Glossary (ASC Definitions)',
      icon: 'book',
      color: COLORS.gold,
      count: fasbSearch.total,
      data: fasbSearch.results.map((g) => ({ key: `f:${g.term}`, type: 'fasb', g })),
    });
  }
  if (show('Glossary') && filteredGlossary.length) {
    sections.push({ key: 'glossary', title: 'Matching Accounting Terms', icon: 'book-outline', color: COLORS.yardi, count: filteredGlossary.length, data: filteredGlossary.slice(0, MAX_GLOSSARY_RESULTS).map((g) => ({ key: `g:${g.term}`, type: 'glossary', g })) });
  }

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHead}>
      <View style={styles.sectionTitleRow}>
        <Ionicons name={section.icon} size={17} color={section.color} />
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <View style={[styles.countBadge, { backgroundColor: `${section.color}26` }]}>
          <Text style={[styles.countBadgeText, { color: section.color }]}>{section.count}</Text>
        </View>
      </View>
      {section.note ? <Text style={styles.codeNote}>{section.note}</Text> : null}
    </View>
  );

  const renderItem = ({ item }) => {
    if (item.type === 'manual') return renderManual(item.doc);
    if (item.type === 'exception') return renderException(item.ex);
    if (item.type === 'task') return renderTask(item.t);
    if (item.type === 'screen') return renderScreen(item.entry);
    if (item.type === 'asc') return renderAsc(item.e);
    if (item.type === 'fasb') return renderFasbTerm(item.g);
    return renderGlossary(item.g);
  };

  const renderManual = (doc) => {
    const isExpanded = expandedManualId === doc.id;
    return (
      <View style={[styles.manualResultCard, isExpanded && styles.manualResultCardActive]}>
        <TouchableOpacity
          style={styles.manualResultHeader}
          onPress={() => {
            triggerHaptic('light');
            setExpandedManualId(isExpanded ? null : doc.id);
          }}
          activeOpacity={0.7}
        >
          <View style={styles.manualResultLeft}>
            <View style={styles.pdfIconBadge}>
              <Ionicons name="document-text" size={16} color={COLORS.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.manualResultTitle}>{doc.title}</Text>
              <Text style={styles.manualResultMeta}>
                {doc.category} • {doc.pages} pgs ({doc.sizeMb} MB) • {doc.docType}
              </Text>
            </View>
          </View>
          <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.manualResultBody}>
            <Text style={styles.manualResultSummary}>{doc.summary}</Text>
            {doc.chapters && doc.chapters.length > 0 && (
              <View style={styles.manualResultChapters}>
                <Text style={styles.chaptersHeader}>TOPICS & CHAPTERS:</Text>
                {doc.chapters.map((ch, i) => (
                  <View key={i} style={styles.chItem}>
                    <Ionicons name="checkmark-circle-outline" size={12} color={COLORS.info} />
                    <Text style={styles.chText}>{ch}</Text>
                  </View>
                ))}
              </View>
            )}
            <Text style={styles.manualResultFile}>File: 02 Property accounting/Real Page manuals/{doc.filename}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderException = (ex) => {
    const isExpanded = expandedExceptionId === ex.id;
    return (
      <View style={[styles.exceptionCard, isExpanded && styles.exceptionCardActive]}>
        <TouchableOpacity
          style={styles.exceptionHeader}
          onPress={() => {
            triggerHaptic('light');
            setExpandedExceptionId(isExpanded ? null : ex.id);
          }}
          activeOpacity={0.7}
        >
          <View style={styles.exceptionHeaderLeft}>
            <View style={[styles.severityPill, ex.severity === 'Critical' ? styles.severityCrit : styles.severityHigh]}>
              <Text style={styles.severityText}>{ex.code}</Text>
            </View>
            <View style={styles.exceptionTitleWrap}>
              <Text style={styles.exceptionTitle}>{ex.title}</Text>
              <Text style={styles.exceptionFreq}>
                {ex.frequency} • {ex.software}
              </Text>
            </View>
          </View>
          <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.exceptionBody}>
            <ExceptionTriageWizard playbook={ex} onOpenScreen={onOpenScreen} />
          </View>
        )}
      </View>
    );
  };

  const renderTask = (t) => (
    <TouchableOpacity
      style={styles.taskResultCard}
      onPress={() => {
        triggerHaptic('light');
        onSelectTask(t);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.taskResultTop}>
        <Text style={styles.taskResultPhase}>{t.phase}</Text>
        <Text style={styles.taskResultCat}>{t.category}</Text>
      </View>
      <Text style={styles.taskResultTitle}>{t.name}</Text>
      <Text style={styles.taskResultPurpose} numberOfLines={2}>
        {t.purpose}
      </Text>
    </TouchableOpacity>
  );

  // Screen hits render from the lightweight index; full detail loads when the SOP opens.
  const renderScreen = (entry) => (
    <TouchableOpacity
      style={styles.screenResultCard}
      activeOpacity={0.7}
      onPress={() => {
        triggerHaptic('light');
        onOpenScreen(entry.id, 'SEARCH RESULT');
      }}
    >
      <View style={styles.screenResultTop}>
        <View style={[styles.moduleDot, { backgroundColor: entry.moduleColor }]} />
        <Text style={styles.screenResultModule} numberOfLines={1}>
          {entry.moduleTitle} › {entry.category}
        </Text>
      </View>
      <Text style={styles.screenResultName}>{entry.name}</Text>
      <Text style={styles.screenResultBreadcrumbs} numberOfLines={2}>
        {entry.nav.replace(/ > /g, '  ›  ')}
      </Text>
      <View style={styles.authorityChip}>
        <Ionicons name="shield-checkmark-outline" size={11} color={COLORS.gold} />
        <Text style={styles.authorityChipText} numberOfLines={1}>
          {entry.authority}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderAsc = (e) => (
    <TouchableOpacity
      style={styles.ascResultCard}
      activeOpacity={0.7}
      onPress={() => {
        triggerHaptic('light');
        setAscOpen({ topic: e.topic, paragraph: ascSearch.reference ? ascSearch.reference.paragraph || null : null });
      }}
      accessibilityLabel={`ASC ${e.topic} ${e.title}`}
    >
      <TopicBadge entry={e} />
      <View style={styles.ascResultText}>
        <Text style={styles.ascResultTitle} numberOfLines={1}>
          {e.title}
        </Text>
        <Text style={styles.ascResultTag} numberOfLines={2}>
          {e.tag}
        </Text>
        {e.re ? <Text style={styles.ascResultRe}>{RE_LABEL[e.re]}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

  const renderFasbTerm = (g) => {
    const codes = g.defs.flatMap((d) => d.topics);
    const text = g.defs.length ? g.defs[0].text : g.master ? g.master.text : '';
    return (
      <TouchableOpacity style={styles.glossaryResultCard} onPress={() => setFasbTerm(g)} activeOpacity={0.7}>
        <Text style={[styles.glossaryTerm, { color: COLORS.gold }]}>{g.term}</Text>
        <Text style={styles.glossaryDef} numberOfLines={3}>
          {text}
        </Text>
        <Text style={styles.glossaryContext}>
          {codes.length ? `ASC ${codes.slice(0, 5).join(', ')}${codes.length > 5 ? ` +${codes.length - 5} more` : ''}` : 'FASB Master Glossary'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderGlossary = (g) => (
    <View style={styles.glossaryResultCard}>
      <Text style={styles.glossaryTerm}>{g.term}</Text>
      <Text style={styles.glossaryDef}>{g.definition}</Text>
      <Text style={styles.glossaryContext}>{g.context}</Text>
      {(g.relatedScreenIds || []).length > 0 && (
        <TouchableOpacity onPress={() => onOpenScreen(g.relatedScreenIds[0], `TERM · ${g.term.toUpperCase()}`)}>
          <Text style={styles.glossaryLink}>Open related screen SOP ›</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const categories = ['All', 'ASC', 'Manuals (57)', 'Exceptions', 'Tasks', 'Screens', 'Glossary'];

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchHeader}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${SCREEN_COUNT.toLocaleString()} screens, ${ASC_TOPIC_COUNT} ASC standards, 57 manuals, terms…`}
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearBtn}
            >
              <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChipScroll}>
          {categories.map((cat) => {
            const isSelected =
              activeCategoryFilter === cat ||
              (activeCategoryFilter === 'Manuals' && cat === 'Manuals (57)');
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => {
                  triggerHaptic('light');
                  setActiveCategoryFilter(cat === 'Manuals (57)' ? 'Manuals' : cat);
                }}
              >
                <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results: one virtualized list, one section per result type */}
      <SectionList
        style={styles.resultsScroll}
        contentContainerStyle={styles.resultsBody}
        sections={sections}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        extraData={`${expandedExceptionId}|${expandedManualId}`}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={9}
        removeClippedSubviews={Platform.OS === 'android'}
        ListEmptyComponent={
          searchQuery.length > 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={40} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No matching items found</Text>
              <Text style={styles.emptySubtitle}>Try searching for "AP", "Bank Rec", "Close", "Exception", "842" or "GPR".</Text>
            </View>
          ) : null
        }
      />

      <GlossaryTermModal
        entry={fasbTerm}
        onClose={() => setFasbTerm(null)}
        onOpenTopic={(topic) => {
          setFasbTerm(null);
          setAscOpen({ topic, paragraph: null });
        }}
      />

      <AscCardModal
        visible={Boolean(ascOpen)}
        topics={ascOpen ? [{ topic: ascOpen.topic }] : []}
        topic={ascOpen ? ascOpen.topic : null}
        paragraph={ascOpen ? ascOpen.paragraph : null}
        onSelect={(topic) => setAscOpen({ topic, paragraph: null })}
        onClose={() => setAscOpen(null)}
        contextLabel="Triage & Search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchHeader: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceInput,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    ...Platform.select({ web: { outlineStyle: 'none' }, default: {} }),
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
  },
  clearBtn: {
    padding: 4,
  },
  filterChipScroll: {
    paddingTop: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryLight,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  resultsScroll: {
    flex: 1,
  },
  resultsBody: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHead: {
    paddingTop: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 6,
  },
  countBadge: {
    backgroundColor: `${COLORS.danger}30`,
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 10,
    marginLeft: 8,
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.danger,
  },
  manualResultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  manualResultCardActive: {
    borderColor: COLORS.info,
  },
  manualResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  manualResultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  pdfIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: `${COLORS.danger}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  manualResultTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  manualResultMeta: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  manualResultBody: {
    backgroundColor: COLORS.surfaceInput,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  manualResultSummary: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: 8,
  },
  manualResultChapters: {
    backgroundColor: COLORS.surface,
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  chaptersHeader: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.primaryLight,
    marginBottom: 4,
  },
  chItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  chText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  manualResultFile: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  exceptionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  exceptionCardActive: {
    borderColor: COLORS.danger,
  },
  exceptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  exceptionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  severityPill: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 10,
  },
  severityCrit: {
    backgroundColor: COLORS.dangerDark,
  },
  severityHigh: {
    backgroundColor: COLORS.warningDark,
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  exceptionTitleWrap: {
    flex: 1,
  },
  exceptionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  exceptionFreq: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  exceptionBody: {
    padding: 14,
    backgroundColor: COLORS.surfaceInput,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  detailBlock: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
  },
  breadcrumbPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  breadcrumbText: {
    fontSize: 12,
    color: COLORS.info,
    fontWeight: '600',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 6,
    marginRight: 8,
  },
  bulletText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  sopStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  sopBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  sopNum: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  sopText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
    flex: 1,
  },
  glImpactCard: {
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.success,
    marginBottom: 10,
  },
  glImpactTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
    marginBottom: 4,
  },
  glImpactFormula: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
    marginBottom: 4,
  },
  glNextStep: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  proTipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${COLORS.gold}15`,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${COLORS.gold}40`,
  },
  proTipText: {
    fontSize: 11,
    color: COLORS.text,
    lineHeight: 16,
    marginLeft: 8,
    flex: 1,
  },
  taskResultCard: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  taskResultTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  taskResultPhase: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryLight,
    textTransform: 'uppercase',
  },
  taskResultCat: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  taskResultTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  taskResultPurpose: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  screenResultCard: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  screenResultTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  moduleDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  screenResultModule: {
    flex: 1,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: COLORS.textSecondary,
  },
  authorityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: '100%',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: `${COLORS.gold}4D`,
    backgroundColor: `${COLORS.gold}10`,
    marginTop: 2,
  },
  authorityChipText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: COLORS.gold,
    marginLeft: 4,
    flexShrink: 1,
  },
  screenResultName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  screenResultBreadcrumbs: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 6,
    lineHeight: 15,
  },
  codeNote: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 10,
    lineHeight: 16,
  },
  glossaryLink: {
    fontSize: 12,
    color: COLORS.info,
    fontWeight: '600',
    marginTop: 6,
  },
  ascResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: `${COLORS.gold}40`,
  },
  ascResultText: { flex: 1, marginLeft: 11, marginRight: 6 },
  ascResultTitle: { fontSize: 13.5, fontWeight: '700', color: COLORS.text },
  ascResultTag: { fontSize: 11.5, color: COLORS.textSecondary, lineHeight: 16, marginTop: 2 },
  ascResultRe: { fontSize: 9, fontWeight: '800', color: COLORS.success, letterSpacing: 0.6, marginTop: 4 },
  glossaryResultCard: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  glossaryTerm: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.yardi,
    marginBottom: 4,
  },
  glossaryDef: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: 4,
  },
  glossaryContext: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
