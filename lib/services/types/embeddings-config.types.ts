export interface EmbeddingsConfiguration {
  model: string;
  api_endpoint: string;
  api_key: string;
  api_secret: string;
  api_version: string;
  max_tokens: number;
}

export interface EmbeddingsConfigAPIResponse {
  status: string;
  message: string;
  org_id: number;
  config: {
    embeddings_configurations: EmbeddingsConfiguration[];
  };
}
