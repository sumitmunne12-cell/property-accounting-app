import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { REALPAGE_MODULES } from '../data/realPageModulesData';
import { triggerHaptic } from '../utils/haptics';

export default function RealPageExplorer({ onSelectScreen }) {
  const [selectedModuleId, setSelectedModuleId] = useState('ap');
  const [expandedScreenId, setExpandedScreenId] = useState('scr_ap_exception_queue');

  const selectedModule = REALPAGE_MODULES.find((m) => m.id === selectedModuleId) || REALPAGE_MODULES[0];

  return (
    <View style={styles.container}>
      {/* Module Selector Top Bar */}
      <View style={styles.moduleSelectorBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moduleScroll}>
          {REALPAGE_MODULES.map((mod) => {
            const isSelected = mod.id === selectedModuleId;
            return (
              <TouchableOpacity
                key={mod.id}
                style={[
                  styles.moduleTab,
                  isSelected && { backgroundColor: mod.color, borderColor: mod.color },
                ]}
                onPress={() => {
                  triggerHaptic('light');
                  setSelectedModuleId(mod.id);
                  // Expand first screen of selected module
                  const firstScreen = mod.submodules[0]?.screens[0];
                  if (firstScreen) setExpandedScreenId(firstScreen.id);
                }}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={mod.icon}
                  size={15}
                  color={isSelected ? '#FFFFFF' : COLORS.textSecondary}
                />
                <Text style={[styles.moduleTabText, isSelected && styles.moduleTabTextActive]}>
                  {mod.shortCode}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Module Header Description */}
      <View style={styles.moduleBanner}>
        <View style={styles.moduleBannerTop}>
          <Text style={[styles.moduleTitle, { color: selectedModule.color }]}>
            {selectedModule.title}
          </Text>
        </View>
        <Text style={styles.moduleDesc}>{selectedModule.description}</Text>
      </View>

      {/* Screens & Menus Accordion List */}
      <ScrollView style={styles.screensScroll} contentContainerStyle={styles.screensBody}>
        {selectedModule.submodules.map((submod) => (
          <View key={submod.id} style={styles.submoduleGroup}>
            <View style={styles.submoduleHeader}>
              <Ionicons name="folder-open-outline" size={14} color={selectedModule.color} />
              <Text style={styles.submoduleTitle}>{submod.title}</Text>
            </View>

            {submod.screens.map((screen) => {
              const isExpanded = screen.id === expandedScreenId;

              return (
                <View key={screen.id} style={[styles.screenCard, isExpanded && styles.screenCardActive]}>
                  <TouchableOpacity
                    style={styles.screenHeader}
                    onPress={() => {
                      triggerHaptic('light');
                      setExpandedScreenId(isExpanded ? null : screen.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.screenHeaderLeft}>
                      <View style={[styles.screenIconCircle, { backgroundColor: `${selectedModule.color}20` }]}>
                        <Ionicons name="desktop-outline" size={16} color={selectedModule.color} />
                      </View>
                      <View style={styles.screenHeaderText}>
                        <Text style={styles.screenName}>{screen.name}</Text>
                        <Text style={styles.screenBreadcrumbQuick} numberOfLines={1}>
                          {screen.navigation.join('  ›  ')}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={COLORS.textSecondary}
                    />
                  </TouchableOpacity>

                  {/* Expanded Screen Deep Dive Guide */}
                  {isExpanded && (
                    <View style={styles.screenDetails}>
                      {/* Exact Breadcrumbs Box */}
                      <View style={styles.detailSection}>
                        <Text style={styles.sectionLabel}>EXACT NAVIGATION PATH</Text>
                        <View style={styles.breadcrumbBox}>
                          {screen.navigation.map((step, idx) => (
                            <View key={idx} style={styles.breadcrumbStep}>
                              <Text style={styles.breadcrumbStepText}>
                                {idx > 0 && '  ›  '}
                                {step}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      {/* Screen Purpose */}
                      <View style={styles.detailSection}>
                        <Text style={styles.sectionLabel}>SCREEN & REPORT PURPOSE</Text>
                        <Text style={styles.purposeText}>{screen.purpose}</Text>
                      </View>

                      {/* Why Records Are Here */}
                      <View style={styles.detailSection}>
                        <Text style={[styles.sectionLabel, { color: COLORS.danger }]}>
                          WHY RECORDS ARE HERE (ROOT CAUSE)
                        </Text>
                        {Array.isArray(screen.whyRecordsAreHere) ? (
                          screen.whyRecordsAreHere.map((reason, idx) => (
                            <View key={idx} style={styles.bulletRow}>
                              <View style={[styles.bulletDot, { backgroundColor: COLORS.danger }]} />
                              <Text style={styles.bulletText}>{reason}</Text>
                            </View>
                          ))
                        ) : (
                          <Text style={styles.bodyText}>{screen.whyRecordsAreHere}</Text>
                        )}
                      </View>

                      {/* Key Fields & Filters */}
                      {screen.keyFieldsAndFilters && (
                        <View style={styles.detailSection}>
                          <Text style={[styles.sectionLabel, { color: COLORS.warning }]}>
                            KEY FIELDS, BUTTONS & FILTERS
                          </Text>
                          {screen.keyFieldsAndFilters.map((field, idx) => (
                            <View key={idx} style={styles.fieldItem}>
                              <Text style={styles.fieldName}>{field.name}:</Text>
                              <Text style={styles.fieldDesc}>{field.description}</Text>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Step-by-Step SOP */}
                      <View style={styles.detailSection}>
                        <Text style={[styles.sectionLabel, { color: COLORS.primaryLight }]}>
                          ACCOUNTANT STEP-BY-STEP ACTION SOP
                        </Text>
                        {screen.accountantActionSOP.map((step, idx) => (
                          <View key={idx} style={styles.sopRow}>
                            <View style={styles.sopNumBadge}>
                              <Text style={styles.sopNumText}>{idx + 1}</Text>
                            </View>
                            <Text style={styles.sopStepText}>{step}</Text>
                          </View>
                        ))}
                      </View>

                      {/* GL Impact */}
                      <View style={styles.glSection}>
                        <Text style={styles.glSectionLabel}>DOWNSTREAM GL ACCOUNTING IMPACT</Text>
                        <Text style={styles.glSectionFormula}>{screen.glAccountingImpact}</Text>
                      </View>

                      {/* Pro Tip */}
                      {screen.proTips && (
                        <View style={styles.tipBox}>
                          <Ionicons name="sparkles" size={15} color={COLORS.gold} />
                          <Text style={styles.tipText}>{screen.proTips}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  moduleSelectorBar: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  moduleScroll: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  moduleTab: {
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
  moduleTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  moduleTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  moduleBanner: {
    backgroundColor: COLORS.surfaceLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  moduleBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  moduleDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  screensScroll: {
    flex: 1,
  },
  screensBody: {
    padding: 16,
    paddingBottom: 30,
  },
  submoduleGroup: {
    marginBottom: 20,
  },
  submoduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  submoduleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  screenCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  screenCardActive: {
    borderColor: COLORS.primaryLight,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  screenHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  screenIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  screenHeaderText: {
    flex: 1,
  },
  screenName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  screenBreadcrumbQuick: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  screenDetails: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surfaceInput,
  },
  detailSection: {
    marginTop: 12,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  breadcrumbBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.surface,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  breadcrumbStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbStepText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.info,
  },
  purposeText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 19,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 6,
    marginRight: 8,
  },
  bulletText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  bodyText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  fieldItem: {
    marginBottom: 6,
  },
  fieldName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.warning,
  },
  fieldDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  sopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  sopNumBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 1,
  },
  sopNumText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sopStepText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
    flex: 1,
  },
  glSection: {
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.success,
    marginTop: 12,
  },
  glSectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
    marginBottom: 4,
  },
  glSectionFormula: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${COLORS.gold}15`,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${COLORS.gold}40`,
    marginTop: 10,
  },
  tipText: {
    fontSize: 11,
    color: COLORS.text,
    lineHeight: 17,
    marginLeft: 8,
    flex: 1,
  },
});
