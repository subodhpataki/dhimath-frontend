"use client"

import * as React from "react"
import { Terminal as TerminalIcon, Bot, FolderGit2, FileText, AlertCircle, MoreHorizontal } from "lucide-react"
import { Accordion } from "@/components/greywiz-ui/accordion"
import { useTypewriter } from "@/hooks/use-typewriter"

import { TerminalHeader } from "./terminal/terminal-header"
import { TerminalToolbar } from "./terminal/terminal-toolbar"
import { TerminalChunkItem, KBChunk } from "./terminal/terminal-chunk-item"
import { DragChunkItem } from "./terminal/drag-chunk-item"

// DnD Imports
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
    
    // Pagination Props
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
    itemsPerPage, // Recieving the prop
    currentPage,
    totalPages,
    onPageChange,
    }: KBTerminalProps) {
    
    // 1. MAIN STATE (Source of Truth)
    const [activeChunks, setActiveChunks] = React.useState<KBChunk[]>(initialChunks)
    
    // 2. EDIT BUFFER STATE
    const [editChunks, setEditChunks] = React.useState<KBChunk[]>([])
    const [isEditing, setIsEditing] = React.useState(false)
    const [editingChunkId, setEditingChunkId] = React.useState<number | null>(null)

    // 3. UI STATE
    const [openChunks, setOpenChunks] = React.useState<string[]>([])
    const [inputValue, setInputValue] = React.useState("")
    const [appliedSearch, setAppliedSearch] = React.useState("")

    React.useEffect(() => {
        setActiveChunks(initialChunks)
    }, [initialChunks])

    // -- DnD SENSORS --
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // -- HANDLERS: Edit Mode Flow --
    const handleEnterEditMode = () => {
        setInputValue("")
        setAppliedSearch("")
        setOpenChunks([]) 
        setEditChunks([...activeChunks])
        setIsEditing(true)
    }

    const handleSaveEdit = () => {
        setActiveChunks(editChunks)
        setIsEditing(false)
        setEditingChunkId(null)
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setEditingChunkId(null)
    }

    // -- HANDLERS: Modification --
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (active.id !== over?.id) {
        setEditChunks((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id)
            const newIndex = items.findIndex((item) => item.id === over?.id)
            return arrayMove(items, oldIndex, newIndex)
        })
        }
    }

    const handleContentChange = (id: number, newContent: string) => {
        setEditChunks((prev) => 
        prev.map(c => c.id === id ? { ...c, content: newContent } : c)
        )
    }

    // -- HANDLERS: Search & UI --
    const handleSearchTrigger = () => {
        setAppliedSearch(inputValue)
    }

    const handleReset = () => {
        setInputValue("")
        setAppliedSearch("")
        onReset()
    }

    const filteredChunks = React.useMemo(() => {
        if (!appliedSearch) return activeChunks
        const lowerQuery = appliedSearch.toLowerCase()
        return activeChunks.filter(
        (chunk) =>
            chunk.content.toLowerCase().includes(lowerQuery) ||
            chunk.source.toLowerCase().includes(lowerQuery) ||
            chunk.id.toString().includes(lowerQuery)
        )
    }, [activeChunks, appliedSearch])


    // --- PAGINATION LOGIC (Now using the Prop) ---
    const paginatedChunks = React.useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        const end = start + itemsPerPage
        return filteredChunks.slice(start, end)
    }, [filteredChunks, currentPage, itemsPerPage])


    React.useEffect(() => {
        if (appliedSearch) {
        setOpenChunks(filteredChunks.map((chunk) => `chunk-${chunk.id}`))
        }
    }, [appliedSearch, filteredChunks])

    const handleCollapseAll = () => setOpenChunks([])
    const handleExpandAll = () => setOpenChunks((isEditing ? editChunks : activeChunks).map((c) => `chunk-${c.id}`))

    const { display, cursor } = useTypewriter(
        executedCmd,
        !loading && activeChunks.length > 0 && executedCmd !== ""
    )

    return (
        <div className="flex-1 flex flex-col bg-slate-100/50 relative overflow-hidden transition-all duration-300">
        
        {activeChunks.length === 0 && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <TerminalIcon size={48} className="mb-4 opacity-20" />
            <p className="text-sm">Output console is empty</p>
            </div>
        )}

        {(activeChunks.length > 0 || loading) && (
            <div className={`flex-1 flex flex-col m-4 rounded-xl border bg-white shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300 relative transition-colors ${isEditing ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200"}`}>
            
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

            {!loading && (
                <>
                {isEditing && (
                    <div className="bg-blue-50 px-4 py-1.5 border-b border-blue-100 text-[10px] font-medium text-blue-600 flex items-center gap-2 justify-center animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle size={12} />
                    <span className="flex items-center gap-1">
                        EDITOR ACTIVE: Drag items to reorder or click
                        <MoreHorizontal size={12} className="opacity-70" />
                        to edit text.
                    </span>
                    </div>
                )}

                <TerminalToolbar 
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    onSearchTrigger={handleSearchTrigger}
                    isEditing={isEditing}
                    onEnterEditMode={handleEnterEditMode}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
                />
                </>
            )}

            <div className="flex-1 overflow-y-auto p-0 bg-slate-50">
                {!loading && !isEditing && (
                <div className="bg-white border-b px-4 py-3 grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm">
                    <InfoItem icon={<Bot size={14} />} color="blue" label="Active Agent" value={metadata.agent} />
                    <InfoItem icon={<FolderGit2 size={14} />} color="purple" label="Project" value={metadata.project} />
                    <InfoItem icon={<FileText size={14} />} color="orange" label="Document Source" value={metadata.doc} />
                </div>
                )}

                {isEditing ? (
                <div className="p-4">
                    <DndContext 
                    sensors={sensors} 
                    collisionDetection={closestCenter} 
                    onDragEnd={handleDragEnd}
                    >
                    <SortableContext 
                        items={editChunks.map(c => c.id)} 
                        strategy={verticalListSortingStrategy}
                    >
                        <Accordion
                        type="multiple"
                        value={openChunks}
                        onValueChange={setOpenChunks}
                        className="space-y-0"
                        >
                        {editChunks.map((chunk) => (
                            <DragChunkItem 
                            key={chunk.id} 
                            chunk={chunk}
                            isTextEditing={editingChunkId === chunk.id}
                            onToggleTextEdit={() => setEditingChunkId(chunk.id === editingChunkId ? null : chunk.id)}
                            onContentChange={(val) => handleContentChange(chunk.id, val)}
                            onOpenFile={onOpenFile}
                            />
                        ))}
                        </Accordion>
                    </SortableContext>
                    </DndContext>
                </div>
                ) : (
                
                <Accordion
                    type="multiple"
                    value={openChunks}
                    onValueChange={setOpenChunks}
                    className="p-4 space-y-3"
                >
                    {filteredChunks.length === 0 && appliedSearch && (
                    <div className="text-center py-8 text-xs text-slate-400">
                        No chunks found matching "{appliedSearch}"
                    </div>
                    )}

                    {paginatedChunks.map((chunk) => (
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
            <span className="text-[12px] text-slate-400 font-semibold">
            {label}
            </span>
            <span className="font-medium text-slate-900">
            {value}
            </span>
        </div>
        </div>
    )
}

export type { KBChunk }