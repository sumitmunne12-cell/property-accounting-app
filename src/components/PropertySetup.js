// Properties & close timelines: add, edit and delete properties and set each one's month-end
// close calendar (business or calendar days, a window per close phase, holidays). Everything is
// stored on the device (utils/storage → @rp_properties_v1).
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { LAYOUT, RADII } from '../theme/layout';
import { triggerHaptic } from '../utils/haptics';
import { CLOSE_PHASES } from '../data/closePlaybookData';
import { defaultClosePeriod, periodLabel, shiftPeriod } from '../utils/closeEngine';
import {
  defaultTimeline,
  normalizeTimeline,
  validateTimeline,
  makeProperty,
  phaseSchedule,
  windowStatus,
  parseHolidays,
  formatRange,
  formatOffsets,
  OFFSET_MIN,
  OFFSET_MAX,
} from '../utils/propertyTimeline';
import { BackButton, SwipeBackView, SegmentedToggle, SectionLabel } from './ui';

const NEW = '__new__';

function Stepper({ label, value, basis, onChange }) {
  return (
    <View style={styles.stepper}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperRow}>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => onChange(value - 1)}
          disabled={value <= OFFSET_MIN}
          accessibilityLabel={`${label}: one day earlier`}
        >
          <Ionicons name="remove" size={14} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.stepValue}>{formatOffsets(value, value, basis)}</Text>
        <TouchableOpacity
          style={styles.stepBtn}
          onPress={() => onChange(value + 1)}
          disabled={value >= OFFSET_MAX}
          accessibilityLabel={`${label}: one day later`}
        >
          <Ionicons name="add" size={14} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PropertyEditor({ property, properties, onSave, onDelete, onCancel }) {
  const [name, setName] = useState(property ? property.name : '');
  const [portfolio, setPortfolio] = useState(property ? property.portfolio : '');
  const [software, setSoftware] = useState(property ? property.software : 'realpage');
  const [timeline, setTimeline] = useState(() => normalizeTimeline(property ? property.timeline : defaultTimeline()));
  const [holidayText, setHolidayText] = useState(() => (property ? property.timeline.holidays.join(', ') : ''));
  const [period, setPeriod] = useState(defaultClosePeriod());
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const draftTimeline = useMemo(() => ({ ...timeline, holidays: parseHolidays(holidayText) }), [timeline, holidayText]);
  const errors = useMemo(() => {
    const list = validateTimeline(draftTimeline);
    const clean = name.trim();
    if (!clean) list.unshift('Enter a property name.');
    else if (properties.some((p) => p.name.toLowerCase() === clean.toLowerCase() && (!property || p.id !== property.id))) {
      list.unshift(`A property named “${clean}” already exists.`);
    }
    return list;
  }, [draftTimeline, name, properties, property]);
  const schedule = useMemo(() => (validateTimeline(draftTimeline).length ? null : phaseSchedule(period, draftTimeline)), [period, draftTimeline]);
  const others = properties.filter((p) => !property || p.id !== property.id);

  const setWindow = (phaseId, key, value) => {
    setTimeline((t) => {
      const w = { ...t.phases[phaseId], [key]: value };
      if (key === 'start' && w.end < value) w.end = value;
      if (key === 'end' && w.start > value) w.start = value;
      return { ...t, phases: { ...t.phases, [phaseId]: w } };
    });
  };

  const save = () => {
    if (errors.length) {
      setShowErrors(true);
      triggerHaptic('warning');
      return;
    }
    const clean = normalizeTimeline(draftTimeline);
    const saved = property
      ? { ...property, name: name.trim(), portfolio: portfolio.trim(), software, timeline: clean }
      : makeProperty({ name, portfolio, software, timeline: clean }, properties.map((p) => p.id));
    triggerHaptic('success');
    onSave(saved);
  };

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <BackButton onPress={onCancel} label="Properties" variant="minimal" />
      <Text style={styles.title}>{property ? 'Edit property' : 'New property'}</Text>

      <SectionLabel icon="business-outline">Property</SectionLabel>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Property name (e.g. Arcadian Apartments)"
        placeholderTextColor={COLORS.textMuted}
        accessibilityLabel="Property name"
      />
      <TextInput
        style={styles.input}
        value={portfolio}
        onChangeText={setPortfolio}
        placeholder="Portfolio / owner (optional)"
        placeholderTextColor={COLORS.textMuted}
        accessibilityLabel="Portfolio or owner"
      />
      <Text style={styles.fieldLabel}>Accounting system</Text>
      <SegmentedToggle
        value={software}
        onChange={setSoftware}
        accent={software === 'yardi' ? COLORS.yardi : COLORS.info}
        options={[
          { key: 'realpage', label: 'RealPage' },
          { key: 'yardi', label: 'Yardi' },
        ]}
      />

      <SectionLabel icon="calendar-outline" style={styles.sectionGap}>
        Close timeline
      </SectionLabel>
      <Text style={styles.help}>
        Day 0 is the last {timeline.basis === 'business' ? 'business' : 'calendar'} day of the month being closed. Negative days fall before
        it, positive days after it. Each phase has a start and an end day.
      </Text>
      <Text style={styles.fieldLabel}>Count days as</Text>
      <SegmentedToggle
        value={timeline.basis}
        onChange={(basis) => setTimeline((t) => ({ ...t, basis }))}
        accent={COLORS.close}
        options={[
          { key: 'business', label: 'Business days' },
          { key: 'calendar', label: 'Calendar days' },
        ]}
      />

      <View style={styles.periodRow}>
        <TouchableOpacity style={styles.periodBtn} onPress={() => setPeriod(shiftPeriod(period, -1))} accessibilityLabel="Previous month">
          <Ionicons name="chevron-back" size={15} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.periodText}>Dates for the {periodLabel(period)} close</Text>
        <TouchableOpacity style={styles.periodBtn} onPress={() => setPeriod(shiftPeriod(period, 1))} accessibilityLabel="Next month">
          <Ionicons name="chevron-forward" size={15} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {CLOSE_PHASES.map((phase, idx) => {
        const w = timeline.phases[phase.id];
        const sched = schedule ? schedule[idx] : null;
        return (
          <View key={phase.id} style={styles.phaseRow}>
            <View style={styles.phaseHead}>
              <Text style={styles.phaseTitle}>
                P{phase.number} · {phase.title}
              </Text>
              <Text style={styles.phaseDates}>{sched ? formatRange(sched.start, sched.end) : '—'}</Text>
            </View>
            <View style={styles.stepPair}>
              <Stepper label="Start" value={w.start} basis={timeline.basis} onChange={(v) => setWindow(phase.id, 'start', v)} />
              <Stepper label="End" value={w.end} basis={timeline.basis} onChange={(v) => setWindow(phase.id, 'end', v)} />
            </View>
          </View>
        );
      })}

      {timeline.basis === 'business' ? (
        <>
          <Text style={styles.fieldLabel}>Holidays skipped when counting business days</Text>
          <TextInput
            style={[styles.input, styles.inputMulti]}
            value={holidayText}
            onChangeText={setHolidayText}
            placeholder="YYYY-MM-DD, e.g. 2026-11-26, 2026-12-25"
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
            accessibilityLabel="Holidays"
          />
        </>
      ) : null}

      <View style={styles.inlineActions}>
        <TouchableOpacity
          style={styles.chipBtn}
          onPress={() => {
            setTimeline(defaultTimeline());
            setHolidayText('');
          }}
        >
          <Ionicons name="refresh" size={13} color={COLORS.textSecondary} />
          <Text style={styles.chipBtnText}>Reset to default timeline</Text>
        </TouchableOpacity>
        {others.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={styles.chipBtn}
            onPress={() => {
              setTimeline(normalizeTimeline(p.timeline));
              setHolidayText(p.timeline.holidays.join(', '));
            }}
          >
            <Ionicons name="copy-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.chipBtnText} numberOfLines={1}>
              Copy from {p.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {showErrors && errors.length ? (
        <View style={styles.errorBox}>
          {errors.map((e) => (
            <Text key={e} style={styles.errorText}>
              • {e}
            </Text>
          ))}
        </View>
      ) : null}

      <TouchableOpacity style={styles.primaryBtn} onPress={save}>
        <Text style={styles.primaryBtnText}>{property ? 'Save changes' : 'Add property'}</Text>
      </TouchableOpacity>
      {property ? (
        <TouchableOpacity
          style={[styles.deleteBtn, confirmDelete && styles.deleteBtnArmed]}
          onPress={() => {
            if (!confirmDelete) {
              setConfirmDelete(true);
              triggerHaptic('warning');
              return;
            }
            onDelete(property.id);
          }}
        >
          <Ionicons name="trash-outline" size={14} color={COLORS.danger} />
          <Text style={styles.deleteText}>{confirmDelete ? 'Tap again to delete this property and its close sign-offs' : 'Delete property'}</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

/**
 * @param {boolean}  visible
 * @param {Array}    properties   current list
 * @param {string}   [editId]     open straight into this property's editor ('__new__' for a new one)
 * @param {Function} onSave       (nextProperties) → persist
 * @param {Function} onClose
 */
export default function PropertySetup({ visible, properties, editId = null, onSave, onClose }) {
  const insets = useSafeAreaInsets();
  const [editing, setEditing] = useState(editId);

  useEffect(() => {
    if (visible) setEditing(editId);
  }, [visible, editId]);

  const property = editing && editing !== NEW ? properties.find((p) => p.id === editing) : null;
  const today = new Date();
  const period = defaultClosePeriod(today);

  const back = () => {
    if (editing) setEditing(null);
    else onClose();
  };

  const saveOne = (saved) => {
    const exists = properties.some((p) => p.id === saved.id);
    onSave(exists ? properties.map((p) => (p.id === saved.id ? saved : p)) : [...properties, saved]);
    setEditing(null);
  };

  const deleteOne = (id) => {
    triggerHaptic('medium');
    onSave(properties.filter((p) => p.id !== id), id);
    setEditing(null);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={back}>
      <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <SwipeBackView onBack={back} edgeOnly edgeWidth={40} style={styles.flex}>
          <View style={styles.column}>
            {editing ? (
              <PropertyEditor
                key={editing}
                property={property}
                properties={properties}
                onSave={saveOne}
                onDelete={deleteOne}
                onCancel={() => setEditing(null)}
              />
            ) : (
              <ScrollView contentContainerStyle={styles.content}>
                <BackButton onPress={onClose} label="Done" variant="minimal" />
                <Text style={styles.title}>Properties & close timelines</Text>
                <Text style={styles.help}>
                  Each property keeps its own close calendar. The Close Cockpit and the Daily Hub show real due dates from it, and close
                  sign-offs are tracked per property.
                </Text>
                {properties.length === 0 ? <Text style={styles.empty}>No properties yet. Add your first one.</Text> : null}
                {properties.map((p) => {
                  const next = phaseSchedule(period, p.timeline).find((s) => windowStatus(s, today) !== 'overdue');
                  return (
                    <TouchableOpacity key={p.id} style={styles.propCard} onPress={() => setEditing(p.id)} accessibilityRole="button">
                      <View style={styles.flex}>
                        <Text style={styles.propName}>{p.name}</Text>
                        <Text style={styles.propMeta}>
                          {[p.portfolio, p.software === 'yardi' ? 'Yardi' : 'RealPage', p.timeline.basis === 'business' ? 'business days' : 'calendar days']
                            .filter(Boolean)
                            .join(' · ')}
                        </Text>
                        <Text style={styles.propNext}>
                          {next
                            ? `${periodLabel(period)} close · next: P${next.number} ${next.title} · ${formatRange(next.start, next.end)}`
                            : `${periodLabel(period)} close · all phase dates have passed`}
                        </Text>
                      </View>
                      <Ionicons name="create-outline" size={17} color={COLORS.textMuted} />
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity style={styles.primaryBtn} onPress={() => setEditing(NEW)}>
                  <Text style={styles.primaryBtnText}>Add property</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </SwipeBackView>
      </View>
    </Modal>
  );
}

PropertySetup.NEW = NEW;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  root: { flex: 1, backgroundColor: COLORS.background },
  column: { flex: 1, width: '100%', maxWidth: LAYOUT.READING_MAX, alignSelf: 'center' },
  content: { padding: 16, paddingBottom: 60 },
  title: { fontSize: 19, fontWeight: '800', color: COLORS.text, marginTop: 10, marginBottom: 6 },
  help: { fontSize: 12.5, lineHeight: 18, color: COLORS.textSecondary, marginBottom: 12 },
  empty: { fontSize: 13, color: COLORS.textMuted, marginVertical: 10 },
  sectionGap: { marginTop: 18 },
  fieldLabel: { fontSize: 11.5, fontWeight: '700', color: COLORS.textSecondary, marginTop: 10, marginBottom: 6 },
  input: {
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.surfaceInput,
    color: COLORS.text,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  inputMulti: { minHeight: 56, textAlignVertical: 'top' },
  periodRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 8 },
  periodBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodText: { flex: 1, textAlign: 'center', fontSize: 12.5, fontWeight: '700', color: COLORS.text },
  phaseRow: {
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 10,
    marginBottom: 8,
  },
  phaseHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  phaseTitle: { flex: 1, fontSize: 12.5, fontWeight: '700', color: COLORS.text },
  phaseDates: { fontSize: 12, fontWeight: '800', color: COLORS.close },
  stepPair: { flexDirection: 'row', gap: 10, marginTop: 8 },
  stepper: { flex: 1 },
  stepperLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.6, color: COLORS.textMuted, marginBottom: 4 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: { flex: 1, textAlign: 'center', fontSize: 13, fontWeight: '800', color: COLORS.text },
  inlineActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    maxWidth: '100%',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  chipBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, flexShrink: 1 },
  errorBox: { marginTop: 12, padding: 10, borderRadius: RADII.md, backgroundColor: COLORS.dangerSoft },
  errorText: { fontSize: 12.5, color: COLORS.danger, lineHeight: 18 },
  primaryBtn: { marginTop: 16, alignItems: 'center', paddingVertical: 12, borderRadius: RADII.md, backgroundColor: COLORS.primary },
  primaryBtnText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  deleteBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: `${COLORS.danger}55`,
  },
  deleteBtnArmed: { backgroundColor: COLORS.dangerSoft },
  deleteText: { fontSize: 12.5, fontWeight: '700', color: COLORS.danger },
  propCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 12,
    marginBottom: 8,
  },
  propName: { fontSize: 14.5, fontWeight: '800', color: COLORS.text },
  propMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  propNext: { fontSize: 11.5, color: COLORS.close, marginTop: 4 },
});
