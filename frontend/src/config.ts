// Default to local backend during development; VITE_API_URL can override this in prod/deploy
// Default to local backend during development. Use `VITE_API_URL` to override in env.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
