// "use client"

// import * as React from "react"
// import dynamic from "next/dynamic"
// import { KBSidebar } from "./kb-sidebar"
// import { KBTerminal, KBChunk } from "./kb-terminal"
// import { fetchAllAgents, fetchProjects, fetchDocs } from "@/lib/services/kb-agents.api"

// // Dynamic Import for PDF Viewer to avoid SSR issues
// const PdfViewer = dynamic(
//     () => import("@/components/registry/kbase/kb-pdf-viewer"),
//     { ssr: false }
// );

// // --- MOCK DATA FOR CHUNKS (Replace with real API later) ---
// const MOCK_KB_CHUNKS: KBChunk[] = Array.from({ length: 25 }).map((_, i) => ({
//     id: i + 1,
//     charsNoSpace: 90,
//     charsWithSpace: 90,
//     source: "sample.pdf",
//     content: `Chunk #${i + 1}: This is the content from the backend.`
// }))

// // --- Types ---
// interface Option {
//     id: string;
//     name: string;
// }

// export default function KBLayout() {
//     // --- AUTH/CONTEXT CONSTANTS ---
//     // In a real app, these might come from a useAuth() hook
//     const ORG_ID = 1;
//     const ORG_USER_ID = 1;

//     // --- SELECTION STATE ---
//     const [agentId, setAgentId] = React.useState("")
//     const [projectId, setProjectId] = React.useState("")
//     const [docId, setDocId] = React.useState("")
    
//     // --- DROPDOWN DATA STATE ---
//     const [agentsList, setAgentsList] = React.useState<Option[]>([])
//     const [projectsList, setProjectsList] = React.useState<Option[]>([])
//     const [docsList, setDocsList] = React.useState<Option[]>([])
    
//     // --- UI STATE ---
//     const [loading, setLoading] = React.useState(false) // General loading (e.g. fetching chunks)
//     const [chunks, setChunks] = React.useState<KBChunk[]>([])
//     const [executedCmd, setExecutedCmd] = React.useState("")
//     const [executionMetadata, setExecutionMetadata] = React.useState({
//         agent: "",
//         project: "",
//         doc: "",
//     })
//     const [isEditing, setIsEditing] = React.useState(false)

//     // --- PAGINATION CONFIGURATION ---
//     const ITEMS_PER_PAGE = 5
//     const [currentPage, setCurrentPage] = React.useState(1)
//     const totalPages = Math.ceil(chunks.length / ITEMS_PER_PAGE)

//     // --- PDF VIEWING STATE ---
//     const [activeFile, setActiveFile] = React.useState<string | null>(null)
//     const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)

//     // --- 1. INITIAL LOAD: Fetch Agents ---
//     React.useEffect(() => {
//         let mounted = true;
//         const loadAgents = async () => {
//         // Pass constants to the API call
//         const data = await fetchAllAgents(ORG_ID, ORG_USER_ID);
//         if (mounted) setAgentsList(data);
//         };
//         loadAgents();
//         return () => { mounted = false };
//     }, [ORG_ID, ORG_USER_ID]);

//     // --- HANDLERS ---

//     // 1. Agent Selected -> Fetch Projects
//     const handleAgentChange = async (val: string) => {
//         setAgentId(val);
//         // Reset downstream selections
//         setProjectId("");
//         setDocId("");
//         setProjectsList([]);
//         setDocsList([]);

//         if (val) {
//         const data = await fetchProjects(ORG_ID, ORG_USER_ID, val);
//         setProjectsList(data);
//         }
//     }

//     // 2. Project Selected -> Fetch Docs
//     const handleProjectChange = async (val: string) => {
//         setProjectId(val);
//         // Reset downstream selections
//         setDocId("");
//         setDocsList([]);

//         if (val) {
//         const data = await fetchDocs(ORG_ID, val);
//         setDocsList(data);
//         }
//     }

//     // 3. Reset Button
//     const handleReset = () => {
//         setChunks([])
//         setExecutedCmd("")
//         setAgentId("")
//         setProjectId("")
//         setDocId("")
//         // Clear dependent dropdown lists
//         setProjectsList([]) 
//         setDocsList([])
//         setActiveFile(null)
//         setIsSidebarCollapsed(false)
//         setIsEditing(false)
//         setCurrentPage(1)
//     }

//     // 4. File Viewers
//     const handleOpenFile = (fileName: string) => {
//         setActiveFile(fileName)
//         setIsSidebarCollapsed(true)
//     }

//     const handleCloseFile = () => {
//         setActiveFile(null)
//         setIsSidebarCollapsed(false)
//     }

//     // Helpers
//     const getAgentName = () => agentsList.find((a) => a.id === agentId)?.name || ""
//     const getProjectName = () => projectsList.find((p) => p.id === projectId)?.name || ""
//     const sanitize = (str: string) => str.toLowerCase().replaceAll(" ", "_")

//     // 5. Run Knowledge Base Extraction
//     const handleRunKBase = () => {
//         setLoading(true)
//         setCurrentPage(1)
//         setChunks([])
//         setExecutedCmd("")

//         const meta = {
//         agent: getAgentName(),
//         project: getProjectName(),
//         doc: docId, // You might want to map docId to docName if needed for display
//         }
//         setExecutionMetadata(meta)

//         const draftCmd = `${sanitize(meta.agent)}@${sanitize(meta.project)}:${sanitize(meta.doc)}`

//         // MOCK API CALL: Replace this timeout with your real chunk fetching API
//         setTimeout(() => {
//         setChunks(MOCK_KB_CHUNKS)
//         setExecutedCmd(draftCmd)
//         setLoading(false)
//         }, 1200)
//     }

//     const isFileOpen = !!activeFile;
//     const radiusClass = isFileOpen ? "rounded-r-none" : "rounded-r-sm";

//     return (
//         <div className="flex h-[80vh] w-full overflow-hidden rounded-sm bg-background shadow-sm relative transition-all duration-300">

//         {/* 1. SIDEBAR (Left) */}
//         <KBSidebar
//             // Pass Data
//             agents={agentsList}
//             projects={projectsList}
//             docs={docsList}
            
//             // Pass Selection State
//             agentId={agentId}
//             projectId={projectId}
//             docId={docId}
            
//             // Pass UI State
//             loading={loading}
//             collapsed={isSidebarCollapsed}
            
//             // Pass Handlers
//             onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
//             onAgentChange={handleAgentChange}
//             onProjectChange={handleProjectChange}
//             onDocChange={setDocId}
//             onRun={handleRunKBase}
//         />

//         {/* 2. TERMINAL (Middle) */}
//         <div 
//             className={`
//             flex-1 min-w-0 flex flex-col h-full transition-all duration-300 
//             ${radiusClass} 
//             ${isEditing 
//                 ? "border border-amber-400 z-10 rounded-e-sm" 
//                 : "border-y border-r border-slate-200 rounded-e-sm"
//             }
//             `}
//         >
//             <KBTerminal
//             loading={loading}
//             chunks={chunks}
//             executedCmd={executedCmd}
//             metadata={executionMetadata}
//             onReset={handleReset}
//             onOpenFile={handleOpenFile}
//             onEditModeChange={setIsEditing}
//             isFileOpen={isFileOpen}
//             // Pagination
//             itemsPerPage={ITEMS_PER_PAGE}
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={setCurrentPage}
//             />
//         </div>

//         {/* 3. PDF VIEWER (Right) */}
//         {activeFile && (
//             <PdfViewer
//             key={activeFile}
//             file={activeFile}
//             page={1}
//             onClose={handleCloseFile}
//             />
//         )}
//         </div>
//     )
// }


// // mock data wala code
"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { KBSidebar } from "./kb-sidebar"
import { KBTerminal, KBChunk } from "./kb-terminal"

// Dynamic Import for PDF Viewer to avoid SSR issues
const PdfViewer = dynamic(
  () => import("@/components/registry/kbase/kb-pdf-viewer"),
  { ssr: false }
)

/* ------------------------------------------------------------------ */
/* MOCK DATA */
/* ------------------------------------------------------------------ */

interface Option {
  id: string
  name: string
}

const MOCK_AGENTS: Option[] = [
  { id: "agent_1", name: "HR Assistant" },
  { id: "agent_2", name: "Finance Bot" },
  { id: "agent_3", name: "Legal Advisor" },
]

const MOCK_PROJECTS: Record<string, Option[]> = {
  agent_1: [
    { id: "hr_proj_1", name: "Employee Handbook" },
    { id: "hr_proj_2", name: "HR Policies" },
  ],
  agent_2: [
    { id: "fin_proj_1", name: "Invoices" },
    { id: "fin_proj_2", name: "Budget Reports" },
  ],
  agent_3: [
    { id: "legal_proj_1", name: "Contracts" },
  ],
}

const MOCK_DOCS: Record<string, Option[]> = {
  hr_proj_1: [
    { id: "handbook.pdf", name: "Employee_Handbook.pdf" },
    { id: "leave_policy.pdf", name: "Leave_Policy.pdf" },
  ],
  hr_proj_2: [
    { id: "hr_rules.pdf", name: "HR_Rules.pdf" },
  ],
  fin_proj_1: [
    { id: "invoice_jan.pdf", name: "Invoices_Jan.pdf" },
  ],
  fin_proj_2: [
    { id: "budget_2024.pdf", name: "Budget_2024.pdf" },
  ],
  legal_proj_1: [
    { id: "nda.pdf", name: "NDA.pdf" },
  ],
}

// Mock chunks
const MOCK_KB_CHUNKS: KBChunk[] = Array.from({ length: 18 }).map((_, i) => ({
  id: i + 1,
  charsNoSpace: 120,
  charsWithSpace: 135,
  source: "mock_document.pdf",
  content: `Chunk ${i + 1}: This is mock KB content generated locally.`,
}))

/* ------------------------------------------------------------------ */

export default function KBLayout() {
  /* -------------------- SELECTION STATE -------------------- */
  const [agentId, setAgentId] = React.useState("")
  const [projectId, setProjectId] = React.useState("")
  const [docId, setDocId] = React.useState("")

  /* -------------------- DATA STATE -------------------- */
  const [agentsList] = React.useState<Option[]>(MOCK_AGENTS)
  const [projectsList, setProjectsList] = React.useState<Option[]>([])
  const [docsList, setDocsList] = React.useState<Option[]>([])

  /* -------------------- UI STATE -------------------- */
  const [loading, setLoading] = React.useState(false)
  const [chunks, setChunks] = React.useState<KBChunk[]>([])
  const [executedCmd, setExecutedCmd] = React.useState("")
  const [executionMetadata, setExecutionMetadata] = React.useState({
    agent: "",
    project: "",
    doc: "",
  })
  const [isEditing, setIsEditing] = React.useState(false)

  /* -------------------- PAGINATION -------------------- */
  const ITEMS_PER_PAGE = 5
  const [currentPage, setCurrentPage] = React.useState(1)
  const totalPages = Math.ceil(chunks.length / ITEMS_PER_PAGE)

  /* -------------------- PDF VIEW -------------------- */
  const [activeFile, setActiveFile] = React.useState<string | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)

  /* ------------------------------------------------------------------ */
  /* HANDLERS */
  /* ------------------------------------------------------------------ */

  const handleAgentChange = (val: string) => {
    setAgentId(val)
    setProjectId("")
    setDocId("")
    setProjectsList(MOCK_PROJECTS[val] || [])
    setDocsList([])
  }

  const handleProjectChange = (val: string) => {
    setProjectId(val)
    setDocId("")
    setDocsList(MOCK_DOCS[val] || [])
  }

  const handleReset = () => {
    setChunks([])
    setExecutedCmd("")
    setAgentId("")
    setProjectId("")
    setDocId("")
    setProjectsList([])
    setDocsList([])
    setActiveFile(null)
    setIsSidebarCollapsed(false)
    setIsEditing(false)
    setCurrentPage(1)
  }

  const handleOpenFile = (fileName: string) => {
    setActiveFile(fileName)
    setIsSidebarCollapsed(true)
  }

  const handleCloseFile = () => {
    setActiveFile(null)
    setIsSidebarCollapsed(false)
  }

  const getAgentName = () =>
    agentsList.find((a) => a.id === agentId)?.name || ""

  const getProjectName = () =>
    projectsList.find((p) => p.id === projectId)?.name || ""

  const getDocName = () =>
    docsList.find((d) => d.id === docId)?.name || ""

  const sanitize = (str: string) =>
    str.toLowerCase().replaceAll(" ", "_")

  const handleRunKBase = () => {
    setLoading(true)
    setCurrentPage(1)
    setChunks([])
    setExecutedCmd("")

    const meta = {
      agent: getAgentName(),
      project: getProjectName(),
      doc: getDocName(),
    }
    setExecutionMetadata(meta)

    const cmd = `${sanitize(meta.agent)}@${sanitize(meta.project)}:${sanitize(meta.doc)}`

    setTimeout(() => {
      setChunks(MOCK_KB_CHUNKS)
      setExecutedCmd(cmd)
      setLoading(false)
    }, 1000)
  }

  const isFileOpen = !!activeFile
  const radiusClass = isFileOpen ? "rounded-r-none" : "rounded-r-sm"

  /* ------------------------------------------------------------------ */

  return (
    <div className="flex h-[80vh] w-full overflow-hidden rounded-sm bg-background shadow-sm relative transition-all">

      {/* SIDEBAR */}
      <KBSidebar
        agents={agentsList}
        projects={projectsList}
        docs={docsList}
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

      {/* TERMINAL */}
      <div
        className={`flex-1 min-w-0 flex flex-col h-full transition-all
        ${radiusClass}
        ${isEditing
          ? "border border-amber-400"
          : "border-y border-r border-slate-200"}`}
      >
        <KBTerminal
          loading={loading}
          chunks={chunks}
          executedCmd={executedCmd}
          metadata={executionMetadata}
          onReset={handleReset}
          onOpenFile={handleOpenFile}
          onEditModeChange={setIsEditing}
          isFileOpen={isFileOpen}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* PDF VIEWER */}
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
