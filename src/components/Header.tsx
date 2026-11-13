import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';
import { Icon } from './Icon';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './Avatar';
import { LpuLogo } from './LpuLogo';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  onProfilePress?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  onProfilePress,
  rightAction,
}) => {
  const { language, toggleLanguage } = useLanguage();
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        {showBack && onBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={22} color={colors.secondary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.brandRow}>
            <LpuLogo variant="mark" size={36} style={{ marginRight: 10 }} />
            <View>
              <Text style={styles.appName}>First 15 Days</Text>
              <Text style={styles.campusTag}>LPU Campus Guide</Text>
            </View>
          </View>
        )}

        {showBack && title ? (
          <Text style={styles.screenTitle} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </View>

      <View style={styles.rightRow}>
        {rightAction ? (
          rightAction
        ) : (
          <>
            {/* Language toggle pill */}
            <TouchableOpacity
              onPress={toggleLanguage}
              style={styles.langPill}
              accessibilityRole="button"
              accessibilityLabel={`Switch language. Current: ${language === 'en' ? 'English' : 'Hindi'}`}
              activeOpacity={0.8}
            >
              <Text style={[styles.langText, language === 'en' && styles.langActive]}>EN</Text>
              <Text style={styles.langDivider}>|</Text>
              <Text style={[styles.langText, language === 'hi' && styles.langActive]}>हिं</Text>
            </TouchableOpacity>

            {/* Profile icon */}
            {onProfilePress ? (
              <TouchableOpacity
                onPress={onProfilePress}
                style={styles.profileButton}
                accessibilityRole="button"
                accessibilityLabel="Open student profile and demo settings"
                activeOpacity={0.8}
              >
                <Avatar name={user?.name || 'Aman'} size="sm" />
              </TouchableOpacity>
            ) : null}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 6,
    marginLeft: -4,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  logoBadgeText: {
    color: colors.white,
    fontWeight: typography.fontWeights.bold,
    fontSize: 15,
    fontFamily: typography.fontFamily,
  },
  appName: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    lineHeight: 18,
  },
  campusTag: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    lineHeight: 14,
  },
  screenTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    marginLeft: 6,
    flex: 1,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  langText: {
    fontSize: typography.fontSizes.xs,
    fontFamily: typography.fontFamily,
    color: colors.textMuted,
    fontWeight: typography.fontWeights.medium,
  },
  langActive: {
    color: colors.primaryDark,
    fontWeight: typography.fontWeights.bold,
  },
  langDivider: {
    fontSize: typography.fontSizes.xs,
    color: colors.borderStrong,
    marginHorizontal: 4,
  },
  profileButton: {
    marginLeft: 2,
  },
});
