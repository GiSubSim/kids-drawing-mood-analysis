"use client";
import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import PersonaSelector from "@/components/PersonaSelector";
import AnalysisResult from "@/components/AnalysisResult";
import { analyzeImage, AnalysisResponse } from "@/lib/api";

export default function Home() {
  const [isStarted, setIsStarted] = useState(false); 
  const [currentStep, setCurrentStep] = useState(1); 
  const [files, setFiles] = useState<File[]>([]); 
  const [persona, setPersona] = useState<string | null>(null); 
  const [result, setResult] = useState<AnalysisResponse | null>(null); 
  const [loading, setLoading] = useState(false); 

  // 캐릭터별 전용 배경색 매핑
  const personaBgColors: { [key: string]: string } = {
    "마음박사 페페": "bg-[#F8BBD0]",
    "현실친구 라봉이": "bg-[#FFE0B2]",
    "칭찬봇 피코": "bg-[#C8E6C9]",
    "카리스마 샤샤": "bg-[#B3E5FC]",
  };

  const handleStartAnalysis = async () => {
    if (files.length === 0 || !persona) return;
    setLoading(true);
    try {
      const data = await analyzeImage(files, persona);
      setResult(data);
    } catch (e) {
      console.error(e);
      alert("분석에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFiles([]);
    setPersona(null);
    setCurrentStep(1);
    setIsStarted(false);
  };

  if (!isStarted) {
    return (
      <main className="min-h-screen bg-[#EBF5FF] flex flex-col items-center justify-between relative overflow-hidden font-sans">
        <div className="absolute top-[5%] left-[-20%] text-white opacity-20 select-none pointer-events-none text-[320px] wide:text-[500px]">✱</div>
        <div className="absolute bottom-[0%] right-[-20%] text-white opacity-20 select-none pointer-events-none text-[320px] wide:text-[500px]">✱</div>
        <div className="h-10"></div>
        <div className="z-10 flex flex-col items-center text-center px-6 wide:px-10">
          <h1 className="text-[28px] sm:text-[36px] font-black text-[#111111] mb-5 tracking-tight leading-tight wide:text-[72px] wide:mb-12 wide:tracking-tighter">어린이 그림 AI 마음 분석</h1>
          <div className="space-y-1 mb-8 wide:space-y-4 wide:mb-20">
            <p className="text-[16px] text-[#555555] font-medium leading-relaxed wide:text-[36px] wide:leading-snug">내가 그린 그림들 속에는</p>
            <p className="text-[16px] text-[#555555] font-medium leading-relaxed wide:text-[36px] wide:leading-snug">나의 기분과 마음이 담겨 있어요.</p>
            <p className="text-[18px] sm:text-[20px] text-[#333333] font-bold mt-4 wide:text-[42px] wide:mt-12">요즘 나는 어떤 마음일까요?</p>
          </div>
          <button onClick={() => setIsStarted(true)} className="bg-[#5C9DFF] text-white px-14 py-3 rounded-xl font-bold text-[17px] hover:bg-blue-600 transition-all shadow-[0_8px_20px_rgba(92,157,255,0.3)] active:scale-95 wide:px-28 wide:py-8 wide:rounded-[30px] wide:text-[32px] wide:shadow-[0_15px_40px_rgba(92,157,255,0.3)]">시작하기</button>
        </div>
        <footer className="z-10 flex flex-col items-center mb-6 wide:mb-16">
          <div className="flex items-center gap-2 mb-1 wide:gap-4 wide:mb-4">
            <img src="/images/logo_artbonbon_school.png" alt="Artbonbon School" className="h-6 w-auto object-contain wide:h-12" />
            <span className="text-[17px] font-bold text-[#5C9DFF] tracking-tight wide:text-[28px]">아트봉봉스쿨</span>
          </div>
          <p className="text-[#999999] text-[12px] font-medium wide:text-[18px]">©i-Scream arts Co.,Ltd. All rights reserved.</p>
        </footer>
      </main>
    );
  }

  // 결과 화면일 때만 해당 캐릭터 배경색 적용, 아닐 때는 기본 하늘색
  const currentBgClass = result && persona ? personaBgColors[persona] : "bg-[#EBF5FF]";

  return (
    <main className={`min-h-screen ${currentBgClass} flex flex-col font-sans overflow-x-hidden relative transition-colors duration-700`}>
      {/* 💡 최상단 왼쪽 로고 (결과 화면 포함 모든 단계 노출) */}
      <header className="px-6 py-4 flex items-center gap-2 z-[110] wide:p-10 wide:gap-4">
        <img src="/images/logo_artbonbon_school.png" alt="logo" className="h-6 w-auto wide:h-10" />
        <span className={`text-[17px] wide:text-[28px] font-bold ${result ? 'text-gray-800' : 'text-[#5C9DFF]'} tracking-tight font-black`}>아트봉봉스쿨</span>
      </header>

      {/* 로딩 대기 화면 */}
      {loading && (
        <div className="fixed inset-0 z-[200] bg-[#EBF5FF] flex flex-col items-center justify-center animate-in fade-in duration-500">
          <div className="absolute top-[10%] left-[-15%] text-white opacity-40 select-none pointer-events-none text-[260px] wide:text-[400px]">✱</div>
          <div className="absolute bottom-[5%] right-[-15%] text-white opacity-40 select-none pointer-events-none text-[260px] wide:text-[400px]">✱</div>
          <div className="z-10 text-center flex flex-col items-center px-6 wide:px-0">
            <h2 className="text-[22px] sm:text-[26px] font-black text-[#111111] mb-6 leading-snug wide:text-[42px] wide:mb-12 wide:leading-tight">나의 그림을 열심히 분석하고 있어요<br />조금만 기다려 주세요.</h2>
            <div className="bg-white/60 backdrop-blur-sm px-6 py-4 rounded-2xl mb-8 shadow-sm border border-white wide:px-12 wide:py-8 wide:rounded-[40px] wide:mb-20">
              <p className="text-[15px] text-[#666666] font-medium leading-relaxed wide:text-[22px] wide:font-bold">몇 장의 그림만으로는 나의 마음을 다 알수는 없어요.<br />가볍게 즐기며 새로운 마음을 만나보세요.</p>
            </div>
            <div className="flex gap-4">
              <style jsx>{`@keyframes dotFlow { 0%, 20% { opacity: 0; } 40% { opacity: 1; } 100% { opacity: 1; } } .dot { width: 12px; height: 12px; background-color: white; border-radius: 50%; animation: dotFlow 1.5s infinite; } .dot:nth-child(1) { animation-delay: 0s; } .dot:nth-child(2) { animation-delay: 0.3s; } .dot:nth-child(3) { animation-delay: 0.6s; } @media (min-width: 1800px) { .dot { width: 20px; height: 20px; } }`}</style>
              <div className="dot"></div><div className="dot"></div><div className="dot"></div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 w-full flex flex-col items-center justify-start pt-2 px-4 pb-8 wide:pt-4 wide:pb-20">
        {!result ? (
          <div className="w-full max-w-[880px] bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-2 border-[#D9EEF2] flex flex-col items-center justify-center p-6 sm:p-10 wide:w-[95%] wide:max-w-[1200px] wide:rounded-[60px] wide:shadow-[0_20px_60px_rgba(0,0,0,0.05)] wide:border-[3px] wide:min-h-[850px] wide:p-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {currentStep === 1 ? (
              <ImageUploader files={files} setFiles={setFiles} onNext={() => setCurrentStep(2)} />
            ) : (
              <div className="w-full flex flex-col items-center">
                <div className="text-center mb-6 wide:mb-12">
                  <h2 className="text-[22px] sm:text-[26px] font-black text-[#111111] mb-1 wide:text-[36px] wide:mb-2">누구와 함께 그림을 분석해 볼까요?</h2>
                  <p className="text-[15px] text-gray-400 font-medium wide:text-[20px] wide:font-bold">같은 그림이라도 분석하는 내용과 말투가 달라요!</p>
                </div>
                <PersonaSelector persona={persona} setPersona={setPersona} />
                <div className="mt-6 wide:mt-20">
                  <button onClick={handleStartAnalysis} disabled={!persona} className={`px-14 py-3 rounded-xl font-bold text-[17px] transition-all shadow-md wide:px-32 wide:py-6 wide:rounded-[22px] wide:font-black wide:text-[28px] wide:shadow-lg ${persona ? "bg-[#5C9DFF] text-white hover:bg-[#4A8DFF] active:scale-95 shadow-[0_10px_20px_rgba(92,157,255,0.3)]" : "bg-[#EEEEEE] text-[#BBBBBB] cursor-not-allowed"}`}>분석하기</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full animate-in fade-in duration-700">
            <AnalysisResult data={result} persona={persona || ""} files={files} onReset={handleReset} />
          </div>
        )}
      </div>
    </main>
  );
}


