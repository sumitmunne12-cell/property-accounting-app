import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  COMPLETED_TASKS: '@rp_completed_tasks_v1',
  TASK_NOTES: '@rp_task_notes_v1',
  BOOKMARKS: '@rp_bookmarks_v1',
  SELECTED_PROPERTY: '@rp_selected_property_v1',
  ACTIVE_SOFTWARE: '@rp_active_software_v1',
  EXCEPTION_RESOLUTIONS: '@rp_exception_resolutions_v1',
  CLOSE_PROGRESS: '@rp_close_progress_v1',
  ASC_STUDY: '@rp_asc_study_v1',
  COMPASS_PROGRESS: '@rp_compass_progress_v1',
  PROPERTIES: '@rp_properties_v1',
  CUSTOM_DAILY_TASKS: '@rp_custom_daily_tasks_v1',
  CUSTOM_CLOSE_PHASES: '@rp_custom_close_phases_v1',
};

export const getCompletedTasks = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_TASKS);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Error reading completed tasks', e);
    return [];
  }
};

export const toggleTaskCompleted = async (taskId) => {
  try {
    const completed = await getCompletedTasks();
    let updated;
    if (completed.includes(taskId)) {
      updated = completed.filter((id) => id !== taskId);
    } else {
      updated = [...completed, taskId];
    }
    await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_TASKS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error toggling task completion', e);
    return [];
  }
};

export const getTaskNotes = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.TASK_NOTES);
    return json ? JSON.parse(json) : {};
  } catch (e) {
    console.error('Error reading task notes', e);
    return {};
  }
};

export const saveTaskNote = async (taskId, noteText) => {
  try {
    const notes = await getTaskNotes();
    const updated = { ...notes, [taskId]: noteText };
    await AsyncStorage.setItem(STORAGE_KEYS.TASK_NOTES, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving task note', e);
    return {};
  }
};

export const getBookmarks = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error('Error reading bookmarks', e);
    return [];
  }
};

export const toggleBookmark = async (id) => {
  try {
    const bookmarks = await getBookmarks();
    let updated;
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter((item) => item !== id);
    } else {
      updated = [...bookmarks, id];
    }
    await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error toggling bookmark', e);
    return [];
  }
};

// Selected property id ('all' for every property; older versions stored the property name).
export const getSelectedProperty = async () => {
  try {
    return (await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_PROPERTY)) || 'all';
  } catch (e) {
    return 'all';
  }
};

export const saveSelectedProperty = async (propertyId) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_PROPERTY, propertyId);
  } catch (e) {
    console.error('Error saving selected property', e);
  }
};

export const getActiveSoftware = async () => {
  try {
    return (await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_SOFTWARE)) || 'realpage';
  } catch (e) {
    return 'realpage';
  }
};

export const saveActiveSoftware = async (software) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_SOFTWARE, software);
  } catch (e) {
    console.error('Error saving active software', e);
  }
};

// User-managed properties with their close timelines (see utils/propertyTimeline). null = never saved.
export const getProperties = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.PROPERTIES);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Error reading properties', e);
    return null;
  }
};

export const saveProperties = async (properties) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  } catch (e) {
    console.error('Error saving properties', e);
  }
  return properties;
};

// Month-end close progress: { [propertyId]: { [period 'YYYY-MM']: { [taskId]: ISO timestamp signed off } } }
// (older versions stored { [period]: … }; utils/propertyTimeline.migrateCloseProgress converts it)
export const getCloseProgress = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.CLOSE_PROGRESS);
    return json ? JSON.parse(json) : {};
  } catch (e) {
    console.error('Error reading close progress', e);
    return {};
  }
};

export const saveCloseProgress = async (progress) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CLOSE_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving close progress', e);
  }
  return progress;
};

// GAAP Codex study progress and bookmarks: { cards: { [trapId]: { box, due, seen, correct } }, bookmarks: [topic] }
export const getAscStudy = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.ASC_STUDY);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Error reading GAAP study progress', e);
    return null;
  }
};

export const saveAscStudy = async (study) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ASC_STUDY, JSON.stringify(study));
  } catch (e) {
    console.error('Error saving GAAP study progress', e);
  }
  return study;
};

// Deduction Compass drill progress: { answered, correct, steps: { app, stage, submenu }, misses: { ruleOrExceptionId: n } }
const EMPTY_COMPASS = { answered: 0, correct: 0, steps: { app: 0, stage: 0, submenu: 0 }, misses: {} };

export const getCompassProgress = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.COMPASS_PROGRESS);
    return json ? { ...EMPTY_COMPASS, ...JSON.parse(json) } : EMPTY_COMPASS;
  } catch (e) {
    console.error('Error reading compass progress', e);
    return EMPTY_COMPASS;
  }
};

export const saveCompassProgress = async (progress) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.COMPASS_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving compass progress', e);
  }
  return progress;
};

// User-customized Daily Hub tasks (null = user has not overridden default tasks)
export const getStoredDailyTasks = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_DAILY_TASKS);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Error reading custom daily tasks', e);
    return null;
  }
};

export const saveStoredDailyTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_DAILY_TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving custom daily tasks', e);
  }
  return tasks;
};

export const resetStoredDailyTasks = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CUSTOM_DAILY_TASKS);
  } catch (e) {
    console.error('Error resetting custom daily tasks', e);
  }
};

// User-customized Month-End Close phases and tasks (null = user has not overridden default close phases)
export const getStoredClosePhases = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_CLOSE_PHASES);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Error reading custom close phases', e);
    return null;
  }
};

export const saveStoredClosePhases = async (phases) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_CLOSE_PHASES, JSON.stringify(phases));
  } catch (e) {
    console.error('Error saving custom close phases', e);
  }
  return phases;
};

export const resetStoredClosePhases = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CUSTOM_CLOSE_PHASES);
  } catch (e) {
    console.error('Error resetting custom close phases', e);
  }
};

