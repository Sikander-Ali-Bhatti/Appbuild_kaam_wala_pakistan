export type UserRole = 'customer' | 'worker' | 'admin';

export type WorkerApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  province?: string;
  city?: string;
  area?: string;
  avatar?: string;
  createdAt: string;
  workerProfileId?: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  cnic?: string; // Stored securely, masked on public views
  province: string;
  city: string;
  area: string;
  serviceCategory: string; // e.g. "Electrician"
  subSkills: string[];     // e.g. ["UPS Repair", "Wiring", "Breaker Panel"]
  experienceYears: number;
  visitingFee: number;     // in PKR
  hourlyRate?: number;     // in PKR
  bio: string;
  workingHours: string;    // e.g. "9:00 AM - 8:00 PM"
  isAvailable: boolean;
  avatar: string;
  approvalStatus: WorkerApprovalStatus;
  rejectionReason?: string;
  ratingAverage: number;
  totalReviews: number;
  totalCompletedJobs: number;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  nameUrdu: string;
  nameRomanUrdu: string;
  description: string;
  icon: string;
  popular: boolean;
  samplePriceRange: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  workerId: string;
  workerName: string;
  workerCategory: string;
  workerPhone: string;
  workerWhatsapp: string;
  serviceCategory: string;
  description: string;
  preferredDate: string;
  preferredTimeSlot: 'morning' | 'afternoon' | 'evening';
  address: string;
  city: string;
  area: string;
  isEmergency: boolean;
  status: BookingStatus;
  rejectionReason?: string;
  cancellationReason?: string;
  estimatedFee?: number;
  hasReview: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  workerId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  tags?: string[]; // e.g. ["Punctual", "Affordable", "Expert Work"]
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  targetWorkerId?: string;
  targetWorkerName?: string;
  bookingId?: string;
  reason: string;
  details: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'approval' | 'system' | 'review';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface ProvinceLocation {
  name: string;
  cities: {
    name: string;
    areas: string[];
  }[];
}

export interface FeatureFlags {
  enablePaidSubscriptions: boolean;
  enableCommissions: boolean;
  enableFeaturedFee: boolean;
  enablePaymentGateway: boolean;
}
