import React, { useState } from 'react';
import { Patient, MoodTrend } from '../types';
import { Search, Filter, ShieldCheck, Heart, Calendar, Save } from 'lucide-react';

interface UserDirectoryProps {
  patients: Patient[];
  onSaveClinicalNotes: (patientId: string, notes: string) => void;
}

export default function UserDirectory({ patients, onSaveClinicalNotes }: UserDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  
  // Note formulation states
  const [notesText, setNotesText] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  // Sync clinical notes state with choice
  React.useEffect(() => {
    if (selectedPatient) {
      setNotesText(selectedPatient.clinicalNotes);
      setSaveSuccess(false);
    }
  }, [selectedPatientId, selectedPatient]);

  const handleUpdateNotes = () => {
    if (selectedPatient) {
      onSaveClinicalNotes(selectedPatient.id, notesText);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  // Filter patients base on active requirements
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = selectedMoodFilter === 'all' || patient.moodTrend === selectedMoodFilter;
    const matchesStatus = selectedStatusFilter === 'all' || patient.crisisStatus === selectedStatusFilter;
    return matchesSearch && matchesMood && matchesStatus;
  });

  const getMoodPill = (trend: MoodTrend) => {
    switch (trend) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100 uppercase tracking-widest">Krisis Kritis</span>;
      case 'declining':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-widest">Menurun</span>;
      case 'stablizing':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-widest">Stabilisasi</span>;
      case 'improving':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-widest font-bold">Membaik</span>;
      case 'calm':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#f1f5f9] text-slate-600 border border-slate-200 uppercase tracking-widest">Stabil Tenang</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">{trend}</span>;
    }
  };

  return (
    <div id="patient-directory-container" className="space-y-6 animate-fade-in text-[#0f172a]">
      
      {/* Search Header toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            id="directory-search-input"
            type="text"
            placeholder="Cari database berkas rekam medis berdasarkan nama lengkap..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs text-[#0f172a] focus:outline-none focus:ring-1 focus:ring-[#0284c7] focus:bg-white font-semibold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Mood Selector Filter */}
          <div className="flex items-center gap-1.5 min-w-[140px] bg-[#f8fafc] border border-slate-200 rounded-xl px-2.5 py-2">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <select
              id="mood-filter-select"
              value={selectedMoodFilter}
              onChange={(e) => setSelectedMoodFilter(e.target.value)}
              className="text-[11px] font-bold text-slate-700 focus:outline-none bg-transparent w-full cursor-pointer"
            >
              <option value="all">Semua Tren Sentimen</option>
              <option value="critical">Krisis Kritis</option>
              <option value="declining font-bold">Menurun</option>
              <option value="stablizing">Stabilisasi</option>
              <option value="improving">Membaik</option>
              <option value="calm">Stabil Tenang</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1.5 min-w-[140px] bg-[#f8fafc] border border-slate-200 rounded-xl px-2.5 py-2">
            <Filter className="w-3.5 h-3.5 text-sky-500" />
            <select
              id="status-filter-select"
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="text-[11px] font-bold text-slate-700 focus:outline-none bg-transparent w-full cursor-pointer"
            >
              <option value="all">Semua Status Keselamatan</option>
              <option value="normal">Penanganan AI Normal</option>
              <option value="escalated">Eskalasi Krisis</option>
              <option value="resolved">Selesai / Aman</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main split dashboard view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
        
        {/* Patient Index list (Span 2) */}
        <div className="lg:col-span-2 space-y-3 bg-white p-5 rounded-2xl border border-slate-200 max-h-[calc(100vh-220px)] overflow-y-auto">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#334155]">Direktori Pemantauan Pasien</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              Tertera {filteredPatients.length} Berkas Pasien
            </span>
          </div>

          {filteredPatients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-[#64748b] font-medium">Tidak ada data pasien yang cocok dengan filter penelusuran.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPatients.map(patient => {
                const isSelected = patient.id === selectedPatientId;
                
                return (
                  <button
                    id={`directory-row-${patient.id}`}
                    key={patient.id}
                    onClick={() => setSelectedPatientId(patient.id)}
                    className={`w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#f0f9ff] border-l-4 border-[#0284c7] border-y border-r border-[#bae6fd]'
                        : 'bg-white border border-slate-100 hover:bg-[#fafbfc]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={patient.avatar}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 justify-start">
                          <strong className="font-bold text-[#0f172a] text-sm truncate">{patient.name}</strong>
                          <span className="text-[10px] text-slate-500 font-medium shrink-0">{patient.age} Tahun</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          Terdaftar {patient.joinDate} • Aktif terakhir {patient.lastSeen}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2.5 sm:mt-0 shrink-0">
                      {getMoodPill(patient.moodTrend)}
                      {patient.crisisStatus === 'escalated' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#be123c] text-white flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                          Menunggu Intervensi
                        </span>
                      ) : patient.crisisStatus === 'resolved' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Tertangani
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">AI Aktif</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Patient Dossier File */}
        <div className="space-y-6">
          {selectedPatient ? (
            <div id="patient-dossier" className="bg-white border border-slate-200 rounded-2xl p-5 space-y-6 animate-fade-in">
              
              <div className="text-center pb-5 border-b border-slate-100">
                <img
                  src={selectedPatient.avatar}
                  alt=""
                  className="w-20 h-20 rounded-2xl object-cover mx-auto shadow-sm border border-slate-100"
                />
                <h4 className="font-bold text-[#0f172a] text-base mt-2.5 truncate">{selectedPatient.name}</h4>
                <p className="text-xs text-[#64748b] leading-tight font-mono">No. Seri Rekam Medis: KP-2026-00{selectedPatient.id}</p>
                
                <div className="flex items-center justify-center gap-1.5 mt-2 bg-slate-50 max-w-max mx-auto px-2.5 py-1 rounded-full border border-slate-100">
                  <span className={`w-2.5 h-2.5 rounded-full ${selectedPatient.crisisStatus === 'escalated' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                  <span className="text-[10px] text-slate-600 font-bold uppercase">
                    {selectedPatient.crisisStatus === 'escalated' ? 'Eskalasi Krisis Aktif' : 'Perawatan Rutin Terapeutik'}
                  </span>
                </div>
              </div>

              {/* Dossier clinical parameters */}
              <div className="space-y-4 text-xs">
                <h5 className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-[#0284c7]" />
                  <span>Metadata Klinis Pasien</span>
                </h5>
                <div className="grid grid-cols-2 gap-3.5 bg-[#f8fafc] border border-slate-100 p-3.5 rounded-xl">
                  <div>
                    <span className="text-[#94a3b8] text-[9px] block">Biometri / Gender</span>
                    <span className="font-bold text-slate-800">{selectedPatient.gender}</span>
                  </div>
                  <div>
                    <span className="text-[#94a3b8] text-[9px] block">Rentang Usia</span>
                    <span className="font-bold text-slate-800">{selectedPatient.age} Tahun</span>
                  </div>
                  <div>
                    <span className="text-[#94a3b8] text-[9px] block">Total Sesi Dialog AI</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedPatient.sessionCount} Sesi</span>
                  </div>
                  <div>
                    <span className="text-[#94a3b8] text-[9px] block">Aktivitas Terakhir</span>
                    <span className="font-bold text-slate-800 font-mono">{selectedPatient.lastSeen}</span>
                  </div>
                </div>

                {/* Simulated Mood Trendline Graph */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">Kurva Sentimen AI Mingguan</span>
                  <div className="bg-[#f0fdfe] border border-cyan-100 rounded-xl p-3">
                    <p className="text-[10px] text-cyan-800 leading-normal mb-2">
                      Analisis tren sentimen menunjukkan tingkat keseimbangan suasana hati mingguan yang diekstrak dari natural language logs.
                    </p>
                    {/* Visual trend widget mock */}
                    <div className="flex items-center justify-between px-1.5 pt-3 mb-1">
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" title="Stabil Tenang"></span>
                        <span className="text-[8px] text-[#94a3b8] font-mono">Mgg 1</span>
                      </div>
                      <div className="h-0.5 bg-cyan-200 flex-1 mx-1 -translate-y-2"></div>
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" title="Tinggi"></span>
                        <span className="text-[8px] text-[#94a3b8] font-mono">Mgg 2</span>
                      </div>
                      <div className="h-0.5 bg-cyan-200 flex-1 mx-1 -translate-y-2"></div>
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" title="Menurun"></span>
                        <span className="text-[8px] text-[#94a3b8] font-mono">Mgg 3</span>
                      </div>
                      <div className="h-0.5 bg-rose-200 flex-1 mx-1 -translate-y-2"></div>
                      <div className="flex flex-col items-center gap-1.5 text-center">
                        <span className={`w-2.5 h-2.5 rounded-full ${selectedPatient.moodTrend === 'critical' ? 'bg-rose-600 animate-ping' : 'bg-emerald-500'}`} title="Kondisi terkini"></span>
                        <span className="text-[8px] text-[#94a3b8] font-semibold">Terkini</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dossier Notes Action Form */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">Catatan Histori Rekam Medis</span>
                    {saveSuccess && (
                      <span className="text-[10px] text-emerald-600 font-bold animate-pulse">Tersimpan Otomatis ✓</span>
                    )}
                  </div>
                  <textarea
                    id="dossier-notes-input"
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    placeholder="Tulis riwayat medis penting, diagnosis, rujukan, atau hasil terapi pasien..."
                    className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#0f172a] focus:outline-none focus:ring-1 focus:ring-[#0284c7] focus:bg-white"
                  />
                  <button
                    id="save-dossier-notes-btn"
                    onClick={handleUpdateNotes}
                    className="w-full py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    Simpan & Perbarui Dokumen Rekam Medis
                  </button>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-[#f8fafc] border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs font-semibold">
              Pilih salah satu berkas pasien dari daftar indeks untuk memeriksa observasi rekam medis historis klinis.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
