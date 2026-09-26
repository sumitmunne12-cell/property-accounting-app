import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { REALPAGE_MODULES } from '../data/realPageModulesData';
import { triggerHaptic } from '../utils/haptics';

const MAX_FILTER_RESULTS = 100;

// SOP steps are stored as "1. Do X" — the badge already shows the number.
const stripStepNumber = (step) => step.replace(/^\s*(Step\s*)?\d+[.:)]\s*/i, '');

function ScreenCard({ screen, color, isExpanded, onToggle }) {
  return (
    <View style={[styles.screenCard, isExpanded && styles.screenCardActive]}>
      <TouchableOpacity style={styles.screenHeader} onPress={onToggle} activeOpacity={0.7}>
        <View style={styles.screenHeaderLeft}>
          <View style={[styles.screenIconCircle, { backgroundColor: `${color}20` }]}>
            <Ionicons name="desktop-outline" size={16} color={color} />
          </View>
          <View style={styles.screenHeaderText}>
            <Text style={styles.screenName}>{screen.name}</Text>
            <Text style={styles.screenBreadcrumbQuick} numberOfLines={1}>
              {screen.navigation.join('  ›  ')}
            </Text>
          </View>
        </View>
        <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {/* Expanded Screen Deep Dive Guide */}
      {isExpanded && (
        <View style={styles.screenDetails}>
          {/* Exact Breadcrumbs Box */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionLabel}>EXACT NAVIGATION PATH</Text>
            <View style={styles.breadcrumbBox}>
              {screen.navigation.map((step, idx) => (
                <View key={idx} style={styles.breadcrumbStep}>
                  <Text style={styles.breadcrumbStepText}>
                    {idx > 0 && '  ›  '}
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Screen Purpose */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionLabel}>SCREEN & REPORT PURPOSE</Text>
            <Text style={styles.purposeText}>{screen.purpose}</Text>
          </View>

          {/* Why Records Are Here */}
          <View style={styles.detailSection}>
            <Text style={[styles.sectionLabel, { color: COLORS.danger }]}>WHY RECORDS ARE HERE (ROOT CAUSE)</Text>
            {Array.isArray(screen.whyRecordsAreHere) ? (
              screen.whyRecordsAreHere.map((reason, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <View style={[styles.bulletDot, { backgroundColor: COLORS.danger }]} />
                  <Text style={styles.bulletText}>{reason}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.bodyText}>{screen.whyRecordsAreHere}</Text>
            )}
          </View>

          {/* Key Fields & Filters */}
          {screen.keyFieldsAndFilters && (
            <View style={styles.detailSection}>
              <Text style={[styles.sectionLabel, { color: COLORS.warning }]}>KEY FIELDS, BUTTONS & FILTERS</Text>
              {screen.keyFieldsAndFilters.map((field, idx) => (
                <View key={idx} style={styles.fieldItem}>
                  <Text style={styles.fieldName}>{field.name}:</Text>
                  <Text style={styles.fieldDesc}>{field.description}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Step-by-Step SOP */}
          <View style={styles.detailSection}>
            <Text style={[styles.sectionLabel, { color: COLORS.primaryLight }]}>ACCOUNTANT STEP-BY-STEP ACTION SOP</Text>
            {screen.accountantActionSOP.map((step, idx) => (
              <View key={idx} style={styles.sopRow}>
                <View style={styles.sopNumBadge}>
                  <Text style={styles.sopNumText}>{idx + 1}</Text>
                </View>
                <Text style={styles.sopStepText}>{stripStepNumber(step)}</Text>
              </View>
            ))}
          </View>

          {/* GL Impact */}
          <View style={styles.glSection}>
            <Text style={styles.glSectionLabel}>DOWNSTREAM GL ACCOUNTING IMPACT</Text>
            <Text style={styles.glSectionFormula}>{screen.glAccountingImpact}</Text>
          </View>

          {/* What Happens Next */}
          {screen.whatHappensNext ? (
            <View style={styles.detailSection}>
              <Text style={[styles.sectionLabel, { color: COLORS.info }]}>WHAT HAPPENS NEXT</Text>
              <Text style={styles.bodyText}>{screen.whatHappensNext}</Text>
            </View>
          ) : null}

          {/* Yardi Equivalent */}
          {screen.yardiEquivalent ? (
            <View style={styles.yardiBox}>
              <Text style={styles.yardiLabel}>YARDI VOYAGER EQUIVALENT</Text>
              <Text style={styles.bodyText}>{screen.yardiEquivalent}</Text>
            </View>
          ) : null}

          {/* Manual Citation */}
          {screen.pdfManualSource ? (
            <View style={styles.sourceRow}>
              <Ionicons name="document-text-outline" size={13} color={COLORS.textMuted} />
              <Text style={styles.sourceText}>{screen.pdfManualSource}</Text>
            </View>
          ) : null}

          {/* Pro Tip */}
          {screen.proTips && (
            <View style={styles.tipBox}>
              <Ionicons name="sparkles" size={15} color={COLORS.gold} />
              <Text style={styles.tipText}>{screen.proTips}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

export default function RealPageExplorer({ onSelectScreen }) {
  const [selectedModuleId, setSelectedModuleId] = useState('ap');
  const [expandedScreenId, setExpandedScreenId] = useState('scr_ap_exception_queue');
  const [expandedSubmoduleId, setExpandedSubmoduleId] = useState(null);
  const [showLegend, setShowLegend] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [filterText, setFilterText] = useState('');

  const selectedModule = REALPAGE_MODULES.find((m) => m.id === selectedModuleId) || REALPAGE_MODULES[0];
  const openSubmoduleId = expandedSubmoduleId ?? selectedModule.submodules[0]?.id;
  const moduleScreenCount = useMemo(
    () => selectedModule.submodules.reduce((n, sub) => n + sub.screens.length, 0),
    [selectedModule]
  );

  const normalizedFilter = filterText.trim().toLowerCase();
  const filteredScreens = useMemo(() => {
    if (!normalizedFilter) return [];
    const out = [];
    for (const sub of selectedModule.submodules) {
      for (const scr of sub.screens) {
        if (
          scr.name.toLowerCase().includes(normalizedFilter) ||
          scr.navigation.some((n) => n.toLowerCase().includes(normalizedFilter)) ||
          scr.purpose.toLowerCase().includes(normalizedFilter)
        ) {
          out.push(scr);
        }
      }
    }
    return out;
  }, [selectedModule, normalizedFilter]);

  const toggleScreen = (id) => {
    triggerHaptic('light');
    setExpandedScreenId(expandedScreenId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* Module Selector Top Bar */}
      <View style={styles.moduleSelectorBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moduleScroll}>
          {REALPAGE_MODULES.map((mod) => {
            const isSelected = mod.id === selectedModuleId;
            return (
              <TouchableOpacity
                key={mod.id}
                style={[
                  styles.moduleTab,
                  isSelected && { backgroundColor: mod.color, borderColor: mod.color },
                ]}
                onPress={() => {
                  triggerHaptic('light');
                  setSelectedModuleId(mod.id);
                  setExpandedSubmoduleId(null);
                  setFilterText('');
                  // Expand first screen of selected module
                  const firstScreen = mod.submodules[0]?.screens[0];
                  if (firstScreen) setExpandedScreenId(firstScreen.id);
                }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={mod.icon}
                  size={15}
                  color={isSelected ? '#FFFFFF' : COLORS.textSecondary}
                />
                <Text style={[styles.moduleTabText, isSelected && styles.moduleTabTextActive]}>
                  {mod.shortCode}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Module Header Description */}
      <View style={styles.moduleBanner}>
        <View style={styles.moduleBannerTop}>
          <Text style={[styles.moduleTitle, { color: selectedModule.color }]}>
            {selectedModule.title}
          </Text>
          <Text style={styles.moduleCount}>
            {moduleScreenCount} screens · {selectedModule.submodules.length} menus
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)} activeOpacity={0.8}>
          <Text style={styles.moduleDesc} numberOfLines={showFullDesc ? undefined : 2}>
            {selectedModule.description}
          </Text>
        </TouchableOpacity>
        {selectedModule.glAccountLegend ? (
          <TouchableOpacity onPress={() => setShowLegend(!showLegend)} activeOpacity={0.7}>
            <Text style={styles.legendToggle}>
              {showLegend ? 'Hide' : 'Show'} GL account legend (illustrative multifamily chart of accounts)
            </Text>
            {showLegend && <Text style={styles.legendText}>{selectedModule.glAccountLegend}</Text>}
          </TouchableOpacity>
        ) : null}
        <View style={styles.filterBox}>
          <Ionicons name="search" size={14} color={COLORS.textSecondary} />
          <TextInput
            style={styles.filterInput}
            placeholder={`Filter ${moduleScreenCount} ${selectedModule.shortCode} screens, reports & buttons...`}
            placeholderTextColor={COLORS.textMuted}
            value={filterText}
            onChangeText={setFilterText}
            autoCapitalize="none"
          />
          {filterText.length > 0 && (
            <TouchableOpacity onPress={() => setFilterText('')}>
              <Ionicons name="close-circle" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Screens & Menus Accordion List */}
      <ScrollView style={styles.screensScroll} contentContainerStyle={styles.screensBody}>
        {normalizedFilter ? (
          <View style={styles.submoduleGroup}>
            <Text style={styles.filterSummary}>
              {filteredScreens.length} matching screens
              {filteredScreens.length > MAX_FILTER_RESULTS ? ` (showing first ${MAX_FILTER_RESULTS})` : ''}
            </Text>
            {filteredScreens.slice(0, MAX_FILTER_RESULTS).map((screen) => (
              <ScreenCard
                key={screen.id}
                screen={screen}
                color={selectedModule.color}
                isExpanded={screen.id === expandedScreenId}
                onToggle={() => toggleScreen(screen.id)}
              />
            ))}
          </View>
        ) : (
          selectedModule.submodules.map((submod) => {
            const isOpen = submod.id === openSubmoduleId;
            return (
              <View key={submod.id} style={styles.submoduleGroup}>
                <TouchableOpacity
                  style={styles.submoduleHeader}
                  onPress={() => {
                    triggerHaptic('light');
                    setExpandedSubmoduleId(isOpen ? '' : submod.id);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isOpen ? 'folder-open-outline' : 'folder-outline'}
                    size={14}
                    color={selectedModule.color}
                  />
                  <Text style={styles.submoduleTitle}>{submod.title}</Text>
                  <Text style={styles.submoduleCount}>{submod.screens.length}</Text>
                  <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={14}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>

                {isOpen &&
                  submod.screens.map((screen) => (
                    <ScreenCard
                      key={screen.id}
                      screen={screen}
                      color={selectedModule.color}
                      isExpanded={screen.id === expandedScreenId}
                      onToggle={() => toggleScreen(screen.id)}
                    />
                  ))}
              </View>
            );
          })
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
  moduleSelectorBar: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  moduleScroll: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  moduleTab: {
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
  moduleTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  moduleTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  moduleBanner: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  moduleBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  moduleDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  moduleCount: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 8,
  },
  legendToggle: {
    fontSize: 11,
    color: COLORS.info,
    marginTop: 6,
    fontWeight: '600',
  },
  legendText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginTop: 4,
  },
  filterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceInput,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  filterInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    paddingVertical: 8,
    marginLeft: 6,
  },
  filterSummary: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  screensScroll: {
    flex: 1,
  },
  screensBody: {
    padding: 16,
    paddingBottom: 30,
  },
  submoduleGroup: {
    marginBottom: 20,
  },
  submoduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  submoduleTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  submoduleCount: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginHorizontal: 8,
  },
  screenCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  screenCardActive: {
    borderColor: COLORS.primaryLight,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  screenHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  screenIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  screenHeaderText: {
    flex: 1,
  },
  screenName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  screenBreadcrumbQuick: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  screenDetails: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surfaceInput,
  },
  detailSection: {
    marginTop: 12,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  breadcrumbBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.surface,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  breadcrumbStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbStepText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.info,
  },
  purposeText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 19,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
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
  bodyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  fieldItem: {
    marginBottom: 6,
  },
  fieldName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.warning,
  },
  fieldDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  sopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  sopNumBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  sopNumText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sopStepText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
    flex: 1,
  },
  glSection: {
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.success,
    marginTop: 12,
  },
  glSectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
    marginBottom: 4,
  },
  glSectionFormula: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  yardiBox: {
    backgroundColor: `${COLORS.yardi}15`,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${COLORS.yardi}40`,
    marginTop: 12,
  },
  yardiLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.yardi,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  sourceText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${COLORS.gold}15`,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${COLORS.gold}40`,
    marginTop: 10,
  },
  tipText: {
    fontSize: 11,
    color: COLORS.text,
    lineHeight: 17,
    marginLeft: 8,
    flex: 1,
  },
});
