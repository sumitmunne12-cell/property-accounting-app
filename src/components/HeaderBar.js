import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { triggerHaptic } from '../utils/haptics';
import { SegmentedToggle, BackButton } from './ui';

export default function HeaderBar({
  hideBrand = false,
  selectedProperty,
  onOpenPropertyPicker,
  activeSoftware,
  onToggleSoftware,
  completedCount,
  totalCount,
  canGoBack = false,
  onGoBack,
  backLabel = 'Back',
}) {
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <View style={styles.container}>
      {/* Top row: Branding / Back Navigation & Software Switcher */}
      <View style={styles.topRow}>
        {canGoBack && onGoBack ? (
          <View style={styles.backContainer}>
            <BackButton
              label={backLabel}
              onPress={onGoBack}
              style={styles.headerBackBtn}
              accessibilityLabel={`Go back to ${backLabel}`}
            />
          </View>
        ) : hideBrand ? (
          <Text style={styles.deskTitle}>Command Center</Text>
        ) : (
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <Ionicons name="business" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.brandText}>
              <Text style={styles.brandTitle} numberOfLines={1}>
                RealPage Master
              </Text>
              <Text style={styles.brandSubtitle} numberOfLines={1}>
                US Offshore Property Accounting
              </Text>
            </View>
          </View>
        )}

        {/* Two-way platform toggle */}
        <View style={styles.platformToggle}>
          <SegmentedToggle
            accent={activeSoftware === 'yardi' ? COLORS.yardi : COLORS.info}
            value={activeSoftware}
            onChange={(key) => {
              if (key === activeSoftware) return;
              triggerHaptic('medium');
              onToggleSoftware(key);
            }}
            options={[
              { key: 'realpage', label: 'RealPage' },
              { key: 'yardi', label: 'Yardi' },
            ]}
          />
        </View>
      </View>

      {/* Bottom row: Property Selector & Shift Completion Bar */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={styles.propertySelector}
          onPress={() => {
            triggerHaptic('light');
            onOpenPropertyPicker();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="location-outline" size={15} color={COLORS.primaryLight} />
          <Text style={styles.propertyText} numberOfLines={1}>
            {selectedProperty}
          </Text>
          <Ionicons name="chevron-down" size={14} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {completedCount}/{totalCount} ({percentComplete}%)
          </Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.min(100, percentComplete)}%` }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  headerBackBtn: {
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.border,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  brandText: {
    flexShrink: 1,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.primaryDark,
    borderWidth: 1,
    borderColor: `${COLORS.primaryLight}55`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  brandSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  platformToggle: {
    width: 162,
    marginLeft: 8,
  },
  deskTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  propertySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
    marginRight: 12,
  },
  propertyText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
    marginRight: 4,
    flex: 1,
  },
  progressContainer: {
    alignItems: 'flex-end',
    width: 110,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.success,
    marginBottom: 4,
  },
  progressBarBg: {
    width: '100%',
    height: 5,
    backgroundColor: COLORS.surfaceHighlight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 3,
  },
});
