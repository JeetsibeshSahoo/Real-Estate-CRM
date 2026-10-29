import express from 'express';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes (anyone can browse and view listings)
router.get('/', getProperties);
router.get('/:id', getPropertyById);

// Protected routes (Admin / Agents manage inventory)
router.post('/', protect, authorize('admin', 'agent'), createProperty);
router.put('/:id', protect, authorize('admin', 'agent'), updateProperty);
router.delete('/:id', protect, authorize('admin'), deleteProperty);

export default router;