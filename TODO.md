# Safex7 Deployment & Mobile Fixes TODO

## Completed Fixes

### Frontend Fixes (Scan.jsx)
- Fixed critical backend URL issue in production mode
- The previous code was incorrectly returning only the frontend host in production
- Now properly uses REACT_APP_API_URL environment variable OR falls back to localhost:5000 for local development
- Added clearer error messages when API is not configured

### Backend Fixes (app.py)
- Added explicit CORS configuration for all origins
- Added /api/scan endpoint route for better compatibility
- Now both /scan and /api/scan endpoints work

### ML Model Fix (analyzer.py)
- Fixed ML model loading to use absolute paths
- Model now loads from multiple possible paths:
  1. backend/phishing_model.joblib (relative to scanner)
  2. phishing_model.joblib in scanner folder
  3. Falls back to relative path

## Plan Overview
Prepare the codebase for GitHub and Netlify deployment with mobile support.

## Tasks

### Phase 1: Environment Configuration
- [x] 1.1 Add environment variable support in package.json (homepage field for GitHub Pages/Netlify)
- [x] 1.2 Create _redirects file for Netlify SPA routing
- [x] 1.3 Update index.html for better mobile PWA support

### Phase 2: Backend URL Fix
- [x] 2.1 Update Scan.jsx to use environment variable for API URL
- [x] 2.2 Add fallback to current origin with /api proxy option

### Phase 3: Mobile Improvements
- [x] 3.1 Improve touch interactions in Scan.jsx (via viewport meta tag fixes)
- [x] 3.2 Add viewport meta tag fixes

### Phase 4: Build & Deploy Preparation
- [x] 4.1 Verify package.json scripts
- [x] 4.2 Test build process

### Phase 5: Netlify Deployment (Frontend Only)
- [x] 5.1 Frontend build is ready in frontend/build folder
- [x] 5.2 _redirects file configured for SPA routing
- [x] 5.3 Scan.jsx has environment-based API URL support

## Implementation Status
- [x] TODO Created
- [x] Package.json updated with homepage and proxy
- [x] _redirects created for Netlify
- [x] index.html updated with mobile PWA support
- [x] Scan.jsx updated with environment-based API URL
- [x] Build verified and working

## Deployment Instructions

### For Netlify (Frontend):
1. Go to https://netlify.com and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub and select this repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
5. Add environment variable:
   - Key: `REACT_APP_API_URL`
   - Value: Your backend URL (see below)
6. Click "Deploy site"

### For Backend Deployment (Render/Railway):
**Recommended: Render (Free tier)**
1. Go to https://render.com and sign up/login
2. Click "New" → "Web Service"
3. Connect your GitHub and select this repository
4. Settings:
   - Name: `safex7-backend`
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && python app.py`
   - Environment: `Python`
5. Click "Create Web Service"
6. Once deployed, copy the URL (e.g., https://safex7-backend.onrender.com)

### Connect Frontend to Backend:
1. After backend deployment, copy your backend URL
2. Go to Netlify dashboard → your site → Site settings → Environment variables
3. Add: `REACT_APP_API_URL` = your-backend-url
4. Trigger a new deploy

### For Local Development:
1. Backend: `cd backend && python app.py` (runs on port 5000)
2. Frontend: `cd frontend && npm start` (runs on port 3000)

