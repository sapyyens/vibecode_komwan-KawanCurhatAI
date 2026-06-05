import React from 'react';
import { LayoutDashboard, MessageSquareWarning, Users, Sparkles, LogOut, CheckCircle2 } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  pendingCount: number;
  activeCount: number;
  dutyStatus: 'online' | 'break' | 'offline';
  setDutyStatus: (status: 'online' | 'break' | 'offline') => void;
  userRole: 'admin' | 'psychologist' | 'user';
  userName: string;
  userAvatar: string;
  onLogout: () => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  pendingCount,
  activeCount,
  dutyStatus,
  setDutyStatus,
  userRole,
  userName,
  userAvatar,
  onLogout
}: SidebarProps) {
  
  // Filter menu navigation items based on active role
  const allNavItems = [
    {
      id: 'overview',
      label: 'Panel Utama',
      icon: LayoutDashboard,
      badge: pendingCount > 0 ? { text: `${pendingCount} Darurat`, type: 'urgent' } : null,
      allowedRoles: ['admin', 'psychologist']
    },
    {
      id: 'chat',
      label: 'Ruang Intervensi',
      icon: MessageSquareWarning,
      badge: activeCount > 0 ? { text: `${activeCount} Aktif`, type: 'active' } : null,
      allowedRoles: ['admin', 'psychologist']
    },
    {
      id: 'patients',
      label: 'Direktori Pasien',
      icon: Users,
      badge: null,
      allowedRoles: ['admin', 'psychologist']
    },
    {
      id: 'ai-config',
      label: 'Kontrol AI (Admin)',
      icon: Sparkles,
      badge: null,
      allowedRoles: ['admin'] // Only admin gets access
    }
  ];

  const allowedNavItems = allNavItems.filter(item => item.allowedRoles.includes(userRole));

  return (
    <aside id="sidebar-container" className="w-80 bg-white border-r border-[#e2e8f0] flex flex-col h-screen fixed top-0 left-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#f1f5f9] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#e0f2fe] rounded-2xl flex items-center justify-center text-[#0284c7]">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-lg text-[#0f172a] leading-tight">Kawan Curhat</h1>
            <p className="text-xs font-semibold text-[#0284c7] capitalize">
              Portal {userRole === 'admin' ? 'Administrator' : 'Psikolog'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 rounded-full border border-emerald-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Live API</span>
        </div>
      </div>

      {/* Profile & Shift Status Switcher */}
      <div className="p-6 border-b border-[#f1f5f9] bg-[#f8fafc]">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={userAvatar}
            alt={userName}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#e0f2fe]"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-sans font-bold text-sm text-[#0f172a] truncate">{userName}</h3>
            <p className="text-xs text-[#64748b] font-medium uppercase tracking-wider">
              {userRole === 'admin' ? 'Super Admin' : 'Psikolog Berlisensi'}
            </p>
          </div>
        </div>

        {/* Duty Selector Status Pin */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#f1f5f9] rounded-lg">
          <button
            id="duty-online-btn"
            onClick={() => setDutyStatus('online')}
            className={`py-1.5 text-xs font-medium rounded-md transition-all ${
              dutyStatus === 'online'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            Bertugas
          </button>
          <button
            id="duty-break-btn"
            onClick={() => setDutyStatus('break')}
            className={`py-1.5 text-xs font-medium rounded-md transition-all ${
              dutyStatus === 'break'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            Istirahat
          </button>
          <button
            id="duty-offline-btn"
            onClick={() => setDutyStatus('offline')}
            className={`py-1.5 text-xs font-medium rounded-md transition-all ${
              dutyStatus === 'offline'
                ? 'bg-white text-slate-700 shadow-sm'
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            Luring
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {allowedNavItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              id={`nav-item-${item.id}`}
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-[#e0f2fe] to-[#f0f9ff] text-[#0369a1] font-bold border-l-4 border-[#0284c7]'
                  : 'text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-[#0284c7]' : 'text-[#64748b] group-hover:text-[#475569]'
                }`} />
                <span className="font-sans text-sm">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  item.badge.type === 'urgent'
                    ? 'bg-[#ffe4e6] text-[#be123c] animate-pulse'
                    : 'bg-[#e0f2fe] text-[#0369a1]'
                }`}>
                  {item.badge.text}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Banner */}
      <div className="p-4 border-t border-[#f1f5f9]">
        <div className="bg-[#f0fdf4] rounded-xl p-3 border border-emerald-100 mb-3">
          <div className="flex gap-2.5">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-800">Protokol Aman</h4>
              <p className="text-[10px] text-emerald-700 leading-normal">
                Enkripsi data klinis penuh sesuai regulasi kerahasiaan medis.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 text-rose-600 text-xs font-bold hover:bg-rose-50 hover:border-rose-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Portal</span>
        </button>
      </div>
    </aside>
  );
}
