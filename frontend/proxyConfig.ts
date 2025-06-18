// proxyConfig.ts
export const proxyConfig = {
  "/tasks": "http://backend:8000",
  "/auth": "http://backend:8000",
  "/users": "http://backend:8000",
  "/db": "http://backend:8000",
  // добавь другие префиксы, если появятся
};
