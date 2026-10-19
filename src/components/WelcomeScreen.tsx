import React, { useState } from 'react';
import { useBio } from '../context/BioContext';
import { getUsers, exportUsersExcel } from '../utils/authStorage';
import {
  Dna,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Download,
} from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { login, signup, quickDemoLogin, setActiveTab } = useBio();
  const [activeMode, setActiveMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await login(username, password);
      if (res.success) {
        setSuccessMsg(res.message);
        setActiveTab('home');
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setErrorMsg('An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    setLoading(true);
    try {
      const res = await signup(username, password, confirmPassword);
      if (res.success) {
        setSuccessMsg(res.message);
        setActiveTab('home');
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setErrorMsg('An unexpected error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    quickDemoLogin();
    setActiveTab('home');
  };

  const allUsers = getUsers();

  return (
    <div className="min-h-screen bg-[#FFF9F7] text-[#49343D] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Subtle warm ivory and blush glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(248,225,231,0.6),rgba(255,249,247,0))] pointer-events-none" />

      {/* Clean Header Bar */}
      <header className="relative z-10 border-b border-[#E8BFCB] bg-white px-6 py-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#F8E1E7] border border-[#E8BFCB] flex items-center justify-center text-[#D4AF72] shadow-sm">
            <Dna className="w-5 h-5 text-[#D4AF72]" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-[#49343D]">
              Bioinformatics Analysis Suite (BAS)
            </h1>
            <p className="text-xs text-[#49343D]/70 font-medium">Integrated Platform for Biological Sequence Analysis</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowUsersModal(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#49343D] bg-[#FFF9F7] hover:bg-[#F8E1E7] border border-[#E8BFCB] transition shadow-2xs"
            title="Inspect stored user records"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#D4AF72]" />
            <span>User Records ({allUsers.length})</span>
          </button>
          <button
            onClick={handleQuickDemo}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#D4AF72] hover:bg-[#c49e62] shadow-sm transition"
          >
            <span>Demo Login</span>
          </button>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-[#E8BFCB] rounded-2xl shadow-xl p-8 transition-all">
          
          {/* Card Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#49343D] tracking-tight">
              {activeMode === 'LOGIN' ? 'User Login' : 'Create Account'}
            </h2>
            <p className="text-xs text-[#49343D]/70 mt-1">
              {activeMode === 'LOGIN'
                ? 'Sign in to access your sequence analyses and pipeline'
                : 'Register for a unique Bioinformatics User ID'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-[#FFF9F7] rounded-xl border border-[#E8BFCB] mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveMode('LOGIN');
                resetForm();
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                activeMode === 'LOGIN'
                  ? 'bg-white text-[#49343D] shadow-xs font-bold'
                  : 'text-[#49343D]/70 hover:text-[#49343D]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMode('SIGNUP');
                resetForm();
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                activeMode === 'SIGNUP'
                  ? 'bg-white text-[#49343D] shadow-xs font-bold'
                  : 'text-[#49343D]/70 hover:text-[#49343D]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Validation Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-[#F8E1E7] border border-rose-300 rounded-xl flex items-start space-x-2.5 text-xs text-rose-900">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-[#FFF9F7] border border-emerald-300 rounded-xl flex items-start space-x-2.5 text-xs text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          {activeMode === 'LOGIN' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#49343D] mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#D4AF72] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter username (e.g. admin)"
                    className="w-full bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#49343D] placeholder-[#49343D]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF72] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#49343D] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#D4AF72] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#49343D] placeholder-[#49343D]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF72] transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#D4AF72] hover:bg-[#c49e62] text-white font-semibold rounded-xl text-xs shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 text-center text-xs text-[#49343D]/60">
                Default Credentials: <span className="text-[#49343D] font-mono font-semibold">admin</span> / <span className="text-[#49343D] font-mono font-semibold">bio1234</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#49343D] mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#D4AF72] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#49343D] placeholder-[#49343D]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF72] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#49343D] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#D4AF72] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#49343D] placeholder-[#49343D]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF72] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#49343D] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF72] absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password to confirm"
                    className="w-full bg-[#FFF9F7] border border-[#E8BFCB] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#49343D] placeholder-[#49343D]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF72] transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#D4AF72] hover:bg-[#c49e62] text-white font-semibold rounded-xl text-xs shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Creating Account...' : 'Register'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-[#49343D]/60 text-center">
                System automatically assigns sequential ID (e.g. <span className="font-mono text-[#D4AF72] font-bold">BIO00{allUsers.length + 1}</span>) with SHA-256 password security.
              </p>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#E8BFCB] bg-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#49343D]/70 gap-2">
        <div>
          Bioinformatics Analysis Suite (BAS) &bull; Integrated Platform for Biological Sequence Analysis
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleQuickDemo}
            className="text-[#D4AF72] hover:underline font-semibold"
          >
            Direct Demo Access &rarr;
          </button>
        </div>
      </footer>

      {/* Users Records Modal */}
      {showUsersModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8BFCB] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-[#E8BFCB] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <FileSpreadsheet className="w-5 h-5 text-[#D4AF72]" />
                <div>
                  <h3 className="text-sm font-bold text-[#49343D]">User Registry Records</h3>
                  <p className="text-xs text-[#49343D]/70">{allUsers.length} registered accounts</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportUsersExcel}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#D4AF72] hover:bg-[#c49e62] text-white text-xs font-semibold rounded-xl transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .xlsx</span>
                </button>
                <button
                  onClick={() => setShowUsersModal(false)}
                  className="px-3 py-1.5 bg-[#FFF9F7] hover:bg-[#F8E1E7] text-[#49343D] text-xs font-semibold rounded-xl border border-[#E8BFCB]"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-5 overflow-auto flex-1">
              <table className="w-full text-left text-xs border border-[#E8BFCB] rounded-xl overflow-hidden">
                <thead className="bg-[#FFF9F7] text-[#49343D]">
                  <tr>
                    <th className="p-2.5 border-b border-[#E8BFCB] font-semibold">User ID</th>
                    <th className="p-2.5 border-b border-[#E8BFCB] font-semibold">Username</th>
                    <th className="p-2.5 border-b border-[#E8BFCB] font-semibold">Password Hash (SHA-256)</th>
                    <th className="p-2.5 border-b border-[#E8BFCB] font-semibold">Registration Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8BFCB]/50 font-mono text-[#49343D]">
                  {allUsers.map(u => (
                    <tr key={u.userId} className="hover:bg-[#F8E1E7]/20">
                      <td className="p-2.5 text-[#D4AF72] font-bold">{u.userId}</td>
                      <td className="p-2.5 font-sans font-medium text-[#49343D]">{u.username}</td>
                      <td className="p-2.5 text-[11px] text-[#49343D]/60 truncate max-w-[160px]" title={u.passwordHash}>
                        {u.passwordHash.substring(0, 16)}...
                      </td>
                      <td className="p-2.5 text-[11px] text-[#49343D]/70">{u.registrationDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
