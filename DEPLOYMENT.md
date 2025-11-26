# GitHub Pages Deployment Instructions

This document provides step-by-step instructions for deploying the Mental Health Clinic Accessibility Dashboard to GitHub Pages.

## Prerequisites

- GitHub account
- Git installed on your local machine
- Node.js 18+ and npm installed

## Step 1: Prepare Your Repository

1. **Create a new GitHub repository** (or use existing):
   ```bash
   git init
   git remote add origin https://github.com/yourusername/mental-accessibility.git
   ```

2. **Commit all files**:
   ```bash
   git add .
   git commit -m "Initial commit: Mental Health Clinic Accessibility Dashboard"
   git branch -M main
   git push -u origin main
   ```

## Step 2: Install gh-pages Package

Install the `gh-pages` package for automated deployment:

```bash
npm install --save-dev gh-pages
```

## Step 3: Update package.json

Add deployment scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

## Step 4: Verify Vite Configuration

Ensure your `vite.config.ts` has the correct base path. The base path should match your repository name:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/mental-accessibility/',  // Replace with your repository name
  server: {
    port: 3000,
    open: true
  }
})
```

**Important**: If your repository name is different, update the `base` value accordingly. For example:
- Repository: `mental-health-dashboard` → `base: '/mental-health-dashboard/'`
- Repository: `dsci554-final-project` → `base: '/dsci554-final-project/'`

## Step 5: Build and Deploy

1. **Build the project**:
   ```bash
   npm run build
   ```

   This creates a `dist/` folder with production-ready files.

2. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

   This command will:
   - Build the project
   - Create a `gh-pages` branch
   - Push the `dist/` folder contents to the `gh-pages` branch

## Step 6: Configure GitHub Pages Settings

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
4. Click **Save**

## Step 7: Access Your Deployed Site

Your site will be available at:
```
https://yourusername.github.io/mental-accessibility/
```

**Note**: It may take a few minutes for the site to become available after deployment.

## Step 8: Update Deployment (Future Changes)

Whenever you make changes to the code:

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

2. **Redeploy**:
   ```bash
   npm run deploy
   ```

## Troubleshooting

### Issue: 404 Error on GitHub Pages

**Solution**: Verify the `base` path in `vite.config.ts` matches your repository name exactly (including case sensitivity).

### Issue: Assets Not Loading

**Solution**: 
- Ensure all asset paths are relative
- Check browser console for 404 errors
- Verify `base` path configuration

### Issue: Map Tiles Not Displaying

**Solution**: 
- Check browser console for CORS errors
- Verify Leaflet CSS is loading correctly
- Ensure OpenStreetMap tiles are accessible (they should be by default)

### Issue: Geolocation Not Working

**Solution**: 
- GitHub Pages serves over HTTPS, which is required for geolocation API
- Users must grant location permission in their browser
- Check browser console for permission errors

## Alternative: Manual Deployment

If you prefer manual deployment:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Create a `docs` folder** (if using docs folder method):
   ```bash
   cp -r dist/* docs/
   ```

3. **Update `vite.config.ts`** to use `/docs`:
   ```typescript
   base: '/mental-accessibility/'
   ```

4. **Commit and push**:
   ```bash
   git add docs/
   git commit -m "Deploy to GitHub Pages"
   git push
   ```

5. **Configure GitHub Pages** to use `/docs` folder instead of `gh-pages` branch.

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to your `public/` folder:
   ```
   yourdomain.com
   ```

2. Configure DNS settings with your domain provider
3. Update GitHub Pages settings to use custom domain

## Continuous Deployment (Advanced)

For automatic deployment on every push, you can set up GitHub Actions:

1. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. Commit and push the workflow file
3. GitHub Actions will automatically deploy on every push to `main`

---

**Note**: Remember to update the repository name in `vite.config.ts` if it differs from `mental-accessibility`.

