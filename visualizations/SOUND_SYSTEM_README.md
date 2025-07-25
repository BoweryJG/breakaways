# Breakaway Sound System Documentation

## Overview

The Breakaway Sound System is a comprehensive Web Audio API-based sound generation system designed for mystical/technological visualizations. It provides sacred frequencies, binaural beats, consciousness alteration tools, and event-driven sound effects.

## Features

- **Sacred Frequencies**: Solfeggio scale, planetary frequencies, Pythagorean tuning
- **Binaural Beats**: Delta, Theta, Alpha, Beta, and Gamma wave generation
- **Schumann Resonance**: Earth's electromagnetic field simulation with harmonics
- **Event Sounds**: Activation, alerts, discoveries, anomalies, portals
- **Ambient Soundscapes**: Deep space, Earth hum, cosmic wind, crystal resonance
- **Frequency Healing**: Pre-programmed healing sequences
- **Sound Visualization**: Real-time frequency and waveform analysis
- **Volume Control**: Master and category-specific volume controls

## Quick Start

### Basic Initialization

```javascript
// The sound system auto-initializes on first user interaction
// Or manually initialize:
await window.breakawaySound.initialize();
```

### Playing Sacred Frequencies

```javascript
// Play 528 Hz (DNA repair frequency) for 5 seconds
breakawaySound.playSacredFrequency('solfeggio.mi', 5);

// Play Earth's planetary frequency
breakawaySound.playSacredFrequency('planetary.earth');

// Play Om frequency
breakawaySound.playSacredFrequency('om', 10);
```

### Binaural Beats for Consciousness

```javascript
// Start theta waves for meditation (returns ID for later control)
const binauralId = breakawaySound.playBinauralBeat('theta');

// Stop specific binaural beat
breakawaySound.stopSound(binauralId);
```

### Event Sounds

```javascript
// Play activation sound
breakawaySound.playEventSound('activation');

// Play discovery sound with custom options
breakawaySound.playEventSound('discovery', {
    duration: 1.5,
    freq: 2000
});

// Play multi-level alerts
breakawaySound.playAlert(1); // Low priority
breakawaySound.playAlert(4); // Critical alert
```

### Ambient Soundscapes

```javascript
// Start ambient layer
breakawaySound.startAmbientLayer('deepSpace');

// Stop ambient layer
breakawaySound.stopAmbientLayer('deepSpace');

// Available layers:
// - deepSpace
// - earthHum
// - cosmicWind
// - crystalResonance
// - ancientEchoes
// - quantumFlux
```

### Volume Control

```javascript
// Set master volume (0-1)
breakawaySound.setMasterVolume(0.7);

// Set category volume
breakawaySound.setCategoryVolume('sacred', 0.6);
breakawaySound.setCategoryVolume('binaural', 0.5);
breakawaySound.setCategoryVolume('events', 0.8);
breakawaySound.setCategoryVolume('ambient', 0.4);
breakawaySound.setCategoryVolume('alerts', 0.9);

// Toggle mute
breakawaySound.toggleMute();
```

## Integration Examples

### 1. Anomaly Detection with Sound

```javascript
if (anomalyLevel > 0.8) {
    breakawaySound.playAlert(3);
    breakawaySound.playEventSound('anomaly');
}
```

### 2. Sacred Site Activation

```javascript
// Activation sequence
breakawaySound.playEventSound('portal', { duration: 2 });
setTimeout(() => breakawaySound.playSacredFrequency('solfeggio.mi', 3), 2000);
setTimeout(() => breakawaySound.playEventSound('crystalline'), 5000);
```

### 3. Healing Session

```javascript
// Start a 30-second chakra healing sequence
breakawaySound.playHealingSequence('chakra', 30);

// Available sequences: 'chakra', 'dna', 'calm', 'energy'
```

### 4. Data Sonification

```javascript
// Convert data values to frequencies
const frequency = 440 + (normalizedValue * 440); // 440-880 Hz range
breakawaySound.playTone(frequency, 0.2, 'sine');
```

### 5. Visualization Integration

```javascript
// Get audio analysis data for visualizations
const audioData = breakawaySound.getVisualizationData();
// Returns: { frequencies, waveform, energy, dominantFrequency }
```

## Sacred Frequency Reference

### Solfeggio Frequencies
- **396 Hz** (`solfeggio.ut`) - Liberation from fear
- **417 Hz** (`solfeggio.re`) - Facilitating change
- **528 Hz** (`solfeggio.mi`) - DNA repair, transformation
- **639 Hz** (`solfeggio.fa`) - Connecting relationships
- **741 Hz** (`solfeggio.sol`) - Awakening intuition
- **852 Hz** (`solfeggio.la`) - Spiritual order
- **963 Hz** (`solfeggio.si`) - Divine consciousness

### Planetary Frequencies
- **Earth**: 194.18 Hz
- **Moon**: 210.42 Hz
- **Sun**: 126.22 Hz
- **Venus**: 221.23 Hz
- **Mars**: 144.72 Hz
- **Jupiter**: 183.58 Hz
- **Saturn**: 147.85 Hz

### Special Frequencies
- **Om**: 136.1 Hz
- **A432**: 432 Hz (Natural tuning)
- **Schumann**: 7.83 Hz (Earth's resonance)

## Binaural Beat Reference

- **Delta** (0.5-4 Hz): Deep sleep, healing
- **Theta** (4-8 Hz): Meditation, creativity
- **Alpha** (8-13 Hz): Relaxation, focus
- **Beta** (13-30 Hz): Alertness, concentration
- **Gamma** (30-100 Hz): Higher consciousness

## Event Sound Types

- `activation` - System activation
- `alert` - Warning sound
- `warning` - Sustained warning
- `discovery` - New discovery indication
- `connection` - Connection established
- `anomaly` - Anomaly detected
- `portal` - Portal/transition effect
- `crystalline` - Crystal-like harmonic sound

## Best Practices

1. **Initialize on User Interaction**: Audio context requires user interaction to start
2. **Manage Active Sounds**: Store sound IDs to stop them later
3. **Use Appropriate Volumes**: Different sound types need different levels
4. **Layer Sounds Carefully**: Too many simultaneous sounds can be overwhelming
5. **Consider Headphones**: Binaural beats require stereo separation

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Requires user interaction to start
- Mobile: May have additional restrictions

## Performance Tips

- Stop unused sounds with `stopSound(id)`
- Use `stopAll()` when changing contexts
- Ambient layers are CPU-intensive, use sparingly
- The visualization data updates at 60fps, throttle if needed

## Advanced Usage

### Custom Frequency Generation

```javascript
// Play custom tone
breakawaySound.playTone(
    frequency,    // Hz
    duration,     // seconds
    waveform,     // 'sine', 'square', 'sawtooth', 'triangle'
    mixer,        // 'sacred', 'events', 'ambient', etc.
    options       // { fadeIn, fadeOut }
);
```

### Modulated Schumann Resonance

```javascript
// With slow modulation for enhanced effect
breakawaySound.playSchumannResonance(true, {
    rate: 0.1,   // Modulation rate in Hz
    depth: 0.5   // Modulation depth
});
```

### Multi-layered Ambient

```javascript
// Create complex ambient environment
['deepSpace', 'earthHum', 'quantumFlux'].forEach(layer => {
    breakawaySound.startAmbientLayer(layer);
});
breakawaySound.setCategoryVolume('ambient', 0.3);
```

## Troubleshooting

**No sound playing:**
- Check browser console for errors
- Ensure user has interacted with page
- Verify volume is not muted
- Check category volumes

**Crackling or distortion:**
- Lower the master volume
- Reduce number of simultaneous sounds
- Check CPU usage

**Binaural beats not working:**
- Requires headphones for proper effect
- Ensure stereo output
- Check binaural volume level