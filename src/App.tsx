import React, { useState } from 'react';
import { 
  Heart, User, ShieldCheck, HelpCircle, Laptop, Smartphone, 
  MapPin, Clock, CheckCircle, Info, Sparkles, Award
} from 'lucide-react';
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
    elderlyName: 'คุณยายปิยะวรรณ สุขุม',
    elderlyAge: 68,
    elderlyPhoto: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=150', // Beautiful portrait of a smiling elderly lady
    isVolunteerReady: true,
    historyRequests: []
  });

  // Simulator View Mode: 'split' | 'elderly' | 'volunteer'
  const [viewMode, setViewMode] = useState<'split' | 'elderly' | 'volunteer'>('split');

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Main Navigation Header */}
      <header className="bg-[#0F172A] border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-slate-950 p-2.5 rounded-2xl shadow-md">
            <Heart className="fill-slate-950 stroke-none w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2 tracking-wide">
              <span>เครือข่าย อสม. ร่วมใจดูแลผู้สูงอายุ</span>
              <span className="bg-amber-400/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-400/30">ต้นแบบระบบจำลอง</span>
            </h1>
            <p className="text-xs text-slate-400">ระบบสวัสดิการ สุขภาพ และจัดส่งอาสาสมัครช่วยเหลือรับ-ส่งโรงพยาบาล</p>
          </div>
        </div>

        {/* View mode switcher tabs */}
        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700/80">
          <button
            onClick={() => setViewMode('split')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === 'split' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'}`}
          >
            <Laptop size={14} />
            <span>ดูคู่สองฝั่ง (แนะนำ)</span>
          </button>
          <button
            onClick={() => setViewMode('elderly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === 'elderly' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'}`}
          >
            <Smartphone size={14} />
            <span>ฝั่งผู้สูงอายุอย่างเดียว</span>
          </button>
          <button
            onClick={() => setViewMode('volunteer')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === 'volunteer' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-300 hover:text-white'}`}
          >
            <Smartphone size={14} />
            <span>ฝั่งอาสาสมัครอย่างเดียว</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Workspace Area */}
      <main className="flex-1 p-4 lg:p-6 flex flex-col gap-6 overflow-hidden max-w-7xl w-full mx-auto justify-center">
        
        {/* Step Guide / Info Banner for Sandbox */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 shadow-md backdrop-blur-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-amber-400/10 text-amber-400 p-2 rounded-xl border border-amber-400/20 shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>🌟 วิธีการทดลองใช้ระบบจับคู่พาไปโรงพยาบาลและปรึกษาสุขภาพแบบเรียลไทม์ :</span>
              </h2>
              <div className="text-xs text-slate-300 mt-1.5 space-y-1">
                <p>1. <span className="text-amber-400 font-semibold">ในแอปฝั่งซ้าย (ผู้สูงอายุ)</span>: คลิกที่ปุ่ม <strong className="text-white">"สุขภาพ"</strong> หรือปุ่ม <strong className="text-white">"ขออาสาสมัครช่วย"</strong> บนการ์ดสีน้ำเงิน</p>
                <p>2. <span className="text-amber-400 font-semibold">เลือกงาน</span>: เลือก <strong className="text-white">"ขออาสาสมัครพาไปโรงพยาบาล"</strong> เลือกโรงพยาบาลเป้าหมาย แล้วกด <strong className="text-white">"ส่งสัญญาณเรียกอาสาสมัคร"</strong></p>
                <p>3. <span className="text-amber-400 font-semibold">ในแอปฝั่งขวา (อาสาสมัคร)</span>: จะมีงานใหม่เด้งเข้ามาในระบบทันที! คลิกเข้าไปดูรายละเอียดงานและกดปุ่ม <strong className="text-white">"รับงาน"</strong></p>
                <p>4. <span className="text-emerald-400 font-bold">เชื่อมต่อสำเร็จ!</span>: ทั้งคู่จะเข้าสู่โหมดแชทพูดคุยและวิดีโอคอลร่วมกัน สามารถพิมพ์แชทตอบโต้หากันได้ทันที!</p>
              </div>
            </div>
          </div>

          {/* Quick status values */}
          <div className="flex flex-row md:flex-col gap-2 shrink-0 bg-slate-900/60 p-3 rounded-xl border border-slate-700/40 text-center w-full md:w-auto">
            <div className="flex-1">
              <p className="text-[10px] text-slate-400 font-bold">สถานะจับคู่ระบบ</p>
              <span className={`text-xs font-bold inline-block px-2.5 py-0.5 rounded-full mt-1 ${
                appState.matchStatus === 'IDLE' ? 'bg-slate-700 text-slate-300' :
                appState.matchStatus === 'CONNECTING' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {appState.matchStatus === 'IDLE' ? 'ว่าง / พร้อมบริการ' :
                 appState.matchStatus === 'CONNECTING' ? 'กำลังค้นหาอาสา...' : 'เชื่อมต่อพูดคุยอยู่'}
              </span>
            </div>
            {appState.currentRequest && (
              <div className="flex-1 md:border-t md:border-slate-800 md:pt-2">
                <p className="text-[10px] text-slate-400 font-bold">เคสปัจจุบัน</p>
                <span className="text-[10px] font-semibold text-amber-400">{appState.currentRequest.elderlyName.split(' ')[0]}</span>
              </div>
            )}
          </div>
        </div>

        {/* View Renders based on selection */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          {viewMode === 'split' ? (
            // SIDE-BY-SIDE DOUBLE VIEW (DESKTOP OPTIMAL)
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl justify-center items-center">
              
              {/* Left Column: Elderly App with distinct label */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold bg-amber-500/15 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20 mb-1">
                  <User size={13} />
                  <span>[โหมดสำหรับผู้ใช้งาน / ผู้สูงอายุ]</span>
                </div>
                <ElderlyApp appState={appState} setAppState={setAppState} />
              </div>

              {/* Right Column: Volunteer App with distinct label */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold bg-indigo-500/15 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 mb-1">
                  <ShieldCheck size={13} />
                  <span>[โหมดสำหรับอาสาสมัครดูแล / อสม.]</span>
                </div>
                <VolunteerApp appState={appState} setAppState={setAppState} />
              </div>

            </div>
          ) : viewMode === 'elderly' ? (
            // SINGLE FOCUSED ELDERLY VIEW
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="flex items-center gap-1.5 text-xs font-bold bg-amber-500/15 text-amber-400 px-4 py-1.5 rounded-full border border-amber-500/20 mb-2">
                <User size={13} />
                <span>โหมดผู้สูงอายุ (Elderly User Viewport)</span>
              </div>
              <ElderlyApp appState={appState} setAppState={setAppState} />
            </div>
          ) : (
            // SINGLE FOCUSED VOLUNTEER VIEW
            <div className="flex flex-col items-center gap-2 py-4">
              <div className="flex items-center gap-1.5 text-xs font-bold bg-indigo-500/15 text-indigo-400 px-4 py-1.5 rounded-full border border-indigo-500/20 mb-2">
                <ShieldCheck size={13} />
                <span>โหมดอาสาสมัคร (Volunteer Viewport)</span>
              </div>
              <VolunteerApp appState={appState} setAppState={setAppState} />
            </div>
          )}
        </div>

      </main>

      {/* Footer System Disclaimer */}
      <footer className="bg-[#0F172A] border-t border-slate-800 px-6 py-3.5 text-center text-xs text-slate-500 shrink-0">
        <p className="flex items-center justify-center gap-1">
          <span>© 2026 เครือข่าย อสม. ร่วมใจ • พัฒนาขึ้นด้วย React 19 และ Tailwind CSS สำหรับดูแลผู้สูงอายุอย่างเป็นทางการ</span>
        </p>
      </footer>

    </div>
  );
}
