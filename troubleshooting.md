# Troubleshooting Guide

## Quick Start

For standard setup, this guide is not necessary. Installation works out of the box:

```bash
npm install
npm run dev
```

Check the following sections if any problems arise.

## `npm install` crashes with Visual Studio errors

When running `npm install` without configuration, you may encounter errors like:

```text
gyp ERR! find VS could not find a version of Visual Studio 2017 or newer to use
gyp ERR! find VS You need to install the latest version of Visual Studio
```

**Why this happens:**

This project uses `brain.js` (v2.0.0-beta.23) for neural network functionality. Brain.js depends on `gpu.js`, which in turn depends on `gl` (OpenGL bindings) - a native Node.js module that requires C++ compilation during installation. Normally, this requires Python 3.x and Visual Studio Build Tools. However, neither is required for this project.

**Solution:**

The project is configured to skip native module compilation entirely. A `.npmrc` file in the project root contains:

```text
ignore-scripts=true
```

This directs npm to skip all installation scripts, including native compilation. Run:

```bash
npm install
```

No additional tools (Python, Visual Studio, Build Tools) are required.

**Why this works:**

The `gl` package is required only for server-side GPU acceleration during training. This project runs brain.js entirely in the browser (client-side React), so it is not needed. Neural network training occurs in the browser rather than on a server, making `gl` compilation unnecessary.

## Other Common Issues

### Still getting gyp errors after cloning?

Make sure the `.npmrc` file exists in your project root. If it's missing:

1. Create `.npmrc` in the project root
2. Add this line: `ignore-scripts=true`
3. Run `npm install` again

### "Module 'gl' not found" at runtime

This should not occur during normal usage. If this error appears, `brain.js` is attempting server-side GPU acceleration. Verify that:

- All neural network code exists in components marked with `"use client"`
- brain.js is not imported in server components or API routes

### `package-lock.json` conflicts or corrupted `node_modules`

Start fresh:

```bash
rm -rf node_modules package-lock.json
npm install
```

This clears out any partial installations and rebuilds from scratch.

## Build & Deploy

The setup works for any deployment scenario:

- **Local development**: `npm run dev` - no compilation needed
- **Production build**: `npm run build` - creates a static build
- **GitHub Pages / Vercel / Netlify**: Static export works out of the box

```bash
npm install          # Installs packages, skips native compilation
npm run build        # Creates optimized production build
```

## Advanced: Server-Side Training

> [!Warning]
> Server-side training is not necessary for this project.

For server-side neural network training with GPU acceleration, the following is required:

1. Install Python 3.6+
2. Install Visual Studio Build Tools with "Desktop development with C++" workload
3. Remove or modify `.npmrc` to allow scripts
4. Run `npm install` to compile native modules

For this project, browser-based training is sufficient and server-side training is unnecessary.

## For Future Developers

### Key Implementation Details

> [!Note]
> **Do not remove `.npmrc`**  
> This file is critical for installation to succeed without C++ build tools. All neural network code runs client-side in the browser, so native module compilation is skipped.

**`brain.js` runs client-side only**  
All neural network code resides in `"use client"` components. Training operates in the browser with small datasets. Server-side GPU acceleration is not required.

**Static deployment ready**  
The project exports as static HTML/JS/CSS and can deploy to any static host.

### Adding new dependencies

Most packages install normally:

```bash
npm install <package>
```

If a package requires install scripts:

```bash
npm install <package> --ignore-scripts=false
```

## Resources

- [brain.js documentation](https://github.com/BrainJS/brain.js)
- [npm config: ignore-scripts](https://docs.npmjs.com/cli/v10/using-npm/config#ignore-scripts)
- [node-gyp Windows setup](https://github.com/nodejs/node-gyp#on-windows)
