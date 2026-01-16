export const maskApiKey = (key: string) =>
  key.length > 8
    ? `${key.slice(0, 3)}-****-${key.slice(-4)}`
    : "****"
