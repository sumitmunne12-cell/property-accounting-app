import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { LAYOUT, RADII } from '../theme/layout';
import { triggerHaptic } from '../utils/haptics';
import { MODULES, getModuleMeta, getScreenEntry, getSubmoduleEntries, searchScreens } from '../utils/screenIndex';
import useDebouncedValue from '../utils/useDebouncedValue';
import { LazyScreenDetail } from './ScreenDetail';

const MAX_FILTER_RESULTS = 100;
// Master/detail split once the content column is wide enough for both panes.
const SPLIT_MIN = 900;

// One catalog row. Only the lightweight index entry is needed to render it; the module's full
// detail is imported the first time a row is expanded (or selected on desktop).
const ScreenRow = memo(function ScreenRow({ entry, color, expanded, selected, inline, onToggle, badge }) {
  return (
    <View style={[styles.screenCard, (expanded || selected) && { borderColor: `${color}88` }]}>
      <TouchableOpacity style={styles.screenHeader} onPress={() => onToggle(entry.id)} activeOpacity={0.7}>
        <View style={[styles.screenIcon, { backgroundColor: `${color}1A`, borderColor: `${color}40` }]}>
          <Ionicons name="desktop-outline" size={15} color={color} />
        </View>
        <View style={styles.screenHeaderText}>
          {badge ? (
            <Text style={styles.rowBadge} numberOfLines={1}>
              {badge}
            </Text>
          ) : null}
          <Text style={styles.screenName} numberOfLines={2}>
            {entry.name}
          </Text>
          <Text style={styles.screenNav} numberOfLines={1}>
            {entry.nav.replace(/ > /g, '  ›  ')}
          </Text>
        </View>
        <Ionicons
          name={inline ? (expanded ? 'chevron-up' : 'chevron-down') : 'chevron-forward'}
          size={17}
          color={selected || expanded ? color : COLORS.textMuted}
        />
      </TouchableOpacity>
      {inline && expanded ? (
        <View style={styles.screenDetails}>
          <LazyScreenDetail screenId={entry.id} />
        </View>
      ) : null}
    </View>
  );
});

const SubmoduleHeader = memo(function SubmoduleHeader({ sub, open, color, onToggle }) {
  return (
    <TouchableOpacity style={styles.submoduleHeader} onPress={() => onToggle(sub.id)} activeOpacity={0.7}>
      <Ionicons name={open ? 'folder-open-outline' : 'folder-outline'} size={14} color={color} />
      <Text style={styles.submoduleTitle} numberOfLines={2}>
        {sub.title}
      </Text>
      <View style={styles.countPill}>
        <Text style={styles.countPillText}>{sub.count}</Text>
      </View>
      <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={14} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
});

// `focus` = { moduleId, screenId?, nonce } lets other tabs deep-link into a module or screen.
export default function RealPageExplorer({ focus }) {
  const { width } = useWindowDimensions();
  const [selectedModuleId, setSelectedModuleId] = useState('ap');
  const [expandedScreenId, setExpandedScreenId] = useState(null);
  const [expandedSubmoduleId, setExpandedSubmoduleId] = useState(null);
  const [pinnedScreenId, setPinnedScreenId] = useState(null);
  const [showLegend, setShowLegend] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [filterText, setFilterText] = useState('');
  const debouncedFilter = useDebouncedValue(filterText, 150);

  const contentWidth = width >= LAYOUT.DESKTOP_MIN ? Math.min(width - LAYOUT.SIDEBAR_WIDTH, LAYOUT.CONTENT_MAX) : width;
  const split = contentWidth >= SPLIT_MIN;

  useEffect(() => {
    if (!focus || !focus.moduleId) return;
    setSelectedModuleId(focus.moduleId);
    setFilterText('');
    const entry = focus.screenId ? getScreenEntry(focus.screenId) : null;
    if (entry) {
      setExpandedSubmoduleId(entry.submoduleId);
      setExpandedScreenId(entry.id);
      setPinnedScreenId(entry.id);
    } else {
      setExpandedSubmoduleId(null);
      setExpandedScreenId(null);
      setPinnedScreenId(null);
    }
  }, [focus]);

  const mod = getModuleMeta(selectedModuleId) || MODULES[0];
  const openSubmoduleId = expandedSubmoduleId ?? mod.submodules[0]?.id;
  const isFiltering = debouncedFilter.trim().length > 0;

  const filtered = useMemo(
    () => (isFiltering ? searchScreens(debouncedFilter, { moduleId: mod.id, limit: MAX_FILTER_RESULTS }) : null),
    [mod.id, debouncedFilter, isFiltering]
  );

  const pinnedEntry = pinnedScreenId ? getScreenEntry(pinnedScreenId) : null;
  const showPinned = Boolean(pinnedEntry && pinnedEntry.moduleId === mod.id && !isFiltering);

  // Flattened rows for one virtualized list: submodule headers + the open submodule's screens.
  const rows = useMemo(() => {
    const out = [];
    if (showPinned) out.push({ key: `pin:${pinnedEntry.id}`, type: 'screen', entry: pinnedEntry, badge: `OPENED FROM LINK · ${pinnedEntry.category}` });
    if (filtered) {
      out.push({ key: 'summary', type: 'summary', total: filtered.total });
      for (const e of filtered.results) out.push({ key: e.id, type: 'screen', entry: e, badge: e.category });
      return out;
    }
    for (const sub of mod.submodules) {
      const open = sub.id === openSubmoduleId;
      out.push({ key: `sub:${sub.id}`, type: 'sub', sub, open });
      if (open) for (const e of getSubmoduleEntries(sub.id)) out.push({ key: e.id, type: 'screen', entry: e });
    }
    return out;
  }, [mod, openSubmoduleId, filtered, showPinned, pinnedEntry]);

  const toggleScreen = useCallback(
    (id) => {
      triggerHaptic('light');
      setExpandedScreenId((cur) => (split ? id : cur === id ? null : id));
    },
    [split]
  );
  const toggleSubmodule = useCallback(
    (id) => {
      triggerHaptic('light');
      setExpandedSubmoduleId(openSubmoduleId === id ? '' : id);
    },
    [openSubmoduleId]
  );

  const selectModule = (m) => {
    triggerHaptic('light');
    setSelectedModuleId(m.id);
    setExpandedSubmoduleId(null);
    setExpandedScreenId(null);
    setPinnedScreenId(null);
    setFilterText('');
  };

  const renderRow = ({ item }) => {
    if (item.type === 'sub') {
      return <SubmoduleHeader sub={item.sub} open={item.open} color={mod.color} onToggle={toggleSubmodule} />;
    }
    if (item.type === 'summary') {
      return (
        <Text style={styles.filterSummary}>
          {item.total} matching screens{item.total > MAX_FILTER_RESULTS ? ` (best ${MAX_FILTER_RESULTS} shown)` : ''}
        </Text>
      );
    }
    const id = item.entry.id;
    return (
      <ScreenRow
        entry={item.entry}
        color={mod.color}
        badge={item.badge}
        inline={!split}
        expanded={!split && id === expandedScreenId}
        selected={split && id === expandedScreenId}
        onToggle={toggleScreen}
      />
    );
  };

  const banner = (
    <View style={styles.moduleBanner}>
      <View style={styles.moduleBannerTop}>
        <View style={[styles.moduleBadge, { backgroundColor: `${mod.color}1A`, borderColor: `${mod.color}55` }]}>
          <Ionicons name={mod.icon} size={16} color={mod.color} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.moduleTitle}>{mod.title}</Text>
          <Text style={styles.moduleCount}>
            {mod.screenCount.toLocaleString()} screens · {mod.submodules.length} menus
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)} activeOpacity={0.8}>
        <Text style={styles.moduleDesc} numberOfLines={showFullDesc ? undefined : 2}>
          {mod.description}
        </Text>
      </TouchableOpacity>
      {mod.glAccountLegend ? (
        <TouchableOpacity onPress={() => setShowLegend(!showLegend)} activeOpacity={0.7}>
          <Text style={styles.legendToggle}>
            {showLegend ? 'Hide' : 'Show'} GL account legend (illustrative multifamily chart of accounts)
          </Text>
          {showLegend && <Text style={styles.legendText}>{mod.glAccountLegend}</Text>}
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const selectedEntry = split && expandedScreenId ? getScreenEntry(expandedScreenId) : null;

  return (
    <View style={styles.container}>
      <View style={styles.moduleSelectorBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moduleScroll}>
          {MODULES.map((m) => {
            const on = m.id === mod.id;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.moduleTab, on && { backgroundColor: `${m.color}1F`, borderColor: `${m.color}99` }]}
                onPress={() => selectModule(m)}
                activeOpacity={0.8}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
              >
                <Ionicons name={m.icon} size={14} color={on ? m.color : COLORS.textMuted} />
                <Text style={[styles.moduleTabText, on && { color: COLORS.text }]}>{m.shortCode}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={styles.filterBox}>
          <Ionicons name="search" size={14} color={COLORS.textMuted} />
          <TextInput
            style={styles.filterInput}
            placeholder={`Search ${mod.screenCount.toLocaleString()} ${mod.shortCode} screens, reports & buttons…`}
            placeholderTextColor={COLORS.textMuted}
            value={filterText}
            onChangeText={setFilterText}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {filterText.length > 0 && (
            <TouchableOpacity onPress={() => setFilterText('')} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.panes}>
        <FlatList
          style={split ? styles.masterPane : styles.flex}
          contentContainerStyle={styles.listBody}
          data={rows}
          keyExtractor={(r) => r.key}
          renderItem={renderRow}
          extraData={`${expandedScreenId}|${split}`}
          ListHeaderComponent={banner}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={14}
          maxToRenderPerBatch={12}
          updateCellsBatchingPeriod={40}
          windowSize={9}
          removeClippedSubviews={Platform.OS === 'android'}
        />
        {split ? (
          <ScrollView style={styles.detailPane} contentContainerStyle={styles.detailBody}>
            {selectedEntry ? (
              <>
                <Text style={styles.detailKicker}>{selectedEntry.category}</Text>
                <Text style={styles.detailTitle}>{selectedEntry.name}</Text>
                <LazyScreenDetail screenId={selectedEntry.id} />
              </>
            ) : (
              <View style={styles.detailEmpty}>
                <Ionicons name="desktop-outline" size={34} color={COLORS.textMuted} />
                <Text style={styles.detailEmptyTitle}>Select a screen</Text>
                <Text style={styles.detailEmptySub}>
                  Its navigation path, SOP, GL impact, Yardi equivalent and legal guardrails open here.
                </Text>
              </View>
            )}
          </ScrollView>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: COLORS.background },
  moduleSelectorBar: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
  },
  moduleScroll: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 8 },
  moduleTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  moduleTabText: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginLeft: 6 },
  filterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceInput,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    marginHorizontal: 12,
  },
  filterInput: { ...Platform.select({ web: { outlineStyle: 'none' }, default: {} }), flex: 1, color: COLORS.text, fontSize: 13, paddingVertical: 9, marginLeft: 6 },
  panes: { flex: 1, flexDirection: 'row' },
  masterPane: { width: 380, flexGrow: 0, borderRightWidth: 1, borderRightColor: COLORS.border },
  listBody: { paddingHorizontal: 12, paddingBottom: 32 },
  moduleBanner: { paddingVertical: 14, paddingHorizontal: 4 },
  moduleBannerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  moduleBadge: {
    width: 34,
    height: 34,
    borderRadius: RADII.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  moduleTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text, letterSpacing: -0.2 },
  moduleCount: { fontSize: 11.5, color: COLORS.textMuted, marginTop: 1 },
  moduleDesc: { fontSize: 12.5, color: COLORS.textSecondary, lineHeight: 18 },
  legendToggle: { fontSize: 11.5, color: COLORS.info, marginTop: 8, fontWeight: '600' },
  legendText: { fontSize: 11.5, color: COLORS.textSecondary, lineHeight: 17, marginTop: 4 },
  filterSummary: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 10, paddingHorizontal: 4 },
  submoduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 8,
  },
  submoduleTitle: {
    flex: 1,
    fontSize: 11.5,
    fontWeight: '800',
    color: COLORS.text,
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  countPill: {
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.surfaceHighlight,
    marginHorizontal: 8,
  },
  countPillText: { fontSize: 10.5, fontWeight: '700', color: COLORS.textSecondary },
  screenCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  screenHeader: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  screenIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  screenHeaderText: { flex: 1, marginRight: 8 },
  rowBadge: { fontSize: 9.5, fontWeight: '800', color: COLORS.gold, letterSpacing: 0.5, marginBottom: 2 },
  screenName: { fontSize: 13.5, fontWeight: '600', color: COLORS.text, marginBottom: 2 },
  screenNav: { fontSize: 11, color: COLORS.textMuted },
  screenDetails: {
    paddingHorizontal: 14,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surfaceInput,
  },
  detailPane: { flex: 1 },
  detailBody: { padding: 24, paddingBottom: 48, maxWidth: LAYOUT.READING_MAX },
  detailKicker: { fontSize: 10.5, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 0.9, textTransform: 'uppercase' },
  detailTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginTop: 4, letterSpacing: -0.3 },
  detailEmpty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 24 },
  detailEmptyTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginTop: 10 },
  detailEmptySub: { fontSize: 12.5, color: COLORS.textMuted, marginTop: 4, textAlign: 'center', maxWidth: 360, lineHeight: 18 },
});
