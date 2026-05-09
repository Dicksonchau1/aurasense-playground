// Set NEXT_PUBLIC_API_BASE_URL in your .env file to the NEPA backend base URL, e.g. http://localhost:8000
export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    // On client
    return process.env.NEXT_PUBLIC_API_BASE_URL || "";
  } else {
    // On server
    return process.env.NEXT_PUBLIC_API_BASE_URL || "";
  }
}
