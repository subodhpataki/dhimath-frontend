"use client"

import React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/greywiz-ui/data-table"
import { Button } from "@/components/greywiz-ui/button"
import { Trash2 } from "lucide-react" 
import { StaticImageData } from "next/image"
import { showToast } from "@/lib/toast"
import { EditLLMConfigSheet } from "./edit-llm-config-sheet"
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

export type LLMRow = {
  id: string
  name: string
  apiKey: string
  model: string
  logoUrl?: string | StaticImageData
  createdAt: string
}


interface LLMTableProps {
  data: LLMRow[]
  setLlms: React.Dispatch<React.SetStateAction<LLMRow[]>>
}

export default function LLMTable({ data, setLlms }: LLMTableProps) {
  const columns: ColumnDef<LLMRow>[] = [
    {
      accessorKey: "name",
      header: () => (
        <div className="pl-2 text-sm font-medium text-slate-500">
          LLM
        </div>
      ),
      cell: ({ row }) => {
        const { name, logoUrl } = row.original

        return (
          <div className="flex items-center gap-3 pl-2 max-w-40">
            {logoUrl && (
              typeof logoUrl === "string" ? (
                <img
                  src={logoUrl}
                  alt={name}
                  className="w-4.5 h-4.5 rounded object-contain"
                />
              ) : (
                <img
                  src={logoUrl.src}
                  alt={name}
                  className="w-4.5 h-4.5 rounded object-contain"
                />
              )
            )}
            <span
              title={name}
              className="max-w-32 truncate whitespace-nowrap overflow-hidden text-slate-800 font-medium"
            >
              {name}
            </span>
          </div>
        )
      },
    },

    {
      accessorKey: "model",
      header: () => (
        <div className="pl-1 text-sm font-medium text-slate-500">
          Model
        </div>
      ),
      cell: ({ row }) => {
        const model = row.getValue("model") as string

        return (
          <code
            title={model}
            className="inline-block max-w-44 overflow-hidden whitespace-nowrap truncate pl-1 px-2 py-1 text-xs text-slate-700"
          >
            {model}
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
        const apiKey = row.original.apiKey

        return (
          <code
            title="Hidden for security"
            className="inline-block max-w-40 truncate rounded bg-muted px-2 py-1 text-xs text-slate-700"
          >
            {maskApiKey(apiKey)}
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
        const llm = row.original

        const handleSave = (updatedRow: LLMRow) => {
          setLlms((prev) =>
            prev.map((llm) =>
              llm.id === updatedRow.id ? updatedRow : llm
            )
          )

          showToast("warning", "LLM updated successfully!")
        }

        return (
          <div className="flex justify-center gap-2">
            <EditLLMConfigSheet
              row={llm}
              onSave={handleSave}
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
                  <AlertDialogTitle>Delete LLM settings?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    selected LLM configuration.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel className="hover:cursor-pointer">Cancel</AlertDialogCancel>

                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600 hover:cursor-pointer"
                    onClick={() => {
                      setLlms((prev) =>
                        prev.filter((item) => item.id !== llm.id)
                      )

                      showToast("error", "LLM deleted successfully!")
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
    }
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="name"
      searchPlaceholder="Filter LLMs..."
      pageSize={6}
    />
  )
}
  