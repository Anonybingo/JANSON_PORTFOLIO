# Portfolio: React + Vite + Three.js

## Run it
1. Install Node.js (LTS, v18 or newer): https://nodejs.org
2. In this folder run `npm install`, then `npm run dev`, and open the address it prints (http://localhost:5173).

## Edit it
- src/content.js: all your text lives here: your name, email, manifesto, job titles, links and projects.
- src/photo.jpg: your photo. A portrait on a plain light background works best.
- src/App.jsx: the page structure and the 3D doors. src/index.css: colours, fonts and layout.
- src/engine.js: the intro animation, the 3D igloo, hover physics and light.

## Put it online (free)
`npm run build` creates a `dist` folder. Upload that folder:
- Netlify Drop: https://app.netlify.com/drop and drag the dist folder in.
- Vercel Drop: https://vercel.com/drop accepts the folder or a .zip.
- GitHub Pages, or Netlify/Vercel connected to a Git repo: build command `npm run build`, output folder `dist`.

A ready-built `dist` is already included, so you can deploy without installing anything.
Don't double-click dist/index.html; most browsers block module scripts opened from a file. Use `npm run preview` or deploy it.
Don't upload node_modules.
