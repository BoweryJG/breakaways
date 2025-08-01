// Sound Control Panel - Unified Sound Interface
// Provides visual control and monitoring of all sounds in the Breakaway system

class SoundControlPanel {
    constructor() {
        this.panel = null;
        this.isMinimized = false;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.position = { x: 20, y: 100 };
        
        // UI elements
        this.elements = {
            activeSoundsList: null,
            masterVolume: null,
            categoryMixers: {},
            visualizer: null,
            minimizeBtn: null
        };
        
        // Visualization
        this.visualizerCanvas = null;
        this.visualizerCtx = null;
        this.animationFrame = null;
        
        // Sound system reference
        this.soundSystem = window.breakawaySound;
        
        // Update interval
        this.updateInterval = null;
        
        // Store bound event handlers for proper cleanup
        this.eventHandlers = {
            soundRegistered: this.onSoundRegistered.bind(this),
            soundUnregistered: this.onSoundUnregistered.bind(this),
            soundUpdated: this.onSoundUpdated.bind(this),
            soundStopped: this.onSoundStopped.bind(this)
        };
        
        // Store bound drag handlers for cleanup
        this.dragHandlers = {
            mouseMove: (e) => this.drag(e),
            mouseUp: () => this.endDrag()
        };
        
        // Sound descriptions for user-friendly display
        this.soundDescriptions = {
            // Core frequencies
            'schumann': { 
                name: 'Earth Resonance', 
                description: 'Natural electromagnetic frequency of Earth (7.83 Hz)',
                category: 'core',
                icon: '🌍'
            },
            
            // Ambient layers
            'deepSpace': { 
                name: 'Space Ambience', 
                description: 'Deep cosmic background atmosphere',
                category: 'ambient',
                icon: '🌌'
            },
            'earthHum': { 
                name: 'Earth Hum', 
                description: 'Low frequency vibrations from Earth\'s core',
                category: 'ambient',
                icon: '🌏'
            },
            'cosmicWind': { 
                name: 'Cosmic Wind', 
                description: 'Solar wind and stellar radiation patterns',
                category: 'ambient',
                icon: '💫'
            },
            'crystalResonance': { 
                name: 'Crystal Resonance', 
                description: 'Harmonic frequencies from crystalline structures',
                category: 'ambient',
                icon: '💎'
            },
            'ancientEchoes': { 
                name: 'Ancient Echoes', 
                description: 'Resonances from megalithic sites',
                category: 'ambient',
                icon: '🗿'
            },
            'quantumFlux': { 
                name: 'Quantum Field', 
                description: 'Quantum vacuum fluctuations',
                category: 'ambient',
                icon: '⚛️'
            },
            
            // Binaural beats
            'delta': { 
                name: 'Delta Waves', 
                description: 'Deep sleep and healing (0.5-4 Hz)',
                category: 'binaural',
                icon: '😴'
            },
            'theta': { 
                name: 'Theta Waves', 
                description: 'Meditation and creativity (4-8 Hz)',
                category: 'binaural',
                icon: '🧘'
            },
            'alpha': { 
                name: 'Alpha Waves', 
                description: 'Relaxation and focus (8-14 Hz)',
                category: 'binaural',
                icon: '🧠'
            },
            'beta': { 
                name: 'Beta Waves', 
                description: 'Alertness and concentration (14-30 Hz)',
                category: 'binaural',
                icon: '⚡'
            },
            'gamma': { 
                name: 'Gamma Waves', 
                description: 'Higher consciousness (30-100 Hz)',
                category: 'binaural',
                icon: '✨'
            },
            
            // Event sounds
            'activation': { 
                name: 'Activation', 
                description: 'Node or system activation',
                category: 'events',
                icon: '🔔'
            },
            'alert': { 
                name: 'Alert', 
                description: 'Important notification',
                category: 'events',
                icon: '⚠️'
            },
            'discovery': { 
                name: 'Discovery', 
                description: 'New pattern or anomaly detected',
                category: 'events',
                icon: '🔍'
            },
            'connection': { 
                name: 'Connection', 
                description: 'Link established between nodes',
                category: 'events',
                icon: '🔗'
            },
            'anomaly': { 
                name: 'Anomaly', 
                description: 'Unusual pattern detected',
                category: 'events',
                icon: '❗'
            },
            'portal': { 
                name: 'Portal', 
                description: 'Dimensional gateway activation',
                category: 'events',
                icon: '🌀'
            },
            'crystalline': { 
                name: 'Crystal Tone', 
                description: 'High frequency crystalline resonance',
                category: 'events',
                icon: '🔮'
            }
        };
        
        // Sound presets
        this.presets = {
            minimal: {
                name: 'Minimal',
                description: 'Only Earth resonance',
                sounds: ['schumann']
            },
            ambient: {
                name: 'Ambient',
                description: 'Earth resonance + space ambience',
                sounds: ['schumann', 'deepSpace']
            },
            meditation: {
                name: 'Meditation',
                description: 'Theta waves + crystal resonance',
                sounds: ['schumann', 'theta', 'crystalResonance']
            },
            full: {
                name: 'Full Experience',
                description: 'All atmospheric sounds',
                sounds: ['schumann', 'deepSpace', 'quantumFlux', 'alpha']
            }
        };
        
        // Don't auto-initialize - wait for explicit init call
        // this.init();
    }
    
    init() {
        if (this.initialized) return;
        this.initialized = true;
        // Create panel structure
        this.createPanel();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start update loop
        this.startUpdateLoop();
        
        // Subscribe to sound system events using stored handlers
        if (this.soundSystem) {
            this.soundSystem.on('soundRegistered', this.eventHandlers.soundRegistered);
            this.soundSystem.on('soundUnregistered', this.eventHandlers.soundUnregistered);
            this.soundSystem.on('soundUpdated', this.eventHandlers.soundUpdated);
            this.soundSystem.on('soundStopped', this.eventHandlers.soundStopped);
        }
    }
    
    // Initialize as full-page view
    initFullPage(container) {
        if (this.initialized) return;
        this.initialized = true;
        this.isFullPage = true;
        
        // Initialize sound system first
        if (!this.soundSystem.isInitialized) {
            this.soundSystem.initialize();
        }
        
        // Create full-page panel structure
        this.createFullPagePanel(container);
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start update loop
        this.startUpdateLoop();
        
        // Subscribe to sound system events
        if (this.soundSystem) {
            this.soundSystem.on('soundRegistered', this.eventHandlers.soundRegistered);
            this.soundSystem.on('soundUnregistered', this.eventHandlers.soundUnregistered);
            this.soundSystem.on('soundUpdated', this.eventHandlers.soundUpdated);
            this.soundSystem.on('soundStopped', this.eventHandlers.soundStopped);
        }
        
        // Don't auto-start any sounds - wait for user to click play
        this.soundSystemActive = false;
    }
    
    createPanel() {
        // Create main panel container
        this.panel = document.createElement('div');
        this.panel.id = 'sound-control-panel';
        this.panel.className = 'sound-panel';
        this.panel.innerHTML = `
            <div class="sound-panel-header">
                <h3>🎵 Sound Control Center</h3>
                <div class="panel-controls">
                    <button id="minimize-panel" class="panel-btn">_</button>
                    <button id="close-panel" class="panel-btn">×</button>
                </div>
            </div>
            
            <div class="sound-panel-content">
                <!-- Master Volume -->
                <div class="master-section">
                    <div class="master-controls">
                        <div class="volume-control">
                            <label>Master Volume</label>
                            <input type="range" id="master-volume" min="0" max="100" value="70">
                            <span id="master-volume-value">70%</span>
                        </div>
                        <button id="mute-all" class="control-btn">🔇 Mute All</button>
                    </div>
                </div>
                
                <!-- Sound Presets -->
                <div class="presets-section">
                    <h4>Quick Presets</h4>
                    <div class="preset-buttons">
                        <button class="preset-btn" data-preset="minimal" title="Only Earth resonance">
                            <span class="preset-icon">🌍</span>
                            <span class="preset-name">Minimal</span>
                        </button>
                        <button class="preset-btn" data-preset="ambient" title="Earth resonance + space ambience">
                            <span class="preset-icon">🌌</span>
                            <span class="preset-name">Ambient</span>
                        </button>
                        <button class="preset-btn" data-preset="meditation" title="Theta waves + crystal resonance">
                            <span class="preset-icon">🧘</span>
                            <span class="preset-name">Meditation</span>
                        </button>
                        <button class="preset-btn" data-preset="full" title="All atmospheric sounds">
                            <span class="preset-icon">✨</span>
                            <span class="preset-name">Full</span>
                        </button>
                    </div>
                </div>
                
                <!-- Active Sounds by Category -->
                <div class="sounds-by-category">
                    <div class="sound-category" data-category="core">
                        <h4 class="category-header">
                            <span class="category-icon">🌍</span>
                            Core Frequencies
                            <span class="category-status">Always On</span>
                        </h4>
                        <div class="category-sounds" id="core-sounds">
                            <!-- Populated dynamically -->
                        </div>
                    </div>
                    
                    <div class="sound-category" data-category="ambient">
                        <h4 class="category-header collapsible" data-target="ambient-sounds">
                            <span class="category-icon">🎵</span>
                            Background Ambience
                            <span class="category-toggle">▼</span>
                        </h4>
                        <div class="category-sounds" id="ambient-sounds">
                            <!-- Populated dynamically -->
                        </div>
                    </div>
                    
                    <div class="sound-category" data-category="binaural">
                        <h4 class="category-header collapsible" data-target="binaural-sounds">
                            <span class="category-icon">🧠</span>
                            Binaural Beats
                            <span class="category-toggle">▼</span>
                        </h4>
                        <div class="category-sounds" id="binaural-sounds">
                            <!-- Populated dynamically -->
                        </div>
                    </div>
                    
                    <div class="sound-category" data-category="events">
                        <h4 class="category-header collapsible" data-target="event-sounds">
                            <span class="category-icon">🔔</span>
                            Event Sounds
                            <span class="category-toggle">▼</span>
                        </h4>
                        <div class="category-sounds" id="event-sounds">
                            <!-- Populated dynamically -->
                        </div>
                    </div>
                </div>
                
                <!-- Visualizer -->
                <div class="visualizer-section">
                    <h4>Frequency Spectrum</h4>
                    <canvas id="sound-visualizer" width="400" height="80"></canvas>
                </div>
                
                <!-- Help -->
                <div class="help-section">
                    <p class="help-text">
                        <span class="help-icon">💡</span>
                        Tip: Click on any sound to toggle it on/off. Use presets for quick configurations.
                    </p>
                </div>
            </div>
        `;
        
        // Add styles
        this.addStyles();
        
        // Append to body
        document.body.appendChild(this.panel);
        
        // Store references to elements
        this.elements.masterVolume = document.getElementById('master-volume');
        this.elements.minimizeBtn = document.getElementById('minimize-panel');
        this.visualizerCanvas = document.getElementById('sound-visualizer');
        this.visualizerCtx = this.visualizerCanvas.getContext('2d');
        
        // Store category containers
        this.elements.categorySounds = {
            core: document.getElementById('core-sounds'),
            ambient: document.getElementById('ambient-sounds'),
            binaural: document.getElementById('binaural-sounds'),
            events: document.getElementById('event-sounds')
        };
        
        // Set initial position
        this.panel.style.left = `${this.position.x}px`;
        this.panel.style.top = `${this.position.y}px`;
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .sound-panel {
                position: fixed;
                width: 450px;
                background: rgba(0, 0, 0, 0.95);
                border: 2px solid var(--accent-color, #00ffcc);
                border-radius: 8px;
                box-shadow: 0 0 20px rgba(0, 255, 204, 0.5);
                z-index: 10000;
                font-family: 'Courier New', monospace;
                color: #fff;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            }
            
            .sound-panel.minimized {
                width: auto;
                height: auto;
            }
            
            .sound-panel.minimized .sound-panel-content {
                display: none;
            }
            
            .sound-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                background: rgba(0, 255, 204, 0.1);
                border-bottom: 1px solid var(--accent-color, #00ffcc);
                cursor: move;
                user-select: none;
            }
            
            .sound-panel-header h3 {
                margin: 0;
                color: var(--accent-color, #00ffcc);
                font-size: 1.1em;
            }
            
            .panel-controls {
                display: flex;
                gap: 5px;
            }
            
            .panel-btn {
                width: 25px;
                height: 25px;
                background: transparent;
                border: 1px solid var(--accent-color, #00ffcc);
                color: var(--accent-color, #00ffcc);
                cursor: pointer;
                font-size: 1.2em;
                line-height: 1;
                transition: all 0.2s;
            }
            
            .panel-btn:hover {
                background: var(--accent-color, #00ffcc);
                color: #000;
            }
            
            .sound-panel-content {
                padding: 15px;
                max-height: 600px;
                overflow-y: auto;
            }
            
            .master-section {
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #333;
            }
            
            .master-controls {
                display: flex;
                gap: 15px;
                align-items: flex-end;
            }
            
            .volume-control {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-top: 10px;
            }
            
            .volume-control input[type="range"] {
                flex: 1;
                -webkit-appearance: none;
                height: 6px;
                background: #333;
                outline: none;
                border-radius: 3px;
            }
            
            .volume-control input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                background: var(--accent-color, #00ffcc);
                cursor: pointer;
                border-radius: 50%;
            }
            
            .mixers-section {
                margin-bottom: 20px;
            }
            
            .mixers-section h4,
            .visualizer-section h4,
            .active-sounds-section h4 {
                color: var(--accent-color, #00ffcc);
                margin: 0 0 10px 0;
                font-size: 0.9em;
                text-transform: uppercase;
            }
            
            .mixer-grid {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 10px;
            }
            
            .mixer-channel {
                text-align: center;
            }
            
            .mixer-channel label {
                display: block;
                font-size: 0.8em;
                margin-bottom: 5px;
                color: #999;
            }
            
            .mixer-channel input[type="range"] {
                width: 60px;
                transform: rotate(-90deg);
                margin: 20px 0;
            }
            
            .mixer-value {
                display: block;
                font-size: 0.8em;
                color: var(--accent-color, #00ffcc);
            }
            
            /* New styles for redesigned UI */
            .control-btn {
                background: transparent;
                border: 1px solid var(--accent-color, #00ffcc);
                color: var(--accent-color, #00ffcc);
                padding: 8px 15px;
                cursor: pointer;
                font-size: 0.9em;
                transition: all 0.2s;
                white-space: nowrap;
            }
            
            .control-btn:hover {
                background: var(--accent-color, #00ffcc);
                color: #000;
            }
            
            .presets-section {
                margin-bottom: 20px;
            }
            
            .preset-buttons {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                margin-top: 10px;
            }
            
            .preset-btn {
                background: rgba(0, 255, 204, 0.1);
                border: 1px solid rgba(0, 255, 204, 0.3);
                color: #fff;
                padding: 10px;
                cursor: pointer;
                text-align: center;
                transition: all 0.2s;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
            }
            
            .preset-btn:hover {
                background: rgba(0, 255, 204, 0.2);
                border-color: var(--accent-color, #00ffcc);
            }
            
            .preset-btn.active {
                background: rgba(0, 255, 204, 0.3);
                border-color: var(--accent-color, #00ffcc);
                box-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
            }
            
            .preset-icon {
                font-size: 1.5em;
            }
            
            .preset-name {
                font-size: 0.8em;
            }
            
            .sounds-by-category {
                margin-bottom: 20px;
            }
            
            .sound-category {
                margin-bottom: 15px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                overflow: hidden;
            }
            
            .category-header {
                background: rgba(255, 255, 255, 0.05);
                padding: 12px 15px;
                margin: 0;
                font-size: 1em;
                display: flex;
                align-items: center;
                gap: 10px;
                user-select: none;
            }
            
            .category-header.collapsible {
                cursor: pointer;
            }
            
            .category-header.collapsible:hover {
                background: rgba(255, 255, 255, 0.08);
            }
            
            .category-icon {
                font-size: 1.2em;
            }
            
            .category-status {
                margin-left: auto;
                font-size: 0.8em;
                color: var(--accent-color, #00ffcc);
                font-style: italic;
            }
            
            .category-toggle {
                margin-left: auto;
                transition: transform 0.2s;
            }
            
            .category-header.collapsed .category-toggle {
                transform: rotate(-90deg);
            }
            
            .category-sounds {
                padding: 10px;
                background: rgba(0, 0, 0, 0.3);
            }
            
            .category-sounds.collapsed {
                display: none;
            }
            
            .sound-item-new {
                display: flex;
                align-items: center;
                padding: 10px;
                margin-bottom: 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .sound-item-new:last-child {
                margin-bottom: 0;
            }
            
            .sound-item-new:hover {
                background: rgba(255, 255, 255, 0.08);
            }
            
            .sound-item-new.active {
                background: rgba(0, 255, 204, 0.15);
                border: 1px solid rgba(0, 255, 204, 0.5);
            }
            
            .sound-toggle {
                width: 24px;
                height: 24px;
                border: 2px solid #666;
                border-radius: 50%;
                margin-right: 10px;
                position: relative;
                flex-shrink: 0;
            }
            
            .sound-item-new.active .sound-toggle {
                border-color: var(--accent-color, #00ffcc);
                background: var(--accent-color, #00ffcc);
            }
            
            .sound-item-new.active .sound-toggle::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #000;
                font-size: 0.8em;
                font-weight: bold;
            }
            
            .sound-icon {
                font-size: 1.2em;
                margin-right: 10px;
            }
            
            .sound-info-new {
                flex: 1;
                margin-right: 10px;
            }
            
            .sound-name-new {
                font-weight: bold;
                color: #fff;
                margin-bottom: 2px;
            }
            
            .sound-description {
                font-size: 0.8em;
                color: #999;
            }
            
            .sound-frequency {
                font-size: 0.8em;
                color: var(--accent-color, #00ffcc);
                margin-left: auto;
            }
            
            .help-section {
                background: rgba(0, 255, 204, 0.1);
                padding: 10px;
                border-radius: 6px;
                margin-top: 15px;
            }
            
            .help-text {
                margin: 0;
                font-size: 0.85em;
                color: #ccc;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .help-icon {
                font-size: 1.2em;
            }
            
            .visualizer-section {
                margin-bottom: 20px;
            }
            
            #sound-visualizer {
                width: 100%;
                height: 100px;
                background: #000;
                border: 1px solid #333;
                border-radius: 4px;
            }
            
            .active-sounds-section {
                margin-bottom: 10px;
            }
            
            #sound-count {
                color: #999;
                font-size: 0.9em;
            }
            
            #active-sounds-list {
                max-height: 200px;
                overflow-y: auto;
                background: rgba(0, 0, 0, 0.5);
                border: 1px solid #333;
                border-radius: 4px;
                padding: 10px;
            }
            
            .sound-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px;
                margin-bottom: 5px;
                background: rgba(0, 255, 204, 0.1);
                border: 1px solid rgba(0, 255, 204, 0.3);
                border-radius: 4px;
                font-size: 0.9em;
            }
            
            .sound-item:last-child {
                margin-bottom: 0;
            }
            
            .sound-info {
                flex: 1;
            }
            
            .sound-name {
                color: var(--accent-color, #00ffcc);
                font-weight: bold;
            }
            
            .sound-details {
                color: #999;
                font-size: 0.8em;
                margin-top: 2px;
            }
            
            .sound-controls {
                display: flex;
                gap: 5px;
                align-items: center;
            }
            
            .sound-volume {
                width: 60px;
                height: 4px;
            }
            
            .sound-mute {
                width: 25px;
                height: 25px;
                background: transparent;
                border: 1px solid #666;
                color: #666;
                cursor: pointer;
                font-size: 0.8em;
                line-height: 1;
            }
            
            .sound-mute:hover {
                border-color: var(--accent-color, #00ffcc);
                color: var(--accent-color, #00ffcc);
            }
            
            .sound-mute.muted {
                background: #ff0066;
                color: #fff;
                border-color: #ff0066;
            }
            
            .no-sounds {
                text-align: center;
                color: #666;
                padding: 20px;
            }
            
            /* Scrollbar styling */
            .sound-panel-content::-webkit-scrollbar,
            #active-sounds-list::-webkit-scrollbar {
                width: 8px;
            }
            
            .sound-panel-content::-webkit-scrollbar-track,
            #active-sounds-list::-webkit-scrollbar-track {
                background: #111;
            }
            
            .sound-panel-content::-webkit-scrollbar-thumb,
            #active-sounds-list::-webkit-scrollbar-thumb {
                background: var(--accent-color, #00ffcc);
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
    }
    
    createFullPagePanel(container) {
        // Create full-page layout
        this.panel = container;
        this.panel.className = 'sound-control-full-page';
        this.panel.innerHTML = `
            <div class="sound-control-hero">
                <p class="hero-subtitle">Central Audio Command for the Breakaway Civilization Dashboard</p>
            </div>
            
            <div class="sound-control-main">
                <!-- Master Play Control -->
                <div class="master-play-section">
                    <button id="master-play-btn" class="master-play-button">
                        <span class="play-icon">▶</span>
                        <span class="pause-icon" style="display: none;">⏸</span>
                        <span class="btn-label">START SOUND SYSTEM</span>
                    </button>
                    <p class="play-description">Click to activate the sound system and enable all controls</p>
                </div>
                
                <!-- Master Controls Section (initially disabled) -->
                <div class="master-section-full disabled" id="master-controls">
                    <h3>Master Controls</h3>
                    <div class="master-controls-grid">
                        <div class="master-volume-container">
                            <label>Master Volume</label>
                            <input type="range" id="master-volume" min="0" max="100" value="70" class="volume-slider-large" disabled>
                            <span id="master-volume-value" class="volume-display">70%</span>
                        </div>
                        <button id="mute-all" class="control-btn-large" disabled>
                            <span class="btn-icon">🔇</span>
                            <span class="btn-text">Mute All</span>
                        </button>
                        <button id="reset-defaults" class="control-btn-large" disabled>
                            <span class="btn-icon">🔄</span>
                            <span class="btn-text">Reset to Default</span>
                        </button>
                    </div>
                </div>
                
                <!-- Quick Presets Section -->
                <div class="presets-section-full">
                    <h3>Quick Presets</h3>
                    <div class="preset-grid">
                        <div class="preset-card" data-preset="minimal">
                            <div class="preset-icon-large">🌍</div>
                            <h4>Minimal</h4>
                            <p>Earth resonance only</p>
                            <button class="preset-activate">Activate</button>
                        </div>
                        <div class="preset-card" data-preset="ambient">
                            <div class="preset-icon-large">🌌</div>
                            <h4>Ambient</h4>
                            <p>Space atmosphere</p>
                            <button class="preset-activate">Activate</button>
                        </div>
                        <div class="preset-card" data-preset="meditation">
                            <div class="preset-icon-large">🧘</div>
                            <h4>Meditation</h4>
                            <p>Theta + crystals</p>
                            <button class="preset-activate">Activate</button>
                        </div>
                        <div class="preset-card" data-preset="full">
                            <div class="preset-icon-large">✨</div>
                            <h4>Full Experience</h4>
                            <p>All atmospheric</p>
                            <button class="preset-activate">Activate</button>
                        </div>
                    </div>
                </div>
                
                <!-- Sound Categories Grid -->
                <div class="sound-categories-grid disabled" id="sound-categories">
                    <!-- All Sounds in One Interface -->
                    <div class="all-sounds-card">
                        <h3>🎵 Available Sounds</h3>
                        <p class="category-help">Toggle individual sounds on/off. Active sounds will show with a glowing border.</p>
                        
                        <!-- Core Frequency -->
                        <div class="sound-section">
                            <h4>🌍 Core Frequency - Earth Resonance</h4>
                            <p class="sound-section-description">The Schumann resonance is Earth's natural electromagnetic frequency at 7.83 Hz. Toggle to activate/deactivate.</p>
                            <div class="sound-grid" id="core-sounds">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                        
                        <!-- Ambient Atmospheres -->
                        <div class="sound-section">
                            <h4>🌌 Ambient Atmospheres</h4>
                            <div class="sound-grid" id="ambient-sounds">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                        
                        <!-- Binaural Beats -->
                        <div class="sound-section">
                            <h4>🧠 Binaural Beats (Use Headphones)</h4>
                            <div class="sound-grid" id="binaural-sounds">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                        
                        <!-- Event Sounds Info -->
                        <div class="sound-section">
                            <h4>🔔 Event Sounds (Auto-Triggered)</h4>
                            <div class="sound-grid" id="event-sounds">
                                <!-- Populated dynamically -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Visualizer Section -->
                <div class="visualizer-section-full">
                    <h3>Live Frequency Spectrum</h3>
                    <canvas id="sound-visualizer" width="1200" height="200"></canvas>
                    <div class="spectrum-info">
                        <span class="spectrum-label">0 Hz</span>
                        <span class="spectrum-label">Schumann (7.83 Hz)</span>
                        <span class="spectrum-label">Alpha (10 Hz)</span>
                        <span class="spectrum-label">Beta (20 Hz)</span>
                        <span class="spectrum-label">Gamma (40 Hz)</span>
                        <span class="spectrum-label">100 Hz</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add full-page styles
        this.addFullPageStyles();
        
        // Store references
        this.elements.masterVolume = document.getElementById('master-volume');
        this.visualizerCanvas = document.getElementById('sound-visualizer');
        this.visualizerCtx = this.visualizerCanvas.getContext('2d');
        
        // Store category containers
        this.elements.categorySounds = {
            core: document.getElementById('core-sounds'),
            ambient: document.getElementById('ambient-sounds'),
            binaural: document.getElementById('binaural-sounds'),
            events: document.getElementById('event-sounds')
        };
    }
    
    addFullPageStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .sound-control-full-page {
                padding: 0;
                background: var(--primary-bg);
                min-height: 100vh;
            }
            
            .sound-control-hero {
                text-align: center;
                padding: 20px;
                background: linear-gradient(135deg, rgba(0, 255, 204, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%);
                border-bottom: 2px solid var(--accent-color);
                margin-bottom: 30px;
            }
            
            .hero-subtitle {
                color: var(--text-secondary);
                font-size: 1.1em;
                margin: 10px 0;
            }
            
            .sound-control-main {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 20px 40px;
            }
            
            /* Master Play Button */
            .master-play-section {
                text-align: center;
                margin-bottom: 40px;
                padding: 40px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                border: 2px solid rgba(255, 255, 255, 0.1);
            }
            
            .master-play-button {
                width: 200px;
                height: 200px;
                border-radius: 50%;
                background: radial-gradient(circle at center, rgba(0, 255, 204, 0.2), rgba(0, 255, 204, 0.05));
                border: 3px solid var(--accent-color);
                color: var(--accent-color);
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin: 0 auto;
                font-size: 1.2em;
                position: relative;
                overflow: hidden;
            }
            
            .master-play-button::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: conic-gradient(from 180deg, transparent, var(--accent-color), transparent);
                border-radius: 50%;
                opacity: 0;
                animation: rotate 2s linear infinite;
                transition: opacity 0.3s;
            }
            
            .master-play-button:hover::before {
                opacity: 1;
            }
            
            .master-play-button.active {
                background: radial-gradient(circle at center, rgba(0, 255, 204, 0.4), rgba(0, 255, 204, 0.1));
                animation: pulse 2s infinite;
            }
            
            .master-play-button.active::before {
                opacity: 1;
            }
            
            .master-play-button .play-icon,
            .master-play-button .pause-icon {
                font-size: 3em;
            }
            
            .master-play-button .btn-label {
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .play-description {
                margin-top: 20px;
                color: var(--text-secondary);
                font-size: 1.1em;
            }
            
            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            /* Disabled state for sections */
            .disabled {
                opacity: 0.4;
                pointer-events: none;
                filter: grayscale(0.5);
            }
            
            .master-section-full.disabled,
            .sound-categories-grid.disabled {
                transition: all 0.5s;
            }
            
            /* Active state removes disabled */
            .sound-system-active .disabled {
                opacity: 1;
                pointer-events: auto;
                filter: none;
            }
            
            .master-section-full {
                background: rgba(0, 255, 204, 0.05);
                border: 1px solid var(--accent-color);
                border-radius: 10px;
                padding: 30px;
                margin-bottom: 40px;
            }
            
            .master-section-full h3 {
                color: var(--accent-color);
                margin-bottom: 20px;
                font-size: 1.5em;
            }
            
            .master-controls-grid {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr;
                gap: 30px;
                align-items: center;
            }
            
            .master-volume-container {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .volume-slider-large {
                -webkit-appearance: none;
                height: 10px;
                background: #333;
                outline: none;
                border-radius: 5px;
            }
            
            .volume-slider-large::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 24px;
                height: 24px;
                background: var(--accent-color);
                cursor: pointer;
                border-radius: 50%;
            }
            
            .volume-display {
                font-size: 1.5em;
                color: var(--accent-color);
                font-weight: bold;
            }
            
            .control-btn-large {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                padding: 20px;
                background: transparent;
                border: 2px solid var(--accent-color);
                color: var(--accent-color);
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 1.1em;
            }
            
            .control-btn-large:hover {
                background: var(--accent-color);
                color: var(--primary-bg);
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(0, 255, 204, 0.4);
            }
            
            .control-btn-large.danger {
                border-color: #ff0066;
                color: #ff0066;
            }
            
            .control-btn-large.danger:hover {
                background: #ff0066;
                box-shadow: 0 5px 20px rgba(255, 0, 102, 0.4);
            }
            
            .btn-icon {
                font-size: 2em;
            }
            
            .presets-section-full {
                margin-bottom: 40px;
            }
            
            .presets-section-full h3 {
                color: var(--accent-color);
                margin-bottom: 20px;
                font-size: 1.5em;
            }
            
            .preset-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 20px;
            }
            
            .preset-card {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 25px;
                text-align: center;
                transition: all 0.3s;
                cursor: pointer;
            }
            
            .preset-card:hover {
                background: rgba(0, 255, 204, 0.1);
                border-color: var(--accent-color);
                transform: translateY(-5px);
            }
            
            .preset-card.active {
                background: rgba(0, 255, 204, 0.2);
                border-color: var(--accent-color);
                box-shadow: 0 0 20px rgba(0, 255, 204, 0.4);
            }
            
            .preset-icon-large {
                font-size: 3em;
                margin-bottom: 15px;
            }
            
            .preset-card h4 {
                color: #fff;
                margin-bottom: 10px;
                font-size: 1.3em;
            }
            
            .preset-card p {
                color: var(--text-secondary);
                font-size: 0.9em;
                margin-bottom: 15px;
            }
            
            .preset-activate {
                background: transparent;
                border: 1px solid var(--accent-color);
                color: var(--accent-color);
                padding: 8px 20px;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .preset-activate:hover {
                background: var(--accent-color);
                color: var(--primary-bg);
            }
            
            .sound-categories-grid {
                margin-bottom: 40px;
            }
            
            .all-sounds-card {
                background: rgba(255, 255, 255, 0.02);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 30px;
            }
            
            .all-sounds-card h3 {
                color: var(--accent-color);
                margin-bottom: 10px;
                font-size: 1.5em;
                text-align: center;
            }
            
            .category-help {
                text-align: center;
                color: var(--text-secondary);
                margin-bottom: 30px;
                font-size: 1.1em;
            }
            
            .sound-section {
                margin-bottom: 30px;
                padding: 20px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 8px;
            }
            
            .sound-section h4 {
                color: #fff;
                margin-bottom: 15px;
                font-size: 1.2em;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                padding-bottom: 10px;
            }
            
            .sound-section-description {
                color: var(--text-secondary);
                font-size: 0.9em;
                margin-bottom: 15px;
                line-height: 1.5;
                font-style: italic;
            }
            
            .sound-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
            }
            
            .sound-card {
                background: rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 15px;
                cursor: pointer;
                transition: all 0.2s;
                position: relative;
                overflow: hidden;
            }
            
            .sound-card:hover {
                background: rgba(255, 255, 255, 0.05);
                border-color: rgba(255, 255, 255, 0.2);
            }
            
            .sound-card.active {
                background: rgba(0, 255, 204, 0.15);
                border-color: var(--accent-color);
                box-shadow: 0 0 15px rgba(0, 255, 204, 0.3);
            }
            
            .sound-card.active::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: var(--accent-color);
                animation: pulse 2s infinite;
            }
            
            .sound-toggle-large {
                width: 40px;
                height: 40px;
                border: 3px solid #666;
                border-radius: 50%;
                margin: 0 auto 10px;
                position: relative;
                transition: all 0.2s;
            }
            
            .sound-card.active .sound-toggle-large {
                border-color: var(--accent-color);
                background: var(--accent-color);
            }
            
            .sound-card.active .sound-toggle-large::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: var(--primary-bg);
                font-size: 1.5em;
                font-weight: bold;
            }
            
            .sound-card-icon {
                font-size: 2em;
                text-align: center;
                margin-bottom: 10px;
            }
            
            .sound-card-name {
                font-weight: bold;
                color: #fff;
                text-align: center;
                margin-bottom: 5px;
            }
            
            .sound-card-freq {
                font-size: 0.8em;
                color: var(--accent-color);
                text-align: center;
            }
            
            .sound-status {
                font-size: 0.85em;
                font-weight: bold;
                text-align: center;
                margin-top: 8px;
                padding: 4px 8px;
                border-radius: 4px;
                background: rgba(0, 0, 0, 0.5);
                color: #666;
            }
            
            .sound-card.active .sound-status {
                background: rgba(0, 255, 204, 0.2);
                color: var(--accent-color);
                box-shadow: 0 0 10px rgba(0, 255, 204, 0.3);
            }
            
            .visualizer-section-full {
                background: #000;
                border: 2px solid var(--accent-color);
                border-radius: 10px;
                padding: 30px;
                text-align: center;
            }
            
            .visualizer-section-full h3 {
                color: var(--accent-color);
                margin-bottom: 20px;
                font-size: 1.5em;
            }
            
            #sound-visualizer {
                width: 100%;
                max-width: 1200px;
                height: 200px;
                background: #000;
                border: 1px solid #333;
                border-radius: 5px;
            }
            
            .spectrum-info {
                display: flex;
                justify-content: space-between;
                margin-top: 10px;
                color: var(--text-secondary);
                font-size: 0.9em;
            }
            
            /* Mobile responsiveness */
            @media (max-width: 1200px) {
                .preset-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .sound-categories-grid {
                    grid-template-columns: 1fr;
                }
            }
            
            @media (max-width: 768px) {
                .master-controls-grid {
                    grid-template-columns: 1fr;
                    gap: 20px;
                }
                
                .preset-grid {
                    grid-template-columns: 1fr;
                }
                
                .sound-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        // Check if we're in full page mode
        if (this.isFullPage) {
            // Master play button
            const playBtn = document.getElementById('master-play-btn');
            if (playBtn) {
                playBtn.addEventListener('click', () => {
                    this.toggleSoundSystem();
                });
            }
            
            // Master volume
            this.elements.masterVolume.addEventListener('input', (e) => {
                const value = e.target.value;
                document.getElementById('master-volume-value').textContent = `${value}%`;
                if (this.soundSystem) {
                    this.soundSystem.setMasterVolume(value / 100);
                }
            });
            
            // Mute all button
            const muteBtn = document.getElementById('mute-all');
            if (muteBtn) {
                muteBtn.addEventListener('click', () => {
                    if (this.soundSystem) {
                        const isMuted = this.soundSystem.toggleMute();
                        muteBtn.querySelector('.btn-icon').textContent = isMuted ? '🔊' : '🔇';
                        muteBtn.querySelector('.btn-text').textContent = isMuted ? 'Unmute All' : 'Mute All';
                    }
                });
            }
            
            // Reset defaults button
            const resetBtn = document.getElementById('reset-defaults');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    if (this.soundSystem) {
                        this.soundSystem.stopAll();
                        // Start only Schumann resonance as default
                        this.soundSystem.playSchumannResonance(true, { rate: 0.05, depth: 0.3 });
                        this.updateActiveSounds();
                    }
                });
            }
            
            // Preset cards
            document.querySelectorAll('.preset-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    const presetCard = e.currentTarget;
                    const presetName = presetCard.dataset.preset;
                    this.applyPreset(presetName);
                    
                    // Update active state
                    document.querySelectorAll('.preset-card').forEach(c => c.classList.remove('active'));
                    presetCard.classList.add('active');
                });
            });
        } else {
            // Original floating panel functionality
            // Drag functionality
            const header = this.panel.querySelector('.sound-panel-header');
            header.addEventListener('mousedown', (e) => this.startDrag(e));
            document.addEventListener('mousemove', this.dragHandlers.mouseMove);
            document.addEventListener('mouseup', this.dragHandlers.mouseUp);
            
            // Panel controls
            document.getElementById('minimize-panel').addEventListener('click', () => this.toggleMinimize());
            document.getElementById('close-panel').addEventListener('click', () => this.close());
            
            // Master volume
            this.elements.masterVolume.addEventListener('input', (e) => {
                const value = e.target.value;
                document.getElementById('master-volume-value').textContent = `${value}%`;
                if (this.soundSystem) {
                    this.soundSystem.setMasterVolume(value / 100);
                }
            });
            
            // Mute all button
            document.getElementById('mute-all').addEventListener('click', () => {
                if (this.soundSystem) {
                    this.soundSystem.stopAll();
                    // Restart only Schumann if sound is enabled
                    if (window.soundEnabled) {
                        this.soundSystem.playSchumannResonance(true, { rate: 0.05, depth: 0.3 });
                    }
                }
            });
            
            // Preset buttons
            document.querySelectorAll('.preset-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const presetName = e.currentTarget.dataset.preset;
                    this.applyPreset(presetName);
                    
                    // Update active state
                    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                });
            });
            
            // Collapsible category headers
            document.querySelectorAll('.category-header.collapsible').forEach(header => {
                header.addEventListener('click', (e) => {
                    const target = e.currentTarget.dataset.target;
                    const content = document.getElementById(target);
                    
                    e.currentTarget.classList.toggle('collapsed');
                    content.classList.toggle('collapsed');
                });
            });
        }
    }
    
    startDrag(e) {
        if (e.target.tagName === 'BUTTON') return;
        this.isDragging = true;
        this.dragOffset.x = e.clientX - this.position.x;
        this.dragOffset.y = e.clientY - this.position.y;
        this.panel.style.cursor = 'grabbing';
    }
    
    drag(e) {
        if (!this.isDragging || !this.panel) return;
        this.position.x = e.clientX - this.dragOffset.x;
        this.position.y = e.clientY - this.dragOffset.y;
        this.panel.style.left = `${this.position.x}px`;
        this.panel.style.top = `${this.position.y}px`;
    }
    
    endDrag() {
        if (!this.panel) return;
        this.isDragging = false;
        this.panel.style.cursor = '';
    }
    
    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        this.panel.classList.toggle('minimized', this.isMinimized);
        this.elements.minimizeBtn.textContent = this.isMinimized ? '□' : '_';
    }
    
    toggleSoundSystem() {
        const playBtn = document.getElementById('master-play-btn');
        const playIcon = playBtn.querySelector('.play-icon');
        const pauseIcon = playBtn.querySelector('.pause-icon');
        const btnLabel = playBtn.querySelector('.btn-label');
        const playDesc = document.querySelector('.play-description');
        
        this.soundSystemActive = !this.soundSystemActive;
        
        if (this.soundSystemActive) {
            // Activate sound system
            playBtn.classList.add('active');
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            btnLabel.textContent = 'SOUND SYSTEM ACTIVE';
            playDesc.textContent = 'Sound system is running. Toggle individual sounds below.';
            
            // Enable all controls
            document.getElementById('master-controls').classList.remove('disabled');
            document.getElementById('sound-categories').classList.remove('disabled');
            document.querySelectorAll('.master-section-full button').forEach(btn => btn.disabled = false);
            document.getElementById('master-volume').disabled = false;
            
            // Add active class to container
            this.panel.classList.add('sound-system-active');
            
            // Don't auto-start any sounds - let user choose what to play
        } else {
            // Deactivate sound system
            playBtn.classList.remove('active');
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            btnLabel.textContent = 'START SOUND SYSTEM';
            playDesc.textContent = 'Click to activate the sound system and enable all controls';
            
            // Disable all controls
            document.getElementById('master-controls').classList.add('disabled');
            document.getElementById('sound-categories').classList.add('disabled');
            document.querySelectorAll('.master-section-full button').forEach(btn => btn.disabled = true);
            document.getElementById('master-volume').disabled = true;
            
            // Remove active class
            this.panel.classList.remove('sound-system-active');
            
            // Stop all sounds
            this.soundSystem.stopAll();
        }
        
        this.updateActiveSounds();
    }
    
    close() {
        // Remove drag event listeners from document
        document.removeEventListener('mousemove', this.dragHandlers.mouseMove);
        document.removeEventListener('mouseup', this.dragHandlers.mouseUp);
        
        // Unsubscribe from sound system events
        if (this.soundSystem) {
            this.soundSystem.off('soundRegistered', this.eventHandlers.soundRegistered);
            this.soundSystem.off('soundUnregistered', this.eventHandlers.soundUnregistered);
            this.soundSystem.off('soundUpdated', this.eventHandlers.soundUpdated);
            this.soundSystem.off('soundStopped', this.eventHandlers.soundStopped);
        }
        
        // Cancel animation frames and intervals
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        // Remove DOM elements
        if (this.panel) {
            this.panel.remove();
            this.panel = null;
        }
        
        // Clear references
        this.elements = {
            activeSoundsList: null,
            masterVolume: null,
            categoryMixers: {},
            visualizer: null,
            minimizeBtn: null,
            categorySounds: {}
        };
        this.visualizerCanvas = null;
        this.visualizerCtx = null;
        this.initialized = false;
        this.isDragging = false;
    }
    
    startUpdateLoop() {
        // Update active sounds list every 100ms
        this.updateInterval = setInterval(() => {
            this.updateActiveSounds();
        }, 100);
        
        // Start visualizer animation
        this.animateVisualizer();
    }
    
    updateActiveSounds() {
        if (!this.soundSystem) return;
        
        const activeSounds = this.soundSystem.getAllActiveSounds();
        
        // Clear all category containers
        Object.values(this.elements.categorySounds).forEach(container => {
            if (container) container.innerHTML = '';
        });
        
        // Populate available sounds by category
        this.populateAvailableSounds();
        
        // Mark active sounds
        activeSounds.forEach(sound => {
            const soundElement = document.querySelector(`[data-sound-key="${sound.name}"]`);
            if (soundElement) {
                soundElement.classList.add('active');
            }
        });
    }
    
    populateAvailableSounds() {
        // Core sounds (always show Schumann)
        this.addSoundToCategory('core', 'schumann', true);
        
        // Ambient sounds
        ['deepSpace', 'earthHum', 'cosmicWind', 'crystalResonance', 'ancientEchoes', 'quantumFlux'].forEach(key => {
            this.addSoundToCategory('ambient', key, false);
        });
        
        // Binaural beats
        ['delta', 'theta', 'alpha', 'beta', 'gamma'].forEach(key => {
            this.addSoundToCategory('binaural', key, false);
        });
        
        // Event sounds (show as available but not clickable)
        ['activation', 'discovery', 'connection', 'anomaly'].forEach(key => {
            this.addSoundToCategory('events', key, false, true);
        });
    }
    
    addSoundToCategory(category, soundKey, isActive, isEventSound = false) {
        const container = this.elements.categorySounds[category];
        if (!container) return;
        
        const soundInfo = this.soundDescriptions[soundKey] || {
            name: soundKey,
            description: 'Unknown sound',
            icon: '🔊'
        };
        
        const soundElement = document.createElement('div');
        
        if (this.isFullPage) {
            // Full-page card layout
            soundElement.className = `sound-card ${isActive ? 'active' : ''} ${isEventSound ? 'event-sound' : ''}`;
            soundElement.dataset.soundKey = soundKey;
            
            let frequencyDisplay = '';
            if (soundKey === 'schumann') {
                frequencyDisplay = '<div class="sound-card-freq">7.83 Hz</div>';
            } else if (soundInfo.category === 'binaural' && this.soundSystem.binauralConfigs[soundKey]) {
                const config = this.soundSystem.binauralConfigs[soundKey];
                frequencyDisplay = `<div class="sound-card-freq">${config.beat} Hz beat</div>`;
            }
            
            soundElement.innerHTML = `
                <div class="sound-toggle-large"></div>
                <div class="sound-card-icon">${soundInfo.icon}</div>
                <div class="sound-card-name">${soundInfo.name}</div>
                ${frequencyDisplay}
                ${soundKey === 'schumann' ? '<div class="sound-status">' + (isActive ? 'ACTIVE' : 'INACTIVE') + '</div>' : ''}
            `;
        } else {
            // Original floating panel layout
            soundElement.className = `sound-item-new ${isActive ? 'active' : ''} ${isEventSound ? 'event-sound' : ''}`;
            soundElement.dataset.soundKey = soundKey;
            
            let frequencyDisplay = '';
            if (soundKey === 'schumann') {
                frequencyDisplay = '<span class="sound-frequency">7.83 Hz</span>';
            }
            
            soundElement.innerHTML = `
                <div class="sound-toggle"></div>
                <span class="sound-icon">${soundInfo.icon}</span>
                <div class="sound-info-new">
                    <div class="sound-name-new">${soundInfo.name}</div>
                    <div class="sound-description">${soundInfo.description}</div>
                </div>
                ${frequencyDisplay}
            `;
        }
        
        if (!isEventSound) {
            soundElement.addEventListener('click', () => this.toggleSound(soundKey));
        } else {
            soundElement.style.opacity = '0.5';
            soundElement.style.cursor = 'default';
            soundElement.title = 'Event sounds play automatically when triggered';
        }
        
        container.appendChild(soundElement);
    }
    
    toggleSound(soundKey) {
        const isActive = document.querySelector(`[data-sound-key="${soundKey}"]`).classList.contains('active');
        
        if (isActive) {
            // Stop the sound
            if (soundKey === 'schumann') {
                this.soundSystem.stopSchumannResonance();
            } else if (this.soundDescriptions[soundKey].category === 'ambient') {
                // Stop the ambient layer
                this.soundSystem.stopAmbientLayer(soundKey);
            } else if (this.soundDescriptions[soundKey].category === 'binaural') {
                // Stop binaural beat
                this.soundSystem.stopBinauralBeat(soundKey);
            }
        } else {
            // Start the sound
            if (soundKey === 'schumann') {
                this.soundSystem.playSchumannResonance(true, { rate: 0.05, depth: 0.3 });
            } else if (this.soundDescriptions[soundKey].category === 'ambient') {
                this.soundSystem.startAmbientLayer(soundKey);
            } else if (this.soundDescriptions[soundKey].category === 'binaural') {
                this.soundSystem.playBinauralBeat(soundKey);
            }
        }
        
        // Update display
        this.updateActiveSounds();
    }
    
    applyPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) return;
        
        // Stop all sounds first
        this.soundSystem.stopAll();
        
        // Start preset sounds
        preset.sounds.forEach(soundKey => {
            if (soundKey === 'schumann') {
                this.soundSystem.playSchumannResonance(true, { rate: 0.05, depth: 0.3 });
            } else if (this.soundDescriptions[soundKey] && this.soundDescriptions[soundKey].category === 'ambient') {
                this.soundSystem.startAmbientLayer(soundKey);
            } else if (this.soundDescriptions[soundKey] && this.soundDescriptions[soundKey].category === 'binaural') {
                this.soundSystem.playBinauralBeat(soundKey);
            }
        });
        
        // Update display
        setTimeout(() => this.updateActiveSounds(), 100);
    }
    
    animateVisualizer() {
        if (!this.soundSystem || !this.soundSystem.analyser || !this.visualizerCtx || !this.visualizerCanvas) {
            this.animationFrame = requestAnimationFrame(() => this.animateVisualizer());
            return;
        }
        
        const analyser = this.soundSystem.analyser;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        
        // Clear canvas
        this.visualizerCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.visualizerCtx.fillRect(0, 0, this.visualizerCanvas.width, this.visualizerCanvas.height);
        
        // Draw frequency bars
        const barWidth = (this.visualizerCanvas.width / bufferLength) * 2.5;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * this.visualizerCanvas.height;
            
            // Color based on frequency range
            const hue = (i / bufferLength) * 120; // 0 to 120 (red to green)
            this.visualizerCtx.fillStyle = `hsl(${hue}, 100%, 50%)`;
            
            this.visualizerCtx.fillRect(x, this.visualizerCanvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
        
        this.animationFrame = requestAnimationFrame(() => this.animateVisualizer());
    }
    
    // Event handlers for sound system
    onSoundRegistered(event) {
        console.log('Sound registered:', event.data);
        this.updateActiveSounds();
    }
    
    onSoundUnregistered(event) {
        console.log('Sound unregistered:', event.data);
        this.updateActiveSounds();
    }
    
    onSoundUpdated(event) {
        console.log('Sound updated:', event.data);
        this.updateActiveSounds();
    }
    
    onSoundStopped(event) {
        console.log('Sound stopped:', event.data);
        this.updateActiveSounds();
    }
}

// Don't create instance automatically - wait for sound to be enabled
window.SoundControlPanel = SoundControlPanel;

// Export for module usage
// export default SoundControlPanel;