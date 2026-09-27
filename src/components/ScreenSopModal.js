import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { LAYOUT, RADII } from '../theme/layout';
import { getScreenEntry } from '../utils/screenIndex';
import { LazyScreenDetail } from './ScreenDetail';
import { BackButton, SwipeBackView } from './ui';

// Full-screen click-by-click SOP for any catalog screen, opened by screenId from the
// Close Cockpit, exception playbooks, the Rosetta Stone, glossary cross-references and search.
// The header renders from the lightweight index at once; the body loads the module on demand.
export default function ScreenSopModal({ screenId, onClose, onOpenInExplorer, contextLabel }) {
  const insets = useSafeAreaInsets();
  const entry = screenId ? getScreenEntry(screenId) : null;

  return (
    <Modal visible={Boolean(screenId)} animationType="slide" onRequestClose={onClose} transparent={false}>
      <SwipeBackView enabled={Boolean(screenId)} onBack={onClose} allowSwipeDown={true} style={styles.container}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 6 }]}>
          <View style={[styles.headerInner, { paddingLeft: insets.left, paddingRight: insets.right }]}>
            <BackButton label="Back" onPress={onClose} style={styles.backBtn} accessibilityLabel="Close SOP" />
            <View style={styles.headerText}>
              {contextLabel ? <Text style={styles.contextLabel}>{contextLabel}</Text> : null}
              <Text style={styles.title} numberOfLines={2}>
                {entry ? entry.name : 'Screen not found'}
              </Text>
              {entry ? (
                <View style={styles.metaRow}>
                  <View style={[styles.moduleDot, { backgroundColor: entry.moduleColor }]} />
                  <Text style={styles.moduleLabel} numberOfLines={1}>
                    {entry.moduleTitle} › {entry.category}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.body}
          contentContainerStyle={[
            styles.bodyContent,
            { paddingBottom: insets.bottom + 32, paddingLeft: 16 + insets.left, paddingRight: 16 + insets.right },
          ]}
        >
          <View style={styles.reading}>
            {entry ? (
              <>
                <LazyScreenDetail screenId={screenId} />
                {onOpenInExplorer ? (
                  <TouchableOpacity style={styles.explorerBtn} onPress={() => onOpenInExplorer(entry.moduleId, entry.id)}>
                    <Ionicons name="desktop-outline" size={15} color={COLORS.info} />
                    <Text style={styles.explorerBtnText}>Show in RP Explorer ({entry.moduleShortCode})</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            ) : (
              <Text style={styles.missing}>
                The linked screen id "{screenId}" is not in the catalog. Run scripts/validate_app_data.mjs to find broken links.
              </Text>
            )}
          </View>
        </ScrollView>
      </SwipeBackView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    maxWidth: LAYOUT.READING_MAX,
    alignSelf: 'center',
  },
  backBtn: {
    marginRight: 12,
  },
  headerText: { flex: 1 },
  contextLabel: { fontSize: 10, fontWeight: '800', color: COLORS.gold, letterSpacing: 0.9, marginBottom: 3 },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.text, letterSpacing: -0.2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  moduleDot: { width: 7, height: 7, borderRadius: 3.5, marginRight: 6 },
  moduleLabel: { fontSize: 11.5, color: COLORS.textSecondary, fontWeight: '600', flexShrink: 1 },
  body: { flex: 1 },
  bodyContent: { paddingTop: 4 },
  reading: { width: '100%', maxWidth: LAYOUT.READING_MAX, alignSelf: 'center' },
  explorerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    paddingVertical: 11,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: `${COLORS.info}60`,
    backgroundColor: `${COLORS.info}10`,
  },
  explorerBtnText: { color: COLORS.info, fontWeight: '700', fontSize: 13, marginLeft: 6 },
  missing: { color: COLORS.danger, fontSize: 13, marginTop: 16 },
});
