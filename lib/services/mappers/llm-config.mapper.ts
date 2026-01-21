import { LLMConfiguration } from "../types/llm-config.types";
import { LLMRow } from "@/components/registry/org-admin/llm-config-table";

export const normalizeLogoUrl = (url: unknown): string | undefined => {
  if (typeof url === "string" && url.trim()) return url;
  return undefined;
};

export const getFieldLabel = (key: string): string => {
  return key
    .replace("llm_", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};

export const mapLLMConfigurationToLLMRow = (
  config: LLMConfiguration,
  index: number
): Omit<LLMRow, "id"> => {
  return {
    name: (config.llm_name as string) || "",
    model: (config.llm_model as string) || "",
    apiKey: (config.llm_api_key as string) || "",
    logoUrl: normalizeLogoUrl(config.llm_logo_url),
    createdAt: new Date().toISOString(), // Generated on frontend
  };
};

export const mapLLMConfigurationsToLLMRows = (
  configs: LLMConfiguration[]
): LLMRow[] => {
  return configs.map((config, index) => ({
    ...mapLLMConfigurationToLLMRow(config, index),
    id: `llm_${index}`,
  }));
};

export const mapLLMRowToLLMConfiguration = (row: LLMRow): LLMConfiguration => {
  return {
    llm_name: row.name,
    llm_model: row.model,
    llm_api_key: row.apiKey,
    llm_logo_url: row.logoUrl || "",
  };
};
