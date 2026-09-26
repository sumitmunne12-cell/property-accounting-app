import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { triggerHaptic } from '../utils/haptics';

export default function HeaderBar({
  selectedProperty,
  onOpenPropertyPicker,
  activeSoftware,
  onToggleSoftware,
  completedCount,
  totalCount,
}) {
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <View style={styles.container}>
      {/* Top row: Branding & Software Switcher */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Ionicons name="business" size={18} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.brandTitle}>RealPage Master</Text>
            <Text style={styles.brandSubtitle}>US Offshore Property Accounting</Text>
          </View>
        </View>

        {/* Software toggle pill */}
        <TouchableOpacity
          style={[
            styles.softwareToggle,
            activeSoftware === 'yardi' ? styles.softwareToggleYardi : styles.softwareToggleRP,
          ]}
          onPress={() => {
            triggerHaptic('medium');
            onToggleSoftware(activeSoftware === 'realpage' ? 'yardi' : 'realpage');
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name={activeSoftware === 'yardi' ? 'layers' : 'cube'}
            size={14}
            color="#FFFFFF"
          />
          <Text style={styles.softwareToggleText}>
            {activeSoftware === 'yardi' ? 'Yardi Voyager' : 'RealPage Suite'}
          </Text>
        </TouchableOpacity>
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
    paddingTop: 12,
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
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  brandSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  softwareToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  softwareToggleRP: {
    backgroundColor: COLORS.infoDark,
  },
  softwareToggleYardi: {
    backgroundColor: COLORS.yardi,
  },
  softwareToggleText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
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
