import { Patient, EscalatedChat, AiSensitivitySettings, AiPerformanceLog } from './types';

// Let's seed initial patients list with positive/developmental goals
export const initialPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Budi Santoso',
    age: 24,
    gender: 'Laki-laki',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    joinDate: '2026-03-10',
    moodTrend: 'calm',
    riskScore: 10,
    crisisStatus: 'normal',
    lastSeen: '10 mins ago',
    sessionCount: 14,
    clinicalNotes: 'Pasien aktif bertukar pikiran untuk menyusun kebiasaan tidur teratur dan manajemen waktu persiapan ujian kuliah akhir.'
  },
  {
    id: 'p2',
    name: 'Siti Rahma',
    age: 19,
    gender: 'Perempuan',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    joinDate: '2026-04-01',
    moodTrend: 'improving',
    riskScore: 12,
    crisisStatus: 'normal',
    lastSeen: 'Just now',
    sessionCount: 8,
    clinicalNotes: 'Melakukan latihan berkala untuk melatih kepercayaan diri saat presentasi akademik serta mengatasi hambatan berbicara di depan publik.'
  },
  {
    id: 'p3',
    name: 'Michael Tan',
    age: 31,
    gender: 'Laki-laki',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    joinDate: '2026-01-15',
    moodTrend: 'stablizing',
    riskScore: 8,
    crisisStatus: 'normal',
    lastSeen: '1 hour ago',
    sessionCount: 22,
    clinicalNotes: 'Pasien menjalani pendampingan kepemimpinan dan penyeimbangan beban kerja baru guna mengantisipasi kelelahan karir profesional.'
  },
  {
    id: 'p4',
    name: 'Amanda Putri',
    age: 27,
    gender: 'Perempuan',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    joinDate: '2026-05-12',
    moodTrend: 'improving',
    riskScore: 5,
    crisisStatus: 'resolved',
    lastSeen: '3 hours ago',
    sessionCount: 5,
    clinicalNotes: 'Berkonsultasi seputar pembiasaan meditasi relaksasi fajar untuk menjaga konsentrasi optimal sepanjang aktivitas harian.'
  },
  {
    id: 'p5',
    name: 'Rian Hidayat',
    age: 35,
    gender: 'Laki-laki',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    joinDate: '2026-02-28',
    moodTrend: 'calm',
    riskScore: 4,
    crisisStatus: 'normal',
    lastSeen: 'Yesterday',
    sessionCount: 19,
    clinicalNotes: 'Menggunakan Kawan Curhat secara mingguan untuk menulis refleksi harian kreatif, pembentukan resolusi tahunan, dan evaluasi fokus diri.'
  }
];

// Seed chat conversations showing safe transitions from AI Friend to Psychologist
export const initialEscalatedChats: EscalatedChat[] = [
  {
    id: 'c1',
    patientId: 'p1',
    patientName: 'Budi Santoso',
    patientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    riskLevel: 'medium',
    escalatedAt: '13:16:45',
    triggerPhrases: [
      'jadwal tidur berantakan',
      'kesulitan fokus kuliah',
      'butuh konsultasi kebiasaan harian'
    ],
    aiSentimentSummary: 'Asisten menyarankan pembentukan ritual istirahat malam teratur. Menyelaraskan sesi bimbingan bersama dokter pendamping untuk rekomendasi jam biologis yang optimal.',
    currentStatus: 'pending',
    messages: [
      {
        id: '1',
        sender: 'user',
        senderName: 'Budi Santoso',
        text: 'Halo Kawan, kamu di sana? Aku lagi merasa butuh saran tentang cara tidur lebih berkualitas malam ini.',
        timestamp: '13:10:02'
      },
      {
        id: '2',
        sender: 'ai',
        senderName: 'Kawan Curhat (AI)',
        text: 'Halo Budi, aku selalu ada di sini untuk mendengarmu. Tentu saja, mari kita rancang langkah tidur relaks bersama secara ramah. Apa yang biasanya kamu lakukan sebelum mematikan lampu?',
        timestamp: '13:10:15'
      },
      {
        id: '3',
        sender: 'user',
        senderName: 'Budi Santoso',
        text: 'Aku sering memegang handphone sampai larut malam dok. Menghubungi mentor dokter atau melatih pernapasan kelihatannya asyik nih kawan.',
        timestamp: '13:12:30',
        isFlagged: false
      },
      {
        id: '4',
        sender: 'ai',
        senderName: 'Kawan Curhat (AI)',
        text: 'Budi, menyisihkan handphone 30 menit sebelum tidur sangat menenangkan. Bolehkah saya hubungkan ke konsultan profesional kami untuk panduan rutinitas tidur terapeutik?',
        timestamp: '13:13:00'
      },
      {
        id: '5',
        sender: 'user',
        senderName: 'Budi Santoso',
        text: 'Boleh sekali kawan, hubungkan saya dengan Dr. Linda untuk panduan khusus yang lebih detail.',
        timestamp: '13:16:10',
        isFlagged: false
      },
      {
        id: '6',
        sender: 'system',
        senderName: 'Sistem Kawan Curhat',
        text: 'PENDAMPINGAN KHUSUS: Sesi pendampingan dialihkan demi kenyamanan Anda. Kawan Curhat sedang menghubungkan Anda ke Psikolog Berlisensi profesional.',
        timestamp: '13:16:45'
      }
    ]
  },
  {
    id: 'c2',
    patientId: 'p2',
    patientName: 'Siti Rahma',
    patientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    riskLevel: 'medium',
    escalatedAt: '13:22:15',
    triggerPhrases: [
      'persiapan wawancara kerja',
      'demam panggung',
      'bicara di depan umum'
    ],
    aiSentimentSummary: 'Mengidentifikasi kecemasan berbicara di depan umum sebelum wawancara magang. AI menyelaraskan koneksi ke psikolog penanggung jawab untuk bimbingan de-eskalasi gugup panggung.',
    currentStatus: 'pending',
    messages: [
      {
        id: 's1',
        sender: 'user',
        senderName: 'Siti Rahma',
        text: 'Asisten, besok siang ada wawancara magang perdana dari kampus. Rasanya agak gugup nih.',
        timestamp: '13:18:22'
      },
      {
        id: 's2',
        sender: 'ai',
        senderName: 'Kawan Curhat (AI)',
        text: 'Siti, rasa gugup itu tanda kamu sangat peduli dan ingin memberikan yang terbaik! Coba bayangkan kamu sedang berbicara dengan kawan dekat. Tarik napas perlahan untuk menenangkan debaran dadamu.',
        timestamp: '13:18:50'
      },
      {
        id: 's3',
        sender: 'user',
        senderName: 'Siti Rahma',
        text: 'Terima kasih kawan AI, apakah saya bisa berkonsultasi langsung secara pribadi dengan dokter psikolog tentang teknik relaksasi vokal kilat?',
        timestamp: '13:21:40',
        isFlagged: false
      },
      {
        id: 's4',
        sender: 'system',
        senderName: 'Sistem Kawan Curhat',
        text: 'PENDAMPINGAN DIALIRKAN: Menghubungkan Anda secara instan ke tim psikolog klinis profesional berlisensi.',
        timestamp: '13:22:15'
      }
    ]
  }
];

export const initialAiSettings: AiSensitivitySettings = {
  selfHarmThreshold: 85,
  anxietyThreshold: 75,
  depressionThreshold: 80,
  griefThreshold: 90,
  escalationTimeoutMinutes: 3,
  fallbackPsychologistId: 'ps-dr-linda',
  systemPromptPreset: 'Anda adalah "Kawan Curhat", asisten pendengar yang empati, suportif, dan ramah. Gunakan gaya bahasa kasual ramah Indonesia ("aku-kamu"). Berikan tanggapan yang hangat dan sadar emosi untuk menyejukkan hati pengguna.'
};

export const initialAiLogs: AiPerformanceLog[] = [
  {
    id: 'l1',
    timestamp: 'Today, 09:30 AM',
    patientName: 'Amanda Putri',
    primaryTrigger: 'Mencari teknik konsentrasi belajar efisien.',
    outcome: 'successful_intervention',
    accuracyRating: 'accurate',
    notes: 'Asisten memberikan saran pengelompokan waktu (Pomodoro). Mengalirkan sesi bimbingan lanjutan bersama Dr. Linda dengan kepuasan tinggi.'
  },
  {
    id: 'l2',
    timestamp: 'Today, 07:15 AM',
    patientName: 'Bambang Nugroho',
    primaryTrigger: 'Diskusi tentang buku fiksi sains bertema penjelajah bintang.',
    outcome: 'preventative_resolved',
    accuracyRating: 'accurate',
    notes: 'AI mengimbangi diskusi sastra dengan sangat inspiratif, menguatkan daya kognitif kreatif pasien.'
  },
  {
    id: 'l3',
    timestamp: 'Yesterday, 16:40 PM',
    patientName: 'Rika Lestari',
    primaryTrigger: 'Merumuskan daftar resolusi harian kebugaran pagi hari.',
    outcome: 'preventative_resolved',
    accuracyRating: 'accurate',
    notes: 'Berhasil menyusun rencana olahraga berjalan kaki 15 menit dan meditasi fajar.'
  }
];

export const defaultSimulatedResponses: Record<string, string[]> = {
  'p1': [
    'Terima kasih banyak dok atas masukannya. Regulasi jadwal tidur saya terasa jauh lebih baik sekarang.',
    'Saya menyukai teknik peregangan otot ringan sebelum tidur yang dokter rekomendasikan kemarin.',
    'Mengetahui ada dukungan terpercaya di sini sangat menentramkan pikiran kuliah saya.',
    'Baik dok, saya akan terus memelihara rutinitas malam ini dengan penuh komitmen.'
  ],
  'p2': [
    'Syukurlah dokter... simulasi wawancara tadi siang membuat vokal saya terdengar santai.',
    'Saya dapat mengontrol debar jantung dengan berlatih kontak mata imajiner secara tenang.',
    'Saya akan mencoba minum air putih hangat seperti saran dari asisten AI malam ini.',
    'Terima kasih banyak dok, persiapan ini benar-benar berjalan kondusif.'
  ]
};
