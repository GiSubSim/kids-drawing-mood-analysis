"use client";
import React, { useEffect, useState } from "react";
import { AnalysisResponse } from "../lib/api";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Radar as RadarFill } from 'recharts';

interface Props {
  data: AnalysisResponse;
  persona: string;
  files: File[];
  onReset: () => void;
}

// 키워드 아이템 타입
interface KeywordItem {
  word: string;
  color: string;
  sizeClass: string;
  originalIndex: number;
}

// 그림에서 뽑은 색이 흰 카드에서 안 보일 만큼 밝으면 같은 색조로 어둡게 바꾼다 (명암비 3:1 기준)
function readableOnWhite(color: string): string {
  const value = (color ?? "").trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value);
  const rgb = /^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i.exec(value);
  let channels: number[];
  if (hex) {
    const full = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join("") : hex[1];
    channels = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  } else if (rgb) {
    channels = rgb.slice(1, 4).map(Number);
  } else {
    return color;
  }

  const luminance = (c: number[]) => {
    const [r, g, b] = c.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  if (luminance(channels) <= 0.3) return color;
  let scale = 1;
  let darker = channels;
  while (luminance(darker) > 0.3) {
    scale -= 0.02;
    darker = channels.map((v) => Math.round(v * scale));
  }
  return `rgb(${darker.join(", ")})`;
}

export default function AnalysisResult({ data, persona, files, onReset }: Props) {
  const { analysis_result, commentary_sections } = data;
  const [previews, setPreviews] = useState<string[]>([]);
  const [shuffledKeywords, setShuffledKeywords] = useState<KeywordItem[]>([]);
  const [isCompact, setIsCompact] = useState(false); // 좁은 화면에서는 차트 설명을 숨긴다
  const [isWide, setIsWide] = useState(false); // 1800px 이상에서는 차트 글자를 키운다

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const wide = window.matchMedia("(min-width: 1800px)");
    const update = () => {
      setIsCompact(media.matches);
      setIsWide(wide.matches);
    };
    update();
    media.addEventListener("change", update);
    wide.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      wide.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  useEffect(() => {
    const sizeClasses = [
      "text-[30px] sm:text-[36px] wide:text-[72px] font-black", 
      "text-[26px] sm:text-[30px] wide:text-[56px] font-black", 
      "text-[22px] sm:text-[26px] wide:text-[48px] font-bold",  
      "text-[20px] sm:text-[22px] wide:text-[40px] font-bold",  
      "text-[18px] wide:text-[32px] font-bold"   
    ];

    const keywords: KeywordItem[] = analysis_result.word_cloud.map((word, i) => ({
      word: word,
      color: readableOnWhite(analysis_result.top_5_colors[i]),
      sizeClass: sizeClasses[i] || "text-[16px] wide:text-[24px]",
      originalIndex: i
    }));

    const shuffled = [...keywords].sort(() => Math.random() - 0.5);
    setShuffledKeywords(shuffled);
  }, [analysis_result]);

  const personaThemes: { [key: string]: any } = {
    "마음박사 페페": { 
      main: "#E91E63", highlight: "#F8BBD0", key: "pepe",
      subTitle: "그림을 따뜻하게 이해해 주는 마음 박사 페페의"
    },
    "현실친구 라봉이": { 
      main: "#FF9800", highlight: "#FFE0B2", key: "labong",
      subTitle: "할 말은 하지만, 애정을 놓치지 않는 현실친구 라봉이의"
    },
    "칭찬봇 피코": { 
      main: "#4CAF50", highlight: "#C8E6C9", key: "pico",
      subTitle: "그림을 스캔해서 무한 칭찬 쏟아내는 칭찬봇 피코의"
    },
    "카리스마 샤샤": { 
      main: "#03A9F4", highlight: "#B3E5FC", key: "shasha",
      subTitle: "쿨 하지만 속마음은 응원 가득한 카리스마 샤샤의"
    },
  };

  const theme = personaThemes[persona] || personaThemes["마음박사 페페"];
  
  // 💡 [핵심] 공통 텍스트 스타일 (폰트 크기 15~16px)
  const commonTextStyle = "text-[15px] sm:text-[16px] leading-[1.75] font-medium text-[#333] wide:text-[24px] wide:leading-[1.8] wide:font-bold whitespace-pre-line break-keep";

  const highlightStyle = {
    background: `linear-gradient(to top, ${theme.highlight} 50%, transparent 50%)`,
    padding: '0 4px',
    display: 'inline'
  };

  const chartData = [
    { subject: '즐거움', A: analysis_result.energy_chart.joyful, icon: '🌈', desc: '밝고 활발한 표현으로\n활기찬 느낌이에요.' },
    { subject: '궁금증', A: analysis_result.energy_chart.curious, icon: '🔍', desc: '새로운 장면에 등장해\n더 궁금해지는 느낌이에요.' },
    { subject: '반짝임', A: analysis_result.energy_chart.sparkle, icon: '✨', desc: '눈에 띄는 색과 장식으로\n반짝이는 것에 집중되고 있어요.' },
    { subject: '휴식', A: analysis_result.energy_chart.rest, icon: '🍃', desc: '편안한 장면이 많아서\n조용히 쉬는 차분한 느낌이에요.' },
    { subject: '멍때림', A: analysis_result.energy_chart.spacing_out, icon: '🫧', desc: '빈 공간과 여운이 많아서\n가만히 있고 싶은 느낌이에요.' },
  ];

  const renderCustomTick = ({ payload, x, y, textAnchor, stroke, radius }: any) => {
    const data = chartData.find(d => d.subject === payload.value);
    if (!data) return null;

    let dx = 0;
    let dy = 0;

    switch (data.subject) {
      case '즐거움':
        dy = isWide ? -27 : -18; 
        break;
      case '궁금증':
        dx = 10;  
        dy = 0;
        break;
      case '반짝임':
        dx = 10;  
        dy = isWide ? 40 : 28;  
        break;
      case '휴식':
        dx = 0;
        dy = isWide ? 40 : 28;  
        break;
      case '멍때림':
        dx = -10; 
        dy = 0;
        break;
      default:
        break;
    }

    return (
      <g className="recharts-layer recharts-polar-angle-axis-tick">
        <text 
          x={x + dx} 
          y={y + dy} 
          dy={isCompact ? 0 : isWide ? -15 : -10} 
          textAnchor={textAnchor} 
          fill="#333" 
          style={{ fontSize: isWide ? '22px' : '15px', fontWeight: '800', fontFamily: 'var(--font-pretendard)' }}
        >
          {data.subject} {data.icon}
        </text>
        <text 
          x={x + dx} 
          y={y + dy} 
          textAnchor={textAnchor} 
          fill="#888" 
          style={{ fontSize: isWide ? '14px' : '12px', fontWeight: '600', lineHeight: '1.2', fontFamily: 'var(--font-pretendard)' }}
        >
          {!isCompact && data.desc.split('\n').map((line, i) => (
            <tspan x={x + dx} dy={isWide ? (i === 0 ? 10 : 18) : (i === 0 ? 6 : 14)} key={i}>{line}</tspan>
          ))}
        </text>
      </g>
    );
  };

  const getRowAlignment = (index: number) => {
    switch(index) {
        case 0: return "justify-start"; 
        case 1: return "justify-end";   
        case 2: return "justify-center"; 
        case 3: return "justify-start pl-[15%]"; 
        case 4: return "justify-end pr-[15%]";   
        default: return "justify-start";
    }
  }

  // 💡 [수정됨] .0 제거 및 텍스트 포맷팅
  const formatEnergyText = (text: string) => {
    if (!text) return "";
    
    // 1. .0% -> % 로 변환 (소수점 제거)
    let cleanText = text.replace(/\.0%/g, "%").split(String.fromCharCode(92) + "n").join("\n");

    // 2. "단어 숫자%" 패턴 찾기
    const regex = /([가-힣]+\s\d+(?:[\.]\d+)?%)/g;
    
    return cleanText.split(regex).map((part, i) => {
      // 숫자 데이터(예: 즐거움 85%)는 아주 굵고 검게 강조
      if (regex.test(part)) {
         return <span key={i} className="font-black text-black">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="w-full max-w-[760px] mx-auto space-y-5 pb-6 wide:max-w-[1100px] wide:space-y-16 wide:pb-24 font-sans animate-in fade-in duration-1000">
      
      {/* 1. 상단 타이틀 & 캐릭터 */}
      <section className="flex flex-col items-center relative wide:pt-4">
        <div className="text-center mb-4 relative z-20">
          <p className="text-[14px] font-medium text-[#666] mb-1 wide:text-[20px] wide:font-bold wide:mb-2">{theme.subTitle}</p>
          <h1 className="text-[26px] sm:text-[30px] font-black text-[#111] tracking-tight text-center wide:text-[52px]">마음 분석 결과</h1>
        </div>
        <div className="w-full flex justify-center items-end relative z-0">
          <div className="relative">
            <img src={`/images/${theme.key}_half.png`} alt={persona} className="w-[170px] sm:w-[190px] h-auto wide:w-[420px] object-contain animate-in fade-in slide-in-from-bottom-4 duration-1000 z-10 relative" />
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="absolute top-10 -left-10 z-0"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill={theme.main} /></svg>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="absolute top-1/3 -right-12 z-0"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill={theme.highlight} /></svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="absolute bottom-20 -right-6 z-20 opacity-70"><path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill={theme.main} /></svg>
          </div>
        </div>
        <div className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-lg relative z-10 -mt-6 wide:rounded-[40px] wide:p-14 wide:shadow-2xl wide:-mt-16">
           <div className={`${commonTextStyle} text-center`}>{commentary_sections[0]?.content}</div>
        </div>
      </section>

      {/* 2. 그림 섹션 */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-white/30 wide:rounded-[40px] wide:p-12">
        <h3 className="text-center mb-4 wide:mb-10"><span className="text-[19px] font-bold wide:text-[30px] wide:font-black" style={highlightStyle}>그림</span></h3>
        <div className="flex flex-wrap justify-center gap-3 wide:gap-4"> 
          {previews.map((src, i) => (
            <div key={i} className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl wide:w-[230px] wide:h-[230px] wide:rounded-[32px] overflow-hidden border-2 border-[#f0f0f0] bg-[#fafafa] shadow-inner flex-shrink-0">
              <img src={src} className="w-full h-full object-cover" alt="drawing" />
            </div>
          ))}
        </div>
      </section>

      {/* 3. 마음 키워드 섹션 */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-white/30 wide:rounded-[40px] wide:p-16 text-center">
        <h3 className="mb-4 wide:mb-14"><span className="text-[19px] font-bold wide:text-[30px] wide:font-black" style={highlightStyle}>마음 키워드</span></h3>
        <div className="w-full max-w-[600px] mx-auto flex flex-col gap-y-3 mb-5 py-1 wide:max-w-[850px] wide:gap-y-8 wide:mb-12 wide:py-4">
          {shuffledKeywords.map((item, index) => (
            <div key={item.originalIndex} className={`w-full flex items-center ${getRowAlignment(index)} animate-in fade-in slide-in-from-bottom-2 duration-700`}>
              <span 
                className={`${item.sizeClass} tracking-tighter transition-all duration-500 hover:scale-105 cursor-default leading-none drop-shadow-sm`} 
                style={{ color: item.color }}
              >
                #{item.word}
              </span>
            </div>
          ))}
        </div>
        <div className={`${commonTextStyle} sm:px-4 wide:px-10`}>
          {commentary_sections[1]?.content}
        </div>
      </section>

      {/* 4. 마음 에너지 섹션 */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-white/30 wide:rounded-[40px] wide:p-16 text-center">
        <h3 className="mb-4 wide:mb-14"><span className="text-[19px] font-bold wide:text-[30px] wide:font-black" style={highlightStyle}>마음 에너지</span></h3>
        <div className="h-[300px] sm:h-[360px] w-full mb-3 wide:h-[650px] wide:mb-10 wide:-mt-10"> 
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius={isCompact ? "48%" : "60%"} data={chartData}>
              <PolarGrid stroke="#ddd" />
              <PolarAngleAxis dataKey="subject" tick={renderCustomTick} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <RadarFill name="Energy" dataKey="A" stroke={theme.main} fill={theme.main} fillOpacity={0.3} isAnimationActive={false} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-4 wide:space-y-12">
          
          {/* 💡 [수정] max-w-[7000px] 및 mx-auto 추가하여 아래 텍스트와 너비 동일하게 제한 */}
          <div className="flex justify-center">
            <p className={`${commonTextStyle} text-center max-w-[600px] wide:max-w-[700px] wide:px-4`}>
              {formatEnergyText(analysis_result.persona_energy_sentence)}
            </p>
          </div>
          
          <div className="h-[2px] w-16 bg-gray-100 mx-auto"></div>
          
          {/* 아래 설명글 */}
          <div className="flex justify-center">
            <p className={`${commonTextStyle} text-center max-w-[600px] wide:max-w-[850px] wide:px-4`}>
              {commentary_sections[2]?.content}
            </p>
          </div>
        </div>
      </section>

      {/* 5. 그림 솔루션 섹션 */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-white/30 wide:rounded-[40px] wide:p-16 relative overflow-hidden">
        <h3 className="text-center mb-2 wide:mb-8"><span className="text-[19px] font-bold wide:text-[30px] wide:font-black" style={highlightStyle}>그림 솔루션</span></h3>
        
        <p className="text-center mb-5 text-[14px] leading-relaxed wide:mb-16 wide:text-[24px] wide:px-10 text-[#666]">
          그림 솔루션은 지금의 마음을 환기해 새롭게 바꿔보거나, <br/>좋은 감정을 더 확장해서 이어가 보는 그림 활동 가이드예요.
        </p>

        <div className="flex flex-col md:flex-row gap-5 items-start mb-5 wide:gap-12 wide:mb-20">
          <div className="flex-1 space-y-4 wide:space-y-16">
            {commentary_sections.slice(3).map((section, idx) => (
              <div key={idx} className={`${commonTextStyle}`}>
                {section.content}
              </div>
            ))}
          </div>
          <div className="w-[140px] flex-shrink-0 self-center md:self-end relative wide:w-[340px] wide:pt-10">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="absolute top-10 -left-4 animate-pulse">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill={theme.highlight} />
            </svg>
            <img src={`/images/${theme.key}_side.png`} alt="side char" className="w-full h-auto object-contain" />
          </div>
        </div>
        <div className="bg-[#FBFBFB] rounded-2xl p-5 border-l-4 border-amber-300 text-left shadow-inner wide:mt-16 wide:rounded-[36px] wide:p-14 wide:border-l-[14px]">
           <h4 className="text-amber-600 font-bold text-[16px] mb-2 wide:font-black wide:text-[26px] wide:mb-8">⚠️ 결과가 생각한 것과 다른가요?</h4>
           <ul className="space-y-1 text-[14px] text-[#666] font-medium list-disc ml-5 leading-relaxed wide:space-y-6 wide:text-[22px] wide:font-bold wide:ml-10">
             <li>같은 그림이라도 바라보는 마음에 따라 달라질 수 있어요.</li>
             <li>분석 결과는 정답이 아니라, 마음을 가볍고 즐겁게 이해하기 위한 작은 힌트예요.</li>
             <li>앞으로 나의 마음을 소중히 아끼고 돌보며, 더 즐겁게 자라나는 어린이가 되길 응원 할게요!</li>
           </ul>
        </div>
      </section>

      {/* 확인 버튼 */}
      <div className="flex justify-center pt-1 wide:pt-10 wide:pb-20">
        <button onClick={onReset} className="bg-[#5C9DFF] text-white px-16 py-3 rounded-xl font-bold text-[17px] wide:px-48 wide:py-9 wide:rounded-[32px] wide:font-black wide:text-[36px] wide:shadow-2xl hover:bg-[#4A8DFF] transition-all shadow-md active:scale-95">확인</button>
      </div>
    </div>
  );
}

