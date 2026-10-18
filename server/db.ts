import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, WorkerProfile, Booking, Review, Report, Notification, ServiceCategory } from '../src/types';
import { SERVICE_CATEGORIES } from '../src/data/pakistanData';

interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  workers: WorkerProfile[];
  bookings: Booking[];
  reviews: Review[];
  reports: Report[];
  notifications: Notification[];
  categories: ServiceCategory[];
  favorites: { userId: string; workerId: string }[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadOrSeed();
  }

  private loadOrSeed(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read existing database, initializing fresh seed:', err);
    }

    return this.createSeedData();
  }

  private save(): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  private createSeedData(): DatabaseSchema {
    const adminPasswordHash = bcrypt.hashSync('Admin@12345', 10);
    const workerPasswordHash = bcrypt.hashSync('Worker@12345', 10);
    const customerPasswordHash = bcrypt.hashSync('Customer@12345', 10);

    const users: (User & { passwordHash: string })[] = [
      // 1. Admin
      {
        id: 'user-admin-1',
        name: 'Mian Shaukat (Admin)',
        email: 'admin@kaamwala.pk',
        phone: '03001234567',
        role: 'admin',
        city: 'Islamabad',
        province: 'Islamabad Capital Territory',
        area: 'Blue Area',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
        createdAt: '2026-01-01T08:00:00.000Z',
        passwordHash: adminPasswordHash,
      },
      // 2. Customer
      {
        id: 'user-cust-1',
        name: 'Ahmed Khan',
        email: 'ahmed.khan@gmail.com',
        phone: '03219876543',
        role: 'customer',
        city: 'Lahore',
        province: 'Punjab',
        area: 'Gulberg',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        createdAt: '2026-01-10T10:00:00.000Z',
        passwordHash: customerPasswordHash,
      },
      // 3. Customer 2
      {
        id: 'user-cust-2',
        name: 'Fatima Zahra',
        email: 'fatima.zahra@gmail.com',
        phone: '03335551234',
        role: 'customer',
        city: 'Karachi',
        province: 'Sindh',
        area: 'Clifton',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        createdAt: '2026-01-12T11:00:00.000Z',
        passwordHash: customerPasswordHash,
      },
      // Workers
      {
        id: 'user-work-1',
        name: 'Muhammad Tariq',
        email: 'tariq.electrician@gmail.com',
        phone: '03014567890',
        role: 'worker',
        city: 'Lahore',
        province: 'Punjab',
        area: 'Gulberg',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        workerProfileId: 'worker-1',
        createdAt: '2026-01-05T09:00:00.000Z',
        passwordHash: workerPasswordHash,
      },
      {
        id: 'user-work-2',
        name: 'Zeeshan Ali',
        email: 'zeeshan.ac@gmail.com',
        phone: '03218765432',
        role: 'worker',
        city: 'Karachi',
        province: 'Sindh',
        area: 'Gulshan-e-Iqbal',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        workerProfileId: 'worker-2',
        createdAt: '2026-01-06T10:00:00.000Z',
        passwordHash: workerPasswordHash,
      },
      {
        id: 'user-work-3',
        name: 'Bilal Hussain Plumber',
        email: 'bilal.plumber@gmail.com',
        phone: '03456789012',
        role: 'worker',
        city: 'Islamabad',
        province: 'Islamabad Capital Territory',
        area: 'F-10',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
        workerProfileId: 'worker-3',
        createdAt: '2026-01-07T12:00:00.000Z',
        passwordHash: workerPasswordHash,
      },
      {
        id: 'user-work-4',
        name: 'Engr. Rashid Mehmood',
        email: 'rashid.solar@gmail.com',
        phone: '03123456789',
        role: 'worker',
        city: 'Rawalpindi',
        province: 'Punjab',
        area: 'Bahria Town',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
        workerProfileId: 'worker-4',
        createdAt: '2026-01-08T14:00:00.000Z',
        passwordHash: workerPasswordHash,
      },
      {
        id: 'user-work-5',
        name: 'Naveed Akhter',
        email: 'naveed.carpenter@gmail.com',
        phone: '03349988776',
        role: 'worker',
        city: 'Faisalabad',
        province: 'Punjab',
        area: 'D Ground',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
        workerProfileId: 'worker-5',
        createdAt: '2026-01-09T15:00:00.000Z',
        passwordHash: workerPasswordHash,
      },
      {
        id: 'user-work-6',
        name: 'Kamran Shah Ustad',
        email: 'kamran.bike@gmail.com',
        phone: '03009911223',
        role: 'worker',
        city: 'Peshawar',
        province: 'Khyber Pakhtunkhwa',
        area: 'Hayatabad',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
        workerProfileId: 'worker-6',
        createdAt: '2026-01-10T16:00:00.000Z',
        passwordHash: workerPasswordHash,
      },
      // Pending worker to test Admin verification flow
      {
        id: 'user-work-pending-1',
        name: 'Zahid Iqbal (Pending Worker)',
        email: 'zahid.pending@gmail.com',
        phone: '03058889900',
        role: 'worker',
        city: 'Lahore',
        province: 'Punjab',
        area: 'Johar Town',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        workerProfileId: 'worker-pending-1',
        createdAt: '2026-01-15T09:30:00.000Z',
        passwordHash: workerPasswordHash,
      }
    ];

    const workers: WorkerProfile[] = [
      {
        id: 'worker-1',
        userId: 'user-work-1',
        name: 'Muhammad Tariq',
        email: 'tariq.electrician@gmail.com',
        phone: '03014567890',
        whatsapp: '923014567890',
        cnic: '35201-1234567-1',
        province: 'Punjab',
        city: 'Lahore',
        area: 'Gulberg',
        serviceCategory: 'Electrician',
        subSkills: ['Complete House Wiring', 'UPS & Inverter Installation', 'Short Circuit Detection', 'Breaker Panel Fixing', 'Ceiling Fan Installation'],
        experienceYears: 8,
        visitingFee: 500,
        hourlyRate: 700,
        bio: 'Professional certified electrician with 8+ years experience working in Gulberg, DHA, and Model Town Lahore. Specializing in home wiring, load balancing, solar inverter setup, and emergency fault finding.',
        workingHours: '8:00 AM - 9:00 PM (Mon-Sat)',
        isAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
        approvalStatus: 'approved',
        ratingAverage: 4.9,
        totalReviews: 28,
        totalCompletedJobs: 64,
        createdAt: '2026-01-05T09:00:00.000Z',
      },
      {
        id: 'worker-2',
        userId: 'user-work-2',
        name: 'Zeeshan Ali',
        email: 'zeeshan.ac@gmail.com',
        phone: '03218765432',
        whatsapp: '923218765432',
        cnic: '42101-7654321-3',
        province: 'Sindh',
        city: 'Karachi',
        area: 'Gulshan-e-Iqbal',
        serviceCategory: 'AC & Fridge Technician',
        subSkills: ['DC Inverter Repair', 'R410/R32 Gas Charging', 'Master Chemical Wash', 'PCB Board Repair', 'Deep Freezer Compressor'],
        experienceYears: 10,
        visitingFee: 800,
        hourlyRate: 1200,
        bio: 'Master HVAC technician serving Karachi. Trained in all major inverter AC brands including Gree, Haier, Dawlance, and Kenwood. Guarantees neat vacuuming and honest gas pressure diagnosis.',
        workingHours: '9:00 AM - 10:00 PM (All 7 Days)',
        isAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
        approvalStatus: 'approved',
        ratingAverage: 4.8,
        totalReviews: 42,
        totalCompletedJobs: 112,
        createdAt: '2026-01-06T10:00:00.000Z',
      },
      {
        id: 'worker-3',
        userId: 'user-work-3',
        name: 'Bilal Hussain Plumber',
        email: 'bilal.plumber@gmail.com',
        phone: '03456789012',
        whatsapp: '923456789012',
        cnic: '61101-9876543-5',
        province: 'Islamabad Capital Territory',
        city: 'Islamabad',
        area: 'F-10',
        serviceCategory: 'Plumber',
        subSkills: ['PPRC & PVC Pipe Fitting', 'Geyser Installation & Descaling', 'Water Motor & Submersible Pump', 'Concealed Leakage Repair', 'Sanitary Ware'],
        experienceYears: 6,
        visitingFee: 600,
        hourlyRate: 800,
        bio: 'Expert plumber for Islamabad and Rawalpindi. Swift response for bathroom leaks, instantaneous gas geyser repairs, and high-pressure water pump issues. Clean, courteous service.',
        workingHours: '8:30 AM - 8:30 PM (Mon-Sat)',
        isAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
        approvalStatus: 'approved',
        ratingAverage: 4.9,
        totalReviews: 19,
        totalCompletedJobs: 45,
        createdAt: '2026-01-07T12:00:00.000Z',
      },
      {
        id: 'worker-4',
        userId: 'user-work-4',
        name: 'Engr. Rashid Mehmood',
        email: 'rashid.solar@gmail.com',
        phone: '03123456789',
        whatsapp: '923123456789',
        cnic: '37405-3344556-7',
        province: 'Punjab',
        city: 'Rawalpindi',
        area: 'Bahria Town',
        serviceCategory: 'Solar Panel Technician',
        subSkills: ['Hybrid Inverter Programming', 'Structure Angle Optimization', 'Lithium Battery Integration', 'Earthing & Surge Protection', 'Net Metering Prep'],
        experienceYears: 5,
        visitingFee: 1500,
        hourlyRate: 2000,
        bio: 'Diploma in Electrical Engineering with specialized training in Tier-1 solar systems (Longi, Canadian, Growatt, Inverex, Huawei). High-efficiency setups with safe DC wiring and breakers.',
        workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
        isAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
        approvalStatus: 'approved',
        ratingAverage: 5.0,
        totalReviews: 15,
        totalCompletedJobs: 38,
        createdAt: '2026-01-08T14:00:00.000Z',
      },
      {
        id: 'worker-5',
        userId: 'user-work-5',
        name: 'Naveed Akhter',
        email: 'naveed.carpenter@gmail.com',
        phone: '03349988776',
        whatsapp: '923349988776',
        cnic: '33100-5566778-9',
        province: 'Punjab',
        city: 'Faisalabad',
        area: 'D Ground',
        serviceCategory: 'Carpenter',
        subSkills: ['Door Lock Fitting', 'Modular Kitchen Cabinets', 'Wardrobe Sliding Channels', 'Bed Repair', 'Laminate Sheet Pasting'],
        experienceYears: 7,
        visitingFee: 500,
        hourlyRate: 700,
        bio: 'Skilled woodwork artisan in Faisalabad. Fast repairs for stuck doors, broken drawer channels, hydraulic hinges, and custom woodwork tailored to modern Pakistani homes.',
        workingHours: '9:00 AM - 8:00 PM (Mon-Sat)',
        isAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
        approvalStatus: 'approved',
        ratingAverage: 4.7,
        totalReviews: 12,
        totalCompletedJobs: 29,
        createdAt: '2026-01-09T15:00:00.000Z',
      },
      {
        id: 'worker-6',
        userId: 'user-work-6',
        name: 'Kamran Shah Ustad',
        email: 'kamran.bike@gmail.com',
        phone: '03009911223',
        whatsapp: '923009911223',
        cnic: '17301-1122334-5',
        province: 'Khyber Pakhtunkhwa',
        city: 'Peshawar',
        area: 'Hayatabad',
        serviceCategory: 'Bike Mechanic (Motorcycle)',
        subSkills: ['Honda 70/125 Complete Tuning', 'Tappet Adjustment', 'Carburetor Cleaning', 'Doorstep Breakdown Help', 'Brake Lining & Clutch Plates'],
        experienceYears: 4,
        visitingFee: 300,
        hourlyRate: 500,
        bio: 'Motorcycle technician providing doorstep bike tuning and emergency roadside breakdown repair in Hayatabad and Peshawar Cantt. Genuine parts advice and reasonable charges.',
        workingHours: '10:00 AM - 9:00 PM (All 7 Days)',
        isAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
        approvalStatus: 'approved',
        ratingAverage: 4.8,
        totalReviews: 18,
        totalCompletedJobs: 52,
        createdAt: '2026-01-10T16:00:00.000Z',
      },
      {
        id: 'worker-pending-1',
        userId: 'user-work-pending-1',
        name: 'Zahid Iqbal',
        email: 'zahid.pending@gmail.com',
        phone: '03058889900',
        whatsapp: '923058889900',
        cnic: '35202-9988776-3',
        province: 'Punjab',
        city: 'Lahore',
        area: 'Johar Town',
        serviceCategory: 'Electrician',
        subSkills: ['SMD Lighting', 'Main DB Breaker Wiring', 'Earthing Pit'],
        experienceYears: 3,
        visitingFee: 400,
        hourlyRate: 600,
        bio: 'Energetic technician recently registered on Kaam Wala Pakistan. Looking to offer honest and prompt electrical service across Johar Town and Faisal Town.',
        workingHours: '9:00 AM - 7:00 PM (Mon-Sat)',
        isAvailable: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
        approvalStatus: 'pending',
        ratingAverage: 0,
        totalReviews: 0,
        totalCompletedJobs: 0,
        createdAt: '2026-01-15T09:30:00.000Z',
      }
    ];

    const bookings: Booking[] = [
      {
        id: 'book-101',
        customerId: 'user-cust-1',
        customerName: 'Ahmed Khan',
        customerPhone: '03219876543',
        workerId: 'worker-1',
        workerName: 'Muhammad Tariq',
        workerCategory: 'Electrician',
        workerPhone: '03014567890',
        workerWhatsapp: '923014567890',
        serviceCategory: 'Electrician',
        description: 'Main circuit breaker keeps tripping when turning on AC in drawing room. Needs urgent checkup.',
        preferredDate: '2026-01-14',
        preferredTimeSlot: 'morning',
        address: 'House 42, Block H, Gulberg III',
        city: 'Lahore',
        area: 'Gulberg',
        isEmergency: true,
        status: 'completed',
        estimatedFee: 1200,
        hasReview: true,
        createdAt: '2026-01-13T14:20:00.000Z',
        updatedAt: '2026-01-14T12:00:00.000Z',
      },
      {
        id: 'book-102',
        customerId: 'user-cust-1',
        customerName: 'Ahmed Khan',
        customerPhone: '03219876543',
        workerId: 'worker-4',
        workerName: 'Engr. Rashid Mehmood',
        workerCategory: 'Solar Panel Technician',
        workerPhone: '03123456789',
        workerWhatsapp: '923123456789',
        serviceCategory: 'Solar Panel Technician',
        description: 'Need inspection of 5kW hybrid inverter and cleaning/checkup of 10 solar plates.',
        preferredDate: '2026-01-18',
        preferredTimeSlot: 'afternoon',
        address: 'Sector C, Bahria Town',
        city: 'Rawalpindi',
        area: 'Bahria Town',
        isEmergency: false,
        status: 'accepted',
        estimatedFee: 2500,
        hasReview: false,
        createdAt: '2026-01-16T11:00:00.000Z',
        updatedAt: '2026-01-16T11:45:00.000Z',
      },
      {
        id: 'book-103',
        customerId: 'user-cust-2',
        customerName: 'Fatima Zahra',
        customerPhone: '03335551234',
        workerId: 'worker-2',
        workerName: 'Zeeshan Ali',
        workerCategory: 'AC & Fridge Technician',
        workerPhone: '03218765432',
        workerWhatsapp: '923218765432',
        serviceCategory: 'AC & Fridge Technician',
        description: '1.5 Ton Gree inverter AC blowing warm air, outdoor unit fan is slow. Please bring gas kit.',
        preferredDate: '2026-01-19',
        preferredTimeSlot: 'morning',
        address: 'Block 4, Clifton',
        city: 'Karachi',
        area: 'Clifton',
        isEmergency: false,
        status: 'pending',
        estimatedFee: 1800,
        hasReview: false,
        createdAt: '2026-01-17T05:30:00.000Z',
        updatedAt: '2026-01-17T05:30:00.000Z',
      }
    ];

    const reviews: Review[] = [
      {
        id: 'rev-1',
        bookingId: 'book-101',
        workerId: 'worker-1',
        customerId: 'user-cust-1',
        customerName: 'Ahmed Khan',
        rating: 5,
        comment: 'Tariq bhai arrived within 30 minutes in Gulberg. Detected an overloaded breaker immediately and replaced it safely. Very honest rate and professional tools.',
        tags: ['Punctual', 'Fair Price', 'Polite & Professional', 'Expert Work'],
        createdAt: '2026-01-14T13:30:00.000Z',
      },
      {
        id: 'rev-2',
        bookingId: 'past-book-99',
        workerId: 'worker-1',
        customerId: 'user-cust-2',
        customerName: 'Sarmad Bhatti',
        rating: 5,
        comment: 'Fixed our home UPS wiring that two other mistris messed up. Highly recommended for any electrical work in Lahore.',
        tags: ['Expert Work', 'Reliable'],
        createdAt: '2026-01-08T18:00:00.000Z',
      },
      {
        id: 'rev-3',
        bookingId: 'past-book-98',
        workerId: 'worker-2',
        customerId: 'user-cust-2',
        customerName: 'Fatima Zahra',
        rating: 5,
        comment: 'Zeeshan did a chemical service on two inverter ACs in Clifton. Very neat work, covered our carpet and furniture properly.',
        tags: ['Clean Work', 'Fair Price', 'Punctual'],
        createdAt: '2026-01-09T16:20:00.000Z',
      }
    ];

    const reports: Report[] = [
      {
        id: 'rep-1',
        reporterId: 'user-cust-1',
        reporterName: 'Ahmed Khan',
        reporterRole: 'customer',
        targetWorkerId: 'worker-pending-1',
        targetWorkerName: 'Zahid Iqbal',
        reason: 'Incomplete information or duplicate listing check',
        details: 'Just noticed this new worker has similar contact info to an old listing. Please verify CNIC.',
        status: 'pending',
        createdAt: '2026-01-16T15:00:00.000Z',
      }
    ];

    const notifications: Notification[] = [
      {
        id: 'notif-1',
        userId: 'user-cust-1',
        title: 'Booking Accepted!',
        message: 'Engr. Rashid Mehmood accepted your Solar inspection booking for 18 Jan.',
        type: 'booking',
        link: '/customer/bookings',
        read: false,
        createdAt: '2026-01-16T11:45:00.000Z',
      },
      {
        id: 'notif-2',
        userId: 'user-work-2',
        title: 'New Booking Request',
        message: 'Fatima Zahra requested AC repair in Clifton for 19 Jan.',
        type: 'booking',
        link: '/worker/bookings',
        read: false,
        createdAt: '2026-01-17T05:30:00.000Z',
      },
      {
        id: 'notif-3',
        userId: 'user-admin-1',
        title: 'Pending Worker Approval',
        message: 'Zahid Iqbal submitted a new Electrician profile in Lahore for verification.',
        type: 'approval',
        link: '/admin/workers',
        read: false,
        createdAt: '2026-01-15T09:30:00.000Z',
      }
    ];

    const favorites = [
      { userId: 'user-cust-1', workerId: 'worker-1' },
      { userId: 'user-cust-1', workerId: 'worker-4' },
    ];

    const initialDb: DatabaseSchema = {
      users,
      workers,
      bookings,
      reviews,
      reports,
      notifications,
      categories: SERVICE_CATEGORIES,
      favorites,
    };

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving initial seed data:', e);
    }

    return initialDb;
  }

  // Users
  getUserByEmail(email: string) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id: string) {
    return this.data.users.find(u => u.id === id);
  }

  createUser(user: User & { passwordHash: string }) {
    this.data.users.push(user);
    this.save();
    return user;
  }

  updateUser(id: string, updates: Partial<User>) {
    const user = this.getUserById(id);
    if (!user) return null;
    Object.assign(user, updates);
    this.save();
    return user;
  }

  getAllUsers() {
    return this.data.users.map(({ passwordHash, ...rest }) => rest);
  }

  // Workers
  getWorkers(filters?: {
    province?: string;
    city?: string;
    area?: string;
    category?: string;
    query?: string;
    approvalStatus?: string;
    isAvailable?: boolean;
    minRating?: number;
  }) {
    let list = this.data.workers;

    if (filters) {
      if (filters.approvalStatus) {
        list = list.filter(w => w.approvalStatus === filters.approvalStatus);
      } else {
        // By default return approved workers for public search
        list = list.filter(w => w.approvalStatus === 'approved');
      }

      if (filters.province && filters.province !== 'All') {
        list = list.filter(w => w.province.toLowerCase() === filters.province!.toLowerCase());
      }

      if (filters.city && filters.city !== 'All') {
        list = list.filter(w => w.city.toLowerCase() === filters.city!.toLowerCase());
      }

      if (filters.area && filters.area !== 'All') {
        list = list.filter(w => w.area.toLowerCase().includes(filters.area!.toLowerCase()));
      }

      if (filters.category && filters.category !== 'All') {
        list = list.filter(w => w.serviceCategory.toLowerCase() === filters.category!.toLowerCase());
      }

      if (filters.minRating && filters.minRating > 0) {
        list = list.filter(w => w.ratingAverage >= filters.minRating!);
      }

      if (filters.isAvailable !== undefined) {
        list = list.filter(w => w.isAvailable === filters.isAvailable);
      }

      if (filters.query && filters.query.trim()) {
        const q = filters.query.toLowerCase().trim();
        list = list.filter(w =>
          w.name.toLowerCase().includes(q) ||
          w.serviceCategory.toLowerCase().includes(q) ||
          w.subSkills.some(s => s.toLowerCase().includes(q)) ||
          w.city.toLowerCase().includes(q) ||
          w.area.toLowerCase().includes(q) ||
          w.bio.toLowerCase().includes(q)
        );
      }
    }

    return list;
  }

  getWorkerById(id: string) {
    return this.data.workers.find(w => w.id === id);
  }

  getWorkerByUserId(userId: string) {
    return this.data.workers.find(w => w.userId === userId);
  }

  createWorkerProfile(profile: WorkerProfile) {
    this.data.workers.push(profile);
    this.save();
    return profile;
  }

  updateWorkerProfile(id: string, updates: Partial<WorkerProfile>) {
    const worker = this.getWorkerById(id);
    if (!worker) return null;
    Object.assign(worker, updates);
    this.save();
    return worker;
  }

  // Bookings
  getBookings(filter?: { customerId?: string; workerId?: string; status?: string }) {
    let list = this.data.bookings;
    if (filter) {
      if (filter.customerId) list = list.filter(b => b.customerId === filter.customerId);
      if (filter.workerId) list = list.filter(b => b.workerId === filter.workerId);
      if (filter.status && filter.status !== 'All') list = list.filter(b => b.status === filter.status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getBookingById(id: string) {
    return this.data.bookings.find(b => b.id === id);
  }

  createBooking(booking: Booking) {
    this.data.bookings.unshift(booking);
    this.save();
    return booking;
  }

  updateBooking(id: string, updates: Partial<Booking>) {
    const booking = this.getBookingById(id);
    if (!booking) return null;
    Object.assign(booking, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return booking;
  }

  // Reviews
  getReviewsByWorkerId(workerId: string) {
    return this.data.reviews
      .filter(r => r.workerId === workerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createReview(review: Review) {
    this.data.reviews.unshift(review);
    
    // Update worker average and counts
    const workerReviews = this.data.reviews.filter(r => r.workerId === review.workerId);
    const worker = this.getWorkerById(review.workerId);
    if (worker) {
      const totalScore = workerReviews.reduce((sum, r) => sum + r.rating, 0);
      worker.ratingAverage = Number((totalScore / workerReviews.length).toFixed(1));
      worker.totalReviews = workerReviews.length;
      worker.totalCompletedJobs = (worker.totalCompletedJobs || 0) + 1;
    }

    // Mark booking as reviewed
    const booking = this.getBookingById(review.bookingId);
    if (booking) {
      booking.hasReview = true;
    }

    this.save();
    return review;
  }

  // Reports
  createReport(report: Report) {
    this.data.reports.unshift(report);
    this.save();
    return report;
  }

  getReports(status?: string) {
    if (status && status !== 'All') {
      return this.data.reports.filter(r => r.status === status);
    }
    return this.data.reports;
  }

  updateReport(id: string, updates: Partial<Report>) {
    const report = this.data.reports.find(r => r.id === id);
    if (!report) return null;
    Object.assign(report, updates);
    this.save();
    return report;
  }

  // Notifications
  getNotifications(userId: string) {
    return this.data.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createNotification(notif: Omit<Notification, 'id' | 'createdAt'>) {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.notifications.unshift(newNotif);
    this.save();
    return newNotif;
  }

  markNotificationAsRead(id: string, userId: string) {
    const notif = this.data.notifications.find(n => n.id === id && n.userId === userId);
    if (notif) {
      notif.read = true;
      this.save();
    }
    return notif;
  }

  // Favorites
  getFavorites(userId: string) {
    const workerIds = this.data.favorites
      .filter(f => f.userId === userId)
      .map(f => f.workerId);
    return this.data.workers.filter(w => workerIds.includes(w.id));
  }

  toggleFavorite(userId: string, workerId: string): boolean {
    const idx = this.data.favorites.findIndex(f => f.userId === userId && f.workerId === workerId);
    if (idx >= 0) {
      this.data.favorites.splice(idx, 1);
      this.save();
      return false; // Removed
    } else {
      this.data.favorites.push({ userId, workerId });
      this.save();
      return true; // Added
    }
  }

  isFavorite(userId: string, workerId: string): boolean {
    return this.data.favorites.some(f => f.userId === userId && f.workerId === workerId);
  }

  // Categories
  getCategories() {
    return this.data.categories;
  }

  addCategory(cat: ServiceCategory) {
    this.data.categories.push(cat);
    this.save();
    return cat;
  }

  // Admin stats
  getAdminStats() {
    const totalUsers = this.data.users.length;
    const totalCustomers = this.data.users.filter(u => u.role === 'customer').length;
    const totalWorkers = this.data.workers.length;
    const pendingWorkers = this.data.workers.filter(w => w.approvalStatus === 'pending').length;
    const approvedWorkers = this.data.workers.filter(w => w.approvalStatus === 'approved').length;
    const rejectedWorkers = this.data.workers.filter(w => w.approvalStatus === 'rejected').length;
    const totalBookings = this.data.bookings.length;
    const completedBookings = this.data.bookings.filter(b => b.status === 'completed').length;
    const totalReviews = this.data.reviews.length;
    const pendingReports = this.data.reports.filter(r => r.status === 'pending').length;

    return {
      totalUsers,
      totalCustomers,
      totalWorkers,
      pendingWorkers,
      approvedWorkers,
      rejectedWorkers,
      totalBookings,
      completedBookings,
      totalReviews,
      pendingReports,
    };
  }
}

export const db = new Database();
