import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  Building2,
  Plus,
  Search,
  Trash2,
  ExternalLink,
  X,
  AlertCircle
} from 'lucide-react';

const CrmProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State for Creating Property
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // New Property Form State
  const initialFormState = {
    title: '',
    description: '',
    price: '',
    propertyType: 'Apartment',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1200,
    imageUrl: '',
    status: 'Available',
    featured: false
  };
  const [formData, setFormData] = useState(initialFormState);

  // Fetch properties from backend
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('keyword', search.trim());
      params.append('limit', 50); // Show full list for management

      const res = await api.get(`/properties?${params.toString()}`);
      if (res.data.success) {
        setProperties(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Submit New Property (POST /api/properties)
  const handleCreateProperty = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        propertyType: formData.propertyType,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        areaSqFt: Number(formData.areaSqFt),
        images: formData.imageUrl
          ? [formData.imageUrl]
          : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80'],
        status: formData.status,
        featured: formData.featured
      };

      const res = await api.post('/properties', payload);
      if (res.data.success) {
        setShowCreateModal(false);
        setFormData(initialFormState);
        fetchProperties();
      }
    } catch (err) {
      console.error('Failed to create property:', err);
      setFormError(err.response?.data?.message || 'Failed to create listing. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Property (DELETE /api/properties/:id)
  const handleDeleteProperty = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await api.delete(`/properties/${id}`);
      if (res.data.success) {
        fetchProperties();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete property.');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Property Inventory Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish new listings, monitor availability, and maintain your real estate catalog.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Search and Summary Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-medium text-slate-600">
          Total Inventory: <strong className="text-slate-900">{properties.length} listings</strong>
        </p>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </form>
      </div>

      {/* Properties Management Table / Mobile Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-16 bg-slate-100 rounded-xl"></div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-600">No properties found</p>
          </div>
        ) : (
          <>
            <div className="sm:hidden divide-y divide-slate-100">
              {properties.map((prop) => (
                <div key={prop._id} className="p-4 space-y-3">
                  {/* Property Info Row */}
                  <div className="flex items-start gap-3">
                    <img
                      src={prop.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80'}
                      alt={prop.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{prop.title}</h4>
                        <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prop.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {prop.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {prop.location?.address}, {prop.location?.city}
                      </p>
                      <p className="text-sm font-extrabold text-blue-600 mt-1">
                        ${prop.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Specs & Actions Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs">
                    <span className="text-[11px] text-slate-500 font-medium">
                      {prop.bedrooms} Bed • {prop.bathrooms} Bath • {prop.areaSqFt?.toLocaleString()} sqft
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/properties/${prop._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        onClick={() => handleDeleteProperty(prop._id, prop.title)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Property</th>
                    <th className="py-3.5 px-4 sm:px-6">Type</th>
                    <th className="py-3.5 px-4 sm:px-6">Price (USD)</th>
                    <th className="py-3.5 px-4 sm:px-6">Specs</th>
                    <th className="py-3.5 px-4 sm:px-6">Status</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.map((prop) => (
                    <tr key={prop._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80'}
                            alt={prop.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm line-clamp-1">{prop.title}</p>
                            <p className="text-[11px] text-slate-400">
                              {prop.location?.address}, {prop.location?.city}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 sm:px-6 font-semibold text-slate-700">
                        {prop.propertyType}
                      </td>

                      <td className="py-4 px-4 sm:px-6 font-bold text-blue-600 text-sm">
                        ${prop.price?.toLocaleString()}
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-slate-500">
                        {prop.bedrooms} Bed • {prop.bathrooms} Bath • {prop.areaSqFt?.toLocaleString()} sqft
                      </td>

                      <td className="py-4 px-4 sm:px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          prop.status === 'Available'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {prop.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/properties/${prop._id}`}
                            target="_blank"
                            rel="noreferrer"
                            title="View on Public Website"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteProperty(prop._id, prop.title)}
                            title="Delete Listing"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Add New Property Listing</h3>
                <p className="text-xs text-slate-400">Fill in details to immediately publish onto the public website.</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateProperty} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Beverly Hills Villa"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Price & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 750000"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Property Type *
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Studio">Studio</option>
                    <option value="Plot">Plot</option>
                  </select>
                </div>
              </div>

              {/* Address & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 124 Ocean Drive"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Miami"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Beds, Baths, SqFt */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Area (sqft)
                  </label>
                  <input
                    type="number"
                    name="areaSqFt"
                    value={formData.areaSqFt}
                    onChange={handleInputChange}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Primary Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe features, views, renovations..."
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs resize-none"
                />
              </div>

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="featured" className="text-xs font-semibold text-slate-700">
                  Feature this property on the homepage showcase
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Publish Property'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default CrmProperties;