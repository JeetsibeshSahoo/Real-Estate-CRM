import Lead from '../models/Lead.js';
import Property from '../models/Property.js';


export const createLead = async (req, res) => {
  try {
    const { name, email, phone, message, propertyId } = req.body;

    // 1. Validation
    if (!name || !email || !phone || !message || !propertyId) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required enquiry fields'
      });
    }

    // 2. Verify property exists
    const propertyExists = await Property.findById(propertyId);
    if (!propertyExists) {
      return res.status(404).json({
        success: false,
        message: 'The requested property could not be found'
      });
    }

    // 3. Create lead with default status 'New'
    const lead = await Lead.create({
      name,
      email,
      phone,
      message,
      property: propertyId,
      status: 'New',
      notes: [
        {
          text: 'Initial enquiry submitted through website',
          addedBy: 'System'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! Our team will contact you soon.',
      data: lead
    });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit enquiry',
      error: error.message
    });
  }
};


export const getLeads = async (req, res) => {
  try {
    const { status, search, sort = 'newest' } = req.query;

    const query = {};

    // Filter by status if specified
    if (status && status !== 'All') {
      query.status = status;
    }

    // Search by lead name, email, or phone
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort order
    const sortBy = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    // Fetch leads and populate associated property info (title, price, city, images)
    const leads = await Lead.find(query)
      .populate('property', 'title price location images propertyType')
      .sort(sortBy);

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads',
      error: error.message
    });
  }
};


export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('property', 'title price location images propertyType status');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving lead',
      error: error.message
    });
  }
};


export const updateLeadStatus = async (req, res) => {
  try {
    const { status, noteText } = req.body;

    const validStatuses = ['New', 'Contacted', 'Interested', 'Converted', 'Lost'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    const previousStatus = lead.status;
    lead.status = status;

    // Automatically record status change event in the notes timeline
    lead.notes.push({
      text: noteText || `Status updated from "${previousStatus}" to "${status}"`,
      addedBy: req.user ? req.user.name : 'Admin',
      createdAt: new Date()
    });

    await lead.save();

    res.status(200).json({
      success: true,
      message: `Lead status updated to ${status}`,
      data: lead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update lead status',
      error: error.message
    });
  }
};


export const addLeadNote = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Note text cannot be empty'
      });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    lead.notes.push({
      text,
      addedBy: req.user ? req.user.name : 'Admin',
      createdAt: new Date()
    });

    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Note added successfully',
      data: lead.notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add note',
      error: error.message
    });
  }
};


export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      error: error.message
    });
  }
};