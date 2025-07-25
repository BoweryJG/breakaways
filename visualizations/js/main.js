// Main JavaScript for Breakaway Civilization Dashboard

// Global state
const state = {
    currentView: 'overview',
    schumann: 7.83,
    activationLevel: 87,
    nodesOnline: 1347,
    layers: {
        'ley-lines': true,
        'monuments': true,
        'underground': false,
        'missing411': false,
        'crop-circles': false,
        'uap': false,
        '5g': false
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    startLiveUpdates();
    hideLoadingScreen();
});

function initializeApp() {
    // Set up navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchView(e.target.dataset.view);
        });
    });

    // Set up layer toggles
    const layerToggles = document.querySelectorAll('.layer-toggle');
    layerToggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            state.layers[e.target.dataset.layer] = e.target.checked;
            updateMapLayers();
        });
    });

    // Initialize mini visualizations
    initializeMiniViz();
}

function switchView(viewName) {
    // Update active nav button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

    // Update active section
    document.querySelectorAll('.viz-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(viewName).classList.add('active');

    state.currentView = viewName;
    
    // Initialize specific visualization if needed
    if (typeof window[`init${capitalize(viewName)}`] === 'function') {
        window[`init${capitalize(viewName)}`]();
    }
}

function hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
}

function startLiveUpdates() {
    // Update Schumann resonance
    setInterval(() => {
        state.schumann = (7.83 + Math.random() * 5).toFixed(2);
        document.getElementById('schumann').textContent = `${state.schumann} Hz`;
        
        // Add warning color if above threshold
        if (state.schumann > 10) {
            document.getElementById('schumann').style.color = 'var(--warning-color)';
        }
    }, 5000);

    // Update activation level
    setInterval(() => {
        if (state.activationLevel < 100) {
            state.activationLevel += Math.random() * 0.1;
            document.getElementById('activation').textContent = `${state.activationLevel.toFixed(1)}%`;
        }
    }, 10000);

    // Update nodes online
    setInterval(() => {
        const change = Math.floor(Math.random() * 10) - 5;
        state.nodesOnline += change;
        document.getElementById('nodes').textContent = state.nodesOnline.toLocaleString();
    }, 7000);
}

function initializeMiniViz() {
    // Ancient Sites preview
    const sitesPreview = d3.select('#sites-preview')
        .append('svg')
        .attr('width', '100%')
        .attr('height', 100);

    // Create random dots representing sites
    const sites = Array.from({length: 50}, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: Math.random() * 3 + 1
    }));

    sitesPreview.selectAll('circle')
        .data(sites)
        .enter()
        .append('circle')
        .attr('cx', d => d.x + '%')
        .attr('cy', d => d.y)
        .attr('r', d => d.r)
        .attr('fill', 'var(--accent-color)')
        .attr('opacity', 0.6);

    // Missing 411 heat map preview
    const missingPreview = d3.select('#missing-preview')
        .append('svg')
        .attr('width', '100%')
        .attr('height', 100);

    // Create gradient effect
    const gradient = missingPreview.append('defs')
        .append('radialGradient')
        .attr('id', 'heat-gradient');

    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', 'var(--warning-color)')
        .attr('stop-opacity', 0.8);

    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', 'transparent');

    // Add heat spots
    const heatSpots = Array.from({length: 8}, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: Math.random() * 30 + 10
    }));

    missingPreview.selectAll('circle')
        .data(heatSpots)
        .enter()
        .append('circle')
        .attr('cx', d => d.x + '%')
        .attr('cy', d => d.y)
        .attr('r', d => d.r)
        .attr('fill', 'url(#heat-gradient)');

    // Bloodline preview - branching tree
    const bloodlinePreview = d3.select('#bloodline-preview')
        .append('svg')
        .attr('width', '100%')
        .attr('height', 100);

    // Simple tree structure
    const treeData = {
        x: 50,
        y: 10,
        children: [
            {x: 30, y: 40, children: [{x: 20, y: 70}, {x: 40, y: 70}]},
            {x: 70, y: 40, children: [{x: 60, y: 70}, {x: 80, y: 70}]}
        ]
    };

    function drawBranches(node, parent = null) {
        if (parent) {
            bloodlinePreview.append('line')
                .attr('x1', parent.x + '%')
                .attr('y1', parent.y)
                .attr('x2', node.x + '%')
                .attr('y2', node.y)
                .attr('stroke', 'var(--accent-color)')
                .attr('stroke-width', 1);
        }

        bloodlinePreview.append('circle')
            .attr('cx', node.x + '%')
            .attr('cy', node.y)
            .attr('r', 3)
            .attr('fill', 'var(--accent-color)');

        if (node.children) {
            node.children.forEach(child => drawBranches(child, node));
        }
    }

    drawBranches(treeData);

    // UAP preview - moving dots
    const uapPreview = d3.select('#uap-preview')
        .append('svg')
        .attr('width', '100%')
        .attr('height', 100);

    const uapData = Array.from({length: 5}, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
    }));

    const uaps = uapPreview.selectAll('circle')
        .data(uapData)
        .enter()
        .append('circle')
        .attr('cx', d => d.x + '%')
        .attr('cy', d => d.y)
        .attr('r', 2)
        .attr('fill', 'var(--pulse-color)');

    // Animate UAPs
    function animateUAPs() {
        uaps.transition()
            .duration(2000)
            .attr('cx', () => Math.random() * 100 + '%')
            .attr('cy', () => Math.random() * 100)
            .on('end', animateUAPs);
    }
    animateUAPs();
}

function updateMapLayers() {
    // This will be implemented with the full map visualization
    console.log('Updating map layers:', state.layers);
}

// Utility functions
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export for use in other modules
window.appState = state;