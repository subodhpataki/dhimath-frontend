"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/greywiz-ui/sheet"
import { Button } from "@/components/greywiz-ui/button"
import { Input } from "@/components/greywiz-ui/input"
import { Label } from "@/components/greywiz-ui/label"
import { Edit, RefreshCcw } from "lucide-react"
import { StorageRow } from "./storage-connection-table"
import StorageProviderFields, { ProviderType, StorageConfigData } from "./storage-connection-fields"
import { showToast } from "@/lib/toast"

export function EditStorageSheet({
  row,
  onSave,
}: {
  row: StorageRow
  onSave: (r: StorageRow) => void
}) {
  const [open, setOpen] = React.useState(false)

  const [formData, setFormData] = React.useState<StorageConfigData>({
      name: row.name,
      containerName: row.containerName,
      region: row.region,
      awsAccessKeyId: row.awsAccessKeyId,
      awsSecretKey: row.awsSecretKey,
      awsSessionToken: row.awsSessionToken,
      awsEndpoint: row.awsEndpoint,
      azureStorageAccount: row.azureStorageAccount,
      azureAuthType: row.azureAuthType,
      azureKey: row.azureKey,
      gcsProjectId: row.gcsProjectId,
      gcsServiceJson: row.gcsServiceJson,
  })

  const handleUpdate = () => {
      onSave({ ...row, ...formData })
      showToast("warning", "Storage updated successfuly!")
      setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:cursor-pointer">
          <Edit className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent className="mt-11.5 w-md overflow-y-auto">
        <SheetHeader className="p-4">
          <SheetTitle>Edit Storage</SheetTitle>
        </SheetHeader>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
                <Label>Connection Name</Label>
                <Input 
                    value={formData.name} 
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                />
            </div>
            <div className="space-y-1">
                <Label>Container / Bucket</Label>
                <Input 
                    value={formData.containerName} 
                    onChange={e => setFormData(prev => ({ ...prev, containerName: e.target.value }))} 
                />
            </div>
            <div className="space-y-1">
                <Label>Region</Label>
                <Input 
                    value={formData.region} 
                    onChange={e => setFormData(prev => ({ ...prev, region: e.target.value }))} 
                />
            </div>
          </div>

          <StorageProviderFields 
            provider={row.provider as ProviderType}
            data={formData}
            onChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
            isEditing={true}
          />
        </div>

        <SheetFooter className="m-4 flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="hover:cursor-pointer">
            Cancel
          </Button>
          <Button
            className="hover:cursor-pointer"
            onClick={handleUpdate}
          >
            Update
            <RefreshCcw className="w-4 h-4 ml-1" />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}