import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

interface ProgressRingProps {
  currentDay: number;
  totalDays?: number;
  percentage: number;
  size?: number;
  strokeWidth?: number;
  dayLabel?: string;
  ofLabel?: string;
  percentLabel?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  currentDay,
  totalDays = 15,
  percentage,
  size = 180,
  strokeWidth = 14,
  dayLabel = 'Day',
  ofLabel = 'of 15',
  percentLabel = 'tasks done',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (circumference * clampedPercent) / 100;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', position: 'absolute' }}
      >
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.surfaceSubtle}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Secondary subtle progress track for day number */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FFE0B2"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (circumference * (currentDay / totalDays))}
          strokeLinecap="round"
          fill="none"
          opacity={0.5}
        />

        {/* Primary animated/computed progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <View style={styles.innerContent}>
        <Text style={styles.dayPrefix}>{dayLabel.toUpperCase()}</Text>
        <Text style={styles.dayNumber}>{currentDay}</Text>
        <Text style={styles.dayOfText}>{ofLabel}</Text>

        <View style={styles.badge}>
          <Text style={styles.percentText}>{clampedPercent}%</Text>
          <Text style={styles.percentSub}>{percentLabel}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    alignSelf: 'center',
  },
  innerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPrefix: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    letterSpacing: 1.5,
    fontFamily: typography.fontFamily,
  },
  dayNumber: {
    fontSize: 42,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    lineHeight: 46,
    fontFamily: typography.fontFamily,
  },
  dayOfText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginBottom: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 2,
  },
  percentText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
    marginRight: 4,
  },
  percentSub: {
    fontSize: typography.fontSizes.xs,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
  },
});
