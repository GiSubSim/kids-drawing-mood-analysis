// Vercel 함수 요청 크기 제한(약 4.5MB) 안에 4장이 들어가도록 업로드 전에 줄인다.
const MAX_SIDE = 1600;
const MAX_BYTES = 900 * 1024;
const QUALITIES = [0.85, 0.75, 0.65, 0.5];

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

export async function compressImage(file: File): Promise<File> {
  if (file.size <= MAX_BYTES) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file; // 브라우저가 못 여는 형식은 원본을 보내고 서버 응답에 맡긴다
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let smallest: Blob | null = null;
  for (const quality of QUALITIES) {
    const blob = await toBlob(canvas, quality);
    if (!blob) continue;
    smallest = blob;
    if (blob.size <= MAX_BYTES) break;
  }
  if (!smallest) return file;

  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([smallest], name, { type: "image/jpeg" });
}
