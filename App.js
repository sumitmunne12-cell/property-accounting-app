import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './src/theme/colors';
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
import { MODULE_FILE_TO_ID } from './src/utils/screenIndex';

export default function App() {
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'close' | 'explorer' | 'search' | 'tools'
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

  const openScreen = (screenId, context) => setSopScreen({ id: screenId, context });
  const openInExplorer = (moduleId, screenId) => {
    setSopScreen(null);
    setExplorerFocus({ moduleId, screenId, nonce: Date.now() });
    setActiveTab('explorer');
  };
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

  const handleToggleComplete = async (taskId) => {
    const updated = await toggleTaskCompleted(taskId);
    setCompletedTaskIds(updated);
  };

  const handleToggleBookmark = async (taskId) => {
    const updated = await toggleBookmark(taskId);
    setBookmarkedIds(updated);
  };

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
  const filteredTasks = ALL_TASKS.filter((t) => {
    if (selectedPhase !== 'All' && t.phase !== selectedPhase) return false;
    if (selectedPriority !== 'All' && t.priority !== selectedPriority) return false;
    return true;
  });

  const completedCount = completedTaskIds.length;
  const totalCount = ALL_TASKS.length;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.surface} />

        {/* Global Executive Header */}
        <HeaderBar
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
                  {selectedPhase === 'All' ? 'All 77 Offshore Tasks' : selectedPhase}
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

              {/* Tasks List */}
              <ScrollView style={styles.tasksScroll} contentContainerStyle={styles.tasksListContent}>
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isCompleted={completedTaskIds.includes(task.id)}
                    isBookmarked={bookmarkedIds.includes(task.id)}
                    hasNote={Boolean(taskNotes[task.id])}
                    onToggleComplete={handleToggleComplete}
                    onToggleBookmark={handleToggleBookmark}
                    onOpenMastery={(t) => setSelectedTaskForMastery(t)}
                    activeSoftware={activeSoftware}
                  />
                ))}

                {filteredTasks.length === 0 && (
                  <View style={styles.emptyTasksBox}>
                    <Ionicons name="filter-outline" size={36} color={COLORS.textMuted} />
                    <Text style={styles.emptyTasksTitle}>No tasks match this filter</Text>
                    <Text style={styles.emptyTasksSub}>Try switching the priority or phase filter above.</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}

          {/* TAB 2: MONTH-END CLOSE COCKPIT */}
          {activeTab === 'close' && <CloseCockpit onOpenScreen={openScreen} />}

          {/* TAB 3: REALPAGE SYSTEM TWIN EXPLORER */}
          {activeTab === 'explorer' && <RealPageExplorer focus={explorerFocus} />}

          {/* TAB 3: COMMAND SEARCH & EXCEPTION TRIAGE */}
          {activeTab === 'search' && (
            <CommandSearch
              onSelectTask={(task) => setSelectedTaskForMastery(task)}
              onOpenScreen={openScreen}
            />
          )}

          {/* TAB 4: YARDI COMPARISON & GLOSSARY */}
          {activeTab === 'tools' && (
            <YardiAndTools
              bookmarkedIds={bookmarkedIds}
              taskNotes={taskNotes}
              onSelectTask={(task) => setSelectedTaskForMastery(task)}
              onOpenScreen={openScreen}
              onOpenModule={openModule}
            />
          )}
        </View>

        {/* BOTTOM NAVIGATION BAR */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              triggerHaptic('light');
              setActiveTab('tasks');
            }}
          >
            <Ionicons
              name={activeTab === 'tasks' ? 'checkbox' : 'checkbox-outline'}
              size={22}
              color={activeTab === 'tasks' ? COLORS.primaryLight : COLORS.textMuted}
            />
            <Text style={[styles.navLabel, activeTab === 'tasks' && styles.navLabelActive]}>
              Daily Hub
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              triggerHaptic('light');
              setActiveTab('close');
            }}
          >
            <Ionicons
              name={activeTab === 'close' ? 'lock-closed' : 'lock-closed-outline'}
              size={22}
              color={activeTab === 'close' ? COLORS.primaryLight : COLORS.textMuted}
            />
            <Text style={[styles.navLabel, activeTab === 'close' && styles.navLabelActive]}>
              Close
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              triggerHaptic('light');
              setActiveTab('explorer');
            }}
          >
            <Ionicons
              name={activeTab === 'explorer' ? 'desktop' : 'desktop-outline'}
              size={22}
              color={activeTab === 'explorer' ? COLORS.primaryLight : COLORS.textMuted}
            />
            <Text style={[styles.navLabel, activeTab === 'explorer' && styles.navLabelActive]}>
              RP Explorer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              triggerHaptic('light');
              setActiveTab('search');
            }}
          >
            <Ionicons
              name={activeTab === 'search' ? 'search' : 'search-outline'}
              size={22}
              color={activeTab === 'search' ? COLORS.primaryLight : COLORS.textMuted}
            />
            <Text style={[styles.navLabel, activeTab === 'search' && styles.navLabelActive]}>
              Triage & Search
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              triggerHaptic('light');
              setActiveTab('tools');
            }}
          >
            <Ionicons
              name={activeTab === 'tools' ? 'layers' : 'layers-outline'}
              size={22}
              color={activeTab === 'tools' ? COLORS.primaryLight : COLORS.textMuted}
            />
            <Text style={[styles.navLabel, activeTab === 'tools' && styles.navLabelActive]}>
              Yardi & Terms
            </Text>
          </TouchableOpacity>
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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  phaseChipActive: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryLight,
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
    backgroundColor: COLORS.primaryDark,
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
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 3,
  },
  navLabelActive: {
    color: COLORS.primaryLight,
    fontWeight: '700',
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
