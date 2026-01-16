"use client"

import { useState } from "react"
import { Input } from "@/components/greywiz-ui/input"
import { Label } from "@/components/greywiz-ui/label"
import { Button } from "@/components/greywiz-ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/greywiz-ui/sheet"

import { FileSliders, Plus, Save } from "lucide-react"
import { llmConfigSaveBtn } from "./btns/saveFunctions"
import Image from "next/image"

import LLMConfigTable, { LLMRow } from "./llm-config-table"

import openAI from "@/public/openai.png"
import claude from "@/public/claude.png"

const MAX_LOGO_SIZE_MB = 2

export default function LLMConfig() {
  const [llms, setLlms] = useState<LLMRow[]>([
    {
      id: "llm_1",
      name: "OpenAI GPT-4",
      apiKey: "sk-live-9f8sdf8sdf8sdf8sdf8sdf",
      logoUrl: openAI,
      model: "4o",
      createdAt: "2026-01-05",
    },
    {
      id: "llm_2",
      name: "Claude",
      apiKey: "sk-ant-api03-abcdef123456789",
      logoUrl: claude,
      model: "opus",
      createdAt: "2026-01-03",
    },
  ])

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [model, setModel] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [logo, setLogo] = useState<string | null>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > MAX_LOGO_SIZE_MB) {
      alert(`File size should not exceed ${MAX_LOGO_SIZE_MB}MB`)
      e.target.value = ""
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setLogo(previewUrl)
  }

  const handleCancel = () => {
    setOpen(false)
    setLogo(null)
  }

  const handleSaveLLM = () => {
    const success = llmConfigSaveBtn()
    if (!success) return

    setLlms((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        model,
        apiKey: apiKey,
        logoUrl: logo ?? undefined,
        createdAt: new Date().toISOString(),
      },
    ])

    setOpen(false)
    setName("")
    setModel("")
    setApiKey("")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Configured LLMs
        </h2>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="hover:cursor-pointer">
              Configure LLM
              <Plus className="w-4 h-4 ml-1" />
            </Button>
          </SheetTrigger>

          <SheetContent
            className="
              bg-background
              w-md
              px-6 py-6
              flex flex-col
              gap-1
              mt-11.5
            "
          >
            <SheetHeader className="pb-2">
              <SheetTitle className="flex items-center gap-2 text-base">
                {logo ? (
                  <Image
                    src={logo}
                    alt="LLM Logo"
                    width={18}
                    height={18}
                    className="rounded-sm object-contain"
                  />
                ) : (
                  <FileSliders className="w-4 h-4" />
                )}
                LLM Configuration
              </SheetTitle>
            </SheetHeader>

            <div className="mt-3 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                <Label className="gap-1">LLM Name<span className="text-red-500">*</span></Label>
                <Input placeholder="e.g. OpenAI GPT-4" value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                <Label className="gap-1">Model<span className="text-red-500">*</span></Label>
                <Input placeholder="e.g. gpt-4o / claude-opus" value={model} onChange={(e) => setModel(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                <Label className="gap-1">API Key<span className="text-red-500">*</span></Label>
                <Input placeholder="**-***" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                <Label className="gap-1">LLM Logo<span className="text-red-500">*</span></Label>
                <div>
                  <Input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleLogoUpload}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Max file size: {MAX_LOGO_SIZE_MB} MB (PNG, JPG)
                  </p>
                </div>
              </div>
            </div>

            <SheetFooter className="mt-4 flex flex-col sm:flex-row sm:justify-end">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="hover:cursor-pointer"
              >
                Cancel
              </Button>
              <Button className="w-full sm:w-auto hover:cursor-pointer"
                onClick={handleSaveLLM}>
                Save LLM
                <Save className="w-4 h-4" />
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <LLMConfigTable data={llms} setLlms={setLlms} />
    </div>
  )
}
