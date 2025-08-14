# Deployment Guide - Advance Dashboard VMS

## Overview
This React component is designed to be integrated into an existing PHP Laravel VMS website. It provides an advanced dashboard that can work both locally (with login) and in production (without login).

## Configuration

### File: `src/config.ts`
This is the main configuration file. Change the `ENVIRONMENT` variable to switch between modes:

```typescript
export const ENVIRONMENT = 'local'; // 'local' | 'production'
```

## Local Development Mode

### Setup Steps:
1. **Set Environment**: In `src/config.ts`, set `ENVIRONMENT = 'local'`
2. **Install CORS Anywhere**: `npm install -g cors-anywhere`
3. **Start CORS Anywhere**: Run `cors-anywhere` in a separate terminal
4. **Start React App**: `npm run dev`

### What Happens:
- ✅ Login page is shown
- ✅ CORS proxy is used (`http://localhost:8080/`)
- ✅ You can test login functionality
- ✅ All API calls go through the proxy

## Production Mode

### Setup Steps:
1. **Set Environment**: In `src/config.ts`, set `ENVIRONMENT = 'production'`
2. **Build the App**: `npm run build`
3. **Deploy**: Copy the `dist` folder to your VMS server

### What Happens:
- ❌ Login page is hidden
- ❌ No CORS proxy needed
- ✅ Goes directly to dashboard
- ✅ Uses tokens from VMS system via `getToken()` API

## API Integration

### Token Management
The component uses the `getToken()` API from your VMS system:
```
https://kanishkacrm.com/ksplvms_uat/public/api/v1/getToken
```

### Authentication Flow
1. **Local**: User logs in → gets token → accesses dashboard
2. **Production**: Component gets token from VMS → accesses dashboard directly

## File Structure
```
src/
├── config.ts          # Environment configuration
├── api.ts            # API functions (uses config)
├── App.tsx           # Main app (uses config)
├── components/
│   ├── Login.tsx     # Login component (hidden in production)
│   └── Dashboard.tsx # Main dashboard component
```

## Switching Between Modes

### To Local Development:
```typescript
// In src/config.ts
export const ENVIRONMENT = 'local';
```

### To Production:
```typescript
// In src/config.ts
export const ENVIRONMENT = 'production';
```

## Important Notes

1. **Login Component**: The `Login.tsx` component is completely hidden in production mode
2. **CORS Proxy**: Only used in local development, not in production
3. **Token Storage**: Tokens are stored in localStorage for session management
4. **API Calls**: All API calls automatically use the correct configuration

## Troubleshooting

### Local Development Issues:
- Ensure CORS Anywhere is running on port 8080
- Check that `ENVIRONMENT = 'local'` in config.ts
- Verify all API endpoints are accessible through the proxy

### Production Issues:
- Ensure `ENVIRONMENT = 'production'` in config.ts
- Verify the `getToken` API is accessible from your server
- Check that all VMS API endpoints are accessible

## Deployment Checklist

Before deploying to production:
- [ ] Set `ENVIRONMENT = 'production'` in `src/config.ts`
- [ ] Test that `getToken()` API returns valid tokens
- [ ] Build the app with `npm run build`
- [ ] Copy `dist` folder to your VMS server
- [ ] Verify dashboard loads without login page
- [ ] Test all dashboard functionality
