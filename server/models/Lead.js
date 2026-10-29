import mongoose from 'mongoose';

// Subschema for tracking follow-up interactions and agent notes
const noteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    addedBy: {
      type: String,
      default: 'Admin'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Contact phone number is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Inquiry message is required']
    },
    // Reference to the specific Property the visitor is inquiring about
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Associated property ID is required']
    },
    // Status pipeline required by Anuverse Technologies assignment
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Interested', 'Converted', 'Lost'],
      default: 'New'
    },
    // Notes and follow-up timeline
    notes: [noteSchema],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;