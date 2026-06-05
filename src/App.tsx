import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import InterventionChat from './components/InterventionChat';
import UserDirectory from './components/UserDirectory';
import AiConfig from './components/AiConfig';
import Login from './components/Login';
import UserChatView from './components/UserChatView';
import { Patient, EscalatedChat, AiSensitivitySettings, AiPerformanceLog, Message } from './types';
import { initialPatients, initialEscalatedChats, initialAiSettings, initialAiLogs, defaultSimulatedResponses } from './data';
import { AlertCircle, X, ShieldAlert, BadgeInfo, Bell } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'psychologist' | 'user' | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const [currentUserLogin, setCurrentUserLogin] = useState<string>('');

  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [escalations, setEscalations] = useState<EscalatedChat[]>(initialEscalatedChats);
  const [aiSettings, setAiSettings] = useState<AiSensitivitySettings>(initialAiSettings);
  const [aiLogs, setAiLogs] = useState<AiPerformanceLog[]>(initialAiLogs);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [dutyStatus, setDutyStatus] = useState<'online' | 'break' | 'offline'>('online');
  const [resolvedTodayCount, setResolvedTodayCount] = useState<number>(4); // initial mock counter

  const handleLogin = (role: 'admin' | 'psychologist' | 'user', loginId: string, displayName: string) => {
    setCurrentUserRole(role);
    setCurrentUserName(displayName);
    setCurrentUserLogin(loginId);
    setIsAuthenticated(true);
    if (role === 'user') {
      setCurrentTab('user-chat');
    } else {
      setCurrentTab('overview');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUserRole(null);
    setCurrentUserName('');
    setCurrentUserLogin('');
  };

  const handleRegisterPatient = (newPatient: Patient) => {
    setPatients(prev => [newPatient, ...prev]);
  };

  const handleUserEscalationSimulated = (userMessage: string, responseMessages: Message[]) => {
    // Check if we already have this user in escalations
    const exists = escalations.some(e => e.patientId === 'user-session');
    if (exists) return;

    const newPatient: Patient = {
      id: 'user-session',
      name: currentUserName,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      age: 24,
      gender: 'Laki-laki',
      joinDate: new Date().toISOString().split('T')[0],
      moodTrend: 'critical',
      riskScore: 98,
      crisisStatus: 'escalated',
      lastSeen: 'Just now',
      sessionCount: 1,
      clinicalNotes: 'Pasien memicu eskalasi darurat mandiri dari Ruang Curhat Personal. Terdeteksi tanda bunuh diri / menyakiti diri secara aktif.'
    };

    const newEscalated: EscalatedChat = {
      id: 'session-c-user',
      patientId: 'user-session',
      patientName: currentUserName,
      patientAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      riskLevel: 'severe',
      escalatedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      triggerPhrases: ['tidur selamanya', 'tidak sanggup', 'bunuh diri'],
      aiSentimentSummary: 'Pemicu krisis emosional kritis terdeteksi oleh pengendali NLP Kawan Curhat dari Ruang Curhat Live pasien.',
      currentStatus: 'pending',
      messages: responseMessages
    };

    setPatients(prev => [newPatient, ...prev]);
    setEscalations(prev => [newEscalated, ...prev]);
  };

  // Simulation notification toast states
  const [toastNotification, setToastNotification] = useState<{
    id: string;
    patientName: string;
    riskLevel: string;
    summary: string;
  } | null>(null);

  // Counters
  const pendingCount = escalations.filter(c => c.currentStatus === 'pending').length;
  const activeCount = escalations.filter(c => c.currentStatus === 'active').length;
  const overallAiActiveCount = 138; // mock dynamic active bot count

  // Handler to set selected chat for immediate intervention
  const handleIntervene = (chatId: string) => {
    setActiveChatId(chatId);
    setCurrentTab('chat');
  };

  // Handler to complete takeover of active chat from AI to psychologist
  const handleTakeOver = (chatId: string) => {
    setEscalations(prevEscalations =>
      prevEscalations.map(chat => {
        if (chat.id === chatId) {
          const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const takeoverMessage: Message = {
            id: `system-takeover-${Date.now()}`,
            sender: 'system',
            senderName: 'Sistem Kawan Curhat',
            text: `Dr. Linda Halim, Sp.KJ (Spesialis Manusia Berlisensi) telah mengambil alih percakapan ini secara live. Terapi krisis dimulai.`,
            timestamp
          };
          return {
            ...chat,
            currentStatus: 'active',
            messages: [...chat.messages, takeoverMessage]
          };
        }
        return chat;
      })
    );

    // Update patient status in directory likewise
    const chat = escalations.find(c => c.id === chatId);
    if (chat) {
      setPatients(prevPatients =>
        prevPatients.map(p => {
          if (p.id === chat.patientId) {
            return {
              ...p,
              crisisStatus: 'escalated'
            };
          }
          return p;
        })
      );
    }
  };

  // Handler to post therapeutic messages
  const handleSendMessage = (chatId: string, text: string, sender: 'psychologist' | 'system') => {
    setEscalations(prevEscalations =>
      prevEscalations.map(chat => {
        if (chat.id === chatId) {
          const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          
          let senderName = 'Dr. Linda Halim, Sp.KJ';
          let msgSender: 'psychologist' | 'user' | 'system' = 'psychologist';
          
          if (sender === 'system') {
            senderName = 'Sistem';
            msgSender = 'system';
          } else if (text.startsWith('Terima kasih') || text.includes('dokter') || text.includes('dok') || text.includes('menenangkan')) {
            // we simulate this sent message as the user replying!
            msgSender = 'user';
            senderName = chat.patientName;
          }

          const newMsg: Message = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            sender: msgSender,
            senderName,
            text,
            timestamp
          };
          return {
            ...chat,
            messages: [...chat.messages, newMsg]
          };
        }
        return chat;
      })
    );
  };

  // Handler to resolve escalated case and return state to AI
  const handleResolve = (chatId: string) => {
    const chat = escalations.find(c => c.id === chatId);
    if (!chat) return;

    // Remove or transition this chat to resolved status
    setEscalations(prev => prev.filter(c => c.id !== chatId));
    
    // Increment resolved state counts
    setResolvedTodayCount(prev => prev + 1);

    // Update patient profile back to normal
    setPatients(prev =>
      prev.map(p => {
        if (p.id === chat.patientId) {
          return {
            ...p,
            crisisStatus: 'resolved',
            moodTrend: 'stablizing',
            riskScore: 22, // minimized
            clinicalNotes: `${p.clinicalNotes}\n\n[RESOLVED SESSION TODAY]: Intervensi krisis manual berdurasi 15 menit. Kondisi emosional stabil sebelum dikembalikan ke tier AI.`
          };
        }
        return p;
      })
    );

    // Insert analytical successful log in AI logs matching requirements
    const newLog: AiPerformanceLog = {
      id: `log-${Date.now()}`,
      timestamp: 'Today, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      patientName: chat.patientName,
      primaryTrigger: chat.triggerPhrases.join(', '),
      outcome: 'successful_intervention',
      accuracyRating: 'accurate',
      notes: `Eskalasi darurat dide-eskalasi dalam waktu singkat oleh Psikiater Supervisor Linda Halim. Pasien mengonfirmasi stabilisasi somatik.`
    };
    setAiLogs(prev => [newLog, ...prev]);

    // Reset active chat ID
    setActiveChatId(null);
    setCurrentTab('overview');
  };

  // Handler for custom notes persistence
  const handleSaveClinicalNotes = (patientId: string, newNotes: string) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id === patientId) {
          return { ...p, clinicalNotes: newNotes };
        }
        return p;
      })
    );
  };

  // Handler for AI parameter adjustments
  const handleSaveSettings = (newSettings: AiSensitivitySettings) => {
    setAiSettings(newSettings);
  };

  // ADVANCED SIMULATOR: Injects a simulated crisis incident dynamically
  const handleSimulateEscalation = () => {
    const simId = `sim-p-${Date.now()}`;
    const simName = 'Risty Amalia';
    const simAvatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150';

    // 1. Create a simulated Patient profile
    const newPatient: Patient = {
      id: simId,
      name: simName,
      age: 21,
      gender: 'Perempuan',
      avatar: simAvatar,
      joinDate: new Date().toISOString().split('T')[0],
      moodTrend: 'critical',
      riskScore: 96,
      crisisStatus: 'escalated',
      lastSeen: 'Just now',
      sessionCount: 2,
      clinicalNotes: 'Pasien baru terdaftar secara mandiri. Mengalami gejolak perasaan kesepian ekstrim dan gejala depresi berat.'
    };

    // 2. Create the associated crisis chat history logs (pre-takeover)
    const newChat: EscalatedChat = {
      id: `sim-c-${Date.now()}`,
      patientId: simId,
      patientName: simName,
      patientAvatar: simAvatar,
      riskLevel: 'severe',
      escalatedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      triggerPhrases: [
        'ingin tidur selamanya',
        'hidup ini menyiksa rasa sakit',
        'tidak ada yang peduli'
      ],
      aiSentimentSummary: 'AI mendeteksi intensitas suicidal ideation tingkat tinggi (Severe Suicidal Panic). Pasien secara eksplisit mengutarakan keinginan tidur selamanya karena dunia terlalu menyiksa untuk dijalani. Handoff sentinel dipicu instan.',
      currentStatus: 'pending',
      messages: [
        {
          id: 'sim-msg-1',
          sender: 'user',
          senderName: simName,
          text: 'Halo... Aku boleh cerita? Aku sendirian dan rasanya gelap banget kamarku.',
          timestamp: '13:23:10'
        },
        {
          id: 'sim-msg-2',
          sender: 'ai',
          senderName: 'Kawan Curhat (AI)',
          text: 'Tentu sayang, aku ada di sini untuk mendengarkan setiap keluh kesahmu pelan-pelan. Ceritakan apa yang sedang menggelapkan malammu? Kamu tidak sendirian.',
          timestamp: '13:23:44'
        },
        {
          id: 'sim-msg-3',
          sender: 'user',
          senderName: simName,
          text: 'Hidup ini terlalu menyiksa, terus menerus membawa rasa sakit di dada. Aku rasanya pengen tutup mata dan tidur selamanya... toh tidak ada yang peduli juga kalau besok aku nggak bangun.',
          timestamp: '13:25:05',
          isFlagged: true
        },
        {
          id: 'sim-msg-4',
          sender: 'system',
          senderName: 'Sistem Kawan Curhat',
          text: 'PENDAMPINGAN KHUSUS AKTIF: Kawan Curhat (AI) mengalihkan percakapan ini secara langsung ke tim psikolog klinis profesional berlisensi.',
          timestamp: '13:25:30'
        }
      ]
    };

    // Injeksi reply simulasi ke database responses
    defaultSimulatedResponses[simId] = [
      'Halo dokter Linda... terima kasih banyak sudah membalas pesan saya. Saya sangat ketakutan... air mata saya tidak mau berhenti mengalir.',
      'Dada saya sesak sekali jika membayangkan hari esok... rasanya saya sendirian di dunia ini.',
      'Mendengar suara hangat dokter membuat saya merasa sedikit lebih tenang. Saya berjanji tidak akan bertindak gegabah malam ini.',
      'Baik dokter, saya akan mencoba latihan napas yang dokter ajarkan dan beristirahat terlebih dahulu.'
    ];

    // Push to states
    setPatients(prev => [newPatient, ...prev]);
    setEscalations(prev => [newChat, ...prev]);

    // Show floating interactive toast popover
    setToastNotification({
      id: newChat.id,
      patientName: simName,
      riskLevel: 'SEVERE [96%]',
      summary: 'AI Flag: Pasien Risty Amalia terdeteksi suicidal ideation tingkat tinggi ("tidur selamanya" & "hidup menyiksa"). Sesi Kawan Curhat (AI) dibekukan.'
    });

    // Auto-dismiss toast in 8 secs
    setTimeout(() => {
      setToastNotification(null);
    }, 8000);
  };

  const renderActiveTabContents = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <Overview
            escalations={escalations}
            resolvedCount={resolvedTodayCount}
            activePhysCount={activeCount}
            overallAiActiveCount={overallAiActiveCount}
            onIntervene={handleIntervene}
            onSimulateEscalation={handleSimulateEscalation}
            userRole={currentUserRole || 'psychologist'}
          />
        );
      case 'chat':
        return (
          <InterventionChat
            escalations={escalations}
            activeChatId={activeChatId}
            onSelectChat={setActiveChatId}
            onTakeOver={handleTakeOver}
            onSendMessage={handleSendMessage}
            onResolve={handleResolve}
            onSaveClinicalNotes={handleSaveClinicalNotes}
            patients={patients}
          />
        );
      case 'patients':
        return (
          <UserDirectory
            patients={patients}
            onSaveClinicalNotes={handleSaveClinicalNotes}
          />
        );
      case 'ai-config':
        return (
          <AiConfig
            settings={aiSettings}
            logs={aiLogs}
            onSaveSettings={handleSaveSettings}
          />
        );
      default:
        return <div className="text-slate-500 text-sm">Target view not found or accessible.</div>;
    }
  };

  if (!isAuthenticated || !currentUserRole) {
    return <Login onLogin={handleLogin} onRegisterPatient={handleRegisterPatient} />;
  }

  if (currentUserRole === 'user') {
    return (
      <UserChatView
        currentUserName={currentUserName}
        onLogout={handleLogout}
        onSimulateSystemEscalation={handleUserEscalationSimulated}
      />
    );
  }

  return (
    <div id="portal-frame" className="min-h-screen bg-[#fafbfc] flex text-[#1e293b] font-sans antialiased">
      
      {/* SIDEBAR NAVIGATION COLUMN */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        pendingCount={pendingCount}
        activeCount={activeCount}
        dutyStatus={dutyStatus}
        setDutyStatus={setDutyStatus}
        userRole={currentUserRole}
        userName={currentUserName}
        userAvatar={
          currentUserRole === 'admin'
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
            : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'
        }
        onLogout={handleLogout}
      />

      {/* PRIMARY CONTROLLER CONTENT VIEWPORT */}
      <main id="main-content-viewport" className="flex-1 pl-80 min-h-screen flex flex-col">
        
        {/* Dynamic Warning for Duty status */}
        {dutyStatus !== 'online' && (
          <div className="bg-amber-50 border-b border-amber-100 px-8 py-2.5 flex items-center justify-between text-xs text-amber-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                {dutyStatus === 'break' 
                  ? "Status aktif: ISTIRAHAT. Antrean eskalasi krisis baru akan tetap dihimpun secara senyap."
                  : "Status aktif: OFFLINE. Eskalasi otomatis dialihkan ke psikolog klinis cadangan penanggung jawab."
                }
              </span>
            </div>
            <button
               onClick={() => setDutyStatus('online')}
               className="font-bold underline hover:text-amber-950 transition-colors cursor-pointer"
            >
              Kembali Aktif Bertugas
            </button>
          </div>
        )}

        {/* Content canvas container */}
        <div className="p-8 md:p-10 flex-1 overflow-y-auto">
          {renderActiveTabContents()}
        </div>
      </main>

      {/* FLOATING INTERACTIVE TOAST PIPELINE (For simulated crisis event demonstration) */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            id="floating-crisis-toast"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-[#1e293b] border-2 border-amber-500 shadow-xl shadow-amber-500/10 rounded-2xl p-5 text-white"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5.5 h-5.5 animate-bounce" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-sans font-bold text-sm text-white">Eskalasi AI Baru Masuk!</h4>
                  <button
                    onClick={() => setToastNotification(null)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400">{toastNotification.patientName}</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                    KASUS {toastNotification.riskLevel}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-normal mt-2 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                  {toastNotification.summary}
                </p>

                <div className="mt-4 flex gap-2 justify-end">
                  <button
                    onClick={() => setToastNotification(null)}
                    className="px-3 py-1.5 hover:bg-slate-800 rounded-lg text-slate-400 text-xs font-semibold"
                  >
                    Tunda
                  </button>
                  <button
                    onClick={() => {
                       handleIntervene(toastNotification.id);
                       setToastNotification(null);
                    }}
                    className="px-4 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-transform cursor-pointer"
                  >
                    Buka Ruang Intervensi Live
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
