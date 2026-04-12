import { randomBytes } from 'crypto';

export function generateDownloadToken(): string {
  return randomBytes(32).toString('hex');
}

export function getTokenExpiry(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7); // 7 days from now
  return expiry;
}
