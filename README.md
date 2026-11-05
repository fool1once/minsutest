# Fool | Espada · Portfolio

Interactive 3D portfolio for **Fool (Espada)**, a competitive Call of Duty: Mobile player and builder.
A procedural 3D hand (three.js) changes pose and spins as you scroll through each slide.

## Features
- Scroll-driven 3D hand: open, fist, point, thumbs-up and rock sign, one per section
- Staggered slide transitions, scroll progress bar, section dots
- Filterable achievements with count-up stats (counts come from the data, never hard-coded)
- Flip project cards (hover, tap or keyboard), click-to-copy Discord handle
- Responsive, `prefers-reduced-motion` support, no build step, no dependencies to install

## Run locally
Open `index.html` in a browser, or serve the folder:
```bash
python -m http.server 8000   # then visit http://localhost:8000
```

## Deploy on GitHub Pages
1. Create a repo and push these files to `main`.
2. Repo **Settings → Pages → Build and deployment → Deploy from a branch → `main` / root**.
3. Your site goes live at `https://<username>.github.io/<repo>/`.

## Edit your content
Everything lives in `data.js`: achievements, projects, games, socials, UIDs and the typing motto.
Drop a `profile.jpg` in the folder if you want to reuse it later.

## Structure
```
index.html   page markup
style.css    design tokens and styles
script.js    rendering, scroll choreography, 3D hand
data.js      all editable content
```

## Credits
three.js (r128), Font Awesome 6, Google Fonts (Orbitron, Rajdhani, Share Tech Mono), all loaded from CDNs.
