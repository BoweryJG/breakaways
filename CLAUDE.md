# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the "Breakaway Civilization" project - an interactive web-based visualization dashboard that explores connections between ancient monuments, underground bases, genetic bloodlines, and modern phenomena. The project presents a comprehensive theory about Earth's hidden history through 11 distinct visualizations.

## Architecture

### Core Structure
- **Static site** deployed on Netlify (no build process required)
- **Single-page application** with dynamic visualization switching
- **Main entry**: `/visualizations/index.html`
- **Core controller**: `/visualizations/js/main.js` manages navigation and state
- **Individual visualizations**: Each has its own JS file in `/visualizations/js/`

### Visualization System
Each visualization follows this pattern:
1. Has an `init[VisualizationName]()` function that main.js calls
2. May have a `cleanup[VisualizationName]()` function for memory management
3. Uses either D3.js, Three.js, or Leaflet.js depending on visualization type
4. Shares the cyberpunk aesthetic (dark theme, neon colors #00ffcc, #ff00ff, etc.)

### Key Visualizations
- **Global Energy Grid** (`visualizations.js`) - D3.js world map with ley lines
- **Galactic Cycles** (`galactic-spiral.js`) - D3.js spiral timeline
- **Hidden Architecture** (`earth-3d.js`) - Three.js 3D Earth
- **Moon Control** (`moon-control.js`) - Three.js orbital mechanics
- **Master Convergence** (`master-convergence.js`) - Three.js holographic integration
- **Live Tracker** (`live-tracker.js`) - Real-time event simulation

## Common Development Tasks

### Running Locally
```bash
# No build needed - just serve the visualizations directory
python -m http.server 8000 --directory visualizations
# OR
npx http-server visualizations
```

### Deploying Changes
```bash
git add -A
git commit -m "Your commit message"
git push
netlify deploy --prod  # Auto-deploys from visualizations/ directory
```

### Adding a New Visualization
1. Create `/visualizations/js/your-visualization.js`
2. Add init function: `function initYourVisualization() { ... }`
3. Export it: `window.initYourVisualization = initYourVisualization;`
4. Add to navigation in `index.html`: `<button class="nav-btn" data-view="your-view">Your View</button>`
5. Add section in `index.html`: `<section id="your-view" class="viz-section">...</section>`
6. Update mapping in `main.js` initFunctions object: `'your-view': 'initYourVisualization'`

### Common Patterns

**Layer Toggle System** (for map-based visualizations):
```javascript
state.layers = {
    'ley-lines': true,
    'monuments': true,
    'underground': false
    // etc.
};
```

**Sound Integration**:
```javascript
if (window.breakawaySound) {
    window.breakawaySound.playEventSound('activation');
}
```

**Real-time Simulation**:
```javascript
setInterval(() => {
    // Update data
    // Trigger visualization update
}, 5000);
```

## Key Technical Decisions

### Libraries
- **D3.js v7** for 2D data visualizations
- **Three.js** for 3D/WebGL visualizations  
- **Leaflet.js** for advanced mapping (Antarctic Revelation)
- **No framework** - vanilla JavaScript for simplicity

### State Management
- Global state in `window.appState` (defined in main.js)
- Each visualization manages its own internal state
- Sound system has separate state management

### CSS Classes
- Can't start with numbers (changed `5g` to `five-g`)
- Consistent naming: `.viz-section`, `.nav-btn`, `.layer-toggle`

### Error Handling
- Sound system wrapped in try-catch (AudioContext restrictions)
- Null checks for optional features (window.breakawaySound)
- D3.js data existence checks before rendering

## Important Context

### Historical Edits (from earlier CLAUDE.md)
- **2025-01-22**: Removed all OpenRouter dependencies, standardized to Claude 3.5 Sonnet
- **Sound Toggle**: Added manual sound control (doesn't auto-play)
- **Canvas Frontend**: Integrated with osbackend for AI calls (not part of this project)

### Recent User Modifications
- Added sound toggle button to header
- Modified sound system to not auto-play
- Updated main.js to handle sound toggle functionality

### Known Issues Fixed
- Variable naming conflicts (`earth` vs `moonEarth`)
- ES6 module imports (removed, using script tags)
- CSS class names starting with numbers
- AudioScheduledSourceNode multiple start() calls

## Data Structure

The project uses `/visualizations/data/grid-data.json` for coordinate data:
- Monument locations with power levels
- Ley line connections
- Underground base coordinates
- Missing 411 clusters
- Galactic cycle events

## Deployment

- **GitHub**: https://github.com/BoweryJG/breakaways
- **Netlify**: Configured via `netlify.toml`
- **No build process**: Direct static file serving
- **Auto-deploy**: Push to main branch triggers deployment

## Research Context

The project explores the theory that Earth harbors a continuous advanced civilization operating parallel to surface humanity for over 12,000 years. The visualizations reveal patterns connecting:
- Ancient monument placement on electromagnetic nodes
- 12,000-year catastrophe cycles
- Underground base networks
- Genetic markers (RH negative blood)
- Modern phenomena (UAPs, Missing 411)

This context helps understand the visualization choices and data relationships throughout the codebase.