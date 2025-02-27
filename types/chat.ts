export interface Message {
  id: string
  role: "user" | "assistant"
  content: string | AgentResponse
  createdAt: number
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

export interface AgentResponse {
  translated_text_ar?: string
  privacy_check_output?: string
  information_gathering_output?: string
  initial_diagnosis_output?: string
  cardiac_consultation_output?: string
  medical_validation_output?: string
  final_report?: string
  final_report_ar?: string
}

// Add new types for the chat API
export interface ChatAPIRequest {
  message: string
}

export interface ChatAPIError {
  error: string
}

