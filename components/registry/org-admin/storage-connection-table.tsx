"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/greywiz-ui/data-table"
import { Button } from "@/components/greywiz-ui/button"
import { Trash2 } from "lucide-react"
import { 
    AlertDialog, 
    AlertDialogTrigger, 
    AlertDialogContent, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogCancel, 
    AlertDialogAction 
} from "@/components/greywiz-ui/alert-dialog"
import { EditStorageSheet } from "./edit-storage-sheet"
import { maskApiKey } from "@/lib/mask-api-key"
import Image from "next/image"
import { StorageConfigData } from "./storage-connection-fields"
import { showToast } from "@/lib/toast"

export type StorageRow = StorageConfigData & {
  id: string
  provider: string 
  createdAt: string
}

const ProviderIcon = ({ provider }: { provider: string }) => {
    const src = {
        aws: "/aws-black.png",
        azure: "/azure.png",
        gcs: "/google.png"
    }[provider]

    if (!src) return null
    return <Image src={src} alt={provider} width={20} height={20} className="object-contain" />
}

export default function StorageConfigTable({
  data,
  setStorage,
}: {
  data: StorageRow[]
  setStorage: React.Dispatch<React.SetStateAction<StorageRow[]>>
}) {
  const columns: ColumnDef<StorageRow>[] = [
    {
      accessorKey: "provider",
      header: () => <div className="pl-2 text-sm font-medium text-slate-500">Provider</div>,
      cell: ({ row }) => (
        <div className="pl-2 flex items-center gap-2 capitalize">
            <ProviderIcon provider={row.original.provider} />
            <span className="text-xs text-muted-foreground">{row.original.provider}</span>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: () => <div className="text-sm font-medium text-slate-500">Name</div>,
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      id: "identity",
      header: () => <div className="text-sm font-medium text-slate-500">Identity / Key</div>,
      cell: ({ row }) => {
        const d = row.original
        let label = "Unknown"
        let value = ""

        if (d.provider === "aws") {
            label = "Key ID"
            value = d.awsAccessKeyId || ""
        } else if (d.provider === "azure") {
            label = d.azureAuthType === "managedIdentity" ? "Identity" : "Key"
            value = d.azureKey || "Managed Identity"
        } else if (d.provider === "gcs") {
            label = "Project"
            value = d.gcsProjectId || ""
        }

        return (
            <div className="flex flex-col text-xs">
                <span className="text-muted-foreground scale-90 origin-left">{label}</span>
                <code className="bg-muted px-1.5 py-0.5 rounded w-fit max-w-30 truncate">
                  {d.provider === "gcs" ? value : maskApiKey(value)}
                </code>
            </div>
        )
      },
    },
    {
      accessorKey: "containerName",
      header: () => <div className="text-sm font-medium text-slate-500">Target</div>,
      cell: ({ row }) => (
        <div className="text-xs">
            {row.original.containerName}
            {row.original.region && (
                <span className="block text-muted-foreground text-[10px]">
                    {row.original.region}
                </span>
            )}
        </div>
      )
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-sm font-medium text-slate-500">Created</div>,
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString("en-GB"),
    },
    {
      id: "actions",
      header: () => <div className="text-sm font-medium text-slate-500">Actions</div>,
      cell: ({ row }) => {
        const storage = row.original

        return (
          <div className="flex gap-2">
            <EditStorageSheet
              row={storage}
              onSave={updated =>
                setStorage(prev => prev.map(s => (s.id === updated.id ? updated : s)))
              }
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:cursor-pointer">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete storage?</AlertDialogTitle>
                  <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => {
                      setStorage(prev => prev.filter(s => s.id !== storage.id))
                      showToast("error" ,"Storage deleted successfully!");
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
    },
  ]

  return <DataTable columns={columns} data={data} searchKey="provider" pageSize={6} />
}