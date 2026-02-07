# Quick Deployment Commands

## Prerequisites
```bash
# Install Vercel CLI globally
npm install -g vercel
```

## 1. Push to GitHub
```bash
cd d:\IACSD
git init
git add .
git commit -m "Initial deployment setup"

# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/mealstack.git
git branch -M main
git push -u origin main
```

## 2. Deploy Frontend to Vercel
```bash
cd d:\IACSD\frontend
vercel login
vercel --prod
```

## 3. Update Backend CORS
After getting your Vercel URL, update Render environment variable:
```
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000
```

## Environment Variables Checklist

### Backend (Render)
- [ ] SPRING_PROFILES_ACTIVE=prod
- [ ] DATABASE_URL=(from Railway)
- [ ] DB_USERNAME=(from Railway)
- [ ] DB_PASSWORD=(from Railway)
- [ ] JWT_SECRET=(generate secure key)
- [ ] JWT_EXPIRATION_TIME=86400000
- [ ] CORS_ALLOWED_ORIGINS=(your Vercel URL)

### Frontend (Vercel)
- [ ] VITE_API_BASE_URL=(your Render backend URL)

## Testing
- Backend health: https://your-backend.onrender.com/actuator/health
- Frontend: https://your-app.vercel.app
