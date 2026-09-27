// FASB glossary definition: current wording from each Topic's Glossary section (with the subtopics
// that define it) and, for terms no Topic in the export defines, the Master Glossary wording with its
// legacy source tags listed separately.
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { MONO, RADII } from '../../theme/layout';

const MAX_CODES = 12;

export function GlossaryTermCard({ entry, onOpenTopic, loadingMore = false }) {
  if (!entry) return null;
  return (
    <View>
      <Text style={styles.term}>{entry.term}</Text>
      {entry.defs.map((d, i) => (
        <View key={i} style={styles.def}>
          {entry.defs.length > 1 ? <Text style={styles.defNum}>DEFINITION {i + 1}</Text> : null}
          <Text selectable style={styles.defText}>
            {d.text}
          </Text>
          <View style={styles.codeRow}>
            <Text style={styles.codeLead}>Defined in </Text>
            {d.topics.slice(0, MAX_CODES).map((code) => (
              <TouchableOpacity
                key={code}
                disabled={!onOpenTopic}
                onPress={() => onOpenTopic && onOpenTopic(code.split('-')[0])}
                style={styles.code}
                accessibilityLabel={`Open ASC ${code}`}
              >
                <Text style={[styles.codeText, onOpenTopic && styles.codeTextLink]}>{code}</Text>
              </TouchableOpacity>
            ))}
            {d.topics.length > MAX_CODES ? <Text style={styles.codeLead}>+{d.topics.length - MAX_CODES} more</Text> : null}
          </View>
        </View>
      ))}
      {entry.master ? (
        <View style={styles.def}>
          <Text style={styles.defNum}>MASTER GLOSSARY</Text>
          <Text selectable style={styles.defText}>
            {entry.master.text}
          </Text>
          {entry.master.sources.length ? (
            <Text style={styles.sources}>Legacy sources: {entry.master.sources.join(' · ')}</Text>
          ) : null}
        </View>
      ) : null}
      {loadingMore ? <Text style={styles.sources}>Loading definitions from other Topics…</Text> : null}
    </View>
  );
}

/** Bottom sheet showing one glossary term. */
export function GlossaryTermModal({ entry, onClose, onOpenTopic }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={Boolean(entry)} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} accessibilityLabel="Close definition" />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.sheetHead}>
          <Ionicons name="book-outline" size={14} color={COLORS.gold} />
          <Text style={styles.sheetKicker}>FASB GLOSSARY</Text>
          <TouchableOpacity onPress={onClose} hitSlop={10} accessibilityLabel="Close definition">
            <Ionicons name="close" size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.sheetBody}>
          <GlossaryTermCard entry={entry} onOpenTopic={onOpenTopic} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  term: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  def: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    marginBottom: 8,
  },
  defNum: { fontSize: 9.5, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 0.8, marginBottom: 4 },
  defText: { fontSize: 13, lineHeight: 20, color: COLORS.text },
  codeRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 8 },
  codeLead: { fontSize: 10.5, color: COLORS.textMuted },
  code: { paddingHorizontal: 5, paddingVertical: 1, marginRight: 4, marginBottom: 3 },
  codeText: { fontFamily: MONO, fontSize: 10.5, fontWeight: '700', color: COLORS.textSecondary },
  codeTextLink: { color: COLORS.info },
  sources: { fontSize: 10.5, color: COLORS.textMuted, marginTop: 6, lineHeight: 15 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.55)' },
  sheet: {
    maxHeight: '78%',
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: RADII.lg,
    borderTopRightRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sheetKicker: { flex: 1, fontSize: 10.5, fontWeight: '800', color: COLORS.gold, letterSpacing: 1, marginLeft: 6 },
  sheetBody: { padding: 16 },
});
