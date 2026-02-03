// "use client";
// import { useState } from "react";
// import ImageUploader from "@/components/ImageUploader";
// import PersonaSelector from "@/components/PersonaSelector";
// import AnalysisResult from "@/components/AnalysisResult";
// import { analyzeImage, AnalysisResponse } from "@/lib/api";

// export default function Home() {
//   const [isStarted, setIsStarted] = useState(false); 
//   const [currentStep, setCurrentStep] = useState(1); 
//   const [files, setFiles] = useState<File[]>([]); 
//   const [persona, setPersona] = useState<string | null>(null); 
//   const [result, setResult] = useState<AnalysisResponse | null>(null); 
//   const [loading, setLoading] = useState(false); 

//   // 캐릭터별 전용 배경색 매핑
//   const personaBgColors: { [key: string]: string } = {
//     "마음박사 페페": "bg-[#F8BBD0]",
//     "현실친구 라봉이": "bg-[#FFE0B2]",
//     "칭찬봇 피코": "bg-[#C8E6C9]",
//     "카리스마 샤샤": "bg-[#B3E5FC]",
//   };

//   const handleStartAnalysis = async () => {
//     if (files.length === 0 || !persona) return;
//     setLoading(true);
//     try {
//       const data = await analyzeImage(files, persona);
//       setResult(data);
//     } catch (e) {
//       console.error(e);
//       alert("분석 실패! 서버 연결을 확인해주세요.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReset = () => {
//     setResult(null);
//     setFiles([]);
//     setPersona(null);
//     setCurrentStep(1);
//     setIsStarted(false);
//   };

//   if (!isStarted) {
//     return (
//       <main className="min-h-screen bg-[#EBF5FF] flex flex-col items-center justify-between relative overflow-hidden font-sans">
//         <div className="absolute top-[5%] left-[-20%] text-white opacity-20 select-none pointer-events-none" style={{ fontSize: '500px' }}>✱</div>
//         <div className="absolute bottom-[0%] right-[-20%] text-white opacity-20 select-none pointer-events-none" style={{ fontSize: '500px' }}>✱</div>
//         <div className="h-10"></div>
//         <div className="z-10 flex flex-col items-center text-center px-10">
//           <h1 className="text-[56px] sm:text-[72px] font-black text-[#111111] mb-12 tracking-tighter leading-tight">어린이 그림 AI 마음 분석</h1>
//           <div className="space-y-4 mb-20">
//             <p className="text-[28px] sm:text-[36px] text-[#555555] font-medium leading-snug">내가 그린 그림들 속에는</p>
//             <p className="text-[28px] sm:text-[36px] text-[#555555] font-medium leading-snug">나의 기분과 마음이 담겨 있어요.</p>
//             <p className="text-[32px] sm:text-[42px] text-[#333333] font-bold mt-12">요즘 나는 어떤 마음일까요?</p>
//           </div>
//           <button onClick={() => setIsStarted(true)} className="bg-[#5C9DFF] text-white px-28 py-8 rounded-[30px] font-bold text-[32px] hover:bg-blue-600 transition-all shadow-[0_15px_40px_rgba(92,157,255,0.3)] active:scale-95">시작하기</button>
//         </div>
//         <footer className="z-10 flex flex-col items-center mb-16">
//           <div className="flex items-center gap-4 mb-4">
//             <img src="/images/logo_artbonbon_school.png" alt="Artbonbon School" className="h-12 w-auto object-contain" />
//             <span className="text-[28px] font-bold text-[#5C9DFF] tracking-tight">아트봉봉스쿨</span>
//           </div>
//           <p className="text-[#999999] text-[18px] font-medium">©i-Scream arts Co.,Ltd. All rights reserved.</p>
//         </footer>
//       </main>
//     );
//   }

//   // 결과 화면일 때만 해당 캐릭터 배경색 적용, 아닐 때는 기본 하늘색
//   const currentBgClass = result && persona ? personaBgColors[persona] : "bg-[#EBF5FF]";

//   return (
//     <main className={`min-h-screen ${currentBgClass} flex flex-col font-sans overflow-x-hidden relative transition-colors duration-700`}>
//       {/* 💡 최상단 왼쪽 로고 (결과 화면 포함 모든 단계 노출) */}
//       <header className="p-10 flex items-center gap-4 z-[110]">
//         <img src="/images/logo_artbonbon_school.png" alt="logo" className="h-10 w-auto" />
//         <span className={`text-[28px] font-bold ${result ? 'text-gray-800' : 'text-[#5C9DFF]'} tracking-tight font-black`}>아트봉봉스쿨</span>
//       </header>

//       {/* 로딩 대기 화면 */}
//       {loading && (
//         <div className="fixed inset-0 z-[200] bg-[#EBF5FF] flex flex-col items-center justify-center animate-in fade-in duration-500">
//           <div className="absolute top-[10%] left-[-15%] text-white opacity-40 select-none pointer-events-none" style={{ fontSize: '400px' }}>✱</div>
//           <div className="absolute bottom-[5%] right-[-15%] text-white opacity-40 select-none pointer-events-none" style={{ fontSize: '400px' }}>✱</div>
//           <div className="z-10 text-center flex flex-col items-center">
//             <h2 className="text-[42px] font-black text-[#111111] mb-12 leading-tight">나의 그림을 열심히 분석하고 있어요<br />조금만 기다려 주세요.</h2>
//             <div className="bg-white/60 backdrop-blur-sm px-12 py-8 rounded-[40px] mb-20 shadow-sm border border-white">
//               <p className="text-[22px] text-[#666666] font-bold leading-relaxed">몇 장의 그림만으로는 나의 마음을 다 알수는 없어요.<br />가볍게 즐기며 새로운 마음을 만나보세요.</p>
//             </div>
//             <div className="flex gap-4">
//               <style jsx>{`@keyframes dotFlow { 0%, 20% { opacity: 0; } 40% { opacity: 1; } 100% { opacity: 1; } } .dot { width: 20px; height: 20px; background-color: white; border-radius: 50%; animation: dotFlow 1.5s infinite; } .dot:nth-child(1) { animation-delay: 0s; } .dot:nth-child(2) { animation-delay: 0.3s; } .dot:nth-child(3) { animation-delay: 0.6s; }`}</style>
//               <div className="dot"></div><div className="dot"></div><div className="dot"></div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex-1 w-full flex flex-col items-center justify-start pt-4 px-4 pb-20">
//         {!result ? (
//           <div className="w-[95%] max-w-[1200px] bg-white rounded-[60px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border-[3px] border-[#D9EEF2] min-h-[850px] flex flex-col items-center justify-center p-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
//             {currentStep === 1 ? (
//               <ImageUploader files={files} setFiles={setFiles} onNext={() => setCurrentStep(2)} />
//             ) : (
//               <div className="w-full flex flex-col items-center">
//                 <div className="text-center mb-12">
//                   <h2 className="text-[36px] font-black text-[#111111] mb-2">누구와 함께 그림을 분석해 볼까요?</h2>
//                   <p className="text-[20px] text-gray-400 font-bold">같은 그림이라도 분석하는 내용과 말투가 달라요!</p>
//                 </div>
//                 <PersonaSelector persona={persona} setPersona={setPersona} />
//                 <div className="mt-20">
//                   <button onClick={handleStartAnalysis} disabled={!persona} className={`px-32 py-6 rounded-[22px] font-black text-[28px] transition-all shadow-lg ${persona ? "bg-[#5C9DFF] text-white hover:bg-[#4A8DFF] active:scale-95 shadow-[0_10px_20px_rgba(92,157,255,0.3)]" : "bg-[#EEEEEE] text-[#BBBBBB] cursor-not-allowed"}`}>분석하기</button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="w-full animate-in fade-in duration-700">
//             <AnalysisResult data={result} persona={persona || ""} files={files} onReset={handleReset} />
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }



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
      alert("분석 실패! 서버 연결을 확인해주세요.");
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
        {/* 장식용 별 (모바일에서는 숨김 or 크기 줄임) */}
        <div className="absolute top-[5%] left-[-20%] text-white opacity-20 select-none pointer-events-none text-[200px] md:text-[500px]">✱</div>
        <div className="absolute bottom-[0%] right-[-20%] text-white opacity-20 select-none pointer-events-none text-[200px] md:text-[500px]">✱</div>
        
        <div className="h-10"></div>
        <div className="z-10 flex flex-col items-center text-center px-6 md:px-10 w-full">
          {/* 폰트 크기 반응형 적용 (text-[36px] -> md:text-[72px]) */}
          <h1 className="text-[36px] md:text-[72px] font-black text-[#111111] mb-8 md:mb-12 tracking-tighter leading-tight break-keep">
            어린이 그림<br className="md:hidden"/> AI 마음 분석
          </h1>
          <div className="space-y-2 md:space-y-4 mb-12 md:mb-20">
            <p className="text-[18px] md:text-[36px] text-[#555555] font-medium leading-snug break-keep">내가 그린 그림들 속에는</p>
            <p className="text-[18px] md:text-[36px] text-[#555555] font-medium leading-snug break-keep">나의 기분과 마음이 담겨 있어요.</p>
            <p className="text-[22px] md:text-[42px] text-[#333333] font-bold mt-8 md:mt-12">요즘 나는 어떤 마음일까요?</p>
          </div>
          <button onClick={() => setIsStarted(true)} className="bg-[#5C9DFF] text-white w-full max-w-[300px] md:w-auto md:px-28 py-5 md:py-8 rounded-[30px] font-bold text-[24px] md:text-[32px] hover:bg-blue-600 transition-all shadow-[0_15px_40px_rgba(92,157,255,0.3)] active:scale-95">
            시작하기
          </button>
        </div>
        <footer className="z-10 flex flex-col items-center mb-10 md:mb-16">
          <div className="flex items-center gap-3 md:gap-4 mb-4">
            <img src="/images/logo_artbonbon_school.png" alt="Artbonbon School" className="h-8 md:h-12 w-auto object-contain" />
            <span className="text-[20px] md:text-[28px] font-bold text-[#5C9DFF] tracking-tight">아트봉봉스쿨</span>
          </div>
          <p className="text-[#999999] text-[12px] md:text-[18px] font-medium">©i-Scream arts Co.,Ltd. All rights reserved.</p>
        </footer>
      </main>
    );
  }

  const currentBgClass = result && persona ? personaBgColors[persona] : "bg-[#EBF5FF]";

  return (
    <main className={`min-h-screen ${currentBgClass} flex flex-col font-sans overflow-x-hidden relative transition-colors duration-700`}>
      <header className="p-6 md:p-10 flex items-center gap-3 md:gap-4 z-[110]">
        <img src="/images/logo_artbonbon_school.png" alt="logo" className="h-8 md:h-10 w-auto" />
        <span className={`text-[20px] md:text-[28px] font-bold ${result ? 'text-gray-800' : 'text-[#5C9DFF]'} tracking-tight font-black`}>아트봉봉스쿨</span>
      </header>

      {/* 로딩 화면 반응형 처리 */}
      {loading && (
        <div className="fixed inset-0 z-[200] bg-[#EBF5FF] flex flex-col items-center justify-center animate-in fade-in duration-500 px-6">
           {/* 배경 별 크기 조정 */}
          <div className="absolute top-[10%] left-[-15%] text-white opacity-40 select-none pointer-events-none text-[200px] md:text-[400px]">✱</div>
          <div className="absolute bottom-[5%] right-[-15%] text-white opacity-40 select-none pointer-events-none text-[200px] md:text-[400px]">✱</div>
          
          <div className="z-10 text-center flex flex-col items-center w-full">
            <h2 className="text-[28px] md:text-[42px] font-black text-[#111111] mb-8 md:mb-12 leading-tight break-keep">
              나의 그림을<br/>열심히 분석하고 있어요
            </h2>
            <div className="bg-white/60 backdrop-blur-sm px-6 py-6 md:px-12 md:py-8 rounded-[30px] md:rounded-[40px] mb-12 md:mb-20 shadow-sm border border-white w-full max-w-[600px]">
              <p className="text-[16px] md:text-[22px] text-[#666666] font-bold leading-relaxed break-keep">
                몇 장의 그림만으로는 나의 마음을 다 알수는 없어요.<br />가볍게 즐기며 새로운 마음을 만나보세요.
              </p>
            </div>
            {/* 점 애니메이션 (그대로 유지) */}
            <div className="flex gap-4">
              <style jsx>{`@keyframes dotFlow { 0%, 20% { opacity: 0; } 40% { opacity: 1; } 100% { opacity: 1; } } .dot { width: 15px; height: 15px; background-color: white; border-radius: 50%; animation: dotFlow 1.5s infinite; } .dot:nth-child(1) { animation-delay: 0s; } .dot:nth-child(2) { animation-delay: 0.3s; } .dot:nth-child(3) { animation-delay: 0.6s; }`}</style>
              <div className="dot"></div><div className="dot"></div><div className="dot"></div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 w-full flex flex-col items-center justify-start pt-2 px-4 pb-20">
        {!result ? (
          // 컨테이너: w-[95%] 유지하되 max-w, padding, min-h 조정
          <div className="w-full md:w-[95%] max-w-[1200px] bg-white rounded-[30px] md:rounded-[60px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border-[3px] border-[#D9EEF2] min-h-[600px] md:min-h-[850px] flex flex-col items-center justify-center p-6 md:p-16 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {currentStep === 1 ? (
              <ImageUploader files={files} setFiles={setFiles} onNext={() => setCurrentStep(2)} />
            ) : (
              <div className="w-full flex flex-col items-center">
                <div className="text-center mb-8 md:mb-12">
                  <h2 className="text-[24px] md:text-[36px] font-black text-[#111111] mb-2 break-keep">누구와 함께<br className="md:hidden"/> 그림을 분석해 볼까요?</h2>
                  <p className="text-[14px] md:text-[20px] text-gray-400 font-bold mt-2">같은 그림이라도 말투가 달라요!</p>
                </div>
                <PersonaSelector persona={persona} setPersona={setPersona} />
                <div className="mt-12 md:mt-20 w-full flex justify-center">
                  <button 
                    onClick={handleStartAnalysis} 
                    disabled={!persona} 
                    className={`w-full max-w-[400px] md:w-auto px-10 md:px-32 py-5 md:py-6 rounded-[22px] font-black text-[20px] md:text-[28px] transition-all shadow-lg ${persona ? "bg-[#5C9DFF] text-white hover:bg-[#4A8DFF] active:scale-95 shadow-[0_10px_20px_rgba(92,157,255,0.3)]" : "bg-[#EEEEEE] text-[#BBBBBB] cursor-not-allowed"}`}
                  >
                    분석하기
                  </button>
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