"use client"

import { useState, useEffect } from "react"
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
import { fetchEmbeddingsConfig, saveEmbeddingsConfig } from "@/lib/services/embeddings-config.api"
import { mapEmbeddingsConfigurationsToEmbeddingRows } from "@/lib/services/mappers/embeddings-config.mapper"
import { showToast } from "@/lib/toast"

import openai from "@/public/openai.png"
import claude from "@/public/claude.png"
import perplexity from "@/public/perplexity.png"
import gemini from "@/public/gemini.png"
import grok from "@/public/grok.png"

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
  const [embeddings, setEmbeddings] = useState<EmbeddingRow[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [apiSecret, setApiSecret] = useState("")
  const [model, setModel] = useState("")
  const [maxTokens, setMaxTokens] = useState(0)
  const [apiEndpoint, setApiEndpoint] = useState("")
  const [apiVersion, setApiVersion] = useState("")

  useEffect(() => {
    const loadEmbeddings = async () => {
      try {
        const response = await fetchEmbeddingsConfig()
        setEmbeddings(mapEmbeddingsConfigurationsToEmbeddingRows(response.embeddings_configurations || []))
      } catch (error) {
        showToast("error", "Failed to load embeddings configuration")
      }
    }
    loadEmbeddings()
  }, [])

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

  const handleSaveEmbedding = async () => {
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

    const newEmbedding: EmbeddingRow = {
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
    }

    const updatedEmbeddings = [...embeddings, newEmbedding]

    try {
      await saveEmbeddingsConfig(1, {
        embeddings_configurations: updatedEmbeddings.map(row => ({
          provider: row.provider,
          api_key: row.apiKeyMasked,
          api_secret: row.apiSecretMasked,
          model: row.model,
          max_tokens: row.maxTokens,
          api_endpoint: row.apiEndpoint,
          api_version: row.apiVersion,
        }))
      })
      setEmbeddings(updatedEmbeddings)
      setOpen(false)
      setSelectedProvider(null)
      setApiKey("")
      setApiSecret("")
      setModel("")
      setMaxTokens(0)
      setApiEndpoint("")
      setApiVersion("")
      showToast("success", "Embedding saved successfully")
    } catch (error) {
      showToast("error", "Failed to save embedding")
    }
  }

  const handleSaveEmbeddingUpdate = async (updatedRow: EmbeddingRow) => {
    const updatedEmbeddings = embeddings.map(row => row.id === updatedRow.id ? updatedRow : row)
    try {
      await saveEmbeddingsConfig(1, {
        embeddings_configurations: updatedEmbeddings.map(row => ({
          provider: row.provider,
          api_key: row.apiKeyMasked,
          api_secret: row.apiSecretMasked,
          model: row.model,
          max_tokens: row.maxTokens,
          api_endpoint: row.apiEndpoint,
          api_version: row.apiVersion,
        }))
      })
      setEmbeddings(updatedEmbeddings)
      showToast("success", "Embedding updated successfully")
    } catch (error) {
      showToast("error", "Failed to update embedding")
    }
  }

  const handleDeleteEmbedding = async (id: string) => {
    const updatedEmbeddings = embeddings.filter(row => row.id !== id)
    try {
      await saveEmbeddingsConfig(1, {
        embeddings_configurations: updatedEmbeddings.map(row => ({
          provider: row.provider,
          api_key: row.apiKeyMasked,
          api_secret: row.apiSecretMasked,
          model: row.model,
          max_tokens: row.maxTokens,
          api_endpoint: row.apiEndpoint,
          api_version: row.apiVersion,
        }))
      })
      setEmbeddings(updatedEmbeddings)
      showToast("success", "Embedding deleted successfully")
    } catch (error) {
      showToast("error", "Failed to delete embedding")
    }
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

      <EmbeddingsConfigTable data={embeddings} onSave={handleSaveEmbeddingUpdate} onDelete={handleDeleteEmbedding} />
    </div>
  )
}
