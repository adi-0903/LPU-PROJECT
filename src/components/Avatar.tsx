import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'busy' | 'offline';
  showStatus?: boolean;
}

const AVATAR_PALETTES = [
  { bg: '#FFE0B2', text: '#E65100' },
  { bg: '#E1BEE7', text: '#6A1B9A' },
  { bg: '#C8E6C9', text: '#1B5E20' },
  { bg: '#BBDEFB', text: '#0D47A1' },
  { bg: '#FFF9C4', text: '#F57F17' },
  { bg: '#D1C4E9', text: '#311B92' },
];

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  status = 'online',
  showStatus = false,
}) => {
  const getInitials = (n: string): string => {
    if (!n) return 'U';
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const getPalette = (n: string) => {
    let hash = 0;
    for (let i = 0; i < n.length; i++) {
      hash = n.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % AVATAR_PALETTES.length;
    return AVATAR_PALETTES[index];
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { width: 32, height: 32, borderRadius: 16, fontSize: 12 };
      case 'lg':
        return { width: 56, height: 56, borderRadius: 28, fontSize: 18 };
      case 'xl':
        return { width: 72, height: 72, borderRadius: 36, fontSize: 24 };
      case 'md':
      default:
        return { width: 44, height: 44, borderRadius: 22, fontSize: 14 };
    }
  };

  const sizeStyle = getSizeStyle();
  const palette = getPalette(name);

  return (
    <View style={[styles.wrapper, { width: sizeStyle.width, height: sizeStyle.height }]}>
      <View
        style={[
          styles.container,
          {
            width: sizeStyle.width,
            height: sizeStyle.height,
            borderRadius: sizeStyle.borderRadius,
            backgroundColor: palette.bg,
          },
        ]}
        accessibilityRole="image"
        accessibilityLabel={`Avatar for ${name}`}
      >
        <Text
          style={[
            styles.initials,
            {
              fontSize: sizeStyle.fontSize,
              color: palette.text,
            },
          ]}
        >
          {getInitials(name)}
        </Text>
      </View>

      {showStatus && (
        <View
          style={[
            styles.statusDot,
            status === 'online' && styles.statusOnline,
            status === 'busy' && styles.statusBusy,
            status === 'offline' && styles.statusOffline,
            size === 'sm' && styles.statusDotSm,
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: typography.fontWeights.bold,
    fontFamily: typography.fontFamily,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.white,
  },
  statusDotSm: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  statusOnline: {
    backgroundColor: colors.success,
  },
  statusBusy: {
    backgroundColor: colors.warning,
  },
  statusOffline: {
    backgroundColor: colors.textLight,
  },
});
