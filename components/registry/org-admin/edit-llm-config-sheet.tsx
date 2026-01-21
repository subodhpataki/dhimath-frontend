"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/greywiz-ui/sheet"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/greywiz-ui/alert-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/greywiz-ui/tooltip"
import { Button } from "@/components/greywiz-ui/button"
import { Input } from "@/components/greywiz-ui/input"
import { Label } from "@/components/greywiz-ui/label"
import { Edit, RefreshCcw, Copy } from "lucide-react"
import { LLMRow } from "./llm-config-table"
import { maskApiKey } from "@/lib/mask-api-key"
import { showToast } from "@/lib/toast"
import DynamicLLMField from "./dynamic-llm-field"
import { LLMConfiguration } from "@/lib/services/types/llm-config.types"
import { getFieldLabel } from "@/lib/services/mappers/llm-config.mapper"

interface EditLLMSheetProps {
  row: LLMRow
  onSave: (updatedRow: LLMRow) => void
}

export function EditLLMConfigSheet({ row, onSave }: EditLLMSheetProps) {
  const [open, setOpen] = React.useState(false)
  const [formData, setFormData] = React.useState<LLMConfiguration>({
    llm_name: row.name,
    llm_model: row.model,
    llm_api_key: row.apiKey,
    llm_logo_url: row.logoUrl as string || "",
  })
  const [canEditApiKey, setCanEditApiKey] = React.useState(false)

  const resetForm = () => {
    setFormData({
      llm_name: row.name,
      llm_model: row.model,
      llm_api_key: row.apiKey,
      llm_logo_url: row.logoUrl as string || "",
    })
    setCanEditApiKey(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:cursor-pointer">
          <Edit className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent className="mt-11.5 w-md">
        <SheetHeader className="p-4">
          <SheetTitle>Edit LLM</SheetTitle>
        </SheetHeader>

        <div className="p-4 space-y-4">
          {Object.keys(formData).filter(key => key !== "llm_logo_url" && key !== "llm_api_key").map((key) => (
            <DynamicLLMField
              key={key}
              fieldKey={key}
              value={(formData[key as keyof LLMConfiguration] as string) || ""}
              onChange={(value) => setFormData({ ...formData, [key]: value })}
              label={getFieldLabel(key)}
            />
          ))}

          {/* API Key with click to edit */}
          <div className="space-y-1">
            <Label>{getFieldLabel("llm_api_key")}</Label>
            {!canEditApiKey ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="relative group cursor-pointer">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input 
                            value={maskApiKey(formData.llm_api_key as string)}
                            readOnly 
                            className="cursor-pointer pr-10" 
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top">Click to edit</TooltipContent>
                      </Tooltip>

                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="hover:cursor-pointer absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          navigator.clipboard.writeText(formData.llm_api_key as string); 
                          showToast("success", "API key copied!");
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipProvider>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Edit API Key?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Editing the API key may break existing integrations. Are you sure you want to continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:cursor-pointer">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="hover:cursor-pointer" onClick={() => setCanEditApiKey(true)}>
                      Yes, Edit
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Input 
                value={formData.llm_api_key as string} 
                onChange={(e) => setFormData({ ...formData, llm_api_key: e.target.value })} 
                autoFocus 
              />
            )}
          </div>

          {/* Logo upload */}
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

        <SheetFooter className="m-4 flex flex-col sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            className="hover:cursor-pointer"
            onClick={() => {
              resetForm()
              setOpen(false)
            }}
          >
            Cancel
          </Button>
          <Button
            className="w-full sm:w-auto hover:cursor-pointer"
            onClick={() => {
              const updatedRow: LLMRow = {
                ...row,
                name: (formData.llm_name as string) || "",
                model: (formData.llm_model as string) || "",
                apiKey: (formData.llm_api_key as string) || "",
                logoUrl: (formData.llm_logo_url as string) || undefined,
              }
              onSave(updatedRow)
              setOpen(false)
            }}
          >
            Update
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
