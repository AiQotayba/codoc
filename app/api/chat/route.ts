import { NextResponse } from "next/server"
import { z } from "zod"

// ==================== Configuration ====================
const API_CONFIG = {
  URL: "https://ai_agent_medai.syrianserver.us/process_medical_case",
  TIMEOUT: 60000 * 4, // 4 دقائق
  ALLOWED_ORIGINS: ["*"], // أضف دوميناتك المسموحة
}

const ERROR_MESSAGES = {
  invalidInput: "الرسالة الطبية غير صالحة (يجب أن تكون نصاً بين 10-2000 حرف)",
  apiFailure: "فشل في المعالجة الطبية - الرجاء إعادة المحاولة",
  timeout: "انتهى الوقت المخصص للمعالجة - حاول مرة أخرى",
}

// ==================== Zod Schemas ====================
const MedicalCaseSchema = z.object({
  topic: z.string()
    .min(10, ERROR_MESSAGES.invalidInput)
    .max(2000, ERROR_MESSAGES.invalidInput)
    .refine(text => /[\u0600-\u06FF]/.test(text), "النص يجب أن يحتوي على محتوى عربي")
})

// ==================== Mock Data ====================
const getMockData = () => ({
  translated_text_ar: "نبض قلب سريع...",
  privacy_check_output: "تم التحقق من خصوصية المعلومات...",
  // ... باقي البيانات الوهمية
})

// ==================== CORS Headers ====================
const getSecurityHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Security-Policy": "default-src 'self'",
  "X-Content-Type-Options": "nosniff"
})

// ==================== Handlers ====================
export async function OPTIONS(req: Request) {
  const origin = req.headers.get('origin')
  return new NextResponse(null, {
    headers: getSecurityHeaders(origin)
  })
}

export async function POST(req: Request) {
  const origin = req.headers.get('origin')
  const headers = getSecurityHeaders(origin)

  try {
    // التحقق من البيئة واستخدام البيانات الوهمية
    if (process.env.NODE_ENV === 'development' && process.env.USE_MOCK === 'true') {
      return NextResponse.json(getMockData(), { headers })
    }

    // التحقق من صحة البيانات المدخلة
    const body = await req.json()
    const validation = MedicalCaseSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten() },
        { status: 422, headers }
      )
    }

    // إدارة الاتصال بالAPI مع مهلة زمنية
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT)

    const response = await fetch(API_CONFIG.URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.API_KEY}`
      },
      body: JSON.stringify({ topic: validation.data.topic }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    // معالجة رد API
    if (!response.ok) throw new Error(`API Error: ${response.status}`)

    const data = await response.json()

    if (!data?.final_report_ar) {
      throw new Error("استجابة API غير مكتملة")
    }

    return NextResponse.json(data, { headers })

  } catch (error: any) {
    // إدارة الأخطاء المركزية
    console.error("API Error:", error)

    return NextResponse.json(
      {
        error: ERROR_MESSAGES.apiFailure,
        code: handleErrorCode(error),
        details: shouldShowDetails() ? error.message : undefined
      },
      {
        status: error instanceof z.ZodError ? 422 : 500,
        headers
      }
    )
  }
}

// ==================== Helper Functions ====================
function handleErrorCode(error: unknown): string {
  if (error instanceof z.ZodError) return "VALIDATION_ERROR"
  if (error instanceof DOMException && error.name === 'AbortError') return "TIMEOUT_ERROR"
  if (error instanceof Error && error.message.includes('API Error')) return "API_ERROR"
  return "UNKNOWN_ERROR"
}

function shouldShowDetails(): boolean {
  return process.env.NODE_ENV === 'development'
}