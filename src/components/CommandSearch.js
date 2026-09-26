import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { ALL_TASKS } from '../data/tasksData';
import { EXCEPTION_PLAYBOOKS } from '../data/exceptionsPlaybookData';
import { REALPAGE_MODULES } from '../data/realPageModulesData';
import { GLOSSARY_TERMS } from '../data/glossaryData';
import { PDF_CATALOG } from '../data/pdfCatalogData';
import { triggerHaptic } from '../utils/haptics';

// Flattened once: the nine module files hold several thousand screens.
const ALL_SCREENS = [];
REALPAGE_MODULES.forEach((mod) => {
  mod.submodules.forEach((sub) => {
    sub.screens.forEach((scr) => {
      ALL_SCREENS.push({ ...scr, moduleTitle: mod.title, moduleColor: mod.color });
    });
  });
});
const MAX_SCREEN_RESULTS = 50;

export default function CommandSearch({ onSelectTask, onSelectScreen }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All'); // 'All' | 'Manuals' | 'Exceptions' | 'Tasks' | 'Screens' | 'Glossary'
  const [expandedExceptionId, setExpandedExceptionId] = useState('ex_po_variance');
  const [expandedManualId, setExpandedManualId] = useState(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

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
      ex.whatTheReportIsFor.toLowerCase().includes(normalizedQuery)
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

  // Filter Screens (ALL_SCREENS is flattened once at module load — thousands of entries)
  const filteredScreens = ALL_SCREENS.filter((scr) => {
    if (!normalizedQuery) return false;
    return (
      scr.name.toLowerCase().includes(normalizedQuery) ||
      scr.purpose.toLowerCase().includes(normalizedQuery) ||
      scr.navigation.some((n) => n.toLowerCase().includes(normalizedQuery))
    );
  });

  // Filter Glossary
  const filteredGlossary = GLOSSARY_TERMS.filter((g) => {
    if (!normalizedQuery) return false;
    return (
      g.term.toLowerCase().includes(normalizedQuery) ||
      g.definition.toLowerCase().includes(normalizedQuery)
    );
  });

  const categories = ['All', 'Manuals (57)', 'Exceptions', 'Tasks', 'Screens', 'Glossary'];

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchHeader}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={18} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search all 57 manuals, exceptions, tasks, screens..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            autoCapitalize="none"
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

      {/* Results Content */}
      <ScrollView style={styles.resultsScroll} contentContainerStyle={styles.resultsBody}>
        {/* MATCHING 57 PDF MANUALS */}
        {(activeCategoryFilter === 'All' || activeCategoryFilter === 'Manuals') && filteredManuals.length > 0 && (
          <View style={styles.sectionGroup}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="document-text" size={18} color={COLORS.info} />
              <Text style={styles.sectionTitle}>Matching RealPage PDF Manuals</Text>
              <View style={[styles.countBadge, { backgroundColor: `${COLORS.info}30` }]}>
                <Text style={[styles.countBadgeText, { color: COLORS.info }]}>{filteredManuals.length}</Text>
              </View>
            </View>

            {filteredManuals.map((doc) => {
              const isExpanded = expandedManualId === doc.id;
              return (
                <View key={doc.id} style={[styles.manualResultCard, isExpanded && styles.manualResultCardActive]}>
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
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={COLORS.textSecondary}
                    />
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
                      <Text style={styles.manualResultFile}>
                        File: 02 Property accounting/Real Page manuals/{doc.filename}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* EXCEPTION PLAYBOOKS SECTION */}
        {(activeCategoryFilter === 'All' || activeCategoryFilter === 'Exceptions') && filteredExceptions.length > 0 && (
          <View style={styles.sectionGroup}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
              <Text style={styles.sectionTitle}>Exception Triage Playbooks</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{filteredExceptions.length}</Text>
              </View>
            </View>

            {filteredExceptions.map((ex) => {
              const isExpanded = expandedExceptionId === ex.id;
              return (
                <View key={ex.id} style={[styles.exceptionCard, isExpanded && styles.exceptionCardActive]}>
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
                        <Text style={styles.exceptionFreq}>{ex.frequency} • {ex.software}</Text>
                      </View>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={COLORS.textSecondary}
                    />
                  </TouchableOpacity>

                  {/* Expanded Playbook Details */}
                  {isExpanded && (
                    <View style={styles.exceptionBody}>
                      {/* Nav Path */}
                      <View style={styles.detailBlock}>
                        <Text style={styles.detailLabel}>EXACT REALPAGE NAVIGATION</Text>
                        <View style={styles.breadcrumbPill}>
                          <Ionicons name="compass-outline" size={13} color={COLORS.info} style={{ marginRight: 6 }} />
                          <Text style={styles.breadcrumbText}>{ex.navigation.realpage.join('  ›  ')}</Text>
                        </View>
                      </View>

                      {/* What It's For */}
                      <View style={styles.detailBlock}>
                        <Text style={styles.detailLabel}>WHAT THIS REPORT / QUEUE IS FOR</Text>
                        <Text style={styles.detailText}>{ex.whatTheReportIsFor}</Text>
                      </View>

                      {/* Why It Happens */}
                      <View style={styles.detailBlock}>
                        <Text style={[styles.detailLabel, { color: COLORS.danger }]}>WHY RECORDS ARE HERE (ROOT CAUSE)</Text>
                        {ex.whyItHappens.map((cause, i) => (
                          <View key={i} style={styles.bulletRow}>
                            <View style={[styles.bulletDot, { backgroundColor: COLORS.danger }]} />
                            <Text style={styles.bulletText}>{cause}</Text>
                          </View>
                        ))}
                      </View>

                      {/* Resolution SOP */}
                      <View style={styles.detailBlock}>
                        <Text style={[styles.detailLabel, { color: COLORS.primaryLight }]}>STEP-BY-STEP RESOLUTION SOP</Text>
                        {ex.resolutionSOP.map((step, i) => (
                          <View key={i} style={styles.sopStep}>
                            <View style={styles.sopBadge}>
                              <Text style={styles.sopNum}>{i + 1}</Text>
                            </View>
                            <Text style={styles.sopText}>{step}</Text>
                          </View>
                        ))}
                      </View>

                      {/* GL Impact */}
                      <View style={styles.glImpactCard}>
                        <Text style={styles.glImpactTitle}>DOWNSTREAM GL IMPACT & NEXT STEP</Text>
                        <Text style={styles.glImpactFormula}>{ex.downstreamImpact.glPosting}</Text>
                        <Text style={styles.glNextStep}>Next: {ex.downstreamImpact.workflowNextStep}</Text>
                      </View>

                      {/* Pro Tip */}
                      <View style={styles.proTipBox}>
                        <Ionicons name="sparkles" size={14} color={COLORS.gold} />
                        <Text style={styles.proTipText}>{ex.proTip}</Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* TASKS MATCHING SEARCH */}
        {(activeCategoryFilter === 'All' || activeCategoryFilter === 'Tasks') && filteredTasks.length > 0 && (
          <View style={styles.sectionGroup}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="checkbox-outline" size={18} color={COLORS.success} />
              <Text style={styles.sectionTitle}>Matching Tasks</Text>
              <View style={[styles.countBadge, { backgroundColor: `${COLORS.success}30` }]}>
                <Text style={[styles.countBadgeText, { color: COLORS.success }]}>{filteredTasks.length}</Text>
              </View>
            </View>

            {filteredTasks.map((t) => (
              <TouchableOpacity
                key={t.id}
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
                <Text style={styles.taskResultPurpose} numberOfLines={2}>{t.purpose}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* SCREENS MATCHING SEARCH */}
        {(activeCategoryFilter === 'All' || activeCategoryFilter === 'Screens') && filteredScreens.length > 0 && (
          <View style={styles.sectionGroup}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="desktop-outline" size={18} color={COLORS.info} />
              <Text style={styles.sectionTitle}>Matching RealPage Screens</Text>
              <View style={[styles.countBadge, { backgroundColor: `${COLORS.info}30` }]}>
                <Text style={[styles.countBadgeText, { color: COLORS.info }]}>{filteredScreens.length}</Text>
              </View>
            </View>

            {filteredScreens.length > MAX_SCREEN_RESULTS && (
              <Text style={styles.screenResultBreadcrumbs}>
                Showing the first {MAX_SCREEN_RESULTS} of {filteredScreens.length} matches — refine your search.
              </Text>
            )}
            {filteredScreens.slice(0, MAX_SCREEN_RESULTS).map((scr) => (
              <View key={scr.id} style={styles.screenResultCard}>
                <Text style={[styles.screenResultModule, { color: scr.moduleColor }]}>{scr.moduleTitle}</Text>
                <Text style={styles.screenResultName}>{scr.name}</Text>
                <Text style={styles.screenResultBreadcrumbs}>{scr.navigation.join('  ›  ')}</Text>
                <Text style={styles.screenResultPurpose} numberOfLines={2}>{scr.purpose}</Text>
                {scr.pdfManualSource ? (
                  <Text style={styles.screenResultBreadcrumbs} numberOfLines={1}>{scr.pdfManualSource}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}

        {/* GLOSSARY MATCHING SEARCH */}
        {(activeCategoryFilter === 'All' || activeCategoryFilter === 'Glossary') && filteredGlossary.length > 0 && (
          <View style={styles.sectionGroup}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="book-outline" size={18} color={COLORS.yardi} />
              <Text style={styles.sectionTitle}>Matching Accounting Terms</Text>
              <View style={[styles.countBadge, { backgroundColor: `${COLORS.yardi}30` }]}>
                <Text style={[styles.countBadgeText, { color: COLORS.yardi }]}>{filteredGlossary.length}</Text>
              </View>
            </View>

            {filteredGlossary.map((g, idx) => (
              <View key={idx} style={styles.glossaryResultCard}>
                <Text style={styles.glossaryTerm}>{g.term}</Text>
                <Text style={styles.glossaryDef}>{g.definition}</Text>
                <Text style={styles.glossaryContext}>Context: {g.context}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Empty state when searching and no results */}
        {searchQuery.length > 0 &&
          filteredTasks.length === 0 &&
          filteredExceptions.length === 0 &&
          filteredScreens.length === 0 &&
          filteredGlossary.length === 0 &&
          filteredManuals.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={40} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>No matching items found</Text>
              <Text style={styles.emptySubtitle}>Try searching for "AP", "Bank Rec", "Close", "Exception", or "GPR".</Text>
            </View>
          )}
      </ScrollView>
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
  sectionGroup: {
    marginBottom: 24,
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
  screenResultModule: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  screenResultName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  screenResultBreadcrumbs: {
    fontSize: 11,
    color: COLORS.info,
    marginBottom: 4,
  },
  screenResultPurpose: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
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
