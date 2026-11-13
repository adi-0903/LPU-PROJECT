import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, StyleProp, ViewStyle } from 'react-native';
import { colors, typography, borderRadius } from '../theme';
import { Icon, IconName } from './Icon';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: IconName;
  badge?: number | string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  icon,
  badge,
  style,
  testID,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.chip,
        selected ? styles.selectedChip : styles.unselectedChip,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}${selected ? ', selected' : ''}`}
      testID={testID}
    >
      {icon ? (
        <Icon
          name={icon}
          size={14}
          color={selected ? colors.white : colors.secondary}
          style={styles.icon}
        />
      ) : null}

      <Text
        style={[
          styles.text,
          selected ? styles.selectedText : styles.unselectedText,
        ]}
      >
        {label}
      </Text>

      {badge !== undefined && (
        <View style={[styles.badge, selected ? styles.selectedBadge : styles.unselectedBadge]}>
          <Text style={[styles.badgeText, selected ? styles.selectedBadgeText : styles.unselectedBadgeText]}>
            {badge}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.pill,
    minHeight: 36,
    marginRight: 8,
    borderWidth: 1.5,
  },
  unselectedChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  selectedChip: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    fontFamily: typography.fontFamily,
  },
  unselectedText: {
    color: colors.textDark,
  },
  selectedText: {
    color: colors.white,
    fontWeight: typography.fontWeights.semiBold,
  },
  badge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  unselectedBadge: {
    backgroundColor: colors.surfaceSubtle,
  },
  selectedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  badgeText: {
    fontSize: typography.fontSizes.xs,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeights.bold,
  },
  unselectedBadgeText: {
    color: colors.textMuted,
  },
  selectedBadgeText: {
    color: colors.white,
  },
});
