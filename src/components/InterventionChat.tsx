import React, { useState, useEffect, useRef } from 'react';
import { EscalatedChat, Patient } from '../types';
import { defaultSimulatedResponses } from '../data';
import { ArrowLeft, Brain, ShieldAlert, Send, Lock, AlertCircle, Clock, Save, FileText } from 'lucide-react';

interface InterventionChatProps {
  escalations: EscalatedChat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string | null) => void;
  onTakeOver: (chatId: string) => void;
  onSendMessage: (chatId: string, text: string, sender: 'psychologist' | 'system') => void;
  onResolve: (chatId: string) => void;
  onSaveClinicalNotes: (patientId: string, notes: string) => void;
  patients: Patient[];
}

export default function InterventionChat({
  escalations,
  activeChatId,
  onSelectChat,
  onTakeOver,
  onSendMessage,
  onResolve,
  onSaveClinicalNotes,
  patients
}: InterventionChatProps) {
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [simulatedReplyIndex, setSimulatedReplyIndex] = useState<Record<string, number>>({});
  
  // Local state for editing session notes
  const [sessionNotes, setSessionNotes] = useState('');
  const [isNotesSaved, setIsNotesSaved] = useState(false);

  const activeChat = escalations.find(c => c.id === activeChatId);
  const activePatient = activeChat ? patients.find(p => p.id === activeChat.patientId) : null;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, isTyping]);

  // Load patient clinical notes into localized state when active patient changes
  useEffect(() => {
    if (activePatient) {
      setSessionNotes(activePatient.clinicalNotes);
      setIsNotesSaved(false);
    }
  }, [activePatient?.id]);

  // Handle manual note save
  const handleSaveNotes = () => {
    if (activePatient) {
      onSaveClinicalNotes(activePatient.id, sessionNotes);
      setIsNotesSaved(true);
      setTimeout(() => setIsNotesSaved(false), 2000);
    }
  };

  // Helper trigger to handle Simulated Patient Typing Feedback
  const triggerPatientReply = (chatId: string, patientId: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const pool = defaultSimulatedResponses[patientId] || [
        "Terima kasih sudah mendengar cerita saya, Dokter...",
        "Saya mulai merasa sedikit lebih lega dan tenang sekarang.",
        "Mendengar penjelasan rasional dan hangat Dokter sangat meneduhkan pikiran saya.",
        "Baik Dokter, saya berjanji akan mencoba teknik pernapasan tersebut dan mencoba tidur."
      ];
      
      const currentIdx = simulatedReplyIndex[patientId] || 0;
      const text = pool[currentIdx % pool.length];
      
      onSendMessage(chatId, text, 'psychologist'); // Simulates client reply
      setSimulatedReplyIndex(prev => ({
        ...prev,
        [patientId]: (prev[patientId] || 0) + 1
      }));
    }, 2500);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const textToSend = inputText.trim();
    onSendMessage(activeChat.id, textToSend, 'psychologist');
    setInputText('');

    // Trigger simulated reply from patient after psychologist speaks
    triggerPatientReply(activeChat.id, activeChat.patientId);
  };

  // If no chat is chosen, show a list of pending/active interventions to select
  if (!activeChat) {
    const pendingChats = escalations.filter(c => c.currentStatus === 'pending');
    const activeInterventions = escalations.filter(c => c.currentStatus === 'active');

    return (
      <div id="intervention-fallback" className="bg-[#f8fafc] rounded-2xl border border-[#cbd5e1] p-12 text-center h-[calc(100vh-140px)] flex flex-col justify-center items-center animate-fade-in">
        <div className="w-16 h-16 bg-[#e0f2fe] text-[#0284c7] rounded-full flex items-center justify-center mb-4">
          <Brain className="w-8 h-8" />
        </div>
        <h3 className="font-sans font-bold text-xl text-[#0f172a]">Pusat Intervensi Psikologis</h3>
        <p className="text-sm text-[#475569] max-w-md mx-auto mt-2 mb-8">
          Psikolog klinis profesional berlisensi dapat mengintervensi eskalasi yang dibekukan oleh AI. Masuk ke ruang obrolan untuk berbicara langsung.
        </p>

        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          
          {/* Pending triage column */}
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-[#be123c] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
              Menunggu Tindakan ({pendingChats.length})
            </h4>
            {pendingChats.length === 0 ? (
              <p className="text-xs text-[#94a3b8] py-4 text-center">Tidak ada antrean eskalasi kritis.</p>
            ) : (
              <div className="space-y-2">
                {pendingChats.map(c => (
                  <button
                    key={c.id}
                    onClick={() => onSelectChat(c.id)}
                    className="w-full text-left p-3 rounded-lg border border-slate-100 hover:border-amber-200 hover:bg-amber-50/20 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={c.patientAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div className="min-w-0 truncate">
                        <p className="text-xs font-bold text-[#0f172a] truncate">{c.patientName}</p>
                        <p className="text-[10px] text-rose-500 font-bold uppercase">Risiko {c.riskLevel === 'severe' ? 'Kritis' : 'Tinggi'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#94a3b8] shrink-0 font-mono">{c.escalatedAt}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active interventions column */}
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-[#0284c7] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7]"></span>
              Intervensi Aktif Anda ({activeInterventions.length})
            </h4>
            {activeInterventions.length === 0 ? (
              <p className="text-xs text-[#94a3b8] py-4 text-center">Tidak ada intervensi aktif saat ini.</p>
            ) : (
              <div className="space-y-2">
                {activeInterventions.map(c => (
                  <button
                    key={c.id}
                    onClick={() => onSelectChat(c.id)}
                    className="flex text-left p-3 rounded-lg border border-slate-100 hover:border-[#bae6fd] hover:bg-[#f0f9ff] transition-all w-full items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={c.patientAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#0f172a] truncate">{c.patientName}</p>
                        <p className="text-[10px] text-emerald-600 font-semibold">Terapeutik Sedang Berjalan</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#94a3b8] bg-emerald-50 px-1.5 py-0.5 rounded font-bold text-emerald-700">Live</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  const isTakeOverActive = activeChat.currentStatus === 'active';

  return (
    <div id="intervention-room-layout" className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden h-[calc(100vh-120px)] flex flex-col md:flex-row animate-fade-in">
      
      {/* LEFT CHAT PANEL (Main messaging space) */}
      <div className="flex-1 flex flex-col bg-[#f8fafc] border-r border-[#e2e8f0] h-full overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-white border-b border-[#e2e8f0] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectChat(null)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-[#64748b] hover:text-[#0f172a] transition-colors cursor-pointer"
              title="Kembali ke triase"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <img
                src={activeChat.patientAvatar}
                alt={activeChat.patientName}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-sans font-bold text-[#0f172a] text-sm leading-tight">{activeChat.patientName}</h3>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                    activeChat.riskLevel === 'severe'
                      ? 'bg-rose-50 text-rose-700 border border-rose-100'
                      : 'bg-orange-50 text-orange-700 border border-orange-100'
                  }`}>
                    Kasus {activeChat.riskLevel === 'severe' ? 'Kritis' : 'Tinggi'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${isTakeOverActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  <span className="text-[10px] text-[#64748b] font-semibold">
                    {isTakeOverActive ? 'Pendampingan Manusia Aktif' : 'AI Dibekukan — Harap Ambil Alih'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isTakeOverActive && (
              <button
                id="resolve-case-btn"
                onClick={() => onResolve(activeChat.id)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-transform cursor-pointer"
              >
                De-ekskalasi & Selesaikan Sesi
              </button>
            )}
          </div>
        </div>

        {/* MESSAGES LIST BOX */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          <div className="text-center py-2">
            <span className="px-3 py-1 bg-slate-200/50 text-[#64748b] text-[10px] font-medium rounded-full">
              Sesi bimbingan Kawan Curhat (AI) terhubung • Pukul {activeChat.escalatedAt} hari ini
            </span>
          </div>

          {activeChat.messages.map((msg) => {
            const isSystem = msg.sender === 'system';
            const isUser = msg.sender === 'user';
            const isAi = msg.sender === 'ai';
            const isPhys = msg.sender === 'psychologist';

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-3 animate-fade-in">
                  <div className="max-w-md px-4 py-2.5 bg-orange-50 text-orange-950 border border-orange-100 rounded-xl text-center shadow-xs">
                    <div className="flex gap-2 items-start justify-center">
                      <ShieldAlert className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] font-semibold leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-orange-500 block mt-1 font-mono">{msg.timestamp}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isUser ? 'justify-start' : 'justify-end'} group animate-fade-in`}
              >
                {/* User avatar for left side alignment */}
                {isUser && (
                  <img
                    src={activeChat.patientAvatar}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 mt-1"
                  />
                )}

                <div className="max-w-md">
                  <div className="flex items-center gap-1.5 mb-1 justify-between">
                    <span className="text-[10px] font-bold text-[#475569]">
                      {msg.senderName}
                    </span>
                    <span className="text-[9px] text-[#94a3b8] opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                      {msg.timestamp}
                    </span>
                  </div>

                  <div className={`p-3.5 rounded-2xl text-xs relative ${
                    isUser
                      ? msg.isFlagged
                        ? 'bg-amber-100 text-[#0f172a] rounded-tl-none border border-amber-300 ring-2 ring-amber-100'
                        : 'bg-white text-[#0f172a] rounded-tl-none border border-[#e2e8f0]'
                      : isAi
                      ? 'bg-sky-50 text-sky-950 rounded-tr-none border border-sky-100'
                      : 'bg-[#1e293b] text-white rounded-tr-none'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    {msg.isFlagged && (
                      <span className="absolute -bottom-2 -right-1 text-[9px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded-md border border-rose-200">
                        kata pemicu bahaya
                      </span>
                    )}
                  </div>
                </div>

                {/* Therapist Avatar right side alignment */}
                {isPhys && (
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
                    alt=""
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 border border-[#0284c7]"
                  />
                )}
              </div>
            );
          })}

          {/* Typing Feedback Simulator */}
          {isTyping && (
            <div className="flex gap-3.5 justify-start pl-2 animate-pulse">
              <img src={activeChat.patientAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
              <div className="bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-2xl text-[10px] text-slate-500 font-semibold italic">
                {activeChat.patientName} sedang menulis tanggapan...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT FORM ARENA */}
        <div className="p-4 bg-white border-t border-[#e2e8f0]">
          {!isTakeOverActive ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600" />
                <h4 className="text-xs font-bold text-amber-900">Sesi Otomatis AI Dibekukan</h4>
                <p className="text-[11px] text-amber-800 max-w-sm mt-0.5">
                  Respon bot otomatis ditangguhkan karena pasien mendesak. Harap konfirmasi pengambilalihan sebelum mengirim bantuan klinis manusia.
                </p>
                <button
                  id="takeover-action-btn"
                  onClick={() => onTakeOver(activeChat.id)}
                  className="mt-3 px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-sm font-bold text-xs rounded-lg transition-transform cursor-pointer hover:scale-[1.02]"
                >
                  Konfirmasi Ambil Alih Sesi Obrolan
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSend} className="flex gap-2.5">
              <input
                id="clinical-chat-input"
                type="text"
                placeholder={`Tulis pesan terapeutik hangat untuk menenangkan ${activeChat.patientName}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-3 bg-[#f8fafc] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:bg-white text-[#0f172a]"
              />
              <button
                id="send-msg-btn"
                type="submit"
                className="px-4.5 py-3 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl flex items-center justify-center transition-colors shadow-sm cursor-pointer shrink-0"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          )}
        </div>

      </div>

      {/* RIGHT SIDE PANEL (Context metadata & Clinical Notes) */}
      <div id="clinician-context-drawer" className="w-full md:w-80 border-t md:border-t-0 border-[#cbd5e1] md:border-l bg-white flex flex-col h-full overflow-hidden">
        
        {/* Panel Header */}
        <div className="p-4 bg-slate-50 border-b border-[#e2e8f0] flex items-center gap-2">
          <Brain className="w-4.5 h-4.5 text-[#0284c7]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">Diagnostik Konteks AI</h4>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          
          {/* Patient facts */}
          {activePatient && (
            <div className="p-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl space-y-2.5">
              <h5 className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">Ringkasan Pasien</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#94a3b8] block text-[10px]">Usia / Gender</span>
                  <span className="font-semibold text-[#0f172a]">{activePatient.age} Tahun / {activePatient.gender}</span>
                </div>
                <div>
                  <span className="text-[#94a3b8] block text-[10px]">Tanggal Terdaftar</span>
                  <span className="font-semibold text-[#0f172a] font-mono">{activePatient.joinDate}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[#94a3b8] block text-[10px]">Tren Suasana Hati</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase inline-block mt-0.5 ${
                    activePatient.moodTrend === 'critical'
                      ? 'bg-red-50 text-red-700'
                      : activePatient.moodTrend === 'declining'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {activePatient.moodTrend === 'critical' ? 'Krisis' : activePatient.moodTrend === 'declining' ? 'Menurun' : 'Stabil'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Handoff Sentinel Summary */}
          <div className="p-3.5 bg-rose-50/20 border border-rose-100 rounded-xl space-y-2">
            <h5 className="text-[11px] font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Analisis Risiko Sistem</span>
            </h5>
            <p className="text-xs text-rose-950 leading-relaxed">
              {activeChat.aiSentimentSummary}
            </p>
            
            <div className="mt-3">
              <span className="text-[10px] font-bold text-rose-800 block mb-1">Frasa Pemicu Terdeteksi:</span>
              <div className="flex flex-wrap gap-1">
                {activeChat.triggerPhrases.map((p, i) => (
                  <span key={i} className="px-2 py-0.5 text-[10px] font-semibold bg-white border border-rose-100 text-rose-800 rounded-md font-mono">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Psychologist Clinical Notes - Local state synchronized */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-[11px] font-bold text-[#475569] uppercase tracking-wide flex items-center gap-1.5 flex-1 min-w-0">
                <FileText className="w-4 h-4 text-[#64748b] shrink-0" />
                <span className="truncate">Sesi / Catatan Klinis</span>
              </h5>
              {isNotesSaved && (
                <span className="text-[10px] text-emerald-600 font-bold animate-pulse">Tersimpan ✓</span>
              )}
            </div>
            
            <p className="text-[10px] text-[#64748b] leading-relaxed">
              Dokumentasikan observasi klinis selama pendampingan ini berlanjut. Catat perilaku atau krisis somatic secara terapeutis.
            </p>

            <textarea
              id="clinical-notes-textarea"
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Dokumentasikan catatan klinis pasien secara real-time..."
              className="w-full h-32 p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0284c7] focus:border-[#0284c7] text-[#0f172a] bg-[#fafbfc]"
            />

            <button
              id="save-clinical-notes-btn"
              onClick={handleSaveNotes}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white/95 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Rekam Medis</span>
            </button>
          </div>

        </div>

        {/* Action guidelines footer */}
        <div className="p-3 bg-slate-50 border-t border-[#e2e8f0] text-[10px] text-[#556980] flex gap-2">
          <Clock className="w-4 h-4 text-[#0284c7] shrink-0 mt-0.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Gunakan nada empati yang menenangkan. Jamin kerahasiaan pasien terproteksi sepenuhnya.</span>
        </div>

      </div>

    </div>
  );
}
