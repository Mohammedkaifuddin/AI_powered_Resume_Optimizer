// Base URL of our Express backend.
const API_URL = "http://localhost:5000";

// This function sends requests to our backend.
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
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

  // If we have a JWT, attach it to the request.
  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  // Send the request to our Express backend.
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  // Convert backend response to JSON.
  const data = await response.json();

  // If backend returned an error status,
  // throw an error so the frontend can handle it.
  if (!response.ok) {
    throw new Error(
      data.message || "Request failed"
    );
  }

  // Return the backend JSON data.
  return data;
};