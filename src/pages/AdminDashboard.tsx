import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import { WorkerProfile, User, Booking, Report, ServiceCategory } from '../types';
import { formatPKR } from '../data/pakistanData';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Briefcase,
  Calendar,
  Layers,
  Flag,
  Search,
  Check,
  X,
  Phone,
  Eye,
  RefreshCw,
  Lock,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'approvals' | 'workers' | 'users' | 'bookings' | 'reports'>('approvals');

  const [stats, setStats] = useState<any>(null);
  const [pendingWorkers, setPendingWorkers] = useState<WorkerProfile[]>([]);
  const [allWorkers, setAllWorkers] = useState<WorkerProfile[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [reportsList, setReportsList] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Rejection modal
  const [rejectWorkerTarget, setRejectWorkerTarget] = useState<WorkerProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Selected Worker inspection modal
  const [inspectWorker, setInspectWorker] = useState<WorkerProfile | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [s, pend, allW, u, b, rep] = await Promise.all([
        ApiService.getAdminStats(),
        ApiService.getAdminWorkers('pending'),
        ApiService.getAdminWorkers(),
        ApiService.getAdminUsers(),
        ApiService.getAdminBookings(),
        ApiService.getAdminReports(),
      ]);

      setStats(s);
      setPendingWorkers(pend);
      setAllWorkers(allW);
      setUsersList(u);
      setBookingsList(b);
      setReportsList(rep);
    } catch (err) {
      console.error('Admin data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleApproveWorker = async (workerId: string) => {
    try {
      await ApiService.updateWorkerApproval(workerId, 'approved');
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Error approving worker');
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectWorkerTarget) return;
    try {
      await ApiService.updateWorkerApproval(rejectWorkerTarget.id, 'rejected', rejectionReason);
      setRejectWorkerTarget(null);
      setRejectionReason('');
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Error rejecting worker');
    }
  };

  const handleToggleWorkerStatus = async (workerId: string, currentStatus: string) => {
    const action = currentStatus === 'suspended' ? 'reactivate' : 'suspend';
    if (!confirm(`Are you sure you want to ${action} this worker account?`)) return;
    try {
      await ApiService.updateWorkerAccountStatus(workerId, action);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    try {
      await ApiService.resolveReport(reportId, status, `Admin ${user?.name} resolved on ${new Date().toLocaleDateString()}`);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Error resolving report');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-red-200 text-center space-y-3">
        <Lock className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-600">
          Administrator privileges are required to access this portal.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Admin Control Center
            </span>
            <span className="text-xs text-slate-400">Kaam Wala Pakistan Core</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Platform Moderation & Verification
          </h1>
          <p className="text-xs text-slate-400">
            Logged in as {user.name} ({user.email})
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Live Data</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Pending Approvals</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">
            {stats?.pendingWorkers || 0}
          </span>
          <span className="text-[10px] text-amber-700 font-medium">Needs Review</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Approved Workers</span>
          <span className="text-2xl font-black text-teal-700 mt-1 block">
            {stats?.approvedWorkers || 0}
          </span>
          <span className="text-[10px] text-slate-400">Active Listings</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Customers</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {stats?.totalCustomers || 0}
          </span>
          <span className="text-[10px] text-slate-400">Registered</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Bookings</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">
            {stats?.totalBookings || 0}
          </span>
          <span className="text-[10px] text-slate-400">
            {stats?.completedBookings || 0} Completed
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Reviews Count</span>
          <span className="text-2xl font-black text-amber-500 mt-1 block">
            {stats?.totalReviews || 0}
          </span>
          <span className="text-[10px] text-slate-400">User ratings</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Pending Reports</span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">
            {stats?.pendingReports || 0}
          </span>
          <span className="text-[10px] text-rose-700 font-medium">Complaints</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-3 rtl:space-x-reverse overflow-x-auto text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`pb-3 px-3 font-bold border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'approvals'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Worker Approvals ({pendingWorkers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('workers')}
          className={`pb-3 px-3 font-bold border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'workers'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>All Workers ({allWorkers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 px-3 font-bold border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'reports'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Flag className="w-4 h-4 text-rose-500" />
          <span>Reports & Complaints ({reportsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 px-3 font-bold border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'bookings'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Platform Bookings ({bookingsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-3 font-bold border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'users'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Users ({usersList.length})</span>
        </button>
      </div>

      {/* 1. Worker Approvals Queue */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              New Worker Profile Verification Queue
            </h2>
            <span className="text-xs text-slate-500">
              Screen phone number, CNIC format, and service skills before public listing
            </span>
          </div>

          {pendingWorkers.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Pending Worker Approvals</h3>
              <p>All newly registered workers have been processed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingWorkers.map(w => (
                <div key={w.id} className="bg-white p-5 rounded-2xl border-2 border-amber-300 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <img src={w.avatar} alt={w.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-slate-900 text-base">{w.name}</h3>
                          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                            Pending Approval
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {w.serviceCategory} • {w.city}, {w.province} ({w.area || 'Citywide'})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setInspectWorker(w)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                      >
                        Inspect Details
                      </button>
                      <button
                        onClick={() => setRejectWorkerTarget(w)}
                        className="px-3 py-1.5 border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-lg transition"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveWorker(w.id)}
                        className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition shadow-xs"
                      >
                        ✓ Approve & Publish
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-400 text-[10px] uppercase block">CNIC</span>
                      <span className="font-mono font-bold text-slate-800">{w.cnic || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 text-[10px] uppercase block">Phone / WhatsApp</span>
                      <span className="font-semibold text-slate-800">{w.phone}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 text-[10px] uppercase block">Experience</span>
                      <span className="font-semibold text-slate-800">{w.experienceYears} Years</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 text-[10px] uppercase block">Visiting Fee</span>
                      <span className="font-semibold text-slate-800">{formatPKR(w.visitingFee)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                    <span className="font-bold text-slate-800 block mb-0.5">Bio / Description:</span>
                    {w.bio}
                  </div>

                  <div className="flex flex-wrap gap-1 text-[11px]">
                    <span className="font-bold text-slate-400 mr-1">Skills:</span>
                    {w.subSkills.map((s, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. All Workers Management */}
      {activeTab === 'workers' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Worker</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">City / Area</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Jobs / Rating</th>
                  <th className="p-3.5 text-right rtl:text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allWorkers.map(w => (
                  <tr key={w.id} className="hover:bg-slate-50/70">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center space-x-2">
                      <img src={w.avatar} alt={w.name} className="w-7 h-7 rounded-lg object-cover" />
                      <span>{w.name}</span>
                    </td>
                    <td className="p-3.5 text-slate-700">{w.serviceCategory}</td>
                    <td className="p-3.5 text-slate-700">{w.city} ({w.area || 'All'})</td>
                    <td className="p-3.5 font-mono text-slate-700">{w.phone}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                        w.approvalStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        w.approvalStatus === 'pending' ? 'bg-amber-100 text-amber-800' :
                        w.approvalStatus === 'suspended' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {w.approvalStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700">
                      {w.totalCompletedJobs} jobs • ⭐ {w.ratingAverage > 0 ? w.ratingAverage : '5.0'}
                    </td>
                    <td className="p-3.5 text-right rtl:text-left space-x-1.5">
                      <button
                        onClick={() => handleToggleWorkerStatus(w.id, w.approvalStatus)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          w.approvalStatus === 'suspended'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {w.approvalStatus === 'suspended' ? 'Reactivate' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Reports & Complaints */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">User Complaints & Flagged Content</h2>

          {reportsList.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-xs text-slate-500">
              No reports filed.
            </div>
          ) : (
            <div className="space-y-3">
              {reportsList.map(rep => (
                <div key={rep.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        Report against {rep.targetWorkerName || 'Worker'}
                      </span>
                      <span className="text-xs text-slate-400 block">
                        Filed by {rep.reporterName} on {new Date(rep.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      rep.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                      rep.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {rep.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <div><strong>Reason:</strong> {rep.reason}</div>
                    {rep.details && <div><strong>Details:</strong> {rep.details}</div>}
                    {rep.adminNotes && <div className="text-teal-700 font-semibold">Note: {rep.adminNotes}</div>}
                  </div>

                  {rep.status === 'pending' && (
                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleResolveReport(rep.id, 'dismissed')}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                      >
                        Dismiss Report
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'resolved')}
                        className="px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg"
                      >
                        Mark Investigated & Resolved
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Platform Bookings */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">ID</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Worker</th>
                  <th className="p-3.5">Service</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookingsList.map(b => (
                  <tr key={b.id}>
                    <td className="p-3.5 font-mono text-slate-400 text-[10px]">#{b.id}</td>
                    <td className="p-3.5 font-bold text-slate-800">{b.customerName}</td>
                    <td className="p-3.5 text-slate-700">{b.workerName}</td>
                    <td className="p-3.5 text-teal-700 font-semibold">{b.serviceCategory}</td>
                    <td className="p-3.5 text-slate-600">{b.preferredDate}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                        b.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        b.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Registered Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">City / Province</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map(u => (
                  <tr key={u.id}>
                    <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3.5 text-slate-600">{u.email}</td>
                    <td className="p-3.5 font-mono text-slate-700">{u.phone}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        u.role === 'worker' ? 'bg-teal-100 text-teal-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600">{u.city}, {u.province}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Worker Modal */}
      {rejectWorkerTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-base mb-1">
              Reject Worker Profile: {rejectWorkerTarget.name}
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Specify the reason. The worker will see this in their dashboard so they can fix and resubmit.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-3">
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="e.g. Unreachable phone number, invalid CNIC format, or duplicate profile..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl"
              />

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectWorkerTarget(null)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Worker Modal */}
      {inspectWorker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base">Full Profile Inspection</h3>
              <button onClick={() => setInspectWorker(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <img src={inspectWorker.avatar} alt={inspectWorker.name} className="w-16 h-16 rounded-xl object-cover" />
              <div>
                <h4 className="font-black text-slate-900 text-lg">{inspectWorker.name}</h4>
                <p className="text-xs text-teal-700 font-bold">{inspectWorker.serviceCategory}</p>
                <p className="text-xs text-slate-500">{inspectWorker.city}, {inspectWorker.province}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
              <div>
                <span className="font-bold text-slate-400 block text-[10px]">Full CNIC:</span>
                <span className="font-mono font-bold text-slate-900">{inspectWorker.cnic || 'None'}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block text-[10px]">Phone Number:</span>
                <span className="font-bold text-slate-900">{inspectWorker.phone}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block text-[10px]">WhatsApp:</span>
                <span className="font-bold text-slate-900">{inspectWorker.whatsapp}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block text-[10px]">Visiting Charges:</span>
                <span className="font-bold text-slate-900">{formatPKR(inspectWorker.visitingFee)}</span>
              </div>
            </div>

            <div className="text-xs text-slate-700 space-y-1">
              <strong className="block text-slate-900">Bio:</strong>
              <p className="p-2.5 bg-slate-50 rounded-lg">{inspectWorker.bio}</p>
            </div>

            <button
              onClick={() => setInspectWorker(null)}
              className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
