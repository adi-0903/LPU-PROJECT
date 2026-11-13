import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDistanceMeters,
  calculateTravelMinutes,
  searchCampusBlocks,
  generateCampusRoute,
  generateGoogleMapsUrl,
} from './pathfinding';
import { CAMPUS_BLOCKS } from '../data/campusBlocks';

test('calculateDistanceMeters calculates accurate distance between campus points', () => {
  const block34 = CAMPUS_BLOCKS.find((b) => b.id === 'block-34')!;
  const block32 = CAMPUS_BLOCKS.find((b) => b.id === 'block-32')!;

  const dist = calculateDistanceMeters(block34.coordinates, block32.coordinates);
  // Straight line between Block 34 & Block 32 is roughly 100-150 meters
  assert.ok(dist > 50 && dist < 250, `Distance should be realistic, got ${dist}m`);
});

test('calculateTravelMinutes returns reasonable walk, cycle and shuttle estimates', () => {
  const times = calculateTravelMinutes(720); // 720 meters
  assert.equal(times.walkMinutes, 10);
  assert.equal(times.cycleMinutes, 3);
  assert.ok(times.shuttleMinutes >= 2);
});

test('searchCampusBlocks finds blocks by number, name, or facility', () => {
  // Direct block 38 search test
  const queryBlock38 = searchCampusBlocks('block 38');
  assert.ok(queryBlock38.some((b) => b.id === 'block-38'), 'Should find Block 38 with "block 38"');

  const query38 = searchCampusBlocks('38');
  assert.ok(query38.some((b) => b.id === 'block-38'), 'Should find Block 38 with "38"');

  const queryB38 = searchCampusBlocks('b38');
  assert.ok(queryB38.some((b) => b.id === 'block-38'), 'Should find Block 38 with "b38"');

  const queryCse = searchCampusBlocks('cse');
  assert.ok(queryCse.some((b) => b.id === 'block-38'), 'Should find Block 38 with "cse"');

  const queryGdsc = searchCampusBlocks('gdsc');
  assert.ok(queryGdsc.some((b) => b.id === 'block-38'), 'Should find Block 38 with "gdsc"');

  const query34 = searchCampusBlocks('34');
  assert.ok(query34.some((b) => b.id === 'block-34'));

  const queryLibrary = searchCampusBlocks('library');
  assert.ok(queryLibrary.some((b) => b.id === 'block-34'));

  const queryHostel = searchCampusBlocks('BH-4', 'Hostels');
  assert.equal(queryHostel.length, 1);
  assert.equal(queryHostel[0].id, 'hostel-bh4');

  const queryHostelShorthand = searchCampusBlocks('bh4');
  assert.ok(queryHostelShorthand.some((b) => b.id === 'hostel-bh4'), 'Should find BH-4 with "bh4"');

  const queryCategory = searchCampusBlocks('', 'Food & Dining');
  assert.ok(queryCategory.some((b) => b.id === 'block-13'));
});

test('generateCampusRoute builds complete path with steps, distance, and duration', () => {
  const origin = CAMPUS_BLOCKS.find((b) => b.id === 'hostel-bh4')!;
  const destination = CAMPUS_BLOCKS.find((b) => b.id === 'block-34')!;

  const route = generateCampusRoute(origin, destination);
  assert.equal(route.origin.id, 'hostel-bh4');
  assert.equal(route.destination.id, 'block-34');
  assert.ok(route.totalDistanceMeters > 200);
  assert.ok(route.walkMinutes >= 3);
  assert.ok(route.steps.length >= 3);
  assert.ok(route.pathCoordinates.length >= 2);
});

test('generateCampusRoute handles identical origin and destination', () => {
  const block = CAMPUS_BLOCKS[0];
  const route = generateCampusRoute(block, block);
  assert.equal(route.totalDistanceMeters, 0);
  assert.equal(route.walkMinutes, 0);
  assert.equal(route.steps.length, 1);
});

test('generateGoogleMapsUrl constructs proper walking directions link', () => {
  const origin = { lat: 31.2565, lng: 75.7015 };
  const dest = { lat: 31.2542, lng: 75.7045 };
  const url = generateGoogleMapsUrl(origin, dest);
  assert.ok(url.includes('https://www.google.com/maps/dir/'));
  assert.ok(url.includes('travelmode=walking'));
  assert.ok(url.includes('31.2565,75.7015'));
});
