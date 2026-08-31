// Base URL of our Express backend.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Custom error that keeps the HTTP status.
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// This function sends requests to our backend.
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
) => {
  // Get the JWT stored during login.
  const token = sessionStorage.getItem("token");

  // Create headers for the request.
  const headers = new Headers(options.headers);

  // Tell Express that we're sending JSON
  // when the request has a JSON body.
  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  // Attach JWT to protected requests.
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  console.log("API REQUEST:", `${API_URL}${endpoint}`);

  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    console.error("Network error:", error);

    throw new ApiError("Unable to connect to the backend.", 0);
  }

  console.log("API status:", response.status, response.statusText);

  // Read response as text first.
  const text = await response.text();

  console.log("API Response:", text.substring(0, 300));

  // Try to parse JSON.
  let data: any;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new ApiError(
      `Backend returned non-JSON response from ${endpoint}`,
      response.status,
    );
  }

  // Handle HTTP errors.
  if (!response.ok) {
    throw new ApiError(
      data.message || `Request failed with status ${response.status}`,
      response.status,
    );
  }

  return data;
};
