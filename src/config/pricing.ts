export const PRICING = {
  BASE_JOB_POSTING: 2900, // $29.00 in cents
  VERIFICATION: {
    '24h': 1900, // $19.00
    '3d': 2900, // $29.00
    '1w': 4900, // $49.00
    '1m': 9900, // $99.00
  }
} as const;

export const formatPrice = (cents: number): string => {
  return `$${(cents / 100).toFixed(2)}`;
};

export const calculateTotalPrice = (isVerified: boolean, verificationPeriod: string): number => {
  let total = PRICING.BASE_JOB_POSTING;
  
  if (isVerified && verificationPeriod) {
    total += PRICING.VERIFICATION[verificationPeriod as keyof typeof PRICING.VERIFICATION];
  }
  
  return total;
};