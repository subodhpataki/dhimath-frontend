"use client"

import * as React from "react"
import { Input } from "@/components/greywiz-ui/input"
import { Label } from "@/components/greywiz-ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/greywiz-ui/select"
import { Textarea } from "@/components/greywiz-ui/textarea" 
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
import { Copy } from "lucide-react"
import { maskApiKey } from "@/lib/mask-api-key" 
import Image from "next/image"
import { showToast } from "@/lib/toast"

export type ProviderType = "aws" | "azure" | "gcs" | ""

export type StorageConfigData = {
  // Common
  name: string
  containerName: string
  region: string
  pathPrefix?: string 

  // AWS
  awsAccessKeyId?: string
  awsSecretKey?: string
  awsSessionToken?: string
  awsIamRoleArn?: string 
  awsEndpoint?: string

  // Azure
  azureStorageAccount?: string
  azureAuthType?: "accountKey" | "sas" | "managedIdentity"
  azureKey?: string 
  azureEndpoint?: string 

  // GCS
  gcsProjectId?: string
  gcsServiceJson?: string
}

type Props = {
  provider: ProviderType
  data: StorageConfigData
  onChange: (updates: Partial<StorageConfigData>) => void
  isEditing?: boolean
}

export default function StorageProviderFields({ provider, data, onChange, isEditing = false }: Props) {
  if (!provider) return null

  const providerTitles: Record<ProviderType, string> = {
    aws: "AWS S3 Configuration",
    azure: "Azure Blob Storage Configuration",
    gcs: "Google Cloud Storage Configuration",
    "": "",
  }

  const providerLogos: Record<ProviderType, string> = {
    aws: "/aws-black.png",
    azure: "/azure.png",
    gcs: "/google.png",
    "": "",
  }

  return (
    <div className="mt-2 border-t pt-4">
      <div className="flex items-center gap-2 mb-4">
        {providerLogos[provider] && (
          <Image
            src={providerLogos[provider]}
            alt={`${provider} logo`}
            width={20}
            height={20}
          />
        )}
        <h3 className="text-sm font-semibold text-muted-foreground">
          {providerTitles[provider]}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* AWS FIELDS */}
        {provider === "aws" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="gap-1">Access Key ID<span className="text-red-500">*</span></Label>
                <Input 
                  placeholder="AKIA*******" 
                  value={data.awsAccessKeyId || ""} 
                  onChange={e => onChange({ awsAccessKeyId: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="gap-1">Secret Access Key<span className="text-red-500">*</span></Label>
                <SensitiveInput
                  value={data.awsSecretKey || ""}
                  onChange={(val) => onChange({ awsSecretKey: val })}
                  placeholder="**-***"
                  label="Secret Access Key"
                  isEditing={isEditing}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Session Token (Optional)</Label>
              <Input 
                placeholder="Optional" 
                value={data.awsSessionToken || ""} 
                onChange={e => onChange({ awsSessionToken: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label>IAM Role ARN (Optional)</Label>
              <Input 
                placeholder="arn:aws:iam::123456789012:role/..." 
                value={data.awsIamRoleArn || ""} 
                onChange={e => onChange({ awsIamRoleArn: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="space-y-1">
                <Label>Endpoint URL (Optional)</Label>
                <Input 
                    placeholder="https://s3.amazonaws.com" 
                    value={data.awsEndpoint || ""} 
                    onChange={e => onChange({ awsEndpoint: e.target.value })}
                />
                </div>
                <div className="space-y-1">
                <Label>Path Prefix (Optional)</Label>
                <Input 
                    placeholder="uploads/" 
                    value={data.pathPrefix || ""} 
                    onChange={e => onChange({ pathPrefix: e.target.value })}
                />
                </div>
            </div>
          </>
        )}

        {/* AZURE FIELDS */}
        {provider === "azure" && (
          <>
            <div className="space-y-1">
              <Label className="gap-1">Storage Account Name<span className="text-red-500">*</span></Label>
              <Input 
                placeholder="e.g. mystorageaccount" 
                value={data.azureStorageAccount || ""} 
                onChange={e => onChange({ azureStorageAccount: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="gap-1">Authentication Type<span className="text-red-500">*</span></Label>
                <Select 
                  value={data.azureAuthType || "accountKey"} 
                  onValueChange={(v: any) => onChange({ azureAuthType: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accountKey">Account Key</SelectItem>
                    <SelectItem value="sas">SAS Token</SelectItem>
                    <SelectItem value="managedIdentity">Managed Identity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {data.azureAuthType !== "managedIdentity" && (
                <div className="space-y-1">
                  <Label className="gap-1">{data.azureAuthType === 'sas' ? 'SAS Token' : 'Account Key'}<span className="text-red-500">*</span></Label>
                  <SensitiveInput
                    value={data.azureKey || ""}
                    onChange={(val) => onChange({ azureKey: val })}
                    placeholder="**************"
                    label={data.azureAuthType === 'sas' ? 'SAS Token' : 'Account Key'}
                    isEditing={isEditing}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="space-y-1">
                    <Label>Endpoint URL (Optional)</Label>
                    <Input 
                        placeholder="https://<account>.blob.core.windows.net" 
                        value={data.azureEndpoint || ""} 
                        onChange={e => onChange({ azureEndpoint: e.target.value })}
                    />
                </div>
                <div className="space-y-1">
                    <Label>Path Prefix (Optional)</Label>
                    <Input 
                        placeholder="uploads/" 
                        value={data.pathPrefix || ""} 
                        onChange={e => onChange({ pathPrefix: e.target.value })}
                    />
                </div>
            </div>
          </>
        )}

        {/* GCS FIELDS */}
        {provider === "gcs" && (
          <>
            <div className="space-y-1">
                <Label className="gap-1">Project ID<span className="text-red-500">*</span></Label>
                <Input 
                  placeholder="e.g. my-gcp-project" 
                  value={data.gcsProjectId || ""} 
                  onChange={e => onChange({ gcsProjectId: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="gap-1">Service Account JSON<span className="text-red-500">*</span></Label>
                <SensitiveInput
                  value={data.gcsServiceJson || ""}
                  onChange={(val) => onChange({ gcsServiceJson: val })}
                  placeholder='{ "type": "service_account", ... }'
                  label="Service Account JSON"
                  isTextArea
                  isEditing={isEditing}
                />
              </div>
              <div className="space-y-1">
                <Label>Path Prefix (Optional)</Label>
                <Input 
                    placeholder="uploads/" 
                    value={data.pathPrefix || ""} 
                    onChange={e => onChange({ pathPrefix: e.target.value })}
                />
              </div>
          </>
        )}
      </div>
    </div>
  )
}

function SensitiveInput({ 
  value, 
  onChange, 
  placeholder, 
  label,
  isTextArea = false,
  isEditing = false
}: { 
  value: string
  onChange: (val: string) => void
  placeholder?: string
  label: string
  isTextArea?: boolean
  isEditing?: boolean
}) {
  const [canEdit, setCanEdit] = React.useState(false)

  if (!isEditing) {
    if (isTextArea) {
        return (
            <Textarea 
                className="font-mono text-xs"
                rows={4}
                value={value} 
                onChange={e => onChange(e.target.value)} 
                placeholder={placeholder}
            />
        )
    }
    return (
        <Input 
            type="text"
            value={value} 
            onChange={e => onChange(e.target.value)} 
            placeholder={placeholder}
        />
    )
  }

  if (canEdit) {
    return isTextArea ? (
        <Textarea 
            className="font-mono text-xs"
            rows={4}
            value={value} 
            onChange={e => onChange(e.target.value)} 
            placeholder={placeholder}
            autoFocus 
        />
    ) : (
        <Input 
            type="text" 
            value={value} 
            onChange={e => onChange(e.target.value)} 
            placeholder={placeholder}
            autoFocus 
        />
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="relative group cursor-pointer">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input 
                  value={maskApiKey(value)} 
                  readOnly 
                  className="cursor-pointer pr-10 font-mono" 
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
                navigator.clipboard.writeText(value); 
                showToast("success", `${label} copied!`);
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipProvider>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit {label}?</AlertDialogTitle>
          <AlertDialogDescription>
            Editing the {label} may break existing integrations. Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction className="hover:cursor-pointer" onClick={() => setCanEdit(true)}>
            Yes, Edit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}