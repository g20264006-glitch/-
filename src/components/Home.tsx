import React from 'react';
import { AlertCircle, ShieldAlert, Award, ArrowRight, UserCheck } from 'lucide-react';

interface HomeProps {
  teamNumber: string;
  nickname: string;
  setTeamNumber: (val: string) => void;
  setNickname: (val: string) => void;
  onNext: () => void;
}

export default function Home({
  teamNumber,
  nickname,
  setTeamNumber,
  setNickname,
  onNext
}: HomeProps) {
  const [error, setError] = React.useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamNumber.trim()) {
      setError('팀 번호를 입력해주세요! (예: 3)');
      return;
    }
    if (!nickname.trim()) {
      setError('별명을 입력해주세요! (예: 공정대장)');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto" id="home-view">
      {/* Hero Banner Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 text-slate-800 shadow-xs relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-5 transform translate-x-10 translate-y-10">
          <ShieldAlert size={300} className="text-indigo-600" />
        </div>
        <div className="relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full text-xs font-semibold text-indigo-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            12~14세 청소년 AI 윤리 캠프 미션
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-slate-950 font-display">
            불공정한 리셀러 AI를 고쳐라!
          </h1>
          
          <p className="text-slate-600 text-sm md:text-base max-w-3xl leading-relaxed">
            현재 많은 AI 에이전트들이 한정판 물건을 독점하여 일반 사용자들이 피해를 입고 있습니다.<br />
            여러분의 임무는 <b>AI 윤리 원칙</b>을 반영하여 사람들의 권리를 보호하는 공정하고 착한 예약 에이전트를 직접 설계하는 것입니다.
          </p>
        </div>
      </div>

      {/* Grid: Unfair Agent Analysis & Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Unfair AI analysis */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-rose-600 flex items-center gap-2 font-display">
            <AlertCircle className="text-rose-500" size={20} />
            현재 리셀러 AI의 심각한 문제점
          </h2>
          <ul className="space-y-4 text-slate-600 text-sm">
            <li className="flex items-start gap-2.5">
              <span className="text-rose-500 font-bold">✗</span>
              <span><b>독점과 불공정:</b> 순식간에 모든 재고를 예약하여 일반 구매자의 기회를 박탈함.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-rose-500 font-bold">✗</span>
              <span><b>개인정보 유출:</b> 빠른 구매를 위해 집 주소, 전화번호, 생년월일 등 민감한 개인정보를 마구 수집해 저장함.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-rose-500 font-bold">✗</span>
              <span><b>불투명성:</b> 예약 과정이나 대기 순서를 공개하지 않고 매진 핑계를 댐.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-rose-500 font-bold">✗</span>
              <span><b>사람 확인 부재:</b> 사람의 최종 동의나 승인 단계 없이 자동으로 결제와 예약까지 마음대로 처리해버림.</span>
            </li>
          </ul>
        </div>

        {/* Right: Rules of the Ethics Camp */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-5">
          <h2 className="text-lg font-bold text-indigo-600 flex items-center gap-2 font-display">
            <Award className="text-indigo-500" size={20} />
            우리가 설계할 착한 AI의 핵심 원칙
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-1">공정성 (Fairness)</h3>
              <p className="text-slate-500 leading-normal">한 팀이 같은 시간대에 중복 예약을 하거나 독점하는 행위를 완벽히 제한합니다.</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-1">최소 수집 (Privacy)</h3>
              <p className="text-slate-500 leading-normal">실제 이름, 주소, 연락처는 제외하고 <b>팀 번호</b>와 <b>별명</b>만 사용하여 안전하게 구매합니다.</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-1">투명성 (Transparency)</h3>
              <p className="text-slate-500 leading-normal">자리가 없으면 숨기지 않고 대기 순번을 제안하며, AI가 판단 사유를 명확히 말해줍니다.</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-1">사람 확인 (Human-in-the-loop)</h3>
              <p className="text-slate-500 leading-normal">AI가 임의로 결제하지 못하게, 사람이 최종 확인 버튼을 눌러 승인하도록 만듭니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Input Credentials Card (Rules 1, 2, 3 compliant) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2 font-display">
            <UserCheck className="text-indigo-600" size={20} />
            캠프 참가자 등록 (실제 개인정보 금지!)
          </h2>
          <p className="text-slate-500 text-sm">
            AI 윤리 원칙에 따라, 이름/전화번호/주소/생년월일 같은 <b>실제 개인정보는 절대 수집하지 않습니다.</b> 오직 식별을 위해 <b>팀 번호</b>와 <b>별명</b>만 입력해주세요.
          </p>
        </div>

        <form onSubmit={handleStart} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                팀 번호 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={teamNumber}
                onChange={(e) => setTeamNumber(e.target.value)}
                placeholder="예: 5"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition text-sm bg-slate-50 focus:bg-white"
              />
              <p className="mt-1 text-xs text-slate-400">숫자만 적어도 좋습니다 (예: 1, 2, 3...)</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                별명 (활동명) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="예: 윤리수호자, 공정토끼"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition text-sm bg-slate-50 focus:bg-white"
              />
              <p className="mt-1 text-xs text-slate-400">캠프 기간 동안 사용할 멋진 이름을 정해보세요!</p>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="font-bold">⚠️</span> {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              캠프 미션 시작하기
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
