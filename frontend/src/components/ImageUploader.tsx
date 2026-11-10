"use client";
import React, { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

interface Props {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  onNext: () => void;
}

export default function ImageUploader({ files, setFiles, onNext }: Props) {
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 4));
    }
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full mx-auto flex flex-col items-center">
      <h2 className="text-[22px] sm:text-[26px] font-black text-[#111111] mb-6 tracking-tight">
        그림을 골라주세요.
      </h2>

      {/* 🖼️ 이미지 카드 리스트 영역 (기획서 2,3,4번 핵심 레이아웃) */}
      <div className="flex flex-wrap justify-center items-start gap-3 mb-6 w-full py-2">
        {/* 업로드된 이미지 카드들 */}
        {previews.map((src, i) => (
          <div key={i} className="relative flex-shrink-0 w-32 h-32 sm:w-36 sm:h-36 bg-white border-[1.5px] border-[#D9EEF2] rounded-2xl p-2 shadow-sm group animate-in zoom-in-95 duration-300">
            <div className="w-full h-full rounded-xl overflow-hidden bg-[#F9FEFF]">
              <img src={src} alt="preview" className="w-full h-full object-contain" />
            </div>
            {/* 삭제 버튼 (우측 상단) */}
            <button
              onClick={() => removeFile(i)}
              className="absolute -top-2 -right-2 bg-white border border-[#E0E0E0] text-[#999999] rounded-full p-1.5 shadow-md hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <X size={14} strokeWidth={3} />
            </button>
          </div>
        ))}

        {/* ➕ 추가 업로드 박스 (4개 미만일 때만 보임, 항상 우측 끝 배치) */}
        {files.length < 4 && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 w-32 h-32 sm:w-36 sm:h-36 border-2 border-dashed border-[#D9EEF2] rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#F0F9FB] transition-all bg-white group"
          >
            <div className="w-10 h-10 bg-[#F2F8F9] rounded-lg flex items-center justify-center mb-2 group-hover:bg-white transition-colors">
               <img src="/images/file.svg" alt="icon" className="w-5 h-5 opacity-40" 
                    onError={(e) => (e.currentTarget.src = "https://www.svgrepo.com/show/485545/image-square.svg")} />
            </div>
            <p className="text-[14px] text-[#888888] font-medium text-center leading-tight">
              여기를 터치해 주세요
            </p>
            <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleFileChange} />
          </div>
        )}
      </div>

      {/* 하단 안내 문구 */}
      <div className="space-y-1.5 mb-6 text-left w-full max-w-md">
        <div className="flex items-center gap-3">
          <span className="text-[#5C9DFF] text-[15px] font-bold">✓</span>
          <p className="text-[15px] font-medium text-[#666666]">최근의 그림일수록 지금의 마음이 더 잘 보여요.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#5C9DFF] text-[15px] font-bold">✓</span>
          <p className="text-[15px] font-medium text-[#666666]">1장부터 4장까지 고를 수 있어요.</p>
        </div>
      </div>

      {/* 🔵 활성화/비활성화 다음 버튼 */}
      <button
        onClick={onNext}
        disabled={files.length === 0}
        className={`px-14 py-3 rounded-xl font-bold text-[17px] transition-all shadow-md ${
          files.length > 0
            ? "bg-[#5C9DFF] text-white hover:bg-[#4A8DFF] active:scale-95 shadow-[0_10px_20px_rgba(92,157,255,0.3)]"
            : "bg-[#EEEEEE] text-[#BBBBBB] cursor-not-allowed"
        }`}
      >
        다음
      </button>
    </div>
  );
}


