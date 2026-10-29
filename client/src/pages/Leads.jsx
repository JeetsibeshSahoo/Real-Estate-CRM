import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  Search,
  Users2,
  Mail,
  Phone,
  Trash2,
  X,
  CheckCircle2,
} from 'lucide-react';

const STATUS_OPTIONS = ['All', 'New', 'Contacted', 'Interested', 'Converted', 'Lost'];

const STATUS_COLORS = {
  New: 'bg-blue-50 text-blue-700 border-blue-200',
  Contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  Interested: 'bg-purple-50 text-purple-700 border-purple-200',
  Converted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Lost: 'bg-rose-50 text-rose-700 border-rose-200'
};

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Lead for Modal View/Edit
  const [activeLead, setActiveLead] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [updating, setUpdating] = useState(false);

  // Fetch leads from backend
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== 'All') params.append('status', selectedStatus);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await api.get(`/leads?${params.toString()}`);
      if (res.data.success) {
        setLeads(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLeads();
  };

  // Open Lead Action Modal
  const openLeadModal = (lead) => {
    setActiveLead(lead);
    setNewStatus(lead.status);
    setStatusNote('');
    setNewNoteText('');
  };

  // Close Modal
  const closeModal = () => {
    setActiveLead(null);
  };

  // Update Status Handler (PATCH /api/leads/:id/status)
  const handleStatusUpdate = async () => {
    if (!activeLead) return;
    setUpdating(true);
    try {
      const res = await api.patch(`/leads/${activeLead._id}/status`, {
        status: newStatus,
        noteText: statusNote.trim() || undefined
      });

      if (res.data.success) {
        // Update active modal lead
        setActiveLead(res.data.data);
        // Refresh table list
        fetchLeads();
        setStatusNote('');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdating(false);
    }
  };

  // Add Follow-up Note Handler (POST /api/leads/:id/notes)
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !activeLead) return;

    setUpdating(true);
    try {
      const res = await api.post(`/leads/${activeLead._id}/notes`, {
        text: newNoteText.trim()
      });

      if (res.data.success) {
        setActiveLead((prev) => ({
          ...prev,
          notes: res.data.data
        }));
        setNewNoteText('');
        fetchLeads();
      }
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setUpdating(false);
    }
  };

  // Delete Lead Handler
  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await api.delete(`/leads/${leadId}`);
      if (res.data.success) {
        closeModal();
        fetchLeads();
      }
    } catch (error) {
      console.error('Failed to delete lead:', error);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Lead Management Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Capture, qualify, update statuses, and log follow-up notes for every client enquiry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-200">
            Total Inquiries: {leads.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </form>

      </div>

      {/* Leads Table / Mobile Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-16 bg-slate-100 rounded-xl"></div>
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Users2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-600">No leads found</p>
            <p className="text-[11px] text-slate-400">Try choosing a different status filter or clearing your search.</p>
          </div>
        ) : (
          <>
            {/* 1. MOBILE CARDS VIEW (No horizontal scrolling on phone) */}
            <div className="sm:hidden divide-y divide-slate-100">
              {leads.map((lead) => (
                <div key={lead._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{lead.name}</h4>
                      <p className="text-xs text-slate-500">{lead.email}</p>
                      <p className="text-xs text-slate-500">{lead.phone}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[lead.status] || 'bg-slate-100'}`}>
                      {lead.status}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl text-xs">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Interested Property</p>
                    <p className="font-semibold text-slate-800 truncate">{lead.property?.title || 'Unknown Property'}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[11px] text-slate-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => openLeadModal(lead)}
                      className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-sm"
                    >
                      Manage Lead
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. DESKTOP / TABLET TABLE VIEW */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Lead / Contact</th>
                    <th className="py-3.5 px-4 sm:px-6">Interested Property</th>
                    <th className="py-3.5 px-4 sm:px-6">Status</th>
                    <th className="py-3.5 px-4 sm:px-6">Inquiry Date</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-4 sm:px-6">
                        <div className="font-bold text-slate-900 text-sm mb-0.5">{lead.name}</div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{lead.email}</span>
                        </div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{lead.phone}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 sm:px-6 max-w-xs">
                        {lead.property ? (
                          <div>
                            <p className="font-semibold text-slate-800 line-clamp-1">{lead.property.title}</p>
                            <p className="text-slate-400 text-[11px]">
                              ${lead.property.price?.toLocaleString()} • {lead.property.location?.city}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Property no longer listed</span>
                        )}
                      </td>

                      <td className="py-4 px-4 sm:px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${STATUS_COLORS[lead.status] || 'bg-slate-100'}`}>
                          {lead.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-slate-500 text-[11px]">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right">
                        <button
                          onClick={() => openLeadModal(lead)}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {activeLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400">
                  Lead Management File
                </span>
                <h3 className="text-lg font-bold mt-0.5">{activeLead.name}</h3>
                <p className="text-xs text-slate-400">{activeLead.email} • {activeLead.phone}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Interested Property Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Interested Property
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {activeLead.property?.title || 'Unknown Property'}
                    </h4>
                    <p className="text-xs text-blue-600 font-bold mt-0.5">
                      ${activeLead.property?.price?.toLocaleString()} USD
                    </p>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {activeLead.property?.propertyType}
                  </span>
                </div>
              </div>

              {/* Inquiry Message */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Visitor's Message
                </span>
                <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed italic">
                  "{activeLead.message}"
                </p>
              </div>

              {/* UPDATE STATUS SECTION */}
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Pipeline Status Transition
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[activeLead.status]}`}>
                    Current: {activeLead.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      New Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      {['New', 'Contacted', 'Interested', 'Converted', 'Lost'].map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      Transition Note (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Called client, showed interest"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  disabled={updating || newStatus === activeLead.status}
                  onClick={handleStatusUpdate}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Apply Status Update</span>
                </button>
              </div>

              {/* FOLLOW-UP NOTES TIMELINE */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Follow-up Activity Timeline
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {activeLead.notes?.length || 0} entries
                  </span>
                </div>

                {/* Add New Note Box */}
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Add follow-up notes (e.g. Sent brochure, client requested loan info)..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-grow p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="submit"
                    disabled={updating || !newNoteText.trim()}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0"
                  >
                    Add Note
                  </button>
                </form>

                {/* Notes History List */}
                <div className="space-y-2.5 max-h-48 overflow-y-auto">
                  {activeLead.notes && activeLead.notes.length > 0 ? (
                    activeLead.notes.slice().reverse().map((note, index) => (
                      <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-600">{note.addedBy}</span>
                          <span>{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-700">{note.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">No notes logged yet.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteLead(activeLead._id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Lead</span>
              </button>

              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Leads;