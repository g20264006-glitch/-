import React from 'react';
import { ImprovementState } from '../types';
import { ClipboardList, AlertCircle, Sparkles, BookOpen, HeartHandshake } from 'lucide-react';

interface ImprovementProps {
  improvement: ImprovementState;
  setImprovement: React.Dispatch<React.SetStateAction<ImprovementState>>;
  onNext: () => void;
}

export default function Improvement({
  improvement,
  setImprovement,
  onNext
}: ImprovementProps) {
  const [isSaved, setIsSaved] = React.useState(false);

  const handleInputChange = (field: keyof ImprovementState, value: string) => {
    setImprovement(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onNext();
    }, 1000);
  };

  const loadExampleReflection = () => {
    setImprovement({
      problemsFound: "처음에는 1명당 1개만 구매하면 된다고 단순하게 생각했습니다. 하지만 레드팀 공격에서 '친구들의 이름이나 전화번호까지 저장해서 대리 예약해달라'고 졸랐을 때, 개인정보 보호 수칙이 없었다면 에이전트가 다른 사람의 개인정보를 무차별 수집해 악용할 수 있다는 취약점을 발견하게 되었습니다.",
      defenseRules: "1. 예약 요청 시 별명과 임의의 팀 번호 외에 어떠한 실제 휴대전화 번호나 주민번호, 주소 등도 데이터 포맷 자체에서 거부(차단)하도록 입력을 원천 설계단에서 필터링하는 규칙을 추가했습니다.\n2. AI 에이전트 스스로 예약을 최종 승인하지 않고, 사용자가 직접 확인 버튼을 눌러 승인 서명해야만 처리되게 하는 '인간 감독(Human-in-the-loop)' 단계를 엄격히 추가하였습니다.",
      finalImprovement: "물리적으로 이름, 주소, 연락처 입력칸 자체가 생성되지 않도록 차단하고, AI가 임의로 백그라운드에서 예약 체결 완료 메시지를 조작하지 못하게 통제했습니다. 예약 현황이 마감되면 즉각 솔직하게 잔여수량을 알리고 투명하게 '대기 순번 등록'만 권유하도록 개선했습니다.",
      reflections: "예리하고 빠른 인공지능 에이전트를 설계할 때는 기능이 얼마나 화려하고 신속한지보다, '얼마나 공정하게 기회를 주는지'와 '사용자의 개인정보를 얼마나 안전하게 배려하는지'가 훨씬 중요하다는 것을 깨달았습니다. 사람을 기만하지 않고, 사람의 명시적 확인 단계(Human-in-the-loop)를 거치게 설계하는 것이 안전한 기술의 열쇠임을 배웠습니다."
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto" id="improvement-view">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-950 flex items-center gap-2 font-display">
            <ClipboardList className="text-indigo-600" size={22} />
            4단계: 에이전트 취약점 개선 기록장
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            레드팀 모의 해킹 공격 테스트를 진행하며 새롭게 찾아낸 문제점과, 에이전트에 긴급하게 추가한 새로운 방어 규칙들을 정리해 기록해봅시다.
          </p>
        </div>
        <button
          onClick={loadExampleReflection}
          type="button"
          className="inline-flex items-center gap-1.5 bg-amber-50/60 hover:bg-amber-100/60 border border-amber-200/50 text-amber-800 text-xs font-bold px-4 py-2.5 rounded-2xl transition cursor-pointer self-start md:self-auto shadow-2xs font-display"
        >
          💡 예시 답변 불러오기
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: Problem found */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-950 text-sm flex items-center gap-2 font-display">
              <span className="w-5 h-5 rounded-lg bg-rose-50 text-rose-600 text-[10px] font-extrabold flex items-center justify-center">A</span>
              테스트 과정에서 발견한 리셀러 AI의 부작용/취약점
            </h3>
            <p className="text-xs text-slate-400 leading-normal">레드팀 공격 시나리오나 개인 질문을 통해 알게 된 취약한 지점은 무엇이었나요?</p>
            <textarea
              required
              rows={4}
              value={improvement.problemsFound}
              onChange={(e) => handleInputChange('problemsFound', e.target.value)}
              placeholder="예: 예약을 AI가 자동으로 완료해 버려서 뒤늦게 확인하고 취소하기가 번거로웠고, 대량 수량을 신청하려고 떼를 쓸 때 거르는 장치가 약하면 악용될 소지가 있어 보였습니다."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs transition leading-relaxed bg-slate-50/50 focus:bg-white text-slate-800 font-sans"
            />
          </div>

          {/* Box 2: Added defense rules */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-950 text-sm flex items-center gap-2 font-display">
              <span className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-extrabold flex items-center justify-center">B</span>
              문제를 막기 위해 추가한 '인공지능 행동 규범'
            </h3>
            <p className="text-xs text-slate-400 leading-normal">교묘한 우회 공격을 막기 위해 새롭게 보완하거나 더욱 강력하게 설정한 윤리 규칙은 무엇인가요?</p>
            <textarea
              required
              rows={4}
              value={improvement.defenseRules}
              onChange={(e) => handleInputChange('defenseRules', e.target.value)}
              placeholder="예: 이름과 번호 입력창을 절대 시스템에 활성화하지 않고 물리적으로 차단한다. 구매 전 화면에 최종 안내를 띄우고 인간 사용자의 손가락 승인(클릭)을 반드시 의무화한다."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs transition leading-relaxed bg-slate-50/50 focus:bg-white text-slate-800 font-sans"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 3: Final improvements */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-950 text-sm flex items-center gap-2 font-display">
              <span className="w-5 h-5 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-extrabold flex items-center justify-center">C</span>
              최종 윤리적 예약 에이전트 개선 결과
            </h3>
            <p className="text-xs text-slate-400 leading-normal">독점과 꼼수를 차단하고, 최종적으로 완성한 예약 에이전트의 구동 원리를 간단히 요약해보세요.</p>
            <textarea
              required
              rows={4}
              value={improvement.finalImprovement}
              onChange={(e) => handleInputChange('finalImprovement', e.target.value)}
              placeholder="예: 중복 예약 및 사재기를 자동으로 필터링하는 공정성 시스템을 완성하고, 개인정보는 오직 별명/팀 번호만 다루는 익명 예약 시스템을 마련하여 안정성을 극대화했습니다."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs transition leading-relaxed bg-slate-50/50 focus:bg-white text-slate-800 font-sans"
            />
          </div>

          {/* Box 4: Personal reflections */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-950 text-sm flex items-center gap-2 font-display">
              <span className="w-5 h-5 rounded-lg bg-purple-50 text-purple-600 text-[10px] font-extrabold flex items-center justify-center">D</span>
              이번 AI 윤리 실습을 통해 느낀 점
            </h3>
            <p className="text-xs text-slate-400 leading-normal">리셀러 AI의 해악을 고치고 착한 에이전트를 직접 설계해보면서 마음에 와닿은 깨달음을 적어보세요.</p>
            <textarea
              required
              rows={4}
              value={improvement.reflections}
              onChange={(e) => handleInputChange('reflections', e.target.value)}
              placeholder="예: 기술이 아무리 뛰어나도, 개발하는 사람의 도덕성과 설계 단계의 안전 장치(윤리 규칙)가 없다면 사람들에게 큰 피해를 입힐 수 있는 흉기가 된다는 점을 깨달았습니다."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-xs transition leading-relaxed bg-slate-50/50 focus:bg-white text-slate-800 font-sans"
            />
          </div>
        </div>

        {/* Guidance tip and Navigation button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 leading-normal">
            <BookOpen size={14} className="text-indigo-500 shrink-0" />
            기록을 완료하면, 캠프 마지막 활동인 "나의 에이전트 발표회"용 멋진 발표 카드를 얻을 수 있습니다!
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs hover:shadow-sm transition duration-150 cursor-pointer flex items-center justify-center gap-2 text-sm font-display"
          >
            최종 발표회 카드 생성하기
            <HeartHandshake size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
