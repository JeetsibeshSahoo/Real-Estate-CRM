import Property from '../models/Property.js';
import Lead from '../models/Lead.js';


export const getDashboardStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const totalLeads = await Lead.countDocuments();

    const activeEnquiries = await Lead.countDocuments({
      status: { $in: ['New', 'Contacted', 'Interested'] }
    });

    const convertedLeads = await Lead.countDocuments({ status: 'Converted' });

    const conversionRate = totalLeads > 0
      ? ((convertedLeads / totalLeads) * 100).toFixed(1)
      : 0;

    const statusCounts = await Lead.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const leadsByStatus = ['New', 'Contacted', 'Interested', 'Converted', 'Lost'].map(
      (status) => {
        const found = statusCounts.find((item) => item._id === status);
        return {
          status,
          count: found ? found.count : 0
        };
      }
    );

    const propertyTypeCounts = await Property.aggregate([
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 }
        }
      }
    ]);

    const propertiesByType = propertyTypeCounts.map((item) => ({
      type: item._id,
      count: item.count
    }));


    const recentLeads = await Lead.find()
      .populate('property', 'title price location images')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        kpi: {
          totalProperties,
          totalLeads,
          activeEnquiries,
          convertedLeads,
          conversionRate: Number(conversionRate)
        },
        charts: {
          leadsByStatus,
          propertiesByType
        },
        recentLeads
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};