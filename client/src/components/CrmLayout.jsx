import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/slices/authSlice';
import {
  LayoutDashboard,
  Users2,
  Building,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

const CrmLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const navLinks = [
    {
      to: '/crm/dashboard',
      label: 'Analytics Dashboard',
      icon: LayoutDashboard
    },
    {
      to: '/crm/leads',
      label: 'Leads & Enquiries',
      icon: Users2
    },
    {
      to: '/crm/properties',
      label: 'Property Inventory',
      icon: Building
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">

      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm tracking-tight">
            Anu<span className="text-blue-500">CRM</span>
          </span>
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/30">
            PRO
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <span>Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </NavLink>

            <button
              onClick={() => {
                dispatch(logoutUser());
                setMobileMenuOpen(false);
              }}
              className="text-rose-400 font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 p-6 flex-col justify-between shrink-0 border-r border-slate-800 sticky top-0 h-screen">
        <div className="space-y-8">
          
          {/* Identity Badge */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white tracking-tight">
                Anu<span className="text-blue-500">CRM</span>
              </span>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Lead Tracking & Portfolio Manager
            </p>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Public Website Link */}
          <div className="pt-4 border-t border-slate-800">
            <NavLink
              to="/"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors"
            >
              <span>View Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </NavLink>
          </div>

        </div>

        {/* User Card & Logout at Bottom */}
        <div className="pt-6 border-t border-slate-800 mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="capitalize">{user?.role || 'Admin'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => dispatch(logoutUser())}
            className="flex items-center gap-2 w-full px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

    </div>
  );
};

export default CrmLayout;