import { CampusBlock, Coordinates, NavigationRoute, RouteStep, BlockCategory } from '../types';
import { CAMPUS_BLOCKS } from '../data/campusBlocks';

/**
 * Calculates Haversine distance in meters between two coordinates
 */
export function calculateDistanceMeters(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (coord1.lat * Math.PI) / 180;
  const phi2 = (coord2.lat * Math.PI) / 180;
  const deltaPhi = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const deltaLambda = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Calculates travel times in minutes for different modes
 */
export function calculateTravelMinutes(distanceMeters: number): {
  walkMinutes: number;
  cycleMinutes: number;
  shuttleMinutes: number;
} {
  // Walking speed: ~1.2 m/s (~72 m/min) + 1 min buffer
  const walk = Math.max(1, Math.round(distanceMeters / 72));
  // Cycling speed: ~4 m/s (~240 m/min)
  const cycle = Math.max(1, Math.round(distanceMeters / 240));
  // Shuttle speed: ~5.5 m/s (~330 m/min)
  const shuttle = Math.max(2, Math.round(distanceMeters / 330) + 1);

  return {
    walkMinutes: walk,
    cycleMinutes: cycle,
    shuttleMinutes: shuttle,
  };
}

/**
 * Filters and searches campus blocks with fuzzy normalization and keyword aliases
 */
export function searchCampusBlocks(
  query: string,
  categoryFilter?: BlockCategory | 'All'
): CampusBlock[] {
  const cleanQuery = query.trim().toLowerCase();
  const strippedQuery = cleanQuery.replace(/[\s\-_.]/g, '');

  return CAMPUS_BLOCKS.filter((block) => {
    const matchesCategory =
      !categoryFilter || categoryFilter === 'All' || block.category === categoryFilter;

    if (!matchesCategory) return false;
    if (!cleanQuery) return true;

    const blockName = block.name.toLowerCase();
    const blockNum = block.blockNumber.toLowerCase();
    const strippedBlockNum = blockNum.replace(/[\s\-_.]/g, '');
    const strippedName = blockName.replace(/[\s\-_.]/g, '');
    const strippedId = block.id.toLowerCase().replace(/[\s\-_.]/g, '');

    // Prevent BH matching GH and vice versa
    if (strippedQuery.includes('bh') && strippedBlockNum.includes('gh')) {
      return false;
    }
    if (strippedQuery.includes('gh') && strippedBlockNum.includes('bh')) {
      return false;
    }

    // 1. Direct substring match
    if (
      blockName.includes(cleanQuery) ||
      blockNum.includes(cleanQuery) ||
      block.description.toLowerCase().includes(cleanQuery) ||
      block.facilities.some((f) => f.toLowerCase().includes(cleanQuery))
    ) {
      return true;
    }

    // 2. Stripped whitespace/hyphen matching (e.g. "block 38" -> "block38", "bh-4" -> "bh4")
    if (
      strippedBlockNum.includes(strippedQuery) ||
      strippedName.includes(strippedQuery) ||
      strippedId.includes(strippedQuery)
    ) {
      return true;
    }

    // 3. Number-only search (e.g. typing "38" matches Block 38)
    const isPureNumber = /^[0-9]+$/.test(cleanQuery);
    const blockDigits = block.blockNumber.replace(/[^0-9]/g, '');
    if (isPureNumber && blockDigits && cleanQuery === blockDigits) {
      return true;
    }

    // 4. Shorthand "b38" or "b 38" matching Block 38
    if (/^b[0-9]+$/.test(strippedQuery)) {
      const num = strippedQuery.slice(1);
      if (blockDigits === num) return true;
    }

    // 5. Semantic keyword aliases
    if ((cleanQuery.includes('cse') || cleanQuery.includes('gdsc') || cleanQuery.includes('coding')) && block.id === 'block-38') {
      return true;
    }
    if ((cleanQuery.includes('library') || cleanQuery.includes('books')) && block.id === 'block-34') {
      return true;
    }
    if ((cleanQuery.includes('admin') || cleanQuery.includes('fee') || cleanQuery.includes('auditorium')) && block.id === 'block-32') {
      return true;
    }
    if ((cleanQuery.includes('mall') || cleanQuery.includes('atm') || cleanQuery.includes('bank') || cleanQuery.includes('sbi')) && block.id === 'block-13') {
      return true;
    }
    if ((cleanQuery.includes('hospital') || cleanQuery.includes('doctor') || cleanQuery.includes('clinic') || cleanQuery.includes('medic')) && block.id === 'shanti-hospital') {
      return true;
    }
    if ((cleanQuery.includes('business') || cleanQuery.includes('mba')) && (block.id === 'block-55' || block.id === 'block-56')) {
      return true;
    }
    if (cleanQuery.includes('dsw') && block.id === 'block-30') {
      return true;
    }

    return false;
  });
}

/**
 * Key campus spine waypoints along arterial walkways
 */
const CENTRAL_FOUNTAIN: Coordinates = { lat: 31.2533, lng: 75.7035 };
const PALM_BOULEVARD_CROSS: Coordinates = { lat: 31.2525, lng: 75.7030 };
const WEST_RESIDENTIAL_CROSSING: Coordinates = { lat: 31.2555, lng: 75.7020 };
const EAST_ACADEMIC_CORRIDOR: Coordinates = { lat: 31.2545, lng: 75.7045 };
const NORTH_EAST_TECH_JUNCTION: Coordinates = { lat: 31.2553, lng: 75.7052 };

/**
 * Generates an intelligent, realistic walking path between any two campus blocks in LPU
 */
export function generateCampusRoute(
  origin: CampusBlock,
  destination: CampusBlock
): NavigationRoute {
  // If origin and destination are identical
  if (origin.id === destination.id) {
    return {
      origin,
      destination,
      pathCoordinates: [origin.coordinates],
      totalDistanceMeters: 0,
      walkMinutes: 0,
      cycleMinutes: 0,
      steps: [
        {
          instruction: `You are already at ${origin.name}.`,
          distanceMeters: 0,
          durationSeconds: 0,
        },
      ],
    };
  }

  // Build waypoint path
  const path: Coordinates[] = [origin.coordinates];
  const steps: RouteStep[] = [];

  // Step 1: Depart origin
  steps.push({
    instruction: `Exit ${origin.name} via ${origin.entranceLocation || 'the main portico'}.`,
    distanceMeters: 45,
    durationSeconds: 35,
    landmark: origin.name,
  });

  // Calculate mid-waypoint routing
  const midWaypoints: Coordinates[] = [];

  // Origin is in BH Hostel zone (West/North-West)
  if (origin.coordinates.lng < 75.7025 && origin.coordinates.lat > 31.2550) {
    midWaypoints.push(WEST_RESIDENTIAL_CROSSING);
  }

  // Cross Central Spine
  midWaypoints.push(CENTRAL_FOUNTAIN);

  // If destination is in the East Academic Spine (Block 36, 37, 38, 55, 56)
  if (destination.coordinates.lng > 75.7040) {
    midWaypoints.push(EAST_ACADEMIC_CORRIDOR);
    if (destination.id === 'block-38' || destination.id === 'block-37' || destination.id === 'block-55') {
      midWaypoints.push(NORTH_EAST_TECH_JUNCTION);
    }
  }

  // If destination is in South zone (Gate 1, Hospital, GH Hostels)
  if (destination.coordinates.lat < 31.2525) {
    midWaypoints.push(PALM_BOULEVARD_CROSS);
  }

  // Append mid waypoints avoiding adjacent duplicates
  for (const wp of midWaypoints) {
    const last = path[path.length - 1];
    if (calculateDistanceMeters(last, wp) > 40) {
      path.push(wp);
    }
  }

  // Final destination point
  path.push(destination.coordinates);

  // Calculate realistic distance following paths (~1.25x straight line)
  const straightDist = calculateDistanceMeters(origin.coordinates, destination.coordinates);
  const totalDistanceMeters = Math.max(65, Math.round(straightDist * 1.25));

  const { walkMinutes, cycleMinutes } = calculateTravelMinutes(totalDistanceMeters);

  // Step 2: Main walkway step
  steps.push({
    instruction: `Walk along the central boulevard past Central Lawns and Water Fountain towards ${destination.blockNumber}.`,
    distanceMeters: Math.round(totalDistanceMeters * 0.65),
    durationSeconds: Math.max(60, Math.round(walkMinutes * 38)),
    landmark: 'Central Palm Boulevard',
  });

  // Step 3: Turn and approach
  steps.push({
    instruction: `Follow directional signage pointing directly to ${destination.blockNumber}.`,
    distanceMeters: Math.round(totalDistanceMeters * 0.25),
    durationSeconds: Math.max(30, Math.round(walkMinutes * 16)),
    landmark: destination.blockNumber,
  });

  // Step 4: Arrive
  steps.push({
    instruction: `Arrive at ${destination.name}. Enter through ${destination.entranceLocation || 'the main entrance'}.`,
    distanceMeters: Math.round(totalDistanceMeters * 0.1),
    durationSeconds: 20,
    landmark: destination.name,
  });

  return {
    origin,
    destination,
    pathCoordinates: path,
    totalDistanceMeters,
    walkMinutes,
    cycleMinutes,
    steps,
  };
}

/**
 * Builds standard Google Maps direct directions URL
 */
export function generateGoogleMapsUrl(origin: Coordinates, destination: Coordinates): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=walking`;
}
