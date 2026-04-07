const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier');
const CleanCSS = require('clean-css');
const { minify: minifyJS } = require('terser');

const isDev = process.argv.includes('--dev');

// Source and build directories
const srcDir = path.join(__dirname);
const buildDir = path.join(__dirname, 'build');

// Ensure build directory exists
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Files and folders to copy
const itemsToCopy = [
  'index.html',
  'styles.css',
  'auth_login',
  'auth_sign_up',
  'cart_checkout',
  'help_support',
  'home_discovery',
  'item_details',
  'meal_planner_weekly',
  'menu_listing',
  'notifications',
  'onboarding_1',
  'onboarding_2',
  'order_tracking',
  'payment_gateway',
  'shared',
  'splash_screen',
  'user_profile',
  'ADMIN_GUIDE.md',
  'ORDER_COLLECTION_GUIDE.md'
];

// Copy function
function copyFileSync(source, target) {
  let targetFile = target;

  // If target is a directory, a new file with the same name will be created
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    targetFile = path.join(target, path.basename(source));
  }

  try {
    fs.copyFileSync(source, targetFile);
    console.log(`✓ Copied: ${path.relative(srcDir, source)}`);
  } catch (error) {
    console.error(`✗ Failed to copy: ${path.relative(srcDir, source)}`, error.message);
  }
}

// Recursive copy function
function copyFolderRecursiveSync(source, target) {
  let files = [];

  // Check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  // Copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function (file) {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}

// Process HTML files (minify if not dev)
function processHTML(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (isDev) {
    return content;
  }

  try {
    return minify(content, {
      removeComments: true,
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeEmptyAttributes: true,
      removeEmptyElements: false
    });
  } catch (error) {
    console.warn(`Warning: Could not minify ${filePath}, using original`);
    return content;
  }
}

// Process CSS files
function processCSS(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (isDev) {
    return content;
  }

  try {
    const result = new CleanCSS().minify(content);
    return result.styles;
  } catch (error) {
    console.warn(`Warning: Could not minify CSS ${filePath}, using original`);
    return content;
  }
}

// Process JS files (if any separate ones)
function processJS(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (isDev) {
    return content;
  }

  try {
    const result = minifyJS(content);
    return result.code;
  } catch (error) {
    console.warn(`Warning: Could not minify JS ${filePath}, using original`);
    return content;
  }
}

// Main build process
console.log(isDev ? '🚀 Building in development mode...' : '📦 Building for production...');

itemsToCopy.forEach(item => {
  const sourcePath = path.join(srcDir, item);

  if (!fs.existsSync(sourcePath)) {
    console.log(`⚠️  Skipping: ${item} (not found)`);
    return;
  }

  if (fs.statSync(sourcePath).isDirectory()) {
    // Copy entire directory
    copyFolderRecursiveSync(sourcePath, buildDir);
  } else {
    // Process individual files
    let processedContent = '';

    if (item.endsWith('.html')) {
      processedContent = processHTML(sourcePath);
    } else if (item.endsWith('.css')) {
      processedContent = processCSS(sourcePath);
    } else if (item.endsWith('.js')) {
      processedContent = processJS(sourcePath);
    } else {
      // Copy other files as-is
      copyFileSync(sourcePath, buildDir);
      return;
    }

    // Write processed content
    const targetPath = path.join(buildDir, item);
    fs.writeFileSync(targetPath, processedContent, 'utf8');
    console.log(`✓ Processed: ${item}`);
  }
});

// Create a simple deployment-ready index
const buildIndexPath = path.join(buildDir, 'index.html');
if (fs.existsSync(buildIndexPath)) {
  let indexContent = fs.readFileSync(buildIndexPath, 'utf8');

  // Add build info comment
  const buildInfo = `
<!-- Built on ${new Date().toISOString()} -->
<!-- ${isDev ? 'Development' : 'Production'} build -->
`;

  indexContent = indexContent.replace('<html', buildInfo + '<html');
  fs.writeFileSync(buildIndexPath, indexContent, 'utf8');
}

console.log('✅ Build completed successfully!');
console.log(`📁 Build output: ${buildDir}`);
console.log(isDev ? '🔧 Run "npm run serve" to test the build' : '🚀 Ready for deployment!');