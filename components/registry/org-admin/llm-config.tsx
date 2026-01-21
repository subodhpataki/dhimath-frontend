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
import Image from "next/image"

import LLMConfigTable from "./llm-config-table"
import DynamicLLMField from "./dynamic-llm-field"
import { fetchLLMConfig, saveLLMConfig } from "@/lib/services/llm-config.api"
import { LLMConfigAPIResponse, LLMConfiguration } from "@/lib/services/types/llm-config.types"
import { mapLLMConfigurationsToLLMRows, mapLLMRowToLLMConfiguration, getFieldLabel } from "@/lib/services/mappers/llm-config.mapper"
import { LLMRow } from "./llm-config-table"
import { Label } from "@/components/greywiz-ui/label"
import { Input } from "@/components/greywiz-ui/input"

export default function LLMConfig() {
  const [rawConfig, setRawConfig] = useState<LLMConfigAPIResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const llms = rawConfig ? mapLLMConfigurationsToLLMRows(rawConfig.config.llm_configurations) : []

  useEffect(() => {
    const loadConfig = async () => {
      try {
        // Remove pre-existing data by setting empty config
        setRawConfig({
          status: "success",
          message: "Configuration loaded",
          org_id: 1,
          config: { llm_configurations: [] }
        })
      } catch (error) {
        showToast("error", "Failed to load LLM config")
      } finally {
        setLoading(false)
      }
    }
    loadConfig()
  }, [])

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({
    llm_name: "",
    llm_model: "",
    llm_api_key: "",
    llm_logo_url: "",
  })

  const handleCancel = () => {
    setOpen(false)
    setFormData({
      llm_name: "",
      llm_model: "",
      llm_api_key: "",
      llm_logo_url: "",
    })
  }

  const handleSaveLLM = async () => {
    if (!rawConfig) return
    try {
      const updatedFormData = { ...formData }
      const updatedConfigs = [...rawConfig.config.llm_configurations, updatedFormData]
      await saveLLMConfig(rawConfig.org_id, { llm_configurations: updatedConfigs })
      setRawConfig({
        ...rawConfig,
        config: { llm_configurations: updatedConfigs }
      })
      setOpen(false)
      setFormData({
        llm_name: "",
        llm_model: "",
        llm_api_key: "",
        llm_logo_url: "",
      })
      showToast("success", "LLM added successfully")
    } catch (error) {
      showToast("error", "Failed to save LLM")
    }
  }

  const handleSaveLLMUpdate = async (updatedRow: LLMRow) => {
    if (!rawConfig) return
    const index = parseInt(updatedRow.id.replace("llm_", ""))
    const updatedConfigs = [...rawConfig.config.llm_configurations]
    updatedConfigs[index] = mapLLMRowToLLMConfiguration(updatedRow)
    try {
      await saveLLMConfig(rawConfig.org_id, { llm_configurations: updatedConfigs })
      setRawConfig({
        ...rawConfig,
        config: { llm_configurations: updatedConfigs }
      })
      showToast("success", "LLM updated successfully")
    } catch (error) {
      showToast("error", "Failed to update LLM")
    }
  }

  const handleDeleteLLM = async (id: string) => {
    if (!rawConfig) return
    const index = parseInt(id.replace("llm_", ""))
    const updatedConfigs = rawConfig.config.llm_configurations.filter((_, i) => i !== index)
    try {
      await saveLLMConfig(rawConfig.org_id, { llm_configurations: updatedConfigs })
      setRawConfig({
        ...rawConfig,
        config: { llm_configurations: updatedConfigs }
      })
      showToast("success", "LLM deleted successfully")
    } catch (error) {
      showToast("error", "Failed to delete LLM")
    }
  }

  if (loading) return <div>Loading...</div>

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
                <FileSliders className="w-4 h-4" />
                LLM Configuration
              </SheetTitle>
            </SheetHeader>

            <div className="mt-3 space-y-4">
              {Object.keys(formData).filter(key => key !== "llm_logo_url").map((key) => (
                <DynamicLLMField
                  key={key}
                  fieldKey={key}
                  value={(formData[key as keyof LLMConfiguration] as string) || ""}
                  onChange={(value) => setFormData({ ...formData, [key]: value })}
                  label={getFieldLabel(key)}
                />
              ))}
              {/* Replace logo URL field with file upload */}
              <div className="space-y-2">
                <Label className="text-xs font-medium">
                  {getFieldLabel("llm_logo_url")}
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setFormData({ ...formData, llm_logo_url: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full text-sm border"
                />
              </div>
            </div>

            {/* Preview */}
            <div className="mt-3 inline-flex rounded-md border px-2.5 py-2">
              <div className="flex items-center gap-2.5">
                {/* Logo */}
                <div className="flex h-8 w-8 items-center justify-center rounded border bg-slate-100">
                  {formData.llm_logo_url && typeof formData.llm_logo_url === "string" ? (
                    <img
                      src={formData.llm_logo_url as string}
                      alt={(formData.llm_name as string) || "LLM Logo"}
                      className="h-5 w-5 object-contain"
                    />
                  ) : (
                    <span className="text-[9px] font-medium text-slate-400">LLM</span>
                  )}
                </div>

                {/* Text */}
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-medium text-slate-800">
                    {formData.llm_name || "LLM Name"}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Preview
                  </span>
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
              <Button
                className="w-full sm:w-auto hover:cursor-pointer"
                onClick={handleSaveLLM}
              >
                Save LLM
                <Save className="w-4 h-4" />
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <LLMConfigTable
        data={llms}
        onSave={handleSaveLLMUpdate}
        onDelete={handleDeleteLLM}
      />
    </div>
  )
}
