"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/greywiz-ui/data-table"
import { Button } from "@/components/greywiz-ui/button"
import { Trash2 } from "lucide-react"
import { showToast } from "@/lib/toast"
import { EditEmbeddingSheet } from "./edit-embeddings-sheet"
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
import { maskApiKey } from "@/lib/mask-api-key"
import Image from "next/image"

export type EmbeddingRow = {
  id: string
  provider: string
  apiKeyMasked: string
  apiSecretMasked: string
  apiVersion: string
  model: string
  maxTokens: number
  apiEndpoint: string
  logoUrl: any
  createdAt: string
}

interface EmbeddingsTableProps {
  data: EmbeddingRow[]
  onSave: (updatedRow: EmbeddingRow) => void
  onDelete: (id: string) => void
}

export default function EmbeddingsTable({ data, onSave, onDelete }: EmbeddingsTableProps) {
  const columns: ColumnDef<EmbeddingRow>[] = [
    {
      accessorKey: "provider",
      header: () => (
        <div className="pl-2 text-sm font-medium text-slate-500">
          Provider
        </div>
      ),
      cell: ({ row }) => {
        const provider = row.getValue("provider") as string
        const logoUrl = row.original.logoUrl
        return (
          <div className="pl-2 flex items-center gap-2 max-w-40">
            <Image src={logoUrl} alt={provider} width={18} height={18} />
            <span className="text-slate-800 font-medium">{provider}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "apiEndpoint",
      header: () => (
        <div className="pl-1 text-sm font-medium text-slate-500">
          API Endpoint
        </div>
      ),
      cell: ({ row }) => {
        const apiEndpoint = row.getValue("apiEndpoint") as string
        return (
          <code className="inline-block max-w-44 truncate pl-1 px-2 py-1 text-xs text-slate-700">
            {apiEndpoint}
          </code>
        )
      },
    },
    {
      id: "apiKey",
      header: () => (
        <div className="pl-1 text-sm font-medium text-slate-500">
          API Key
        </div>
      ),
      cell: ({ row }) => {
        const apiKey = row.original.apiKeyMasked
        return (
          <code className="inline-block max-w-40 truncate rounded bg-muted px-2 py-1 text-xs text-slate-700">
            {maskApiKey(apiKey)}
          </code>
        )
      },
    },
    {
      id: "apiSecret",
      header: () => (
        <div className="pl-1 text-sm font-medium text-slate-500">
          API Secret
        </div>
      ),
      cell: ({ row }) => {
        const apiSecret = row.original.apiSecretMasked
        return (
          <code className="inline-block max-w-40 truncate rounded bg-muted px-2 py-1 text-xs text-slate-700">
            {maskApiKey(apiSecret)}
          </code>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <div className="pl-1 text-sm font-medium text-slate-500">
          Created
        </div>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt") as string)
        return (
          <div className="pl-1 text-sm text-slate-600 whitespace-nowrap">
            {date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: () => (
        <div className="text-center text-sm font-medium text-slate-500">
          Actions
        </div>
      ),
      cell: ({ row }) => {
        const embedding = row.original
        return (
          <div className="flex justify-center gap-2">
            <EditEmbeddingSheet
              row={embedding}
              onSave={onSave}
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Embedding settings?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    selected embedding configuration.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="hover:cursor-pointer">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600 hover:cursor-pointer"
                    onClick={() => onDelete(embedding.id)}
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
    }
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="provider"
      searchPlaceholder="Filter embeddings..."
      pageSize={6}
    />
  )
}
