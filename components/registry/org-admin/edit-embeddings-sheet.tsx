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
import { EmbeddingRow } from "./embeddings-config-table"
import { maskApiKey } from "@/lib/mask-api-key"
import { showToast } from "@/lib/toast"

interface EditEmbeddingSheetProps {
  row: EmbeddingRow
  onSave: (updatedRow: EmbeddingRow) => void
}

export function EditEmbeddingSheet({ row, onSave }: EditEmbeddingSheetProps) {
  const [open, setOpen] = React.useState(false)
  const [model, setModel] = React.useState(row.model)
  const [apiEndpoint, setApiEndpoint] = React.useState(row.apiEndpoint)
  const [apiKey, setApiKey] = React.useState(row.apiKeyMasked)
  const [apiSecret, setApiSecret] = React.useState(row.apiSecretMasked)
  const [apiVersion, setApiVersion] = React.useState(row.apiVersion)
  const [maxTokens, setMaxTokens] = React.useState(row.maxTokens)

  const [canEditApiKey, setCanEditApiKey] = React.useState(false)
  const [canEditApiSecret, setCanEditApiSecret] = React.useState(false)

  const resetForm = () => {
    setModel(row.model)
    setApiEndpoint(row.apiEndpoint)
    setApiKey(row.apiKeyMasked)
    setApiSecret(row.apiSecretMasked)
    setApiVersion(row.apiVersion)
    setMaxTokens(row.maxTokens)
    setCanEditApiKey(false)
    setCanEditApiSecret(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:cursor-pointer">
          <Edit className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-md mt-11.5">
        <SheetHeader className="p-4">
          <SheetTitle>Edit Embedding Config</SheetTitle>
        </SheetHeader>

        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <Label>Model</Label>
            <Input value={model} onChange={e => setModel(e.target.value)} />
          </div>

          <div className="space-y-1">
            <Label>API Endpoint</Label>
            <Input value={apiEndpoint} onChange={e => setApiEndpoint(e.target.value)} />
          </div>

          <div className="space-y-1">
            <Label>API Key</Label>
            {!canEditApiKey ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="relative group cursor-pointer">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input 
                            value={maskApiKey(apiKey)} 
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
                          navigator.clipboard.writeText(apiKey); 
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
              <Input value={apiKey} onChange={e => setApiKey(e.target.value)} autoFocus />
            )}
          </div>

          <div className="space-y-1">
            <Label>API Secret</Label>
            {!canEditApiSecret ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <div className="relative group cursor-pointer">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input 
                            value={maskApiKey(apiSecret)} 
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
                          navigator.clipboard.writeText(apiSecret); 
                          showToast("success", "API secret copied!");
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipProvider>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Edit API Secret?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Editing the API secret may break existing integrations. Are you sure you want to continue?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:cursor-pointer">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="hover:cursor-pointer" onClick={() => setCanEditApiSecret(true)}>
                      Yes, Edit
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Input value={apiSecret} onChange={e => setApiSecret(e.target.value)} autoFocus />
            )}
          </div>

          <div className="space-y-1">
            <Label>API Version</Label>
            <Input value={apiVersion} onChange={e => setApiVersion(e.target.value)} />
          </div>

          <div className="space-y-1">
            <Label>Max Tokens</Label>
            <Input type="number" value={maxTokens} onChange={e => setMaxTokens(Number(e.target.value))} />
          </div>
        </div>

        <SheetFooter className="m-4 flex flex-col sm:flex-row sm:justify-end">
          <Button 
            variant="outline" 
            className="hover:cursor-pointer" 
            onClick={() => { resetForm(); setOpen(false) }}
          >
            Cancel
          </Button>
          <Button 
            className="w-full sm:w-auto hover:cursor-pointer"
            onClick={() => {
              onSave({ 
                ...row, 
                model, 
                apiEndpoint, 
                apiKeyMasked: apiKey, 
                apiSecretMasked: apiSecret, 
                apiVersion, 
                maxTokens 
              })
              setOpen(false)
            }}
          >
            Update
            <RefreshCcw className="h-4 w-4 ml-1" />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}