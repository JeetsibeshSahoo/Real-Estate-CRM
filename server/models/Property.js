import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Property description is required']
    },
    price: {
      type: Number,
      required: [true, 'Property price is required'],
      min: [0, 'Price must be a positive number']
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['Apartment', 'Villa', 'Commercial', 'Studio', 'Plot'],
      default: 'Apartment'
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required']
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
      },
      state: {
        type: String,
        default: ''
      },
      zipCode: {
        type: String,
        default: ''
      }
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: 0
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: 0
    },
    areaSqFt: {
      type: Number,
      required: [true, 'Area in sq ft is required'],
      min: 1
    },
    images: {
      type: [String],
      default: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80']
    },
    features: {
      type: [String],
      default: ['Parking', 'Air Conditioning', 'High-Speed Internet']
    },
    status: {
      type: String,
      enum: ['Available', 'Under Contract', 'Sold'],
      default: 'Available'
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

propertySchema.index({
  title: 'text',
  description: 'text',
  'location.city': 'text'
});

const Property = mongoose.model('Property', propertySchema);
export default Property;