"use client"

import React, { useEffect, useState } from "react"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/greywiz-ui/tabs"

import { Kbd } from "@/components/ui/kbd"

import CreateUser from "@/components/registry/org-admin/create-user"
import EmbeddingsSelect from "@/components/registry/org-admin/embeddings"
import LLMConfig from "@/components/registry/org-admin/llm-config"
import StorageConnection from "@/components/registry/org-admin/storage-connection"

import {
  FileSliders,
  Waypoints,
  Server,
  UserRoundPlus,
} from "lucide-react"

const TAB_ORDER = [
  "create-user",
  "llm-config",
  "embeddings",
  "storage-conn",
] as const

type TabValue = (typeof TAB_ORDER)[number]

export default function OrgAdminPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("create-user")

  // tab switching shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return
      }

      if (e.ctrlKey && e.key === "ArrowRight") {
        e.preventDefault()
        setActiveTab((prev) => {
          const index = TAB_ORDER.indexOf(prev)
          return TAB_ORDER[(index + 1) % TAB_ORDER.length]
        })
      }

      if (e.ctrlKey && e.key === "ArrowLeft") {
        e.preventDefault()
        setActiveTab((prev) => {
          const index = TAB_ORDER.indexOf(prev)
          return TAB_ORDER[
            (index - 1 + TAB_ORDER.length) % TAB_ORDER.length
          ]
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="space-y-2">
      <h1 className="text-lg font-semibold">Organization Admin</h1>
      {/* Shortcut Hint */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        Switch tabs:
        <Kbd>Ctrl</Kbd> + <Kbd>→</Kbd> / <Kbd>←</Kbd>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          if (TAB_ORDER.includes(value as TabValue)) {
            setActiveTab(value as TabValue)
          }
        }}
        className="w-full"
      >
        <TabsList className="w-[50%] h-10">
          <TabsTrigger className="hover:cursor-pointer" value="create-user">
            <UserRoundPlus className="mr-2 h-4 w-4" />
            Create User
          </TabsTrigger>

          <TabsTrigger className="hover:cursor-pointer" value="llm-config">
            <FileSliders className="mr-2 h-4 w-4" />
            LLM Configuration
          </TabsTrigger>

          <TabsTrigger className="hover:cursor-pointer" value="embeddings">
            <Waypoints className="mr-2 h-4 w-4" />
            Embeddings
          </TabsTrigger>

          <TabsTrigger className="hover:cursor-pointer" value="storage-conn">
            <Server className="mr-2 h-4 w-4" />
            Storage Connection
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create-user">
          <CreateUser />
        </TabsContent>

        <TabsContent value="llm-config">
          <LLMConfig />
        </TabsContent>

        <TabsContent value="embeddings">
          <EmbeddingsSelect />
        </TabsContent>

        <TabsContent value="storage-conn">
          <StorageConnection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
