'use client';

import { useState, useEffect } from 'react';

// Custom SVG Icons
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const PillIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LogOutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const StethoscopeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

// Inline Mock Medical Records for client-side offline fallback
const clientMockPatients = {
  '1234567': {
    patient: { hn: '1234567', pname: 'นาย', fname: 'สมชาย', lname: 'ดีใจ', cid: '1-1002-00345-67-8', sex: '1', birthday: '1981-05-15', age: 45 },
    allergies: [{ report_date: '2024-03-10', agent: 'Penicillin G', symptom: 'Maculopapular rash (ผื่นคันแดงตัว)' }],
    chronics: [{ clinic_name: 'Hypertension Clinic (คลินิกความดันโลหิตสูง)' }, { clinic_name: 'Dyslipidemia Clinic (คลินิกไขมันในเลือดสูง)' }],
    visits: [
      { vn: '6806210001', an: null, vstdate: '2026-06-21', vsttime: '08:30:00', department: 'OPD CARDIOVASCULAR' },
      { vn: '6805150042', an: null, vstdate: '2026-05-15', vsttime: '09:15:00', department: 'OPD CARDIOVASCULAR' },
      { vn: '6803100088', an: '6800012', vstdate: '2026-03-10', vsttime: '14:20:00', department: 'MED WARD 3' },
      { vn: '6712050012', an: null, vstdate: '2025-12-05', vsttime: '08:00:00', department: 'OPD GENERAL' }
    ]
  },
  '1020304': {
    patient: { hn: '1020304', pname: 'นาง', fname: 'วัลลภา', lname: 'ชูชีพ', cid: '3-1009-00998-11-2', sex: '2', birthday: '1964-08-12', age: 62 },
    allergies: [{ report_date: '2021-11-05', agent: 'Co-trimoxazole (Bactrim)', symptom: 'Stevens-Johnson syndrome (แพ้ผิวหนังลอกรุนแรง)' }],
    chronics: [{ clinic_name: 'Diabetes Mellitus Clinic (คลินิกเบาหวาน)' }, { clinic_name: 'Chronic Kidney Disease Clinic (คลินิกโรคไตเรื้อรัง Stage 3)' }],
    visits: [
      { vn: '6806200021', an: null, vstdate: '2026-06-20', vsttime: '09:00:00', department: 'OPD DIABETIC' },
      { vn: '6803180015', an: null, vstdate: '2026-03-18', vsttime: '08:45:00', department: 'OPD DIABETIC' }
    ]
  }
};

const clientMockVisits = {
  '6806210001': {
    screening: {
      vn: '6806210001', vstdate: '2026-06-21', vsttime: '08:30:00', bps: 138, bpd: 82, bw: 74.5, height: 170, bmi: 25.78, waist: 92, pulse: 76, temperature: 36.6, rr: 18,
      cc: 'มาตรวจตามนัดคลินิกความดันโลหิตสูงและไขมัน รู้สึกสบายดี ไม่มีเจ็บหน้าอกหรือเหนื่อยง่าย',
      hpi: 'ผู้ป่วยความดันและไขมันสูง ทานยาสมบูรณ์ต่อเนื่อง ปฏิเสธสุราบุหรี่ ปรับอาหารเค็มปานกลาง',
      pe: 'HEENT: clear, no pale. Heart: regular rhythm, normal S1 S2. Lung: clear.'
    },
    drugs: [
      { order_no: 101, rxdate: '2026-06-21', item_no: 1, qty: 30, drug_name: 'Amlodipine 5 mg Tablet', drug_usage: 'รับประทานครั้งละ 1 เม็ด วันละ 1 ครั้ง หลังอาหารเช้า' },
      { order_no: 102, rxdate: '2026-06-21', item_no: 2, qty: 30, drug_name: 'Atorvastatin 20 mg Tablet', drug_usage: 'รับประทานครั้งละ 1 เม็ด วันละ 1 ครั้ง ก่อนนอน' },
      { order_no: 103, rxdate: '2026-06-21', item_no: 3, qty: 20, drug_name: 'Losartan 50 mg Tablet', drug_usage: 'รับประทานครั้งละ 1 เม็ด วันละ 1 ครั้ง หลังอาหารเช้า' }
    ],
    labs: [
      { lab_name: 'Creatinine : Chemistry', result: '0.95', unit: 'mg/dL', normal_value: '0.67 - 1.17', confirm: 'Y', sub_group: 'BIOCHEMISTRY' },
      { lab_name: 'eGFR (CKD-EPI) : Chemistry', result: '92.4', unit: 'mL/min/1.73 m2', normal_value: '> 90', confirm: 'Y', sub_group: 'BIOCHEMISTRY' },
      { lab_name: 'LDL Cholesterol : Chemistry', result: '124', unit: 'mg/dL', normal_value: '< 100', confirm: 'Y', sub_group: 'LIPID PROFILE' }
    ],
    xrays: [],
    appointments: [{ nextdate: '2026-09-21', nexttime: '09:00:00', clinic_name: 'Cardiovascular Clinic', doctor_name: 'นพ. สมเกียรติ รักดี', note: 'งดน้ำงดอาหาร 8 ชั่วโมงก่อนมาเจาะเลือดตรวจไขมัน' }],
    referrals: [], referins: [], admission: null,
    diagnoses: [
      { icd10: 'I10', diagtype_name: 'PRINCIPLE DIAGNOSIS', icd10_name: 'Essential (primary) hypertension', icd10_tname: 'โรคความดันโลหิตสูงไม่ทราบสาเหตุ', doctor_name: 'นพ. สมเกียรติ รักดี' }
    ],
    procedures: []
  },
  '6803100088': {
    screening: {
      vn: '6803100088', vstdate: '2026-03-10', vsttime: '14:20:00', bps: 155, bpd: 92, bw: 74.0, height: 170, bmi: 25.61, waist: 92, pulse: 98, temperature: 38.5, rr: 22,
      cc: 'ไข้สูง หนาวสั่น ไอมีเสมหะเหนียวข้น เจ็บชายโครงขวา หายใจเหนื่อย 1 วันก่อนมารพ.',
      hpi: 'มีไข้ต่ำๆ มา 3 วัน วันนี้หอบเหนื่อย ไข้ขึ้นสูงหนาวสั่นอย่างรวดเร็ว เจ็บทรวงอกเวลาไอ',
      pe: 'Lung: Decreased breath sound with crepitation right lower lung field.'
    },
    drugs: [
      { order_no: 150, rxdate: '2026-03-10', item_no: 1, qty: 5, drug_name: 'Ceftriaxone 1 g IV Injection', drug_usage: 'ให้ยาทางหลอดเลือดดำ (IV) 1 g วันละ 1 ครั้ง' },
      { order_no: 151, rxdate: '2026-03-10', item_no: 2, qty: 10, drug_name: 'Paracetamol 500 mg Tablet', drug_usage: 'รับประทานครั้งละ 1 เม็ด ทุก 4-6 ชั่วโมง เวลามีอาการไข้หรือปวด' }
    ],
    labs: [
      { lab_name: 'WBC Count : CBC', result: '14,800', unit: '/uL', normal_value: '4,000 - 10,000', confirm: 'Y', sub_group: 'HEMATOLOGY' },
      { lab_name: 'Neutrophil : CBC', result: '82', unit: '%', normal_value: '40 - 70', confirm: 'Y', sub_group: 'HEMATOLOGY' }
    ],
    xrays: [
      { xray_items_name: 'Chest PA Upright', type_name: 'Chest', xn: 'X680310-09', request_doctor_name: 'พญ. วริศรา ใจงาม', report_text: 'CHEST AP UPRIGHT:\nInfiltration at right lower lung zone.\nNo cardiomegaly. Normal pulmonary vascularity.\nNo pleural effusion or pneumothorax.\nIMPRESSION: Right lower lobe pneumonia.' }
    ],
    appointments: [], referrals: [], referins: [],
    admission: { an: '6800012', regdate: '2026-03-10', regtime: '15:30:00', dchdate: '2026-03-15', dchtime: '11:00:00', ward_name: 'MED WARD 3 (อายุรกรรมชาย 3)', doctor_name: 'พญ. วริศรา ใจงาม', prediag: 'Community-acquired pneumonia' },
    diagnoses: [
      { icd10: 'J18.9', diagtype_name: 'PRINCIPLE DIAGNOSIS', icd10_name: 'Pneumonia, unspecified', icd10_tname: 'ปอดอักเสบ ไม่ระบุรายละเอียด', doctor_name: 'พญ. วริศรา ใจงาม' }
    ],
    procedures: [{ icd9: '99.21', icd9_name: 'Injection of antibiotic', begin_date_time: '2026-03-10 16:00:00', doctor_name: 'พญ. วริศรา ใจงาม' }]
  }
};

export default function App() {
  const [session, setSession] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Search and Patient details states
  const [searchHn, setSearchHn] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Selected visit details state
  const [selectedVn, setSelectedVn] = useState('');
  const [visitDetails, setVisitDetails] = useState(null);
  const [visitLoading, setVisitLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('vitals');

  // Load session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('emr_session');
    if (savedSession) {
      try {
        setSession(JSON.parse(savedSession));
        const savedHn = localStorage.getItem('emr_hn');
        const savedVn = localStorage.getItem('emr_vn');
        if (savedHn) {
          setSearchHn(savedHn);
          handleSearchPatient(savedHn, savedVn);
        }
      } catch (e) {
        localStorage.removeItem('emr_session');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'การเข้าสู่ระบบล้มเหลว');
      }

      setSession(data);
      localStorage.setItem('emr_session', JSON.stringify(data));
    } catch (err) {
      // Fallback: หาก API ล็อกอินล้มเหลว (เช่น DB ออฟไลน์) ให้ยอมรับ demo / password หรือ admin
      console.warn('Login API offline, falling back to mock authentication.');
      if (loginForm.username === 'demo' || loginForm.username === 'admin') {
        const mockData = {
          success: true,
          message: 'Login successful (Mock)',
          user: {
            username: loginForm.username,
            name: loginForm.username === 'demo' ? 'นพ. สมเกียรติ รักดี (แพทย์ทดสอบ)' : 'พญ. วริศรา ใจงาม (ผู้ดูแลระบบ)',
            doctorCode: loginForm.username === 'demo' ? 'D9999' : 'A0001',
            group: loginForm.username === 'demo' ? 'PHYSICIAN' : 'ADMINISTRATOR',
            department: 'OPD CARDIOVASCULAR'
          },
          token: 'mock-token-12345',
          isMock: true
        };
        setSession(mockData);
        localStorage.setItem('emr_session', JSON.stringify(mockData));
      } else {
        setLoginError('ชื่อผู้ใช้หรือรหัสผ่านผิดพลาด (ทดลองใช้ demo หรือ admin)');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    setPatientData(null);
    setVisitDetails(null);
    setSelectedVn('');
    setSearchHn('');
    localStorage.removeItem('emr_session');
    localStorage.removeItem('emr_hn');
    localStorage.removeItem('emr_vn');
  };

  async function handleSearchPatient(hnToSearch, preferredVn) {
    const hn = hnToSearch || searchHn;
    if (!hn.trim()) return;

    setSearchLoading(true);
    setSearchError('');
    setPatientData(null);
    setVisitDetails(null);
    setSelectedVn('');

    try {
      const res = await fetch(`/api/patients/${hn.trim()}`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'ไม่พบข้อมูลผู้ป่วย');
      }

      setPatientData(result.data);
      localStorage.setItem('emr_hn', hn.trim());
      
      const visits = result.data.visits || [];
      if (visits.length > 0) {
        const targetVn = preferredVn && visits.some(v => v.vn === preferredVn)
          ? preferredVn
          : visits[0].vn;
        handleSelectVisit(targetVn);
      }
    } catch (err) {
      // Fallback: หากดึงผ่าน API ล้มเหลว ให้ดึงจาก Client-side mockData โดยตรง
      console.warn('Patient API offline, using client-side mock data fallback for HN:', hn);
      const mockPatient = clientMockPatients[hn.trim()] || clientMockPatients['1234567'];
      if (mockPatient) {
        const patientCopy = { ...mockPatient.patient };
        if (!clientMockPatients[hn.trim()]) {
          patientCopy.hn = hn.trim();
          patientCopy.fname = `${patientCopy.fname} (Demo)`;
        }
        const finalMock = { ...mockPatient, patient: patientCopy, isMock: true };
        setPatientData(finalMock);
        localStorage.setItem('emr_hn', hn.trim());
        
        const visits = finalMock.visits || [];
        if (visits.length > 0) {
          const targetVn = preferredVn && visits.some(v => v.vn === preferredVn)
            ? preferredVn
            : visits[0].vn;
          handleSelectVisit(targetVn);
        }
      } else {
        setSearchError('ไม่สามารถดึงข้อมูลได้และไม่พบตัวเลือก HN ในสารระบบจำลอง');
      }
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleSelectVisit(vn) {
    setSelectedVn(vn);
    localStorage.setItem('emr_vn', vn);
    setVisitLoading(true);
    setVisitDetails(null);

    try {
      const res = await fetch(`/api/visits/${vn}`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'ไม่พบรายละเอียด Visit');
      }

      setVisitDetails(result.data);
    } catch (err) {
      // Fallback: หากดึงรายละเอียด Visit ล้มเหลว ให้ใช้ข้อมูลจำลองจาก Client-side
      console.warn('Visit API offline, using client-side mock data fallback for VN:', vn);
      const mockVisit = clientMockVisits[vn] || clientMockVisits['6806210001'];
      if (mockVisit) {
        setVisitDetails({ ...mockVisit, isMock: true });
      }
    } finally {
      setVisitLoading(false);
    }
  }

  const getSexLabel = (sex) => {
    if (sex === '1') return 'ชาย';
    if (sex === '2') return 'หญิง';
    return 'ไม่ระบุ';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (!session) {
    // LOGIN SCREEN - Premium Light Pink & White Color Scheme
    return (
      <div className="flex min-h-screen items-center justify-center bg-rose-50/30 p-6 relative overflow-hidden">
        {/* Soft Pink Background Glows */}
        <div className="absolute top-0 -left-12 w-[500px] h-[500px] bg-rose-200 rounded-full filter blur-[150px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 -right-12 w-[500px] h-[500px] bg-pink-100 rounded-full filter blur-[150px] opacity-40 animate-pulse"></div>

        <div className="w-full max-w-md bg-white border border-rose-100/80 p-8 rounded-3xl shadow-xl shadow-rose-100/40 backdrop-blur-md flex flex-col gap-8 relative z-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="bg-rose-500/10 text-rose-500 p-3.5 rounded-2xl border border-rose-200/50">
              <StethoscopeIcon />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-rose-900 mt-2">
              HOSxP EMR Portal
            </h1>
            <p className="text-sm text-rose-700/80 font-medium">
              ระบบสืบค้นเวชระเบียนผู้ป่วยอิเล็กทรอนิกส์ (EMR)
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-rose-800 tracking-wider uppercase">Username</label>
              <input
                type="text"
                placeholder="ระบุรหัสเข้าใช้งาน เช่น demo"
                required
                className="w-full bg-rose-50/20 border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-955 placeholder-rose-300 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-rose-800 tracking-wider uppercase">Password</label>
              <input
                type="password"
                placeholder="ระบุรหัสผ่าน"
                required
                className="w-full bg-rose-50/20 border border-rose-100 rounded-xl px-4 py-3 text-sm text-rose-900 placeholder-rose-300 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>

            {loginError && (
              <div className="bg-rose-100 border border-rose-200 text-rose-600 text-xs p-3 rounded-lg text-center font-bold">
                ⚠️ {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 disabled:opacity-50 transition duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loginLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'เข้าสู่ระบบ EMR'
              )}
            </button>
          </form>

          {/* Quick Demo Mode Options */}
          <div className="border-t border-rose-100 pt-6 flex flex-col gap-3">
            <span className="text-xs text-center text-rose-700/70 font-semibold">ทดลองใช้งานโปรแกรมด้วยข้อมูลจำลอง (Demo Mode)</span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setLoginForm({ username: 'demo', password: 'password' });
                  setLoginError('');
                }}
                className="bg-rose-50/60 hover:bg-rose-50 border border-rose-100 text-rose-800 text-xs font-bold py-2 px-3 rounded-lg text-center transition cursor-pointer"
              >
                ผู้ใช้ทดสอบ: demo
              </button>
              <button
                onClick={() => {
                  setLoginForm({ username: 'admin', password: 'password' });
                  setLoginError('');
                }}
                className="bg-rose-50/60 hover:bg-rose-50 border border-rose-100 text-rose-800 text-xs font-bold py-2 px-3 rounded-lg text-center transition cursor-pointer"
              >
                ผู้ใช้จำลอง: admin
              </button>
            </div>
            <p className="text-[10px] text-center text-rose-600 leading-normal font-medium">
              *ระบุชื่อผู้ใช้และรหัสผ่านของท่าน หรือกดเลือกปุ่มทดลองใช้งานเพื่อทดสอบระบบหน้าบ้าน
            </p>
          </div>
        </div>
      </div>
    );
  }

  // APP DASHBOARD SCREEN - Pink & White Light Theme
  return (
    <div className="min-h-screen bg-rose-50/20 text-zinc-800 font-sans flex flex-col antialiased">
      
      {/* Top Header with Search and Shortcuts */}
      <header className="bg-white border-b border-rose-100 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between gap-6 shadow-sm shadow-rose-100/10">
        <div className="flex items-center gap-6 flex-1 max-w-4xl">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="bg-rose-500/10 text-rose-500 p-1.5 rounded-lg border border-rose-200/50">
              <StethoscopeIcon />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-rose-900 tracking-wide leading-none">HOSxP EMR</h1>
              <p className="text-[9px] text-rose-600 font-bold tracking-wider uppercase mt-0.5">Records Portal</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm">
            <input
              type="text"
              placeholder="ค้นหา HN (เช่น 1234567)"
              className="w-full bg-rose-50/40 border border-rose-100 rounded-lg pl-9 pr-3 py-1.5 text-xs text-rose-955 placeholder-rose-300 focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition"
              value={searchHn}
              onChange={(e) => setSearchHn(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchPatient()}
            />
            <div className="absolute left-3 top-2 text-rose-400">
              <SearchIcon />
            </div>
          </div>

          {/* Quick Demo Patients shortcuts */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-rose-700/60 font-bold">ทางลัด:</span>
            <button
              onClick={() => {
                setSearchHn('1234567');
                handleSearchPatient('1234567');
              }}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-[10px] py-1 px-2 rounded-md text-rose-800 font-bold transition cursor-pointer"
            >
              สมชาย (1234567)
            </button>
            <button
              onClick={() => {
                setSearchHn('1020304');
                handleSearchPatient('1020304');
              }}
              className="bg-rose-50 hover:bg-rose-100 border border-rose-100 text-[10px] py-1 px-2 rounded-md text-rose-800 font-bold transition cursor-pointer"
            >
              วัลลภา (1020304)
            </button>
          </div>
        </div>

        {/* User Info Bar */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden lg:flex items-center gap-3 text-right">
            <div>
              <p className="text-xs font-bold text-rose-900">{session.user.name}</p>
              <p className="text-[10px] text-rose-700/80 font-bold">
                {session.user.department} ({session.user.group})
              </p>
            </div>
            <div className="bg-rose-50 text-rose-500 p-2 rounded-full border border-rose-100">
              <UserIcon />
            </div>
          </div>

          {(session.isMock || patientData?.isMock || visitDetails?.isMock) && (
            <div className="bg-rose-500/10 border border-rose-200 text-rose-600 text-[9px] font-extrabold py-1 px-2 rounded-full tracking-wide">
              DEMO
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-2 rounded-lg hover:bg-rose-100 text-rose-600 border border-rose-100 transition cursor-pointer"
            title="Log Out"
          >
            <LogOutIcon />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row p-6 gap-6 overflow-hidden">
        {searchError && (
          <div className="w-full bg-rose-100 border border-rose-200 text-rose-700 text-sm p-4 rounded-xl text-center self-start shadow-sm font-semibold">
            ⚠️ {searchError} (กรุณาลองรหัส HN 1234567 หรือ 1020304)
          </div>
        )}

        {!patientData && !searchError && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 gap-4 border-2 border-dashed border-rose-200 rounded-3xl bg-white shadow-sm">
            <div className="p-4 bg-rose-50 rounded-full text-rose-400 border border-rose-100">
              <SearchIcon />
            </div>
            <div>
              <h3 className="text-md font-bold text-rose-900">ยังไม่ได้ระบุข้อมูลผู้ป่วย</h3>
              <p className="text-sm text-rose-700/60 mt-1 max-w-sm font-medium">
                กรุณาระบุรหัส HN ที่ต้องการค้นหา หรือใช้ปุ่มกดเลือกสมชายหรือวัลลภาที่ด้านบนเพื่อดูตัวอย่างประวัติการรักษาพยาบาล
              </p>
            </div>
          </div>
        )}

        {patientData && (
          <div className="w-full flex flex-col gap-6">
            
            {/* 1. Patient Profile Summary Panel - Pink Highlights */}
            <div className="bg-white border border-rose-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 relative shadow-sm shadow-rose-100/30">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100 text-rose-500 font-extrabold text-2xl">
                  {patientData.patient.sex === '1' ? '👨' : '👩'}
                </div>
                <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
                  <h2 className="text-xl font-bold text-rose-955 flex items-center gap-2.5">
                    {patientData.patient.pname}{patientData.patient.fname} {patientData.patient.lname}
                    <span className="text-xs bg-rose-500/10 border border-rose-200 text-rose-700 font-extrabold px-2 py-0.5 rounded-md">
                      HN: {patientData.patient.hn}
                    </span>
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-rose-800/80 mt-1 justify-center md:justify-start font-medium">
                    <span>เพศ: <strong className="text-rose-900">{getSexLabel(patientData.patient.sex)}</strong></span>
                    <span>อายุ: <strong className="text-rose-900">{patientData.patient.age} ปี</strong></span>
                    <span>วันเกิด: <strong className="text-rose-900">{formatDate(patientData.patient.birthday)}</strong></span>
                    <span>เลขบัตรประชาชน: <strong className="text-rose-900">{patientData.patient.cid}</strong></span>
                  </div>

                  {/* Chronic Diseases */}
                  {patientData.chronics && patientData.chronics.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 items-center mt-3">
                      <span className="text-[10px] text-rose-700 font-extrabold uppercase tracking-wider">โรคประจำตัว:</span>
                      {patientData.chronics.map((c, i) => (
                        <span key={i} className="text-[11px] bg-rose-50 border border-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full font-bold">
                          {c.clinic_name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Drug Allergy Warnings - Soft Blinking Warning block */}
              {patientData.allergies && patientData.allergies.length > 0 ? (
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3 md:max-w-md w-full md:w-auto self-stretch md:self-auto shadow-sm">
                  <div className="text-rose-600 mt-0.5">
                    <AlertIcon />
                  </div>
                  <div>
                    <h4 className="text-rose-700 font-extrabold text-xs tracking-wider uppercase">ระวัง: ประวัติแพ้ยา (Drug Allergy)</h4>
                    {patientData.allergies.map((a, i) => (
                      <div key={i} className="mt-1 text-xs text-rose-700 font-bold leading-relaxed">
                        💊 {a.agent} → <span className="text-rose-900 font-medium">{a.symptom}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50/30 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-600 text-xs self-stretch md:self-auto font-bold">
                  ✔️ ไม่มีประวัติการแพ้ยาในฐานข้อมูล
                </div>
              )}
            </div>

            {/* Dashboard Workspace */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* 2. Left Side: Visits Timeline Column - Locked Header */}
              <div className="lg:col-span-4 bg-white border border-rose-100 rounded-2xl flex flex-col shadow-sm max-h-[600px] lg:max-h-[calc(100vh-220px)] overflow-hidden lg:sticky lg:top-[96px]">
                <div className="p-4 border-b border-rose-100 bg-rose-50/20 flex items-center justify-between">
                  <h3 className="font-extrabold text-rose-955 text-sm">ประวัติการตรวจรักษา ({patientData.visits ? patientData.visits.length : 0} Visits)</h3>
                  <span className="text-[10px] bg-rose-500/10 border border-rose-200 text-rose-700 py-0.5 px-2 rounded-md font-extrabold">ล่าสุด</span>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-rose-50/80">
                  {patientData.visits && patientData.visits.length > 0 ? (
                    patientData.visits.map((v) => {
                      const isSelected = selectedVn === v.vn;
                      const hasAn = !!v.an;
                      return (
                        <button
                          key={v.vn}
                          onClick={() => handleSelectVisit(v.vn)}
                          className={`w-full text-left p-4 transition-all duration-150 relative cursor-pointer flex flex-col gap-2 ${
                            isSelected
                              ? 'bg-rose-50/80 border-l-4 border-rose-500'
                              : 'hover:bg-rose-50/20 border-l-4 border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-rose-955">
                              {formatDate(v.vstdate)} {v.vsttime ? `เวลา ${v.vsttime.substring(0, 5)} น.` : ''}
                            </span>
                            <span className="text-[9px] text-rose-400 font-mono font-bold">VN: {v.vn}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-rose-900 font-semibold truncate max-w-[180px]">{v.department}</span>
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                              hasAn ? 'bg-amber-100 border border-amber-200 text-amber-700' : 'bg-rose-50 border border-rose-100 text-rose-600'
                            }`}>
                              {hasAn ? `IPD (AN: ${v.an})` : 'OPD'}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-zinc-400 text-xs">ไม่พบข้อมูลประวัติการรักษา</div>
                  )}
                </div>
              </div>

              {/* 3. Right Side: Visit Details Viewer - Locked Header */}
              <div className="lg:col-span-8 bg-white border border-rose-100 rounded-2xl flex flex-col shadow-sm max-h-[600px] lg:max-h-[calc(100vh-220px)] overflow-hidden lg:sticky lg:top-[96px]">
                <div className="p-4 border-b border-rose-100 bg-rose-50/20 flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-rose-700 font-bold">รายละเอียดของ Visit:</span>
                    <strong className="text-sm text-rose-950 font-extrabold">{selectedVn || 'กรุณาเลือก Visit'}</strong>
                  </div>
                  {visitDetails?.isMock && (
                    <span className="text-[10px] bg-rose-500/10 border border-rose-200 text-rose-600 py-0.5 px-2 rounded-md font-extrabold">
                      DEMO VISIT DATA
                    </span>
                  )}
                </div>

                {/* Tabs Selector */}
                <div className="flex overflow-x-auto bg-white border-b border-rose-100 text-xs font-bold px-2 divide-x divide-rose-50">
                  <button
                    onClick={() => setActiveTab('vitals')}
                    className={`py-3 px-4 transition-all duration-150 whitespace-nowrap cursor-pointer ${
                      activeTab === 'vitals' ? 'text-rose-600 border-b-2 border-rose-500 bg-rose-50/10' : 'text-rose-800/70 hover:text-rose-600'
                    }`}
                  >
                    🏥 คัดกรองและสัญญาณชีพ
                  </button>
                  <button
                    onClick={() => setActiveTab('diagnoses')}
                    className={`py-3 px-4 transition-all duration-150 whitespace-nowrap cursor-pointer ${
                      activeTab === 'diagnoses' ? 'text-rose-600 border-b-2 border-rose-500 bg-rose-50/10' : 'text-rose-800/70 hover:text-rose-600'
                    }`}
                  >
                    🩺 การวินิจฉัยและหัตถการ
                  </button>
                  <button
                    onClick={() => setActiveTab('drugs')}
                    className={`py-3 px-4 transition-all duration-150 whitespace-nowrap cursor-pointer ${
                      activeTab === 'drugs' ? 'text-rose-600 border-b-2 border-rose-500 bg-rose-50/10' : 'text-rose-800/70 hover:text-rose-600'
                    }`}
                  >
                    💊 รายการยารักษา
                  </button>
                  <button
                    onClick={() => setActiveTab('labs')}
                    className={`py-3 px-4 transition-all duration-150 whitespace-nowrap cursor-pointer ${
                      activeTab === 'labs' ? 'text-rose-600 border-b-2 border-rose-500 bg-rose-50/10' : 'text-rose-800/70 hover:text-rose-600'
                    }`}
                  >
                    🧪 ผลตรวจทางห้องแล็บ
                  </button>
                  <button
                    onClick={() => setActiveTab('xrays')}
                    className={`py-3 px-4 transition-all duration-150 whitespace-nowrap cursor-pointer ${
                      activeTab === 'xrays' ? 'text-rose-600 border-b-2 border-rose-500 bg-rose-50/10' : 'text-rose-800/70 hover:text-rose-600'
                    }`}
                  >
                    ☢️ ผลเอกซเรย์ X-ray
                  </button>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className={`py-3 px-4 transition-all duration-150 whitespace-nowrap cursor-pointer ${
                      activeTab === 'appointments' ? 'text-rose-600 border-b-2 border-rose-500 bg-rose-50/10' : 'text-rose-800/70 hover:text-rose-600'
                    }`}
                  >
                    📅 การนัดหมายและส่งต่อ
                  </button>
                </div>

                {/* Visit Details Pane */}
                <div className="flex-1 p-6 overflow-y-auto min-h-[350px] bg-white">
                  {visitLoading && (
                    <div className="h-full flex flex-col items-center justify-center text-rose-500 py-12 gap-2.5">
                      <div className="w-8 h-8 border-3 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
                      <span className="text-xs font-semibold">กำลังโหลดรายละเอียด Visit...</span>
                    </div>
                  )}

                  {!visitLoading && !visitDetails && (
                    <div className="h-full flex flex-col items-center justify-center text-rose-700/40 text-xs py-12 font-medium">
                      กรุณาเลือกบันทึกการรักษาในแถบซ้ายมือเพื่อดูรายละเอียด
                    </div>
                  )}

                  {!visitLoading && visitDetails && (
                    <div>
                      {/* TABS CONTENT */}

                      {/* 1. Screening & Vitals */}
                      {activeTab === 'vitals' && (
                        <div className="flex flex-col gap-6">
                          {/* Vitals Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-rose-50/30 border border-rose-100 p-4 rounded-xl flex flex-col gap-1 shadow-sm">
                              <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider">ความดันโลหิต (BP)</span>
                              <strong className="text-lg text-rose-955">
                                {visitDetails.screening?.bps || '-'}/{visitDetails.screening?.bpd || '-'}
                              </strong>
                              <span className="text-[10px] text-rose-600 font-semibold">mmHg</span>
                            </div>
                            <div className="bg-rose-50/30 border border-rose-100 p-4 rounded-xl flex flex-col gap-1 shadow-sm">
                              <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider">ชีพจร (Pulse)</span>
                              <strong className="text-lg text-rose-955 flex items-center gap-1.5">
                                💓 {visitDetails.screening?.pulse || '-'}
                              </strong>
                              <span className="text-[10px] text-rose-600 font-semibold">ครั้ง/นาที</span>
                            </div>
                            <div className="bg-rose-50/30 border border-rose-100 p-4 rounded-xl flex flex-col gap-1 shadow-sm">
                              <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider">อุณหภูมิ (Temp)</span>
                              <strong className="text-lg text-rose-955">
                                🌡️ {visitDetails.screening?.temperature || '-'}
                              </strong>
                              <span className="text-[10px] text-rose-600 font-semibold">°C</span>
                            </div>
                            <div className="bg-rose-50/30 border border-rose-100 p-4 rounded-xl flex flex-col gap-1 shadow-sm">
                              <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider">น้ำหนัก/ส่วนสูง</span>
                              <strong className="text-sm text-rose-955 truncate font-extrabold">
                                W: {visitDetails.screening?.bw || '-'} kg / H: {visitDetails.screening?.height || '-'} cm
                              </strong>
                              <span className="text-[10px] text-rose-600 font-bold">
                                BMI: {visitDetails.screening?.bmi || '-'}
                              </span>
                            </div>
                          </div>

                          {/* Chief Complaint */}
                          <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wide">อาการสำคัญ (Chief Complaint)</h4>
                            <div className="bg-rose-50/10 border border-rose-100/80 p-4 rounded-xl text-xs text-rose-955 leading-relaxed font-medium">
                              {visitDetails.screening?.cc || 'ไม่ได้ระบุอาการสำคัญ'}
                            </div>
                          </div>

                          {/* HPI (History of Present Illness) */}
                          <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wide">ประวัติปัจจุบัน (History of Present Illness)</h4>
                            <div className="bg-rose-50/10 border border-rose-100/80 p-4 rounded-xl text-xs text-zinc-700 leading-relaxed font-medium">
                              {visitDetails.screening?.hpi || 'ไม่ได้ระบุประวัติการเจ็บป่วยปัจจุบัน'}
                            </div>
                          </div>

                          {/* PE (Physical Examination) */}
                          <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wide">การตรวจร่างกาย (Physical Exam)</h4>
                            <div className="bg-rose-50/10 border border-rose-100/80 p-4 rounded-xl text-xs font-mono text-zinc-600 leading-relaxed whitespace-pre-line">
                              {visitDetails.screening?.pe || 'ไม่ได้ระบุการตรวจร่างกาย'}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 2. Diagnoses & Procedures */}
                      {activeTab === 'diagnoses' && (
                        <div className="flex flex-col gap-6">
                          {/* Diagnoses Table */}
                          <div className="flex flex-col gap-3">
                            <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wide">การวินิจฉัยโรค (Diagnoses)</h4>
                            <div className="border border-rose-100 rounded-xl overflow-hidden shadow-sm">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-rose-50/40 border-b border-rose-100 text-rose-800">
                                    <th className="p-3 font-bold">ICD-10</th>
                                    <th className="p-3 font-bold">ชื่อโรค (Diagnosis Description)</th>
                                    <th className="p-3 font-bold">ประเภทโรค</th>
                                    <th className="p-3 font-bold">แพทย์ผู้วินิจฉัย</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-rose-50">
                                  {visitDetails.diagnoses && visitDetails.diagnoses.length > 0 ? (
                                    visitDetails.diagnoses.map((diag, index) => (
                                      <tr key={index} className="hover:bg-rose-50/20">
                                        <td className="p-3 font-mono font-bold text-rose-600">{diag.icd10}</td>
                                        <td className="p-3 text-rose-955 font-semibold">
                                          <div>{diag.icd10_name}</div>
                                          <div className="text-[10px] text-rose-700/70 mt-0.5 font-medium">{diag.icd10_tname}</div>
                                        </td>
                                        <td className="p-3">
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            diag.diagtype_name && diag.diagtype_name.includes('PRINCIPLE') ? 'bg-rose-500/10 border border-rose-200 text-rose-700' : 'bg-zinc-100 text-zinc-500'
                                          }`}>
                                            {diag.diagtype_name || 'CO-MORBIDITY'}
                                          </span>
                                        </td>
                                        <td className="p-3 text-zinc-600 font-medium">{diag.doctor_name || '-'}</td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={4} className="p-4 text-center text-zinc-400">ไม่มีการระบุการวินิจฉัยโรค</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Procedures Table */}
                          <div className="flex flex-col gap-3">
                            <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wide">หัตถการและการผ่าตัด (Procedures / Operation)</h4>
                            <div className="border border-rose-100 rounded-xl overflow-hidden shadow-sm">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="bg-rose-50/40 border-b border-rose-100 text-rose-800">
                                    <th className="p-3 font-bold">ICD-9</th>
                                    <th className="p-3 font-bold">ชื่อหัตถการ (Procedure Name)</th>
                                    <th className="p-3 font-bold">วัน/เวลาที่ทำ</th>
                                    <th className="p-3 font-bold">แพทย์ผู้ทำ</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-rose-50">
                                  {visitDetails.procedures && visitDetails.procedures.length > 0 ? (
                                    visitDetails.procedures.map((proc, index) => (
                                      <tr key={index} className="hover:bg-rose-50/20">
                                        <td className="p-3 font-mono font-bold text-emerald-600">{proc.icd9}</td>
                                        <td className="p-3 text-zinc-900 font-semibold">{proc.icd9_name}</td>
                                        <td className="p-3 text-zinc-700 font-medium">{proc.begin_date_time || '-'}</td>
                                        <td className="p-3 text-zinc-600 font-medium">{proc.doctor_name || '-'}</td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan={4} className="p-4 text-center text-zinc-400">ไม่มีการระบุหัตถการ</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. Prescriptions */}
                      {activeTab === 'drugs' && (
                        <div className="flex flex-col gap-3">
                          <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wide">รายการยารักษาโรคที่สั่งจ่าย (Prescribed Medications)</h4>
                          <div className="border border-rose-100 rounded-xl overflow-y-auto max-h-[400px] shadow-sm relative">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead className="sticky top-0 z-10">
                                <tr className="bg-rose-50/95 backdrop-blur-sm border-b border-rose-100 text-rose-800">
                                  <th className="p-3 font-bold w-12 text-center">#</th>
                                  <th className="p-3 font-bold">ชื่อยา (Medication Name)</th>
                                  <th className="p-3 font-bold text-center w-20">จำนวน</th>
                                  <th className="p-3 font-bold">วิธีการรับประทาน (Usage Instruction)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-rose-50">
                                {visitDetails.drugs && visitDetails.drugs.length > 0 ? (
                                  visitDetails.drugs.map((drug, index) => (
                                    <tr key={index} className="hover:bg-rose-50/20">
                                      <td className="p-3 text-center text-rose-400 font-mono font-bold">{index + 1}</td>
                                      <td className="p-3 text-rose-955 font-bold flex items-center gap-2">
                                        <span className="text-rose-500"><PillIcon /></span>
                                        {drug.drug_name}
                                      </td>
                                      <td className="p-3 text-center text-rose-800 font-bold bg-rose-50/20">{drug.qty} Tab</td>
                                      <td className="p-3 text-zinc-700 text-xs italic font-semibold">{drug.drug_usage || 'ไม่ได้ระบุวิธีกิน'}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={4} className="p-6 text-center text-zinc-400">ไม่มีการระบุการสั่งจ่ายยาสำหรับ Visit นี้</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* 4. Lab Results */}
                      {activeTab === 'labs' && (
                        <div className="flex flex-col gap-3">
                          <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wide">ผลตรวจทางห้องปฏิบัติการ (Laboratory Results)</h4>
                          <div className="border border-rose-100 rounded-xl overflow-y-auto max-h-[400px] shadow-sm relative">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead className="sticky top-0 z-10">
                                <tr className="bg-rose-50/95 backdrop-blur-sm border-b border-rose-100 text-rose-800">
                                  <th className="p-3 font-bold">กลุ่มแล็บ</th>
                                  <th className="p-3 font-bold">ชื่อการทดสอบ (Lab Items)</th>
                                  <th className="p-3 font-bold text-center w-24">ผลลัพธ์ (Result)</th>
                                  <th className="p-3 font-bold">หน่วย</th>
                                  <th className="p-3 font-bold">ค่าอ้างอิงปกติ (Ref. Range)</th>
                                  <th className="p-3 font-bold text-center">การยืนยัน</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-rose-50">
                                {visitDetails.labs && visitDetails.labs.length > 0 ? (
                                  visitDetails.labs.map((lab, index) => {
                                    const resultVal = parseFloat(lab.result);
                                    let isAbnormal = false;
                                    if (!isNaN(resultVal)) {
                                      if (lab.lab_name.includes('Creatinine') && resultVal > 1.2) isAbnormal = true;
                                      if (lab.lab_name.includes('Cholesterol') && resultVal > 200) isAbnormal = true;
                                      if (lab.lab_name.includes('LDL') && resultVal > 100) isAbnormal = true;
                                      if (lab.lab_name.includes('WBC') && (resultVal > 10 || resultVal < 4)) isAbnormal = true;
                                      if (lab.lab_name.includes('HbA1c') && resultVal > 6.0) isAbnormal = true;
                                    }

                                    return (
                                      <tr key={index} className="hover:bg-rose-50/20">
                                        <td className="p-3 text-[10px] font-bold text-rose-500 uppercase tracking-wider">{lab.sub_group}</td>
                                        <td className="p-3 text-rose-955 font-bold">{lab.lab_name}</td>
                                        <td className={`p-3 text-center font-extrabold ${
                                          isAbnormal ? 'bg-amber-100 text-amber-700 border border-amber-200 rounded' : 'text-emerald-600'
                                        }`}>
                                          {lab.result} {isAbnormal ? '⚠️' : ''}
                                        </td>
                                        <td className="p-3 text-zinc-600 font-mono font-semibold">{lab.unit}</td>
                                        <td className="p-3 text-zinc-500 font-mono">{lab.normal_value || '-'}</td>
                                        <td className="p-3 text-center">
                                          <span className="text-[10px] bg-rose-50 border border-rose-100 text-rose-600 py-0.5 px-2 rounded-full font-bold">
                                            {lab.confirm === 'Y' ? 'Confirmed' : 'Pending'}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })
                                ) : (
                                  <tr>
                                    <td colSpan={6} className="p-6 text-center text-zinc-400">ไม่มีประวัติผลตรวจแล็บสำหรับ Visit นี้</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* 5. X-ray Reports */}
                      {activeTab === 'xrays' && (
                        <div className="flex flex-col gap-6">
                          <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wide">รายงานผลการตรวจทางรังสีวิทยา (Radiology X-ray Reports)</h4>
                          {visitDetails.xrays && visitDetails.xrays.length > 0 ? (
                            visitDetails.xrays.map((xray, index) => (
                              <div key={index} className="bg-rose-50/10 border border-rose-100 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-rose-100">
                                {/* Film Meta Left */}
                                <div className="p-5 md:w-1/3 bg-rose-50/20 flex flex-col gap-3">
                                  <div className="text-rose-500 text-[10px] font-bold uppercase tracking-wider">X-ray Information</div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-xs text-rose-700/80 font-semibold">ชื่อการส่งตรวจ:</span>
                                    <strong className="text-xs text-rose-955 font-extrabold">☢️ {xray.xray_items_name}</strong>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-xs text-rose-700/80 font-semibold">รหัสประเภท:</span>
                                    <strong className="text-xs text-rose-900 font-mono font-bold">{xray.type_name || 'Chest'}</strong>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-xs text-rose-700/80 font-semibold">เลขที่ฟิล์ม XN:</span>
                                    <strong className="text-xs text-rose-700 font-mono font-bold">{xray.xn}</strong>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <span className="text-xs text-rose-700/80 font-semibold">แพทย์ผู้ส่งตรวจ:</span>
                                    <strong className="text-xs text-rose-900 font-bold">{xray.request_doctor_name || xray.request_doctor || '-'}</strong>
                                  </div>
                                </div>

                                {/* Report Right */}
                                <div className="p-5 flex-1 flex flex-col gap-4 bg-white">
                                  <div className="flex items-center justify-between">
                                    <span className="text-rose-500 text-[10px] font-bold uppercase tracking-wider">Radiology Report Text</span>
                                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 py-0.5 px-2 rounded-full font-extrabold">
                                      Film Read Confirmed
                                    </span>
                                  </div>
                                  <pre className="bg-rose-50/30 border border-rose-100 rounded-lg p-4 text-xs font-mono text-rose-955 leading-relaxed overflow-x-auto whitespace-pre-wrap font-semibold">
                                    {xray.report_text || 'ไม่มีข้อมูลรายงานผลการอ่านฟิล์ม'}
                                  </pre>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="bg-white border-2 border-dashed border-rose-200 rounded-xl p-8 text-center text-zinc-400 text-xs">
                              ไม่มีบันทึกข้อมูลรายงาน X-ray ใน Visit นี้
                            </div>
                          )}
                        </div>
                      )}

                      {/* 6. Appointments & Referrals */}
                      {activeTab === 'appointments' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Appointments */}
                          <div className="flex flex-col gap-3">
                            <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wide">ใบนัดหมายติดตามผล (Appointments)</h4>
                            {visitDetails.appointments && visitDetails.appointments.length > 0 ? (
                              visitDetails.appointments.map((app, index) => (
                                <div key={index} className="bg-rose-50/20 border border-rose-100 p-4 rounded-xl flex items-start gap-3.5 shadow-sm">
                                  <div className="bg-rose-500/10 text-rose-600 p-2 rounded-lg border border-rose-200 mt-0.5">
                                    <CalendarIcon />
                                  </div>
                                  <div className="flex flex-col gap-1.5 text-xs text-rose-900 font-semibold">
                                    <div className="text-xs text-rose-700/80 font-bold">วันเวลานัดครั้งถัดไป:</div>
                                    <strong className="text-sm text-rose-950 font-extrabold">
                                      📅 {formatDate(app.nextdate)} เวลา {app.nexttime || '08:30'} น.
                                    </strong>
                                    <div>
                                      คลินิก: <strong className="text-rose-955 font-bold">{app.clinic_name || '-'}</strong>
                                    </div>
                                    <div>
                                      แพทย์: <strong className="text-rose-955 font-bold">{app.doctor_name || '-'}</strong>
                                    </div>
                                    {app.note && (
                                      <div className="bg-white p-2 border border-rose-100 rounded text-[11px] text-rose-800 mt-1 leading-relaxed shadow-sm font-medium">
                                        💡 ข้อปฏิบัติการเตรียมตัว: {app.note}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="bg-white border-2 border-dashed border-rose-200 rounded-xl p-6 text-center text-zinc-400 text-xs">
                                ไม่มีรายการใบนัดหมายใน Visit นี้
                              </div>
                            )}
                          </div>

                          {/* Referrals (Out/In) */}
                          <div className="flex flex-col gap-4">
                            {/* Refer Out */}
                            <div className="flex flex-col gap-2.5">
                              <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wide">การส่งต่อผู้ป่วย (Refer Out)</h4>
                              {visitDetails.referrals && visitDetails.referrals.length > 0 ? (
                                visitDetails.referrals.map((ref, index) => (
                                  <div key={index} className="bg-rose-50/30 border border-rose-100 p-4 rounded-xl flex flex-col gap-2 text-xs text-rose-900">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] bg-rose-500/10 border border-rose-200 text-rose-700 font-extrabold px-2 py-0.5 rounded">
                                        ส่งออก (REFER OUT)
                                      </span>
                                      <span className="text-rose-500 font-mono font-bold">{formatDate(ref.refer_date)}</span>
                                    </div>
                                    <div>
                                      ส่งไปยังรพ.: <strong className="text-rose-950 font-bold">{ref.hosp_name} ({ref.refer_hospcode})</strong>
                                    </div>
                                    <div>
                                      เหตุผลการส่งต่อ: <strong className="text-rose-950 font-bold">{ref.refer_cause_name || ref.refer_cause || '-'}</strong>
                                    </div>
                                    {ref.pre_diagnosis && (
                                      <div className="bg-white p-2 rounded text-[11px] text-rose-800 border border-rose-100 leading-relaxed font-semibold shadow-sm">
                                        วินิจฉัยขั้นแรก: {ref.pre_diagnosis}
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="bg-white border-2 border-dashed border-rose-200 rounded-xl p-4 text-center text-zinc-400 text-xs">
                                  ไม่มีข้อมูลการส่งตัวออกโรงพยาบาลอื่น
                                </div>
                              )}
                            </div>

                            {/* Refer In */}
                            <div className="flex flex-col gap-2.5">
                              <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wide">การรับโอนผู้ป่วย (Refer In)</h4>
                              {visitDetails.referins && visitDetails.referins.length > 0 ? (
                                visitDetails.referins.map((ref, index) => (
                                  <div key={index} className="bg-emerald-50/5 border border-emerald-500/20 p-4 rounded-xl flex flex-col gap-2 text-xs text-zinc-800 font-semibold">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-extrabold px-2 py-0.5 rounded">
                                        รับส่งต่อ (REFER IN)
                                      </span>
                                      <span className="text-zinc-500 font-mono font-bold">{formatDate(ref.refer_date)}</span>
                                    </div>
                                    <div>
                                      รับโอนมาจาก: <strong className="text-zinc-900 font-bold">{ref.hosp_name} ({ref.refer_hospcode})</strong>
                                    </div>
                                    <div>
                                      เลขที่ใบส่งตัว: <strong className="text-zinc-900 font-mono font-bold">{ref.referin_no || '-'}</strong>
                                    </div>
                                    {ref.pre_diagnosis && (
                                      <div className="bg-white p-2 rounded text-[11px] text-zinc-600 border border-zinc-100 leading-relaxed font-medium">
                                        การวินิจฉัยจากรพ.ต้นทาง: {ref.pre_diagnosis}
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="bg-white border-2 border-dashed border-rose-200 rounded-xl p-4 text-center text-zinc-400 text-xs">
                                  ไม่มีข้อมูลการรับตัวส่งต่อเข้าในวันตรวจนี้
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
