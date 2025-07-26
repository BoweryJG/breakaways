// Population Genetics - Ultra-Advanced Global Genetic Flow Visualization

let pgScene, pgCamera, pgRenderer, pgControls;
let geneticGlobe, atmosphereGlow;
let migrationFlows = [];
let geneticNodes = [];
let anomalyMarkers = [];
let timelinePosition = 0;
let autoPlayTimeline = false;
let selectedMarker = null;
let particleSystems = [];
let heatmapOverlay;
let pgAnimationId;

// Genetic data with historical context
const geneticData = {
    rhNegativeHotspots: [
        { name: 'Basque Country', coords: [42.8, -2.0], concentration: 35, ancient: true },
        { name: 'Atlas Mountains', coords: [31.0, -7.0], concentration: 29, ancient: true },
        { name: 'Scottish Highlands', coords: [57.0, -4.5], concentration: 30, ancient: true },
        { name: 'Caucasus', coords: [42.0, 44.0], concentration: 28, ancient: true },
        { name: 'Eastern Europe', coords: [50.0, 30.0], concentration: 18, ancient: false },
        { name: 'Scandinavia', coords: [62.0, 15.0], concentration: 24, ancient: true },
        { name: 'Ireland', coords: [53.0, -8.0], concentration: 25, ancient: true },
        { name: 'Tibet', coords: [30.0, 91.0], concentration: 15, ancient: false }
    ],
    
    ancientMigrations: [
        {
            name: 'Out of Atlantis',
            period: -10000,
            routes: [
                { from: [30.0, -25.0], to: [42.8, -2.0], intensity: 0.9 }, // To Basque
                { from: [30.0, -25.0], to: [31.0, -7.0], intensity: 0.8 }, // To Atlas
                { from: [30.0, -25.0], to: [51.5, -0.1], intensity: 0.7 }  // To Britain
            ]
        },
        {
            name: 'Hyperborean Dispersal',
            period: -8000,
            routes: [
                { from: [75.0, 0.0], to: [62.0, 15.0], intensity: 0.8 }, // To Scandinavia
                { from: [75.0, 0.0], to: [57.0, -4.5], intensity: 0.7 }, // To Scotland
                { from: [75.0, 0.0], to: [50.0, 30.0], intensity: 0.6 }  // To E. Europe
            ]
        },
        {
            name: 'Indo-European Expansion',
            period: -4000,
            routes: [
                { from: [42.0, 44.0], to: [50.0, 10.0], intensity: 0.6 },
                { from: [42.0, 44.0], to: [40.0, 70.0], intensity: 0.7 },
                { from: [42.0, 44.0], to: [35.0, 50.0], intensity: 0.5 }
            ]
        }
    ],
    
    geneticMarkers: {
        'FOXP2': { 
            name: 'Language Gene',
            distribution: [[51.5, -0.1], [48.8, 2.3], [40.7, -74.0]],
            activation: 0.7
        },
        'DRD4-7R': {
            name: 'Wanderer Gene',
            distribution: [[37.7, -122.4], [35.6, 139.6], [-33.8, 151.2]],
            activation: 0.6
        },
        'MAOA-2R': {
            name: 'Warrior Gene',
            distribution: [[59.3, 18.0], [55.7, 37.6], [39.9, 116.4]],
            activation: 0.5
        },
        'HAR1': {
            name: 'Consciousness Gene',
            distribution: [[30.0, 91.0], [27.1, 78.0], [19.4, -99.1]],
            activation: 0.8
        }
    },
    
    anomalies: [
        { name: 'Elongated Skulls', coords: [-13.5, -71.9], type: 'morphological' },
        { name: 'Giant Remains', coords: [35.0, -110.0], type: 'morphological' },
        { name: 'Psychic Clusters', coords: [55.0, -3.0], type: 'cognitive' },
        { name: 'Immunity Anomaly', coords: [0.0, 20.0], type: 'biological' }
    ]
};

function initPopulationGenetics() {
    const container = document.getElementById('population-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create main visualization container
    const vizContainer = document.createElement('div');
    vizContainer.id = 'pg-viz-container';
    vizContainer.style.cssText = 'width: 100%; height: 600px; position: relative;';
    container.appendChild(vizContainer);
    
    // Create control panel
    createGeneticControls(container);
    
    // Setup 3D scene
    setupPGScene(vizContainer);
    
    // Create visualizations
    createGeneticGlobe();
    createMigrationFlows();
    createGeneticHotspots();
    createAnomalyMarkers();
    createTimelineControl();
    createGeneticHeatmap();
    
    // Start animation
    animatePG();
}

function setupPGScene(container) {
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Scene
    pgScene = new THREE.Scene();
    pgScene.background = new THREE.Color(0x000511);
    
    // Camera
    pgCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    pgCamera.position.set(0, 0, 300);
    
    // Renderer
    pgRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    pgRenderer.setSize(width, height);
    pgRenderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(pgRenderer.domElement);
    
    // Controls
    pgControls = new THREE.OrbitControls(pgCamera, pgRenderer.domElement);
    pgControls.enableDamping = true;
    pgControls.dampingFactor = 0.05;
    pgControls.minDistance = 150;
    pgControls.maxDistance = 500;
    pgControls.autoRotate = true;
    pgControls.autoRotateSpeed = 0.2;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x222244, 0.5);
    pgScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(100, 100, 50);
    pgScene.add(directionalLight);
    
    // Add stars
    createStarfield();
}

function createGeneticGlobe() {
    // Create textured globe
    const globeGeometry = new THREE.SphereGeometry(100, 64, 64);
    
    // Custom shader for genetic visualization
    const globeMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uTexture: { value: null },
            uRhConcentration: { value: createRhTexture() },
            uGlowIntensity: { value: 0.5 }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            uniform sampler2D uTexture;
            uniform sampler2D uRhConcentration;
            uniform float uGlowIntensity;
            
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                // Base earth color
                vec3 earthColor = vec3(0.1, 0.2, 0.4);
                
                // RH concentration overlay
                vec3 rhData = texture2D(uRhConcentration, vUv).rgb;
                float rhIntensity = rhData.r;
                
                // Genetic glow
                vec3 glowColor = mix(
                    vec3(0.0, 1.0, 0.8), // Cyan for normal
                    vec3(1.0, 0.0, 1.0), // Magenta for RH negative
                    rhIntensity
                );
                
                // Pulsing effect
                float pulse = sin(uTime * 2.0 + vUv.x * 10.0) * 0.5 + 0.5;
                
                // Combine colors
                vec3 finalColor = earthColor + glowColor * rhIntensity * (0.5 + pulse * 0.5) * uGlowIntensity;
                
                // Edge glow
                float edgeFactor = pow(1.0 - abs(dot(vNormal, normalize(cameraPosition - vPosition))), 2.0);
                finalColor += glowColor * edgeFactor * 0.3;
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `,
        transparent: false
    });
    
    geneticGlobe = new THREE.Mesh(globeGeometry, globeMaterial);
    pgScene.add(geneticGlobe);
    
    // Add atmosphere
    const atmosGeometry = new THREE.SphereGeometry(110, 32, 32);
    const atmosMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 }
        },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            varying vec3 vNormal;
            
            void main() {
                float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                vec3 atmosColor = mix(
                    vec3(0.0, 0.5, 1.0),
                    vec3(1.0, 0.0, 1.0),
                    sin(uTime) * 0.5 + 0.5
                );
                gl_FragColor = vec4(atmosColor, intensity * 0.3);
            }
        `,
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
    });
    
    atmosphereGlow = new THREE.Mesh(atmosGeometry, atmosMaterial);
    pgScene.add(atmosphereGlow);
}

function createRhTexture() {
    // Create data texture for RH concentration
    const size = 256;
    const data = new Uint8Array(size * size * 3);
    
    // Generate concentration map
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            const lat = (i / size - 0.5) * 180;
            const lon = (j / size - 0.5) * 360;
            
            let concentration = 0;
            
            // Calculate concentration based on hotspots
            geneticData.rhNegativeHotspots.forEach(hotspot => {
                const distance = Math.sqrt(
                    Math.pow(lat - hotspot.coords[0], 2) + 
                    Math.pow(lon - hotspot.coords[1], 2)
                );
                concentration += (hotspot.concentration / 100) * Math.exp(-distance / 20);
            });
            
            const idx = (i * size + j) * 3;
            data[idx] = Math.min(255, concentration * 255);
            data[idx + 1] = 0;
            data[idx + 2] = Math.min(255, concentration * 128);
        }
    }
    
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
    texture.needsUpdate = true;
    return texture;
}

function createMigrationFlows() {
    geneticData.ancientMigrations.forEach(migration => {
        migration.routes.forEach(route => {
            const curve = createMigrationCurve(route.from, route.to);
            
            // Create flowing particles
            const particleCount = 100;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const sizes = new Float32Array(particleCount);
            
            for (let i = 0; i < particleCount; i++) {
                const t = i / particleCount;
                const point = curve.getPoint(t);
                
                positions[i * 3] = point.x;
                positions[i * 3 + 1] = point.y;
                positions[i * 3 + 2] = point.z;
                
                // Color based on intensity
                colors[i * 3] = route.intensity;
                colors[i * 3 + 1] = 0.5;
                colors[i * 3 + 2] = 1 - route.intensity;
                
                sizes[i] = Math.random() * 3 + 1;
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            
            const material = new THREE.PointsMaterial({
                size: 2,
                vertexColors: true,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            
            const particles = new THREE.Points(geometry, material);
            particles.userData = {
                curve: curve,
                speed: 0.001 + Math.random() * 0.002,
                migration: migration,
                offset: 0
            };
            
            migrationFlows.push(particles);
            pgScene.add(particles);
        });
    });
}

function createMigrationCurve(from, to) {
    const start = latLonToVector3(from[0], from[1], 105);
    const end = latLonToVector3(to[0], to[1], 105);
    
    // Create curved path
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(130); // Arc height
    
    return new THREE.QuadraticBezierCurve3(start, mid, end);
}

function createGeneticHotspots() {
    geneticData.rhNegativeHotspots.forEach(hotspot => {
        const position = latLonToVector3(hotspot.coords[0], hotspot.coords[1], 102);
        
        // Create pulsing node
        const nodeGroup = new THREE.Group();
        
        // Core
        const coreGeometry = new THREE.SphereGeometry(2, 16, 16);
        const coreMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: hotspot.concentration / 35,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.9
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        nodeGroup.add(core);
        
        // Outer glow
        const glowGeometry = new THREE.SphereGeometry(5, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        nodeGroup.add(glow);
        
        // Create label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, 256, 64);
        
        context.font = '20px Arial';
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.fillText(hotspot.name, 128, 25);
        context.font = '16px Arial';
        context.fillText(`RH-: ${hotspot.concentration}%`, 128, 45);
        
        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const label = new THREE.Sprite(labelMaterial);
        label.scale.set(20, 5, 1);
        label.position.y = 10;
        nodeGroup.add(label);
        
        nodeGroup.position.copy(position);
        nodeGroup.userData = hotspot;
        geneticNodes.push(nodeGroup);
        pgScene.add(nodeGroup);
    });
}

function createAnomalyMarkers() {
    geneticData.anomalies.forEach(anomaly => {
        const position = latLonToVector3(anomaly.coords[0], anomaly.coords[1], 102);
        
        // Create anomaly marker
        const markerGroup = new THREE.Group();
        
        // Diamond shape
        const geometry = new THREE.OctahedronGeometry(3, 0);
        const material = new THREE.MeshPhysicalMaterial({
            color: getAnomalyColor(anomaly.type),
            emissive: getAnomalyColor(anomaly.type),
            emissiveIntensity: 0.5,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.8
        });
        const marker = new THREE.Mesh(geometry, material);
        markerGroup.add(marker);
        
        // Rotating ring
        const ringGeometry = new THREE.TorusGeometry(5, 0.5, 8, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: getAnomalyColor(anomaly.type),
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        markerGroup.add(ring);
        
        markerGroup.position.copy(position);
        markerGroup.userData = anomaly;
        anomalyMarkers.push(markerGroup);
        pgScene.add(markerGroup);
    });
}

function getAnomalyColor(type) {
    const colors = {
        'morphological': 0xff6600,
        'cognitive': 0x00ff66,
        'biological': 0x6600ff
    };
    return colors[type] || 0xffffff;
}

function createTimelineControl() {
    const timelineDiv = document.createElement('div');
    timelineDiv.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        background: rgba(0, 0, 0, 0.8);
        padding: 20px;
        border: 1px solid #00ffcc;
        border-radius: 10px;
    `;
    
    timelineDiv.innerHTML = `
        <div style="color: #00ffcc; text-align: center; margin-bottom: 10px;">
            <span id="timeline-date">10,000 BCE</span> - Genetic Migration Timeline
        </div>
        <input type="range" id="timeline-slider" min="-10000" max="2025" value="-10000" 
               style="width: 100%; cursor: pointer;">
        <div style="display: flex; justify-content: space-between; color: #666; font-size: 12px; margin-top: 5px;">
            <span>10,000 BCE</span>
            <span>5,000 BCE</span>
            <span>0 CE</span>
            <span>1000 CE</span>
            <span>2025 CE</span>
        </div>
        <button id="timeline-play" style="
            background: #1a1a1a;
            color: #00ffcc;
            border: 1px solid #00ffcc;
            padding: 5px 15px;
            margin-top: 10px;
            cursor: pointer;
        ">▶ Play Timeline</button>
    `;
    
    document.getElementById('pg-viz-container').appendChild(timelineDiv);
    
    // Timeline controls
    const slider = document.getElementById('timeline-slider');
    const dateDisplay = document.getElementById('timeline-date');
    const playButton = document.getElementById('timeline-play');
    
    slider.addEventListener('input', (e) => {
        timelinePosition = parseFloat(e.target.value);
        updateTimelineDisplay();
        updateVisualizationForTime(timelinePosition);
    });
    
    playButton.addEventListener('click', () => {
        autoPlayTimeline = !autoPlayTimeline;
        playButton.textContent = autoPlayTimeline ? '⏸ Pause' : '▶ Play Timeline';
    });
}

function updateTimelineDisplay() {
    const date = document.getElementById('timeline-date');
    if (timelinePosition < 0) {
        date.textContent = `${Math.abs(timelinePosition)} BCE`;
    } else {
        date.textContent = `${timelinePosition} CE`;
    }
}

function updateVisualizationForTime(time) {
    // Show/hide migration flows based on time
    migrationFlows.forEach(flow => {
        const migration = flow.userData.migration;
        flow.visible = time >= migration.period && time <= migration.period + 2000;
    });
    
    // Update node visibility
    geneticNodes.forEach(node => {
        const hotspot = node.userData;
        node.visible = !hotspot.ancient || time >= -8000;
    });
}

function createGeneticHeatmap() {
    // Create overlay canvas for heatmap
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    // Generate heatmap data
    const imageData = context.createImageData(canvas.width, canvas.height);
    
    for (let x = 0; x < canvas.width; x++) {
        for (let y = 0; y < canvas.height; y++) {
            const lon = (x / canvas.width - 0.5) * 360;
            const lat = (0.5 - y / canvas.height) * 180;
            
            let intensity = 0;
            
            // Calculate genetic diversity
            Object.values(geneticData.geneticMarkers).forEach(marker => {
                marker.distribution.forEach(coord => {
                    const dist = Math.sqrt(
                        Math.pow(lat - coord[0], 2) + 
                        Math.pow(lon - coord[1], 2)
                    );
                    intensity += marker.activation * Math.exp(-dist / 30);
                });
            });
            
            const idx = (y * canvas.width + x) * 4;
            const color = getHeatmapColor(Math.min(1, intensity));
            imageData.data[idx] = color.r;
            imageData.data[idx + 1] = color.g;
            imageData.data[idx + 2] = color.b;
            imageData.data[idx + 3] = 128;
        }
    }
    
    context.putImageData(imageData, 0, 0);
    
    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // Apply to globe as overlay
    const overlayGeometry = new THREE.SphereGeometry(101, 64, 64);
    const overlayMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    
    heatmapOverlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
    heatmapOverlay.visible = false;
    pgScene.add(heatmapOverlay);
}

function getHeatmapColor(value) {
    // Gradient from blue to red
    const r = Math.floor(value * 255);
    const g = Math.floor((1 - Math.abs(value - 0.5) * 2) * 255);
    const b = Math.floor((1 - value) * 255);
    return { r, g, b };
}

function createGeneticControls(container) {
    const controlsDiv = document.createElement('div');
    controlsDiv.style.cssText = `
        margin-top: 20px;
        padding: 20px;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #00ffcc;
        border-radius: 10px;
    `;
    
    controlsDiv.innerHTML = `
        <h3 style="color: #00ffcc; margin-top: 0;">Genetic Analysis Controls</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
            <button class="pg-control" onclick="toggleHeatmap()">Toggle Genetic Heatmap</button>
            <button class="pg-control" onclick="showMarkerAnalysis()">Analyze Genetic Markers</button>
            <button class="pg-control" onclick="toggleMigrations()">Toggle Migration Flows</button>
            <button class="pg-control" onclick="focusOnRegion('europe')">Focus: Europe</button>
            <button class="pg-control" onclick="focusOnRegion('americas')">Focus: Americas</button>
            <button class="pg-control" onclick="focusOnRegion('asia')">Focus: Asia</button>
        </div>
        <div id="genetic-info" style="margin-top: 20px; color: #ccc; font-size: 14px;">
            <p>Click on hotspots for detailed genetic information</p>
        </div>
    `;
    
    container.appendChild(controlsDiv);
    
    // Style buttons
    const style = document.createElement('style');
    style.textContent = `
        .pg-control {
            background: #1a1a1a;
            color: #00ffcc;
            border: 1px solid #00ffcc;
            padding: 10px;
            cursor: pointer;
            transition: all 0.3s;
            font-family: monospace;
        }
        .pg-control:hover {
            background: #00ffcc;
            color: #0a0a0a;
            box-shadow: 0 0 10px #00ffcc;
        }
    `;
    document.head.appendChild(style);
}

// Control functions
window.toggleHeatmap = function() {
    if (heatmapOverlay) {
        heatmapOverlay.visible = !heatmapOverlay.visible;
    }
};

window.showMarkerAnalysis = function() {
    const infoDiv = document.getElementById('genetic-info');
    let html = '<h4>Active Genetic Markers</h4>';
    
    Object.entries(geneticData.geneticMarkers).forEach(([key, marker]) => {
        html += `
            <div style="margin: 10px 0; padding: 10px; background: rgba(255, 0, 255, 0.1); border-left: 3px solid #ff00ff;">
                <strong>${marker.name} (${key})</strong><br>
                Activation Level: ${(marker.activation * 100).toFixed(0)}%<br>
                Locations: ${marker.distribution.length} active sites
            </div>
        `;
    });
    
    infoDiv.innerHTML = html;
};

window.toggleMigrations = function() {
    migrationFlows.forEach(flow => {
        flow.visible = !flow.visible;
    });
};

window.focusOnRegion = function(region) {
    const regions = {
        'europe': { lat: 50, lon: 10, distance: 200 },
        'americas': { lat: 0, lon: -80, distance: 250 },
        'asia': { lat: 30, lon: 100, distance: 250 }
    };
    
    const r = regions[region];
    if (r) {
        const pos = latLonToVector3(r.lat, r.lon, r.distance);
        pgCamera.position.x = pos.x;
        pgCamera.position.y = pos.y;
        pgCamera.position.z = pos.z;
        pgCamera.lookAt(0, 0, 0);
    }
};

// Utility functions
function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return new THREE.Vector3(x, y, z);
}

function createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
        const radius = 500 + Math.random() * 500;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    pgScene.add(stars);
}

function animatePG() {
    pgAnimationId = requestAnimationFrame(animatePG);
    
    // Update controls
    pgControls.update();
    
    // Update time uniforms
    if (geneticGlobe && geneticGlobe.material.uniforms) {
        geneticGlobe.material.uniforms.uTime.value += 0.01;
    }
    if (atmosphereGlow && atmosphereGlow.material.uniforms) {
        atmosphereGlow.material.uniforms.uTime.value += 0.01;
    }
    
    // Animate migration flows
    migrationFlows.forEach(flow => {
        flow.userData.offset += flow.userData.speed;
        if (flow.userData.offset > 1) flow.userData.offset = 0;
        
        const positions = flow.geometry.attributes.position.array;
        const curve = flow.userData.curve;
        const particleCount = positions.length / 3;
        
        for (let i = 0; i < particleCount; i++) {
            const t = (i / particleCount + flow.userData.offset) % 1;
            const point = curve.getPoint(t);
            
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = point.z;
        }
        
        flow.geometry.attributes.position.needsUpdate = true;
    });
    
    // Pulse genetic nodes
    geneticNodes.forEach((node, idx) => {
        const scale = 1 + Math.sin(Date.now() * 0.001 + idx) * 0.2;
        node.scale.set(scale, scale, scale);
    });
    
    // Rotate anomaly markers
    anomalyMarkers.forEach((marker, idx) => {
        marker.rotation.y += 0.01;
        marker.children[1].rotation.z += 0.02; // Rotate ring
    });
    
    // Auto-play timeline
    if (autoPlayTimeline) {
        timelinePosition += 50;
        if (timelinePosition > 2025) timelinePosition = -10000;
        
        const slider = document.getElementById('timeline-slider');
        if (slider) slider.value = timelinePosition;
        
        updateTimelineDisplay();
        updateVisualizationForTime(timelinePosition);
    }
    
    // Render
    pgRenderer.render(pgScene, pgCamera);
}

function cleanupPopulationGenetics() {
    if (pgAnimationId) {
        cancelAnimationFrame(pgAnimationId);
    }
    
    if (pgScene) {
        pgScene.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
        pgScene.clear();
    }
    
    if (pgRenderer) {
        pgRenderer.dispose();
    }
    
    migrationFlows = [];
    geneticNodes = [];
    anomalyMarkers = [];
    particleSystems = [];
}

// Export
window.initPopulationGenetics = initPopulationGenetics;
window.cleanupPopulationGenetics = cleanupPopulationGenetics;