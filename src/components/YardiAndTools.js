import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { GLOSSARY_TERMS, YARDI_CROSS_REFERENCE } from '../data/glossaryData';
import { ALL_TASKS } from '../data/tasksData';
import { PDF_CATALOG, PDF_CATEGORIES } from '../data/pdfCatalogData';
import { triggerHaptic } from '../utils/haptics';

export default function YardiAndTools({
  bookmarkedIds = [],
  taskNotes = {},
  onSelectTask,
}) {
  const [activeSubTab, setActiveSubTab] = useState('manuals'); // 'manuals' | 'yardi' | 'glossary' | 'bookmarks'
  const [glossarySearch, setGlossarySearch] = useState('');
  const [manualSearch, setManualSearch] = useState('');
  const [selectedManualCat, setSelectedManualCat] = useState('All 57 Manuals');
  const [expandedManualId, setExpandedManualId] = useState(null);

  const bookmarkedTasks = ALL_TASKS.filter((t) => bookmarkedIds.includes(t.id));
  const notedTasks = ALL_TASKS.filter((t) => taskNotes[t.id]);

  const filteredGlossary = GLOSSARY_TERMS.filter((g) => {
    if (!glossarySearch.trim()) return true;
    const q = glossarySearch.trim().toLowerCase();
    return g.term.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q);
  });

  const filteredManuals = PDF_CATALOG.filter((doc) => {
    if (selectedManualCat !== 'All 57 Manuals' && doc.category !== selectedManualCat) return false;
    if (!manualSearch.trim()) return true;
    const q = manualSearch.trim().toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q) ||
      doc.summary.toLowerCase().includes(q) ||
      doc.chapters.some((ch) => ch.toLowerCase().includes(q))
    );
  });

  return (
    <View style={styles.container}>
      {/* Sub-tab Switcher Bar */}
      <View style={styles.subTabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subTabScroll}>
          <TouchableOpacity
            style={[styles.subTabButton, activeSubTab === 'manuals' && styles.subTabButtonActive]}
            onPress={() => {
              triggerHaptic('light');
              setActiveSubTab('manuals');
            }}
          >
            <Ionicons
              name="document-text"
              size={13}
              color={activeSubTab === 'manuals' ? '#FFFFFF' : COLORS.textSecondary}
            />
            <Text style={[styles.subTabText, activeSubTab === 'manuals' && styles.subTabTextActive]}>
              57 Manuals ({PDF_CATALOG.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabButton, activeSubTab === 'yardi' && styles.subTabButtonActive]}
            onPress={() => {
              triggerHaptic('light');
              setActiveSubTab('yardi');
            }}
          >
            <Ionicons
              name="layers"
              size={13}
              color={activeSubTab === 'yardi' ? '#FFFFFF' : COLORS.textSecondary}
            />
            <Text style={[styles.subTabText, activeSubTab === 'yardi' && styles.subTabTextActive]}>
              Yardi vs RealPage
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabButton, activeSubTab === 'glossary' && styles.subTabButtonActive]}
            onPress={() => {
              triggerHaptic('light');
              setActiveSubTab('glossary');
            }}
          >
            <Ionicons
              name="book"
              size={13}
              color={activeSubTab === 'glossary' ? '#FFFFFF' : COLORS.textSecondary}
            />
            <Text style={[styles.subTabText, activeSubTab === 'glossary' && styles.subTabTextActive]}>
              US RE Glossary
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.subTabButton, activeSubTab === 'bookmarks' && styles.subTabButtonActive]}
            onPress={() => {
              triggerHaptic('light');
              setActiveSubTab('bookmarks');
            }}
          >
            <Ionicons
              name="bookmark"
              size={13}
              color={activeSubTab === 'bookmarks' ? '#FFFFFF' : COLORS.textSecondary}
            />
            <Text style={[styles.subTabText, activeSubTab === 'bookmarks' && styles.subTabTextActive]}>
              Saved ({bookmarkedTasks.length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Main Content Area */}
      <ScrollView style={styles.contentScroll} contentContainerStyle={styles.contentBody}>
        {/* SUBTAB 1: 57 REALPAGE PDF MANUALS LIBRARY */}
        {activeSubTab === 'manuals' && (
          <View>
            <View style={styles.manualsBanner}>
              <View style={styles.manualsBannerTop}>
                <Ionicons name="library" size={18} color={COLORS.info} />
                <Text style={styles.manualsBannerTitle}>RealPage Official User Guides Library</Text>
              </View>
              <Text style={styles.manualsBannerDesc}>
                All 57 official RealPage manuals from your workspace are indexed here. Search any manual to see its exact chapters, page count, and topics covered.
              </Text>
            </View>

            {/* Search Input for Manuals */}
            <View style={styles.searchBarContainer}>
              <Ionicons name="search" size={16} color={COLORS.textSecondary} />
              <TextInput
                style={styles.searchBarInput}
                placeholder="Search all 57 manuals (e.g. AP, Bank Rec, Close, Reports)..."
                placeholderTextColor={COLORS.textMuted}
                value={manualSearch}
                onChangeText={setManualSearch}
              />
              {manualSearch.length > 0 && (
                <TouchableOpacity onPress={() => setManualSearch('')}>
                  <Ionicons name="close-circle" size={16} color={COLORS.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Category Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
              {PDF_CATEGORIES.map((cat) => {
                const isSelected = selectedManualCat === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.catChip, isSelected && styles.catChipActive]}
                    onPress={() => {
                      triggerHaptic('light');
                      setSelectedManualCat(cat);
                    }}
                  >
                    <Text style={[styles.catChipText, isSelected && styles.catChipTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.resultsCountText}>
              Showing {filteredManuals.length} of 57 RealPage Manuals
            </Text>

            {/* Manual Cards */}
            {filteredManuals.map((doc) => {
              const isExpanded = expandedManualId === doc.id;
              return (
                <View key={doc.id} style={[styles.manualCard, isExpanded && styles.manualCardActive]}>
                  <TouchableOpacity
                    style={styles.manualHeader}
                    onPress={() => {
                      triggerHaptic('light');
                      setExpandedManualId(isExpanded ? null : doc.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.manualHeaderLeft}>
                      <View style={styles.pdfIconBadge}>
                        <Ionicons name="document-text" size={16} color={COLORS.danger} />
                      </View>
                      <View style={styles.manualTitleWrap}>
                        <Text style={styles.manualTitleText}>{doc.title}</Text>
                        <View style={styles.manualMetaRow}>
                          <Text style={styles.manualMetaCategory}>{doc.category}</Text>
                          <Text style={styles.manualMetaDot}>•</Text>
                          <Text style={styles.manualMetaPages}>{doc.pages} pages ({doc.sizeMb} MB)</Text>
                          <Text style={styles.manualMetaDot}>•</Text>
                          <View style={styles.docTypeBadge}>
                            <Text style={styles.docTypeText}>{doc.docType}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={COLORS.textSecondary}
                    />
                  </TouchableOpacity>

                  {/* Expanded Manual Overview */}
                  {isExpanded && (
                    <View style={styles.manualBody}>
                      <Text style={styles.manualSummaryLabel}>OFFICIAL MANUAL OVERVIEW</Text>
                      <Text style={styles.manualSummaryText}>{doc.summary}</Text>

                      {doc.chapters && doc.chapters.length > 0 && (
                        <View style={styles.chaptersBlock}>
                          <Text style={styles.chaptersLabel}>KEY CHAPTERS & TOPICS COVERED</Text>
                          {doc.chapters.map((ch, i) => (
                            <View key={i} style={styles.chapterItem}>
                              <Ionicons name="checkmark-circle-outline" size={13} color={COLORS.info} />
                              <Text style={styles.chapterText}>{ch}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      <View style={styles.manualFilePathBox}>
                        <Ionicons name="folder-outline" size={12} color={COLORS.textMuted} />
                        <Text style={styles.manualFilePathText} numberOfLines={1}>
                          02 Property accounting/Real Page manuals/{doc.filename}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* SUBTAB 2: YARDI VOYAGER CROSS-REFERENCE */}
        {activeSubTab === 'yardi' && (
          <View>
            <View style={styles.bannerBox}>
              <View style={styles.bannerHeader}>
                <Ionicons name="swap-horizontal" size={18} color={COLORS.yardi} />
                <Text style={styles.bannerTitle}>RealPage vs Yardi Voyager Workflows</Text>
              </View>
              <Text style={styles.bannerText}>
                Offshore US property portfolios often split properties between RealPage and Yardi Voyager (e.g. Goldman Sachs portfolios in your tracker). Use this reference to quickly translate processes between both systems.
              </Text>
            </View>

            {YARDI_CROSS_REFERENCE.map((ref, idx) => (
              <View key={idx} style={styles.comparisonCard}>
                <Text style={styles.comparisonAreaTitle}>{ref.area}</Text>

                {/* RealPage Column */}
                <View style={styles.systemBoxRP}>
                  <View style={styles.systemHeader}>
                    <Ionicons name="cube" size={13} color={COLORS.info} />
                    <Text style={styles.systemNameRP}>RealPage Financial Suite</Text>
                  </View>
                  <Text style={styles.systemMenu}>{ref.realpage.menu}</Text>
                  <Text style={styles.systemConcept}>{ref.realpage.concept}</Text>
                </View>

                {/* Yardi Column */}
                <View style={styles.systemBoxYardi}>
                  <View style={styles.systemHeader}>
                    <Ionicons name="layers" size={13} color={COLORS.yardi} />
                    <Text style={styles.systemNameYardi}>Yardi Voyager</Text>
                  </View>
                  <Text style={styles.systemMenu}>{ref.yardi.menu}</Text>
                  <Text style={styles.systemConcept}>{ref.yardi.concept}</Text>
                </View>

                {/* Key Difference Callout */}
                <View style={styles.keyDiffBox}>
                  <Ionicons name="key-outline" size={14} color={COLORS.gold} />
                  <Text style={styles.keyDiffText}>
                    <Text style={{ fontWeight: '700', color: COLORS.gold }}>Crucial Difference: </Text>
                    {ref.keyDifferences}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* SUBTAB 3: OFFSHORE US REAL ESTATE GLOSSARY */}
        {activeSubTab === 'glossary' && (
          <View>
            {/* Search Input for Glossary */}
            <View style={styles.glossarySearchInputWrap}>
              <Ionicons name="search" size={16} color={COLORS.textSecondary} />
              <TextInput
                style={styles.glossarySearchInput}
                placeholder="Search US RE accounting terms (e.g. AME, MOR, GPR)..."
                placeholderTextColor={COLORS.textMuted}
                value={glossarySearch}
                onChangeText={setGlossarySearch}
              />
            </View>

            {filteredGlossary.map((g, idx) => (
              <View key={idx} style={styles.glossaryCard}>
                <View style={styles.glossaryTop}>
                  <Text style={styles.glossaryTermTitle}>{g.term}</Text>
                  <View style={styles.glossaryCatBadge}>
                    <Text style={styles.glossaryCatText}>{g.category}</Text>
                  </View>
                </View>

                <Text style={styles.glossaryDefText}>{g.definition}</Text>

                <View style={styles.glossaryMetaBlock}>
                  <Text style={styles.glossaryMetaLabel}>Offshore Tracker Context:</Text>
                  <Text style={styles.glossaryMetaText}>{g.context}</Text>
                </View>

                <View style={styles.glossaryWhyBlock}>
                  <Text style={styles.glossaryWhyLabel}>Why It Matters:</Text>
                  <Text style={styles.glossaryWhyText}>{g.whyItMatters}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* SUBTAB 4: SAVED BOOKMARKS & NOTES */}
        {activeSubTab === 'bookmarks' && (
          <View>
            {/* Bookmarked Tasks */}
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="bookmark" size={18} color={COLORS.gold} />
              <Text style={styles.sectionTitleText}>Bookmarked Mastery Tasks ({bookmarkedTasks.length})</Text>
            </View>

            {bookmarkedTasks.length > 0 ? (
              bookmarkedTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={styles.savedCard}
                  onPress={() => {
                    triggerHaptic('light');
                    onSelectTask(task);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.savedCardTop}>
                    <Text style={styles.savedPhase}>{task.phase}</Text>
                    <Text style={styles.savedCat}>{task.category}</Text>
                  </View>
                  <Text style={styles.savedTitle}>{task.name}</Text>
                  <Text style={styles.savedNav}>{task.navigation.realpage.join('  ›  ')}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No bookmarked tasks yet. Tap the bookmark icon on any task card to save it here for quick access.</Text>
              </View>
            )}

            {/* Custom Notes */}
            <View style={[styles.sectionHeaderRow, { marginTop: 24 }]}>
              <Ionicons name="document-text" size={18} color={COLORS.primaryLight} />
              <Text style={styles.sectionTitleText}>My Custom Notes ({notedTasks.length})</Text>
            </View>

            {notedTasks.length > 0 ? (
              notedTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={styles.savedCard}
                  onPress={() => {
                    triggerHaptic('light');
                    onSelectTask(task);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.savedTitle}>{task.name}</Text>
                  <View style={styles.savedNoteBubble}>
                    <Text style={styles.savedNoteContent}>{taskNotes[task.id]}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>No custom notes yet. Open any task and tap "+ Add Note" to record reminders or property-specific rules.</Text>
              </View>
            )}
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
  subTabBar: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  subTabScroll: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  subTabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  subTabButtonActive: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryLight,
  },
  subTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: 5,
  },
  subTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  contentScroll: {
    flex: 1,
  },
  contentBody: {
    padding: 16,
    paddingBottom: 40,
  },
  manualsBanner: {
    backgroundColor: `${COLORS.info}15`,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: `${COLORS.info}30`,
    marginBottom: 14,
  },
  manualsBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  manualsBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 6,
  },
  manualsBannerDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  searchBarInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    marginLeft: 8,
  },
  categoryScroll: {
    paddingBottom: 10,
    gap: 6,
  },
  catChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  catChipActive: {
    backgroundColor: COLORS.infoDark,
    borderColor: COLORS.info,
  },
  catChipText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  catChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  resultsCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 10,
  },
  manualCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  manualCardActive: {
    borderColor: COLORS.info,
  },
  manualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  manualHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  pdfIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `${COLORS.danger}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  manualTitleWrap: {
    flex: 1,
  },
  manualTitleText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 3,
  },
  manualMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  manualMetaCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.info,
  },
  manualMetaDot: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginHorizontal: 4,
  },
  manualMetaPages: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  docTypeBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  docTypeText: {
    fontSize: 9,
    color: COLORS.primaryLight,
    fontWeight: '600',
  },
  manualBody: {
    backgroundColor: COLORS.surfaceInput,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  manualSummaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  manualSummaryText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
    marginBottom: 10,
  },
  chaptersBlock: {
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  chaptersLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryLight,
    marginBottom: 6,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  chapterText: {
    fontSize: 11,
    color: COLORS.text,
    marginLeft: 6,
    flex: 1,
  },
  manualFilePathBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  manualFilePathText: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  bannerBox: {
    backgroundColor: `${COLORS.yardi}15`,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: `${COLORS.yardi}30`,
    marginBottom: 16,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 6,
  },
  bannerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  comparisonCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  comparisonAreaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  systemBoxRP: {
    backgroundColor: COLORS.surfaceInput,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.info,
    marginBottom: 10,
  },
  systemBoxYardi: {
    backgroundColor: COLORS.surfaceInput,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.yardi,
    marginBottom: 10,
  },
  systemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  systemNameRP: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.info,
    marginLeft: 6,
  },
  systemNameYardi: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.yardi,
    marginLeft: 6,
  },
  systemMenu: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  systemConcept: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  keyDiffBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${COLORS.gold}15`,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${COLORS.gold}30`,
    marginTop: 4,
  },
  keyDiffText: {
    fontSize: 11,
    color: COLORS.text,
    lineHeight: 16,
    marginLeft: 8,
    flex: 1,
  },
  glossarySearchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  glossarySearchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    marginLeft: 8,
  },
  glossaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  glossaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  glossaryTermTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  glossaryCatBadge: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  glossaryCatText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primaryLight,
  },
  glossaryDefText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 19,
    marginBottom: 10,
  },
  glossaryMetaBlock: {
    backgroundColor: COLORS.surfaceInput,
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  glossaryMetaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  glossaryMetaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  glossaryWhyBlock: {
    backgroundColor: `${COLORS.success}10`,
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
  },
  glossaryWhyLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  glossaryWhyText: {
    fontSize: 11,
    color: COLORS.text,
    lineHeight: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 6,
  },
  savedCard: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  savedCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  savedPhase: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryLight,
    textTransform: 'uppercase',
  },
  savedCat: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  savedTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  savedNav: {
    fontSize: 11,
    color: COLORS.info,
  },
  savedNoteBubble: {
    backgroundColor: COLORS.surfaceInput,
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primaryLight,
  },
  savedNoteContent: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 17,
  },
  emptyCard: {
    backgroundColor: COLORS.surfaceLight,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});
