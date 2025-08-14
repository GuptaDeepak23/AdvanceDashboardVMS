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
// This function gets the JWT token from VMS system via login API
// It will use the existing VMS session to get a fresh JWT token
export const getTokenViaLogin = async (): Promise<ApiResponse> => {
  console.log('🔐 Attempting to get JWT token via VMS login API...');
  
  try {
    // Call the VMS login API to get a fresh JWT token
    // This will use the existing VMS session/cookies
    const response = await fetch(`${baseUrl}login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      // Include credentials to send existing VMS session cookies
      credentials: 'include',
      mode: 'cors',
      // Send empty body since we're using existing session
      body: JSON.stringify({})
    });
    
    console.log('Login API response status:', response.status);
    console.log('Login API response headers:', response.headers);
    
    const responseData = await response.json();
    console.log('Login API raw response:', responseData);
    
    if (responseData.token) {
      // Verify this is a JWT token
      const isJWT = responseData.token.startsWith('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9');
      console.log('✅ Token received via login API!');
      console.log('Token type:', isJWT ? 'JWT Token' : 'Unknown Format');
      console.log('Token length:', responseData.token.length);
      
      if (isJWT) {
        console.log('🎯 Perfect! This JWT token will work with all protected APIs!');
      } else {
        console.warn('⚠️ Warning: Token received but not in JWT format');
      }
    } else {
      console.error('❌ No token in login response:', responseData);
    }
    
    return responseData;
  } catch (error) {
    console.error('❌ Login API call failed:', error);
    throw error;
  }
};

// Alternative approach: Get token from VMS system using existing session
// This function tries to get a JWT token using the current VMS session
export const getTokenFromSession = async (): Promise<ApiResponse> => {
  console.log('🔐 Attempting to get JWT token from existing VMS session...');
  
  try {
    // Try to get token using the current VMS session
    // This approach doesn't require credentials, just uses existing session
    const response = await fetch(tokenUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      // Include credentials to send existing VMS session cookies
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log('Session-based getToken response status:', response.status);
    console.log('Session-based getToken response headers:', response.headers);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    console.log('Session-based getToken raw response:', responseData);
    
    if (responseData.token) {
      const isJWT = responseData.token.startsWith('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9');
      console.log('✅ Token received via session!');
      console.log('Token type:', isJWT ? 'JWT Token' : 'Unknown Format');
      console.log('Token length:', responseData.token.length);
      
      if (isJWT) {
        console.log('🎯 Perfect! This JWT token will work with all protected APIs!');
      } else {
        console.warn('⚠️ Warning: Token received but not in JWT format');
      }
    } else {
      console.error('❌ No token in session response:', responseData);
    }
    
    return responseData;
  } catch (error) {
    console.error('❌ Session-based getToken failed:', error);
    throw error;
  }
};

// This function gets the token from VMS system - use this in production
export const getToken = async (): Promise<ApiResponse> => {
  // Since login API requires credentials, prioritize session-based approach
  
  // Approach 1: Try session-based getToken first (most likely to work)
  try {
    console.log('🔄 Trying session-based getToken approach...');
    return await getTokenFromSession();
  } catch (sessionError) {
    console.log('⚠️ Session-based approach failed, trying login API...');
    
    // Approach 2: Try login API (but this requires credentials)
    try {
      return await getTokenViaLogin();
    } catch (loginError) {
      console.log('⚠️ Login API failed, trying fallback getToken API...');
      
      // Approach 3: Last resort - original getToken API with aggressive headers
      const response = await fetch(tokenUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          'Origin': 'https://postman.com',
          'Referer': 'https://postman.com/',
          'DNT': '1',
          'Connection': 'keep-alive'
        },
        mode: 'cors',
        credentials: 'omit'
      });
      
      console.log('Fallback getToken API response status:', response.status);
      console.log('Fallback getToken API response headers:', response.headers);
      
      const responseData = await response.json();
      console.log('Fallback getToken API raw response:', responseData);
      
      return responseData;
    }
  }
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


