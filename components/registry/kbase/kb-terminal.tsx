"use client"

import * as React from "react"
import {
    Terminal as TerminalIcon,
    Bot,
    FolderGit2,
    FileText,
    AlertCircle,
    MoreHorizontal,
} from "lucide-react"

import { Accordion } from "@/components/greywiz-ui/accordion"
import { useTypewriter } from "@/hooks/use-typewriter"

import { TerminalHeader } from "./terminal/terminal-header"
import { TerminalToolbar } from "./terminal/terminal-toolbar"
import { TerminalChunkItem, KBChunk } from "./terminal/terminal-chunk-item"
import { DragChunkItem } from "./terminal/drag-chunk-item"

// DnD
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"

interface KBTerminalProps {
    loading: boolean
    chunks: KBChunk[]
    executedCmd: string
    metadata: { agent: string; project: string; doc: string }
    onReset: () => void
    onOpenFile: (file: string) => void

    onEditModeChange?: (editing: boolean) => void

    // New prop to control radius styling
    isFileOpen?: boolean 

    itemsPerPage: number
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function KBTerminal({
    loading,
    chunks: initialChunks,
    executedCmd,
    metadata,
    onReset,
    onOpenFile,
    itemsPerPage,
    currentPage,
    totalPages,
    onPageChange,
    onEditModeChange,
    isFileOpen = false, 
    }: KBTerminalProps) {

    /* -------------------- STATE -------------------- */
    const [activeChunks, setActiveChunks] = React.useState<KBChunk[]>(initialChunks)
    const [editChunks, setEditChunks] = React.useState<KBChunk[]>([])
    const [isEditing, setIsEditing] = React.useState(false)
    const [editingChunkId, setEditingChunkId] = React.useState<number | null>(null)

    const [openChunks, setOpenChunks] = React.useState<string[]>([])
    const [inputValue, setInputValue] = React.useState("")
    const [appliedSearch, setAppliedSearch] = React.useState("")

    React.useEffect(() => {
        setActiveChunks(initialChunks)
    }, [initialChunks])

    /* -------------------- DND -------------------- */
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    /* -------------------- EDIT FLOW -------------------- */
    const handleEnterEditMode = React.useCallback(() => {
        setInputValue("")
        setAppliedSearch("")
        setOpenChunks([])
        setEditChunks([...activeChunks])
        setIsEditing(true)
        onEditModeChange?.(true)
    }, [activeChunks, onEditModeChange])

    const handleSaveEdit = React.useCallback(() => {
        setActiveChunks(editChunks)
        setIsEditing(false)
        setEditingChunkId(null)
        onEditModeChange?.(false)
    }, [editChunks, onEditModeChange])

    const handleCancelEdit = React.useCallback(() => {
        setIsEditing(false)
        setEditingChunkId(null)
        onEditModeChange?.(false)
    }, [onEditModeChange])

    /* -------------------- PAGINATION CALCULATIONS -------------------- */
    
    // Filter for View Mode
    const filteredChunks = React.useMemo(() => {
        if (!appliedSearch) return activeChunks
        const q = appliedSearch.toLowerCase()
        return activeChunks.filter(chunk =>
        chunk.content.toLowerCase().includes(q) ||
        chunk.source.toLowerCase().includes(q) ||
        chunk.id.toString().includes(q)
        )
    }, [activeChunks, appliedSearch])

    // Pagination for View Mode
    const paginatedViewChunks = React.useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredChunks.slice(start, start + itemsPerPage)
    }, [filteredChunks, currentPage, itemsPerPage])

    // Pagination for Edit Mode
    const paginatedEditChunks = React.useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return editChunks.slice(start, start + itemsPerPage)
    }, [editChunks, currentPage, itemsPerPage])


    /* -------------------- HANDLERS -------------------- */

    const handleDragEnd = React.useCallback((event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        setEditChunks((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
        })
    }, [])

    const handleContentChange = React.useCallback((id: number, newContent: string) => {
        setEditChunks(prev =>
        prev.map(c => (c.id === id ? { ...c, content: newContent } : c))
        )
    }, [])

    const handleSearchTrigger = React.useCallback(() => {
        setAppliedSearch(inputValue)
        onPageChange(1) // Reset to page 1 on search
    }, [inputValue, onPageChange])

    const handleReset = React.useCallback(() => {
        setInputValue("")
        setAppliedSearch("")
        onReset()
    }, [onReset])

    const handleCollapseAll = React.useCallback(() => {
        setOpenChunks([])
    }, [])

    const handleExpandAll = React.useCallback(() => {
        // Determine which set of chunks we are currently viewing
        const visibleChunks = isEditing ? paginatedEditChunks : paginatedViewChunks
        setOpenChunks(visibleChunks.map(c => `chunk-${c.id}`))
    }, [isEditing, paginatedEditChunks, paginatedViewChunks])

    // Auto-expand searched items
    React.useEffect(() => {
        if (appliedSearch) {
        setOpenChunks(paginatedViewChunks.map(c => `chunk-${c.id}`))
        }
    }, [appliedSearch, paginatedViewChunks])


    /* -------------------- TYPEWRITER -------------------- */
    const { display, cursor } = useTypewriter(
        executedCmd,
        !loading && activeChunks.length > 0 && executedCmd !== ""
    )

    /* -------------------- RENDER -------------------- */
    const isEmpty = activeChunks.length === 0 && !loading

    return (
        <div className={`flex-1 flex flex-col relative overflow-hidden h-full
        ${isEditing ? "bg-transparent border-0" : "bg-transparent"}`}>
        
        {/* 1. Empty State (Centered) */}
        {isEmpty && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 h-full bg-slate-50/50">
            <TerminalIcon size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium">Output console is empty</p>
            </div>
        )}

        {/* 2. Content State */}
        {!isEmpty && (
            <div className="flex-1 flex flex-col overflow-hidden h-full">

            <TerminalHeader
                loading={loading}
                display={display}
                cursor={cursor}
                onReset={handleReset}
                onCollapseAll={handleCollapseAll}
                onExpandAll={handleExpandAll}
                currentChunk={currentPage}
                totalChunks={totalPages}
                onChunkChange={onPageChange}
            />

            <TerminalToolbar
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSearchTrigger={handleSearchTrigger}
                isEditing={isEditing}
                onEnterEditMode={handleEnterEditMode}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
            />

                {/* Edit Mode Warning Banner */}
                {!loading && isEditing && (
                    <div className="bg-blue-50 px-4 py-1.5 border-b border-blue-100 text-[10px] font-medium text-blue-600 flex items-center gap-2 justify-center">
                        <AlertCircle size={12} />
                        <span className="flex items-center gap-1">
                        Editor Active: Drag items or click
                        <MoreHorizontal size={12} className="opacity-70" />
                        to edit text
                        </span>
                    </div>
                )}

            {/* Metadata Banner (View Mode Only) */}
            {!loading && !isEditing && (
                <div className="bg-white border-b px-4 py-3 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm shrink-0">
                <InfoItem icon={<Bot size={14} />} color="blue" label="Active Agent" value={metadata.agent} />
                <InfoItem icon={<FolderGit2 size={14} />} color="purple" label="Project" value={metadata.project} />
                <InfoItem icon={<FileText size={14} />} color="orange" label="Document Source" value={metadata.doc} />
                </div>
            )}

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50 rounded-e-sm">
                {isEditing ? (
                <div className="p-4">
                    <DndContext 
                        sensors={sensors} 
                        collisionDetection={closestCenter} 
                        onDragEnd={handleDragEnd}
                    >
                    {/* Important: SortableContext must receive IDs of currently rendered items */}
                    <SortableContext 
                        items={paginatedEditChunks.map(c => c.id)} 
                        strategy={verticalListSortingStrategy}
                    >
                        <Accordion type="multiple" value={openChunks} onValueChange={setOpenChunks}>
                        {paginatedEditChunks.map(chunk => (
                            <DragChunkItem
                            key={chunk.id}
                            chunk={chunk}
                            isTextEditing={editingChunkId === chunk.id}
                            onToggleTextEdit={() =>
                                setEditingChunkId(prev => (prev === chunk.id ? null : chunk.id))
                            }
                            onContentChange={(val) => handleContentChange(chunk.id, val)}
                            onOpenFile={onOpenFile}
                            />
                        ))}
                        </Accordion>
                    </SortableContext>
                    </DndContext>
                </div>
                ) : (
                <Accordion type="multiple" value={openChunks} onValueChange={setOpenChunks} className="p-4 space-y-3">
                    {paginatedViewChunks.length === 0 && appliedSearch && (
                    <div className="text-center py-10 text-sm text-slate-400">
                        No results found for "{appliedSearch}"
                    </div>
                    )}

                    {paginatedViewChunks.map(chunk => (
                    <TerminalChunkItem
                        key={chunk.id}
                        chunk={chunk}
                        searchQuery={appliedSearch}
                        isEditing={false}
                        onOpenFile={onOpenFile}
                    />
                    ))}
                </Accordion>
                )}
            </div>
            </div>
        )}
        </div>
    )
}

/* -------------------- INFO ITEM -------------------- */
function InfoItem({ icon, color, label, value }: any) {
    const colorClasses: Record<string, string> = {
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
    }

    return (
        <div className="flex items-center gap-2 text-xs text-slate-600">
        <div className={`p-1.5 rounded-md ${colorClasses[color]}`}>
            {icon}
        </div>
        <div className="flex flex-col">
            <span className="text-[10px] tracking-wider text-slate-400 font-bold">{label}</span>
            <span className="font-medium text-slate-800 truncate">{value}</span>
        </div>
        </div>
    )
}

export type { KBChunk }