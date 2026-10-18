import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { PAKISTAN_PROVINCES } from '../../src/data/pakistanData';

const router = Router();

// Get service categories
router.get('/categories', (req, res): void => {
  try {
    const categories = db.getCategories();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching categories.' });
  }
});

// Get Pakistan geographic data (Provinces, Cities, Areas)
router.get('/locations', (req, res): void => {
  try {
    res.json(PAKISTAN_PROVINCES);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching locations.' });
  }
});

// Public stats for home page (real data from database, no fake stats)
router.get('/stats', (req, res): void => {
  try {
    const stats = db.getAdminStats();
    res.json({
      approvedWorkers: stats.approvedWorkers,
      completedJobs: stats.completedBookings,
      totalReviews: stats.totalReviews,
      totalCities: 15,
      isFree: true,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching public stats.' });
  }
});

// Get customer's favorite workers
router.get('/favorites', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const favorites = db.getFavorites(req.user!.id);
    res.json(favorites);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching favorites.' });
  }
});

// Toggle favorite worker
router.post('/favorites/toggle', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { workerId } = req.body;
    if (!workerId) {
      res.status(400).json({ error: 'Worker ID is required.' });
      return;
    }

    const isFav = db.toggleFavorite(req.user!.id, workerId);
    res.json({
      isFavorite: isFav,
      message: isFav ? 'Added to favorites' : 'Removed from favorites',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error toggling favorite.' });
  }
});

// Check if a worker is favorited
router.get('/favorites/:workerId', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const isFav = db.isFavorite(req.user!.id, req.params.workerId);
    res.json({ isFavorite: isFav });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error checking favorite status.' });
  }
});

// Get current user's notifications
router.get('/notifications', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const notifications = db.getNotifications(req.user!.id);
    const unreadCount = notifications.filter(n => !n.read).length;
    res.json({
      notifications,
      unreadCount,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching notifications.' });
  }
});

// Mark notification as read
router.patch('/notifications/:id/read', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const notif = db.markNotificationAsRead(req.params.id, req.user!.id);
    if (!notif) {
      res.status(404).json({ error: 'Notification not found.' });
      return;
    }
    res.json({ success: true, notification: notif });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating notification.' });
  }
});

export default router;
