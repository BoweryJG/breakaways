// Main JavaScript for Breakaway Civilization Dashboard

// Global state
const state = {
    currentView: 'overview',  // Start with overview
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
        'five-g': false
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    startLiveUpdates();
    hideLoadingScreen();
    
    // Sound toggle removed - now handled by Sound Control page
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
    
    // Initialize overview as the default view
    switchView('overview');
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
    const initFunctions = {
        'grid-map': 'initGridMap',
        'timeline': 'initTimeline',
        'bloodlines': 'initBloodlineTree',
        'population-genetics': 'initPopulationGenetics',
        'underground': 'initEarth3d',
        'electromagnetic': 'initElectromagnetic',
        'moon': 'initMoonControl',
        'convergence': 'initMasterConvergence',
        'evidence': 'initEvidence',
        'antarctica': 'initAntarcticRevelation',
        'live': 'initLiveTracker'
    };
    
    const initFunc = initFunctions[viewName];
    console.log(`Switching to view: ${viewName}, init function: ${initFunc}`);
    console.log(`Function exists: ${typeof window[initFunc] === 'function'}`);
    
    // Debug: List all available init functions
    console.log('Available functions:', Object.keys(window).filter(key => key.startsWith('init')));
    
    if (initFunc && typeof window[initFunc] === 'function') {
        console.log(`Calling ${initFunc}...`);
        
        // Check if Three.js is required and loaded for 3D visualizations
        const requires3D = ['bloodlines', 'population-genetics', 'underground', 'moon', 'convergence', 'evidence'].includes(viewName);
        if (requires3D && typeof THREE === 'undefined') {
            console.log('Waiting for Three.js to load...');
            // Wait for Three.js to load
            const checkThree = setInterval(() => {
                if (typeof THREE !== 'undefined') {
                    clearInterval(checkThree);
                    console.log('Three.js loaded, initializing visualization...');
                    executeVisualization();
                }
            }, 100);
            return;
        }
        
        executeVisualization();
    }
    
    function executeVisualization() {
        // Clean up previous 3D scenes if needed
        if (viewName === 'underground' && typeof window.cleanupEarth3d === 'function') {
            window.cleanupEarth3d();
        } else if (viewName === 'moon' && typeof window.cleanupMoonControl === 'function') {
            window.cleanupMoonControl();
        } else if (viewName === 'convergence' && typeof window.cleanupMasterConvergence === 'function') {
            window.cleanupMasterConvergence();
        } else if (viewName === 'bloodlines' && typeof window.cleanupBloodlineTree === 'function') {
            window.cleanupBloodlineTree();
        } else if (viewName === 'population-genetics' && typeof window.cleanupPopulationGenetics === 'function') {
            window.cleanupPopulationGenetics();
        } else if (viewName === 'evidence' && typeof window.cleanupEvidenceMatrix === 'function') {
            window.cleanupEvidenceMatrix();
        }
        
        try {
            window[initFunc]();
            console.log(`Successfully initialized ${initFunc}`);
        } catch (error) {
            console.error(`Error initializing ${initFunc}:`, error);
            console.error('Stack trace:', error.stack);
            
            // Try debug mode as fallback
            const debugFunc = initFunc + 'Debug';
            if (window.debugMode && typeof window[debugFunc] === 'function') {
                console.warn(`Falling back to debug mode for ${viewName}`);
                window[debugFunc]();
            }
        }
    } else {
        console.warn(`No init function found for view: ${viewName}`);
        
        // Try debug mode
        const debugFunc = 'init' + viewName.charAt(0).toUpperCase() + viewName.slice(1).replace(/-./g, x => x[1].toUpperCase()) + 'Debug';
        if (window.debugMode && typeof window[debugFunc] === 'function') {
            console.warn(`Using debug mode for ${viewName}`);
            window[debugFunc]();
        }
    }
    
    // Clean up EM Symphony when leaving that view
    if (state.currentView === 'electromagnetic' && viewName !== 'electromagnetic') {
        if (typeof window.cleanupEmSymphony === 'function') {
            window.cleanupEmSymphony();
        }
    }
    
    // Special handling for Master Convergence visualization
    if (viewName === 'convergence' && typeof window.initMasterConvergence === 'function') {
        // Clean up previous instance if exists
        if (typeof window.cleanupMasterConvergence === 'function') {
            window.cleanupMasterConvergence();
        }
        window.initMasterConvergence();
    }
    
    // Clean up Master Convergence when leaving that view
    if (state.currentView === 'convergence' && viewName !== 'convergence') {
        if (typeof window.cleanupMasterConvergence === 'function') {
            window.cleanupMasterConvergence();
        }
    }
    
    // Clean up Bloodline Tree when leaving that view
    if (state.currentView === 'bloodlines' && viewName !== 'bloodlines') {
        if (typeof window.cleanupBloodlineTree === 'function') {
            window.cleanupBloodlineTree();
        }
    }
    
    // Clean up Evidence Matrix when leaving that view
    if (state.currentView === 'evidence' && viewName !== 'evidence') {
        if (typeof window.cleanupEvidenceMatrix === 'function') {
            window.cleanupEvidenceMatrix();
        }
    }
    
    // Special handling for Antarctic Revelation visualization
    if (viewName === 'antarctic' && typeof window.initAntarcticRevelation === 'function') {
        // Clean up previous instance if exists
        if (typeof window.cleanupAntarcticRevelation === 'function') {
            window.cleanupAntarcticRevelation();
        }
        window.initAntarcticRevelation();
    }
    
    // Clean up Antarctic Revelation when leaving that view
    if (state.currentView === 'antarctic' && viewName !== 'antarctic') {
        if (typeof window.cleanupAntarcticRevelation === 'function') {
            window.cleanupAntarcticRevelation();
        }
    }
    
    // Special handling for Live Tracker visualization
    if (viewName === 'live' && typeof window.initLiveTracker === 'function') {
        // Clean up previous instance if exists
        if (typeof window.cleanupLiveTracker === 'function') {
            window.cleanupLiveTracker();
        }
        window.initLiveTracker();
    }
    
    // Clean up Live Tracker when leaving that view
    if (state.currentView === 'live' && viewName !== 'live') {
        if (typeof window.cleanupLiveTracker === 'function') {
            window.cleanupLiveTracker();
        }
    }
    } // End of executeVisualization function
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
    // Update layer visibility using the function from visualizations.js
    if (typeof updateLayerVisibility === 'function') {
        updateLayerVisibility();
    } else {
        // Fallback: manually update visibility
        Object.keys(state.layers).forEach(layer => {
            const visibility = state.layers[layer] ? 'visible' : 'hidden';
            const elements = document.querySelectorAll(`.${layer}-layer`);
            elements.forEach(el => {
                el.style.visibility = visibility;
            });
        });
    }
}

// Utility functions
function capitalize(str) {
    // Handle hyphenated views like 'population-genetics'
    return str.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
}

// Export for use in other modules
window.appState = state;

// Initialize sound system
// Sound system is loaded via script tag in index.html

// Sound integration
let soundEnabled = false;

async function initializeSoundSystem() {
    if (!window.breakawaySound) return;
    await window.breakawaySound.initialize();
    
    // Don't auto-play sounds - let user control when sounds start
    // User can enable sounds through controls if desired
    window.breakawaySound.setCategoryVolume('ambient', 0.3);
    window.breakawaySound.setCategoryVolume('sacred', 0.4);
}

// Old toggle function no longer needed - sound control is now a dedicated page
// async function toggleSound() {
//     const soundToggle = document.getElementById('sound-toggle');
//     if (!window.breakawaySound) return;
//     
//     // Initialize if not already done
//     if (!window.breakawaySound.isInitialized) {
//         await window.breakawaySound.initialize();
//     }
//     
//     soundEnabled = !soundEnabled;
//     
//     if (soundEnabled) {
//         soundToggle.innerHTML = '🔊 Sound On';
//         // Only start Schumann resonance - the Earth's natural frequency
//         // Users can enable other sounds through the control panel
//         window.breakawaySound.playSchumannResonance(true, { rate: 0.05, depth: 0.3 });
//         
//         // Show sound control panel
//         if (!window.soundControlPanel) {
//             window.soundControlPanel = new window.SoundControlPanel();
//         }
//     } else {
//         // Stop all sounds
//         window.breakawaySound.stopAll();
//         soundToggle.innerHTML = '🔇 Sound Off';
//         
//         // Hide sound control panel
//         if (window.soundControlPanel && window.soundControlPanel.panel) {
//             window.soundControlPanel.close();
//             window.soundControlPanel = null;
//         }
//     }
// }

// Sound effects for UI interactions
function playNavigationSound() {
    // COMPLETELY DISABLED - NO MORE FUCKING SOUNDS
    return;
}

function playAlertSound(level = 1) {
    // COMPLETELY DISABLED - NO MORE FUCKING SOUNDS
    return;
}

// Integrate sound with existing functions
const originalSwitchView = switchView;
window.switchView = function(viewName) {
    // NO MORE NAVIGATION SOUNDS
    originalSwitchView(viewName);
    
    // View-specific sounds - DISABLED to prevent auto-playing
    // Users can manually enable sounds through the control panel
    /*
    if (window.breakawaySound) {
        switch(viewName) {
            case 'electromagnetic':
                window.breakawaySound.startAmbientLayer('quantumFlux');
                break;
            case 'underground':
                window.breakawaySound.startAmbientLayer('earthHum');
                break;
            case 'antarctic':
                window.breakawaySound.startAmbientLayer('crystalResonance');
                break;
            case 'convergence':
                window.breakawaySound.playBinauralBeat('gamma');
                break;
        }
    }
    */
};

// Sound for Schumann resonance updates
const originalStartLiveUpdates = startLiveUpdates;
window.startLiveUpdates = function() {
    originalStartLiveUpdates();
    
    // Override Schumann update to include sound
    let lastAlertTime = 0;
    // DISABLED - NO MORE FUCKING ALERTS
    /*
    setInterval(() => {
        if (state.schumann > 10 && soundEnabled) {
            const now = Date.now();
            // Only play alert once per minute to avoid annoying beeping
            if (now - lastAlertTime > 60000) {
                playAlertSound(2);
                lastAlertTime = now;
            }
        }
    }, 5000);
    */
};

// Initialize sound on first user interaction
let soundInitialized = false;
document.addEventListener('click', async () => {
    if (!soundInitialized) {
        soundInitialized = true;
        await initializeSoundSystem();
    }
}, { once: true });

// Sound system is already available as window.breakawaySound from sound-system.js

// Initialize Sound Control view
function initSoundControl() {
    console.log('Initializing Sound Control Center...');
    
    // Initialize sound system if not already done
    if (!window.breakawaySound.isInitialized) {
        initializeSoundSystem();
    }
    
    // Create full-page sound control panel
    const container = document.getElementById('sound-control-container');
    if (!container) return;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Create the sound control panel instance if it doesn't exist
    if (!window.soundControlPanel) {
        window.soundControlPanel = new SoundControlPanel();
    }
    
    // Initialize in full-page mode
    window.soundControlPanel.initFullPage(container);
}

// Export for use in switchView
window.initSoundControl = initSoundControl;