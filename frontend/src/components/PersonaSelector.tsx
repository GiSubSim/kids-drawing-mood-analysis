"use client";
import React from "react";

interface Props {
  persona: string | null;
  setPersona: (p: string) => void;
}

export default function PersonaSelector({ persona, setPersona }: Props) {
  const options = [
    { 
      name: "마음박사 페페", 
      img: "/images/pepe_front.png", 
      desc: "따뜻하고 다정하게\n박사님 스타일의 마음 읽기",
      bgColor: "bg-[#E91E63]" // 기획안 레드
    },
    { 
      name: "현실친구 라봉이", 
      img: "/images/labong_front.png", 
      desc: "솔직하지만 애정있는\n찐한 친구 스타일의 마음 읽기",
      bgColor: "bg-[#FF9800]" // 기획안 오렌지
    },
    { 
      name: "칭찬봇 피코", 
      img: "/images/pico_front.png", 
      desc: "완벽하게 스캔하는\n로봇 스타일의 마음 읽기",
      bgColor: "bg-[#4CAF50]" // 기획안 그린
    },
    { 
      name: "카리스마 샤샤", 
      img: "/images/shasha_front.png", 
      desc: "쿨 하고 센스 있는\n사나이 스타일의 마음 읽기",
      bgColor: "bg-[#03A9F4]" // 기획안 블루
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full wide:gap-4">
      {options.map((opt) => (
        <button
          key={opt.name}
          onClick={() => setPersona(opt.name)}
          className={`relative p-4 rounded-2xl transition-all duration-300 flex flex-col items-center min-h-[230px] shadow-sm wide:p-6 wide:rounded-[32px] wide:min-h-[360px] ${
            persona === opt.name
              ? `${opt.bgColor} text-white scale-105 z-10 shadow-xl`
              : "bg-white text-gray-800 border-2 border-gray-100 hover:border-gray-200"
          }`}
        >
          <div className={`text-[16px] wide:text-[22px] font-bold wide:font-black mb-2 wide:mb-6 ${persona === opt.name ? "text-white" : "text-gray-900"}`}>{opt.name}</div>
          <div className="flex-1 flex items-center justify-center mb-2 wide:mb-6">
            <img src={opt.img} alt={opt.name} className="w-full max-w-[96px] object-contain wide:max-w-[140px]" />
          </div>
          <div className={`text-[13px] leading-snug font-medium text-center wide:text-[14px] wide:leading-relaxed wide:font-bold whitespace-pre-line opacity-90 ${persona === opt.name ? "text-white" : "text-gray-400"}`}>{opt.desc}</div>
          {persona === opt.name && (
            <div className="absolute top-2 right-2 text-white wide:top-4 wide:right-4">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[13px] font-black wide:w-8 wide:h-8 wide:text-base">✓</div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}