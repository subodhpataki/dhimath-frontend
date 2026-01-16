"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/greywiz-ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger } from "@/components/greywiz-ui/sheet"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/greywiz-ui/select"
import { Plus, Save, Waypoints } from "lucide-react"
import { Input } from "@/components/greywiz-ui/input"
import { Label } from "@/components/greywiz-ui/label"

import EmbeddingsConfigTable, { EmbeddingRow } from "./embeddings-config-table"
import { embeddingSaveBtn } from "./btns/saveFunctions"

import openai from "@/public/openai.png"
import claude from "@/public/claude.png"
import perplexity from "@/public/perplexity.png"
import gemini from "@/public/gemini.png"
import grok from "@/public/grok.png"
import { showToast } from "@/lib/toast"

const EMBEDDING_LOGOS: Record<string, any> = {
  openai,
  "azure-openai": openai,
  claude,
  grok,
  gemini,
  perplexity,
}

export default function EmbeddingsConfig() {
  const [open, setOpen] = useState(false)
  const [embeddings, setEmbeddings] = useState<EmbeddingRow[]>([
    {
      id: "emb_1",
      provider: "OpenAI",
      apiKeyMasked: "sk-live-9f8sdf8sdf8sdf8sdf8sdf",
      apiSecretMasked: "sk-ant-api03-abcdef123456789",
      apiVersion: "2024-05-01",
      model: "text-embedding-3-large",
      maxTokens: 8192,
      apiEndpoint: "https://api.openai.com/v1/embeddings",
      logoUrl: openai,
      createdAt: "2026-01-05",
    },
  ])

  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [apiSecret, setApiSecret] = useState("")
  const [model, setModel] = useState("")
  const [maxTokens, setMaxTokens] = useState(0)
  const [apiEndpoint, setApiEndpoint] = useState("")
  const [apiVersion, setApiVersion] = useState("")

  const handleCancel = () => {
    setOpen(false)
    setSelectedProvider(null)
    setApiKey("")
    setApiSecret("")
    setModel("")
    setMaxTokens(0)
    setApiEndpoint("")
    setApiVersion("")
  }

  const handleSaveEmbedding = () => {
    if (
    !selectedProvider ||
    !apiKey.trim() ||
    !apiSecret.trim()
  ) {
    showToast(
      "error",
      "Missing required fields"
    )
    return
  }

    const success = embeddingSaveBtn()
    if (!success) return

    setEmbeddings(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        provider: selectedProvider,
        apiKeyMasked: apiKey,
        apiSecretMasked: apiSecret,
        model,
        maxTokens,
        apiEndpoint,
        apiVersion,
        logoUrl: EMBEDDING_LOGOS[selectedProvider],
        createdAt: new Date().toISOString(),
      },
    ])

    setOpen(false)
    setSelectedProvider(null)
    setApiKey("")
    setApiSecret("")
    setModel("")
    setMaxTokens(0)
    setApiEndpoint("")
    setApiVersion("")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Configured Embeddings
        </h2>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="cursor-pointer">
              Configure Embedding
              <Plus className="w-4 h-4 ml-1" />
            </Button>
          </SheetTrigger>

          <SheetContent className="px-6 py-6 w-md flex flex-col gap-4 mt-11.5">
            <SheetHeader className="pb-3">
              <SheetTitle className="flex items-center gap-2 text-base font-semibold">
                {!selectedProvider ? (
                  <Waypoints className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Image
                    src={EMBEDDING_LOGOS[selectedProvider]}
                    alt={selectedProvider}
                    width={18}
                    height={18}
                  />
                )}
                Embeddings Configuration
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="gap-1">Select Provider<span className="text-red-500">*</span></Label>

                <Select
                  value={selectedProvider ?? ""}
                  onValueChange={setSelectedProvider}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose embedding provider" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="azure-openai">Azure OpenAI</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                    <SelectItem value="gemini">Gemini</SelectItem>
                    <SelectItem value="grok">Grok</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="perplexity">Perplexity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="gap-1">API Key<span className="text-red-500">*</span></Label>
                  <Input placeholder="**-***" value={apiKey} onChange={e => setApiKey(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label className="gap-1">API Secret<span className="text-red-500">*</span></Label>
                  <Input placeholder="Secret key" value={apiSecret} onChange={e => setApiSecret(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>API Version</Label>
                  <Input placeholder="Version as per provider" value={apiVersion} onChange={e => setApiVersion(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input placeholder="Version as per provider" value={model} onChange={e => setModel(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Max Tokens</Label>
                  <Input type="number" value={maxTokens} onChange={e => setMaxTokens(Number(e.target.value))} />
                </div>

                <div className="space-y-2">
                  <Label>API Endpoint</Label>
                  <Input placeholder="https://xyz.com" value={apiEndpoint} onChange={e => setApiEndpoint(e.target.value)} />
                </div>
              </div>
            </div>

            <SheetFooter className="mt-2 flex flex-col sm:flex-row sm:justify-end gap-2">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="hover:cursor-pointer"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEmbedding} className="hover:cursor-pointer w-full sm:w-auto">
                Save Embedding
                <Save className="w-4 h-4" />
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <EmbeddingsConfigTable data={embeddings} setEmbeddings={setEmbeddings} />
    </div>
  )
}
