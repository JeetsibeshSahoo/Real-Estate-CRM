import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Lead from '../models/Lead.js';

// Load environment variables from server/.env
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding...');
  } catch (err) {
    console.error('❌ Connection error during seeding:', err.message);
    process.exit(1);
  }
};

// 1. Initial Admin User Data
const adminData = {
  name: 'Anuverse Admin',
  email: 'admin@realestate.com',
  password: 'adminpassword123', // Will be hashed via User pre-save hook
  role: 'admin'
};

// 2. Realistic Property Listings with Unsplash Real Estate Images
const sampleProperties = [
  {
    title: 'Modern Sunset Luxury Villa',
    description: 'An architectural masterpiece featuring floor-to-ceiling glass walls, private infinity pool, panoramic mountain views, and state-of-the-art smart home automation.',
    price: 1250000,
    propertyType: 'Villa',
    location: {
      address: '742 Evergreen Terrace',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001'
    },
    bedrooms: 5,
    bathrooms: 4,
    areaSqFt: 4800,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Infinity Pool', 'Smart Home', 'Wine Cellar', '3-Car Garage', 'Solar Powered'],
    status: 'Available',
    featured: true
  },
  {
    title: 'Downtown Skyline Penthouse',
    description: 'Stunning double-height living room overlooking the city skyline. Private elevator access, designer Italian kitchen, and 360-degree wrap-around terrace.',
    price: 890000,
    propertyType: 'Apartment',
    location: {
      address: '100 Ocean Avenue, Unit 42',
      city: 'Miami',
      state: 'FL',
      zipCode: '33139'
    },
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 2900,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Private Elevator', 'Concierge Service', 'Rooftop Access', 'Spa Bath'],
    status: 'Available',
    featured: true
  },
  {
    title: 'Contemporary Waterfront Apartment',
    description: 'Experience waterfront tranquility with uninterrupted marina views, private boat mooring, and resort-style communal facilities.',
    price: 540000,
    propertyType: 'Apartment',
    location: {
      address: '45 Marina Boulevard',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94123'
    },
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1450,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Marina View', 'Gym & Pool', 'Balcony', 'Covered Parking'],
    status: 'Available',
    featured: true
  },
  {
    title: 'High-Tech Financial District Office',
    description: 'Grade-A commercial workspace equipped with fiber-optic connectivity, breakout lounges, executive conference boardrooms, and LEED Gold sustainability rating.',
    price: 2100000,
    propertyType: 'Commercial',
    location: {
      address: '55 Wall Street, 12th Floor',
      city: 'New York',
      state: 'NY',
      zipCode: '10005'
    },
    bedrooms: 0,
    bathrooms: 6,
    areaSqFt: 7200,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['High-speed Fiber', 'Conference Suites', '24/7 Security', 'Subway Proximity'],
    status: 'Available',
    featured: false
  },
  {
    title: 'Minimalist Urban Studio Loft',
    description: 'Charming open-concept studio located in the vibrant cultural district. Polished concrete floors, exposed brick accents, and top-tier appliances.',
    price: 285000,
    propertyType: 'Studio',
    location: {
      address: '210 Arts Promenade',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701'
    },
    bedrooms: 1,
    bathrooms: 1,
    areaSqFt: 750,
    images: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Exposed Brick', 'Walk-in Closet', 'Pet Friendly', 'Bike Storage'],
    status: 'Available',
    featured: false
  },
  {
    title: 'Suburban Family Haven with Garden',
    description: 'Spacious multi-level family home situated in an award-winning school district. Includes an expansive fenced backyard, heated deck, and finished basement.',
    price: 675000,
    propertyType: 'Villa',
    location: {
      address: '18 Oakridge Way',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101'
    },
    bedrooms: 4,
    bathrooms: 3,
    areaSqFt: 3200,
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Large Backyard', 'Finished Basement', 'Fireplace', 'Double Garage'],
    status: 'Available',
    featured: true
  },
  {
    title: 'Scenic Hillside Residential Plot',
    description: 'Cleared and shovel-ready premium residential plot with approved permits for a 4-bedroom modern villa. Unobstructed valley orientation and connected utilities.',
    price: 320000,
    propertyType: 'Plot',
    location: {
      address: 'Lot 14 Pinecrest Summit',
      city: 'Denver',
      state: 'CO',
      zipCode: '80202'
    },
    bedrooms: 0,
    bathrooms: 0,
    areaSqFt: 12500,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Permits Approved', 'Utilities at Lot Line', 'Paved Road Access', 'Mountain Views'],
    status: 'Available',
    featured: false
  },
  {
    title: 'Chic Bohemian City Center Flat',
    description: 'Bright and airy apartment featuring high ceilings, warm natural wood finishes, and steps away from high-end boutiques, cafes, and parks.',
    price: 460000,
    propertyType: 'Apartment',
    location: {
      address: '88 Heritage Square',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60611'
    },
    bedrooms: 2,
    bathrooms: 1,
    areaSqFt: 1150,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    ],
    features: ['Central HVAC', 'Hardwood Flooring', 'In-unit Laundry', 'Storage Locker'],
    status: 'Available',
    featured: false
  }
];

// Main Seeding Runner
const seedDatabase = async () => {
  try {
    await connectDB();

    // 1. Clear existing collections to prevent duplicates
    await User.deleteMany();
    await Property.deleteMany();
    await Lead.deleteMany();
    console.log('🧹 Purged existing Users, Properties, and Leads...');

    // 2. Create the Admin User
    const adminUser = await User.create(adminData);
    console.log(`👤 Admin created: ${adminUser.email} (Password: adminpassword123)`);

    // 3. Create Properties
    const createdProperties = await Property.insertMany(sampleProperties);
    console.log(`🏠 Successfully inserted ${createdProperties.length} Properties!`);

    // 4. Create Sample Leads linked to created properties
    const sampleLeads = [
      {
        name: 'Sarah Jenkins',
        email: 'sarah.j@gmail.com',
        phone: '+1 (555) 234-5678',
        message: 'I am interested in scheduling a private tour of the Sunset Luxury Villa this Saturday.',
        property: createdProperties[0]._id, // Sunset Villa
        status: 'Interested',
        notes: [
          { text: 'Inquiry submitted online', addedBy: 'System' },
          { text: 'Called client, confirmed pre-approval letter received. Scheduled walkthrough for 2 PM Saturday.', addedBy: 'Anuverse Admin' }
        ]
      },
      {
        name: 'Michael Chang',
        email: 'm.chang@techventures.io',
        phone: '+1 (555) 876-5432',
        message: 'Looking for office space for a 40-person fintech team. Is the Wall Street lease flexible?',
        property: createdProperties[3]._id, // Financial District Office
        status: 'Contacted',
        notes: [
          { text: 'Inquiry submitted online', addedBy: 'System' },
          { text: 'Sent commercial floor plan PDF and 3-year lease rate sheet.', addedBy: 'Anuverse Admin' }
        ]
      },
      {
        name: 'Elena Rostova',
        email: 'elena.rostova@yahoo.com',
        phone: '+1 (555) 345-9876',
        message: 'Love the double-height skyline view! Is financing available or cash only?',
        property: createdProperties[1]._id, // Miami Penthouse
        status: 'Converted',
        notes: [
          { text: 'Inquiry submitted online', addedBy: 'System' },
          { text: 'Buyer signed purchase agreement! Escrow opened.', addedBy: 'Anuverse Admin' }
        ]
      },
      {
        name: 'David Miller',
        email: 'david.m92@outlook.com',
        phone: '+1 (555) 432-1098',
        message: 'Looking to purchase my first home. Would like more info on HOA fees for the Waterfront apartment.',
        property: createdProperties[2]._id, // Waterfront Apartment
        status: 'New',
        notes: [
          { text: 'Initial enquiry submitted through website', addedBy: 'System' }
        ]
      },
      {
        name: 'Jessica Taylor',
        email: 'jtaylor@designstudio.com',
        phone: '+1 (555) 654-7890',
        message: 'Can the studio loft be used as a live/work creative studio?',
        property: createdProperties[4]._id, // Urban Studio Loft
        status: 'Lost',
        notes: [
          { text: 'Inquiry submitted online', addedBy: 'System' },
          { text: 'Client required ground-floor retail zoning, which is not permitted here.', addedBy: 'Anuverse Admin' }
        ]
      }
    ];

    await Lead.insertMany(sampleLeads);
    console.log(`📋 Successfully inserted ${sampleLeads.length} Sample Leads across pipeline stages!`);

    console.log('\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY! 🎉');
    console.log('───────────────────────────────────────────────────────');
    console.log('🔑 Admin Credentials:');
    console.log('   Email:    admin@realestate.com');
    console.log('   Password: adminpassword123');
    console.log('───────────────────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exit(1);
  }
};

seedDatabase();