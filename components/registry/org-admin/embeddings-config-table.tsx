"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/greywiz-ui/data-table"
import { Button } from "@/components/greywiz-ui/button"
import { Edit, Trash2 } from "lucide-react"
import Image, { StaticImageData } from "next/image"
import { EditEmbeddingSheet } from "./edit-embeddings-sheet"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/greywiz-ui/alert-dialog"
import { showToast } from "@/lib/toast"

export type EmbeddingRow = {
  id: string
  provider: string
  apiKeyMasked: string
  apiSecretMasked: string
  apiVersion: string
  model: string
  maxTokens: number
  apiEndpoint: string
  logoUrl?: StaticImageData
  createdAt: string
}

interface EmbeddingsTableProps {
  data: EmbeddingRow[]
  setEmbeddings: React.Dispatch<React.SetStateAction<EmbeddingRow[]>>
}

export default function EmbeddingsConfigTable({ data, setEmbeddings }: EmbeddingsTableProps) {
  const columns: ColumnDef<EmbeddingRow>[] = [
    {
      accessorKey: "provider",
      header: () => <div className="pl-2 text-sm font-medium text-slate-500">Provider</div>,
      cell: ({ row }) => {
        const { provider, logoUrl } = row.original
        return (
          <div className="flex items-center gap-2 pl-2 max-w-40">
            {logoUrl && <Image src={logoUrl} alt={provider} width={18} height={18} className="rounded object-contain" />}
            <span title={provider} className="truncate text-slate-800">{provider}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "model",
      header: () => <div className="pl-1 text-sm font-medium text-slate-500">Model</div>,
      cell: ({ row }) => <div className="pl-1 max-w-40 truncate text-slate-700">{row.getValue("model") as string}</div>,
    },
    {
      accessorKey: "apiEndpoint",
      header: () => <div className="pl-1 text-sm font-medium text-slate-500">API Endpoint</div>,
      cell: ({ row }) => <div className="pl-1 max-w-52 truncate text-slate-700">{row.getValue("apiEndpoint") as string}</div>,
    },
    {
      accessorKey: "maxTokens",
      header: () => <div className="text-right text-slate-500 font-medium">Max Tokens</div>,
      cell: ({ row }) => <div className="text-right font-semibold text-slate-900">{row.getValue("maxTokens")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="pl-1 text-sm font-medium text-slate-500">Created</div>,
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt") as string)
        return <div className="pl-1 text-sm text-slate-600 whitespace-nowrap">{date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center text-sm font-medium text-slate-500">Actions</div>,
      cell: ({ row }) => {
        const embedding = row.original

        const handleSave = (updatedRow: EmbeddingRow) => {
          setEmbeddings(prev => prev.map(e => e.id === updatedRow.id ? updatedRow : e))
          showToast("warning", "Embedding updated successfully!");
        }

        return (
          <div className="flex justify-center gap-2">
            <EditEmbeddingSheet row={embedding} onSave={handleSave} />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:cursor-pointer">
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete embedding?</AlertDialogTitle>
                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel className="hover:cursor-pointer">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-500 hover:bg-red-600 hover:cursor-pointer"
                    onClick={() => {
                      setEmbeddings(prev => prev.filter(e => e.id !== embedding.id))
                      showToast("error", "Embedding deleted successfully!")
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
      enableSorting: false,
      enableHiding: false,
    },
  ]

  return <DataTable columns={columns} data={data} searchKey="provider" searchPlaceholder="Filter embeddings..." pageSize={6} />
}
