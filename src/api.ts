import { currentConfig } from './config';

// ===== CONFIGURATION =====
// Configuration is now managed in src/config.ts
// To switch environments, change ENVIRONMENT in config.ts
const { proxyUrl, baseUrl, tokenUrl } = currentConfig;

// ===== LOCAL DEVELOPMENT SETUP =====
// To run locally:
// 1. In src/config.ts, set ENVIRONMENT = 'local'
// 2. Install cors-anywhere: npm install -g cors-anywhere
// 3. Start cors-anywhere: cors-anywhere
// 4. Run your React app: npm run dev

interface ApiResponse {
  token?: string;
  [key: string]: any;
}

export const fetchWithToken = async (endpoint: string): Promise<ApiResponse> => {
  const token = localStorage.getItem("token");
  
  // Debug logging
  console.log('=== API CALL DEBUG ===');
  console.log('Endpoint:', endpoint);
  console.log('Token exists:', !!token);
  console.log('Token length:', token ? token.length : 'N/A');
  console.log('Token value:', token);
  console.log('Full URL:', `${proxyUrl}${baseUrl}${endpoint}`);
  console.log('Authorization header:', `Bearer ${token}`);
  console.log('All headers:', {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  });
  console.log('=====================');

  const response = await fetch(`${proxyUrl}${baseUrl}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  console.log('Response status:', response.status);
  console.log('Response headers:', response.headers);
  
  return await response.json();
};

// ===== AUTHENTICATION =====
// For LOCAL DEVELOPMENT: Keep this function to test login functionality
export const loginUser = async (email: string, password: string): Promise<ApiResponse> => {
  const response = await fetch(`${proxyUrl}${baseUrl}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  return await response.json();
};

// ===== TOKEN MANAGEMENT =====
// This function gets the token from VMS system - use this in production
export const getToken = async (): Promise<ApiResponse> => {
  // Direct call to VMS API - no proxy needed for token retrieval
  // Add headers to mimic external request (like Postman)
  const response = await fetch(tokenUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  });
  console.log('getToken response:', response);
  return await response.json();
};

// ===== API ENDPOINTS =====
// fetch stat card data
export const fetchStatCardData = async (filterType: string): Promise<ApiResponse> => {
  const endpoint = `count-for-current-date?filter_type=${filterType}`;
  return await fetchWithToken(endpoint);
}; 

// Pending_checkout api
export const pending_checkout = async(filterType: string): Promise<ApiResponse> => {
  const endpoint = `not-checkout-visitor?filter_type=${filterType}`;
  return await fetchWithToken(endpoint);
};

//visit_by_department api
export const visit_by_department = async(filterType: string): Promise<ApiResponse> => {
  const endpoint = `visitor-by-department?filter_type=${filterType}`;
  return await fetchWithToken(endpoint);
};

//expected_visitor api
export const expected_visitor = async(filterType: string): Promise<ApiResponse> => {
  const endpoint = `today-pre-registers?filter_type=${filterType}`;
  return await fetchWithToken(endpoint);
};

//checkin_by_intervals api
export const checkin_by_intervals = async(filterType: string): Promise<ApiResponse> => {
  const endpoint = `checkins-by-intervals?filter_type=${filterType}`;
  return await fetchWithToken(endpoint);
};

//purpose_of_visit api
export const purpose_of_visit = async(filterType: string): Promise<ApiResponse> => {  
  const endpoint = `purpose-of-visits?filter_type=${filterType}`;
  return await fetchWithToken(endpoint);
};

//visitor_trend api
export const visitor_trend = async(): Promise<ApiResponse> => {  
  const endpoint = `get-visitor-summary`;
  return await fetchWithToken(endpoint);
};

// Check-in difference trend API
export const getCheckinDifferenceTrend = async (): Promise<ApiResponse> => {
  const endpoint = `get-checkin-difference-trend`;
  return await fetchWithToken(endpoint);
};

// Pre-register completion API
export const getPreRegisterCompletion = async (filterType: string): Promise<ApiResponse> => {
  const endpoint = `pre-register-completion/?filter_type=${filterType}`;
  return await fetchWithToken(endpoint);
};

// Incomplete checkouts API
export const getIncompleteCheckouts = async (filterType: string): Promise<ApiResponse> => {
  const endpoint = `get-incomplete-checkouts/?filter_type=${filterType}`;
  return await fetchWithToken(endpoint);
};

// Pre-register difference trend API
export const getPreRegisterDifferenceTrend = async (): Promise<ApiResponse> => {
  const endpoint = `get-pre-register-difference-trend`;
  return await fetchWithToken(endpoint);
};








//getToken api


