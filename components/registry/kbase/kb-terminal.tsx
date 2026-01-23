"use client"

import * as React from "react"
import {
    Terminal as TerminalIcon,
    Bot,
    FolderGit2,
    FileText,
    AlertCircle,
    Info,
} from "lucide-react"

import { Accordion } from "@/components/greywiz-ui/accordion"
import { useTypewriter } from "@/hooks/use-typewriter"

import { TerminalHeader } from "./terminal/terminal-header"
import { TerminalToolbar } from "./terminal/terminal-toolbar"
import { TerminalChunkItem, KBChunk } from "./terminal/terminal-chunk-item"
import { DragChunkItem } from "./terminal/drag-chunk-item"


import { 
  GitBranch, Cpu, Clock, Database, Layers 
} from 'lucide-react'; // Added extra icons for the details

// ... inside your component ...


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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/greywiz-ui/tooltip"

interface KBTerminalProps {
    loading: boolean
    chunks: KBChunk[]
    executedCmd: string
    metadata: { agent: string; project: string; doc: string }
    onReset: () => void
    onOpenFile: (file: string) => void
    onEditModeChange?: (editing: boolean) => void
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
    totalPages: propTotalPages, 
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
    const handleEnterEditMode = React.useCallback((targetChunkId?: number) => {
        setInputValue("")
        setAppliedSearch("")
        
        setEditChunks([...activeChunks])
        setIsEditing(true)
        onEditModeChange?.(true)

        if (targetChunkId) {
        setEditingChunkId(targetChunkId)       
        setOpenChunks([`chunk-${targetChunkId}`]) 
        } else {
        setOpenChunks([]) 
        }
    }, [activeChunks, onEditModeChange])

    const handleSaveEdit = React.useCallback(() => {
        setActiveChunks(editChunks)
        setInputValue("")
        setAppliedSearch("")
        setIsEditing(false)
        setEditingChunkId(null)
        onEditModeChange?.(false)
    }, [editChunks, onEditModeChange])

    const handleCancelEdit = React.useCallback(() => {
        setIsEditing(false)
        setEditingChunkId(null)
        onEditModeChange?.(false)
    }, [onEditModeChange])

    const handleAddChunk = React.useCallback(() => {
        setEditChunks((prev) => {
        const maxId = prev.length > 0 ? Math.max(...prev.map((c) => c.id)) : 0
        const newChunk: KBChunk = {
            id: maxId + 1,
            charsNoSpace: 0,
            charsWithSpace: 0,
            source: "manual_entry",
            content: "New chunk content...",
        }
        return [...prev, newChunk]; 
        })

        setTimeout(() => {
            const newTotal = Math.ceil((editChunks.length + 1) / itemsPerPage);
            onPageChange(newTotal > 0 ? newTotal : 1);
        }, 0)
        
    }, [editChunks.length, itemsPerPage, onPageChange])

    // NEW: Delete Handler
    const handleDeleteChunk = React.useCallback((idToDelete: number) => {
        setEditChunks((prev) => {
            const updated = prev.filter(c => c.id !== idToDelete);
            
            // Check pagination safety immediately after update
            const newTotalPages = Math.ceil(updated.length / itemsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                onPageChange(newTotalPages);
            }
            
            return updated;
        });
    }, [currentPage, itemsPerPage, onPageChange]);

    /* -------------------- PAGINATION CALCULATIONS -------------------- */
    const filteredChunks = React.useMemo(() => {
        if (!appliedSearch) return activeChunks
        const q = appliedSearch.toLowerCase()
        return activeChunks.filter(
        (chunk) =>
            chunk.content.toLowerCase().includes(q) ||
            chunk.source.toLowerCase().includes(q) ||
            chunk.id.toString().includes(q)
        )
    }, [activeChunks, appliedSearch])

    const currentTotalItems = isEditing ? editChunks.length : filteredChunks.length
    const calculatedTotalPages = Math.ceil(currentTotalItems / itemsPerPage)

    const paginatedViewChunks = React.useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredChunks.slice(start, start + itemsPerPage)
    }, [filteredChunks, currentPage, itemsPerPage])

    const paginatedEditChunks = React.useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return editChunks.slice(start, start + itemsPerPage)
    }, [editChunks, currentPage, itemsPerPage])

    /* -------------------- HANDLERS -------------------- */
    const handleDragEnd = React.useCallback((event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        setEditChunks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
        })
    }, [])

    const handleContentChange = React.useCallback((id: number, newContent: string) => {
        setEditChunks((prev) =>
        prev.map((c) => (c.id === id ? { ...c, content: newContent } : c))
        )
    }, [])

    const handleSearchTrigger = React.useCallback(() => {
        setAppliedSearch(inputValue)
        onPageChange(1) 
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
        const visibleChunks = isEditing ? paginatedEditChunks : paginatedViewChunks
        setOpenChunks(visibleChunks.map((c) => `chunk-${c.id}`))
    }, [isEditing, paginatedEditChunks, paginatedViewChunks])

    React.useEffect(() => {
        if (appliedSearch) {
        setOpenChunks(paginatedViewChunks.map((c) => `chunk-${c.id}`))
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
        <div
        className={`flex-1 flex flex-col relative overflow-hidden h-full
            ${isEditing ? "bg-transparent border-0" : "bg-transparent"}`}
        >
        {isEmpty && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 h-full bg-slate-50/50">
            <TerminalIcon size={48} className="mb-4 opacity-20" />
            <p className="text-xs font-medium">Output console is empty</p>
            </div>
        )}

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
                totalChunks={calculatedTotalPages} 
                onChunkChange={onPageChange}
            />

            <TerminalToolbar
                inputValue={inputValue}
                setInputValue={setInputValue}
                onSearchTrigger={handleSearchTrigger}
                isEditing={isEditing}
                onEnterEditMode={() => handleEnterEditMode()} 
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onAddChunk={handleAddChunk}
            />

            {!loading && isEditing && (
                <div className="bg-blue-50 px-4 py-1.5 border-b border-blue-100 text-[10px] font-medium text-blue-600 flex items-center gap-2 justify-center">
                <AlertCircle size={12} />
                <span className="flex items-center gap-1">
                    Editor Active: Double-click content to edit text or drag to reorder
                </span>
                </div>
            )}

            {!loading && !isEditing && (
                <div className="bg-white border-b border-slate-200 shadow-sm shrink-0">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-1">
                    
                    {/* LEFT: Main Context Pills (Expanded to fill space evenly) */}
                    <div className="flex-1 flex items-center justify-between gap-4 min-w-0">
                        
                        {/* Agent Item (Takes 1/3 space) */}
                        <div className="flex-1 flex items-center gap-3 min-w-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                            <Bot size={16} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-slate-400 tracking-wider leading-none mb-0.5">
                            Agent
                            </span>
                            <span className="text-xs font-medium text-slate-700 truncate block">
                            {metadata.agent}
                            </span>
                        </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block h-8 w-px bg-slate-200 shrink-0" />

                        {/* Project Item (Takes 1/3 space) */}
                        <div className="flex-1 flex items-center gap-3 min-w-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50 text-purple-600 shrink-0">
                            <FolderGit2 size={16} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-slate-400 tracking-wider leading-none mb-0.5">
                            Project
                            </span>
                            <span className="text-xs font-medium text-slate-700 truncate block">
                            {metadata.project}
                            </span>
                        </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block h-8 w-px bg-slate-200 shrink-0" />

                        {/* Source Item (Takes 1/3 space) */}
                        <div className="flex-1 flex items-center gap-3 min-w-0">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 text-orange-600 shrink-0">
                            <FileText size={16} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-bold text-slate-400 tracking-wider leading-none mb-0.5">
                            Source
                            </span>
                            <span className="text-xs font-medium text-slate-700 truncate block">
                            {metadata.doc}
                            </span>
                        </div>
                        </div>

                    </div>

                    {/* RIGHT: Extended Info Tooltip (Sitting just beside) */}
                    <div className="shrink-0 pl-2 border-l border-slate-100">
                        <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                            {/* <button > */}
                            <Info size={18} className="flex items-center justify-center hover:cursor-pointer rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" />
                            {/* </button> */}
                        </TooltipTrigger>

                        <TooltipContent 
                            side="bottom" 
                            align="end" 
                            className="p-0 border border-slate-200 bg-white shadow-xl rounded-xl w-[320px] animate-in fade-in zoom-in-95 duration-200"
                        >
                            {/* Header */}
                            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-900">Session Metadata</span>
                            <div className="flex items-center justify-center gap-1.5 px-2 py-1 rounded-full bg-slate-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
                                <span className="text-[10px] text-black">Live</span>
                            </div>
                            </div>

                            {/* Grid Content */}
                            <div className="p-4 grid grid-cols-2 gap-y-5 gap-x-4">
                            <div className="flex items-start gap-2.5">
                                <Cpu size={14} className="mt-0.5 text-slate-400" />
                                <div className="space-y-0.5">
                                <p className="text-[10px] font-semibold text-slate-400 tracking-wider">Model</p>
                                <p className="text-xs font-medium text-slate-700">GPT-4o</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <GitBranch size={14} className="mt-0.5 text-slate-400" />
                                <div className="space-y-0.5">
                                <p className="text-[10px] font-semibold text-slate-400 tracking-wider">Branch</p>
                                <p className="text-xs font-medium text-slate-700">main</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <Layers size={14} className="mt-0.5 text-slate-400" />
                                <div className="space-y-0.5">
                                <p className="text-[10px] font-semibold text-slate-400 tracking-wider">Context</p>
                                <p className="text-xs font-medium text-slate-700">4k Tokens</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <Clock size={14} className="mt-0.5 text-slate-400" />
                                <div className="space-y-0.5">
                                <p className="text-[10px] font-semibold text-slate-400 tracking-wider">Last Sync</p>
                                <p className="text-xs font-medium text-slate-700">Just now</p>
                                </div>
                            </div>
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 rounded-b-xl flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-mono">
                                ID: {(metadata as any).id || (metadata as any)._id || "N/A"}
                            </span>
                            <span className="flex items-center gap-1.5">
                                v2.4.0
                            </span>
                            </div>

                        </TooltipContent>
                        </Tooltip>
                    </div>

                    </div>
                </div>
                )}


            <div className="flex-1 overflow-y-auto bg-slate-50 rounded-e-sm">
                {isEditing ? (
                <div className="p-4">
                    <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    >
                    <SortableContext
                        items={paginatedEditChunks.map((c) => c.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <Accordion type="multiple" value={openChunks} onValueChange={setOpenChunks}>
                        {paginatedEditChunks.map((chunk) => (
                            <DragChunkItem
                            key={chunk.id}
                            chunk={chunk}
                            isTextEditing={editingChunkId === chunk.id}
                            isEditingMode={isEditing}
                            onToggleTextEdit={() =>
                                setEditingChunkId((prev) => (prev === chunk.id ? null : chunk.id))
                            }
                            onContentChange={(val) => handleContentChange(chunk.id, val)}
                            onOpenFile={onOpenFile}
                            // Pass delete handler
                            onDelete={() => handleDeleteChunk(chunk.id)}
                            />
                        ))}
                        </Accordion>
                    </SortableContext>
                    </DndContext>
                </div>
                ) : (
                <Accordion type="multiple" value={openChunks} onValueChange={setOpenChunks} className="p-4 space-y-3">
                    {paginatedViewChunks.length === 0 && appliedSearch && (
                    <div className="text-center py-10 text-xs text-slate-400">
                        No results found for "{appliedSearch}"
                    </div>
                    )}

                    {paginatedViewChunks.map((chunk) => (
                    <TerminalChunkItem
                        key={chunk.id}
                        chunk={chunk}
                        searchQuery={appliedSearch}
                        isEditing={false}
                        onOpenFile={onOpenFile}
                        onTriggerGlobalEdit={() => handleEnterEditMode(chunk.id)}
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
            <span className="text-[10px] tracking-wider text-slate-400 font-bold">{label}</span>
            <span className="font-medium text-slate-800 truncate">{value}</span>
        </div>
        </div>
    )
}

export type { KBChunk }