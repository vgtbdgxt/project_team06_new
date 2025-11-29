# Quick Start Guide

Get the Mental Health Clinic Accessibility Dashboard running in 5 minutes.

## Prerequisites Check

```bash
node --version  # Should be 18 or higher
npm --version   # Should be 9 or higher
```

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:3000`

## First Steps

1. **View the map**: You'll see 18 clinic markers across Los Angeles
2. **Click "📍 Locate Me"**: Grant location permission to enable distance filtering
3. **Adjust the distance slider**: Watch markers filter in real-time
4. **Click a clinic marker**: View detailed information in the right panel
5. **Try different filters**: Experiment with clinic types, specialties, and availability options

## Build for Production

```bash
npm run build
```

The `dist/` folder will contain production-ready files.

## Deploy to GitHub Pages

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

Quick deploy:
```bash
npm install --save-dev gh-pages
# Add "deploy": "npm run build && gh-pages -d dist" to package.json scripts
npm run deploy
```

## Troubleshooting

### Port 3000 already in use

Edit `vite.config.ts` and change the port:
```typescript
server: {
  port: 3001,  // or any available port
}
```

### Map tiles not loading

- Check internet connection (requires OpenStreetMap tiles)
- Verify browser console for CORS errors
- Try a different browser

### Geolocation not working

- Ensure you're using HTTPS (required for geolocation)
- Grant location permission when prompted
- Check browser settings for location permissions

## Next Steps

- Read [README.md](./README.md) for full documentation
- Review [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) for research paper content
- Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for code organization

