import { axiosInstance } from "./api"; // Ensure this path matches your project structure

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

// --- Interfaces ---
export interface ApiAgent {
    agent_id: number;
    agent_name: string;
}

export interface ApiProject {
    project_id: number;
    project_name: string;
}

export interface ApiDoc {
    doc_id: number;
    doc_name: string;
    // Add other doc properties here if needed (e.g., file_type, url)
}

// --- 1. Fetch Agents ---
export const fetchAllAgents = async (org_id: number | string, org_user_id: number | string) => {
    try {
        const res = await axiosInstance.get(`${API_URL}/agent/agents-list`, {
        params: { org_id, org_user_id },
        });

        const data = res.data || [];
        
        // Map: Backend -> UI
        return data.map((item: ApiAgent) => ({
        id: String(item.agent_id),
        name: item.agent_name,
        }));
    } catch (error) {
        console.error("Error fetching agents:", error);
        return [];
    }
};

// --- 2. Fetch Projects ---
export const fetchProjects = async (
    org_id: number | string,
    org_user_id: number | string,
    agent_id?: number | string
    ) => {
    try {
        let url = `/quiz/projects-list?org_id=${org_id}&org_user_id=${org_user_id}`;
        
        if (agent_id) {
        url += `&agent_id=${agent_id}`;
        }

        // Use axiosInstance.post (Base URL is already handled by instance)
        const res = await axiosInstance.post(url, {});
        
        // Handle potential response structures (e.g., { projects: [...] } or direct array)
        const rawList = res.data?.projects || res.data || [];

        return rawList.map((item: ApiProject) => ({
        id: String(item.project_id),
        name: item.project_name,
        }));

    } catch (error) {
        console.error("Error fetching projects:", error);
        return []; 
    }
};

export const fetchProjectDetails = async (
    projectId: number,
    orgId: number,
    orgUserId: number,
    agentId?: number | string
    ) => {
    try {
        const payload: any = {
        project_id: projectId,
        org_id: orgId,
        org_user_id: orgUserId,
        };
        if (agentId !== undefined && agentId !== null) {
        payload.agent_id = agentId;
        }
        const res = await axiosInstance.post(
        `${API_URL}/quiz/project/project-details`,
        payload,
        { timeout: 5000 }
        );

        return res.data;
    } catch (error) {
        console.log("Backend not available, returning mock project details");
        return { success: false, error: "Backend not available" };
    }
};

// --- 3. Fetch Documents ---
export const fetchDocs = async (
    org_id: number | string, 
    project_id: number | string
    ) => {
    try {
        const url = `/quiz/docs-list?org_id=${org_id}&project_id=${project_id}`;
        
        const res = await axiosInstance.post(url, {});

        const rawList = res.data?.docs || res.data || [];

        return rawList.map((item: ApiDoc) => ({
        id: String(item.doc_id),
        name: item.doc_name,
        }));
    } catch (error) {
        console.error("Error fetching docs:", error);
        return [];
    }
};
