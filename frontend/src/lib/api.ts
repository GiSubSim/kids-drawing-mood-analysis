import axios from "axios";

/**
 * 백엔드 서버(localhost:8000)로 데이터를 보내는 역할
 * 📦 [인터페이스] 분석 결과 데이터 구조
 * 백엔드(FastAPI)에서 보내주는 JSON 응답 값의 타입을 미리 정의합니다.
 * 백엔드의 Pydantic 모델(AnalysisResponse)과 동일한 구조여야 합니다.
 */
export interface AnalysisResponse {
  /** AI 분석 결과 (심리 상태, 색상, 에너지 차트 등) */
  analysis_result: {
    mind_expression: string;        // 마음 표현 문장
    persona_mind_sentence: string;  // 페르소나 말투로 변환된 마음 문장
    persona_energy_sentence: string;// 페르소나 말투로 변환된 에너지 설명
    word_cloud: string[];           // 무드 키워드 리스트 (예: 즐거움, 행복)
    top_5_colors: string[];         // 주요 색상 코드 (HEX/RGB)
    energy_chart: { [key: string]: number }; // 에너지 수치 (joyful: 80.5 등)
  };
  
  /** 캐릭터가 말해주는 전체 감상평 (통문장) */
  character_commentary: string;
  
  /** 감상평을 문단별로 쪼갠 리스트 (화면에 예쁘게 보여주기 위함) */
  commentary_sections: { 
    title: string;   // 섹션 제목 (예: 색채 분위기)
    content: string; // 섹션 내용
  }[];
}

/**
 * 🚀 [API 함수] 이미지 분석 요청
 * 사용자가 업로드한 이미지 파일들과 선택한 페르소나를 백엔드로 전송합니다.
 * * @param files - 사용자가 업로드한 이미지 파일 배열 (File[])
 * @param persona - 선택된 페르소나 이름 (string, 예: "마음박사 페페")
 * @returns 백엔드에서 분석 완료된 데이터 (AnalysisResponse)
 * * @example
 * const result = await analyzeImage(fileList, "칭찬봇 피코");
 */
export const analyzeImage = async (files: File[], persona: string) => {
  // 1. 파일 전송을 위해 FormData 객체 생성
  // (이미지 같은 바이너리 파일은 JSON이 아니라 FormData에 담아야 합니다)
  const formData = new FormData();

  // 2. 파일이 여러 개일 경우 반복해서 formData에 추가
  // 백엔드에서는 List<UploadFile> 형태로 받게 됩니다.
  files.forEach((f) => {
    formData.append("files", f);
  });
  
  // 3. 페르소나 정보 추가
  formData.append("persona", persona);


  // 4. Axios를 사용하여 POST 요청 전송(Render 백엔드 배포용 + 값 없으면 자동 local 개발용 주소 사용하도록 셋팅됨)
  // [수정됨] 환경 변수에서 백엔드 주소를 가져오도록 변경
  // 값이 없으면 로컬 개발용 주소를 사용
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const response = await axios.post<AnalysisResponse>(
    `${backendUrl}/api/analyze`, // 주소 뒤에 엔드포인트 붙임
    formData
  );

  // // 4. Axios를 사용하여 POST 요청 전송(기본 로컬 개발용 주소로 사용하는 셋팅)
  // // <AnalysisResponse>를 적어주면 반환값이 어떤 형태인지 자동완성 지원됨
  // const response = await axios.post<AnalysisResponse>(
  //   "http://localhost:8000/api/analyze", // 백엔드 주소
  //   formData
  //   // 주의: 여기서 'Content-Type': 'multipart/form-data' 헤더를 직접 설정하지 마세요.
  //   // Axios와 브라우저가 FormData를 감지하면 자동으로 적절한 헤더를 생성해줍니다.
  // );

  // 5. 실제 데이터만 추출하여 반환
  return response.data;
};