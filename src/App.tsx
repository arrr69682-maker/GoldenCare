import React, { useState } from 'react';
import { 
  Heart, User, ShieldCheck, HelpCircle, Laptop, Smartphone, 
  MapPin, Clock, CheckCircle, Info, Sparkles, Award, Play,
  KeyRound, ChevronRight, X, Phone, ShieldAlert, HeartPulse, UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ElderlyApp from './components/ElderlyApp';
import VolunteerApp from './components/VolunteerApp';
import { AppState, HelpRequest } from './types';

export default function App() {
  // Global Shared State for interactive real-time simulation
  const [appState, setAppState] = useState<AppState>({
    matchStatus: 'IDLE',
    currentRequest: null,
    chatMessages: [],
    isVideoActive: false,
    activeTabElderly: 'home',
    activeTabVolunteer: 'home',
    elderlyName: 'คุณสมหญิง รักดี', // Exactly requested name
    elderlyAge: 72,
    elderlyPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150', // Beautiful senior woman photo
    isVolunteerReady: true,
    historyRequests: []
  });

  // Current view of the app: 'welcome' (The Landing Page) or 'app' (The Main System Portal)
  const [currentAppView, setCurrentAppView] = useState<'welcome' | 'app'>('welcome');

  // Simulator View Mode: 'split' | 'elderly' | 'volunteer'
  const [viewMode, setViewMode] = useState<'split' | 'elderly' | 'volunteer'>('split');

  // Modals for Welcome Screen actions
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Forms states
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'elderly' | 'volunteer'>('elderly');
  const [forgotPhone, setForgotPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone) {
      showToast('⚠️ กรุณากรอกข้อมูลให้ครบถ้วนค่ะ');
      return;
    }
    
    // Dynamically update state with the registered name
    if (regRole === 'elderly') {
      setAppState(prev => ({
        ...prev,
        elderlyName: regName
      }));
      showToast(`👵 ยินดีต้อนรับคุณ ${regName}! สมัครสมาชิกผู้สูงอายุสำเร็จ ระบบเข้าสู่หน้าจอให้อัตโนมัติ`);
      setViewMode('elderly');
    } else {
      showToast(`❤️ ยินดีต้อนรับอาสา ${regName}! สมัครสมาชิกอาสาสมัครสำเร็จ ระบบเข้าสู่หน้าจอให้อัตโนมัติ`);
      setViewMode('volunteer');
    }
    
    setShowRegisterModal(false);
    setCurrentAppView('app');
    // Clear forms
    setRegName('');
    setRegPhone('');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPhone) {
      showToast('⚠️ กรุณากรอกเบอร์โทรศัพท์ด้วยค่ะ');
      return;
    }
    setOtpSent(true);
    setTimeout(() => {
      showToast(`🔑 รหัสกู้คืนชั่วคราวถูกส่งไปยังเบอร์ ${forgotPhone} แล้วเรียบร้อย!`);
      setShowForgotPasswordModal(false);
      setOtpSent(false);
      setForgotPhone('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans relative selection:bg-amber-500 selection:text-slate-950">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-amber-400"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Main Navigation Header */}
      <header className="bg-[#0F172A] border-b border-slate-800 px-6 py-3.5 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentAppView('welcome')}
            className="bg-amber-500 text-slate-950 p-2 rounded-2xl shadow-md hover:scale-105 transition-transform"
          >
            <Heart className="fill-slate-950 stroke-none w-5.5 h-5.5" />
          </button>
          <div>
            <h1 className="text-lg font-black text-white flex items-center gap-2 tracking-wide">
              <span>สูงวัยอุ่นใจ (SeniorCare Connect)</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-400/30">ต้นแบบแอปพลิเคชัน</span>
            </h1>
            <p className="text-xs text-slate-400">ระบบจำลองเครือข่ายความช่วยเหลือ อสม. และสวัสดิการผู้สูงอายุเรียลไทม์</p>
          </div>
        </div>

        {/* View mode switcher tabs & Quick controls */}
        <div className="flex items-center gap-3">
          {currentAppView === 'app' && (
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700/80">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${viewMode === 'split' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'}`}
              >
                <Laptop size={13} />
                <span>ดูคู่สองฝั่ง (แนะนำ)</span>
              </button>
              <button
                onClick={() => setViewMode('elderly')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${viewMode === 'elderly' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'}`}
              >
                <Smartphone size={13} />
                <span>ฝั่งผู้สูงอายุ</span>
              </button>
              <button
                onClick={() => setViewMode('volunteer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${viewMode === 'volunteer' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'}`}
              >
                <Smartphone size={13} />
                <span>ฝั่งอาสาสมัคร</span>
              </button>
            </div>
          )}

          <button
            onClick={() => setCurrentAppView(currentAppView === 'welcome' ? 'app' : 'welcome')}
            className="bg-slate-800 hover:bg-slate-700 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 text-amber-400 flex items-center gap-1 cursor-pointer transition-colors"
          >
            {currentAppView === 'welcome' ? (
              <>
                <Play size={13} className="fill-amber-400" />
                <span>ข้ามหน้าแรกไปทดสอบแอป</span>
              </>
            ) : (
              <span>🚪 กลับสู่หน้าแรก Welcome</span>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          
          {/* ======================================= */}
          {/* SCREEN: WELCOME LANDING PAGE            */}
          {/* ======================================= */}
          {currentAppView === 'welcome' ? (
            <motion.div 
              key="welcome_screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col items-center justify-center p-6 min-h-[calc(100vh-160px)]"
            >
              <div className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden backdrop-blur-md">
                
                {/* Decorative background glow */}
                <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

                {/* APP LOGO */}
                <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-amber-400 to-rose-400 p-0.5 rounded-3xl shadow-xl flex items-center justify-center mb-6 animate-pulse duration-3000">
                  <div className="bg-slate-900 w-full h-full rounded-3.5xl flex items-center justify-center">
                    <Heart className="w-12 h-12 text-amber-400 fill-amber-400" />
                  </div>
                </div>

                {/* APP TITLES */}
                <h1 className="text-3xl font-black text-white leading-tight tracking-wide">
                  สูงวัยอุ่นใจ
                </h1>
                <p className="text-amber-400 text-lg font-bold tracking-wider mt-1">
                  (SeniorCare Connect)
                </p>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  เครือข่ายสวัสดิการอัจฉริยะ เชื่อมโยง อสม. และอาสาสมัครในชุมชนดูแลผู้สูงอายุอย่างทันท่วงที มอบรอยยิ้มและความอุ่นใจให้ผู้สูงวัยทุกคน
                </p>

                {/* LOGIN BUTTONS */}
                <div className="flex flex-col gap-4 mt-8">
                  
                  {/* เข้าสู่ระบบผู้สูงวัย */}
                  <button 
                    onClick={() => {
                      setViewMode('elderly');
                      setCurrentAppView('app');
                      showToast('👵 เข้าสู่ระบบผู้สูงอายุเรียบร้อยแล้ว ยินดีต้อนรับค่ะ!');
                    }}
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-[0.99] text-slate-950 py-4 px-6 rounded-2xl font-black text-base shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-amber-300/30"
                  >
                    <span className="text-2xl">👵</span>
                    <span>เข้าสู่ระบบผู้สูงวัย</span>
                  </button>

                  {/* เข้าสู่ระบบอาสาสมัคร */}
                  <button 
                    onClick={() => {
                      setViewMode('volunteer');
                      setCurrentAppView('app');
                      showToast('❤️ เข้าสู่ระบบอาสาสมัคร อสม. เรียบร้อยแล้ว พร้อมช่วยเหลือคุณยายค่ะ!');
                    }}
                    className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-black text-base shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-indigo-400/20"
                  >
                    <span className="text-2xl">❤️</span>
                    <span>เข้าสู่ระบบอาสาสมัคร</span>
                  </button>

                </div>

                {/* LINKS SECTION: Register & Forgot Password */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700 text-sm">
                  <button 
                    onClick={() => setShowRegisterModal(true)}
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <UserPlus size={15} />
                    <span>สมัครสมาชิกใหม่</span>
                  </button>

                  <button 
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-slate-400 hover:text-slate-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <KeyRound size={15} />
                    <span>ลืมรหัสผ่าน?</span>
                  </button>
                </div>

                {/* Sandbox quick tip */}
                <div className="mt-8 text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                  💡 แนะนำให้กดปุ่ม "ข้ามหน้าแรกไปทดสอบแอป" ด้านบน เพื่อทดลองใช้การจับคู่และพูดคุยแบบสองฝั่งพร้อมกัน
                </div>

              </div>
            </motion.div>
          ) : (
            
            // =======================================
            // SCREEN: PORTAL CORE WORKSPACE
            // =======================================
            <motion.div 
              key="app_portal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 lg:p-6 max-w-7xl w-full mx-auto flex flex-col gap-6"
            >
              {/* Info Guide / Real-time Matching Simulation Dashboard */}
              <div className="bg-slate-800/75 border border-slate-700/50 rounded-3xl p-4.5 shadow-md backdrop-blur-xs flex flex-col md:flex-row gap-5 items-center justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="bg-amber-400/10 text-amber-400 p-2.5 rounded-2xl border border-amber-400/20 shrink-0">
                    <Sparkles size={22} className="animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>📱 แผงควบคุมระบบจำลองพอร์ทัลความช่วยเหลือ</span>
                    </h2>
                    <div className="text-xs text-slate-300 mt-1.5 space-y-1 max-w-3xl leading-relaxed">
                      <p>• <span className="text-amber-400 font-bold">ฝั่งซ้าย (ผู้สูงอายุ - สมหญิง)</span>: สามารถขออาสาสมัคร, ปรึกษาสุขภาพ, และเมื่อกดเหตุฉุกเฉินจะมีระบบขอความช่วยเหลือ 4 รูปแบบ</p>
                      <p>• <span className="text-amber-400 font-bold">ฝั่งขวา (อาสาสมัคร - สมหญิง อสม.)</span>: จะได้รับงานแจ้งเตือนแบบเรียลไทม์ และสื่อสารผ่านแชท/วิดีโอคอลได้ทันที</p>
                    </div>
                  </div>
                </div>

                {/* Match indicator */}
                <div className="flex flex-row md:flex-col gap-2 shrink-0 bg-slate-900/50 p-3 rounded-2xl border border-slate-700/40 text-center w-full md:w-auto">
                  <div className="flex-1">
                    <p className="text-[10px] text-slate-400 font-bold">การเชื่อมต่อ</p>
                    <span className={`text-[11px] font-black inline-block px-2.5 py-0.5 rounded-full mt-1 ${
                      appState.matchStatus === 'IDLE' ? 'bg-slate-700 text-slate-300' :
                      appState.matchStatus === 'CONNECTING' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {appState.matchStatus === 'IDLE' ? 'พร้อมให้บริการ' :
                       appState.matchStatus === 'CONNECTING' ? 'กำลังส่งสัญญาน...' : 'เชื่อมต่อเรียบร้อย'}
                    </span>
                  </div>
                </div>
              </div>

              {/* View Renders */}
              <div className="flex-1 flex items-center justify-center overflow-hidden min-h-[750px]">
                {viewMode === 'split' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl justify-center items-start">
                    
                    {/* Left Column: Elderly App */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-black bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-full shadow-md mb-1 border border-amber-300">
                        <User size={13} />
                        <span>โหมดผู้ใช้งาน: คุณสมหญิง (ผู้สูงอายุ)</span>
                      </div>
                      <ElderlyApp appState={appState} setAppState={setAppState} />
                    </div>

                    {/* Right Column: Volunteer App */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-black bg-indigo-500 text-white px-3.5 py-1.5 rounded-full shadow-md mb-1 border border-indigo-400/30">
                        <ShieldCheck size={13} />
                        <span>โหมดอาสาสมัคร: อสม. สมใจ (อาสาใกล้ฉัน)</span>
                      </div>
                      <VolunteerApp appState={appState} setAppState={setAppState} />
                    </div>

                  </div>
                ) : viewMode === 'elderly' ? (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-black bg-amber-400 text-slate-950 px-4 py-1.5 rounded-full shadow-md mb-2 border border-amber-300">
                      <User size={13} />
                      <span>โหมดผู้สูงอายุ (Elderly Screen Only)</span>
                    </div>
                    <ElderlyApp appState={appState} setAppState={setAppState} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-black bg-indigo-500 text-white px-4 py-1.5 rounded-full shadow-md mb-2 border border-indigo-400/30">
                      <ShieldCheck size={13} />
                      <span>โหมดอาสาสมัคร (Volunteer Screen Only)</span>
                    </div>
                    <VolunteerApp appState={appState} setAppState={setAppState} />
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ======================================= */}
      {/* MODAL: REGISTER / สมัครสมาชิก            */}
      {/* ======================================= */}
      <AnimatePresence>
        {showRegisterModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 relative shadow-2xl"
            >
              <button 
                onClick={() => setShowRegisterModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full cursor-pointer"
              >
                <X size={16} />
              </button>

              <h2 className="text-xl font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <UserPlus className="text-amber-400" />
                <span>สมัครสมาชิก สูงวัยอุ่นใจ</span>
              </h2>

              <form onSubmit={handleRegisterSubmit} className="space-y-4 mt-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">ฉันต้องการสมัครสมาชิกในฐานะ :</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRegRole('elderly')}
                      className={`py-3 px-4 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all ${regRole === 'elderly' ? 'border-amber-400 bg-amber-400/10 text-amber-400' : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'}`}
                    >
                      <span>👵</span>
                      <span>ผู้สูงอายุ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegRole('volunteer')}
                      className={`py-3 px-4 rounded-xl border-2 font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all ${regRole === 'volunteer' ? 'border-indigo-400 bg-indigo-400/10 text-indigo-400' : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'}`}
                    >
                      <span>❤️</span>
                      <span>อาสาสมัคร</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">ชื่อ-นามสกุล ของท่าน :</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น คุณสมหญิง รักดี, อสม. ชูใจ"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">เบอร์โทรศัพท์มือถือ :</label>
                  <input
                    type="tel"
                    required
                    placeholder="เช่น 089-XXXXXXX"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 text-white"
                  />
                </div>

                <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 text-[11px] text-slate-400 leading-relaxed">
                  🔒 ข้อมูลของท่านได้รับการคุ้มครองด้วยระบบรักษาความปลอดภัยเครือข่ายความช่วยเหลือ อสม. ระดับชุมชน
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-3.5 rounded-xl text-sm shadow-md transition-all cursor-pointer mt-2"
                >
                  ลงทะเบียนและเข้าสู่ระบบทันที
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================= */}
      {/* MODAL: FORGOT PASSWORD / ลืมรหัสผ่าน     */}
      {/* ======================================= */}
      <AnimatePresence>
        {showForgotPasswordModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 relative shadow-2xl"
            >
              <button 
                onClick={() => setShowForgotPasswordModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full cursor-pointer"
              >
                <X size={16} />
              </button>

              <h2 className="text-xl font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <KeyRound className="text-amber-400" />
                <span>กู้คืนรหัสผ่านของคุณ</span>
              </h2>

              <form onSubmit={handleForgotSubmit} className="space-y-4 mt-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  กรอกเบอร์โทรศัพท์ของท่านที่ใช้สมัครสมาชิกเพื่อความปลอดภัย ระบบจะส่งรหัสผ่านชั่วคราวชิ้นใหม่ไปยังกล่องข้อความ SMS ของท่านใน 1 นาที
                </p>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">เบอร์โทรศัพท์มือถือที่ลงทะเบียน :</label>
                  <input
                    type="tel"
                    required
                    placeholder="เช่น 089-XXXXXXX"
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-3.5 rounded-xl text-sm shadow-md transition-all cursor-pointer"
                >
                  {otpSent ? 'กำลังดำเนินการส่ง SMS...' : 'ขอรหัสผ่านใหม่ทาง SMS'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer System Disclaimer */}
      <footer className="bg-[#0F172A] border-t border-slate-800 px-6 py-3.5 text-center text-xs text-slate-500 shrink-0">
        <p>
          © 2026 สูงวัยอุ่นใจ (SeniorCare Connect) • อุ่นใจ มี อสม. ดูแลตลอด 24 ชั่วโมง
        </p>
      </footer>

    </div>
  );
}
