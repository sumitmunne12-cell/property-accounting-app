import React, { useRef } from 'react';
import { StyleSheet, View, PanResponder, Platform } from 'react-native';
import { triggerHaptic } from '../utils/haptics';

/**
 * SwipeBackView provides a native-feeling swipe-to-go-back gesture (iOS & Android).
 *
 * @param {Function} onBack - Callback invoked when a back swipe is recognized.
 * @param {boolean} [enabled=true] - Whether the swipe gesture is active.
 * @param {boolean} [edgeOnly=false] - If true, only gestures starting near the left edge (< edgeWidth) trigger back.
 * @param {number} [edgeWidth=50] - Width of the edge detection zone in pixels.
 * @param {number} [threshold=60] - Minimum horizontal drag distance to trigger back.
 * @param {number} [velocityThreshold=0.3] - Minimum horizontal velocity for quick flick back.
 * @param {boolean} [allowSwipeDown=false] - If true (useful for modals), dragging down (dy > 80) also triggers back.
 * @param {React.ReactNode} children - Child content.
 * @param {object} [style] - Container style.
 */
export default function SwipeBackView({
  onBack,
  enabled = true,
  edgeOnly = false,
  edgeWidth = 60,
  threshold = 65,
  velocityThreshold = 0.28,
  allowSwipeDown = false,
  children,
  style,
  ...props
}) {
  const isBackTriggeredRef = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,

      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (!enabled || !onBack) return false;

        const startX = evt.nativeEvent.pageX - gestureState.dx;
        if (edgeOnly && startX > edgeWidth) {
          return false;
        }

        const isHorizontalSwipeRight =
          gestureState.dx > 18 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.5;

        const isVerticalSwipeDown =
          allowSwipeDown &&
          gestureState.dy > 25 &&
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) * 1.5;

        return isHorizontalSwipeRight || isVerticalSwipeDown;
      },

      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        if (!enabled || !onBack) return false;

        const startX = evt.nativeEvent.pageX - gestureState.dx;
        // If swiping right firmly from the extreme left edge (< 35px), capture immediately
        if (startX < 35 && gestureState.dx > 25 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.6) {
          return true;
        }

        return false;
      },

      onPanResponderGrant: () => {
        isBackTriggeredRef.current = false;
      },

      onPanResponderMove: (evt, gestureState) => {
        if (!enabled || !onBack || isBackTriggeredRef.current) return;

        // Fast trigger on strong flick or drag past threshold
        const passedHorizontal =
          gestureState.dx > threshold || (gestureState.dx > 35 && gestureState.vx > velocityThreshold);

        const passedVertical =
          allowSwipeDown && (gestureState.dy > 100 || (gestureState.dy > 45 && gestureState.vy > 0.4));

        if (passedHorizontal || passedVertical) {
          isBackTriggeredRef.current = true;
          triggerHaptic('light');
          onBack();
        }
      },

      onPanResponderRelease: (evt, gestureState) => {
        if (!enabled || !onBack || isBackTriggeredRef.current) return;

        const passedHorizontal =
          gestureState.dx > threshold || (gestureState.dx > 30 && gestureState.vx > velocityThreshold);

        const passedVertical =
          allowSwipeDown && (gestureState.dy > 80 || (gestureState.dy > 40 && gestureState.vy > velocityThreshold));

        if (passedHorizontal || passedVertical) {
          isBackTriggeredRef.current = true;
          triggerHaptic('light');
          onBack();
        }
      },

      onPanResponderTerminate: () => {
        isBackTriggeredRef.current = false;
      },
    })
  ).current;

  return (
    <View style={[styles.container, style]} {...panResponder.panHandlers} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
