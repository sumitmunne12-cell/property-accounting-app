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
  BackHandler,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './src/theme/colors';
import { LAYOUT, RADII } from './src/theme/layout';
import {
  ALL_TASKS,
  TASK_PHASES,
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
  getProperties,
  saveProperties,
  getCloseProgress,
  saveCloseProgress,
  getStoredDailyTasks,
  saveStoredDailyTasks,
  resetStoredDailyTasks,
  getStoredClosePhases,
  saveStoredClosePhases,
  resetStoredClosePhases,
} from './src/utils/storage';
import {
  reorderDailyTask,
  updateDailyTask,
  addDailyTask,
  removeDailyTask,
  getDefaultDailyTasks,
  getDefaultClosePhases,
} from './src/utils/taskManager';
import {
  ALL_PROPERTIES,
  seedProperties,
  normalizeProperties,
  resolveSelection,
  propertyLabel,
  migrateCloseProgress,
} from './src/utils/propertyTimeline';
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
import SwipeBackView from './src/components/SwipeBackView';
import DeductionCompass from './src/components/compass/DeductionCompass';
import PropertySetup from './src/components/PropertySetup';
import CloseTimelineStrip from './src/components/CloseTimelineStrip';
import TaskEditModal from './src/components/TaskEditModal';

const TAB_TITLES = {
  tasks: 'Daily Hub',
  close: 'Close',
  explorer: 'Explorer',
  compass: 'Compass',
  search: 'Triage',
  tools: 'Yardi',
  codex: 'Codex',
};

const NAV_ITEMS = [
  { key: 'tasks', label: 'Daily Hub', icon: 'checkbox', accent: COLORS.success },
  { key: 'close', label: 'Close', icon: 'lock-closed', accent: COLORS.close },
  { key: 'explorer', label: 'RP Explorer', short: 'Explorer', icon: 'desktop', accent: COLORS.info },
  { key: 'compass', label: 'Deduction Compass', short: 'Compass', icon: 'compass', accent: COLORS.warning },
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
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'close' | 'explorer' | 'compass' | 'search' | 'tools' | 'codex'
  const [navHistory, setNavHistory] = useState(['tasks']);
  const [selectedPhase, setSelectedPhase] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  // User-managed properties, each with its own close timeline (utils/propertyTimeline).
  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(ALL_PROPERTIES);
  const [propertySetup, setPropertySetup] = useState({ visible: false, editId: null });
  const [activeSoftware, setActiveSoftware] = useState('realpage'); // 'realpage' | 'yardi'

  // User-customized daily tasks and close phases
  const [dailyTasks, setDailyTasks] = useState(ALL_TASKS);
  const [closePhases, setClosePhases] = useState(getDefaultClosePhases());
  const [isManageDailyMode, setIsManageDailyMode] = useState(false);
  const [editingDailyTask, setEditingDailyTask] = useState(null);
  const [isAddingDailyTask, setIsAddingDailyTask] = useState(false);
  
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
  // Hand-off from the Deduction Compass scenario box to Triage & Search: { text, nonce }
  const [searchFocus, setSearchFocus] = useState(null);

  const navigateToTab = useCallback((tabKey, replace = false) => {
    triggerHaptic('light');
    setActiveTab(tabKey);
    setNavHistory((prev) => {
      if (replace) {
        const next = [...prev];
        next[next.length - 1] = tabKey;
        return next;
      }
      if (prev[prev.length - 1] === tabKey) return prev;
      return [...prev, tabKey];
    });
  }, []);

  const handleGoBack = useCallback(() => {
    if (editingDailyTask || isAddingDailyTask) {
      setEditingDailyTask(null);
      setIsAddingDailyTask(false);
      return true;
    }
    if (propertySetup.visible) {
      setPropertySetup({ visible: false, editId: null });
      return true;
    }
    if (propertyPickerVisible) {
      setPropertyPickerVisible(false);
      return true;
    }
    if (selectedTaskForMastery) {
      setSelectedTaskForMastery(null);
      return true;
    }
    if (sopScreen) {
      setSopScreen(null);
      return true;
    }
    if (navHistory.length > 1) {
      triggerHaptic('light');
      const nextHistory = [...navHistory];
      nextHistory.pop();
      const prevTab = nextHistory[nextHistory.length - 1];
      setNavHistory(nextHistory);
      setActiveTab(prevTab);
      return true;
    }
    if (activeTab !== 'tasks') {
      triggerHaptic('light');
      setNavHistory(['tasks']);
      setActiveTab('tasks');
      return true;
    }
    return false;
  }, [propertySetup.visible, propertyPickerVisible, selectedTaskForMastery, sopScreen, navHistory, activeTab]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      return handleGoBack();
    });
    return () => sub.remove();
  }, [handleGoBack]);

  const canGoBack = navHistory.length > 1 || activeTab !== 'tasks';
  const previousTabKey = navHistory.length > 1 ? navHistory[navHistory.length - 2] : 'tasks';
  const backLabel = TAB_TITLES[previousTabKey] || 'Daily Hub';

  const openScreen = (screenId, context) => setSopScreen({ id: screenId, context });
  const openInExplorer = (moduleId, screenId) => {
    setSopScreen(null);
    setExplorerFocus({ moduleId, screenId, nonce: Date.now() });
    navigateToTab('explorer');
  };
  // Any "📖 First-Principles GAAP" pop-up can hand off to the Codex tab.
  const gaapNav = useMemo(
    () => ({
      openInCodex: (topic, paragraph = null) => {
        setSopScreen(null);
        setSelectedTaskForMastery(null);
        setCodexFocus({ topic, paragraph, nonce: Date.now() });
        navigateToTab('codex');
      },
    }),
    [navigateToTab]
  );
  const openInSearch = (text) => {
    setSearchFocus({ text, nonce: Date.now() });
    navigateToTab('search');
  };
  const openModule = (moduleFile) => {
    const moduleId = MODULE_FILE_TO_ID[moduleFile] || moduleFile;
    setExplorerFocus({ moduleId, screenId: null, nonce: Date.now() });
    navigateToTab('explorer');
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const completed = await getCompletedTasks();
    const bookmarks = await getBookmarks();
    const notes = await getTaskNotes();
    const soft = await getActiveSoftware();

    // User-managed custom daily tasks & close phases
    const customDaily = await getStoredDailyTasks();
    if (customDaily && Array.isArray(customDaily)) setDailyTasks(customDaily);
    const customClose = await getStoredClosePhases();
    if (customClose && Array.isArray(customClose)) setClosePhases(customClose);

    // First run seeds the properties the app used to hard-code; afterwards the user's list wins.
    const stored = normalizeProperties(await getProperties());
    const props = stored || seedProperties();
    if (!stored) await saveProperties(props);
    const selected = resolveSelection(await getSelectedProperty(), props);
    await saveSelectedProperty(selected);
    // Close sign-offs used to be per period only; they now belong to a property.
    const rawProgress = await getCloseProgress();
    const migrated = migrateCloseProgress(rawProgress, props, selected);
    if (migrated !== rawProgress) await saveCloseProgress(migrated);

    setCompletedTaskIds(completed);
    setBookmarkedIds(bookmarks);
    setTaskNotes(notes);
    setProperties(props);
    setSelectedPropertyId(selected);
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

  const handleSelectProperty = async (propertyId) => {
    setSelectedPropertyId(propertyId);
    setPropertyPickerVisible(false);
    await saveSelectedProperty(propertyId);
    // A property's accounting system drives the RealPage / Yardi toggle.
    const prop = properties.find((p) => p.id === propertyId);
    if (prop && prop.software !== activeSoftware) await handleToggleSoftware(prop.software);
  };

  const openPropertySetup = (editId = null) => {
    setPropertyPickerVisible(false);
    setPropertySetup({ visible: true, editId });
  };

  const handleSaveProperties = async (next, deletedId = null) => {
    setProperties(next);
    await saveProperties(next);
    if (selectedPropertyId !== ALL_PROPERTIES && !next.some((p) => p.id === selectedPropertyId)) {
      setSelectedPropertyId(ALL_PROPERTIES);
      await saveSelectedProperty(ALL_PROPERTIES);
    }
    if (deletedId) {
      const progress = await getCloseProgress();
      if (progress && progress[deletedId]) {
        const rest = { ...progress };
        delete rest[deletedId];
        await saveCloseProgress(rest);
      }
    }
  };

  const handleToggleSoftware = async (soft) => {
    setActiveSoftware(soft);
    await saveActiveSoftware(soft);
  };

  // Daily Task Management Handlers
  const handleMoveDailyTask = useCallback((taskId, direction) => {
    triggerHaptic('light');
    setDailyTasks((prev) => {
      const updated = reorderDailyTask(prev, taskId, direction, selectedPhase);
      saveStoredDailyTasks(updated);
      return updated;
    });
  }, [selectedPhase]);

  const handleSaveDailyTaskModal = useCallback((taskData) => {
    setDailyTasks((prev) => {
      let updated;
      if (editingDailyTask) {
        updated = updateDailyTask(prev, editingDailyTask.id, taskData);
      } else {
        updated = addDailyTask(prev, taskData, true);
      }
      saveStoredDailyTasks(updated);
      return updated;
    });
    setEditingDailyTask(null);
    setIsAddingDailyTask(false);
  }, [editingDailyTask]);

  const handleDeleteDailyTask = useCallback((taskId) => {
    triggerHaptic('warning');
    setDailyTasks((prev) => {
      const updated = removeDailyTask(prev, taskId);
      saveStoredDailyTasks(updated);
      return updated;
    });
  }, []);

  const handleResetDailyTasks = useCallback(async () => {
    triggerHaptic('medium');
    const defaults = getDefaultDailyTasks();
    setDailyTasks(defaults);
    await resetStoredDailyTasks();
  }, []);

  const handleSaveClosePhases = useCallback(async (nextPhases) => {
    setClosePhases(nextPhases);
    await saveStoredClosePhases(nextPhases);
  }, []);

  // Filter Tasks based on Phase and Priority
  const filteredTasks = useMemo(
    () =>
      dailyTasks.filter((t) => {
        if (selectedPhase !== 'All' && t.phase !== selectedPhase) return false;
        if (selectedPriority !== 'All' && t.priority !== selectedPriority) return false;
        return true;
      }),
    [dailyTasks, selectedPhase, selectedPriority]
  );

  const selectTab = (key) => {
    navigateToTab(key);
  };

  const renderTask = ({ item: task, index }) => {
    const canMoveUp = index > 0;
    const canMoveDown = index < filteredTasks.length - 1;
    return (
      <TaskCard
        task={task}
        isCompleted={completedTaskIds.includes(task.id)}
        isBookmarked={bookmarkedIds.includes(task.id)}
        hasNote={Boolean(taskNotes[task.id])}
        onToggleComplete={handleToggleComplete}
        onToggleBookmark={handleToggleBookmark}
        onOpenMastery={openMastery}
        activeSoftware={activeSoftware}
        isManageMode={isManageDailyMode}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onMoveUp={() => handleMoveDailyTask(task.id, -1)}
        onMoveDown={() => handleMoveDailyTask(task.id, 1)}
        onEdit={(t) => setEditingDailyTask(t)}
        onDelete={(id) => handleDeleteDailyTask(id)}
      />
    );
  };

  const completedCount = completedTaskIds.length;
  const totalCount = dailyTasks.length;

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
                selectedProperty={propertyLabel(selectedPropertyId, properties)}
                onOpenPropertyPicker={() => setPropertyPickerVisible(true)}
                activeSoftware={activeSoftware}
                onToggleSoftware={handleToggleSoftware}
                completedCount={completedCount}
                totalCount={totalCount}
                canGoBack={canGoBack}
                onGoBack={handleGoBack}
                backLabel={backLabel}
              />

              {/* MAIN BODY AREA SWITCHED BY TAB */}
              <SwipeBackView
                enabled={canGoBack}
                onBack={handleGoBack}
                edgeOnly={true}
                edgeWidth={50}
                style={styles.body}
              >
                {/* TAB 1: DAILY TASK COMMAND HUB */}
                {activeTab === 'tasks' && (
                  <View style={styles.tasksContainer}>
                    {/* Close timeline of the selected property (or each property's next deadline) */}
                    <CloseTimelineStrip
                      properties={properties}
                      selectedPropertyId={selectedPropertyId}
                      tasks={dailyTasks}
                      completedTaskIds={completedTaskIds}
                      activePhase={selectedPhase}
                      onSelectPhase={setSelectedPhase}
                      onManage={openPropertySetup}
                    />

                    {/* Phase Switcher Horizontal Scroll */}
                    <View style={styles.phaseBar}>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.phaseScroll}>
                        {TASK_PHASES.map((ph) => {
                          const isSelected = selectedPhase === ph;
                          const count = ph === 'All' ? dailyTasks.length : dailyTasks.filter((t) => t.phase === ph).length;
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
                        {selectedPhase === 'All' ? `All ${dailyTasks.length} Offshore Tasks` : selectedPhase}
                        <Text style={styles.listHeadingCount}> ({filteredTasks.length})</Text>
                      </Text>

                      <View style={styles.actionFilterRow}>
                        <TouchableOpacity
                          style={[styles.manageTasksToggle, isManageDailyMode && styles.manageTasksToggleActive]}
                          onPress={() => {
                            triggerHaptic('light');
                            setIsManageDailyMode(!isManageDailyMode);
                          }}
                          accessibilityLabel={isManageDailyMode ? 'Done managing tasks' : 'Manage tasks'}
                        >
                          <Ionicons
                            name={isManageDailyMode ? 'checkmark-circle' : 'reorder-three'}
                            size={14}
                            color={isManageDailyMode ? COLORS.success : COLORS.primaryLight}
                          />
                          <Text style={[styles.manageTasksToggleText, isManageDailyMode && { color: COLORS.success }]}>
                            {isManageDailyMode ? 'Done' : 'Manage'}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.addTaskBtn}
                          onPress={() => {
                            triggerHaptic('light');
                            setIsAddingDailyTask(true);
                          }}
                          accessibilityLabel="Add new daily task"
                        >
                          <Ionicons name="add" size={14} color="#FFFFFF" />
                          <Text style={styles.addTaskBtnText}>New</Text>
                        </TouchableOpacity>

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
                    </View>

                    {/* Manage Tasks Informational Strip */}
                    {isManageDailyMode && (
                      <View style={styles.manageHelperBanner}>
                        <Ionicons name="information-circle-outline" size={15} color={COLORS.primaryLight} />
                        <Text style={styles.manageHelperText}>
                          Tap Up / Down to reorder tasks in {selectedPhase}. Edit or delete any task.
                        </Text>
                        <TouchableOpacity style={styles.manageResetBtn} onPress={handleResetDailyTasks}>
                          <Text style={styles.manageResetText}>Reset to defaults</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Tasks List (virtualized) */}
                    <FlatList
                      style={styles.tasksScroll}
                      contentContainerStyle={styles.tasksListContent}
                      data={filteredTasks}
                      keyExtractor={(t) => t.id}
                      renderItem={renderTask}
                      extraData={`${completedTaskIds.length}|${bookmarkedIds.length}|${activeSoftware}|${isManageDailyMode}|${dailyTasks.length}|${Object.keys(taskNotes).length}`}
                      initialNumToRender={8}
                      maxToRenderPerBatch={8}
                      windowSize={7}
                      removeClippedSubviews={Platform.OS === 'android'}
                      ListEmptyComponent={
                        <View style={styles.emptyTasksBox}>
                          <Ionicons name="filter-outline" size={36} color={COLORS.textMuted} />
                          <Text style={styles.emptyTasksTitle}>No tasks match this filter</Text>
                          <Text style={styles.emptyTasksSub}>Try switching the priority or phase filter above, or add a new task.</Text>
                        </View>
                      }
                    />
                  </View>
                )}

                {/* TAB 2: MONTH-END CLOSE COCKPIT */}
                {activeTab === 'close' && (
                  <CloseCockpit
                    onOpenScreen={openScreen}
                    properties={properties}
                    selectedPropertyId={selectedPropertyId}
                    onManageProperties={openPropertySetup}
                    closePhases={closePhases}
                    onSaveClosePhases={handleSaveClosePhases}
                  />
                )}

                {/* TAB 3: REALPAGE SYSTEM TWIN EXPLORER */}
                {activeTab === 'explorer' && <RealPageExplorer focus={explorerFocus} />}

                {/* DEDUCTION COMPASS: predict-then-reveal drill, scenario box, app × stage map */}
                {activeTab === 'compass' && (
                  <DeductionCompass
                    onOpenScreen={openScreen}
                    onOpenInExplorer={openInExplorer}
                    onOpenMastery={openMastery}
                    onSearchAll={openInSearch}
                  />
                )}

                {/* TAB 3: COMMAND SEARCH & EXCEPTION TRIAGE */}
                {activeTab === 'search' && (
                  <CommandSearch
                    onSelectTask={openMastery}
                    onOpenScreen={openScreen}
                    initialQuery={searchFocus}
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
              </SwipeBackView>
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

              <ScrollView style={styles.propList}>
                {[{ id: ALL_PROPERTIES, name: 'All Properties' }, ...properties].map((prop) => {
                  const isSelected = selectedPropertyId === prop.id;
                  return (
                    <TouchableOpacity
                      key={prop.id}
                      style={[styles.propItem, isSelected && styles.propItemActive]}
                      onPress={() => handleSelectProperty(prop.id)}
                    >
                      <View style={styles.flex}>
                        <Text style={[styles.propItemText, isSelected && styles.propItemTextActive]}>{prop.name}</Text>
                        {prop.software ? (
                          <Text style={styles.propItemMeta}>
                            {[prop.portfolio, prop.software === 'yardi' ? 'Yardi' : 'RealPage'].filter(Boolean).join(' · ')}
                          </Text>
                        ) : null}
                      </View>
                      {isSelected && <Ionicons name="checkmark" size={18} color={COLORS.success} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <TouchableOpacity style={styles.propManage} onPress={() => openPropertySetup()}>
                <Ionicons name="settings-outline" size={16} color={COLORS.primaryLight} />
                <Text style={styles.propManageText}>Manage properties & close timelines</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* PROPERTIES & CLOSE TIMELINES SETUP */}
        <PropertySetup
          visible={propertySetup.visible}
          editId={propertySetup.editId}
          properties={properties}
          onSave={handleSaveProperties}
          onClose={() => setPropertySetup({ visible: false, editId: null })}
        />

        {/* DAILY TASK CREATE / EDIT MODAL */}
        {Boolean(editingDailyTask || isAddingDailyTask) && (
          <TaskEditModal
            visible={Boolean(editingDailyTask || isAddingDailyTask)}
            type="daily"
            initialTask={editingDailyTask}
            onSave={handleSaveDailyTaskModal}
            onClose={() => {
              setEditingDailyTask(null);
              setIsAddingDailyTask(false);
            }}
          />
        )}
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
  actionFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  manageTasksToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 28,
  },
  manageTasksToggleActive: {
    borderColor: COLORS.success,
    backgroundColor: `${COLORS.success}18`,
  },
  manageTasksToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
  addTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: COLORS.accent,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 28,
  },
  addTaskBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  manageHelperBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}15`,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 6,
    gap: 8,
  },
  manageHelperText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  manageResetBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  manageResetText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
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
  propItemMeta: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  propList: {
    maxHeight: 360,
  },
  propManage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  propManageText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
});
