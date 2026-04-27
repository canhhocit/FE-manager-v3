import api from "../api/api";

export const useApi = () => {
  const get = (url, params) => api.get(url, { params });
  const post = (url, data) => api.post(url, data);
  const put = (url, data) => api.put(url, data);
  const del = (url) => api.delete(url);

  return { get, post, put, del };
};

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  // Trỏ về đường dẫn lấy ảnh của backend (chuẩn Microservices)
  return `http://localhost:8080/images/${path}`;
};