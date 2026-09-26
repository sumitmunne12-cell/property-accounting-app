import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { entryTotals } from '../data/exceptionsPlaybookData';
import { getScreenEntry } from '../utils/screenIndex';
import { triggerHaptic } from '../utils/haptics';

const money = (n) =>
  n ? `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';

function DiagnosticWizard({ nodes }) {
  const [path, setPath] = useState([]); // [{ nodeId, label }]
  const [outcome, setOutcome] = useState(null);
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const currentId = path.length ? path[path.length - 1].next : nodes[0].id;
  const current = outcome ? null : byId[currentId];

  const choose = (node, option) => {
    triggerHaptic('light');
    if (option.outcome) {
      setPath([...path, { question: node.question, label: option.label }]);
      setOutcome(option.outcome);
    } else {
      setPath([...path, { question: node.question, label: option.label, next: option.next }]);
    }
  };

  const restart = () => {
    setPath([]);
    setOutcome(null);
  };

  return (
    <View style={styles.wizardBox}>
      <View style={styles.wizardHeader}>
        <Ionicons name="git-branch-outline" size={14} color={COLORS.info} />
        <Text style={styles.wizardTitle}>DIAGNOSTIC WIZARD</Text>
        {path.length > 0 && (
          <TouchableOpacity onPress={restart} style={styles.restartBtn}>
            <Ionicons name="refresh" size={12} color={COLORS.textSecondary} />
            <Text style={styles.restartText}>Restart</Text>
          </TouchableOpacity>
        )}
      </View>

      {path.map((step, i) => (
        <View key={i} style={styles.answeredRow}>
          <Text style={styles.answeredQ}>{step.question}</Text>
          <Text style={styles.answeredA}>→ {step.label}</Text>
        </View>
      ))}

      {current && (
        <View>
          <Text style={styles.question}>{current.question}</Text>
          <View style={styles.optionRow}>
            {current.options.map((opt) => (
              <TouchableOpacity key={opt.label} style={styles.optionBtn} onPress={() => choose(current, opt)}>
                <Text style={styles.optionText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {outcome && (
        <View style={styles.outcomeBox}>
          <Text style={styles.outcomeLabel}>DIAGNOSIS & ACTION</Text>
          <Text style={styles.outcomeText}>{outcome}</Text>
        </View>
      )}
    </View>
  );
}

function EntryTable({ entry }) {
  const totals = entryTotals(entry);
  const balanced = Math.abs(totals.debit - totals.credit) < 0.005;
  return (
    <View style={styles.entryBox}>
      <Text style={styles.entryLabel}>{entry.label}</Text>
      <View style={styles.entryHeaderRow}>
        <Text style={[styles.entryCell, styles.entryAccount, styles.entryHead]}>Account</Text>
        <Text style={[styles.entryCell, styles.entryAmt, styles.entryHead]}>DR</Text>
        <Text style={[styles.entryCell, styles.entryAmt, styles.entryHead]}>CR</Text>
      </View>
      {entry.lines.map((l, i) => (
        <View key={i} style={styles.entryRow}>
          <Text style={[styles.entryCell, styles.entryAccount, l.credit ? styles.creditIndent : null]}>{l.account}</Text>
          <Text style={[styles.entryCell, styles.entryAmt]}>{money(l.debit)}</Text>
          <Text style={[styles.entryCell, styles.entryAmt]}>{money(l.credit)}</Text>
        </View>
      ))}
      <View style={[styles.entryRow, styles.entryTotalRow]}>
        <Text style={[styles.entryCell, styles.entryAccount, styles.entryHead]}>
          {balanced ? 'Balanced' : 'OUT OF BALANCE'}
        </Text>
        <Text style={[styles.entryCell, styles.entryAmt, styles.entryHead]}>{money(totals.debit)}</Text>
        <Text style={[styles.entryCell, styles.entryAmt, styles.entryHead]}>{money(totals.credit)}</Text>
      </View>
      {entry.memo ? <Text style={styles.entryMemo}>Memo: {entry.memo}</Text> : null}
    </View>
  );
}

export default function ExceptionTriageWizard({ playbook, onOpenScreen }) {
  const report = getScreenEntry(playbook.diagnosticReport.screenId);
  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.label}>SYMPTOM</Text>
        <Text style={styles.body}>{playbook.symptom}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: COLORS.danger }]}>ROOT CAUSE</Text>
        {playbook.rootCause.map((c, i) => (
          <View key={i} style={styles.bulletRow}>
            <View style={[styles.bulletDot, { backgroundColor: COLORS.danger }]} />
            <Text style={styles.bulletText}>{c}</Text>
          </View>
        ))}
      </View>

      <View style={styles.auditBox}>
        <Ionicons name="shield-half-outline" size={15} color={COLORS.warning} />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[styles.label, { color: COLORS.warning, marginBottom: 2 }]}>AUDIT RISK</Text>
          <Text style={styles.body}>{playbook.auditRisk}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: COLORS.info }]}>DIAGNOSTIC REALPAGE REPORT</Text>
        <Text style={styles.reportName}>{playbook.diagnosticReport.name}</Text>
        <Text style={styles.body}>{playbook.diagnosticReport.whatToLookFor}</Text>
        {report ? (
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => onOpenScreen(playbook.diagnosticReport.screenId, `${playbook.code} · DIAGNOSTIC REPORT`)}
          >
            <Ionicons name="document-text-outline" size={14} color={COLORS.info} />
            <Text style={styles.linkBtnText} numberOfLines={1}>
              Open SOP: {report.screen.name}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <DiagnosticWizard key={playbook.id} nodes={playbook.diagnosticWizard} />

      <View style={styles.section}>
        <Text style={[styles.label, { color: COLORS.primaryLight }]}>STEP-BY-STEP RESOLUTION SOP</Text>
        {playbook.resolutionSOP.map((step, i) => (
          <View key={i} style={styles.sopStep}>
            <View style={styles.sopBadge}>
              <Text style={styles.sopNum}>{i + 1}</Text>
            </View>
            <Text style={styles.sopText}>{step}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: COLORS.success }]}>EXACT DR / CR ADJUSTING ENTRY</Text>
        {playbook.adjustingEntries.length ? (
          playbook.adjustingEntries.map((e, i) => <EntryTable key={i} entry={e} />)
        ) : (
          <Text style={styles.body}>{playbook.noEntryReason}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>NAVIGATION</Text>
        <Text style={styles.navText}>RealPage: {playbook.navigation.realpage.join(' › ')}</Text>
        <Text style={[styles.navText, { color: COLORS.yardi }]}>Yardi: {playbook.navigation.yardi.join(' › ')}</Text>
      </View>

      {playbook.relatedScreenIds.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.label}>RELATED SCREEN SOPs</Text>
          <View style={styles.chipRow}>
            {playbook.relatedScreenIds.map((id) => {
              const e = getScreenEntry(id);
              if (!e) return null;
              return (
                <TouchableOpacity key={id} style={styles.chip} onPress={() => onOpenScreen(id, playbook.code)}>
                  <Text style={styles.chipText} numberOfLines={1}>
                    {e.screen.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.proTipBox}>
        <Ionicons name="sparkles" size={14} color={COLORS.gold} />
        <Text style={styles.proTipText}>{playbook.proTip}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 12 },
  label: { fontSize: 10, fontWeight: '700', color: COLORS.textSecondary, letterSpacing: 0.5, marginBottom: 5 },
  body: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 5 },
  bulletDot: { width: 5, height: 5, borderRadius: 2.5, marginTop: 6, marginRight: 8 },
  bulletText: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, flex: 1 },
  auditBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${COLORS.warning}12`,
    borderColor: `${COLORS.warning}50`,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  reportName: { fontSize: 13, color: COLORS.text, fontWeight: '600', marginBottom: 3 },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${COLORS.info}60`,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginTop: 8,
  },
  linkBtnText: { color: COLORS.info, fontSize: 12, fontWeight: '600', marginLeft: 6, flex: 1 },
  wizardBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${COLORS.info}60`,
    padding: 12,
    marginTop: 12,
  },
  wizardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  wizardTitle: { fontSize: 10, fontWeight: '700', color: COLORS.info, letterSpacing: 0.5, marginLeft: 6, flex: 1 },
  restartBtn: { flexDirection: 'row', alignItems: 'center' },
  restartText: { fontSize: 11, color: COLORS.textSecondary, marginLeft: 4 },
  answeredRow: { marginBottom: 6 },
  answeredQ: { fontSize: 11, color: COLORS.textMuted },
  answeredA: { fontSize: 12, color: COLORS.text, fontWeight: '600' },
  question: { fontSize: 13, color: COLORS.text, fontWeight: '600', lineHeight: 19 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  optionBtn: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 6,
  },
  optionText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  outcomeBox: {
    backgroundColor: `${COLORS.success}15`,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${COLORS.success}60`,
    padding: 10,
    marginTop: 4,
  },
  outcomeLabel: { fontSize: 10, fontWeight: '700', color: COLORS.success, letterSpacing: 0.5, marginBottom: 3 },
  outcomeText: { fontSize: 12, color: COLORS.text, lineHeight: 18 },
  sopStep: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  sopBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  sopNum: { fontSize: 10, color: '#FFFFFF', fontWeight: '700' },
  sopText: { fontSize: 12, color: COLORS.text, lineHeight: 18, flex: 1 },
  entryBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${COLORS.success}60`,
    padding: 10,
    marginBottom: 8,
  },
  entryLabel: { fontSize: 12, color: COLORS.text, fontWeight: '600', marginBottom: 6 },
  entryHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 4 },
  entryRow: { flexDirection: 'row', paddingVertical: 3 },
  entryTotalRow: { borderTopWidth: 1, borderTopColor: COLORS.border, marginTop: 2, paddingTop: 5 },
  entryCell: { fontSize: 11, color: COLORS.textSecondary },
  entryHead: { fontWeight: '700', color: COLORS.text },
  entryAccount: { flex: 1 },
  creditIndent: { paddingLeft: 14 },
  entryAmt: { width: 82, textAlign: 'right' },
  entryMemo: { fontSize: 11, color: COLORS.textMuted, marginTop: 6, fontStyle: 'italic' },
  navText: { fontSize: 12, color: COLORS.info, lineHeight: 18 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    borderWidth: 1,
    borderColor: `${COLORS.info}50`,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
    maxWidth: '100%',
  },
  chipText: { fontSize: 11, color: COLORS.info },
  proTipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${COLORS.gold}15`,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${COLORS.gold}40`,
    marginTop: 12,
  },
  proTipText: { fontSize: 11, color: COLORS.text, lineHeight: 17, marginLeft: 8, flex: 1 },
});
