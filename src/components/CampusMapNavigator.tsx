import React, { useState, useMemo, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import { colors, typography, borderRadius, spacing, shadows } from '../theme';
import { CampusBlock, BlockCategory } from '../types';
import { CAMPUS_BLOCKS } from '../data/campusBlocks';
import {
  searchCampusBlocks,
  generateCampusRoute,
  generateGoogleMapsUrl,
  calculateDistanceMeters,
} from '../utils/pathfinding';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Icon } from './Icon';
import { Button } from './Button';

const CATEGORIES: (BlockCategory | 'All')[] = [
  'All',
  'Academic Blocks',
  'Hostels',
  'Food & Dining',
  'Admin & Help',
  'Medical & Banks',
  'Sports & Gates',
];

interface CampusMapNavigatorProps {
  visible: boolean;
  initialDestinationId?: string;
  onClose: () => void;
  onAskSenior?: (message: string) => void;
}

// Helper to resolve any query string or block identifier to a CampusBlock
function resolveCampusBlock(queryId?: string): CampusBlock | undefined {
  if (!queryId) return undefined;
  const q = queryId.trim().toLowerCase();
  const strippedQ = q.replace(/[\s\-_.]/g, '');

  return (
    CAMPUS_BLOCKS.find((b) => b.id.toLowerCase() === q) ||
    CAMPUS_BLOCKS.find((b) => b.blockNumber.toLowerCase() === q) ||
    CAMPUS_BLOCKS.find((b) => b.blockNumber.toLowerCase().replace(/[\s\-_.]/g, '') === strippedQ) ||
    CAMPUS_BLOCKS.find((b) => b.name.toLowerCase().includes(q)) ||
    CAMPUS_BLOCKS.find((b) => q.includes(b.blockNumber.toLowerCase()))
  );
}

export const CampusMapNavigator: React.FC<CampusMapNavigatorProps> = ({
  visible,
  initialDestinationId,
  onClose,
  onAskSenior,
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Smart default origin based on student's residence
  const defaultOrigin = useMemo(() => {
    if (user?.residence === 'Hostel') {
      return CAMPUS_BLOCKS.find((b) => b.id === 'hostel-bh4') || CAMPUS_BLOCKS[0];
    }
    return CAMPUS_BLOCKS.find((b) => b.id === 'gate-1') || CAMPUS_BLOCKS[0];
  }, [user]);

  // Selected Origin & Destination
  const [selectedOrigin, setSelectedOrigin] = useState<CampusBlock>(defaultOrigin);
  const [selectedDestination, setSelectedDestination] = useState<CampusBlock>(() => {
    const resolved = resolveCampusBlock(initialDestinationId);
    return resolved || CAMPUS_BLOCKS.find((b) => b.id === 'block-38') || CAMPUS_BLOCKS[0];
  });

  // Direct Google Maps style editable input texts
  const [originText, setOriginText] = useState(selectedOrigin.name);
  const [destText, setDestText] = useState(selectedDestination.name);

  // Autocomplete dropdown visibility states
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  // Sync destination if initialDestinationId prop updates
  useEffect(() => {
    if (initialDestinationId) {
      const resolved = resolveCampusBlock(initialDestinationId);
      if (resolved) {
        setSelectedDestination(resolved);
        setDestText(resolved.name);
      }
    }
  }, [initialDestinationId]);

  // Keep text input values in sync when selected blocks change
  useEffect(() => {
    setOriginText(selectedOrigin.name);
  }, [selectedOrigin]);

  useEffect(() => {
    setDestText(selectedDestination.name);
  }, [selectedDestination]);

  // Autocomplete search suggestions
  const originSuggestions = useMemo(() => {
    return searchCampusBlocks(originText).slice(0, 5);
  }, [originText]);

  const destSuggestions = useMemo(() => {
    return searchCampusBlocks(destText).slice(0, 5);
  }, [destText]);

  // Directory Search & Filter state
  const [directorySearchQuery, setDirectorySearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BlockCategory | 'All'>('All');
  const [travelMode, setTravelMode] = useState<'walk' | 'cycle' | 'shuttle'>('walk');
  const [showDirectionsList, setShowDirectionsList] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navStepIndex, setNavStepIndex] = useState(0);

  // Active calculated route
  const currentRoute = useMemo(() => {
    return generateCampusRoute(selectedOrigin, selectedDestination);
  }, [selectedOrigin, selectedDestination]);

  // Filtered block search results in directory
  const filteredBlocks = useMemo(() => {
    return searchCampusBlocks(directorySearchQuery, selectedCategory);
  }, [directorySearchQuery, selectedCategory]);

  // Swap Origin and Destination
  const handleSwap = () => {
    const temp = selectedOrigin;
    setSelectedOrigin(selectedDestination);
    setSelectedDestination(temp);
    setShowOriginDropdown(false);
    setShowDestDropdown(false);
    setIsNavigating(false);
    setNavStepIndex(0);
  };

  // Live Navigation Simulation timer
  useEffect(() => {
    let timer: any;
    if (isNavigating) {
      timer = setInterval(() => {
        setNavStepIndex((prev) => {
          if (prev >= currentRoute.steps.length - 1) {
            setIsNavigating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isNavigating, currentRoute.steps.length]);

  // Open native/external Google Maps
  const handleOpenGoogleMaps = () => {
    const url = generateGoogleMapsUrl(selectedOrigin.coordinates, selectedDestination.coordinates);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url).catch(() => {});
    }
  };

  // Convert GPS coordinates to 400x240 SVG viewbox coordinates for hybrid campus view
  const getSvgCoordinates = (coord: { lat: number; lng: number }) => {
    const minLat = 31.2495;
    const maxLat = 31.2588;
    const minLng = 75.7005;
    const maxLng = 75.7078;

    const x = ((coord.lng - minLng) / (maxLng - minLng)) * 360 + 20;
    const y = (1 - (coord.lat - minLat) / (maxLat - minLat)) * 200 + 20;

    return { x: Math.max(15, Math.min(385, x)), y: Math.max(15, Math.min(225, y)) };
  };

  const svgOrigin = getSvgCoordinates(selectedOrigin.coordinates);
  const svgDest = getSvgCoordinates(selectedDestination.coordinates);
  const svgPathPoints = currentRoute.pathCoordinates.map(getSvgCoordinates);
  const pathD = svgPathPoints.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Close Campus Navigator"
          >
            <Icon name="arrow-left" size={22} color={colors.secondary} />
          </TouchableOpacity>

          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.headerTitle}>Campus Map & Navigator</Text>
            <Text style={styles.headerSubtitle}>LPU 600-Acre Direct Block-to-Block Routing</Text>
          </View>

          <TouchableOpacity
            onPress={handleOpenGoogleMaps}
            style={styles.gmapsButton}
            accessibilityRole="button"
            accessibilityLabel="Open external Google Maps"
          >
            <Icon name="map" size={15} color={colors.primaryDark} style={{ marginRight: 4 }} />
            <Text style={styles.gmapsButtonText}>Google Maps</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* DIRECT GOOGLE MAPS STYLE FROM & TO NAVIGATION CONTROLS */}
          <View style={styles.routingCard}>
            <View style={styles.routingCardHeader}>
              <View style={styles.gmapsPill}>
                <Text style={styles.gmapsPillText}>DIRECT FROM & TO NAVIGATION</Text>
              </View>
              <Text style={styles.routeHeaderSub}>Search any block, hostel or gate to calculate walking path</Text>
            </View>

            <View style={styles.dualInputsContainer}>
              {/* Left Column: Visual Origin/Destination Connectors */}
              <View style={styles.iconsColumn}>
                <View style={styles.originCircle} />
                <View style={styles.routeDottedLine} />
                <View style={styles.destSquare} />
              </View>

              {/* Middle Column: Interactive Direct Search Inputs */}
              <View style={styles.fieldsColumn}>
                {/* FROM INPUT ROW */}
                <View style={styles.inputFieldWrapper}>
                  <Text style={styles.inputFieldMicroLabel}>FROM (START POINT)</Text>
                  <View style={styles.inputInnerRow}>
                    <TextInput
                      value={originText}
                      onChangeText={(val) => {
                        setOriginText(val);
                        setShowOriginDropdown(true);
                      }}
                      onFocus={() => {
                        setShowOriginDropdown(true);
                        setShowDestDropdown(false);
                      }}
                      placeholder="Type starting block, hostel or gate (e.g. BH-4, Gate 1)..."
                      placeholderTextColor={colors.textLight}
                      style={styles.routeTextInput}
                      clearButtonMode="while-editing"
                      accessibilityLabel="Starting campus location input"
                    />
                    {originText ? (
                      <TouchableOpacity
                        onPress={() => {
                          setOriginText('');
                          setShowOriginDropdown(true);
                        }}
                        style={styles.inputClearBtn}
                      >
                        <Icon name="x" size={14} color={colors.textMuted} />
                      </TouchableOpacity>
                    ) : null}
                  </View>

                  {/* Origin Autocomplete Suggestions Dropdown */}
                  {showOriginDropdown && originSuggestions.length > 0 && (
                    <View style={styles.autocompleteDropdown}>
                      {originSuggestions.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => {
                            setSelectedOrigin(item);
                            setOriginText(item.name);
                            setShowOriginDropdown(false);
                            setIsNavigating(false);
                            setNavStepIndex(0);
                          }}
                          style={styles.autocompleteItem}
                          activeOpacity={0.7}
                        >
                          <View style={styles.autoPill}>
                            <Text style={styles.autoPillText}>{item.blockNumber}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.autoItemName} numberOfLines={1}>
                              {item.name}
                            </Text>
                            <Text style={styles.autoItemCat} numberOfLines={1}>
                              {item.category} • {item.entranceLocation || 'Main Entrance'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* TO INPUT ROW */}
                <View style={[styles.inputFieldWrapper, { marginTop: 8 }]}>
                  <Text style={styles.inputFieldMicroLabel}>TO (DESTINATION)</Text>
                  <View style={styles.inputInnerRow}>
                    <TextInput
                      value={destText}
                      onChangeText={(val) => {
                        setDestText(val);
                        setShowDestDropdown(true);
                      }}
                      onFocus={() => {
                        setShowDestDropdown(true);
                        setShowOriginDropdown(false);
                      }}
                      placeholder="Type destination block (e.g. Block 38, Uni-Mall, Library)..."
                      placeholderTextColor={colors.textLight}
                      style={[styles.routeTextInput, { color: colors.primaryDark, fontWeight: '600' }]}
                      clearButtonMode="while-editing"
                      accessibilityLabel="Destination campus location input"
                    />
                    {destText ? (
                      <TouchableOpacity
                        onPress={() => {
                          setDestText('');
                          setShowDestDropdown(true);
                        }}
                        style={styles.inputClearBtn}
                      >
                        <Icon name="x" size={14} color={colors.textMuted} />
                      </TouchableOpacity>
                    ) : null}
                  </View>

                  {/* Destination Autocomplete Suggestions Dropdown */}
                  {showDestDropdown && destSuggestions.length > 0 && (
                    <View style={styles.autocompleteDropdown}>
                      {destSuggestions.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => {
                            setSelectedDestination(item);
                            setDestText(item.name);
                            setShowDestDropdown(false);
                            setIsNavigating(false);
                            setNavStepIndex(0);
                          }}
                          style={styles.autocompleteItem}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.autoPill, { backgroundColor: colors.primary }]}>
                            <Text style={styles.autoPillText}>{item.blockNumber}</Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.autoItemName} numberOfLines={1}>
                              {item.name}
                            </Text>
                            <Text style={styles.autoItemCat} numberOfLines={1}>
                              {item.category} • {item.entranceLocation || 'Main Entrance'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              {/* Right Column: Direction Swap Button (⇅) */}
              <View style={styles.swapColumn}>
                <TouchableOpacity
                  onPress={handleSwap}
                  style={styles.swapIconButton}
                  accessibilityRole="button"
                  accessibilityLabel="Reverse From and To directions"
                >
                  <Icon name="repeat" size={16} color={colors.primaryDark} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Destination Chips */}
            <View style={styles.quickChipsWrapper}>
              <Text style={styles.quickChipsLabel}>QUICK DESTINATIONS:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickChipsRow}>
                {[
                  { label: '🏢 Block 38 (CSE Labs)', id: 'block-38' },
                  { label: '📚 Block 34 (Library)', id: 'block-34' },
                  { label: '🏛️ Block 32 (Admin)', id: 'block-32' },
                  { label: '🛍️ Block 13 (Uni-Mall)', id: 'block-13' },
                  { label: '📍 My Hostel (BH-4)', id: 'hostel-bh4' },
                  { label: '🏥 Uni-Hospital', id: 'shanti-hospital' },
                  { label: '🚪 Gate 1 (GT Road)', id: 'gate-1' },
                  { label: '🚪 Gate 2 (Law Gate)', id: 'gate-2' },
                  { label: '💼 Block 55 (MBA)', id: 'block-55' },
                ].map((chip) => {
                  const isSelected = selectedDestination.id === chip.id;
                  return (
                    <TouchableOpacity
                      key={chip.id}
                      onPress={() => {
                        const target = CAMPUS_BLOCKS.find((b) => b.id === chip.id);
                        if (target) {
                          setSelectedDestination(target);
                          setDestText(target.name);
                          setShowDestDropdown(false);
                          setShowOriginDropdown(false);
                          setIsNavigating(false);
                          setNavStepIndex(0);
                        }
                      }}
                      style={[styles.quickChip, isSelected && styles.quickChipActive]}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.quickChipText, isSelected && styles.quickChipTextActive]}>
                        {chip.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Travel Mode Pills & Quick Route Summary */}
            <View style={styles.travelModeRow}>
              <View style={styles.modesContainer}>
                <TouchableOpacity
                  onPress={() => setTravelMode('walk')}
                  style={[styles.modeButton, travelMode === 'walk' && styles.modeButtonActive]}
                  accessibilityRole="button"
                  accessibilityLabel="Walking mode"
                >
                  <Text style={styles.modeIcon}>🚶</Text>
                  <Text style={[styles.modeText, travelMode === 'walk' && styles.modeTextActive]}>
                    {currentRoute.walkMinutes} min walk
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setTravelMode('cycle')}
                  style={[styles.modeButton, travelMode === 'cycle' && styles.modeButtonActive]}
                  accessibilityRole="button"
                  accessibilityLabel="Campus bicycle mode"
                >
                  <Text style={styles.modeIcon}>🚲</Text>
                  <Text style={[styles.modeText, travelMode === 'cycle' && styles.modeTextActive]}>
                    {currentRoute.cycleMinutes} min cycle
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setTravelMode('shuttle')}
                  style={[styles.modeButton, travelMode === 'shuttle' && styles.modeButtonActive]}
                  accessibilityRole="button"
                  accessibilityLabel="University electric shuttle mode"
                >
                  <Text style={styles.modeIcon}>🚌</Text>
                  <Text style={[styles.modeText, travelMode === 'shuttle' && styles.modeTextActive]}>
                    E-Shuttle
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.distanceBadge}>
                <Text style={styles.distanceText}>{currentRoute.totalDistanceMeters} m</Text>
              </View>
            </View>
          </View>

          {/* Interactive Map Section */}
          <View style={styles.mapSection}>
            <View style={styles.mapHeaderRow}>
              <View style={styles.mapBadge}>
                <Icon name="navigation" size={14} color={colors.primaryDark} style={{ marginRight: 4 }} />
                <Text style={styles.mapBadgeText}>Accurate Campus Pathway View</Text>
              </View>
              <Text style={styles.mapHintText}>Tap any block to set as destination</Text>
            </View>

            {/* Interactive Vector Campus Map */}
            <View style={styles.mapFrame}>
              <View style={styles.vectorMapWrapper}>
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 400 240"
                    style={{ width: '100%', height: '100%', backgroundColor: '#E2EFE4' }}
                  >
                    {/* Campus Grounds / Lawns */}
                    <rect x="0" y="0" width="400" height="240" fill="#E2EFE4" />

                    {/* Green Parks */}
                    <circle cx="200" cy="120" r="45" fill="#D4EAD7" opacity="0.8" />
                    <rect x="30" y="40" width="90" height="70" rx="8" fill="#D4EAD7" opacity="0.6" />
                    <rect x="280" y="140" width="100" height="80" rx="8" fill="#D4EAD7" opacity="0.6" />

                    {/* Central Spine Road (Palm Avenue) */}
                    <line x1="50" y1="220" x2="350" y2="40" stroke="#FFFFFF" strokeWidth="20" strokeLinecap="round" />
                    <line x1="50" y1="220" x2="350" y2="40" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="5,4" />

                    {/* North-South Cross Roads */}
                    <line x1="80" y1="70" x2="220" y2="220" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
                    <line x1="180" y1="30" x2="320" y2="180" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />

                    {/* Water Feature / Fountain */}
                    <ellipse cx="200" cy="120" rx="14" ry="10" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1" />

                    {/* Navigation Pathway Line */}
                    <path
                      d={pathD}
                      stroke="#F57C00"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="6,4"
                      fill="none"
                    />

                    {/* Render Interactive Building Footprints */}
                    {CAMPUS_BLOCKS.map((block) => {
                      const pos = getSvgCoordinates(block.coordinates);
                      const isOrigin = block.id === selectedOrigin.id;
                      const isDest = block.id === selectedDestination.id;

                      let fill = '#FFFFFF';
                      let stroke = '#94A3B8';
                      if (isOrigin) {
                        fill = '#ECFDF5';
                        stroke = '#10B981';
                      } else if (isDest) {
                        fill = '#FFF7ED';
                        stroke = '#F57C00';
                      }

                      return (
                        <g
                          key={block.id}
                          transform={`translate(${pos.x - 22}, ${pos.y - 12})`}
                          onClick={() => {
                            setSelectedDestination(block);
                            setDestText(block.name);
                            setIsNavigating(false);
                            setNavStepIndex(0);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <rect
                            width="44"
                            height="22"
                            rx="5"
                            fill={fill}
                            stroke={stroke}
                            strokeWidth={isOrigin || isDest ? '2.5' : '1.2'}
                          />
                          <text
                            x="22"
                            y="14"
                            textAnchor="middle"
                            fontSize="8"
                            fontWeight="bold"
                            fill={isDest ? '#C2410C' : isOrigin ? '#047857' : '#334155'}
                          >
                            {block.blockNumber.slice(0, 8)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Start Pin Beacon (Green) */}
                    <g transform={`translate(${svgOrigin.x}, ${svgOrigin.y})`}>
                      <circle cx="0" cy="0" r="10" fill="rgba(16, 185, 129, 0.3)" />
                      <circle cx="0" cy="0" r="5" fill="#10B981" />
                    </g>

                    {/* Destination Target Pulse Pin (Orange) */}
                    <g transform={`translate(${svgDest.x}, ${svgDest.y})`}>
                      <circle cx="0" cy="0" r="14" fill="rgba(245, 124, 0, 0.25)" />
                      <circle cx="0" cy="0" r="7" fill="#F57C00" />
                      <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
                    </g>

                    {/* Live Navigating Beacon */}
                    {isNavigating && (
                      <g
                        transform={`translate(${svgPathPoints[Math.min(navStepIndex, svgPathPoints.length - 1)].x}, ${
                          svgPathPoints[Math.min(navStepIndex, svgPathPoints.length - 1)].y
                        })`}
                      >
                        <circle cx="0" cy="0" r="12" fill="rgba(59, 130, 246, 0.4)" />
                        <circle cx="0" cy="0" r="6" fill="#2563EB" />
                        <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
                      </g>
                    )}
                  </svg>
                </View>
            </View>

            {/* Active Navigation Live Prompt Banner */}
            {isNavigating && (
              <View style={styles.activeNavBanner}>
                <View style={styles.activeNavPill}>
                  <Text style={styles.activeNavPillText}>LIVE WALKING GUIDANCE</Text>
                </View>
                <Text style={styles.activeNavStepText}>
                  {currentRoute.steps[navStepIndex]?.instruction || 'Arriving at destination...'}
                </Text>
              </View>
            )}

            {/* Navigation Controls */}
            <View style={styles.navControlsRow}>
              <Button
                title={isNavigating ? 'Stop Guidance' : 'Start Walking Guidance'}
                variant={isNavigating ? 'secondary' : 'primary'}
                icon={isNavigating ? 'pause' : 'play'}
                onPress={() => {
                  if (isNavigating) {
                    setIsNavigating(false);
                    setNavStepIndex(0);
                  } else {
                    setIsNavigating(true);
                    setNavStepIndex(0);
                  }
                }}
                style={{ flex: 1, marginRight: 8 }}
              />

              {onAskSenior && (
                <Button
                  title="Ask Senior"
                  variant="outline"
                  icon="message-circle"
                  onPress={() => {
                    onClose();
                    onAskSenior(`Hi! How do I walk from ${selectedOrigin.name} to ${selectedDestination.name}?`);
                  }}
                  style={{ flex: 1 }}
                />
              )}
            </View>
          </View>

          {/* Turn-by-Turn Directions Steps */}
          <View style={styles.directionsCard}>
            <TouchableOpacity
              onPress={() => setShowDirectionsList(!showDirectionsList)}
              style={styles.directionsHeader}
              activeOpacity={0.8}
            >
              <View style={styles.directionsTitleRow}>
                <Icon name="compass" size={18} color={colors.secondary} style={{ marginRight: 6 }} />
                <Text style={styles.directionsTitle}>Accurate Step-by-Step Directions</Text>
                <View style={styles.stepsBadge}>
                  <Text style={styles.stepsBadgeText}>{currentRoute.steps.length} steps</Text>
                </View>
              </View>
              <Icon
                name={showDirectionsList ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.secondary}
              />
            </TouchableOpacity>

            {showDirectionsList && (
              <View style={styles.stepsList}>
                {currentRoute.steps.map((step, idx) => (
                  <View key={idx} style={styles.stepItem}>
                    <View style={styles.stepNumberBadge}>
                      <Text style={styles.stepNumberText}>{idx + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepInstruction}>{step.instruction}</Text>
                      {step.distanceMeters > 0 && (
                        <Text style={styles.stepDistance}>{step.distanceMeters} meters</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Block Search & Directory Section */}
          <View style={styles.directorySection}>
            <View style={styles.directoryTitleRow}>
              <Icon name="search" size={18} color={colors.secondary} style={{ marginRight: 6 }} />
              <Text style={styles.directoryTitle}>Campus Blocks & Buildings Directory</Text>
              <Text style={styles.directoryCount}>({filteredBlocks.length})</Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchInputBox}>
              <Icon name="search" size={16} color={colors.textMuted} style={{ marginRight: 8 }} />
              <TextInput
                value={directorySearchQuery}
                onChangeText={setDirectorySearchQuery}
                placeholder="Search Block 38, Block 36, BH-4, Uni-Mall, Library..."
                placeholderTextColor={colors.textLight}
                style={styles.textInput}
                clearButtonMode="while-editing"
              />
              {directorySearchQuery ? (
                <TouchableOpacity onPress={() => setDirectorySearchQuery('')} style={{ padding: 4 }}>
                  <Icon name="x" size={14} color={colors.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Category Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterChipsRow}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.filterChip,
                    selectedCategory === cat && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedCategory === cat && styles.filterChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Search Results List */}
            <View style={styles.blocksList}>
              {filteredBlocks.map((block) => {
                const isSelectedDest = block.id === selectedDestination.id;
                const dist = calculateDistanceMeters(selectedOrigin.coordinates, block.coordinates);

                return (
                  <TouchableOpacity
                    key={block.id}
                    onPress={() => {
                      setSelectedDestination(block);
                      setDestText(block.name);
                      setIsNavigating(false);
                      setNavStepIndex(0);
                    }}
                    style={[
                      styles.blockItemCard,
                      isSelectedDest && styles.blockItemCardActive,
                    ]}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={`Navigate to ${block.name}`}
                  >
                    <View style={styles.blockItemTop}>
                      <View style={styles.blockNumberPill}>
                        <Text style={styles.blockNumberText}>{block.blockNumber}</Text>
                      </View>
                      <View style={styles.blockCatPill}>
                        <Text style={styles.blockCatText}>{block.category}</Text>
                      </View>
                      <Text style={styles.blockDistanceText}>{dist}m away</Text>
                    </View>

                    <Text style={styles.blockItemName}>{block.name}</Text>
                    <Text style={styles.blockItemDesc} numberOfLines={2}>
                      {block.description}
                    </Text>

                    {/* Facilities Tags */}
                    <View style={styles.facilitiesRow}>
                      {block.facilities.slice(0, 3).map((f, i) => (
                        <View key={i} style={styles.facilityTag}>
                          <Text style={styles.facilityTagText}>{f}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.cardActionRow}>
                      <Text style={styles.tapToRouteText}>
                        {isSelectedDest ? '✓ Active Destination' : 'Tap to Navigate Here →'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    height: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginRight: 6,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: typography.fontSizes.base,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  headerSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  gmapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  gmapsButtonText: {
    fontSize: 11,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  routingCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    marginBottom: spacing.md,
    ...shadows.card,
  },
  routingCardHeader: {
    marginBottom: 10,
  },
  gmapsPill: {
    backgroundColor: '#EA580C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  gmapsPillText: {
    fontSize: 9,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  routeHeaderSub: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  dualInputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconsColumn: {
    alignItems: 'center',
    width: 22,
    marginRight: 8,
    paddingVertical: 10,
  },
  originCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#059669',
  },
  routeDottedLine: {
    width: 2,
    height: 40,
    backgroundColor: '#CBD5E1',
    marginVertical: 4,
  },
  destSquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#F57C00',
    borderWidth: 2,
    borderColor: '#C2410C',
  },
  fieldsColumn: {
    flex: 1,
  },
  inputFieldWrapper: {
    position: 'relative',
    zIndex: 10,
  },
  inputFieldMicroLabel: {
    fontSize: 9,
    fontWeight: typography.fontWeights.bold,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  inputInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: 8,
    height: 38,
  },
  routeTextInput: {
    flex: 1,
    fontSize: typography.fontSizes.xs + 1,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    height: '100%',
    paddingVertical: 4,
  },
  inputClearBtn: {
    padding: 4,
  },
  autocompleteDropdown: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: borderRadius.sm,
    marginTop: 2,
    maxHeight: 180,
    zIndex: 99,
    ...shadows.card,
  },
  autocompleteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  autoPill: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  autoPillText: {
    fontSize: 9,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
  },
  autoItemName: {
    fontSize: 11,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
  },
  autoItemCat: {
    fontSize: 9,
    color: colors.textMuted,
  },
  swapColumn: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF7ED',
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickChipsWrapper: {
    marginBottom: 10,
  },
  quickChipsLabel: {
    fontSize: 9,
    fontWeight: typography.fontWeights.bold,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  quickChipsRow: {
    gap: 6,
  },
  quickChip: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickChipActive: {
    backgroundColor: '#FFF7ED',
    borderColor: colors.primary,
  },
  quickChipText: {
    fontSize: 10,
    color: colors.textDark,
    fontWeight: typography.fontWeights.medium,
  },
  quickChipTextActive: {
    color: colors.primaryDark,
    fontWeight: typography.fontWeights.bold,
  },
  travelModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 10,
  },
  modesContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeButtonActive: {
    backgroundColor: '#FFF7ED',
    borderColor: colors.primary,
  },
  modeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  modeText: {
    fontSize: 11,
    fontWeight: typography.fontWeights.medium,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  modeTextActive: {
    color: colors.primaryDark,
    fontWeight: typography.fontWeights.bold,
  },
  distanceBadge: {
    backgroundColor: colors.secondarySubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  mapSection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  mapHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapBadgeText: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  mapHintText: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  mapFrame: {
    height: 230,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D1E0D5',
    backgroundColor: '#E2EFE4',
    marginBottom: 10,
  },
  vectorMapWrapper: {
    width: '100%',
    height: '100%',
  },
  activeNavBanner: {
    backgroundColor: '#EEF2FF',
    borderRadius: borderRadius.sm,
    padding: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    marginBottom: 10,
  },
  activeNavPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#4338CA',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginBottom: 4,
  },
  activeNavPillText: {
    fontSize: 9,
    color: colors.white,
    fontWeight: typography.fontWeights.bold,
  },
  activeNavStepText: {
    fontSize: 12,
    fontWeight: typography.fontWeights.semiBold,
    color: '#1E1B4B',
    fontFamily: typography.fontFamily,
  },
  navControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  directionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  directionsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionsTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  stepsBadge: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.pill,
    marginLeft: 6,
  },
  stepsBadgeText: {
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
    color: colors.textMuted,
  },
  stepsList: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 8,
    gap: 8,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  stepNumberText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
  },
  stepInstruction: {
    fontSize: typography.fontSizes.xs + 1,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    lineHeight: 16,
  },
  stepDistance: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    marginTop: 2,
  },
  directorySection: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  directoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  directoryTitle: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  directoryCount: {
    fontSize: 11,
    color: colors.textMuted,
    marginLeft: 4,
  },
  searchInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: 10,
    height: 42,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    fontSize: typography.fontSizes.xs + 1,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    paddingVertical: 6,
  },
  filterChipsRow: {
    gap: 6,
    paddingBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: typography.fontWeights.medium,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  filterChipTextActive: {
    color: colors.white,
    fontWeight: typography.fontWeights.bold,
  },
  blocksList: {
    gap: 8,
    marginTop: 4,
  },
  blockItemCard: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  blockItemCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFF9ED',
  },
  blockItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  blockNumberPill: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  blockNumberText: {
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
  },
  blockCatPill: {
    backgroundColor: colors.white,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 'auto',
  },
  blockCatText: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: typography.fontWeights.medium,
  },
  blockDistanceText: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: typography.fontWeights.bold,
  },
  blockItemName: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
    marginBottom: 2,
  },
  blockItemDesc: {
    fontSize: 11,
    color: colors.textDark,
    lineHeight: 16,
    fontFamily: typography.fontFamily,
    marginBottom: 6,
  },
  facilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  facilityTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  facilityTagText: {
    fontSize: 9,
    color: '#475569',
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 6,
  },
  tapToRouteText: {
    fontSize: 11,
    fontWeight: typography.fontWeights.bold,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
  },
});
