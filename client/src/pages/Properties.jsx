import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import PropertyCard from '../components/PropertyCard';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Building,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const propertyTypes = ['All', 'Apartment', 'Villa', 'Commercial', 'Studio', 'Plot'];
const bedroomOptions = ['All', '1', '2', '3', '4', '5'];

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || 'All');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch properties function that accepts optional overrides for immediate updates
  const fetchPropertiesWithParams = async (overrideParams = {}) => {
    setLoading(true);
    try {
      const activeKeyword = overrideParams.keyword !== undefined ? overrideParams.keyword : keyword;
      const activeType = overrideParams.propertyType !== undefined ? overrideParams.propertyType : propertyType;
      const activeMin = overrideParams.minPrice !== undefined ? overrideParams.minPrice : minPrice;
      const activeMax = overrideParams.maxPrice !== undefined ? overrideParams.maxPrice : maxPrice;
      const activeBeds = overrideParams.bedrooms !== undefined ? overrideParams.bedrooms : bedrooms;
      const activeSort = overrideParams.sort !== undefined ? overrideParams.sort : sort;
      const activePage = overrideParams.page !== undefined ? overrideParams.page : page;

      const params = new URLSearchParams();
      if (activeKeyword && activeKeyword.trim()) params.append('keyword', activeKeyword.trim());
      if (activeType && activeType !== 'All') params.append('propertyType', activeType);
      if (activeMin) params.append('minPrice', activeMin);
      if (activeMax) params.append('maxPrice', activeMax);
      if (activeBeds && activeBeds !== 'All') params.append('bedrooms', activeBeds);
      if (activeSort) params.append('sort', activeSort);
      params.append('page', activePage);
      params.append('limit', 9);

      const res = await api.get(`/properties?${params.toString()}`);
      if (res.data.success) {
        setProperties(res.data.data);
        setTotalCount(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Re-sync filter state whenever URL search parameters change (from footer, navbar, or category buttons)
  useEffect(() => {
    const urlType = searchParams.get('propertyType') || 'All';
    const urlKeyword = searchParams.get('keyword') || '';
    const urlMin = searchParams.get('minPrice') || '';
    const urlMax = searchParams.get('maxPrice') || '';
    const urlBeds = searchParams.get('bedrooms') || 'All';
    const urlSort = searchParams.get('sort') || 'newest';
    const urlPage = Number(searchParams.get('page')) || 1;

    setPropertyType(urlType);
    setKeyword(urlKeyword);
    setMinPrice(urlMin);
    setMaxPrice(urlMax);
    setBedrooms(urlBeds);
    setSort(urlSort);
    setPage(urlPage);

    fetchPropertiesWithParams({
      propertyType: urlType,
      keyword: urlKeyword,
      minPrice: urlMin,
      maxPrice: urlMax,
      bedrooms: urlBeds,
      sort: urlSort,
      page: urlPage
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (keyword.trim()) params.set('keyword', keyword.trim());
    else params.delete('keyword');
    params.set('page', 1);
    setSearchParams(params);
  };


  const handleApplyBudget = () => {
    const params = new URLSearchParams(searchParams);
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');
    params.set('page', 1);
    setSearchParams(params);
  };


  const handleResetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Available Properties
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Showing {totalCount} verified residential and commercial listings.
        </p>
      </div>

      {/* Main Layout: Sidebar Filters + Property Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span>Filters</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Location or Keyword
              </label>
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="City, title, street (press Enter)..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </form>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Property Type
              </label>
              <div className="space-y-1.5">
                {propertyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      if (type === 'All') params.delete('propertyType');
                      else params.set('propertyType', type);
                      params.set('page', 1);
                      setSearchParams(params);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                      propertyType === type
                        ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{type}</span>
                    {propertyType === type && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Budget (USD)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="number"
                    placeholder="Min ($)"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Max ($)"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleApplyBudget}
                className="w-full mt-2 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Apply Budget
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Bedrooms
              </label>
              <div className="grid grid-cols-6 gap-1">
                {bedroomOptions.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      if (b === 'All') params.delete('bedrooms');
                      else params.set('bedrooms', b);
                      params.set('page', 1);
                      setSearchParams(params);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      bedrooms === b
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center justify-center gap-2 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl cursor-pointer"
            >
              <Filter className="w-4 h-4 text-blue-600" />
              <span>{showMobileFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>

            <p className="text-xs font-medium text-slate-600 text-center sm:text-left">
              Showing <span className="font-bold text-slate-900">{properties.length}</span> of{' '}
              <span className="font-bold text-slate-900">{totalCount}</span> properties
            </p>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-500 whitespace-nowrap">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams);
                  params.set('sort', e.target.value);
                  params.set('page', 1);
                  setSearchParams(params);
                }}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-80 border border-slate-200 animate-pulse"></div>
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                <Building className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                No matching properties found
              </h3>
              <p className="text-slate-500 text-xs max-w-md mx-auto">
                We couldn't find any properties matching your current filter criteria.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('page', Math.max(1, page - 1));
                  setSearchParams(params);
                }}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-semibold text-slate-600 px-3">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('page', Math.min(totalPages, page + 1));
                  setSearchParams(params);
                }}
                className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;