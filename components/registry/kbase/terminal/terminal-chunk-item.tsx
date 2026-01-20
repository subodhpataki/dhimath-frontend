"use client" 

import * as React from "react"
import { Save, FileText, Trash2 } from "lucide-react"
import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/greywiz-ui/accordion"
import { HighlightText } from "./highlight-text"

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
    onOpenFile?: (file: string) => void
    onTriggerGlobalEdit?: () => void
    onDelete?: () => void
}

export function TerminalChunkItem({
    chunk,
    searchQuery,
    isEditing,
    dragHandle,
    isTextEditing,
    onToggleTextEdit,
    onContentChange,
    onOpenFile,
    onTriggerGlobalEdit,
    onDelete
    }: TerminalChunkItemProps) {

    const handleSourceClick = (e: React.MouseEvent) => {
        e.stopPropagation() 
        e.preventDefault() 
        if (onOpenFile) {
        onOpenFile(chunk.source)
        }
    }

    // Double click handler
    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation()

        if (!isEditing && onTriggerGlobalEdit) {
        onTriggerGlobalEdit()
        return
        }

        if (isEditing && !isTextEditing && onToggleTextEdit) {
        onToggleTextEdit()
        }
    }

    const handleTextAreaDoubleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
        e.currentTarget.select()
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

            {/* Action Icons */}
            <div className="flex items-center h-4 w-4">
                
                {/* DELETE ICON (Only in Edit Mode, not text editing) */}
                {isEditing && !isTextEditing && onDelete && (
                <div
                    role="button"
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="text-slate-400 hover:text-red-600 hover:cursor-pointer transition-colors"
                    title="Delete Chunk"
                >
                    <Trash2 size={14} />
                </div>
                )}

                {/* SAVE ICON (Only in Text Edit Mode) */}
                {isTextEditing && (
                <div
                    role="button"
                    onClick={(e) => { e.stopPropagation(); if (onToggleTextEdit) onToggleTextEdit(); }}
                    className="text-blue-600 hover:text-blue-700 hover:cursor-pointer transition-colors"
                    title="Save Content"
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
                className="w-full h-48 text-xs font-mono bg-slate-50 text-slate-800 p-3 focus:outline-none resize-y block border-0 placeholder:text-slate-400 selection:bg-blue-200 selection:text-blue-900"
                value={chunk.content}
                onChange={(e) => onContentChange && onContentChange(e.target.value)}
                onDoubleClick={handleTextAreaDoubleClick}
                spellCheck={false}
                autoFocus
                />
            ) : (
                <pre 
                onDoubleClick={handleDoubleClick}
                className={`whitespace-pre-wrap text-slate-700 text-xs font-mono bg-slate-50 p-3 m-0 rounded-b-md overflow-x-auto ${
                    (isEditing || !isEditing) ? "cursor-text hover:bg-slate-100/50 transition-colors" : ""
                }`}
                title="Double click to edit"
                >
                <HighlightText text={chunk.content} query={searchQuery} />
                </pre>
            )}
            </div>
        </AccordionContent>
        </AccordionItem>
    )
}