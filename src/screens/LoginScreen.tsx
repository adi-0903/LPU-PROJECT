import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { LpuLogo } from '../components/LpuLogo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { validateRegNumber, validatePassword, DEMO_USER } from '../utils/validation';

export const LoginScreen: React.FC = () => {
  const { login, loginAsGuest } = useAuth();
  const { t } = useLanguage();

  const [regNumber, setRegNumber] = useState('');
  const [password, setPassword] = useState('');
  const [regError, setRegError] = useState<string | undefined>();
  const [passError, setPassError] = useState<string | undefined>();
  const [generalError, setGeneralError] = useState<string | undefined>();
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleFillDemo = () => {
    setRegNumber(DEMO_USER.regNumber);
    setPassword(DEMO_USER.password);
    setRegError(undefined);
    setPassError(undefined);
    setGeneralError(undefined);
  };

  const handleLogin = async () => {
    setGeneralError(undefined);

    const regValidation = validateRegNumber(regNumber);
    const passValidation = validatePassword(password);

    setRegError(regValidation.error);
    setPassError(passValidation.error);

    if (!regValidation.valid || !passValidation.valid) {
      return;
    }

    setLoading(true);
    const res = await login(regNumber, password, rememberMe);
    setLoading(false);

    if (!res.success) {
      setGeneralError(res.error || t('wrongCredentials'));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Official LPU Branding Section */}
        <View style={styles.brandContainer}>
          <LpuLogo variant="full" size={78} style={{ marginBottom: 10 }} />
          <Text style={styles.appTitle}>{t('appName')}</Text>
          <Text style={styles.appTagline}>{t('appTagline')}</Text>
        </View>

        {/* Demo Quick Fill Banner */}
        <TouchableOpacity
          onPress={handleFillDemo}
          style={styles.demoBanner}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Autofill demo fresher account"
        >
          <View style={styles.demoBannerLeft}>
            <Icon name="sparkles" size={16} color={colors.primaryDark} style={{ marginRight: 8 }} />
            <View>
              <Text style={styles.demoBannerTitle}>Demo Fresher Account</Text>
              <Text style={styles.demoBannerSub}>Tap to fill: 12500000 • Fresher@123</Text>
            </View>
          </View>
          <Icon name="chevron-right" size={16} color={colors.primaryDark} />
        </TouchableOpacity>

        {/* Login Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>{t('login')}</Text>

          {generalError ? (
            <View style={styles.errorAlert}>
              <Icon name="alert-circle" size={16} color={colors.danger} style={{ marginRight: 8 }} />
              <Text style={styles.errorAlertText}>{generalError}</Text>
            </View>
          ) : null}

          <TextField
            label={t('regNumber')}
            value={regNumber}
            onChangeText={(text) => {
              setRegNumber(text);
              if (regError) setRegError(undefined);
              if (generalError) setGeneralError(undefined);
            }}
            placeholder={t('regPlaceholder')}
            keyboardType="number-pad"
            maxLength={8}
            leftIcon="user"
            error={regError}
            helperText="Your 8-digit LPU student registration number"
          />

          <TextField
            label={t('password')}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passError) setPassError(undefined);
              if (generalError) setGeneralError(undefined);
            }}
            placeholder={t('passwordPlaceholder')}
            secureTextEntry
            leftIcon="lock"
            error={passError}
          />

          {/* Keep Me Signed In & Forgot Password Row */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              onPress={() => setRememberMe((prev) => !prev)}
              style={styles.rememberRow}
              activeOpacity={0.7}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: rememberMe }}
              accessibilityLabel={t('keepMeSignedIn')}
            >
              <View style={[styles.checkboxBox, rememberMe && styles.checkboxBoxChecked]}>
                {rememberMe ? <Icon name="check" size={12} color={colors.white} /> : null}
              </View>
              <Text style={styles.rememberText}>{t('keepMeSignedIn')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowForgotModal(true)}
              style={styles.forgotButton}
              accessibilityRole="button"
              accessibilityLabel="Forgot password help dialog"
            >
              <Text style={styles.forgotText}>{t('forgotPassword')}</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <Button
            title={t('login')}
            onPress={handleLogin}
            loading={loading}
            variant="primary"
            size="lg"
            style={styles.loginButton}
          />

          {/* Guest Mode */}
          <Button
            title={t('continueAsGuest')}
            onPress={loginAsGuest}
            variant="ghost"
            size="md"
            style={styles.guestButton}
          />
        </View>

        {/* Forgot Password Info Dialog */}
        <Modal
          visible={showForgotModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowForgotModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.dialogCard}>
              <View style={styles.dialogIcon}>
                <Icon name="help-circle" size={28} color={colors.primary} />
              </View>
              <Text style={styles.dialogTitle}>{t('forgotPasswordTitle')}</Text>
              <Text style={styles.dialogMsg}>{t('forgotPasswordMsg')}</Text>
              <Button
                title={t('close')}
                onPress={() => setShowForgotModal(false)}
                variant="primary"
                style={{ marginTop: 14 }}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: spacing.sm + 4,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  logoNumber: {
    color: colors.white,
    fontSize: 28,
    fontWeight: typography.fontWeights.bold,
    fontFamily: typography.fontFamily,
  },
  appTitle: {
    fontSize: typography.fontSizes.xl + 2,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    marginBottom: 2,
  },
  appTagline: {
    fontSize: typography.fontSizes.xs + 1,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    textAlign: 'center',
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8E7',
    borderWidth: 1.5,
    borderColor: '#FFE082',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm + 2,
  },
  demoBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  demoBannerTitle: {
    fontSize: typography.fontSizes.xs + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
  },
  demoBannerSub: {
    fontSize: 11,
    color: '#8A5B00',
    fontFamily: typography.fontFamily,
    marginTop: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#1B2A49',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    fontSize: typography.fontSizes.lg + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    marginBottom: spacing.md,
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 10,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  errorAlertText: {
    fontSize: typography.fontSizes.xs,
    color: colors.danger,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeights.medium,
    flex: 1,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    flexWrap: 'wrap',
    gap: 8,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxBoxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  rememberText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeights.medium,
  },
  forgotButton: {
    paddingVertical: 4,
  },
  forgotText: {
    fontSize: typography.fontSizes.xs,
    color: colors.primaryDark,
    fontWeight: typography.fontWeights.semiBold,
    fontFamily: typography.fontFamily,
  },
  loginButton: {
    marginBottom: spacing.sm,
  },
  guestButton: {
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dialogCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  dialogIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  dialogTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    marginBottom: 8,
    textAlign: 'center',
  },
  dialogMsg: {
    fontSize: typography.fontSizes.sm,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    textAlign: 'center',
    lineHeight: 20,
  },
});
