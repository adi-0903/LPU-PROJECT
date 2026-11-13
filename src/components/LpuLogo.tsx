import React, { useState } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, typography } from '../theme';

interface LpuLogoProps {
  variant?: 'mark' | 'horizontal' | 'full';
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const OFFICIAL_LPU_LOGO_SRC = '/assets/aistudio/image_62b97abd.png';

/**
 * Official LPU (Lovely Professional University) Logo & Brand Lockup.
 * Uses the official LPU circular seal asset clipped cleanly to eliminate outer corner artifacts,
 * with a crisp SVG fallback if the asset ever fails to load.
 */
export const LpuLogo: React.FC<LpuLogoProps> = ({
  variant = 'mark',
  size = 44,
  style,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  const renderCrest = (crestSize: number) => (
    <View
      style={[
        styles.crestBox,
        {
          width: crestSize,
          height: crestSize,
          borderRadius: crestSize / 2,
        },
      ]}
      accessibilityLabel="Official LPU Lovely Professional University Logo"
      accessibilityRole="image"
    >
      {!imgFailed ? (
        <img
          src={OFFICIAL_LPU_LOGO_SRC}
          alt="Lovely Professional University Official Logo"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.04)',
            borderRadius: '50%',
            display: 'block',
          }}
        />
      ) : (
        <svg
          width={crestSize}
          height={crestSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          <circle cx="50" cy="50" r="46" fill="#FFFFFF" stroke="#1E232A" strokeWidth="3" />
          <circle cx="50" cy="50" r="32" fill="#F57C00" />
          <text
            x="50"
            y="57"
            textAnchor="middle"
            fill="#1B2A49"
            fontSize="20"
            fontWeight="800"
            fontFamily="Poppins, Arial, sans-serif"
          >
            LPU
          </text>
        </svg>
      )}
    </View>
  );

  if (variant === 'mark') {
    return <View style={style}>{renderCrest(size)}</View>;
  }

  if (variant === 'horizontal') {
    return (
      <View style={[styles.horizontalRow, style]}>
        {renderCrest(size)}
        <View style={styles.horizontalTextCol}>
          <Text style={styles.lpuTitleCompact}>LOVELY PROFESSIONAL</Text>
          <Text style={styles.lpuSubCompact}>UNIVERSITY · PUNJAB</Text>
        </View>
      </View>
    );
  }

  // Full vertical lockup for Login screen
  return (
    <View style={[styles.fullContainer, style]}>
      {renderCrest(size)}
      <View style={styles.fullTextWrap}>
        <Text style={styles.lpuFullHeading}>LOVELY PROFESSIONAL UNIVERSITY</Text>
        <Text style={styles.lpuFullSub}>Transforming Education · Transforming India</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  crestBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#1B2A49',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  horizontalRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalTextCol: {
    marginLeft: 10,
  },
  lpuTitleCompact: {
    fontSize: 11,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    letterSpacing: 0.6,
  },
  lpuSubCompact: {
    fontSize: 9,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
    letterSpacing: 0.8,
  },
  fullContainer: {
    alignItems: 'center',
  },
  fullTextWrap: {
    alignItems: 'center',
    marginTop: 10,
  },
  lpuFullHeading: {
    fontSize: 11,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    letterSpacing: 1.1,
    textAlign: 'center',
  },
  lpuFullSub: {
    fontSize: 10,
    fontWeight: typography.fontWeights.medium,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
    marginTop: 2,
    textAlign: 'center',
  },
});
