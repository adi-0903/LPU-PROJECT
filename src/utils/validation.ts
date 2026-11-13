export const DEMO_USER = {
  regNumber: '12500000',
  password: 'Fresher@123',
  name: 'Aman',
  course: 'B.Tech' as const,
  residence: 'Hostel' as const,
};

export function validateRegNumber(regNumber: string): { valid: boolean; error?: string } {
  const trimmed = regNumber.trim();
  if (!trimmed) {
    return { valid: false, error: 'Registration number is required' };
  }
  if (!/^\d+$/.test(trimmed)) {
    return { valid: false, error: 'Registration number must contain digits only' };
  }
  if (trimmed.length !== 8) {
    return { valid: false, error: 'Registration number must be exactly 8 digits' };
  }
  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  return { valid: true };
}

export function validateFullName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, error: 'Full name is required' };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: 'Please enter a valid full name' };
  }
  return { valid: true };
}

export function validateMobile(mobile: string): { valid: boolean; error?: string } {
  const trimmed = mobile.trim();
  if (!trimmed) {
    return { valid: false, error: 'Mobile number is required' };
  }
  if (!/^\d{10}$/.test(trimmed)) {
    return { valid: false, error: 'Mobile number must be 10 digits' };
  }
  return { valid: true };
}

export function validateConfirmPassword(password: string, confirm: string): { valid: boolean; error?: string } {
  if (!confirm) {
    return { valid: false, error: 'Please confirm your password' };
  }
  if (password !== confirm) {
    return { valid: false, error: 'Passwords do not match' };
  }
  return { valid: true };
}
