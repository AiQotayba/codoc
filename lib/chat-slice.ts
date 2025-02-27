import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Chat, Message } from "@/types/chat"
import { nanoid } from "nanoid"

// Define the initial state
interface ChatState {
  chats: Chat[]
  currentChatId: string | null
  lastCreatedChatId: string | null // Add this to track the last created chat
}

// Load initial state from localStorage
const loadInitialState = (): ChatState => {
  if (typeof window === "undefined") return { chats: [], currentChatId: null, lastCreatedChatId: null }

  try {
    const stored = localStorage.getItem("nan-medical-chats")
    const chats = stored ? JSON.parse(stored) : []
    return {
      chats,
      currentChatId: null,
      lastCreatedChatId: null,
    }
  } catch (e) {
    console.error("Error loading chats:", e)
    return { chats: [], currentChatId: null, lastCreatedChatId: null }
  }
}

const initialState: ChatState = loadInitialState()

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<string>) => {
      state.currentChatId = action.payload
    },
    createChat: {
      prepare: (title?: string) => {
        try {
          const newChatId = nanoid()
          if (!newChatId) {
            throw new Error("Failed to generate chat ID")
          }
          return { payload: { id: newChatId, title: title || "محادثة جديدة" } }
        } catch (error) {
          console.error("Error preparing chat creation:", error)
          throw error
        }
      },
      reducer: (state, action: PayloadAction<{ id: string; title: string }>) => {
        try {
          const newChat: Chat = {
            id: action.payload.id,
            title: action.payload.title,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
          state.chats.unshift(newChat)
          state.currentChatId = newChat.id
          state.lastCreatedChatId = newChat.id
          // Persist to localStorage
          localStorage.setItem("nan-medical-chats", JSON.stringify(state.chats))
        } catch (error) {
          console.error("Error in chat creation reducer:", error)
          throw error
        }
      },
    },
    addMessage: (
      state,
      action: PayloadAction<{ chatId: string; role: "user" | "assistant"; content: string | object }>,
    ) => {
      const { chatId, role, content } = action.payload
      const chat = state.chats.find((c) => c.id === chatId)
      if (!chat) return

      const newMessage: Message = {
        id: nanoid(),
        role,
        content,
        createdAt: Date.now(),
      }

      chat.messages.push(newMessage)
      chat.updatedAt = Date.now()

      // Update title if it's the first user message
      if (role === "user" && chat.messages.length === 1 && typeof content === "string") {
        chat.title = content.slice(0, 50) + (content.length > 50 ? "..." : "")
      }

      // Persist to localStorage
      localStorage.setItem("nan-medical-chats", JSON.stringify(state.chats))
    },
    deleteChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload)
      if (state.currentChatId === action.payload) {
        state.currentChatId = null
      }
      // Persist to localStorage
      localStorage.setItem("nan-medical-chats", JSON.stringify(state.chats))
    },
    updateChatTitle: (state, action: PayloadAction<{ chatId: string; title: string }>) => {
      const chat = state.chats.find((c) => c.id === action.payload.chatId)
      if (chat) {
        chat.title = action.payload.title
        // Persist to localStorage
        localStorage.setItem("nan-medical-chats", JSON.stringify(state.chats))
      }
    },
  },
})

export const { setCurrentChat, createChat, addMessage, deleteChat, updateChatTitle } = chatSlice.actions

export default chatSlice.reducer

