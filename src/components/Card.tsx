import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { colors, borderRadius, shadows, spacing } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'elevated' | 'flat' | 'outlined' | 'subtle';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  testID?: string;
  accessibilityLabel?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'elevated',
  padding = 'md',
  testID,
  accessibilityLabel,
}) => {
  const getCardStyle = (): ViewStyle[] => {
    const cardStyles: ViewStyle[] = [styles.base];

    // Padding
    if (padding === 'none') cardStyles.push(styles.pNone);
    else if (padding === 'sm') cardStyles.push(styles.pSm);
    else if (padding === 'lg') cardStyles.push(styles.pLg);
    else cardStyles.push(styles.pMd);

    // Variant
    switch (variant) {
      case 'elevated':
        cardStyles.push(styles.elevated);
        break;
      case 'flat':
        cardStyles.push(styles.flat);
        break;
      case 'outlined':
        cardStyles.push(styles.outlined);
        break;
      case 'subtle':
        cardStyles.push(styles.subtle);
        break;
    }

    return cardStyles;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.88}
        style={[getCardStyle(), style]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        testID={testID}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]} testID={testID} accessibilityLabel={accessibilityLabel}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card, // 16px radius
    overflow: 'hidden',
  },
  elevated: {
    ...shadows.card,
    borderWidth: 1,
    borderColor: 'rgba(230, 230, 226, 0.7)',
  },
  flat: {
    backgroundColor: colors.surface,
  },
  outlined: {
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  subtle: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pNone: {
    padding: 0,
  },
  pSm: {
    padding: spacing.md,
  },
  pMd: {
    padding: spacing.lg, // 16px
  },
  pLg: {
    padding: spacing.xl,
  },
});
