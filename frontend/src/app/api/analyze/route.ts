import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/server/prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

// 구 모델은 신규 키에서 404로 막힐 수 있어 순서대로 시도한다.
const MODEL_CANDIDATES = process.env.GEMINI_MODEL
  ? [process.env.GEMINI_MODEL]
  : ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-3.5-flash-lite"];
const ATTEMPT_TIMEOUT_MS = 30000;
const DEADLINE_MS = 54000; // maxDuration(60초) 전에 끝낸다
const MAX_FILES = 4;
const MAX_PERSONA_LENGTH = 40;

const SAFETY_SETTINGS = [
  HarmCategory.HARM_CATEGORY_HARASSMENT,
  HarmCategory.HARM_CATEGORY_HATE_SPEECH,
  HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
  HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
].map((category) => ({ category, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }));

async function analyze(files: File[], persona: string, apiKey: string) {
  const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: "v1beta" } });
  const images = await Promise.all(
    files.map(async (file) => ({
      inlineData: {
        mimeType: file.type || "image/jpeg",
        data: Buffer.from(await file.arrayBuffer()).toString("base64"),
      },
    })),
  );

  const startedAt = Date.now();
  let lastError: unknown = new Error("no_model_available");
  for (const model of MODEL_CANDIDATES) {
    const remaining = DEADLINE_MS - (Date.now() - startedAt);
    if (remaining <= 0) break;
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: "user",
            parts: [
              { text: `사용자가 선택한 페르소나: ${persona}\n위 페르소나 말투로 JSON 포맷에 맞춰 답변해줘.` },
              ...images,
            ],
          },
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          temperature: 0.2,
          safetySettings: SAFETY_SETTINGS,
          httpOptions: { timeout: Math.min(ATTEMPT_TIMEOUT_MS, remaining) },
        },
      });
      return JSON.parse(response.text ?? "");
    } catch (e) {
      lastError = e;
      console.error(`${model} 실패:`, e instanceof Error ? e.message.slice(0, 300) : e);
    }
  }
  throw lastError;
}

// 로그 저장이 실패해도 분석 결과는 돌려준다.
async function saveLog(persona: string, result: unknown) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;

  const db = createClient(url, key, {
    db: { schema: process.env.SUPABASE_SCHEMA || "public" },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error } = await db.from("analysis_logs").insert({ persona, result_json: result });
  if (error) console.error("analysis_logs 저장 실패:", error.message);
}

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GOOGLE_API_KEY 가 설정되지 않았습니다." }, { status: 503 });
  }

  const form = await request.formData();
  const persona = String(form.get("persona") ?? "").trim();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);

  if (!persona || persona.length > MAX_PERSONA_LENGTH) {
    return NextResponse.json({ error: "페르소나를 확인해 주세요." }, { status: 400 });
  }
  if (files.length === 0 || files.length > MAX_FILES || files.some((f) => !f.type.startsWith("image/"))) {
    return NextResponse.json({ error: `이미지는 1~${MAX_FILES}장 올려 주세요.` }, { status: 400 });
  }

  try {
    const result = await analyze(files, persona, apiKey);
    await saveLog(persona, result);
    return NextResponse.json(result);
  } catch (e) {
    console.error("분석 실패:", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "분석에 실패했습니다." }, { status: 502 });
  }
}
