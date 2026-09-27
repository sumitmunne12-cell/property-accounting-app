// Visual map ("city grid"): applications × lifecycle stages. Tap a cell to see the lists that live
// there, tap a list to see its screens, tap a screen for its SOP. Local back stack with
// BackButton / SwipeBackView.
import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { RADII } from '../../theme/layout';
import { triggerHaptic } from '../../utils/haptics';
import { buildGrid, cellSubmenus, STAGES, STAGE_KEYS, appUsesSections } from '../../utils/compassEngine';
import { BackButton, SwipeBackView, SectionLabel } from '../ui';

const STAGE_SHORT = { configure: 'Setup', enter: 'Enter', find_fix: 'Find/Fix', process: 'Process', review: 'Review' };
const GRID = buildGrid();
const MAX_CELL = Math.max(...GRID.flatMap((r) => STAGE_KEYS.map((k) => r.cells[k])));

function Cell({ count, onPress }) {
  const alpha = count ? Math.round(24 + (count / MAX_CELL) * 200).toString(16).padStart(2, '0') : '00';
  return (
    <TouchableOpacity
      style={[styles.cell, { backgroundColor: count ? `${COLORS.warning}${alpha}` : COLORS.surface }]}
      disabled={!count}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${count} screens`}
    >
      <Text style={[styles.cellText, !count && styles.cellEmpty]}>{count || '·'}</Text>
    </TouchableOpacity>
  );
}

export default function CompassMap({ onOpenScreen }) {
  const [stack, setStack] = useState([]); // [{ app, stage }] then [{ …, list }]
  const top = stack[stack.length - 1];
  const push = (v) => {
    triggerHaptic('light');
    setStack((s) => [...s, v]);
  };
  const pop = () => setStack((s) => s.slice(0, -1));
  const lists = useMemo(() => (top ? cellSubmenus(top.app, top.stage) : []), [top]);

  if (!top) {
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.lead}>
          Every application follows the same five stages. Rows are applications, columns are stages; counts are real menu-path
          screens. Tap a cell to drill down.
        </Text>
        <View style={styles.headRow}>
          <Text style={[styles.appCol, styles.headText]}>Application</Text>
          {STAGE_KEYS.map((k) => (
            <Text key={k} style={[styles.headCell, styles.headText]} numberOfLines={1}>
              {STAGE_SHORT[k]}
            </Text>
          ))}
        </View>
        {GRID.map((r) => (
          <View key={r.app} style={styles.row}>
            <View style={styles.appCol}>
              <Text style={styles.appName} numberOfLines={2}>
                {r.app}
              </Text>
              <Text style={styles.appMeta}>
                {r.total} · {appUsesSections(r.app) ? 'sections' : 'All/Setup'}
              </Text>
            </View>
            {STAGE_KEYS.map((k) => (
              <Cell key={k} count={r.cells[k]} onPress={() => push({ app: r.app, stage: k })} />
            ))}
          </View>
        ))}
        <SectionLabel icon="information-circle-outline" style={styles.legendLabel}>
          Stages
        </SectionLabel>
        {STAGE_KEYS.map((k) => (
          <Text key={k} style={styles.legend}>
            <Text style={styles.legendKey}>{STAGES[k].label}</Text> — {STAGES[k].where}. {STAGES[k].question}
          </Text>
        ))}
        <Text style={styles.legend}>
          Applications without home-page sections (Company, Reports, Platform Services …) only split All vs Setup; their All-tab screens
          are counted under the stage their verb implies (Find & fix when the title has no verb).
        </Text>
      </ScrollView>
    );
  }

  return (
    <SwipeBackView onBack={pop} edgeOnly edgeWidth={40} style={styles.scroll}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton onPress={pop} label={top.list ? top.stageLabel : 'Map'} variant="minimal" />
        <Text style={styles.cellTitle}>
          {top.app} · {STAGES[top.stage].label}
        </Text>
        <Text style={styles.cellWhere}>{STAGES[top.stage].where}</Text>
        {!top.list
          ? lists.map((g) => (
              <TouchableOpacity
                key={g.key}
                style={styles.listRow}
                onPress={() => push({ ...top, list: g.key, stageLabel: STAGES[top.stage].label })}
              >
                <View style={styles.flex}>
                  <Text style={styles.listName}>{g.submenu}</Text>
                  <Text style={styles.listPath}>{g.key}</Text>
                </View>
                <Text style={styles.listCount}>{g.items.length}</Text>
                <Ionicons name="chevron-forward" size={15} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))
          : (lists.find((g) => g.key === top.list)?.items || []).map((c) => (
              <TouchableOpacity key={c.id} style={styles.listRow} onPress={() => onOpenScreen && onOpenScreen(c.id, 'Deduction Compass map')}>
                <View style={styles.flex}>
                  <Text style={styles.listName}>{c.name}</Text>
                  {c.exc ? <Text style={styles.excTag}>Exception {c.exc}</Text> : null}
                </View>
                <Ionicons name="document-text-outline" size={15} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))}
      </ScrollView>
    </SwipeBackView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 48 },
  lead: { fontSize: 12.5, lineHeight: 18, color: COLORS.textSecondary, marginBottom: 12 },
  headRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  headText: { fontSize: 10, fontWeight: '800', color: COLORS.textMuted, textTransform: 'uppercase' },
  headCell: { flex: 1, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'stretch', marginBottom: 4, gap: 3 },
  appCol: { width: 104, paddingRight: 6, justifyContent: 'center' },
  appName: { fontSize: 11.5, fontWeight: '700', color: COLORS.text },
  appMeta: { fontSize: 9.5, color: COLORS.textMuted },
  cell: {
    flex: 1,
    minHeight: 38,
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: { fontSize: 12, fontWeight: '800', color: COLORS.text },
  cellEmpty: { color: COLORS.textMuted },
  legendLabel: { marginTop: 18 },
  legend: { fontSize: 12, lineHeight: 17, color: COLORS.textSecondary, marginBottom: 6 },
  legendKey: { fontWeight: '800', color: COLORS.text },
  cellTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginTop: 10 },
  cellWhere: { fontSize: 12, color: COLORS.textMuted, marginBottom: 12 },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 10,
    marginBottom: 8,
  },
  listName: { fontSize: 13.5, fontWeight: '700', color: COLORS.text },
  listPath: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  listCount: { fontSize: 12, fontWeight: '800', color: COLORS.warning },
  excTag: { fontSize: 11, fontWeight: '700', color: COLORS.warning, marginTop: 2 },
});
