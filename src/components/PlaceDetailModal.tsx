import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Place } from '../types';
import { colors, typography, borderRadius, spacing } from '../theme';
import { Icon } from './Icon';
import { Button } from './Button';

interface PlaceDetailModalProps {
  place: Place | null;
  visible: boolean;
  onClose: () => void;
  onOpenMap: (place: Place) => void;
  onAskSenior: (place: Place) => void;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  visible,
  onClose,
  onOpenMap,
  onAskSenior,
}) => {
  if (!place) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Icon name={place.iconName || 'map-pin'} size={24} color={colors.primary} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.placeName}>{place.name}</Text>
              <Text style={styles.categoryBadge}>{place.category} • {place.block}</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel="Close details"
              activeOpacity={0.7}
            >
              <Icon name="x" size={20} color={colors.textDark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Short Description */}
            <Text style={styles.description}>{place.shortDescription}</Text>

            {/* How to Reach Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoCardHeader}>
                <Icon name="compass" size={18} color={colors.secondary} style={{ marginRight: 6 }} />
                <Text style={styles.infoCardTitle}>How to Reach</Text>
              </View>
              <Text style={styles.infoCardText}>{place.directions}</Text>
              <View style={styles.landmarkRow}>
                <Icon name="map-pin" size={14} color={colors.primary} style={{ marginRight: 4 }} />
                <Text style={styles.landmarkText}>
                  <Text style={{ fontWeight: 'bold' }}>Landmark: </Text>
                  {place.landmark}
                </Text>
              </View>
            </View>

            {/* Timings and Contact */}
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Icon name="clock" size={16} color={colors.textMuted} style={{ marginRight: 6 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.metaLabel}>Operating Hours</Text>
                  <Text style={styles.metaValue}>{place.timings}</Text>
                </View>
              </View>

              {place.contact ? (
                <View style={[styles.metaItem, { marginTop: 10 }]}>
                  <Icon name="phone" size={16} color={colors.textMuted} style={{ marginRight: 6 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.metaLabel}>Helpline / Extension</Text>
                    <Text style={styles.metaValue}>{place.contact}</Text>
                  </View>
                </View>
              ) : null}
            </View>

            {/* Action buttons */}
            <View style={styles.actionColumn}>
              <Button
                title="Open Campus Map"
                icon="map-pin"
                variant="primary"
                onPress={() => onOpenMap(place)}
                style={{ marginBottom: 10 }}
              />
              <Button
                title="Ask a Senior About This Place"
                icon="message-circle"
                variant="outline"
                onPress={() => onAskSenior(place)}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 24,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  placeName: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  categoryBadge: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    marginRight: -4,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  description: {
    fontSize: typography.fontSizes.base,
    color: colors.textDark,
    lineHeight: 22,
    fontFamily: typography.fontFamily,
    marginBottom: spacing.md,
  },
  infoCard: {
    backgroundColor: colors.secondarySubtle,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#D8E2F0',
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoCardTitle: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  infoCardText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textDark,
    lineHeight: 20,
    fontFamily: typography.fontFamily,
    marginBottom: 8,
  },
  landmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  landmarkText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
  },
  metaRow: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  metaLabel: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  metaValue: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    marginTop: 2,
  },
  actionColumn: {
    marginTop: 4,
    marginBottom: spacing.lg,
  },
});
