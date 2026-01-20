"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { KBSidebar } from "./kb-sidebar"
import { KBTerminal, KBChunk } from "./kb-terminal"

// Updated Import
const PdfViewer = dynamic(
    () => import("@/components/registry/kbase/kb-pdf-viewer"),
    { ssr: false }
);

// --- MOCK DATA ---
const DATA_HIERARCHY = {
    agents: [
        { id: "ag_1", name: "Alpha Agent" },
        { id: "ag_2", name: "Beta Solver" },
        { id: "ag_3", name: "Gamma Coder" },
    ],
    projects: {
        "ag_1": [
        { id: "pj_a1", name: "Alpha Financials" },
        { id: "pj_a2", name: "Alpha Legal Docs" },
        ],
        "ag_2": [
        { id: "pj_b1", name: "Beta Analytics" },
        { id: "pj_b2", name: "Beta Health Records" },
        ],
        "ag_3": [{ id: "pj_c1", name: "Gamma Source Code" }],
    },
    docs: {
        "pj_a1": ["Q1_Report.pdf", "Balance_Sheet_2024.xlsx", "Tax_Returns.pdf"],
        "pj_a2": ["NDA_Template.docx", "Banking_Law_v2.pdf"],
        "pj_b1": ["User_Behavior_Log.csv", "Traffic_Stats.json"],
        "pj_b2": ["Patient_Data_Anonymized.xml"],
        "pj_c1": ["main.py", "utils.js", "README.md"],
    },
}

// 14 Chunks total
const MOCK_KB_CHUNKS: KBChunk[] = Array.from({ length: 14 }).map((_, i) => ({
    id: i + 1,
    charsNoSpace: 90,
    charsWithSpace: 90,
    source: "sample.pdf",
    content: `Chunk #${i + 1}: This is the content of the sample PDF. Clicking the link above will open the file.`
}))

export default function KBLayout() {
    // --- STATE ---
    const [agentId, setAgentId] = React.useState("")
    const [projectId, setProjectId] = React.useState("")
    const [docId, setDocId] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [chunks, setChunks] = React.useState<KBChunk[]>([])
    const [executedCmd, setExecutedCmd] = React.useState("")
    const [executionMetadata, setExecutionMetadata] = React.useState({
        agent: "",
        project: "",
        doc: "",
    })

    const [isEditing, setIsEditing] = React.useState(false)

    // --- PAGINATION CONFIGURATION ---
    const ITEMS_PER_PAGE = 5
    const [currentPage, setCurrentPage] = React.useState(1)
    const totalPages = Math.ceil(chunks.length / ITEMS_PER_PAGE)


    // --- NEW STATE FOR PDF VIEWING ---
    const [activeFile, setActiveFile] = React.useState<string | null>(null)
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)

    // --- HANDLERS ---
    const handleAgentChange = (val: string) => {
        setAgentId(val)
        setProjectId("")
        setDocId("")
    }

    const handleProjectChange = (val: string) => {
        setProjectId(val)
        setDocId("")
    }

    const handleReset = () => {
        setChunks([])
        setExecutedCmd("")
        setAgentId("")
        setProjectId("")
        setDocId("")
        setActiveFile(null)
        setIsSidebarCollapsed(false)
        setIsEditing(false)
        setCurrentPage(1)
    }

    // --- HANDLER: Open File from Terminal ---
    const handleOpenFile = (fileName: string) => {
        setActiveFile(fileName)
        setIsSidebarCollapsed(true) // Auto collapse sidebar
    }

    // --- HANDLER: Close PDF Viewer ---
    const handleCloseFile = () => {
        setActiveFile(null)
        setIsSidebarCollapsed(false)
    }

    // Helper to format CLI strings
    const sanitize = (str: string) => str.toLowerCase().replaceAll(" ", "_")

    const getAgentName = () => DATA_HIERARCHY.agents.find((a) => a.id === agentId)?.name || ""
    const getProjectName = () =>
        DATA_HIERARCHY.projects[agentId as keyof typeof DATA_HIERARCHY.projects]?.find(
        (p) => p.id === projectId
        )?.name || ""

    const handleRunKBase = () => {
        setLoading(true)
        setCurrentPage(1)
        setChunks([])
        setExecutedCmd("")

        const meta = {
        agent: getAgentName(),
        project: getProjectName(),
        doc: docId,
        }
        setExecutionMetadata(meta)

        const draftCmd = `${sanitize(meta.agent)}@${sanitize(meta.project)}:${sanitize(meta.doc)}`

        setTimeout(() => {
        setChunks(MOCK_KB_CHUNKS)
        setExecutedCmd(draftCmd)
        setLoading(false)
        }, 1200)
    }

    // --- STYLING LOGIC ---
    const isFileOpen = !!activeFile;
    
    // FIXED: Changed rounded-r-xl to rounded-r-sm
    const radiusClass = isFileOpen ? "rounded-r-none" : "rounded-r-sm";

    // --- RENDER ---
    return (
        <div
        className="flex h-[80vh] w-full overflow-hidden rounded-sm bg-background shadow-sm relative transition-all duration-300"
        >

        {/* 1. SIDEBAR (Left) */}
        <KBSidebar
            data={DATA_HIERARCHY}
            agentId={agentId}
            projectId={projectId}
            docId={docId}
            loading={loading}
            collapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onAgentChange={handleAgentChange}
            onProjectChange={handleProjectChange}
            onDocChange={setDocId}
            onRun={handleRunKBase}
        />

        {/* 2. TERMINAL (Middle - Flex Grow) */}
        <div
            className={`
            flex-1 min-w-0 flex flex-col h-full
            transition-all duration-300
            ${radiusClass}
            ${isEditing
                ? "border border-amber-400 z-10 rounded-e-sm"
                : "border-y border-r border-slate-200 rounded-e-sm"
            }
            `}
        >

            <KBTerminal
            loading={loading}
            chunks={chunks}
            executedCmd={executedCmd}
            metadata={executionMetadata}
            onReset={handleReset}
            onOpenFile={handleOpenFile}
            onEditModeChange={setIsEditing}
            
            // Pass file state to sync internal radius
            isFileOpen={isFileOpen} 

            // Passing Pagination Props
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            />
        </div>

        {/* 3. PDF VIEWER (Right) */}
        {activeFile && (
            <PdfViewer
            key={activeFile}
            file={activeFile}
            page={1}
            onClose={handleCloseFile}
            />
        )}
        </div>
    )
}