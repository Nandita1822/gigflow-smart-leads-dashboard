# GigFlow Deployment Guide

Deploy in this order:

1. MongoDB Atlas database
2. Render backend
3. Vercel frontend

## 1. MongoDB Atlas

1. Go to MongoDB Atlas and create a free cluster.
2. Create a database user with username and password.
3. In Network Access, allow access from `0.0.0.0/0` for simple deployment testing.
4. Copy the connection string.
5. Use database name `gigflow` in the URI.

Example:

```env
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/gigflow
```

## 2. Render Backend

Create a new Render Web Service from the GitHub repository.

Settings:

```text
Root Directory: backend
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
```

Environment variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=use-a-long-random-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-vercel-frontend-url.vercel.app
```

After deploy, test:

```text
https://your-render-app.onrender.com/health
```

Expected response:

```json
{
  "success": true,
  "message": "GigFlow API is healthy"
}
```

## 3. Vercel Frontend

Create a new Vercel project from the same GitHub repository.

Settings:

```text
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Environment variable:

```env
VITE_API_URL=https://your-render-app.onrender.com/api
```

After deploy, copy the Vercel frontend URL and update Render backend:

```env
CLIENT_URL=https://your-vercel-frontend-url.vercel.app
```

Redeploy the backend after changing `CLIENT_URL`.

## Final Test

1. Open the Vercel frontend URL.
2. Register the first user as Admin.
3. Create a lead.
4. Test filters and search.
5. Export CSV.
6. Toggle dark mode.

## Submission Links

Use these in the assignment email:

```text
GitHub Repository:
https://github.com/Nandita1822/gigflow-smart-leads-dashboard

Live Frontend:
https://your-vercel-frontend-url.vercel.app

Live Backend:
https://your-render-app.onrender.com

Demo Recording:
https://www.loom.com/share/your-video-id
```
