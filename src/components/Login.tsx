import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, UserPlus, Heart, LogIn, Sparkles, AlertCircle, ArrowLeft, CheckCircle2, User, KeyRound } from 'lucide-react';
import { Patient } from '../types';

interface LoginProps {
  onLogin: (role: 'admin' | 'psychologist' | 'user', username: string, name: string) => void;
  onRegisterPatient?: (newPatient: Patient) => void;
}

export default function Login({ onLogin, onRegisterPatient }: LoginProps) {
  const [isSplashing, setIsSplashing] = useState(true);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'psychologist' | 'user'>('user'); // Default to user/patient for welcoming start
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Register form state variables
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regAge, setRegAge] = useState('');
  const [regGender, setRegGender] = useState('Laki-laki');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const rolePresets = {
    admin: {
      defaultUser: 'admin_sari',
      name: 'Sari Wijaya, M.Psi',
      desc: 'Memantau metrik asisten kognitif, mengelola rekam medis pasien, serta melakukan penyelarasan respons (AI tuning).'
    },
    psychologist: {
      defaultUser: 'linda_halim',
      name: 'Dr. Linda Halim, Sp.KJ',
      desc: 'Melakukan komunikasi intervensi terapeutik langsung dan memperbarui catatan klinis.'
    },
    user: {
      defaultUser: 'budi_santoso',
      name: 'Budi Santoso',
      desc: 'Ruang curhat aman dan kondusif untuk berbagi keluh kesah harian bersama Kawan Curhat.'
    }
  };

  // Run the splash screen for exactly 2.2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashing(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectRole = (role: 'admin' | 'psychologist' | 'user') => {
    setSelectedRole(role);
    setUsername(rolePresets[role].defaultUser);
    setPassword('kawancurhat2026');
    setErrorMsg('');
  };

  // Initialize presets on mount
  useEffect(() => {
    handleSelectRole('user');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Nama pengguna wajib diisi');
      return;
    }
    
    // Determine dynamic display name if registered
    let displayName = rolePresets[selectedRole].name;
    if (selectedRole === 'user' && username.trim() === regUsername.trim() && regFullName) {
      displayName = regFullName;
    }

    onLogin(selectedRole, username, displayName);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regFullName.trim()) {
      setErrorMsg('Nama lengkap wajib diisi');
      return;
    }
    if (!regUsername.trim()) {
      setErrorMsg('ID Pengguna baru wajib diisi');
      return;
    }
    if (!regAge.trim()) {
      setErrorMsg('Umur wajib diisi');
      return;
    }

    const ageNum = parseInt(regAge);
    if (isNaN(ageNum) || ageNum <= 0) {
      setErrorMsg('Masukkan umur yang valid');
      return;
    }

    // Create a new Patient object complying with structure
    const newPatient: Patient = {
      id: regUsername.trim(),
      name: regFullName.trim(),
      age: ageNum,
      gender: regGender,
      avatar: regGender === 'Laki-laki' 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' 
        : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      joinDate: new Date().toISOString().split('T')[0],
      moodTrend: 'calm',
      riskScore: 0,
      crisisStatus: 'normal',
      lastSeen: 'Just now',
      sessionCount: 0,
      clinicalNotes: 'Pasien baru terdaftar secara mandiri dari gerbang Kawan Curhat.'
    };

    // Propagate state to app
    if (onRegisterPatient) {
      onRegisterPatient(newPatient);
    }

    // Display success toast and auto-populate login with newly registered credentials
    setRegisterSuccess(true);
    setTimeout(() => {
      setUsername(regUsername.trim());
      setPassword('kawancurhat2026'); // sandboxing sandi default
      setSelectedRole('user');
      setIsRegisterMode(false);
      setRegisterSuccess(false);
      // clear fields
      setRegFullName('');
      setRegUsername('');
      setRegAge('');
    }, 2000);
  };

  if (isSplashing) {
    return (
      <div id="splash-container" className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 flex flex-col items-center justify-center select-none z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center space-y-4"
        >
          {/* Elegant Floating Icon */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-flex p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 mb-2"
          >
            <Heart className="w-10 h-10 text-emerald-400 fill-emerald-400/20" />
          </motion.div>

          <motion.h1 
            initial={{ tracking: '-0.05em', opacity: 0 }}
            animate={{ tracking: '-0.01em', opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-4xl sm:text-6xl font-extrabold text-white leading-none font-sans"
          >
            Kawan Curhat
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-xs sm:text-sm text-slate-300 font-mono tracking-widest font-normal"
          >
            TEMAN DEKAT KELUH KESAH ANDA
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="login-container" className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 flex items-center justify-center p-4 md:p-6 font-sans text-slate-800 select-none">
      
      {/* Pristine card built with high aesthetic guidelines */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 space-y-6 relative overflow-hidden animate-fade-in">
        
        {/* Soft glowing ambient cues */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

        {/* Minimalist Title */}
        <div className="text-center space-y-1">
          <Heart className="w-8 h-8 text-emerald-500 fill-emerald-500/10 mx-auto" />
          <h2 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">Kawan Curhat</h2>
          <p className="text-xs text-slate-500 font-semibold">Teman Curhat AI & Layanan Konsultasi Psikolog</p>
        </div>

        <AnimatePresence mode="wait">
          {!isRegisterMode ? (
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Dropdown Menu replacing original tab grid */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pilih Sistem Hak Akses</label>
                <div className="relative">
                  <select
                    id="role-dropdown"
                    value={selectedRole}
                    onChange={(e) => handleSelectRole(e.target.value as 'admin' | 'psychologist' | 'user')}
                    className="w-full p-3.5 pr-10 border border-slate-200 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-slate-900 transition-all cursor-pointer appearance-none text-slate-800"
                  >
                    <option value="user">Pasien / User</option>
                    <option value="psychologist">Psikolog Klinis (Dr. Linda Halim, Sp.KJ)</option>
                    <option value="admin">Administrator Utama</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Informative description block based on selected role */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex gap-2.5">
                <AlertCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-[10.5px] leading-relaxed text-slate-500 font-semibold">{rolePresets[selectedRole].desc}</p>
              </div>

              {/* Login block forms */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID Pengguna</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900 transition-all"
                      placeholder="Contoh ID: budi_santoso"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Kata Sandi Akses</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-slate-900 transition-all"
                      placeholder="Masukkan kata sandi..."
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-[11px] text-rose-600 font-bold bg-rose-50 border border-rose-100 rounded-xl p-2.5 animate-pulse">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 hover:scale-[1.01]"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk Portal Kawan Curhat
                </button>

              </form>

              {/* Registration Toggle Button block */}
              <div className="pt-4 border-t border-slate-100 text-center space-y-1">
                <p className="text-[11px] font-semibold text-slate-500">Mulai langkah baru?</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setErrorMsg('');
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-2 cursor-pointer transition-colors"
                >
                  Daftar Akun Pasien Baru
                </button>
              </div>

            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              
              <div 
                className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer inline-flex font-semibold text-xs select-none" 
                onClick={() => setIsRegisterMode(false)}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Masuk</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-850">Registrasi Pasien Baru</h3>
                <p className="text-[10px] text-slate-450 leading-normal font-semibold">Buat akun personal Anda secara instan untuk mendapatkan bimbingan aman bersama asisten AI Kawan Curhat.</p>
              </div>

              {registerSuccess ? (
                <div className="py-6 text-center space-y-3 bg-emerald-50/50 border border-emerald-100 rounded-2xl animate-fade-in select-none">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-emerald-950">Pendaftaran Selesai!</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">Profil disiapkan. Mengalihkan ke gerbang masuk otomatis...</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Contoh: Muhammad Rafli"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID Pengguna (Username)</label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''))}
                      placeholder="Contoh: rafli_m"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Umur (Tahun)</label>
                      <input
                        type="number"
                        required
                        value={regAge}
                        onChange={(e) => setRegAge(e.target.value)}
                        placeholder="Contoh: 23"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Jenis Kelamin</label>
                      <select
                        value={regGender}
                        onChange={(e) => setRegGender(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                  </div>

                  {errorMsg && (
                    <p className="text-[11px] text-rose-600 font-bold bg-rose-50 border border-rose-100 rounded-xl p-2.5">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Daftar Sekarang
                  </button>

                </form>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {/* Footnotes */}
        <div id="login-portal-footer" className="text-center font-semibold text-[10px] text-slate-400 select-none border-t border-slate-100 pt-3 flex justify-between">
          <span>Sandbox Mode Active</span>
          <span>v2.2 Minimalist</span>
        </div>

      </div>

    </div>
  );
}
