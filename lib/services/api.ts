import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_BASE_URL

export const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: "application/json",
    },
    timeout: 300000,
})

export const createOrg = async (payload: FormData) => {
    try {
        const response = await axiosInstance.post(
        "/admin_screen/org/create-org",
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
        )
        return response.data
    } catch (error: any) {
        throw error
    }
}

// Define the shape based on your endpoint description
export interface OrgLimitsPayload {
    org_id: number | string
    org_name: string
    org_user_id?: string | number
    max_users?: number
    max_agents?: number
    max_projects?: number
    max_docs_in_projects?: number
    max_docs_in_chat?: number
    max_number_of_roles?: number
    max_number_of_llm?: number
    chat_conversation_limit?: number
    max_user_device_logins?: number
}

export const setOrgLimits = async (payload: FormData) => {
    try {
        const response = await axiosInstance.post(
            "/admin_screen/org/org-configuration",
            payload,
            { headers: { "Content-Type": "multipart/form-data" } }
        )
        return response.data
    } catch (error) {
        throw error
}
}
