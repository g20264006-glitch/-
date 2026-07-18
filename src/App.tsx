import React from 'react';
import { CanvasState, Booth, TimeSlot, Booking, ImprovementState } from './types';
import Home from './components/Home';
import Canvas from './components/Canvas';
import Agent from './components/Agent';
import RedTeam from './components/RedTeam';
import Improvement from './components/Improvement';
import PresentationView from './components/Presentation';
import { ShieldCheck, HeartHandshake, Home as HomeIcon, LayoutGrid, ShoppingBag, Flame, ClipboardList, Presentation as PresentationIcon, ShieldAlert, RefreshCw } from 'lucide-react';

export default function App() {
  // Global Stepper (0: Home, 1: Canvas, 2: Agent, 3: RedTeam, 4: Improvement, 5: Presentation)
  const [step, setStep] = React.useState<number>(0);

  // Participant Credentials (Compliance with Rule 1, 2, 3)
  const [teamNumber, setTeamNumber] = React.useState<string>('');
  const [nickname, setNickname] = React.useState<string>('');

  // Step 1: Ethical Design Canvas State
  const [canvas, setCanvas] = React.useState<CanvasState>({
    agentName: '',
    problem: '',
    target: '',
    allowedInputs: {
      teamNumber: true,
      nickname: true,
      realName: false,
      phoneNumber: false,
      address: false,
      birthDate: false
    },
    forbiddenActions: '',
    humanCheckMoment: '',
    privacyRules: '',
    fairnessRules: ''
  });

  // Step 2 & 3: Reservation State (Mock booths with pre-filled capacity scenarios)
  const booths: Booth[] = [
    {
      id: 'booth-1',
      name: '한정판 에어맥스 운동화',
      emoji: '👟',
      description: '선망의 대상인 리미티드 운동화. 독점 매크로 리셀러의 제1 타겟입니다.',
      price: '189,000원'
    },
    {
      id: 'booth-2',
      name: '클래식 가죽 더비 구두',
      emoji: '👞',
      description: '단정한 정장용 수제 더비 구두. 고급 가공 가죽 소재로 촘촘히 짜여져 있습니다.',
      price: '210,000원'
    },
    {
      id: 'booth-3',
      name: '스트릿 코듀로이 모자',
      emoji: '🧢',
      description: '힙한 패션을 완성하는 빈티지 블루 버킷햇. 소량만 특별 공급됩니다.',
      price: '45,000원'
    },
    {
      id: 'booth-4',
      name: '그래픽 빈티지 로고 티셔츠',
      emoji: '👕',
      description: '오버사이즈 시그니처 숏슬리브. 10대 소장 가치 1순위 시그니처 의류입니다.',
      price: '59,000원'
    }
  ];

  // Pre-seed mock capacity per booth and slots to let kids observe different edge cases (Rule 8 waitlist, Rule 7 double reservation)
  const [timeSlots, setTimeSlots] = React.useState<{ [boothId: string]: TimeSlot[] }>({
    'booth-1': [
      { id: 'slot-1', time: '10:00 ~ 11:00 (A타임)', capacity: 10, bookedCount: 10 }, // Full! (Waitlist Test)
      { id: 'slot-2', time: '13:00 ~ 14:00 (B타임)', capacity: 10, bookedCount: 4 },
      { id: 'slot-3', time: '15:00 ~ 16:00 (C타임)', capacity: 10, bookedCount: 8 }
    ],
    'booth-2': [
      { id: 'slot-1', time: '10:00 ~ 11:00 (A타임)', capacity: 10, bookedCount: 2 },
      { id: 'slot-2', time: '13:00 ~ 14:00 (B타임)', capacity: 10, bookedCount: 7 },
      { id: 'slot-3', time: '15:00 ~ 16:00 (C타임)', capacity: 10, bookedCount: 10 } // Full!
    ],
    'booth-3': [
      { id: 'slot-1', time: '10:00 ~ 11:00 (A타임)', capacity: 10, bookedCount: 0 },
      { id: 'slot-2', time: '13:00 ~ 14:00 (B타임)', capacity: 10, bookedCount: 5 },
      { id: 'slot-3', time: '15:00 ~ 16:00 (C타임)', capacity: 10, bookedCount: 3 }
    ],
    'booth-4': [
      { id: 'slot-1', time: '10:00 ~ 11:00 (A타임)', capacity: 10, bookedCount: 9 },
      { id: 'slot-2', time: '13:00 ~ 14:00 (B타임)', capacity: 10, bookedCount: 2 },
      { id: 'slot-3', time: '15:00 ~ 16:00 (C타임)', capacity: 10, bookedCount: 1 }
    ]
  });

  const [bookings, setBookings] = React.useState<Booking[]>([]);

  // Step 4: Improvement records
  const [improvement, setImprovement] = React.useState<ImprovementState>({
    problemsFound: '',
    defenseRules: '',
    finalImprovement: '',
    reflections: ''
  });

  const handleResetAll = () => {
    if (window.confirm('모든 진행 상황을 초기화하고 처음부터 다시 시작하시겠습니까?')) {
      setStep(0);
      setTeamNumber('');
      setNickname('');
      setCanvas({
        agentName: '',
        problem: '',
        target: '',
        allowedInputs: {
          teamNumber: true,
          nickname: true,
          realName: false,
          phoneNumber: false,
          address: false,
          birthDate: false
        },
        forbiddenActions: '',
        humanCheckMoment: '',
        privacyRules: '',
        fairnessRules: ''
      });
      setTimeSlots({
        'booth-1': [
          { id: 'slot-1', time: '10:00 ~ 11:00 (A타임)', capacity: 10, bookedCount: 10 },
          { id: 'slot-2', time: '13:00 ~ 14:00 (B타임)', capacity: 10, bookedCount: 4 },
          { id: 'slot-3', time: '15:00 ~ 16:00 (C타임)', capacity: 10, bookedCount: 8 }
        ],
        'booth-2': [
          { id: 'slot-1', time: '10:00 ~ 11:00 (A타임)', capacity: 10, bookedCount: 2 },
          { id: 'slot-2', time: '13:00 ~ 14:00 (B타임)', capacity: 10, bookedCount: 7 },
          { id: 'slot-3', time: '15:00 ~ 16:00 (C타임)', capacity: 10, bookedCount: 10 }
        ],
        'booth-3': [
          { id: 'slot-1', time: '10:00 ~ 11:00 (A타임)', capacity: 10, bookedCount: 0 },
          { id: 'slot-2', time: '13:00 ~ 14:00 (B타임)', capacity: 10, bookedCount: 5 },
          { id: 'slot-3', time: '15:00 ~ 16:00 (C타임)', capacity: 10, bookedCount: 3 }
        ],
        'booth-4': [
          { id: 'slot-1', time: '10:00 ~ 11:00 (A타임)', capacity: 10, bookedCount: 9 },
          { id: 'slot-2', time: '13:00 ~ 14:00 (B타임)', capacity: 10, bookedCount: 2 },
          { id: 'slot-3', time: '15:00 ~ 16:00 (C타임)', capacity: 10, bookedCount: 1 }
        ]
      });
      setBookings([]);
      setImprovement({
        problemsFound: '',
        defenseRules: '',
        finalImprovement: '',
        reflections: ''
      });
    }
  };

  // Guard navigation: require registering nickname and teamNumber first
  const handleStepChange = (newStep: number) => {
    if (newStep > 0 && (!teamNumber.trim() || !nickname.trim())) {
      alert('⚠️ 먼저 홈 화면에서 팀 번호와 별명을 등록하셔야 실습을 진행할 수 있습니다!');
      setStep(0);
      return;
    }
    setStep(newStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stepsList = [
    { label: '홈', icon: <HomeIcon size={16} /> },
    { label: '1. 윤리 설계', icon: <LayoutGrid size={16} /> },
    { label: '2. 구매 테스트', icon: <ShoppingBag size={16} /> },
    { label: '3. 레드팀 공격', icon: <Flame size={16} /> },
    { label: '4. 개선 기록', icon: <ClipboardList size={16} /> },
    { label: '5. 최종 발표', icon: <PresentationIcon size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-100">
              🛡️
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">
                AI 윤리 캠프 워크북
              </h1>
              <p className="text-[10px] sm:text-xs text-indigo-600 font-semibold">
                한정판 물건 구매를 독점하는 불공정한 리셀러 AI 고치기
              </p>
            </div>
          </div>

          {/* Profile badge (Rule 1,2,3 compliant) and Reset option */}
          {teamNumber && nickname ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2.5 bg-indigo-50/50 border border-indigo-100/60 px-3 py-1.5 rounded-xl text-xs">
                <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                  {teamNumber}
                </span>
                <span className="font-bold text-indigo-900">{nickname}</span>
                <span className="text-indigo-300">|</span>
                <span className="text-indigo-700">로그인 완료</span>
              </div>
              <button
                onClick={handleResetAll}
                className="flex items-center gap-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 transition-all duration-150 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer shadow-2xs"
                title="실습 처음부터 다시 하기"
              >
                <RefreshCw size={12} className="animate-hover-spin" />
                <span>다시 하기</span>
              </button>
            </div>
          ) : (
            step > 0 && (
              <button
                onClick={handleResetAll}
                className="flex items-center gap-1.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 transition-all duration-150 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                <RefreshCw size={12} />
                <span>초기화</span>
              </button>
            )
          )}
        </div>
      </header>

      {/* Navigation stepper bar */}
      <nav className="bg-white border-b border-gray-200 no-print py-2.5 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <div className="flex items-center justify-start md:justify-center gap-1.5 md:gap-4 min-w-[580px] py-1">
            {stepsList.map((st, idx) => {
              const isActive = step === idx;
              const isPassed = step > idx;
              return (
                <button
                  key={st.label}
                  onClick={() => handleStepChange(idx)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                      : isPassed
                      ? 'bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
                      : 'bg-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {st.icon}
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {step === 0 && (
            <Home
              teamNumber={teamNumber}
              nickname={nickname}
              setTeamNumber={setTeamNumber}
              setNickname={setNickname}
              onNext={() => handleStepChange(1)}
            />
          )}

          {step === 1 && (
            <Canvas
              canvas={canvas}
              setCanvas={setCanvas}
              onNext={() => handleStepChange(2)}
            />
          )}

          {step === 2 && (
            <Agent
              teamNumber={teamNumber}
              nickname={nickname}
              canvas={canvas}
              booths={booths}
              timeSlots={timeSlots}
              setTimeSlots={setTimeSlots}
              bookings={bookings}
              setBookings={setBookings}
              onNext={() => handleStepChange(3)}
            />
          )}

          {step === 3 && (
            <RedTeam
              canvas={canvas}
              onNext={() => handleStepChange(4)}
            />
          )}

          {step === 4 && (
            <Improvement
              improvement={improvement}
              setImprovement={setImprovement}
              onNext={() => handleStepChange(5)}
            />
          )}

          {step === 5 && (
            <PresentationView
              teamNumber={teamNumber}
              nickname={nickname}
              canvas={canvas}
              improvement={improvement}
              bookings={bookings}
              booths={booths}
            />
          )}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-400 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1.5">
          <p className="font-semibold text-gray-500 flex items-center justify-center gap-1">
            <ShieldCheck size={14} className="text-indigo-600" />
            12~14세 청소년 인공지능 윤리 교육 아카데미
          </p>
          <p>이 웹앱은 순수 HTML/JS 파일 다운로드 및 GitHub Pages 배포를 완전 보장하며, 일체의 민감 정보 수집이 없습니다.</p>
        </div>
      </footer>
    </div>
  );
}
