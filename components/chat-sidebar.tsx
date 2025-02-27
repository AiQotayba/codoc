"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { MenuIcon, MessageCircle, Plus, X, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { deleteChat, updateChatTitle } from "@/lib/chat-slice"

export function ChatSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const dispatch = useAppDispatch()

  // Get chats from Redux store
  const chats = useAppSelector(
    (state) =>
      state.chat.chats
        .filter((chat) => chat.messages.length > 0)
        .map((chat) => ({
          id: chat.id,
          title: chat.title,
          updatedAt: chat.updatedAt,
        }))
        .sort((a, b) => b.updatedAt - a.updatedAt), // Sort by most recent
  )

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (window.confirm("هل أنت متأكد من حذف هذه المحادثة؟")) {
      dispatch(deleteChat(chatId))
    }
  }

  const handleUpdateTitle = (chatId: string, currentTitle: string) => {
    const newTitle = window.prompt("أدخل العنوان الجديد:", currentTitle)
    if (newTitle && newTitle.trim() !== "") {
      dispatch(updateChatTitle({ chatId, title: newTitle.trim() }))
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed right-4 top-4 z-40 md:hidden hover:bg-accent"
        onClick={() => setOpen(true)}
      >
        <MenuIcon className="h-5 w-5" />
        <span className="sr-only">فتح القائمة</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="p-0 w-[300px]">
          <SidebarContent
            chats={chats}
            pathname={pathname}
            onClose={() => setOpen(false)}
            onDeleteChat={handleDeleteChat}
            onUpdateTitle={handleUpdateTitle}
          />
        </SheetContent>
      </Sheet>

      <aside className="fixed top-0 right-0 z-30 hidden h-full w-[300px] border-l bg-background md:block">
        <SidebarContent
          chats={chats}
          pathname={pathname}
          onDeleteChat={handleDeleteChat}
          onUpdateTitle={handleUpdateTitle}
        />
      </aside>
    </>
  )
}

interface SidebarContentProps {
  chats: Array<{ id: string; title: string; updatedAt: number }>
  pathname: string
  onClose?: () => void
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void
  onUpdateTitle: (chatId: string, currentTitle: string) => void
}

function SidebarContent({ chats, pathname, onClose, onDeleteChat, onUpdateTitle }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg">المحادثات</span>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-muted">
              <X className="h-5 w-5" />
              <span className="sr-only">إغلاق</span>
            </Button>
          )}
        </div>
      </div>

      <div className="p-4">
        <Link href="/" onClick={onClose}>
          <Button className="w-full gap-2 h-10 text-base" variant="outline">
            <Plus className="h-5 w-5" />
            محادثة جديدة
          </Button>
        </Link>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {chats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">لا توجد محادثات</div>
          ) : (
            <div className="space-y-1">
              {chats?.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "group relative flex items-center flex-row-reverse justify-between rounded-md px-3 py-2",
                    "transition-colors duration-200",
                    "hover:bg-accent/50",
                    pathname === `/chat/${chat.id}` && "bg-accent",
                  )}
                >
                  <Link
                    href={`/chat/${chat.id}`}
                    onClick={onClose}
                    className="truncate w flex items-center gap-3 py-1"
                  >
                    <span className="truncate text-sm">{chat.title}</span>
                    <MessageCircle className="h-4 w-4 flex-shrink-0" />
                  </Link>

                  <div className="flex items-center flex-row-reverse gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 opacity-0 transition-opacity duration-200",
                        "group-hover:opacity-100",
                        "hover:bg-background/50",
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onUpdateTitle(chat.id, chat.title)
                      }}
                      title="إعادة تسمية المحادثة"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">إعادة تسمية المحادثة</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 opacity-0 transition-opacity duration-200",
                        "group-hover:opacity-100",
                        "hover:bg-destructive/10 hover:text-destructive",
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onDeleteChat(chat.id, e)
                      }}
                      title="حذف المحادثة"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">حذف المحادثة</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

