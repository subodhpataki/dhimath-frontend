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

    // Logic to generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pages = []
        const showMax = 5

        if (totalPages <= showMax) {
        for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
        if (currentPage <= 3) {
            pages.push(1, 2, 3, "...", totalPages)
        } else if (currentPage >= totalPages - 2) {
            pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages)
        } else {
            pages.push(1, "...", currentPage, "...", totalPages)
        }
        }
        return pages
    }

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center gap-1 text-xs font-mono">
        <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
            <ChevronLeft className="h-3 w-3" />
        </button>

        {getPageNumbers().map((page, idx) => (
            <React.Fragment key={idx}>
            {page === "..." ? (
                <span className="px-1 text-slate-400">
                    <MoreHorizontal className="h-3 w-3" />
                </span>
            ) : (
                <button
                onClick={() => onPageChange(page as number)}
                className={cn(
                    "h-5 w-5 flex items-center justify-center rounded transition-colors",
                    currentPage === page
                    ? "bg-slate-300 font-bold text-slate-800"
                    : "text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                )}
                >
                {page}
                </button>
            )}
            </React.Fragment>
        ))}

        <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
            <ChevronRight className="h-3 w-3" />
        </button>
        </div>
    )
}