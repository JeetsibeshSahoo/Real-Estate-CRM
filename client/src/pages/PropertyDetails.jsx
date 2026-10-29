import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Send,
  Building2,
  ChevronLeft,
  Check,
  AlertCircle
} from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch Property Details by ID
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/properties/${id}`);
        if (res.data.success) {
          setProperty(res.data.data);
          setFormData((prev) => ({
            ...prev,
            message: `Hi, I am interested in "${res.data.data.title}". Please share further details and tour availability.`
          }));
        }
      } catch (err) {
        console.error('Failed to load property details:', err);
        setError('Property not found or server error.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        propertyId: id
      };

      const res = await api.post('/leads', payload);
      if (res.data.success) {
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
      }
    } catch (err) {
      console.error('Failed to submit enquiry:', err);
      setSubmitError(
        err.response?.data?.message || 'Failed to submit enquiry. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-slate-200 rounded-xl w-1/3"></div>
          <div className="h-96 bg-slate-200 rounded-2xl w-full"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-64 bg-slate-200 rounded-2xl"></div>
            <div className="h-64 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Property Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">{error || 'The property you are looking for does not exist.'}</p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-md hover:bg-blue-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Properties</span>
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.price);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
        <Link to="/properties" className="hover:text-blue-600 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          <span>All Properties</span>
        </Link>
        <span>/</span>
        <span className="text-slate-400 capitalize">{property.propertyType}</span>
        <span>/</span>
        <span className="text-slate-800 truncate max-w-xs">{property.title}</span>
      </div>

      {/* Property Title & Price Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full border border-blue-100">
              {property.propertyType}
            </span>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
              property.status === 'Available'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-amber-50 text-amber-700 border border-amber-100'
            }`}>
              {property.status}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            {property.title}
          </h1>
          <p className="flex items-center gap-1.5 text-slate-500 text-sm mt-2">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              {property.location.address}, {property.location.city}, {property.location.state} {property.location.zipCode}
            </span>
          </p>
        </div>

        <div className="text-left md:text-right">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Listing Price
          </span>
          <span className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
            {formattedPrice}
          </span>
        </div>
      </div>

      {/* Main Image Gallery */}
      <div className="space-y-4 mb-12">
        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-slate-900 shadow-lg border border-slate-200">
          <img
            src={property.images[selectedImage] || property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        
        {property.images && property.images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  selectedImage === idx
                    ? 'border-blue-600 ring-2 ring-blue-500/30'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Two-Column Layout: Details Specs (Left) & Enquiry Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT COLUMN: Property Overview, Specs & Features */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Bedrooms</p>
                <p className="text-base font-bold text-slate-800">
                  {property.bedrooms > 0 ? `${property.bedrooms} Beds` : 'Studio'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Bath className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Bathrooms</p>
                <p className="text-base font-bold text-slate-800">
                  {property.bathrooms} Baths
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Maximize className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Square Feet</p>
                <p className="text-base font-bold text-slate-800">
                  {property.areaSqFt.toLocaleString()} sqft
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Property Type</p>
                <p className="text-base font-bold text-slate-800">
                  {property.propertyType}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-900">
              About This Property
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {property.features && property.features.length > 0 && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xl font-bold text-slate-900">
                Amenities & Key Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {property.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Lead Enquiry Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg sticky top-24">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Direct Inquiry
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                Contact Property Agent
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                Submissions automatically register into our Lead Management CRM pipeline.
              </p>
            </div>

            {submitSuccess ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-emerald-900 text-base">
                  Enquiry Received!
                </h4>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Thank you, <strong>{formData.name || 'valued client'}</strong>. Your enquiry for <em>{property.title}</em> has been captured into our CRM. Our agent will contact you shortly!
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                
                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. +1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Message / Tour Request *
                  </label>
                  <div className="relative">
                    <textarea
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <span>Submitting Enquiry...</span>
                  ) : (
                    <>
                      <span>Submit Enquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center mt-2">
                  🔒 We protect your privacy. Your information is delivered directly to our CRM.
                </p>

              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;