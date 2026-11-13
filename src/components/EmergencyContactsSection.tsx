import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Linking,
  ScrollView,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { EmergencyContact, EmergencyCategory } from '../types';
import { EMERGENCY_CONTACTS } from '../data/emergencyContacts';
import { Icon } from './Icon';
import { useAuth } from '../context/AuthContext';

const EMERGENCY_CATEGORIES: (EmergencyCategory | 'All')[] = [
  'All',
  'Security',
  'Medical',
  'Hostel',
  'Helpline',
];

interface EmergencyContactsSectionProps {
  onAskSenior?: (message: string) => void;
}

export const EmergencyContactsSection: React.FC<EmergencyContactsSectionProps> = ({
  onAskSenior,
}) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Smart warden contact depending on student profile
  const primaryWarden = useMemo(() => {
    return EMERGENCY_CONTACTS.find((c) => c.id === 'em-bh4-warden') || EMERGENCY_CONTACTS[2];
  }, []);

  // Quick Dial handler
  const handleDial = (phone: string) => {
    const cleanNumber = phone.replace(/[^\d+]/g, '');
    const url = `tel:${cleanNumber}`;
    if (typeof window !== 'undefined') {
      window.location.href = url;
    } else {
      Linking.openURL(url).catch(() => {});
    }
  };

  // Copy number to clipboard handler
  const handleCopy = async (id: string, phone: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(phone);
      }
    } catch {
      // ignore
    }
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2200);
  };

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return EMERGENCY_CONTACTS.filter((c) => {
      const matchesCategory =
        selectedCategory === 'All' || c.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        c.phoneNumber.includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <View style={styles.container}>
      {/* SECTION HEADER */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.titleWithIcon}>
          <View style={styles.redDotIcon}>
            <Icon name="phone-call" size={16} color="#DC2626" />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Emergency Contacts & Quick Dial</Text>
            <Text style={styles.sectionSub}>24/7 immediate assistance for security, ambulance & hostel wardens</Text>
          </View>
        </View>
        <View style={styles.badge247}>
          <Text style={styles.badge247Text}>24x7 ACTIVE</Text>
        </View>
      </View>

      {/* TOP 3 QUICK-DIAL ACTION CARDS */}
      <View style={styles.quickDialGrid}>
        {/* Security Quick Dial */}
        <TouchableOpacity
          onPress={() => handleDial('+911824517100')}
          style={[styles.quickDialCard, styles.securityCardBg]}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Quick dial campus security control room"
        >
          <View style={styles.quickDialCardTop}>
            <View style={[styles.quickDialIconBox, { backgroundColor: '#FEE2E2' }]}>
              <Icon name="shield" size={18} color="#DC2626" />
            </View>
            <View style={[styles.sosTag, { backgroundColor: '#DC2626' }]}>
              <Text style={styles.sosTagText}>SOS</Text>
            </View>
          </View>
          <Text style={styles.quickDialTitle}>Campus Security</Text>
          <Text style={styles.quickDialPhone}>+91 1824 517100</Text>
          <View style={[styles.dialActionButton, { backgroundColor: '#DC2626' }]}>
            <Icon name="phone" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.dialActionText}>Call Security</Text>
          </View>
        </TouchableOpacity>

        {/* Ambulance Quick Dial */}
        <TouchableOpacity
          onPress={() => handleDial('+911824500108')}
          style={[styles.quickDialCard, styles.ambulanceCardBg]}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Quick dial campus ambulance and hospital ER"
        >
          <View style={styles.quickDialCardTop}>
            <View style={[styles.quickDialIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Icon name="activity" size={18} color="#D97706" />
            </View>
            <View style={[styles.sosTag, { backgroundColor: '#D97706' }]}>
              <Text style={styles.sosTagText}>ER</Text>
            </View>
          </View>
          <Text style={styles.quickDialTitle}>Ambulance / ER</Text>
          <Text style={styles.quickDialPhone}>+91 1824 500108</Text>
          <View style={[styles.dialActionButton, { backgroundColor: '#D97706' }]}>
            <Icon name="phone" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.dialActionText}>Call Ambulance</Text>
          </View>
        </TouchableOpacity>

        {/* Warden Quick Dial */}
        <TouchableOpacity
          onPress={() => handleDial(primaryWarden.phoneNumber)}
          style={[styles.quickDialCard, styles.wardenCardBg]}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Quick dial hostel warden office"
        >
          <View style={styles.quickDialCardTop}>
            <View style={[styles.quickDialIconBox, { backgroundColor: '#E0E7FF' }]}>
              <Icon name="home" size={18} color="#4F46E5" />
            </View>
            <View style={[styles.sosTag, { backgroundColor: '#4F46E5' }]}>
              <Text style={styles.sosTagText}>HOSTEL</Text>
            </View>
          </View>
          <Text style={styles.quickDialTitle}>Warden Desk</Text>
          <Text style={styles.quickDialPhone}>{primaryWarden.phoneNumber}</Text>
          <View style={[styles.dialActionButton, { backgroundColor: '#4F46E5' }]}>
            <Icon name="phone" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text style={styles.dialActionText}>Call Warden</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* SEARCH AND CATEGORY FILTER */}
      <View style={styles.filterSection}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={16} color={colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search security, ambulance, wardens, hospital..."
            placeholderTextColor={colors.textLight}
            style={styles.searchInput}
            clearButtonMode="while-editing"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
              <Icon name="x" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Category Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryChipsRow}>
          {EMERGENCY_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ALL CONTACTS LIST */}
      <View style={styles.contactsList}>
        {filteredContacts.map((contact) => {
          const isCopied = copiedId === contact.id;

          let badgeColor = colors.secondary;
          let badgeBg = '#F1F5F9';
          if (contact.category === 'Security') {
            badgeColor = '#DC2626';
            badgeBg = '#FEE2E2';
          } else if (contact.category === 'Medical') {
            badgeColor = '#D97706';
            badgeBg = '#FEF3C7';
          } else if (contact.category === 'Hostel') {
            badgeColor = '#4F46E5';
            badgeBg = '#EEF2FF';
          } else if (contact.category === 'Helpline') {
            badgeColor = '#059669';
            badgeBg = '#ECFDF5';
          }

          return (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactTopRow}>
                <View style={styles.categoryBadgeRow}>
                  <View style={[styles.contactCatBadge, { backgroundColor: badgeBg }]}>
                    <Text style={[styles.contactCatBadgeText, { color: badgeColor }]}>
                      {contact.category.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.availableHoursText}>{contact.availableHours}</Text>
                </View>

                {contact.isHotline && (
                  <View style={styles.hotlinePill}>
                    <Text style={styles.hotlinePillText}>HOTLINE</Text>
                  </View>
                )}
              </View>

              <Text style={styles.contactTitle}>{contact.title}</Text>
              <Text style={styles.contactSubtitle}>{contact.subtitle}</Text>

              <View style={styles.locationRow}>
                <Icon name="map-pin" size={12} color={colors.textMuted} style={{ marginRight: 4 }} />
                <Text style={styles.locationText}>{contact.location}</Text>
              </View>

              {/* Action Buttons Row */}
              <View style={styles.contactActionsRow}>
                <View style={styles.phoneDisplay}>
                  <Text style={styles.phoneDisplayText}>{contact.phoneNumber}</Text>
                  {contact.alternateNumber ? (
                    <Text style={styles.altPhoneText}>Alt: {contact.alternateNumber}</Text>
                  ) : null}
                </View>

                <View style={styles.buttonsGroup}>
                  {/* Copy Button */}
                  <TouchableOpacity
                    onPress={() => handleCopy(contact.id, contact.phoneNumber)}
                    style={[styles.copyButton, isCopied && styles.copyButtonActive]}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={`Copy phone number for ${contact.title}`}
                  >
                    <Icon
                      name={isCopied ? 'check' : 'copy'}
                      size={13}
                      color={isCopied ? '#059669' : colors.textMuted}
                      style={{ marginRight: 4 }}
                    />
                    <Text style={[styles.copyButtonText, isCopied && styles.copyButtonTextActive]}>
                      {isCopied ? 'Copied!' : 'Copy'}
                    </Text>
                  </TouchableOpacity>

                  {/* Quick-Dial Button */}
                  <TouchableOpacity
                    onPress={() => handleDial(contact.phoneNumber)}
                    style={[styles.callButton, { backgroundColor: badgeColor }]}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={`Call ${contact.title} at ${contact.phoneNumber}`}
                  >
                    <Icon name="phone" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.callButtonText}>Quick Dial</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF7F7',
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    paddingRight: 8,
  },
  redDotIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  sectionTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: '#991B1B',
    fontFamily: typography.fontFamily,
  },
  sectionSub: {
    fontSize: 11,
    color: '#7F1D1D',
    fontFamily: typography.fontFamily,
    marginTop: 2,
    lineHeight: 15,
  },
  badge247: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.pill,
  },
  badge247Text: {
    fontSize: 9,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  quickDialGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  quickDialCard: {
    flex: 1,
    borderRadius: borderRadius.md,
    padding: 10,
    borderWidth: 1.5,
    justifyContent: 'space-between',
  },
  securityCardBg: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FCA5A5',
  },
  ambulanceCardBg: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FCD34D',
  },
  wardenCardBg: {
    backgroundColor: '#FFFFFF',
    borderColor: '#C7D2FE',
  },
  quickDialCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  quickDialIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosTag: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  sosTagText: {
    fontSize: 8,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
  },
  quickDialTitle: {
    fontSize: 11,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    marginBottom: 2,
  },
  quickDialPhone: {
    fontSize: 9,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginBottom: 8,
  },
  dialActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  dialActionText: {
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
  },
  filterSection: {
    marginBottom: spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: borderRadius.sm,
    paddingHorizontal: 10,
    height: 38,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    paddingVertical: 4,
  },
  categoryChipsRow: {
    gap: 6,
    paddingBottom: 4,
  },
  categoryChip: {
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  categoryChipText: {
    fontSize: 10,
    fontWeight: typography.fontWeights.medium,
    color: colors.textMuted,
  },
  categoryChipTextActive: {
    color: colors.white,
    fontWeight: typography.fontWeights.bold,
  },
  contactsList: {
    gap: 8,
    marginTop: 6,
  },
  contactCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    ...shadows.card,
  },
  contactTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactCatBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  contactCatBadgeText: {
    fontSize: 9,
    fontWeight: typography.fontWeights.bold,
    letterSpacing: 0.5,
  },
  availableHoursText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: typography.fontWeights.semiBold,
  },
  hotlinePill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  hotlinePillText: {
    fontSize: 9,
    fontWeight: typography.fontWeights.bold,
    color: '#DC2626',
  },
  contactTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 11,
    color: colors.textDark,
    lineHeight: 16,
    fontFamily: typography.fontFamily,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  contactActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 8,
  },
  phoneDisplay: {
    flex: 1,
  },
  phoneDisplayText: {
    fontSize: 13,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    letterSpacing: 0.3,
  },
  altPhoneText: {
    fontSize: 9,
    color: colors.textMuted,
    marginTop: 1,
  },
  buttonsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  copyButtonActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  copyButtonText: {
    fontSize: 10,
    fontWeight: typography.fontWeights.medium,
    color: colors.textMuted,
  },
  copyButtonTextActive: {
    color: '#059669',
    fontWeight: typography.fontWeights.bold,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
  },
  callButtonText: {
    fontSize: 11,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
  },
});
