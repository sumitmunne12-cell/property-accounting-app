import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { RADII } from '../theme/layout';
import { triggerHaptic } from '../utils/haptics';

/**
 * Standardized executive BackButton.
 *
 * @param {Function} onPress - Callback when pressed.
 * @param {string} [label='Back'] - Text label shown next to the chevron.
 * @param {string} [icon='chevron-back'] - Ionicons icon name.
 * @param {string} [accent=COLORS.text] - Icon/text color.
 * @param {string} [variant='pill'] - 'pill' | 'minimal' | 'header' | 'floating'
 * @param {object} [style] - Custom container style.
 */
export default function BackButton({
  onPress,
  label = 'Back',
  icon = 'chevron-back',
  accent = COLORS.text,
  variant = 'pill',
  style,
  accessibilityLabel,
}) {
  const handlePress = () => {
    triggerHaptic('light');
    onPress && onPress();
  };

  const isMinimal = variant === 'minimal';
  const isHeader = variant === 'header';
  const isFloating = variant === 'floating';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isMinimal && styles.minimal,
        isHeader && styles.header,
        isFloating && styles.floating,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label || 'Go back'}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={isMinimal ? 18 : 17} color={accent} />
      </View>
      {label ? (
        <Text style={[styles.label, { color: accent }]} numberOfLines={1}>
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: RADII.pill,
    minHeight: 36,
  },
  minimal: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    paddingHorizontal: 6,
    paddingVertical: 4,
    minHeight: 32,
  },
  header: {
    backgroundColor: `${COLORS.surfaceLight}E6`,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADII.md,
    minHeight: 34,
  },
  floating: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    zIndex: 99,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.borderHighlight,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADII.pill,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
