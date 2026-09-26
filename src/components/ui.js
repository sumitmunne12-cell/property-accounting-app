// Shared presentational primitives for the executive theme: breadcrumb pills, numbered step
// lists, section labels, segmented rings/gauges and two-way toggle pills. View-only (no SVG
// dependency) so they render identically on iOS, Android and web.
import React, { memo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { RADII } from '../theme/layout';

/** Navigation path as crisp pills: [Accounts Payable] › [Invoices] › [New]. */
export const Breadcrumbs = memo(function Breadcrumbs({ parts, accent = COLORS.info, lastEmphasis = true }) {
  return (
    <View style={styles.crumbRow} accessibilityRole="text">
      {parts.map((p, i) => {
        const last = i === parts.length - 1;
        return (
          <View key={`${i}-${p}`} style={styles.crumbItem}>
            {i > 0 ? <Ionicons name="chevron-forward" size={11} color={COLORS.textMuted} style={styles.crumbChevron} /> : null}
            <View
              style={[
                styles.crumbPill,
                last && lastEmphasis && { backgroundColor: `${accent}1F`, borderColor: `${accent}66` },
              ]}
            >
              <Text style={[styles.crumbText, last && lastEmphasis && { color: accent }]}>{p}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
});

/** Numbered procedure with circular step badges joined by a hairline rail. */
export const StepList = memo(function StepList({ steps, accent = COLORS.primaryLight, format = (s) => s }) {
  return (
    <View>
      {steps.map((step, idx) => {
        const last = idx === steps.length - 1;
        return (
          <View key={idx} style={styles.stepRow}>
            <View style={styles.stepRail}>
              <View style={[styles.stepBadge, { borderColor: `${accent}AA`, backgroundColor: `${accent}1A` }]}>
                <Text style={[styles.stepNum, { color: accent }]}>{idx + 1}</Text>
              </View>
              {!last ? <View style={styles.stepLine} /> : null}
            </View>
            <Text style={[styles.stepText, !last && styles.stepTextGap]}>{format(step)}</Text>
          </View>
        );
      })}
    </View>
  );
});

export function SectionLabel({ children, color = COLORS.textSecondary, icon, style }) {
  return (
    <View style={[styles.labelRow, style]}>
      {icon ? <Ionicons name={icon} size={12} color={color} style={styles.labelIcon} /> : null}
      <Text style={[styles.label, { color }]}>{children}</Text>
    </View>
  );
}

/**
 * Segmented completion ring (milestone gauge). `pct` 0–100; children render in the center.
 * Built from rotated ticks so it needs no SVG.
 */
export const ProgressRing = memo(function ProgressRing({
  pct,
  size = 64,
  color = COLORS.close,
  segments = 36,
  thickness = 3,
  children,
}) {
  const clamped = Math.max(0, Math.min(100, pct || 0));
  const filled = Math.round((clamped / 100) * segments);
  const tick = Math.max(4, Math.round(size * 0.13));
  const radius = size / 2 - tick / 2;
  return (
    <View style={{ width: size, height: size }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped) }}>
      {Array.from({ length: segments }, (_, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: size / 2 - thickness / 2,
            top: size / 2 - tick / 2,
            width: thickness,
            height: tick,
            borderRadius: thickness / 2,
            backgroundColor: i < filled ? color : COLORS.surfaceHighlight,
            transform: [{ rotate: `${(360 / segments) * i}deg` }, { translateY: -radius }],
          }}
        />
      ))}
      <View style={[StyleSheet.absoluteFill, styles.ringCenter]}>{children}</View>
    </View>
  );
});

/** Horizontal gauge bar with a percentage. */
export function GaugeBar({ pct, color = COLORS.close, height = 6 }) {
  return (
    <View style={[styles.gaugeTrack, { height, borderRadius: height / 2 }]}>
      <View style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height, borderRadius: height / 2, backgroundColor: color }} />
    </View>
  );
}

/** Two-way (or n-way) pill toggle, e.g. RealPage → Yardi / Yardi → RealPage. */
export function SegmentedToggle({ options, value, onChange, accent = COLORS.primary }) {
  return (
    <View style={styles.segment} accessibilityRole="tablist">
      {options.map((o) => {
        const on = o.key === value;
        return (
          <TouchableOpacity
            key={o.key}
            style={[styles.segmentItem, on && { backgroundColor: `${accent}26`, borderColor: `${accent}80` }]}
            onPress={() => onChange(o.key)}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
          >
            {o.icon ? <Ionicons name={o.icon} size={13} color={on ? accent : COLORS.textMuted} style={styles.segmentIcon} /> : null}
            <Text style={[styles.segmentText, on && { color: COLORS.text }]} numberOfLines={1}>
              {o.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/** Placeholder while a module chunk loads; shows a retry button on failure. */
export function ModuleLoading({ label, error, onRetry, color = COLORS.textSecondary }) {
  if (error) {
    return (
      <View style={styles.loadingBox}>
        <Ionicons name="cloud-offline-outline" size={18} color={COLORS.danger} />
        <Text style={[styles.loadingText, { color: COLORS.danger }]}>Could not load {label}.</Text>
        {onRetry ? (
          <TouchableOpacity onPress={onRetry} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
  return (
    <View style={styles.loadingBox}>
      <ActivityIndicator size="small" color={color} />
      <Text style={styles.loadingText}>Loading {label}…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  crumbRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  crumbItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  crumbChevron: { marginHorizontal: 3 },
  crumbPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.surfaceLight,
  },
  crumbText: { fontSize: 11.5, fontWeight: '600', color: COLORS.textSecondary },
  stepRow: { flexDirection: 'row', alignItems: 'stretch' },
  stepRail: { width: 30, alignItems: 'center' },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNum: { fontSize: 11, fontWeight: '800' },
  stepLine: { flex: 1, width: 1, backgroundColor: COLORS.borderLight, marginVertical: 3 },
  stepText: { flex: 1, fontSize: 13, lineHeight: 19, color: COLORS.text, paddingTop: 1, paddingLeft: 6 },
  stepTextGap: { paddingBottom: 12 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  labelIcon: { marginRight: 5 },
  label: { fontSize: 10.5, fontWeight: '800', letterSpacing: 0.9, textTransform: 'uppercase' },
  ringCenter: { alignItems: 'center', justifyContent: 'center' },
  gaugeTrack: { backgroundColor: COLORS.surfaceHighlight, overflow: 'hidden', flex: 1 },
  segment: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.surfaceInput,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  segmentIcon: { marginRight: 5 },
  segmentText: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted },
  loadingBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
  loadingText: { marginLeft: 8, fontSize: 12, color: COLORS.textSecondary },
  retryBtn: {
    marginLeft: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  retryText: { fontSize: 12, fontWeight: '700', color: COLORS.text },
});
