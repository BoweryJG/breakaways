// Master Convergence 3D Visualization
// The ultimate integration of all breakaway civilization systems
// Holographic Earth at center with all layers, connections, and temporal evolution

// Global state for Master Convergence
let mcScene, mcCamera, mcRenderer, mcControls, mcComposer;
let mcEarth, mcMoon, mcSun, mcGalaxy;
let mcSystems = {
    leyLines: [],
    underground: [],
    monuments: [],
    emFields: [],
    moonBeams: [],
    galacticConnections: [],
    timelineEvents: [],
    predictiveModels: [],
    alertSystem: [],
    particleSystems: [],
    connections: []
};

let mcAnimationId;
let mcTime = 0;
let mcTimeScale = 1;
let mcSelectedSystem = null;
let mcViewMode = 'unified';
let mcPredictionMode = false;
let mcAlertLevel = 0;

// Configuration
const MC_CONFIG = {
    earthRadius: 100,
    moonDistance: 380,
    moonRadius: 27,
    sunDistance: 1500,
    galacticRadius: 3000,
    timeWindow: 1000, // years
    particleCount: 10000,
    connectionThreshold: 0.7,
    alertThreshold: 0.85
};

// Initialize Master Convergence
function initMasterConvergence() {
    console.log('Initializing Master Convergence System...');
    
    const container = document.getElementById('master-convergence-container');
    if (!container) {
        console.error('Master Convergence container not found');
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Setup advanced Three.js scene
    setupMasterScene(container);
    
    // Create all system components
    createHolographicEarth();
    createUndergroundNetworks();
    createLeyLineGrid();
    createMoonControlSystem();
    createElectromagneticFields();
    createGalacticConnections();
    createSacredGeometry();
    createTemporalLayers();
    createPredictiveModels();
    createAlertSystem();
    createParticleFlows();
    createConnectionWeb();
    
    // Setup advanced controls and UI
    setupMasterControls();
    createConvergenceUI();
    
    // Initialize data streams
    initializeDataStreams();
    
    // Start the master animation
    animateMasterConvergence();
}

function setupMasterScene(container) {
    const width = container.clientWidth;
    const height = container.clientHeight || 800;
    
    // Scene with space environment
    mcScene = new THREE.Scene();
    mcScene.background = new THREE.Color(0x000000);
    mcScene.fog = new THREE.FogExp2(0x000000, 0.00025);
    
    // Advanced camera setup
    mcCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 50000);
    mcCamera.position.set(0, 200, 500);
    
    // High-performance renderer with post-processing
    mcRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        logarithmicDepthBuffer: true
    });
    mcRenderer.setSize(width, height);
    mcRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mcRenderer.shadowMap.enabled = true;
    mcRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mcRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    mcRenderer.toneMappingExposure = 1.2;
    container.appendChild(mcRenderer.domElement);
    
    // Post-processing setup
    setupPostProcessing();
    
    // Advanced orbital controls
    mcControls = new THREE.OrbitControls(mcCamera, mcRenderer.domElement);
    mcControls.enableDamping = true;
    mcControls.dampingFactor = 0.05;
    mcControls.minDistance = 150;
    mcControls.maxDistance = 3000;
    mcControls.autoRotate = true;
    mcControls.autoRotateSpeed = 0.2;
    
    // Complex lighting system
    setupMasterLighting();
    
    // Create cosmic environment
    createCosmicEnvironment();
}

function setupPostProcessing() {
    mcComposer = new THREE.EffectComposer(mcRenderer);
    
    const renderPass = new THREE.RenderPass(mcScene, mcCamera);
    mcComposer.addPass(renderPass);
    
    // Bloom for glowing effects
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // strength
        0.4, // radius
        0.85  // threshold
    );
    mcComposer.addPass(bloomPass);
    
    // Film grain and scan lines for cyberpunk aesthetic
    const filmPass = new THREE.FilmPass(0.35, 0.025, 648, false);
    mcComposer.addPass(filmPass);
    
    // FXAA for antialiasing
    const fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);
    fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    mcComposer.addPass(fxaaPass);
}

function setupMasterLighting() {
    // Ambient light for base visibility
    const ambientLight = new THREE.AmbientLight(0x111122, 0.4);
    mcScene.add(ambientLight);
    
    // Sun light
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(1000, 500, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 100;
    sunLight.shadow.camera.far = 3000;
    sunLight.shadow.camera.left = -500;
    sunLight.shadow.camera.right = 500;
    sunLight.shadow.camera.top = 500;
    sunLight.shadow.camera.bottom = -500;
    mcScene.add(sunLight);
    
    // Point lights for key locations
    const pointLightColors = [0x00ffcc, 0xff00ff, 0xffaa00, 0x00aaff];
    pointLightColors.forEach((color, i) => {
        const angle = (i / pointLightColors.length) * Math.PI * 2;
        const pointLight = new THREE.PointLight(color, 0.5, 500);
        pointLight.position.set(
            Math.cos(angle) * 300,
            100,
            Math.sin(angle) * 300
        );
        mcScene.add(pointLight);
    });
    
    // Hemisphere light for natural shading
    const hemiLight = new THREE.HemisphereLight(0x4444ff, 0x002244, 0.3);
    mcScene.add(hemiLight);
}

function createCosmicEnvironment() {
    // Enhanced starfield with multiple layers
    const starLayers = [
        { count: 5000, size: 1, distance: 2000 },
        { count: 3000, size: 2, distance: 3000 },
        { count: 1000, size: 3, distance: 5000 }
    ];
    
    starLayers.forEach(layer => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(layer.count * 3);
        const colors = new Float32Array(layer.count * 3);
        
        for (let i = 0; i < layer.count * 3; i += 3) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            const radius = layer.distance + Math.random() * 1000;
            
            positions[i] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i + 2] = radius * Math.cos(phi);
            
            // Varied star colors
            const temp = Math.random();
            colors[i] = 0.8 + temp * 0.2;
            colors[i + 1] = 0.8 + temp * 0.1;
            colors[i + 2] = 1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: layer.size,
            vertexColors: true,
            sizeAttenuation: false,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const stars = new THREE.Points(geometry, material);
        mcScene.add(stars);
    });
    
    // Nebula clouds
    createNebulaClouds();
    
    // Galactic plane
    createGalacticPlane();
}

function createNebulaClouds() {
    const nebulaCount = 5;
    for (let i = 0; i < nebulaCount; i++) {
        const geometry = new THREE.IcosahedronGeometry(300 + Math.random() * 200, 2);
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        
        const nebula = new THREE.Mesh(geometry, material);
        nebula.position.set(
            (Math.random() - 0.5) * 10000,
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 10000
        );
        nebula.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        mcScene.add(nebula);
    }
}

function createGalacticPlane() {
    const geometry = new THREE.RingGeometry(2000, 5000, 64, 8);
    const material = new THREE.MeshBasicMaterial({
        color: 0x4444ff,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    
    const galacticPlane = new THREE.Mesh(geometry, material);
    galacticPlane.rotation.x = Math.PI / 2;
    mcScene.add(galacticPlane);
}

function createHolographicEarth() {
    const earthGroup = new THREE.Group();
    earthGroup.name = 'EarthSystem';
    
    // Core Earth sphere
    const earthGeometry = new THREE.SphereGeometry(MC_CONFIG.earthRadius, 128, 128);
    
    // Holographic shader material
    const earthMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            hologramColor: { value: new THREE.Color(0x00ffcc) },
            scanlineIntensity: { value: 0.5 },
            glitchIntensity: { value: 0.0 },
            opacity: { value: 0.9 }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform float time;
            
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                
                vec3 pos = position;
                float displacement = sin(position.y * 10.0 + time * 2.0) * 0.1;
                pos += normal * displacement;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 hologramColor;
            uniform float scanlineIntensity;
            uniform float glitchIntensity;
            uniform float opacity;
            
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                // Holographic effect
                float scanline = sin(vUv.y * 200.0 + time * 5.0) * scanlineIntensity;
                float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                
                // Grid pattern
                float grid = step(0.98, sin(vUv.x * 50.0)) + step(0.98, sin(vUv.y * 50.0));
                
                // Glitch effect
                float glitch = step(0.99, sin(time * 50.0 + vPosition.y * 10.0)) * glitchIntensity;
                
                vec3 color = hologramColor;
                color += vec3(scanline) * 0.1;
                color += vec3(grid) * 0.2;
                color += vec3(glitch) * vec3(1.0, 0.0, 0.0);
                
                float alpha = opacity * fresnel + 0.2;
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    
    mcEarth = new THREE.Mesh(earthGeometry, earthMaterial);
    mcEarth.castShadow = true;
    mcEarth.receiveShadow = true;
    earthGroup.add(mcEarth);
    
    // Continental outlines
    const continentGeometry = new THREE.SphereGeometry(MC_CONFIG.earthRadius + 1, 64, 32);
    const continentMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff99,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const continents = new THREE.Mesh(continentGeometry, continentMaterial);
    earthGroup.add(continents);
    
    // Atmosphere layers
    createAtmosphereLayers(earthGroup);
    
    // Add surface features
    addSurfaceFeatures(earthGroup);
    
    mcScene.add(earthGroup);
}

function createAtmosphereLayers(earthGroup) {
    const layers = [
        { radius: 110, color: 0x0099ff, opacity: 0.2, name: 'troposphere' },
        { radius: 120, color: 0x00ccff, opacity: 0.15, name: 'stratosphere' },
        { radius: 130, color: 0x00ffff, opacity: 0.1, name: 'mesosphere' },
        { radius: 140, color: 0x00ffcc, opacity: 0.05, name: 'thermosphere' }
    ];
    
    layers.forEach(layer => {
        const geometry = new THREE.SphereGeometry(layer.radius, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: layer.color,
            transparent: true,
            opacity: layer.opacity,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        
        const atmosphere = new THREE.Mesh(geometry, material);
        atmosphere.name = layer.name;
        earthGroup.add(atmosphere);
    });
}

function addSurfaceFeatures(earthGroup) {
    // Major cities as light points
    const cities = [
        { name: 'New York', lat: 40.7128, lon: -74.0060, size: 5 },
        { name: 'London', lat: 51.5074, lon: -0.1278, size: 4 },
        { name: 'Tokyo', lat: 35.6762, lon: 139.6503, size: 5 },
        { name: 'Moscow', lat: 55.7558, lon: 37.6173, size: 4 },
        { name: 'Beijing', lat: 39.9042, lon: 116.4074, size: 5 },
        { name: 'Sydney', lat: -33.8688, lon: 151.2093, size: 3 },
        { name: 'Cairo', lat: 30.0444, lon: 31.2357, size: 3 },
        { name: 'Mexico City', lat: 19.4326, lon: -99.1332, size: 4 }
    ];
    
    cities.forEach(city => {
        const position = latLonToVector3(city.lat, city.lon, MC_CONFIG.earthRadius + 2);
        
        const light = new THREE.PointLight(0xffffaa, 0.5, 20);
        light.position.copy(position);
        earthGroup.add(light);
        
        const markerGeometry = new THREE.SphereGeometry(city.size * 0.5, 8, 8);
        const markerMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffaa,
            emissive: 0xffffaa,
            emissiveIntensity: 1
        });
        
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.copy(position);
        marker.userData = city;
        earthGroup.add(marker);
    });
}

function createUndergroundNetworks() {
    // Based on earth-3d.js underground system
    const undergroundGroup = new THREE.Group();
    undergroundGroup.name = 'UndergroundSystem';
    
    // Major underground bases
    const bases = [
        { name: 'Dulce', lat: 36.9, lon: -106.9, depth: 20, type: 'military', level: 7 },
        { name: 'Area 51', lat: 37.2, lon: -115.8, depth: 25, type: 'military', level: 8 },
        { name: 'Denver Airport', lat: 39.8, lon: -104.6, depth: 15, type: 'civilian', level: 5 },
        { name: 'Pine Gap', lat: -23.7, lon: 133.7, depth: 30, type: 'military', level: 9 },
        { name: 'CERN', lat: 46.2, lon: 6.1, depth: 10, type: 'research', level: 6 },
        { name: 'Antarctica Base', lat: -90, lon: 0, depth: 40, type: 'ancient', level: 10 },
        { name: 'Tibet Complex', lat: 29.6, lon: 91.1, depth: 35, type: 'ancient', level: 9 },
        { name: 'Bucegi Mountains', lat: 45.4, lon: 25.5, depth: 20, type: 'ancient', level: 7 }
    ];
    
    bases.forEach(base => {
        const position = latLonToVector3(base.lat, base.lon, MC_CONFIG.earthRadius - base.depth);
        
        // Base structure with advanced geometry
        const baseGeometry = new THREE.OctahedronGeometry(3 + base.level * 0.5, 2);
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: getSystemColor(base.type),
            emissive: getSystemColor(base.type),
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8,
            wireframe: false
        });
        
        const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
        baseMesh.position.copy(position);
        baseMesh.userData = base;
        undergroundGroup.add(baseMesh);
        mcSystems.underground.push(baseMesh);
        
        // Energy field around base
        createEnergyField(baseMesh, base.level * 5, getSystemColor(base.type));
        
        // Connect to surface
        createVerticalConnection(position, base);
    });
    
    // Create tunnel network between bases
    createTunnelNetwork(bases, undergroundGroup);
    
    mcScene.add(undergroundGroup);
}

function createTunnelNetwork(bases, group) {
    const connections = [
        [0, 1], [0, 2], [1, 2], [1, 7], // US West
        [2, 7], [4, 6], [3, 5], [5, 6], // International
        [6, 7], [0, 3], [3, 4], [4, 5]  // Cross-continental
    ];
    
    connections.forEach(([from, to]) => {
        const fromBase = bases[from];
        const toBase = bases[to];
        
        const fromPos = latLonToVector3(fromBase.lat, fromBase.lon, MC_CONFIG.earthRadius - fromBase.depth);
        const toPos = latLonToVector3(toBase.lat, toBase.lon, MC_CONFIG.earthRadius - toBase.depth);
        
        // Create curved tunnel with particles
        const midPoint = new THREE.Vector3().lerpVectors(fromPos, toPos, 0.5);
        midPoint.multiplyScalar(0.85);
        
        const curve = new THREE.CatmullRomCurve3([fromPos, midPoint, toPos]);
        
        const tubeGeometry = new THREE.TubeGeometry(curve, 64, 1.5, 8, false);
        const tubeMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffcc,
            emissive: 0x00ffcc,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.4
        });
        
        const tunnel = new THREE.Mesh(tubeGeometry, tubeMaterial);
        tunnel.userData = { from: fromBase, to: toBase, curve: curve };
        group.add(tunnel);
        mcSystems.underground.push(tunnel);
        
        // Add particle flow
        createParticleFlow(curve, 'underground');
    });
}

function createLeyLineGrid() {
    const leyGroup = new THREE.Group();
    leyGroup.name = 'LeyLineSystem';
    
    // Sacred geometry grid based on Platonic solids
    createPlatonicGrid(leyGroup);
    
    // Major ley line connections
    const leyLines = [
        { start: [31.1342, 29.9792], end: [-77.0369, 38.9072], power: 10 }, // Giza to DC
        { start: [31.1342, 29.9792], end: [-1.8262, 51.1789], power: 9 }, // Giza to Stonehenge
        { start: [-1.8262, 51.1789], end: [-71.0589, 42.3601], power: 8 }, // Stonehenge to Boston
        { start: [-109.9167, -27.1167], end: [-71.5450, -13.1631], power: 8 }, // Easter Island to Machu Picchu
        { start: [103.8670, 13.4125], end: [78.0419, 27.1751], power: 7 }, // Angkor to Taj Mahal
        { start: [38.9224, 37.2231], end: [35.4444, 30.3285], power: 9 }, // Göbekli Tepe to Petra
        { start: [-98.8438, 19.6925], end: [-88.5683, 20.6843], power: 7 }, // Teotihuacan to Chichen Itza
    ];
    
    leyLines.forEach(line => {
        const startPos = latLonToVector3(line.start[1], line.start[0], MC_CONFIG.earthRadius + 5);
        const endPos = latLonToVector3(line.end[1], line.end[0], MC_CONFIG.earthRadius + 5);
        
        // Create energy beam
        const beamGeometry = new THREE.CylinderGeometry(line.power * 0.3, line.power * 0.3, 1, 8);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffcc,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        
        // Position and orient beam
        const midPoint = new THREE.Vector3().lerpVectors(startPos, endPos, 0.5);
        const distance = startPos.distanceTo(endPos);
        beam.position.copy(midPoint);
        beam.scale.y = distance;
        beam.lookAt(endPos);
        beam.rotateX(Math.PI / 2);
        
        beam.userData = { line: line, type: 'leyline' };
        leyGroup.add(beam);
        mcSystems.leyLines.push(beam);
        
        // Add pulsing energy
        createEnergyPulse(startPos, endPos, line.power);
    });
    
    mcScene.add(leyGroup);
}

function createPlatonicGrid(group) {
    // Create icosahedron grid around Earth
    const geometry = new THREE.IcosahedronGeometry(MC_CONFIG.earthRadius + 10, 2);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff99,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    
    const grid = new THREE.Mesh(geometry, material);
    group.add(grid);
    
    // Add energy nodes at vertices
    const vertices = geometry.vertices || [];
    vertices.forEach(vertex => {
        const nodeGeometry = new THREE.SphereGeometry(2, 16, 16);
        const nodeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffcc,
            emissive: 0x00ffcc,
            emissiveIntensity: 1
        });
        
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(vertex);
        group.add(node);
        
        // Add glow
        const glowGeometry = new THREE.SphereGeometry(4, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffcc,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        node.add(glow);
    });
}

function createMoonControlSystem() {
    // Moon with control systems
    const moonGroup = new THREE.Group();
    moonGroup.name = 'MoonControlSystem';
    
    // Moon sphere
    const moonGeometry = new THREE.SphereGeometry(MC_CONFIG.moonRadius, 64, 64);
    const moonMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888,
        emissive: 0x222222,
        emissiveIntensity: 0.3,
        bumpScale: 0.5
    });
    
    mcMoon = new THREE.Mesh(moonGeometry, moonMaterial);
    mcMoon.position.x = MC_CONFIG.moonDistance;
    mcMoon.castShadow = true;
    mcMoon.receiveShadow = true;
    moonGroup.add(mcMoon);
    
    // Artificial structures
    const structures = [
        { name: 'Alpha Base', lat: 0, lon: 0, type: 'command' },
        { name: 'Dark Side Array', lat: 0, lon: 180, type: 'transmitter' },
        { name: 'Mare Crisium Station', lat: 17, lon: 59, type: 'harvester' },
        { name: 'Tycho Control', lat: -43, lon: -11, type: 'defense' }
    ];
    
    structures.forEach(structure => {
        const position = latLonToVector3(structure.lat, structure.lon, MC_CONFIG.moonRadius + 2);
        position.add(mcMoon.position);
        
        const structGeometry = new THREE.BoxGeometry(3, 3, 3);
        const structMaterial = new THREE.MeshPhongMaterial({
            color: 0x4444ff,
            emissive: 0x2222ff,
            emissiveIntensity: 0.5
        });
        
        const struct = new THREE.Mesh(structGeometry, structMaterial);
        struct.position.copy(position);
        struct.userData = structure;
        moonGroup.add(struct);
    });
    
    // Control beams to Earth
    createMoonBeams(moonGroup);
    
    // Orbital path
    createOrbitalPath(moonGroup);
    
    mcScene.add(moonGroup);
}

function createMoonBeams(moonGroup) {
    const beamTargets = [
        { lat: 29.9792, lon: 31.1342, name: 'Giza', type: 'ancient' },
        { lat: 51.1789, lon: -1.8262, name: 'Stonehenge', type: 'ancient' },
        { lat: 62.4, lon: -145.2, name: 'HAARP', type: 'modern' },
        { lat: -23.8, lon: 133.7, name: 'Pine Gap', type: 'modern' }
    ];
    
    beamTargets.forEach(target => {
        const earthPos = latLonToVector3(target.lat, target.lon, MC_CONFIG.earthRadius);
        const moonPos = mcMoon.position.clone();
        
        const distance = earthPos.distanceTo(moonPos);
        const beamGeometry = new THREE.CylinderGeometry(0.5, 2, distance, 8);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: target.type === 'ancient' ? 0xffcc00 : 0x00ccff,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.position.lerpVectors(earthPos, moonPos, 0.5);
        beam.lookAt(earthPos);
        beam.rotateX(Math.PI / 2);
        beam.userData = { target: target, active: false };
        
        moonGroup.add(beam);
        mcSystems.moonBeams.push(beam);
    });
}

function createOrbitalPath(moonGroup) {
    const curve = new THREE.EllipseCurve(
        0, 0,
        MC_CONFIG.moonDistance, MC_CONFIG.moonDistance,
        0, 2 * Math.PI,
        false,
        0
    );
    
    const points = curve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.3
    });
    
    const orbitPath = new THREE.Line(geometry, material);
    orbitPath.rotation.x = Math.PI / 2;
    moonGroup.add(orbitPath);
}

function createElectromagneticFields() {
    const emGroup = new THREE.Group();
    emGroup.name = 'ElectromagneticSystem';
    
    // Schumann resonance visualization
    createSchumannField(emGroup);
    
    // Van Allen belts
    createVanAllenBelts(emGroup);
    
    // Ionosphere interactions
    createIonosphereLayer(emGroup);
    
    mcScene.add(emGroup);
}

function createSchumannField(group) {
    // Pulsing electromagnetic shell
    const geometry = new THREE.SphereGeometry(MC_CONFIG.earthRadius + 50, 64, 32);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            frequency: { value: 7.83 },
            amplitude: { value: 0.5 },
            color: { value: new THREE.Color(0x00ffcc) }
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform float time;
            uniform float frequency;
            uniform float amplitude;
            
            void main() {
                vNormal = normal;
                vPosition = position;
                
                float wave = sin(position.y * frequency + time * 2.0) * amplitude;
                vec3 newPos = position + normal * wave;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            uniform float time;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                float pulse = sin(time * 7.83) * 0.5 + 0.5;
                vec3 finalColor = color * intensity * pulse;
                
                gl_FragColor = vec4(finalColor, intensity * 0.3);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    
    const schumannField = new THREE.Mesh(geometry, material);
    schumannField.name = 'SchumannResonance';
    group.add(schumannField);
    mcSystems.emFields.push(schumannField);
}

function createVanAllenBelts(group) {
    const belts = [
        { innerRadius: 150, outerRadius: 200, color: 0xff6600, intensity: 0.3 },
        { innerRadius: 250, outerRadius: 350, color: 0xff0066, intensity: 0.2 }
    ];
    
    belts.forEach((belt, index) => {
        const geometry = new THREE.TorusGeometry(
            (belt.innerRadius + belt.outerRadius) / 2,
            (belt.outerRadius - belt.innerRadius) / 2,
            8, 64
        );
        
        const material = new THREE.MeshBasicMaterial({
            color: belt.color,
            transparent: true,
            opacity: belt.intensity,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        
        const torus = new THREE.Mesh(geometry, material);
        torus.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.2;
        torus.name = `VanAllenBelt${index + 1}`;
        group.add(torus);
        mcSystems.emFields.push(torus);
    });
}

function createIonosphereLayer(group) {
    const layers = [
        { height: 80, color: 0x0099ff, name: 'D-Layer' },
        { height: 110, color: 0x00ccff, name: 'E-Layer' },
        { height: 150, color: 0x00ffff, name: 'F1-Layer' },
        { height: 200, color: 0x00ffcc, name: 'F2-Layer' }
    ];
    
    layers.forEach(layer => {
        const geometry = new THREE.SphereGeometry(MC_CONFIG.earthRadius + layer.height, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: layer.color,
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });
        
        const ionosphere = new THREE.Mesh(geometry, material);
        ionosphere.name = layer.name;
        group.add(ionosphere);
    });
}

function createGalacticConnections() {
    const galacticGroup = new THREE.Group();
    galacticGroup.name = 'GalacticSystem';
    
    // Galactic center direction
    const galacticCenter = new THREE.Vector3(1000, 0, 1000).normalize().multiplyScalar(MC_CONFIG.galacticRadius);
    
    // Create galactic alignment beam
    const beamGeometry = new THREE.CylinderGeometry(5, 20, MC_CONFIG.galacticRadius, 16);
    const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    
    const galacticBeam = new THREE.Mesh(beamGeometry, beamMaterial);
    galacticBeam.position.lerpVectors(new THREE.Vector3(0, 0, 0), galacticCenter, 0.5);
    galacticBeam.lookAt(galacticCenter);
    galacticBeam.rotateX(Math.PI / 2);
    galacticGroup.add(galacticBeam);
    
    // Stellar connections
    createStellarNetwork(galacticGroup);
    
    // Cosmic web strands
    createCosmicWeb(galacticGroup);
    
    mcScene.add(galacticGroup);
}

function createStellarNetwork(group) {
    const importantStars = [
        { name: 'Sirius', position: new THREE.Vector3(500, 300, -800), color: 0x0099ff },
        { name: 'Pleiades', position: new THREE.Vector3(-600, 400, -700), color: 0x6666ff },
        { name: 'Orion', position: new THREE.Vector3(800, -200, -900), color: 0xff9900 },
        { name: 'Draco', position: new THREE.Vector3(-400, 600, 500), color: 0xff0066 }
    ];
    
    importantStars.forEach(star => {
        // Star object
        const starGeometry = new THREE.OctahedronGeometry(10, 2);
        const starMaterial = new THREE.MeshBasicMaterial({
            color: star.color,
            emissive: star.color,
            emissiveIntensity: 1
        });
        
        const starMesh = new THREE.Mesh(starGeometry, starMaterial);
        starMesh.position.copy(star.position);
        starMesh.userData = star;
        group.add(starMesh);
        
        // Connection to Earth
        const earthPos = new THREE.Vector3(0, 0, 0);
        const curve = new THREE.CatmullRomCurve3([
            earthPos,
            earthPos.clone().lerp(star.position, 0.3).add(new THREE.Vector3(0, 100, 0)),
            star.position.clone().lerp(earthPos, 0.3).add(new THREE.Vector3(0, 100, 0)),
            star.position
        ]);
        
        const tubeGeometry = new THREE.TubeGeometry(curve, 64, 2, 8, false);
        const tubeMaterial = new THREE.MeshBasicMaterial({
            color: star.color,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });
        
        const connection = new THREE.Mesh(tubeGeometry, tubeMaterial);
        group.add(connection);
        mcSystems.galacticConnections.push(connection);
    });
}

function createCosmicWeb(group) {
    // Create web-like structure connecting cosmic points
    const webPoints = [];
    const pointCount = 50;
    
    for (let i = 0; i < pointCount; i++) {
        const point = new THREE.Vector3(
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 1000,
            (Math.random() - 0.5) * 2000
        );
        webPoints.push(point);
    }
    
    // Connect nearby points
    webPoints.forEach((point, i) => {
        webPoints.forEach((otherPoint, j) => {
            if (i < j) {
                const distance = point.distanceTo(otherPoint);
                if (distance < 300) {
                    const geometry = new THREE.BufferGeometry().setFromPoints([point, otherPoint]);
                    const material = new THREE.LineBasicMaterial({
                        color: 0x4444ff,
                        transparent: true,
                        opacity: 0.1 * (1 - distance / 300),
                        blending: THREE.AdditiveBlending
                    });
                    
                    const line = new THREE.Line(geometry, material);
                    group.add(line);
                }
            }
        });
    });
}

function createSacredGeometry() {
    const sacredGroup = new THREE.Group();
    sacredGroup.name = 'SacredGeometry';
    
    // Merkaba field around Earth
    createMerkaba(sacredGroup);
    
    // Flower of Life pattern
    createFlowerOfLife(sacredGroup);
    
    // Golden ratio spirals
    createGoldenSpirals(sacredGroup);
    
    mcScene.add(sacredGroup);
}

function createMerkaba(group) {
    // Two interlocking tetrahedrons
    const size = MC_CONFIG.earthRadius + 30;
    
    const tetraGeometry = new THREE.TetrahedronGeometry(size, 0);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffcc00,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    
    const tetra1 = new THREE.Mesh(tetraGeometry, material);
    group.add(tetra1);
    
    const tetra2 = new THREE.Mesh(tetraGeometry, material.clone());
    tetra2.rotation.y = Math.PI;
    group.add(tetra2);
    
    // Rotation animation handled in main loop
    tetra1.userData = { rotationSpeed: 0.001 };
    tetra2.userData = { rotationSpeed: -0.001 };
}

function createFlowerOfLife(group) {
    const radius = MC_CONFIG.earthRadius + 40;
    const circles = [];
    
    // Center circle
    circles.push({ x: 0, y: 0 });
    
    // Six surrounding circles
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        circles.push({
            x: Math.cos(angle) * radius * 0.1,
            y: Math.sin(angle) * radius * 0.1
        });
    }
    
    circles.forEach(circle => {
        const geometry = new THREE.RingGeometry(radius * 0.1 - 1, radius * 0.1, 64);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.2
        });
        
        const ring = new THREE.Mesh(geometry, material);
        ring.position.x = circle.x;
        ring.position.y = circle.y;
        ring.position.z = radius;
        group.add(ring);
    });
}

function createGoldenSpirals(group) {
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    
    for (let i = 0; i < 3; i++) {
        const points = [];
        const spiralSteps = 100;
        
        for (let j = 0; j < spiralSteps; j++) {
            const t = j / spiralSteps * Math.PI * 4;
            const r = Math.pow(phi, t / (2 * Math.PI)) * 10;
            const x = r * Math.cos(t);
            const y = r * Math.sin(t);
            const z = MC_CONFIG.earthRadius + 50 + i * 20;
            
            points.push(new THREE.Vector3(x, y, z));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: new THREE.Color().setHSL(i / 3, 1, 0.5),
            transparent: true,
            opacity: 0.5
        });
        
        const spiral = new THREE.Line(geometry, material);
        spiral.rotation.z = (i / 3) * Math.PI * 2;
        group.add(spiral);
    }
}

function createTemporalLayers() {
    // Timeline visualization system
    const timelineGroup = new THREE.Group();
    timelineGroup.name = 'TimelineSystem';
    
    // Past, present, future layers
    const timeLayers = [
        { offset: -50, opacity: 0.3, color: 0x0066ff, name: 'past' },
        { offset: 0, opacity: 0.8, color: 0x00ffcc, name: 'present' },
        { offset: 50, opacity: 0.5, color: 0xff00ff, name: 'future' }
    ];
    
    timeLayers.forEach(layer => {
        const layerGroup = new THREE.Group();
        layerGroup.position.y = layer.offset;
        layerGroup.userData = { timeLayer: layer.name };
        
        // Semi-transparent Earth copy
        const earthCopy = mcEarth.clone();
        earthCopy.material = earthCopy.material.clone();
        earthCopy.material.opacity = layer.opacity;
        earthCopy.material.color = new THREE.Color(layer.color);
        layerGroup.add(earthCopy);
        
        timelineGroup.add(layerGroup);
    });
    
    mcScene.add(timelineGroup);
}

function createPredictiveModels() {
    // Future probability cones
    const predictiveGroup = new THREE.Group();
    predictiveGroup.name = 'PredictiveSystem';
    predictiveGroup.visible = false; // Initially hidden
    
    // Probability cones for key events
    const predictions = [
        { origin: [0, 0], angle: 30, length: 500, probability: 0.7, event: 'Convergence Alpha' },
        { origin: [45, 90], angle: 20, length: 400, probability: 0.5, event: 'Pole Shift' },
        { origin: [-30, -60], angle: 40, length: 600, probability: 0.3, event: 'Disclosure Event' }
    ];
    
    predictions.forEach(pred => {
        const origin = latLonToVector3(pred.origin[0], pred.origin[1], MC_CONFIG.earthRadius);
        
        const coneGeometry = new THREE.ConeGeometry(pred.angle, pred.length, 16, 1, true);
        const coneMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(pred.probability, 1, 0.5),
            transparent: true,
            opacity: pred.probability * 0.3,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.position.copy(origin);
        cone.lookAt(origin.clone().multiplyScalar(2));
        cone.userData = pred;
        
        predictiveGroup.add(cone);
        mcSystems.predictiveModels.push(cone);
    });
    
    mcScene.add(predictiveGroup);
}

function createAlertSystem() {
    // Critical alignment detection
    const alertGroup = new THREE.Group();
    alertGroup.name = 'AlertSystem';
    
    // Alert indicators at key points
    const alertPoints = [
        { location: 'Giza', lat: 29.9792, lon: 31.1342, level: 'low' },
        { location: 'CERN', lat: 46.2, lon: 6.1, level: 'medium' },
        { location: 'Antarctica', lat: -90, lon: 0, level: 'high' }
    ];
    
    alertPoints.forEach(alert => {
        const position = latLonToVector3(alert.lat, alert.lon, MC_CONFIG.earthRadius + 20);
        
        const alertGeometry = new THREE.OctahedronGeometry(5, 0);
        const alertMaterial = new THREE.MeshBasicMaterial({
            color: getAlertColor(alert.level),
            transparent: true,
            opacity: 0.8
        });
        
        const alertMesh = new THREE.Mesh(alertGeometry, alertMaterial);
        alertMesh.position.copy(position);
        alertMesh.userData = alert;
        
        // Pulsing animation
        alertMesh.userData.pulsePhase = Math.random() * Math.PI * 2;
        
        alertGroup.add(alertMesh);
        mcSystems.alertSystem.push(alertMesh);
    });
    
    mcScene.add(alertGroup);
}

function createParticleFlows() {
    // Energy and information flows between all systems
    const particleCount = MC_CONFIG.particleCount;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        // Random position within Earth's influence sphere
        const radius = MC_CONFIG.earthRadius + Math.random() * 500;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Color based on system
        const hue = Math.random();
        colors[i * 3] = hue;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1;
        
        sizes[i] = Math.random() * 3 + 1;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    particleSystem.userData = { velocities: new Float32Array(particleCount * 3) };
    
    // Initialize velocities
    for (let i = 0; i < particleCount * 3; i++) {
        particleSystem.userData.velocities[i] = (Math.random() - 0.5) * 0.5;
    }
    
    mcScene.add(particleSystem);
    mcSystems.particleSystems.push(particleSystem);
}

function createConnectionWeb() {
    // Dynamic connections between all active elements
    const connectionGroup = new THREE.Group();
    connectionGroup.name = 'ConnectionWeb';
    
    // This will be populated dynamically based on active systems
    mcScene.add(connectionGroup);
}

function setupMasterControls() {
    // Enhanced controls for the master system
    
    // Keyboard controls
    document.addEventListener('keydown', (event) => {
        switch(event.key) {
            case '1':
                toggleViewMode('unified');
                break;
            case '2':
                toggleViewMode('underground');
                break;
            case '3':
                toggleViewMode('electromagnetic');
                break;
            case '4':
                toggleViewMode('galactic');
                break;
            case '5':
                toggleViewMode('temporal');
                break;
            case 'p':
                mcPredictionMode = !mcPredictionMode;
                mcScene.getObjectByName('PredictiveSystem').visible = mcPredictionMode;
                break;
            case ' ':
                mcTimeScale = mcTimeScale === 0 ? 1 : 0; // Pause/play
                break;
            case '+':
                mcTimeScale = Math.min(mcTimeScale * 2, 100);
                break;
            case '-':
                mcTimeScale = Math.max(mcTimeScale / 2, 0.1);
                break;
        }
    });
    
    // Mouse interactions
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    mcRenderer.domElement.addEventListener('click', onMasterClick);
    mcRenderer.domElement.addEventListener('mousemove', onMasterMouseMove);
    
    function onMasterClick(event) {
        mouse.x = (event.clientX / mcRenderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / mcRenderer.domElement.clientHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, mcCamera);
        
        const allObjects = [
            ...mcSystems.underground,
            ...mcSystems.monuments,
            ...mcSystems.alertSystem
        ];
        
        const intersects = raycaster.intersectObjects(allObjects);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            selectSystem(object);
        }
    }
    
    function onMasterMouseMove(event) {
        mouse.x = (event.clientX / mcRenderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / mcRenderer.domElement.clientHeight) * 2 + 1;
        
        // Update particle attraction to mouse
        updateParticleAttraction(mouse);
    }
}

function createConvergenceUI() {
    const uiHTML = `
        <div id="convergence-ui" style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.8); padding: 20px; border: 1px solid #00ffcc; font-family: 'Courier New', monospace; color: #00ffcc;">
            <h3 style="margin-top: 0; color: #00ffcc; text-shadow: 0 0 10px #00ffcc;">MASTER CONVERGENCE SYSTEM</h3>
            
            <div class="control-section" style="margin: 15px 0;">
                <h4>View Modes</h4>
                <button class="mc-btn" onclick="toggleViewMode('unified')">1. Unified</button>
                <button class="mc-btn" onclick="toggleViewMode('underground')">2. Underground</button>
                <button class="mc-btn" onclick="toggleViewMode('electromagnetic')">3. EM Fields</button>
                <button class="mc-btn" onclick="toggleViewMode('galactic')">4. Galactic</button>
                <button class="mc-btn" onclick="toggleViewMode('temporal')">5. Temporal</button>
            </div>
            
            <div class="control-section" style="margin: 15px 0;">
                <h4>System Layers</h4>
                <label><input type="checkbox" class="mc-layer" data-layer="leylines" checked> Ley Lines</label><br>
                <label><input type="checkbox" class="mc-layer" data-layer="underground" checked> Underground</label><br>
                <label><input type="checkbox" class="mc-layer" data-layer="moon" checked> Moon Control</label><br>
                <label><input type="checkbox" class="mc-layer" data-layer="electromagnetic" checked> EM Fields</label><br>
                <label><input type="checkbox" class="mc-layer" data-layer="sacred" checked> Sacred Geometry</label><br>
                <label><input type="checkbox" class="mc-layer" data-layer="galactic" checked> Galactic</label><br>
                <label><input type="checkbox" class="mc-layer" data-layer="predictions" checked> Predictions</label>
            </div>
            
            <div class="control-section" style="margin: 15px 0;">
                <h4>Timeline Control</h4>
                <input type="range" id="timeline-slider" min="-1000" max="1000" value="0" style="width: 200px;">
                <div id="timeline-display">Present</div>
                <button class="mc-btn" id="play-pause">⏸</button>
                <button class="mc-btn" onclick="mcTimeScale *= 2">⏩</button>
                <button class="mc-btn" onclick="mcTimeScale /= 2">⏪</button>
            </div>
            
            <div class="status-section" style="margin: 15px 0;">
                <h4>System Status</h4>
                <div id="alert-level">Alert Level: <span style="color: #00ff00;">LOW</span></div>
                <div id="convergence-factor">Convergence: <span>87.3%</span></div>
                <div id="active-connections">Active Connections: <span>1,347</span></div>
                <div id="energy-flow">Energy Flow: <span>7.83 Hz</span></div>
            </div>
            
            <div id="selected-info" style="margin: 15px 0; display: none;">
                <h4>Selected System</h4>
                <div id="selected-details"></div>
            </div>
        </div>
        
        <div id="convergence-timeline" style="position: absolute; bottom: 20px; left: 20px; right: 20px; height: 100px; background: rgba(0,0,0,0.8); border: 1px solid #00ffcc; padding: 10px;">
            <canvas id="timeline-canvas" style="width: 100%; height: 100%;"></canvas>
        </div>
        
        <style>
            .mc-btn {
                background: transparent;
                border: 1px solid #00ffcc;
                color: #00ffcc;
                padding: 5px 10px;
                margin: 2px;
                cursor: pointer;
                font-family: 'Courier New', monospace;
                transition: all 0.3s;
            }
            .mc-btn:hover {
                background: #00ffcc;
                color: #000;
                box-shadow: 0 0 10px #00ffcc;
            }
            .mc-layer {
                margin-right: 5px;
            }
            #timeline-slider {
                -webkit-appearance: none;
                appearance: none;
                background: #333;
                outline: none;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            #timeline-slider:hover {
                opacity: 1;
            }
            #timeline-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 15px;
                height: 15px;
                background: #00ffcc;
                cursor: pointer;
                border-radius: 50%;
            }
        </style>
    `;
    
    const container = document.getElementById('master-convergence-container');
    container.insertAdjacentHTML('beforeend', uiHTML);
    
    // Setup UI event listeners
    setupUIEventListeners();
    
    // Initialize timeline visualization
    initializeTimelineVisualization();
}

function setupUIEventListeners() {
    // Layer toggles
    document.querySelectorAll('.mc-layer').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            toggleSystemLayer(e.target.dataset.layer, e.target.checked);
        });
    });
    
    // Timeline slider
    const timelineSlider = document.getElementById('timeline-slider');
    timelineSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        updateTimeline(value);
    });
    
    // Play/pause button
    document.getElementById('play-pause').addEventListener('click', () => {
        mcTimeScale = mcTimeScale === 0 ? 1 : 0;
        document.getElementById('play-pause').textContent = mcTimeScale === 0 ? '▶' : '⏸';
    });
}

function initializeTimelineVisualization() {
    const canvas = document.getElementById('timeline-canvas');
    const ctx = canvas.getContext('2d');
    
    // This will be updated in the animation loop
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Draw initial timeline
    drawTimeline(ctx);
}

function drawTimeline(ctx) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw timeline axis
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, height / 2);
    ctx.lineTo(width - 50, height / 2);
    ctx.stroke();
    
    // Draw major events
    const events = [
        { year: -10000, name: 'Atlantis Fall', color: '#ff0066' },
        { year: -2500, name: 'Pyramid Construction', color: '#ffcc00' },
        { year: 0, name: 'Present', color: '#00ffcc' },
        { year: 2025, name: 'Convergence Begin', color: '#ff00ff' },
        { year: 2030, name: 'Full Disclosure', color: '#00ccff' }
    ];
    
    events.forEach(event => {
        const x = mapTimeToX(event.year, width);
        
        // Event marker
        ctx.fillStyle = event.color;
        ctx.beginPath();
        ctx.arc(x, height / 2, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Event label
        ctx.fillStyle = event.color;
        ctx.font = '10px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(event.name, x, height / 2 - 10);
        ctx.fillText(event.year, x, height / 2 + 20);
    });
    
    // Current position indicator
    const currentX = mapTimeToX(mcTime, width);
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(currentX, 10);
    ctx.lineTo(currentX, height - 10);
    ctx.stroke();
}

function mapTimeToX(year, width) {
    const minYear = -10000;
    const maxYear = 3000;
    const padding = 50;
    return padding + ((year - minYear) / (maxYear - minYear)) * (width - padding * 2);
}

function initializeDataStreams() {
    // Simulate real-time data updates
    setInterval(() => {
        // Update Schumann resonance
        const schumann = 7.83 + Math.sin(Date.now() * 0.001) * 2 + Math.random() * 0.5;
        document.querySelector('#energy-flow span').textContent = `${schumann.toFixed(2)} Hz`;
        
        // Update connections
        const connections = Math.floor(1347 + Math.sin(Date.now() * 0.0005) * 100 + Math.random() * 50);
        document.querySelector('#active-connections span').textContent = connections.toLocaleString();
        
        // Update convergence factor
        const convergence = 87.3 + Math.sin(Date.now() * 0.0003) * 5 + Math.random() * 2;
        document.querySelector('#convergence-factor span').textContent = `${convergence.toFixed(1)}%`;
        
        // Check alert levels
        updateAlertLevel(convergence);
        
    }, 1000);
}

function updateAlertLevel(convergence) {
    let level, color;
    
    if (convergence > 95) {
        level = 'CRITICAL';
        color = '#ff0066';
    } else if (convergence > 90) {
        level = 'HIGH';
        color = '#ff9900';
    } else if (convergence > 85) {
        level = 'MEDIUM';
        color = '#ffcc00';
    } else {
        level = 'LOW';
        color = '#00ff00';
    }
    
    const alertElement = document.querySelector('#alert-level span');
    alertElement.textContent = level;
    alertElement.style.color = color;
    
    mcAlertLevel = convergence / 100;
}

// Animation and update functions
function animateMasterConvergence() {
    mcAnimationId = requestAnimationFrame(animateMasterConvergence);
    
    // Update time
    mcTime += mcTimeScale * 0.1;
    
    // Update controls
    mcControls.update();
    
    // Update all animated elements
    updateHolographicEarth();
    updateParticleSystems();
    updateEnergyFlows();
    updateMoonSystem();
    updateGalacticConnections();
    updateAlertSystem();
    updatePredictiveModels();
    updateConnectionWeb();
    updateTemporalEffects();
    
    // Update timeline visualization
    const ctx = document.getElementById('timeline-canvas').getContext('2d');
    drawTimeline(ctx);
    
    // Render with post-processing
    mcComposer.render();
}

function updateHolographicEarth() {
    if (mcEarth) {
        mcEarth.rotation.y += 0.001 * mcTimeScale;
        mcEarth.material.uniforms.time.value = mcTime;
        mcEarth.material.uniforms.glitchIntensity.value = mcAlertLevel > 0.9 ? 0.5 : 0;
    }
    
    // Update atmosphere layers
    mcScene.traverse(child => {
        if (child.name && child.name.includes('sphere')) {
            child.rotation.y += 0.0005 * mcTimeScale;
        }
    });
}

function updateParticleSystems() {
    mcSystems.particleSystems.forEach(system => {
        const positions = system.geometry.attributes.position.array;
        const velocities = system.userData.velocities;
        
        for (let i = 0; i < positions.length; i += 3) {
            // Update positions based on velocities
            positions[i] += velocities[i] * mcTimeScale;
            positions[i + 1] += velocities[i + 1] * mcTimeScale;
            positions[i + 2] += velocities[i + 2] * mcTimeScale;
            
            // Apply forces
            const pos = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
            const distance = pos.length();
            
            // Gravity towards Earth
            const gravity = pos.normalize().multiplyScalar(-0.01);
            velocities[i] += gravity.x * mcTimeScale;
            velocities[i + 1] += gravity.y * mcTimeScale;
            velocities[i + 2] += gravity.z * mcTimeScale;
            
            // Boundary check
            if (distance < MC_CONFIG.earthRadius || distance > MC_CONFIG.earthRadius + 600) {
                // Reset particle
                const radius = MC_CONFIG.earthRadius + Math.random() * 500;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                
                positions[i] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i + 2] = radius * Math.cos(phi);
                
                velocities[i] = (Math.random() - 0.5) * 0.5;
                velocities[i + 1] = (Math.random() - 0.5) * 0.5;
                velocities[i + 2] = (Math.random() - 0.5) * 0.5;
            }
        }
        
        system.geometry.attributes.position.needsUpdate = true;
    });
}

function updateEnergyFlows() {
    // Update EM field animations
    mcSystems.emFields.forEach(field => {
        if (field.material.uniforms && field.material.uniforms.time) {
            field.material.uniforms.time.value = mcTime;
        }
        
        if (field.name === 'SchumannResonance') {
            const frequency = 7.83 + Math.sin(mcTime * 0.1) * 2;
            field.material.uniforms.frequency.value = frequency;
        }
    });
    
    // Pulse ley lines
    mcSystems.leyLines.forEach(ley => {
        const pulse = Math.sin(mcTime * 2 + ley.position.x * 0.01) * 0.5 + 0.5;
        ley.material.opacity = 0.3 + pulse * 0.3;
    });
}

function updateMoonSystem() {
    if (mcMoon) {
        // Orbital motion
        const angle = mcTime * 0.05;
        mcMoon.parent.position.x = Math.cos(angle) * MC_CONFIG.moonDistance;
        mcMoon.parent.position.z = Math.sin(angle) * MC_CONFIG.moonDistance;
        mcMoon.parent.position.y = Math.sin(angle * 0.1) * 50; // Slight inclination
        
        // Tidal locked rotation
        mcMoon.rotation.y = angle;
        
        // Update moon beams
        mcSystems.moonBeams.forEach((beam, index) => {
            const active = Math.sin(mcTime * 0.5 + index) > 0.5;
            beam.visible = active;
            beam.userData.active = active;
            
            if (active) {
                beam.material.opacity = 0.3 + Math.sin(mcTime * 3) * 0.2;
            }
        });
    }
}

function updateGalacticConnections() {
    // Rotate galactic alignment
    const galacticSystem = mcScene.getObjectByName('GalacticSystem');
    if (galacticSystem) {
        galacticSystem.rotation.y += 0.0001 * mcTimeScale;
    }
    
    // Pulse stellar connections
    mcSystems.galacticConnections.forEach((connection, index) => {
        const pulse = Math.sin(mcTime * 0.2 + index * 0.5) * 0.5 + 0.5;
        connection.material.opacity = 0.1 + pulse * 0.2;
    });
}

function updateAlertSystem() {
    mcSystems.alertSystem.forEach(alert => {
        const pulse = Math.sin(mcTime * 5 + alert.userData.pulsePhase);
        const scale = 1 + pulse * 0.3;
        alert.scale.setScalar(scale);
        
        // Change color intensity based on alert level
        const level = alert.userData.level;
        if (level === 'high' && mcAlertLevel > 0.85) {
            alert.material.color = new THREE.Color(0xff0066);
            alert.material.emissive = new THREE.Color(0xff0066);
            alert.material.emissiveIntensity = Math.abs(pulse);
        }
    });
}

function updatePredictiveModels() {
    if (mcPredictionMode) {
        mcSystems.predictiveModels.forEach(model => {
            // Animate probability cones
            model.material.opacity = model.userData.probability * 0.3 * (Math.sin(mcTime) * 0.5 + 0.5);
            model.rotation.y += 0.001 * mcTimeScale;
        });
    }
}

function updateConnectionWeb() {
    const connectionGroup = mcScene.getObjectByName('ConnectionWeb');
    if (!connectionGroup) return;
    
    // Clear existing connections
    while (connectionGroup.children.length > 0) {
        connectionGroup.remove(connectionGroup.children[0]);
    }
    
    // Create dynamic connections based on proximity and energy levels
    const activeObjects = [
        ...mcSystems.underground,
        ...mcSystems.monuments,
        ...mcSystems.alertSystem
    ].filter(obj => obj.visible);
    
    activeObjects.forEach((obj1, i) => {
        activeObjects.forEach((obj2, j) => {
            if (i < j) {
                const distance = obj1.position.distanceTo(obj2.position);
                const maxDistance = 200;
                
                if (distance < maxDistance) {
                    const strength = 1 - distance / maxDistance;
                    
                    if (strength > MC_CONFIG.connectionThreshold) {
                        const geometry = new THREE.BufferGeometry().setFromPoints([
                            obj1.position,
                            obj2.position
                        ]);
                        
                        const material = new THREE.LineBasicMaterial({
                            color: new THREE.Color().setHSL(strength, 1, 0.5),
                            transparent: true,
                            opacity: strength * 0.5,
                            blending: THREE.AdditiveBlending
                        });
                        
                        const connection = new THREE.Line(geometry, material);
                        connectionGroup.add(connection);
                    }
                }
            }
        });
    });
}

function updateTemporalEffects() {
    // Update temporal layers based on timeline position
    const timelineSystem = mcScene.getObjectByName('TimelineSystem');
    if (timelineSystem) {
        timelineSystem.children.forEach(layer => {
            const timeLayer = layer.userData.timeLayer;
            if (timeLayer === 'past') {
                layer.visible = mcTime < -100;
                layer.position.y = -50 - mcTime * 0.1;
            } else if (timeLayer === 'future') {
                layer.visible = mcTime > 100;
                layer.position.y = 50 + mcTime * 0.1;
            }
        });
    }
    
    // Sacred geometry animations
    const sacredGroup = mcScene.getObjectByName('SacredGeometry');
    if (sacredGroup) {
        sacredGroup.traverse(child => {
            if (child.userData.rotationSpeed) {
                child.rotation.y += child.userData.rotationSpeed * mcTimeScale;
            }
        });
    }
}

// Utility functions
function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return new THREE.Vector3(x, y, z);
}

function getSystemColor(type) {
    const colors = {
        military: 0xff0000,
        civilian: 0x0099ff,
        ancient: 0xffcc00,
        spiritual: 0xff00ff,
        research: 0x00ff99,
        natural: 0x66ff66,
        transmitter: 0x00ccff,
        receiver: 0x00ff66,
        relay: 0xffcc00,
        portal: 0xff00ff,
        hidden: 0xff0066
    };
    return colors[type] || 0xffffff;
}

function getAlertColor(level) {
    const colors = {
        low: 0x00ff00,
        medium: 0xffcc00,
        high: 0xff0066,
        critical: 0xff0000
    };
    return colors[level] || 0xffffff;
}

function createEnergyField(object, radius, color) {
    const fieldGeometry = new THREE.SphereGeometry(radius, 16, 16);
    const fieldMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
    });
    
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    object.add(field);
    
    // Add rotating rings
    for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(radius * (0.6 + i * 0.2), 0.5, 8, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3 - i * 0.1
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        ring.userData = {
            rotationSpeed: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01 }
        };
        
        field.add(ring);
    }
}

function createVerticalConnection(position, base) {
    const surfacePos = position.clone().normalize().multiplyScalar(MC_CONFIG.earthRadius + 2);
    
    const curve = new THREE.CatmullRomCurve3([
        position,
        position.clone().lerp(surfacePos, 0.5),
        surfacePos
    ]);
    
    const geometry = new THREE.TubeGeometry(curve, 32, 0.5, 8, false);
    const material = new THREE.MeshBasicMaterial({
        color: getSystemColor(base.type),
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    
    const connection = new THREE.Mesh(geometry, material);
    mcScene.add(connection);
}

function createParticleFlow(curve, systemType) {
    const particleCount = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const t = i / particleCount;
        const point = curve.getPoint(t);
        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: getSystemColor(systemType),
        size: 3,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(geometry, material);
    particles.userData = { curve: curve, offset: 0, systemType: systemType };
    
    mcScene.add(particles);
    mcSystems.particleSystems.push(particles);
}

function createEnergyPulse(start, end, power) {
    const pulseGroup = new THREE.Group();
    
    for (let i = 0; i < 3; i++) {
        const sphereGeometry = new THREE.SphereGeometry(power * 0.5, 16, 16);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffcc,
            transparent: true,
            opacity: 0.5 - i * 0.15,
            blending: THREE.AdditiveBlending
        });
        
        const pulse = new THREE.Mesh(sphereGeometry, sphereMaterial);
        pulse.userData = {
            startPos: start.clone(),
            endPos: end.clone(),
            progress: i * 0.33,
            speed: 0.01
        };
        
        pulseGroup.add(pulse);
    }
    
    mcScene.add(pulseGroup);
}

function toggleViewMode(mode) {
    mcViewMode = mode;
    
    // Update camera position based on mode
    switch(mode) {
        case 'unified':
            mcCamera.position.set(0, 200, 500);
            break;
        case 'underground':
            mcCamera.position.set(0, -200, 300);
            break;
        case 'electromagnetic':
            mcCamera.position.set(0, 300, 600);
            break;
        case 'galactic':
            mcCamera.position.set(0, 500, 1500);
            break;
        case 'temporal':
            mcCamera.position.set(0, 400, 400);
            break;
    }
    
    mcCamera.lookAt(0, 0, 0);
}

function toggleSystemLayer(layer, visible) {
    switch(layer) {
        case 'leylines':
            mcScene.getObjectByName('LeyLineSystem').visible = visible;
            break;
        case 'underground':
            mcScene.getObjectByName('UndergroundSystem').visible = visible;
            break;
        case 'moon':
            mcScene.getObjectByName('MoonControlSystem').visible = visible;
            break;
        case 'electromagnetic':
            mcScene.getObjectByName('ElectromagneticSystem').visible = visible;
            break;
        case 'sacred':
            mcScene.getObjectByName('SacredGeometry').visible = visible;
            break;
        case 'galactic':
            mcScene.getObjectByName('GalacticSystem').visible = visible;
            break;
        case 'predictions':
            mcPredictionMode = visible;
            mcScene.getObjectByName('PredictiveSystem').visible = visible;
            break;
    }
}

function updateTimeline(value) {
    mcTime = value;
    const display = document.getElementById('timeline-display');
    
    if (value < -500) {
        display.textContent = `Ancient Past (${value} years)`;
    } else if (value < -50) {
        display.textContent = `Historical (${value} years)`;
    } else if (value < 50) {
        display.textContent = 'Present';
    } else if (value < 500) {
        display.textContent = `Near Future (+${value} years)`;
    } else {
        display.textContent = `Far Future (+${value} years)`;
    }
}

function selectSystem(object) {
    mcSelectedSystem = object;
    
    // Highlight selected
    object.material.emissive = new THREE.Color(0xffffff);
    object.material.emissiveIntensity = 1;
    
    // Show info panel
    const infoPanel = document.getElementById('selected-info');
    const details = document.getElementById('selected-details');
    
    infoPanel.style.display = 'block';
    details.innerHTML = `
        <strong>${object.userData.name || 'Unknown'}</strong><br>
        Type: ${object.userData.type || 'N/A'}<br>
        ${object.userData.depth ? `Depth: ${object.userData.depth}km<br>` : ''}
        ${object.userData.level ? `Security Level: ${object.userData.level}<br>` : ''}
        ${object.userData.power ? `Power Level: ${object.userData.power}<br>` : ''}
    `;
}

function updateParticleAttraction(mouse) {
    // Make particles respond to mouse position
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(mcCamera);
    const dir = vector.sub(mcCamera.position).normalize();
    const distance = -mcCamera.position.z / dir.z;
    const pos = mcCamera.position.clone().add(dir.multiplyScalar(distance));
    
    // Apply attraction force to nearby particles
    mcSystems.particleSystems.forEach(system => {
        const positions = system.geometry.attributes.position.array;
        const velocities = system.userData.velocities;
        
        for (let i = 0; i < positions.length; i += 3) {
            const particlePos = new THREE.Vector3(
                positions[i],
                positions[i + 1],
                positions[i + 2]
            );
            
            const dist = particlePos.distanceTo(pos);
            if (dist < 100) {
                const force = pos.clone().sub(particlePos).normalize().multiplyScalar(0.1 * (1 - dist / 100));
                velocities[i] += force.x;
                velocities[i + 1] += force.y;
                velocities[i + 2] += force.z;
            }
        }
    });
}

// Cleanup function
function cleanupMasterConvergence() {
    if (mcAnimationId) {
        cancelAnimationFrame(mcAnimationId);
    }
    
    if (mcRenderer) {
        mcRenderer.dispose();
    }
    
    if (mcScene) {
        mcScene.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('master-convergence-container');
    if (container && mcCamera && mcRenderer) {
        mcCamera.aspect = container.clientWidth / container.clientHeight;
        mcCamera.updateProjectionMatrix();
        mcRenderer.setSize(container.clientWidth, container.clientHeight || 800);
        mcComposer.setSize(container.clientWidth, container.clientHeight || 800);
    }
});

// Export functions for global access
window.initMasterConvergence = initMasterConvergence;
window.cleanupMasterConvergence = cleanupMasterConvergence;
window.toggleViewMode = toggleViewMode;
window.mcTimeScale = mcTimeScale;