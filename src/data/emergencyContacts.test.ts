import test from 'node:test';
import assert from 'node:assert/strict';
import { EMERGENCY_CONTACTS } from './emergencyContacts';

test('EMERGENCY_CONTACTS contains essential 24/7 emergency services', () => {
  assert.ok(EMERGENCY_CONTACTS.length >= 8, 'Should have comprehensive emergency contacts');

  // 1. Campus Security
  const security = EMERGENCY_CONTACTS.find((c) => c.id === 'em-security');
  assert.ok(security, 'Campus Security contact must exist');
  assert.ok(security.phoneNumber.includes('517100'), 'Security phone number should be accurate');
  assert.equal(security.category, 'Security');

  // 2. Ambulance & Hospital ER
  const ambulance = EMERGENCY_CONTACTS.find((c) => c.id === 'em-ambulance');
  assert.ok(ambulance, 'Ambulance contact must exist');
  assert.ok(ambulance.phoneNumber.includes('500108'), 'Ambulance phone number should be accurate');
  assert.equal(ambulance.category, 'Medical');

  // 3. Chief Warden & Hostel Wardens
  const chiefWarden = EMERGENCY_CONTACTS.find((c) => c.id === 'em-chief-warden');
  assert.ok(chiefWarden, 'Chief Warden contact must exist');
  assert.ok(chiefWarden.phoneNumber.includes('517000'), 'Chief Warden phone number should be accurate');
  assert.equal(chiefWarden.category, 'Hostel');

  // Boys Hostel and Girls Hostel warden contacts
  const bh4Warden = EMERGENCY_CONTACTS.find((c) => c.id === 'em-bh4-warden');
  assert.ok(bh4Warden, 'BH-4 Warden contact must exist');

  const gh3Warden = EMERGENCY_CONTACTS.find((c) => c.id === 'em-gh3-warden');
  assert.ok(gh3Warden, 'GH-3 Warden contact must exist');
});

test('All emergency contacts have valid phone numbers and required fields', () => {
  for (const contact of EMERGENCY_CONTACTS) {
    assert.ok(contact.id, 'Contact must have an id');
    assert.ok(contact.title, 'Contact must have a title');
    assert.ok(contact.phoneNumber, 'Contact must have a phone number');
    assert.ok(contact.phoneNumber.startsWith('+91'), 'Phone number should be formatted with country code');
    assert.ok(contact.category, 'Contact must have a category');
    assert.ok(contact.location, 'Contact must have a location');
  }
});
