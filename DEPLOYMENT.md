# MealStack Deployment Guide

This guide will walk you through deploying the MealStack Digital Food Ordering Management System to free hosting services.

## 🎯 Deployment Architecture

- **Frontend**: Vercel (Free tier)
- **Backend**: Render (Free tier)
- **Database**: Railway MySQL (Free tier - 500 hours/month)

## 📋 Prerequisites

Before you begin, create free accounts on:
1. [Railway](https://railway.app/) - for MySQL database
2. [Render](https://render.com/) - for Spring Boot backend
3. [Vercel](https://vercel.com/) - for React frontend
4. [GitHub](https://github.com/) - to push your code (required for deployment)

---

## 🗄️ Part 1: Deploy Database (Railway)

### Step 1: Create MySQL Database on Railway

1. Go to [Railway](https://railway.app/) and sign in
2. Click **"New Project"**
3. Select **"Provision MySQL"**
4. Wait for the database to be provisioned

### Step 2: Get Database Credentials

1. Click on your MySQL service
2. Go to the **"Variables"** tab
3. Note down these values (you'll need them later):
   - `MYSQL_URL` (full connection string)
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

### Step 3: Construct JDBC URL

Convert the Railway MySQL URL to JDBC format:
```
jdbc:mysql://[MYSQL_HOST]:[MYSQL_PORT]/[MYSQL_DATABASE]?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
```

Example:
```
jdbc:mysql://containers-us-west-123.railway.app:6789/railway?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
```

---

## 🚀 Part 2: Deploy Backend (Render)

### Step 1: Push Code to GitHub

```bash
# Navigate to your project root
cd d:\IACSD

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/mealstack.git
git branch -M main
git push -u origin main
```

### Step 2: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

**Basic Settings:**
- **Name**: `mealstack-backend`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `Campus-Canteen-Management-System-main/Backend/backend`
- **Runtime**: `Java`

**Build Settings:**
- **Build Command**: 
  ```bash
  mvn clean package -DskipTests
  ```
- **Start Command**:
  ```bash
  java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/cms_backend-0.0.1.jar
  ```

### Step 3: Configure Environment Variables

In the **Environment** section, add these variables:

| Key | Value |
|-----|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `DATABASE_URL` | Your JDBC URL from Railway (see Part 1, Step 3) |
| `DB_USERNAME` | Your Railway MySQL username |
| `DB_PASSWORD` | Your Railway MySQL password |
| `JWT_SECRET` | Generate a secure 32+ character string |
| `JWT_EXPIRATION_TIME` | `86400000` |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:3000` (update after frontend deployment) |

> **Generate JWT Secret**: Use a password generator or run:
> ```bash
> openssl rand -base64 32
> ```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for the build to complete (5-10 minutes)
3. Once deployed, note your backend URL: `https://mealstack-backend.onrender.com`

### Step 5: Test Backend

Visit: `https://your-backend-url.onrender.com/actuator/health`

You should see:
```json
{
  "status": "UP"
}
```

---

## 🎨 Part 3: Deploy Frontend (Vercel)

### Step 1: Update Environment Variables

1. Edit `d:\IACSD\frontend\.env.production`
2. Update with your actual backend URL:
   ```
   VITE_API_BASE_URL=https://mealstack-backend.onrender.com
   ```

### Step 2: Commit Changes

```bash
cd d:\IACSD
git add frontend/.env.production
git commit -m "Update production API URL"
git push
```

### Step 3: Deploy to Vercel

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd d:\IACSD\frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 4: Configure Environment Variables on Vercel

1. In your Vercel project settings
2. Go to **"Settings"** → **"Environment Variables"**
3. Add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://mealstack-backend.onrender.com` (your backend URL)
   - **Environment**: Production

### Step 5: Redeploy

Click **"Redeploy"** to apply environment variables

---

## 🔧 Part 4: Final Configuration

### Update CORS on Backend

1. Go back to your Render dashboard
2. Update the `CORS_ALLOWED_ORIGINS` environment variable:
   ```
   https://your-frontend-app.vercel.app,http://localhost:3000
   ```
3. Render will automatically redeploy

### Test the Application

1. Visit your Vercel URL: `https://your-frontend-app.vercel.app`
2. Try logging in with your admin/student credentials
3. Test menu management and order placement

---

## 📝 Important Notes

### Free Tier Limitations

**Render:**
- ⚠️ **Cold Starts**: Free tier spins down after 15 minutes of inactivity
- First request after inactivity takes 30-60 seconds
- 750 hours/month free

**Railway:**
- 500 hours/month free for MySQL
- 1GB storage limit
- Monitor usage in Railway dashboard

**Vercel:**
- 100GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

### Database Initialization

On first deployment, Spring Boot will automatically:
- Create database tables (via `spring.jpa.hibernate.ddl-auto=update`)
- Run any data initializers you have configured

### Monitoring

**Backend Health**: `https://your-backend.onrender.com/actuator/health`

**Check Logs:**
- Render: Dashboard → Your Service → Logs
- Railway: Dashboard → Your Database → Logs
- Vercel: Dashboard → Your Project → Deployments → View Logs

---

## 🐛 Troubleshooting

### Backend won't start

1. Check Render logs for errors
2. Verify all environment variables are set correctly
3. Ensure DATABASE_URL is in correct JDBC format

### Frontend can't connect to backend

1. Check browser console for CORS errors
2. Verify `VITE_API_BASE_URL` is set correctly in Vercel
3. Ensure `CORS_ALLOWED_ORIGINS` includes your Vercel URL

### Database connection errors

1. Verify Railway MySQL is running
2. Check database credentials in Render environment variables
3. Ensure JDBC URL includes `?createDatabaseIfNotExist=true`

### 403 Forbidden errors

1. Check JWT token is being sent in requests
2. Verify JWT_SECRET is the same across deployments
3. Check Spring Security configuration

---

## 🔄 Updating Your Application

### Update Backend

```bash
# Make your changes
git add .
git commit -m "Your changes"
git push

# Render will automatically redeploy
```

### Update Frontend

```bash
# Make your changes
git add .
git commit -m "Your changes"
git push

# Vercel will automatically redeploy
```

---

## 💰 Cost Optimization

To stay within free tiers:

1. **Monitor Usage**: Check Railway and Render dashboards regularly
2. **Optimize Queries**: Reduce database calls
3. **Cache Static Assets**: Already configured in Vercel
4. **Consider Upgrading**: If you exceed limits, upgrade to paid tiers

---

## 🎉 Success!

Your MealStack application is now live! Share your URLs:

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.onrender.com`

### Next Steps

1. Set up custom domain (optional)
2. Configure email notifications
3. Set up monitoring and alerts
4. Create database backups

---

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review deployment logs
3. Verify all environment variables
4. Check Railway, Render, and Vercel status pages

**Happy Deploying! 🚀**
