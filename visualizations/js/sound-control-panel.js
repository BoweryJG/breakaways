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
        
        // Initialize when created
        this.init();
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
    
    setupEventListeners() {
        // Drag functionality
        const header = this.panel.querySelector('.sound-panel-header');
        header.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());
        
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
    
    startDrag(e) {
        if (e.target.tagName === 'BUTTON') return;
        this.isDragging = true;
        this.dragOffset.x = e.clientX - this.position.x;
        this.dragOffset.y = e.clientY - this.position.y;
        this.panel.style.cursor = 'grabbing';
    }
    
    drag(e) {
        if (!this.isDragging) return;
        this.position.x = e.clientX - this.dragOffset.x;
        this.position.y = e.clientY - this.dragOffset.y;
        this.panel.style.left = `${this.position.x}px`;
        this.panel.style.top = `${this.position.y}px`;
    }
    
    endDrag() {
        this.isDragging = false;
        this.panel.style.cursor = '';
    }
    
    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        this.panel.classList.toggle('minimized', this.isMinimized);
        this.elements.minimizeBtn.textContent = this.isMinimized ? '□' : '_';
    }
    
    close() {
        // Unsubscribe from sound system events first
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
            minimizeBtn: null
        };
        this.visualizerCanvas = null;
        this.visualizerCtx = null;
        this.initialized = false;
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
                // Find and stop the ambient layer
                const activeSounds = this.soundSystem.getAllActiveSounds();
                const ambientSound = activeSounds.find(s => s.name === soundKey);
                if (ambientSound) {
                    this.soundSystem.unregisterSound(ambientSound.id);
                }
            } else if (this.soundDescriptions[soundKey].category === 'binaural') {
                // Stop binaural beat
                const activeSounds = this.soundSystem.getAllActiveSounds();
                const binauralSound = activeSounds.find(s => s.category === 'binaural');
                if (binauralSound) {
                    this.soundSystem.unregisterSound(binauralSound.id);
                }
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