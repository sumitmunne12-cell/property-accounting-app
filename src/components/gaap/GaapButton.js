// Track A: the "📖 First-Principles GAAP" button on catalog screens (Explorer, SOP modal) and
// Daily Hub tasks. It lists the ASC Topics linked to the screen (utils/ascLinks) and opens the
// card viewer in its own modal. The modal is rendered inside the caller's tree so it stacks
// correctly when the caller is itself a modal (iOS presents it from the nearest modal).
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { MONO, RADII } from '../../theme/layout';
import { getAscEntry } from '../../utils/ascIndex';
import { LINK_REASONS } from '../../utils/ascLinks';
import { triggerHaptic } from '../../utils/haptics';
import AscCardView from './AscCardView';
import { useGaapNav } from './GaapNavContext';

export function AscCardModal({ visible, topics, topic, paragraph = null, onSelect, onClose, contextLabel }) {
  const insets = useSafeAreaInsets();
  const nav = useGaapNav();
  if (!topic) return null;
  const current = topics.find((l) => l.topic === topic);
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent={false}>
      <View style={[styles.modalRoot, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.modalBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close GAAP card" hitSlop={10}>
            <Ionicons name="close" size={20} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.flex}>
            <Text style={styles.modalKicker}>📖 FIRST-PRINCIPLES GAAP</Text>
            {contextLabel ? (
              <Text style={styles.modalContext} numberOfLines={1}>
                for {contextLabel}
              </Text>
            ) : null}
          </View>
          {nav ? (
            <TouchableOpacity
              style={styles.codexBtn}
              onPress={() => {
                onClose();
                nav.openInCodex(topic, paragraph);
              }}
            >
              <Ionicons name="library-outline" size={14} color={COLORS.gold} />
              <Text style={styles.codexBtnText}>Open in Codex</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {topics.length > 1 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.switchBar} contentContainerStyle={styles.switchRow}>
            {topics.map((l) => {
              const on = l.topic === topic;
              const e = getAscEntry(l.topic);
              return (
                <TouchableOpacity
                  key={l.topic}
                  style={[styles.switchChip, on && { borderColor: e.color, backgroundColor: `${e.color}22` }]}
                  onPress={() => onSelect(l.topic)}
                >
                  <Text style={[styles.switchNum, { color: e.color }]}>ASC {l.topic}</Text>
                  <Text style={[styles.switchTitle, on && styles.switchTitleOn]} numberOfLines={1}>
                    {e.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : null}
        {current && LINK_REASONS[current.reason] ? <Text style={styles.reason}>Why linked: {LINK_REASONS[current.reason]}</Text> : null}
        <AscCardView topic={topic} paragraph={paragraph} />
      </View>
    </Modal>
  );
}

/**
 * @param links         [{ topic, title, reason }] from ascLinksForScreen / ascLinksForCitation
 * @param contextLabel  screen or task name shown in the modal header
 */
export default function GaapButton({ links, contextLabel, style }) {
  const [topic, setTopic] = useState(null);
  if (!links || !links.length) return null;
  const open = (t) => {
    triggerHaptic('light');
    setTopic(t);
  };
  return (
    <View style={[styles.card, style]}>
      <TouchableOpacity style={styles.mainBtn} onPress={() => open(links[0].topic)} activeOpacity={0.85} accessibilityRole="button">
        <Text style={styles.mainIcon}>📖</Text>
        <View style={styles.flex}>
          <Text style={styles.mainTitle}>First-Principles GAAP</Text>
          <Text style={styles.mainSub}>Why this accounting works — analogy, DR/CR mechanics, audit traps and the official ASC text</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={COLORS.gold} />
      </TouchableOpacity>
      <View style={styles.chipRow}>
        {links.map((l) => {
          const e = getAscEntry(l.topic);
          return (
            <TouchableOpacity
              key={l.topic}
              style={[styles.chip, { borderColor: `${e.color}66`, backgroundColor: `${e.color}14` }]}
              onPress={() => open(l.topic)}
              accessibilityLabel={`ASC ${l.topic} ${e.title}`}
            >
              <Text style={[styles.chipNum, { color: e.color }]}>ASC {l.topic}</Text>
              <Text style={styles.chipTitle} numberOfLines={1}>
                {e.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <AscCardModal
        visible={Boolean(topic)}
        topics={links}
        topic={topic}
        onSelect={setTopic}
        onClose={() => setTopic(null)}
        contextLabel={contextLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: {
    marginTop: 18,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: `${COLORS.gold}55`,
    backgroundColor: COLORS.surface,
    padding: 12,
  },
  mainBtn: { flexDirection: 'row', alignItems: 'center' },
  mainIcon: { fontSize: 22, marginRight: 10 },
  mainTitle: { fontSize: 14, fontWeight: '800', color: COLORS.gold, letterSpacing: 0.2 },
  mainSub: { fontSize: 11.5, color: COLORS.textSecondary, lineHeight: 16, marginTop: 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADII.pill,
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 6,
  },
  chipNum: { fontFamily: MONO, fontSize: 11, fontWeight: '800', marginRight: 6 },
  chipTitle: { fontSize: 11.5, fontWeight: '600', color: COLORS.text, flexShrink: 1 },
  modalRoot: { flex: 1, backgroundColor: COLORS.background },
  modalBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
  },
  modalKicker: { fontSize: 11, fontWeight: '800', color: COLORS.gold, letterSpacing: 1 },
  modalContext: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  codexBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: `${COLORS.gold}66`,
    marginLeft: 8,
  },
  codexBtnText: { fontSize: 11.5, fontWeight: '700', color: COLORS.gold, marginLeft: 5 },
  switchBar: { flexGrow: 0, backgroundColor: COLORS.surface },
  switchRow: { paddingHorizontal: 14, paddingVertical: 8 },
  switchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 260,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADII.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  switchNum: { fontFamily: MONO, fontSize: 11, fontWeight: '800', marginRight: 6 },
  switchTitle: { fontSize: 11.5, fontWeight: '600', color: COLORS.textSecondary, flexShrink: 1 },
  switchTitleOn: { color: COLORS.text },
  reason: {
    fontSize: 11,
    color: COLORS.textMuted,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: COLORS.surface,
  },
});
