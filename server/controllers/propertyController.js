import Property from '../models/Property.js';


export const getProperties = async (req, res) => {
  try {
    const {
      keyword,
      city,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      featured,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    // Build dynamic query object
    const query = {};

    // 1. Text Search across title, description, or city keyword
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { 'location.city': { $regex: keyword, $options: 'i' } },
        { 'location.address': { $regex: keyword, $options: 'i' } }
      ];
    }

    // 2. City filter
    if (city && city !== 'All') {
      query['location.city'] = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    // 3. Property type filter (Apartment, Villa, Commercial, Studio, Plot)
    if (propertyType && propertyType !== 'All') {
      query.propertyType = propertyType;
    }

    // 4. Budget / Price range filter ($gte = greater than or equal, $lte = less than or equal)
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 5. Bedrooms filter
    if (bedrooms && bedrooms !== 'All') {
      query.bedrooms = Number(bedrooms);
    }

    // 6. Featured properties flag (for homepage carousel/grid)
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Sorting logic (e.g. price low to high, high to low, or newest)
    let sortBy = { createdAt: -1 }; // Default: newest first
    if (sort === 'price_asc') sortBy = { price: 1 };
    if (sort === 'price_desc') sortBy = { price: -1 };

    // Pagination calculations
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: properties
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties',
      error: error.message
    });
  }
};


export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    res.status(200).json({
      success: true,
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Invalid property ID or server error',
      error: error.message
    });
  }
};


export const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create property'
    });
  }
};


export const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Returns the newly updated document
      runValidators: true // Enforces Mongoose schema validations on updates
    });

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update property'
    });
  }
};


export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete property',
      error: error.message
    });
  }
};