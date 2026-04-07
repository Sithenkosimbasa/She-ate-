# She Ate - Build System

This project now includes a build system to optimize your static website for production deployment.

## 📁 Build Folder Structure

The `build/` folder contains your production-ready website with:
- **Minified HTML**: Smaller file sizes, faster loading
- **Optimized CSS**: Compressed stylesheets
- **All assets**: Images, documentation, and other files
- **Ready for deployment**: Upload the entire `build/` folder to your web server

## 🚀 Build Commands

### Install Dependencies (first time only)
```bash
npm install
```

### Build for Production
```bash
npm run build
```
Creates optimized files in the `build/` folder, ready for deployment.

### Build for Development
```bash
npm run dev
```
Creates unoptimized files in the `build/` folder for testing.

### Clean Build Folder
```bash
npm run clean
```
Removes the entire `build/` folder.

### Test Build Locally
```bash
npm run serve
```
Serves the build folder on `http://localhost:3000` for testing.

## 📋 What Gets Optimized

- **HTML files**: Minified, comments removed, whitespace collapsed
- **CSS files**: Compressed and optimized
- **JavaScript**: Would be minified if you had separate JS files
- **Images**: Currently copied as-is (add image optimization if needed)

## 🚀 Deployment

After running `npm run build`, upload the contents of the `build/` folder to your web hosting service.

## 🔧 Customization

Edit `build.js` to:
- Add image optimization
- Include/exclude specific files
- Add more processing steps
- Modify minification settings

## 📝 Notes

- Your source files remain unchanged in the root directory
- The build process preserves all functionality
- Build artifacts include timestamps for tracking