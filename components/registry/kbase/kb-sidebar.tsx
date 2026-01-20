"use client"

import * as React from "react"
import { Settings2, Bot, FolderGit2, FileText, Loader2, Play, PanelLeftClose, PanelLeftOpen, Check, Info } from "lucide-react"
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
            collapsed ? "w-12" : "w-full md:w-70"
        )}
        >
        {/* HEADER */}
        <div className={cn("p-3 border-b bg-white flex items-center", collapsed ? "justify-center" : "justify-between")}>
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
        <div
            className={cn(
                "flex-1 flex flex-col overflow-hidden transition-all duration-200",
                collapsed && "hidden"
            )}
        >
            <div className="p-3 flex-1 overflow-y-auto w-70">

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
                        "mt-8 flex items-start gap-2 rounded-md p-2 text-xs border transition-all duration-500",
                        docId
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-blue-50 text-blue-700 border-blue-100"
                    )}
                    >
                    {docId ? (
                        <Check className="h-3.5 w-3.5 mt-px shrink-0" />
                    ) : (
                        <Info className="h-3.5 w-3.5 mt-px shrink-0" />
                    )}

                    <span className="leading-relaxed">
                        {docId
                        ? "Ready to extract. Click 'Run Kbase' to proceed."
                        : "Select all fields sequentially to enable extraction."}
                    </span>
                </div>
            </div>

            <div className="p-3 border-t bg-white mt-auto w-70">
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
            <div 
                className="mt-5 flex-1 flex flex-col items-center justify-start gap-4 opacity-50 hover:cursor-pointer"
                title={!agentId || !projectId || !docId ? "Select Agent, Project & Document" : "Run Kbase"}
            >
                <div className="p-2 bg-slate-200 rounded">
                    <Bot size={16} />
                </div>
                <div className="w-px h-8 bg-slate-300" />
                <div className="p-2 bg-slate-200 rounded">
                    <FolderGit2 size={16} />
                </div>
                <div className="w-px h-8 bg-slate-300" />
                <div className="p-2 bg-slate-200 rounded">
                    <FileText size={16} />
                </div>
            </div>
        )}
        </div>
    )
}