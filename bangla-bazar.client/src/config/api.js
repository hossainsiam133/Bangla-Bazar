// API Configuration
// Uses environment variables set in .env and .env.development files
export const API_BASE_URL = import.meta.env.VITE_API_URL;
export const SERVER_BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');

// Specific API endpoints
export const PRODUCT_API = `${API_BASE_URL}/product`;
export const ORDER_API = `${API_BASE_URL}/order`;
export const USER_API = `${API_BASE_URL}/user`;
export const AUTH_API = `${API_BASE_URL}/auth`;
export const MASSAGE_API = `${API_BASE_URL}/massage`;
export const UPLOAD_API = `${API_BASE_URL}/product/upload-image`;
