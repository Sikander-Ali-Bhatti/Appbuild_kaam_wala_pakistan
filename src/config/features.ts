/**
 * Kaam Wala Pakistan — Feature & Business Model Configuration
 * 
 * In accordance with Phase 1 & 2 requirements:
 * The platform is 100% FREE for both workers and customers.
 * - No paid subscriptions
 * - No commissions taken from worker earnings
 * - No payment gateway fee
 * - No premium profile charges
 * 
 * Future monetization modules can be toggled on here only when authorized.
 */
import { FeatureFlags } from '../types';

export const PLATFORM_CONFIG = {
  appName: 'Kaam Wala Pakistan',
  tagline: 'Pakistan Ka Apna Hunarmand Network',
  country: 'Pakistan',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  supportPhone: '+92 300 1234567',
  supportWhatsapp: '923001234567',
  supportEmail: 'support@kaamwala.pk',
  freeNotice: '100% Free Platform: Zero commission, no registration fees, direct cash/easypaisa/jazzcash between worker and customer.',
  
  // Future monetization flags - KEEP DISABLED INITIALLY
  features: {
    enablePaidSubscriptions: false,
    enableCommissions: false,
    enableFeaturedFee: false,
    enablePaymentGateway: false,
  } as FeatureFlags,
};
