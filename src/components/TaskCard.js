import React, { memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { triggerHaptic } from '../utils/haptics';

function TaskCard({
  task,
  isCompleted,
  isBookmarked,
  hasNote,
  onToggleComplete,
  onToggleBookmark,
  onOpenMastery,
  activeSoftware = 'realpage',
}) {
  const navBreadcrumbs =
    activeSoftware === 'yardi' && task.navigation?.yardi
      ? task.navigation.yardi
      : task.navigation?.realpage || ['RealPage', task.category];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return COLORS.danger;
      case 'Medium':
        return COLORS.warning;
      case 'Low':
        return COLORS.info;
      default:
        return COLORS.primary;
    }
  };

  const getPhaseBadgeColor = (phase) => {
    switch (phase) {
      case 'Ongoing - Daily':
        return COLORS.badgeDaily;
      case 'Ongoing - Weekly':
        return COLORS.badgeWeekly;
      case 'Pre-AME':
        return COLORS.badgePreAME;
      case 'Post-AME':
        return COLORS.badgePostAME;
      case 'Review':
        return COLORS.badgeReview;
      case 'Reporting':
        return COLORS.badgeReporting;
      default:
        return COLORS.primaryLight;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, isCompleted && styles.cardCompleted]}
      onPress={() => {
        triggerHaptic('light');
        onOpenMastery(task);
      }}
      activeOpacity={0.75}
    >
      {/* Top Meta Header: Phase Badge, Priority Pill & Action Icons */}
      <View style={styles.metaRow}>
        <View style={styles.badgeGroup}>
          <View
            style={[
              styles.phaseBadge,
              { backgroundColor: `${getPhaseBadgeColor(task.phase)}20` },
            ]}
          >
            <Text
              style={[
                styles.phaseText,
                { color: getPhaseBadgeColor(task.phase) },
              ]}
            >
              {task.phase}
            </Text>
          </View>

          <View
            style={[
              styles.priorityPill,
              { borderColor: `${getPriorityColor(task.priority)}40` },
            ]}
          >
            <View
              style={[
                styles.priorityDot,
                { backgroundColor: getPriorityColor(task.priority) },
              ]}
            />
            <Text
              style={[
                styles.priorityText,
                { color: getPriorityColor(task.priority) },
              ]}
            >
              {task.priority}
            </Text>
          </View>
        </View>

        <View style={styles.actionGroup}>
          {hasNote && (
            <View style={styles.noteIndicator}>
              <Ionicons name="document-text" size={13} color={COLORS.primaryLight} />
            </View>
          )}

          <TouchableOpacity
            style={styles.iconButton}
            onPress={(e) => {
              e.stopPropagation();
              triggerHaptic('medium');
              onToggleBookmark(task.id);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={17}
              color={isBookmarked ? COLORS.gold : COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Task Title & Checkbox */}
      <View style={styles.titleRow}>
        <TouchableOpacity
          style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
          onPress={(e) => {
            e.stopPropagation();
            triggerHaptic('success');
            onToggleComplete(task.id);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isCompleted && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
        </TouchableOpacity>

        <Text
          style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted]}
          numberOfLines={2}
        >
          {task.name}
        </Text>
      </View>

      {/* Quick RealPage Breadcrumbs Preview */}
      <View style={styles.navRow}>
        <Ionicons
          name={activeSoftware === 'yardi' ? 'layers-outline' : 'compass-outline'}
          size={13}
          color={activeSoftware === 'yardi' ? COLORS.yardi : COLORS.info}
          style={styles.navIcon}
        />
        <Text style={styles.navText} numberOfLines={1}>
          {navBreadcrumbs.join('  ›  ')}
        </Text>
      </View>

      {/* Bottom Footer: Category & 5-Point Mastery Trigger */}
      <View style={styles.footerRow}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{task.category}</Text>
        </View>

        <View style={styles.masteryPill}>
          <Text style={styles.masteryPillText}>5-Point Mastery</Text>
          <Ionicons name="chevron-forward" size={13} color={COLORS.primaryLight} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Memoized: the Daily Hub list re-renders only the cards whose props changed.
export default memo(TaskCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardCompleted: {
    opacity: 0.75,
    borderColor: `${COLORS.success}40`,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
  },
  phaseText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  priorityDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteIndicator: {
    marginRight: 8,
    padding: 2,
  },
  iconButton: {
    padding: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    marginRight: 10,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textMuted,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceInput,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    marginBottom: 10,
  },
  navIcon: {
    marginRight: 5,
  },
  navText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryPill: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  masteryPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  masteryPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primaryLight,
    marginRight: 2,
  },
});
