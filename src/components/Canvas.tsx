import React from 'react';
import { CanvasState } from '../types';
import { LayoutGrid, AlertCircle, Info, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

interface CanvasProps {
  canvas: CanvasState;
  setCanvas: React.Dispatch<React.SetStateAction<CanvasState>>;
  onNext: () => void;
}

export default function Canvas({ canvas, setCanvas, onNext }: CanvasProps) {
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleInputChange = (field: keyof CanvasState, value: any) => {
    setCanvas(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (inputField: keyof CanvasState['allowedInputs'], checked: boolean) => {
    // block actual personal data to enforce ethics
    if (inputField !== 'teamNumber' && inputField !== 'nickname') {
      alert('⚠️ 개인정보 최소 수집 원칙! 실제 개인정보(이름, 연락처, 주소, 생년월일)는 해킹이나 오남용 위험이 크므로 예약 에이전트 설계 단계에서 절대 체크(수집)할 수 없게 차단되어 있습니다.');
      return;
    }
    setCanvas(prev => ({
      ...prev,
      allowedInputs: {
        ...prev.allowedInputs,
        [inputField]: checked
      }
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onNext();
    }, 1200);
  };

  // Helper template button to fill values quickly so students or teachers can test without typing everything from scratch
  const loadExampleTemplate = () => {
    setCanvas({
      agentName: "공정지킴이 에이전트 v1",
      problem: "인공지능 리셀러 프로그램이 매크로를 이용해 한정판 상품을 순식간에 매진시켜서, 정작 물건이 정말 필요한 학생들이 정가에 구매하지 못하고 있습니다.",
      target: "인기 있는 한정판 물건을 독점하지 않고, 모든 사람이 공정하고 안전한 규칙 하에 한 팀당 1개씩만 골고루 구매할 수 있게 지원합니다.",
      allowedInputs: {
        teamNumber: true,
        nickname: true,
        realName: false,
        phoneNumber: false,
        address: false,
        birthDate: false
      },
      forbiddenActions: "매크로 기법이나 특정 팀에게 우선권을 주는 중복 예약 금지, 사용자의 동의나 최종 확인 없이 마음대로 예약을 자동 확정하여 결제 단계로 넘기는 행위 금지.",
      humanCheckMoment: "예약 슬롯이 가능하고 구매 조건을 충족했을 때, 예약을 바로 확정하지 않고 '사용자가 최종 동의 버튼(확인 버튼)'을 누르는 바로 그 순간!",
      privacyRules: "진짜 집 주소나 전화번호를 절대 묻지 않고, 오직 '팀 번호'와 '별명'만 수집하여 예약 처리를 진행하며, 임시 데이터는 활동 완료 후 폐기합니다.",
      fairnessRules: "1개 팀은 동일한 시간대에 오직 1개의 부스 상품만 예약 가능하게 제한하고, 남은 수량이 0이 되면 예약을 받지 않고 공정하게 대기자 순번으로 등록하도록 권유합니다."
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto" id="canvas-view">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-950 flex items-center gap-2 font-display">
            <LayoutGrid className="text-indigo-600" size={22} />
            1단계: AI 윤리 설계 캔버스
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            리셀러 AI의 불공정함을 고칠 새로운 착한 AI의 핵심 규칙과 명세서를 직접 설계해보세요.
          </p>
        </div>
        <button
          onClick={loadExampleTemplate}
          type="button"
          className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 text-amber-800 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer self-start md:self-auto shadow-xs"
        >
          💡 모범 예시 채워넣기 (빠른 체험)
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">1</span>
              <label className="block text-sm font-bold text-slate-900">
                에이전트 이름
              </label>
            </div>
            <p className="text-xs text-slate-400 -mt-2">내가 설계할 윤리적인 인공지능 에이전트의 멋진 이름을 지어주세요.</p>
            <input
              type="text"
              required
              value={canvas.agentName}
              onChange={(e) => handleInputChange('agentName', e.target.value)}
              placeholder="예: 공정마켓 도우미, 든든이 에이전트"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition bg-slate-50 focus:bg-white text-slate-850"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">2</span>
              <label className="block text-sm font-bold text-slate-900">
                해결할 문제 상황
              </label>
            </div>
            <p className="text-xs text-slate-400 -mt-2">기존 리셀러 AI가 일으키던 불합리한 점이나 고쳐야 할 문제를 적어보세요.</p>
            <textarea
              required
              rows={2}
              value={canvas.problem}
              onChange={(e) => handleInputChange('problem', e.target.value)}
              placeholder="예: 한정판 상품 독점 예약 문제, 민감한 개인정보 요구 문제..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition resize-none bg-slate-50 focus:bg-white text-slate-850"
            />
          </div>
        </div>

        {/* Target and Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">3</span>
              <label className="block text-sm font-bold text-slate-900">
                에이전트의 최종 목표
              </label>
            </div>
            <p className="text-xs text-slate-400 -mt-2">이 에이전트는 누구를 돕기 위해 어떤 선한 목표를 가지고 활동해야 하나요?</p>
            <textarea
              required
              rows={2}
              value={canvas.target}
              onChange={(e) => handleInputChange('target', e.target.value)}
              placeholder="예: 모든 예약 희망자가 균등하게 선착순 기회를 얻고, 중복 사재기를 막도록 기여한다."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition resize-none bg-slate-50 focus:bg-white text-slate-850"
            />
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">4</span>
              <label className="block text-sm font-bold text-slate-900">
                AI가 입력받을 정보 선택 (개인정보 보호)
              </label>
            </div>
            <p className="text-xs text-rose-500 font-medium -mt-2">
              ⚠️ 실제 민감 정보(이름, 번호 등)는 개인정보 노출 차단을 위해 비활성화되어 있습니다.
            </p>
            
            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-indigo-100 bg-indigo-50/40 cursor-pointer text-xs font-bold text-indigo-900">
                <input
                  type="checkbox"
                  checked={canvas.allowedInputs.teamNumber}
                  onChange={(e) => handleCheckboxChange('teamNumber', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-indigo-200 focus:ring-indigo-500/20"
                />
                팀 번호 (식별용)
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-indigo-100 bg-indigo-50/40 cursor-pointer text-xs font-bold text-indigo-900">
                <input
                  type="checkbox"
                  checked={canvas.allowedInputs.nickname}
                  onChange={(e) => handleCheckboxChange('nickname', e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-indigo-200 focus:ring-indigo-500/20"
                />
                별명 (닉네임)
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed text-xs">
                <input
                  type="checkbox"
                  disabled
                  checked={canvas.allowedInputs.realName}
                  onChange={(e) => handleCheckboxChange('realName', e.target.checked)}
                  className="w-4 h-4 rounded text-slate-300"
                />
                실제 이름 (차단)
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed text-xs">
                <input
                  type="checkbox"
                  disabled
                  checked={canvas.allowedInputs.phoneNumber}
                  onChange={(e) => handleCheckboxChange('phoneNumber', e.target.checked)}
                  className="w-4 h-4 rounded text-slate-300"
                />
                전화번호 (차단)
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed text-xs">
                <input
                  type="checkbox"
                  disabled
                  checked={canvas.allowedInputs.address}
                  onChange={(e) => handleCheckboxChange('address', e.target.checked)}
                  className="w-4 h-4 rounded text-slate-300"
                />
                집 주소 (차단)
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed text-xs">
                <input
                  type="checkbox"
                  disabled
                  checked={canvas.allowedInputs.birthDate}
                  onChange={(e) => handleCheckboxChange('birthDate', e.target.checked)}
                  className="w-4 h-4 rounded text-slate-300"
                />
                생년월일 (차단)
              </label>
            </div>
          </div>
        </div>

        {/* Ethics Details Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
          <h3 className="text-lg font-bold text-slate-950 border-b border-slate-100 pb-3 flex items-center gap-2 font-display">
            <ShieldCheck className="text-emerald-500" size={20} />
            인공지능 윤리 행동 수칙 설계 (가장 중요!)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-rose-50 text-rose-500 text-[10px] font-bold flex items-center justify-center border border-rose-100">🛑</span>
                <label className="block text-sm font-bold text-slate-850">
                  절대 하면 안 되는 금지 행동 (부작용 예방)
                </label>
              </div>
              <textarea
                required
                rows={3}
                value={canvas.forbiddenActions}
                onChange={(e) => handleInputChange('forbiddenActions', e.target.value)}
                placeholder="예: 사람이 인지하지 못하게 뒤에서 자동으로 예약을 승인하고 결제하는 꼼수 부리기 금지..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none text-sm transition bg-slate-50 focus:bg-white text-slate-850"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-500 text-[10px] font-bold flex items-center justify-center border border-amber-100">👤</span>
                <label className="block text-sm font-bold text-slate-850">
                  사람 확인이 꼭 필요한 순간 (Human-in-the-loop)
                </label>
                <div className="group relative">
                  <Info size={14} className="text-slate-400 cursor-pointer" />
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] p-2 rounded-lg w-56 z-20">
                    <b>Human-In-The-Loop:</b> 인공지능이 멋대로 모든 결정을 내리지 않고, 사람의 감독과 최종 컨펌을 반드시 거치는 설계 원칙입니다.
                  </div>
                </div>
              </div>
              <textarea
                required
                rows={3}
                value={canvas.humanCheckMoment}
                onChange={(e) => handleInputChange('humanCheckMoment', e.target.value)}
                placeholder="예: 물건 구매 의사 최종 결정 시점. 화면에 물건 가격, 슬롯, 환불 수칙 등을 표시하고 사람이 마지막에 '확인 완료' 버튼을 클릭하는 순간."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition bg-slate-50 focus:bg-white text-slate-850"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-500 text-[10px] font-bold flex items-center justify-center border border-blue-100">🔒</span>
                <label className="block text-sm font-bold text-slate-850">
                  개인정보 보호 규칙 (Privacy)
                </label>
              </div>
              <textarea
                required
                rows={3}
                value={canvas.privacyRules}
                onChange={(e) => handleInputChange('privacyRules', e.target.value)}
                placeholder="예: 진짜 예약 시스템처럼 전송하지만, 실제 데이터베이스에는 오직 팀 번호와 별명만 등록해두고 주소/연락처 등의 필드는 생성 자체를 금지한다."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition bg-slate-50 focus:bg-white text-slate-850"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 text-[10px] font-bold flex items-center justify-center border border-emerald-100">⚖️</span>
                <label className="block text-sm font-bold text-slate-850">
                  공정성 준수 규칙 (Fairness)
                </label>
              </div>
              <textarea
                required
                rows={3}
                value={canvas.fairnessRules}
                onChange={(e) => handleInputChange('fairnessRules', e.target.value)}
                placeholder="예: 한 팀이 한 슬롯에 여러 부스 물건을 한꺼번에 사재기하는 편법을 방지하기 위해 중복 신청을 확인하여 차단한다."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition bg-slate-50 focus:bg-white text-slate-850"
              />
            </div>
          </div>
        </div>

        {/* Navigation Button */}
        <div className="flex items-center justify-between pt-4">
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <AlertCircle size={14} className="text-amber-500" />
            빈칸 없이 모두 입력해야 다음 테스트 단계로 이동할 수 있습니다.
          </div>
          
          <button
            type="submit"
            disabled={saveSuccess}
            className={`px-6 py-3 font-bold rounded-xl shadow-xs transition duration-150 flex items-center gap-2 cursor-pointer text-sm ${
              saveSuccess
                ? 'bg-emerald-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
            }`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 size={16} className="animate-bounce" />
                설계 완료! 이동 중...
              </>
            ) : (
              <>
                윤리 설계 저장 후 다음 단계로
                <HeartHandshake size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
