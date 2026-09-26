import React, { useMemo, useState } from 'react';
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
import {
  GLOSSARY_TERMS,
  ACRONYM_TERMS,
  GLOSSARY_CATEGORIES,
  MODULE_FILE_TITLES,
  MULTIFAMILY_TERMS,
  REALPAGE_GLOSSARY_STATS,
} from '../data/glossaryData';
import {
  ROSETTA_OPERATIONS,
  ROSETTA_CATEGORIES,
  ROSETTA_CADENCES,
  ROSETTA_DISCLAIMER,
} from '../data/rosettaStoneData';
import { getScreenEntry } from '../utils/screenIndex';
import { Breadcrumbs, SegmentedToggle } from './ui';
import useDebouncedValue from '../utils/useDebouncedValue';
import { ALL_TASKS } from '../data/tasksData';
import { PDF_CATALOG, PDF_CATEGORIES } from '../data/pdfCatalogData';
import { triggerHaptic } from '../utils/haptics';

const GLOSSARY_PAGE = 40;

// ─────────────────────────── RealPage ↔ Yardi Rosetta Stone ───────────────────────────
function RosettaStone({ onOpenScreen }) {
  const [direction, setDirection] = useState('rp2y'); // 'rp2y' | 'y2rp'
  const [category, setCategory] = useState('All');
  const [cadence, setCadence] = useState('All');
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState(ROSETTA_OPERATIONS[0].id);
  const q = useDebouncedValue(query, 150).trim().toLowerCase();

  const rows = useMemo(
    () =>
      ROSETTA_OPERATIONS.filter((op) => {
        if (category !== 'All' && op.category !== category) return false;
        if (cadence !== 'All' && op.cadence !== cadence) return false;
        if (!q) return true;
        const hay = [
          op.title,
          op.realpage.name,
          op.realpage.howItWorks,
          op.yardi.name,
          op.yardi.howItWorks,
          op.yardi.navigation.join(' '),
          ...op.terminology.map((t) => `${t.realpage} ${t.yardi} ${t.note}`),
          ...op.pitfalls,
        ]
          .join(' ')
          .toLowerCase();
        return q.split(/\s+/).every((tok) => hay.includes(tok));
      }),
    [category, cadence, q]
  );

  const renderSystem = (op, system) => {
    const isRP = system === 'rp';
    const entry = isRP ? getScreenEntry(op.realpage.screenId) : null;
    const nav = isRP ? (entry ? entry.navParts : []) : op.yardi.navigation;
    const side = isRP ? op.realpage : op.yardi;
    return (
      <View key={system} style={isRP ? styles.systemBoxRP : styles.systemBoxYardi}>
        <View style={styles.systemHeader}>
          <Ionicons name={isRP ? 'cube' : 'layers'} size={13} color={isRP ? COLORS.info : COLORS.yardi} />
          <Text style={isRP ? styles.systemNameRP : styles.systemNameYardi}>
            {isRP ? 'RealPage' : 'Yardi Voyager'} · {side.name}
          </Text>
        </View>
        <View style={styles.systemCrumbs}>
          <Breadcrumbs parts={nav} accent={isRP ? COLORS.info : COLORS.yardi} />
        </View>
        <Text style={styles.systemConcept}>{side.howItWorks}</Text>
        {isRP && entry ? (
          <TouchableOpacity
            style={styles.rosettaSopBtn}
            onPress={() => onOpenScreen(op.realpage.screenId, `ROSETTA · ${op.title.toUpperCase()}`)}
          >
            <Ionicons name="play-circle-outline" size={14} color={COLORS.info} />
            <Text style={styles.rosettaSopText}>Open RealPage click-by-click SOP</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const order = direction === 'rp2y' ? ['rp', 'yardi'] : ['yardi', 'rp'];

  return (
    <View>
      <View style={styles.bannerBox}>
        <View style={styles.bannerHeader}>
          <Ionicons name="swap-horizontal" size={18} color={COLORS.yardi} />
          <Text style={styles.bannerTitle}>RealPage ↔ Yardi Voyager Rosetta Stone</Text>
        </View>
        <Text style={styles.bannerText}>
          {ROSETTA_OPERATIONS.length} daily, periodic and month-end operations translated side by side, with terminology differences and switching pitfalls. RealPage paths come from the linked manual screen.
        </Text>
        <Text style={styles.disclaimerText}>{ROSETTA_DISCLAIMER}</Text>
      </View>

      <View style={styles.directionRow}>
        <SegmentedToggle
          accent={COLORS.yardi}
          value={direction}
          onChange={(key) => {
            triggerHaptic('light');
            setDirection(key);
          }}
          options={[
            { key: 'rp2y', label: 'RealPage → Yardi', icon: 'cube-outline' },
            { key: 'y2rp', label: 'Yardi → RealPage', icon: 'layers-outline' },
          ]}
        />
      </View>

      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={16} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchBarInput}
          placeholder="Search operations, menus or terms (e.g. Copy Batch, Positive Pay, Post Month)..."
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        {ROSETTA_CATEGORIES.map((c) => (
          <TouchableOpacity key={c} style={[styles.catChip, category === c && styles.catChipActive]} onPress={() => setCategory(c)}>
            <Text style={[styles.catChipText, category === c && styles.catChipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        {ROSETTA_CADENCES.map((c) => (
          <TouchableOpacity key={c} style={[styles.catChip, cadence === c && styles.catChipActive]} onPress={() => setCadence(c)}>
            <Text style={[styles.catChipText, cadence === c && styles.catChipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.resultsCountText}>
        Showing {rows.length} of {ROSETTA_OPERATIONS.length} operations
      </Text>

      {rows.map((op) => {
        const isOpen = expandedId === op.id;
        const leadName = direction === 'rp2y' ? op.realpage.name : op.yardi.name;
        const trailName = direction === 'rp2y' ? op.yardi.name : op.realpage.name;
        return (
          <View key={op.id} style={[styles.comparisonCard, isOpen && styles.comparisonCardOpen]}>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic('light');
                setExpandedId(isOpen ? null : op.id);
              }}
              activeOpacity={0.7}
              style={styles.comparisonHeader}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.comparisonMeta}>
                  {op.category} · {op.cadence}
                </Text>
                <Text style={styles.comparisonAreaTitle}>{op.title}</Text>
                <Text style={styles.comparisonPair} numberOfLines={2}>
                  {leadName}  ⇄  {trailName}
                </Text>
              </View>
              <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>

            {isOpen && (
              <View>
                {order.map((sys) => renderSystem(op, sys))}

                <Text style={styles.rosettaLabel}>TERMINOLOGY DIFFERENCES</Text>
                <View style={styles.termTable}>
                  <View style={styles.termHeadRow}>
                    <Text style={[styles.termCell, styles.termHead, { color: COLORS.info }]}>
                      {direction === 'rp2y' ? 'RealPage' : 'Yardi'}
                    </Text>
                    <Text style={[styles.termCell, styles.termHead, { color: COLORS.yardi }]}>
                      {direction === 'rp2y' ? 'Yardi' : 'RealPage'}
                    </Text>
                  </View>
                  {op.terminology.map((t, i) => (
                    <View key={i} style={styles.termRow}>
                      <View style={styles.termPair}>
                        <Text style={styles.termCell}>{direction === 'rp2y' ? t.realpage : t.yardi}</Text>
                        <Text style={styles.termCell}>{direction === 'rp2y' ? t.yardi : t.realpage}</Text>
                      </View>
                      <Text style={styles.termNote}>{t.note}</Text>
                    </View>
                  ))}
                </View>

                <Text style={[styles.rosettaLabel, { color: COLORS.danger }]}>PITFALLS WHEN SWITCHING PLATFORMS</Text>
                {op.pitfalls.map((p, i) => (
                  <View key={i} style={styles.pitfallRow}>
                    <Ionicons name="warning-outline" size={13} color={COLORS.danger} />
                    <Text style={styles.pitfallText}>{p}</Text>
                  </View>
                ))}

                <View style={styles.keyDiffBox}>
                  <Ionicons name="calculator-outline" size={14} color={COLORS.gold} />
                  <Text style={styles.keyDiffText}>
                    <Text style={{ fontWeight: '700', color: COLORS.gold }}>GL impact: </Text>
                    {op.glImpact}
                  </Text>
                </View>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

// ─────────────────────────── Property Accounting Encyclopedia ───────────────────────────
function GlossaryEncyclopedia({ onOpenScreen, onOpenModule }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [limit, setLimit] = useState(GLOSSARY_PAGE);
  const [spotlight, setSpotlight] = useState(null);
  const q = useDebouncedValue(query, 150).trim().toLowerCase();

  const rows = useMemo(
    () =>
      GLOSSARY_TERMS.filter((g) => {
        if (category !== 'All' && g.category !== category) return false;
        if (!q) return true;
        return (
          g.term.toLowerCase().includes(q) ||
          (g.acronym && g.acronym.toLowerCase().includes(q)) ||
          g.definition.toLowerCase().includes(q)
        );
      }),
    [q, category]
  );
  const acronyms = useMemo(() => ACRONYM_TERMS.filter((t) => MULTIFAMILY_TERMS.includes(t)), []);

  const renderTerm = (g, highlighted) => (
    <View key={g.term} style={[styles.glossaryCard, highlighted && styles.glossaryCardSpot]}>
      <View style={styles.glossaryTop}>
        <Text style={styles.glossaryTermTitle}>{g.term}</Text>
        <View style={styles.glossaryCatBadge}>
          <Text style={styles.glossaryCatText}>{g.category}</Text>
        </View>
      </View>
      <Text style={styles.glossaryDefText}>{g.definition}</Text>
      {g.context ? (
        <View style={styles.glossaryMetaBlock}>
          <Text style={styles.glossaryMetaLabel}>Context:</Text>
          <Text style={styles.glossaryMetaText}>{g.context}</Text>
        </View>
      ) : null}
      {g.whyItMatters ? (
        <View style={styles.glossaryWhyBlock}>
          <Text style={styles.glossaryWhyLabel}>Why It Matters:</Text>
          <Text style={styles.glossaryWhyText}>{g.whyItMatters}</Text>
        </View>
      ) : null}
      {g.yardiEquivalent ? <Text style={styles.glossaryYardi}>Yardi: {g.yardiEquivalent}</Text> : null}
      {(g.modules || []).length > 0 && (
        <View style={styles.moduleChipRow}>
          {g.modules.map((m) => (
            <TouchableOpacity key={m} style={styles.moduleChip} onPress={() => onOpenModule(m)}>
              <Ionicons name="desktop-outline" size={11} color={COLORS.info} />
              <Text style={styles.moduleChipText}>{MODULE_FILE_TITLES[m] || m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {(g.relatedScreenIds || []).map((id) => {
        const e = getScreenEntry(id);
        if (!e) return null;
        return (
          <TouchableOpacity key={id} onPress={() => onOpenScreen(id, `TERM · ${g.term.toUpperCase()}`)}>
            <Text style={styles.relatedScreenLink} numberOfLines={1}>
              › {e.name} ({e.moduleShortCode})
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View>
      <View style={styles.bannerBox}>
        <View style={styles.bannerHeader}>
          <Ionicons name="library" size={18} color={COLORS.gold} />
          <Text style={styles.bannerTitle}>Property Accounting Encyclopedia</Text>
        </View>
        <Text style={styles.bannerText}>
          {GLOSSARY_TERMS.length} terms: {MULTIFAMILY_TERMS.length} US multifamily acronyms and terms plus{' '}
          {REALPAGE_GLOSSARY_STATS.uniqueTerms} RealPage terms merged from {REALPAGE_GLOSSARY_STATS.entries} manual glossary entries. Each term links to its RealPage modules and screens.
        </Text>
      </View>

      <Text style={styles.acronymBarLabel}>ONE-CLICK ACRONYMS</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        {acronyms.map((t) => (
          <TouchableOpacity
            key={t.term}
            style={[styles.acronymChip, spotlight === t.term && styles.acronymChipActive]}
            onPress={() => {
              triggerHaptic('light');
              setSpotlight(spotlight === t.term ? null : t.term);
            }}
          >
            <Text style={styles.acronymChipText}>{t.acronym}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {spotlight ? renderTerm(GLOSSARY_TERMS.find((t) => t.term === spotlight), true) : null}

      <View style={styles.glossarySearchInputWrap}>
        <Ionicons name="search" size={16} color={COLORS.textSecondary} />
        <TextInput
          style={styles.glossarySearchInput}
          placeholder="Search terms (e.g. GPR, retainage, draw model, work paper)..."
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={(t) => {
            setQuery(t);
            setLimit(GLOSSARY_PAGE);
          }}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        {GLOSSARY_CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.catChip, category === c && styles.catChipActive]}
            onPress={() => {
              setCategory(c);
              setLimit(GLOSSARY_PAGE);
            }}
          >
            <Text style={[styles.catChipText, category === c && styles.catChipTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.resultsCountText}>
        {rows.length} matching terms{rows.length > limit ? ` (showing ${limit})` : ''}
      </Text>

      {rows.slice(0, limit).map((g) => renderTerm(g, false))}

      {rows.length > limit && (
        <TouchableOpacity style={styles.showMoreBtn} onPress={() => setLimit(limit + GLOSSARY_PAGE)}>
          <Text style={styles.showMoreText}>Show {Math.min(GLOSSARY_PAGE, rows.length - limit)} more</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function YardiAndTools({
  bookmarkedIds = [],
  taskNotes = {},
  onSelectTask,
  onOpenScreen,
  onOpenModule,
}) {
  const [activeSubTab, setActiveSubTab] = useState('manuals'); // 'manuals' | 'yardi' | 'glossary' | 'bookmarks'
  const [manualSearch, setManualSearch] = useState('');
  const [selectedManualCat, setSelectedManualCat] = useState('All 57 Manuals');
  const [expandedManualId, setExpandedManualId] = useState(null);

  const bookmarkedTasks = ALL_TASKS.filter((t) => bookmarkedIds.includes(t.id));
  const notedTasks = ALL_TASKS.filter((t) => taskNotes[t.id]);



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
              Rosetta Stone ({ROSETTA_OPERATIONS.length})
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
              Encyclopedia ({GLOSSARY_TERMS.length})
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

        {/* SUBTAB 2: REALPAGE <-> YARDI ROSETTA STONE */}
        {activeSubTab === 'yardi' && <RosettaStone onOpenScreen={onOpenScreen} />}

        {/* SUBTAB 3: PROPERTY ACCOUNTING ENCYCLOPEDIA */}
        {activeSubTab === 'glossary' && (
          <GlossaryEncyclopedia onOpenScreen={onOpenScreen} onOpenModule={onOpenModule} />
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
  disclaimerText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6,
    lineHeight: 16,
  },
  directionRow: {
    marginBottom: 12,
  },
  systemCrumbs: {
    marginTop: 6,
    marginBottom: 2,
  },
  comparisonCardOpen: {
    borderColor: COLORS.yardi,
  },
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  comparisonMeta: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  comparisonPair: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  rosettaSopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  rosettaSopText: {
    fontSize: 12,
    color: COLORS.info,
    fontWeight: '600',
    marginLeft: 5,
  },
  rosettaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 6,
  },
  termTable: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  termHeadRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceLight,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  termRow: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  termPair: {
    flexDirection: 'row',
  },
  termCell: {
    flex: 1,
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
    paddingRight: 6,
  },
  termHead: {
    fontSize: 11,
    fontWeight: '700',
  },
  termNote: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  pitfallRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  pitfallText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginLeft: 6,
    flex: 1,
  },
  acronymBarLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  acronymChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${COLORS.gold}60`,
    backgroundColor: `${COLORS.gold}12`,
    marginRight: 6,
  },
  acronymChipActive: {
    backgroundColor: `${COLORS.gold}40`,
  },
  acronymChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gold,
  },
  glossaryCardSpot: {
    borderColor: COLORS.gold,
  },
  glossaryYardi: {
    fontSize: 11,
    color: COLORS.yardi,
    marginTop: 8,
    lineHeight: 16,
  },
  moduleChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  moduleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${COLORS.info}50`,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 6,
  },
  moduleChipText: {
    fontSize: 11,
    color: COLORS.info,
    marginLeft: 4,
  },
  relatedScreenLink: {
    fontSize: 12,
    color: COLORS.info,
    marginTop: 4,
  },
  showMoreBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 4,
  },
  showMoreText: {
    color: COLORS.info,
    fontWeight: '600',
    fontSize: 13,
  },
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
