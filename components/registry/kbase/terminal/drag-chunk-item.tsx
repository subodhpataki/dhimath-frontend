import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { TerminalChunkItem, KBChunk } from "./terminal-chunk-item"

interface DragChunkItemProps {
    chunk: KBChunk
    isTextEditing?: boolean
    onToggleTextEdit?: () => void
    onContentChange?: (val: string) => void
    onOpenFile: (file: string) => void
}

export function DragChunkItem({ 
    chunk,
    isTextEditing,
    onToggleTextEdit,
    onContentChange,
    onOpenFile
}: DragChunkItemProps) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: chunk.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 50 : "auto",
        position: "relative" as const,
    }

    return (
        <div ref={setNodeRef} style={style} className="mb-4">
        <TerminalChunkItem
            chunk={chunk}
            searchQuery=""
            isEditing={true}
            isTextEditing={isTextEditing}
            onToggleTextEdit={onToggleTextEdit}
            onContentChange={onContentChange}
            onOpenFile={onOpenFile}
            dragHandle={
            <div {...attributes} {...listeners}>
                <GripVertical size={16} />
            </div>
            }
        />
        </div>
    )
}