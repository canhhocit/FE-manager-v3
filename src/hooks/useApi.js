import { useCallback } from "react";

const BASE_GATEWAY = "http://localhost:8888";

const getUrl = (path) => {
  if (path.startsWith("/identity") || path.startsWith("/notifications") || path.startsWith("/event-mng")) {
    return `${BASE_GATEWAY}${path}`;
  }
  return `${BASE_GATEWAY}/event-mng${path}`;
};

export const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return getUrl(url.startsWith("/") ? url : `/${url}`);
};

// export const getImageUrl = (url) => {
//     if (!url) return "";
//     if (url.startsWith("http")) {
//         // Thay localhost bằng IP thực của server
//         return url.replace(
//             "http://localhost:8080",
//             "http://192.168.0.110:8080",
//         );
//     }
//     return `${BASE}${url.startsWith("/") ? "" : "/"}${url}`;
// };


export function useApi() {
  const rawToken = localStorage.getItem("token");
  const token = (rawToken && rawToken !== "null" && rawToken !== "undefined") ? rawToken : null;

  const get = useCallback(
    (path) =>
      fetch(getUrl(path), {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      }).then((r) => r.json()),
    [token]
  );

  const post = useCallback(
    (path, body) => {
      const isFormData = body instanceof FormData;
      return fetch(getUrl(path), {
        method: "POST",
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: isFormData ? body : JSON.stringify(body),
      }).then((r) => r.json());
    },
    [token]
  );

  const put = useCallback(
    (path, body) => {
      const isFormData = body instanceof FormData;
      return fetch(getUrl(path), {
        method: "PUT",
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: isFormData ? body : JSON.stringify(body),
      }).then((r) => r.json());
    },
    [token]
  );

  const patch = useCallback(
    (path) =>
      fetch(getUrl(path), {
        method: "PATCH",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      }).then((r) => r.json()),
    [token]
  );

  const del = useCallback(
    (path) =>
      fetch(getUrl(path), {
        method: "DELETE",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      }).then((r) => r.json()),
    [token]
  );

  return { get, post, put, patch, del };
}