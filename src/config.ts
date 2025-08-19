// ===== ENVIRONMENT CONFIGURATION =====
// Change this variable to switch between environments
export const ENVIRONMENT: 'local' | 'production' = 'local';

// Configuration object
export const config = {
  local: {
    showLoginPage: true,
    proxyUrl: "http://localhost:8080/",
    baseUrl: "https://kanishkacrm.com/ksplvms_uat/public/api/v1/",
    tokenUrl: "https://kanishkacrm.com/ksplvms_uat/public/getToken",
    useProxy: true
  },
  production: {
    showLoginPage: false,
    proxyUrl: "",
    baseUrl: "https://kanishkacrm.com/ksplvms_uat/public/api/v1/",
    tokenUrl: "https://kanishkacrm.com/ksplvms_uat/public/getToken",
    useProxy: false
  }
};

// Current configuration
export const currentConfig = config[ENVIRONMENT];
