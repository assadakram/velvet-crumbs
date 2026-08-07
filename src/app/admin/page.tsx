'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Shield,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Clock,
  MessageSquare,
  Save,
  CheckCircle,
  XCircle,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react';

interface PreorderSettings {
  isPaused: boolean;
  resumeDate: string | null;
  resumeTime: string | null;
  pausedMessageEn: string | null;
  pausedMessageFi: string | null;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [authError, setAuthError] = useState('');
  const [logoError, setLogoError] = useState(false);

  const [settings, setSettings] = useState<PreorderSettings>({
    isPaused: false,
    resumeDate: '',
    resumeTime: '',
    pausedMessageEn: '',
    pausedMessageFi: '',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const [initializing, setInitializing] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);

  // Check if user is already authenticated via HttpOnly cookie on mount
  useEffect(() => {
    fetch('/api/preorder-settings', {
      headers: {
        'x-admin-validate': 'true',
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return null;
      })
      .then((data: PreorderSettings | null) => {
        if (data) {
          setSettings({
            isPaused: data.isPaused ?? false,
            resumeDate: data.resumeDate ?? '',
            resumeTime: data.resumeTime ?? '',
            pausedMessageEn: data.pausedMessageEn ?? '',
            pausedMessageFi: data.pausedMessageFi ?? '',
          });
          setAuthenticated(true);
        }
      })
      .catch((err) => {
        console.error('Failed to auto-authenticate:', err);
      })
      .finally(() => {
        setInitializing(false);
      });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretInput.trim()) {
      setAuthError('Please enter the admin secret.');
      return;
    }
    setLoggingIn(true);
    setAuthError('');
    try {
      const res = await fetch('/api/preorder-settings/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secret: secretInput }),
      });
      if (res.status === 401) {
        setAuthError('Invalid credentials. Please try again.');
        return;
      }
      if (!res.ok) {
        setAuthError('Server error. Please try again later.');
        return;
      }

      // Successfully authenticated and cookie set, now fetch the settings
      const settingsRes = await fetch('/api/preorder-settings', {
        headers: {
          'x-admin-validate': 'true',
        },
      });
      if (settingsRes.ok) {
        const data: PreorderSettings = await settingsRes.json();
        setSettings({
          isPaused: data.isPaused ?? false,
          resumeDate: data.resumeDate ?? '',
          resumeTime: data.resumeTime ?? '',
          pausedMessageEn: data.pausedMessageEn ?? '',
          pausedMessageFi: data.pausedMessageFi ?? '',
        });
        setAuthenticated(true);
      } else {
        setAuthError('Authentication succeeded but failed to load settings.');
      }
    } catch {
      setAuthError('Network error. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/preorder-settings/logout', {
        method: 'POST',
      });
    } catch (err) {
      console.error('Sign out request failed:', err);
    }
    setAuthenticated(false);
    setSecretInput('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/preorder-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPaused: settings.isPaused,
          resumeDate: settings.resumeDate || null,
          resumeTime: settings.resumeTime || null,
          pausedMessageEn: settings.pausedMessageEn || null,
          pausedMessageFi: settings.pausedMessageFi || null,
        }),
      });

      if (res.status === 401) {
        showToast('Unauthorized. Please log in again.', 'error');
        setAuthenticated(false);
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'Failed to save settings.', 'error');
        return;
      }

      showToast('Settings saved successfully!', 'success');
    } catch {
      showToast('Network error. Could not save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Show a full-screen loading spinner while checking authentication on mount
  if (initializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#fff4ef] to-[#ffe8df] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-[#F48B7D] animate-spin" />
      </div>
    );
  }

  // ── Login Screen ────────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#fff4ef] to-[#ffe8df] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto h-20 w-20 rounded-full bg-white shadow-lg overflow-hidden flex items-center justify-center mb-4 border-4 border-orange-100">
              {logoError ? (
                <span className="text-2xl font-serif font-bold text-[#F48B7D]">VC</span>
              ) : (
                <Image
                  src="/images/Logo.jpg"
                  alt="Velvet Crumbs"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  onError={() => setLogoError(true)}
                />
              )}
            </div>
            <h1 className="text-2xl font-extrabold font-serif text-[#2D2D2D]">Velvet Crumbs</h1>
            <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
              <div className="h-10 w-10 rounded-2xl bg-rose-50 flex items-center justify-center">
                <Lock className="h-5 w-5 text-[#F48B7D]" />
              </div>
              <div>
                <h2 className="font-bold text-[#2D2D2D] text-lg leading-tight">Secure Access</h2>
                <p className="text-xs text-gray-400">Enter your admin secret to continue</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Admin Secret
                </label>
                <div className="relative">
                  <input
                    id="admin-secret-input"
                    type={showSecret ? 'text' : 'password'}
                    value={secretInput}
                    onChange={(e) => setSecretInput(e.target.value)}
                    disabled={loggingIn}
                    placeholder="Enter admin secret key..."
                    autoComplete="current-password"
                    className="w-full bg-[#FFF9F5] border border-orange-100 rounded-2xl px-4 py-3 pr-12 text-sm text-[#2D2D2D] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F48B7D]/40 focus:border-[#F48B7D] transition-all disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    disabled={loggingIn}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F48B7D] transition-colors disabled:pointer-events-none"
                    aria-label="Toggle password visibility"
                  >
                    {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {authError && (
                  <p className="text-xs text-rose-500 mt-2 flex items-center gap-1">
                    <XCircle className="h-3 w-3" /> {authError}
                  </p>
                )}
              </div>

              <button
                id="admin-login-btn"
                type="submit"
                disabled={loggingIn}
                className="w-full bg-gradient-to-r from-rose-400 to-[#F48B7D] text-white font-bold py-3 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
              >
                {loggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Access Admin Panel
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            Velvet Crumbs Admin · Restricted Area
          </p>
        </div>
      </div>
    );
  }

  // ── Admin Dashboard ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] via-[#fff4ef] to-[#ffe8df]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white shadow-sm overflow-hidden border-2 border-orange-100">
              {logoError ? (
                <span className="text-xs font-serif font-bold text-[#F48B7D] flex items-center justify-center h-full">VC</span>
              ) : (
                <Image
                  src="/images/Logo.jpg"
                  alt="Velvet Crumbs"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  onError={() => setLogoError(true)}
                />
              )}
            </div>
            <div>
              <span className="font-extrabold font-serif text-[#F48B7D] text-base leading-tight block">Velvet Crumbs</span>
              <span className="text-xs text-gray-400 font-medium">Admin Panel</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <Shield className="h-3 w-3" /> Authenticated
            </div>
            <button
              id="admin-signout-btn"
              onClick={handleSignOut}
              className="text-xs font-bold text-gray-400 hover:text-rose-500 transition-colors px-3 py-1.5 rounded-full border border-gray-100 hover:border-rose-100 hover:bg-rose-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[#F48B7D] text-xs font-bold uppercase tracking-widest block">Pre-Order Control</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#2D2D2D]">Order Settings</h1>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Control order availability, set resume times, and customize the pause banner shown to customers.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 text-[#F48B7D] animate-spin" />
          </div>
        ) : (
          <form id="admin-settings-form" onSubmit={handleSave} className="space-y-6">

            {/* ── Pause Toggle ──────────────────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
              <div className="px-6 pt-6 pb-5">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0 mt-0.5">
                    {settings.isPaused
                      ? <ToggleRight className="h-5 w-5 text-[#F48B7D]" />
                      : <ToggleLeft className="h-5 w-5 text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-[#2D2D2D] text-base">Pause Pre-Orders</h2>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                      When enabled, the order form is hidden and customers see the pause banner instead.
                    </p>
                  </div>
                  <button
                    id="pause-toggle-btn"
                    type="button"
                    onClick={() => setSettings(s => ({ ...s, isPaused: !s.isPaused }))}
                    aria-pressed={settings.isPaused}
                    aria-label="Toggle pre-order pause"
                    className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F48B7D]/40 mt-0.5 ${
                      settings.isPaused ? 'bg-[#F48B7D] border-[#F48B7D]' : 'bg-gray-200 border-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                        settings.isPaused ? 'translate-x-7' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
                    settings.isPaused
                      ? 'bg-rose-50 text-rose-600 border border-rose-100'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${settings.isPaused ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                    {settings.isPaused ? 'Pre-orders PAUSED' : 'Pre-orders OPEN'}
                  </span>
                  {settings.isPaused && (
                    <span className="text-xs text-gray-400">Customers cannot place orders</span>
                  )}
                </div>
              </div>

              {settings.isPaused && (
                <div className="mx-6 mb-6 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 leading-relaxed font-medium">
                    Orders are currently paused. Customers will see the pause banner on the order page. Save settings after making changes.
                  </p>
                </div>
              )}
            </div>

            {/* ── Resume Date & Time ────────────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-6 space-y-5">
              <div className="flex items-start gap-4 border-b border-gray-50 pb-5">
                <div className="h-11 w-11 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="font-bold text-[#2D2D2D] text-base">Resume Date &amp; Time</h2>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    Optional. When set, orders auto-resume at this Helsinki time and the resume date is shown in the banner.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="resumeDate" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Resume Date
                  </label>
                  <input
                    id="resumeDate"
                    type="date"
                    value={settings.resumeDate ?? ''}
                    onChange={(e) => setSettings(s => ({ ...s, resumeDate: e.target.value }))}
                    className="w-full bg-[#FFF9F5] border border-orange-100 rounded-2xl px-4 py-3 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#F48B7D]/40 focus:border-[#F48B7D] transition-all cursor-pointer"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">Format: DD.MM.YYYY (e.g. 30.06.2026)</p>
                </div>

                <div>
                  <label htmlFor="resumeTime" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    Resume Time (Helsinki)
                  </label>
                  <input
                    id="resumeTime"
                    type="time"
                    value={settings.resumeTime ?? ''}
                    onChange={(e) => setSettings(s => ({ ...s, resumeTime: e.target.value }))}
                    className="w-full bg-[#FFF9F5] border border-orange-100 rounded-2xl px-4 py-3 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#F48B7D]/40 focus:border-[#F48B7D] transition-all cursor-pointer"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">12-hour format (e.g. 04:30 PM)</p>
                </div>
              </div>

              {(settings.resumeDate || settings.resumeTime) && (
                <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-xs text-gray-500 flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span>
                    Resume set for:{' '}
                    <strong className="text-[#2D2D2D]">
                      {(() => {
                        if (!settings.resumeDate) return '—';
                        const parts = settings.resumeDate.split('-');
                        return parts.length === 3 ? `${parts[2]}.${parts[1]}.${parts[0]}` : settings.resumeDate;
                      })()} at {(() => {
                        if (!settings.resumeTime) return '12:00 AM';
                        const parts = settings.resumeTime.split(':');
                        if (parts.length >= 2) {
                          let hour = parseInt(parts[0], 10);
                          const minute = parts[1];
                          const ampm = hour >= 12 ? 'PM' : 'AM';
                          hour = hour % 12;
                          hour = hour ? hour : 12;
                          return `${String(hour).padStart(2, '0')}:${minute} ${ampm}`;
                        }
                        return settings.resumeTime;
                      })()} (Helsinki time)
                    </strong>
                  </span>
                </div>
              )}
            </div>

            {/* ── Banner Messages ───────────────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-orange-100 shadow-sm p-6 space-y-5">
              <div className="flex items-start gap-4 border-b border-gray-50 pb-5">
                <div className="h-11 w-11 rounded-2xl bg-violet-50 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h2 className="font-bold text-[#2D2D2D] text-base">Pause Banner Messages</h2>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    Optional. Leave blank to use auto-generated defaults that include the resume date.
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="pausedMessageEn" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  🇬🇧 English Message
                </label>
                <textarea
                  id="pausedMessageEn"
                  rows={3}
                  value={settings.pausedMessageEn ?? ''}
                  onChange={(e) => setSettings(s => ({ ...s, pausedMessageEn: e.target.value }))}
                  placeholder="We are fully booked right now. New orders will open on [date]. Follow us on Instagram for updates!"
                  className="w-full bg-[#FFF9F5] border border-orange-100 rounded-2xl px-4 py-3 text-sm text-[#2D2D2D] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F48B7D]/40 focus:border-[#F48B7D] transition-all resize-none leading-relaxed"
                />
                <p className="text-xs text-gray-400 mt-1.5">Shown to customers viewing the site in English.</p>
              </div>

              <div>
                <label htmlFor="pausedMessageFi" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  🇫🇮 Finnish Message (Suomi)
                </label>
                <textarea
                  id="pausedMessageFi"
                  rows={3}
                  value={settings.pausedMessageFi ?? ''}
                  onChange={(e) => setSettings(s => ({ ...s, pausedMessageFi: e.target.value }))}
                  placeholder="Olemme tällä hetkellä täynnä. Uudet tilaukset avautuvat [päivämäärä]. Seuraa meitä Instagramissa!"
                  className="w-full bg-[#FFF9F5] border border-orange-100 rounded-2xl px-4 py-3 text-sm text-[#2D2D2D] placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F48B7D]/40 focus:border-[#F48B7D] transition-all resize-none leading-relaxed"
                />
                <p className="text-xs text-gray-400 mt-1.5">Näytetään suomeksi selaaville asiakkaille.</p>
              </div>
            </div>

            {/* ── Save Button ───────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-3xl border border-orange-100 shadow-sm px-6 py-5">
              <div className="text-xs text-gray-400 text-center sm:text-left">
                Changes are saved to the server and take effect immediately on the order page.
              </div>
              <button
                id="save-settings-btn"
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-rose-400 to-[#F48B7D] text-white font-bold px-8 py-3.5 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Settings
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </main>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl border text-sm font-bold animate-bounce ${
          toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
            : 'bg-rose-50 border-rose-100 text-rose-800'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle className="h-4 w-4 text-emerald-500" />
            : <XCircle className="h-4 w-4 text-rose-500" />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
