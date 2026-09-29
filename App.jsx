import React, { useState, useEffect, useRef } from 'react';
import Mock1Reading from "./Mock1Reading";

const backgroundStyles = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .animated-bg {
    background: linear-gradient(-45deg, #ffffff, #f4e8ff, #ffffff, #e0f2fe);
    background-size: 400% 400%;
    animation: gradient 12s ease infinite;
    position: relative;
    overflow: hidden;
    min-height: 100vh;
  }

  /* Loyihaning standart index.css/App.css fayli #root ga max-width va
     padding berib qo'ygan bo'lishi mumkin (Vite default shablon shunday).
     Shu sabab sahifa markazga siqilib, ikki yonida bo'sh joy qolyapti.
     Quyidagi qoidalar shu cheklovlarni majburiy tarzda bekor qiladi. */
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    max-width: 100%;
  }

  /* Practice bo'limidagi mock kartochkalari uchun sichqoncha ustiga
     borganda chiqadigan tanlash (hover) effekti */
  .mock-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  }
  .mock-card:hover {
    transform: translateY(-6px) scale(1.02) !important;
    box-shadow: 0 16px 32px rgba(37, 99, 235, 0.22) !important;
    border-color: #2563eb !important;
    background: #f0f7ff !important;
  }

  #root {
    margin: 0 !important;
    padding: 0 !important;
    max-width: 100% !important;
    width: 100% !important;
    text-align: left !important;
  }
`;

// ==========================================================================
// TO'LOV PROVAYDERLARI SOZLAMALARI
// TODO: Quyidagi placeholder qiymatlarni haqiqiy Merchant ID'lar bilan
// almashtiring. Click uchun: Click Merchant Cabinet (my.click.uz/cabinet)
// Payme uchun: Payme Business (business.payme.uz)
// ==========================================================================
const PAYMENT_CONFIG = {
  click: {
    merchantId: 'CLICK_MERCHANT_ID', // TODO: haqiqiy Merchant ID bilan almashtiring
    serviceId: 'CLICK_SERVICE_ID',   // TODO: haqiqiy Service ID bilan almashtiring
  },
  payme: {
    merchantId: 'PAYME_MERCHANT_ID', // TODO: haqiqiy Merchant ID bilan almashtiring
  }
};

// ==========================================================================
// GOOGLE SIGN-IN SOZLAMALARI
// TODO: clientId'ni Google Cloud Console (console.cloud.google.com) dagi
// "APIs & Services > Credentials" bo'limidan olingan OAuth 2.0 Client ID
// bilan almashtiring. Authorized JavaScript origins ga saytingiz domenini
// (masalan http://localhost:5173 va production domeningizni) qo'shishni unutmang.
// ==========================================================================
const GOOGLE_CONFIG = {
  clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // TODO: haqiqiy Client ID bilan almashtiring
};

// ==========================================================================
// YUTUQLAR (BADGES) RO'YXATI
// Har bir yutuq: id, ko'rinishi (emoji + nom) va qachon qo'lga kiritilishi
// (jami topshirilgan testlar soni yoki joriy seriya asosida)
// ==========================================================================
const BADGES = [
  { id: 'first', label: 'First Step', desc: 'Completed your 1st test', check: (total) => total >= 1 },
  { id: 'five', label: 'Active Learner', desc: 'Completed 5 tests', check: (total) => total >= 5 },
  { id: 'ten', label: 'Mock Master', desc: 'Completed 10 tests', check: (total) => total >= 10 },
  { id: 'streak3', label: '3-Day Streak', desc: '3 days in a row', check: (total, streak) => streak >= 3 },
  { id: 'streak7', label: '7-Day Streak', desc: '7 days in a row', check: (total, streak) => streak >= 7 },
];

// ==========================================================================
// QUICK QUIZ - GRAMMATIKA MAVZULARI
// Bu bo'lim IELTS/SAT'ga xos emas - umumiy grammatika bilimini mustahkamlash
// uchun yoshlar (barcha foydalanuvchilar) uchun mo'ljallangan. Har bir test
// alohida mavzu bo'yicha 20 tadan savoldan iborat bo'ladi.
// ==========================================================================
const QUICK_QUIZ_TESTS = [
  { title: 'Test 1', topic: 'Present Simple' },
  { title: 'Test 2', topic: 'Present Continuous' },
  { title: 'Test 3', topic: 'Past Simple' },
  { title: 'Test 4', topic: 'Past Continuous' },
  { title: 'Test 5', topic: 'Present Perfect' },
  { title: 'Test 6', topic: 'Future Simple (will)' },
  { title: 'Test 7', topic: 'Modal Verbs' },
  { title: 'Test 8', topic: "Articles (a / an / the)" },
];

// ==========================================================================
// IELTS RASMIY BAND JADVALI (Academic) - Listening va Reading uchun
// Chap ustun: to'g'ri topilgan savollar soni (40 tadan)
// O'ng ustun: shu songa mos band ball
// ==========================================================================
const READING_BAND_TABLE = [
  { min: 39, max: 40, band: 9.0 },
  { min: 37, max: 38, band: 8.5 },
  { min: 35, max: 36, band: 8.0 },
  { min: 33, max: 34, band: 7.5 },
  { min: 30, max: 32, band: 7.0 },
  { min: 27, max: 29, band: 6.5 },
  { min: 23, max: 26, band: 6.0 },
  { min: 19, max: 22, band: 5.5 },
  { min: 15, max: 18, band: 5.0 },
  { min: 13, max: 14, band: 4.5 },
  { min: 10, max: 12, band: 4.0 },
  { min: 8, max: 9, band: 3.5 },
  { min: 6, max: 7, band: 3.0 },
  { min: 4, max: 5, band: 2.5 },
  { min: 0, max: 3, band: 2.0 },
];

const LISTENING_BAND_TABLE = [
  { min: 39, max: 40, band: 9.0 },
  { min: 37, max: 38, band: 8.5 },
  { min: 35, max: 36, band: 8.0 },
  { min: 32, max: 34, band: 7.5 },
  { min: 30, max: 31, band: 7.0 },
  { min: 26, max: 29, band: 6.5 },
  { min: 23, max: 25, band: 6.0 },
  { min: 18, max: 22, band: 5.5 },
  { min: 16, max: 17, band: 5.0 },
  { min: 13, max: 15, band: 4.5 },
  { min: 11, max: 12, band: 4.0 },
  { min: 8, max: 10, band: 3.5 },
  { min: 6, max: 7, band: 3.0 },
  { min: 4, max: 5, band: 2.5 },
  { min: 0, max: 3, band: 2.0 },
];

// To'g'ri javoblar soni (raw score, 0-40) -> band ball
function scoreToBand(rawScore, table) {
  const row = table.find(r => rawScore >= r.min && rawScore <= r.max);
  return row ? row.band : table[table.length - 1].band;
}

// VAQTINCHALIK: hozircha savol-javoblarni haqiqiy tekshiradigan tizim yo'q,
// shu sababli 0-40 oralig'ida tasodifiy "to'g'ri javoblar soni" generatsiya
// qilinadi, so'ngra yuqoridagi rasmiy IELTS jadvali asosida band ballga
// aylantiriladi. Review (tahlil) ekrani uchun qaysi savol raqamlari xato
// bo'lgani ham simulyatsiya qilinadi. Haqiqiy savol-javob tizimi
// qo'shilganda bu joyni haqiqiy natijalarga almashtirish kifoya - jadval
// va Review ekranining logikasi tayyor turadi.
function generateSimulatedScore(table) {
  const raw = Math.floor(Math.random() * 41); // 0 dan 40 gacha
  const band = scoreToBand(raw, table);
  const allQuestions = Array.from({ length: 40 }, (_, i) => i + 1);
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  const wrongCount = 40 - raw;
  const wrongQuestions = shuffled.slice(0, wrongCount).sort((a, b) => a - b);
  return { raw, band, wrongQuestions };
}

// Har bir foydalanuvchi uchun tasodifiy (unique bo'lishga yaqin) taklif kodi generatori
function generateRefCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase() + Date.now().toString(36).slice(-3).toUpperCase();
}

// Click uchun standart checkout URL generatori
// Hujjat: https://docs.click.uz
function buildClickCheckoutUrl(amount, userIdentifier) {
  const { merchantId, serviceId } = PAYMENT_CONFIG.click;
  const params = new URLSearchParams({
    service_id: serviceId,
    merchant_id: merchantId,
    amount: String(amount),
    transaction_param: userIdentifier,
  });
  return `https://my.click.uz/services/pay?${params.toString()}`;
}

// Payme uchun standart checkout URL generatori (base64-kodlangan parametrlar)
// Hujjat: https://developer.help.paycom.uz
function buildPaymeCheckoutUrl(amount, userIdentifier) {
  const { merchantId } = PAYMENT_CONFIG.payme;
  // Payme summani tiyin (so'mning 1/100) da kutadi
  const raw = `m=${merchantId};ac.user_id=${userIdentifier};a=${amount * 100}`;
  const encoded = typeof window !== 'undefined' ? window.btoa(raw) : raw;
  return `https://checkout.paycom.uz/${encoded}`;
}

// Google'dan kelgan JWT (id_token) ni dekodlash uchun yordamchi funksiya
// Eslatma: bu faqat mijoz (client) tomonda ko'rsatish uchun dekodlanadi.
// Haqiqiy loyihada token backendga yuborilib, u yerda Google kutubxonasi
// (masalan google-auth-library) orqali tasdiqlanishi SHART.
function decodeGoogleJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function App() {
  const [activeModal, setActiveModal] = useState(null); // 'login', 'signup', 'topup'
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [currentView, setCurrentView] = useState('home'); // 'home', 'ielts', 'sat', 'exam_dashboard', 'exam_active'
  const [topUpAmount, setTopUpAmount] = useState('15000');
  // 'idle' -> 'awaiting_redirect' (provayder tanlandi) -> 'pending' (foydalanuvchi to'lovga o'tdi, tasdiq kutilmoqda)
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [selectedProvider, setSelectedProvider] = useState(null); // 'click' | 'payme'
  const [activeTestTitle, setActiveTestTitle] = useState('');
  const [timeLeft, setTimeLeft] = useState(3600);
  const [googleReady, setGoogleReady] = useState(false);
  const [examHistory, setExamHistory] = useState([]); // Shaxsiy dashboard uchun topshirilgan testlar tarixi
  const [selectedTrack, setSelectedTrack] = useState(null); // 'ielts' | 'sat' - qaysi yo'nalish paneli ochilgani
  const [trackSection, setTrackSection] = useState('home'); // sidebar: 'home' | 'practice' | 'history' | 'progress' | 'vocabulary' | 'quickquiz'
  const [trackSettings, setTrackSettings] = useState({}); // { ielts: {examDate, targetScore}, sat: {...} }
  const [now, setNow] = useState(Date.now()); // Countdown uchun joriy vaqt

  // --- Fullscreen / anti-cheat state for the exam screen ---
  const [pendingSection, setPendingSection] = useState(null); // IELTS: which section is waiting behind the warning modal
  const [pendingSatStart, setPendingSatStart] = useState(false); // SAT: waiting behind the warning modal
  const [tabSwitchCount, setTabSwitchCount] = useState(0); // how many times the user has left the fullscreen test window
  const [showReturnPrompt, setShowReturnPrompt] = useState(false); // true while the user is away and questions are hidden
  const violationLockRef = useRef(false); // debounce so one exit doesn't fire two violations at once
  const [viewingResult, setViewingResult] = useState(null); // the history entry currently open on the Result/Review screens

  // IELTS bo'limlarining holatini saqlash
  const [examProgress, setExamProgress] = useState({
    currentSection: null, // 'listening', 'reading', 'writing'
    sections: {
      listening: 'pending', // 'pending', 'active', 'completed'
      reading: 'pending',
      writing: 'pending'
    }
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('prepAI_currentUser');
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      if (userObj.balance === undefined) userObj.balance = 0;
      if (!userObj.refCode) {
        userObj.refCode = generateRefCode();
        userObj.referredCount = userObj.referredCount || 0;
        localStorage.setItem('prepAI_currentUser', JSON.stringify(userObj));
        const allUsers = JSON.parse(localStorage.getItem('prepAI_users') || '[]');
        const updatedAll = allUsers.map(u => u.email === userObj.email ? userObj : u);
        localStorage.setItem('prepAI_users', JSON.stringify(updatedAll));
      }
      setCurrentUser(userObj);
      setExamHistory(loadHistoryForUser(userObj.email));
      setTrackSettings(loadTrackSettings(userObj.email));
    } else {
      setTrackSettings(loadTrackSettings(null));
    }
  }, []);

  // "SAT" yoki "IELTS" sozlamalarini (imtihon sanasi, maqsad ball) o'qib olish
  const loadTrackSettings = (email) => {
    const all = JSON.parse(localStorage.getItem('prepAI_trackSettings') || '{}');
    return all[email || 'guest'] || {};
  };

  // "SAT" yoki "IELTS" sozlamalarini saqlash
  const saveTrackSettings = (email, settings) => {
    const all = JSON.parse(localStorage.getItem('prepAI_trackSettings') || '{}');
    all[email || 'guest'] = settings;
    localStorage.setItem('prepAI_trackSettings', JSON.stringify(all));
  };

  // Imtihon sanasi yoki maqsad ballni yangilash
  const updateTrackSetting = (track, field, value) => {
    setTrackSettings(prev => {
      const updated = { ...prev, [track]: { ...prev[track], [field]: value } };
      saveTrackSettings(currentUser?.email, updated);
      return updated;
    });
  };

  // SAT/IELTS tugmasi bosilganda avval shaxsiy panelga o'tkazamiz
  const openTrackDashboard = (track) => {
    setSelectedTrack(track);
    setTrackSection('home');
    setCurrentView('track_dashboard');
  };

  // Countdown panelida turganda har soniyada vaqtni yangilab turamiz
  useEffect(() => {
    if (currentView !== 'track_dashboard') return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [currentView]);

  // Foydalanuvchining test tarixini localStorage'dan o'qib olish
  const loadHistoryForUser = (email) => {
    const all = JSON.parse(localStorage.getItem('prepAI_examHistory') || '{}');
    return all[email] || [];
  };

  // Foydalanuvchining test tarixini localStorage'ga saqlash
  const saveHistoryForUser = (email, history) => {
    const all = JSON.parse(localStorage.getItem('prepAI_examHistory') || '{}');
    all[email] = history;
    localStorage.setItem('prepAI_examHistory', JSON.stringify(all));
  };

  // Test to'liq yakunlanganda tarixga yozib qo'yamiz
  const recordCompletedExam = (type, title, scores) => {
    if (!currentUser) return;
    const entry = { type, title, date: new Date().toISOString(), ...(scores ? { scores } : {}) };
    const updatedHistory = [...loadHistoryForUser(currentUser.email), entry];
    saveHistoryForUser(currentUser.email, updatedHistory);
    setExamHistory(updatedHistory);
  };

  // Joriy "seriya" (streak) - necha kun ketma-ket mashq qilingani
  const calculateStreak = (history) => {
    if (history.length === 0) return 0;
    const uniqueDates = [...new Set(history.map(h => h.date.slice(0, 10)))];
    let streak = 0;
    const cursor = new Date();
    while (true) {
      const dateStr = cursor.toISOString().slice(0, 10);
      if (uniqueDates.includes(dateStr)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  useEffect(() => {
    if (currentView === 'exam_active' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [currentView, timeLeft]);

  // Registers one "left the test window" violation. Debounced so a single exit
  // (which can fire both a visibilitychange and a fullscreenchange event) only
  // counts once. On the 3rd violation the current section is auto-submitted.
  const registerExamViolation = () => {
    if (violationLockRef.current) return;
    violationLockRef.current = true;
    setTimeout(() => { violationLockRef.current = false; }, 800);

    setTabSwitchCount(prev => {
      const next = prev + 1;
      if (next >= 3) {
        setShowReturnPrompt(false);
        alert("You left the fullscreen test window 3 times. Your test has been submitted automatically.");
        finishSection();
      } else {
        setShowReturnPrompt(true);
      }
      return next;
    });
  };

  // While a timed section is active: watch for the user switching tabs/apps
  // (visibilitychange) or leaving fullscreen (fullscreenchange). The test
  // itself is never paused - only the questions are hidden behind a prompt
  // until the user comes back, unless it's the 3rd violation.
  useEffect(() => {
    if (currentView !== 'exam_active') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        registerExamViolation();
      } else {
        setShowReturnPrompt(false);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        registerExamViolation();
      } else {
        setShowReturnPrompt(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  // Google Identity Services skriptini bir marta yuklab olamiz
  useEffect(() => {
    if (document.getElementById('google-gsi-script')) {
      setGoogleReady(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleReady(true);
    document.body.appendChild(script);
  }, []);

  // Login yoki Signup oynasi ochilganda Google tugmasini shu oynaga chizib beramiz
  useEffect(() => {
    if (!googleReady || !window.google) return;
    // Google tugmasi endi faqat Sign Up oynasida chiqadi. Login oynasida
    // foydalanuvchi faqat o'zi ro'yxatdan o'tganda kiritgan email/parol
    // orqaligina kirishi kerak.
    if (activeModal !== 'signup') return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CONFIG.clientId,
      callback: handleGoogleCredentialResponse,
    });

    const container = document.getElementById('googleSignupBtn');
    if (container) {
      container.innerHTML = '';
      window.google.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        width: 350,
        text: 'signup_with',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModal, googleReady]);

  // Full-screen mode: entered right when a timed test actually starts
  const requestFullscreen = () => {
    const el = document.documentElement;
    try {
      if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    } catch (e) { /* ignore - some browsers block this without a user gesture */ }
  };

  const exitFullscreenIfActive = () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (e) { /* ignore */ }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e) => {
    setErrorMsg('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // URL'dagi ?ref=KOD parametrini o'qib, o'sha kodga ega foydalanuvchiga
  // 10 000 so'm bonus qo'shadi (agar shunday kod topilsa). existingUsers
  // massivini yangilab qaytaradi - chaqiruvchi funksiya uni localStorage'ga
  // yozib qo'yishi kerak.
  const applyReferralBonus = (existingUsers) => {
    try {
      const refCode = new URLSearchParams(window.location.search).get('ref');
      if (!refCode) return existingUsers;
      const idx = existingUsers.findIndex(u => u.refCode === refCode);
      if (idx === -1) return existingUsers;
      const updated = [...existingUsers];
      updated[idx] = {
        ...updated[idx],
        balance: (updated[idx].balance || 0) + 10000,
        referredCount: (updated[idx].referredCount || 0) + 1
      };
      // Agar hozir tizimga kirgan (joriy) foydalanuvchi aynan taklif qiluvchi bo'lsa,
      // uning ekrandagi holatini ham yangilaymiz
      if (currentUser && currentUser.email === updated[idx].email) {
        const refreshedCurrent = updated[idx];
        localStorage.setItem('prepAI_currentUser', JSON.stringify(refreshedCurrent));
        setCurrentUser(refreshedCurrent);
      }
      return updated;
    } catch (e) {
      return existingUsers;
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg("Email va parolni kiriting!");
      return;
    }

    let existingUsers = JSON.parse(localStorage.getItem('prepAI_users') || '[]');
    const userExists = existingUsers.some(u => u.email === formData.email);

    if (userExists) {
      setErrorMsg("Bu email allaqachon ro'yxatdan o'tgan!");
      return;
    }

    // Agar taklif havolasi orqali kirilgan bo'lsa, taklif qilgan do'stga bonus qo'shamiz
    existingUsers = applyReferralBonus(existingUsers);

    const newUser = { 
      name: formData.name || formData.email.split('@')[0], 
      email: formData.email, 
      password: formData.password,
      balance: 0,
      refCode: generateRefCode(),
      referredCount: 0
    };

    existingUsers.push(newUser);
    localStorage.setItem('prepAI_users', JSON.stringify(existingUsers));
    localStorage.setItem('prepAI_currentUser', JSON.stringify(newUser));
    
    setCurrentUser(newUser);
    setExamHistory(loadHistoryForUser(newUser.email));
    setTrackSettings(loadTrackSettings(newUser.email));
    closeModal();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMsg("Email va parolni kiriting!");
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('prepAI_users') || '[]');
    const foundUser = existingUsers.find(
      u => u.email === formData.email && u.password === formData.password
    );

    if (!foundUser) {
      setErrorMsg("Email yoki parol noto'g'ri!");
      return;
    }

    if (foundUser.balance === undefined) foundUser.balance = 0;
    // Eski (funksiya qo'shilishidan oldingi) akkauntlar uchun taklif kodini shu yerda yaratib qo'yamiz
    if (!foundUser.refCode) {
      foundUser.refCode = generateRefCode();
      foundUser.referredCount = foundUser.referredCount || 0;
      const allUsers = JSON.parse(localStorage.getItem('prepAI_users') || '[]');
      const updatedAll = allUsers.map(u => u.email === foundUser.email ? foundUser : u);
      localStorage.setItem('prepAI_users', JSON.stringify(updatedAll));
    }

    localStorage.setItem('prepAI_currentUser', JSON.stringify(foundUser));
    setCurrentUser(foundUser);
    setExamHistory(loadHistoryForUser(foundUser.email));
    setTrackSettings(loadTrackSettings(foundUser.email));
    closeModal();
  };

  // Google orqali kirish/ro'yxatdan o'tish tugmasi bosilgach ishga tushadi
  const handleGoogleCredentialResponse = (response) => {
    const payload = decodeGoogleJwt(response.credential);

    if (!payload || !payload.email) {
      setErrorMsg("Google orqali kirishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
      return;
    }

    let existingUsers = JSON.parse(localStorage.getItem('prepAI_users') || '[]');
    let user = existingUsers.find(u => u.email === payload.email);

    if (!user) {
      // Google orqali birinchi marta kirayotgan foydalanuvchi - avtomatik ro'yxatga olamiz.
      // Taklif havolasi orqali kirgan bo'lsa, taklif qilgan do'stga bonus qo'shamiz.
      existingUsers = applyReferralBonus(existingUsers);
      user = {
        name: payload.name || payload.email.split('@')[0],
        email: payload.email,
        password: null, // Google orqali kirganlarda parol yo'q
        balance: 0,
        provider: 'google',
        refCode: generateRefCode(),
        referredCount: 0
      };
      existingUsers.push(user);
      localStorage.setItem('prepAI_users', JSON.stringify(existingUsers));
    } else if (!user.refCode) {
      // Eski akkaunt uchun taklif kodi yo'q bo'lsa, shu yerda yaratamiz
      user.refCode = generateRefCode();
      user.referredCount = user.referredCount || 0;
      const updatedAll = existingUsers.map(u => u.email === user.email ? user : u);
      localStorage.setItem('prepAI_users', JSON.stringify(updatedAll));
    }

    if (user.balance === undefined) user.balance = 0;

    localStorage.setItem('prepAI_currentUser', JSON.stringify(user));
    setCurrentUser(user);
    setExamHistory(loadHistoryForUser(user.email));
    setTrackSettings(loadTrackSettings(user.email));
    closeModal();
  };

  // Provayder tanlanganda checkout sahifasiga o'tkazadi
  const handleProviderSelect = (provider) => {
    setErrorMsg('');
    const amount = parseInt(topUpAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg("To'g'ri summa kiriting!");
      return;
    }
    setSelectedProvider(provider);
  };

  // "To'lovga o'tish" bosilganda checkout URL'ga yo'naltiradi
  const handleGoToCheckout = () => {
    const amount = parseInt(topUpAmount, 10);
    const userIdentifier = currentUser?.email || 'guest';

    const checkoutUrl = selectedProvider === 'click'
      ? buildClickCheckoutUrl(amount, userIdentifier)
      : buildPaymeCheckoutUrl(amount, userIdentifier);

    window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    // Balans ENDI avtomatik to'ldirilmaydi. Haqiqiy tasdiqlash faqat
    // backend orqali (Click/Payme'ning webhook / PREPARE-COMPLETE so'rovlari
    // bilan) amalga oshirilishi kerak. Shu sababli holatni "pending"ga
    // o'tkazamiz va foydalanuvchiga tushuntiramiz.
    setPaymentStatus('pending');
  };

  const handleLogout = () => {
    localStorage.removeItem('prepAI_currentUser');
    setCurrentUser(null);
    setExamHistory([]);
    setTrackSettings(loadTrackSettings(null));
    setCurrentView('home');
  };

  const closeModal = () => {
    setActiveModal(null);
    setErrorMsg('');
    setPaymentStatus('idle');
    setSelectedProvider(null);
    setFormData({ name: '', email: '', password: '' });
  };

  // Mock kartasini bosganda ishlaydigan mantiq
  const handleMockClick = (type, index, isFree) => {
    const title = `${type.toUpperCase()} Mock #${index + 1}`;
    
    const startExamFlow = () => {
      setActiveTestTitle(title);
      if (type === 'ielts') {
        // IELTS bo'limlarini nolga tushirish
        setExamProgress({
          currentSection: null,
          sections: { listening: 'pending', reading: 'pending', writing: 'pending' }
        });
        setCurrentView('exam_dashboard');
      } else {
        // SAT bo'lsa - avval fullscreen ogohlantirish oynasi, keyin testga o'tish
        setPendingSatStart(true);
        setActiveModal('examWarning');
      }
    };

    // Testni boshlashdan oldin foydalanuvchi albatta ro'yxatdan o'tgan/kirgan bo'lishi kerak
    // (bepul testlar uchun ham). Aks holda Sign Up oynasini ochamiz.
    if (!currentUser) {
      setErrorMsg('');
      setActiveModal('signup');
      return;
    }

    if (isFree) {
      startExamFlow();
    } else {
      if (currentUser.balance < 15000) {
        alert("Mablag' yetarli emas! Balansni to'ldiring.");
        setActiveModal('topup');
      } else {
        const updatedUser = { ...currentUser, balance: currentUser.balance - 15000 };
        setCurrentUser(updatedUser);
        localStorage.setItem('prepAI_currentUser', JSON.stringify(updatedUser));
        startExamFlow();
      }
    }
  };

  // Bo'lim uchun ekranni haqiqatda ochadi: holatni yangilaydi va fullscreen'ga o'tadi
  const actuallyStartSection = (sectionKey) => {
    setExamProgress(prev => ({ ...prev, currentSection: sectionKey }));
    setTimeLeft(sectionKey === 'listening' ? 1800 : 3600);
    setCurrentView('exam_active');
    setTabSwitchCount(0);
    setShowReturnPrompt(false);
    requestFullscreen();
  };

  // Bo'limni boshlash. Listening (mockning birinchi bo'limi) uchun avval
  // fullscreen qoidalari haqida ogohlantirish oynasi ko'rsatiladi.
  const startSection = (sectionKey) => {
    if (sectionKey === 'reading' && examProgress.sections.listening !== 'completed') {
      alert("Avval Listening bo'limini tugatishingiz kerak!");
      return;
    }
    if (sectionKey === 'writing' && examProgress.sections.reading !== 'completed') {
      alert("Avval Reading bo'limini tugatishingiz kerak!");
      return;
    }

    if (sectionKey === 'listening') {
      setPendingSection(sectionKey);
      setActiveModal('examWarning');
      return;
    }

    actuallyStartSection(sectionKey);
  };

  // Ogohlantirish oynasidagi "Start Test" bosilganda - IELTS yoki SAT, qaysi
  // biri kutayotgan bo'lsa, o'shani haqiqatda ishga tushiradi.
  const confirmExamWarning = () => {
    setActiveModal(null);
    if (pendingSection) {
      actuallyStartSection(pendingSection);
      setPendingSection(null);
    } else if (pendingSatStart) {
      setTimeLeft(3600);
      setCurrentView('exam_active');
      setTabSwitchCount(0);
      setShowReturnPrompt(false);
      requestFullscreen();
      setPendingSatStart(false);
    }
  };

  // Bo'limni yakunlash
  const finishSection = () => {
    exitFullscreenIfActive();
    setShowReturnPrompt(false);
    const current = examProgress.currentSection;
    if (current) {
      const updatedSections = { ...examProgress.sections, [current]: 'completed' };
      const allDone = Object.values(updatedSections).every(status => status === 'completed');

      setExamProgress(prev => ({
        ...prev,
        sections: updatedSections,
        currentSection: null
      }));

      // IELTS'ning barcha bo'limlari tugagach - band ballarni hisoblab tarixga
      // yozamiz va foydalanuvchini History bo'limiga olib boramiz.
      // (Writing hali AI orqali baholanmaydi - "Pending" deb qoladi, keyinchalik qo'shiladi)
      if (allDone) {
        const scores = {
          listening: generateSimulatedScore(LISTENING_BAND_TABLE),
          reading: generateSimulatedScore(READING_BAND_TABLE),
          writing: null
        };
        recordCompletedExam('ielts', activeTestTitle, scores);
        setTrackSection('history');
        setCurrentView('track_dashboard');
      } else {
        setCurrentView('exam_dashboard');
      }
    } else {
      // SAT testi bitta yaxlit sifatida tugaydi
      recordCompletedExam('sat', activeTestTitle);
      setCurrentView('home');
    }
  };

  const isAllSectionsCompleted = Object.values(examProgress.sections).every(status => status === 'completed');

  return (
    <>
      <style>{backgroundStyles}</style>
      
      <div className="animated-bg" style={{ fontFamily: 'Arial, sans-serif', color: '#1a1a1a', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>

        {/* Header Navigation */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', position: 'relative', zIndex: 10, width: '100%', boxSizing: 'border-box' }}>
          <div 
            onClick={() => setCurrentView('home')} 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>P</div>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e3a8a' }}>PrepAI</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button
                  onClick={() => setCurrentView('profile')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: currentView === 'profile' ? '1px solid #2563eb' : '1px solid #e2e8f0',
                    background: currentView === 'profile' ? '#eff6ff' : '#fff',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: '#1e3a8a',
                    fontSize: '14px'
                  }}
                >
                  <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                    {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                  </span>
                  {currentUser.name || currentUser.email}
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => { setErrorMsg(''); setActiveModal('login'); }} style={{ background: 'transparent', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer', color: '#333' }}>Log in</button>
                <button onClick={() => { setErrorMsg(''); setActiveModal('signup'); }} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '20px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>Sign Up</button>
              </>
            )}
          </div>
        </nav>

        {/* 1. BOSH SAHIFA */}
        {currentView === 'home' && (
          <main style={{ textAlign: 'center', marginTop: '40px', padding: '0 20px', position: 'relative', zIndex: 10 }}>
            <h1 style={{ fontSize: '56px', fontWeight: '800', letterSpacing: '-1px', marginBottom: '10px' }}>
              Participate in the
            </h1>
            
            <h1 style={{ fontSize: '56px', fontWeight: '900', color: '#eab308', letterSpacing: '2px', marginBottom: '25px', textTransform: 'uppercase' }}>
              MOCK IELTS & SAT EXAM
            </h1>

            <p style={{ maxWidth: '680px', margin: '0 auto 35px auto', fontSize: '17px', color: '#555', lineHeight: '1.6' }}>
              Elevate your test preparation with PrepAI. Master the real computer-delivered IELTS and SAT exams, get instant AI-driven analytics, and track your path to top scores.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button 
                onClick={() => openTrackDashboard('sat')}
                style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)' }}
              >
                SAT MOCK
              </button>
              <button 
                onClick={() => openTrackDashboard('ielts')} 
                style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '11px 22px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)' }}
              >
                IELTS MOCK
              </button>
            </div>
          </main>
        )}

        {/* SHAXSIY KABINET (Profil): balans, to'lov, taklif havolasi, chiqish */}
        {currentView === 'profile' && currentUser && (() => {
          const inviteLink = `${typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''}?ref=${currentUser.refCode || ''}`;
          const referredCount = currentUser.referredCount || 0;
          const earnedFromInvites = referredCount * 10000;

          const copyInviteLink = () => {
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
              navigator.clipboard.writeText(inviteLink).catch(() => {});
            }
            setErrorMsg('');
            alert("Taklif havolasi nusxalandi!");
          };

          return (
            <main style={{ width: '100%', margin: 0, padding: '30px 40px 40px 40px', position: 'relative', zIndex: 10, boxSizing: 'border-box' }}>
              <div style={{ maxWidth: '760px', margin: '0 auto' }}>

                <div style={{ marginBottom: '25px' }}>
                  <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e3a8a' }}>Shaxsiy Kabinet</h2>
                </div>

                {/* Profil kartasi */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: '26px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', flexShrink: 0 }}>
                    {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>{currentUser.name || currentUser.email}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>{currentUser.email}</div>
                  </div>
                </div>

                {/* Balans kartasi */}
                <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius: '16px', padding: '26px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                  <div>
                    <div style={{ color: '#dbeafe', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Balans</div>
                    <div style={{ color: '#fff', fontSize: '32px', fontWeight: '900' }}>{currentUser.balance.toLocaleString()} UZS</div>
                  </div>
                  <button
                    onClick={() => setActiveModal('topup')}
                    style={{ background: '#fff', color: '#1e40af', border: 'none', padding: '12px 22px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
                  >
                    Hisobni To'ldirish
                  </button>
                </div>

                {/* Taklif (referral) kartasi */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: '26px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '17px', color: '#1e293b', marginBottom: '6px' }}>Do'stlaringizni taklif qiling</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                    Har bir do'stingiz sizning havolangiz orqali ro'yxatdan o'tsa, balansingizga <strong>10 000 so'm</strong> qo'shiladi.
                  </p>

                  <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                    <input
                      type="text"
                      readOnly
                      value={inviteLink}
                      onFocus={(e) => e.target.select()}
                      style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '13px', color: '#334155', boxSizing: 'border-box' }}
                    />
                    <button
                      onClick={copyInviteLink}
                      style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      Nusxalash
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: '#2563eb' }}>{referredCount}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Taklif qilingan do'stlar</div>
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: '#16a34a' }}>{earnedFromInvites.toLocaleString()} UZS</div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Taklif orqali topilgan bonus</div>
                    </div>
                  </div>
                </div>

                {/* Boshqa tugmalar */}
                <div style={{ background: '#fff', borderRadius: '16px', padding: '10px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    style={{ width: '100%', textAlign: 'left', padding: '14px 16px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}
                  >
                    Natijalarim
                  </button>
                </div>

                {/* Chiqish tugmasi */}
                <button
                  onClick={handleLogout}
                  style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginBottom: '14px' }}
                >
                  Akkountdan chiqish
                </button>

                {/* Orqaga tugmasi - pastda, chap tomonda */}
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <button
                    onClick={() => setCurrentView('home')}
                    style={{ background: '#fff', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    ← Orqaga
                  </button>
                </div>

              </div>
            </main>
          );
        })()}

        {/* SAT/IELTS SHAXSIY PANELI (imtihon sanasi, countdown, maqsad ball) — FULL EKRAN */}
        {currentView === 'track_dashboard' && selectedTrack && (() => {
          const settings = trackSettings[selectedTrack] || {};
          const examDateStr = settings.examDate || '';
          const targetScore = settings.targetScore || '';
          const isSat = selectedTrack === 'sat';
          const SAT_EXAM_DATE_OPTIONS = ['2026-10-12', '2026-11-07', '2026-12-05'];
          const trackHistory = examHistory.filter(h => h.type === selectedTrack);
          const trackStreak = calculateStreak(examHistory);

          let countdown = null;
          if (examDateStr) {
            const examTime = new Date(examDateStr + 'T00:00:00').getTime();
            const diff = examTime - now;
            if (diff > 0) {
              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
              const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
              const minutes = Math.floor((diff / (1000 * 60)) % 60);
              const seconds = Math.floor((diff / 1000) % 60);
              countdown = { days, hours, minutes, seconds, expired: false };
            } else {
              countdown = { expired: true };
            }
          }

          const SIDEBAR_MENU = [
            { key: 'home', label: 'Home', icon: '🏠' },
            { key: 'practice', label: 'Practice', icon: '📝' },
            { key: 'history', label: 'History', icon: '🕒' },
            { key: 'progress', label: 'Progress', icon: '📈' },
            { key: 'vocabulary', label: 'Vocabulary', icon: '📚' },
            // Article bo'limi faqat IELTS uchun (SAT'da chiqmaydi)
            ...(!isSat ? [{ key: 'article', label: 'Article', icon: '📰' }] : []),
            { key: 'quickquiz', label: 'Quick Quiz', icon: '⚡' },
            { key: 'resources', label: 'Resources', icon: '📁' },
          ];

          return (
            <main style={{ width: '100%', minHeight: 'calc(100vh - 90px)', margin: 0, padding: '0 40px 40px 40px', position: 'relative', zIndex: 10, boxSizing: 'border-box', display: 'flex', gap: '25px', alignItems: 'flex-start' }}>

              {/* CHAP TOMONDAGI SIDEBAR */}
              <div style={{ width: '240px', flexShrink: 0, background: '#fff', borderRadius: '16px', padding: '18px 14px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#94a3b8', letterSpacing: '1px', marginBottom: '14px', paddingLeft: '8px' }}>
                  {isSat ? 'SAT' : 'IELTS'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {SIDEBAR_MENU.map(item => (
                    <button
                      key={item.key}
                      onClick={() => setTrackSection(item.key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '11px 12px',
                        borderRadius: '10px',
                        border: 'none',
                        background: trackSection === item.key ? '#eff6ff' : 'transparent',
                        color: trackSection === item.key ? '#1e40af' : '#334155',
                        fontWeight: trackSection === item.key ? '700' : '500',
                        fontSize: '14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%'
                      }}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-start' }}>
                  <button
                    onClick={() => setCurrentView('home')}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: '600', fontSize: '13px', cursor: 'pointer', textAlign: 'left' }}
                  >
                    ← Back to Home
                  </button>
                </div>
              </div>

              {/* O'NG TOMONDAGI KONTENT — QOLGAN BUTUN KENGLIKNI EGALLAYDI */}
              <div style={{ flex: 1, minWidth: 0, width: '100%' }}>

                {/* HOME BO'LIMI */}
                {trackSection === 'home' && (
                  <div>
                    {/* Countdown kartochkasi */}
                    <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)', borderRadius: '18px', padding: '30px', textAlign: 'center', marginBottom: '20px', boxShadow: '0 10px 25px rgba(37,99,235,0.25)' }}>
                      {countdown && !countdown.expired ? (
                        <>
                          <div style={{ color: '#dbeafe', fontSize: '13px', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Time until exam
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '18px' }}>
                            {[
                              { value: countdown.days, label: 'days' },
                              { value: countdown.hours, label: 'hours' },
                              { value: countdown.minutes, label: 'min' },
                              { value: countdown.seconds, label: 'sec' }
                            ].map((unit, idx) => (
                              <div key={idx} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '14px 16px', minWidth: '65px' }}>
                                <div style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>{String(unit.value).padStart(2, '0')}</div>
                                <div style={{ fontSize: '11px', color: '#dbeafe', fontWeight: '600' }}>{unit.label}</div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : countdown && countdown.expired ? (
                        <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>
                          Your scheduled exam date has arrived or passed!
                        </div>
                      ) : (
                        <div style={{ color: '#dbeafe', fontSize: '15px' }}>
                          Set your exam date below to see the countdown
                        </div>
                      )}
                    </div>

                    {/* Sozlamalar: imtihon sanasi (chap) va maqsad ball (o'ng, kattaroq quti) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '16px', marginBottom: '20px', alignItems: 'stretch' }}>
                      <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', borderTop: '3px solid #2563eb' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '11px',
                          fontWeight: '800',
                          color: '#1e40af',
                          background: '#eff6ff',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          marginBottom: '14px'
                        }}>
                          Exam date
                        </span>
                        {isSat ? (
                          <select
                            value={examDateStr}
                            onChange={(e) => updateTrackSetting(selectedTrack, 'examDate', e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '15px', background: '#fff' }}
                          >
                            <option value="">Select a date…</option>
                            {SAT_EXAM_DATE_OPTIONS.map(dateVal => {
                              const d = new Date(dateVal + 'T00:00:00');
                              const label = d.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
                              return <option key={dateVal} value={dateVal}>{label}</option>;
                            })}
                          </select>
                        ) : (
                          <input
                            type="date"
                            value={examDateStr}
                            onChange={(e) => updateTrackSetting(selectedTrack, 'examDate', e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '15px' }}
                          />
                        )}
                        <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px', lineHeight: '1.5' }}>
                          {isSat
                            ? 'SAT mock exams are only held on official test dates.'
                            : 'IELTS mock exams are available every day — pick any date that works for you.'}
                        </p>
                      </div>

                      {/* Target score - chiroyli, ko'zga tashlanib turadigan gradient ramka */}
                      <div style={{
                        background: 'linear-gradient(135deg, #f59e0b, #eab308, #f59e0b)',
                        borderRadius: '18px',
                        padding: '3px',
                        boxShadow: '0 10px 28px rgba(234, 179, 8, 0.35)'
                      }}>
                        <div style={{
                          background: 'linear-gradient(160deg, #fffbeb, #ffffff)',
                          borderRadius: '16px',
                          padding: '20px 24px',
                          height: '100%',
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: '800',
                              color: '#92400e',
                              background: '#fef3c7',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              letterSpacing: '0.5px',
                              textTransform: 'uppercase'
                            }}>
                              Target score
                            </span>
                            <span style={{ fontSize: '12px', color: '#a16207', fontWeight: '600' }}>
                              {isSat ? '(400-1600)' : '(0-9.0)'}
                            </span>
                          </div>
                          <div style={{
                            border: '2px solid #f59e0b',
                            borderRadius: '14px',
                            background: '#ffffff',
                            padding: '4px',
                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15) inset'
                          }}>
                            <input
                              type="number"
                              value={targetScore}
                              onChange={(e) => updateTrackSetting(selectedTrack, 'targetScore', e.target.value)}
                              placeholder={isSat ? 'e.g. 1450' : 'e.g. 7.5'}
                              min={isSat ? 400 : 0}
                              max={isSat ? 1600 : 9}
                              step={isSat ? 10 : 0.5}
                              style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '10px',
                                border: 'none',
                                boxSizing: 'border-box',
                                fontSize: '34px',
                                fontWeight: '900',
                                color: '#b45309',
                                textAlign: 'center',
                                background: 'transparent',
                                outline: 'none'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PRACTICE BO'LIMI (Mock testlar ro'yxati) */}
                {trackSection === 'practice' && (
                  <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e3a8a', marginBottom: '20px' }}>
                      Full Mock Exams
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                      {/* Barcha 15 ta mock test hozircha bepul, shu sababli
                          "FREE"/narx yozuvlari va qulфланиш belgisi olib tashlandi */}
                      {Array.from({ length: 15 }).map((_, i) => {
                        return (
                          <div
                            key={i}
                            className="mock-card"
                            onClick={() => handleMockClick(selectedTrack, i, true)}
                            style={{
                              background: '#ffffff',
                              borderRadius: '16px',
                              padding: '22px',
                              position: 'relative',
                              boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                              border: '1px solid #e2e8f0',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              minHeight: '155px',
                              boxSizing: 'border-box'
                            }}
                          >
                            <div>
                              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e293b', fontWeight: 'bold' }}>
                                Mock {i + 1}
                              </h3>
                              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                                Full Mock Simulation & AI Analysis
                              </p>
                            </div>

                            <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                              <button style={{
                                background: '#2563eb',
                                color: '#fff',
                                border: 'none',
                                padding: '7px 14px',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                cursor: 'pointer'
                              }}>
                                Start
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* HISTORY BO'LIMI */}
                {trackSection === 'history' && (
                  <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e3a8a', marginBottom: '20px' }}>
                      History
                    </h2>
                    {trackHistory.length === 0 ? (
                      <div style={{ background: '#fff', borderRadius: '14px', padding: '30px', textAlign: 'center', color: '#64748b', boxShadow: '0 6px 16px rgba(0,0,0,0.05)' }}>
                        No {isSat ? 'SAT' : 'IELTS'} exams completed yet.
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[...trackHistory].reverse().map((item, idx) => {
                          const dateObj = new Date(item.date);
                          const formattedDate = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
                          const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                          return (
                            <div
                              key={idx}
                              style={{ background: '#fff', borderRadius: '14px', padding: '18px 20px', boxShadow: '0 4px 10px rgba(0,0,0,0.04)' }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>{item.title}</span>
                                <span style={{ fontSize: '13px', color: '#94a3b8' }}>{formattedDate}, {formattedTime}</span>
                              </div>

                              {item.scores && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                                  <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '700' }}>
                                    Your result is available
                                  </span>
                                  <button
                                    onClick={() => { setViewingResult(item); setCurrentView('exam_result'); }}
                                    style={{
                                      background: '#2563eb',
                                      color: '#fff',
                                      border: 'none',
                                      padding: '7px 16px',
                                      borderRadius: '8px',
                                      fontWeight: 'bold',
                                      fontSize: '12px',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    View
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* PROGRESS BO'LIMI */}
                {trackSection === 'progress' && (
                  <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e3a8a', marginBottom: '20px' }}>
                      Progress
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px', marginBottom: '25px' }}>
                      <div style={{ background: '#fff', borderRadius: '14px', padding: '22px', textAlign: 'center', boxShadow: '0 6px 16px rgba(0,0,0,0.06)' }}>
                        <div style={{ fontSize: '30px', fontWeight: '900', color: '#2563eb' }}>{trackHistory.length}</div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: '600' }}>Completed {isSat ? 'SAT' : 'IELTS'} exams</div>
                      </div>
                      <div style={{ background: '#fff', borderRadius: '14px', padding: '22px', textAlign: 'center', boxShadow: '0 6px 16px rgba(0,0,0,0.06)' }}>
                        <div style={{ fontSize: '30px', fontWeight: '900', color: '#ea580c' }}>{trackStreak}</div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: '600' }}>Daily streak</div>
                      </div>
                    </div>

                    <h3 style={{ fontSize: '16px', color: '#1e293b', marginBottom: '12px' }}>Achievements</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                      {BADGES.map(badge => {
                        const earned = badge.check(trackHistory.length, trackStreak);
                        return (
                          <div
                            key={badge.id}
                            style={{
                              background: earned ? '#f0fdf4' : '#f8fafc',
                              border: earned ? '2px solid #86efac' : '1px solid #e2e8f0',
                              borderRadius: '12px',
                              padding: '14px',
                              opacity: earned ? 1 : 0.55
                            }}
                          >
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{badge.label}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{badge.desc}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* VOCABULARY BO'LIMI (hozircha placeholder) */}
                {trackSection === 'vocabulary' && (
                  <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e3a8a', marginBottom: '20px' }}>
                      Vocabulary
                    </h2>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
                      <h3 style={{ color: '#1e293b', marginBottom: '8px' }}>Coming soon</h3>
                      <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                        This is where the essential {isSat ? 'SAT' : 'IELTS'} word lists, flashcards, and vocabulary exercises will live.
                      </p>
                    </div>
                  </div>
                )}

                {/* ARTICLE BO'LIMI (faqat IELTS uchun) — 5 ta maqola kartasi, mock kartalari kabi */}
                {trackSection === 'article' && !isSat && (
                  <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e3a8a', marginBottom: '20px' }}>
                      Article
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="mock-card"
                          onClick={() => alert(`Article ${i + 1} tez orada qo'shiladi.`)}
                          style={{
                            background: '#ffffff',
                            borderRadius: '16px',
                            padding: '22px',
                            position: 'relative',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '155px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <div>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1e293b', fontWeight: 'bold' }}>
                              Article {i + 1}
                            </h3>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                              Daily reading practice & vocabulary
                            </p>
                          </div>

                          <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <button style={{
                              background: '#2563eb',
                              color: '#fff',
                              border: 'none',
                              padding: '7px 14px',
                              borderRadius: '8px',
                              fontWeight: 'bold',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}>
                              Read
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* QUICK QUIZ SECTION — 8 grammar topics, 20 questions each */}
                {trackSection === 'quickquiz' && (
                  <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e3a8a', marginBottom: '6px' }}>
                      Quick Quiz
                    </h2>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                      Short tests to reinforce your grammar — each one has 20 questions.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                      {QUICK_QUIZ_TESTS.map((q, i) => (
                        <div
                          key={i}
                          className="mock-card"
                          onClick={() => alert(`${q.title} (${q.topic}) is coming soon.`)}
                          style={{
                            background: '#ffffff',
                            borderRadius: '16px',
                            padding: '22px',
                            position: 'relative',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                            border: '1px solid #e2e8f0',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            minHeight: '170px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <div>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#1e293b', fontWeight: '900', lineHeight: '1.1' }}>
                              {q.title}
                            </h3>
                            <p style={{
                              margin: '0 0 12px 0',
                              fontSize: '13px',
                              color: '#2563eb',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              letterSpacing: '0.4px'
                            }}>
                              {q.topic}
                            </p>
                            <span style={{
                              display: 'inline-block',
                              fontSize: '12px',
                              fontWeight: '700',
                              color: '#fff',
                              background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                              padding: '4px 12px',
                              borderRadius: '20px'
                            }}>
                              20 questions
                            </span>
                          </div>

                          <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <button style={{
                              background: '#2563eb',
                              color: '#fff',
                              border: 'none',
                              padding: '7px 14px',
                              borderRadius: '8px',
                              fontWeight: 'bold',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}>
                              Start
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* RESOURCES SECTION (placeholder) */}
                {trackSection === 'resources' && (
                  <div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#1e3a8a', marginBottom: '20px' }}>
                      Resources
                    </h2>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '40px', textAlign: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
                      <h3 style={{ color: '#1e293b', marginBottom: '8px' }}>Coming soon</h3>
                      <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '420px', margin: '0 auto' }}>
                        Useful study guides, tips, and downloadable materials for {isSat ? 'SAT' : 'IELTS'} preparation will be listed here.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </main>
          );
        })()}

        {/* SHAXSIY DASHBOARD (Natijalarim) — endi Profil sahifasidagi tugma orqali ochiladi */}
        {currentView === 'dashboard' && currentUser && (
          <main style={{ width: '100%', margin: 0, padding: '20px 40px 40px 40px', position: 'relative', zIndex: 10, boxSizing: 'border-box' }}>
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ fontSize: '30px', fontWeight: '800', color: '#1e3a8a' }}>My Results</h2>
            </div>

            {/* Statistika kartochkalari */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '30px' }}>
              <div style={{ background: '#fff', borderRadius: '14px', padding: '22px', textAlign: 'center', boxShadow: '0 6px 16px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '30px', fontWeight: '900', color: '#2563eb' }}>{examHistory.length}</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: '600' }}>Total exams completed</div>
              </div>
              <div style={{ background: '#fff', borderRadius: '14px', padding: '22px', textAlign: 'center', boxShadow: '0 6px 16px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '30px', fontWeight: '900', color: '#ea580c' }}>{calculateStreak(examHistory)}</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: '600' }}>Daily streak</div>
              </div>
              <div style={{ background: '#fff', borderRadius: '14px', padding: '22px', textAlign: 'center', boxShadow: '0 6px 16px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '30px', fontWeight: '900', color: '#16a34a' }}>
                  {BADGES.filter(b => b.check(examHistory.length, calculateStreak(examHistory))).length}/{BADGES.length}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', fontWeight: '600' }}>Achievements earned</div>
              </div>
            </div>

            {/* Yutuqlar (Badges) */}
            <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '14px' }}>Achievements</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px', marginBottom: '35px' }}>
              {BADGES.map(badge => {
                const earned = badge.check(examHistory.length, calculateStreak(examHistory));
                return (
                  <div
                    key={badge.id}
                    style={{
                      background: earned ? '#f0fdf4' : '#f8fafc',
                      border: earned ? '2px solid #86efac' : '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px',
                      opacity: earned ? 1 : 0.55
                    }}
                  >
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}>{badge.label}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{badge.desc}</div>
                  </div>
                );
              })}
            </div>

            {/* Testlar tarixi */}
            <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '14px' }}>Exam history</h3>
            {examHistory.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '14px', padding: '30px', textAlign: 'center', color: '#64748b', boxShadow: '0 6px 16px rgba(0,0,0,0.05)' }}>
                No exams completed yet. Start your first mock exam!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[...examHistory].reverse().map((item, idx) => {
                  const dateObj = new Date(item.date);
                  const formattedDate = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
                  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                  return (
                    <div
                      key={idx}
                      style={{
                        background: '#fff',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 'bold',
                          padding: '4px 10px',
                          borderRadius: '10px',
                          background: item.type === 'ielts' ? '#dbeafe' : '#fef3c7',
                          color: item.type === 'ielts' ? '#1e40af' : '#92400e',
                          textTransform: 'uppercase'
                        }}>
                          {item.type}
                        </span>
                        <span style={{ fontWeight: '600', color: '#1e293b' }}>{item.title}</span>
                      </div>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>{formattedDate}, {formattedTime}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Orqaga tugmasi - pastda, chap tomonda */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '30px' }}>
              <button
                onClick={() => setCurrentView('profile')}
                style={{ background: '#fff', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
              >
                ← Back
              </button>
            </div>
          </main>
        )}

        {/* NATIJA (RESULT) OYNASI - History'dagi "View" tugmasi orqali ochiladi */}
        {currentView === 'exam_result' && viewingResult && (() => {
          const item = viewingResult;
          const dateObj = new Date(item.date);
          const formattedDate = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
          const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          const scores = item.scores || {};

          return (
            <main style={{ width: '100%', minHeight: 'calc(100vh - 90px)', margin: 0, padding: '40px', position: 'relative', zIndex: 10, boxSizing: 'border-box', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
              <div style={{ background: '#ffffff', borderRadius: '20px', padding: '35px', boxShadow: '0 15px 35px rgba(0,0,0,0.08)', width: '100%', maxWidth: '760px' }}>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                  <button
                    onClick={() => { setCurrentView('track_dashboard'); setTrackSection('history'); }}
                    style={{ background: '#fff', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    ← Back
                  </button>
                </div>

                <h2 style={{ textAlign: 'center', marginBottom: '4px', color: '#1e3a8a', fontSize: '26px' }}>{item.title}</h2>
                <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', marginBottom: '6px' }}>{formattedDate}, {formattedTime}</p>
                <p style={{ textAlign: 'center', color: '#16a34a', fontWeight: '700', fontSize: '14px', marginBottom: '28px' }}>Your result is available</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
                  <div style={{ background: '#eff6ff', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Listening</div>
                    <div style={{ fontSize: '32px', fontWeight: '900', color: '#1e40af', margin: '6px 0 2px 0' }}>
                      {typeof scores.listening === 'object' ? scores.listening.band : scores.listening}
                    </div>
                    {typeof scores.listening === 'object' && (
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{scores.listening.raw}/40 correct</div>
                    )}
                  </div>
                  <div style={{ background: '#eff6ff', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Reading</div>
                    <div style={{ fontSize: '32px', fontWeight: '900', color: '#1e40af', margin: '6px 0 2px 0' }}>
                      {typeof scores.reading === 'object' ? scores.reading.band : scores.reading}
                    </div>
                    {typeof scores.reading === 'object' && (
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{scores.reading.raw}/40 correct</div>
                    )}
                  </div>
                  <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '20px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Writing</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', marginTop: '14px' }}>
                      {scores.writing != null ? scores.writing : 'Pending (AI scoring coming soon)'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={() => setCurrentView('exam_review')}
                    style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '13px 32px', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', boxShadow: '0 6px 14px rgba(22,163,74,0.3)' }}
                  >
                    Review
                  </button>
                </div>
              </div>
            </main>
          );
        })()}

        {/* REVIEW (TAHLIL) OYNASI - qaysi savollarda xato qilingani ko'rsatiladi */}
        {currentView === 'exam_review' && viewingResult && (() => {
          const scores = viewingResult.scores || {};

          const renderQuestionGrid = (sectionScore, label) => {
            if (!sectionScore || typeof sectionScore !== 'object' || !sectionScore.wrongQuestions) {
              return (
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '18px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                  Review data is not available for this attempt.
                </div>
              );
            }
            const wrongSet = new Set(sectionScore.wrongQuestions);
            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '15px', color: '#1e293b', margin: 0 }}>{label}</h3>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{sectionScore.raw}/40 correct · Band {sectionScore.band}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '6px' }}>
                  {Array.from({ length: 40 }, (_, i) => i + 1).map(qNum => {
                    const isWrong = wrongSet.has(qNum);
                    return (
                      <div
                        key={qNum}
                        title={isWrong ? `Question ${qNum}: incorrect` : `Question ${qNum}: correct`}
                        style={{
                          background: isWrong ? '#fee2e2' : '#dcfce7',
                          color: isWrong ? '#b91c1c' : '#15803d',
                          border: `1px solid ${isWrong ? '#fca5a5' : '#86efac'}`,
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          textAlign: 'center',
                          padding: '6px 0'
                        }}
                      >
                        {qNum}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '11px', color: '#64748b' }}>
                  <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: '3px', marginRight: '5px', verticalAlign: 'middle' }} />Correct</span>
                  <span><span style={{ display: 'inline-block', width: '10px', height: '10px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '3px', marginRight: '5px', verticalAlign: 'middle' }} />Incorrect</span>
                </div>
              </div>
            );
          };

          return (
            <main style={{ width: '100%', minHeight: 'calc(100vh - 90px)', margin: 0, padding: '40px', position: 'relative', zIndex: 10, boxSizing: 'border-box', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
              <div style={{ background: '#ffffff', borderRadius: '20px', padding: '35px', boxShadow: '0 15px 35px rgba(0,0,0,0.08)', width: '100%', maxWidth: '820px' }}>

                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                  <button
                    onClick={() => setCurrentView('exam_result')}
                    style={{ background: '#fff', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    ← Back
                  </button>
                </div>

                <h2 style={{ textAlign: 'center', marginBottom: '6px', color: '#1e3a8a', fontSize: '24px' }}>Review</h2>
                <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', marginBottom: '28px' }}>{viewingResult.title} — see which questions you got wrong</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  {renderQuestionGrid(scores.listening, 'Listening')}
                  {renderQuestionGrid(scores.reading, 'Reading')}
                </div>

                <p style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '24px', textAlign: 'center' }}>
                  Writing review will be available once AI scoring is added.
                </p>
              </div>
            </main>
          );
        })()}

        {/* 3. IELTS EXAM DASHBOARD (3 ta bo'lim paneli) */}
        {currentView === 'exam_dashboard' && (
          <main style={{ width: '100%', minHeight: 'calc(100vh - 90px)', margin: 0, padding: '40px', position: 'relative', zIndex: 10, boxSizing: 'border-box', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
            <div style={{ background: '#ffffff', borderRadius: '20px', padding: '35px', boxShadow: '0 15px 35px rgba(0,0,0,0.08)', width: '100%', maxWidth: '900px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
                <button
                  onClick={() => { setCurrentView('track_dashboard'); setTrackSection('practice'); }}
                  style={{ background: '#fff', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                >
                  ← Orqaga
                </button>
              </div>
              <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#1e3a8a', fontSize: '28px' }}>{activeTestTitle}</h2>
              <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '30px', fontSize: '15px' }}>
                Complete the sections in order.
              </p>

              {/* Ketma-ket 3 ta Bo'lim (Listening, Reading, Writing) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { key: 'listening', name: 'Listening', time: '30 minutes' },
                  { key: 'reading', name: 'Reading', time: '60 minutes' },
                  { key: 'writing', name: 'Writing', time: '60 minutes' }
                ].map((sec) => {
                  const status = examProgress.sections[sec.key];
                  const isListeningDone = examProgress.sections.listening === 'completed';
                  const isReadingDone = examProgress.sections.reading === 'completed';

                  // Tugma blokirovkasi
                  let isDisabled = false;
                  if (sec.key === 'reading' && !isListeningDone) isDisabled = true;
                  if (sec.key === 'writing' && !isReadingDone) isDisabled = true;

                  return (
                    <div 
                      key={sec.key} 
                      style={{ 
                        background: status === 'completed' ? '#f0fdf4' : (isDisabled ? '#f8fafc' : '#ffffff'),
                        border: status === 'completed' ? '2px solid #86efac' : '1px solid #e2e8f0',
                        borderRadius: '14px', 
                        padding: '20px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        opacity: isDisabled ? 0.6 : 1,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div>
                        <h3 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#1e293b' }}>
                          {sec.name} {status === 'completed' && '(done)'}
                        </h3>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>Time: {sec.time}</span>
                      </div>

                      <div>
                        {status === 'completed' ? (
                          <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '14px' }}>Completed</span>
                        ) : (
                          <button 
                            disabled={isDisabled}
                            onClick={() => startSection(sec.key)}
                            style={{ 
                              background: isDisabled ? '#cbd5e1' : '#2563eb', 
                              color: '#fff', 
                              border: 'none', 
                              padding: '10px 20px', 
                              borderRadius: '8px', 
                              fontWeight: 'bold', 
                              cursor: isDisabled ? 'not-allowed' : 'pointer',
                              boxShadow: isDisabled ? 'none' : '0 4px 10px rgba(37, 99, 235, 0.2)'
                            }}
                          >
                            Start {sec.name}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Barcha bo'limlar tugatilgach ko'rinadigan Xabar */}
              {isAllSectionsCompleted && (
                <div style={{ marginTop: '30px', textAlign: 'center', background: '#eff6ff', padding: '25px', borderRadius: '16px', border: '1px solid #bfdbfe' }}>
                  <h3 style={{ color: '#1e40af', margin: '0 0 8px 0', fontSize: '20px' }}>Exam Successfully Completed!</h3>
                  <p style={{ color: '#1e3a8a', fontWeight: '600', fontSize: '16px', margin: '0 0 20px 0' }}>
                    Your result will be available in a day.
                  </p>
                  <button 
                    onClick={() => setCurrentView('home')} 
                    style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Return to Home
                  </button>
                </div>
              )}
            </div>
          </main>
        )}

        {/* 4. HAQIQIY IMTIHON OYNASI (ACTIVE EXAM) — FULL EKRAN */}
        {currentView === 'exam_active' && (
          <main style={{ width: '100%', minHeight: 'calc(100vh - 90px)', margin: 0, padding: '20px 40px', position: 'relative', zIndex: 10, boxSizing: 'border-box' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', width: '100%', height: '100%', boxSizing: 'border-box' }}>
              
              {/* Yuqori Panel */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '30px' }}>
                <div>
                  <h2 style={{ margin: 0, color: '#1e3a8a', fontSize: '22px' }}>{activeTestTitle}</h2>
                  <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Section: {examProgress.currentSection || 'SAT Test'}
                  </span>
                </div>

                <div style={{ fontSize: '20px', fontWeight: 'bold', background: '#fef3c7', color: '#b45309', padding: '8px 18px', borderRadius: '10px' }}>
                  Time left: {formatTime(timeLeft)}
                </div>
              </div>

              {/* Test kontenti/Savollar joylashadigan hudud */}
              <div style={{ minHeight: '300px', padding: '20px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', position: 'relative' }}>
                {showReturnPrompt ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <h3 style={{ color: '#b91c1c', marginBottom: '10px' }}>You left the test window</h3>
                    <p style={{ color: '#64748b', maxWidth: '440px', margin: '0 auto 8px auto' }}>
                      Your questions are hidden while you are away from the fullscreen test window.
                    </p>
                    <p style={{ color: '#64748b', maxWidth: '440px', margin: '0 auto 20px auto' }}>
                      Attempts used: <strong>{tabSwitchCount}/3</strong>. On the 3rd attempt the test is submitted automatically.
                    </p>
                    <button
                      onClick={requestFullscreen}
                      style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Return to fullscreen
                    </button>
                  </div>
                ) : examProgress.currentSection === 'reading' ? (
                  /* Reading bolimi tanlanganda Mock1Reading bileshi ishlaydi */
                  <Mock1Reading />
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <h3 style={{ color: '#334155', marginBottom: '10px' }}>
                      {examProgress.currentSection ? examProgress.currentSection.toUpperCase() : 'SAT'} QUESTIONS
                    </h3>
                    <p style={{ color: '#64748b' }}>
                      Exam questions and the answer interface will be here.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit tugmasi - har doim ko'rinib turishi uchun pastda "sticky" qilib qo'yildi
                  (Reading kabi uzun kontentli bo'limlarda tugma pastda yashirinib qolmasligi uchun) */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: '24px',
                paddingTop: '16px',
                position: 'sticky',
                bottom: '0',
                background: '#fff',
                borderTop: '1px solid #f1f5f9',
                zIndex: 5
              }}>
                <button
                  onClick={finishSection}
                  style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '12px 30px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 6px 14px rgba(22,163,74,0.3)' }}
                >
                  Submit
                </button>
              </div>

            </div>
          </main>
        )}

        {/* Telegram Tugmasi - faqat bosh sahifada */}
        {currentView === 'home' && (
          <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 10 }}>
            <a 
              href="https://t.me/your_sonic1" 
              target="_blank" 
              rel="noreferrer"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: '#ffffff', 
                padding: '8px 18px', 
                borderRadius: '20px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                textDecoration: 'none', 
                color: '#0088cc', 
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0088cc">
                <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.16l-2.02 9.51c-.15.68-.55.84-1.12.52l-3.1-2.28-1.5 1.44c-.17.17-.31.31-.63.31l.22-3.17 5.77-5.21c.25-.22-.05-.35-.39-.13l-7.14 4.49-3.08-.96c-.67-.21-.68-.67.14-.99l12.02-4.63c.56-.21 1.05.13.84.99z"/>
              </svg>
              Telegram
            </a>
          </div>
        )}

        {/* MODAL OYNALAR */}
        {activeModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '35px', borderRadius: '16px', width: activeModal === 'examWarning' ? '520px' : '420px', maxWidth: '92vw', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', position: 'relative' }}>
              <button onClick={closeModal} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#666' }}>✕</button>

              {/* FULLSCREEN / ANTI-CHEAT OGOHLANTIRISHI - mock boshlanishidan oldin */}
              {activeModal === 'examWarning' && (
                <div>
                  <h2 style={{ textAlign: 'center', marginBottom: '18px', color: '#1e3a8a' }}>Before you start</h2>

                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '16px 18px', marginBottom: '20px' }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>
                      This test will open in <strong>fullscreen mode</strong>. Please stay on this screen until you submit.
                    </p>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>
                      Switching to another window, tab, or app is <strong>not allowed</strong> during the test.
                    </p>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>
                      If you leave the fullscreen test window, your questions will be hidden until you return.
                      You get <strong>2 such attempts</strong> — on the <strong>3rd attempt</strong>, the test is
                      <strong> submitted automatically</strong>.
                    </p>
                    <p style={{ margin: 0, fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>
                      The timer keeps running the whole time, even while you are away.
                    </p>
                  </div>

                  <button
                    onClick={confirmExamWarning}
                    style={{ width: '100%', padding: '13px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
                  >
                    I understand, start the test
                  </button>
                </div>
              )}

              {/* BALANS TO'LDIRISH */}
              {activeModal === 'topup' && (
                <div>
                  <h2 style={{ textAlign: 'center', marginBottom: '15px', color: '#1e3a8a' }}>Hisobni To'ldirish</h2>

                  {paymentStatus === 'idle' && (
                    <div>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>To'lov summasi (UZS):</label>
                        <input 
                          type="number" 
                          value={topUpAmount} 
                          onChange={(e) => setTopUpAmount(e.target.value)} 
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                          step="5000"
                          min="1000"
                          required
                        />
                      </div>

                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>To'lov usulini tanlang:</label>

                      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                        {/* CLICK TUGMASI */}
                        <button
                          type="button"
                          onClick={() => handleProviderSelect('click')}
                          style={{
                            flex: 1,
                            padding: '16px 10px',
                            borderRadius: '12px',
                            border: selectedProvider === 'click' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                            background: selectedProvider === 'click' ? '#eff6ff' : '#fff',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '15px',
                            color: '#0f4c9c',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Click
                        </button>

                        {/* PAYME TUGMASI */}
                        <button
                          type="button"
                          onClick={() => handleProviderSelect('payme')}
                          style={{
                            flex: 1,
                            padding: '16px 10px',
                            borderRadius: '12px',
                            border: selectedProvider === 'payme' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                            background: selectedProvider === 'payme' ? '#eff6ff' : '#fff',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '15px',
                            color: '#00875a',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Payme
                        </button>
                      </div>

                      {errorMsg && <div style={{ color: 'red', marginBottom: '10px', fontSize: '13px' }}>{errorMsg}</div>}

                      {selectedProvider && (
                        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 14px', marginBottom: '15px', fontSize: '12px', color: '#92400e', lineHeight: '1.5' }}>
                          Merchant ID hozircha placeholder holatida. Haqiqiy loyihada ishga tushirishdan oldin {selectedProvider === 'click' ? 'Click Merchant Cabinet' : 'Payme Business'} orqali olingan ID kodini <code>PAYMENT_CONFIG</code> ichiga qo'yish kerak.
                        </div>
                      )}

                      <button
                        type="button"
                        disabled={!selectedProvider}
                        onClick={handleGoToCheckout}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: selectedProvider ? '#2563eb' : '#cbd5e1',
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: '15px',
                          cursor: selectedProvider ? 'pointer' : 'not-allowed'
                        }}
                      >
                        {selectedProvider ? `${selectedProvider === 'click' ? 'Click' : 'Payme'} orqali to'lash` : "Avval to'lov usulini tanlang"}
                      </button>
                    </div>
                  )}

                  {paymentStatus === 'pending' && (
                    <div style={{ textAlign: 'center', padding: '10px 0' }}>
                      <h3 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>To'lov kutilmoqda</h3>
                      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px', lineHeight: '1.6' }}>
                        Yangi ochilgan oynada to'lovni yakunlang. To'lov tasdiqlangach, balansingiz
                        {' '}<strong>{selectedProvider === 'click' ? 'Click' : 'Payme'}</strong>{' '}
                        tizimidan kelgan tasdiqlash (webhook) asosida server tomonidan avtomatik yangilanadi.
                      </p>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '20px' }}>
                        Eslatma: bu holat backend integratsiyasi ulanmaguncha faqat UI oqimini ko'rsatadi — balans avtomatik oshmaydi.
                      </p>
                      <button onClick={closeModal} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Yopish
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* LOGIN MODAL */}
              {activeModal === 'login' && (
                <div>
                  <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1e3a8a' }}>Log in</h2>

                  {/* Eslatma: Login oynasida Google orqali kirish ataylab olib tashlangan.
                      Foydalanuvchi Sign Up paytida kiritgan email va parol orqaligina
                      kirishi kerak — mos kelmasa, pastdagi xato xabari chiqadi. */}

                  <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} required />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Parol</label>
                      <input type="password" name="password" value={formData.password} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} required />
                    </div>
                    {errorMsg && <div style={{ color: 'red', marginBottom: '10px', fontSize: '13px' }}>{errorMsg}</div>}
                    <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                      Log in
                    </button>
                  </form>
                </div>
              )}

              {/* SIGNUP MODAL */}
              {activeModal === 'signup' && (
                <div>
                  <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#1e3a8a' }}>Ro'yxatdan o'tish</h2>

                  {/* GOOGLE ORQALI RO'YXATDAN O'TISH */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
                    <div id="googleSignupBtn"></div>
                  </div>

                  {/* AJRATUVCHI CHIZIQ */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0 20px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600' }}>yoki</span>
                    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                  </div>

                  <form onSubmit={handleSignUp}>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Ism-sharif</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} required />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Parol</label>
                      <input type="password" name="password" value={formData.password} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} required />
                    </div>
                    {errorMsg && <div style={{ color: 'red', marginBottom: '10px', fontSize: '13px' }}>{errorMsg}</div>}
                    <button type="submit" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                      Ro'yxatdan o'tish
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </>
  );
}