const BASE = "http://localhost:8888";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const authHeader = (token && token !== "null" && token !== "undefined") ? `Bearer ${token}` : "";
  
  const getUrl = (p) => {
    if (p.startsWith("/identity") || p.startsWith("/notifications") || p.startsWith("/event-mng")) {
      return `${BASE}${p}`;
    }
    return `${BASE}/event-mng${p}`;
  };

  const res = await fetch(getUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
      ...options.headers,
    },
  });
  
  if (res.status === 401) {
    // Optionally handle logout or token refresh
  }

  return res.json();
}

export const API_BASE = BASE;
