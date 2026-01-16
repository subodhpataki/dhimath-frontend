import { showToast } from "@/lib/toast";



// Save for create user
export function createUser(): boolean {
  showToast("success", "User created successfully!");

  return true
}

export function llmConfigSaveBtn(): boolean {
  showToast("success", "LLM created successfully!");

  return true 
}

export function embeddingSaveBtn(): boolean {
  showToast("success", "Embeddings created successfully!");

  return true
}

export function storageConnectionSaveBtn(): boolean {
  showToast("success", "Storage created  successfully!");

  return true
}
