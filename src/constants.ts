
export const isDevelopment = import.meta.env.DEV
export const BASE_URL = isDevelopment ? "http://localhost:3001" : "https://casefiles.com"
export const BASE_API_URL = isDevelopment ? "http://localhost:3000/api" : "https://casefiles.com/api"
export const BASE_WS_URL = isDevelopment ? "ws://localhost:3000/ws" : "wss://casefiles.com/ws"
