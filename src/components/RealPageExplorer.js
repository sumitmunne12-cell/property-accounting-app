import React, { useEffect, useMemo, useState } from 'react';
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
import { searchScreens, getScreenEntry } from '../utils/screenIndex';
import useDebouncedValue from '../utils/useDebouncedValue';
import ScreenDetail from './ScreenDetail';

const MAX_FILTER_RESULTS = 100;

function ScreenCard({ screen, color, isExpanded, onToggle, badge }) {
  return (
    <View style={[styles.screenCard, isExpanded && styles.screenCardActive]}>
      <TouchableOpacity style={styles.screenHeader} onPress={onToggle} activeOpacity={0.7}>
        <View style={styles.screenHeaderLeft}>
          <View style={[styles.screenIconCircle, { backgroundColor: `${color}20` }]}>
            <Ionicons name="desktop-outline" size={16} color={color} />
          </View>
          <View style={styles.screenHeaderText}>
            {badge ? <Text style={styles.focusBadge}>{badge}</Text> : null}
            <Text style={styles.screenName}>{screen.name}</Text>
            <Text style={styles.screenBreadcrumbQuick} numberOfLines={1}>
              {screen.navigation.join('  ›  ')}
            </Text>
          </View>
        </View>
        <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.screenDetails}>
          <ScreenDetail screen={screen} />
        </View>
      )}
    </View>
  );
}

// `focus` = { moduleId, screenId?, nonce } lets other tabs deep-link into a module or screen.
export default function RealPageExplorer({ focus }) {
  const [selectedModuleId, setSelectedModuleId] = useState('ap');
  const [expandedScreenId, setExpandedScreenId] = useState('scr_ap_exception_queue');
  const [expandedSubmoduleId, setExpandedSubmoduleId] = useState(null);
  const [pinnedScreenId, setPinnedScreenId] = useState(null);
  const [showLegend, setShowLegend] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [filterText, setFilterText] = useState('');
  const debouncedFilter = useDebouncedValue(filterText, 150);

  useEffect(() => {
    if (!focus || !focus.moduleId) return;
    setSelectedModuleId(focus.moduleId);
    setFilterText('');
    const entry = focus.screenId ? getScreenEntry(focus.screenId) : null;
    if (entry) {
      setExpandedSubmoduleId(entry.submoduleId);
      setExpandedScreenId(entry.screen.id);
      setPinnedScreenId(entry.screen.id);
    } else {
      setExpandedSubmoduleId(null);
      setPinnedScreenId(null);
    }
  }, [focus]);

  const selectedModule = REALPAGE_MODULES.find((m) => m.id === selectedModuleId) || REALPAGE_MODULES[0];
  const openSubmoduleId = expandedSubmoduleId ?? selectedModule.submodules[0]?.id;
  const moduleScreenCount = useMemo(
    () => selectedModule.submodules.reduce((n, sub) => n + sub.screens.length, 0),
    [selectedModule]
  );

  const filtered = useMemo(
    () => searchScreens(debouncedFilter, { moduleId: selectedModule.id, limit: MAX_FILTER_RESULTS }),
    [selectedModule, debouncedFilter]
  );
  const isFiltering = debouncedFilter.trim().length > 0;
  const pinnedEntry = pinnedScreenId ? getScreenEntry(pinnedScreenId) : null;
  const showPinned = pinnedEntry && pinnedEntry.moduleId === selectedModule.id && !isFiltering;

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
                  setPinnedScreenId(null);
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
            placeholder={`Fuzzy-search ${moduleScreenCount} ${selectedModule.shortCode} screens, reports & buttons...`}
            placeholderTextColor={COLORS.textMuted}
            value={filterText}
            onChangeText={setFilterText}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {filterText.length > 0 && (
            <TouchableOpacity onPress={() => setFilterText('')}>
              <Ionicons name="close-circle" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Screens & Menus Accordion List */}
      <ScrollView style={styles.screensScroll} contentContainerStyle={styles.screensBody} keyboardShouldPersistTaps="handled">
        {showPinned && (
          <View style={styles.submoduleGroup}>
            <ScreenCard
              screen={pinnedEntry.screen}
              color={selectedModule.color}
              isExpanded={pinnedEntry.screen.id === expandedScreenId}
              onToggle={() => toggleScreen(pinnedEntry.screen.id)}
              badge={`OPENED FROM LINK · ${pinnedEntry.submoduleTitle}`}
            />
          </View>
        )}
        {isFiltering ? (
          <View style={styles.submoduleGroup}>
            <Text style={styles.filterSummary}>
              {filtered.total} matching screens
              {filtered.total > MAX_FILTER_RESULTS ? ` (best ${MAX_FILTER_RESULTS} shown)` : ''}
            </Text>
            {filtered.results.map((entry) => (
              <ScreenCard
                key={entry.screen.id}
                screen={entry.screen}
                color={selectedModule.color}
                isExpanded={entry.screen.id === expandedScreenId}
                onToggle={() => toggleScreen(entry.screen.id)}
                badge={entry.submoduleTitle}
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
  focusBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 0.4,
    marginBottom: 2,
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
});
