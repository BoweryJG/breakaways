// Breakaway Civilization Sound System
// Advanced Web Audio API integration for mystical/technological audio generation
// Sacred frequencies, binaural beats, consciousness alteration, and event-driven sound

class BreakawaySound {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.analyser = null;
        this.isInitialized = false;
        this.isMuted = false;
        
        // Sound categories
        this.oscillators = new Map();
        this.gainNodes = new Map();
        this.filters = new Map();
        this.convolutions = new Map();
        this.scheduledSounds = new Map();
        
        // Sacred frequencies (Hz)
        this.sacredFrequencies = {
            om: 136.1,          // Om frequency
            solfeggio: {
                ut: 396,        // Liberation from fear
                re: 417,        // Facilitating change
                mi: 528,        // Transformation & miracles (DNA repair)
                fa: 639,        // Connecting relationships
                sol: 741,       // Awakening intuition
                la: 852,        // Returning to spiritual order
                si: 963         // Connection to divine consciousness
            },
            schumann: {
                fundamental: 7.83,
                harmonics: [14.3, 20.8, 27.3, 33.8, 39.0, 45.0]
            },
            pythagorean: {
                A: 432,         // Natural tuning
                C: 256,         // Scientific pitch
                G: 384          // Perfect fifth from C
            },
            planetary: {
                earth: 194.18,  // Earth year
                moon: 210.42,   // Synodic moon
                sun: 126.22,    // Earth-Sun
                venus: 221.23,  // Venus
                mars: 144.72,   // Mars
                jupiter: 183.58,// Jupiter
                saturn: 147.85  // Saturn
            }
        };
        
        // Binaural beat configurations
        this.binauralConfigs = {
            delta: { base: 200, beat: 2, purpose: 'Deep sleep, healing' },
            theta: { base: 300, beat: 6, purpose: 'Meditation, creativity' },
            alpha: { base: 400, beat: 10, purpose: 'Relaxation, focus' },
            beta: { base: 500, beat: 20, purpose: 'Alertness, concentration' },
            gamma: { base: 600, beat: 40, purpose: 'Higher consciousness' }
        };
        
        // Event sound presets
        this.eventSounds = {
            activation: { freq: 1200, duration: 0.3, type: 'sine' },
            alert: { freq: 800, duration: 0.5, type: 'square', pulses: 3 },
            warning: { freq: 440, duration: 1, type: 'sawtooth' },
            discovery: { freq: 1500, duration: 0.8, type: 'triangle' },
            connection: { freq: 660, duration: 0.4, type: 'sine' },
            anomaly: { freq: 333, duration: 0.6, type: 'square' },
            portal: { freq: 963, duration: 2, type: 'sine', fade: true },
            crystalline: { freq: 2093, duration: 1.5, type: 'sine', harmonics: [2, 3, 4] }
        };
        
        // Ambient soundscape layers
        this.ambientLayers = {
            deepSpace: { active: false, gain: 0.3 },
            earthHum: { active: false, gain: 0.4 },
            cosmicWind: { active: false, gain: 0.2 },
            crystalResonance: { active: false, gain: 0.25 },
            ancientEchoes: { active: false, gain: 0.35 },
            quantumFlux: { active: false, gain: 0.15 }
        };
        
        // Volume controls
        this.volumes = {
            master: 0.7,
            sacred: 0.6,
            binaural: 0.5,
            events: 0.8,
            ambient: 0.4,
            alerts: 0.9
        };
        
        // Visualization data
        this.visualizationData = {
            frequencies: new Float32Array(512),
            waveform: new Float32Array(512),
            spectrum: [],
            energy: 0,
            dominantFrequency: 0
        };
    }
    
    // Initialize the audio context
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            // Create audio context with fallback
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create master gain node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.volumes.master;
            this.masterGain.connect(this.audioContext.destination);
            
            // Create analyser for visualization
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 1024;
            this.analyser.smoothingTimeConstant = 0.8;
            this.masterGain.connect(this.analyser);
            
            // Create sub-mixers
            this.createSubMixers();
            
            // Resume context if suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            this.isInitialized = true;
            console.log('BreakawaySound System initialized');
            
        } catch (error) {
            console.error('Failed to initialize audio system:', error);
        }
    }
    
    // Create sub-mixer gain nodes
    createSubMixers() {
        const mixers = ['sacred', 'binaural', 'events', 'ambient', 'alerts'];
        
        mixers.forEach(mixer => {
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = this.volumes[mixer];
            gainNode.connect(this.masterGain);
            this.gainNodes.set(mixer, gainNode);
        });
    }
    
    // Play a sacred frequency
    playSacredFrequency(frequencyName, duration = null, fadeIn = 0.1, fadeOut = 0.1) {
        if (!this.isInitialized || this.isMuted) return;
        
        let frequency;
        
        // Parse frequency from nested structure
        if (frequencyName.includes('.')) {
            const parts = frequencyName.split('.');
            frequency = this.sacredFrequencies[parts[0]][parts[1]];
        } else {
            frequency = this.sacredFrequencies[frequencyName];
        }
        
        if (!frequency) {
            console.warn(`Sacred frequency '${frequencyName}' not found`);
            return;
        }
        
        const id = `sacred_${frequencyName}_${Date.now()}`;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        
        // Create harmonic richness
        const harmonicGain = this.audioContext.createGain();
        harmonicGain.gain.value = 0.3;
        
        const harmonic2 = this.audioContext.createOscillator();
        harmonic2.type = 'sine';
        harmonic2.frequency.value = frequency * 2;
        harmonic2.connect(harmonicGain);
        
        const harmonic3 = this.audioContext.createOscillator();
        harmonic3.type = 'sine';
        harmonic3.frequency.value = frequency * 3;
        harmonic3.connect(harmonicGain);
        
        // Connect nodes
        oscillator.connect(gainNode);
        harmonicGain.connect(gainNode);
        gainNode.connect(this.gainNodes.get('sacred'));
        
        // Fade in
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + fadeIn);
        
        // Start oscillators
        oscillator.start();
        harmonic2.start();
        harmonic3.start();
        
        // Store references
        this.oscillators.set(id, [oscillator, harmonic2, harmonic3]);
        this.gainNodes.set(id, gainNode);
        
        // Schedule stop if duration specified
        if (duration) {
            gainNode.gain.setValueAtTime(1, this.audioContext.currentTime + duration - fadeOut);
            gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
            
            oscillator.stop(this.audioContext.currentTime + duration);
            harmonic2.stop(this.audioContext.currentTime + duration);
            harmonic3.stop(this.audioContext.currentTime + duration);
            
            setTimeout(() => this.cleanupSound(id), (duration + 0.1) * 1000);
        }
        
        return id;
    }
    
    // Generate binaural beats for consciousness alteration
    playBinauralBeat(type, duration = null) {
        if (!this.isInitialized || this.isMuted) return;
        
        const config = this.binauralConfigs[type];
        if (!config) {
            console.warn(`Binaural type '${type}' not found`);
            return;
        }
        
        const id = `binaural_${type}_${Date.now()}`;
        
        // Left ear oscillator
        const oscLeft = this.audioContext.createOscillator();
        const gainLeft = this.audioContext.createGain();
        const panLeft = this.audioContext.createStereoPanner();
        
        oscLeft.type = 'sine';
        oscLeft.frequency.value = config.base;
        panLeft.pan.value = -1;
        
        oscLeft.connect(gainLeft);
        gainLeft.connect(panLeft);
        panLeft.connect(this.gainNodes.get('binaural'));
        
        // Right ear oscillator (with beat frequency)
        const oscRight = this.audioContext.createOscillator();
        const gainRight = this.audioContext.createGain();
        const panRight = this.audioContext.createStereoPanner();
        
        oscRight.type = 'sine';
        oscRight.frequency.value = config.base + config.beat;
        panRight.pan.value = 1;
        
        oscRight.connect(gainRight);
        gainRight.connect(panRight);
        panRight.connect(this.gainNodes.get('binaural'));
        
        // Fade in
        gainLeft.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainLeft.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 1);
        gainRight.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainRight.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 1);
        
        // Start oscillators
        oscLeft.start();
        oscRight.start();
        
        // Store references
        this.oscillators.set(id, [oscLeft, oscRight]);
        this.gainNodes.set(id, [gainLeft, gainRight]);
        
        // Schedule stop if duration specified
        if (duration) {
            const fadeOutTime = Math.min(duration * 0.1, 2);
            
            gainLeft.gain.setValueAtTime(0.5, this.audioContext.currentTime + duration - fadeOutTime);
            gainLeft.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
            gainRight.gain.setValueAtTime(0.5, this.audioContext.currentTime + duration - fadeOutTime);
            gainRight.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
            
            oscLeft.stop(this.audioContext.currentTime + duration);
            oscRight.stop(this.audioContext.currentTime + duration);
            
            setTimeout(() => this.cleanupSound(id), (duration + 0.1) * 1000);
        }
        
        return id;
    }
    
    // Play Schumann resonance with dynamic modulation
    playSchumannResonance(includeHarmonics = true, modulation = null) {
        if (!this.isInitialized || this.isMuted) return;
        
        const id = 'schumann_resonance';
        
        // Stop existing Schumann resonance if playing
        this.stopSound(id);
        
        const oscillators = [];
        const gains = [];
        
        // Fundamental frequency
        const fundamental = this.audioContext.createOscillator();
        const fundamentalGain = this.audioContext.createGain();
        
        fundamental.type = 'sine';
        fundamental.frequency.value = this.sacredFrequencies.schumann.fundamental;
        fundamentalGain.gain.value = 0.6;
        
        fundamental.connect(fundamentalGain);
        fundamentalGain.connect(this.gainNodes.get('sacred'));
        
        oscillators.push(fundamental);
        gains.push(fundamentalGain);
        
        // Add harmonics
        if (includeHarmonics) {
            this.sacredFrequencies.schumann.harmonics.forEach((freq, index) => {
                const harmonic = this.audioContext.createOscillator();
                const harmonicGain = this.audioContext.createGain();
                
                harmonic.type = 'sine';
                harmonic.frequency.value = freq;
                harmonicGain.gain.value = 0.3 / (index + 1); // Decreasing amplitude
                
                harmonic.connect(harmonicGain);
                harmonicGain.connect(this.gainNodes.get('sacred'));
                
                oscillators.push(harmonic);
                gains.push(harmonicGain);
            });
        }
        
        // Apply modulation if specified
        if (modulation) {
            const lfo = this.audioContext.createOscillator();
            const lfoGain = this.audioContext.createGain();
            
            lfo.type = 'sine';
            lfo.frequency.value = modulation.rate || 0.1;
            lfoGain.gain.value = modulation.depth || 0.5;
            
            lfo.connect(lfoGain);
            
            oscillators.forEach(osc => {
                lfoGain.connect(osc.frequency);
            });
            
            lfo.start();
            oscillators.push(lfo);
        }
        
        // Start all oscillators
        oscillators.forEach(osc => osc.start());
        
        // Store references
        this.oscillators.set(id, oscillators);
        this.gainNodes.set(id, gains);
        
        return id;
    }
    
    // Play event-triggered sound effects
    playEventSound(eventType, options = {}) {
        if (!this.isInitialized || this.isMuted) return;
        
        const preset = this.eventSounds[eventType];
        if (!preset) {
            console.warn(`Event sound '${eventType}' not found`);
            return;
        }
        
        const config = { ...preset, ...options };
        const id = `event_${eventType}_${Date.now()}`;
        
        if (config.pulses && config.pulses > 1) {
            // Play multiple pulses
            for (let i = 0; i < config.pulses; i++) {
                setTimeout(() => {
                    this.playTone(config.freq, config.duration / config.pulses, config.type, 'events');
                }, i * (config.duration / config.pulses) * 1000 * 1.2);
            }
        } else {
            // Single tone
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = config.type;
            oscillator.frequency.value = config.freq;
            
            // Add harmonics for crystalline sound
            if (config.harmonics) {
                const harmonicMixer = this.audioContext.createGain();
                harmonicMixer.gain.value = 0.3;
                
                config.harmonics.forEach(mult => {
                    const harmonic = this.audioContext.createOscillator();
                    harmonic.type = 'sine';
                    harmonic.frequency.value = config.freq * mult;
                    harmonic.connect(harmonicMixer);
                    harmonic.start();
                    harmonic.stop(this.audioContext.currentTime + config.duration);
                });
                
                harmonicMixer.connect(gainNode);
            }
            
            oscillator.connect(gainNode);
            gainNode.connect(this.gainNodes.get('events'));
            
            // Apply envelope
            if (config.fade) {
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.8, this.audioContext.currentTime + config.duration * 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + config.duration);
            } else {
                gainNode.gain.setValueAtTime(0.8, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.8, this.audioContext.currentTime + config.duration - 0.05);
                gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + config.duration);
            }
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + config.duration);
            
            setTimeout(() => this.cleanupSound(id), (config.duration + 0.1) * 1000);
        }
        
        return id;
    }
    
    // Generate ambient soundscape
    startAmbientLayer(layerName) {
        if (!this.isInitialized || this.isMuted) return;
        
        const layer = this.ambientLayers[layerName];
        if (!layer || layer.active) return;
        
        const id = `ambient_${layerName}`;
        layer.active = true;
        
        switch (layerName) {
            case 'deepSpace':
                this.createDeepSpaceAmbient(id, layer.gain);
                break;
            case 'earthHum':
                this.createEarthHumAmbient(id, layer.gain);
                break;
            case 'cosmicWind':
                this.createCosmicWindAmbient(id, layer.gain);
                break;
            case 'crystalResonance':
                this.createCrystalResonanceAmbient(id, layer.gain);
                break;
            case 'ancientEchoes':
                this.createAncientEchoesAmbient(id, layer.gain);
                break;
            case 'quantumFlux':
                this.createQuantumFluxAmbient(id, layer.gain);
                break;
        }
        
        return id;
    }
    
    // Create deep space ambient
    createDeepSpaceAmbient(id, volume) {
        const oscillators = [];
        const gains = [];
        
        // Low frequency drone
        for (let i = 0; i < 3; i++) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            osc.type = 'sine';
            osc.frequency.value = 40 + i * 7;
            gain.gain.value = volume / 3;
            
            filter.type = 'lowpass';
            filter.frequency.value = 200;
            filter.Q.value = 5;
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.gainNodes.get('ambient'));
            
            // Slow frequency modulation
            const lfo = this.audioContext.createOscillator();
            const lfoGain = this.audioContext.createGain();
            
            lfo.type = 'sine';
            lfo.frequency.value = 0.05 + i * 0.01;
            lfoGain.gain.value = 2;
            
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            
            osc.start();
            lfo.start();
            
            oscillators.push(osc, lfo);
            gains.push(gain);
        }
        
        this.oscillators.set(id, oscillators);
        this.gainNodes.set(id, gains);
    }
    
    // Create Earth hum ambient
    createEarthHumAmbient(id, volume) {
        const noise = this.createBrownNoise();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        gain.gain.value = volume;
        
        filter.type = 'bandpass';
        filter.frequency.value = 50;
        filter.Q.value = 10;
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.gainNodes.get('ambient'));
        
        // Add subtle oscillator
        const osc = this.audioContext.createOscillator();
        const oscGain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = 50;
        oscGain.gain.value = volume * 0.3;
        
        osc.connect(oscGain);
        oscGain.connect(this.gainNodes.get('ambient'));
        
        osc.start();
        
        this.oscillators.set(id, [osc]);
        this.gainNodes.set(id, [gain, oscGain]);
    }
    
    // Create cosmic wind ambient
    createCosmicWindAmbient(id, volume) {
        const noise = this.createWhiteNoise();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();
        
        gain.gain.value = volume;
        
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        filter.Q.value = 0.5;
        
        // Modulate filter frequency for wind effect
        lfo.type = 'sine';
        lfo.frequency.value = 0.3;
        lfoGain.gain.value = 500;
        
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.gainNodes.get('ambient'));
        
        lfo.start();
        
        this.oscillators.set(id, [lfo]);
        this.gainNodes.set(id, [gain]);
    }
    
    // Create crystal resonance ambient
    createCrystalResonanceAmbient(id, volume) {
        const oscillators = [];
        const gains = [];
        
        // Crystal bell-like tones
        const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        frequencies.forEach((freq, index) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            filter.type = 'highpass';
            filter.frequency.value = freq * 0.9;
            filter.Q.value = 30;
            
            // Random triggering
            const scheduleChime = () => {
                const delay = Math.random() * 10 + 5;
                gain.gain.setValueAtTime(0, this.audioContext.currentTime + delay);
                gain.gain.linearRampToValueAtTime(volume / 4, this.audioContext.currentTime + delay + 0.01);
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + delay + 3);
                
                if (this.ambientLayers.crystalResonance.active) {
                    setTimeout(scheduleChime, (delay + 3) * 1000);
                }
            };
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.gainNodes.get('ambient'));
            
            osc.start();
            scheduleChime();
            
            oscillators.push(osc);
            gains.push(gain);
        });
        
        this.oscillators.set(id, oscillators);
        this.gainNodes.set(id, gains);
    }
    
    // Create ancient echoes ambient
    createAncientEchoesAmbient(id, volume) {
        // Use convolution reverb for cave-like echoes
        const source = this.createBrownNoise();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        const convolver = this.audioContext.createConvolver();
        
        gain.gain.value = volume;
        
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        
        // Create impulse response for reverb
        const length = this.audioContext.sampleRate * 4;
        const impulse = this.audioContext.createBuffer(2, length, this.audioContext.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }
        
        convolver.buffer = impulse;
        
        source.connect(filter);
        filter.connect(convolver);
        convolver.connect(gain);
        gain.connect(this.gainNodes.get('ambient'));
        
        this.gainNodes.set(id, [gain]);
    }
    
    // Create quantum flux ambient
    createQuantumFluxAmbient(id, volume) {
        const oscillators = [];
        const gains = [];
        
        // Glitchy, unstable tones
        for (let i = 0; i < 5; i++) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const panner = this.audioContext.createStereoPanner();
            
            osc.type = ['sine', 'square', 'sawtooth'][Math.floor(Math.random() * 3)];
            osc.frequency.value = Math.random() * 1000 + 200;
            
            gain.gain.value = 0;
            
            // Random pan position
            panner.pan.value = Math.random() * 2 - 1;
            
            // Glitch effect
            const glitch = () => {
                if (!this.ambientLayers.quantumFlux.active) return;
                
                const duration = Math.random() * 0.1 + 0.05;
                const delay = Math.random() * 2 + 0.5;
                
                gain.gain.setValueAtTime(0, this.audioContext.currentTime + delay);
                gain.gain.linearRampToValueAtTime(volume / 5, this.audioContext.currentTime + delay + 0.01);
                gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + delay + duration);
                
                osc.frequency.setValueAtTime(
                    Math.random() * 1000 + 200,
                    this.audioContext.currentTime + delay
                );
                
                setTimeout(glitch, (delay + duration + Math.random()) * 1000);
            };
            
            osc.connect(gain);
            gain.connect(panner);
            panner.connect(this.gainNodes.get('ambient'));
            
            osc.start();
            glitch();
            
            oscillators.push(osc);
            gains.push(gain);
        }
        
        this.oscillators.set(id, oscillators);
        this.gainNodes.set(id, gains);
    }
    
    // Stop ambient layer
    stopAmbientLayer(layerName) {
        const layer = this.ambientLayers[layerName];
        if (!layer || !layer.active) return;
        
        layer.active = false;
        const id = `ambient_${layerName}`;
        
        this.stopSound(id);
    }
    
    // Play frequency healing tone sequence
    playHealingSequence(sequence = 'chakra', duration = 30) {
        if (!this.isInitialized || this.isMuted) return;
        
        const sequences = {
            chakra: [396, 417, 528, 639, 741, 852, 963],
            dna: [528, 639, 741, 528],
            calm: [174, 285, 396, 417, 528],
            energy: [285, 528, 639, 741, 852]
        };
        
        const freqs = sequences[sequence] || sequences.chakra;
        const toneDuration = duration / freqs.length;
        
        freqs.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, toneDuration * 0.9, 'sine', 'sacred', {
                    fadeIn: toneDuration * 0.1,
                    fadeOut: toneDuration * 0.1
                });
            }, index * toneDuration * 1000);
        });
        
        return `healing_${sequence}`;
    }
    
    // Play alert sound with urgency level
    playAlert(urgencyLevel = 1) {
        if (!this.isInitialized) return; // Alerts play even if muted
        
        const configs = [
            { freq: 440, pulses: 1, duration: 0.5 },  // Level 1 - Low
            { freq: 660, pulses: 2, duration: 0.8 },  // Level 2 - Medium
            { freq: 880, pulses: 3, duration: 1.2 },  // Level 3 - High
            { freq: 1100, pulses: 5, duration: 2 }    // Level 4 - Critical
        ];
        
        const config = configs[Math.min(urgencyLevel - 1, 3)];
        
        for (let i = 0; i < config.pulses; i++) {
            setTimeout(() => {
                this.playTone(config.freq, config.duration / config.pulses, 'square', 'alerts', {
                    fadeIn: 0.01,
                    fadeOut: 0.05
                });
            }, i * (config.duration / config.pulses) * 1000 * 1.1);
        }
        
        return `alert_level_${urgencyLevel}`;
    }
    
    // Utility function to play a simple tone
    playTone(frequency, duration, type = 'sine', mixer = 'events', options = {}) {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        
        oscillator.connect(gainNode);
        gainNode.connect(this.gainNodes.get(mixer) || this.masterGain);
        
        // Apply envelope
        const fadeIn = options.fadeIn || 0.01;
        const fadeOut = options.fadeOut || 0.01;
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.8, this.audioContext.currentTime + fadeIn);
        gainNode.gain.setValueAtTime(0.8, this.audioContext.currentTime + duration - fadeOut);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    // Create white noise generator
    createWhiteNoise() {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        const whiteNoise = this.audioContext.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.start();
        
        return whiteNoise;
    }
    
    // Create brown noise generator
    createBrownNoise() {
        const bufferSize = 2 * this.audioContext.sampleRate;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5; // Compensate for volume loss
        }
        
        const brownNoise = this.audioContext.createBufferSource();
        brownNoise.buffer = noiseBuffer;
        brownNoise.loop = true;
        brownNoise.start();
        
        return brownNoise;
    }
    
    // Stop a specific sound
    stopSound(id) {
        // Stop oscillators
        const oscillators = this.oscillators.get(id);
        if (oscillators) {
            oscillators.forEach(osc => {
                try {
                    osc.stop();
                } catch (e) {
                    // Already stopped
                }
            });
            this.oscillators.delete(id);
        }
        
        // Disconnect gain nodes
        const gains = this.gainNodes.get(id);
        if (gains) {
            const gainArray = Array.isArray(gains) ? gains : [gains];
            gainArray.forEach(gain => {
                gain.disconnect();
            });
            this.gainNodes.delete(id);
        }
    }
    
    // Clean up stopped sounds
    cleanupSound(id) {
        this.oscillators.delete(id);
        this.gainNodes.delete(id);
        this.filters.delete(id);
    }
    
    // Stop all sounds
    stopAll() {
        this.oscillators.forEach((_, id) => this.stopSound(id));
        
        // Reset ambient layers
        Object.keys(this.ambientLayers).forEach(layer => {
            this.ambientLayers[layer].active = false;
        });
    }
    
    // Volume control methods
    setMasterVolume(volume) {
        this.volumes.master = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.linearRampToValueAtTime(
                this.volumes.master,
                this.audioContext.currentTime + 0.1
            );
        }
    }
    
    setCategoryVolume(category, volume) {
        this.volumes[category] = Math.max(0, Math.min(1, volume));
        const gainNode = this.gainNodes.get(category);
        if (gainNode) {
            gainNode.gain.linearRampToValueAtTime(
                this.volumes[category],
                this.audioContext.currentTime + 0.1
            );
        }
    }
    
    // Mute control
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.linearRampToValueAtTime(
                this.isMuted ? 0 : this.volumes.master,
                this.audioContext.currentTime + 0.1
            );
        }
        return this.isMuted;
    }
    
    // Get visualization data
    getVisualizationData() {
        if (!this.analyser) return this.visualizationData;
        
        // Get frequency data
        this.analyser.getFloatFrequencyData(this.visualizationData.frequencies);
        
        // Get waveform data
        this.analyser.getFloatTimeDomainData(this.visualizationData.waveform);
        
        // Calculate energy
        let energy = 0;
        for (let i = 0; i < this.visualizationData.frequencies.length; i++) {
            energy += Math.pow(10, this.visualizationData.frequencies[i] / 20);
        }
        this.visualizationData.energy = energy / this.visualizationData.frequencies.length;
        
        // Find dominant frequency
        let maxDb = -Infinity;
        let dominantBin = 0;
        for (let i = 0; i < this.visualizationData.frequencies.length; i++) {
            if (this.visualizationData.frequencies[i] > maxDb) {
                maxDb = this.visualizationData.frequencies[i];
                dominantBin = i;
            }
        }
        
        const nyquist = this.audioContext.sampleRate / 2;
        this.visualizationData.dominantFrequency = (dominantBin / this.visualizationData.frequencies.length) * nyquist;
        
        return this.visualizationData;
    }
    
    // Integration helper for visualizations
    createSoundForVisualization(type, config = {}) {
        switch (type) {
            case 'activation':
                return this.playEventSound('activation', config);
            case 'discovery':
                return this.playEventSound('discovery', config);
            case 'anomaly':
                return this.playEventSound('anomaly', config);
            case 'connection':
                return this.playEventSound('connection', config);
            case 'sacred':
                return this.playSacredFrequency(config.frequency || 'solfeggio.mi', config.duration);
            case 'binaural':
                return this.playBinauralBeat(config.wave || 'alpha', config.duration);
            case 'schumann':
                return this.playSchumannResonance(config.harmonics, config.modulation);
            case 'healing':
                return this.playHealingSequence(config.sequence, config.duration);
            case 'alert':
                return this.playAlert(config.level || 1);
            default:
                console.warn(`Unknown visualization sound type: ${type}`);
                return null;
        }
    }
    
    // Cleanup method
    dispose() {
        this.stopAll();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        this.isInitialized = false;
    }
}

// Create global instance
window.breakawaySound = new BreakawaySound();

// Auto-initialize on user interaction
let initAttempted = false;
const attemptInit = async () => {
    if (!initAttempted) {
        initAttempted = true;
        await window.breakawaySound.initialize();
        
        // Remove listeners after successful init
        document.removeEventListener('click', attemptInit);
        document.removeEventListener('keydown', attemptInit);
    }
};

// Add listeners for user interaction
document.addEventListener('click', attemptInit);
document.addEventListener('keydown', attemptInit);

// Export for module usage
export default window.breakawaySound;