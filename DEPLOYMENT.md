# Deployment Guide for Kisan Connect

## Deploy to Vercel

### Prerequisites
- A GitHub account
- A Vercel account (sign up at https://vercel.com)

### Steps to Deploy

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel will auto-detect Vite configuration
   - Click "Deploy"

3. **Configure Environment Variables (Optional)**
   - In Vercel dashboard, go to your project settings
   - Navigate to "Environment Variables"
   - Add any environment variables if needed:
     - `VITE_OPENWEATHER_API_KEY` (if you want to use env variable for API key)

#### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? Yes
   - Which scope? Select your account
   - Link to existing project? No
   - Project name? kisan-connect (or your preferred name)
   - Directory? ./
   - Override settings? No

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Post-Deployment

1. **Custom Domain (Optional)**
   - Go to your project settings in Vercel
   - Navigate to "Domains"
   - Add your custom domain

2. **Test Your Deployment**
   - Visit the provided Vercel URL
   - Test all features:
     - Authentication
     - Dashboard
     - Weather data
     - Chat functionality
     - Disease scanning
     - News page
     - Profile page

3. **Enable Analytics (Optional)**
   - In Vercel dashboard, enable Analytics
   - Monitor your app's performance

### Automatic Deployments

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to the main branch
- Create preview deployments for pull requests
- Provide deployment URLs for each commit

### Build Configuration

The project uses:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Troubleshooting

**Build Fails:**
- Check that all dependencies are in `package.json`
- Ensure Node.js version is compatible (v18 or higher recommended)

**Routes Not Working:**
- The `vercel.json` file handles SPA routing
- All routes redirect to `index.html`

**Environment Variables:**
- Add them in Vercel dashboard under Settings > Environment Variables
- Prefix with `VITE_` for Vite to access them

### Performance Optimization

The deployment includes:
- Static asset caching (1 year)
- Automatic code splitting
- Optimized production build
- CDN distribution

### Support

For issues:
- Check Vercel deployment logs
- Review build output
- Contact Vercel support if needed

---

**Your app will be live at**: `https://your-project-name.vercel.app`
