import React, { useState } from 'react';
import { 
  User, CheckCircle, Clock, MessageSquare, Phone, Video, MapPin, 
  ArrowLeft, BookOpen, MessageCircle, HelpCircle, Power, 
  ChevronRight, PhoneCall, Check, X, ShieldAlert, Award, FileText,
  Hospital, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState, HelpRequest, ChatMessage } from '../types';

interface VolunteerAppProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function VolunteerApp({ appState, setAppState }: VolunteerAppProps) {
  const { 
    matchStatus, currentRequest, chatMessages, isVideoActive, 
    activeTabVolunteer, isVolunteerReady, historyRequests 
  } = appState;

  // Local state for subscreen
  const [currentScreen, setCurrentScreen] = useState<'HOME' | 'JOBS_LIST' | 'JOB_DETAILS' | 'KNOWLEDGE_BASE' | 'CONTACT_TEAM' | 'HISTORY_LIST'>('HOME');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string>('');
  const [activeJobTab, setActiveJobTab] = useState<'available' | 'active'>('available');

  // Static pre-made mock jobs (Screenshot 4 middle panel)
  const [mockAvailableJobs, setMockAvailableJobs] = useState<HelpRequest[]>([
    {
      id: 'mock-1',
      elderlyName: 'คุณยายสมศรี เติมสุข',
      elderlyAge: 72,
      elderlyPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      symptom: 'มีอาการปวดหัว เวียนศีรษะ 2 วัน ยังไม่ได้รับยาหรือไปพบแพทย์',
      category: 'health',
      categoryLabel: 'สอบถามเรื่องสุขภาพ',
      time: '10:30 น.',
      recommendedAgency: 'โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านบอน (รพ.สต.)',
      phone: '081-234-5678',
      note: 'ต้องการข้อมูลเพิ่มเติมเกี่ยวกับการเดินทางไป รพ.',
      status: 'PENDING'
    },
    {
      id: 'mock-2',
      elderlyName: 'คุณตาบุญมี รักสงบ',
      elderlyAge: 75,
      elderlyPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      symptom: 'อยากสอบถามเกณฑ์สิทธิเบี้ยยังชีพผู้สูงอายุรอบใหม่ และการขึ้นทะเบียนคนพิการ',
      category: 'rights',
      categoryLabel: 'สอบถามสิทธิผู้สูงอายุ',
      time: '11:15 น.',
      recommendedAgency: 'สำนักงานพัฒนาสังคมและความมั่นคงของมนุษย์จังหวัด',
      phone: '089-999-8888',
      note: 'คุณตามีความบกพร่องทางการได้ยินเล็กน้อย รบกวนพิมพ์แชทอธิบายช้าๆ',
      status: 'PENDING'
    },
    {
      id: 'mock-3',
      elderlyName: 'คุณยายบัวผัน วันสว่าง',
      elderlyAge: 69,
      elderlyPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      symptom: 'ขอคำแนะนำเรื่องยาลดไขมันในเส้นเลือด ยาหมดต้องการให้พาไป รพ. สต.',
      category: 'health',
      categoryLabel: 'ขอคำแนะนำเรื่องยา',
      time: '13:00 น.',
      recommendedAgency: 'โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านบอน (รพ.สต.)',
      phone: '085-777-6666',
      note: 'ต้องการอาสาช่วยขี่รถมอเตอร์ไซค์ไปรับที่บ้านพาไปรับยา',
      status: 'PENDING'
    }
  ]);

  // Combine static and live requests
  const availableJobs = [...mockAvailableJobs];
  if (currentRequest && currentRequest.status === 'PENDING') {
    availableJobs.unshift(currentRequest);
  }

  // Handle Ready Toggle
  const handleReadyToggle = () => {
    setAppState(prev => ({ ...prev, isVolunteerReady: !prev.isVolunteerReady }));
  };

  // Accept a Help Request (รับงาน)
  const handleAcceptJob = (job: HelpRequest) => {
    // If it's a mock static job, update locally
    if (job.id.startsWith('mock-')) {
      setMockAvailableJobs(prev => prev.filter(j => j.id !== job.id));
    }

    // Set the state request as active & change status to CONNECTED
    const acceptedRequest: HelpRequest = {
      ...job,
      status: 'ACCEPTED'
    };

    setAppState(prev => {
      // Start simulation messages
      const welcomeMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: 'volunteer',
        text: `สวัสดีค่ะคุณยาย${job.elderlyName.split(' ')[0]} หนูเป็นอาสาสมัครรับเรื่องแล้่วนะคะ ยินดีช่วยเหลือค่ะ มีอะไรให้ช่วยไหมคะ`,
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
      };

      return {
        ...prev,
        matchStatus: 'CONNECTED',
        currentRequest: acceptedRequest,
        chatMessages: [
          {
            id: 'sys-start',
            sender: 'system',
            text: `อาสาสมัครรับงานเรียบร้อย: คุณยาย ${job.elderlyName}`,
            time: welcomeMsg.time
          },
          welcomeMsg
        ]
      };
    });

    setSelectedJobId(job.id);
    setCurrentScreen('JOB_DETAILS');
    setActiveJobTab('active');
  };

  // Complete job (เสร็จสิ้นงาน)
  const handleCompleteJob = (job: HelpRequest) => {
    const completedJob: HelpRequest = {
      ...job,
      status: 'COMPLETED'
    };

    setAppState(prev => ({
      ...prev,
      matchStatus: 'IDLE',
      currentRequest: null,
      chatMessages: [],
      historyRequests: [completedJob, ...prev.historyRequests]
    }));

    setCurrentScreen('HOME');
    alert(`งานช่วยเหลือคุณยาย ${job.elderlyName} เสร็จสิ้นสมบูรณ์ บันทึกเข้าประวัติแล้วค่ะ คุณได้รับ 20 แต้มความดีอัปเกรดระดับอาสา!`);
  };

  // Chat message send (Volunteer)
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'volunteer',
      text: inputText,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
    };

    setAppState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, newMsg]
    }));
    setInputText('');
  };

  // Find job currently being helped
  const activeJob = currentRequest && currentRequest.status === 'ACCEPTED' ? currentRequest : null;

  return (
    <div className="w-full max-w-md mx-auto bg-slate-50 text-slate-800 flex flex-col h-[750px] shadow-2xl rounded-3xl overflow-hidden border-4 border-indigo-100 relative">
      
      {/* Top Mobile Bar decoration */}
      <div className="bg-[#1A365D] px-6 pt-3 pb-2 flex justify-between items-center text-xs font-semibold text-slate-300 select-none border-b border-indigo-900/30">
        <span>9:41 น.</span>
        <div className="w-24 h-4 bg-slate-800 rounded-full mx-2 opacity-50"></div>
        <div className="flex gap-1 items-center">
          <span className="text-indigo-400">5G</span>
          <div className="w-5 h-2.5 bg-slate-500 rounded-xs"></div>
        </div>
      </div>

      {/* Main Container with Screen Transitions */}
      <div className="flex-1 overflow-y-auto flex flex-col p-4 relative">
        <AnimatePresence mode="wait">
          
          {/* SCREEN: HOME (๑. อาสาสมัคร - เหมือนรูปที่ 4 บานซ้ายสุด) */}
          {currentScreen === 'HOME' && activeTabVolunteer === 'home' && (
            <motion.div 
              key="volunteer_home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4 flex-1"
            >
              {/* Header profile */}
              <div className="flex justify-between items-center bg-[#1A365D] text-white p-4 rounded-2xl shadow-md border border-indigo-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-indigo-500 rounded-full flex items-center justify-center text-white border-2 border-indigo-300 font-bold">
                    อาสา
                  </div>
                  <div>
                    <h2 className="text-[10px] text-indigo-300 font-semibold tracking-wider">แอปอาสาสมัคร (อสม.)</h2>
                    <h1 className="text-base font-bold">สวัสดีค่ะ คุณอาสาสมัครใจดี</h1>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] bg-amber-500 text-slate-900 px-2 py-0.5 rounded-full font-bold">Lv.4 อาสาดีเด่น</span>
                </div>
              </div>

              {/* Ready for Duty Toggle (เหมือนรูปที่ 4 บานซ้าย) */}
              <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className={`w-3.5 h-3.5 rounded-full ${isVolunteerReady ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                  <div>
                    <span className="text-sm font-bold text-slate-700">พร้อมปฏิบัติงานช่วยเหลือ</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">เปิดระบบรับสัญญาณขอความช่วยเหลือรอบตัว</p>
                  </div>
                </div>
                
                {/* Custom Toggle Switch */}
                <button 
                  onClick={handleReadyToggle}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 ${isVolunteerReady ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${isVolunteerReady ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* Grid 4 Option Cards (เหมือนรูปที่ 4 บานซ้าย) */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* 1. งานที่ได้รับ */}
                <button
                  onClick={() => {
                    setCurrentScreen('JOBS_LIST');
                    setActiveJobTab('available');
                  }}
                  className="bg-white hover:bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer transition-all active:scale-95 relative group"
                >
                  {availableJobs.length > 0 && isVolunteerReady && (
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                      {availableJobs.length}
                    </span>
                  )}
                  <div className="bg-indigo-100 text-indigo-700 p-3 rounded-2xl mb-2.5 group-hover:scale-105 transition-transform">
                    <FileText size={24} />
                  </div>
                  <span className="text-xs font-bold text-slate-800">งานที่ได้รับ</span>
                  <span className="text-[10px] text-indigo-500 font-semibold mt-1">
                    {isVolunteerReady ? `มีงานว่าง ${availableJobs.length} รายการ` : 'กรุณาเปิดรับงาน'}
                  </span>
                </button>

                {/* 2. ประวัติการช่วยเหลือ */}
                <button
                  onClick={() => setCurrentScreen('HISTORY_LIST')}
                  className="bg-white hover:bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer transition-all active:scale-95 group"
                >
                  <div className="bg-emerald-100 text-emerald-700 p-3 rounded-2xl mb-2.5 group-hover:scale-105 transition-transform">
                    <Award size={24} />
                  </div>
                  <span className="text-xs font-bold text-slate-800">ประวัติการช่วยเหลือ</span>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-1">ช่วยแล้ว {historyRequests.length} ครั้ง</span>
                </button>

                {/* 3. ความรู้สำหรับอาสา */}
                <button
                  onClick={() => setCurrentScreen('KNOWLEDGE_BASE')}
                  className="bg-white hover:bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer transition-all active:scale-95 group"
                >
                  <div className="bg-amber-100 text-amber-700 p-3 rounded-2xl mb-2.5 group-hover:scale-105 transition-transform">
                    <BookOpen size={24} />
                  </div>
                  <span className="text-xs font-bold text-slate-800">ความรู้สำหรับอาสา</span>
                  <span className="text-[10px] text-amber-600 font-semibold mt-1">การดูแลผู้ป่วยติดเตียง</span>
                </button>

                {/* 4. ติดต่อทีมงาน */}
                <button
                  onClick={() => setCurrentScreen('CONTACT_TEAM')}
                  className="bg-white hover:bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer transition-all active:scale-95 group"
                  id="contact-team-btn"
                >
                  <div className="bg-purple-100 text-purple-700 p-3 rounded-2xl mb-2.5 group-hover:scale-105 transition-transform">
                    <MessageSquare size={24} />
                  </div>
                  <span className="text-xs font-bold text-slate-800">ติดต่อทีมงาน</span>
                  <span className="text-[10px] text-purple-600 font-semibold mt-1">แชทติดต่อผู้ประสาน</span>
                </button>

              </div>

              {/* Active help widget if helping (กำลังช่วยงานอยู่) */}
              {activeJob && (
                <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-2xl shadow-sm mt-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                      กำลังช่วยเหลือผู้สูงอายุอยู่ในขณะนี้ :
                    </span>
                    <button 
                      onClick={() => {
                        setSelectedJobId(activeJob.id);
                        setCurrentScreen('JOB_DETAILS');
                      }}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      ดูงานแชทคอล
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={activeJob.elderlyPhoto} alt="active" className="w-10 h-10 rounded-full object-cover border border-emerald-300" referrerPolicy="no-referrer" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{activeJob.elderlyName}</p>
                        <p className="text-[10px] text-slate-500 font-semibold truncate w-48">{activeJob.symptom}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCompleteJob(activeJob)}
                      className="bg-emerald-600 text-white text-[11px] px-3 py-1.5 rounded-full font-bold shadow-sm hover:bg-emerald-700 active:scale-95"
                    >
                      เสร็จสิ้นงาน
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* SCREEN: JOBS LIST (รายการงานที่ได้รับ - เหมือนรูปที่ 4 บานกลาง) */}
          {currentScreen === 'JOBS_LIST' && (
            <motion.div 
              key="jobs_list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4 flex-1 text-sm"
            >
              {/* Header with Back */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCurrentScreen('HOME')}
                  className="bg-slate-200 text-slate-800 p-2 rounded-full hover:bg-slate-300 transition-all"
                >
                  <ArrowLeft size={16} />
                </button>
                <h1 className="text-lg font-bold text-slate-900">งานที่ได้รับมอบหมาย</h1>
              </div>

              {/* Tabs: Available vs Active (เหมือนรูปที่ 4 บานกลาง) */}
              <div className="flex bg-slate-200 p-1 rounded-xl">
                <button
                  onClick={() => setActiveJobTab('available')}
                  className={`flex-1 py-2 rounded-lg font-bold text-xs text-center transition-all ${activeJobTab === 'available' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  ขอรับงาน ({availableJobs.length})
                </button>
                <button
                  onClick={() => setActiveJobTab('active')}
                  className={`flex-1 py-2 rounded-lg font-bold text-xs text-center transition-all ${activeJobTab === 'active' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  กำลังช่วย ({activeJob ? 1 : 0})
                </button>
              </div>

              {/* Available Job Lists */}
              {activeJobTab === 'available' ? (
                <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[460px] pr-1">
                  {!isVolunteerReady ? (
                    <div className="text-center py-10 bg-white rounded-2xl p-6 border border-slate-200">
                      <ShieldAlert size={40} className="text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-500">กรุณาเปิดสวิตช์ "พร้อมปฏิบัติงาน" ด้านหน้าแรก เพื่อแสดงสัญญานขอความช่วยเหลือจากผู้สูงอายุใกล้เคียงค่ะ</p>
                    </div>
                  ) : availableJobs.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <Clock size={36} className="mx-auto mb-2 text-slate-300" />
                      <p className="text-xs">ขณะนี้ไม่มีเคสขอความช่วยเหลือค้างอยู่ในพื้นที่ค่ะ</p>
                    </div>
                  ) : (
                    availableJobs.map((job) => (
                      <div 
                        key={job.id}
                        className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer"
                        onClick={() => {
                          setSelectedJobId(job.id);
                          setCurrentScreen('JOB_DETAILS');
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={job.elderlyPhoto} 
                            alt={job.elderlyName} 
                            className="w-11 h-11 rounded-full object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-bold">
                              {job.categoryLabel}
                            </span>
                            <h4 className="font-bold text-slate-800 mt-1">{job.elderlyName}</h4>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock size={10} /> {job.time} น. • อายุ {job.elderlyAge} ปี
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptJob(job);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-full shadow-md transition-all active:scale-95"
                        >
                          รับงาน
                        </button>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                // Active Job Lists
                <div className="flex flex-col gap-3 flex-1">
                  {!activeJob ? (
                    <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-200">
                      <HelpCircle size={36} className="mx-auto mb-2 text-slate-300" />
                      <p className="text-xs">ไม่มีเคสที่กำลังดูแลอยู่ในขณะนี้ค่ะ สามารถรับงานใหม่จากแท็บ "ขอรับงาน" ได้เลยค่ะ</p>
                    </div>
                  ) : (
                    <div 
                      className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs flex items-center justify-between cursor-pointer"
                      onClick={() => {
                        setSelectedJobId(activeJob.id);
                        setCurrentScreen('JOB_DETAILS');
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <img src={activeJob.elderlyPhoto} alt="active" className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400" referrerPolicy="no-referrer" />
                        <div>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">กำลังช่วยรักษาคุยแชท</span>
                          <h4 className="font-bold text-slate-800 mt-1">{activeJob.elderlyName}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium truncate w-40">{activeJob.symptom}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-400" />
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* SCREEN: JOB DETAILS (แสดงรายละเอียดงาน - เหมือนรูปที่ 4 บานขวา) */}
          {currentScreen === 'JOB_DETAILS' && selectedJobId && (
            <motion.div 
              key="job_details"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4 flex-1 text-sm"
            >
              {/* Header with Back */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCurrentScreen('JOBS_LIST')}
                  className="bg-slate-200 text-slate-800 p-2 rounded-full hover:bg-slate-300 transition-all"
                >
                  <ArrowLeft size={16} />
                </button>
                <h1 className="text-lg font-bold text-slate-900">รายละเอียดงานที่รับ</h1>
              </div>

              {(() => {
                // Find job (could be in active request or mock jobs)
                const job = (currentRequest && currentRequest.id === selectedJobId) 
                  ? currentRequest 
                  : mockAvailableJobs.find(j => j.id === selectedJobId);
                  
                if (!job) return <p className="text-center py-10 text-slate-400">ไม่พบรายละเอียดเคสนี้</p>;

                const isJobAccepted = job.status === 'ACCEPTED';

                return (
                  <div className="flex flex-col gap-3.5 flex-1 h-full">
                    
                    {/* Patient profile block (เหมือนรูป 4 ขวาสุด) */}
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl flex gap-4 shadow-xs items-center">
                      <img src={job.elderlyPhoto} alt={job.elderlyName} className="w-16 h-16 rounded-full border border-slate-300 object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <h2 className="text-base font-bold text-slate-800">{job.elderlyName}</h2>
                        <p className="text-xs text-slate-500 font-semibold">อายุ {job.elderlyAge} ปี</p>
                        <p className="text-[11px] text-gray-400 mt-1">เวลาลงทะเบียนความช่วยเหลือ: {job.time}</p>
                      </div>
                    </div>

                    {/* Symptom Info Box (รูป 4 ขวาสุด) */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-2">
                      <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                        <ShieldAlert size={14} className="text-indigo-500" /> รายละเอียดอาการ :
                      </span>
                      <p className="text-slate-700 font-semibold leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                        "{job.symptom}"
                      </p>
                    </div>

                    {/* Recommended Agency Box */}
                    {job.recommendedAgency && (
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-2">
                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">หน่วยงานที่แนะนำหรือเกี่ยวข้อง :</span>
                        <div className="flex items-start gap-2 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/40">
                          <Hospital size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-slate-800">{job.recommendedAgency}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">โทรประสาน: {job.phone || '01-2345-678'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Note Box */}
                    {job.note && (
                      <div className="bg-indigo-50/50 border border-indigo-100/50 p-3 rounded-xl text-xs">
                        <span className="font-bold text-indigo-800 block mb-0.5">หมายเหตุ :</span>
                        <p className="text-slate-600 font-medium">{job.note}</p>
                      </div>
                    )}

                    {/* Actions bar (เหมือนรูป 4 ขวาสุด) */}
                    <div className="mt-auto flex flex-col gap-2.5">
                      {isJobAccepted ? (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <a
                              href={`tel:${job.phone || '0812345678'}`}
                              className="bg-[#48BB78] hover:bg-[#38A169] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 text-center"
                            >
                              <Phone size={18} />
                              <span>โทรหา</span>
                            </a>
                            <button
                              onClick={() => {
                                setAppState(prev => ({ ...prev, matchStatus: 'CONNECTED' }));
                                setAppState(prev => ({ ...prev, isVideoActive: false }));
                                setAppState(prev => {
                                  // Inject some starter conversation
                                  return {
                                    ...prev,
                                    chatMessages: [
                                      { id: '1', sender: 'volunteer', text: 'สวัสดีค่ะคุณยาย มีอะไรให้หนูช่วยเพิ่มเติมไหมคะ คุยกันในนี้ได้เลยค่ะ', time: '10:35' },
                                      { id: '2', sender: 'elderly', text: 'ปวดตัว เวียนหัวค่ะ 2 วันแล้วค่ะ ยายเดินทางไป รพ. ลำบาก', time: '10:36' },
                                      { id: '3', sender: 'volunteer', text: 'แนะนำให้พบแพทย์นะคะ เดี๋ยวอาสาช่วยนัดหมายที่ รพ.สต. ให้ แล้วจะเดินทางไปรับที่บ้านนะคะ', time: '10:37' }
                                    ]
                                  };
                                });
                              }}
                              className="bg-[#2B6CB0] hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md active:scale-95"
                            >
                              <MessageCircle size={18} />
                              <span>เริ่มแชท</span>
                            </button>
                          </div>

                          <button
                            onClick={() => handleCompleteJob(job)}
                            className="w-full bg-[#3182CE] hover:bg-blue-600 text-white py-3 rounded-xl font-bold shadow-sm"
                          >
                            งานเสร็จสิ้น / ส่งตัวเรียบร้อย
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleAcceptJob(job)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black text-base shadow-lg transition-transform active:scale-95"
                        >
                          กดปุ่ม "รับงานดูแลคุณยาย"
                        </button>
                      )}
                    </div>

                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* SCREEN: VOLUNTEER KNOWLEDGE BASE (ความรู้สำหรับอาสา) */}
          {currentScreen === 'KNOWLEDGE_BASE' && (
            <motion.div 
              key="volunteer_knowledge"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-4 flex-1 text-xs"
            >
              <div className="flex items-center gap-3">
                <button onClick={() => setCurrentScreen('HOME')} className="bg-slate-200 p-2 rounded-full text-slate-800"><ArrowLeft size={16} /></button>
                <h1 className="text-base font-bold">คลังความรู้สำหรับอาสาสมัคร</h1>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px]">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-sm">1. ทักษะการปฐมพยาบาลเบื้องต้นผู้สูงอายุเมื่อเวียนศีรษะ</h4>
                  <p className="text-slate-500 mt-1 leading-relaxed">เมื่อคุณยายเวียนศีรษะ ให้รีบพานั่งพักในที่อากาศถ่ายเทสะดวก ใช้พัดกระดาษหรือผ้าชุบน้ำเช็ดหน้าผาก และหลีกเลี่ยงการเคลื่อนไหวฉับพลัน</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-sm">2. การดูแลพลิกตัวผู้ป่วยติดเตียงป้องกันแผลกดทับ</h4>
                  <p className="text-slate-500 mt-1 leading-relaxed">ควรทำการจัดท่าพลิกตัวคุณตาคุณยายที่ติดเตียงทุกๆ 2 ชั่วโมง สลับซ้าย-ขวา นอนหงาย และใช้น้ำมันหรือโลชั่นบำรุงผิวส่วนที่สัมผัสเตียง</p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-800 text-sm">3. สิทธิ์บัตรทองครอบคลุมการรักษาใดบ้าง</h4>
                  <p className="text-slate-500 mt-1 leading-relaxed">ครอบคลุมค่ายาในบัญชียาหลัก, ค่าห้องฟรีกรณีคนไข้สามัญทั่วไป, การถอนฟันอุดฟัน, วัคซีนไข้หวัดใหญ่ประจำปี, และบริการตรวจสุขภาพเยี่ยมบ้านประจำสัปดาห์</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SCREEN: VOLUNTEER HELP HISTORY (ประวัติช่วยเหลือ) */}
          {currentScreen === 'HISTORY_LIST' && (
            <motion.div 
              key="volunteer_history"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-4 flex-1 text-xs"
            >
              <div className="flex items-center gap-3">
                <button onClick={() => setCurrentScreen('HOME')} className="bg-slate-200 p-2 rounded-full text-slate-800"><ArrowLeft size={16} /></button>
                <h1 className="text-base font-bold">ประวัติการปฏิบัติงานช่วยเหลือ</h1>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto max-h-[500px]">
                {historyRequests.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <Award size={36} className="mx-auto mb-1 text-slate-300" />
                    <p>ยังไม่มีประวัติงานช่วยเหลือที่เสร็จสมบูรณ์ค่ะ</p>
                  </div>
                ) : (
                  historyRequests.map((h, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-emerald-100 flex items-center justify-between shadow-xs">
                      <div className="flex items-center gap-2">
                        <img src={h.elderlyPhoto} alt="his" className="w-9 h-9 rounded-full object-cover" referrerPolicy="no-referrer" />
                        <div>
                          <p className="font-bold text-slate-800">{h.elderlyName}</p>
                          <p className="text-[10px] text-slate-400">{h.time} • {h.categoryLabel}</p>
                        </div>
                      </div>
                      <span className="bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-0.5">
                        <Check size={10} /> เสร็จสิ้น
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* SCREEN: VOLUNTEER CONTACT TEAM (ติดต่อทีมงาน) */}
          {currentScreen === 'CONTACT_TEAM' && (
            <motion.div 
              key="volunteer_contact"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-4 flex-1 text-xs"
            >
              <div className="flex items-center gap-3">
                <button onClick={() => setCurrentScreen('HOME')} className="bg-slate-200 p-2 rounded-full text-slate-800"><ArrowLeft size={16} /></button>
                <h1 className="text-base font-bold">ช่องทางติดต่อทีมงานแอดมิน</h1>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 leading-relaxed text-slate-600 flex flex-col gap-3">
                <p className="font-bold text-slate-800 text-sm">ศูนย์ประสานงาน อสม. เครือข่ายสุขใจ :</p>
                <p>📍 ที่ตั้ง: สำนักงานเทศบาลสุขสงบ ชั้น 2</p>
                <p>📞 โทรตรงแอดมินเครือข่าย: 02-999-8888</p>
                <p>💬 ไลน์ไอดีผู้ประสาน: @sukjai_volunteer</p>
                
                <hr className="border-slate-100 my-1" />
                
                <h4 className="font-bold text-slate-800">ส่งข้อความแจ้งปัญหาเกี่ยวกับระบบแอปพลิเคชัน :</h4>
                <textarea 
                  placeholder="พิมพ์รายละเอียดปัญหาที่พบ เช่น แอปสแกนลายนิ้วมือไม่ผ่าน..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-indigo-400"
                  rows={4}
                />
                <button 
                  onClick={() => {
                    alert('ส่งข้อความแจ้งปัญหาถึงแอดมินดูแลระบบเรียบร้อยแล้วค่ะ ขอบคุณสำหรับคำติชมค่ะ');
                    setCurrentScreen('HOME');
                  }}
                  className="bg-[#1A365D] hover:bg-indigo-900 text-white font-bold py-2 rounded-lg"
                >
                  ส่งข้อความรายงาน
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* BOTTOM NAVIGATION BAR (เหมือนรูปที่ 4 บานแรก) */}
      <div className="bg-white border-t border-slate-200 px-4 py-2.5 flex justify-around items-center shrink-0">
        <button 
          onClick={() => {
            setAppState(prev => ({ ...prev, activeTabVolunteer: 'home' }));
            setCurrentScreen('HOME');
          }}
          className={`flex flex-col items-center justify-center cursor-pointer transition-all ${activeTabVolunteer === 'home' && currentScreen === 'HOME' ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-indigo-600'}`}
        >
          <User size={20} />
          <span className="text-[10px] font-bold mt-1">หน้าหลัก</span>
        </button>

        <button 
          onClick={() => {
            setAppState(prev => ({ ...prev, activeTabVolunteer: 'jobs' }));
            setCurrentScreen('JOBS_LIST');
          }}
          className={`flex flex-col items-center justify-center cursor-pointer transition-all ${activeTabVolunteer === 'jobs' || currentScreen === 'JOBS_LIST' ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-indigo-600'}`}
        >
          <div className="relative">
            <FileText size={20} />
            {availableJobs.length > 0 && isVolunteerReady && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                {availableJobs.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-1">งานจอง</span>
        </button>

        <button 
          onClick={() => {
            alert('ไม่มีรายการแจ้งเตือนใหม่ในวันนี้ค่ะ');
          }}
          className="flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-indigo-600"
        >
          <div className="relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
          </div>
          <span className="text-[10px] font-bold mt-1">แจ้งเตือน</span>
        </button>

        <button 
          onClick={() => {
            alert('คุณสมหญิง ใจดี (อสม. ประจำตำบลบ้านบอน หมู่ 3)\nรหัสบัตรประชาชน: x-xxxx-xxxxx-xx-x\nเบอร์ติดต่อ: 081-234-5678\nคะแนนความดีสะสม: 450 แต้ม');
          }}
          className="flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-indigo-600"
        >
          <User size={20} className="text-indigo-500" />
          <span className="text-[10px] font-bold mt-1">โปรไฟล์</span>
        </button>
      </div>

    </div>
  );
}
