import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Anu<span className="text-blue-500">Estate</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Premium real estate platform with an integrated intelligent lead management CRM. Find your dream home or manage high-value client acquisitions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Featured Properties
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">
                  All Listings
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Villa" className="hover:text-white transition-colors">
                  Luxury Villas
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Apartment" className="hover:text-white transition-colors">
                  City Apartments
                </Link>
              </li>
            </ul>
          </div>

          {/* Business & CRM Team Links (Context Aware) */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Business Team
            </h4>
            <ul className="space-y-2.5 text-sm">
              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/crm/dashboard" className="hover:text-white text-blue-400 font-semibold transition-colors">
                      CRM Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/crm/leads" className="hover:text-white transition-colors">
                      Leads Pipeline
                    </Link>
                  </li>
                  <li>
                    <Link to="/crm/properties" className="hover:text-white transition-colors">
                      Inventory Manager
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="hover:text-white transition-colors">
                      Agent Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="hover:text-white transition-colors">
                      Lead Management CRM
                    </Link>
                  </li>
                </>
              )}
              <li>
                <span className="text-slate-500 text-xs block pt-2">
                  Built for Anuverse Technologies practical evaluation.
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact & Support
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Tech Park Tower, Bangalore / Remote</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>contact@anuverse.tech</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AnuEstate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;