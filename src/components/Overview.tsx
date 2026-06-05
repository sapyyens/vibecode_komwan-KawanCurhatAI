import React from 'react';
import { EscalatedChat } from '../types';
import { Activity, AlertTriangle, CheckCircle, Flame, MessageSquare, ShieldAlert, ArrowRight, UserPlus, HelpCircle } from 'lucide-react';

interface OverviewProps {
  escalations: EscalatedChat[];
  resolvedCount: number;
  activePhysCount: number;
  overallAiActiveCount: number;
  onIntervene: (chatId: string) => void;
  onSimulateEscalation: () => void;
  userRole?: 'admin' | 'psychologist' | 'user';
}

export default function Overview({
  escalations,
  resolvedCount,
  activePhysCount,
  overallAiActiveCount,
  onIntervene,
  onSimulateEscalation,
  userRole = 'psychologist'
}: OverviewProps) {
  
  // Urutkan eskalasi berdasarkan prioritas risiko: severe (parah), high (tinggi), medium (sedang)
  const priorityOrder = { severe: 3, high: 2, medium: 1 };
  const sortedEscalations = [...escalations].sort((a, b) => {
    return (priorityOrder[b.riskLevel] || 0) - (priorityOrder[a.riskLevel] || 0);
  });

  return (
    <div id="overview-container" className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e2e8f0]">
        <div>
          <h2 className="font-sans font-bold text-2xl text-[#0f172a] tracking-tight">Pusat Kendali Pengawasan (Command Hub)</h2>
          <p className="text-sm text-[#64748b] mt-1">
            Pemantauan waktu nyata sesi Kawan Curhat (AI). Berada di bawah protokol pengawasan triase darurat.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {userRole === 'admin' && (
            <button
              id="simulate-crisis-btn"
              onClick={onSimulateEscalation}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-100 transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Simulasikan Eskalasi Krisis AI</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Dynamic AI Friend active status */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-5 text-emerald-500">
            <MessageSquare className="w-24 h-24" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">Sesi Aktif AI Companion</span>
            <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] flex items-center justify-center text-emerald-600">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-[#0f172a]">{overallAiActiveCount}</span>
            <span className="text-xs font-medium text-emerald-600 ml-2">● Auto-pilot Aktif</span>
          </div>
          <div className="mt-2 text-xs text-[#94a3b8]">
            Sesi chat otomatis yang berjalan aman dan kondusif.
          </div>
        </div>

        {/* Urgent Escalations */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-5 text-rose-500">
            <ShieldAlert className="w-24 h-24" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">Sesi Butuh Intervensi</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              escalations.length > 0 ? 'bg-rose-50 text-rose-600 animate-bounce' : 'bg-slate-100 text-slate-400'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0f172a]">{escalations.length}</span>
            {escalations.length > 0 && (
              <span className="px-2 py-0.5 text-[10px] bg-rose-50 text-rose-700 font-bold rounded-md animate-pulse">
                BUTUH AMBIL ALIH
              </span>
            )}
          </div>
          <div className="mt-2 text-xs text-[#94a3b8]">
            Eskalasi krisis langsung dipicu berdasarkan deteksi sentimen berbahaya.
          </div>
        </div>

        {/* Active Psychologist Takeovers */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-5 text-[#0284c7]">
            <Activity className="w-24 h-24" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">Intervensi Spesialis Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-[#f0f9ff] flex items-center justify-center text-[#0284c7]">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-[#0f172a]">{activePhysCount}</span>
            <span className="text-xs font-medium text-[#0284c7] ml-2">Sedang Ditangani</span>
          </div>
          <div className="mt-2 text-xs text-[#94a3b8]">
            Sesi ditandai yang sedang aktif dipandu oleh tim psikolog/psikiater.
          </div>
        </div>

        {/* Resolved Cases today */}
        <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-5 text-[#0d9488]">
            <CheckCircle className="w-24 h-24" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">Kasus Selesai (De-eskalasi)</span>
            <div className="w-8 h-8 rounded-lg bg-[#f0fdfa] flex items-center justify-center text-teal-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-[#0f172a]">{resolvedCount}</span>
            <span className="text-xs font-medium text-emerald-600 ml-2">Hari Ini</span>
          </div>
          <div className="mt-2 text-xs text-[#94a3b8]">
            Sesi berhasil dide-eskalasi dan dikembalikan ke model AI.
          </div>
        </div>

      </div>

      {/* Main layout contents: Active Queue & AI System Safeguards Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Escalation Queue (Col span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
              <h3 className="font-sans font-bold text-lg text-[#0f172a]">Antrean Eskalasi Kritis</h3>
            </div>
            <span className="text-xs font-medium text-[#64748b] bg-slate-100 px-2.5 py-1 rounded-lg">
              Urut Berdasarkan Prioritas Skor Risiko
            </span>
          </div>

          {sortedEscalations.length === 0 ? (
            <div className="bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-2xl p-12 text-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-sans font-bold text-[#0f172a] text-base">Seluruh Sesi Berjalan Aman</h4>
              <p className="text-sm text-[#475569] max-w-md mx-auto mt-1 leading-relaxed">
                Tidak ada pemicu krisis aktif di jaringan saat ini. Sesi chat berjalan normal di dalam kendali agen asisten AI.
              </p>
              <button
                onClick={onSimulateEscalation}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer"
              >
                Simulasikan Kasus Eskalasi Baru
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedEscalations.map((chat) => {
                const isSevere = chat.riskLevel === 'severe';
                const isHigh = chat.riskLevel === 'high';

                const cardBorder = isSevere ? 'border-amber-200 bg-gradient-to-r from-amber-50/20 to-white' : 'border-slate-200 bg-white';
                const pillBg = isSevere ? 'bg-amber-100 text-amber-900 border-amber-200' : isHigh ? 'bg-orange-50 text-orange-900 border-orange-100' : 'bg-blue-50 text-blue-900 border-blue-100';

                return (
                  <div
                    key={chat.id}
                    id={`escalation-card-${chat.id}`}
                    className={`p-5 rounded-2xl border ${cardBorder} hover:shadow-md transition-all duration-300`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      
                      {/* Avatar Profile */}
                      <div className="relative shrink-0">
                        <img
                          src={chat.patientAvatar}
                          alt={chat.patientName}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-100"
                        />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                          !
                        </span>
                      </div>

                      {/* Info & Details */}
                      <div className="flex-1 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h4 className="font-sans font-bold text-[#0f172a] text-base leading-tight">
                              {chat.patientName}
                            </h4>
                            <p className="text-xs text-[#94a3b8] mt-0.5">
                              Eskalasi dipicu: {chat.escalatedAt} • Sesi Aktif
                            </p>
                          </div>
                          
                          {/* Priority Pill */}
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider ${pillBg}`}>
                              Kasus {isSevere ? 'Kritis' : isHigh ? 'Tinggi' : 'Sedang'}
                            </span>
                          </div>
                        </div>

                        {/* Sentiment reasoning */}
                        <div className="bg-[#f8fafc] border border-[#f1f5f9] p-3 rounded-xl text-xs text-[#475569] leading-relaxed">
                          <strong className="text-[#334155] font-bold">Ringkasan Analisis AI:</strong> {chat.aiSentimentSummary}
                        </div>

                        {/* Trigger statements highlighted */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="text-xs font-bold text-[#64748b]">Kata/Frasa Kunci:</span>
                          {chat.triggerPhrases.map((phrase, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 text-xs bg-rose-50 text-rose-700 font-medium rounded-md border border-rose-100 font-mono"
                            >
                              "{phrase}"
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Direct Hand-off CTA */}
                      <div className="sm:self-center shrink-0 w-full sm:w-auto">
                        <button
                          id={`takeover-btn-${chat.id}`}
                          onClick={() => onIntervene(chat.id)}
                          className={`w-full sm:w-auto flex items-center justify-center gap-3 px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSevere 
                              ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-50 hover:-translate-y-0.5' 
                              : 'bg-slate-900 hover:bg-slate-800 text-white hover:-translate-y-0.5'
                          }`}
                        >
                          <span>Masuki Obrolan</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Escalate Sentinel FAQ / Side Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
            
            <div className="flex items-center gap-2.5 mb-4">
              <ShieldAlert className="w-5 h-5 text-teal-400" />
              <h3 className="font-sans font-bold text-base">Protokol Pengambilalihan</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Sistem Kawan Curhat mengedepankan prioritas klinis aman. Ketika sistem mendeteksi pesan yang mengarah ke keputusasaan ekstrim, penyiksaan emosional mendalam, atau intensitas ide melukai diri sendiri:
            </p>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex gap-2.5 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0"></span>
                <span>Model pembimbing AI langsung menghentikan respon otomatisnya secara instan.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0"></span>
                <span>Seluruh pembicaraan historis diekspor real-time ke dalam antrean darsurat portal.</span>
              </li>
              <li className="flex gap-2.5 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0"></span>
                <span>Protokol intervensi aktif mengirim notifikasi masuknya staf psikologis manusia.</span>
              </li>
            </ul>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
              <span>Sentinel Aktif: V2.4.9</span>
              <span className="text-teal-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Kalibrasi Teratur
              </span>
            </div>
          </div>

          {/* Prompt Guidelines Card for Human Clinician */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
            <h4 className="font-sans font-bold text-sm text-[#0f172a] mb-2.5 flex items-center gap-2">
              <HelpCircle className="w-4.5 h-4.5 text-[#0284c7]" />
              <span>Panduan Intervensi Terapeutik</span>
            </h4>
            <div className="space-y-3.5 text-xs text-[#556980]">
              <div className="flex gap-3">
                <span className="font-sans font-bold text-xs text-[#0284c7] bg-sky-50 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                  1
                </span>
                <p>Baca poin rangkuman sentimen pemicu AI sebelum mulai merespon obrolan.</p>
              </div>
              <div className="flex gap-3">
                <span className="font-sans font-bold text-xs text-[#0284c7] bg-sky-50 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                  2
                </span>
                <p>Sapa pasien dengan sebutan hangat & panggil menggunakan nama mereka langsung.</p>
              </div>
              <div className="flex gap-3">
                <span className="font-sans font-bold text-xs text-[#0284c7] bg-sky-50 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                  3
                </span>
                <p>Gunakan teknik de-eskalasi mendalam (mindfulness, regulasi pernapasan kotak).</p>
              </div>
              <div className="flex gap-3">
                <span className="font-sans font-bold text-xs text-[#ccfbf1] bg-teal-900 w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white">
                  ✓
                </span>
                <p>Pastikan kondisi emosional pasien stabil sebelum mengembalikannya ke mode asisten obrolan AI.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
