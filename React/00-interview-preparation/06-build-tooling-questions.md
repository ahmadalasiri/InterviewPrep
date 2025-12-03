# Build Tooling & Asset Delivery Questions

## Build Tools & Bundling

### Q1: What is bundling and why do we need it in React applications?

**Answer:**

Bundling combines multiple files and dependencies into optimized production files.

**Why bundle:**
- Transpile JSX/TypeScript to JavaScript
- Resolve ES6 module imports
- Optimize code (minification, tree-shaking)
- Handle CSS, images, fonts
- Code splitting for performance
- Development features (HMR, source maps)

**Without bundling:**
```html
<script src="react.js"></script>
<script src="react-dom.js"></script>
<script src="app.js"></script>
```

**With bundling:**
```html
<script src="bundle.js"></script>
```

---

### Q2: Explain the differences between Webpack and Vite

**Answer:**

**Webpack:**
```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.jsx?$/, use: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  }
};
```

**Vite:**
```javascript
// vite.config.js
export default {
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './src/index.html'
    }
  },
  plugins: [react()]
};
```

**Key Differences:**

| Feature | Webpack | Vite |
|---------|---------|------|
| **Dev Server** | Bundles everything upfront | Native ES modules, on-demand |
| **HMR Speed** | Slower (full rebuild) | Faster (module-level) |
| **Cold Start** | Slower | Instant |
| **Production** | Webpack | Rollup |
| **Config** | More complex | Simpler |

**When to use:**
- **Webpack**: Complex builds, large existing codebase
- **Vite**: New projects, fast dev experience priority

---

### Q3: How does code splitting work in React applications?

**Answer:**

Code splitting divides code into smaller chunks loaded on demand.

**1. React.lazy and Suspense:**
```jsx
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

**2. Route-based splitting:**
```jsx
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

**3. Webpack splitChunks:**
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

**Benefits:**
- Smaller initial bundle
- Faster page load
- Better caching
- Load code only when needed

---

### Q4: How does Vite's dev server work differently from Webpack?

**Answer:**

**Webpack Dev Server:**
```javascript
// Bundles ALL files before serving
// Entry: index.js
//   → Analyzes all imports
//   → Transpiles everything
//   → Creates bundle
//   → Serves bundle
// Time: ~10-30s for large apps
```

**Vite Dev Server:**
```javascript
// Uses native ES modules
// 1. Serves index.html immediately
// 2. Browser requests modules on-demand
// 3. Vite transforms only requested files
// 4. Uses esbuild for fast transforms
// Time: <1s regardless of app size
```

**Example:**
```html
<!-- index.html -->
<script type="module" src="/src/main.jsx"></script>
```

```jsx
// main.jsx - served as-is (native ES module)
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

// Browser requests App.jsx
// Vite transforms it on-the-fly
createRoot(document.getElementById('root')).render(<App />);
```

**Key Advantages:**
- No bundling in dev (native ES modules)
- On-demand compilation
- Fast HMR (module-level updates)
- Leverages browser native module resolution

---

## Asset Delivery & Optimization

### Q5: How do you optimize asset delivery in React applications?

**Answer:**

**1. Image Optimization:**
```javascript
// Webpack
{
  test: /\.(png|jpg|jpeg|gif|svg)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[hash].[ext]',
        outputPath: 'images/'
      }
    },
    {
      loader: 'image-webpack-loader',
      options: {
        mozjpeg: { quality: 80 },
        pngquant: { quality: [0.65, 0.90] }
      }
    }
  ]
}

// Vite - Automatic
import logo from './logo.png?w=200&h=200&format=webp';
```

**2. Asset Hashing (Cache Busting):**
```javascript
// Webpack
output: {
  filename: '[name].[contenthash].js',
  chunkFilename: '[name].[contenthash].chunk.js'
}

// Vite (automatic)
build: {
  rollupOptions: {
    output: {
      entryFileNames: 'assets/[name].[hash].js',
      chunkFileNames: 'assets/[name].[hash].js',
      assetFileNames: 'assets/[name].[hash].[ext]'
    }
  }
}
```

**3. Resource Hints:**
```html
<!-- Prefetch - Load in background -->
<link rel="prefetch" href="/next-page.js">

<!-- Preload - High priority -->
<link rel="preload" href="/critical.css" as="style">

<!-- Preconnect - Full connection setup -->
<link rel="preconnect" href="https://fonts.googleapis.com">
```

**4. Lazy Loading Images:**
```jsx
// Native lazy loading
<img src="image.jpg" loading="lazy" alt="Description" />

// Intersection Observer
function LazyImage({ src, alt }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
          observer.unobserve(entry.target);
        }
      });
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isLoaded ? src : 'placeholder.jpg'}
      alt={alt}
    />
  );
}
```

**5. Compression:**
```javascript
// Gzip/Brotli compression
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192
    })
  ]
};
```

---

### Q6: What is tree-shaking and how do bundlers implement it?

**Answer:**

Tree-shaking removes unused code from the final bundle.

**How it works:**
1. Static analysis of import/export statements
2. Build dependency graph of used code
3. Eliminate unreachable code

**Example:**
```javascript
// utils.js
export function used() { return 'used'; }
export function unused() { return 'unused'; }

// main.js
import { used } from './utils.js';
console.log(used());

// Bundle output (unused removed)
function used() { return 'used'; }
console.log(used());
```

**Webpack Configuration:**
```javascript
module.exports = {
  mode: 'production', // Enables tree-shaking
  optimization: {
    usedExports: true,
    sideEffects: false,
    minimize: true
  }
};

// package.json
{
  "sideEffects": false // Or ["*.css", "*.scss"]
}
```

**Best Practices:**
```javascript
// ✅ Good - Named exports
export function func1() {}
export function func2() {}

// ❌ Bad - Default export object
export default {
  func1: () => {},
  func2: () => {}
};
```

---

### Q7: Explain source maps and their role in debugging

**Answer:**

Source maps map compiled/bundled code back to original source.

**Types:**
```javascript
// webpack.config.js
module.exports = {
  devtool: 'source-map', // Full source map
  // devtool: 'eval-source-map', // Fast, good for dev
  // devtool: 'cheap-module-source-map', // Faster, less accurate
  // devtool: false // No source maps (production)
};
```

**Source Map Types:**

| Type | Build Speed | Rebuild Speed | Quality | Production |
|------|-------------|---------------|---------|------------|
| `source-map` | Slow | Slow | Best | Yes |
| `eval-source-map` | Slow | Fast | Best | No |
| `cheap-module-source-map` | Medium | Fast | Good | Yes |

**Vite Configuration:**
```javascript
// vite.config.js
export default {
  build: {
    sourcemap: true, // or 'inline' or 'hidden'
    minify: 'terser'
  }
};
```

**Benefits:**
- Debug original source code
- See original variable names
- Better error stack traces
- Easier production debugging

---

This covers build tooling and asset delivery for React applications!

