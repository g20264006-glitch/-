import React from 'react';
import { CanvasState, Booth, TimeSlot, Booking } from '../types';
import { ShoppingBag, Calendar, User, ShieldAlert, CheckCircle2, Clock, AlertTriangle, HelpCircle } from 'lucide-react';

interface AgentProps {
  teamNumber: string;
  nickname: string;
  canvas: CanvasState;
  booths: Booth[];
  timeSlots: { [boothId: string]: TimeSlot[] };
  setTimeSlots: React.Dispatch<React.SetStateAction<{ [boothId: string]: TimeSlot[] }>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  onNext: () => void;
}

export default function Agent({
  teamNumber,
  nickname,
  canvas,
  booths,
  timeSlots,
  setTimeSlots,
  bookings,
  setBookings,
  onNext
}: AgentProps) {
  const [selectedBooth, setSelectedBooth] = React.useState<Booth>(booths[0]);
  const [selectedSlotId, setSelectedSlotId] = React.useState<string>('slot-1');
  
  // States for purchase flow
  const [aiAnalysisLog, setAiAnalysisLog] = React.useState<string | null>(null);
  const [evaluationStatus, setEvaluationStatus] = React.useState<'idle' | 'analyzing' | 'approved' | 'rejected_double' | 'waitlist_offered' | 'success'>('idle');
  const [pendingBooking, setPendingBooking] = React.useState<{
    boothId: string;
    slotId: string;
    isWaitlist: boolean;
  } | null>(null);

  const activeSlots = timeSlots[selectedBooth.id] || [];
  const currentSlot = activeSlots.find(s => s.id === selectedSlotId);

  const resetTerminal = () => {
    setAiAnalysisLog(null);
    setEvaluationStatus('idle');
    setPendingBooking(null);
  };

  React.useEffect(() => {
    // Reset terminal on booth change
    resetTerminal();
    // Default to first slot
    const slots = timeSlots[selectedBooth.id] || [];
    if (slots.length > 0) {
      setSelectedSlotId(slots[0].id);
    }
  }, [selectedBooth]);

  // Request purchase evaluation (AI Simulation)
  const handlePurchaseRequest = () => {
    if (!currentSlot) return;
    setEvaluationStatus('analyzing');
    setAiAnalysisLog('🤖 에이전트 AI가 윤리 지침 및 공정성 필터를 대조 분석 중입니다...');
    setPendingBooking(null);

    setTimeout(() => {
      // 1. Check double reservation in the same slot (Rule 7)
      const hasDoubleBooking = bookings.some(
        b => b.timeSlotId === selectedSlotId && b.teamNumber === teamNumber && b.status === 'confirmed'
      );

      if (hasDoubleBooking) {
        const doubleBookedItem = bookings.find(
          b => b.timeSlotId === selectedSlotId && b.teamNumber === teamNumber && b.status === 'confirmed'
        );
        const doubleBoothName = booths.find(b => b.id === doubleBookedItem?.boothId)?.name || '기타 상품';
        
        setEvaluationStatus('rejected_double');
        setAiAnalysisLog(
          `⚠️ [공정성 경고] 중복 예약 차단!\n\n` +
          `에이전트 이름: ${canvas.agentName || '미지정 에이전트'}\n` +
          `판단 결과: 구매 불가 (거절)\n` +
          `사유: [팀 ${teamNumber}]님은 이미 동일한 시간대(${currentSlot.time})에 [${doubleBoothName}]을(를) 구매하셨습니다.\n` +
          `윤리 원칙: [공정성 준수 규칙]에 의거하여, 한정판 물건의 독점 및 사재기를 방지하기 위해 한 팀은 같은 시간대에 하나의 부스 상품만 소유할 수 있습니다.`
        );
        return;
      }

      // 2. Check capacity (Rule 8)
      if (currentSlot.bookedCount >= currentSlot.capacity) {
        setEvaluationStatus('waitlist_offered');
        setPendingBooking({
          boothId: selectedBooth.id,
          slotId: selectedSlotId,
          isWaitlist: true
        });
        setAiAnalysisLog(
          `ℹ️ [수량 마감] 대기자 등록 제안\n\n` +
          `에이전트 이름: ${canvas.agentName || '미지정 에이전트'}\n` +
          `판단 결과: 일반 구매 불가 (잔여 수량 없음)\n` +
          `상황: 해당 시간대(${currentSlot.time})의 정원(10명)이 모두 마감되었습니다.\n` +
          `대안: 대기자 명단에 등록할 수 있습니다. 자리가 나면 공정한 대기 순서대로 구매 승인이 주어집니다.\n` +
          `윤리 원칙: [투명성 및 정직성 규칙]에 따라 매진 상황을 기만하지 않고 솔직하게 알리며, 대기 기회만 평등하게 제공합니다.`
        );
        return;
      }

      // 3. Normal Approval -> Moves to Human-in-the-loop Gate
      setEvaluationStatus('approved');
      setPendingBooking({
        boothId: selectedBooth.id,
        slotId: selectedSlotId,
        isWaitlist: false
      });
      setAiAnalysisLog(
        `✅ [승인 완료] 구매 조건 충족! 최종 동의 대기 중\n\n` +
        `에이전트 이름: ${canvas.agentName || '미지정 에이전트'}\n` +
        `판단 결과: 구매 가능 (사람 확인 대기)\n` +
        `진단: 팀 번호 ${teamNumber} / 별명 ${nickname} 님의 요청 확인 완료. 중복 예약 없음 및 수량 여유(${currentSlot.capacity - currentSlot.bookedCount}석 남음).\n` +
        `윤리 원칙: [사람 확인 (Human-in-the-loop)] 원칙에 따라, 에이전트가 임의로 결제/예약을 자동 확정하지 않습니다. 최종 구매 결정을 위해 아래 서명 확인창을 직접 눌러 예약을 확정해주세요!`
      );
    }, 1000);
  };

  // Final Action by User (Rule 6: Must click confirmation before finalized)
  const handleFinalConfirm = () => {
    if (!pendingBooking || !currentSlot) return;

    const isWaitlist = pendingBooking.isWaitlist;

    // Save Booking
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      teamNumber,
      nickname,
      boothId: pendingBooking.boothId,
      timeSlotId: pendingBooking.slotId,
      status: isWaitlist ? 'waitlist' : 'confirmed',
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    };

    setBookings(prev => [...prev, newBooking]);

    // If it's confirmed, increase booked count for that slot
    if (!isWaitlist) {
      setTimeSlots(prev => {
        const slotsForBooth = prev[pendingBooking.boothId] || [];
        const updatedSlots = slotsForBooth.map(s => {
          if (s.id === pendingBooking.slotId) {
            return { ...s, bookedCount: s.bookedCount + 1 };
          }
          return s;
        });
        return {
          ...prev,
          [pendingBooking.boothId]: updatedSlots
        };
      });
    }

    setEvaluationStatus('success');
    setAiAnalysisLog(
      isWaitlist
        ? `📝 대기자 등록이 완료되었습니다!\n\n[팀 ${teamNumber}] 대기 접수 완료. 만약 기존 예약자가 예약을 취소하면 우선 순위에 따라 순차적으로 안내됩니다.`
        : `🎉 최종 예약 및 구매가 확정되었습니다!\n\n상품명: [${selectedBooth.name}]\n시간대: ${currentSlot.time}\n별명: ${nickname}\n상태: 구매 완료 (승인 일시: ${newBooking.timestamp})`
    );
    setPendingBooking(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto" id="agent-view">
      <div className="space-y-1.5">
        <h2 className="text-xl md:text-2xl font-extrabold text-slate-950 flex items-center gap-2 font-display">
          <ShoppingBag className="text-indigo-600" size={22} />
          2단계: 공정한 AI 예약 에이전트 구동 테스트
        </h2>
        <p className="text-slate-500 text-sm">
          설계된 규칙을 탑재한 예약 시스템입니다. 모의 부스를 누르고 시간대를 정해 직접 구매 프로세스를 구동해보세요!
        </p>
      </div>

      {/* User Status Badge Bar (Rules 1, 2, 3 visualization) */}
      <div className="bg-slate-50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border border-slate-200/60 shadow-2xs">
        <div className="flex items-center gap-3 text-sm text-slate-700">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            {teamNumber}
          </div>
          <div className="text-xs sm:text-sm">
            <span className="font-bold text-slate-900">팀 {teamNumber}</span> ({nickname}) 님의 에이전트
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100/60">
          <CheckCircle2 size={14} />
          개인정보 보호 적용중: 이름/연락처 수집 안함
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Product Booth List (4 booths) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">모의 상품 리스트 (부스 4종)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {booths.map(booth => {
              const isSelected = selectedBooth.id === booth.id;
              return (
                <button
                  key={booth.id}
                  onClick={() => setSelectedBooth(booth)}
                  className={`w-full text-left p-5 rounded-3xl border transition-all duration-150 relative overflow-hidden group cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/20 ring-1 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl p-3 bg-slate-55 rounded-2xl group-hover:scale-105 transition duration-150">
                      {booth.emoji}
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-base font-display">{booth.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{booth.description}</p>
                      <p className="text-sm font-bold text-indigo-600 mt-1">{booth.price}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute right-4 top-4 w-2 h-2 bg-indigo-600 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Time Slots & Live Terminal */}
        <div className="lg:col-span-7 space-y-6">
          {/* Time slot selector */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 font-display">
              <Calendar size={16} className="text-indigo-600" />
              예약 희망 시간대 선택 (슬롯 정원: 10명)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activeSlots.map(slot => {
                const isSelected = selectedSlotId === slot.id;
                const isFull = slot.bookedCount >= slot.capacity;
                return (
                  <button
                    key={slot.id}
                    onClick={() => {
                      setSelectedSlotId(slot.id);
                      resetTerminal();
                    }}
                    className={`p-3.5 rounded-xl border text-left transition relative cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/20 font-bold'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-800">{slot.time}</div>
                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      <span className="text-slate-400">신청 인원</span>
                      <span className={isFull ? 'text-rose-600 font-bold' : 'text-slate-600 font-medium'}>
                        {slot.bookedCount}/{slot.capacity}
                      </span>
                    </div>
                    {isFull && (
                      <span className="absolute top-1.5 right-1.5 text-[8px] bg-rose-50 text-rose-600 border border-rose-100 px-1.5 py-0.5 rounded-full font-bold">
                        마감
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Run Button */}
            <div className="pt-1">
              <button
                onClick={handlePurchaseRequest}
                disabled={evaluationStatus === 'analyzing'}
                className="w-full bg-slate-900 hover:bg-slate-850 text-white font-bold py-3.5 px-6 rounded-2xl shadow-xs transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer text-sm font-display"
              >
                🤖 {canvas.agentName || 'AI 예약 에이전트'}에게 예약 처리 지시하기
              </button>
            </div>
          </div>

          {/* AI Interactive Terminal Log (Rule 9) */}
          {aiAnalysisLog && (
            <div className="bg-slate-900 text-slate-200 rounded-3xl p-5 md:p-6 font-mono text-xs shadow-md space-y-4 border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
                  <span className="font-bold text-indigo-400">AI 예약 진단 터미널 v1.0</span>
                </div>
                <div className="text-slate-500 text-[10px]">Real-time Decision Log</div>
              </div>
              
              <div className="whitespace-pre-line leading-relaxed text-slate-300">
                {aiAnalysisLog}
              </div>

              {/* Action Stage: Human confirmation Gate (Rule 6) */}
              {(evaluationStatus === 'approved' || evaluationStatus === 'waitlist_offered') && pendingBooking && (
                <div className="bg-slate-850 border border-slate-750 rounded-2xl p-4.5 space-y-3 font-sans">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <AlertTriangle size={16} />
                    사람 확인 및 동의 단계 (Human-In-The-Loop)
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {evaluationStatus === 'approved'
                      ? 'AI가 구매 조건 및 공정성 심사를 마쳤습니다. 예약 및 거래를 최종 확정하기 위해 사용자가 직접 동의 서명을 눌러야 완료됩니다.'
                      : '잔여 수량이 부족하여 정상 구매가 불가합니다. 대기자 수첩에 팀 순번 등록을 최종 확정하시겠습니까?'}
                  </p>
                  
                  <div className="flex gap-2.5 pt-1">
                    <button
                      onClick={handleFinalConfirm}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl transition text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 size={14} />
                      {evaluationStatus === 'approved' ? '최종 구매 확정 (서명)' : '대기자 등록 완료'}
                    </button>
                    <button
                      onClick={resetTerminal}
                      className="bg-transparent hover:bg-slate-800 text-slate-400 border border-slate-700 py-2.5 px-4 rounded-xl transition text-xs cursor-pointer"
                    >
                      취소
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Session History */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 font-display">
              <Clock size={16} className="text-slate-500" />
              이번 실습 예약 및 대기 내역 ({bookings.length}건)
            </h4>

            {bookings.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                아직 확정된 예약이나 대기 신청 내역이 없습니다. 위에서 예약 신청 후 최종 확인 버튼을 눌러보세요!
              </div>
            ) : (
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {bookings.map(b => {
                  const booth = booths.find(x => x.id === b.boothId);
                  const slot = (timeSlots[b.boothId] || []).find(y => y.id === b.timeSlotId);
                  const isWait = b.status === 'waitlist';
                  
                  return (
                    <div
                      key={b.id}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs ${
                        isWait
                          ? 'bg-amber-50/40 border-amber-200/60 text-amber-900'
                          : 'bg-emerald-50/40 border-emerald-200/60 text-emerald-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{booth?.emoji}</span>
                        <div>
                          <div className="font-bold text-slate-900">
                            {booth?.name} ({slot?.time})
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            예약자: {b.nickname} (팀 {b.teamNumber}) • 신청시각 {b.timestamp}
                          </div>
                        </div>
                      </div>
                      
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        isWait
                          ? 'bg-amber-100/60 text-amber-800 border border-amber-200/40'
                          : 'bg-emerald-100/60 text-emerald-800 border border-emerald-200/40'
                      }`}>
                        {isWait ? '대기 등록됨' : '구매 완료'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer explanation banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex items-start gap-4">
        <HelpCircle className="text-indigo-600 shrink-0 mt-0.5" size={20} />
        <div className="space-y-1 text-xs sm:text-sm">
          <h4 className="font-bold text-slate-900 font-display">💡 배운 내용 체크하기</h4>
          <p className="text-slate-600 leading-relaxed space-y-1">
            • <b>한 팀당 한 슬롯 중복 예약 제한:</b> 공정성 필터가 예약 기록을 대조하여, 사재기 기법을 차단하는 것을 눈으로 관찰했습니다.<br />
            • <b>정원 초과 시 대기 제안:</b> 무작정 예약을 승인하고 돈을 먼저 받는 불합리한 행동을 금하고, 실시간 예약 현황을 솔직하게 말하는 <b>투명성</b>을 지켰습니다.<br />
            • <b>최종 구매 버튼 클릭:</b> AI가 모든 프로세스를 임의로 완료하지 않도록 <b>사람 확인(Human-in-the-loop)</b> 단계를 적용하여, 실수의 여지를 통제했습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
