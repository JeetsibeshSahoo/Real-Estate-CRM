import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Building2,
  Users2,
  Inbox,
  CheckCircle,
  ArrowRight,
  Clock,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Pipeline status color mapping
const STATUS_COLORS = {
  New: '#3b82f6',         
  Contacted: '#f59e0b',   
  Interested: '#8b5cf6',  
  Converted: '#10b981',   
  Lost: '#f43f5e'         
};

const PIE_COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899'];

// Custom Tooltip for the Bar Chart
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const color = STATUS_COLORS[label] || '#3b82f6';
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl border border-slate-700/60 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
          <span className="font-bold text-slate-200">{label} Stage</span>
        </div>
        <p className="text-slate-400">
          Enquiries: <strong className="text-white text-sm">{data.value}</strong>
        </p>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for the Donut Chart
const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl border border-slate-700/60 text-xs space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.fill }}></span>
          <span className="font-bold text-slate-200">{data.name}</span>
        </div>
        <p className="text-slate-400">
          Available Listings: <strong className="text-white text-sm">{data.value}</strong>
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats from /api/dashboard/stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded-xl w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80 bg-slate-200 rounded-2xl"></div>
          <div className="h-80 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const { kpi, charts, recentLeads } = stats || {};

  // Total properties calculation for the center of the donut
  const totalInventoryCount = charts?.propertiesByType?.reduce((sum, item) => sum + item.count, 0) || 0;

  return (
    <div className="space-y-10">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2 border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Real Estate Executive Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Analytics & Lead CRM Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time pipeline metrics, lead conversions, and inventory distribution.
          </p>
        </div>

        <Link
          to="/crm/leads"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition-all self-start sm:self-auto cursor-pointer"
        >
          <span>Manage Leads Pipeline</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Total Properties */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Total Properties
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900">
              {kpi?.totalProperties || 0}
            </h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 inline-block">
              Active inventory in catalog
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Total Leads */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Total Leads
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900">
              {kpi?.totalLeads || 0}
            </h3>
            <span className="text-[11px] font-medium text-slate-500 mt-1 inline-block">
              Captured across portal
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users2 className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Active Enquiries */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Active Enquiries
            </p>
            <h3 className="text-3xl font-extrabold text-slate-900">
              {kpi?.activeEnquiries || 0}
            </h3>
            <span className="text-[11px] font-semibold text-amber-600 mt-1 inline-block">
              New, Contacted, Interested
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Converted Leads */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Converted Leads
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-extrabold text-emerald-600">
                {kpi?.convertedLeads || 0}
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {kpi?.conversionRate || 0}%
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 mt-1 inline-block">
              Successful closed deals
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CHART 1: Leads Pipeline Breakdown */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Leads Pipeline by Status
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Current volume of enquiries moving through sales stages
              </p>
            </div>
            <span className="p-2 bg-slate-50 text-slate-400 rounded-xl">
              <Users2 className="w-4 h-4" />
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts?.leadsByStatus || []}
                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="status"
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar
                  dataKey="count"
                  radius={[10, 10, 0, 0]}
                  barSize={40}
                >
                  {charts?.leadsByStatus?.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] || '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stat Pill Indicators */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-100 mt-2">
            {charts?.leadsByStatus?.map((item) => (
              <div key={item.status} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[item.status] }}
                ></span>
                <span className="font-semibold text-slate-700">{item.status}:</span>
                <span className="font-bold text-slate-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CHART 2: Property Inventory by Type (With Center Stat Donut) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Inventory by Property Type
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution of available real estate listings across categories
              </p>
            </div>
            <span className="p-2 bg-slate-50 text-slate-400 rounded-xl">
              <Layers className="w-4 h-4" />
            </span>
          </div>

          {/* Relative container for Donut + Center Stat Label */}
          <div className="relative h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomPieTooltip />} />
                <Pie
                  data={charts?.propertiesByType || []}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  cornerRadius={6}
                >
                  {charts?.propertiesByType?.map((entry, index) => (
                    <Cell
                      key={entry.type}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* High-End Center Donut Stat */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                {totalInventoryCount}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                Total Units
              </span>
            </div>
          </div>

          {/* Upgraded Modern Pill Legend */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-slate-100">
            {charts?.propertiesByType?.map((entry, index) => {
              const color = PIE_COLORS[index % PIE_COLORS.length];
              const percentage = totalInventoryCount > 0
                ? Math.round((entry.count / totalInventoryCount) * 100)
                : 0;

              return (
                <div
                  key={entry.type}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  ></span>
                  <span className="font-semibold">{entry.type}</span>
                  <span className="text-slate-400 font-medium">({entry.count} • {percentage}%)</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Recent Incoming Enquiries
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest leads captured directly from property listings
            </p>
          </div>
          <Link
            to="/crm/leads"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All Leads</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentLeads && recentLeads.length > 0 ? (
            recentLeads.map((lead) => (
              <div key={lead._id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{lead.name}</span>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${STATUS_COLORS[lead.status]}15`,
                        color: STATUS_COLORS[lead.status]
                      }}
                    >
                      {lead.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {lead.email} • {lead.phone}
                  </p>
                  <p className="text-xs text-slate-700 font-medium flex items-center gap-1.5 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-500" />
                    <span>Inquiring about: <strong>{lead.property?.title || 'Unknown Property'}</strong></span>
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                  </span>
                  <Link
                    to="/crm/leads"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Manage Lead
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No inquiries received yet. Submit an enquiry on the website to see it here!
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;