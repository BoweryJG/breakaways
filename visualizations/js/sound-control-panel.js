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
        
        // Subscribe to sound system events
        if (this.soundSystem) {
            this.soundSystem.on('soundRegistered', (event) => this.onSoundRegistered(event));
            this.soundSystem.on('soundUnregistered', (event) => this.onSoundUnregistered(event));
            this.soundSystem.on('soundUpdated', (event) => this.onSoundUpdated(event));
            this.soundSystem.on('soundStopped', (event) => this.onSoundStopped(event));
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
                    <label>Master Volume</label>
                    <div class="volume-control">
                        <input type="range" id="master-volume" min="0" max="100" value="70">
                        <span id="master-volume-value">70%</span>
                    </div>
                </div>
                
                <!-- Category Mixers -->
                <div class="mixers-section">
                    <h4>Category Mixers</h4>
                    <div class="mixer-grid">
                        <div class="mixer-channel" data-category="sacred">
                            <label>Sacred</label>
                            <input type="range" class="category-mixer" data-category="sacred" min="0" max="100" value="60">
                            <span class="mixer-value">60%</span>
                        </div>
                        <div class="mixer-channel" data-category="binaural">
                            <label>Binaural</label>
                            <input type="range" class="category-mixer" data-category="binaural" min="0" max="100" value="50">
                            <span class="mixer-value">50%</span>
                        </div>
                        <div class="mixer-channel" data-category="ambient">
                            <label>Ambient</label>
                            <input type="range" class="category-mixer" data-category="ambient" min="0" max="100" value="40">
                            <span class="mixer-value">40%</span>
                        </div>
                        <div class="mixer-channel" data-category="events">
                            <label>Events</label>
                            <input type="range" class="category-mixer" data-category="events" min="0" max="100" value="80">
                            <span class="mixer-value">80%</span>
                        </div>
                        <div class="mixer-channel" data-category="alerts">
                            <label>Alerts</label>
                            <input type="range" class="category-mixer" data-category="alerts" min="0" max="100" value="90">
                            <span class="mixer-value">90%</span>
                        </div>
                        <div class="mixer-channel" data-category="em-symphony">
                            <label>EM</label>
                            <input type="range" class="category-mixer" data-category="em-symphony" min="0" max="100" value="70">
                            <span class="mixer-value">70%</span>
                        </div>
                    </div>
                </div>
                
                <!-- Visualizer -->
                <div class="visualizer-section">
                    <h4>Frequency Spectrum</h4>
                    <canvas id="sound-visualizer" width="400" height="100"></canvas>
                </div>
                
                <!-- Active Sounds List -->
                <div class="active-sounds-section">
                    <h4>Active Sounds <span id="sound-count">(0)</span></h4>
                    <div id="active-sounds-list">
                        <div class="no-sounds">No active sounds</div>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles
        this.addStyles();
        
        // Append to body
        document.body.appendChild(this.panel);
        
        // Store references to elements
        this.elements.activeSoundsList = document.getElementById('active-sounds-list');
        this.elements.masterVolume = document.getElementById('master-volume');
        this.elements.minimizeBtn = document.getElementById('minimize-panel');
        this.visualizerCanvas = document.getElementById('sound-visualizer');
        this.visualizerCtx = this.visualizerCanvas.getContext('2d');
        
        // Store mixer references
        document.querySelectorAll('.category-mixer').forEach(mixer => {
            this.elements.categoryMixers[mixer.dataset.category] = mixer;
        });
        
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
                padding-bottom: 20px;
                border-bottom: 1px solid #333;
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
        
        // Category mixers
        Object.entries(this.elements.categoryMixers).forEach(([category, mixer]) => {
            mixer.addEventListener('input', (e) => {
                const value = e.target.value;
                const channel = e.target.closest('.mixer-channel');
                channel.querySelector('.mixer-value').textContent = `${value}%`;
                if (this.soundSystem) {
                    this.soundSystem.setCategoryVolume(category, value / 100);
                }
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
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        this.panel.remove();
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
        const soundCount = document.getElementById('sound-count');
        soundCount.textContent = `(${activeSounds.length})`;
        
        if (activeSounds.length === 0) {
            this.elements.activeSoundsList.innerHTML = '<div class="no-sounds">No active sounds</div>';
            return;
        }
        
        // Build HTML for active sounds
        const soundsHTML = activeSounds.map(sound => {
            const duration = sound.duration ? `${(sound.duration).toFixed(1)}s` : 'continuous';
            const freq = sound.frequency ? `${sound.frequency.toFixed(1)} Hz` : '';
            
            return `
                <div class="sound-item" data-sound-id="${sound.id}">
                    <div class="sound-info">
                        <div class="sound-name">${sound.name}</div>
                        <div class="sound-details">
                            ${sound.category} | ${freq} | ${duration}
                        </div>
                    </div>
                    <div class="sound-controls">
                        <input type="range" class="sound-volume" min="0" max="100" value="${sound.volume * 100}">
                        <button class="sound-mute" data-sound-id="${sound.id}">M</button>
                    </div>
                </div>
            `;
        }).join('');
        
        this.elements.activeSoundsList.innerHTML = soundsHTML;
        
        // Add event listeners to new elements
        this.elements.activeSoundsList.querySelectorAll('.sound-volume').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const soundId = e.target.closest('.sound-item').dataset.soundId;
                const value = e.target.value / 100;
                // TODO: Implement individual sound volume control
            });
        });
        
        this.elements.activeSoundsList.querySelectorAll('.sound-mute').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const soundId = e.target.dataset.soundId;
                e.target.classList.toggle('muted');
                // TODO: Implement individual sound mute
            });
        });
    }
    
    animateVisualizer() {
        if (!this.soundSystem || !this.soundSystem.analyser) {
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