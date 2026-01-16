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
import { Edit, RefreshCcw } from "lucide-react"
import { LLMRow } from "./llm-config-table"
import { maskApiKey } from "@/lib/mask-api-key"
import { Copy } from "lucide-react"
import { showToast } from "@/lib/toast"

interface EditLLMSheetProps {
  row: LLMRow
  onSave: (updatedRow: LLMRow) => void
}

export function EditLLMConfigSheet({ row, onSave }: EditLLMSheetProps) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState(row.name)
  const [modelVer, setModel] = React.useState(row.model)
  const [apiKey, setApiKey] = React.useState(row.apiKey)
  const [canEditApiKey, setCanEditApiKey] = React.useState(false)
  const [currentLogo] = React.useState(row.logoUrl)
  const [newLogo, setNewLogo] = React.useState<string | null>(null)

  const resetForm = () => {
    setName(row.name)
    setModel(row.model)
    setApiKey(row.apiKey)
    setCanEditApiKey(false)
    setNewLogo(null)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setNewLogo(previewUrl)
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
          <div className="space-y-1">
            <Label htmlFor="llm-name">LLM Name</Label>
            <Input
              id="llm-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="modelVer">Model</Label>
            <Input
              id="model"
              value={modelVer}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="api-key">API Key</Label>

            {!canEditApiKey ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="relative group cursor-pointer">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            id="api-key"
                            value={maskApiKey(apiKey)}
                            readOnly
                            className="cursor-pointer pr-10"
                          />
                        </TooltipTrigger>

                        <TooltipContent side="top">
                          Click to edit
                        </TooltipContent>
                      </Tooltip>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(apiKey)
                          showToast("success", "API key copied!")
                        }}
                        className="
                          absolute right-1 top-1/2 -translate-y-1/2
                          opacity-0 group-hover:opacity-100
                          transition-opacity hover:cursor-pointer 
                        "
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
                      Editing the API key may break existing integrations.
                      Are you sure you want to continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:cursor-pointer">Cancel</AlertDialogCancel>
                    <AlertDialogAction  className="hover:cursor-pointer"
                      onClick={() => setCanEditApiKey(true)}
                    >
                      Yes, Edit
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Input
                id="api-key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                autoFocus
              />
            )}
          </div>

          <div className="space-y-1">
            <Label>LLM Logo</Label>
            <Input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleLogoUpload}
            />
          </div>

          <div className="flex items-center gap-3 rounded-md border bg-muted/40 px-3 py-2 w-fit">
            {(newLogo ?? currentLogo) && (
              typeof (newLogo ?? currentLogo) === "string" ? (
                <img
                  src={newLogo ?? (currentLogo as string)}
                  alt={name}
                  className="w-7 h-7 rounded object-contain"
                />
              ) : (
                <img
                  src={(currentLogo as any).src}
                  alt={name}
                  className="w-7 h-7 rounded object-contain"
                />
              )
            )}

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-foreground">
                {name || "LLM Name"}
              </span>
              <span className="text-xs text-muted-foreground">
                Preview
              </span>
            </div>
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
          <Button className="w-full sm:w-auto hover:cursor-pointer"
                onClick={() => {
                onSave({
                    ...row,
                    name,
                    model: modelVer,
                    apiKey,
                    logoUrl: newLogo ?? currentLogo,
                })

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
