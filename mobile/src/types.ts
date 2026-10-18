export interface WorkerProfile {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  province: string;
  city: string;
  area: string;
  serviceCategory: string;
  subSkills: string[];
  experienceYears: number;
  visitingFee: number;
  bio: string;
  workingHours: string;
  isAvailable: boolean;
  avatar: string;
  ratingAverage: number;
  totalReviews: number;
  totalCompletedJobs: number;
}

export interface Booking {
  id: string;
  workerName: string;
  serviceCategory: string;
  description: string;
  preferredDate: string;
  preferredTimeSlot: string;
  address: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  estimatedFee?: number;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  nameUrdu: string;
  description: string;
  samplePriceRange: string;
}
