import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  COMPLETED_TASKS: '@rp_completed_tasks_v1',
  TASK_NOTES: '@rp_task_notes_v1',
  BOOKMARKS: '@rp_bookmarks_v1',
  SELECTED_PROPERTY: '@rp_selected_property_v1',
  ACTIVE_SOFTWARE: '@rp_active_software_v1',
  EXCEPTION_RESOLUTIONS: '@rp_exception_resolutions_v1',
  CLOSE_PROGRESS: '@rp_close_progress_v1',
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

export const getSelectedProperty = async () => {
  try {
    return (await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_PROPERTY)) || 'All Properties';
  } catch (e) {
    return 'All Properties';
  }
};

export const saveSelectedProperty = async (propName) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_PROPERTY, propName);
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

// Month-end close progress: { [period 'YYYY-MM']: { [taskId]: ISO timestamp signed off } }
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
