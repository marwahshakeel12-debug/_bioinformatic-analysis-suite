import React from 'react';
import { useBio } from '../../context/BioContext';
import { getUsers, exportUsersExcel } from '../../utils/authStorage';
import {
  Settings,
  Palette,
  FileSpreadsheet,
  Download,
  RotateCcw,
  Shield,
  User,
  CheckCircle2,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, currentUser, showToast } = useBio();
  const allUsers = getUsers();

  const handleResetData = () => {
    localStorage.removeItem('bio_users_records_v1');
    localStorage.removeItem('bio_active_session_user');
    showToast('User database reset to initial seed values.', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold text-[#49343D] flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#D4AF72]" />
          Platform Settings & Data Storage
        </h2>
        <p className="text-xs text-[#49343D]/70 mt-1 max-w-2xl leading-relaxed">
          Manage visual preferences, user records in data/users.xlsx, and academic session properties.
        </p>
      </div>

      {/* Theme Customizer Card */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#49343D] uppercase tracking-wider mb-2 flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#D4AF72]" />
          Color Theme Customization
        </h3>
        <p className="text-xs text-[#49343D]/70 mb-4">
          Select visual theme according to the scientific design system:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setTheme('blush-gold')}
            className={`p-3.5 rounded-xl border text-left transition ${
              theme === 'blush-gold'
                ? 'bg-[#F8E1E7] border-[#D4AF72] ring-1 ring-[#D4AF72] shadow-xs'
                : 'bg-[#FFF9F7] border-[#E8BFCB] hover:bg-[#F8E1E7]/50'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-[#D4AF72] border-2 border-[#F8E1E7] mb-2 shadow-2xs" />
            <div className="text-xs font-bold text-[#49343D]">Blush & Gold (Default)</div>
            <div className="text-[10px] text-[#49343D]/70 mt-0.5">Blush pink, champagne gold</div>
          </button>

          <button
            onClick={() => setTheme('warm-ivory')}
            className={`p-3.5 rounded-xl border text-left transition ${
              theme === 'warm-ivory'
                ? 'bg-[#F8E1E7] border-[#D4AF72] ring-1 ring-[#D4AF72] shadow-xs'
                : 'bg-[#FFF9F7] border-[#E8BFCB] hover:bg-[#F8E1E7]/50'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-[#FFF9F7] border-2 border-[#E8BFCB] mb-2 shadow-2xs" />
            <div className="text-xs font-bold text-[#49343D]">Warm Ivory & Rose</div>
            <div className="text-[10px] text-[#49343D]/70 mt-0.5">Ivory background with soft rose</div>
          </button>

          <button
            onClick={() => setTheme('science-blue')}
            className={`p-3.5 rounded-xl border text-left transition ${
              theme === 'science-blue'
                ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400 shadow-xs'
                : 'bg-[#FFF9F7] border-[#E8BFCB] hover:bg-slate-50'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white mb-2 shadow-2xs" />
            <div className="text-xs font-bold text-[#49343D]">Bio Science Blue</div>
            <div className="text-[10px] text-[#49343D]/70 mt-0.5">NCBI & DeepMind Blue</div>
          </button>

          <button
            onClick={() => setTheme('dark-slate')}
            className={`p-3.5 rounded-xl border text-left transition ${
              theme === 'dark-slate'
                ? 'bg-slate-800 text-white border-slate-600 shadow-xs'
                : 'bg-[#FFF9F7] border-[#E8BFCB] hover:bg-slate-100'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-slate-700 border-2 border-white mb-2 shadow-2xs" />
            <div className="text-xs font-bold text-[#49343D]">Dark Slate</div>
            <div className="text-[10px] text-[#49343D]/70 mt-0.5">Classic night contrast</div>
          </button>
        </div>
      </div>

      {/* User Record & Excel Storage Card */}
      <div className="bg-white border border-[#E8BFCB] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8BFCB] gap-3">
          <div className="flex items-center space-x-2.5">
            <FileSpreadsheet className="w-5 h-5 text-[#D4AF72]" />
            <div>
              <h3 className="text-sm font-bold text-[#49343D]">data/users.xlsx Storage Management</h3>
              <p className="text-xs text-[#49343D]/70">{allUsers.length} total registered academic users</p>
            </div>
          </div>

          <button
            onClick={exportUsersExcel}
            className="flex items-center space-x-2 px-4 py-2 bg-[#D4AF72] hover:bg-[#c49e62] text-white font-semibold text-xs rounded-xl shadow-sm transition shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download users.xlsx</span>
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#FFF9F7] text-[#49343D] font-bold border-b border-[#E8BFCB]">
              <tr>
                <th className="p-3">User ID</th>
                <th className="p-3">Username</th>
                <th className="p-3">Password Hash (SHA-256)</th>
                <th className="p-3">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8BFCB]/50 text-[#49343D] font-mono">
              {allUsers.map(u => (
                <tr key={u.userId} className="hover:bg-[#FFF9F7] transition-colors">
                  <td className="p-3 font-bold text-[#D4AF72]">{u.userId}</td>
                  <td className="p-3 font-sans text-[#49343D] font-semibold">{u.username}</td>
                  <td className="p-3 text-[11px] text-[#49343D]/60 truncate max-w-xs" title={u.passwordHash}>
                    {u.passwordHash}
                  </td>
                  <td className="p-3 text-[#49343D]/70">{u.registrationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Danger Zone: Reset State */}
      <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-rose-900">Reset Local Records & Storage</h4>
          <p className="text-xs text-rose-700/80 mt-0.5">
            Restores users.xlsx records and clears cached session states to starter values.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset App State</span>
        </button>
      </div>
    </div>
  );
};
