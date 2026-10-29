import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, ArrowUpRight } from 'lucide-react';

const PropertyCard = ({ property }) => {

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(property.price);

  const primaryImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col">
      {/* Property Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        <span className="absolute top-3.5 left-3.5 px-3 py-1 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide uppercase rounded-full shadow-sm">
          {property.propertyType}
        </span>

        {property.featured && (
          <span className="absolute top-3.5 right-3.5 px-3 py-1 bg-amber-500 text-white text-[11px] font-bold tracking-wide uppercase rounded-full shadow-sm">
            Featured
          </span>
        )}

        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md border border-white/60">
          <p className="text-lg font-black text-blue-600 tracking-tight">
            {formattedPrice}
          </p>
        </div>
      </div>

      {/* Property Content Details */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">
              {property.location.address}, {property.location.city}
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
            {property.title}
          </h3>

          <p className="text-slate-500 text-xs font-normal line-clamp-2 mb-4 leading-relaxed">
            {property.description}
          </p>
        </div>

        <div>
          {/* Specs Bar (Beds, Baths, SqFt) */}
          <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100 text-slate-700 text-xs font-medium mb-4">
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-slate-400" />
              <span>{property.bedrooms > 0 ? `${property.bedrooms} Beds` : 'Studio'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-slate-400" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize className="w-4 h-4 text-slate-400" />
              <span>{property.areaSqFt.toLocaleString()} sqft</span>
            </div>
          </div>

          <Link
            to={`/properties/${property._id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white rounded-xl text-xs font-bold tracking-wide transition-all group-hover:border-transparent border border-slate-200"
          >
            <span>View Property Details</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;