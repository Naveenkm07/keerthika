# Vercel Deployment Guide

## Quick Deploy via GitHub (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com
2. **Sign in** with your GitHub account
3. **Click "Add New Project"**
4. **Import Repository**: Select `Naveenkm07/keerthika`
5. **Configure Project**:
   - Framework Preset: Other
   - Root Directory: `./`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
6. **Add Environment Variables**:
   - `FLASK_SECRET_KEY` = (generate a random string)
   - `DB_HOST` = caboose.proxy.rlwy.net (or your database host)
   - `DB_PORT` = 42310 (or your database port)
   - `DB_USER` = root (or your database user)
   - `DB_PASSWORD` = (your database password)
   - `DB_NAME` = railway (or your database name)
7. **Click "Deploy"**

## Deploy via CLI

1. **Login to Vercel**:
   ```bash
   vercel login
   ```
   (This will open a browser for authentication)

2. **Link Project**:
   ```bash
   vercel link
   ```

3. **Add Environment Variables**:
   ```bash
   vercel env add FLASK_SECRET_KEY
   vercel env add DB_HOST
   vercel env add DB_PORT
   vercel env add DB_USER
   vercel env add DB_PASSWORD
   vercel env add DB_NAME
   ```

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

## Important Notes

- The project uses **offline authentication** (localStorage), so database is optional
- If you don't need database features, you can skip DB environment variables
- The ML model files (`model.pkl`, `vectorizer.pkl`) are included in the deployment
- Static files are automatically served via Vercel's CDN

## Troubleshooting

- **404 Error**: Make sure the deployment completed successfully
- **Build Errors**: Check that all dependencies are in `requirements.txt`
- **Runtime Errors**: Verify environment variables are set correctly

