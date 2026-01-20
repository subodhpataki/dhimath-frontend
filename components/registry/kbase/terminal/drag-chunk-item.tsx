"use client"

import React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TerminalChunkItem, KBChunk } from "./terminal-chunk-item"
import { GripVertical } from "lucide-react"

interface DragChunkItemProps {
    chunk: KBChunk
    isTextEditing: boolean
    isEditingMode: boolean
    onToggleTextEdit: () => void
    onContentChange: (val: string) => void
    onOpenFile: (file: string) => void
    onDelete: () => void
}

export function DragChunkItem({ 
    chunk, 
    isTextEditing, 
    isEditingMode,
    onToggleTextEdit, 
    onContentChange,
    onOpenFile,
    onDelete
    }: DragChunkItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: chunk.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div ref={setNodeRef} style={style}>
        <TerminalChunkItem
            chunk={chunk}
            searchQuery=""
            isEditing={isEditingMode}
            isTextEditing={isTextEditing}
            onToggleTextEdit={onToggleTextEdit}
            onContentChange={onContentChange}
            onOpenFile={onOpenFile}
            onDelete={onDelete}
            dragHandle={
            <div 
                {...attributes} 
                {...listeners} 
                className="flex items-center justify-center p-0.5 rounded hover:bg-slate-200 transition-colors outline-none focus:ring-1 focus:ring-blue-400"
            >
                <GripVertical size={14} />
            </div>
            }
        />
        </div>
    )
}