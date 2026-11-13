import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme';
import { Place, FAQItem } from '../types';
import { CAMPUS_PLACES } from '../data/places';
import { FAQS } from '../data/faqs';
import { useLanguage } from '../context/LanguageContext';
import { Chip } from '../components/Chip';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { EmptyState } from '../components/EmptyState';
import { PlaceDetailModal } from '../components/PlaceDetailModal';
import { MapModal } from '../components/MapModal';
import { EmergencyContactsSection } from '../components/EmergencyContactsSection';

const PLACE_CATEGORIES = [
  'All',
  'Academic',
  'Hostels',
  'Admin',
  'Library',
  'Help Desk',
  'Medical Centre',
  'Bank/ATM',
  'Mess/Food Court',
  'Sports & Gates',
];

interface HelpScreenProps {
  onNavigateToBuddy: (contextPlace?: string) => void;
  onNavigateToUms: () => void;
}

export const HelpScreen: React.FC<HelpScreenProps> = ({
  onNavigateToBuddy,
  onNavigateToUms,
}) => {
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  // Filter places based on search query & category chip with intelligent matching
  const filteredPlaces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const strippedQuery = q.replace(/[\s\-_.]/g, '');

    return CAMPUS_PLACES.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      const nameLower = p.name.toLowerCase();
      const blockLower = p.block.toLowerCase();
      const descLower = p.shortDescription.toLowerCase();
      const landmarkLower = p.landmark.toLowerCase();
      const strippedBlock = blockLower.replace(/[\s\-_.]/g, '');
      const strippedName = nameLower.replace(/[\s\-_.]/g, '');

      // Prevent BH/GH cross-matches
      if (strippedQuery.includes('bh') && strippedBlock.includes('gh')) return false;
      if (strippedQuery.includes('gh') && strippedBlock.includes('bh')) return false;

      // 1. Direct substring match
      if (
        nameLower.includes(q) ||
        blockLower.includes(q) ||
        descLower.includes(q) ||
        landmarkLower.includes(q)
      ) {
        return true;
      }

      // 2. Stripped whitespace/hyphen matching (e.g. "block 38" -> "block38")
      if (strippedBlock.includes(strippedQuery) || strippedName.includes(strippedQuery)) {
        return true;
      }

      // 3. Pure number query (e.g. "38" matches "Block 38")
      const isPureNum = /^[0-9]+$/.test(q);
      const blockDigits = p.block.replace(/[^0-9]/g, '');
      if (isPureNum && blockDigits && q === blockDigits) {
        return true;
      }

      // 4. Shorthand "b38"
      if (/^b[0-9]+$/.test(strippedQuery)) {
        const num = strippedQuery.slice(1);
        if (blockDigits === num) return true;
      }

      // 5. Keyword aliases
      if ((q.includes('cse') || q.includes('gdsc') || q.includes('coding')) && p.block.includes('38')) return true;
      if ((q.includes('library') || q.includes('books')) && p.block.includes('34')) return true;
      if ((q.includes('admin') || q.includes('fee')) && p.block.includes('32')) return true;
      if ((q.includes('mall') || q.includes('atm') || q.includes('bank') || q.includes('sbi')) && p.block.includes('13')) return true;
      if ((q.includes('hospital') || q.includes('doctor') || q.includes('clinic')) && p.id === 'p-hospital') return true;

      return false;
    });
  }, [searchQuery, selectedCategory]);

  // Filter FAQs based on search query
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQS;
    const q = searchQuery.toLowerCase();
    return FAQS.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handlePlacePress = (place: Place) => {
    setSelectedPlace(place);
    setDetailVisible(true);
  };

  const handleOpenMap = (place: Place) => {
    setSelectedPlace(place);
    setDetailVisible(false);
    setMapVisible(true);
  };

  const handleAskSenior = (place: Place) => {
    setDetailVisible(false);
    onNavigateToBuddy(`Hi! Can you help me reach ${place.name}?`);
  };

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Banner */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('imLost')}</Text>
          <Text style={styles.headerSubtitle}>
            Emergency contacts, campus blocks, landmarks, ATM hubs and answers to freshman questions
          </Text>
        </View>

        {/* 🚨 Emergency Contacts Section (Quick Dial Security, Ambulance, Wardens) */}
        <EmergencyContactsSection onAskSenior={onNavigateToBuddy} />

        {/* Interactive Campus Map & Wayfinder Launcher */}
        <TouchableOpacity
          onPress={() => {
            setSelectedPlace(null);
            setMapVisible(true);
          }}
          activeOpacity={0.85}
          style={styles.mapBannerCard}
          accessibilityRole="button"
          accessibilityLabel="Open Interactive Campus Map with live paths and block finder"
        >
          <View style={styles.mapBannerIcon}>
            <Icon name="navigation" size={24} color={colors.primary} />
          </View>
          <View style={{ flex: 1, paddingRight: 6 }}>
            <View style={styles.mapBannerPill}>
              <Text style={styles.mapBannerPillText}>CAMPUS NAVIGATOR</Text>
            </View>
            <Text style={styles.mapBannerTitle}>Interactive Map & Pathfinding</Text>
            <Text style={styles.mapBannerSub}>
              Search all 20+ blocks, buildings & hostels with walking paths and distance
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.primary} />
        </TouchableOpacity>

        {/* Live Search Bar */}
        <View style={styles.searchBarContainer}>
          <Icon name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('searchPlacesFaqs')}
            placeholderTextColor={colors.textLight}
            style={styles.searchInput}
            clearButtonMode="while-editing"
            accessibilityLabel="Search campus places and frequently asked questions"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Icon name="x" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Quick Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {PLACE_CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              selected={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat)}
            />
          ))}
        </ScrollView>

        {/* Places List */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Key Campus Locations</Text>
            <Text style={styles.sectionCount}>({filteredPlaces.length})</Text>
          </View>

          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place) => (
              <Card
                key={place.id}
                style={styles.placeCard}
                padding="md"
                onPress={() => handlePlacePress(place)}
                accessibilityLabel={`Location ${place.name}. ${place.shortDescription}. Tap for directions.`}
              >
                <View style={styles.placeRow}>
                  <View style={styles.placeIconBox}>
                    <Icon name={place.iconName || 'map-pin'} size={20} color={colors.primary} />
                  </View>

                  <View style={styles.placeContent}>
                    <View style={styles.placeTitleRow}>
                      <Text style={styles.placeName}>{place.name}</Text>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{place.category}</Text>
                      </View>
                    </View>

                    <Text style={styles.placeDesc} numberOfLines={2}>
                      {place.shortDescription}
                    </Text>

                    <View style={styles.landmarkRow}>
                      <Icon name="map-pin" size={12} color={colors.textMuted} style={{ marginRight: 4 }} />
                      <Text style={styles.landmarkText} numberOfLines={1}>
                        {place.landmark}
                      </Text>
                    </View>
                  </View>

                  <Icon name="chevron-right" size={18} color={colors.textLight} style={styles.chevron} />
                </View>
              </Card>
            ))
          ) : (
            <EmptyState
              icon="search"
              title="No locations matched"
              description={`We couldn't find any places matching "${searchQuery}".`}
              actionText="Clear Search"
              onAction={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            />
          )}
        </View>

        {/* UMS Guide Shortcut Card */}
        <Card
          style={styles.umsPromoCard}
          padding="lg"
          onPress={onNavigateToUms}
          accessibilityLabel="Open UMS step-by-step tutorial guide"
        >
          <View style={styles.umsPromoRow}>
            <View style={styles.umsPromoIcon}>
              <Icon name="book-open" size={24} color={colors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.umsPromoTitle}>{t('umsGuide')}</Text>
              <Text style={styles.umsPromoSub}>
                Step-by-step screenshots for logging in, finding timetable, 75% attendance & paying fees.
              </Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.secondary} />
          </View>
        </Card>

        {/* FAQ Accordion Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>{t('faqs')}</Text>
            <Text style={styles.sectionCount}>({filteredFaqs.length})</Text>
          </View>

          {filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <Card key={faq.id} style={styles.faqCard} padding="none">
                <TouchableOpacity
                  onPress={() => toggleFaq(faq.id)}
                  style={styles.faqHeader}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityState={{ expanded: isExpanded }}
                  accessibilityLabel={faq.question}
                >
                  <View style={styles.faqTagRow}>
                    <View style={styles.faqTag}>
                      <Text style={styles.faqTagText}>{faq.category}</Text>
                    </View>
                  </View>
                  <View style={styles.faqQuestionRow}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Icon
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={colors.primary}
                    />
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.faqBody}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                    <TouchableOpacity
                      onPress={() => onNavigateToBuddy(`Question about ${faq.category}: ${faq.question}`)}
                      style={styles.faqAskSeniorRow}
                      activeOpacity={0.7}
                    >
                      <Icon name="message-circle" size={14} color={colors.primaryDark} style={{ marginRight: 6 }} />
                      <Text style={styles.faqAskSeniorText}>Still stuck? Ask a senior</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Card>
            );
          })}
        </View>
      </ScrollView>

      {/* Place Details Modal */}
      <PlaceDetailModal
        place={selectedPlace}
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        onOpenMap={handleOpenMap}
        onAskSenior={handleAskSenior}
      />

      {/* Campus Map Modal */}
      <MapModal
        place={selectedPlace}
        visible={mapVisible}
        onClose={() => setMapVisible(false)}
        onAskSenior={(msg) => onNavigateToBuddy(msg)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8EB',
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#FFE082',
    marginBottom: spacing.md,
    ...shadows.card,
  },
  mapBannerIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  mapBannerPill: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  mapBannerPillText: {
    fontSize: 9,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  mapBannerTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
  },
  mapBannerSub: {
    fontSize: 11,
    color: '#8A5300',
    fontFamily: typography.fontFamily,
    lineHeight: 15,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: spacing.md,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  headerSubtitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginTop: 4,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    minHeight: 48,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSizes.sm,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    height: '100%',
    paddingVertical: 10,
  },
  clearButton: {
    padding: 6,
  },
  chipsRow: {
    paddingBottom: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.md,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  sectionCount: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginLeft: 6,
  },
  placeCard: {
    marginBottom: spacing.sm + 2,
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  placeContent: {
    flex: 1,
    paddingRight: 6,
  },
  placeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  placeName: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  placeDesc: {
    fontSize: typography.fontSizes.xs,
    color: colors.textDark,
    lineHeight: 16,
    fontFamily: typography.fontFamily,
    marginBottom: 6,
  },
  landmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  landmarkText: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  chevron: {
    marginLeft: 4,
  },
  umsPromoCard: {
    backgroundColor: '#EEF4FF',
    borderColor: '#C7D9FB',
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  umsPromoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  umsPromoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  umsPromoTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  umsPromoSub: {
    fontSize: typography.fontSizes.xs,
    color: colors.textDark,
    opacity: 0.8,
    fontFamily: typography.fontFamily,
    lineHeight: 16,
    marginTop: 2,
  },
  faqCard: {
    marginBottom: spacing.sm + 2,
  },
  faqHeader: {
    padding: spacing.md,
  },
  faqTagRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  faqTag: {
    backgroundColor: colors.secondarySubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  faqTagText: {
    fontSize: 10,
    fontWeight: typography.fontWeights.medium,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  faqQuestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    flex: 1,
    paddingRight: 8,
    lineHeight: 18,
  },
  faqBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 8,
  },
  faqAnswer: {
    fontSize: typography.fontSizes.xs + 1,
    color: colors.textDark,
    lineHeight: 18,
    fontFamily: typography.fontFamily,
  },
  faqAskSeniorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FFF8E7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  faqAskSeniorText: {
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
  },
});
