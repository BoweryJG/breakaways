// Example: How to integrate the Breakaway Sound System into visualizations
// This file demonstrates various use cases and patterns

// Import the sound system (if using modules)
// import breakawaySound from './sound-system.js';
// Or access via window.breakawaySound if already loaded

// Example 1: Anomaly Detection with Progressive Alerts
class AnomalyDetector {
    constructor() {
        this.anomalyThreshold = 0.7;
        this.criticalThreshold = 0.9;
        this.lastAlertTime = 0;
        this.alertCooldown = 5000; // 5 seconds
    }
    
    checkAnomaly(value) {
        const now = Date.now();
        
        if (value > this.criticalThreshold) {
            if (now - this.lastAlertTime > this.alertCooldown) {
                // Critical anomaly - play urgent alert
                window.breakawaySound.playAlert(4);
                window.breakawaySound.playEventSound('anomaly', {
                    freq: 333,
                    duration: 2,
                    pulses: 3
                });
                this.lastAlertTime = now;
            }
        } else if (value > this.anomalyThreshold) {
            if (now - this.lastAlertTime > this.alertCooldown) {
                // Standard anomaly
                window.breakawaySound.playAlert(2);
                window.breakawaySound.playEventSound('anomaly');
                this.lastAlertTime = now;
            }
        }
    }
}

// Example 2: Sacred Site Activation Sequence
function activateSacredSite(siteName, coordinates) {
    console.log(`Activating sacred site: ${siteName}`);
    
    // Play activation sequence
    const sequence = [
        () => window.breakawaySound.playEventSound('portal', { duration: 2 }),
        () => window.breakawaySound.playSacredFrequency('solfeggio.mi', 3), // 528 Hz
        () => window.breakawaySound.playEventSound('crystalline'),
        () => window.breakawaySound.playSacredFrequency('planetary.earth', 5)
    ];
    
    // Execute sequence with delays
    sequence.forEach((sound, index) => {
        setTimeout(sound, index * 2000);
    });
    
    // Start location-specific ambient
    if (siteName.includes('Pyramid')) {
        window.breakawaySound.startAmbientLayer('ancientEchoes');
    } else if (siteName.includes('Crystal')) {
        window.breakawaySound.startAmbientLayer('crystalResonance');
    }
}

// Example 3: Consciousness Level Monitoring with Binaural Beats
class ConsciousnessMonitor {
    constructor() {
        this.currentLevel = 'beta';
        this.targetLevel = 'theta';
        this.transitionDuration = 30000; // 30 seconds
        this.binauralId = null;
    }
    
    setTargetConsciousness(level) {
        this.targetLevel = level;
        
        // Stop current binaural beat
        if (this.binauralId) {
            window.breakawaySound.stopSound(this.binauralId);
        }
        
        // Start new binaural beat
        this.binauralId = window.breakawaySound.playBinauralBeat(level);
        
        // Play transition sound
        window.breakawaySound.playEventSound('portal', { fade: true });
        
        console.log(`Transitioning consciousness from ${this.currentLevel} to ${level}`);
        this.currentLevel = level;
    }
    
    emergencyWakeup() {
        // Rapid transition to beta/gamma for alertness
        this.setTargetConsciousness('beta');
        window.breakawaySound.playAlert(3);
        window.breakawaySound.setCategoryVolume('binaural', 0.8);
    }
}

// Example 4: Energy Grid Visualization with Sonic Feedback
class EnergyGridVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.nodes = [];
        this.connections = [];
        this.energyFlow = 0;
        this.resonanceActive = false;
    }
    
    addNode(x, y, energy) {
        const node = { x, y, energy, id: Date.now() };
        this.nodes.push(node);
        
        // Play connection sound scaled by energy
        const freq = 400 + (energy * 600); // 400-1000 Hz based on energy
        window.breakawaySound.playTone(freq, 0.3, 'sine', 'events', {
            fadeIn: 0.05,
            fadeOut: 0.1
        });
        
        return node;
    }
    
    connectNodes(node1, node2) {
        this.connections.push({ from: node1, to: node2 });
        
        // Play connection established sound
        window.breakawaySound.playEventSound('connection');
        
        // If creating sacred geometry pattern, play sacred frequency
        if (this.isSacredPattern()) {
            window.breakawaySound.playSacredFrequency('solfeggio.fa', 2);
        }
    }
    
    activateGridResonance() {
        if (!this.resonanceActive) {
            this.resonanceActive = true;
            
            // Start multiple layers for complex resonance
            window.breakawaySound.playSchumannResonance(true);
            window.breakawaySound.startAmbientLayer('quantumFlux');
            window.breakawaySound.playBinauralBeat('theta');
            
            // Play activation sequence
            const activationFreqs = [111, 222, 333, 444, 555, 666, 777, 888, 999];
            activationFreqs.forEach((freq, index) => {
                setTimeout(() => {
                    window.breakawaySound.playTone(freq, 0.5, 'sine', 'sacred');
                }, index * 200);
            });
        }
    }
    
    isSacredPattern() {
        // Check if nodes form sacred geometry
        // Simplified check - real implementation would be more complex
        return this.nodes.length === 6 || this.nodes.length === 12;
    }
}

// Example 5: Multi-Dimensional Portal Opening Sequence
async function openMultidimensionalPortal(portalType = 'standard') {
    console.log(`Initiating ${portalType} portal opening sequence...`);
    
    // Initialize if needed
    await window.breakawaySound.initialize();
    
    // Portal-specific configurations
    const portalConfigs = {
        standard: {
            frequencies: ['solfeggio.mi', 'solfeggio.sol', 'solfeggio.si'],
            binaural: 'theta',
            ambient: 'cosmicWind'
        },
        quantum: {
            frequencies: ['planetary.earth', 'planetary.sun', 'planetary.jupiter'],
            binaural: 'gamma',
            ambient: 'quantumFlux'
        },
        ancient: {
            frequencies: ['om', 'solfeggio.ut', 'solfeggio.la'],
            binaural: 'delta',
            ambient: 'ancientEchoes'
        }
    };
    
    const config = portalConfigs[portalType] || portalConfigs.standard;
    
    // Phase 1: Environmental preparation
    window.breakawaySound.startAmbientLayer(config.ambient);
    await delay(1000);
    
    // Phase 2: Consciousness alignment
    window.breakawaySound.playBinauralBeat(config.binaural);
    await delay(2000);
    
    // Phase 3: Frequency activation sequence
    for (const freq of config.frequencies) {
        window.breakawaySound.playSacredFrequency(freq, 3);
        window.breakawaySound.playEventSound('crystalline');
        await delay(2500);
    }
    
    // Phase 4: Portal manifestation
    window.breakawaySound.playEventSound('portal', { duration: 3, fade: true });
    
    // Create complex harmonic resonance
    const harmonicStack = [
        () => window.breakawaySound.playTone(256, 5, 'sine', 'sacred'),  // C
        () => window.breakawaySound.playTone(384, 5, 'sine', 'sacred'),  // G
        () => window.breakawaySound.playTone(512, 5, 'sine', 'sacred'),  // C octave
        () => window.breakawaySound.playTone(640, 5, 'sine', 'sacred'),  // E
    ];
    
    harmonicStack.forEach((play, index) => {
        setTimeout(play, index * 500);
    });
    
    console.log('Portal opening sequence complete');
}

// Example 6: Real-time Data Sonification
class DataSonifier {
    constructor() {
        this.dataStreams = new Map();
        this.baseFrequency = 440;
        this.frequencyRange = 880;
    }
    
    addDataStream(name, options = {}) {
        const stream = {
            name,
            min: options.min || 0,
            max: options.max || 100,
            soundType: options.soundType || 'sine',
            continuous: options.continuous || false,
            threshold: options.threshold || null,
            lastValue: 0
        };
        
        this.dataStreams.set(name, stream);
    }
    
    updateData(streamName, value) {
        const stream = this.dataStreams.get(streamName);
        if (!stream) return;
        
        // Normalize value to 0-1 range
        const normalized = (value - stream.min) / (stream.max - stream.min);
        const frequency = this.baseFrequency + (normalized * this.frequencyRange);
        
        if (stream.continuous) {
            // Update continuous tone
            if (!stream.oscillatorId) {
                stream.oscillatorId = `sonify_${streamName}`;
                const osc = window.breakawaySound.audioContext.createOscillator();
                const gain = window.breakawaySound.audioContext.createGain();
                
                osc.type = stream.soundType;
                osc.frequency.value = frequency;
                gain.gain.value = 0.3;
                
                osc.connect(gain);
                gain.connect(window.breakawaySound.gainNodes.get('events'));
                osc.start();
                
                stream.oscillator = osc;
                stream.gainNode = gain;
            } else {
                // Update frequency
                stream.oscillator.frequency.linearRampToValueAtTime(
                    frequency,
                    window.breakawaySound.audioContext.currentTime + 0.1
                );
            }
        } else {
            // Trigger discrete sound on threshold or change
            if (stream.threshold && value > stream.threshold && stream.lastValue <= stream.threshold) {
                window.breakawaySound.playTone(frequency, 0.5, stream.soundType);
                window.breakawaySound.playEventSound('discovery');
            } else if (Math.abs(value - stream.lastValue) > (stream.max - stream.min) * 0.1) {
                window.breakawaySound.playTone(frequency, 0.2, stream.soundType);
            }
        }
        
        stream.lastValue = value;
    }
    
    stopStream(streamName) {
        const stream = this.dataStreams.get(streamName);
        if (stream && stream.oscillator) {
            stream.oscillator.stop();
            stream.gainNode.disconnect();
            delete stream.oscillatorId;
            delete stream.oscillator;
            delete stream.gainNode;
        }
    }
}

// Example 7: Interactive Sound Healing Interface
class SoundHealingInterface {
    constructor(containerElement) {
        this.container = containerElement;
        this.activeFrequencies = new Set();
        this.healingMode = 'chakra';
        this.sessionDuration = 0;
        this.sessionStart = null;
    }
    
    startHealingSession(mode = 'chakra', duration = 300) {
        this.healingMode = mode;
        this.sessionDuration = duration;
        this.sessionStart = Date.now();
        
        console.log(`Starting ${mode} healing session for ${duration} seconds`);
        
        // Start base ambient
        window.breakawaySound.startAmbientLayer('crystalResonance');
        window.breakawaySound.setCategoryVolume('ambient', 0.3);
        
        // Begin healing sequence
        window.breakawaySound.playHealingSequence(mode, duration);
        
        // Add binaural enhancement
        window.breakawaySound.playBinauralBeat('theta');
        
        // Schedule session end
        setTimeout(() => this.endHealingSession(), duration * 1000);
    }
    
    addCustomFrequency(freq, duration = null) {
        const id = window.breakawaySound.playSacredFrequency(`custom_${freq}`, duration);
        this.activeFrequencies.add({ id, freq });
        
        // Visual feedback
        this.createFrequencyVisual(freq);
    }
    
    createFrequencyVisual(freq) {
        // Create visual representation of active frequency
        const visual = document.createElement('div');
        visual.className = 'frequency-visual';
        visual.style.cssText = `
            position: absolute;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: radial-gradient(circle, 
                hsla(${freq % 360}, 100%, 50%, 0.8), 
                transparent);
            animation: pulse ${60000/freq}s infinite;
            left: ${Math.random() * 80 + 10}%;
            top: ${Math.random() * 80 + 10}%;
        `;
        this.container.appendChild(visual);
    }
    
    endHealingSession() {
        console.log('Ending healing session');
        
        // Fade out all sounds
        window.breakawaySound.setCategoryVolume('sacred', 0);
        window.breakawaySound.setCategoryVolume('binaural', 0);
        window.breakawaySound.setCategoryVolume('ambient', 0);
        
        setTimeout(() => {
            window.breakawaySound.stopAll();
            // Restore default volumes
            window.breakawaySound.setCategoryVolume('sacred', 0.6);
            window.breakawaySound.setCategoryVolume('binaural', 0.5);
            window.breakawaySound.setCategoryVolume('ambient', 0.4);
        }, 2000);
    }
}

// Utility function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Example 8: Synchronized Audio-Visual Events
class AudioVisualSync {
    constructor() {
        this.events = [];
        this.timeline = 0;
        this.isPlaying = false;
    }
    
    addEvent(time, visualCallback, soundConfig) {
        this.events.push({ time, visualCallback, soundConfig });
        this.events.sort((a, b) => a.time - b.time);
    }
    
    play() {
        this.isPlaying = true;
        this.timeline = 0;
        const startTime = Date.now();
        
        const checkEvents = () => {
            if (!this.isPlaying) return;
            
            const elapsed = (Date.now() - startTime) / 1000;
            
            // Trigger events that should have played
            while (this.events.length > 0 && this.events[0].time <= elapsed) {
                const event = this.events.shift();
                
                // Execute visual callback
                if (event.visualCallback) {
                    event.visualCallback();
                }
                
                // Play associated sound
                if (event.soundConfig) {
                    this.playEventSound(event.soundConfig);
                }
            }
            
            if (this.events.length > 0) {
                requestAnimationFrame(checkEvents);
            }
        };
        
        checkEvents();
    }
    
    playEventSound(config) {
        switch (config.type) {
            case 'sacred':
                window.breakawaySound.playSacredFrequency(config.frequency, config.duration);
                break;
            case 'event':
                window.breakawaySound.playEventSound(config.event, config.options);
                break;
            case 'tone':
                window.breakawaySound.playTone(
                    config.frequency,
                    config.duration,
                    config.waveform,
                    config.mixer
                );
                break;
            case 'binaural':
                window.breakawaySound.playBinauralBeat(config.wave, config.duration);
                break;
        }
    }
}

// Export examples for use
window.soundExamples = {
    AnomalyDetector,
    ConsciousnessMonitor,
    EnergyGridVisualizer,
    DataSonifier,
    SoundHealingInterface,
    AudioVisualSync,
    activateSacredSite,
    openMultidimensionalPortal
};