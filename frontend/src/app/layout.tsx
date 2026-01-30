import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// 💡 로컬 폰트 설정 (파일 경로: src/app/fonts/PretendardVariable.woff2)
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920", // 가변 폰트 웨이트 설정
  variable: "--font-pretendard", // globals.css에서 사용할 변수명
});

export const metadata: Metadata = {
  title: "아트봉봉스쿨 - 마음 분석",
  description: "어린이 그림 AI 마음 분석 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {/* 💡 body 태그에 폰트 변수를 주입하여 전역에서 사용 가능하게 함 */}
      <body className={`${pretendard.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}