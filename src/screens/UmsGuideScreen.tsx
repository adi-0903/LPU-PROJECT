import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { UMS_GUIDES } from '../data/umsGuides';
import { UmsGuide } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Icon } from '../components/Icon';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface UmsGuideScreenProps {
  onBack: () => void;
  onAskSenior: (guideTitle: string) => void;
}

export const UmsGuideScreen: React.FC<UmsGuideScreenProps> = ({
  onBack,
  onAskSenior,
}) => {
  const { t } = useLanguage();
  const [selectedGuideId, setSelectedGuideId] = useState<string>(UMS_GUIDES[0].id);

  const currentGuide = UMS_GUIDES.find((g) => g.id === selectedGuideId) || UMS_GUIDES[0];

  return (
    <View style={styles.container}>
      {/* Top App Header with back arrow */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back to previous screen"
        >
          <Icon name="arrow-left" size={22} color={colors.secondary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>{t('umsGuide')}</Text>
          <Text style={styles.headerSubtitle}>Official Student Portal (ums.lpu.in)</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Horizontal Guide Switcher Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {UMS_GUIDES.map((guide) => {
            const isActive = guide.id === selectedGuideId;
            return (
              <TouchableOpacity
                key={guide.id}
                onPress={() => setSelectedGuideId(guide.id)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <Icon
                  name={guide.icon || 'book-open'}
                  size={16}
                  color={isActive ? colors.white : colors.secondary}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {guide.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Selected Guide Overview */}
        <View style={styles.guideOverviewCard}>
          <Text style={styles.guideTitle}>{currentGuide.title}</Text>
          <Text style={styles.guideSubtitle}>{currentGuide.subtitle}</Text>
        </View>

        {/* Numbered Steps with Mock Screenshot Box */}
        {currentGuide.steps.map((step) => (
          <Card key={step.stepNumber} style={styles.stepCard} padding="lg">
            {/* Step header */}
            <View style={styles.stepHeader}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{step.stepNumber}</Text>
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
            </View>

            <Text style={styles.stepInstruction}>{step.instruction}</Text>

            {/* Visual Screenshot Placeholder Box */}
            <View style={styles.screenshotBox}>
              <View style={styles.browserBar}>
                <View style={styles.browserDots}>
                  <View style={[styles.dot, { backgroundColor: '#FF5F56' }]} />
                  <View style={[styles.dot, { backgroundColor: '#FFBD2E' }]} />
                  <View style={[styles.dot, { backgroundColor: '#27C93F' }]} />
                </View>
                <Text style={styles.browserUrl}>ums.lpu.in • Step {step.stepNumber}</Text>
              </View>

              <View style={styles.mockScreenBody}>
                <Icon name="tv" size={32} color={colors.textLight} style={{ marginBottom: 6 }} />
                <Text style={styles.mockScreenText}>
                  UMS Interface View: {step.title}
                </Text>
                <Text style={styles.mockScreenSub}>
                  [Click to zoom interactive portal preview]
                </Text>
              </View>
            </View>

            {step.hint ? (
              <View style={styles.hintBox}>
                <Icon name="sparkles" size={14} color={colors.primaryDark} style={{ marginRight: 6 }} />
                <Text style={styles.hintText}>
                  <Text style={{ fontWeight: 'bold' }}>Pro Tip: </Text>
                  {step.hint}
                </Text>
              </View>
            ) : null}
          </Card>
        ))}

        {/* Still stuck? Ask a senior button */}
        <View style={styles.stuckSection}>
          <Card style={styles.stuckCard} padding="lg">
            <Icon name="help-circle" size={32} color={colors.primary} style={{ marginBottom: 8 }} />
            <Text style={styles.stuckTitle}>Still stuck on {currentGuide.title}?</Text>
            <Text style={styles.stuckDesc}>
              Portal errors, forgotten passwords, or missing section numbers are common in week 1. Our senior mentor can walk you through it.
            </Text>
            <Button
              title="Still Stuck? Ask a Senior"
              icon="message-circle"
              variant="primary"
              onPress={() => onAskSenior(currentGuide.title)}
              style={{ marginTop: 12 }}
            />
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  tabsScroll: {
    paddingBottom: spacing.md,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  tabButtonActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  tabText: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.medium,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  tabTextActive: {
    color: colors.white,
    fontWeight: typography.fontWeights.bold,
  },
  guideOverviewCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  guideTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
  },
  guideSubtitle: {
    fontSize: typography.fontSizes.xs,
    color: '#8A5200',
    fontFamily: typography.fontFamily,
    marginTop: 2,
  },
  stepCard: {
    marginBottom: spacing.md,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepBadgeText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: typography.fontWeights.bold,
    fontFamily: typography.fontFamily,
  },
  stepTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    flex: 1,
  },
  stepInstruction: {
    fontSize: typography.fontSizes.sm,
    color: colors.textDark,
    lineHeight: 20,
    fontFamily: typography.fontFamily,
    marginBottom: spacing.md,
  },
  screenshotBox: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  browserBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  browserDots: {
    flexDirection: 'row',
    gap: 4,
    marginRight: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  browserUrl: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  mockScreenBody: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  mockScreenText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  mockScreenSub: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginTop: 2,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E7',
    padding: 10,
    borderRadius: borderRadius.sm,
  },
  hintText: {
    fontSize: typography.fontSizes.xs,
    color: '#8A5B00',
    fontFamily: typography.fontFamily,
    flex: 1,
    lineHeight: 16,
  },
  stuckSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  stuckCard: {
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: colors.surface,
  },
  stuckTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    marginBottom: 4,
  },
  stuckDesc: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    textAlign: 'center',
    lineHeight: 18,
  },
});
