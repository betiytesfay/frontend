export const BASE_URL = "https://gibi-backend-669108940571.us-central1.run.app";

export const apiClient = async (endpoint, options = {}) => {
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: options.credentials || "include",
  });

  if (!response.ok) {
    let errorBody = "";
    try {
      errorBody = await response.text();
    } catch (e) {
      errorBody = "<unreadable response>";
    }
    throw new Error(`HTTP ${response.status}: ${errorBody}`);
  }

  try {
    return await response.json();
  } catch (e) {
    return null;
  }
};
