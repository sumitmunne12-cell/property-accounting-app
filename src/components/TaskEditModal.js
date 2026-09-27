import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { LAYOUT, RADII } from '../theme/layout';
import { triggerHaptic } from '../utils/haptics';
import { CLOSE_ROLES } from '../data/closePlaybookData';
import { TASK_PHASES, TASK_PRIORITIES } from '../data/tasksData';
import { BackButton, SegmentedToggle, SectionLabel } from './ui';

const FALLBACK_PHASES = [
  'Ongoing - Daily',
  'Ongoing - Weekly',
  'Pre-AME',
  'Post-AME',
  'Review',
  'Reporting',
  'Ongoing - Monthly',
  'Ongoing - Quarterly',
];

const DAILY_PHASES = Array.isArray(TASK_PHASES)
  ? TASK_PHASES.filter((p) => p !== 'All')
  : FALLBACK_PHASES;

const TASK_PRIORITY_OPTIONS = Array.isArray(TASK_PRIORITIES) && TASK_PRIORITIES.length > 0
  ? TASK_PRIORITIES
  : ['High', 'Medium', 'Low'];

export default function TaskEditModal({
  visible,
  type = 'close', // 'close' | 'daily'
  initialTask = null, // null for new task, or existing task object
  targetPhaseId = null, // for close tasks: default phase id (e.g. 'phase1')
  closePhases = [], // array of close phases for selection
  onSave,
  onClose,
}) {
  if (!visible) return null;

  const insets = useSafeAreaInsets();
  const isEditing = Boolean(initialTask);

  // Close task form state
  const [closeTitle, setCloseTitle] = useState(initialTask?.title || '');
  const [closePhaseId, setClosePhaseId] = useState(targetPhaseId || 'phase1');
  const [closeOwner, setCloseOwner] = useState(initialTask?.owner || 'offshore');
  const [closeCritical, setCloseCritical] = useState(Boolean(initialTask?.critical));
  const [closeInstructions, setCloseInstructions] = useState(initialTask?.instructions || '');
  const [closeControlCheck, setCloseControlCheck] = useState(initialTask?.controlCheck || '');
  const [closeEvidence, setCloseEvidence] = useState(initialTask?.evidence || '');
  const [closeYardi, setCloseYardi] = useState(initialTask?.yardiEquivalent || '');

  // Daily task form state
  const [dailyName, setDailyName] = useState(initialTask?.name || '');
  const [dailyPhase, setDailyPhase] = useState(initialTask?.phase || 'Daily Operations');
  const [dailyPriority, setDailyPriority] = useState(initialTask?.priority || 'Medium');
  const [dailyCategory, setDailyCategory] = useState(initialTask?.category || 'General Accounting');
  const [dailyModule, setDailyModule] = useState(initialTask?.rpModule || 'GL');
  const [dailyPurpose, setDailyPurpose] = useState(initialTask?.purpose || '');
  const [dailySopText, setDailySopText] = useState(
    Array.isArray(initialTask?.actionSOP) ? initialTask.actionSOP.join('\n') : (initialTask?.actionSOP || '')
  );
  const [dailyRpNav, setDailyRpNav] = useState(
    Array.isArray(initialTask?.navigation?.realpage)
      ? initialTask.navigation.realpage.join(' > ')
      : (initialTask?.navigation?.realpage || '')
  );
  const [dailyYardiNav, setDailyYardiNav] = useState(
    Array.isArray(initialTask?.navigation?.yardi)
      ? initialTask.navigation.yardi.join(' > ')
      : (initialTask?.navigation?.yardi || '')
  );

  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = () => {
    if (type === 'close') {
      const cleanTitle = closeTitle.trim();
      if (!cleanTitle) {
        setErrorMessage('Please enter a task title.');
        triggerHaptic('warning');
        return;
      }
      setErrorMessage('');
      triggerHaptic('success');
      onSave({
        ...(initialTask || {}),
        title: cleanTitle,
        owner: closeOwner,
        critical: closeCritical,
        instructions: closeInstructions.trim(),
        controlCheck: closeControlCheck.trim(),
        evidence: closeEvidence.trim(),
        yardiEquivalent: closeYardi.trim(),
      }, closePhaseId);
    } else {
      const cleanName = dailyName.trim();
      if (!cleanName) {
        setErrorMessage('Please enter a task name.');
        triggerHaptic('warning');
        return;
      }
      setErrorMessage('');
      triggerHaptic('success');

      const sopSteps = dailySopText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const rpNavArr = dailyRpNav
        .split(/[>,]/)
        .map((s) => s.trim())
        .filter(Boolean);

      const yardiNavArr = dailyYardiNav
        .split(/[>,]/)
        .map((s) => s.trim())
        .filter(Boolean);

      onSave({
        ...(initialTask || {}),
        name: cleanName,
        phase: dailyPhase,
        priority: dailyPriority,
        category: dailyCategory.trim() || 'General Accounting',
        rpModule: dailyModule.trim().toUpperCase() || 'GL',
        purpose: dailyPurpose.trim(),
        actionSOP: sopSteps.length ? sopSteps : ['Execute task according to company SOP.'],
        navigation: {
          realpage: rpNavArr.length ? rpNavArr : ['General Ledger', 'All'],
          yardi: yardiNavArr.length ? yardiNavArr : ['Financials'],
        },
      });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.header}>
          <BackButton onPress={onClose} label="Cancel" variant="minimal" />
          <Text style={styles.headerTitle}>
            {isEditing ? (type === 'close' ? 'Edit Close Task' : 'Edit Daily Task') : (type === 'close' ? 'Add Close Task' : 'Add Daily Task')}
          </Text>
          <TouchableOpacity style={styles.saveHeaderBtn} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.saveHeaderBtnText}>Save</Text>
          </TouchableOpacity>
        </View>

        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {type === 'close' ? (
            /* CLOSE CHECKLIST TASK FORM */
            <View>
              {/* Phase selector if not editing or if phases provided */}
              {!isEditing && closePhases.length > 0 && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Target Close Phase</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                    {closePhases.map((ph) => {
                      const isSel = closePhaseId === ph.id;
                      return (
                        <TouchableOpacity
                          key={ph.id}
                          style={[styles.chip, isSel && styles.chipActive]}
                          onPress={() => {
                            triggerHaptic('light');
                            setClosePhaseId(ph.id);
                          }}
                        >
                          <Text style={[styles.chipText, isSel && styles.chipTextActive]}>
                            {`P${ph.number}: ${ph.title}`}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Task Title *</Text>
                <TextInput
                  style={styles.input}
                  value={closeTitle}
                  onChangeText={setCloseTitle}
                  placeholder="e.g. Verify open POs & accrued expenses"
                  placeholderTextColor={COLORS.textMuted}
                  accessibilityLabel="Close Task Title"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Responsible Role</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                  {Object.entries(CLOSE_ROLES).map(([roleKey, roleLabel]) => {
                    const isSel = closeOwner === roleKey;
                    return (
                      <TouchableOpacity
                        key={roleKey}
                        style={[styles.chip, isSel && styles.chipActive]}
                        onPress={() => {
                          triggerHaptic('light');
                          setCloseOwner(roleKey);
                        }}
                      >
                        <Text style={[styles.chipText, isSel && styles.chipTextActive]}>{roleLabel}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchInfo}>
                  <Text style={styles.switchLabel}>Critical Lock-Gate Task</Text>
                  <Text style={styles.switchSub}>Must be completed before advancing to next close phase</Text>
                </View>
                <Switch
                  value={closeCritical}
                  onValueChange={(val) => {
                    triggerHaptic('light');
                    setCloseCritical(val);
                  }}
                  trackColor={{ false: COLORS.surfaceHighlight, true: COLORS.danger }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>What to Do (Instructions)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={closeInstructions}
                  onChangeText={setCloseInstructions}
                  placeholder="Detailed instructions for the accountant executing this close task..."
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Control Check (Validation)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={closeControlCheck}
                  onChangeText={setCloseControlCheck}
                  placeholder="Expected zero variance or tie-out condition..."
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Evidence for Close Binder</Text>
                <TextInput
                  style={styles.input}
                  value={closeEvidence}
                  onChangeText={setCloseEvidence}
                  placeholder="e.g. Reconciliation schedule export, AP aging tie-out"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Yardi Voyager Equivalent (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={closeYardi}
                  onChangeText={setCloseYardi}
                  placeholder="e.g. Financials > Journal Entry (Auto Reverse)"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>
          ) : (
            /* DAILY HUB TASK FORM */
            <View>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Task Name *</Text>
                <TextInput
                  style={styles.input}
                  value={dailyName}
                  onChangeText={setDailyName}
                  placeholder="e.g. Record Monthly Management Fee Accrual"
                  placeholderTextColor={COLORS.textMuted}
                  accessibilityLabel="Daily Task Name"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Phase</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                  {DAILY_PHASES.map((ph) => {
                    const isSel = dailyPhase === ph;
                    return (
                      <TouchableOpacity
                        key={ph}
                        style={[styles.chip, isSel && styles.chipActive]}
                        onPress={() => {
                          triggerHaptic('light');
                          setDailyPhase(ph);
                        }}
                      >
                        <Text style={[styles.chipText, isSel && styles.chipTextActive]}>{ph}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Priority</Text>
                <View style={styles.row}>
                  {TASK_PRIORITY_OPTIONS.map((pri) => {
                    const isSel = dailyPriority === pri;
                    const color = pri === 'High' ? COLORS.danger : pri === 'Medium' ? COLORS.warning : COLORS.success;
                    return (
                      <TouchableOpacity
                        key={pri}
                        style={[styles.priorityBtn, isSel && { borderColor: color, backgroundColor: `${color}20` }]}
                        onPress={() => {
                          triggerHaptic('light');
                          setDailyPriority(pri);
                        }}
                      >
                        <Text style={[styles.priorityBtnText, isSel && { color, fontWeight: '700' }]}>{pri}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.fieldLabel}>Category</Text>
                  <TextInput
                    style={styles.input}
                    value={dailyCategory}
                    onChangeText={setDailyCategory}
                    placeholder="e.g. Accrual Posting"
                    placeholderTextColor={COLORS.textMuted}
                  />
                </View>
                <View style={[styles.fieldGroup, { width: 90 }]}>
                  <Text style={styles.fieldLabel}>Module</Text>
                  <TextInput
                    style={styles.input}
                    value={dailyModule}
                    onChangeText={setDailyModule}
                    placeholder="GL"
                    placeholderTextColor={COLORS.textMuted}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Purpose & Accounting Impact</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={dailyPurpose}
                  onChangeText={setDailyPurpose}
                  placeholder="Explain why and when this entry is performed..."
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Action SOP Steps (one per line)</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { minHeight: 120 }]}
                  value={dailySopText}
                  onChangeText={setDailySopText}
                  placeholder={'1. Navigate to General Ledger > All > Journal Entry\n2. Click Add\n3. Input accounts and post'}
                  placeholderTextColor={COLORS.textMuted}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>RealPage Menu Navigation (use &gt;)</Text>
                <TextInput
                  style={styles.input}
                  value={dailyRpNav}
                  onChangeText={setDailyRpNav}
                  placeholder="General Ledger > All > Journal Entry > View Transactions"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Yardi Voyager Navigation (use &gt;)</Text>
                <TextInput
                  style={styles.input}
                  value={dailyYardiNav}
                  onChangeText={setDailyYardiNav}
                  placeholder="Financials > Journal Entries > Copy Journal"
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.bottomSaveBtn} onPress={handleSave} activeOpacity={0.8}>
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.bottomSaveBtnText}>{isEditing ? 'Save Changes' : 'Create Task'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  saveHeaderBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADII.sm,
    backgroundColor: COLORS.accent,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.danger}20`,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.danger,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: RADII.xs,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
  },
  textArea: {
    minHeight: 80,
  },
  chipScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  switchInfo: {
    flex: 1,
    marginRight: 12,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  switchSub: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.sm,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 3,
    minHeight: 40,
    justifyContent: 'center',
  },
  priorityBtnText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  bottomSaveBtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.success,
    borderRadius: RADII.sm,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    minHeight: 48,
  },
  bottomSaveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
