import { axiosInstance } from "./api";
import { EmbeddingsConfigAPIResponse, EmbeddingsConfiguration } from "./types/embeddings-config.types";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchEmbeddingsConfig = async () => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/admin_screen/org/llm-storage-config`,
      { org_id: 1, org_user_id: 1, org_user_name: "Subodh Pataki" },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveEmbeddingsConfig = async (
  org_id: number,
  config: { embeddings_configurations: EmbeddingsConfiguration[] }
) => {
  const response = await axiosInstance.post(
    `${API_URL}/admin_screen/org/llm-storage-config`,
    { org_id: 1, org_user_id: 1, org_user_name: "Subodh Pataki" },
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

