import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { getScreenEntry } from '../utils/screenIndex';
import ScreenDetail from './ScreenDetail';

// Full-screen click-by-click SOP for any catalog screen, opened by screenId from the
// Close Cockpit, exception playbooks, the Rosetta Stone and glossary cross-references.
export default function ScreenSopModal({ screenId, onClose, onOpenInExplorer, contextLabel }) {
  const entry = screenId ? getScreenEntry(screenId) : null;

  return (
    <Modal visible={Boolean(screenId)} animationType="slide" onRequestClose={onClose} transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close SOP">
            <Ionicons name="close" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            {contextLabel ? <Text style={styles.contextLabel}>{contextLabel}</Text> : null}
            <Text style={styles.title} numberOfLines={2}>
              {entry ? entry.screen.name : 'Screen not found'}
            </Text>
            {entry ? (
              <Text style={[styles.moduleLabel, { color: entry.moduleColor }]} numberOfLines={1}>
                {entry.moduleTitle} › {entry.submoduleTitle}
              </Text>
            ) : null}
          </View>
        </View>

        <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
          {entry ? (
            <>
              <ScreenDetail screen={entry.screen} />
              {onOpenInExplorer ? (
                <TouchableOpacity
                  style={styles.explorerBtn}
                  onPress={() => onOpenInExplorer(entry.moduleId, entry.screen.id)}
                >
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
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerText: {
    flex: 1,
  },
  contextLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  moduleLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '600',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 16,
    paddingBottom: 40,
  },
  explorerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${COLORS.info}60`,
  },
  explorerBtnText: {
    color: COLORS.info,
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 6,
  },
  missing: {
    color: COLORS.danger,
    fontSize: 13,
  },
});
