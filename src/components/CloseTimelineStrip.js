// Daily Hub strip: the close timeline of the selected property for the period being closed
// (Pre-AME, Post-AME, Review, Reporting with real dates), or the next deadline of every
// property when "All Properties" is selected.
import React, { memo, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { RADII } from '../theme/layout';
import { defaultClosePeriod, periodLabel } from '../utils/closeEngine';
import {
  ALL_PROPERTIES,
  hubSchedule,
  phaseSchedule,
  windowStatus,
  formatRange,
  formatOffsets,
} from '../utils/propertyTimeline';

export const STATUS_STYLE = {
  done: { color: COLORS.success, label: 'Done', icon: 'checkmark-circle' },
  overdue: { color: COLORS.danger, label: 'Overdue', icon: 'alert-circle' },
  due: { color: COLORS.warning, label: 'Due now', icon: 'time' },
  upcoming: { color: COLORS.textMuted, label: 'Upcoming', icon: 'ellipse-outline' },
};

/**
 * @param {Array}    properties
 * @param {string}   selectedPropertyId  property id or 'all'
 * @param {Array}    tasks               Daily Hub tasks (to tell whether a phase is done)
 * @param {Array}    completedTaskIds
 * @param {string}   activePhase         Daily Hub phase filter
 * @param {Function} onSelectPhase       (phase) → filter the Daily Hub
 * @param {Function} onManage            (propertyId?) → open the property setup
 */
function CloseTimelineStrip({ properties, selectedPropertyId, tasks, completedTaskIds, activePhase, onSelectPhase, onManage, today = new Date() }) {
  const period = defaultClosePeriod(today);
  const property = properties.find((p) => p.id === selectedPropertyId) || null;

  const phaseDone = useMemo(() => {
    const done = new Set(completedTaskIds);
    const out = {};
    for (const t of tasks) {
      if (!(t.phase in out)) out[t.phase] = true;
      if (!done.has(t.id)) out[t.phase] = false;
    }
    return out;
  }, [tasks, completedTaskIds]);

  if (!properties.length) {
    return (
      <TouchableOpacity style={styles.emptyCard} onPress={() => onManage()}>
        <Ionicons name="calendar-outline" size={15} color={COLORS.close} />
        <Text style={styles.emptyText}>Add a property to set its month-end close timeline.</Text>
        <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
      </TouchableOpacity>
    );
  }

  if (selectedPropertyId === ALL_PROPERTIES || !property) {
    return (
      <View style={styles.card}>
        <View style={styles.headRow}>
          <Text style={styles.head}>{periodLabel(period)} close · next deadline by property</Text>
          <TouchableOpacity onPress={() => onManage()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.manage}>Manage</Text>
          </TouchableOpacity>
        </View>
        {properties.slice(0, 6).map((p) => {
          const next = phaseSchedule(period, p.timeline).find((s) => windowStatus(s, today) !== 'overdue');
          const st = next ? STATUS_STYLE[windowStatus(next, today)] : STATUS_STYLE.done;
          return (
            <TouchableOpacity key={p.id} style={styles.propRow} onPress={() => onManage(p.id)}>
              <Ionicons name={st.icon} size={13} color={st.color} />
              <Text style={styles.propName} numberOfLines={1}>
                {p.name}
              </Text>
              <Text style={[styles.propNext, { color: st.color }]} numberOfLines={1}>
                {next ? `P${next.number} · ${formatRange(next.start, next.end)}` : 'All dates passed'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  const hub = hubSchedule(period, property.timeline);
  return (
    <View style={styles.card}>
      <View style={styles.headRow}>
        <Text style={styles.head} numberOfLines={1}>
          {periodLabel(period)} close · {property.name}
        </Text>
        <TouchableOpacity onPress={() => onManage(property.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.manage}>Edit timeline</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
        {hub.map((h) => {
          const st = STATUS_STYLE[windowStatus(h, today, phaseDone[h.name] === true)];
          const on = activePhase === h.name;
          return (
            <TouchableOpacity
              key={h.name}
              style={[styles.pill, { borderColor: `${st.color}66` }, on && { backgroundColor: `${st.color}22` }]}
              onPress={() => onSelectPhase(on ? 'All' : h.name)}
              accessibilityLabel={`${h.name}: ${formatRange(h.start, h.end)}, ${st.label}`}
            >
              <View style={styles.pillTop}>
                <Ionicons name={st.icon} size={12} color={st.color} />
                <Text style={styles.pillName}>{h.name}</Text>
              </View>
              <Text style={styles.pillDates}>{formatRange(h.start, h.end)}</Text>
              <Text style={[styles.pillMeta, { color: st.color }]}>
                {st.label} · {formatOffsets(h.startOffset, h.endOffset, property.timeline.basis)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default memo(CloseTimelineStrip);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 10,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: `${COLORS.close}55`,
    backgroundColor: COLORS.closeSoft,
  },
  emptyText: { flex: 1, fontSize: 12.5, fontWeight: '700', color: COLORS.text },
  headRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  head: { flex: 1, fontSize: 11, fontWeight: '800', letterSpacing: 0.4, color: COLORS.textSecondary, textTransform: 'uppercase' },
  manage: { fontSize: 12, fontWeight: '800', color: COLORS.primaryLight },
  pills: { gap: 8 },
  pill: {
    minWidth: 118,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: RADII.md,
    borderWidth: 1,
    backgroundColor: COLORS.surfaceLight,
  },
  pillTop: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  pillName: { fontSize: 12, fontWeight: '800', color: COLORS.text },
  pillDates: { fontSize: 13.5, fontWeight: '800', color: COLORS.text, marginTop: 4 },
  pillMeta: { fontSize: 10.5, fontWeight: '700', marginTop: 2 },
  propRow: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 5 },
  propName: { flex: 1, fontSize: 12.5, fontWeight: '700', color: COLORS.text },
  propNext: { fontSize: 12, fontWeight: '700', maxWidth: '50%' },
});
