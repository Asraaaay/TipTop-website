import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  LogOut,
  Trash2,
  MessageCircle,
  Phone,
  RefreshCw,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_c461b78e-65c5-4db1-8a61-81ada40ad421/artifacts/wgklteuq_image.png";
const ADMIN_WHATSAPP = "911234567890";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const statusIcons = {
  pending: Clock,
  confirmed: CalendarCheck,
  completed: CheckCircle,
  cancelled: XCircle,
};

export const AdminDashboard = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/admin/stats`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/admin/bookings`, { withCredentials: true }),
      ]);
      setStats(statsRes.data);
      setBookings(bookingsRes.data.bookings);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await axios.put(
        `${BACKEND_URL}/api/admin/bookings/${bookingId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      // Refresh stats
      const statsRes = await axios.get(`${BACKEND_URL}/api/admin/stats`, { withCredentials: true });
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error updating booking:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    
    setDeletingId(bookingId);
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/bookings/${bookingId}`, {
        withCredentials: true,
      });
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      // Refresh stats
      const statsRes = await axios.get(`${BACKEND_URL}/api/admin/stats`, { withCredentials: true });
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error deleting booking:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const openWhatsApp = (booking) => {
    const message = encodeURIComponent(
      `Hi ${booking.name},\n\nYour booking at Tip Top Dry Cleaning Studio:\n` +
      `📋 Service: ${booking.service}\n` +
      `📅 Pickup: ${booking.pickup_date} (${booking.pickup_time})\n` +
      `📍 Address: ${booking.address}\n` +
      `📊 Status: ${booking.status.toUpperCase()}\n\n` +
      `Thank you for choosing us!`
    );
    window.open(`https://wa.me/${booking.phone.replace(/\D/g, '')}?text=${message}`, "_blank");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const filteredBookings = filterStatus === "all" 
    ? bookings 
    : bookings.filter((b) => b.status === filterStatus);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-crisp-gray flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crisp-gray" data-testid="admin-dashboard">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Logo" className="h-10" />
              <div>
                <h1 className="font-outfit font-bold text-navy text-lg">Admin Dashboard</h1>
                <p className="font-dm-sans text-xs text-slate-500">Tip Top Dry Cleaning</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-dm-sans text-sm text-slate-600 hidden sm:block">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors font-dm-sans text-sm"
                data-testid="logout-btn"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <StatCard
              title="Total"
              value={stats.total}
              icon={LayoutDashboard}
              color="bg-navy"
            />
            <StatCard
              title="Pending"
              value={stats.pending}
              icon={Clock}
              color="bg-yellow-500"
            />
            <StatCard
              title="Confirmed"
              value={stats.confirmed}
              icon={CalendarCheck}
              color="bg-blue-500"
            />
            <StatCard
              title="Completed"
              value={stats.completed}
              icon={CheckCircle}
              color="bg-green-500"
            />
            <StatCard
              title="Cancelled"
              value={stats.cancelled}
              icon={XCircle}
              color="bg-red-500"
            />
            <StatCard
              title="Today"
              value={stats.today}
              icon={CalendarCheck}
              color="bg-teal"
            />
          </div>
        )}

        {/* Bookings Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-outfit font-bold text-lg text-navy flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-teal" />
              Bookings
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px] font-dm-sans" data-testid="filter-status">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <button
                onClick={fetchData}
                className="p-2 text-slate-600 hover:text-teal hover:bg-slate-100 rounded-md transition-colors"
                data-testid="refresh-btn"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-dm-sans font-medium text-slate-600 text-sm">Customer</th>
                  <th className="px-4 py-3 text-left font-dm-sans font-medium text-slate-600 text-sm">Service</th>
                  <th className="px-4 py-3 text-left font-dm-sans font-medium text-slate-600 text-sm">Pickup</th>
                  <th className="px-4 py-3 text-left font-dm-sans font-medium text-slate-600 text-sm">Status</th>
                  <th className="px-4 py-3 text-left font-dm-sans font-medium text-slate-600 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking) => {
                  const StatusIcon = statusIcons[booking.status] || Clock;
                  return (
                    <tr key={booking.id} className="hover:bg-slate-50" data-testid={`booking-row-${booking.id}`}>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-dm-sans font-medium text-navy">{booking.name}</p>
                          <p className="font-dm-sans text-sm text-slate-500">{booking.phone}</p>
                          <p className="font-dm-sans text-xs text-slate-400 truncate max-w-[200px]">{booking.address}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-dm-sans text-sm text-slate-700 capitalize">
                          {booking.service.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-dm-sans text-sm text-navy">{booking.pickup_date}</p>
                        <p className="font-dm-sans text-xs text-slate-500">{booking.pickup_time}</p>
                      </td>
                      <td className="px-4 py-4">
                        <Select
                          value={booking.status}
                          onValueChange={(value) => handleStatusUpdate(booking.id, value)}
                          disabled={updatingId === booking.id}
                        >
                          <SelectTrigger
                            className={`w-[130px] font-dm-sans text-xs border ${statusColors[booking.status]}`}
                            data-testid={`status-select-${booking.id}`}
                          >
                            <div className="flex items-center gap-2">
                              {updatingId === booking.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <StatusIcon className="w-3 h-3" />
                              )}
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openWhatsApp(booking)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                            title="Send WhatsApp"
                            data-testid={`whatsapp-btn-${booking.id}`}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <a
                            href={`tel:${booking.phone}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Call Customer"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            disabled={deletingId === booking.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                            title="Delete"
                            data-testid={`delete-btn-${booking.id}`}
                          >
                            {deletingId === booking.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredBookings.map((booking) => {
              const StatusIcon = statusIcons[booking.status] || Clock;
              return (
                <div key={booking.id} className="p-4" data-testid={`booking-card-${booking.id}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-dm-sans font-medium text-navy">{booking.name}</p>
                      <p className="font-dm-sans text-sm text-slate-500">{booking.phone}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-dm-sans border ${statusColors[booking.status]} flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {booking.status}
                    </span>
                  </div>
                  <p className="font-dm-sans text-sm text-slate-600 mb-2 capitalize">
                    {booking.service.replace("-", " ")}
                  </p>
                  <p className="font-dm-sans text-xs text-slate-500 mb-3">
                    {booking.pickup_date} • {booking.pickup_time}
                  </p>
                  <div className="flex items-center gap-2">
                    <Select
                      value={booking.status}
                      onValueChange={(value) => handleStatusUpdate(booking.id, value)}
                      disabled={updatingId === booking.id}
                    >
                      <SelectTrigger className="flex-1 font-dm-sans text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <button
                      onClick={() => openWhatsApp(booking)}
                      className="p-2 text-green-600 bg-green-50 rounded-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      disabled={deletingId === booking.id}
                      className="p-2 text-red-600 bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBookings.length === 0 && (
            <div className="p-8 text-center">
              <p className="font-dm-sans text-slate-500">No bookings found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl p-4 border border-slate-200">
    <div className="flex items-center justify-between mb-2">
      <span className="font-dm-sans text-sm text-slate-600">{title}</span>
      <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
    </div>
    <p className="font-outfit font-bold text-2xl text-navy">{value}</p>
  </div>
);
