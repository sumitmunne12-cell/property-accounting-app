import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Modal,
  Platform,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './src/theme/colors';
import { LAYOUT, RADII } from './src/theme/layout';
import {
  ALL_TASKS,
  TASK_PHASES,
  PROPERTIES,
} from './src/data/tasksData';
import {
  getCompletedTasks,
  toggleTaskCompleted,
  getTaskNotes,
  saveTaskNote,
  getBookmarks,
  toggleBookmark,
  getSelectedProperty,
  saveSelectedProperty,
  getActiveSoftware,
  saveActiveSoftware,
} from './src/utils/storage';
import { triggerHaptic } from './src/utils/haptics';

// Subcomponents
import HeaderBar from './src/components/HeaderBar';
import TaskCard from './src/components/TaskCard';
import MasteryModal from './src/components/MasteryModal';
import RealPageExplorer from './src/components/RealPageExplorer';
import CommandSearch from './src/components/CommandSearch';
import YardiAndTools from './src/components/YardiAndTools';
import CloseCockpit from './src/components/CloseCockpit';
import ScreenSopModal from './src/components/ScreenSopModal';
import GaapCodex from './src/components/gaap/GaapCodex';
import { GaapNavContext } from './src/components/gaap/GaapNavContext';
import { MODULE_FILE_TO_ID, SCREEN_COUNT } from './src/utils/screenIndex';

const NAV_ITEMS = [
  { key: 'tasks', label: 'Daily Hub', icon: 'checkbox', accent: COLORS.success },
  { key: 'close', label: 'Close', icon: 'lock-closed', accent: COLORS.close },
  { key: 'explorer', label: 'RP Explorer', short: 'Explorer', icon: 'desktop', accent: COLORS.info },
  { key: 'search', label: 'Triage & Search', short: 'Triage', icon: 'search', accent: COLORS.danger },
  { key: 'tools', label: 'Yardi & Terms', short: 'Yardi', icon: 'layers', accent: COLORS.yardi },
  { key: 'codex', label: 'GAAP Codex', short: 'Codex', icon: 'library', accent: COLORS.gold },
];

export default function App() {
  return (
    <SafeAreaProvider>
      <AppShell />
    </SafeAreaProvider>
  );
}

// Phones: header + content + bottom tab bar, padded for the notch and home indicator.
// Desktop web (>= LAYOUT.DESKTOP_MIN): fixed sidebar and a centered max-width content column.
function AppShell() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isDesktop = width >= LAYOUT.DESKTOP_MIN;
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'close' | 'explorer' | 'search' | 'tools' | 'codex'
  const [selectedPhase, setSelectedPhase] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedProperty, setSelectedProperty] = useState('All Properties');
  const [activeSoftware, setActiveSoftware] = useState('realpage'); // 'realpage' | 'yardi'
  
  // Persistent storage state
  const [completedTaskIds, setCompletedTaskIds] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [taskNotes, setTaskNotes] = useState({});
  
  // Modals
  const [selectedTaskForMastery, setSelectedTaskForMastery] = useState(null);
  const [propertyPickerVisible, setPropertyPickerVisible] = useState(false);
  // Click-by-click SOP modal for any catalog screen (close tasks, playbooks, Rosetta, glossary)
  const [sopScreen, setSopScreen] = useState(null); // { id, context }
  // Deep link into the RP Explorer: { moduleId, screenId, nonce }
  const [explorerFocus, setExplorerFocus] = useState(null);
  // Deep link into the GAAP Codex: { topic, paragraph, nonce }
  const [codexFocus, setCodexFocus] = useState(null);

  const openScreen = (screenId, context) => setSopScreen({ id: screenId, context });
  const openInExplorer = (moduleId, screenId) => {
    setSopScreen(null);
    setExplorerFocus({ moduleId, screenId, nonce: Date.now() });
    setActiveTab('explorer');
  };
  // Any "📖 First-Principles GAAP" pop-up can hand off to the Codex tab.
  const gaapNav = useMemo(
    () => ({
      openInCodex: (topic, paragraph = null) => {
        setSopScreen(null);
        setSelectedTaskForMastery(null);
        setCodexFocus({ topic, paragraph, nonce: Date.now() });
        setActiveTab('codex');
      },
    }),
    []
  );
  const openModule = (moduleFile) => {
    const moduleId = MODULE_FILE_TO_ID[moduleFile] || moduleFile;
    setExplorerFocus({ moduleId, screenId: null, nonce: Date.now() });
    setActiveTab('explorer');
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const completed = await getCompletedTasks();
    const bookmarks = await getBookmarks();
    const notes = await getTaskNotes();
    const prop = await getSelectedProperty();
    const soft = await getActiveSoftware();

    setCompletedTaskIds(completed);
    setBookmarkedIds(bookmarks);
    setTaskNotes(notes);
    setSelectedProperty(prop);
    setActiveSoftware(soft);
  };

  const handleToggleComplete = useCallback(async (taskId) => {
    const updated = await toggleTaskCompleted(taskId);
    setCompletedTaskIds(updated);
  }, []);

  const handleToggleBookmark = useCallback(async (taskId) => {
    const updated = await toggleBookmark(taskId);
    setBookmarkedIds(updated);
  }, []);

  const openMastery = useCallback((t) => setSelectedTaskForMastery(t), []);

  const handleSaveNote = async (taskId, noteText) => {
    const updated = await saveTaskNote(taskId, noteText);
    setTaskNotes(updated);
  };

  const handleSelectProperty = async (prop) => {
    setSelectedProperty(prop);
    await saveSelectedProperty(prop);
    setPropertyPickerVisible(false);
  };

  const handleToggleSoftware = async (soft) => {
    setActiveSoftware(soft);
    await saveActiveSoftware(soft);
  };

  // Filter Tasks based on Phase and Priority
  const filteredTasks = useMemo(
    () =>
      ALL_TASKS.filter((t) => {
        if (selectedPhase !== 'All' && t.phase !== selectedPhase) return false;
        if (selectedPriority !== 'All' && t.priority !== selectedPriority) return false;
        return true;
      }),
    [selectedPhase, selectedPriority]
  );

  const selectTab = (key) => {
    triggerHaptic('light');
    setActiveTab(key);
  };

  const renderTask = ({ item: task }) => (
    <TaskCard
      task={task}
      isCompleted={completedTaskIds.includes(task.id)}
      isBookmarked={bookmarkedIds.includes(task.id)}
      hasNote={Boolean(taskNotes[task.id])}
      onToggleComplete={handleToggleComplete}
      onToggleBookmark={handleToggleBookmark}
      onOpenMastery={openMastery}
      activeSoftware={activeSoftware}
    />
  );

  const completedCount = completedTaskIds.length;
  const totalCount = ALL_TASKS.length;

  const pct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <GaapNavContext.Provider value={gaapNav}>
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.surface} />
        <View style={styles.frame}>
          {isDesktop && (
            <View style={[styles.sidebar, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 16 }]}>
              <View style={styles.sideBrand}>
                <View style={styles.sideLogo}>
                  <Ionicons name="business" size={18} color="#FFFFFF" />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.sideTitle}>RealPage Master</Text>
                  <Text style={styles.sideSubtitle}>US Offshore Property Accounting</Text>
                </View>
              </View>
              <Text style={styles.sideSection}>WORKSPACE</Text>
              {NAV_ITEMS.map((item) => {
                const on = activeTab === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={[styles.sideItem, on && styles.sideItemActive]}
                    onPress={() => selectTab(item.key)}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: on }}
                  >
                    <View style={[styles.sideAccent, on && { backgroundColor: item.accent }]} />
                    <Ionicons name={on ? item.icon : `${item.icon}-outline`} size={17} color={on ? item.accent : COLORS.textMuted} />
                    <Text style={[styles.sideItemText, on && styles.sideItemTextActive]}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
              <View style={styles.flex} />
              <View style={styles.sideFooter}>
                <Text style={styles.sideFooterLabel}>TODAY'S SHIFT</Text>
                <Text style={styles.sideFooterValue}>
                  {completedCount}/{totalCount} tasks · {pct}%
                </Text>
                <View style={styles.sideTrack}>
                  <View style={[styles.sideFill, { width: `${pct}%` }]} />
                </View>
                <Text style={styles.sideFooterMeta}>{SCREEN_COUNT.toLocaleString()} RealPage screens indexed</Text>
              </View>
            </View>
          )}

          <View
            style={[
              styles.main,
              { paddingTop: insets.top, paddingLeft: isDesktop ? 0 : insets.left, paddingRight: insets.right },
            ]}
          >
            <View style={[styles.column, isDesktop && styles.columnDesktop]}>
              {/* Global Executive Header */}
              <HeaderBar
                hideBrand={isDesktop}
                selectedProperty={selectedProperty}
                onOpenPropertyPicker={() => setPropertyPickerVisible(true)}
                activeSoftware={activeSoftware}
                onToggleSoftware={handleToggleSoftware}
                completedCount={completedCount}
                totalCount={totalCount}
              />

              {/* MAIN BODY AREA SWITCHED BY TAB */}
              <View style={styles.body}>
                {/* TAB 1: DAILY TASK COMMAND HUB */}
                {activeTab === 'tasks' && (
                  <View style={styles.tasksContainer}>
                    {/* Phase Switcher Horizontal Scroll */}
                    <View style={styles.phaseBar}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.phaseScroll}>
                        {TASK_PHASES.map((ph) => {
                          const isSelected = selectedPhase === ph;
                          const count = ph === 'All' ? ALL_TASKS.length : ALL_TASKS.filter((t) => t.phase === ph).length;
                          return (
                            <TouchableOpacity
                              key={ph}
                              style={[styles.phaseChip, isSelected && styles.phaseChipActive]}
                              onPress={() => {
                                triggerHaptic('light');
                                setSelectedPhase(ph);
                              }}
                            >
                              <Text style={[styles.phaseChipText, isSelected && styles.phaseChipTextActive]}>
                                {ph}
                              </Text>
                              <View style={[styles.phaseCountPill, isSelected && styles.phaseCountPillActive]}>
                                <Text style={[styles.phaseCountText, isSelected && styles.phaseCountTextActive]}>
                                  {count}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>

                    {/* Priority Filter & Phase Title Row */}
                    <View style={styles.subFilterRow}>
                      <Text style={styles.listHeading}>
                        {selectedPhase === 'All' ? `All ${ALL_TASKS.length} Offshore Tasks` : selectedPhase}
                        <Text style={styles.listHeadingCount}> ({filteredTasks.length})</Text>
                      </Text>

                      <View style={styles.priorityFilterGroup}>
                        {['All', 'High', 'Medium'].map((prio) => {
                          const isSelected = selectedPriority === prio;
                          return (
                            <TouchableOpacity
                              key={prio}
                              style={[styles.prioButton, isSelected && styles.prioButtonActive]}
                              onPress={() => {
                                triggerHaptic('light');
                                setSelectedPriority(prio);
                              }}
                            >
                              <Text style={[styles.prioText, isSelected && styles.prioTextActive]}>
                                {prio}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>

                    {/* Tasks List (virtualized) */}
                    <FlatList
                      style={styles.tasksScroll}
                      contentContainerStyle={styles.tasksListContent}
                      data={filteredTasks}
                      keyExtractor={(t) => t.id}
                      renderItem={renderTask}
                      extraData={`${completedTaskIds.length}|${bookmarkedIds.length}|${activeSoftware}|${Object.keys(taskNotes).length}`}
                      initialNumToRender={8}
                      maxToRenderPerBatch={8}
                      windowSize={7}
                      removeClippedSubviews={Platform.OS === 'android'}
                      ListEmptyComponent={
                        <View style={styles.emptyTasksBox}>
                          <Ionicons name="filter-outline" size={36} color={COLORS.textMuted} />
                          <Text style={styles.emptyTasksTitle}>No tasks match this filter</Text>
                          <Text style={styles.emptyTasksSub}>Try switching the priority or phase filter above.</Text>
                        </View>
                      }
                    />
                  </View>
                )}

                {/* TAB 2: MONTH-END CLOSE COCKPIT */}
                {activeTab === 'close' && <CloseCockpit onOpenScreen={openScreen} />}

                {/* TAB 3: REALPAGE SYSTEM TWIN EXPLORER */}
                {activeTab === 'explorer' && <RealPageExplorer focus={explorerFocus} />}

                {/* TAB 3: COMMAND SEARCH & EXCEPTION TRIAGE */}
                {activeTab === 'search' && (
                  <CommandSearch
                    onSelectTask={openMastery}
                    onOpenScreen={openScreen}
                  />
                )}

                {/* TAB 4: YARDI COMPARISON & GLOSSARY */}
                {activeTab === 'tools' && (
                  <YardiAndTools
                    bookmarkedIds={bookmarkedIds}
                    taskNotes={taskNotes}
                    onSelectTask={openMastery}
                    onOpenScreen={openScreen}
                    onOpenModule={openModule}
                  />
                )}

                {/* TAB 6: US GAAP CODEX (99 ASC Topics, cards and text lazy-loaded) */}
                {activeTab === 'codex' && <GaapCodex focus={codexFocus} />}
              </View>
            </View>

            {/* BOTTOM TAB BAR (phones / tablets) — clears the home indicator */}
            {!isDesktop && (
              <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
                {NAV_ITEMS.map((item) => {
                  const on = activeTab === item.key;
                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={styles.navItem}
                      onPress={() => selectTab(item.key)}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: on }}
                      accessibilityLabel={item.label}
                    >
                      <View style={[styles.navIconWrap, on && { backgroundColor: `${item.accent}1F` }]}>
                        <Ionicons name={on ? item.icon : `${item.icon}-outline`} size={20} color={on ? item.accent : COLORS.textMuted} />
                      </View>
                      <Text style={[styles.navLabel, on && { color: COLORS.text }]} numberOfLines={1}>
                        {item.short || item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>

        {/* CLICK-BY-CLICK SCREEN SOP MODAL */}
        <ScreenSopModal
          screenId={sopScreen ? sopScreen.id : null}
          contextLabel={sopScreen ? sopScreen.context : null}
          onClose={() => setSopScreen(null)}
          onOpenInExplorer={openInExplorer}
        />

        {/* 5-POINT MASTERY DEEP DIVE MODAL */}
        <MasteryModal
          visible={Boolean(selectedTaskForMastery)}
          task={selectedTaskForMastery}
          onClose={() => setSelectedTaskForMastery(null)}
          isCompleted={selectedTaskForMastery ? completedTaskIds.includes(selectedTaskForMastery.id) : false}
          isBookmarked={selectedTaskForMastery ? bookmarkedIds.includes(selectedTaskForMastery.id) : false}
          onToggleComplete={handleToggleComplete}
          onToggleBookmark={handleToggleBookmark}
          currentNote={selectedTaskForMastery ? taskNotes[selectedTaskForMastery.id] : ''}
          onSaveNote={handleSaveNote}
        />

        {/* PROPERTY PICKER MODAL */}
        <Modal
          visible={propertyPickerVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setPropertyPickerVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setPropertyPickerVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Ionicons name="business" size={18} color={COLORS.primaryLight} />
                <Text style={styles.modalTitle}>Select Portfolio / Property</Text>
              </View>

              {PROPERTIES.map((prop) => {
                const isSelected = selectedProperty === prop;
                return (
                  <TouchableOpacity
                    key={prop}
                    style={[styles.propItem, isSelected && styles.propItemActive]}
                    onPress={() => handleSelectProperty(prop)}
                  >
                    <Text style={[styles.propItemText, isSelected && styles.propItemTextActive]}>
                      {prop}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={18} color={COLORS.success} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </GaapNavContext.Provider>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  frame: {
    flex: 1,
    flexDirection: 'row',
  },
  main: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  column: {
    flex: 1,
    width: '100%',
  },
  columnDesktop: {
    maxWidth: LAYOUT.CONTENT_MAX,
    alignSelf: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
  },
  sidebar: {
    width: LAYOUT.SIDEBAR_WIDTH,
    backgroundColor: COLORS.surface,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingHorizontal: 14,
  },
  sideBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
    paddingHorizontal: 4,
  },
  sideLogo: {
    width: 34,
    height: 34,
    borderRadius: RADII.md,
    backgroundColor: COLORS.primaryDark,
    borderWidth: 1,
    borderColor: `${COLORS.primaryLight}55`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sideTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  sideSubtitle: {
    fontSize: 10.5,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  sideSection: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1.1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  sideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingRight: 10,
    borderRadius: RADII.md,
    marginBottom: 2,
  },
  sideItemActive: {
    backgroundColor: COLORS.surfaceHighlight,
  },
  sideAccent: {
    width: 3,
    height: 18,
    borderRadius: 2,
    marginRight: 9,
    backgroundColor: 'transparent',
  },
  sideItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: 10,
  },
  sideItemTextActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
  sideFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 14,
    paddingHorizontal: 6,
  },
  sideFooterLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1.1,
  },
  sideFooterValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 4,
  },
  sideTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.surfaceHighlight,
    marginTop: 8,
    overflow: 'hidden',
  },
  sideFill: {
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  sideFooterMeta: {
    fontSize: 10.5,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  body: {
    flex: 1,
  },
  tasksContainer: {
    flex: 1,
  },
  phaseBar: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  phaseScroll: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  phaseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  phaseChipActive: {
    backgroundColor: `${COLORS.primary}26`,
    borderColor: `${COLORS.primary}99`,
  },
  phaseChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginRight: 6,
  },
  phaseChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  phaseCountPill: {
    backgroundColor: COLORS.surfaceInput,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  phaseCountPillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  phaseCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  phaseCountTextActive: {
    color: '#FFFFFF',
  },
  subFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.background,
  },
  listHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  listHeadingCount: {
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  priorityFilterGroup: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  prioButton: {
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  prioButtonActive: {
    backgroundColor: `${COLORS.primary}33`,
  },
  prioText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  prioTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tasksScroll: {
    flex: 1,
  },
  tasksListContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
  },
  emptyTasksBox: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTasksTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 10,
  },
  emptyTasksSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 6,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  navIconWrap: {
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderRadius: RADII.pill,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 8,
  },
  propItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: COLORS.surfaceLight,
  },
  propItemActive: {
    backgroundColor: COLORS.surfaceHighlight,
    borderColor: COLORS.primaryLight,
    borderWidth: 1,
  },
  propItemText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  propItemTextActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
});
