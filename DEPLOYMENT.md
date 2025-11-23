# SchoolHub Deployment Guide

Complete instructions for deploying SchoolHub to production.

## Pre-Deployment Checklist

### Security
- [ ] All environment variables are secure (in .env, never committed)
- [ ] Supabase RLS policies reviewed and enabled
- [ ] Authentication flows tested
- [ ] No sensitive data in code

### Testing
- [ ] Login/signup flow works
- [ ] Student dashboard loads
- [ ] Teacher dashboard loads
- [ ] Homework listing displays data
- [ ] Doubt helper interface works
- [ ] Error handling displays properly
- [ ] Mobile responsiveness verified
- [ ] All links work

### Performance
- [ ] Database indexes are created
- [ ] Images optimized
- [ ] Fonts are web-safe
- [ ] CSS is minified (Vite handles this)
- [ ] JavaScript is optimized

## Deployment Steps

### Step 1: Build the Project

```bash
npm run build
```

This creates a `dist/` folder with production-ready files.

### Step 2: Choose Your Platform

## Option A: Deploy to Vercel (Recommended)

### Requirements
- Vercel account (free at vercel.com)
- GitHub account (recommended)
- Git initialized in project

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial SchoolHub commit"
   git remote add origin https://github.com/YOUR_USERNAME/schoolhub.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Click "Continue with GitHub"
   - Select your repository
   - Click "Import"

3. **Configure Environment**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add these variables:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site is live!

### Automatic Deployments
- Any push to `main` branch triggers automatic deployment
- Vercel creates preview URLs for pull requests

---

## Option B: Deploy to Netlify

### Requirements
- Netlify account (free at netlify.com)
- GitHub account (recommended)

### Steps

1. **Create Production Build**
   ```bash
   npm run build
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Select GitHub and your repository
   - Click "Authorize Netlify"

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

4. **Add Environment Variables**
   - In Netlify, go to Site settings → Build & deploy → Environment
   - Add these variables:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

5. **Redeploy**
   - Go to Deploys and click "Trigger deploy"
   - Your site is now live!

---

## Option C: Deploy to GitHub Pages

### Requirements
- GitHub account
- Repository created

### Steps

1. **Update vite.config.js**
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/schoolhub/', // if deploying to subdirectory
   })
   ```

2. **Build Project**
   ```bash
   npm run build
   ```

3. **Push dist Folder**
   ```bash
   git add dist/
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. **Enable Pages**
   - Go to GitHub repo Settings
   - Find "Pages" section
   - Select "Deploy from a branch"
   - Choose `main` branch and `/root` folder
   - Click Save

5. **Your site is live at**
   ```
   https://YOUR_USERNAME.github.io/schoolhub/
   ```

---

## Option D: Self-Hosted Deployment

### Requirements
- VPS or dedicated server
- Node.js installed
- PM2 or similar for process management

### Steps

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Copy Files to Server**
   ```bash
   scp -r dist/ user@your-server:/var/www/schoolhub/
   ```

3. **Set Up Nginx**
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;

     location / {
       root /var/www/schoolhub;
       try_files $uri $uri/ /index.html;
     }
   }
   ```

4. **Set Up SSL**
   ```bash
   certbot certonly --standalone -d your-domain.com
   ```

5. **Restart Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

---

## Post-Deployment

### Verify Everything Works

1. **Test User Signup**
   - Go to your deployed URL
   - Create a test student account
   - Create a test teacher account

2. **Test Core Features**
   - Student: Check dashboard, homework page, ask doubt
   - Teacher: Check dashboard, view analytics
   - Navigation: Test all sidebar links

3. **Test Error Handling**
   - Try invalid login
   - Check error messages display correctly

4. **Check Performance**
   - Page load time < 3 seconds
   - Dashboard loads smoothly
   - No console errors

### Monitor Your Site

**For Vercel:**
- Dashboard shows analytics and error tracking
- Automatic error notifications

**For Netlify:**
- Analytics available in dashboard
- Automatic SSL certificates

**For Self-Hosted:**
- Set up monitoring with monitoring tools
- Configure log rotation
- Set up backups

---

## Environment Variables Needed

Both development and production need these variables in `.env`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### How to Get These Values

1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy the URL and anon key
5. Paste into your `.env` file

---

## Custom Domain Setup

### For Vercel

1. In Vercel dashboard, go to Settings
2. Click "Domains"
3. Add your domain
4. Follow DNS setup instructions
5. Verify domain

### For Netlify

1. In Netlify dashboard, go to Domain management
2. Click "Add custom domain"
3. Enter your domain
4. Follow DNS setup instructions
5. Wait for DNS propagation (up to 48 hours)

### For Self-Hosted

1. Update DNS A record to point to your server IP
2. Set up SSL certificate
3. Configure Nginx to handle HTTPS

---

## Database Backups

Supabase automatically backs up your database:

1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings → Backups
4. View backup history
5. Restore from backup if needed

### Manual Database Backup

```bash
# Export database
pg_dump -h your-host -U postgres -d postgres > backup.sql

# Restore database
psql -h your-host -U postgres -d postgres < backup.sql
```

---

## Troubleshooting Deployment

### Build Fails

**Error: Cannot find module 'vite'**
```bash
npm install
npm run build
```

**Error: Environment variables not found**
- Ensure `.env` exists with correct variables
- On Vercel/Netlify, check Settings → Environment Variables
- Restart deployment after adding variables

### Site Shows Blank Page

1. Check browser console for errors
2. Verify `.env` variables are set
3. Check Supabase is accessible
4. Clear browser cache and reload

### API Calls Fail

1. Verify Supabase URL is correct
2. Check network tab in browser DevTools
3. Ensure RLS policies allow access
4. Check user is authenticated

### Slow Performance

1. Check Supabase query performance
2. Optimize database indexes
3. Enable Vercel/Netlify caching
4. Compress images
5. Minimize CSS/JavaScript

---

## Monitoring & Maintenance

### Regular Tasks

**Daily:**
- Check error logs
- Monitor uptime

**Weekly:**
- Review analytics
- Check database performance

**Monthly:**
- Update dependencies (npm update)
- Review security
- Check backups

### Updating Your Site

```bash
# Make changes to code
git add .
git commit -m "Update feature"
git push origin main

# If self-hosted:
npm run build
scp -r dist/ user@server:/var/www/schoolhub/
```

---

## Security Checklist

Before going live:

- [ ] Supabase RLS policies enabled on all tables
- [ ] Environment variables are secret (not in code)
- [ ] SSL/HTTPS enabled
- [ ] Firewall configured
- [ ] Regular backups enabled
- [ ] Monitoring and alerting set up
- [ ] Error logging configured
- [ ] Authentication working
- [ ] CORS properly configured
- [ ] Database connections secured

---

## Performance Optimization

### Frontend
```bash
# Check bundle size
npm run build

# Optimize images
# Use WebP format
# Compress PNG/JPG

# Lazy load components
# Use React.lazy() and Suspense
```

### Database
```sql
-- Check slow queries
SELECT query, calls, total_time FROM pg_stat_statements
ORDER BY total_time DESC;

-- Add missing indexes
CREATE INDEX idx_deadline ON homework_tasks(deadline);
```

### Caching

**Browser Cache**
- Set Cache-Control headers
- Use CDN for static assets

**Database Cache**
- Connection pooling
- Query result caching

---

## Rollback Procedure

If something goes wrong:

### Vercel
- Go to Deployments tab
- Click "..." on previous deployment
- Select "Promote to Production"

### Netlify
- Go to Deploy history
- Click "Publish deploy" on previous version

### GitHub Pages
- Revert commit: `git revert HEAD`
- Push to trigger redeploy

### Self-Hosted
```bash
# Keep backup of current version
cp -r /var/www/schoolhub /var/www/schoolhub.backup

# Restore previous version
scp -r backup/dist/* user@server:/var/www/schoolhub/
```

---

## Getting Help

### Documentation
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- Supabase: https://supabase.com/docs
- React: https://react.dev

### Support
- Vercel Support: https://vercel.com/support
- Netlify Support: https://support.netlify.com
- Supabase Support: https://supabase.com/support

---

## Success Criteria

Your deployment is successful when:

✅ Site loads in < 3 seconds
✅ User can sign up and log in
✅ Student dashboard shows homework
✅ Teacher can see analytics
✅ No console errors
✅ Mobile view works correctly
✅ SSL certificate is valid
✅ Database backups are working

---

**Congratulations on deploying SchoolHub!**

Your platform is now live and ready for students and teachers to use.

Good luck!

---

**Created**: November 23, 2025
**Version**: 1.0.0
