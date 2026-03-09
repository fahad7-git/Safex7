# Safex7 Deployment Guide

## Deploy Backend on Render.com (FREE)

### Step 1: Create Render Account
1. Go to **https://render.com**
2. Click **"Sign Up"** → Sign up with your **GitHub account**
3. Authorize Render to access your GitHub repositories

### Step 2: Deploy the Backend
1. Once logged in, click **"New +"** (top right)
2. Select **"Web Service"**
3. On the "Connect a repository" page:
   - Click **"GitHub"** 
   - Select your repository: **fahad7-git/Safex7**
4. Configure the settings:
   - **Name:** `safex7-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Python`
   - **Build Command:** *(leave empty)*
   - **Start Command:** `gunicorn app:app --workers 2 --timeout 120`
5. Click **"Create Web Service"**
6. **Wait 2-3 minutes** for deployment to complete

### Step 3: Get Your Backend URL
Once deployed, you'll see a URL like:
```
https://safex7-backend.onrender.com
```
**Copy this URL** - you'll need it for the frontend!

---

## Deploy Frontend on Netlify (FREE)

### Step 1: Create Netlify Account  
1. Go to **https://netlify.com**
2. Click **"Sign Up"** → Sign up with your **GitHub account**
3. Authorize Netlify to access your GitHub repositories

### Step 2: Deploy the Frontend
1. Click **"Add new site"** → **"Import an existing project"**
2. Click **"GitHub"** and select: **fahad7-git/Safex7**
3. Configure:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
4. Click **"Deploy site"**

### Step 3: Add Environment Variable (After Backend is deployed!)
1. Go to your Netlify site dashboard
2. Click **"Site settings"** → **"Environment variables"**
3. Click **"Add variable"**:
   - Key: `REACT_APP_API_URL`
   - Value: Your Render backend URL (e.g., `https://safex7-backend.onrender.com`)
4. Click **"Deploy"** → **"Deploy site"** to rebuild with the new URL

---

## Alternative: Deploy Both on Render

You can also deploy the **entire app** (frontend + backend together) on Render:

1. Create a new **"Web Service"** on Render
2. Select: **fahad7-git/Safex7**
3. Configure:
   - **Name:** `safex7`
   - **Root Directory:** *(leave empty - root)*
   - **Environment:** `Python`
   - **Build Command:** *(leave empty)*
   - **Start Command:** `gunicorn backend.app:app --workers 2 --timeout 120 --chdir backend`
4. Click **"Create Web Service"**

This deploys both frontend and backend on the same domain!

---

## Testing Your Deployment

After deployment, test your scanner:
1. Visit your Netlify/Render URL
2. Enter a URL to scan (e.g., `http://example.com`)
3. You should see the scan results

If you get a connection error, check:
- Backend is deployed and running on Render
- Frontend has the correct API URL set

---

## Need Help?

If you encounter issues:
1. Check Render/Netlify deployment logs
2. Verify your `requirements.txt` has all dependencies
3. Make sure the Start Command is correct

