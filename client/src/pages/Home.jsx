import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';
import {
  Search,
  Building2,
  Home as HomeIcon,
  Briefcase,
  Layers,
  ShieldCheck,
  Zap,
  Users2,
  ArrowRight
} from 'lucide-react';

const categories = [
  { label: 'All Types', value: 'All', icon: Layers },
  { label: 'Apartments', value: 'Apartment', icon: Building2 },
  { label: 'Villas', value: 'Villa', icon: HomeIcon },
  { label: 'Commercial', value: 'Commercial', icon: Briefcase },
  { label: 'Studios', value: 'Studio', icon: Building2 }
];

const Home = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Fetch featured properties from API
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/properties?featured=true&limit=6');
        if (res.data.success) {
          setFeaturedProperties(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load featured properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('keyword', keyword.trim());
    if (selectedType !== 'All') params.append('propertyType', selectedType);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-16 pb-24 overflow-hidden border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 text-blue-700 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            Integrated Real Estate Portal & CRM System
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
            Discover Exceptional Properties with <span className="text-blue-600">Smart CRM</span> Tracking
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Explore verified luxury villas, modern city apartments, and commercial workspaces. Every inquiry connects seamlessly to our business lead management pipeline.
          </p>

          <div className="max-w-3xl mx-auto bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="relative flex-grow w-full">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="City, neighborhood, or property title..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white border border-transparent focus:border-blue-500 transition-all"
                />
              </div>
              <div className="w-full sm:w-48">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white border border-transparent focus:border-blue-500 transition-all"
                >
                  <option value="All">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Studio">Studio</option>
                  <option value="Plot">Plot</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Find Properties</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </div>

        </div>
      </section>

      {/* 2. CATEGORY PILLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start sm:justify-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => navigate(cat.value === 'All' ? '/properties' : `/properties?propertyType=${cat.value}`)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 text-sm font-semibold whitespace-nowrap shadow-sm transition-all cursor-pointer"
              >
                <Icon className="w-4 h-4 text-blue-500" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">
              Handpicked Collections
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Featured Properties
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Prime real estate selections offering verified value and premier locations.
            </p>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <span>View All Listings ({featuredProperties.length}+)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Property Grid or Skeleton Loader */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-96 border border-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* 4. VALUE PROPOSITION / FEATURES */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-slate-900">
              Why Choose AnuEstate?
            </h3>
            <p className="text-slate-500 text-sm mt-2">
              Combining a modern buyer experience with high-velocity lead tracking for real estate businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Verified Real Estate</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                All property listings pass stringent legal, structural, and valuation criteria before going live.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Instant Lead Routing</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Client inquiries route directly into the CRM pipeline with immediate notifications for agents.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Users2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">End-to-End Follow-up</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                CRM tools track every customer conversation from first contact to signed contract.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Looking to Manage Properties or Track Leads?
            </h3>
            <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-xl">
              Access the business CRM dashboard to review live customer enquiries, update lead statuses, and analyze conversion KPIs.
            </p>
          </div>
          <Link
            to="/login"
            className="px-6 py-3.5 bg-white hover:bg-slate-50 text-blue-700 font-bold text-sm rounded-xl shadow-lg transition-all whitespace-nowrap cursor-pointer"
          >
            Launch Agent CRM
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;