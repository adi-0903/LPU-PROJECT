import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, borderRadius } from '../theme';
import { Icon, IconName } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = true,
  style,
  textStyle,
  accessibilityLabel,
  testID,
}) => {
  const getContainerStyle = () => {
    const base: ViewStyle[] = [styles.button];

    // Size
    if (size === 'sm') base.push(styles.sizeSm);
    else if (size === 'lg') base.push(styles.sizeLg);
    else base.push(styles.sizeMd);

    // Variant
    switch (variant) {
      case 'primary':
        base.push(styles.primary);
        break;
      case 'secondary':
        base.push(styles.secondary);
        break;
      case 'outline':
        base.push(styles.outline);
        break;
      case 'ghost':
        base.push(styles.ghost);
        break;
      case 'success':
        base.push(styles.success);
        break;
      case 'danger':
        base.push(styles.danger);
        break;
    }

    if (fullWidth) base.push(styles.fullWidth);
    if (disabled || loading) base.push(styles.disabled);

    return base;
  };

  const getTextColor = (): string => {
    if (disabled) return colors.textLight;
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'success':
      case 'danger':
        return colors.white;
      case 'outline':
        return colors.secondary;
      case 'ghost':
        return colors.primary;
      default:
        return colors.white;
    }
  };

  const textColor = getTextColor();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[getContainerStyle(), style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading }}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <Icon name={icon} size={size === 'sm' ? 16 : 20} color={textColor} style={styles.iconLeft} />
          )}
          <Text style={[styles.text, { color: textColor }, size === 'sm' && styles.textSm, textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Icon name={icon} size={size === 'sm' ? 16 : 20} color={textColor} style={styles.iconRight} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48, // Large tap target (min 48px)
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  sizeSm: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: borderRadius.sm,
  },
  sizeMd: {
    minHeight: 48,
    paddingHorizontal: 20,
    borderRadius: borderRadius.md,
  },
  sizeLg: {
    minHeight: 54,
    paddingHorizontal: 24,
    borderRadius: borderRadius.card,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  success: {
    backgroundColor: colors.success,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  disabled: {
    opacity: 0.55,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.semiBold,
    fontFamily: typography.fontFamily,
    letterSpacing: 0.2,
  },
  textSm: {
    fontSize: typography.fontSizes.sm,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});
