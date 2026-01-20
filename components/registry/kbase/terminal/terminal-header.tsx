import * as React from "react"
import { X, Minus, Maximize2 } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/greywiz-ui/tooltip"

import { TerminalPagination } from "./terminal-pagination"

interface TerminalHeaderProps {
    loading: boolean
    display: string
    cursor: boolean

    currentChunk: number
    totalChunks: number
    onChunkChange: (chunkIndex: number) => void

    onReset: () => void
    onCollapseAll: () => void
    onExpandAll: () => void

    /** REQUIRED: comes from KBTerminal */
    isEditing?: boolean
}

export function TerminalHeader({
    loading,
    display,
    cursor,

    currentChunk,
    totalChunks,
    onChunkChange,

    onReset,
    onCollapseAll,
    onExpandAll,

    isEditing = false,
    }: TerminalHeaderProps) {
    return (
        <div
        className="
            flex items-center justify-between
            px-4 py-2
            border-b border-slate-200
            bg-slate-100/80 text-slate-700
            shrink-0
            rounded-t-sm
        "
        >
        {/* LEFT */}
        <div className="flex items-center gap-3 min-w-0">
            <div className="flex gap-2.5">
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                <TooltipTrigger asChild>
                    <button
                    onClick={onReset}
                    className="h-3.5 w-3.5 rounded-full bg-[#c50808] flex items-center justify-center hover:opacity-80 transition-all shadow-sm"
                    >
                    <X className="h-2 w-2 text-white" strokeWidth={3} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>Clear Results</TooltipContent>
                </Tooltip>

                <Tooltip>
                <TooltipTrigger asChild>
                    <button
                    onClick={onCollapseAll}
                    className="h-3.5 w-3.5 rounded-full bg-[#f09800] flex items-center justify-center hover:opacity-80 transition-all shadow-sm"
                    >
                    <Minus className="h-2 w-2 text-white" strokeWidth={4} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>Collapse All</TooltipContent>
                </Tooltip>

                <Tooltip>
                <TooltipTrigger asChild>
                    <button
                    onClick={onExpandAll}
                    className="h-3.5 w-3.5 rounded-full bg-[#e9f500] flex items-center justify-center hover:opacity-80 transition-all shadow-sm"
                    >
                    <Maximize2 className="h-2 w-2 text-black/70" strokeWidth={3} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>Expand All</TooltipContent>
                </Tooltip>
            </TooltipProvider>
            </div>

            <div className="h-4 w-px bg-slate-300" />

            {/* COMMAND */}
            <span className="flex items-center text-xs font-mono tracking-wide text-[#12aa12] h-4 min-w-0">
            <span className="flex-1 min-w-0 truncate">
                {loading ? "Initializing..." : display}
            </span>
            <span className="inline-block w-1.5 ml-0.5 shrink-0">
                {cursor ? "▍" : ""}
            </span>
            </span>
        </div>

        {/* RIGHT */}
        <TerminalPagination
            currentPage={currentChunk}
            totalPages={totalChunks}
            onPageChange={onChunkChange}
        />
        </div>
    )
}
