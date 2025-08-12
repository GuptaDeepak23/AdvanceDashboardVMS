const proxyUrl = "http://localhost:8080/";
const baseUrl = "https://kanishkacrm.com/ksplvms_uat/public/api/v1/";
const tokenUrl = `https://kanishkacrm.com/ksplvms_uat/public/getToken`;


interface ApiResponse {
  token?: string;
  [key: string]: any;
}

export const fetchWithToken = async (endpoint: string): Promise<ApiResponse> => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${proxyUrl}${baseUrl}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
console.log(response);
  return await response.json();
};



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








//getToken api



