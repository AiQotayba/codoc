"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ChatInput } from "@/components/chat-input"
import { ChatMessages } from "@/components/chat-messages"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { addMessage, createChat, setCurrentChat } from "@/lib/chat-slice"

interface ChatPageProps {
  params: {
    id: string;
  };
}

export default function ChatPage({ params }: ChatPageProps) {
  const router: any = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()

  const [loading, setLoading] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [agentProcessing, setAgentProcessing] = useState(false)

  const initialQuestionSent = useRef(false)
  const isMounted = useRef(true)

  // استخراج معطيات الاستعلام مرة واحدة
  const initialQuestion = searchParams.get("q")
  const shouldAutoSend = searchParams.get("autoSend") === "true"
  const state: any = useAppSelector((state) => state)

  // الحصول على الدردشة الحالية من Redux
  const currentChat = useAppSelector((state) => state.chat.chats.find((chat) => chat.id === params.id))
console.log(currentChat)
  const handleSubmit = useCallback(
    async (message: string) => {
      if (!message.trim() || loading || !currentChat?.id) return

      setLoading(true)
      setThinking(true)
      setAgentProcessing(true)

      try {
        dispatch(
          addMessage({
            chatId: currentChat.id,
            role: "user",
            content: message,
          }),
        )

        //      محاكاة تأخير المعالجة (مثال)
      //        await new Promise((resolve) => setTimeout(resolve, 30000));
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000 * 3);
    const API_URL = "https://cors-anywhere.herokuapp.com/https://ai_agent_medai.syrianserver.us/process_medical_case"

          const response = await fetch(API_URL, {
            method: "POST",
  //mode: 'no-cors',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({topic: message }),
            signal: controller.signal // ربط مع إشارة الإلغاء
          });

          clearTimeout(timeoutId); // إلغاء المؤقت إذا اكتمل الطلب بنجاح

          if (!response.ok) {
            throw new Error("Failed to fetch response");
          }

        const data = await response.json(); 
        console.log(data)
        if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
          throw new Error("Invalid response data")
        }

        dispatch(
          addMessage({
            chatId: currentChat.id,
            role: "assistant",
            content: data,
          }),
        )

        setError(null)
        if (initialQuestion) {
          // تأكد من أن التوجيه يتم فقط إذا كان المسار مختلفاً
          const newPath = `/chat/${currentChat.id}`
          if (router.asPath !== newPath) {
            router.replace(newPath)
          }
        }
      } catch (error) {
        console.error("Error:", error)
        setError(error instanceof Error ? error.message : "حدث خطأ أثناء معالجة طلبك")
      } finally {
        if (isMounted.current) {
          setLoading(false)
          setThinking(false)
          setAgentProcessing(false)
        }
      }
    },
    [currentChat?.id, loading, dispatch, router, initialQuestion],
  )

  // تحديث مرجع التركيب عند تركيب/إلغاء التركيب
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  // التعامل مع بدء محادثة جديدة أو إرسال السؤال الأولي تلقائياً
  const handleNewChat = useCallback(async () => {
    try {
      if (params.id === "new") {
        // Create new chat and wait for action to complete
        const action = dispatch(createChat())
        const newChatId = action.payload.id

        if (!newChatId) {
          throw new Error("Failed to create new chat")
        }

        // Construct new path
        const newPath = initialQuestion
          ? `/chat/${newChatId}?q=${encodeURIComponent(initialQuestion)}&autoSend=${shouldAutoSend}`
          : `/chat/${newChatId}`

        // Ensure we're still mounted before navigation
        if (isMounted.current) {
          await router.replace(newPath)

          // If we have an initial question and should auto send, wait for chat to be available
          if (initialQuestion && shouldAutoSend) {
            // Access the store directly to get the state
            const chat = state.chat.chats.find((c: any) => c.id === newChatId)
            if (chat) {
              initialQuestionSent.current = true
              await handleSubmit(initialQuestion)
            }
          }
        }
      } else if (initialQuestion && shouldAutoSend && !initialQuestionSent.current && currentChat) {
        initialQuestionSent.current = true
        await handleSubmit(initialQuestion)
      }
    } catch (error) {
      console.error("Error in handleNewChat:", error)
      setError(error instanceof Error ? error.message : "Failed to create new chat")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, dispatch, router, handleSubmit, initialQuestion, shouldAutoSend, currentChat])

  useEffect(() => {
    let mounted = true

    const initChat = async () => {
      try {
        await handleNewChat()
      } catch (error) {
        if (mounted) {
          console.error("Error initializing chat:", error)
          setError(error instanceof Error ? error.message : "Failed to initialize chat")
        }
      }
    }

    initChat()

    return () => {
      mounted = false
    }
  }, [handleNewChat])

  // تعيين الدردشة الحالية في Redux عند التركيب
  useEffect(() => {
    if (params.id !== "new") {
      dispatch(setCurrentChat(params.id))
    }
  }, [dispatch, params.id])

  if (!params.id) {
    return <div className="p-4 text-red-500">Invalid chat ID</div>
  }

  if (!currentChat) return null
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {error && <div className="p-4 mb-4 text-sm text-red-500 bg-red-50 rounded-md mx-4 mt-4">{error}</div>}
      <ChatMessages messages={currentChat.messages} thinking={thinking} agentProcessing={agentProcessing} />
      <ChatInput onSubmit={handleSubmit} disabled={loading} defaultValue={searchParams.get("q") || ""} />
      <div className="bg-background/80 backdrop-blur-sm p-2 text-center text-sm text-muted-foreground">
        يجب التحقق من المعلومات المهمة. لذلك يمكن أن تصدر عن nan بعض الأخطاء
      </div>
    </div>
  )
}

