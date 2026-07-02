import React, { useState, useEffect } from 'react';
import { 
  Heart, Shield, AlertTriangle, ArrowLeft, ChevronRight, Phone, 
  MapPin, Send, MessageCircle, Video, Play, CheckCircle, 
  Settings, Bell, Home, Clock, PhoneCall, HelpCircle, HeartPulse, Hospital, AlertCircle,
  User, X, BookOpen, HeartHandshake, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState, HelpRequest, ChatMessage } from '../types';

interface ElderlyAppProps {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function ElderlyApp({ appState, setAppState }: ElderlyAppProps) {
  const { 
    matchStatus, currentRequest, chatMessages, isVideoActive, 
    activeTabElderly, elderlyName, elderlyAge, elderlyPhoto 
  } = appState;

  // Navigation and sub-screen state
  const [currentScreen, setCurrentScreen] = useState<'HOME' | 'WELFARE_CATS' | 'TREATMENT_RIGHTS' | 'CHATBOT' | 'RECOMMENDED_AGENCIES' | 'REQUEST_VOLUNTEER' | 'HEALTH_CONSULT' | 'SOS_ACTIVE' | 'SOS_CHOOSE'>('HOME');
  const [selectedSymptom, setSelectedSymptom] = useState<string>('');
  
  // States for requested menu flows
  const [healthSubMenu, setHealthSubMenu] = useState<'YAA' | 'KNOWLEDGE' | 'SICK' | 'OTHER' | null>(null);
  const [selectedKnowledgeArticle, setSelectedKnowledgeArticle] = useState<any | null>(null);
  const [selectedYaaQuery, setSelectedYaaQuery] = useState<string>('');
  const [yaaInputText, setYaaInputText] = useState<string>('');
  const [sickSymptom, setSickSymptom] = useState<string>('');
  const [otherHealthQuery, setOtherHealthQuery] = useState<string>('');

  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);
  const [showLocationMap, setShowLocationMap] = useState<boolean>(false);

  const [selectedHospital, setSelectedHospital] = useState<string>('โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านบอน (ใกล้คุณที่สุด 800ม.)');
  const [inputText, setInputText] = useState<string>('');
  const [customVolunteerProblem, setCustomVolunteerProblem] = useState<string>('');

  // Nearby volunteers (for simulation)
  const nearbyVolunteers = [
    { name: 'อาสา สมใจ แข็งขัน', distance: '350 เมตร', rating: 4.9, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120' },
    { name: 'อาสา นพดล ยิ้มแย้ม', distance: '800 เมตร', rating: 4.8, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120' },
    { name: 'อาสา วันชัย ใจเด็ด', distance: '1.2 กิโลเมตร', rating: 4.7, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120' }
  ];

  // Auto matching countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (matchStatus === 'CONNECTING') {
      timer = setTimeout(() => {
        // Automatically accept request if it hasn't been accepted yet
        const acceptRequest = () => {
          setAppState(prev => {
            if (prev.matchStatus !== 'CONNECTING') return prev;
            
            // Create a custom default volunteer info
            const updatedRequest = prev.currentRequest ? {
              ...prev.currentRequest,
              status: 'ACCEPTED' as const,
            } : null;

            const welcomeMessage: ChatMessage = {
              id: Date.now().toString(),
              sender: 'volunteer',
              text: 'สวัสดีค่ะคุณยายสมหญิง อาสาสมัครสมใจรับเรื่องและพร้อมช่วยเหลือแล้วนะคะ กำลังเตรียมตัวประสานงานและคุยกับคุณยายค่ะ มีอาการอย่างไรบ้างคะ?',
              time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
            };

            return {
              ...prev,
              matchStatus: 'CONNECTED',
              currentRequest: updatedRequest,
              chatMessages: [...prev.chatMessages, welcomeMessage]
            };
          });
        };
        acceptRequest();
      }, 5000); // 5 seconds auto-matching for instant feedback
    }
    return () => clearTimeout(timer);
  }, [matchStatus, setAppState]);

  // Handle Bottom Tab Clicks
  const handleTabClick = (tab: string) => {
    setAppState(prev => ({ ...prev, activeTabElderly: tab }));
    if (tab === 'home') {
      setCurrentScreen('HOME');
      setHealthSubMenu(null);
    }
  };

  // Chat message sending
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'elderly',
      text: inputText,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
    };
    
    setAppState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, newMsg]
    }));
    setInputText('');

    // Trigger auto-responses for demo if in chatbot screen
    if (currentScreen === 'CHATBOT') {
      setTimeout(() => {
        let replyText = 'ระบบกำลังประมวลผลคำถามของคุณยายนะคะ หากต้องการข้อมูลเร่งด่วนสามารถคลิกถัดไปเพื่อดูหน่วยงานแนะนำ หรือติดต่ออาสาสมัครได้เลยค่ะ';
        if (inputText.includes('สิทธิ') || inputText.includes('บัตรทอง')) {
          replyText = 'สิทธิรักษาพยาบาล (บัตรทอง) สามารถใช้ตรวจรักษาโรคทั่วไป ทำฟัน และฉีดวัคซีนได้ฟรีค่ะ คุณยายนำบัตรประชาชนไปติดต่อที่ รพ.สต. หรือโรงพยาบาลตามสิทธิได้เลยค่ะ';
        } else if (inputText.includes('เงิน') || inputText.includes('เบี้ยยังชีพ')) {
          replyText = 'เบี้ยยังชีพผู้สูงอายุจะโอนเข้าบัญชีทุกวันที่ 10 ของเดือนค่ะ โดยอายุ 60-69 ปี ได้รับ 600 บาท, 70-79 ปี ได้รับ 700 บาท, 80-89 ปี ได้รับ 800 บาท และ 90 ปีขึ้นไป ได้รับ 1,000 บาทค่ะ';
        }
        
        setAppState(prev => ({
          ...prev,
          chatMessages: [
            ...prev.chatMessages, 
            {
              id: (Date.now() + 1).toString(),
              sender: 'volunteer', // Represent system bot
              text: replyText,
              time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
            }
          ]
        }));
      }, 1500);
    }
  };

  // Launch Request Volunteer flow
  const handleRequestVolunteer = (category: 'health' | 'rights' | 'bedridden' | 'emergency', symptomText: string, noteText: string = '') => {
    const newRequest: HelpRequest = {
      id: Date.now().toString(),
      elderlyName,
      elderlyAge,
      elderlyPhoto,
      symptom: symptomText,
      category,
      categoryLabel: 
        category === 'health' ? 'ปรึกษาสุขภาพ / นำส่งโรงพยาบาล' : 
        category === 'rights' ? 'สอบถามสิทธิและสวัสดิการรัฐ' : 
        category === 'bedridden' ? 'การดูแลผู้ป่วยติดเตียง' : 'กรณีฉุกเฉิน SOS',
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
      recommendedAgency: category === 'health' ? selectedHospital : 'โรงพยาบาลส่งเสริมสุขภาพตำบล (รพ.สต.)',
      note: noteText,
      status: 'PENDING'
    };

    setAppState(prev => ({
      ...prev,
      matchStatus: 'CONNECTING',
      currentRequest: newRequest,
      chatMessages: [
        {
          id: '1',
          sender: 'system',
          text: `เริ่มขอความช่วยเหลือในระบบ: [${newRequest.categoryLabel}] อาสาสมัครกำลังเชื่อมต่อ`,
          time: newRequest.time
        }
      ]
    }));
    setCurrentScreen('REQUEST_VOLUNTEER');
  };

  // Trigger SOS Instant Emergency
  const handleSOS = () => {
    setCurrentScreen('SOS_CHOOSE');
  };

  // Cancel Volunteer Connection
  const handleCancelConnection = () => {
    setAppState(prev => ({
      ...prev,
      matchStatus: 'IDLE',
      currentRequest: null,
      chatMessages: []
    }));
    setCurrentScreen('HOME');
  };

  // Handle hospital select
  const hospitals = [
    'โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านบอน (ใกล้คุณที่สุด 800ม.)',
    'โรงพยาบาลส่งเสริมสุขภาพตำบลหนองหญ้า (2.1 กม.)',
    'โรงพยาบาลประจำอำเภอศรีสว่าง (4.5 กม.)',
    'คลินิกชุมชนอบอุ่นหนองปรือ (1.5 กม.)'
  ];

  // Static articles for "ความรู้สุขภาพ"
  const healthArticles = [
    { title: '💊 วิธีทานยาความดันอย่างถูกต้องปลอดภัย', content: 'ควรรับประทานยาอย่างสม่ำเสมอในเวลาเดียวกันของทุกๆ วันตามที่แพทย์สั่ง ไม่ควรหยุดยาหรือปรับขนาดยาเองแม้จะรู้สึกดีขึ้นแล้ว เพราะจะทำให้ความดันโลหิตสูงขึ้นเฉียบพลันได้ หลีกเลี่ยงอาหารเค็มจัด ผงชูรส และออกกำลังกายเบาๆ' },
    { title: '🏃 เทคนิคป้องกันการลื่นล้มในห้องน้ำ', content: 'ห้องน้ำเป็นจุดเกิดอุบัติเหตุอันดับ 1 ของผู้สูงอายุ ควรติดตั้งราวจับกันลื่นในจุดสำคัญ ใช้น้ำยากันลื่นทาเคลือบกระเบื้องห้องน้ำ วางแผ่นกันลื่นซิลิโคน และจัดไฟแสงสว่างให้มองเห็นได้ชัดเจนแจ่มแจ้ง' },
    { title: '🥑 อาหาร 5 หมู่ที่ช่วยบำรุงสายตาและสมอง', content: 'เน้นทานปลาทะเลน้ำลึกที่มีโอเมก้า 3 ผักใบเขียวเข้ม เช่น ผักบุ้ง คะน้า เพื่อบำรุงเซลล์ประสาทตา ทานผลไม้ตระกูลเบอร์รี่ และดื่มน้ำสะอาดให้ครบวันละ 8 แก้ว ช่วยให้สมองปลอดโปร่งขึ้นอย่างเห็นได้ชัด' },
    { title: '🛌 วิธีบริหารยืดเหยียดร่างกายบนที่นอนง่ายๆ', content: 'ทุกเช้าก่อนลุกขึ้นยืน ให้บริหารขยับข้อเท้าขึ้น-ลง 10 ครั้ง ชันเข่าขึ้นบิดสะโพกซ้าย-ขวาอย่างช้าๆ เพื่อยืดเส้นหลัง และกำมือ-แบมือบริหารนิ้วมือ ช่วยลดอาการมือชาและสมดุลการก้าวเดินให้ดีขึ้น' }
  ];

  return (
    <div className="w-full max-w-md mx-auto bg-[#FFFDF6] text-gray-800 flex flex-col h-[750px] shadow-2xl rounded-3xl overflow-hidden border-4 border-amber-300 relative font-sans">
      
      {/* Top Mobile Bar decoration */}
      <div className="bg-[#FFEBA2] px-6 py-2 flex justify-between items-center text-xs font-black text-amber-950 select-none">
        <span>🕒 {new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.</span>
        <div className="bg-amber-900/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold">สัญญาณวิทยุ อสม. ออนไลน์</div>
        <div className="flex gap-1 items-center">
          <span className="text-emerald-800 font-bold">5G 📶</span>
        </div>
      </div>

      {/* Main Container with Screen Transitions */}
      <div className="flex-1 overflow-y-auto flex flex-col p-4 relative">
        <AnimatePresence mode="wait">
          
          {/* SCREEN: HOME */}
          {currentScreen === 'HOME' && activeTabElderly === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4 flex-1"
            >
              {/* Header profile with Hello Message */}
              <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl shadow-md border border-amber-200">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={elderlyPhoto} 
                      alt={elderlyName}
                      className="w-14 h-14 rounded-full border-2 border-amber-400 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-0 right-0 w-4.5 h-4.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">✓</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-slate-900 flex items-center gap-1">
                      👋 สวัสดี, {elderlyName.split(' ')[0]}
                    </h1>
                    <p className="text-xs text-emerald-600 font-bold">ผู้สูงอายุกลุ่มเป้าหมาย รพ.สต.</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert('ไม่มีการแจ้งเตือนใหม่ในขณะนี้ อุ่นใจได้เลยค่ะ')}
                  className="relative bg-amber-100 p-3 rounded-full text-amber-800 hover:bg-amber-200 transition-colors"
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
              </div>

              {/* Primary Button (🆘 มีปัญหาให้เราช่วยนะคะ - ขออาสาสมัครช่วย) */}
              <div className="bg-[#2B6CB0] text-white p-5 rounded-3xl shadow-lg relative overflow-hidden border-2 border-sky-400/30">
                {/* Visual decoration background waves */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
                
                <div className="relative z-10 flex flex-col items-start">
                  <span className="bg-rose-500 text-white text-xs font-black px-3.5 py-1 rounded-full mb-2 flex items-center gap-1.5 shadow-sm animate-pulse">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    🆘 มีปัญหาให้เราช่วยนะคะ
                  </span>
                  
                  <h3 className="text-lg font-black leading-tight mb-3">
                    ต้องการผู้ช่วยเหลือพาเดินทาง ปรึกษาสุขภาพ หรือช่วยเหลือเร่งด่วน?
                  </h3>

                  <button 
                    onClick={() => {
                      setCurrentScreen('REQUEST_VOLUNTEER');
                    }}
                    className="w-full bg-[#E53E3E] hover:bg-red-600 active:scale-95 text-white font-black py-4 px-6 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-lg border-2 border-white/10"
                  >
                    <span>👵 ❤️</span>
                    <span>ขออาสาสมัครช่วย</span>
                  </button>
                </div>
              </div>

              {/* Grid 2 Main Required Buttons: ปุ่มสุขภาพ & ปุ่มเหตุฉุกเฉิน */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* 🩺 ปุ่มสุขภาพ */}
                <button 
                  onClick={() => {
                    setCurrentScreen('HEALTH_CONSULT');
                    setHealthSubMenu(null);
                    setSelectedKnowledgeArticle(null);
                  }}
                  className="bg-emerald-50 hover:bg-emerald-100/80 border-4 border-emerald-400 rounded-3xl p-5 flex flex-col items-center justify-center text-center shadow-lg cursor-pointer transition-all active:scale-95 group relative overflow-hidden"
                >
                  {/* Decorative corner tag */}
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-xl">MENU</div>
                  
                  <div className="bg-emerald-500 text-white p-3.5 rounded-2xl mb-3 group-hover:scale-105 transition-transform shadow-md">
                    <HeartPulse size={34} />
                  </div>
                  <span className="text-lg font-black text-emerald-950">🩺 ปุ่ม “สุขภาพ”</span>
                  <span className="text-[11px] text-emerald-700 font-bold mt-1.5 bg-emerald-100/50 px-2.5 py-0.5 rounded-full">
                    ปรึกษายา & อาการ
                  </span>
                </button>

                {/* 🚨 ปุ่มเหตุฉุกเฉิน */}
                <button 
                  onClick={handleSOS}
                  className="bg-rose-50 hover:bg-rose-100/80 border-4 border-rose-500 rounded-3xl p-5 flex flex-col items-center justify-center text-center shadow-lg cursor-pointer transition-all active:scale-95 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-xl">ALARM</div>
                  
                  <div className="bg-rose-500 text-white p-3.5 rounded-2xl mb-3 animate-bounce shadow-md">
                    <AlertTriangle size={34} />
                  </div>
                  <span className="text-lg font-black text-rose-950">🚨 ปุ่ม “เหตุฉุกเฉิน”</span>
                  <span className="text-[11px] text-rose-700 font-bold mt-1.5 bg-rose-100/50 px-2.5 py-0.5 rounded-full">
                    ด่วนที่สุด 1669 / อสม.
                  </span>
                </button>

              </div>

              {/* Secondary Feature Button: สิทธิสวัสดิการ */}
              <button
                onClick={() => setCurrentScreen('WELFARE_CATS')}
                className="w-full bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 rounded-2xl p-4 flex items-center justify-between shadow-sm text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-amber-400 text-slate-900 p-2 rounded-xl">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-amber-950">สิทธิรักษาพยาบาล & สวัสดิการผู้สูงอายุ</h4>
                    <p className="text-[11px] text-amber-800 font-medium">สิทธิบัตรทอง, เบี้ยยังชีพ, ค้นหา รพ.สต.</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-amber-600" />
              </button>

              {/* Nearest Volunteer display summary */}
              <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-sm mt-1">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-black text-amber-900 flex items-center gap-1">
                    <HeartHandshake size={13} className="text-rose-500" />
                    อสม. อาสาสมัครที่พร้อมช่วยเหลือคุณยาย :
                  </span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">ออนไลน์ 3 คน</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {nearbyVolunteers.map((vol, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 bg-amber-50/40 p-2 rounded-xl border border-amber-100">
                      <img src={vol.image} alt={vol.name} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-xs" referrerPolicy="no-referrer" />
                      <p className="text-[10px] font-black text-gray-700 truncate w-full text-center">{vol.name.split(' ')[1]}</p>
                      <p className="text-[9px] text-amber-800 font-medium">{vol.distance}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================================= */}
          {/* SCREEN: SOS CHOICE MODAL/SCREEN (เหตุฉุกเฉิน) */}
          {/* ======================================= */}
          {currentScreen === 'SOS_CHOOSE' && (
            <motion.div 
              key="sos_choose"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4 flex-1 text-sm text-gray-800"
            >
              {/* Header */}
              <div className="flex items-center gap-3 pb-2 border-b border-rose-100">
                <button 
                  onClick={() => setCurrentScreen('HOME')}
                  className="bg-rose-100 text-rose-800 p-2.5 rounded-full hover:bg-rose-200 transition-all cursor-pointer"
                >
                  <ArrowLeft size={18} />
                </button>
                <h1 className="text-xl font-black text-rose-700">🚨 ตัวเลือกขอความช่วยเหลือฉุกเฉิน</h1>
              </div>

              {emergencyAlert && (
                <div className="bg-yellow-50 border-2 border-yellow-300 p-3.5 rounded-2xl text-xs text-yellow-900 font-bold flex items-center gap-2">
                  <AlertCircle size={18} className="text-yellow-600 shrink-0" />
                  <span>{emergencyAlert}</span>
                </div>
              )}

              {/* Map simulation overlay */}
              {showLocationMap && (
                <div className="bg-emerald-50 border-2 border-emerald-400 p-4 rounded-2xl shadow-inner relative overflow-hidden">
                  <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">GPS ติดตามตำแหน่ง</div>
                  <h4 className="text-xs font-black text-emerald-950 mb-1 flex items-center gap-1">
                    📍 ส่งพิกัดความปลอดภัยให้หน่วยกู้ภัยเรียบร้อยแล้ว
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    พิกัดปัจจุบัน: 16.4322° N, 102.8236° E (บ้านเลขที่ 124 ต.บ้านบอน จ.ขอนแก่น)
                  </p>
                  
                  {/* Mock map elements */}
                  <div className="h-20 bg-emerald-100/80 rounded-xl mt-2 border border-emerald-200 flex items-center justify-center text-[10px] text-emerald-800 font-bold relative">
                    <div className="w-3 h-3 bg-rose-500 rounded-full absolute top-1/2 left-1/3 animate-ping"></div>
                    <div className="w-2.5 h-2.5 bg-rose-600 rounded-full absolute top-1/2 left-1/3 border border-white"></div>
                    <span>🗺️ แผนที่จำลอง: มีรถ อสม. ห่างออกไป 350 ม.</span>
                  </div>
                </div>
              )}

              <p className="text-xs font-bold text-gray-500 text-center">กรุณากดเลือกบริการฉุกเฉินที่คุณต้องการค่ะ :</p>

              <div className="flex flex-col gap-3">
                
                {/* 1. 🚑 โทร 1669 */}
                <button
                  onClick={() => {
                    setEmergencyAlert('📞 ระบบได้จำลองส่งเบอร์โทรออกและต่อสายตรงถึง หน่วยกู้ชีพวิกฤต 1669 ของจังหวัดขอนแก่น แล้วค่ะ!');
                    setShowLocationMap(false);
                    // Standard action simulation
                    alert('🚨 กำลังจำลองโทรศัพท์ติดต่อไปยังสายด่วนกู้ชีพ 1669...');
                  }}
                  className="flex items-center gap-4 bg-white p-4 rounded-2xl border-2 border-rose-400 hover:bg-rose-50 text-left cursor-pointer transition-all active:scale-98 group shadow-sm"
                >
                  <div className="bg-rose-600 text-white p-3 rounded-xl group-hover:scale-105 transition-transform shadow-md shrink-0">
                    <Phone size={24} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-rose-900">🚑 โทร 1669</h4>
                    <p className="text-xs text-rose-700 font-bold">ติดต่อสายด่วนกู้ภัยอุบัติเหตุ/ผู้ป่วยเจ็บป่วยฉุกเฉินวิกฤตทันที</p>
                  </div>
                </button>

                {/* 2. ❤️ แจ้งอาสาสมัครใกล้ฉัน */}
                <button
                  onClick={() => {
                    setEmergencyAlert(null);
                    setShowLocationMap(false);
                    handleRequestVolunteer('emergency', '⚠️ เกิดเหตุฉุกเฉินด่วน ต้องการอาสาสมัคร อสม. เดินทางมาช่วยเหลือที่บ้านด่วนที่สุด!', 'อาการฉุกเฉินระบุทางโทรศัพท์');
                  }}
                  className="flex items-center gap-4 bg-white p-4 rounded-2xl border-2 border-amber-400 hover:bg-amber-50 text-left cursor-pointer transition-all active:scale-98 group shadow-sm"
                >
                  <div className="bg-amber-500 text-slate-950 p-3 rounded-xl group-hover:scale-105 transition-transform shadow-md shrink-0">
                    <Heart size={24} className="fill-slate-950 stroke-none" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-amber-900">❤️ แจ้งอาสาสมัครใกล้ฉัน</h4>
                    <p className="text-xs text-amber-800 font-bold">แจ้งเตือน อสม. ในพื้นที่ใกล้ตัวให้เข้ามาประเมินและช่วยด่วน</p>
                  </div>
                </button>

                {/* 3. 📍 ส่งตำแหน่งปัจจุบัน */}
                <button
                  onClick={() => {
                    setShowLocationMap(true);
                    setEmergencyAlert('📍 บันทึกและแชร์พิกัด GPS ของบ้านคุณยายส่งถึงอาสาสมัคร อสม. ทุกคนที่สแตนด์บายเรียบร้อย!');
                  }}
                  className="flex items-center gap-4 bg-white p-4 rounded-2xl border-2 border-emerald-400 hover:bg-emerald-50 text-left cursor-pointer transition-all active:scale-98 group shadow-sm"
                >
                  <div className="bg-emerald-500 text-white p-3 rounded-xl group-hover:scale-105 transition-transform shadow-md shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-emerald-950">📍 ส่งตำแหน่งปัจจุบัน</h4>
                    <p className="text-xs text-emerald-700 font-bold">ส่งพิกัดบ้านและจีพีเอสผ่านแผนที่ เพื่อสะดวกในการหาทางเข้าบ้าน</p>
                  </div>
                </button>

                {/* 4. 🔔 ส่งสัญญาณขอความช่วยเหลือทันที */}
                <button
                  onClick={() => {
                    setEmergencyAlert(null);
                    setShowLocationMap(false);
                    // Directly launch full screen SOS active
                    const sosRequest: HelpRequest = {
                      id: Date.now().toString(),
                      elderlyName,
                      elderlyAge,
                      elderlyPhoto,
                      symptom: '🔔 เปิดสัญญาณเสียงเตือนภัยไซเรนที่ตัวเครื่องและแจ้งรถฉุกเฉิน 1669',
                      category: 'emergency',
                      categoryLabel: 'กรณีฉุกเฉิน SOS',
                      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
                      recommendedAgency: 'หน่วยกู้ชีพวิกฤต 1669 / อสม. ท้องถิ่น',
                      note: 'สัญญาณไซเรนขอความช่วยเหลือแบบเร่งด่วน',
                      status: 'PENDING'
                    };

                    setAppState(prev => ({
                      ...prev,
                      matchStatus: 'CONNECTING',
                      currentRequest: sosRequest,
                      chatMessages: [
                        {
                          id: '1',
                          sender: 'system',
                          text: '🚨 สัญญาณไซเรนเตือนภัยดัง! กำลังแจ้งรถ 1669 และอาสา อสม. ใกล้เคียงทันที',
                          time: sosRequest.time
                        }
                      ]
                    }));
                    setCurrentScreen('SOS_ACTIVE');
                  }}
                  className="flex items-center gap-4 bg-rose-600 text-white p-4 rounded-2xl border-2 border-rose-300 hover:bg-rose-700 text-left cursor-pointer transition-all active:scale-98 group shadow-lg"
                >
                  <div className="bg-white text-rose-600 p-3 rounded-xl group-hover:scale-105 transition-transform shadow-md shrink-0">
                    <Bell size={24} className="animate-bounce" />
                  </div>
                  <div>
                    <h4 className="font-black text-base">🔔 ส่งสัญญาณขอความช่วยเหลือทันที</h4>
                    <p className="text-xs text-rose-100 font-bold">เปิดเสียงไซเรนเตือนเสียงดังในหมู่บ้านและส่งสัญญานเตือนศูนย์กู้ภัย</p>
                  </div>
                </button>

              </div>

              <button 
                onClick={() => setCurrentScreen('HOME')}
                className="w-full bg-slate-800 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-700 mt-2 text-center"
              >
                ย้อนกลับไปหน้าแรก
              </button>
            </motion.div>
          )}

          {/* ======================================= */}
          {/* SCREEN: CHOOSE HELP TYPE (เมื่อกด "ขออาสาสมัครช่วย" - รูป 3) */}
          {/* ======================================= */}
          {currentScreen === 'REQUEST_VOLUNTEER' && matchStatus === 'IDLE' && (
            <motion.div 
              key="req_vol_idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4 flex-1 text-sm text-gray-800"
            >
              {/* Header */}
              <div className="flex items-center gap-3 pb-2 border-b border-amber-200">
                <button 
                  onClick={() => setCurrentScreen('HOME')}
                  className="bg-amber-100 text-amber-800 p-2 rounded-full hover:bg-amber-200 transition-all cursor-pointer"
                >
                  <ArrowLeft size={16} />
                </button>
                <h1 className="text-lg font-black text-amber-950">🙋 เลือกประเภทที่ต้องการให้อาสาช่วย</h1>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 p-3.5 rounded-2xl text-xs text-blue-900 font-semibold leading-relaxed">
                ℹ️ **ระบบจะแจ้งอาสาสมัครที่พร้อมให้ความช่วยเหลือ** ในหมู่บ้านและ อสม. ท้องถิ่นทันทีที่คุณยายกดยืนยันส่งคำขอค่ะ
              </div>

              {/* THE 4 REQUIRED OPTIONS */}
              <div className="flex flex-col gap-2.5">
                
                {/* 1. 🏥 ขอให้ช่วยพาไปโรงพยาบาล */}
                <button
                  onClick={() => {
                    handleRequestVolunteer('health', '🏥 ขอให้ช่วยพาไปโรงพยาบาลตรวจเช็กสุขภาพ', `ต้องการเดินทางไปตรวจรักษาที่: ${selectedHospital}`);
                  }}
                  className="flex items-center justify-between bg-white hover:bg-amber-50 p-4 rounded-2xl border border-amber-200 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-sky-100 text-sky-600 p-2.5 rounded-xl">
                      <Hospital size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-gray-800">🏥 ขอให้ช่วยพาไปโรงพยาบาล</h4>
                      <p className="text-[11px] text-gray-500">พานั่งรถรับส่ง ไปรอตรวจยา รอรับ และส่งกลับอย่างปลอดภัย</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>

                {/* 2. 🚶 ต้องการผู้ช่วยเดินทาง */}
                <button
                  onClick={() => {
                    handleRequestVolunteer('health', '🚶 ต้องการผู้ช่วยเดินทางนอกสถานที่/ทำธุระ', 'ต้องการคนคอยประคองเดินไปตลาดและแวะธนาคารเพื่อรับเงินช่วยเหลือคนชรา');
                  }}
                  className="flex items-center justify-between bg-white hover:bg-amber-50 p-4 rounded-2xl border border-amber-200 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 text-amber-600 p-2.5 rounded-xl">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-gray-800">🚶 ต้องการผู้ช่วยเดินทาง</h4>
                      <p className="text-[11px] text-gray-500">ไปแวะทำธุระแถวบ้าน ซื้อของ ซื้อกับข้าว หรือเดินเล่นออกกำลังกาย</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>

                {/* 3. 💬 อยากพูดคุยหรือให้กำลังใจ */}
                <button
                  onClick={() => {
                    handleRequestVolunteer('rights', '💬 อยากพูดคุยหรือให้กำลังใจคลายเหงา', 'ต้องการอาสาสมัครช่วยพูดคุยปรึกษาชีวิตหรือสวัสดิการคลายความวิตกกังวล');
                  }}
                  className="flex items-center justify-between bg-white hover:bg-amber-50 p-4 rounded-2xl border border-amber-200 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-100 text-pink-600 p-2.5 rounded-xl">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-gray-800">💬 อยากพูดคุยหรือให้กำลังใจ</h4>
                      <p className="text-[11px] text-gray-500">คุยโทรศัพท์ คุยผ่านกล่องข้อความ หรือให้ อสม. แวะเยี่ยมบ้านแก้เหงา</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>

                {/* 4. ✍️ พิมพ์ปัญหาเพิ่มเติม */}
                <div className="bg-white p-4 rounded-2xl border border-amber-200 text-left shadow-xs">
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="bg-purple-100 text-purple-600 p-2.5 rounded-xl">
                      <Send size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-gray-800">✍️ พิมพ์ปัญหาเพิ่มเติม</h4>
                      <p className="text-[11px] text-gray-500">พิมพ์ระบุความต้องการเพื่อให้ระบบแจ้ง อสม. โดยเฉพาะ</p>
                    </div>
                  </div>
                  
                  <textarea
                    placeholder="พิมพ์ปัญหาของยายที่ต้องการให้ช่วยที่นี่เลยค่ะ..."
                    className="w-full bg-slate-50 border border-amber-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400 text-gray-800"
                    rows={2}
                    value={customVolunteerProblem}
                    onChange={(e) => setCustomVolunteerProblem(e.target.value)}
                  />

                  <button
                    onClick={() => {
                      if (!customVolunteerProblem.trim()) {
                        alert('กรุณาพิมพ์รายละเอียดปัญหาที่ต้องการให้ช่วยด้วยค่ะ');
                        return;
                      }
                      handleRequestVolunteer('rights', `✍️ ปัญหาระบุเพิ่มเติม: ${customVolunteerProblem}`, 'ความต้องการเร่งด่วนที่ระบุเป็นกรณีพิเศษ');
                      setCustomVolunteerProblem('');
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl mt-2 text-xs shadow-md transition-all active:scale-[0.97]"
                  >
                    ส่งข้อมูลแจ้งอาสาสมัคร อสม.
                  </button>
                </div>

              </div>

              <button 
                onClick={() => setCurrentScreen('HOME')}
                className="w-full border-2 border-gray-200 text-gray-500 py-3 rounded-2xl font-semibold text-xs hover:bg-gray-50 text-center"
              >
                ย้อนกลับหน้าหลัก
              </button>
            </motion.div>
          )}

          {/* ======================================= */}
          {/* SCREEN: CONNECTING (กำลังเชื่อมต่อ) */}
          {/* ======================================= */}
          {(currentScreen === 'REQUEST_VOLUNTEER' || currentScreen === 'SOS_ACTIVE') && matchStatus === 'CONNECTING' && (
            <motion.div 
              key="connecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center gap-6 flex-1 p-4"
            >
              <h1 className="text-xl font-black text-[#2B6CB0] animate-bounce">🚨 กำลังส่งคำขอหาอาสาสมัคร</h1>
              
              <div className="bg-amber-100 border-2 border-amber-300 p-4 rounded-2xl text-xs text-amber-950 font-bold max-w-xs leading-relaxed">
                📢 **ระบบจะแจ้งอาสาสมัครที่พร้อมให้ความช่วยเหลือ** ในพิกัดบ้านคุณยาย อสาสมัครกำลังรีบตรวจสอบและรับงานเพื่อดูแลค่ะ
              </div>

              {/* Connecting Circle Animation */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-amber-300 rounded-full animate-ping [animation-duration:1.5s]"></div>
                <div className="absolute inset-2 border-4 border-dotted border-rose-500 rounded-full animate-spin [animation-duration:6s]"></div>
                
                <div className="w-28 h-28 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden border border-amber-400 shadow-inner">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" 
                    alt="volunteer find" 
                    className="w-20 h-20 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Tip info box */}
              <div className="bg-white border-2 border-amber-200 p-3.5 rounded-2xl shadow-sm w-full max-w-xs text-xs text-left">
                <p className="font-black text-amber-900 flex items-center gap-1 mb-1.5">
                  <AlertCircle size={14} className="text-amber-500" /> รายละเอียดแจ้ง อสม. :
                </p>
                <p className="text-gray-700 font-bold truncate"><span className="text-gray-400 font-semibold">อาการ/ปัญหา:</span> {currentRequest?.symptom}</p>
                <p className="text-gray-700 font-bold truncate"><span className="text-gray-400 font-semibold">หมวดหมู่:</span> {currentRequest?.categoryLabel}</p>
              </div>

              <div className="bg-emerald-50 text-emerald-800 text-[11px] p-2.5 rounded-lg border border-emerald-200 w-full max-w-xs leading-relaxed font-bold">
                💡 **อาสาพร้อมช่วย:** คุณยายสามารถคลิกที่ปุ่ม "รับงาน" บนแอปฝั่งอาสาสมัคร (ขวา) เพื่อแชท/โทรวิดีโอทันที หรือระบบจะรับอัตโนมัติใน 5 วินาทีค่ะ
              </div>

              <button
                onClick={handleCancelConnection}
                className="w-full max-w-[200px] border-2 border-gray-300 text-gray-500 py-2.5 rounded-full font-bold hover:bg-gray-100 transition-all text-xs"
              >
                ยกเลิกส่งคำขออาสา
              </button>
            </motion.div>
          )}

          {/* ======================================= */}
          {/* SCREEN: HEALTH CONSULT 🩺 ปุ่มสุขภาพ */}
          {/* ======================================= */}
          {currentScreen === 'HEALTH_CONSULT' && (
            <motion.div 
              key="health_consult"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4 flex-1 text-sm text-gray-800"
            >
              {/* Header */}
              <div className="flex items-center gap-3 pb-2 border-b border-emerald-200">
                <button 
                  onClick={() => {
                    if (healthSubMenu !== null) {
                      setHealthSubMenu(null);
                      setSelectedKnowledgeArticle(null);
                    } else {
                      setCurrentScreen('HOME');
                    }
                  }}
                  className="bg-emerald-100 text-emerald-800 p-2.5 rounded-full hover:bg-emerald-200 transition-all cursor-pointer"
                >
                  <ArrowLeft size={16} />
                </button>
                <h1 className="text-lg font-black text-emerald-950">🩺 พอร์ทัลเมนูระบบสุขภาพ</h1>
              </div>

              {healthSubMenu === null ? (
                // Step 1: Show the requested 4 menus
                <div className="flex flex-col gap-3 py-2">
                  <p className="text-xs font-bold text-gray-500 text-center">คุณยายปรารถนาสอบถามข้อมูลเกี่ยวกับประเด็นใดคะ?</p>
                  
                  {/* Menu 1: 💊 สอบถามเรื่องยา */}
                  <button
                    onClick={() => {
                      setHealthSubMenu('YAA');
                      setSelectedYaaQuery('');
                    }}
                    className="flex items-center gap-3 bg-white p-4 rounded-2xl border-2 border-emerald-100 hover:border-emerald-400 shadow-sm text-left cursor-pointer transition-all active:scale-98 group"
                  >
                    <div className="bg-emerald-500 text-white p-3 rounded-xl group-hover:scale-105 transition-transform">
                      <span className="text-2xl">💊</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-sm text-gray-800">สอบถามเรื่องยา</h4>
                      <p className="text-[11px] text-gray-500">วิธีรับประทานยาสามัญ การจำหน่ายยา หรือสอบถามข้อมูลความเข้ากันของยา</p>
                    </div>
                    <ChevronRight size={16} className="text-emerald-500" />
                  </button>

                  {/* Menu 2: 📚 ความรู้สุขภาพสำหรับผู้สูงวัย */}
                  <button
                    onClick={() => {
                      setHealthSubMenu('KNOWLEDGE');
                      setSelectedKnowledgeArticle(null);
                    }}
                    className="flex items-center gap-3 bg-white p-4 rounded-2xl border-2 border-emerald-100 hover:border-emerald-400 shadow-sm text-left cursor-pointer transition-all active:scale-98 group"
                  >
                    <div className="bg-amber-400 text-slate-900 p-3 rounded-xl group-hover:scale-105 transition-transform">
                      <span className="text-2xl">📚</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-sm text-gray-800">ความรู้สุขภาพสำหรับผู้สูงวัย</h4>
                      <p className="text-[11px] text-gray-500">บทความสั้นและรูปภาพ อ่านง่าย เข้าใจเร็ว วิธีป้องกันการบาดเจ็บในคนชรา</p>
                    </div>
                    <ChevronRight size={16} className="text-emerald-500" />
                  </button>

                  {/* Menu 3: 🤒 ไม่สบาย อยากปรึกษา */}
                  <button
                    onClick={() => {
                      setHealthSubMenu('SICK');
                      setSickSymptom('');
                    }}
                    className="flex items-center gap-3 bg-white p-4 rounded-2xl border-2 border-emerald-100 hover:border-emerald-400 shadow-sm text-left cursor-pointer transition-all active:scale-98 group"
                  >
                    <div className="bg-rose-500 text-white p-3 rounded-xl group-hover:scale-105 transition-transform">
                      <span className="text-2xl">🤒</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-sm text-gray-800">ไม่สบาย อยากปรึกษา</h4>
                      <p className="text-[11px] text-gray-500">ตรวจสอบสัญญานเตือนเบื้องต้น ปรึกษาอาการเวียนหัว ตัวร้อน ปวดเมื่อย</p>
                    </div>
                    <ChevronRight size={16} className="text-emerald-500" />
                  </button>

                  {/* Menu 4: อื่นๆ */}
                  <button
                    onClick={() => {
                      setHealthSubMenu('OTHER');
                      setOtherHealthQuery('');
                    }}
                    className="flex items-center gap-3 bg-white p-4 rounded-2xl border-2 border-emerald-100 hover:border-emerald-400 shadow-sm text-left cursor-pointer transition-all active:scale-98 group"
                  >
                    <div className="bg-purple-100 text-purple-600 p-3 rounded-xl group-hover:scale-105 transition-transform">
                      <span className="text-2xl">❓</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-sm text-gray-800">อื่นๆ</h4>
                      <p className="text-[11px] text-gray-500">พิมข้อความสอบถามปัญหาทางกาย ทางใจ หรือการดูแลผู้ป่วยพิเศษกับ อสม.</p>
                    </div>
                    <ChevronRight size={16} className="text-emerald-500" />
                  </button>

                </div>
              ) : healthSubMenu === 'YAA' ? (
                // 💊 สอบถามเรื่องยา
                <div className="flex flex-col gap-3">
                  <span className="text-xs font-bold text-gray-500">ตัวเลือกด่วน คำถามยอดฮิตเกี่ยวกับยา :</span>
                  
                  <div className="flex flex-col gap-2">
                    {[
                      '💊 ยาความดัน ต้องทานหลังอาหารทันทีเลยใช่ไหม?',
                      '💊 มีไข้สูง ทานยาพาราเซตามอลเกินวันละ 8 เม็ดได้ไหม?',
                      '💊 ยาแก้แพ้แก้หัด ทานร่วมกับยาลดความอ้วนได้ไหม?',
                      '💊 ลืมทานยาต้านเบาหวานรอบเช้า ต้องทำอย่างไรดี?'
                    ].map((yaa, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedYaaQuery(yaa);
                          setYaaInputText(yaa);
                        }}
                        className={`p-3 rounded-xl border text-left font-semibold text-xs cursor-pointer transition-all ${
                          selectedYaaQuery === yaa 
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' 
                            : 'bg-white text-gray-700 border-amber-100 hover:bg-emerald-50/50'
                        }`}
                      >
                        {yaa}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2">
                    <label className="text-xs font-bold text-gray-500 block mb-1">หรือระบุชื่อยาและปัญหายาของท่าน :</label>
                    <textarea
                      placeholder="เช่น มียาความดันสีส้มๆ ของคุณตา หมดเมื่อเช้า ต้องการสอบถามวิธีเบิกยาแทน..."
                      value={yaaInputText}
                      onChange={(e) => setYaaInputText(e.target.value)}
                      className="w-full bg-white border border-amber-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-400 text-gray-800 font-semibold"
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!yaaInputText.trim()) {
                        alert('กรุณากรอกระบุข้อมูลยาก่อนค่ะ');
                        return;
                      }
                      handleRequestVolunteer('health', `💊 สอบถามเรื่องยา: ${yaaInputText}`, 'ขอปรึกษาเรื่องข้อบ่งชี้การรับประทานยาสามัญ');
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-black mt-2 text-sm shadow-md transition-all active:scale-95"
                  >
                    ส่งข้อมูลปรึกษา อสม. ทันที
                  </button>
                  <button onClick={() => setHealthSubMenu(null)} className="text-xs text-gray-400 text-center hover:underline cursor-pointer">ย้อนกลับไปเมนูสุขภาพ</button>
                </div>
              ) : healthSubMenu === 'KNOWLEDGE' ? (
                // 📚 ความรู้สุขภาพสำหรับผู้สูงวัย
                <div className="flex flex-col gap-3">
                  {selectedKnowledgeArticle === null ? (
                    <>
                      <p className="text-xs font-bold text-gray-500">คลิกที่บทความเพื่อเปิดอ่านคำแนะนำขนาดใหญ่ :</p>
                      <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[440px] pr-1">
                        {healthArticles.map((art, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedKnowledgeArticle(art)}
                            className="bg-white hover:bg-amber-50/50 p-4 rounded-2xl border border-amber-100 text-left transition-all cursor-pointer shadow-xs flex justify-between items-center group"
                          >
                            <span className="font-bold text-gray-800 text-xs pr-4">{art.title}</span>
                            <Eye size={16} className="text-emerald-500 shrink-0" />
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-5 rounded-2xl border-2 border-emerald-400 shadow-md"
                    >
                      <h3 className="text-sm font-black text-emerald-900 border-b border-emerald-100 pb-2.5 mb-2.5">
                        {selectedKnowledgeArticle.title}
                      </h3>
                      <p className="text-xs text-gray-700 leading-relaxed font-semibold whitespace-pre-line">
                        {selectedKnowledgeArticle.content}
                      </p>
                      <button
                        onClick={() => setSelectedKnowledgeArticle(null)}
                        className="w-full bg-emerald-100 text-emerald-800 font-bold py-2 rounded-xl text-xs mt-4 hover:bg-emerald-200 cursor-pointer"
                      >
                        ปิดบทความนี้ / ย้อนกลับบทความทั้งหมด
                      </button>
                    </motion.div>
                  )}
                  <button onClick={() => setHealthSubMenu(null)} className="text-xs text-gray-400 text-center hover:underline cursor-pointer mt-2">ย้อนกลับไปเมนูสุขภาพ</button>
                </div>
              ) : healthSubMenu === 'SICK' ? (
                // 🤒 ไม่สบาย อยากปรึกษา
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-bold text-gray-500">คุณยายรู้สึกไม่สบายอย่างไรคะ เลือกอาการหลักที่เป็นอยู่ค่ะ :</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      '🤒 แน่นหน้าอก หายใจไม่อิ่ม',
                      '🤒 ปวดหัว เวียนศีรษะ',
                      '🤒 ปวดกล้ามเนื้อ ปวดข้อเท้า',
                      '🤒 มีไข้ ตัวร้อน หนาวสั่น',
                      '🤒 ท้องเสีย ท้องอืด',
                      '🤒 นอนไม่หลับหลายคืน'
                    ].map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSickSymptom(s)}
                        className={`p-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                          sickSymptom === s 
                            ? 'bg-rose-500 text-white border-rose-500 shadow-sm' 
                            : 'bg-white text-gray-700 border-amber-100 hover:bg-rose-50/50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2">
                    <label className="text-xs font-bold text-gray-500 block mb-1">พิมพ์คำอธิบายเพิ่มเติม (ถ้ามี) :</label>
                    <textarea
                      placeholder="อธิบายความรู้สึก หรือบอกจุดที่เจ็บปวดเพิ่มเติม..."
                      value={sickSymptom}
                      onChange={(e) => setSickSymptom(e.target.value)}
                      className="w-full bg-white border border-amber-200 rounded-xl p-3 text-xs focus:outline-none focus:border-rose-400 text-gray-800 font-semibold"
                      rows={3}
                    />
                  </div>

                  <div className="flex flex-col gap-2 mt-2">
                    <button
                      onClick={() => {
                        if (!sickSymptom.trim()) {
                          alert('กรุณากรอกระบุอาการที่ท่านไม่สบายก่อนค่ะ');
                          return;
                        }
                        handleRequestVolunteer('health', `🤒 มีอาการไม่สบาย: ${sickSymptom}`, 'ขอ อสม. ด่วนเพื่อประเมินสัญญาณชีพและตรวจร่างกายที่บ้าน');
                      }}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-2xl font-black text-sm shadow-md transition-all cursor-pointer"
                    >
                      ส่งข้อมูลแจ้ง อสม. ด่วนที่สุด
                    </button>
                    
                    <button
                      onClick={() => {
                        alert('📞 กำลังจำลองเชื่อมสายตรงระบบแชทพยาบาล รพ.สต. เพื่อให้คำแนะนำ...');
                      }}
                      className="w-full border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 py-2.5 rounded-2xl font-bold text-xs cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Phone size={13} />
                      <span>โทรปรึกษาพยาบาลผ่านระบบฟรี</span>
                    </button>
                  </div>
                  <button onClick={() => setHealthSubMenu(null)} className="text-xs text-gray-400 text-center hover:underline cursor-pointer">ย้อนกลับไปเมนูสุขภาพ</button>
                </div>
              ) : (
                // อื่นๆ (Others)
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-bold text-gray-500">ระบุคำขอเกี่ยวกับสุขภาพอื่นๆ ที่ท่านต้องการให้อาสา อสม. ช่วยประสานงาน :</p>
                  
                  <textarea
                    placeholder="เช่น ยายอยากขอยืมรถเข็นวีลแชร์มาใช้ชั่วคราว, อยากให้อาสาสมัครช่วยวัดความดันโลหิตให้ที่บ้านพรุ่งนี้เช้า..."
                    value={otherHealthQuery}
                    onChange={(e) => setOtherHealthQuery(e.target.value)}
                    className="w-full bg-white border border-amber-200 rounded-xl p-3 text-xs focus:outline-none focus:border-purple-400 text-gray-800 font-semibold"
                    rows={4}
                  />

                  <button
                    onClick={() => {
                      if (!otherHealthQuery.trim()) {
                        alert('กรุณากรอกรายละเอียดเรื่องอื่นๆ ที่ต้องการปรึกษาก่อนค่ะ');
                        return;
                      }
                      handleRequestVolunteer('health', `❓ เรื่องอื่นๆ: ${otherHealthQuery}`, 'คำขออำนวยความสะดวกสิทธิสวัสดิการหรืออุปกรณ์การแพทย์');
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-black text-sm shadow-md transition-all cursor-pointer"
                  >
                    ส่งสัญญานคำขอ อสม.
                  </button>
                  <button onClick={() => setHealthSubMenu(null)} className="text-xs text-gray-400 text-center hover:underline cursor-pointer">ย้อนกลับไปเมนูสุขภาพ</button>
                </div>
              )}
            </motion.div>
          )}

          {/* ======================================= */}
          {/* SCREEN: WELFARE RIGHTS CATEGORIES (สิทธิสวัสดิการ) */}
          {/* ======================================= */}
          {currentScreen === 'WELFARE_CATS' && (
            <motion.div 
              key="welfare_cats"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4 flex-1 text-sm text-gray-800"
            >
              {/* Header with Back */}
              <div className="flex items-center gap-3 pb-2 border-b border-amber-200">
                <button 
                  onClick={() => setCurrentScreen('HOME')}
                  className="bg-amber-100 text-amber-800 p-2 rounded-full hover:bg-amber-200 transition-all cursor-pointer"
                >
                  <ArrowLeft size={18} />
                </button>
                <h1 className="text-xl font-black text-amber-900">🏛️ สิทธิและสวัสดิการ</h1>
              </div>

              <p className="text-xs text-gray-500 -mt-2">เลือกประเด็นสิทธิรัฐเพื่อเช็กสิทธิ์หรือปรึกษา อสม. ช่วยเดินเรื่อง :</p>

              <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[460px] pr-1">
                {[
                  { label: 'สิทธิรักษาพยาบาล (บัตรทอง/เบิกข้าราชการ)', sub: 'เช็กสิทธิสถานพยาบาลที่ขึ้นตรง สิทธิ์ฟรี', screen: 'TREATMENT_RIGHTS' },
                  { label: 'เบี้ยยังชีพผู้สูงอายุรายเดือน', sub: 'สิทธิ์รับเงินเยียวยา 600 - 1,000 บาท ตามช่วงอายุ', screen: 'CHATBOT' },
                  { label: 'สิทธิ์ขอยืมรถเข็น/เตียงผู้ป่วย', sub: 'บริการยืมคืนเครื่องมือแพทย์ รพ.สต. ไม่มีค่าใช้จ่าย', screen: 'CHATBOT' },
                  { label: 'เบี้ยสงเคราะห์ภัยแล้ง/ภัยพิบัติฉุกเฉิน', sub: 'สิทธิผู้ประสบอุบัติภัยคนชราในตำบล', screen: 'CHATBOT' },
                  { label: 'แนะนำสถานบริการและ รพ.สต. ใกล้เคียง', sub: 'รายชื่อโรงพยาบาลและเบอร์โทรที่ติดต่อด่วนได้', screen: 'RECOMMENDED_AGENCIES' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.screen === 'TREATMENT_RIGHTS') {
                        setCurrentScreen('TREATMENT_RIGHTS');
                      } else if (item.screen === 'RECOMMENDED_AGENCIES') {
                        setCurrentScreen('RECOMMENDED_AGENCIES');
                      } else {
                        setAppState(prev => ({
                          ...prev,
                          chatMessages: [
                            { id: 'start-1', sender: 'elderly', text: `อยากสอบถามเกี่ยวกับเรื่อง ${item.label} ค่ะ ยายต้องเตรียมเอกสารอะไรบ้าง?`, time: '10:15 น.' },
                            { id: 'start-2', sender: 'volunteer', text: `สวัสดีค่ะคุณยาย เรื่อง ${item.label} มีเงื่อนไขการรับสิทธิ์ง่ายๆ ค่ะ คุณยายนำบัตรประชาชนและทะเบียนบ้านไปเขียนคำร้องได้เลยค่ะ หรือจะให้อาสาสมัครประสานกับทางผู้ใหญ่บ้าน/อบต. ช่วยนำพาอำนวยความสะดวกก็ได้นะคะ`, time: '10:16 น.' }
                          ]
                        }));
                        setCurrentScreen('CHATBOT');
                      }
                    }}
                    className="flex justify-between items-center bg-white hover:bg-amber-50 p-3.5 rounded-2xl border border-amber-200 shadow-xs cursor-pointer transition-all active:scale-[0.99] text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 text-amber-600 p-2.5 rounded-xl">
                        <Heart size={18} className="fill-amber-600" />
                      </div>
                      <div>
                        <span className="text-sm font-black text-gray-800">{item.label}</span>
                        <p className="text-[10px] text-gray-500 mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-amber-500" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* SCREEN: TREATMENT RIGHTS QUESTIONS (สิทธิรักษาพยาบาล) */}
          {currentScreen === 'TREATMENT_RIGHTS' && (
            <motion.div 
              key="treatment_rights"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4 flex-1 text-sm text-gray-800"
            >
              {/* Header with Back */}
              <div className="flex items-center gap-3 pb-2 border-b border-amber-200">
                <button 
                  onClick={() => setCurrentScreen('WELFARE_CATS')}
                  className="bg-amber-100 text-amber-800 p-2 rounded-full hover:bg-amber-200 transition-all cursor-pointer"
                >
                  <ArrowLeft size={18} />
                </button>
                <h1 className="text-lg font-black text-amber-950">สิทธิรักษาพยาบาล</h1>
              </div>

              {/* Patient Verification Card */}
              <div className="bg-orange-50 border-2 border-orange-200 p-4 rounded-2xl flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white font-black text-xs">
                    สม
                  </div>
                  <div>
                    <h4 className="text-xs text-orange-950 font-black">ผู้มีสิทธิ: คุณสมหญิง รักดี</h4>
                    <p className="text-[11px] text-orange-800 font-bold">สิทธิหลัก: บัตรทอง / บัตรสวัสดิการแห่งรัฐ</p>
                  </div>
                </div>
                <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-xs">
                  สิทธิ์ใช้ได้ปกติ
                </span>
              </div>

              <p className="text-xs font-bold text-gray-500 -mb-1">คำถามและรายการสิทธิที่คุณเช็กได้ทันที :</p>

              {/* Question list */}
              <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[350px]">
                {[
                  'เช็กสิทธิโรงพยาบาลรักษาพยาบาลที่ขึ้นตรง',
                  'การเบิกค่ายานอกบัญชียาหลักแห่งชาติ',
                  'ขอนัดหมายตรวจเบาหวาน/ความดันล่วงหน้า',
                  'สิทธิขอรถพยาบาลฉุกเฉินนำส่งฟรี'
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setAppState(prev => ({
                        ...prev,
                        chatMessages: [
                          {
                            id: 'q-1',
                            sender: 'elderly',
                            text: `สวัสดีค่ะ ยายอยากสอบถามสิทธิ์เกี่ยวกับเรื่อง: ${q} มีเงื่อนไขอย่างไรบ้างคะ?`,
                            time: '10:30 น.'
                          },
                          {
                            id: 'q-2',
                            sender: 'volunteer',
                            text: `สวัสดีค่ะคุณยาย เรื่อง "${q}" เป็นสวัสดิการคุ้มครองผู้สูงอายุไทยค่ะ คุณยายสามารถใช้บริการ รพ.สต. หรือให้ อสม. สมใจช่วยนำส่งจองคิวนัดล่วงหน้าได้ทันทีนะคะ ยายจะได้รับยาที่บ้านหรือคิวสแกนสะดวกมากยิ่งขึ้นค่ะ`,
                            time: '10:31 น.'
                          }
                        ]
                      }));
                      setCurrentScreen('CHATBOT');
                    }}
                    className="flex justify-between items-center bg-white hover:bg-orange-50 p-3.5 rounded-xl border border-amber-100 shadow-xs cursor-pointer text-left font-bold text-gray-700 transition-all text-xs"
                  >
                    <span>{q}</span>
                    <ChevronRight size={14} className="text-amber-500" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* SCREEN: CHATBOT SYSTEM */}
          {currentScreen === 'CHATBOT' && (
            <motion.div 
              key="chatbot"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col flex-1 h-full text-sm text-gray-800"
            >
              <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentScreen('WELFARE_CATS')}
                    className="bg-amber-100 text-amber-800 p-2 rounded-full hover:bg-amber-200 transition-all cursor-pointer"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <h1 className="text-sm font-black text-gray-800">ระบบสนทนาข้อมูลสิทธิ</h1>
                    <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                      อสม. ตอบสนทนาและดูแลสิทธิ์
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setCurrentScreen('RECOMMENDED_AGENCIES')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-0.5 cursor-pointer"
                >
                  <span>ถัดไป</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Chat Conversation messages */}
              <div className="flex-1 overflow-y-auto my-3 flex flex-col gap-3 pr-1 text-xs">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <HelpCircle size={40} className="mx-auto text-amber-200 mb-2" />
                    <p className="text-xs">พิมพ์สอบถามเรื่องสวัสดิการของคุณยายด้านล่างได้เลยค่ะ</p>
                  </div>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div 
                      key={idx}
                      className={`flex flex-col max-w-[85%] ${msg.sender === 'elderly' ? 'self-end items-end' : msg.sender === 'system' ? 'self-center text-center max-w-[100%]' : 'self-start items-start'}`}
                    >
                      {msg.sender === 'system' ? (
                        <span className="bg-amber-100 text-amber-800 text-[11px] px-3 py-1 rounded-full text-center font-semibold">
                          {msg.text}
                        </span>
                      ) : (
                        <>
                          <span className="text-[10px] text-gray-400 mb-0.5">{msg.sender === 'elderly' ? 'คุณยาย' : 'อสม. อัจฉริยะ'}</span>
                          <div 
                            className={`p-3 rounded-2xl ${
                              msg.sender === 'elderly' 
                                ? 'bg-amber-500 text-white rounded-tr-none shadow-xs font-bold' 
                                : 'bg-white text-gray-800 border border-amber-200 rounded-tl-none shadow-xs font-bold'
                            }`}
                          >
                            <p className="leading-relaxed">{msg.text}</p>
                          </div>
                          <span className="text-[9px] text-gray-400 mt-0.5">{msg.time}</span>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Chat inputs */}
              <div className="flex gap-2 pt-2 border-t border-amber-100">
                <input
                  type="text"
                  placeholder="พิมพ์ถามข้อความตรงนี้ได้เลยค่ะ..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-white border border-amber-300 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-amber-500 text-gray-800 font-bold"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-amber-500 hover:bg-amber-600 text-white p-2.5 rounded-full shadow-md transition-transform active:scale-95 flex items-center justify-center cursor-pointer"
                >
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN: RECOMMENDED AGENCIES */}
          {currentScreen === 'RECOMMENDED_AGENCIES' && (
            <motion.div 
              key="rec_agencies"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-3 flex-1 text-sm text-gray-800"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentScreen('WELFARE_CATS')}
                    className="bg-amber-100 text-amber-800 p-2 rounded-full hover:bg-amber-200 transition-all cursor-pointer"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <h1 className="text-base font-black text-amber-950">หน่วยงานติดต่อที่สำคัญ</h1>
                </div>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto max-h-[460px] pr-1">
                
                <div className="bg-white p-3.5 rounded-2xl border border-sky-200 shadow-sm flex items-start gap-3">
                  <div className="bg-sky-100 text-sky-600 p-2 rounded-xl shrink-0">
                    <Hospital size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-black text-gray-800">โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านบอน (รพ.สต.)</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">รับยาสามัญประจำบ้าน ตรวจเบาหวาน วัดความดัน ฝากครรภ์ และทำแผลเบื้องต้น</p>
                    <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-gray-100">
                      <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                        📞 โทร. 081-234-5678
                      </span>
                      <a href="tel:0812345678" className="bg-sky-50 text-sky-600 text-[10px] px-3 py-1 rounded-full font-black">โทรหา รพ.สต.</a>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-sm flex items-start gap-3">
                  <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl shrink-0">
                    <Shield size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xs font-black text-gray-800">สำนักงานหลักประกันสุขภาพแห่งชาติ (สายด่วน สปสช.)</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">ย้ายสิทธิบัตรทอง สอบถามสิทธิ์รักษาพยาบาลฟรี ทำฟันฟรียี่สิบสี่ชั่วโมง</p>
                    <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-gray-100">
                      <span className="text-[11px] font-bold text-emerald-600">
                        📞 สายด่วน 1330
                      </span>
                      <span className="text-[9px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full">โทรฟรี 24 ชม.</span>
                    </div>
                  </div>
                </div>

              </div>

              <button
                onClick={() => {
                  handleRequestVolunteer('health', '🏥 ขอรถรับส่งโรงพยาบาลผ่าน รพ.สต. บ้านบอน', `ต้องการประสานรถรับส่งสำหรับ: ${elderlyName}`);
                }}
                className="w-full bg-[#38A169] hover:bg-[#2F855A] text-white py-3.5 rounded-2xl font-black shadow-md transition-all text-center cursor-pointer mt-auto"
              >
                ขอ อสม. ช่วยเดินทางพาไปติดต่อด่วน
              </button>
            </motion.div>
          )}

          {/* ======================================= */}
          {/* SCREEN: CONNECTED ACTIVE CHAT WITH VOLUNTEER */}
          {/* ======================================= */}
          {matchStatus === 'CONNECTED' && (
            <motion.div 
              key="connected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col flex-1 h-full text-sm text-gray-800"
            >
              {/* Connected Header */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" 
                    alt="Assigned Volunteer"
                    className="w-10 h-10 rounded-full border-2 border-amber-300 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h1 className="text-sm font-black text-gray-800">อาสา สมใจ แข็งขัน</h1>
                    <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                      กำลังช่วยเหลือคุณสมหญิงอยู่ (ออนไลน์)
                    </p>
                  </div>
                </div>

                {/* Video Call Trigger */}
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => setAppState(prev => ({ ...prev, isVideoActive: true }))}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full shadow-md transition-colors cursor-pointer"
                    title="เริ่มวิดีโอคอล"
                  >
                    <Video size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setAppState(prev => ({
                        ...prev,
                        matchStatus: 'IDLE',
                        currentRequest: null,
                        chatMessages: []
                      }));
                      setCurrentScreen('HOME');
                    }}
                    className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md cursor-pointer"
                  >
                    เสร็จงาน
                  </button>
                </div>
              </div>

              {/* Video Call Overlay */}
              {isVideoActive ? (
                <div className="flex-1 flex flex-col relative bg-zinc-950 rounded-2xl overflow-hidden my-3">
                  <div className="absolute inset-0">
                    <img 
                      src={elderlyPhoto} 
                      alt="Grandmother full screen" 
                      className="w-full h-full object-cover opacity-90"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="absolute bottom-16 right-3 w-28 h-36 rounded-xl border-2 border-white overflow-hidden shadow-md z-10">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" 
                      alt="Volunteer PIP" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 text-white bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-xs">
                    <span className="text-xs font-bold flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></span>
                      วิดีโอคอลกับอาสาสมใจ (01:12)
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                    <button 
                      onClick={() => setAppState(prev => ({ ...prev, isVideoActive: false }))}
                      className="bg-rose-600 hover:bg-rose-700 p-3 rounded-full text-white shadow-lg active:scale-95 cursor-pointer"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                // Chat messaging window with Volunteer
                <div className="flex-1 flex flex-col h-full my-3">
                  <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 text-xs">
                    {chatMessages.map((msg, idx) => (
                      <div 
                        key={idx}
                        className={`flex flex-col max-w-[85%] ${msg.sender === 'elderly' ? 'self-end items-end' : msg.sender === 'system' ? 'self-center text-center max-w-[100%]' : 'self-start items-start'}`}
                      >
                        {msg.sender === 'system' ? (
                          <span className="bg-amber-100 text-amber-800 text-[10px] px-3 py-1 rounded-full text-center">
                            {msg.text}
                          </span>
                        ) : (
                          <>
                            <span className="text-[10px] text-gray-400 mb-0.5">{msg.sender === 'elderly' ? 'คุณยายสมหญิง' : 'อาสา สมใจ'}</span>
                            <div 
                              className={`p-3 rounded-2xl ${
                                msg.sender === 'elderly' 
                                  ? 'bg-[#2B6CB0] text-white rounded-tr-none shadow-xs font-bold' 
                                  : 'bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-tl-none shadow-xs font-bold'
                              }`}
                            >
                              <p>{msg.text}</p>
                            </div>
                            <span className="text-[9px] text-gray-400 mt-0.5">{msg.time}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Message Input bar */}
                  <div className="flex gap-2 pt-2 border-t border-amber-100">
                    <input
                      type="text"
                      placeholder="พิมพ์ถามพูดคุยกับอาสาตรงนี้เลย..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 bg-white border border-amber-300 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-amber-500 font-bold"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-full shadow-md transition-transform active:scale-95 cursor-pointer"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ======================================= */}
          {/* SCREEN: SOS ACTIVE TRIGGER RED OVERLAY */}
          {/* ======================================= */}
          {currentScreen === 'SOS_ACTIVE' && matchStatus === 'CONNECTING' && (
            <motion.div 
              key="sos_overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-rose-600 text-white flex flex-col justify-center items-center p-6 text-center z-50 rounded-3xl"
            >
              <div className="bg-white text-rose-600 p-6 rounded-full animate-ping [animation-duration:1.5s]">
                <AlertTriangle size={48} className="fill-rose-600" />
              </div>
              
              <h1 className="text-3xl font-black mt-8 tracking-wider">🔔 ส่งสัญญาณภัย SOS</h1>
              <p className="text-sm font-bold opacity-90 mt-2">กำลังแชร์ตำแหน่ง GPS และเรียกกู้ชีพ 1669 / อสม.</p>
              
              <div className="mt-8 bg-white/10 backdrop-blur-xs p-4 rounded-2xl w-full max-w-xs text-xs">
                <p className="font-bold flex items-center justify-center gap-1 text-sm mb-1.5">
                  📍 พิกัดบ้านสมหญิง รักดี :
                </p>
                <p className="opacity-90 font-medium text-center">บ้านเลขที่ 124 ต.บ้านบอน จ.ขอนแก่น</p>
              </div>

              <div className="mt-12 flex flex-col gap-3 w-full max-w-xs">
                <a 
                  href="tel:1669" 
                  className="bg-white text-rose-600 py-3.5 rounded-2xl font-black shadow-lg transition-transform active:scale-95 text-base flex items-center justify-center gap-2"
                >
                  <Phone size={20} />
                  <span>โทรหา 1669 เลย</span>
                </a>
                <button
                  onClick={handleCancelConnection}
                  className="border-2 border-white/40 text-white/80 py-2.5 rounded-2xl font-bold hover:bg-white/10 text-xs cursor-pointer"
                >
                  ยกเลิกส่งสัญญานเตือนภัย (เมื่อกิดผิดพลาด)
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <div className="bg-white border-t border-amber-200 px-4 py-2.5 flex justify-around items-center shrink-0">
        <button 
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center justify-center cursor-pointer transition-all ${activeTabElderly === 'home' ? 'text-amber-600 scale-105 font-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Home size={22} />
          <span className="text-[10px] font-black mt-1">หน้าแรก</span>
        </button>

        <button 
          onClick={() => {
            handleTabClick('history');
            alert('ประวัติรายการสุขภาพและอาสาสมัครของคุณยายอยู่ในเกณฑ์ปกติค่ะ');
          }}
          className={`flex flex-col items-center justify-center cursor-pointer transition-all ${activeTabElderly === 'history' ? 'text-amber-600 scale-105 font-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Clock size={22} />
          <span className="text-[10px] font-black mt-1">ประวัติ</span>
        </button>

        <button 
          onClick={() => {
            handleTabClick('call');
            alert('📞 กำลังจำลองเชื่อมสายด่วนระบบ อสม. ในหมู่บ้านคุณยายค่ะ เบอร์โทร: 081-234-5678');
          }}
          className={`flex flex-col items-center justify-center cursor-pointer transition-all ${activeTabElderly === 'call' ? 'text-amber-600 scale-105 font-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <PhoneCall size={22} className="text-emerald-600" />
          <span className="text-[10px] font-black mt-1">โทรหาอาสา</span>
        </button>

        <button 
          onClick={() => {
            handleTabClick('settings');
            alert('คุณยายสามารถปรับแต่งขนาดตัวอักษรและเสียงนำทางได้ที่หน้านี้ค่ะ');
          }}
          className={`flex flex-col items-center justify-center cursor-pointer transition-all ${activeTabElderly === 'settings' ? 'text-amber-600 scale-105 font-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Settings size={22} />
          <span className="text-[10px] font-black mt-1">ตั้งค่า</span>
        </button>
      </div>

    </div>
  );
}
