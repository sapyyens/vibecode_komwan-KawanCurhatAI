import React, { useState } from 'react';
import { AiSensitivitySettings, AiPerformanceLog } from '../types';
import { Sparkles, Sliders, Terminal, AlertCircle, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';

interface AiConfigProps {
  settings: AiSensitivitySettings;
  logs: AiPerformanceLog[];
  onSaveSettings: (settings: AiSensitivitySettings) => void;
  onClearLogs?: () => void;
}

export default function AiConfig({ settings, logs, onSaveSettings }: AiConfigProps) {
  const [localSettings, setLocalSettings] = useState<AiSensitivitySettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);
  const [activePreset, setActivePreset] = useState('standard');

  const handleSliderChange = (key: keyof AiSensitivitySettings, value: number) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTextChange = (key: keyof AiSensitivitySettings, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplySettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(localSettings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const loadPreset = (presetType: 'standard' | 'high-safety' | 'lenient') => {
    setActivePreset(presetType);
    if (presetType === 'high-safety') {
      setLocalSettings(prev => ({
        ...prev,
        selfHarmThreshold: 70, // triggers sooner
        anxietyThreshold: 60,
        depressionThreshold: 70,
        griefThreshold: 80,
        escalationTimeoutMinutes: 1
      }));
    } else if (presetType === 'lenient') {
      setLocalSettings(prev => ({
        ...prev,
        selfHarmThreshold: 95, 
        anxietyThreshold: 90,
        depressionThreshold: 90,
        griefThreshold: 95,
        escalationTimeoutMinutes: 5
      }));
    } else {
      setLocalSettings(prev => ({
        ...prev,
        selfHarmThreshold: 85,
        anxietyThreshold: 75,
        depressionThreshold: 80,
        griefThreshold: 90,
        escalationTimeoutMinutes: 3
      }));
    }
  };

  return (
    <div id="ai-configuration-container" className="space-y-8 animate-fade-in text-[#0f172a] font-sans">
      
      {/* Overview Title explaining thresholds */}
      <div className="bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-100 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 bg-sky-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-sky-200">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#0369a1]">Tuning Model Eskalasi AI</h3>
            <p className="text-xs text-sky-950 leading-relaxed max-w-2xl mt-1 font-medium">
              Kawan Curhat ditenagai model pemrosesan bahasa alami (NLP) Gemini. Atur matriks sensitivitas risiko di bawah ini. Nilai sensitivitas yang lebih rendah memaksa sistem mendeteksi tanda bahaya lebih awal dan meneruskan penanganan ke psikolog klinis, sedangkan nilai yang lebih tinggi memberikan ruang lebih lama bagi pendamping AI membantu memberikan teknik koping dasar.
            </p>
          </div>
        </div>

        {/* Global Model Preset Switcher */}
        <div className="flex bg-white/80 p-1.5 rounded-xl border border-sky-200 shrink-0 select-none">
          <button
            type="button"
            onClick={() => loadPreset('standard')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activePreset === 'standard' ? 'bg-[#0f172a] text-white' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Seimbang
          </button>
          <button
            type="button"
            onClick={() => loadPreset('high-safety')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activePreset === 'high-safety' ? 'bg-[#0f172a] text-white' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Proteksi Maks
          </button>
          <button
            type="button"
            onClick={() => loadPreset('lenient')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activePreset === 'lenient' ? 'bg-[#0f172a] text-white' : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Longgar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sliding Sensitivity Panel (Col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleApplySettings} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-4 flex-wrap">
              <h4 className="font-bold text-sm text-[#334155] flex items-center gap-2">
                <Sliders className="w-4.5 h-4.5 text-[#0284c7]" />
                <span>Atur Ambang Batas Matriks Aktivasi</span>
              </h4>
              {isSaved && (
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full animate-pulse shrink-0">
                  Ambang batas berhasil diterapkan ke gateway Gemini!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Self-Harm Trigger Threshold */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Proteksi Deteksi Menyakiti Diri</span>
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold rounded-md font-mono text-[10px]">
                    Krisis pada {localSettings.selfHarmThreshold}%
                  </span>
                </div>
                <input
                  id="self-harm-slider"
                  type="range"
                  min="30"
                  max="100"
                  value={localSettings.selfHarmThreshold}
                  onChange={(e) => handleSliderChange('selfHarmThreshold', parseInt(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                />
                <p className="text-[10px] text-[#64748b] leading-normal font-semibold">
                  Mengidentifikasi penyebutan keputusasaan atau niat menyakiti diri secara eksplisit atau implisit. Menurunkan nilai ini memicu intervensi instan.
                </p>
              </div>

              {/* Panic attack threshold */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Proteksi Serangan Panik Somatik</span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold rounded-md font-mono text-[10px]">
                    Krisis pada {localSettings.anxietyThreshold}%
                  </span>
                </div>
                <input
                  id="panic-slider"
                  type="range"
                  min="35"
                  max="100"
                  value={localSettings.anxietyThreshold}
                  onChange={(e) => handleSliderChange('anxietyThreshold', parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                />
                <p className="text-[10px] text-[#64748b] leading-normal font-semibold">
                  Memindai kondisi hiperventilasi, deskripsi ketakutan somatik berlebih, sesak reaktif, dan ketegangan fisik.
                </p>
              </div>

              {/* Severe Depression trigger */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Penyaringan Indeks Depresi</span>
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-md font-mono text-[10px]">
                    Krisis pada {localSettings.depressionThreshold}%
                  </span>
                </div>
                <input
                  id="depression-slider"
                  type="range"
                  min="40"
                  max="100"
                  value={localSettings.depressionThreshold}
                  onChange={(e) => handleSliderChange('depressionThreshold', parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                />
                <p className="text-[10px] text-[#64748b] leading-normal font-semibold">
                  Mengidentifikasi pola komunikasi yang mencerminkan isolasi sosial berkepanjangan, letargi ekstrem, dan kehilangan animo hidup.
                </p>
              </div>

              {/* Grief deep loss threshold */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Pemicu Trauma & Kehilangan</span>
                  <span className="px-2 py-0.5 bg-sky-50 text-sky-700 font-bold rounded-md font-mono text-[10px]">
                    Krisis pada {localSettings.griefThreshold}%
                  </span>
                </div>
                <input
                  id="grief-slider"
                  type="range"
                  min="40"
                  max="100"
                  value={localSettings.griefThreshold}
                  onChange={(e) => handleSliderChange('griefThreshold', parseInt(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                />
                <p className="text-[10px] text-[#64748b] leading-normal font-semibold">
                  Mengevaluasi kesedihan traumatis berat (traumatic grief), keputusasaan akibat berkabung, penolakan realitas secara destruktif.
                </p>
              </div>

              {/* Handoff timeout */}
              <div className="space-y-2 md:col-span-2 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Batas Toleransi Waktu Tunggu Dokter (Menit)</label>
                  <input
                    id="timeout-slider"
                    type="number"
                    min="1"
                    max="15"
                    value={localSettings.escalationTimeoutMinutes}
                    onChange={(e) => handleSliderChange('escalationTimeoutMinutes', parseInt(e.target.value) || 3)}
                    className="w-full p-2.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                  />
                  <p className="text-[9px] text-[#94a3b8] mt-1 leading-normal font-semibold">
                    Mengirimkan alarm notifikasi di terminal utama jika pasien krisis tidak segera diambil alih oleh psikolog yang bertugas.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Psikolog Cadangan Penanggung Jawab</label>
                  <input
                    id="fallback-clinician-input"
                    type="text"
                    value={localSettings.fallbackPsychologistId}
                    onChange={(e) => handleTextChange('fallbackPsychologistId', e.target.value)}
                    className="w-full p-2.5 bg-[#f8fafc] border border-slate-200 rounded-lg text-xs text-[#0f172a] font-bold"
                  />
                  <p className="text-[9px] text-[#94a3b8] mt-1 leading-normal font-semibold">
                    ID Dokter / Psikolog Klinis penanggung jawab yang secara otomatis menerima notifikasi pengalihan kasus yang tidak tertangani.
                  </p>
                </div>
              </div>

            </div>

            {/* Submit Action */}
            <div className="flex pt-4 items-center justify-end">
              <button
                id="apply-config-btn"
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-100 transition-all cursor-pointer hover:scale-[1.02]"
              >
                Terapkan Konfigurasi Sensitivitas
              </button>
            </div>

          </form>

          {/* Model AI Prompt Directive (Advanced) */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4">
            <h4 className="font-bold text-sm text-[#334155] flex items-center gap-1.5">
              <Terminal className="w-4.5 h-4.5 text-zinc-600" />
              <span>Sistem Direktori Dasar Persona AI (System Prompt)</span>
            </h4>
            
            <p className="text-xs text-slate-500 leading-normal font-semibold">
              Instruksi dasar blueprint ini membentuk kepribadian, batas terapeutik, dan empati 'Kawan Curhat (AI)'. Model AI memantau ekspresi distress dan secara otomatis mengaktifkan penangguhan dengan parameter <code className="bg-rose-50 text-rose-700 font-semibold px-1 py-0.5 rounded text-[10px] font-mono">[FLAG_DISTRESS]</code>.
            </p>

            <textarea
              id="ai-prompt-textarea"
              value={localSettings.systemPromptPreset}
              onChange={(e) => handleTextChange('systemPromptPreset', e.target.value)}
              className="w-full h-28 p-3 font-mono text-[11px] bg-slate-900 text-teal-400 rounded-xl leading-relaxed focus:outline-none"
            />
            
            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[10px] text-slate-500 font-semibold">
              <span>Perkiraan Ukuran Token: ~210 token</span>
              <span className="text-emerald-700 font-semibold">Sistem Enkripsi & Injeksi Model Gemini Aktif</span>
            </div>
          </div>

        </div>

        {/* LOG PANEL FOR FALSE POSITIVES VS SUCCESSFUL ESCALATIONS */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-sm text-[#0f172a] flex items-center gap-1.5">
                <AlertCircle className="w-4.5 h-4.5 text-[#0284c7]" />
                <span>Audit Akurasi Keamanan Sistem</span>
              </h4>
              <button
                type="button"
                onClick={() => alert("Menguji ulang parameter referensi semantik...")}
                className="rounded-full p-1 text-[#64748b] hover:bg-slate-100 hover:text-[#0f172a] transition-all cursor-pointer"
                title="Kalibrasi ulang semantik"
              >
                <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
              </button>
            </div>

            <p className="text-xs text-[#64748b] leading-relaxed font-semibold">
              Histori audit supervisi klinis untuk menilai efektivitas model NLP dalam melacak krisis psikososial. Digunakan untuk memperketat batas proteksi keselamatan.
            </p>

            <div className="space-y-4">
              {logs.map((log) => {
                const isSuccess = log.accuracyRating === 'accurate';

                return (
                  <div key={log.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs relative group hover:border-[#bae6fd] hover:bg-[#f0f9ff]/20 transition-all">
                    
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <strong className="font-bold text-slate-900">{log.patientName}</strong>
                        <p className="text-[9px] text-[#94a3b8] font-mono font-bold">{log.timestamp}</p>
                      </div>

                      {/* Pill rating */}
                      {isSuccess ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 text-[9px] font-bold uppercase rounded-md flex items-center gap-1 shrink-0">
                          <ThumbsUp className="w-3 h-3 text-emerald-600" /> Terdeteksi Akurat
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-100 text-[9px] font-bold uppercase rounded-md flex items-center gap-1 shrink-0">
                          <ThumbsDown className="w-3 h-3 text-rose-600" /> Alarm Berlebih
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-700 font-semibold">
                      <span className="text-[#64748b]">Penyebab Pemicu:</span> {log.primaryTrigger}
                    </div>

                    <p className="text-[10px] text-slate-500 italic bg-white p-2 border border-slate-100 rounded-lg font-medium">
                      "{log.notes}"
                    </p>

                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
