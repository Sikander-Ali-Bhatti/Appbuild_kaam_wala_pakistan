import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth';
import { WorkerApprovalStatus } from '../../src/types';

const router = Router();

// Protect all admin routes
router.use(requireAuth, requireRole('admin'));

// Admin Dashboard Overview Stats
router.get('/stats', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const stats = db.getAdminStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching admin stats.' });
  }
});

// Get all workers for admin management (filterable by status)
router.get('/workers', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { status, query } = req.query;
    let workers = db.getWorkers({
      approvalStatus: status as string,
      query: query as string,
    });

    if (!status || status === 'All') {
      // Return ALL workers including pending, approved, rejected, suspended
      workers = (db as any).data.workers;
      if (query) {
        const q = (query as string).toLowerCase().trim();
        workers = workers.filter((w: any) =>
          w.name.toLowerCase().includes(q) ||
          w.phone.includes(q) ||
          w.city.toLowerCase().includes(q) ||
          w.serviceCategory.toLowerCase().includes(q)
        );
      }
    }

    res.json(workers);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching workers.' });
  }
});

// Approve or Reject worker profile
router.patch('/workers/:id/approval', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { status, reason } = req.body as { status: WorkerApprovalStatus; reason?: string };
    const worker = db.getWorkerById(req.params.id);

    if (!worker) {
      res.status(404).json({ error: 'Worker not found.' });
      return;
    }

    if (!['approved', 'rejected'].includes(status)) {
      res.status(400).json({ error: 'Status must be either "approved" or "rejected".' });
      return;
    }

    const updated = db.updateWorkerProfile(worker.id, {
      approvalStatus: status,
      rejectionReason: status === 'rejected' ? (reason || 'Information provided did not meet verification standards.') : undefined,
    });

    // Notify the worker
    db.createNotification({
      userId: worker.userId,
      title: status === 'approved' ? 'Profile Approved! 🎉' : 'Profile Verification Update',
      message: status === 'approved'
        ? 'Congratulations! Your profile is now live on Kaam Wala Pakistan. Customers can now discover and book your services.'
        : `Your profile was not approved: ${reason || 'Incomplete details'}. You may update your profile and resubmit.`,
      type: 'approval',
      link: '/worker/dashboard',
      read: false,
    });

    res.json({
      message: `Worker profile has been marked as ${status}.`,
      worker: updated,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating worker approval status.' });
  }
});

// Suspend or Reactivate worker profile
router.patch('/workers/:id/status', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { action } = req.body as { action: 'suspend' | 'reactivate' };
    const worker = db.getWorkerById(req.params.id);

    if (!worker) {
      res.status(404).json({ error: 'Worker not found.' });
      return;
    }

    const newStatus: WorkerApprovalStatus = action === 'suspend' ? 'suspended' : 'approved';
    const updated = db.updateWorkerProfile(worker.id, {
      approvalStatus: newStatus,
    });

    db.createNotification({
      userId: worker.userId,
      title: action === 'suspend' ? 'Account Suspended' : 'Account Reactivated',
      message: action === 'suspend'
        ? 'Your worker profile has been temporarily suspended by an administrator due to complaints or policy review.'
        : 'Your worker profile has been reactivated. You are now visible to customers.',
      type: 'approval',
      link: '/worker/dashboard',
      read: false,
    });

    res.json({
      message: `Worker account ${action === 'suspend' ? 'suspended' : 'reactivated'} successfully.`,
      worker: updated,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating status.' });
  }
});

// Get all users
router.get('/users', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const users = db.getAllUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching users.' });
  }
});

// Get all platform bookings
router.get('/bookings', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const bookings = db.getBookings();
    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching bookings.' });
  }
});

// Get complaints and reports
router.get('/reports', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const reports = db.getReports();
    res.json(reports);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching reports.' });
  }
});

// Resolve or Dismiss a report
router.patch('/reports/:id', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { status, adminNotes } = req.body;
    const report = db.updateReport(req.params.id, {
      ...(status && { status }),
      ...(adminNotes && { adminNotes }),
    });

    if (!report) {
      res.status(404).json({ error: 'Report not found.' });
      return;
    }

    res.json({
      message: `Report marked as ${status}.`,
      report,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating report.' });
  }
});

// Add new service category
router.post('/categories', (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id, name, nameUrdu, nameRomanUrdu, description, icon, samplePriceRange } = req.body;
    if (!name || !nameUrdu) {
      res.status(400).json({ error: 'Name in English and Urdu are required.' });
      return;
    }

    const newCategory = {
      id: id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      nameUrdu,
      nameRomanUrdu: nameRomanUrdu || name,
      description: description || '',
      icon: icon || 'Wrench',
      popular: false,
      samplePriceRange: samplePriceRange || 'Rs. 500 - 1,500',
    };

    db.addCategory(newCategory);

    res.status(201).json({
      message: 'Category added successfully.',
      category: newCategory,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error adding category.' });
  }
});

export default router;
