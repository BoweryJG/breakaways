// Electromagnetic Symphony Visualization
// Real-time Schumann resonance and Earth's electromagnetic field visualization

// Global variables for EM Symphony
let emSymphonyState = {
    audioContext: null,
    analyser: null,
    oscillators: {},
    gainNodes: {},
    isPlaying: false,
    frequencies: {
        schumann: {
            base: 7.83,
            current: 7.83,
            harmonics: [14.3, 20.8, 27.3, 33.8],
            color: '#00ffcc'
        },
        alpha: {
            base: 10.5,
            current: 10.5,
            range: [8, 13],
            color: '#ff00ff'
        },
        beta: {
            base: 20,
            current: 20,
            range: [13, 30],
            color: '#ffaa00'
        },
        gamma: {
            base: 40,
            current: 40,
            range: [30, 100],
            color: '#ff0066'
        }
    },
    anomalies: [],
    historicalData: [],
    solarActivity: {
        kIndex: 3,
        flareClass: 'M',
        protonFlux: 0.5
    },
    canvases: {},
    contexts: {},
    animationFrames: {}
};

// Initialize EM Symphony when switching to this view
function initElectromagnetic() {
    console.log('Initializing Electromagnetic Symphony...');
    
    // Clear any existing animations
    Object.values(emSymphonyState.animationFrames).forEach(frame => {
        cancelAnimationFrame(frame);
    });
    
    // Check if mobile
    const isMobile = window.mobileUtils ? window.mobileUtils.isMobile() : 
                     (window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    
    // Set up canvases
    setupCanvases(isMobile);
    
    // Initialize Web Audio API
    initializeAudio();
    
    // Set up controls
    setupControls();
    
    // Start visualizations
    startOscilloscope();
    startSpectrumAnalyzer();
    startWaterfallDisplay();
    startHistoricalGraph();
    startAnomalyDetection();
    
    // Start data simulation
    startDataSimulation();
}

function setupCanvases(isMobile) {
    const container = document.getElementById('electromagnetic');
    const canvasWidth = isMobile ? 300 : 600;
    const canvasHeight = isMobile ? 150 : 200;
    const waterfallHeight = isMobile ? 200 : 300;
    
    // Clear existing content except the header and sound control
    const header = container.querySelector('h2');
    const soundControl = container.querySelector('#sound-control-container');
    container.innerHTML = '';
    container.appendChild(header);
    
    // Initialize sound control panel if not already initialized
    if (soundControl) {
        container.appendChild(soundControl);
        if (typeof window.initSoundControl === 'function') {
            window.initSoundControl();
        }
    }
    
    // Create main visualization container
    const mainViz = document.createElement('div');
    mainViz.className = 'em-symphony-container';
    mainViz.innerHTML = `
        <div class="em-controls">
            <button id="em-play-pause" class="control-btn">
                <span class="play-icon">▶</span>
                <span class="pause-icon" style="display: none;">⏸</span>
            </button>
            <button id="em-reset" class="control-btn">Reset</button>
            <div class="frequency-info">
                <span style="color: var(--accent-color);">📍 Use the Sound Control Center to manage frequencies</span>
            </div>
        </div>
        
        <div class="visualization-grid">
            <div class="viz-panel oscilloscope">
                <h3>Live Oscilloscope</h3>
                <canvas id="oscilloscope-canvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>
                <div class="freq-display">
                    <span class="freq-label">Primary: </span>
                    <span id="primary-freq">7.83 Hz</span>
                </div>
            </div>
            
            <div class="viz-panel spectrum">
                <h3>Frequency Spectrum</h3>
                <canvas id="spectrum-canvas" width="${canvasWidth}" height="${canvasHeight}"></canvas>
                <div class="spectrum-legend">
                    <span class="legend-item schumann">Schumann</span>
                    <span class="legend-item alpha">Alpha</span>
                    <span class="legend-item beta">Beta</span>
                    <span class="legend-item gamma">Gamma</span>
                </div>
            </div>
            
            <div class="viz-panel waterfall">
                <h3>Frequency Waterfall</h3>
                <canvas id="waterfall-canvas" width="${canvasWidth}" height="${waterfallHeight}"></canvas>
                <div class="time-scale">
                    <span>-60s</span>
                    <span>-30s</span>
                    <span>Now</span>
                </div>
            </div>
            
            <div class="viz-panel historical">
                <h3>Historical Frequency Data</h3>
                <canvas id="historical-canvas" width="${canvasWidth}" height="${waterfallHeight}"></canvas>
                <div class="historical-controls">
                    <select id="time-range">
                        <option value="hour">Last Hour</option>
                        <option value="day" selected>Last 24 Hours</option>
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="info-panels">
            <div class="info-panel anomaly-panel">
                <h3>Anomaly Detection</h3>
                <div id="anomaly-list">
                    <div class="anomaly-item normal">
                        <span class="status-dot"></span>
                        System Normal - No anomalies detected
                    </div>
                </div>
            </div>
            
            <div class="info-panel solar-panel">
                <h3>Solar Activity Correlation</h3>
                <div class="solar-stats">
                    <div class="stat">
                        <span class="label">K-Index:</span>
                        <span id="k-index" class="value">3</span>
                    </div>
                    <div class="stat">
                        <span class="label">Solar Flare:</span>
                        <span id="flare-class" class="value">M-class</span>
                    </div>
                    <div class="stat">
                        <span class="label">Proton Flux:</span>
                        <span id="proton-flux" class="value">0.5</span>
                    </div>
                </div>
                <canvas id="solar-correlation" width="${isMobile ? 200 : 300}" height="${isMobile ? 100 : 150}"></canvas>
            </div>
            
            <div class="info-panel harmonics-panel">
                <h3>Harmonic Resonances</h3>
                <div id="harmonic-bars">
                    <div class="harmonic-bar" data-freq="7.83">
                        <div class="bar-fill" style="height: 80%"></div>
                        <span class="freq-label">7.83</span>
                    </div>
                    <div class="harmonic-bar" data-freq="14.3">
                        <div class="bar-fill" style="height: 60%"></div>
                        <span class="freq-label">14.3</span>
                    </div>
                    <div class="harmonic-bar" data-freq="20.8">
                        <div class="bar-fill" style="height: 40%"></div>
                        <span class="freq-label">20.8</span>
                    </div>
                    <div class="harmonic-bar" data-freq="27.3">
                        <div class="bar-fill" style="height: 30%"></div>
                        <span class="freq-label">27.3</span>
                    </div>
                    <div class="harmonic-bar" data-freq="33.8">
                        <div class="bar-fill" style="height: 20%"></div>
                        <span class="freq-label">33.8</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(mainViz);
    
    // Add debug panel
    const debugPanel = document.createElement('div');
    debugPanel.id = 'em-debug-panel';
    debugPanel.className = 'em-debug-panel';
    debugPanel.innerHTML = `
        <div class="debug-header">
            <h4>🔧 Debug Panel</h4>
            <button id="debug-toggle" class="debug-toggle">▼</button>
        </div>
        <div class="debug-content">
            <div class="debug-section">
                <h5>System Status</h5>
                <div class="debug-info">
                    <span class="debug-label">Sound System:</span>
                    <span id="debug-sound-status" class="debug-value">Not Initialized</span>
                </div>
                <div class="debug-info">
                    <span class="debug-label">Playing:</span>
                    <span id="debug-playing-status" class="debug-value">No</span>
                </div>
                <div class="debug-info">
                    <span class="debug-label">Active Sounds:</span>
                    <span id="debug-active-sounds" class="debug-value">0</span>
                </div>
                <div class="debug-info">
                    <span class="debug-label">Device Type:</span>
                    <span id="debug-device-type" class="debug-value">${isMobile ? 'Mobile' : 'Desktop'}</span>
                </div>
            </div>
            
            <div class="debug-section">
                <h5>Frequencies</h5>
                <div class="debug-frequencies">
                    <div class="debug-freq">
                        <span class="freq-name">Schumann:</span>
                        <span id="debug-freq-schumann" class="freq-value">7.83 Hz</span>
                    </div>
                    <div class="debug-freq">
                        <span class="freq-name">Alpha:</span>
                        <span id="debug-freq-alpha" class="freq-value">10.5 Hz</span>
                    </div>
                    <div class="debug-freq">
                        <span class="freq-name">Beta:</span>
                        <span id="debug-freq-beta" class="freq-value">20 Hz</span>
                    </div>
                    <div class="debug-freq">
                        <span class="freq-name">Gamma:</span>
                        <span id="debug-freq-gamma" class="freq-value">40 Hz</span>
                    </div>
                </div>
            </div>
            
            <div class="debug-section">
                <h5>Quick Actions</h5>
                <div class="debug-actions">
                    <button id="debug-start-schumann" class="debug-btn">Start Schumann</button>
                    <button id="debug-stop-all" class="debug-btn">Stop All</button>
                    <button id="debug-test-sound" class="debug-btn">Test Beep</button>
                    <button id="debug-refresh" class="debug-btn">Refresh</button>
                </div>
            </div>
            
            <div class="debug-section">
                <h5>Console</h5>
                <div id="debug-console" class="debug-console">
                    <div class="console-entry">System ready...</div>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(debugPanel);
    
    // Add custom CSS
    addCustomStyles();
    
    // Store canvas references
    emSymphonyState.canvases = {
        oscilloscope: document.getElementById('oscilloscope-canvas'),
        spectrum: document.getElementById('spectrum-canvas'),
        waterfall: document.getElementById('waterfall-canvas'),
        historical: document.getElementById('historical-canvas'),
        solar: document.getElementById('solar-correlation')
    };
    
    // Get contexts and apply mobile optimization
    Object.keys(emSymphonyState.canvases).forEach(key => {
        const canvas = emSymphonyState.canvases[key];
        emSymphonyState.contexts[key] = canvas.getContext('2d');
        
        // Apply mobile optimizations
        if (window.mobileUtils) {
            window.mobileUtils.optimizeCanvas(canvas);
        }
    });
    
    // Add touch event support for mobile
    if (isMobile) {
        addMobileTouchSupport();
    }
}

// Add mobile touch support
function addMobileTouchSupport() {
    // Only prevent touch on canvases to avoid scroll issues
    const canvases = document.querySelectorAll('.viz-panel canvas');
    canvases.forEach(canvas => {
        canvas.addEventListener('touchstart', function(e) {
            e.preventDefault();
        }, { passive: false });
    });
    
    // Make buttons more touch-friendly
    const buttons = document.querySelectorAll('.control-btn, .debug-btn, .preset-btn');
    buttons.forEach(btn => {
        btn.addEventListener('touchstart', function(e) {
            e.stopPropagation();
            this.classList.add('touched');
        });
        
        btn.addEventListener('touchend', function(e) {
            e.stopPropagation();
            this.classList.remove('touched');
            this.click();
        });
    });
    
    // Improve debug panel touch handling
    const debugHeader = document.querySelector('.debug-header');
    if (debugHeader) {
        debugHeader.addEventListener('touchstart', function(e) {
            e.stopPropagation();
        });
    }
    
    // Console log for debugging
    console.log('Mobile touch support enabled');
}

function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .em-symphony-container {
            padding: 20px;
        }
        
        .em-controls {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 30px;
            padding: 15px;
            background: rgba(0, 255, 204, 0.1);
            border: 1px solid var(--accent-color);
            border-radius: 5px;
        }
        
        .control-btn {
            padding: 10px 20px;
            background: var(--secondary-bg);
            color: var(--accent-color);
            border: 1px solid var(--accent-color);
            border-radius: 3px;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            transition: all 0.3s;
        }
        
        .control-btn:hover {
            background: var(--accent-color);
            color: var(--primary-bg);
        }
        
        .frequency-controls {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        
        .frequency-controls label {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
        }
        
        .visualization-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .viz-panel {
            background: var(--secondary-bg);
            border: 1px solid var(--grid-color);
            border-radius: 5px;
            padding: 20px;
            position: relative;
            overflow: hidden;
        }
        
        .viz-panel::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
            animation: scan 3s infinite;
        }
        
        .viz-panel h3 {
            margin-bottom: 15px;
            color: var(--accent-color);
            font-size: 1.2em;
        }
        
        .viz-panel canvas {
            display: block;
            width: 100%;
            height: auto;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid var(--grid-color);
        }
        
        .freq-display {
            margin-top: 10px;
            font-size: 1.1em;
            color: var(--accent-color);
        }
        
        .spectrum-legend {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 10px;
        }
        
        .legend-item {
            padding: 2px 10px;
            border-radius: 3px;
            font-size: 0.9em;
        }
        
        .legend-item.schumann { background: rgba(0, 255, 204, 0.3); color: #00ffcc; }
        .legend-item.alpha { background: rgba(255, 0, 255, 0.3); color: #ff00ff; }
        .legend-item.beta { background: rgba(255, 170, 0, 0.3); color: #ffaa00; }
        .legend-item.gamma { background: rgba(255, 0, 102, 0.3); color: #ff0066; }
        
        .time-scale {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            color: var(--text-secondary);
            font-size: 0.9em;
        }
        
        .info-panels {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }
        
        .info-panel {
            background: var(--secondary-bg);
            border: 1px solid var(--grid-color);
            border-radius: 5px;
            padding: 20px;
        }
        
        .info-panel h3 {
            margin-bottom: 15px;
            color: var(--accent-color);
        }
        
        .anomaly-item {
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 3px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .anomaly-item.normal {
            background: rgba(0, 255, 204, 0.1);
            border: 1px solid var(--accent-color);
        }
        
        .anomaly-item.warning {
            background: rgba(255, 170, 0, 0.1);
            border: 1px solid #ffaa00;
            color: #ffaa00;
        }
        
        .anomaly-item.critical {
            background: rgba(255, 0, 102, 0.1);
            border: 1px solid #ff0066;
            color: #ff0066;
            animation: pulse-border 1s infinite;
        }
        
        @keyframes pulse-border {
            0%, 100% { border-color: #ff0066; }
            50% { border-color: transparent; }
        }
        
        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: currentColor;
            animation: pulse 2s infinite;
        }
        
        .solar-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .solar-stats .stat {
            text-align: center;
            padding: 10px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 3px;
        }
        
        .solar-stats .label {
            display: block;
            font-size: 0.8em;
            color: var(--text-secondary);
            margin-bottom: 5px;
        }
        
        .solar-stats .value {
            display: block;
            font-size: 1.2em;
            color: var(--accent-color);
        }
        
        #harmonic-bars {
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
            height: 150px;
            padding: 10px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 3px;
        }
        
        .harmonic-bar {
            width: 50px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
            position: relative;
        }
        
        .bar-fill {
            width: 100%;
            background: linear-gradient(to top, var(--accent-color), var(--pulse-color));
            border-radius: 3px 3px 0 0;
            transition: height 0.3s ease;
        }
        
        .harmonic-bar .freq-label {
            position: absolute;
            bottom: -20px;
            font-size: 0.8em;
            color: var(--text-secondary);
        }
        
        .historical-controls {
            margin-top: 10px;
            text-align: center;
        }
        
        .historical-controls select {
            padding: 5px 10px;
            background: var(--secondary-bg);
            color: var(--text-primary);
            border: 1px solid var(--grid-color);
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        
        /* Debug Panel Styles */
        .em-debug-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid var(--accent-color);
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0, 255, 204, 0.3);
            z-index: 1000;
            font-family: 'Courier New', monospace;
            color: #fff;
            transition: all 0.3s;
        }
        
        /* Mobile-specific styles for EM Symphony */
        @media (max-width: 768px) {
            .em-symphony-container {
                padding: 10px;
            }
            
            .em-controls {
                flex-direction: column;
                gap: 10px;
                padding: 10px;
                margin-bottom: 20px;
            }
            
            .control-btn {
                width: 100%;
                padding: 12px 20px;
                font-size: 1em;
            }
            
            .frequency-info {
                margin-top: 10px;
                text-align: center;
            }
            
            .visualization-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .viz-panel {
                padding: 15px;
            }
            
            .viz-panel h3 {
                font-size: 1em;
            }
            
            .info-panels {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .info-panel {
                padding: 15px;
            }
            
            .solar-stats {
                grid-template-columns: 1fr;
            }
            
            #harmonic-bars {
                height: 120px;
            }
            
            .harmonic-bar {
                width: 40px;
            }
            
            .em-debug-panel {
                width: calc(100% - 20px);
                left: 10px;
                right: 10px;
                bottom: 10px;
                max-width: none;
            }
            
            .debug-frequencies {
                grid-template-columns: 1fr;
            }
            
            .debug-actions {
                grid-template-columns: 1fr;
            }
            
            .debug-btn {
                width: 100%;
                padding: 10px;
            }
        }
        
        /* Extra small devices */
        @media (max-width: 480px) {
            .viz-panel canvas {
                max-height: 150px;
            }
            
            .debug-console {
                height: 80px;
            }
            
            .debug-section h5 {
                font-size: 0.8em;
            }
            
            .debug-info {
                font-size: 0.8em;
            }
        }
        
        .em-debug-panel.collapsed .debug-content {
            display: none;
        }
        
        .debug-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background: rgba(0, 255, 204, 0.1);
            border-bottom: 1px solid var(--accent-color);
            cursor: pointer;
        }
        
        .debug-header h4 {
            margin: 0;
            color: var(--accent-color);
            font-size: 1em;
        }
        
        .debug-toggle {
            background: transparent;
            border: 1px solid var(--accent-color);
            color: var(--accent-color);
            width: 25px;
            height: 25px;
            cursor: pointer;
            font-size: 0.8em;
            transition: all 0.2s;
        }
        
        .debug-toggle:hover {
            background: var(--accent-color);
            color: #000;
        }
        
        .em-debug-panel.collapsed .debug-toggle {
            transform: rotate(-90deg);
        }
        
        .debug-content {
            padding: 15px;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .debug-section {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #333;
        }
        
        .debug-section:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .debug-section h5 {
            margin: 0 0 10px 0;
            color: var(--accent-color);
            font-size: 0.9em;
            text-transform: uppercase;
        }
        
        .debug-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0;
            font-size: 0.85em;
        }
        
        .debug-label {
            color: #999;
        }
        
        .debug-value {
            color: #fff;
            font-weight: bold;
        }
        
        .debug-value.active {
            color: var(--accent-color);
        }
        
        .debug-value.error {
            color: #ff0066;
        }
        
        .debug-frequencies {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        
        .debug-freq {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
            font-size: 0.85em;
        }
        
        .freq-name {
            color: #999;
        }
        
        .freq-value {
            color: var(--accent-color);
            font-weight: bold;
        }
        
        .debug-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
        }
        
        .debug-btn {
            padding: 8px 12px;
            background: transparent;
            border: 1px solid var(--accent-color);
            color: var(--accent-color);
            cursor: pointer;
            font-size: 0.8em;
            border-radius: 4px;
            transition: all 0.2s;
            font-family: 'Courier New', monospace;
        }
        
        .debug-btn:hover {
            background: var(--accent-color);
            color: #000;
        }
        
        .debug-btn:active {
            transform: scale(0.95);
        }
        
        .debug-console {
            height: 120px;
            background: #000;
            border: 1px solid #333;
            border-radius: 4px;
            padding: 10px;
            overflow-y: auto;
            font-size: 0.75em;
            font-family: 'Courier New', monospace;
        }
        
        .console-entry {
            margin-bottom: 5px;
            color: #0f0;
            opacity: 0.8;
        }
        
        .console-entry.error {
            color: #ff0066;
        }
        
        .console-entry.warning {
            color: #ffaa00;
        }
        
        .console-entry:last-child {
            margin-bottom: 0;
        }
        
        /* Scrollbar styling for debug panel */
        .debug-content::-webkit-scrollbar,
        .debug-console::-webkit-scrollbar {
            width: 6px;
        }
        
        .debug-content::-webkit-scrollbar-track,
        .debug-console::-webkit-scrollbar-track {
            background: #111;
        }
        
        .debug-content::-webkit-scrollbar-thumb,
        .debug-console::-webkit-scrollbar-thumb {
            background: var(--accent-color);
            border-radius: 3px;
        }
    `;
    document.head.appendChild(style);
}

async function initializeAudio() {
    // Use global sound system
    const soundSystem = window.breakawaySound;
    if (!soundSystem) {
        console.error('Global sound system not available');
        return;
    }
    
    // Initialize sound system if needed
    if (!soundSystem.isInitialized) {
        await soundSystem.initialize();
    }
    
    // Use global audio context and analyser
    emSymphonyState.audioContext = soundSystem.audioContext;
    emSymphonyState.analyser = soundSystem.analyser;
    
    // Store sound IDs for each frequency band
    emSymphonyState.soundIds = {};
    
    // Don't create oscillators yet - wait for play button
}

function setupControls() {
    // Play/Pause button
    const playPauseBtn = document.getElementById('em-play-pause');
    playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        togglePlayPause();
    });
    
    // Reset button
    const resetBtn = document.getElementById('em-reset');
    resetBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        resetFrequencies();
    });
    
    // Frequency toggles removed - sound control handled by Sound Control Center
    
    // Time range selector
    const timeRange = document.getElementById('time-range');
    if (timeRange) {
        timeRange.addEventListener('change', updateHistoricalGraph);
    }
    
    // Debug panel controls
    setupDebugPanel();
}

// Setup debug panel functionality
function setupDebugPanel() {
    const debugPanel = document.getElementById('em-debug-panel');
    const debugToggle = document.getElementById('debug-toggle');
    const debugConsole = document.getElementById('debug-console');
    
    // Toggle collapse/expand
    if (debugToggle) {
        debugToggle.addEventListener('click', () => {
            debugPanel.classList.toggle('collapsed');
        });
    }
    
    // Debug actions
    const startSchumannBtn = document.getElementById('debug-start-schumann');
    if (startSchumannBtn) {
        startSchumannBtn.addEventListener('click', () => {
            debugLog('Starting Schumann resonance...');
            if (window.breakawaySound && window.breakawaySound.isInitialized) {
                window.breakawaySound.playSchumannResonance(true, { rate: 0.05, depth: 0.3 });
                debugLog('Schumann resonance started', 'success');
                updateDebugStatus();
            } else {
                debugLog('Sound system not initialized!', 'error');
            }
        });
    }
    
    const stopAllBtn = document.getElementById('debug-stop-all');
    if (stopAllBtn) {
        stopAllBtn.addEventListener('click', () => {
            debugLog('Stopping all sounds...');
            if (window.breakawaySound) {
                window.breakawaySound.stopAll();
                emSymphonyState.isPlaying = false;
                debugLog('All sounds stopped', 'success');
                updateDebugStatus();
                
                // Update play/pause button
                const playPauseBtn = document.getElementById('em-play-pause');
                if (playPauseBtn) {
                    playPauseBtn.querySelector('.play-icon').style.display = 'inline';
                    playPauseBtn.querySelector('.pause-icon').style.display = 'none';
                }
            }
        });
    }
    
    const testSoundBtn = document.getElementById('debug-test-sound');
    if (testSoundBtn) {
        testSoundBtn.addEventListener('click', () => {
            debugLog('Playing test beep...');
            if (window.breakawaySound && window.breakawaySound.isInitialized) {
                window.breakawaySound.playEventSound('activation');
                debugLog('Test beep played', 'success');
            } else {
                debugLog('Sound system not initialized!', 'error');
            }
        });
    }
    
    const refreshBtn = document.getElementById('debug-refresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            debugLog('Refreshing EM Symphony...');
            cleanupEmSymphony();
            setTimeout(() => {
                initElectromagnetic();
                debugLog('EM Symphony refreshed', 'success');
            }, 100);
        });
    }
    
    // Update debug panel status
    updateDebugStatus();
    
    // Update status every second
    setInterval(updateDebugStatus, 1000);
}

// Log to debug console
function debugLog(message, type = 'info') {
    const debugConsole = document.getElementById('debug-console');
    if (!debugConsole) return;
    
    const entry = document.createElement('div');
    entry.className = 'console-entry';
    if (type === 'error') entry.classList.add('error');
    if (type === 'warning') entry.classList.add('warning');
    
    const timestamp = new Date().toLocaleTimeString();
    entry.textContent = `[${timestamp}] ${message}`;
    
    debugConsole.appendChild(entry);
    
    // Keep only last 20 entries
    while (debugConsole.children.length > 20) {
        debugConsole.removeChild(debugConsole.firstChild);
    }
    
    // Scroll to bottom
    debugConsole.scrollTop = debugConsole.scrollHeight;
}

// Update debug panel status
function updateDebugStatus() {
    const soundSystem = window.breakawaySound;
    
    // Sound system status
    const soundStatus = document.getElementById('debug-sound-status');
    if (soundStatus) {
        if (soundSystem && soundSystem.isInitialized) {
            soundStatus.textContent = 'Initialized';
            soundStatus.className = 'debug-value active';
        } else {
            soundStatus.textContent = 'Not Initialized';
            soundStatus.className = 'debug-value error';
        }
    }
    
    // Playing status
    const playingStatus = document.getElementById('debug-playing-status');
    if (playingStatus) {
        playingStatus.textContent = emSymphonyState.isPlaying ? 'Yes' : 'No';
        playingStatus.className = emSymphonyState.isPlaying ? 'debug-value active' : 'debug-value';
    }
    
    // Active sounds count
    const activeSounds = document.getElementById('debug-active-sounds');
    if (activeSounds && soundSystem) {
        const count = soundSystem.getAllActiveSounds().length;
        activeSounds.textContent = count;
        activeSounds.className = count > 0 ? 'debug-value active' : 'debug-value';
    }
    
    // Update frequencies
    Object.keys(emSymphonyState.frequencies).forEach(band => {
        const elem = document.getElementById(`debug-freq-${band}`);
        if (elem) {
            elem.textContent = `${emSymphonyState.frequencies[band].current.toFixed(2)} Hz`;
        }
    });
}

function togglePlayPause() {
    const btn = document.getElementById('em-play-pause');
    const playIcon = btn.querySelector('.play-icon');
    const pauseIcon = btn.querySelector('.pause-icon');
    const soundSystem = window.breakawaySound;
    
    emSymphonyState.isPlaying = !emSymphonyState.isPlaying;
    
    if (emSymphonyState.isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'inline';
        
        // Start all frequencies (user controls which ones play via Sound Control Center)
        Object.keys(emSymphonyState.frequencies).forEach(band => {
            startEMFrequency(band);
        });
        
    } else {
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';
        
        // Stop all EM Symphony frequencies
        Object.keys(emSymphonyState.soundIds).forEach(band => {
            const soundId = emSymphonyState.soundIds[band];
            if (soundId && soundSystem) {
                soundSystem.stopSound(soundId);
                delete emSymphonyState.soundIds[band];
            }
        });
    }
}

// Helper function to start a frequency using global sound system
function startEMFrequency(band) {
    const soundSystem = window.breakawaySound;
    if (!soundSystem || !soundSystem.isInitialized) return;
    
    const freq = emSymphonyState.frequencies[band];
    const oscillator = soundSystem.audioContext.createOscillator();
    const gainNode = soundSystem.audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = freq.current;
    gainNode.gain.value = 0.15;
    
    // Connect through page-specific mixer
    oscillator.connect(gainNode);
    
    // Get or create page-specific mixer
    let pageMixer = soundSystem.gainNodes.get('em-symphony');
    if (!pageMixer) {
        pageMixer = soundSystem.audioContext.createGain();
        pageMixer.connect(soundSystem.masterGain);
        soundSystem.gainNodes.set('em-symphony', pageMixer);
    }
    
    gainNode.connect(pageMixer);
    oscillator.start();
    
    // Register with sound system
    const soundId = soundSystem.registerSound({
        name: `EM ${band.charAt(0).toUpperCase() + band.slice(1)}`,
        type: 'oscillator',
        category: 'em-symphony',
        frequency: freq.current,
        source: 'em-symphony',
        volume: 0.15,
        metadata: {
            band: band,
            color: freq.color
        }
    });
    
    // Store references
    emSymphonyState.soundIds[band] = soundId;
    
    // Store oscillator reference for frequency updates
    if (!emSymphonyState.oscillators[band]) {
        emSymphonyState.oscillators[band] = oscillator;
    }
}

function resetFrequencies() {
    // Reset all frequencies to base values
    Object.keys(emSymphonyState.frequencies).forEach(band => {
        const freq = emSymphonyState.frequencies[band];
        freq.current = freq.base;
        
        if (emSymphonyState.oscillators[band]) {
            emSymphonyState.oscillators[band].frequency.setTargetAtTime(freq.base, emSymphonyState.audioContext.currentTime, 0.1);
        }
    });
    
    // Clear anomalies
    emSymphonyState.anomalies = [];
    updateAnomalyDisplay();
}

function startOscilloscope() {
    const canvas = emSymphonyState.canvases.oscilloscope;
    const ctx = emSymphonyState.contexts.oscilloscope;
    const width = canvas.width;
    const height = canvas.height;
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(42, 42, 42, 0.5)';
        ctx.lineWidth = 1;
        for (let i = 0; i < width; i += 50) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
        for (let i = 0; i < height; i += 50) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
        
        // Draw waveforms for each active frequency
        Object.keys(emSymphonyState.frequencies).forEach(band => {
            // Check if this frequency is active in the sound system
            const soundId = emSymphonyState.soundIds[band];
            if (!soundId) return;
            
            const freq = emSymphonyState.frequencies[band];
            ctx.strokeStyle = freq.color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.8;
            
            ctx.beginPath();
            for (let x = 0; x < width; x++) {
                const t = x / width * 4 * Math.PI;
                const y = height / 2 + Math.sin(t * freq.current / 7.83) * height / 4 * (emSymphonyState.isPlaying ? 1 : 0.2);
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
            ctx.globalAlpha = 1;
        });
        
        emSymphonyState.animationFrames.oscilloscope = requestAnimationFrame(draw);
    }
    
    draw();
}

function startSpectrumAnalyzer() {
    const canvas = emSymphonyState.canvases.spectrum;
    const ctx = emSymphonyState.contexts.spectrum;
    const width = canvas.width;
    const height = canvas.height;
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw frequency bars
        const barWidth = width / 100;
        const freqRange = 100; // 0-100 Hz
        
        Object.keys(emSymphonyState.frequencies).forEach(band => {
            // Check if this frequency is active in the sound system
            const soundId = emSymphonyState.soundIds[band];
            if (!soundId) return;
            
            const freq = emSymphonyState.frequencies[band];
            const x = (freq.current / freqRange) * width;
            const amplitude = emSymphonyState.isPlaying ? 0.8 : 0.2;
            const barHeight = height * amplitude * (1 + Math.random() * 0.1);
            
            // Draw main frequency bar
            ctx.fillStyle = freq.color;
            ctx.globalAlpha = 0.8;
            ctx.fillRect(x - barWidth/2, height - barHeight, barWidth, barHeight);
            
            // Draw harmonics for Schumann
            if (band === 'schumann' && freq.harmonics) {
                freq.harmonics.forEach((harmonic, i) => {
                    const hx = (harmonic / freqRange) * width;
                    const hHeight = barHeight * (0.8 - i * 0.15);
                    ctx.globalAlpha = 0.5 - i * 0.1;
                    ctx.fillRect(hx - barWidth/2, height - hHeight, barWidth, hHeight);
                });
            }
            
            ctx.globalAlpha = 1;
        });
        
        // Draw frequency scale
        ctx.strokeStyle = 'rgba(160, 160, 160, 0.5)';
        ctx.lineWidth = 1;
        ctx.font = '10px Courier New';
        ctx.fillStyle = 'rgba(160, 160, 160, 0.8)';
        
        for (let f = 0; f <= 100; f += 20) {
            const x = (f / freqRange) * width;
            ctx.beginPath();
            ctx.moveTo(x, height);
            ctx.lineTo(x, height - 10);
            ctx.stroke();
            ctx.fillText(`${f}Hz`, x - 15, height - 15);
        }
        
        emSymphonyState.animationFrames.spectrum = requestAnimationFrame(draw);
    }
    
    draw();
}

function startWaterfallDisplay() {
    const canvas = emSymphonyState.canvases.waterfall;
    const ctx = emSymphonyState.contexts.waterfall;
    const width = canvas.width;
    const height = canvas.height;
    
    // Create image data for waterfall
    const imageData = ctx.createImageData(width, 1);
    const waterfallData = [];
    
    function draw() {
        // Shift existing data down
        const currentData = ctx.getImageData(0, 0, width, height - 1);
        ctx.putImageData(currentData, 0, 1);
        
        // Generate new line of data
        const newLine = ctx.createImageData(width, 1);
        const data = newLine.data;
        
        for (let x = 0; x < width; x++) {
            const freq = (x / width) * 100; // 0-100 Hz range
            let intensity = 0;
            
            // Check each frequency band
            Object.keys(emSymphonyState.frequencies).forEach(band => {
                // Check if this frequency is active in the sound system
                const soundId = emSymphonyState.soundIds[band];
                if (!soundId) return;
                
                const f = emSymphonyState.frequencies[band];
                const distance = Math.abs(freq - f.current);
                
                if (distance < 5) {
                    intensity += (1 - distance / 5) * (emSymphonyState.isPlaying ? 0.8 : 0.2);
                }
                
                // Add harmonics for Schumann
                if (band === 'schumann' && f.harmonics) {
                    f.harmonics.forEach(harmonic => {
                        const hDistance = Math.abs(freq - harmonic);
                        if (hDistance < 3) {
                            intensity += (1 - hDistance / 3) * 0.3 * (emSymphonyState.isPlaying ? 1 : 0.2);
                        }
                    });
                }
            });
            
            // Map frequency to color
            let r = 0, g = 0, b = 0;
            
            if (freq < 15) { // Schumann range - cyan
                r = 0;
                g = intensity * 255;
                b = intensity * 204;
            } else if (freq < 30) { // Alpha/Beta range - purple to orange
                const mix = (freq - 15) / 15;
                r = intensity * 255;
                g = intensity * (255 * (1 - mix));
                b = intensity * (255 * (1 - mix));
            } else { // Gamma range - red
                r = intensity * 255;
                g = intensity * 0;
                b = intensity * 102;
            }
            
            const idx = x * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
        }
        
        ctx.putImageData(newLine, 0, 0);
        
        emSymphonyState.animationFrames.waterfall = requestAnimationFrame(draw);
    }
    
    draw();
}

function startHistoricalGraph() {
    const canvas = emSymphonyState.canvases.historical;
    const ctx = emSymphonyState.contexts.historical;
    const width = canvas.width;
    const height = canvas.height;
    
    // Generate initial historical data
    if (emSymphonyState.historicalData.length === 0) {
        for (let i = 0; i < 288; i++) { // 24 hours of 5-minute intervals
            emSymphonyState.historicalData.push({
                timestamp: Date.now() - (288 - i) * 5 * 60 * 1000,
                schumann: 7.83 + Math.random() * 2 - 1,
                alpha: 10.5 + Math.random() * 3 - 1.5,
                beta: 20 + Math.random() * 5 - 2.5,
                gamma: 40 + Math.random() * 10 - 5,
                anomaly: Math.random() > 0.95
            });
        }
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(42, 42, 42, 0.5)';
        ctx.lineWidth = 1;
        
        // Vertical grid lines (time)
        for (let i = 0; i < 6; i++) {
            const x = (i / 5) * width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        // Horizontal grid lines (frequency)
        for (let i = 0; i < 5; i++) {
            const y = (i / 4) * height;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw each frequency line
        const dataPoints = emSymphonyState.historicalData.slice(-144); // Last 12 hours
        const xStep = width / dataPoints.length;
        
        Object.keys(emSymphonyState.frequencies).forEach(band => {
            const freq = emSymphonyState.frequencies[band];
            ctx.strokeStyle = freq.color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.8;
            
            ctx.beginPath();
            dataPoints.forEach((point, i) => {
                const x = i * xStep;
                const value = point[band];
                const normalized = (value - freq.base) / freq.base * 0.5 + 0.5;
                const y = height - (normalized * height * 0.8 + height * 0.1);
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                
                // Mark anomalies
                if (point.anomaly && band === 'schumann') {
                    ctx.save();
                    ctx.fillStyle = '#ff0066';
                    ctx.globalAlpha = 1;
                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            });
            ctx.stroke();
            ctx.globalAlpha = 1;
        });
        
        // Draw labels
        ctx.font = '12px Courier New';
        ctx.fillStyle = 'rgba(160, 160, 160, 0.8)';
        ctx.fillText('Time →', width - 50, height - 5);
        ctx.save();
        ctx.translate(10, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Frequency', 0, 0);
        ctx.restore();
        
        emSymphonyState.animationFrames.historical = requestAnimationFrame(draw);
    }
    
    draw();
}

function startAnomalyDetection() {
    // Check for anomalies every 2 seconds
    setInterval(() => {
        if (!emSymphonyState.isPlaying) return;
        
        // Simulate anomaly detection
        const hasAnomaly = Math.random() > 0.85;
        
        if (hasAnomaly) {
            const types = ['spike', 'harmonic', 'interference', 'solar'];
            const type = types[Math.floor(Math.random() * types.length)];
            const severity = Math.random() > 0.7 ? 'critical' : 'warning';
            
            const anomaly = {
                timestamp: Date.now(),
                type: type,
                severity: severity,
                frequency: Math.random() * 50,
                description: generateAnomalyDescription(type, severity)
            };
            
            emSymphonyState.anomalies.unshift(anomaly);
            
            // Keep only last 5 anomalies
            if (emSymphonyState.anomalies.length > 5) {
                emSymphonyState.anomalies.pop();
            }
            
            updateAnomalyDisplay();
        }
    }, 2000);
}

function generateAnomalyDescription(type, severity) {
    const descriptions = {
        spike: {
            warning: 'Frequency spike detected at ',
            critical: 'CRITICAL: Major frequency disruption at '
        },
        harmonic: {
            warning: 'Unusual harmonic resonance detected',
            critical: 'CRITICAL: Harmonic cascade event'
        },
        interference: {
            warning: 'External interference detected',
            critical: 'CRITICAL: Strong EM interference'
        },
        solar: {
            warning: 'Solar activity affecting frequencies',
            critical: 'CRITICAL: Solar storm impact detected'
        }
    };
    
    return descriptions[type][severity];
}

function updateAnomalyDisplay() {
    const anomalyList = document.getElementById('anomaly-list');
    
    if (emSymphonyState.anomalies.length === 0) {
        anomalyList.innerHTML = `
            <div class="anomaly-item normal">
                <span class="status-dot"></span>
                System Normal - No anomalies detected
            </div>
        `;
        return;
    }
    
    anomalyList.innerHTML = emSymphonyState.anomalies.map(anomaly => {
        const time = new Date(anomaly.timestamp).toLocaleTimeString();
        return `
            <div class="anomaly-item ${anomaly.severity}">
                <span class="status-dot"></span>
                <div>
                    <div>${anomaly.description}${anomaly.frequency ? anomaly.frequency.toFixed(2) + ' Hz' : ''}</div>
                    <div style="font-size: 0.8em; color: var(--text-secondary);">${time}</div>
                </div>
            </div>
        `;
    }).join('');
}

function startDataSimulation() {
    // Simulate frequency variations
    setInterval(() => {
        if (!emSymphonyState.isPlaying) return;
        
        // Update frequencies with small variations
        Object.keys(emSymphonyState.frequencies).forEach(band => {
            const freq = emSymphonyState.frequencies[band];
            const variation = (Math.random() - 0.5) * 0.5;
            freq.current = freq.base + variation;
            
            // Update oscillator frequency if it exists
            if (emSymphonyState.oscillators[band] && emSymphonyState.audioContext) {
                emSymphonyState.oscillators[band].frequency.setTargetAtTime(
                    freq.current, 
                    emSymphonyState.audioContext.currentTime, 
                    0.5
                );
                
                // Update sound registry
                const soundId = emSymphonyState.soundIds[band];
                const soundSystem = window.breakawaySound;
                if (soundId && soundSystem) {
                    soundSystem.updateSound(soundId, { frequency: freq.current });
                }
            }
        });
        
        // Update primary frequency display
        document.getElementById('primary-freq').textContent = 
            `${emSymphonyState.frequencies.schumann.current.toFixed(2)} Hz`;
        
        // Update harmonic bars
        updateHarmonicBars();
        
        // Add new historical data point
        emSymphonyState.historicalData.push({
            timestamp: Date.now(),
            schumann: emSymphonyState.frequencies.schumann.current,
            alpha: emSymphonyState.frequencies.alpha.current,
            beta: emSymphonyState.frequencies.beta.current,
            gamma: emSymphonyState.frequencies.gamma.current,
            anomaly: emSymphonyState.anomalies.length > 0 && 
                     emSymphonyState.anomalies[0].timestamp > Date.now() - 5000
        });
        
        // Keep only last 24 hours of data
        if (emSymphonyState.historicalData.length > 288) {
            emSymphonyState.historicalData.shift();
        }
        
        // Update solar activity correlation
        updateSolarActivity();
        
    }, 1000);
}

function updateHarmonicBars() {
    const bars = document.querySelectorAll('.harmonic-bar');
    bars.forEach((bar, index) => {
        const fill = bar.querySelector('.bar-fill');
        const baseHeight = 80 - index * 15;
        const variation = Math.random() * 20 - 10;
        const height = Math.max(10, Math.min(100, baseHeight + variation));
        fill.style.height = `${height}%`;
    });
}

function updateSolarActivity() {
    // Simulate solar activity changes
    if (Math.random() > 0.9) {
        emSymphonyState.solarActivity.kIndex = Math.floor(Math.random() * 9);
        emSymphonyState.solarActivity.flareClass = ['A', 'B', 'C', 'M', 'X'][Math.floor(Math.random() * 5)];
        emSymphonyState.solarActivity.protonFlux = Math.random() * 2;
        
        document.getElementById('k-index').textContent = emSymphonyState.solarActivity.kIndex;
        document.getElementById('flare-class').textContent = emSymphonyState.solarActivity.flareClass + '-class';
        document.getElementById('proton-flux').textContent = emSymphonyState.solarActivity.protonFlux.toFixed(2);
        
        // Update correlation graph
        drawSolarCorrelation();
    }
}

function drawSolarCorrelation() {
    const canvas = emSymphonyState.canvases.solar;
    const ctx = emSymphonyState.contexts.solar;
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw correlation visualization
    const correlation = emSymphonyState.solarActivity.kIndex / 9;
    const barWidth = width / 3;
    
    // K-Index bar
    ctx.fillStyle = emSymphonyState.solarActivity.kIndex > 5 ? '#ff0066' : '#00ffcc';
    ctx.fillRect(0, height - height * correlation, barWidth - 5, height * correlation);
    
    // Flare class bar
    const flareIntensity = ['A', 'B', 'C', 'M', 'X'].indexOf(emSymphonyState.solarActivity.flareClass) / 4;
    ctx.fillStyle = flareIntensity > 0.5 ? '#ffaa00' : '#00ffcc';
    ctx.fillRect(barWidth, height - height * flareIntensity, barWidth - 5, height * flareIntensity);
    
    // Proton flux bar
    const protonNormalized = emSymphonyState.solarActivity.protonFlux / 2;
    ctx.fillStyle = protonNormalized > 0.7 ? '#ff00ff' : '#00ffcc';
    ctx.fillRect(barWidth * 2, height - height * protonNormalized, barWidth - 5, height * protonNormalized);
}

function updateHistoricalGraph() {
    // This would update the historical graph based on the selected time range
    // For now, it just triggers a redraw
    console.log('Updating historical graph for range:', document.getElementById('time-range').value);
}

// Clean up function
function cleanupEmSymphony() {
    // Stop all animations
    Object.values(emSymphonyState.animationFrames).forEach(frame => {
        cancelAnimationFrame(frame);
    });
    
    // Stop all EM Symphony sounds using global sound system
    const soundSystem = window.breakawaySound;
    if (soundSystem) {
        Object.keys(emSymphonyState.soundIds).forEach(band => {
            const soundId = emSymphonyState.soundIds[band];
            if (soundId) {
                soundSystem.stopSound(soundId);
            }
        });
    }
    
    // Don't close audio context - it's managed by global sound system
    
    // Reset state
    emSymphonyState = {
        audioContext: null,
        analyser: null,
        oscillators: {},
        gainNodes: {},
        isPlaying: false,
        frequencies: {
            schumann: {
                base: 7.83,
                current: 7.83,
                harmonics: [14.3, 20.8, 27.3, 33.8],
                color: '#00ffcc'
            },
            alpha: {
                base: 10.5,
                current: 10.5,
                range: [8, 13],
                color: '#ff00ff'
            },
            beta: {
                base: 20,
                current: 20,
                range: [13, 30],
                color: '#ffaa00'
            },
            gamma: {
                base: 40,
                current: 40,
                range: [30, 100],
                color: '#ff0066'
            }
        },
        anomalies: [],
        historicalData: [],
        solarActivity: {
            kIndex: 3,
            flareClass: 'M',
            protonFlux: 0.5
        },
        canvases: {},
        contexts: {},
        animationFrames: {}
    };
}

// Export cleanup function for main.js
window.cleanupEmSymphony = cleanupEmSymphony;

// Handle window resize
function handleEMResize() {
    const container = document.getElementById('electromagnetic');
    if (container && emSymphonyState.canvases.oscilloscope) {
        // Reinitialize with new dimensions
        initElectromagnetic();
    }
}

// Add resize listener with debouncing
let emResizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(emResizeTimeout);
    emResizeTimeout = setTimeout(() => {
        const container = document.getElementById('electromagnetic');
        if (container && container.querySelector('canvas')) {
            handleEMResize();
        }
    }, 250);
});

// Export for use in main.js
window.initElectromagnetic = initElectromagnetic;