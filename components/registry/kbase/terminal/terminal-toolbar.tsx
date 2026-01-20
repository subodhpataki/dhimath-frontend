"use client"

import * as React from "react"
import { Search, Edit3, Save, X, Plus } from "lucide-react"
import { Button } from "@/components/greywiz-ui/button"
import { Input } from "@/components/greywiz-ui/input"

interface TerminalToolbarProps {
    inputValue: string
    setInputValue: (val: string) => void
    onSearchTrigger: () => void
    isEditing: boolean
    onEnterEditMode: () => void
    onSaveEdit: () => void
    onCancelEdit: () => void
    onAddChunk: () => void
}

export function TerminalToolbar({
    inputValue,
    setInputValue,
    onSearchTrigger,
    isEditing,
    onEnterEditMode,
    onSaveEdit,
    onCancelEdit,
    onAddChunk,
    }: TerminalToolbarProps) {
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isEditing) {
        onSearchTrigger()
        }
    }

    return (
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b gap-3 h-11.25">
        
        {/* Search Container - Disabled/Dimmed during Edit Mode */}
        <div className={`flex w-72 group transition-opacity duration-200 ${isEditing ? "opacity-30 pointer-events-none" : "opacity-100"}`}>
            <Input
            type="text"
            placeholder={isEditing ? "Search disabled in edit mode" : "Search terminal output..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isEditing}
            className="w-full pl-3 pr-9 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-e-xs focus:outline-none focus:ring-1 focus:ring-slate-300 transition-all placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
            <Button
            onClick={onSearchTrigger}
            disabled={isEditing}
            className=" hover:text-white bg-blue-300 hover:bg-blue-200 rounded-0 rounded-s-xs cursor-pointer z-10 disabled:cursor-not-allowed"
            title="Click to search"
            >
            <Search className="h-3.5 w-3.5" />
            </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
            {isEditing ? (
            <>
                {/* NEW ADD BUTTON */}
                <Button
                onClick={onAddChunk}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs hover:cursor-pointer border bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 transition-all"
                >
                <span>Add</span>
                <Plus size={12} />
                </Button>

                <div className="h-6 w-px bg-slate-300" />
                <Button
                onClick={onCancelEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs hover:cursor-pointer border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 transition-all"
                >
                <span>Cancel</span>
                <X size={12} />
                </Button>
                <Button
                onClick={onSaveEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs hover:cursor-pointer font-medium transition-all animate-in zoom-in-95"
                >
                <span>Save</span>
                <Save size={12} />
                </Button>
            </>
            ) : (
            <Button
                onClick={onEnterEditMode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs hover:cursor-pointer font-medium border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 transition-all"
            >
                <span>Edit Mode</span>
                <Edit3 size={12} />
            </Button>
            )}
        </div>
        </div>
    )
}