import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { Report } from '../../src/types';

const router = Router();

// Public search for approved workers
router.get('/', (req, res): void => {
  try {
    const {
      province,
      city,
      area,
      category,
      query,
      isAvailable,
      minRating,
    } = req.query;

    const workers = db.getWorkers({
      province: province as string,
      city: city as string,
      area: area as string,
      category: category as string,
      query: query as string,
      isAvailable: isAvailable !== undefined ? isAvailable === 'true' : undefined,
      minRating: minRating ? Number(minRating) : undefined,
      approvalStatus: 'approved',
    });

    res.json(workers);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching workers.' });
  }
});

// Get worker profile by ID
router.get('/:id', (req, res): void => {
  try {
    const worker = db.getWorkerById(req.params.id);
    if (!worker) {
      res.status(404).json({ error: 'Worker profile not found.' });
      return;
    }

    // Mask CNIC for public privacy (e.g. 35201-*****67-1)
    const safeWorker = {
      ...worker,
      cnic: worker.cnic ? `${worker.cnic.slice(0, 5)}-*****${worker.cnic.slice(10)}` : undefined,
    };

    const reviews = db.getReviewsByWorkerId(worker.id);

    res.json({
      worker: safeWorker,
      reviews,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching worker profile.' });
  }
});

// Get reviews for a worker
router.get('/:id/reviews', (req, res): void => {
  try {
    const reviews = db.getReviewsByWorkerId(req.params.id);
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching reviews.' });
  }
});

// Report a worker profile
router.post('/:id/report', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { reason, details } = req.body;
    if (!reason) {
      res.status(400).json({ error: 'Please specify the reason for reporting this profile.' });
      return;
    }

    const worker = db.getWorkerById(req.params.id);
    if (!worker) {
      res.status(404).json({ error: 'Worker profile not found.' });
      return;
    }

    const report: Report = {
      id: `rep-${Date.now()}`,
      reporterId: req.user!.id,
      reporterName: req.user!.name,
      reporterRole: req.user!.role,
      targetWorkerId: worker.id,
      targetWorkerName: worker.name,
      reason: reason.trim(),
      details: details ? details.trim() : '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    db.createReport(report);

    // Notify admins
    const admins = db.getAllUsers().filter(u => u.role === 'admin');
    admins.forEach(admin => {
      db.createNotification({
        userId: admin.id,
        title: 'New Complaint / Report',
        message: `${req.user!.name} filed a report against ${worker.name}: ${reason}`,
        type: 'system',
        link: '/admin/reports',
        read: false,
      });
    });

    res.status(201).json({
      message: 'Report submitted. Our moderation team will review it within 24 hours.',
      report,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error submitting report.' });
  }
});

// Worker: toggle availability
router.put('/me/availability', requireAuth, requireRole('worker'), (req: AuthenticatedRequest, res: Response): void => {
  try {
    const worker = db.getWorkerByUserId(req.user!.id);
    if (!worker) {
      res.status(404).json({ error: 'Worker profile not found.' });
      return;
    }

    const { isAvailable } = req.body;
    const updated = db.updateWorkerProfile(worker.id, {
      isAvailable: Boolean(isAvailable),
    });

    res.json({
      message: `Availability updated to ${isAvailable ? 'Available' : 'Busy / On Leave'}.`,
      worker: updated,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating availability.' });
  }
});

// Worker: update profile details
router.put('/me/profile', requireAuth, requireRole('worker'), (req: AuthenticatedRequest, res: Response): void => {
  try {
    const worker = db.getWorkerByUserId(req.user!.id);
    if (!worker) {
      res.status(404).json({ error: 'Worker profile not found.' });
      return;
    }

    const {
      serviceCategory,
      subSkills,
      experienceYears,
      visitingFee,
      hourlyRate,
      bio,
      workingHours,
      whatsapp,
      province,
      city,
      area,
    } = req.body;

    const updated = db.updateWorkerProfile(worker.id, {
      ...(serviceCategory && { serviceCategory }),
      ...(subSkills && { subSkills: Array.isArray(subSkills) ? subSkills : [subSkills] }),
      ...(experienceYears !== undefined && { experienceYears: Number(experienceYears) }),
      ...(visitingFee !== undefined && { visitingFee: Number(visitingFee) }),
      ...(hourlyRate !== undefined && { hourlyRate: Number(hourlyRate) }),
      ...(bio !== undefined && { bio: bio.trim() }),
      ...(workingHours !== undefined && { workingHours: workingHours.trim() }),
      ...(whatsapp && { whatsapp: whatsapp.replace(/[\s+-]/g, '') }),
      ...(province && { province }),
      ...(city && { city: city.trim() }),
      ...(area !== undefined && { area: area.trim() }),
    });

    res.json({
      message: 'Worker profile updated successfully.',
      worker: updated,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating worker profile.' });
  }
});

export default router;
