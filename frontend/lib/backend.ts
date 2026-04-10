const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000/api";

export async function getBackendHealth() {
  const response = await fetch(`${backendBaseUrl}/health`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Backend health request failed");
  }

  return response.json();
}
