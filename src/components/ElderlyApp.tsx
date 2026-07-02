import React, { useState, useEffect } from 'react';
import { 
  Heart, Shield, AlertTriangle, ArrowLeft, ChevronRight, Phone, 
  MapPin, Send, MessageCircle, Video, Play, CheckCircle, 
  Settings, Bell, Home, Clock, PhoneCall, HelpCircle, HeartPulse, Hospital, AlertCircle,
  User, X
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
  const [currentScreen, setCurrentScreen] = useState<'HOME' | 'WELFARE_CATS' | 'TREATMENT_RIGHTS' | 'CHATBOT' | 'RECOMMENDED_AGENCIES' | 'REQUEST_VOLUNTEER' | 'HEALTH_CONSULT' | 'SOS_ACTIVE'>('HOME');
  const [selectedSymptom, setSelectedSymptom] = useState<string>('');
  const [healthActionType, setHealthActionType] = useState<'CONSULT' | 'HOSPITAL' | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<string>('โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านบอน (ใกล้คุณที่สุด 800ม.)');
  const [inputText, setInputText] = useState<string>('');
  const [selectedVolunteerFilter, setSelectedVolunteerFilter] = useState<'all' | 'near'>('near');

  // Nearby volunteers (for simulation)
  const nearbyVolunteers = [
    { name: 'อาสา สมหญิง ใจดี', distance: '350 เมตร', rating: 4.9, image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120' },
    { name: 'อาสา นพดล เรียนรู้', distance: '800 เมตร', rating: 4.8, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120' },
    { name: 'อาสา วันชัย บริการ', distance: '1.2 กิโลเมตร', rating: 4.7, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120' }
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
              text: 'สวัสดีค่ะคุณยายปิยะวรรณ อาสาสมัครสมหญิงรับเรื่องแล้วนะคะ กำลังประสานงานและพร้อมคุยค่ะ มีอาการอย่างไรบ้างคะ?',
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
    const sosRequest: HelpRequest = {
      id: Date.now().toString(),
      elderlyName,
      elderlyAge,
      elderlyPhoto,
      symptom: 'ต้องการความช่วยเหลือฉุกเฉินทันที!! (SOS)',
      category: 'emergency',
      categoryLabel: 'กรณีฉุกเฉิน SOS',
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.',
      recommendedAgency: 'หน่วยกู้ชีพวิกฤต 1669 / อสม. ท้องถิ่น',
      note: 'สัญญาณเตือนภัยฉุกเฉิน SOS กดจากหน้าแรก',
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
          text: '🚨 สัญญาณฉุกเฉิน SOS ทำงาน! กำลังแจ้งเตือนอาสาสมัครที่ใกล้ที่สุดและหน่วยกู้ชีพฉุกเฉิน 1669 ทันที',
          time: sosRequest.time
        }
      ]
    }));
    setCurrentScreen('SOS_ACTIVE');
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

  return (
    <div className="w-full max-w-md mx-auto bg-[#FFFBF0] text-gray-800 flex flex-col h-[750px] shadow-2xl rounded-3xl overflow-hidden border-4 border-amber-100 relative">
      
      {/* Top Mobile Bar decoration */}
      <div className="bg-[#FFFBF0] px-6 pt-3 pb-2 flex justify-between items-center text-xs font-semibold text-gray-400 select-none border-b border-amber-50">
        <span>9:41 น.</span>
        <div className="w-24 h-4 bg-gray-200 rounded-full mx-2 opacity-50"></div>
        <div className="flex gap-1 items-center">
          <span className="text-emerald-500">5G</span>
          <div className="w-5 h-2.5 bg-gray-400 rounded-xs"></div>
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
              {/* Header profile */}
              <div className="flex justify-between items-center bg-white p-3 rounded-2xl shadow-sm border border-amber-100">
                <div className="flex items-center gap-3">
                  <img 
                    src={elderlyPhoto} 
                    alt={elderlyName}
                    className="w-12 h-12 rounded-full border-2 border-amber-400 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h2 className="text-xs text-gray-400">สวัสดีค่ะ ยินดีต้อนรับ</h2>
                    <h1 className="text-lg font-bold text-gray-800">{elderlyName}</h1>
                  </div>
                </div>
                <button className="relative bg-amber-50 p-2.5 rounded-full text-amber-600 hover:bg-amber-100 transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>
              </div>

              {/* Blue Call out banner */}
              <div className="bg-[#2B6CB0] text-white p-4 rounded-3xl shadow-md flex items-center justify-between relative overflow-hidden">
                <div className="z-10 flex-1 pr-4">
                  <h3 className="text-xl font-bold mb-1">มีปัญหา</h3>
                  <p className="text-sm opacity-90 mb-3">ให้เราช่วยนะคะ</p>
                  <button 
                    onClick={() => setCurrentScreen('REQUEST_VOLUNTEER')}
                    className="bg-[#D53F8C] hover:bg-pink-600 active:scale-95 text-white font-bold px-4 py-2 rounded-full text-sm shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>ขออาสาสมัครช่วย</span>
                  </button>
                </div>
                <div className="w-1/3 flex justify-end">
                  {/* Avatar volunteer vector simulation */}
                  <div className="w-24 h-24 rounded-full bg-blue-400/20 flex items-center justify-center border-2 border-white/20">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" 
                      alt="Volunteer"
                      className="w-20 h-20 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>

              {/* Grid 4 categories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">เลือกบริการที่คุณต้องการ</h3>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Category 1: สุขภาพ */}
                  <button 
                    onClick={() => {
                      setCurrentScreen('HEALTH_CONSULT');
                      setHealthActionType(null);
                      setSelectedSymptom('');
                    }}
                    className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer transition-all active:scale-95 group"
                  >
                    <div className="bg-emerald-500 text-white p-3 rounded-2xl mb-2.5 group-hover:scale-105 transition-transform">
                      <HeartPulse size={28} />
                    </div>
                    <span className="text-sm font-bold text-emerald-800">สุขภาพ</span>
                    <span className="text-[11px] text-emerald-600 mt-1">ปรึกษา & พาไปรพ.</span>
                  </button>

                  {/* Category 2: สิทธิและสวัสดิการ */}
                  <button 
                    onClick={() => setCurrentScreen('WELFARE_CATS')}
                    className="bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer transition-all active:scale-95 group"
                  >
                    <div className="bg-amber-500 text-white p-3 rounded-2xl mb-2.5 group-hover:scale-105 transition-transform">
                      <Shield size={28} />
                    </div>
                    <span className="text-sm font-bold text-amber-800">สิทธิและสวัสดิการ</span>
                    <span className="text-[11px] text-amber-600 mt-1">เช็กสิทธิรัฐ & ช่วยเหลือ</span>
                  </button>

                  {/* Category 3: การดูแลผู้ป่วยติดเตียง */}
                  <button 
                    onClick={() => {
                      handleRequestVolunteer('bedridden', 'ขออาสาสมัครแนะนำและช่วยดูแลผู้ป่วยติดเตียงที่บ้าน', 'ต้องการให้ช่วยเปลี่ยนผ้าอ้อมและพลิกตัวผู้สูงอายุ');
                    }}
                    className="bg-sky-50 hover:bg-sky-100 border border-sky-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer transition-all active:scale-95 group"
                  >
                    <div className="bg-sky-500 text-white p-3 rounded-2xl mb-2.5 group-hover:scale-105 transition-transform">
                      <Clock size={28} />
                    </div>
                    <span className="text-sm font-bold text-sky-800">การดูแลผู้ป่วยติดเตียง</span>
                    <span className="text-[11px] text-sky-600 mt-1">ขออาสาช่วยดูแลที่บ้าน</span>
                  </button>

                  {/* Category 4: SOS ฉุกเฉิน */}
                  <button 
                    onClick={handleSOS}
                    className="bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer transition-all active:scale-95 group"
                  >
                    <div className="bg-rose-500 text-white p-3 rounded-2xl mb-2.5 animate-pulse">
                      <AlertTriangle size={28} />
                    </div>
                    <span className="text-sm font-bold text-rose-800">เหตุฉุกเฉิน SOS</span>
                    <span className="text-[11px] text-rose-600 mt-1 font-semibold text-rose-500">เรียกรถฉุกเฉินทันที</span>
                  </button>
                  
                </div>
              </div>

              {/* Nearest Volunteer display summary */}
              <div className="mt-2 bg-white p-3 rounded-2xl border border-amber-100 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500">อาสาสมัครในพื้นที่ของคุณ (ใกล้เคียง)</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">เปิดพร้อมช่วย 3 คน</span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {nearbyVolunteers.map((vol, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-amber-50/50 p-2 rounded-xl min-w-[150px] border border-amber-100/50">
                      <img src={vol.image} alt={vol.name} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div className="text-[11px]">
                        <p className="font-bold text-gray-700 truncate w-24">{vol.name}</p>
                        <p className="text-gray-400 text-[10px] flex items-center gap-0.5">
                          <MapPin size={10} className="text-rose-500" /> {vol.distance}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* SCREEN: WELFARE RIGHTS CATEGORIES (สิทธิสวัสดิการ) */}
          {currentScreen === 'WELFARE_CATS' && (
            <motion.div 
              key="welfare_cats"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-4 flex-1"
            >
              {/* Header with Back */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCurrentScreen('HOME')}
                  className="bg-amber-100 text-amber-800 p-2 rounded-full hover:bg-amber-200 transition-all"
                >
                  <ArrowLeft size={18} />
                </button>
                <h1 className="text-xl font-bold text-amber-900">สิทธิสวัสดิการ</h1>
              </div>

              <p className="text-xs text-gray-500 -mt-2">เลือกสิทธิ์หรือเรื่องที่ต้องการสอบถามหรือปรึกษาเจ้าหน้าที่อาสาสมัคร</p>

              {/* Welfare list items styled exactly like screenshot */}
              <div className="flex flex-col gap-3">
                {[
                  { label: 'สิทธิรักษาพยาบาล', sub: 'สิทธิบัตรทอง ประกันสังคม ข้าราชการ', screen: 'TREATMENT_RIGHTS' },
                  { label: 'เงินอุดหนุนรายเดือน', sub: 'เบี้ยยังชีพผู้สูงอายุ เงินช่วยเหลือผู้มีรายได้น้อย', screen: 'CHATBOT' },
                  { label: 'เงินสงเคราะห์ฉุกเฉิน', sub: 'เงินเยียวยาภัยแล้ง อุทกภัย หรืออุบัติเหตุร้ายแรง', screen: 'CHATBOT' },
                  { label: 'ฝึกอบรม/พัฒนาทักษะ', sub: 'หลักสูตรอาชีพ ทักษะดิจิทัล และนันทนาการ', screen: 'CHATBOT' },
                  { label: 'สวัสดิการผู้พิการ/ผู้สูงอายุ', sub: 'การขอยืมอุปกรณ์อำนวยความสะดวก รถเข็น เตียง', screen: 'CHATBOT' },
                  { label: 'ติดต่ออาสาสมัคร', sub: 'ต้องการผู้ช่วยพาไปโรงพยาบาลหรือปรึกษาตรง', screen: 'REQUEST_VOLUNTEER' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.screen === 'TREATMENT_RIGHTS') {
                        setCurrentScreen('TREATMENT_RIGHTS');
                      } else if (item.screen === 'REQUEST_VOLUNTEER') {
                        setCurrentScreen('REQUEST_VOLUNTEER');
                      } else {
                        // Put sample conversation in chatbot screen depending on category chosen
                        setAppState(prev => ({
                          ...prev,
                          chatMessages: [
                            { id: 'start-1', sender: 'elderly', text: `อยากสอบถามเกี่ยวกับเรื่อง ${item.label} ค่ะ ยายต้องดำเนินการอย่างไรบ้าง?`, time: '10:15 น.' },
                            { id: 'start-2', sender: 'volunteer', text: `สวัสดีครับคุณยาย เรื่อง ${item.label} มีสิทธิประโยชน์และขั้นตอนง่ายๆ ครับ คุณยายสามารถกรอกเอกสารที่เทศบาลหรือ อบต. ในพื้นที่ หรือให้อาสาสมัครในระบบช่วยเดินเรื่องให้ได้เลยนะครับ`, time: '10:16 น.' }
                          ]
                        }));
                        setCurrentScreen('CHATBOT');
                      }
                    }}
                    className="flex justify-between items-center bg-white hover:bg-amber-50/50 p-4 rounded-2xl border border-amber-100/70 shadow-xs cursor-pointer transition-all active:scale-[0.99] text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 text-amber-600 p-3 rounded-full group-hover:bg-amber-200 transition-colors">
                        <Heart size={20} className="fill-amber-600" />
                      </div>
                      <div>
                        <span className="text-base font-bold text-gray-800">{item.label}</span>
                        <p className="text-[11px] text-gray-400 mt-0.5">{item.sub}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
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
              className="flex flex-col gap-4 flex-1"
            >
              {/* Header with Back */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setCurrentScreen('WELFARE_CATS')}
                  className="bg-amber-100 text-amber-800 p-2 rounded-full hover:bg-amber-200 transition-all"
                >
                  <ArrowLeft size={18} />
                </button>
                <h1 className="text-xl font-bold text-amber-900">สิทธิรักษาพยาบาล</h1>
              </div>

              {/* Patient Verification Card (เหมือนรูปที่ 1 บานขวาสุด) */}
              <div className="bg-orange-100 border border-orange-200 p-4 rounded-2xl flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-300 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    สม
                  </div>
                  <div>
                    <h4 className="text-xs text-orange-800 font-semibold">ผู้มีสิทธิ: นายสมชาย รักดี</h4>
                    <p className="text-[11px] text-orange-600">ประเภทสิทธิ: ข้าราชการ/เบิกตรง (ครอบครัว)</p>
                  </div>
                </div>
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  Verified
                </span>
              </div>

              <p className="text-xs text-gray-500 font-semibold -mb-1">ตัวอย่างคำถามที่พบบ่อย :</p>

              {/* Question list */}
              <div className="flex flex-col gap-2.5">
                {[
                  'ตรวจสอบสิทธิ & บุคคลครอบครัว',
                  'ค้นหาสถานพยาบาลที่เข้าร่วม',
                  'ข้อมูลเบิกจ่ายตรง (CGD)',
                  'สิทธิเบิกค่ายา/เวชภัณฑ์',
                  'นัดหมายรักษาพยาบาล',
                  'ประวัติการรักษา'
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (q === 'ค้นหาสถานพยาบาลที่เข้าร่วม') {
                        setCurrentScreen('RECOMMENDED_AGENCIES');
                        return;
                      }
                      
                      // Inject exact dialog messages from Screenshot 2
                      setAppState(prev => ({
                        ...prev,
                        chatMessages: [
                          {
                            id: 'q-1',
                            sender: 'elderly',
                            text: `สวัสดีจ้า ยายอยากรู้เรื่อง ${q} ของผู้สูงอายุใช้ทำอะไรได้บ้าง? แล้วยายต้องไปหาที่ไหน?`,
                            time: '10:30 น.'
                          },
                          {
                            id: 'q-2',
                            sender: 'volunteer',
                            text: `สวัสดีครับคุณยาย เรื่อง "${q}" ทั่วไป คุณยายสามารถตรวจสอบและใช้สิทธิได้ง่ายๆ ผ่านแอปพลิเคชันนี้ หรือติดต่อสิทธิบัตรทองสายด่วน 1330 หรือรพ.สต. ใกล้บ้านได้เลยครับ อาสาสมัครสามารถช่วยประสานได้นะครับ`,
                            time: '10:31 น.'
                          },
                          {
                            id: 'q-3',
                            sender: 'elderly',
                            text: 'ขอบใจมากจ้ะ แล้วมีหน่วยงานแนะนำติดต่อไหมยายกลัวทำไม่ถูก',
                            time: '10:32 น.'
                          },
                          {
                            id: 'q-4',
                            sender: 'volunteer',
                            text: 'มีแน่นอนครับ เดี๋ยวผมแนะนำหน่วยงานสำคัญให้คุณยายครับ รบกวนคุณยายกด "ถัดไป" เพื่อดูรายการหน่วยงานได้เลยครับ',
                            time: '10:33 น.'
                          }
                        ]
                      }));
                      setCurrentScreen('CHATBOT');
                    }}
                    className="flex justify-between items-center bg-white hover:bg-orange-50 p-3.5 rounded-xl border border-amber-100 shadow-xs cursor-pointer text-left font-semibold text-gray-700 transition-all active:scale-[0.99] group text-sm"
                  >
                    <span>{q}</span>
                    <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* SCREEN: CHATBOT SYSTEM (ระบบสอบถาม) */}
          {currentScreen === 'CHATBOT' && (
            <motion.div 
              key="chatbot"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col flex-1 h-full"
            >
              {/* Header with Back */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentScreen('TREATMENT_RIGHTS')}
                    className="bg-amber-100 text-amber-800 p-2 rounded-full hover:bg-amber-200 transition-all"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div>
                    <h1 className="text-sm font-bold text-gray-800">ระบบสอบถามข้อมูล</h1>
                    <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                      AI อาสาสมัครตอบคำถาม
                    </p>
                  </div>
                </div>
                
                {/* Next Button */}
                <button
                  onClick={() => setCurrentScreen('RECOMMENDED_AGENCIES')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1"
                >
                  <span>ถัดไป</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* Chat Conversation messages */}
              <div className="flex-1 overflow-y-auto my-3 flex flex-col gap-3 pr-1 text-sm">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <HelpCircle size={40} className="mx-auto text-amber-200 mb-2" />
                    <p className="text-xs">พิมพ์คำถามสวัสดิการของคุณยายด้านล่างได้เลยค่ะ</p>
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
                          <span className="text-[10px] text-gray-400 mb-0.5">{msg.sender === 'elderly' ? 'คุณยาย' : 'อสม. AI'}</span>
                          <div 
                            className={`p-3 rounded-2xl ${
                              msg.sender === 'elderly' 
                                ? 'bg-amber-500 text-white rounded-tr-none shadow-xs' 
                                : 'bg-white text-gray-800 border border-amber-100 rounded-tl-none shadow-xs'
                            }`}
                          >
                            <p className="font-medium leading-relaxed">{msg.text}</p>
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
                  placeholder="พิมพ์ข้อความคุยถามที่นี่..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-white border border-amber-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-amber-400 text-gray-800"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-amber-500 hover:bg-amber-600 text-white p-2.5 rounded-full shadow-md transition-transform active:scale-95 flex items-center justify-center"
                >
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN: RECOMMENDED AGENCIES (ระบบแนะนำหน่วยงานเพิ่มเติม) */}
          {currentScreen === 'RECOMMENDED_AGENCIES' && (
            <motion.div 
              key="rec_agencies"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex flex-col gap-3.5 flex-1"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentScreen('TREATMENT_RIGHTS')}
                    className="bg-amber-100 text-amber-800 p-2 rounded-full hover:bg-amber-200 transition-all"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <h1 className="text-base font-bold text-amber-950">หน่วยงานแนะนำติดต่อสิทธิ์</h1>
                </div>
                
                {/* Contact Volunteer */}
                <button
                  onClick={() => setCurrentScreen('REQUEST_VOLUNTEER')}
                  className="bg-pink-600 hover:bg-pink-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm"
                >
                  หาคนช่วยพาไป
                </button>
              </div>

              <p className="text-xs text-gray-500 -mt-2">หน่วยงานบริการสาธารณสุขและสวัสดิการผู้สูงอายุใกล้บ้านคุณยาย :</p>

              {/* Agency List Cards (เหมือนรูปที่ 2 บานกลาง) */}
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[460px] pr-1">
                
                <div className="bg-white p-3.5 rounded-2xl border border-sky-100 shadow-xs flex items-start gap-3">
                  <div className="bg-sky-100 text-sky-600 p-2.5 rounded-xl">
                    <Hospital size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-800">โรงพยาบาลส่งเสริมสุขภาพตำบลบ้านบอน (รพ.สต.)</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">ให้บริการตรวจโรคทั่วไป, จ่ายยาสามัญ, และเยี่ยมบ้านคนชรา</p>
                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-gray-50">
                      <span className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                        <Phone size={12} /> โทร. 01 2345 678
                      </span>
                      <a href="tel:012345678" className="bg-sky-50 text-sky-600 text-[10px] px-3 py-1 rounded-full font-bold">
                        กดโทรออก
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-purple-100 shadow-xs flex items-start gap-3">
                  <div className="bg-purple-100 text-purple-600 p-2.5 rounded-xl">
                    <Heart size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-800">กรมกิจการผู้สูงอายุ (Elderly Affairs Dept.)</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">ประสานสิทธิสวัสดิการ เงินสงเคราะห์ผู้สูงอายุในภาวะยากลำบาก</p>
                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-gray-50">
                      <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                        <Phone size={12} /> โทร. 0 2642 4336
                      </span>
                      <span className="text-[10px] text-gray-400">สนง. ส่วนกลาง</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs flex items-start gap-3">
                  <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-xl">
                    <Shield size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-800">สำนักงานหลักประกันสุขภาพแห่งชาติ (สปสช.)</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">เช็คสิทธิ์บัตรทอง เปลี่ยนแปลงสิทธิ์ ย้ายโรงพยาบาลบริการ</p>
                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-gray-50">
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <Phone size={12} /> สายด่วน 1330
                      </span>
                      <span className="text-[10px] text-emerald-500 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">โทรฟรี 24 ชม.</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-orange-100 shadow-xs flex items-start gap-3">
                  <div className="bg-orange-100 text-orange-600 p-2.5 rounded-xl">
                    <User size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-800">อาสาสมัครสาธารณสุขประจำหมู่บ้าน (อสม.)</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">อสม. ในหมู่บ้านคุณยาย: พี่สมใจ, น้าวันเพ็ญ พร้อมวัดความดันโลหิต</p>
                    <div className="flex justify-between items-center mt-2 pt-1 border-t border-gray-50">
                      <span className="text-xs text-orange-600 font-bold">ติดต่อด่วนผ่านระบบอาสา</span>
                      <button 
                        onClick={() => setCurrentScreen('REQUEST_VOLUNTEER')}
                        className="bg-orange-500 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-xs hover:bg-orange-600"
                      >
                        กดเรียก อสม.
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer action */}
              <button
                onClick={() => setCurrentScreen('REQUEST_VOLUNTEER')}
                className="w-full bg-[#38A169] hover:bg-[#2F855A] text-white py-3.5 rounded-2xl font-bold shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-auto"
              >
                <PhoneCall size={18} />
                <span>ติดต่อหน่วยงานหรือประสานอาสาสมัคร</span>
              </button>
            </motion.div>
          )}

          {/* SCREEN: HEALTH CONSULT AND HOSPITAL TRIP (ปรึกษาสุขภาพ / นำรถรับส่ง) */}
          {currentScreen === 'HEALTH_CONSULT' && (
            <motion.div 
              key="health_consult"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4 flex-1 text-sm"
            >
              {/* Header */}
              <div className="flex items-center gap-3 pb-1 border-b border-amber-100">
                <button 
                  onClick={() => setCurrentScreen('HOME')}
                  className="bg-amber-100 text-amber-800 p-2 rounded-full hover:bg-amber-200 transition-all"
                >
                  <ArrowLeft size={16} />
                </button>
                <h1 className="text-lg font-bold text-emerald-900">ช่วยเหลือสุขภาพผู้สูงอายุ</h1>
              </div>

              {healthActionType === null ? (
                // Step 1: Select Type of Help
                <div className="flex flex-col gap-4 py-2">
                  <p className="text-xs text-gray-500 font-medium text-center">คุณยายต้องการความช่วยเหลือด้านใดในวันนี้คะ?</p>
                  
                  <button
                    onClick={() => {
                      setHealthActionType('CONSULT');
                      setSelectedSymptom('');
                    }}
                    className="flex items-center gap-4 bg-white p-5 rounded-2xl border-2 border-emerald-100 hover:border-emerald-400 shadow-xs text-left cursor-pointer transition-all active:scale-98 group"
                  >
                    <div className="bg-emerald-500 text-white p-4 rounded-2xl group-hover:scale-105 transition-transform">
                      <MessageCircle size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-gray-800">1. ปรึกษาปัญหาสุขภาพเบื้องต้น</h4>
                      <p className="text-xs text-gray-500 mt-1">มีอาการไม่สบาย ปวดหัว ตัวร้อน ต้องการอาสาสมัครให้คำแนะนำเรื่องยาหรือดูแล</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setHealthActionType('HOSPITAL');
                      setSelectedSymptom('ต้องการคนช่วยเหลือพาเดินทางไปตรวจรักษาที่โรงพยาบาลใกล้เคียง');
                    }}
                    className="flex items-center gap-4 bg-white p-5 rounded-2xl border-2 border-sky-100 hover:border-sky-400 shadow-xs text-left cursor-pointer transition-all active:scale-98 group"
                  >
                    <div className="bg-sky-500 text-white p-4 rounded-2xl group-hover:scale-105 transition-transform">
                      <Hospital size={28} />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-gray-800">2. ขออาสาสมัครพาไปโรงพยาบาล</h4>
                      <p className="text-xs text-gray-500 mt-1">ต้องการคนเดินทางไปด้วย ไปรับที่บ้าน พาไปโรงพยาบาล และรอส่งกลับบ้านอย่างปลอดภัย</p>
                    </div>
                  </button>
                </div>
              ) : healthActionType === 'CONSULT' ? (
                // Step 2A: Consult Symptom select
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold text-gray-500">เลือกอาการที่คุณยายเป็นอยู่ปัจจุบัน :</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'เวียนหัว ปวดศีรษะ',
                      'ปวดหลัง ปวดเจ็บกระดูก',
                      'ปวดท้อง คลื่นไส้',
                      'แน่นหน้าอก หายใจขัด',
                      'มีไข้ หนาวสั่น',
                      'ต้องการปรึกษาการกินยา'
                    ].map((sym, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSymptom(sym)}
                        className={`p-3 rounded-xl border text-center font-bold text-xs cursor-pointer transition-all ${
                          selectedSymptom === sym 
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' 
                            : 'bg-white text-gray-700 border-amber-100 hover:bg-emerald-50'
                        }`}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2">
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">ระบุอาการเพิ่มเติม (ถ้ามี) :</label>
                    <textarea 
                      placeholder="เช่น มีไข้สูงมา 2 วันแล้ว ยังไม่ได้กินยาเลย..."
                      className="w-full bg-white border border-amber-200 rounded-xl p-3 text-xs focus:outline-none focus:border-emerald-400"
                      rows={3}
                      onChange={(e) => setSelectedSymptom(prev => e.target.value ? prev + " - " + e.target.value : prev)}
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!selectedSymptom) {
                        alert('กรุณาเลือกอาการก่อนค่ะ');
                        return;
                      }
                      handleRequestVolunteer('health', selectedSymptom, 'ปรึกษาสุขภาพกับอาสาสมัครผู้ดูแล');
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-bold shadow-md mt-2 transition-all"
                  >
                    ส่งข้อมูลให้หน่วยอาสาสมัคร
                  </button>
                  <button onClick={() => setHealthActionType(null)} className="text-xs text-gray-400 text-center hover:underline">ย้อนกลับไปเลือกประเภท</button>
                </div>
              ) : (
                // Step 2B: Hospital Companion matching
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold text-gray-500">เลือกสถานพยาบาลที่คุณยายประสงค์จะเดินทางไป :</p>
                  <div className="flex flex-col gap-2">
                    {hospitals.map((hosp, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedHospital(hosp)}
                        className={`p-3 rounded-xl border text-left font-bold text-xs cursor-pointer transition-all flex items-center justify-between ${
                          selectedHospital === hosp 
                            ? 'bg-sky-500 text-white border-sky-500 shadow-sm' 
                            : 'bg-white text-gray-700 border-amber-100 hover:bg-sky-50'
                        }`}
                      >
                        <span className="truncate pr-4">{hosp}</span>
                        {selectedHospital === hosp && <CheckCircle size={14} className="shrink-0" />}
                      </button>
                    ))}
                  </div>

                  {/* Nearest Volunteer to travel with */}
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 mt-1">
                    <p className="text-[11px] font-bold text-amber-800 mb-1.5 flex items-center gap-1">
                      <MapPin size={12} className="text-rose-500 animate-bounce" />
                      อาสาสมัครที่พร้อมเดินทางไปส่งคุณยายใกล้บ้าน :
                    </p>
                    <div className="flex flex-col gap-2">
                      {nearbyVolunteers.map((vol, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-amber-100/50">
                          <div className="flex items-center gap-2">
                            <img src={vol.image} alt={vol.name} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                            <div>
                              <p className="text-xs font-bold text-gray-700">{vol.name}</p>
                              <p className="text-[10px] text-gray-400">อยู่ใกล้คุณเพียง {vol.distance}</p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full">พร้อมช่วยทันที</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleRequestVolunteer(
                        'health', 
                        'ขอรถรับส่งและคนพาไปโรงพยาบาล', 
                        `จุดหมายปลายทาง: ${selectedHospital}`
                      );
                    }}
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3.5 rounded-2xl font-bold shadow-md transition-all"
                  >
                    ส่งสัญญานเรียกอาสาสมัครนำส่งโรงพยาบาล
                  </button>
                  <button onClick={() => setHealthActionType(null)} className="text-xs text-gray-400 text-center hover:underline">ย้อนกลับไปเลือกประเภท</button>
                </div>
              )}
            </motion.div>
          )}

          {/* SCREEN: REQUEST VOLUNTEER (หน้าขออาสาสมัครช่วย - เหมือนรูปที่ 3 บานซ้าย) */}
          {currentScreen === 'REQUEST_VOLUNTEER' && matchStatus === 'IDLE' && (
            <motion.div 
              key="req_vol_idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center gap-5 flex-1 p-4"
            >
              <div className="bg-pink-100 text-pink-600 p-6 rounded-full animate-bounce">
                <Heart size={44} className="fill-pink-500" />
              </div>
              
              <div>
                <h1 className="text-xl font-bold text-pink-900">ขออาสาสมัครช่วยเหลือ</h1>
                <p className="text-sm text-gray-500 mt-2">
                  ระบบจะทำการสุ่มหรือคัดเลือกอาสาสมัครสาธารณสุข (อสม.) ที่อยู่ใกล้บ้านคุณยายที่สุดเพื่อติดต่อและเดินทางมาช่วยค่ะ
                </p>
              </div>

              {/* Character Illustration Mock (เหมือนรูป 3 บานซ้าย) */}
              <div className="my-2 p-4 bg-white rounded-3xl border border-amber-100 shadow-xs w-full max-w-[280px]">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" 
                  alt="Volunteer illustration" 
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-pink-100"
                  referrerPolicy="no-referrer"
                />
                <h4 className="text-sm font-bold text-gray-800 mt-2">อาสาสมัครพร้อมช่วยคุณ</h4>
                <p className="text-xs text-gray-400 mt-1">มีอาสาสมัครแสตนด์บายอยู่ในระบบ 24 ชม.</p>
              </div>

              <div className="w-full flex flex-col gap-2 mt-auto">
                <button
                  onClick={() => handleRequestVolunteer('health', 'ขอคำปรึกษาด้านสุขภาพเบื้องต้นทั่วไป', 'ต้องการคำปรึกษาทั่วไป')}
                  className="w-full bg-[#E53E3E] hover:bg-red-600 text-white py-3.5 rounded-2xl font-bold text-base shadow-md transition-all active:scale-95"
                >
                  ส่งสัญญานขออาสาสมัครช่วยด่วน
                </button>
                <button
                  onClick={() => setCurrentScreen('HOME')}
                  className="w-full border-2 border-gray-200 text-gray-500 py-2.5 rounded-2xl font-semibold text-xs hover:bg-gray-50"
                >
                  ไม่เป็นไร ข้อมูลเพียงพอแล้ว
                </button>
              </div>
            </motion.div>
          )}

          {/* SCREEN: CONNECTING (กำลังเชื่อมต่อ - เหมือนรูปที่ 3 บานขวา) */}
          {(currentScreen === 'REQUEST_VOLUNTEER' || currentScreen === 'SOS_ACTIVE') && matchStatus === 'CONNECTING' && (
            <motion.div 
              key="connecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center gap-6 flex-1 p-4"
            >
              <h1 className="text-xl font-bold text-gray-800">กำลังเชื่อมต่ออาสา</h1>
              <p className="text-xs text-gray-400">กำลังจับคู่หาอาสาสมัครที่ใกล้ที่สุด กรุณารอสักครู่ค่ะ...</p>

              {/* Connecting Circle Animation (รูปที่ 3 ขวาสุด) */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-amber-200 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 border-2 border-dotted border-amber-400 rounded-full animate-spin [animation-duration:8s]"></div>
                
                {/* Simulated radar overlay */}
                <div className="w-28 h-28 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden border border-amber-300 shadow-inner">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" 
                    alt="volunteer search" 
                    className="w-20 h-20 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="absolute bottom-1 right-3 flex gap-1">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                </div>
              </div>

              {/* Tip info box */}
              <div className="bg-white border border-amber-100 p-3 rounded-xl shadow-xs w-full max-w-xs text-xs text-left">
                <p className="font-bold text-gray-700 flex items-center gap-1 mb-1">
                  <AlertCircle size={14} className="text-amber-500" /> ข้อมูลที่ส่งถึงอาสา :
                </p>
                <p className="text-gray-500 font-semibold truncate"><span className="text-gray-400">อาการ:</span> {currentRequest?.symptom}</p>
                <p className="text-gray-500 font-semibold truncate"><span className="text-gray-400">ประเภท:</span> {currentRequest?.categoryLabel}</p>
              </div>

              {/* Quick tip instructing how to test */}
              <div className="bg-sky-50 text-sky-800 text-[11px] p-2.5 rounded-lg border border-sky-100 w-full max-w-xs leading-relaxed">
                💡 **วิธีการทดสอบสัญญานจับคู่:** สลับไปดูแอป "ฝั่งอาสาสมัคร" เพื่อดูรายการและกด "รับงาน" ได้แบบเรียลไทม์! (หรือระบบจะเชื่อมต่อเองใน 5 วินาที)
              </div>

              <button
                onClick={handleCancelConnection}
                className="w-full max-w-[200px] border border-gray-300 text-gray-500 py-2.5 rounded-full font-bold hover:bg-gray-50 transition-all text-xs"
              >
                ยกเลิกขอความช่วยเหลือ
              </button>
            </motion.div>
          )}

          {/* SCREEN: CONNECTED ACTIVE CHAT & CALL (เชื่อมต่อสำเร็จคุยกับอาสาสมัคร - เหมือนรูปที่ 5) */}
          {matchStatus === 'CONNECTED' && (
            <motion.div 
              key="connected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col flex-1 h-full"
            >
              {/* Connected Header */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" 
                    alt="Assigned Volunteer"
                    className="w-10 h-10 rounded-full border border-amber-300 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h1 className="text-sm font-bold text-gray-800">อาสา สมหญิง ใจดี</h1>
                    <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                      กำลังช่วยเหลือคุณอยู่ (ออนไลน์)
                    </p>
                  </div>
                </div>

                {/* Video Call Trigger */}
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => setAppState(prev => ({ ...prev, isVideoActive: true }))}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full shadow-md transition-colors"
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
                    className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md"
                  >
                    เสร็จสิ้นงาน
                  </button>
                </div>
              </div>

              {/* Video Call Overlay (ถ้าเปิดวิดีโอ - รูปที่ 5 บานขวา) */}
              {isVideoActive ? (
                <div className="flex-1 flex flex-col relative bg-zinc-950 rounded-2xl overflow-hidden my-3">
                  {/* Large Grandma screen */}
                  <div className="absolute inset-0">
                    <img 
                      src={elderlyPhoto} 
                      alt="Grandmother full screen" 
                      className="w-full h-full object-cover opacity-90"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  {/* Small PIP of Volunteer */}
                  <div className="absolute bottom-16 right-3 w-28 h-36 rounded-xl border-2 border-white overflow-hidden shadow-md z-10">
                    <img 
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" 
                      alt="Volunteer PIP" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Header over video */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 text-white bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-xs">
                    <span className="text-xs font-bold flex items-center gap-1">
                      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></span>
                      วิดีโอคอลกับคุณยาย (01:12)
                    </span>
                  </div>

                  {/* Controls below */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                    <button className="bg-gray-800/80 p-2.5 rounded-full text-white hover:bg-gray-700">
                      <PhoneCall size={16} />
                    </button>
                    <button 
                      onClick={() => setAppState(prev => ({ ...prev, isVideoActive: false }))}
                      className="bg-rose-600 hover:bg-rose-700 p-3 rounded-full text-white shadow-lg active:scale-95"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                // Chat messaging window with Volunteer
                <div className="flex-1 flex flex-col h-full my-3">
                  <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 text-sm">
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
                            <span className="text-[10px] text-gray-400 mb-0.5">{msg.sender === 'elderly' ? 'คุณยาย' : 'อาสา สมหญิง'}</span>
                            <div 
                              className={`p-3 rounded-2xl ${
                                msg.sender === 'elderly' 
                                  ? 'bg-[#E53E3E] text-white rounded-tr-none shadow-xs' 
                                  : 'bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-tl-none shadow-xs'
                              }`}
                            >
                              <p className="font-semibold">{msg.text}</p>
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
                      placeholder="พิมพ์คุยกับอาสาที่นี่..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 bg-white border border-amber-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-full shadow-md transition-transform active:scale-95"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* SCREEN: SOS ACTIVE TRIGGER RED OVERLAY */}
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
              
              <h1 className="text-3xl font-black mt-8 tracking-wider">ส่งสัญญาณ SOS</h1>
              <p className="text-sm font-semibold opacity-90 mt-2">กำลังแจ้งรถพยาบาลฉุกเฉิน 1669</p>
              
              <div className="mt-8 bg-white/10 backdrop-blur-xs p-4 rounded-2xl w-full max-w-xs text-xs">
                <p className="font-bold flex items-center justify-center gap-1 text-sm mb-1.5">
                  <MapPin size={14} className="text-yellow-300" /> ตรวจพบตำแหน่งปัจจุบัน :
                </p>
                <p className="opacity-90 font-medium text-center">บ้านเลขที่ 124 หมู่ 3 ต.บ้านบอน จ.ขอนแก่น</p>
              </div>

              <div className="mt-12 flex flex-col gap-3 w-full max-w-xs">
                <a 
                  href="tel:1669" 
                  className="bg-white text-rose-600 py-3.5 rounded-2xl font-black shadow-lg transition-transform active:scale-95 text-base flex items-center justify-center gap-2"
                >
                  <Phone size={20} />
                  <span>โทรสายด่วน 1669 ทันที</span>
                </a>
                <button
                  onClick={handleCancelConnection}
                  className="border border-white/40 text-white/80 py-2.5 rounded-2xl font-bold hover:bg-white/10 text-xs"
                >
                  ยกเลิก (เมื่อกดผิดพลาด)
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* BOTTOM NAVIGATION BAR (เหมือนรูปที่ 1 บานซ้ายสุด) */}
      <div className="bg-white border-t border-amber-100 px-4 py-2.5 flex justify-around items-center shrink-0">
        <button 
          onClick={() => handleTabClick('home')}
          className={`flex flex-col items-center justify-center cursor-pointer transition-all ${activeTabElderly === 'home' ? 'text-amber-500 scale-105' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Home size={20} />
          <span className="text-[10px] font-bold mt-1">หน้าแรก</span>
        </button>

        <button 
          onClick={() => handleTabClick('history')}
          className={`flex flex-col items-center justify-center cursor-pointer transition-all ${activeTabElderly === 'history' ? 'text-amber-500 scale-105' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Clock size={20} />
          <span className="text-[10px] font-bold mt-1">ประวัติ</span>
        </button>

        <button 
          onClick={() => {
            handleTabClick('call');
            // Trigger quick dial call simulation
            alert('กำลังจำลองโทรศัพท์ติดต่อไปยัง รพ.สต. หรืออาสาสมัครในพื้นที่ เบอร์ด่วน: 1669 หรือสายตรง 01-2345-678');
          }}
          className={`flex flex-col items-center justify-center cursor-pointer transition-all ${activeTabElderly === 'call' ? 'text-amber-500 scale-105' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <PhoneCall size={20} className="text-emerald-500" />
          <span className="text-[10px] font-bold mt-1">โทรหาอาสา</span>
        </button>

        <button 
          onClick={() => handleTabClick('notif')}
          className={`flex flex-col items-center justify-center cursor-pointer transition-all ${activeTabElderly === 'notif' ? 'text-amber-500 scale-105' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <div className="relative">
            <Bell size={20} />
            <span className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </div>
          <span className="text-[10px] font-bold mt-1">แจ้งเตือน</span>
        </button>

        <button 
          onClick={() => handleTabClick('settings')}
          className={`flex flex-col items-center justify-center cursor-pointer transition-all ${activeTabElderly === 'settings' ? 'text-amber-500 scale-105' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Settings size={20} />
          <span className="text-[10px] font-bold mt-1">ตั้งค่า</span>
        </button>
      </div>

    </div>
  );
}
