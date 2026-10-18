import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { generateToken, requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { User, WorkerProfile } from '../../src/types';
import { PAKISTAN_PHONE_REGEX, formatPakistaniPhone } from '../../src/data/pakistanData';

const router = Router();

// Register Customer
router.post('/register-customer', (req, res): void => {
  try {
    const { name, email, password, phone, province, city, area } = req.body;

    if (!name || !email || !password || !phone) {
      res.status(400).json({ error: 'Please provide name, email, password, and Pakistani phone number.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }

    if (!PAKISTAN_PHONE_REGEX.test(phone)) {
      res.status(400).json({ error: 'Please enter a valid Pakistani phone number (e.g., 03001234567 or +923001234567).' });
      return;
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      res.status(400).json({ error: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const userId = `cust-${Date.now()}`;

    const newUser: User & { passwordHash: string } = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: formatPakistaniPhone(phone),
      role: 'customer',
      province: province || 'Punjab',
      city: city || 'Lahore',
      area: area || '',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0d9488`,
      createdAt: new Date().toISOString(),
      passwordHash,
    };

    db.createUser(newUser);

    const token = generateToken(newUser);
    const { passwordHash: _, ...userSafe } = newUser;

    // Send welcome notification
    db.createNotification({
      userId,
      title: 'Welcome to Kaam Wala Pakistan!',
      message: 'Explore verified local technicians, plumbers, electricians, and more near you.',
      type: 'system',
      link: '/search',
      read: false,
    });

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: userSafe,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error during registration.' });
  }
});

// Register Worker
router.post('/register-worker', (req, res): void => {
  try {
    const {
      name,
      email,
      password,
      phone,
      whatsapp,
      cnic,
      province,
      city,
      area,
      serviceCategory,
      subSkills,
      experienceYears,
      visitingFee,
      bio,
      workingHours,
    } = req.body;

    if (!name || !email || !password || !phone || !serviceCategory || !city) {
      res.status(400).json({ error: 'Please provide all required fields including skills and location.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }

    if (!PAKISTAN_PHONE_REGEX.test(phone)) {
      res.status(400).json({ error: 'Please enter a valid Pakistani phone number (e.g., 03001234567).' });
      return;
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      res.status(400).json({ error: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const userId = `user-work-${Date.now()}`;
    const workerProfileId = `worker-${Date.now()}`;

    const formattedPhone = formatPakistaniPhone(phone);
    const formattedWhatsapp = whatsapp ? formatPakistaniPhone(whatsapp).replace('+', '') : formattedPhone.replace('+', '');

    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0f766e`;

    const newUser: User & { passwordHash: string } = {
      id: userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: formattedPhone,
      role: 'worker',
      province: province || 'Punjab',
      city: city.trim(),
      area: area?.trim() || '',
      avatar: avatarUrl,
      workerProfileId,
      createdAt: new Date().toISOString(),
      passwordHash,
    };

    const newWorkerProfile: WorkerProfile = {
      id: workerProfileId,
      userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: formattedPhone,
      whatsapp: formattedWhatsapp,
      cnic: cnic ? cnic.trim() : '35201-0000000-1',
      province: province || 'Punjab',
      city: city.trim(),
      area: area?.trim() || '',
      serviceCategory,
      subSkills: Array.isArray(subSkills) ? subSkills : (subSkills ? [subSkills] : [serviceCategory]),
      experienceYears: Number(experienceYears) || 1,
      visitingFee: Number(visitingFee) || 500,
      hourlyRate: Number(visitingFee) ? Number(visitingFee) * 1.5 : 750,
      bio: bio?.trim() || `Experienced and dependable ${serviceCategory} serving ${city}. Committed to timely service and customer satisfaction.`,
      workingHours: workingHours?.trim() || '9:00 AM - 8:00 PM (Mon-Sat)',
      isAvailable: true,
      avatar: avatarUrl,
      approvalStatus: 'pending', // Starts in pending review
      ratingAverage: 0,
      totalReviews: 0,
      totalCompletedJobs: 0,
      createdAt: new Date().toISOString(),
    };

    db.createUser(newUser);
    db.createWorkerProfile(newWorkerProfile);

    // Notify admins about pending worker
    const adminUsers = db.getAllUsers().filter(u => u.role === 'admin');
    adminUsers.forEach(admin => {
      db.createNotification({
        userId: admin.id,
        title: 'New Worker Registration',
        message: `${name} (${serviceCategory}) registered in ${city} and is pending verification.`,
        type: 'approval',
        link: '/admin/workers',
        read: false,
      });
    });

    // Notify worker
    db.createNotification({
      userId,
      title: 'Profile Submitted for Approval',
      message: 'Your worker profile is pending administrative review. You will be notified once approved.',
      type: 'approval',
      link: '/worker/dashboard',
      read: false,
    });

    const token = generateToken(newUser);
    const { passwordHash: _, ...userSafe } = newUser;

    res.status(201).json({
      message: 'Worker registered successfully! Profile is currently pending admin approval.',
      token,
      user: userSafe,
      workerProfile: newWorkerProfile,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error during worker registration.' });
  }
});

// Login
router.post('/login', (req, res): void => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Please enter both email and password.' });
      return;
    }

    const userWithHash = (db as any).data.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (!userWithHash) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isValid = bcrypt.compareSync(password, userWithHash.passwordHash);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const { passwordHash, ...userSafe } = userWithHash;
    const token = generateToken(userSafe);

    let workerProfile: WorkerProfile | undefined = undefined;
    if (userSafe.role === 'worker') {
      workerProfile = db.getWorkerByUserId(userSafe.id);
    }

    res.json({
      message: 'Login successful',
      token,
      user: userSafe,
      workerProfile,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error during login.' });
  }
});

// Get current user profile & worker profile
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }
  let workerProfile: WorkerProfile | undefined = undefined;
  if (req.user.role === 'worker') {
    workerProfile = db.getWorkerByUserId(req.user.id);
  }
  res.json({
    user: req.user,
    workerProfile,
  });
});

// Update Profile
router.put('/update-profile', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { name, phone, city, province, area, avatar } = req.body;
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized.' });
      return;
    }

    const updatedUser = db.updateUser(req.user.id, {
      ...(name && { name: name.trim() }),
      ...(phone && { phone: formatPakistaniPhone(phone) }),
      ...(city && { city: city.trim() }),
      ...(province && { province }),
      ...(area !== undefined && { area: area.trim() }),
      ...(avatar && { avatar }),
    });

    // If worker, sync worker profile name/phone/location
    if (req.user.role === 'worker') {
      const worker = db.getWorkerByUserId(req.user.id);
      if (worker) {
        db.updateWorkerProfile(worker.id, {
          ...(name && { name: name.trim() }),
          ...(phone && { phone: formatPakistaniPhone(phone) }),
          ...(city && { city: city.trim() }),
          ...(province && { province }),
          ...(area !== undefined && { area: area.trim() }),
          ...(avatar && { avatar }),
        });
      }
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
      workerProfile: req.user.role === 'worker' ? db.getWorkerByUserId(req.user.id) : undefined,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating profile.' });
  }
});

export default router;
