export interface LLMConfiguration {
  llm_name?: unknown;
  llm_model?: unknown;
  llm_api_key?: unknown;
  llm_logo_url?: unknown;
}

export interface LLMConfigAPIResponse {
  status: string;
  message: string;
  org_id: number;
  config: {
    llm_configurations: LLMConfiguration[];
  };
}
