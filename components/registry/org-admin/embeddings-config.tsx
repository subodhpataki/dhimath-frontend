"use client"

import { useState, useEffect } from "react"
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
import { showToast } from "@/lib/toast"
import { Input } from "@/components/greywiz-ui/input"
import { Label } from "@/components/greywiz-ui/label"

import EmbeddingsConfigTable from "./embeddings-config-table"
import { fetchEmbeddingsConfig, saveEmbeddingsConfig } from "@/lib/services/embeddings-config.api"
import { EmbeddingsConfigAPIResponse, EmbeddingsConfiguration } from "@/lib/services/types/embeddings-config.types"
import { mapEmbeddingsConfigurationsToEmbeddingRows, mapEmbeddingRowToEmbeddingsConfiguration, getEmbeddingFieldLabel } from "@/lib/services/mappers/embeddings-config.mapper"
import { EmbeddingRow } from "./embeddings-config-table"

export default function EmbeddingsConfig() {
  const [rawConfig, setRawConfig] = useState<EmbeddingsConfigAPIResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const embeddings = rawConfig ? mapEmbeddingsConfigurationsToEmbeddingRows(rawConfig.config.embeddings_configurations) : []

  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Remove pre-existing data by setting empty config
        setRawConfig({
          status: "success",
          message: "Configuration loaded",
          org_id: 1,
          config: { embeddings_configurations: [] }
        })
      } catch (error) {
        showToast("error", "Failed to load embeddings config")
      } finally {
        setLoading(false)
      }
    }
    loadConfig()
  }, [])

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<EmbeddingsConfiguration>({
    model: "",
    api_endpoint: "",
    api_key: "",
    api_secret: "",
    api_version: "",
    max_tokens: 0,
  })

  const handleCancel = () => {
    setOpen(false)
    setFormData({
      model: "",
      api_endpoint: "",
      api_key: "",
      api_secret: "",
      api_version: "",
      max_tokens: 0,
    })
  }

  const handleSaveEmbedding = async () => {
    if (!rawConfig) return
    try {
      const updatedConfigs = [...rawConfig.config.embeddings_configurations, formData]
      await saveEmbeddingsConfig(rawConfig.org_id, { embeddings_configurations: updatedConfigs })
      setRawConfig({
        ...rawConfig,
        config: { embeddings_configurations: updatedConfigs }
      })
      setOpen(false)
      setFormData({
        model: "",
        api_endpoint: "",
        api_key: "",
        api_secret: "",
        api_version: "",
        max_tokens: 0,
      })
      showToast("success", "Embedding added successfully")
    } catch (error) {
      showToast("error", "Failed to save embedding")
    }
  }

  const handleSaveEmbeddingUpdate = async (updatedRow: EmbeddingRow) => {
    if (!rawConfig) return
    const index = parseInt(updatedRow.id.replace("embedding_", ""))
    const updatedConfigs = [...rawConfig.config.embeddings_configurations]
    updatedConfigs[index] = mapEmbeddingRowToEmbeddingsConfiguration(updatedRow)
    try {
      await saveEmbeddingsConfig(rawConfig.org_id, { embeddings_configurations: updatedConfigs })
      setRawConfig({
        ...rawConfig,
        config: { embeddings_configurations: updatedConfigs }
      })
      showToast("success", "Embedding updated successfully")
    } catch (error) {
      showToast("error", "Failed to update embedding")
    }
  }

  const handleDeleteEmbedding = async (id: string) => {
    if (!rawConfig) return
    const index = parseInt(id.replace("embedding_", ""))
    const updatedConfigs = rawConfig.config.embeddings_configurations.filter((_, i) => i !== index)
    try {
      await saveEmbeddingsConfig(rawConfig.org_id, { embeddings_configurations: updatedConfigs })
      setRawConfig({
        ...rawConfig,
        config: { embeddings_configurations: updatedConfigs }
      })
      showToast("success", "Embedding deleted successfully")
    } catch (error) {
      showToast("error", "Failed to delete embedding")
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Configured Embeddings
        </h2>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="hover:cursor-pointer">
              Configure Embedding
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
                <FileSliders className="w-4 h-4" />
                Embedding Configuration
              </SheetTitle>
            </SheetHeader>

            <div className="mt-3 space-y-4">
              <div className="space-y-1">
                <Label>{getEmbeddingFieldLabel("model")}</Label>
                <Input value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>{getEmbeddingFieldLabel("api_endpoint")}</Label>
                <Input value={formData.api_endpoint} onChange={e => setFormData({ ...formData, api_endpoint: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>{getEmbeddingFieldLabel("api_key")}</Label>
                <Input value={formData.api_key} onChange={e => setFormData({ ...formData, api_key: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>{getEmbeddingFieldLabel("api_secret")}</Label>
                <Input value={formData.api_secret} onChange={e => setFormData({ ...formData, api_secret: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>{getEmbeddingFieldLabel("api_version")}</Label>
                <Input value={formData.api_version} onChange={e => setFormData({ ...formData, api_version: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>{getEmbeddingFieldLabel("max_tokens")}</Label>
                <Input type="number" value={formData.max_tokens} onChange={e => setFormData({ ...formData, max_tokens: Number(e.target.value) })} />
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
              <Button
                className="w-full sm:w-auto hover:cursor-pointer"
                onClick={handleSaveEmbedding}
              >
                Save Embedding
                <Save className="w-4 h-4" />
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <EmbeddingsConfigTable
        data={embeddings}
        onSave={handleSaveEmbeddingUpdate}
        onDelete={handleDeleteEmbedding}
      />
    </div>
  )
}
