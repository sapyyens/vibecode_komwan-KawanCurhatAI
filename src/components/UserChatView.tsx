import React, { useState, useRef, useEffect } from 'react';
import { Send, Heart, Sparkles, Smile, ShieldAlert, LogOut, RefreshCw, SendHorizontal, Clock, Coins, CreditCard, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { Message } from '../types';

interface UserChatViewProps {
  currentUserName: string;
  onLogout: () => void;
  onSimulateSystemEscalation?: (userMessage: string, responseMessages: Message[]) => void;
}

export default function UserChatView({ currentUserName, onLogout, onSimulateSystemEscalation }: UserChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'usr-init-1',
      sender: 'ai',
      senderName: 'Kawan Curhat (AI)',
      text: `Halo ${currentUserName}, selamat datang di ruang amanmu. Di sini, kamu bebas mencurahkan segala keresahan dan hal-hal yang memberatkan pikiranmu. Aku selalu siap mendengarkan tanpa menghakimi. Ada yang ingin kamu utarakan hari ini?`,
      timestamp: '15:30'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const [escalationStep, setEscalationStep] = useState<number>(0); // 0: no, 1: system takeover alert, 2: psychologist typing, 3: psychologist active

  // Paid Premium Consultation 'Kawan Curhat Banget' States
  const [isPaidSessionActive, setIsPaidSessionActive] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(600); // 10 minutes maximum
  const [sessionSecondsElapsed, setSessionSecondsElapsed] = useState(0);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'qris' | 'va' | 'card'>('qris');

  // Timer countdown formatting helper
  const formatTimeRemaining = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Billing duration formatting helper
  const formatElapsedTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s} detik`;
    return `${m} menit ${s} detik`;
  };

  // Countdown timer effect
  useEffect(() => {
    let timer: any;
    if (isPaidSessionActive && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsPaidSessionActive(false);
            setShowPaymentModal(true);
            
            const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            setMessages(m => [
              ...m,
              {
                id: `usr-sys-timeout-${Date.now()}`,
                sender: 'system',
                senderName: 'Sistem Kawan Curhat',
                text: 'Sesi premium Kawan Curhat Banget berakhir karena batas waktu maksimal 10 menit sudah tercapai. Invoice rincian biaya Anda telah diterbitkan.',
                timestamp
              }
            ]);
            return 0;
          }
          setSessionSecondsElapsed(elapsed => elapsed + 1);
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPaidSessionActive, timeLeftSeconds]);

  const handleStartPaidSession = () => {
    setShowRequestModal(false);
    setIsEscalated(true);
    setIsPaidSessionActive(true);
    setTimeLeftSeconds(600); // 10 minutes
    setSessionSecondsElapsed(0);
    setPaymentSuccess(false);
    setEscalationStep(3);

    const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const systemNotice: Message = {
      id: `usr-sys-paid-${Date.now()}`,
      sender: 'system',
      senderName: 'Sistem Kawan Curhat',
      text: 'Sesi konsultasi premium "Kawan Curhat Banget" Rp 10.050 telah dimulai. Anda kini terhubung secara personal selama maksimal 10 menit bersama Dr. Linda Halim, Sp.KJ. Pembayaran ditagihkan setelah sesi selesai.',
      timestamp
    };

    const docGreeting: Message = {
      id: `usr-psy-paid-greet-${Date.now()}`,
      sender: 'psychologist',
      senderName: 'Dr. Linda Halim, Sp.KJ',
      text: `Halo ${currentUserName}, selamat datang di jalur premium Kawan Curhat Banget. Saya Dr. Linda Halim, Sp.KJ. Saya hadir di sini secara khusus menemani curhat Anda mendalam selama 10 menit ke depan. Silakan utarakan apa yang sedang membebani dada Anda saat ini, saya mendengarkan sepenuhnya secara terapeutik.`,
      timestamp
    };

    const initialSessionMessages = [...messages, systemNotice, docGreeting];
    setMessages(initialSessionMessages);

    // Communicate to the parent dashboard that a psychologist session is active
    if (onSimulateSystemEscalation) {
      onSimulateSystemEscalation('Menghubungi psikolog via Kawan Curhat Banget', initialSessionMessages);
    }
  };

  const handleEndPaidSession = () => {
    setIsPaidSessionActive(false);
    setShowPaymentModal(true);
    
    // Post system message
    const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    setMessages(m => [
      ...m,
      {
        id: `usr-sys-end-${Date.now()}`,
        sender: 'system',
        senderName: 'Sistem Kawan Curhat',
        text: 'Sesi live Kawan Curhat Banget telah diakhiri atas permintaan pengguna. Rincian tagihan Anda telah diterbitkan.',
        timestamp
      }
    ]);
  };

  const handleCompletePayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentSuccess(false);
      // Reset escalation status since they paid and returned to AI safely
      setIsEscalated(false);
      setEscalationStep(0);
      
      const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [
        ...prev,
        {
          id: `usr-sys-payok-${Date.now()}`,
          sender: 'system',
          senderName: 'Sistem Kawan Curhat',
          text: 'Pembayaran Rp 10.000 Berhasil Diterima. Terima kasih telah menggunakan Kawan Curhat Banget. Anda sekarang telah terhubung kembali dengan asisten Kawan Curhat (AI).',
          timestamp
        }
      ]);
    }, 2000);
  };

  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `usr-msg-${Date.now()}`,
      sender: 'user',
      senderName: currentUserName,
      text: text,
      timestamp
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue('');

    // If Kawan Curhat Banget (Paid Session) is active
    if (isPaidSessionActive) {
      setIsAiTyping(true);
      setTimeout(() => {
        setIsAiTyping(false);
        const drReplies = [
          `Terima kasih sudah membagi ini dengan saya, ${currentUserName}. Penjelasan Anda memberikan konteks mendalam tentang gejolak emosional atau keresahan yang Anda rasakan.`,
          "Saya paham betul betapa tidak nyamannya beban pikiran tersebut. Ingat kita berada di ruang konsul khusus berdurasi maksimum 10 menit ini untuk memecahkan beban ini bersama.",
          "Menarik, ceritakan lebih lanjut mengenai sensasi fisik yang Anda rasakan. Sembari itu, mari kita diskusikan solusi koping praktisnya bersama keuangan dan stres Anda.",
          "Saya kagum atas keterbukaan Anda. Sesi Kawan Curhat Banget premium Anda berjalan dengan aman, murni aman, tanpa penghakiman apa pun.",
          "Bagaimana perasaan Anda sekarang mendengarkan respons saya? Mari kita kembangkan respons koping emosional yang sehat sebelum sesi berakhir."
        ];
        const randomReply = drReplies[Math.floor(Math.random() * drReplies.length)];
        const drResponse: Message = {
          id: `usr-psy-resp-${Date.now()}`,
          sender: 'psychologist',
          senderName: 'Dr. Linda Halim, Sp.KJ',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, drResponse]);
      }, 1500);
      return;
    }

    // Check if the message contains consultant referral keywords
    const lowerText = text.toLowerCase();
    const isCrisis = lowerText.includes('linda') || lowerText.includes('psikolog') || lowerText.includes('konsul') || lowerText.includes('dokter') || lowerText.includes('bimbingan khusus') || lowerText.includes('tidur selamanya');

    if (isCrisis && !isEscalated) {
      // Trigger live escalation simulation
      setIsAiTyping(true);
      setTimeout(() => {
        setIsAiTyping(false);
        setIsEscalated(true);
        setEscalationStep(1);

        const securityMsg: Message = {
          id: `usr-sys-${Date.now()}`,
          sender: 'system',
          senderName: 'Sistem Kawan Curhat',
          text: 'PENDAMPINGAN KHUSUS AKTIF: Menghubungkan Anda secara instan bersama Psikolog Klinis Dr. Linda Halim, Sp.KJ untuk mendapatkan bimbingan langsung...',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };

        const finalMessages = [...updatedMessages, securityMsg];
        setMessages(finalMessages);

        // Notify parent dashboard too
        if (onSimulateSystemEscalation) {
          onSimulateSystemEscalation(text, finalMessages);
        }

        // Simulating Psychologist entering the room in 4 seconds
        setTimeout(() => {
          setIsAiTyping(true); // Dr Linda typing
          setTimeout(() => {
            setIsAiTyping(false);
            setEscalationStep(2);
            const drMsg: Message = {
              id: `usr-psy-${Date.now()}`,
              sender: 'psychologist',
              senderName: 'Dr. Linda Halim, Sp.KJ',
              text: `Halo ${currentUserName}, saya Dokter Linda, psikolog yang bertugas memantau portal hari ini. Saya senang sekali menyambut Anda di ruang bimbingan personal kita. Mari rilekskan pikiran sejenak... apa yang bisa saya bantu diskusikan secara mendalam hari ini bersama Anda?`,
              timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, drMsg]);
          }, 3000);
        }, 4000);

      }, 1500);
    } else {
      // Standard AI response simulation
      if (isEscalated) {
        // Psychologist answers mockingly
        setIsAiTyping(true);
        setTimeout(() => {
          setIsAiTyping(false);
          const replies = [
            "Terima kasih sudah bertahan sejauh ini. Beritahu saya bagian tubuh mana yang terasa tegang sekarang? Mari kita lakukan teknik grounding 5-4-3-2-1 bersama.",
            "Saya mendengar pesan Anda dengan sangat jelas. Rasa putus asa itu terasa sangat nyata, tetapi jangan lupa kita bisa memilah beban ini satu per satu.",
            "Apakah ada teman, keluarga, atau orang terdekat di sekitar tempat tinggal Anda saat ini yang bisa dihubungi juga?",
            "Saya bangga dengan keberanian Anda mencari pertolongan hari ini. Silakan terus bersuara, saya di sini siap mendengarkan."
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          const drResponse: Message = {
            id: `usr-psy-resp-${Date.now()}`,
            sender: 'psychologist',
            senderName: 'Dr. Linda Halim, Sp.KJ',
            text: randomReply,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, drResponse]);
        }, 2000);
      } else {
        // Warm Empathetic AI replies
        setIsAiTyping(true);
        setTimeout(() => {
          setIsAiTyping(false);
          const aiReplies = [
            `Aku meraba kelelahan yang luar biasa dari kata-katamu, ${currentUserName}. Ketahuilah bahwa sangat wajar jika kamu merasa kewalahan saat ini. Ceritakan saja lebih banyak jika membantumu merasa nyaman.`,
            "Aku ada di sini menemani setiap embusan napasmu. Ceritakan bagian apa dari hari ini yang paling melelahkan pilar emosimu?",
            "Terima kasih sudah sangat jujur dan terbuka denganku. Walaupun aku hanyalah asisten kecerdasan buatan, aku sangat peduli untuk mendengarkan setiap keluh kesahmu tanpa menghakimi sedikit pun.",
            "Tidak usah tergesa-gesa. Tarik napas sejenak, regangkan bahumu, dan teruslah berkisah saat kamu sudah merasa sedikit lebih lega."
          ];
          const randomReply = aiReplies[Math.floor(Math.random() * aiReplies.length)];
          const aiResponse: Message = {
            id: `usr-ai-resp-${Date.now()}`,
            sender: 'ai',
            senderName: 'Kawan Curhat (AI)',
            text: randomReply,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, aiResponse]);
        }, 1500);
      }
    }
  };

  const handlePresetTrigger = (promptText: string) => {
    handleSendMessage(promptText);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'usr-init-1',
        sender: 'ai',
        senderName: 'Kawan Curhat (AI)',
        text: `Halo ${currentUserName}, selamat datang kembali di ruang amanmu. Di sini, kamu bebas mengekspresikan segala bentuk emosimu. Ada yang ingin kamu ceritakan untuk meringankan dada?`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setIsEscalated(false);
    setEscalationStep(0);
    setInputValue('');
    setIsPaidSessionActive(false);
    setTimeLeftSeconds(600);
    setSessionSecondsElapsed(0);
    setShowRequestModal(false);
    setShowPaymentModal(false);
    setPaymentSuccess(false);
  };

  return (
    <div id="user-chat-room-container" className="min-h-screen bg-gradient-to-tr from-emerald-50/40 via-white to-sky-50/40 flex flex-col font-sans text-slate-800">
      
      {/* Top Professional Soothing Header */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-40">
        
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-emerald-550 border-2 border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-50">
            <Heart className="w-5.5 h-5.5 fill-rose-100 text-rose-500 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-bold text-[#0f172a] text-sm">Kawan Curhat (Virtual Room)</span>
              <span className={`w-2 h-2 rounded-full ${isEscalated ? 'bg-amber-500 animate-ping' : 'bg-green-500 animate-pulse'}`}></span>
            </div>
            
            <p className="text-[11px] text-slate-500 font-semibold leading-none mt-1">
              {isEscalated ? (
                <span className="text-amber-700 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-amber-600" /> Pengawasan Psikolog Aktif (Live: Dr. Linda Halim, Sp.KJ)
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-500" /> Pendamping AI Aktif & Dipantau Klinis
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 select-none">
          <button
            type="button"
            onClick={handleResetChat}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Set Ulang Simulasi Chat"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Sesi</span>
          </button>
          
          <button
            type="button"
            onClick={onLogout}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Kembali ke Layar Login"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Portal</span>
          </button>
        </div>

      </header>

      {/* Main Workspace Frame with Two-Column Split (Suggestions Left, Chat Center) */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 md:p-6 items-stretch">
        
        {/* Left column guide panel */}
        <div className="lg:col-span-1 space-y-4 flex flex-col justify-between max-h-[calc(100vh-120px)] lg:sticky lg:top-24">
          
          <div className="space-y-4">
            
            {/* Official App Function Statement */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3.5 shadow-xs">
              <h3 className="font-bold text-xs text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-100" />
                <span>Tentang Kawan Curhat</span>
              </h3>
              <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">
                Aplikasi <strong>Kawan Curhat</strong> adalah platform kesehatan mental modern yang menggunakan <strong>Kecerdasan Buatan (AI) sebagai confidant (teman curhat)</strong> tepercaya Anda untuk mendengarkan keluh kesah harian secara konfidensial. 
              </p>
              <p className="text-[11px] text-slate-600 font-semibold leading-relaxed pt-2.5 border-t border-slate-100">
                Kami juga menyediakan <strong>ruang pertolongan klinis khusus</strong> untuk berkoneksi dan chat live secara langsung dengan <strong>Psikolog Klinis</strong> berlisensi kapan pun Anda membutuhkan arahan profesional.
              </p>
            </div>

            {/* Kawan Curhat Banget Button */}
            <button
              id="kawan-curhat-banget-btn"
              type="button"
              onClick={() => {
                if (isPaidSessionActive) {
                  alert("Sesi Kawan Curhat Banget sedang berjalan aktif!");
                } else {
                  setShowRequestModal(true);
                }
              }}
              className="w-full py-4 px-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex flex-col items-center gap-1.5 border border-indigo-400 relative overflow-hidden group select-none text-center"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-200 animate-pulse" />
                <span className="tracking-wide text-xs">KAWAN CURHAT BANGET</span>
              </div>
              <span className="text-[10px] text-indigo-150 font-medium">Chat Live Psikolog • Rp10.000 / Sesi</span>
            </button>

            {/* Simulation Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
              
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-bold text-xs text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
                  <Smile className="w-4 h-4 text-emerald-600" />
                  <span>Inspirasi Obrolan</span>
                </h3>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-1">
                  Coba ketuk topik bimbingan berikut:
                </p>
              </div>

              <div className="space-y-3">
                {/* Option 1: Normal dialogue */}
                <div className="space-y-1">
                  <p className="text-[9px] uppercase font-mono font-bold text-slate-500">Topik A (Keseimbangan Harian)</p>
                  <button
                    type="button"
                    onClick={() => handlePresetTrigger('Hari ini sangat melelahkan dok, di kantor banyak sekali tumpukan berkas dan bos menuntut lembur.')}
                    disabled={isEscalated}
                    className={`w-full text-left p-2.5 rounded-xl border text-[11px] font-bold transition-all leading-normal flex flex-col gap-1 ${
                      isEscalated 
                        ? 'border-slate-100 bg-slate-50/50 text-slate-400 cursor-not-allowed'
                        : 'border-emerald-200 bg-emerald-50/40 text-emerald-950 hover:bg-emerald-50 cursor-pointer'
                    }`}
                  >
                    <span>"Hari ini menceritakan keseharian..."</span>
                    <span className="text-[9px] text-slate-400 font-normal">AI merespons hangat dengan panduan relaksasi pernapasan.</span>
                  </button>
                </div>

                {/* Option 2: Live Referral Handoff Trigger */}
                <div className="space-y-1">
                  <p className="text-[9px] uppercase font-mono font-bold text-indigo-500">Topik B (Bimbingan Rutinitas Teratur)</p>
                  <button
                    type="button"
                    onClick={() => handlePresetTrigger('Saya berminat berkonsultasi langsung dengan psikolog Dr. Linda mengenai cara membangun pola tidur yang konsisten dan menyegarkan.')}
                    disabled={isEscalated}
                    className={`w-full text-left p-2.5 rounded-xl border text-[11px] font-bold transition-all leading-normal flex flex-col gap-1 ${
                      isEscalated 
                        ? 'border-slate-100 bg-slate-50/50 text-slate-400 cursor-not-allowed'
                        : 'border-[#bfdbfe] bg-[#eff6ff] text-indigo-950 hover:bg-[#dbeafe] cursor-pointer'
                    }`}
                  >
                    <span className="text-indigo-900">🌸 "Ingin konsultasi pola tidur..."</span>
                    <span className="text-[9px] text-slate-400 font-normal">Konek langsung secara instan bersama psikolog klinis berlisensi kami.</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Guidelines notes */}
          <div className="bg-slate-900 text-slate-300 p-4.5 rounded-2xl space-y-2 border border-slate-800 hidden lg:block select-none">
            <h4 className="text-[11px] font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>Sesi Mandiri & Mitra</span>
            </h4>
            <p className="text-[10px] leading-relaxed text-slate-400 font-medium">
              Gunakan sesi <strong>Kawan Curhat Banget</strong> untuk rujukan premium instan harian, atau hubungi Dokter Linda lewat obrolan kapan pun Anda memerlukan bimbingan.
            </p>
          </div>

        </div>

        {/* Center column: Cozy messaging client viewport (3 columns span on desktop) */}
        <div className="lg:col-span-3 flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm h-[calc(100vh-140px)] bg-slate-50/20">
          
          {isPaidSessionActive && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 px-5 py-3.5 flex items-center justify-between select-none animate-fade-in shrink-0">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                </span>
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1">
                  Sesi Kawan Curhat Banget Aktif
                </span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                  Rp 10.000 / Maks 10 Menit
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-indigo-600 text-white font-mono font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Sisa Waktu: {formatTimeRemaining(timeLeftSeconds)}</span>
                </div>
                <button
                  type="button"
                  onClick={handleEndPaidSession}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Akhiri Sesi
                </button>
              </div>
            </div>
          )}
          
          {/* Internal chat feed log */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4 bg-slate-50/60">
            
            {messages.map((msg) => {
              const isMe = msg.sender === 'user';
              const isSystem = msg.sender === 'system';
              const isPsy = msg.sender === 'psychologist';

              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-4 animate-fade-in text-center">
                    <div className="bg-indigo-50/80 border-2 border-indigo-200 rounded-2xl p-4 max-w-lg text-indigo-900 space-y-1.5 shadow-sm">
                      <div className="flex justify-center">
                        <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Layanan Pendampingan Utama Aktif</p>
                      <p className="text-[11px] leading-relaxed font-semibold">{msg.text}</p>
                      <span className="block text-[9px] text-indigo-400 font-mono mt-1 pr-1 text-right">{msg.timestamp}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] md:max-w-[70%] animate-fade-in ${
                    isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  
                  {/* Sender avatar */}
                  {!isMe && (
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm font-bold text-xs select-none ${
                      isPsy ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-indigo-950'
                    }`}>
                      {isPsy ? 'LD' : 'AI'}
                    </div>
                  )}

                  <div className="space-y-1">
                    
                    {/* Sender metadata info */}
                    <div className={`flex items-center gap-2 text-[10px] font-bold text-slate-500 select-none ${
                      isMe ? 'justify-end' : ''
                    }`}>
                      <span>{msg.senderName}</span>
                      <span className="font-normal text-slate-400 font-mono">{msg.timestamp}</span>
                    </div>

                    {/* Chat Bubble Body */}
                    <div className={`p-4 rounded-2xl leading-relaxed text-xs font-semibold ${
                      isMe 
                        ? 'bg-slate-900 text-white rounded-tr-none shadow-md shadow-slate-950/5' 
                        : isPsy 
                        ? 'bg-indigo-50 text-indigo-950 border border-indigo-150 rounded-tl-none shadow-sm' 
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.text}
                    </div>

                  </div>

                </div>
              );
            })}

            {/* AI companion typing feedback */}
            {isAiTyping && (
              <div className="flex gap-3 items-center mr-auto animate-pulse select-none">
                <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center font-bold text-slate-400 text-xs">
                  ...
                </div>
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none text-[10px] text-slate-500 font-bold flex items-center gap-1.5 shadow-xs">
                  <span>{isEscalated ? 'Dr. Linda Halim sedang mengetik intervensi...' : 'Kawan Curhat sedang merumuskan kata...'}</span>
                </div>
              </div>
            )}

            <div ref={messageEndRef} />

          </div>

          {/* Footer input form */}
          <footer className="p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex gap-2"
            >
              <input
                id="user-chat-input-field"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isEscalated ? "Ketik balasan Anda ke dokter di sini..." : "Ceritakan kecemasan atau keluh kesahmu di sini..."}
                className="flex-1 bg-slate-50 hover:bg-slate-100/50 focus:bg-white p-3.5 border border-slate-200 rounded-2xl text-xs font-bold leading-normal focus:outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950 transition-all placeholder:text-slate-400"
              />
              <button
                id="user-submit-msg-btn"
                type="submit"
                className="h-12 w-12 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl flex items-center justify-center transition-all cursor-pointer hover:scale-105 shadow-sm text-center shrink-0"
                title="Kirim Pesan"
              >
                <SendHorizontal className="w-5 h-5" />
              </button>
            </form>

            <div className="text-[9px] text-[#94a3b8] mt-2 font-bold px-1 flex items-center gap-1">
              <span>Keamanan Kawan Curhat SSL Terenskripsi. Sesi Anda dilindungi secara konfidensial medis.</span>
            </div>
          </footer>

        </div>

      </div>

      {/* REQUEST MODAL: Kawan Curhat Banget Invitation */}
      {showRequestModal && (
        <div id="request-session-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full overflow-hidden p-6 space-y-5">
            
            <div className="text-center space-y-2">
              <div className="mx-auto h-12 w-12 bg-gradient-to-tr from-indigo-550 to-purple-500 text-indigo-600 rounded-2xl flex items-center justify-center shadow-md shadow-indigo-100">
                <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Mulai Kawan Curhat Banget</h3>
              <p className="text-xs text-slate-500 leading-normal">
                Bicara langsung secara intens, privat, dan aman bersama Psikolog Klinis berlisensi kami.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100">
              
              <div className="flex items-start gap-2.5">
                <div className="p-1 px-1.5 bg-indigo-150 text-indigo-700 rounded-lg font-mono font-bold text-[10px]">Rp</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Tarif Sangat Terjangkau</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Hanya <strong>Rp 10.000</strong> per sesi konsultasi live dengan psikolog berlisensi.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-slate-200/50 pt-2.5">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Maksimal 10 Menit</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Durasi maksimum adalah <strong>10 menit per sesi</strong> untuk penanganan yang fokus. Sisa waktu dipajang di layar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 border-t border-slate-200/50 pt-2.5">
                <CreditCard className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Sistem Pascabayar</h4>
                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Sesi dimulai seketika, dan biaya <strong>ditagihkan setelah sesi konsultasi berakhir</strong>.
                  </p>
                </div>
              </div>

            </div>

            <p className="text-[9px] text-slate-400 font-semibold text-center">
              *Portal Kawan Curhat tetap menyediakan asisten AI gratis kapan saja untuk teman curhat harian Anda.
            </p>

            <div className="flex gap-2.5 pt-1.5">
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleStartPaidSession}
                className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-100 cursor-pointer text-center"
              >
                Mulai (Rp 10.000)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PAYMENT INVOICE MODAL: Pascabayar Billing System */}
      {showPaymentModal && (
        <div id="payment-invoice-modal" className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-sm w-full overflow-hidden p-6 space-y-4">
            
            <div className="text-center space-y-1">
              <div className="mx-auto h-11 w-11 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <Coins className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Tagihan Layanan</h3>
              <p className="text-[11px] text-slate-500">Sesi premium Kawan Curhat Banget Anda telah usai.</p>
            </div>

            <div className="border border-slate-150 rounded-2xl overflow-hidden bg-slate-50/70">
              <div className="bg-slate-100 px-3.5 py-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-150">
                Rincian Transaksi
              </div>
              <div className="p-3.5 space-y-2 text-xs font-semibold">
                
                <div className="flex justify-between items-center text-slate-500">
                  <span>Nama Pasien:</span>
                  <span className="text-slate-800 font-bold">{currentUserName}</span>
                </div>

                <div className="flex justify-between items-center text-slate-500">
                  <span>Mitra Psikolog:</span>
                  <span className="text-slate-800 font-bold">Dr. Linda Halim, Sp.KJ</span>
                </div>

                <div className="flex justify-between items-center text-slate-500">
                  <span>Durasi Sesi:</span>
                  <span className="text-slate-850 font-bold bg-slate-200/60 px-2 py-0.5 rounded font-mono text-[10px]">
                    {formatElapsedTime(sessionSecondsElapsed)}
                  </span>
                </div>

                <div className="border-t border-dashed border-slate-300 pt-2.5 flex justify-between items-center text-xs font-bold text-slate-950">
                  <span>Total Tagihan:</span>
                  <span className="text-emerald-600 font-bold text-sm">Rp 10.000</span>
                </div>

              </div>
            </div>

            {/* Payment methods selector */}
            {!paymentSuccess ? (
              <div className="space-y-3">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Metode Pascabayar:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('qris')}
                    className={`py-1.5 px-1 border rounded-lg font-bold text-[9px] text-center transition-all cursor-pointer ${
                      selectedPaymentMethod === 'qris'
                        ? 'border-emerald-500 bg-emerald-50/60 text-emerald-800'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    🚀 QRIS
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('va')}
                    className={`py-1.5 px-1 border rounded-lg font-bold text-[9px] text-center transition-all cursor-pointer ${
                      selectedPaymentMethod === 'va'
                        ? 'border-emerald-500 bg-emerald-50/60 text-emerald-800'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    🏦 Virtual Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPaymentMethod('card')}
                    className={`py-1.5 px-1 border rounded-lg font-bold text-[9px] text-center transition-all cursor-pointer ${
                      selectedPaymentMethod === 'card'
                        ? 'border-emerald-500 bg-emerald-50/60 text-emerald-800'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-500'
                    }`}
                  >
                    💳 Card Pay
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center space-y-2 select-none">
                  {selectedPaymentMethod === 'qris' ? (
                    <div className="space-y-1">
                      <div className="mx-auto h-20 w-20 bg-white border border-slate-300 p-1 flex items-center justify-center rounded">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=KawanCurhatBangetRp10000" className="w-[70px] h-[70px] object-contain" alt="Mock QRIS" referrerPolicy="no-referrer" />
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Scan QRIS Untuk Melunasi</p>
                    </div>
                  ) : selectedPaymentMethod === 'va' ? (
                    <div className="py-1">
                      <p className="text-slate-500 text-[9px] font-bold">NOMOR VA MANDIRI/BCA:</p>
                      <p className="text-indigo-600 font-mono font-bold text-xs tracking-wider mt-0.5">8835 1253 9011 0001</p>
                      <p className="text-[8px] text-slate-400 font-bold mt-1">Salin untuk pelunasan instan</p>
                    </div>
                  ) : (
                    <div className="py-1.5 space-y-0.5 bg-white border border-slate-200 rounded-lg max-w-xs mx-auto p-2">
                      <p className="text-[9px] text-slate-500 font-semibold text-left">💳 Card Number: **** **** **** 4890</p>
                      <p className="text-[9px] text-slate-450 font-semibold text-left">Exp: 12/28 • CVV: ***</p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleCompletePayment}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Bayar Tagihan Rp 10.000</span>
                </button>
              </div>
            ) : (
              <div className="py-6 space-y-4 text-center animate-fade-in select-none">
                <div className="mx-auto h-11 w-11 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-[#0f172a]">Pembayaran Sukses Terverifikasi!</h4>
                  <p className="text-[10px] text-slate-500">Terima kasih atas kontribusi Anda. Sesi selesai selamat.</p>
                </div>
                <div className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 py-1 px-2.5 rounded-full inline-block">
                  Menghubungkan kembali ke AI...
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
