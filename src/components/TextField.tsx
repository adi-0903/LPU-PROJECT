import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';
import { colors, typography, borderRadius, spacing } from '../theme';
import { Icon, IconName } from './Icon';

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  helperText?: string;
  leftIcon?: IconName;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  maxLength?: number;
  editable?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  helperText,
  leftIcon,
  keyboardType = 'default',
  autoCapitalize = 'none',
  maxLength,
  editable = true,
  style,
  inputStyle,
  accessibilityLabel,
  testID,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = secureTextEntry;
  const showText = isPassword && !isPasswordVisible;

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          Boolean(error) && styles.errorBorder,
          !editable && styles.disabled,
        ]}
      >
        {leftIcon ? (
          <Icon
            name={leftIcon}
            size={18}
            color={error ? colors.danger : isFocused ? colors.primary : colors.textMuted}
            style={styles.leftIcon}
          />
        ) : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          secureTextEntry={showText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, inputStyle]}
          accessibilityLabel={accessibilityLabel || label}
          testID={testID}
        />

        {isPassword ? (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeButton}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            activeOpacity={0.7}
          >
            <Icon
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <View style={styles.errorRow}>
          <Icon name="alert-circle" size={14} color={colors.danger} style={{ marginRight: 4 }} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.textDark,
    marginBottom: 6,
    fontFamily: typography.fontFamily,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    minHeight: 48, // min 48px tap target
    paddingHorizontal: 14,
    overflow: 'hidden',
  },
  focused: {
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
  },
  errorBorder: {
    borderColor: colors.danger,
    backgroundColor: '#FFFBFB',
  },
  disabled: {
    backgroundColor: colors.surfaceSubtle,
    opacity: 0.7,
  },
  leftIcon: {
    marginRight: 10,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: typography.fontSizes.base,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    height: '100%',
    paddingVertical: 12,
  },
  eyeButton: {
    padding: 6,
    marginLeft: 4,
    flexShrink: 0,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  errorText: {
    fontSize: typography.fontSizes.xs,
    color: colors.danger,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeights.medium,
  },
  helperText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    marginTop: 5,
    fontFamily: typography.fontFamily,
  },
});
