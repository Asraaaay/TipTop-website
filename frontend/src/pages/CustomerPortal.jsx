import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Loader2, LogOut } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const CustomerPortal = () => {
  const { user, loading, login, register, logout } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [bookings, setBookings] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setBusy(true);
      const response = await axios.get(`${BACKEND_URL}/api/customer/bookings`, {
        withCredentials: true,
      });
      setBookings(response.data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to load your bookings");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "customer") {
      fetchBookings();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        });
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-teal" /></div>;
  }

  if (user && user.role === "customer") {
    return (
      <div className="min-h-screen bg-crisp-gray p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-outfit font-bold text-navy">My Orders</h1>
              <p className="text-slate-600 font-dm-sans">Track your booking status in real time.</p>
            </div>
            <button className="flex items-center gap-2 text-sm font-dm-sans text-slate-600" onClick={logout}>
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="p-3 text-sm">Booking ID</th>
                  <th className="p-3 text-sm">Service</th>
                  <th className="p-3 text-sm">Pickup</th>
                  <th className="p-3 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-slate-100">
                    <td className="p-3 text-sm">{booking.id}</td>
                    <td className="p-3 text-sm">{booking.service}</td>
                    <td className="p-3 text-sm">{booking.pickup_date} ({booking.pickup_time})</td>
                    <td className="p-3 text-sm capitalize">{booking.status}</td>
                  </tr>
                ))}
                {!bookings.length && !busy && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500 text-sm">No bookings yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-crisp-gray p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-6">
        <h1 className="text-2xl font-outfit font-bold text-navy mb-2">Customer Login</h1>
        <p className="text-sm text-slate-600 mb-6">Sign in to track your orders.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <input className="w-full border rounded-md p-2" placeholder="Full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
              <input className="w-full border rounded-md p-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} required />
            </>
          )}
          <input className="w-full border rounded-md p-2" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
          <input className="w-full border rounded-md p-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required minLength={8} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={busy} className="w-full bg-teal text-white rounded-md py-2 font-medium">
            {busy ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>

        <button className="mt-4 text-sm text-teal" onClick={() => setMode((m) => (m === "login" ? "register" : "login"))}>
          {mode === "login" ? "Need an account? Register" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};
