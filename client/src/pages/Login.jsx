import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/slices/authSlice';
import {
  Building2,
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = location.state?.from?.pathname || '/crm/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // If user came from a specific page, return them there; otherwise default to dashboard
      const returnTo = location.state?.from?.pathname || '/crm/dashboard';
      navigate(returnTo, { replace: true });
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, location, dispatch]);

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  // One-click demo credentials autofill for Anuverse Technologies evaluator
  const fillDemoAdmin = () => {
    setEmail('admin@realestate.com');
    setPassword('adminpassword123');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 mb-2">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Agent & Admin Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            Sign in to access real-time enquiry feeds, manage leads, and review CRM analytics.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
          
          {/* Quick Demo Helper Box */}
          <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Evaluation Quick Access</span>
              </span>
              <p className="text-[11px] text-blue-700">
                Use pre-seeded admin credentials
              </p>
            </div>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              Fill Admin
            </button>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@realestate.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In to CRM</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Security Note */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Role-Based Access Control (JWT Encrypted)</span>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            ← Return to Public Website
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;