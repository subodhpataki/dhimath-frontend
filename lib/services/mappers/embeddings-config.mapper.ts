import { EmbeddingsConfiguration } from "../types/embeddings-config.types";
import { EmbeddingRow } from "@/components/registry/org-admin/embeddings-config-table";

export const mapEmbeddingsConfigurationsToEmbeddingRows = (
  configs: EmbeddingsConfiguration[]
): EmbeddingRow[] => {
  return configs.map((config, index) => ({
    id: `embedding_${index}`,
    provider: "Unknown", // Default value since not in API
    model: config.model,
    apiEndpoint: config.api_endpoint,
    apiKeyMasked: config.api_key,
    apiSecretMasked: config.api_secret,
    apiVersion: config.api_version,
    maxTokens: config.max_tokens,
    logoUrl: null, // Default value
    createdAt: new Date().toISOString(), 
  }));
};

export const mapEmbeddingRowToEmbeddingsConfiguration = (
  row: EmbeddingRow
): EmbeddingsConfiguration => ({
  model: row.model,
  api_endpoint: row.apiEndpoint,
  api_key: row.apiKeyMasked,
  api_secret: row.apiSecretMasked,
  api_version: row.apiVersion,
  max_tokens: row.maxTokens,
});

export const getEmbeddingFieldLabel = (key: string): string => {
  const labels: Record<string, string> = {
    model: "Model",
    api_endpoint: "API Endpoint",
    api_key: "API Key",
    api_secret: "API Secret",
    api_version: "API Version",
    max_tokens: "Max Tokens",
  };
  return labels[key] || key;
};
