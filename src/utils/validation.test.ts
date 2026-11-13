import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateRegNumber,
  validatePassword,
  validateFullName,
  validateMobile,
  validateConfirmPassword,
} from './validation';

test('validateRegNumber requires 8 digits', () => {
  assert.equal(validateRegNumber('').valid, false);
  assert.equal(validateRegNumber('1234567').valid, false);
  assert.equal(validateRegNumber('123456789').valid, false);
  assert.equal(validateRegNumber('1250abcd').valid, false);
  assert.equal(validateRegNumber('12500000').valid, true);
});

test('validatePassword requires at least 6 characters', () => {
  assert.equal(validatePassword('').valid, false);
  assert.equal(validatePassword('12345').valid, false);
  assert.equal(validatePassword('123456').valid, true);
  assert.equal(validatePassword('Fresher@123').valid, true);
});

test('validateFullName requires non-empty name of reasonable length', () => {
  assert.equal(validateFullName('').valid, false);
  assert.equal(validateFullName('A').valid, false);
  assert.equal(validateFullName('Aman Singh').valid, true);
});

test('validateMobile requires 10 digits', () => {
  assert.equal(validateMobile('').valid, false);
  assert.equal(validateMobile('98765').valid, false);
  assert.equal(validateMobile('98765432101').valid, false);
  assert.equal(validateMobile('9876543210').valid, true);
});

test('validateConfirmPassword checks equality', () => {
  assert.equal(validateConfirmPassword('pass123', 'pass456').valid, false);
  assert.equal(validateConfirmPassword('pass123', 'pass123').valid, true);
});
