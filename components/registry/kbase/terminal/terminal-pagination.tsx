"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface TerminalPaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function TerminalPagination({
    currentPage,
    totalPages,
    onPageChange,
    }: TerminalPaginationProps) {

    // STRICT 4-SLOT LOGIC
    // Layout: [Slot 1] [Slot 2] [Slot 3] [Slot 4]
    const generateSlots = () => {
        // Initialize 4 empty slots
        const slots: (number | string | null)[] = [null, null, null, null]

        if (totalPages <= 4) {
        // Simple fill for small page counts
        for (let i = 0; i < totalPages; i++) {
            slots[i] = i + 1
        }
        } else {
        // Logic for > 4 pages with strict 4-slot limit
        
        // Case 1: Start (Page 1 or 2)
        // View: 1 2 ... 100
        if (currentPage <= 2) {
            slots[0] = 1
            slots[1] = 2
            slots[2] = "..."
            slots[3] = totalPages
        } 
        // Case 2: End (Page 99 or 100)
        // View: 1 ... 99 100
        else if (currentPage >= totalPages - 1) {
            slots[0] = 1
            slots[1] = "..."
            slots[2] = totalPages - 1
            slots[3] = totalPages
        } 
        // Case 3: Middle (Page 50)
        // View: 1 ... 50 100
        else {
            slots[0] = 1
            slots[1] = "..."
            slots[2] = currentPage
            slots[3] = totalPages
        }
        }
        return slots
    }

    if (totalPages <= 1) return null

    return (
        // Fixed container width and centered content for stability
        // min-w-[240px] accommodates: 2 buttons + 4 slots + gaps
        <div className="shrink-0 flex items-center justify-center gap-1.5 text-xs font-mono select-none min-w-60">
        
        {/* PREV BUTTON */}
        <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="h-6 w-6 flex items-center justify-center rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-500"
        >
            <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {/* 4 FIXED SLOTS */}
        {generateSlots().map((item, idx) => (
            <div key={idx} className="h-6 w-8 flex items-center justify-center">
            {item === null ? (
                // Invisible placeholder to keep layout rigid when < 4 pages
                <span className="invisible select-none">0</span>
            ) : item === "..." ? (
                <span className="text-slate-400">
                <MoreHorizontal className="h-3 w-3" />
                </span>
            ) : (
                <button
                onClick={() => onPageChange(item as number)}
                className={cn(
                    "h-6 w-8 flex items-center justify-center rounded transition-all",
                    currentPage === item
                    ? "bg-blue-400 text-white font-medium shadow-sm"
                    : "text-blue-300 hover:bg-blue-200 hover:text-blue-400"
                )}
                >
                {item}
                </button>
            )}
            </div>
        ))}

        {/* NEXT BUTTON */}
        <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="h-6 w-6 flex items-center justify-center rounded hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-500"
        >
            <ChevronRight className="h-3.5 w-3.5" />
        </button>
        </div>
    )
}