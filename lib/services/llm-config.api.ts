import {axiosInstance} from "./api";
import { LLMConfigAPIResponse, LLMConfiguration } from "./types/llm-config.types";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;


// export const fetchLLMConfig = async (org_id: number, org_user_id: number, org_user_name: string) => {
export const fetchLLMConfig = async () => {

    try {
        const response = await axiosInstance.post(
            `${API_URL}/admin_screen/org/llm-storage-config`,
            { org_id: 1, org_user_id : 1, org_user_name: "Subodh Pataki" },
            { headers: { "Content-Type": "application/json" } }
        )
        return response.data
    } catch (error) {
        throw error
}
}
// export const fetchLLMConfig1 = async (): Promise<LLMConfigAPIResponse> => {
//   const response = await axios.post(`${API_URL}/admin_screen/org/llm-storage-config`, {
//     headers: {
//       Accept: "application/json",
//     },
//     timeout: 300000,
//   });
//   return response.data;
// };

export const saveLLMConfig = async (
  org_id: number,
  config: { llm_configurations: LLMConfiguration[] }
) => {
  const response = await axiosInstance.post(
    `${API_URL}/admin_screen/org/llm-storage-config`,
    { org_id: 1, org_user_id : 1, org_user_name: "Subodh Pataki" },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 300000,
    }
  );
  return response.data;
};
