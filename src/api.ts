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
// This function gets the JWT token from VMS system 
export const getToken = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch(tokenUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    
    
    if (responseData.token) {
      localStorage.setItem('token', responseData.token);
    }
    
    return responseData;
  } catch (error) {
    console.error('❌ getToken API failed:', error);
    throw error;
  }
};

// ===== API UTILITY FUNCTION =====
// Same pattern as Angular's fetchWithToken
export const fetchWithToken = async (endpoint: string, params: any = {}): Promise<ApiResponse> => {
  // Get token from localStorage (same as Angular)
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error('No token found. Please get a token first.');
  }

  // Build query parameters (same as Angular)
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key]) queryParams.append(key, params[key]);
  });

  // Build final URL (same as Angular)
  let finalUrl = '';
  if (queryParams.toString()) {
    finalUrl = `${proxyUrl}${baseUrl}${endpoint}?${queryParams.toString()}`;
  } else {
    finalUrl = `${proxyUrl}${baseUrl}${endpoint}`;
  }

  const response = await fetch(finalUrl, {
        headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return await response.json();
};

// ===== API ENDPOINTS =====
// fetch stat card data (same as Angular's getCardsCount)
export const fetchStatCardData = async (filterType: string, params?: {
  start_date?: string;
  end_date?: string;
}): Promise<ApiResponse> => {
  return await fetchWithToken('count-for-current-date', {
    filter_type: filterType,
    start_date: params?.start_date || '',
    end_date: params?.end_date || ''
  });
}; 

// Pending_checkout api (same as Angular's getNonCheckoutUsers)
export const pending_checkout = async(filterType: string, params?: {
  start_date?: string;
  end_date?: string;
}): Promise<ApiResponse> => {
  return await fetchWithToken('not-checkout-visitor', {
    filter_type: filterType,
    start_date: params?.start_date || '',
    end_date: params?.end_date || ''
  });
};

//visit_by_department api (same as Angular's getVisitsByDepartment)
export const visit_by_department = async(filterType: string, params?: {
  start_date?: string;
  end_date?: string;
}): Promise<ApiResponse> => {
  return await fetchWithToken('visitor-by-department', {
    filter_type: filterType,
    start_date: params?.start_date || '',
    end_date: params?.end_date || ''
  });
};

//expected_visitor api (same as Angular's getTodayPreRegisters)
export const expected_visitor = async(filterType: string, params?: {
  start_date?: string;
  end_date?: string;
}): Promise<ApiResponse> => {
  return await fetchWithToken('today-pre-registers', {
    filter_type: filterType,
    start_date: params?.start_date || '',
    end_date: params?.end_date || ''
  });
};

//checkin_by_intervals api (same as Angular's getVisitsCheckInTrend)
export const checkin_by_intervals = async(filterType: string, params?: {
  start_date?: string;
  end_date?: string;
}): Promise<ApiResponse> => {
  return await fetchWithToken('checkins-by-intervals', {
    filter_type: filterType,
    start_date: params?.start_date || '',
    end_date: params?.end_date || ''
  });
};

//purpose_of_visit api (same as Angular's getVisitsByPurpose)
export const purpose_of_visit = async(filterType: string, params?: {
  start_date?: string;
  end_date?: string;
}): Promise<ApiResponse> => {  
  return await fetchWithToken('purpose-of-visits', {
    filter_type: filterType,
    start_date: params?.start_date || '',
    end_date: params?.end_date || ''
  });
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
export const getPreRegisterCompletion = async (filterType: string, params?: {
  start_date?: string;
  end_date?: string;
}): Promise<ApiResponse> => {
  return await fetchWithToken('pre-register-completion/', {
    filter_type: filterType,
    start_date: params?.start_date || '',
    end_date: params?.end_date || ''
  });
};

// Incomplete checkouts API
export const getIncompleteCheckouts = async (filterType: string, params?: {
  start_date?: string;
  end_date?: string;
}): Promise<ApiResponse> => {
  return await fetchWithToken('get-incomplete-checkouts/', {
    filter_type: filterType,
    start_date: params?.start_date || '',
    end_date: params?.end_date || ''
  });
};

// Pre-register difference trend API
export const getPreRegisterDifferenceTrend = async (): Promise<ApiResponse> => {
  const endpoint = `get-pre-register-difference-trend`;
  return await fetchWithToken(endpoint);
};








//getToken api


