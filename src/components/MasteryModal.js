import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { LAYOUT } from '../theme/layout';
import { PDF_CATALOG } from '../data/pdfCatalogData';
import { TASK_GUARDRAILS } from '../data/taskGuardrails';
import RegulatoryGuardrailCard from './RegulatoryGuardrailCard';
import { LedgerText } from './Ledger';
import { triggerHaptic } from '../utils/haptics';

export default function MasteryModal({
  visible,
  task,
  onClose,
  isCompleted,
  isBookmarked,
  onToggleComplete,
  onToggleBookmark,
  currentNote = '',
  onSaveNote,
}) {
  const insets = useSafeAreaInsets();
  // Desktop: keep the reading column centered instead of stretching across a wide monitor.
  const { width } = useWindowDimensions();
  const gutter = Math.max(0, (width - LAYOUT.READING_MAX) / 2);
  const [activeTab, setActiveTab] = useState('sop'); // 'nav' | 'purpose' | 'root_cause' | 'sop' | 'impact' | 'legal'
  const [softwareToggle, setSoftwareToggle] = useState('realpage'); // 'realpage' | 'yardi'
  const [noteText, setNoteText] = useState('');
  const [isEditingNote, setIsEditingNote] = useState(false);

  useEffect(() => {
    if (task) {
      setNoteText(currentNote || '');
      setActiveTab('sop');
    }
  }, [task, currentNote]);

  if (!task) return null;

  const handleSaveNote = () => {
    triggerHaptic('success');
    onSaveNote(task.id, noteText);
    setIsEditingNote(false);
  };

  const guardrail = TASK_GUARDRAILS[task.id];

  const navPath =
    softwareToggle === 'yardi' && task.navigation?.yardi
      ? task.navigation.yardi
      : task.navigation?.realpage || ['RealPage', task.category];

  // Dynamically find related PDF manuals from all 57 manuals
  const relatedManuals = PDF_CATALOG.filter((doc) => {
    const nameLower = task.name.toLowerCase();
    const catLower = task.category.toLowerCase();
    const docTitleLower = doc.title.toLowerCase();
    const docCatLower = doc.category.toLowerCase();

    if (task.rpModule === 'AP' && (docCatLower.includes('payable') || docTitleLower.includes('ap '))) return true;
    if (task.rpModule === 'Cash Management' && (docCatLower.includes('cash') || docTitleLower.includes('bank'))) return true;
    if (task.rpModule === 'Approvals' && docTitleLower.includes('approval')) return true;
    if (task.rpModule === 'GL' && (docCatLower.includes('ledger') || docTitleLower.includes('close'))) return true;
    if (task.rpModule === 'Reporting Portal' && docCatLower.includes('report')) return true;

    return docTitleLower.includes(catLower.slice(0, 5)) || nameLower.includes(docTitleLower.slice(0, 5));
  }).slice(0, 3);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingHorizontal: gutter }]}>
        {/* Modal Top Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 4, paddingLeft: 16 + insets.left, paddingRight: 16 + insets.right }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              triggerHaptic('light');
              onClose();
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {task.phase} • {task.category}
            </Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              5-Point Mastery Engine
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={() => {
              triggerHaptic('medium');
              onToggleBookmark(task.id);
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isBookmarked ? COLORS.gold : COLORS.textMuted}
            />
          </TouchableOpacity>
        </View>

        {/* Task Title Banner */}
        <View style={styles.taskBanner}>
          <Text style={styles.taskBannerTitle}>{task.name}</Text>
          <View style={styles.taskBannerMeta}>
            <View style={styles.metaBadge}>
              <Ionicons name="time-outline" size={12} color={COLORS.primaryLight} />
              <Text style={styles.metaBadgeText}>{task.frequency}</Text>
            </View>
            <View style={[styles.metaBadge, { backgroundColor: `${COLORS.warning}20` }]}>
              <Ionicons name="flag-outline" size={12} color={COLORS.warning} />
              <Text style={[styles.metaBadgeText, { color: COLORS.warning }]}>
                {task.priority} Priority
              </Text>
            </View>
            <View style={[styles.metaBadge, { backgroundColor: `${COLORS.info}20` }]}>
              <Ionicons name="cube-outline" size={12} color={COLORS.info} />
              <Text style={[styles.metaBadgeText, { color: COLORS.info }]}>
                {task.rpModule} Module
              </Text>
            </View>
          </View>
          {guardrail ? (
            <TouchableOpacity
              style={styles.guardrailBanner}
              onPress={() => {
                triggerHaptic('light');
                setActiveTab('legal');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.guardrailBannerText} numberOfLines={1}>
                ⚖️ {guardrail.governingAuthority}
              </Text>
              <Text style={styles.guardrailBannerLink}>View guardrail ›</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* 5-Point Segmented Tab Bar */}
        <View style={styles.tabBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarScroll}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'nav' && styles.tabButtonActive]}
              onPress={() => {
                triggerHaptic('light');
                setActiveTab('nav');
              }}
            >
              <Ionicons
                name="compass"
                size={14}
                color={activeTab === 'nav' ? '#FFFFFF' : COLORS.textSecondary}
              />
              <Text style={[styles.tabText, activeTab === 'nav' && styles.tabTextActive]}>
                1. Navigation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'purpose' && styles.tabButtonActive]}
              onPress={() => {
                triggerHaptic('light');
                setActiveTab('purpose');
              }}
            >
              <Ionicons
                name="bulb"
                size={14}
                color={activeTab === 'purpose' ? '#FFFFFF' : COLORS.textSecondary}
              />
              <Text style={[styles.tabText, activeTab === 'purpose' && styles.tabTextActive]}>
                2. Purpose
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'root_cause' && styles.tabButtonActive]}
              onPress={() => {
                triggerHaptic('light');
                setActiveTab('root_cause');
              }}
            >
              <Ionicons
                name="search"
                size={14}
                color={activeTab === 'root_cause' ? '#FFFFFF' : COLORS.textSecondary}
              />
              <Text style={[styles.tabText, activeTab === 'root_cause' && styles.tabTextActive]}>
                3. Root Cause
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'sop' && styles.tabButtonActive]}
              onPress={() => {
                triggerHaptic('light');
                setActiveTab('sop');
              }}
            >
              <Ionicons
                name="hammer"
                size={14}
                color={activeTab === 'sop' ? '#FFFFFF' : COLORS.textSecondary}
              />
              <Text style={[styles.tabText, activeTab === 'sop' && styles.tabTextActive]}>
                4. Action SOP
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'impact' && styles.tabButtonActive]}
              onPress={() => {
                triggerHaptic('light');
                setActiveTab('impact');
              }}
            >
              <Ionicons
                name="trending-up"
                size={14}
                color={activeTab === 'impact' ? '#FFFFFF' : COLORS.textSecondary}
              />
              <Text style={[styles.tabText, activeTab === 'impact' && styles.tabTextActive]}>
                5. GL Impact
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, styles.legalTabButton, activeTab === 'legal' && styles.legalTabButtonActive]}
              onPress={() => {
                triggerHaptic('light');
                setActiveTab('legal');
              }}
            >
              <Text style={[styles.tabText, styles.legalTabText, activeTab === 'legal' && styles.tabTextActive]}>
                ⚖️ Legal & Audit
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Tab Content Area */}
        <ScrollView style={styles.contentScroll} contentContainerStyle={styles.contentBody}>
          {/* TAB 1: EXACT NAVIGATION */}
          {activeTab === 'nav' && (
            <View style={styles.cardSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="compass-outline" size={20} color={COLORS.info} />
                <Text style={styles.sectionTitle}>Exact Software Breadcrumb Path</Text>
              </View>

              {/* Software Toggle (RealPage vs Yardi) */}
              <View style={styles.softwareSwitcherRow}>
                <TouchableOpacity
                  style={[
                    styles.softwareChoice,
                    softwareToggle === 'realpage' && styles.softwareChoiceRPActive,
                  ]}
                  onPress={() => {
                    triggerHaptic('light');
                    setSoftwareToggle('realpage');
                  }}
                >
                  <Ionicons name="cube" size={14} color="#FFFFFF" />
                  <Text style={styles.softwareChoiceText}>RealPage Financial Suite</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.softwareChoice,
                    softwareToggle === 'yardi' && styles.softwareChoiceYardiActive,
                  ]}
                  onPress={() => {
                    triggerHaptic('light');
                    setSoftwareToggle('yardi');
                  }}
                >
                  <Ionicons name="layers" size={14} color="#FFFFFF" />
                  <Text style={styles.softwareChoiceText}>Yardi Voyager</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.stepGuidance}>
                Follow these exact clicks in {softwareToggle === 'realpage' ? 'RealPage' : 'Yardi'}:
              </Text>

              {navPath.map((step, idx) => (
                <View key={idx} style={styles.breadcrumbItem}>
                  <View style={styles.breadcrumbCircle}>
                    <Text style={styles.breadcrumbNum}>{idx + 1}</Text>
                  </View>
                  <View style={styles.breadcrumbTextContainer}>
                    <Text style={styles.breadcrumbLevel}>
                      {idx === 0 ? 'Main Module' : idx === 1 ? 'Submenu' : idx === 2 ? 'Screen' : 'Filter / Option'}
                    </Text>
                    <Text style={styles.breadcrumbValue}>{step}</Text>
                  </View>
                  {idx < navPath.length - 1 && (
                    <Ionicons name="arrow-forward" size={16} color={COLORS.textMuted} style={styles.breadcrumbArrow} />
                  )}
                </View>
              ))}

              <View style={styles.calloutBox}>
                <Ionicons name="information-circle" size={18} color={COLORS.info} />
                <Text style={styles.calloutText}>
                  {softwareToggle === 'realpage'
                    ? 'In RealPage, always confirm your Active Property Code in the top-left context bar before opening screens.'
                    : 'In Yardi Voyager, verify the Property List filter includes all target entities before executing queries.'}
                </Text>
              </View>

              {/* LINKED OFFICIAL REALPAGE PDF MANUALS */}
              {relatedManuals.length > 0 && (
                <View style={styles.manualsRefSection}>
                  <View style={styles.manualsRefHeader}>
                    <Ionicons name="library" size={15} color={COLORS.info} />
                    <Text style={styles.manualsRefTitle}>Official RealPage Guides for This Task</Text>
                  </View>
                  {relatedManuals.map((man) => (
                    <View key={man.id} style={styles.manualRefCard}>
                      <Ionicons name="document-text" size={15} color={COLORS.danger} />
                      <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={styles.manualRefName}>{man.title}</Text>
                        <Text style={styles.manualRefMeta}>{man.pages} pages • {man.docType}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* TAB 2: PURPOSE & WHY */}
          {activeTab === 'purpose' && (
            <View style={styles.cardSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="bulb-outline" size={20} color={COLORS.warning} />
                <Text style={styles.sectionTitle}>What This Screen / Task Is For</Text>
              </View>

              <View style={styles.purposeBox}>
                <Text style={styles.purposeText}>{task.purpose}</Text>
              </View>

              <Text style={styles.subHeading}>Why It Exists In US Property Accounting</Text>
              <Text style={styles.paragraph}>
                In US multifamily portfolio accounting, institutional owners (Goldman Sachs, Magnolia Capital, OSSO) require strict separation of operational site duties from financial general ledger oversight. This step ensures that expenses, revenues, or asset balances are substantiated with third-party backup before certifying month-end financials.
              </Text>

              {task.proTips && task.proTips.length > 0 && (
                <View style={styles.tipBox}>
                  <Ionicons name="sparkles" size={16} color={COLORS.gold} />
                  <View style={styles.tipTextWrap}>
                    <Text style={styles.tipTitle}>RealPage Pro Tip</Text>
                    <Text style={styles.tipContent}>{task.proTips[0]}</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* TAB 3: ROOT CAUSE BREAKDOWN */}
          {activeTab === 'root_cause' && (
            <View style={styles.cardSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="search-outline" size={20} color={COLORS.danger} />
                <Text style={styles.sectionTitle}>Why Records Are Here (Root Cause)</Text>
              </View>

              <View style={styles.rootCauseBox}>
                <Text style={styles.rootCauseText}>{task.rootCause}</Text>
              </View>

              <Text style={styles.subHeading}>Common Operational Drivers</Text>
              <View style={styles.bulletList}>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>
                    Timing lag between site team receiving physical goods/services and digital logging.
                  </Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>
                    Vendor billing modifications, change orders, or unapproved delivery/trip surcharge additions.
                  </Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>
                    Compliance document expirations (W-9 or Certificate of Insurance lapse).
                  </Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>
                    Cut-off boundaries between closed and open accounting months.
                  </Text>
                </View>
              </View>

              {task.commonPitfalls && task.commonPitfalls.length > 0 && (
                <View style={styles.pitfallBox}>
                  <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
                  <View style={styles.pitfallTextWrap}>
                    <Text style={styles.pitfallTitle}>Common Audit Pitfall</Text>
                    <Text style={styles.pitfallContent}>{task.commonPitfalls[0]}</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* TAB 4: STEP-BY-STEP ACTION SOP */}
          {activeTab === 'sop' && (
            <View style={styles.cardSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="hammer-outline" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Step-by-Step Resolution SOP</Text>
              </View>

              <Text style={styles.stepGuidance}>
                Execute the following actions in order:
              </Text>

              {task.actionSOP && task.actionSOP.map((step, idx) => (
                <View key={idx} style={styles.sopStepItem}>
                  <View style={styles.sopStepBadge}>
                    <Text style={styles.sopStepNumber}>{idx + 1}</Text>
                  </View>
                  <Text style={styles.sopStepText}>{step}</Text>
                </View>
              ))}

              <View style={styles.checklistPrompt}>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                <Text style={styles.checklistPromptText}>
                  Once all steps are completed, mark the task complete below to record progress.
                </Text>
              </View>
            </View>
          )}

          {/* TAB 6: LEGAL & AUDIT GUARDRAILS */}
          {activeTab === 'legal' && (
            <View style={styles.cardSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.gold} />
                <Text style={styles.sectionTitle}>Legal & Audit Guardrails</Text>
              </View>
              <RegulatoryGuardrailCard guardrail={guardrail} compact />
            </View>
          )}

          {/* TAB 5: DOWNSTREAM IMPACT & GL POSTINGS */}
          {activeTab === 'impact' && (
            <View style={styles.cardSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="trending-up-outline" size={20} color={COLORS.success} />
                <Text style={styles.sectionTitle}>Accounting Impact & Next Steps</Text>
              </View>

              {/* General Ledger Impact Box */}
              <View style={styles.glBox}>
                <Text style={styles.glBoxHeader}>General Ledger Entry (DR / CR)</Text>
                <LedgerText
                  style={styles.glImpactFormula}
                  text={task.downstreamImpact?.glImpact || 'No direct GL impact (Staging status).'}
                />
              </View>

              {/* Next Workflow Step */}
              <View style={styles.workflowBox}>
                <Text style={styles.workflowTitle}>What Happens After What You Did</Text>
                <Text style={styles.workflowText}>
                  {task.downstreamImpact?.nextWorkflowStep || 'Advances to next workflow review.'}
                </Text>
              </View>

              {/* Stakeholders & Reports */}
              <Text style={styles.subHeading}>Key Stakeholders in Chain</Text>
              <View style={styles.chipRow}>
                {task.downstreamImpact?.keyStakeholders?.map((sh, idx) => (
                  <View key={idx} style={styles.stakeholderChip}>
                    <Ionicons name="person" size={11} color={COLORS.primaryLight} />
                    <Text style={styles.stakeholderText}>{sh}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.subHeading}>Downstream Financial Reports Affected</Text>
              <View style={styles.chipRow}>
                {task.downstreamImpact?.downstreamReports?.map((rep, idx) => (
                  <View key={idx} style={styles.reportChip}>
                    <Ionicons name="document-text-outline" size={11} color={COLORS.info} />
                    <Text style={styles.reportChipText}>{rep}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* PERSONAL ACCOUNTANT NOTES SECTION */}
          <View style={styles.notesSection}>
            <View style={styles.notesHeader}>
              <View style={styles.notesHeaderLeft}>
                <Ionicons name="pencil" size={16} color={COLORS.primaryLight} />
                <Text style={styles.notesTitle}>My Property Accountant Notes</Text>
              </View>
              {!isEditingNote && (
                <TouchableOpacity
                  style={styles.editNoteBtn}
                  onPress={() => setIsEditingNote(true)}
                >
                  <Text style={styles.editNoteBtnText}>
                    {noteText ? 'Edit Note' : '+ Add Note'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {isEditingNote ? (
              <View style={styles.noteEditor}>
                <TextInput
                  style={styles.noteInput}
                  multiline
                  placeholder="Record property-specific exceptions, PM contacts, or review reminders..."
                  placeholderTextColor={COLORS.textMuted}
                  value={noteText}
                  onChangeText={setNoteText}
                  autoFocus
                />
                <View style={styles.noteEditorActions}>
                  <TouchableOpacity
                    style={styles.cancelNoteBtn}
                    onPress={() => setIsEditingNote(false)}
                  >
                    <Text style={styles.cancelNoteText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveNoteBtn}
                    onPress={handleSaveNote}
                  >
                    <Text style={styles.saveNoteText}>Save Note</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.noteDisplay}>
                {noteText ? (
                  <Text style={styles.noteDisplayText}>{noteText}</Text>
                ) : (
                  <Text style={styles.noteDisplayPlaceholder}>
                    No custom notes yet. Tap "+ Add Note" to save quick property reminders, contact details, or special review rules.
                  </Text>
                )}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom Sticky Action Bar */}
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12), paddingLeft: 16 + insets.left, paddingRight: 16 + insets.right }]}>
          <TouchableOpacity
            style={[
              styles.completeActionButton,
              isCompleted && styles.completeActionButtonActive,
            ]}
            onPress={() => {
              triggerHaptic('success');
              onToggleComplete(task.id);
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.completeActionText}>
              {isCompleted ? 'Task Completed (Tap to Uncheck)' : 'Mark Task Completed'}
            </Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    padding: 4,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  bookmarkButton: {
    padding: 4,
  },
  taskBanner: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  taskBannerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  taskBannerMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceInput,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
  },
  metaBadgeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginLeft: 4,
  },
  tabBar: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabBarScroll: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryLight,
  },
  legalTabButton: {
    borderColor: `${COLORS.gold}80`,
  },
  legalTabButtonActive: {
    backgroundColor: '#5B4A12',
    borderColor: COLORS.gold,
  },
  legalTabText: {
    color: COLORS.gold,
  },
  guardrailBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: `${COLORS.gold}18`,
    borderWidth: 1,
    borderColor: `${COLORS.gold}70`,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  guardrailBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gold,
  },
  guardrailBannerLink: {
    fontSize: 11,
    color: COLORS.gold,
    marginLeft: 8,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  contentScroll: {
    flex: 1,
  },
  contentBody: {
    padding: 16,
    paddingBottom: 40,
  },
  cardSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 8,
  },
  softwareSwitcherRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  softwareChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
    justifyContent: 'center',
  },
  softwareChoiceRPActive: {
    backgroundColor: COLORS.infoDark,
    borderColor: COLORS.info,
  },
  softwareChoiceYardiActive: {
    backgroundColor: COLORS.yardi,
    borderColor: COLORS.primaryLight,
  },
  softwareChoiceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  stepGuidance: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceInput,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  breadcrumbCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  breadcrumbNum: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  breadcrumbTextContainer: {
    flex: 1,
  },
  breadcrumbLevel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  breadcrumbValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  breadcrumbArrow: {
    marginLeft: 8,
  },
  calloutBox: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.info}15`,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: `${COLORS.info}40`,
  },
  calloutText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
    marginLeft: 8,
    flex: 1,
  },
  manualsRefSection: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  manualsRefHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  manualsRefTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.info,
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  manualRefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceInput,
    padding: 9,
    borderRadius: 6,
    marginBottom: 6,
  },
  manualRefName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  manualRefMeta: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  purposeBox: {
    backgroundColor: COLORS.surfaceInput,
    padding: 14,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    marginBottom: 14,
  },
  purposeText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    fontWeight: '500',
  },
  subHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryLight,
    marginTop: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  paragraph: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.gold}15`,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${COLORS.gold}40`,
    marginTop: 8,
  },
  tipTextWrap: {
    marginLeft: 10,
    flex: 1,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.gold,
    marginBottom: 2,
  },
  tipContent: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
  },
  rootCauseBox: {
    backgroundColor: COLORS.surfaceInput,
    padding: 14,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
    marginBottom: 14,
  },
  rootCauseText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
    fontWeight: '500',
  },
  bulletList: {
    marginBottom: 14,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.danger,
    marginTop: 7,
    marginRight: 10,
  },
  bulletText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    flex: 1,
  },
  pitfallBox: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.danger}15`,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${COLORS.danger}40`,
    marginTop: 8,
  },
  pitfallTextWrap: {
    marginLeft: 10,
    flex: 1,
  },
  pitfallTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.danger,
    marginBottom: 2,
  },
  pitfallContent: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
  },
  sopStepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surfaceInput,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sopStepBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  sopStepNumber: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  sopStepText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
    flex: 1,
  },
  checklistPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.success}15`,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${COLORS.success}30`,
    marginTop: 10,
  },
  checklistPromptText: {
    fontSize: 12,
    color: COLORS.success,
    marginLeft: 8,
    flex: 1,
    fontWeight: '600',
  },
  glBox: {
    backgroundColor: COLORS.surfaceInput,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.success,
    marginBottom: 14,
  },
  glBoxHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  glImpactFormula: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 22,
  },
  workflowBox: {
    backgroundColor: COLORS.surfaceLight,
    padding: 14,
    borderRadius: 8,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primaryLight,
  },
  workflowTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryLight,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  workflowText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  stakeholderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceInput,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 6,
    marginBottom: 4,
  },
  stakeholderText: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: '500',
    marginLeft: 4,
  },
  reportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.info}15`,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: `${COLORS.info}30`,
    marginRight: 6,
    marginBottom: 4,
  },
  reportChipText: {
    fontSize: 11,
    color: COLORS.info,
    fontWeight: '500',
    marginLeft: 4,
  },
  notesSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  notesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 6,
  },
  editNoteBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceLight,
  },
  editNoteBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primaryLight,
  },
  noteEditor: {
    marginTop: 4,
  },
  noteInput: {
    backgroundColor: COLORS.surfaceInput,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 13,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.borderFocus,
  },
  noteEditorActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 8,
  },
  cancelNoteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.surfaceLight,
  },
  cancelNoteText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  saveNoteBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.primaryDark,
  },
  saveNoteText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  noteDisplay: {
    backgroundColor: COLORS.surfaceInput,
    padding: 12,
    borderRadius: 8,
  },
  noteDisplayText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 19,
  },
  noteDisplayPlaceholder: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  completeActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 14,
    borderRadius: 10,
  },
  completeActionButtonActive: {
    backgroundColor: COLORS.successDark,
  },
  completeActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
});
