"use client"

import { useState } from "react"
import { Button } from "@/components/greywiz-ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/greywiz-ui/sheet"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/greywiz-ui/select"
import { Plus, Save, Server } from "lucide-react"
import { Input } from "@/components/greywiz-ui/input"
import { Label } from "@/components/greywiz-ui/label"

import StorageConfigTable, { StorageRow } from "./storage-connection-table"
import StorageProviderFields, { ProviderType, StorageConfigData } from "./storage-connection-fields"
import { storageConnectionSaveBtn } from "./btns/saveFunctions"
import { showToast } from "@/lib/toast"

export default function StorageConnection() {
  const [open, setOpen] = useState(false)

  const [provider, setProvider] = useState<ProviderType>("")
  const [formData, setFormData] = useState<StorageConfigData>({
    name: "",
    containerName: "",
    region: "",
  })

  // Mock initial data
  const [storage, setStorage] = useState<StorageRow[]>([
    {
      id: "storage_1",
      provider: "azure",
      createdAt: "2026-01-05",
      // Common
      name: "Primary Documents",
      containerName: "doc-archive",
      region: "centralindia",
      // Azure specific
      azureStorageAccount: "corpdata01",
      azureAuthType: "accountKey",
      azureKey: "az-blob-key-live-1234567890",
    },
    {
        id: "storage_2",
        provider: "aws",
        createdAt: "2026-01-08",
        name: "S3 Backups",
        containerName: "daily-backups-bucket",
        region: "us-east-1",
        awsAccessKeyId: "AKIAIOSFODNN7EXAMPLE",
        awsSecretKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    }
  ])

  const handleSave = () => {
    if (!formData.name || !provider) {
        showToast("error", "Please fill in the required fields.")
        return
    }

    const success = storageConnectionSaveBtn()
    if (!success) return

    setStorage(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        provider: provider as string,
        createdAt: new Date().toISOString(),
        ...formData, 
      },
    ])

    showToast("success", "Storage created successfully!")
    setOpen(false)

    setProvider("")
    setFormData({ name: "", containerName: "", region: "" })
  }

  const updateForm = (updates: Partial<StorageConfigData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Configured Storage Connections
        </h2>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="sm" className="hover:cursor-pointer">
              Configure Storage
              <Plus className="w-4 h-4 ml-1" />
            </Button>
          </SheetTrigger>

          <SheetContent className="w-md px-6 py-6 flex flex-col gap-4 mt-11.5 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Server className="w-4 h-4" />
                Storage Configuration
              </SheetTitle>
            </SheetHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="gap-1">Connection Name<span className="text-red-500">*</span></Label>
                <Input
                  placeholder="e.g. Prod Storage"
                  value={formData.name}
                  onChange={e => updateForm({ name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label className="gap-1">Provider<span className="text-red-500">*</span></Label>
                <Select value={provider} onValueChange={v => setProvider(v as ProviderType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aws">AWS S3</SelectItem>
                    <SelectItem value="azure">Azure Blob</SelectItem>
                    <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Container / Bucket</Label>
                <Input
                  placeholder="Bucket-name"
                  value={formData.containerName}
                  onChange={e => updateForm({ containerName: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label>Region</Label>
                <Input
                  placeholder="us-east-1"
                  value={formData.region}
                  onChange={e => updateForm({ region: e.target.value })}
                />
              </div>
            </div>

            <StorageProviderFields 
                provider={provider} 
                data={formData} 
                onChange={updateForm} 
            />

            <SheetFooter className="mt-4 flex flex-col sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false); 
                  setProvider(""); 
                  setFormData({ name: "", containerName: "", region: "" }); 
                }}
                className="hover:cursor-pointer"
              >
                Cancel
              </Button>

              <Button onClick={handleSave} className="hover:cursor-pointer">
                Save Configuration
                <Save className="w-4 h-4" />
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      <StorageConfigTable data={storage} setStorage={setStorage} />
    </div>
  )
}