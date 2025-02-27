import { NextResponse } from "next/server"

// Mock data for when API is unavailable
const mockResponse = {
  translated_text_ar:
    "نبض قلب سريع (الخفقان) يحدث بشكل متكرر على مدار الأشهر القليلة الماضية، مع نوبات تستمر من عدة دقائق إلى أكثر من ساعة.",
  privacy_check_output: "تم التحقق من خصوصية المعلومات المقدمة. لا توجد معلومات شخصية حساسة.",
  information_gathering_output: `
Patient presents with:
- Recurring episodes of rapid heartbeat (palpitations)
- Episodes lasting from several minutes to over an hour
- Condition persisting over the past few months
- No mention of other symptoms or medical history
Additional information needed:
- Frequency of episodes
- Any triggers identified
- Associated symptoms
- Previous medical conditions
- Current medications
- Family history of heart conditions`,
  initial_diagnosis_output: `
Preliminary assessment suggests:
1. Possible paroxysmal supraventricular tachycardia (PSVT)
2. Consider atrial fibrillation
3. Anxiety-induced palpitations should be ruled out
4. Need to evaluate for underlying cardiac conditions
5. Requires further cardiac workup including:
   - ECG during episodes
   - 24-hour Holter monitoring
   - Basic cardiac workup`,
  cardiac_consultation_output: `
Cardiac Specialist Assessment:
1. Pattern suggests paroxysmal arrhythmia
2. Duration and frequency indicate need for:
   - Comprehensive cardiac evaluation
   - ECG during symptoms
   - Extended cardiac monitoring
   - Echocardiogram
3. Risk factors need assessment
4. May require antiarrhythmic medication
5. Referral to cardiologist recommended`,
  medical_validation_output: `
Medical Knowledge Validation:
1. Symptoms consistent with cardiac arrhythmia
2. Differential diagnoses:
   - Supraventricular tachycardia
   - Atrial fibrillation
   - Anxiety-related palpitations
3. Evidence-based approach requires:
   - Documentation of episodes
   - Cardiac monitoring
   - Risk factor modification
4. Treatment options based on:
   - Specific arrhythmia type
   - Frequency and duration
   - Impact on quality of life`,
  final_report:
    "Based on the presented symptoms of recurring rapid heartbeat episodes lasting from minutes to hours over several months, a comprehensive cardiac evaluation is recommended. The pattern suggests possible paroxysmal arrhythmia, requiring documentation through ECG during symptoms and extended cardiac monitoring. Immediate consultation with a cardiologist is advised for proper diagnosis and treatment planning.",
  final_report_ar: `بناءً على الأعراض المقدمة المتمثلة في نوبات متكررة من تسارع ضربات القلب التي تستمر من دقائق إلى ساعات على مدى عدة أشهر، يوصى بإجراء تقييم قلبي شامل.

التشخيص المبدئي:
- يشير النمط إلى احتمال وجود اضطراب في نظم القلب (عدم انتظام ضربات القلب)
- قد يكون تسرع القلب فوق البطيني الانتيابي أو الرجفان الأذيني

الخطوات المطلوبة:
1. توثيق النوبات من خلال:
   - تخطيط القلب أثناء الأعراض
   - مراقبة القلب المستمرة (هولتر)
   - فحص صدى القلب

2. تقييم عوامل الخطر:
   - التاريخ الطبي
   - التاريخ العائلي
   - نمط الحياة والضغوط

3. استشارة طبيب القلب:
   - لتحديد التشخيص الدقيق
   - وضع خطة العلاج المناسبة
   - تقييم الحاجة لمضادات اضطراب النظم

يرجى استشارة طبيب القلب في أقرب وقت ممكن لتجنب أي مضاعفات محتملة.`,
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export async function POST(req: Request) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }

  try {
    const body = await req.json()
    const { message } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "الرسالة غير صالحة" }, { status: 400, headers })
    }

    // Use mock data while API is inaccessible
    return NextResponse.json(mockResponse, { headers })

    /* Commented out until API is accessible
    const API_URL = "https://ai_agent_medai.syrianserver.us/process_medical_case"
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 60000 * 5)

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ topic: message }),
        signal: controller.signal
      })

      clearTimeout(timeout)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data?.final_report_ar || !data?.translated_text_ar) {
        throw new Error("استجابة API غير صالحة")
      }

      return NextResponse.json(data, { headers })
    } catch (error) {
      clearTimeout(timeout)
      throw error
    }
    */
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      {
        error: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى لاحقاً.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers,
      },
    )
  }
}

