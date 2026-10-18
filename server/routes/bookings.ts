import { Router, Response } from 'express';
import { db } from '../db';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { Booking, BookingStatus, Review } from '../../src/types';

const router = Router();

// Create a booking (Customer only)
router.post('/', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const {
      workerId,
      description,
      preferredDate,
      preferredTimeSlot,
      address,
      city,
      area,
      isEmergency,
    } = req.body;

    if (!workerId || !description || !preferredDate || !address) {
      res.status(400).json({ error: 'Please provide workerId, description, preferred date, and address.' });
      return;
    }

    const worker = db.getWorkerById(workerId);
    if (!worker) {
      res.status(404).json({ error: 'Worker not found.' });
      return;
    }

    if (worker.approvalStatus !== 'approved') {
      res.status(400).json({ error: 'Bookings can only be submitted for approved workers.' });
      return;
    }

    const bookingId = `book-${Date.now()}`;
    const newBooking: Booking = {
      id: bookingId,
      customerId: req.user!.id,
      customerName: req.user!.name,
      customerPhone: req.user!.phone,
      workerId: worker.id,
      workerName: worker.name,
      workerCategory: worker.serviceCategory,
      workerPhone: worker.phone,
      workerWhatsapp: worker.whatsapp,
      serviceCategory: worker.serviceCategory,
      description: description.trim(),
      preferredDate,
      preferredTimeSlot: preferredTimeSlot || 'morning',
      address: address.trim(),
      city: city || worker.city,
      area: area || worker.area,
      isEmergency: Boolean(isEmergency),
      status: 'pending',
      estimatedFee: worker.visitingFee,
      hasReview: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.createBooking(newBooking);

    // Notify the worker
    db.createNotification({
      userId: worker.userId,
      title: 'New Booking Request Received',
      message: `${req.user!.name} requested ${worker.serviceCategory} on ${preferredDate} (${preferredTimeSlot || 'morning'}).`,
      type: 'booking',
      link: '/worker/bookings',
      read: false,
    });

    // Notify customer
    db.createNotification({
      userId: req.user!.id,
      title: 'Booking Request Sent',
      message: `Your request has been sent to ${worker.name}. They will review and confirm shortly.`,
      type: 'booking',
      link: '/customer/bookings',
      read: false,
    });

    res.status(201).json({
      message: 'Booking request sent successfully!',
      booking: newBooking,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error creating booking.' });
  }
});

// List bookings for current user (Customer or Worker)
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { status } = req.query;
    let bookings: Booking[] = [];

    if (req.user!.role === 'customer') {
      bookings = db.getBookings({
        customerId: req.user!.id,
        status: status as string,
      });
    } else if (req.user!.role === 'worker') {
      const worker = db.getWorkerByUserId(req.user!.id);
      if (!worker) {
        res.status(404).json({ error: 'Worker profile not found.' });
        return;
      }
      bookings = db.getBookings({
        workerId: worker.id,
        status: status as string,
      });
    } else if (req.user!.role === 'admin') {
      bookings = db.getBookings({
        status: status as string,
      });
    }

    res.json(bookings);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching bookings.' });
  }
});

// Get single booking
router.get('/:id', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const booking = db.getBookingById(req.params.id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found.' });
      return;
    }

    const worker = db.getWorkerByUserId(req.user!.id);
    const isOwner =
      req.user!.id === booking.customerId ||
      (worker && worker.id === booking.workerId) ||
      req.user!.role === 'admin';

    if (!isOwner) {
      res.status(403).json({ error: 'Forbidden: You cannot view this booking.' });
      return;
    }

    res.json(booking);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error fetching booking.' });
  }
});

// Update booking status (Accept, Reject, Cancel, Complete)
router.patch('/:id/status', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { status, reason } = req.body as { status: BookingStatus; reason?: string };
    const booking = db.getBookingById(req.params.id);

    if (!booking) {
      res.status(404).json({ error: 'Booking not found.' });
      return;
    }

    const worker = db.getWorkerByUserId(req.user!.id);
    const isCustomer = req.user!.id === booking.customerId;
    const isWorker = worker && worker.id === booking.workerId;
    const isAdmin = req.user!.role === 'admin';

    if (!isCustomer && !isWorker && !isAdmin) {
      res.status(403).json({ error: 'Forbidden: You cannot modify this booking.' });
      return;
    }

    // Role-specific status transitions
    if (status === 'accepted' || status === 'rejected') {
      if (!isWorker && !isAdmin) {
        res.status(403).json({ error: 'Only the assigned worker or admin can accept or reject bookings.' });
        return;
      }
      if (booking.status !== 'pending' && !isAdmin) {
        res.status(400).json({ error: `Cannot ${status} a booking that is currently ${booking.status}.` });
        return;
      }
    }

    if (status === 'cancelled') {
      if (!isCustomer && !isAdmin) {
        res.status(403).json({ error: 'Only the customer can cancel their booking.' });
        return;
      }
      if (booking.status === 'completed') {
        res.status(400).json({ error: 'Completed bookings cannot be cancelled.' });
        return;
      }
    }

    if (status === 'completed') {
      // Either worker or customer or admin can mark as completed
      if (booking.status !== 'accepted' && !isAdmin) {
        res.status(400).json({ error: 'Only accepted bookings can be marked as completed.' });
        return;
      }
    }

    const updates: Partial<Booking> = { status };
    if (status === 'rejected' && reason) updates.rejectionReason = reason;
    if (status === 'cancelled' && reason) updates.cancellationReason = reason;

    const updated = db.updateBooking(booking.id, updates);

    // Send notifications based on transition
    if (status === 'accepted') {
      db.createNotification({
        userId: booking.customerId,
        title: 'Booking Confirmed!',
        message: `${booking.workerName} accepted your booking for ${booking.preferredDate}. You can contact them directly.`,
        type: 'booking',
        link: '/customer/bookings',
        read: false,
      });
    } else if (status === 'rejected') {
      db.createNotification({
        userId: booking.customerId,
        title: 'Booking Declined',
        message: `${booking.workerName} could not take your request${reason ? ': ' + reason : '.'}`,
        type: 'booking',
        link: '/customer/bookings',
        read: false,
      });
    } else if (status === 'completed') {
      db.createNotification({
        userId: booking.customerId,
        title: 'Job Completed — Leave a Review',
        message: `Your job with ${booking.workerName} is completed. Please rate their service!`,
        type: 'review',
        link: '/customer/bookings',
        read: false,
      });
      // Increment completed jobs on worker
      const currentWorker = db.getWorkerById(booking.workerId);
      if (currentWorker) {
        db.updateWorkerProfile(currentWorker.id, {
          totalCompletedJobs: (currentWorker.totalCompletedJobs || 0) + 1,
        });
      }
    } else if (status === 'cancelled') {
      const targetWorker = db.getWorkerById(booking.workerId);
      if (targetWorker) {
        db.createNotification({
          userId: targetWorker.userId,
          title: 'Booking Cancelled',
          message: `${booking.customerName} cancelled their booking for ${booking.preferredDate}.`,
          type: 'booking',
          link: '/worker/bookings',
          read: false,
        });
      }
    }

    res.json({
      message: `Booking status updated to ${status}.`,
      booking: updated,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error updating booking.' });
  }
});

// Leave a review for completed booking (Customer only)
router.post('/:id/review', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { rating, comment, tags } = req.body;
    const booking = db.getBookingById(req.params.id);

    if (!booking) {
      res.status(404).json({ error: 'Booking not found.' });
      return;
    }

    if (booking.customerId !== req.user!.id) {
      res.status(403).json({ error: 'Only the customer who made this booking can review it.' });
      return;
    }

    if (booking.status !== 'completed') {
      res.status(400).json({ error: 'Reviews are only allowed after a job has been completed.' });
      return;
    }

    if (booking.hasReview) {
      res.status(400).json({ error: 'You have already submitted a review for this booking.' });
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ error: 'Please provide a valid rating between 1 and 5 stars.' });
      return;
    }

    const review: Review = {
      id: `rev-${Date.now()}`,
      bookingId: booking.id,
      workerId: booking.workerId,
      customerId: req.user!.id,
      customerName: req.user!.name,
      rating: Number(rating),
      comment: comment ? comment.trim() : 'Service completed successfully.',
      tags: Array.isArray(tags) ? tags : [],
      createdAt: new Date().toISOString(),
    };

    db.createReview(review);

    // Notify the worker
    const worker = db.getWorkerById(booking.workerId);
    if (worker) {
      db.createNotification({
        userId: worker.userId,
        title: 'New Customer Review!',
        message: `${req.user!.name} gave you a ${rating}-star rating: "${review.comment.slice(0, 50)}..."`,
        type: 'review',
        link: '/worker/reviews',
        read: false,
      });
    }

    res.status(201).json({
      message: 'Thank you! Your review has been published.',
      review,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error submitting review.' });
  }
});

export default router;
