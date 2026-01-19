"use client"

import * as React from "react"
import { MoreHorizontal, Pencil, Save, FileText } from "lucide-react"
import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/greywiz-ui/accordion"
import { HighlightText } from "./highlight-text"
import { Button } from "@/components/greywiz-ui/button"

export type KBChunk = {
    id: number
    charsNoSpace: number
    charsWithSpace: number
    source: string
    content: string
}

interface TerminalChunkItemProps {
    chunk: KBChunk
    searchQuery: string
    isEditing: boolean
    dragHandle?: React.ReactNode

    isTextEditing?: boolean
    onToggleTextEdit?: () => void
    onContentChange?: (val: string) => void
    onOpenFile?: (file: string) => void // New Prop
}

export function TerminalChunkItem({
    chunk,
    searchQuery,
    isEditing,
    dragHandle,
    isTextEditing,
    onToggleTextEdit,
    onContentChange,
    onOpenFile
    }: TerminalChunkItemProps) {

    const [showMenu, setShowMenu] = React.useState(false)
    const menuRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setShowMenu(false)
        }
        }
        if (showMenu) document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [showMenu])

    const handleMenuToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowMenu(!showMenu)
    }

    const handleEditChunkClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowMenu(false)
        if (onToggleTextEdit) onToggleTextEdit()
    }

    // Handler for the link click
    const handleSourceClick = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent accordion toggling
        e.preventDefault() // Prevent actual navigation
        
        // Call the parent handler
        if (onOpenFile) {
            onOpenFile(chunk.source)
        }
    }

    return (
        <AccordionItem
        value={`chunk-${chunk.id}`}
        className="rounded-md border bg-white shadow-sm group relative overflow-visible mb-2"
        >
        <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-slate-50/50 transition-colors flex items-center gap-2">
            
            {/* 1. Drag Handle */}
            {dragHandle && (
            <div onClick={(e) => e.stopPropagation()} className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
                {dragHandle}
            </div>
            )}

            {/* 2. ID Badge */}
            <div className="shrink-0 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded">
            #{chunk.id}
            </div>

            {/* 3. Source (Link Style) */}
            <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="text-slate-300">|</span>

            {/* WRAPPER AS LINK */}
            <a 
                href="#"
                onClick={handleSourceClick}
                className="flex items-center gap-2 min-w-0 group/link cursor-pointer"
                title={`Open ${chunk.source}`}
            >
                <FileText size={12} className="text-slate-400 group-hover/link:text-blue-500 transition-colors shrink-0" />
                <div className="text-xs text-slate-600 group-hover/link:text-blue-600 group-hover/link:underline truncate font-medium transition-colors">
                    <HighlightText text={chunk.source} query={searchQuery} />
                </div>
            </a>
            </div>

            {/* 4. Metadata & Actions */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
            <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                {chunk.charsNoSpace} chars
            </span>

            {/* Menu / Save */}
            <div className="flex items-center h-4 w-4">
                {isEditing && !isTextEditing && (
                <div className="relative" ref={menuRef}>
                    <div
                    role="button"
                    onClick={handleMenuToggle}
                    className={`flex items-center justify-center hover:cursor-pointer rounded transition-colors ${showMenu ? "text-slate-900" : "text-slate-400 hover:text-slate-700"}`}
                    >
                    <MoreHorizontal size={14} />
                    </div>
                    {showMenu && (
                        <Button
                        onClick={handleEditChunkClick}
                        className="absolute right-0 top-5 z-50 w-32 text-left px-3 py-2 text-xs bg-white border-slate-200 hover:bg-slate-100 hover:cursor-pointer transition-all text-slate-700 flex items-center gap-2"
                        >
                        Edit Content
                        <Pencil size={12} />
                        </Button>
                    )}
                </div>
                )}
                {isTextEditing && (
                <div
                    role="button"
                    onClick={(e) => { e.stopPropagation(); if (onToggleTextEdit) onToggleTextEdit(); }}
                    className="text-blue-600 hover:text-blue-700 hover:cursor-pointer transition-colors"
                >
                    <Save size={14} />
                </div>
                )}
            </div>
            </div>
        </AccordionTrigger>

        <AccordionContent className="px-0 pb-0 border-t border-slate-100">
    <div className="flex flex-col">
    {isTextEditing ? (
        <textarea
        // CHANGED: bg-slate-50 (light), text-slate-800 (dark readable text)
        className="w-full h-48 text-xs font-mono bg-slate-50 text-slate-800 p-3 focus:outline-none resize-y block border-0 placeholder:text-slate-400"
        value={chunk.content}
        onChange={(e) => onContentChange && onContentChange(e.target.value)}
        spellCheck={false}
        autoFocus
        />
    ) : (
        // CHANGED: bg-slate-50 (light), text-slate-700 (dark readable text)
        <pre className="whitespace-pre-wrap text-slate-700 text-xs font-mono bg-slate-50 p-3 m-0 rounded-b-md overflow-x-auto">
        <HighlightText text={chunk.content} query={searchQuery} />
        </pre>
    )}
    </div>
</AccordionContent>
        </AccordionItem>
    )
}