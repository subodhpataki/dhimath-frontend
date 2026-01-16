"use client"

import * as React from "react"
import { Settings2, Bot, FolderGit2, FileText, Loader2, Play, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/greywiz-ui/button"
import { SearchableSelect } from "./searchable-select"
import { cn } from "@/lib/utils"

interface KBSidebarProps {
    data: any
    agentId: string
    projectId: string
    docId: string
    loading: boolean
    collapsed: boolean // New prop
    onToggleCollapse: () => void // New prop
    onAgentChange: (val: string) => void
    onProjectChange: (val: string) => void
    onDocChange: (val: string) => void
    onRun: () => void
}

export function KBSidebar({
    data,
    agentId,
    projectId,
    docId,
    loading,
    collapsed,
    onToggleCollapse,
    onAgentChange,
    onProjectChange,
    onDocChange,
    onRun
    }: KBSidebarProps) {
    
    // Derived Lists
    const availableProjects = agentId ? (data.projects[agentId] || []) : []
    const availableDocs = projectId ? (data.docs[projectId] || []) : []

    return (
        <div 
        className={cn(
            "border-r bg-slate-50/50 flex flex-col transition-all duration-300 ease-in-out shrink-0 overflow-hidden",
            collapsed ? "w-15" : "w-full md:w-[320px]"
        )}
        >
        {/* HEADER */}
        <div className={cn("p-4 border-b bg-white flex items-center h-14.25", collapsed ? "justify-center" : "justify-between")}>
            {!collapsed && (
                <h2 className="font-semibold flex items-center gap-2 whitespace-nowrap">
                <Settings2 className="w-4 h-4 text-slate-500" />
                Configuration
                </h2>
            )}
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggleCollapse} 
                className="h-8 w-8 text-slate-400 hover:text-slate-600"
                title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </Button>
        </div>

        {/* CONTENT - Hidden if collapsed */}
        <div className={cn("flex-1 flex flex-col overflow-hidden transition-opacity duration-200", collapsed ? "opacity-0 invisible" : "opacity-100 visible")}>
            <div className="p-5 flex-1 overflow-y-auto w-[320px]"> {/* Fixed width inner container prevents reflow during transition */}
                
                {/* STEP 1: AGENT */}
                <div className="relative pb-6">
                <div className="absolute left-3.75 top-8 bottom-0 w-0.5 bg-slate-200" />
                <label className="text-[10px] font-bold text-slate-500 tracking-wider mb-2 block">
                    1. Select Agent
                </label>
                <SearchableSelect
                    icon={Bot}
                    placeholder="Choose Agent..."
                    options={data.agents}
                    value={agentId}
                    onChange={onAgentChange}
                />
                </div>

                {/* STEP 2: PROJECT */}
                <div className="relative pb-6">
                <div className="absolute left-3.75 top-8 bottom-0 w-0.5 bg-slate-200" />
                <label
                    className={cn(
                    "text-[10px] font-bold tracking-wider mb-2 block transition-colors",
                    !agentId ? "text-slate-300" : "text-slate-500"
                    )}
                >
                    2. Select Project
                </label>
                <SearchableSelect
                    icon={FolderGit2}
                    placeholder={agentId ? "Choose Project..." : "Waiting for Agent..."}
                    options={availableProjects}
                    value={projectId}
                    onChange={onProjectChange}
                    disabled={!agentId}
                />
                </div>

                {/* STEP 3: DOCUMENT */}
                <div className="relative pb-2">
                <label
                    className={cn(
                    "text-[10px] font-bold tracking-wider mb-2 block transition-colors",
                    !projectId ? "text-slate-300" : "text-slate-500"
                    )}
                >
                    3. Select Document
                </label>
                <SearchableSelect
                    icon={FileText}
                    placeholder={projectId ? "Choose Document..." : "Waiting for Project..."}
                    options={availableDocs}
                    value={docId}
                    onChange={onDocChange}
                    disabled={!projectId}
                />
                </div>

                {/* Status Hint */}
                <div
                className={cn(
                    "mt-8 rounded-md p-3 text-xs leading-relaxed border transition-all duration-500",
                    docId
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-blue-50 text-blue-700 border-blue-100"
                )}
                >
                {docId
                    ? "✓ Ready to extract. Click 'Run Kbase' to proceed."
                    : "Select all fields sequentially to enable extraction."}
                </div>
            </div>

            <div className="p-5 border-t bg-white mt-auto w-[320px]">
                <Button
                className="w-full hover:cursor-pointer bg-[#066eca] hover:bg-[#066eca]/90 text-white shadow-md transition-all"
                disabled={!agentId || !projectId || !docId || loading}
                onClick={onRun}
                >
                {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Play className="mr-2 h-4 w-4 fill-current" />
                )}
                {loading ? "Processing..." : "Run Kbase"}
                </Button>
            </div>
        </div>
        
        {/* Collapsed Vertical Text (Optional visual cue) */}
        {collapsed && (
            <div className="flex-1 flex flex-col items-center justify-start pt-8 gap-4 opacity-50">
                <div className="p-2 bg-slate-200 rounded">
                    <Bot size={16} />
                </div>
                <div className="w-px h-8 bg-slate-300" />
                <div className="p-2 bg-slate-200 rounded">
                    <FolderGit2 size={16} />
                </div>
            </div>
        )}
        </div>
    )
}