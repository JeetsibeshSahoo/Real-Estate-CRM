import express from 'express';
import {
  createLead,
  getLeads,
  getLeadById,
  updateLeadStatus,
  addLeadNote,
  deleteLead
} from '../controllers/leadController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public: Visitors submit enquiry from the property details page
router.post('/', createLead);

// Protected: CRM agent and admin routes
router.get('/', protect, authorize('admin', 'agent'), getLeads);
router.get('/:id', protect, authorize('admin', 'agent'), getLeadById);
router.patch('/:id/status', protect, authorize('admin', 'agent'), updateLeadStatus);
router.post('/:id/notes', protect, authorize('admin', 'agent'), addLeadNote);
router.delete('/:id', protect, authorize('admin'), deleteLead);

export default router;