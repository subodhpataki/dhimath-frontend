// // without animantions
// "use client"

// import * as React from "react"
// import { Settings2, Bot, FolderGit2, FileText, Loader2, Play, PanelLeftClose, PanelLeftOpen, Check, Info } from "lucide-react"
// import { Button } from "@/components/greywiz-ui/button"
// import { SearchableSelect } from "./searchable-select"
// import { cn } from "@/lib/utils"

// // Define the generic Option type expected by SearchableSelect
// interface Option {
//     id: string
//     name: string
// }

// interface KBSidebarProps {
//     // New props structure: Flat lists instead of nested object
//     agents: Option[]
//     projects: Option[] 
//     docs: Option[]
    
//     agentId: string
//     projectId: string
//     docId: string
    
//     loading: boolean
//     collapsed: boolean
//     onToggleCollapse: () => void
    
//     onAgentChange: (val: string) => void
//     onProjectChange: (val: string) => void
//     onDocChange: (val: string) => void
//     onRun: () => void
// }

// export function KBSidebar({
//     agents,    
//     projects,  
//     docs,      
//     agentId,
//     projectId,
//     docId,
//     loading,
//     collapsed,
//     onToggleCollapse,
//     onAgentChange,
//     onProjectChange,
//     onDocChange,
//     onRun
//     }: KBSidebarProps) {

//     return (
//         <div 
//         className={cn(
//             "border-r bg-slate-50/50 flex flex-col transition-all duration-300 ease-in-out shrink-0 overflow-hidden",
//             collapsed ? "w-12" : "w-full md:w-70"
//         )}
//         >
//         {/* HEADER */}
//         <div className={cn("p-3 border-b bg-white flex items-center", collapsed ? "justify-center" : "justify-between")}>
//             {!collapsed && (
//             <h2 className="font-semibold flex items-center gap-2 whitespace-nowrap">
//                 <Settings2 className="w-4 h-4 text-slate-500" />
//                 Configuration
//             </h2>
//             )}
//             <Button 
//             variant="ghost" 
//             size="icon" 
//             onClick={onToggleCollapse} 
//             className="h-8 w-8 text-slate-400 hover:text-slate-600"
//             title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
//             >
//             {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
//             </Button>
//         </div>

//         {/* CONTENT - Hidden if collapsed */}
//         <div
//             className={cn(
//             "flex-1 flex flex-col overflow-hidden transition-all duration-200",
//             collapsed && "hidden"
//             )}
//         >
//             <div className="p-3 flex-1 overflow-y-auto w-70">

//             {/* STEP 1: AGENT */}
//             <div className="relative pb-6">
//                 <div className="absolute left-3.75 top-8 bottom-0 w-0.5 bg-slate-200" />
//                 <label className="text-[10px] font-bold text-slate-500 tracking-wider mb-2 block">
//                 1. Agent
//                 </label>
//                 <SearchableSelect
//                 icon={Bot}
//                 placeholder="Choose Agent..."
//                 options={agents} // Use the flat list prop
//                 value={agentId}
//                 onChange={onAgentChange}
//                 />
//             </div>

//             {/* STEP 2: PROJECT */}
//             <div className="relative pb-6">
//                 <div className="absolute left-3.75 top-8 bottom-0 w-0.5 bg-slate-200" />
//                 <label
//                 className={cn(
//                     "text-[10px] font-bold tracking-wider mb-2 block transition-colors",
//                     !agentId ? "text-slate-300" : "text-slate-500"
//                 )}
//                 >
//                 2. Project
//                 </label>
//                 <SearchableSelect
//                 icon={FolderGit2}
//                 placeholder={agentId ? "Choose Project..." : "Waiting for Agent..."}
//                 options={projects} // Use the flat list prop
//                 value={projectId}
//                 onChange={onProjectChange}
//                 disabled={!agentId}
//                 />
//             </div>

//             {/* STEP 3: DOCUMENT */}
//             <div className="relative pb-2">
//                 <label
//                 className={cn(
//                     "text-[10px] font-bold tracking-wider mb-2 block transition-colors",
//                     !projectId ? "text-slate-300" : "text-slate-500"
//                 )}
//                 >
//                 3. Document
//                 </label>
//                 <SearchableSelect
//                 icon={FileText}
//                 placeholder={projectId ? "Choose Document..." : "Waiting for Project..."}
//                 options={docs} // Use the flat list prop
//                 value={docId}
//                 onChange={onDocChange}
//                 disabled={!projectId}
//                 />
//             </div>

//             {/* Status Hint */}
//             <div
//                 className={cn(
//                 "mt-8 flex items-start gap-2 rounded-md p-2 text-xs border transition-all duration-500",
//                 docId
//                     ? "bg-green-50 text-green-700 border-green-200"
//                     : "bg-blue-50 text-blue-700 border-blue-100"
//                 )}
//             >
//                 {docId ? (
//                 <Check className="h-3.5 w-3.5 mt-px shrink-0" />
//                 ) : (
//                 <Info className="h-3.5 w-3.5 mt-px shrink-0" />
//                 )}

//                 <span className="leading-relaxed">
//                 {docId
//                     ? "Ready to extract. Click 'Run Knowledge base' to proceed."
//                     : "Select all fields sequentially to enable extraction."}
//                 </span>
//             </div>
//             </div>

//             <div className="p-3 border-t bg-white mt-auto w-70">
//             <Button
//                 className="w-full hover:cursor-pointer bg-[#066eca] hover:bg-[#066eca]/90 text-white shadow-md transition-all"
//                 disabled={!agentId || !projectId || !docId || loading}
//                 onClick={onRun}
//             >
//                 {loading ? "Processing..." : "View KB"}
//                 {loading ? (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : (
//                 <Play className="mr-2 h-4 w-4 fill-current" />
//                 )}
//             </Button>
//             </div>
//         </div>
        
//         {/* Collapsed Visual Cues */}
//         {collapsed && (
//             <div 
//             className="mt-5 flex-1 flex flex-col items-center justify-start gap-4 opacity-50 hover:cursor-pointer"
//             title={!agentId || !projectId || !docId ? "Select Agent, Project & Document" : "Run Kbase"}
//             >
//             <div className="p-2 bg-slate-200 rounded"><Bot size={16} /></div>
//             <div className="w-px h-8 bg-slate-300" />
//             <div className="p-2 bg-slate-200 rounded"><FolderGit2 size={16} /></div>
//             <div className="w-px h-8 bg-slate-300" />
//             <div className="p-2 bg-slate-200 rounded"><FileText size={16} /></div>
//             </div>
//         )}
//         </div>
//     )
// }

// with animantions
"use client"

import * as React from "react"
import { Settings2, Bot, FolderGit2, FileText, Loader2, Play, PanelLeftClose, PanelLeftOpen, Check, Info, Sparkles } from "lucide-react"
import { Button } from "@/components/greywiz-ui/button"
import { SearchableSelect } from "./searchable-select"
import { cn } from "@/lib/utils"

interface Option {
    id: string
    name: string
}

interface KBSidebarProps {
    agents: Option[]
    projects: Option[]
    docs: Option[]
    agentId: string
    projectId: string
    docId: string
    loading: boolean
    collapsed: boolean
    onToggleCollapse: () => void
    onAgentChange: (val: string) => void
    onProjectChange: (val: string) => void
    onDocChange: (val: string) => void
    onRun: () => void
}

export function KBSidebar({
    agents,
    projects,
    docs,
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

    return (
        <div
        className={cn(
            // FIX 1: removed overflow-hidden from the main container if possible to allow popovers to escape 
            // (though usually internal scrolling requires overflow-hidden. See note below code if dropdowns are cut off)
            "border-r bg-slate-50/50 flex flex-col transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) shrink-0 relative z-20 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]",
            collapsed ? "w-16" : "w-full md:w-80"
        )}
        >
        {/* HEADER */}
        <div className={cn("p-4 border-b bg-white flex items-center h-16 shrink-0 relative z-50", collapsed ? "justify-center" : "justify-between")}>
            {!collapsed && (
            <h2 className="font-semibold flex items-center gap-2 text-slate-800 animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="p-1.5 bg-indigo-50 rounded-md text-indigo-600">
                <Settings2 className="w-4 h-4" />
                </div>
                Configuration
            </h2>
            )}
            <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </Button>
        </div>

        {/* EXPANDED CONTENT */}
        <div
            className={cn(
            "flex-1 flex flex-col transition-opacity duration-300 relative",
            // FIX 2: Ensure this container allows z-index stacking of children
            collapsed ? "opacity-0 pointer-events-none absolute inset-0 top-16" : "opacity-100"
            )}
        >
            {/* SCROLL AREA */}
            <div className="p-5 flex-1 overflow-y-auto custom-scrollbar relative z-0">
            
            {/* STEP 1: AGENT (High Z-Index) */}
            {/* FIX 3: z-30 ensures this dropdown sits ON TOP of Step 2 */}
            <div className="relative pb-8 z-30 group animate-in slide-in-from-bottom-2 fade-in duration-500 delay-100 fill-mode-forwards">
                <div 
                className={cn(
                    "absolute left-[15px] top-10 bottom-0 w-[2px] transition-colors duration-500 delay-100",
                    agentId ? "bg-green-500/50" : "bg-slate-200"
                )} 
                />
                
                <label className="text-[10px] font-bold text-slate-500 tracking-widest mb-3 flex items-center gap-2">
                <span className={cn(
                    "flex items-center justify-center w-5 h-5 rounded-full text-[10px] border transition-all duration-300",
                    agentId ? "bg-green-100 border-green-200 text-green-700" : "bg-slate-100 border-slate-200 text-slate-500"
                )}>
                    {agentId ? <Check size={10} /> : "1"}
                </span>
                Agent
                </label>
                
                <div className={cn("relative", !agentId && "scale-[1.02]")}>
                <SearchableSelect
                    icon={Bot}
                    placeholder="Choose Agent..."
                    options={agents}
                    value={agentId}
                    onChange={onAgentChange}
                />
                </div>
            </div>

            {/* STEP 2: PROJECT (Medium Z-Index) */}
            {/* FIX 4: z-20 ensures this sits below Step 1 but above Step 3 */}
            <div className="relative pb-8 z-20 group animate-in slide-in-from-bottom-2 fade-in duration-500 delay-200 fill-mode-forwards">
                <div 
                className={cn(
                    "absolute left-[15px] top-10 bottom-0 w-[2px] transition-colors duration-500 delay-100",
                    projectId ? "bg-green-500/50" : "bg-slate-200"
                )} 
                />

                <label className={cn(
                "text-[10px] font-bold tracking-widest mb-3 flex items-center gap-2 transition-colors duration-300",
                !agentId ? "text-slate-300" : "text-slate-500"
                )}>
                <span className={cn(
                    "flex items-center justify-center w-5 h-5 rounded-full text-[10px] border transition-all duration-300",
                    projectId ? "bg-green-100 border-green-200 text-green-700" : 
                    (!agentId ? "bg-slate-50 border-slate-100 text-slate-300" : "bg-white border-slate-300 text-slate-500")
                )}>
                    {projectId ? <Check size={10} /> : "2"}
                </span>
                Project
                </label>

                <div className={cn(
                "transition-all duration-500 relative",
                !agentId ? "opacity-50 grayscale pointer-events-none blur-[1px]" : "opacity-100 blur-0"
                )}>
                <SearchableSelect
                    icon={FolderGit2}
                    placeholder={agentId ? "Choose Project..." : "Waiting for Agent..."}
                    options={projects}
                    value={projectId}
                    onChange={onProjectChange}
                    disabled={!agentId}
                />
                </div>
            </div>

            {/* STEP 3: DOCUMENT (Low Z-Index) */}
            {/* FIX 5: z-10 sits at the bottom stack */}
            <div className="relative pb-2 z-10 group animate-in slide-in-from-bottom-2 fade-in duration-500 delay-300 fill-mode-forwards">
                <label className={cn(
                "text-[10px] font-bold tracking-widest mb-3 flex items-center gap-2 transition-colors duration-300",
                !projectId ? "text-slate-300" : "text-slate-500"
                )}>
                <span className={cn(
                    "flex items-center justify-center w-5 h-5 rounded-full text-[10px] border transition-all duration-300",
                    docId ? "bg-green-100 border-green-200 text-green-700" : 
                    (!projectId ? "bg-slate-50 border-slate-100 text-slate-300" : "bg-white border-slate-300 text-slate-500")
                )}>
                    {docId ? <Check size={10} /> : "3"}
                </span>
                Document
                </label>

                <div className={cn(
                "transition-all duration-500 relative",
                !projectId ? "opacity-50 grayscale pointer-events-none blur-[1px]" : "opacity-100 blur-0"
                )}>
                <SearchableSelect
                    icon={FileText}
                    placeholder={projectId ? "Choose Document..." : "Waiting for Project..."}
                    options={docs}
                    value={docId}
                    onChange={onDocChange}
                    disabled={!projectId}
                />
                </div>
            </div>

            {/* Status Card (Base Z-Index) */}
            <div
                className={cn(
                "mt-8 p-3 rounded-xl border text-xs transition-all duration-500 transform relative z-0",
                docId
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 text-green-800 border-green-200 shadow-sm scale-100 opacity-100"
                    : "bg-slate-50 text-slate-500 border-slate-100 opacity-80"
                )}
            >
                <div className="flex gap-3">
                <div className={cn(
                    "shrink-0 p-1.5 rounded-full h-fit",
                    docId ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-500"
                )}>
                    {docId ? <Sparkles size={14} /> : <Info size={14} />}
                </div>
                <div className="space-y-1">
                    <p className="font-semibold">
                    {docId ? "Ready to Launch" : "Setup Required"}
                    </p>
                    <p className={cn("leading-relaxed opacity-90", docId ? "text-green-700" : "text-slate-500")}>
                    {docId
                        ? "Configuration complete. You can now generate the knowledge base."
                        : "Follow the steps above to unlock the generator."}
                    </p>
                </div>
                </div>
            </div>
            </div>

            {/* FOOTER ACTIONS (High Z-Index so it sits over scrolled content) */}
            <div className="p-4 border-t bg-white mt-auto relative z-40 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
            <Button
                className={cn(
                    "w-full relative overflow-hidden transition-all duration-300 font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5",
                    (!agentId || !projectId || !docId) 
                    ? "bg-slate-100 text-slate-400 hover:bg-slate-200 shadow-none cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                )}
                disabled={!agentId || !projectId || !docId || loading}
                onClick={onRun}
            >
                <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                    <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                    </>
                ) : (
                    <>
                    <span>View Knowledge Base</span>
                    <Play className="h-4 w-4 fill-current opacity-80" />
                    </>
                )}
                </div>
            </Button>
            </div>
        </div>

        {/* COLLAPSED STATE */}
        {collapsed && (
            <div className="flex-1 flex flex-col items-center py-6 gap-6 w-full animate-in fade-in duration-500 relative z-20">
            {/* Collapsed Icons... */}
            <div className="relative group z-30">
                <div className={cn("p-2.5 rounded-xl transition-all duration-300", agentId ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-400")}>
                    <Bot size={20} />
                </div>
                <div className={cn("absolute left-1/2 -bottom-6 w-0.5 h-6 -translate-x-1/2", agentId ? "bg-green-200" : "bg-slate-200")}/>
            </div>
            
            <div className="relative group z-20">
                <div className={cn("p-2.5 rounded-xl transition-all duration-300", projectId ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-400")}>
                    <FolderGit2 size={20} />
                </div>
                <div className={cn("absolute left-1/2 -bottom-6 w-0.5 h-6 -translate-x-1/2", projectId ? "bg-green-200" : "bg-slate-200")}/>
            </div>

            <div className="relative group z-10">
                <div className={cn("p-2.5 rounded-xl transition-all duration-300", docId ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-400")}>
                    <FileText size={20} />
                </div>
            </div>

            <div className="mt-auto pb-4 z-40">
                <button 
                    onClick={onRun}
                    disabled={!docId || loading}
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                        docId 
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:scale-110" 
                        : "bg-slate-100 text-slate-300 cursor-not-allowed"
                    )}
                >
                    {loading ? <Loader2 size={18} className="animate-spin"/> : <Play size={18} className="ml-0.5 fill-current"/>}
                </button>
            </div>
            </div>
        )}
        </div>
    )
}