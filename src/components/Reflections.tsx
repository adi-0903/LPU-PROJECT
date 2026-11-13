import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { ReflectionEntry, MoodType } from '../types';
import { REFLECTION_PROMPTS, MOOD_OPTIONS } from '../data/reflectionPrompts';
import { getPromptForDay, validateReflectionText } from '../utils/reflectionUtils';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from './Button';
import { Icon } from './Icon';

interface ReflectionsProps {
  initialDay?: number;
}

export const Reflections: React.FC<ReflectionsProps> = ({ initialDay }) => {
  const { currentDay, reflections, saveReflection, deleteReflectionEntry } = useApp();
  const { t } = useLanguage();

  // Selected day for the journal entry (defaults to currentDay or initialDay)
  const [selectedDay, setSelectedDay] = useState<number>(initialDay || currentDay);
  const [selectedMood, setSelectedMood] = useState<MoodType>('happy');
  const [entryText, setEntryText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [successNotice, setSuccessNotice] = useState<boolean>(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState<boolean>(true);

  // Sync selected day when currentDay changes if user hasn't explicitly navigated
  useEffect(() => {
    if (initialDay) {
      setSelectedDay(initialDay);
    } else {
      setSelectedDay(currentDay);
    }
  }, [currentDay, initialDay]);

  // Load existing reflection for selectedDay if available
  useEffect(() => {
    const existing = reflections.find((r) => r.day === selectedDay);
    if (existing) {
      setEntryText(existing.text);
      setSelectedMood(existing.mood);
    } else {
      setEntryText('');
      setSelectedMood('happy');
    }
    setErrorMessage(undefined);
    setSuccessNotice(false);
  }, [selectedDay, reflections]);

  const activePrompt = getPromptForDay(selectedDay);
  const existingForDay = reflections.find((r) => r.day === selectedDay);

  const handleSave = async () => {
    const validation = validateReflectionText(entryText);
    if (!validation.valid) {
      setErrorMessage(validation.error);
      return;
    }

    setErrorMessage(undefined);
    const now = new Date();
    const formattedDate = `Day ${selectedDay} • ${now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}`;

    const newEntry: ReflectionEntry = {
      id: existingForDay ? existingForDay.id : `ref-${Date.now()}`,
      day: selectedDay,
      date: formattedDate,
      mood: selectedMood,
      prompt: activePrompt.question,
      text: entryText.trim(),
    };

    await saveReflection(newEntry);
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 3000);
  };

  const handleDelete = async () => {
    await deleteReflectionEntry(selectedDay);
    setEntryText('');
    setErrorMessage(undefined);
    setSuccessNotice(false);
  };

  const getMoodMeta = (mood: MoodType) => {
    return MOOD_OPTIONS.find((m) => m.type === mood) || MOOD_OPTIONS[0];
  };

  return (
    <View style={styles.container}>
      {/* Header with Title & Stats */}
      <View style={styles.headerRow}>
        <View style={styles.headerIconBox}>
          <Icon name="book-open" size={20} color={colors.primaryDark} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{t('reflectionsTitle')}</Text>
          <Text style={styles.subtitle}>{t('reflectionsSub')}</Text>
        </View>
        <View style={styles.badgeCount}>
          <Text style={styles.badgeCountText}>
            {reflections.length} / 15
          </Text>
        </View>
      </View>

      {/* Horizontal Day Switcher (1 to 15) */}
      <View style={styles.daySelectorContainer}>
        <Text style={styles.daySelectorLabel}>SELECT DAY TO REFLECT:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysScroll}
        >
          {Array.from({ length: 15 }, (_, i) => i + 1).map((d) => {
            const isSelected = selectedDay === d;
            const hasEntry = reflections.some((r) => r.day === d);
            const isCurrent = currentDay === d;

            return (
              <TouchableOpacity
                key={d}
                onPress={() => setSelectedDay(d)}
                style={[
                  styles.dayPill,
                  isSelected && styles.dayPillSelected,
                  isCurrent && !isSelected && styles.dayPillCurrent,
                ]}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel={`Day ${d} reflection. ${hasEntry ? 'Has recorded entry.' : 'No entry yet.'}`}
              >
                {hasEntry ? (
                  <View style={styles.hasEntryDot} />
                ) : null}
                <Text
                  style={[
                    styles.dayPillText,
                    isSelected && styles.dayPillTextSelected,
                    isCurrent && !isSelected && styles.dayPillTextCurrent,
                  ]}
                >
                  Day {d}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Active Daily Prompt Box */}
      <View style={styles.promptCard}>
        <View style={styles.promptHeader}>
          <View style={styles.promptTag}>
            <Text style={styles.promptTagText}>DAY {selectedDay} PROMPT</Text>
          </View>
          {existingForDay ? (
            <View style={styles.savedIndicator}>
              <Icon name="check" size={12} color={colors.success} style={{ marginRight: 4 }} />
              <Text style={styles.savedIndicatorText}>Recorded</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.promptQuestion}>{activePrompt.question}</Text>
        <Text style={styles.promptSubtext}>{activePrompt.subtext}</Text>
      </View>

      {/* Mood Selector */}
      <View style={styles.moodSection}>
        <Text style={styles.sectionLabel}>{t('selectMood')}</Text>
        <View style={styles.moodsRow}>
          {MOOD_OPTIONS.map((mood) => {
            const isSelected = selectedMood === mood.type;
            return (
              <TouchableOpacity
                key={mood.type}
                onPress={() => setSelectedMood(mood.type)}
                style={[
                  styles.moodButton,
                  isSelected && styles.moodButtonSelected,
                ]}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Mood: ${mood.label} ${mood.emoji}`}
                accessibilityState={{ selected: isSelected }}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    isSelected && styles.moodLabelSelected,
                  ]}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Journal Entry Text Input */}
      <View style={styles.editorSection}>
        <TextInput
          value={entryText}
          onChangeText={(txt) => {
            setEntryText(txt);
            if (errorMessage) setErrorMessage(undefined);
          }}
          placeholder={t('journalPlaceholder')}
          placeholderTextColor={colors.textLight}
          multiline
          numberOfLines={4}
          maxLength={600}
          style={styles.textArea}
          accessibilityLabel="Daily reflection journal text input"
        />

        <View style={styles.editorFooter}>
          <Text style={styles.charCount}>
            {entryText.length} / 600
          </Text>
        </View>
      </View>

      {/* Validation error or success feedback */}
      {errorMessage ? (
        <View style={styles.errorAlert}>
          <Icon name="alert-circle" size={14} color={colors.danger} style={{ marginRight: 6 }} />
          <Text style={styles.errorAlertText}>{errorMessage}</Text>
        </View>
      ) : null}

      {successNotice ? (
        <View style={styles.successAlert}>
          <Icon name="check-circle" size={14} color={colors.success} style={{ marginRight: 6 }} />
          <Text style={styles.successAlertText}>{t('savedSuccess')}</Text>
        </View>
      ) : null}

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <Button
          title={existingForDay ? 'Update Reflection' : t('saveEntry')}
          onPress={handleSave}
          icon="sparkles"
          variant="primary"
          size="md"
          fullWidth={!existingForDay}
          style={existingForDay ? { flex: 1, marginRight: 8 } : undefined}
        />

        {existingForDay ? (
          <Button
            title={t('deleteEntry')}
            onPress={handleDelete}
            icon="x"
            variant="ghost"
            size="md"
            fullWidth={false}
            style={styles.deleteButton}
            textStyle={{ color: colors.danger }}
          />
        ) : null}
      </View>

      {/* Past Reflections Timeline / History Section */}
      {reflections.length > 0 ? (
        <View style={styles.historySection}>
          <TouchableOpacity
            onPress={() => setIsHistoryExpanded(!isHistoryExpanded)}
            style={styles.historyToggleRow}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Your journal timeline. ${reflections.length} entries.`}
          >
            <View style={styles.historyTitleRow}>
              <Icon name="calendar" size={16} color={colors.secondary} style={{ marginRight: 6 }} />
              <Text style={styles.historyTitle}>Journal Timeline</Text>
              <View style={styles.historyBadge}>
                <Text style={styles.historyBadgeText}>{reflections.length}</Text>
              </View>
            </View>
            <Icon
              name={isHistoryExpanded ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={colors.secondary}
            />
          </TouchableOpacity>

          {isHistoryExpanded && (
            <View style={styles.historyList}>
              {reflections.map((entry) => {
                const moodMeta = getMoodMeta(entry.mood);
                const isItemActive = entry.day === selectedDay;

                return (
                  <TouchableOpacity
                    key={entry.id}
                    onPress={() => setSelectedDay(entry.day)}
                    style={[
                      styles.historyCard,
                      isItemActive && styles.historyCardActive,
                    ]}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={`View Day ${entry.day} reflection: ${entry.prompt}`}
                  >
                    <View style={styles.historyCardTop}>
                      <View style={styles.historyDayPill}>
                        <Text style={styles.historyDayPillText}>Day {entry.day}</Text>
                      </View>

                      <View style={styles.historyMoodTag}>
                        <Text style={styles.historyMoodEmoji}>{moodMeta.emoji}</Text>
                        <Text style={styles.historyMoodLabel}>{moodMeta.label}</Text>
                      </View>
                    </View>

                    <Text style={styles.historyPrompt}>{entry.prompt}</Text>
                    <Text style={styles.historyText} numberOfLines={3}>
                      "{entry.text}"
                    </Text>

                    <View style={styles.historyFooter}>
                      <Text style={styles.historyDate}>{entry.date}</Text>
                      <Text style={styles.historyTapToEdit}>
                        {isItemActive ? 'Editing above' : 'Tap to edit'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  title: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginTop: 2,
  },
  badgeCount: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeCountText: {
    fontSize: 11,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
  },
  daySelectorContainer: {
    marginBottom: spacing.md,
  },
  daySelectorLabel: {
    fontSize: 9,
    fontWeight: typography.fontWeights.bold,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  daysScroll: {
    gap: 6,
    paddingBottom: 4,
  },
  dayPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: colors.border,
    position: 'relative',
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  dayPillCurrent: {
    borderColor: colors.primary,
    backgroundColor: '#FFF8E7',
  },
  dayPillText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
  },
  dayPillTextSelected: {
    color: colors.white,
    fontWeight: typography.fontWeights.bold,
  },
  dayPillTextCurrent: {
    color: colors.primaryDark,
    fontWeight: typography.fontWeights.bold,
  },
  hasEntryDot: {
    position: 'absolute',
    top: 3,
    right: 5,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  promptCard: {
    backgroundColor: '#FFF9ED',
    borderWidth: 1,
    borderColor: '#FFE0B2',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  promptTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  promptTagText: {
    fontSize: 9,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
    letterSpacing: 0.5,
  },
  savedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedIndicatorText: {
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
    color: colors.success,
    fontFamily: typography.fontFamily,
  },
  promptQuestion: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    marginBottom: 4,
  },
  promptSubtext: {
    fontSize: typography.fontSizes.xs,
    color: '#8A4B00',
    fontFamily: typography.fontFamily,
    lineHeight: 18,
  },
  moodSection: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    marginBottom: 8,
  },
  moodsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
  },
  moodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  moodButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: '#FFF8E7',
  },
  moodEmoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  moodLabel: {
    fontSize: 10,
    fontWeight: typography.fontWeights.medium,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  moodLabelSelected: {
    color: colors.primaryDark,
    fontWeight: typography.fontWeights.bold,
  },
  editorSection: {
    marginBottom: spacing.sm,
  },
  textArea: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: typography.fontSizes.sm,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    minHeight: 110,
    textAlignVertical: 'top',
  },
  editorFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  charCount: {
    fontSize: 10,
    color: colors.textLight,
    fontFamily: typography.fontFamily,
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    padding: 8,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  errorAlertText: {
    fontSize: typography.fontSizes.xs,
    color: colors.danger,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeights.medium,
  },
  successAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    padding: 8,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  successAlertText: {
    fontSize: typography.fontSizes.xs,
    color: colors.success,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeights.bold,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  deleteButton: {
    minHeight: 48,
    paddingHorizontal: 16,
  },
  historySection: {
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.md,
  },
  historyToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  historyBadge: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.pill,
    marginLeft: 6,
  },
  historyBadgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  historyList: {
    marginTop: spacing.md,
    gap: 8,
  },
  historyCard: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFFBF2',
  },
  historyCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyDayPill: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  historyDayPillText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
    fontFamily: typography.fontFamily,
  },
  historyMoodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
  },
  historyMoodEmoji: {
    fontSize: 12,
    marginRight: 4,
  },
  historyMoodLabel: {
    fontSize: 10,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeights.medium,
  },
  historyPrompt: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    marginBottom: 4,
  },
  historyText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textDark,
    lineHeight: 18,
    fontFamily: typography.fontFamily,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 6,
    marginTop: 2,
  },
  historyDate: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  historyTapToEdit: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: typography.fontWeights.medium,
    fontFamily: typography.fontFamily,
  },
});
