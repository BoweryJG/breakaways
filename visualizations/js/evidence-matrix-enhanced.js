// Evidence Matrix Enhanced - Revolutionary 3D Correlation Network
// AI-powered pattern recognition with quantum correlation calculations
// Real-time evidence streaming and multidimensional analysis

// Global state
let emScene, emCamera, emRenderer, emControls;
let emRaycaster, emMouse;
let correlationNetwork = [];
let evidenceNodes = [];
let emConnectionLines = [];
let dataStreams = [];
let patternClusters = [];
let quantumCorrelations = [];
let holoDisplays = [];
let emAnimationId;
let emTime = 0;
let selectedEvidence = null;
let aiPatternRecognition = true;
let quantumMode = false;
let timelineMode = 'present';

// Enhanced categories with metadata
const enhancedCategories = [
    { id: 'ancient-sites', name: 'Ancient Sites', color: 0xffaa00, symbol: '🏛️', frequency: 432 },
    { id: 'missing-411', name: 'Missing 411', color: 0xff0066, symbol: '👥', frequency: 528 },
    { id: 'uaps', name: 'UAP/UFO', color: 0x00ffcc, symbol: '🛸', frequency: 741 },
    { id: 'underground', name: 'Underground Bases', color: 0x6666ff, symbol: '🏔️', frequency: 639 },
    { id: 'genetic', name: 'Genetic Anomalies', color: 0xff00ff, symbol: '🧬', frequency: 528 },
    { id: 'ley-lines', name: 'Ley Lines', color: 0x00ff66, symbol: '⚡', frequency: 396 },
    { id: 'crop-circles', name: 'Crop Circles', color: 0xffff00, symbol: '⭕', frequency: 417 },
    { id: 'electromagnetic', name: 'EM Anomalies', color: 0x00ccff, symbol: '📡', frequency: 852 },
    { id: 'bloodlines', name: 'Bloodlines', color: 0xff3366, symbol: '🩸', frequency: 963 },
    { id: 'antarctica', name: 'Antarctica', color: 0xccccff, symbol: '❄️', frequency: 174 },
    { id: 'time-anomalies', name: 'Time Anomalies', color: 0xcc00ff, symbol: '⏰', frequency: 285 },
    { id: 'cryptids', name: 'Cryptids', color: 0x66ff33, symbol: '👹', frequency: 369 },
    { id: 'consciousness', name: 'Consciousness', color: 0xff66cc, symbol: '🧠', frequency: 432 },
    { id: 'portals', name: 'Dimensional Portals', color: 0x9966ff, symbol: '🌀', frequency: 528 }
];

// Configuration
const EM_CONFIG = {
    nodeRadius: 20,
    connectionThreshold: 0.3,
    aiSensitivity: 0.7,
    quantumEntanglement: 0.5,
    dataStreamSpeed: 0.001,
    patternThreshold: 0.8,
    hologramSize: 100
};

function initEvidence() {
    console.log('Initializing Enhanced Evidence Matrix...');
    
    const container = document.getElementById('evidence-container');
    if (!container) {
        console.error('Evidence container not found');
        return;
    }
    
    // Clear and setup
    container.innerHTML = '';
    
    // Setup 3D scene
    setupEvidenceScene(container);
    
    // Create visualization components
    createCorrelationNetwork();
    createDataStreams();
    createAIPatternRecognition();
    createQuantumCorrelations();
    createHolographicDisplays();
    createTemporalLayers();
    createInteractiveControls();
    
    // Initialize data
    initializeEvidenceData();
    
    // Start animation
    animateEvidenceMatrix();
}

function setupEvidenceScene(container) {
    const isMobile = window.mobileUtils && window.mobileUtils.isMobile();
    const width = container.clientWidth;
    const height = container.clientHeight || (isMobile ? 400 : 800);
    
    // Scene setup
    emScene = new THREE.Scene();
    emScene.background = new THREE.Color(0x000011);
    emScene.fog = new THREE.FogExp2(0x000011, 0.001);
    
    // Camera
    emCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
    emCamera.position.set(0, 200, 400);
    
    // Renderer with mobile optimization
    emRenderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: isMobile ? "low-power" : "high-performance"
    });
    emRenderer.setSize(width, height);
    emRenderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    emRenderer.shadowMap.enabled = !isMobile;
    emRenderer.shadowMap.type = isMobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
    
    // Apply mobile optimizations
    if (window.mobileUtils) {
        window.mobileUtils.optimizeRenderer(emRenderer);
    }
    container.appendChild(emRenderer.domElement);
    
    // Post-processing (disable on mobile for performance)
    if (!isMobile) {
        setupPostProcessing();
    }
    
    // Controls with mobile support
    emControls = new THREE.OrbitControls(emCamera, emRenderer.domElement);
    emControls.enableDamping = true;
    emControls.dampingFactor = 0.05;
    emControls.minDistance = isMobile ? 150 : 100;
    emControls.maxDistance = isMobile ? 800 : 1000;
    emControls.autoRotate = !isMobile;
    emControls.autoRotateSpeed = 0.2;
    
    // Add mobile touch controls
    if (window.mobileUtils) {
        window.mobileUtils.addTouchControls(emControls);
    }
    
    // Raycaster
    emRaycaster = new THREE.Raycaster();
    emMouse = new THREE.Vector2();
    
    // Lighting
    setupLighting();
    
    // Environment
    createEnvironment();
}

function setupPostProcessing() {
    // Basic setup - could be expanded with composer
    emRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    emRenderer.toneMappingExposure = 1.2;
}

function setupLighting() {
    // Ambient
    const ambient = new THREE.AmbientLight(0x222244, 0.3);
    emScene.add(ambient);
    
    // Key lights
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(100, 200, 100);
    keyLight.castShadow = true;
    keyLight.shadow.camera.near = 10;
    keyLight.shadow.camera.far = 1000;
    keyLight.shadow.camera.left = -200;
    keyLight.shadow.camera.right = 200;
    keyLight.shadow.camera.top = 200;
    keyLight.shadow.camera.bottom = -200;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    emScene.add(keyLight);
    
    // Colored accent lights
    const colors = [0x00ffcc, 0xff00ff, 0xffaa00];
    colors.forEach((color, i) => {
        const light = new THREE.PointLight(color, 0.5, 300);
        const angle = (i / colors.length) * Math.PI * 2;
        light.position.set(
            Math.cos(angle) * 200,
            100,
            Math.sin(angle) * 200
        );
        emScene.add(light);
    });
}

function createEnvironment() {
    // Grid floor
    const gridHelper = new THREE.GridHelper(1000, 50, 0x00ffcc, 0x003333);
    gridHelper.position.y = -100;
    emScene.add(gridHelper);
    
    // Particle field with mobile optimization
    const isMobile = window.mobileUtils && window.mobileUtils.isMobile();
    let particleCount = 5000;
    if (window.mobileUtils) {
        particleCount = window.mobileUtils.optimizeParticles(particleCount);
    }
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const radius = 200 + Math.random() * 500;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00ffcc,
        size: 1,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    emScene.add(particles);
}

function createCorrelationNetwork() {
    const networkGroup = new THREE.Group();
    networkGroup.name = 'CorrelationNetwork';
    
    // Create nodes for each category
    const nodeRadius = 300;
    enhancedCategories.forEach((category, index) => {
        const angle = (index / enhancedCategories.length) * Math.PI * 2;
        const x = Math.cos(angle) * nodeRadius;
        const z = Math.sin(angle) * nodeRadius;
        const y = Math.sin(index * 0.5) * 50;
        
        const node = createEvidenceNode(category, new THREE.Vector3(x, y, z));
        networkGroup.add(node);
        evidenceNodes.push(node);
    });
    
    // Create initial connections
    updateCorrelationConnections();
    
    emScene.add(networkGroup);
}

function createEvidenceNode(category, position) {
    const nodeGroup = new THREE.Group();
    
    // Core sphere
    const geometry = new THREE.SphereGeometry(EM_CONFIG.nodeRadius, 32, 32);
    const material = new THREE.MeshPhysicalMaterial({
        color: category.color,
        emissive: category.color,
        emissiveIntensity: 0.3,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.9
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    nodeGroup.add(sphere);
    
    // Symbol sprite
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 128, 128);
    ctx.font = '64px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(category.symbol, 64, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    });
    
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(30, 30, 1);
    sprite.position.y = 30;
    nodeGroup.add(sprite);
    
    // Energy field
    const fieldGeometry = new THREE.SphereGeometry(EM_CONFIG.nodeRadius * 1.5, 16, 16);
    const fieldMaterial = new THREE.MeshBasicMaterial({
        color: category.color,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    nodeGroup.add(field);
    
    // Data rings
    for (let i = 0; i < 3; i++) {
        const ringRadius = EM_CONFIG.nodeRadius + 10 + i * 10;
        const ringGeometry = new THREE.TorusGeometry(ringRadius, 1, 8, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: category.color,
            transparent: true,
            opacity: 0.5 - i * 0.1
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        ring.userData = { rotationSpeed: 0.01 * (i + 1) };
        nodeGroup.add(ring);
    }
    
    // Label
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 256;
    labelCanvas.height = 64;
    const labelCtx = labelCanvas.getContext('2d');
    
    labelCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    labelCtx.fillRect(0, 0, 256, 64);
    labelCtx.strokeStyle = '#00ffcc';
    labelCtx.strokeRect(0, 0, 256, 64);
    
    labelCtx.font = '20px monospace';
    labelCtx.fillStyle = '#00ffcc';
    labelCtx.textAlign = 'center';
    labelCtx.fillText(category.name.toUpperCase(), 128, 25);
    labelCtx.font = '14px monospace';
    labelCtx.fillText(`Freq: ${category.frequency} Hz`, 128, 45);
    
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelMaterial = new THREE.SpriteMaterial({
        map: labelTexture,
        transparent: true
    });
    
    const label = new THREE.Sprite(labelMaterial);
    label.scale.set(40, 10, 1);
    label.position.y = -40;
    nodeGroup.add(label);
    
    nodeGroup.position.copy(position);
    nodeGroup.userData = {
        category: category,
        connections: [],
        evidence: generateEvidenceData(category),
        activity: Math.random()
    };
    
    return nodeGroup;
}

function updateCorrelationConnections() {
    // Clear existing connections
    emConnectionLines.forEach(line => {
        emScene.remove(line);
    });
    emConnectionLines = [];
    
    // Create connections based on correlation strength
    for (let i = 0; i < evidenceNodes.length; i++) {
        for (let j = i + 1; j < evidenceNodes.length; j++) {
            const node1 = evidenceNodes[i];
            const node2 = evidenceNodes[j];
            
            const correlation = calculateCorrelation(
                node1.userData.category,
                node2.userData.category
            );
            
            if (correlation > EM_CONFIG.connectionThreshold) {
                const connection = createConnection(node1, node2, correlation);
                emConnectionLines.push(connection);
                emScene.add(connection);
                
                // Store connection reference
                node1.userData.connections.push({ node: node2, strength: correlation });
                node2.userData.connections.push({ node: node1, strength: correlation });
            }
        }
    }
}

function createConnection(node1, node2, strength) {
    const curve = new THREE.CatmullRomCurve3([
        node1.position,
        node1.position.clone().lerp(node2.position, 0.3).add(new THREE.Vector3(0, 50, 0)),
        node2.position.clone().lerp(node1.position, 0.3).add(new THREE.Vector3(0, 50, 0)),
        node2.position
    ]);
    
    const geometry = new THREE.TubeGeometry(curve, 64, strength * 3, 8, false);
    const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(strength, 1, 0.5),
        transparent: true,
        opacity: strength * 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const connection = new THREE.Mesh(geometry, material);
    connection.userData = {
        node1: node1,
        node2: node2,
        strength: strength,
        curve: curve,
        pulsePhase: Math.random() * Math.PI * 2
    };
    
    return connection;
}

function createDataStreams() {
    const streamGroup = new THREE.Group();
    streamGroup.name = 'DataStreams';
    
    // Create particle streams between connected nodes
    emConnectionLines.forEach(connection => {
        const streamCount = Math.floor(connection.userData.strength * 10) + 5;
        const stream = createDataStream(connection.userData.curve, streamCount);
        streamGroup.add(stream);
        dataStreams.push(stream);
    });
    
    emScene.add(streamGroup);
}

function createDataStream(curve, particleCount) {
    // Apply mobile optimization to particle count
    if (window.mobileUtils && window.mobileUtils.isMobile()) {
        particleCount = Math.floor(particleCount * 0.3);
    }
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        phases[i] = i / particleCount;
        const point = curve.getPoint(phases[i]);
        
        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z;
        
        const color = new THREE.Color().setHSL(phases[i], 1, 0.5);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const stream = new THREE.Points(geometry, material);
    stream.userData = {
        curve: curve,
        phases: phases,
        speed: EM_CONFIG.dataStreamSpeed * (0.5 + Math.random() * 0.5)
    };
    
    return stream;
}

function createAIPatternRecognition() {
    // AI pattern recognition visualization
    const patternGroup = new THREE.Group();
    patternGroup.name = 'AIPatterns';
    
    // Analyze node clusters
    const clusters = identifyPatternClusters();
    
    clusters.forEach(cluster => {
        const patternViz = createPatternVisualization(cluster);
        patternGroup.add(patternViz);
        patternClusters.push(patternViz);
    });
    
    emScene.add(patternGroup);
}

function identifyPatternClusters() {
    const clusters = [];
    const threshold = EM_CONFIG.patternThreshold;
    
    // Simple clustering based on connection strength
    const visited = new Set();
    
    evidenceNodes.forEach(node => {
        if (!visited.has(node)) {
            const cluster = [];
            const queue = [node];
            
            while (queue.length > 0) {
                const current = queue.shift();
                if (!visited.has(current)) {
                    visited.add(current);
                    cluster.push(current);
                    
                    current.userData.connections.forEach(conn => {
                        if (conn.strength > threshold && !visited.has(conn.node)) {
                            queue.push(conn.node);
                        }
                    });
                }
            }
            
            if (cluster.length > 2) {
                clusters.push({
                    nodes: cluster,
                    centroid: calculateClusterCentroid(cluster),
                    strength: calculateClusterStrength(cluster)
                });
            }
        }
    });
    
    return clusters;
}

function createPatternVisualization(cluster) {
    const group = new THREE.Group();
    
    // Create convex hull around cluster
    const points = cluster.nodes.map(node => node.position);
    const hullGeometry = new THREE.ConvexGeometry(points);
    const hullMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    
    const hull = new THREE.Mesh(hullGeometry, hullMaterial);
    group.add(hull);
    
    // Pattern indicator at centroid
    const indicatorGeometry = new THREE.OctahedronGeometry(10, 2);
    const indicatorMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.8
    });
    
    const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
    indicator.position.copy(cluster.centroid);
    group.add(indicator);
    
    // Pattern label
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
    ctx.fillRect(0, 0, 256, 64);
    ctx.strokeStyle = '#00ff00';
    ctx.strokeRect(0, 0, 256, 64);
    
    ctx.font = '16px monospace';
    ctx.fillStyle = '#00ff00';
    ctx.textAlign = 'center';
    ctx.fillText('PATTERN DETECTED', 128, 25);
    ctx.fillText(`Strength: ${(cluster.strength * 100).toFixed(0)}%`, 128, 45);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    });
    
    const label = new THREE.Sprite(spriteMaterial);
    label.scale.set(50, 12.5, 1);
    label.position.copy(cluster.centroid);
    label.position.y += 30;
    group.add(label);
    
    group.userData = cluster;
    return group;
}

function createQuantumCorrelations() {
    if (!quantumMode) return;
    
    const quantumGroup = new THREE.Group();
    quantumGroup.name = 'QuantumCorrelations';
    
    // Create quantum entanglement visualization
    for (let i = 0; i < evidenceNodes.length; i++) {
        for (let j = i + 1; j < evidenceNodes.length; j++) {
            const entanglement = calculateQuantumEntanglement(
                evidenceNodes[i].userData.category,
                evidenceNodes[j].userData.category
            );
            
            if (entanglement > EM_CONFIG.quantumEntanglement) {
                const quantumLink = createQuantumLink(evidenceNodes[i], evidenceNodes[j], entanglement);
                quantumGroup.add(quantumLink);
                quantumCorrelations.push(quantumLink);
            }
        }
    }
    
    emScene.add(quantumGroup);
}

function createQuantumLink(node1, node2, entanglement) {
    const group = new THREE.Group();
    
    // Quantum field between nodes
    const midpoint = new THREE.Vector3().lerpVectors(node1.position, node2.position, 0.5);
    
    const fieldGeometry = new THREE.SphereGeometry(20, 16, 16);
    const fieldMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            entanglement: { value: entanglement }
        },
        vertexShader: `
            varying vec3 vPosition;
            uniform float time;
            
            void main() {
                vPosition = position;
                vec3 pos = position;
                float wave = sin(position.x * 0.1 + time) * sin(position.y * 0.1 - time) * 2.0;
                pos += normalize(position) * wave;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float entanglement;
            varying vec3 vPosition;
            
            void main() {
                float r = length(vPosition);
                float pattern = sin(r * 0.5 - time * 2.0) * 0.5 + 0.5;
                vec3 color = mix(vec3(0.0, 1.0, 1.0), vec3(1.0, 0.0, 1.0), pattern);
                float alpha = entanglement * (0.5 + pattern * 0.3);
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.position.copy(midpoint);
    group.add(field);
    
    group.userData = {
        node1: node1,
        node2: node2,
        entanglement: entanglement,
        material: fieldMaterial
    };
    
    return group;
}

function createHolographicDisplays() {
    const holoGroup = new THREE.Group();
    holoGroup.name = 'HolographicDisplays';
    
    // Create holographic displays for selected evidence
    evidenceNodes.forEach(node => {
        const display = createHolographicDisplay(node);
        display.visible = false;
        holoGroup.add(display);
        holoDisplays.push(display);
    });
    
    emScene.add(holoGroup);
}

function createHolographicDisplay(node) {
    const group = new THREE.Group();
    
    // Hologram base
    const baseGeometry = new THREE.CylinderGeometry(30, 35, 5, 32);
    const baseMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.3
    });
    
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -50;
    group.add(base);
    
    // Hologram projection
    const holoGeometry = new THREE.BoxGeometry(EM_CONFIG.hologramSize, EM_CONFIG.hologramSize, 1);
    const holoMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            scanlineIntensity: { value: 0.1 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float scanlineIntensity;
            varying vec2 vUv;
            
            void main() {
                vec3 color = vec3(0.0, 1.0, 0.8);
                
                // Scanlines
                float scanline = sin(vUv.y * 100.0 + time * 5.0) * scanlineIntensity;
                color += vec3(scanline);
                
                // Hologram flicker
                float flicker = sin(time * 50.0) * 0.05 + 0.95;
                color *= flicker;
                
                // Edge fade
                float edge = smoothstep(0.0, 0.1, vUv.x) * smoothstep(1.0, 0.9, vUv.x) *
                            smoothstep(0.0, 0.1, vUv.y) * smoothstep(1.0, 0.9, vUv.y);
                
                gl_FragColor = vec4(color, edge * 0.8);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    const holo = new THREE.Mesh(holoGeometry, holoMaterial);
    holo.position.y = 50;
    group.add(holo);
    
    // Data display canvas
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    updateHolographicData(ctx, node.userData);
    
    const texture = new THREE.CanvasTexture(canvas);
    const displayMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9
    });
    
    const display = new THREE.Mesh(
        new THREE.PlaneGeometry(EM_CONFIG.hologramSize * 0.9, EM_CONFIG.hologramSize * 0.9),
        displayMaterial
    );
    display.position.y = 50;
    display.position.z = 1;
    group.add(display);
    
    // Light beams
    for (let i = 0; i < 4; i++) {
        const beamGeometry = new THREE.CylinderGeometry(0.5, 2, 100, 8);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffcc,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        const angle = (i / 4) * Math.PI * 2;
        beam.position.x = Math.cos(angle) * 30;
        beam.position.z = Math.sin(angle) * 30;
        beam.rotation.z = Math.PI / 8 * (i % 2 === 0 ? 1 : -1);
        group.add(beam);
    }
    
    group.position.copy(node.position);
    group.position.y += 100;
    group.userData = {
        node: node,
        canvas: canvas,
        context: ctx,
        texture: texture,
        holoMaterial: holoMaterial
    };
    
    return group;
}

function updateHolographicData(ctx, nodeData) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, 512, 512);
    
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 492, 492);
    
    ctx.font = '24px monospace';
    ctx.fillStyle = '#00ffcc';
    ctx.fillText(nodeData.category.name.toUpperCase(), 20, 40);
    
    // Evidence summary
    ctx.font = '16px monospace';
    let y = 80;
    
    ctx.fillText(`Evidence Count: ${nodeData.evidence.length}`, 20, y);
    y += 30;
    
    ctx.fillText(`Connections: ${nodeData.connections.length}`, 20, y);
    y += 30;
    
    ctx.fillText(`Activity Level: ${(nodeData.activity * 100).toFixed(0)}%`, 20, y);
    y += 30;
    
    // Draw correlation graph
    ctx.strokeStyle = '#00ffcc';
    ctx.beginPath();
    ctx.moveTo(20, 250);
    ctx.lineTo(492, 250);
    ctx.lineTo(492, 480);
    ctx.lineTo(20, 480);
    ctx.lineTo(20, 250);
    ctx.stroke();
    
    // Plot correlation data
    const correlationData = nodeData.connections.map(conn => conn.strength);
    if (correlationData.length > 0) {
        ctx.strokeStyle = '#ff00ff';
        ctx.beginPath();
        correlationData.forEach((strength, i) => {
            const x = 20 + (i / correlationData.length) * 472;
            const y = 480 - strength * 230;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }
    
    // Labels
    ctx.fillStyle = '#888888';
    ctx.font = '12px monospace';
    ctx.fillText('CORRELATION STRENGTH', 200, 240);
}

function createTemporalLayers() {
    const temporalGroup = new THREE.Group();
    temporalGroup.name = 'TemporalLayers';
    
    // Create past/present/future visualization layers
    const timeLayers = [
        { offset: -150, opacity: 0.3, color: 0x0066ff, name: 'past' },
        { offset: 0, opacity: 0.8, color: 0x00ffcc, name: 'present' },
        { offset: 150, opacity: 0.5, color: 0xff00ff, name: 'future' }
    ];
    
    timeLayers.forEach(layer => {
        const layerGroup = new THREE.Group();
        layerGroup.position.y = layer.offset;
        layerGroup.userData = { timeLayer: layer.name };
        layerGroup.visible = layer.name === timelineMode;
        
        // Create temporal echo of network
        evidenceNodes.forEach(node => {
            const echo = node.clone();
            echo.traverse(child => {
                if (child.material) {
                    child.material = child.material.clone();
                    child.material.opacity *= layer.opacity;
                    child.material.color = new THREE.Color(layer.color);
                }
            });
            layerGroup.add(echo);
        });
        
        temporalGroup.add(layerGroup);
    });
    
    emScene.add(temporalGroup);
}

function createInteractiveControls() {
    const container = document.getElementById('evidence-container');
    
    const controlsHTML = `
        <div id="em-controls" style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.8); padding: 20px; border: 1px solid #00ffcc; font-family: monospace; color: #00ffcc;">
            <h3 style="margin-top: 0;">EVIDENCE MATRIX CONTROL</h3>
            
            <div style="margin: 10px 0;">
                <label style="margin-right: 10px;">
                    <input type="checkbox" id="ai-toggle" checked> AI Pattern Recognition
                </label>
                <label>
                    <input type="checkbox" id="quantum-toggle"> Quantum Correlations
                </label>
            </div>
            
            <div style="margin: 10px 0;">
                <label>Connection Threshold: <span id="threshold-value">0.3</span></label>
                <input type="range" id="threshold-slider" min="0" max="1" step="0.05" value="0.3" style="width: 100%;">
            </div>
            
            <div style="margin: 10px 0;">
                <label>Timeline Mode:</label>
                <select id="timeline-select" style="background: #000; color: #00ffcc; border: 1px solid #00ffcc;">
                    <option value="past">Past</option>
                    <option value="present" selected>Present</option>
                    <option value="future">Future</option>
                </select>
            </div>
            
            <div id="selected-evidence" style="margin-top: 20px; display: none;">
                <h4>Selected Evidence</h4>
                <div id="evidence-details"></div>
            </div>
        </div>
        
        <div id="em-stats" style="position: absolute; bottom: 20px; right: 20px; background: rgba(0,0,0,0.8); padding: 15px; border: 1px solid #00ffcc; font-family: monospace; color: #00ffcc;">
            <div>Active Nodes: <span id="active-nodes">14</span></div>
            <div>Connections: <span id="connection-count">0</span></div>
            <div>Patterns: <span id="pattern-count">0</span></div>
            <div>Data Flow: <span id="data-flow">0</span> TB/s</div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', controlsHTML);
    
    // Setup event listeners
    setupControlListeners();
    
    // Setup mouse interactions
    emRenderer.domElement.addEventListener('mousemove', onMouseMove);
    emRenderer.domElement.addEventListener('click', onClick);
}

function setupControlListeners() {
    document.getElementById('ai-toggle').addEventListener('change', (e) => {
        aiPatternRecognition = e.target.checked;
        const patternGroup = emScene.getObjectByName('AIPatterns');
        if (patternGroup) patternGroup.visible = aiPatternRecognition;
    });
    
    document.getElementById('quantum-toggle').addEventListener('change', (e) => {
        quantumMode = e.target.checked;
        if (quantumMode && quantumCorrelations.length === 0) {
            createQuantumCorrelations();
        }
        const quantumGroup = emScene.getObjectByName('QuantumCorrelations');
        if (quantumGroup) quantumGroup.visible = quantumMode;
    });
    
    document.getElementById('threshold-slider').addEventListener('input', (e) => {
        EM_CONFIG.connectionThreshold = parseFloat(e.target.value);
        document.getElementById('threshold-value').textContent = EM_CONFIG.connectionThreshold.toFixed(2);
        updateCorrelationConnections();
        updateDataStreams();
    });
    
    document.getElementById('timeline-select').addEventListener('change', (e) => {
        timelineMode = e.target.value;
        updateTimelineView();
    });
}

function onMouseMove(event) {
    const rect = emRenderer.domElement.getBoundingClientRect();
    emMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    emMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function onClick(event) {
    emRaycaster.setFromCamera(emMouse, emCamera);
    
    const intersects = emRaycaster.intersectObjects(evidenceNodes, true);
    if (intersects.length > 0) {
        const node = intersects[0].object.parent;
        selectEvidenceNode(node);
    }
}

function selectEvidenceNode(node) {
    // Hide all holographic displays
    holoDisplays.forEach(display => {
        display.visible = false;
    });
    
    // Show selected node's display
    const display = holoDisplays.find(d => d.userData.node === node);
    if (display) {
        display.visible = true;
        updateHolographicData(display.userData.context, node.userData);
        display.userData.texture.needsUpdate = true;
    }
    
    // Update UI
    const detailsDiv = document.getElementById('evidence-details');
    detailsDiv.innerHTML = `
        <div style="color: #fff;">${node.userData.category.name}</div>
        <div>Evidence: ${node.userData.evidence.length} items</div>
        <div>Connections: ${node.userData.connections.length}</div>
        <div>Frequency: ${node.userData.category.frequency} Hz</div>
    `;
    
    document.getElementById('selected-evidence').style.display = 'block';
    
    selectedEvidence = node;
}

// Data generation functions
function generateEvidenceData(category) {
    const evidence = [];
    const count = Math.floor(Math.random() * 20) + 10;
    
    for (let i = 0; i < count; i++) {
        evidence.push({
            id: `${category.id}-${i}`,
            type: ['document', 'witness', 'physical', 'sensor'][Math.floor(Math.random() * 4)],
            date: new Date(2000 + Math.random() * 25, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
            quality: Math.random(),
            verified: Math.random() > 0.3
        });
    }
    
    return evidence;
}

function calculateCorrelation(cat1, cat2) {
    // Predefined strong correlations
    const correlations = {
        'ancient-sites': { 'ley-lines': 0.95, 'electromagnetic': 0.87, 'underground': 0.72 },
        'missing-411': { 'underground': 0.83, 'cryptids': 0.76, 'time-anomalies': 0.64 },
        'uaps': { 'electromagnetic': 0.91, 'time-anomalies': 0.78, 'antarctica': 0.65 },
        'bloodlines': { 'genetic': 0.94, 'ancient-sites': 0.67, 'consciousness': 0.81 },
        'portals': { 'time-anomalies': 0.88, 'electromagnetic': 0.79, 'consciousness': 0.73 }
    };
    
    if (correlations[cat1.id] && correlations[cat1.id][cat2.id]) {
        return correlations[cat1.id][cat2.id];
    }
    if (correlations[cat2.id] && correlations[cat2.id][cat1.id]) {
        return correlations[cat2.id][cat1.id];
    }
    
    // Generate based on frequency resonance
    const freqDiff = Math.abs(cat1.frequency - cat2.frequency);
    const resonance = 1 - (freqDiff / 1000);
    return Math.max(0.1, resonance * 0.6 + Math.random() * 0.2);
}

function calculateQuantumEntanglement(cat1, cat2) {
    // Quantum entanglement based on harmonic frequencies
    const ratio = cat1.frequency / cat2.frequency;
    const harmonics = [0.5, 1, 2, 1.5, 3];
    
    let entanglement = 0;
    harmonics.forEach(harmonic => {
        const diff = Math.abs(ratio - harmonic);
        if (diff < 0.1) {
            entanglement = Math.max(entanglement, 1 - diff * 10);
        }
    });
    
    return entanglement;
}

function calculateClusterCentroid(nodes) {
    const centroid = new THREE.Vector3();
    nodes.forEach(node => {
        centroid.add(node.position);
    });
    centroid.divideScalar(nodes.length);
    return centroid;
}

function calculateClusterStrength(nodes) {
    let totalStrength = 0;
    let connectionCount = 0;
    
    nodes.forEach(node => {
        node.userData.connections.forEach(conn => {
            if (nodes.includes(conn.node)) {
                totalStrength += conn.strength;
                connectionCount++;
            }
        });
    });
    
    return connectionCount > 0 ? totalStrength / connectionCount : 0;
}

function updateDataStreams() {
    // Clear existing streams
    dataStreams.forEach(stream => {
        emScene.remove(stream);
    });
    dataStreams = [];
    
    // Recreate based on new connections
    const streamGroup = emScene.getObjectByName('DataStreams');
    if (streamGroup) {
        createDataStreams();
    }
}

function updateTimelineView() {
    const temporalGroup = emScene.getObjectByName('TemporalLayers');
    if (temporalGroup) {
        temporalGroup.children.forEach(layer => {
            layer.visible = layer.userData.timeLayer === timelineMode;
        });
    }
}

function initializeEvidenceData() {
    // Initialize with some data
    updateStats();
}

function updateStats() {
    document.getElementById('active-nodes').textContent = evidenceNodes.filter(n => n.userData.activity > 0.5).length;
    document.getElementById('connection-count').textContent = emConnectionLines.length;
    document.getElementById('pattern-count').textContent = patternClusters.length;
    document.getElementById('data-flow').textContent = (Math.random() * 100).toFixed(1);
}

// Animation loop
function animateEvidenceMatrix() {
    emAnimationId = requestAnimationFrame(animateEvidenceMatrix);
    
    emTime += 0.01;
    
    // Update controls
    emControls.update();
    
    // Animate nodes
    evidenceNodes.forEach(node => {
        // Rotate rings
        node.children.forEach(child => {
            if (child.userData.rotationSpeed) {
                child.rotation.y += child.userData.rotationSpeed;
                child.rotation.z += child.userData.rotationSpeed * 0.5;
            }
        });
        
        // Pulse based on activity
        const scale = 1 + Math.sin(emTime * 2 + node.userData.category.frequency * 0.01) * 0.1 * node.userData.activity;
        node.scale.setScalar(scale);
        
        // Update activity
        node.userData.activity = Math.max(0.3, Math.min(1, 
            node.userData.activity + (Math.random() - 0.5) * 0.01
        ));
    });
    
    // Animate connections
    emConnectionLines.forEach(connection => {
        const pulse = Math.sin(emTime * 3 + connection.userData.pulsePhase) * 0.5 + 0.5;
        connection.material.opacity = connection.userData.strength * 0.3 + pulse * 0.3;
    });
    
    // Animate data streams
    dataStreams.forEach(stream => {
        const positions = stream.geometry.attributes.position.array;
        const phases = stream.userData.phases;
        const curve = stream.userData.curve;
        
        for (let i = 0; i < phases.length; i++) {
            phases[i] = (phases[i] + stream.userData.speed) % 1;
            const point = curve.getPoint(phases[i]);
            
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = point.z;
        }
        
        stream.geometry.attributes.position.needsUpdate = true;
    });
    
    // Animate quantum correlations
    quantumCorrelations.forEach(quantum => {
        if (quantum.userData.material && quantum.userData.material.uniforms) {
            quantum.userData.material.uniforms.time.value = emTime;
        }
    });
    
    // Animate pattern clusters
    patternClusters.forEach(pattern => {
        pattern.rotation.y += 0.001;
        pattern.children.forEach(child => {
            if (child.type === 'Mesh' && child.geometry.type === 'OctahedronGeometry') {
                child.rotation.x += 0.02;
                child.rotation.z += 0.01;
            }
        });
    });
    
    // Update holographic displays
    holoDisplays.forEach(display => {
        if (display.visible && display.userData.holoMaterial) {
            display.userData.holoMaterial.uniforms.time.value = emTime;
        }
    });
    
    // Update stats periodically
    if (Math.floor(emTime) % 2 === 0 && Math.floor(emTime * 100) % 100 === 0) {
        updateStats();
    }
    
    // Render
    emRenderer.render(emScene, emCamera);
}

// Cleanup
function cleanupEvidenceMatrix() {
    if (emAnimationId) {
        cancelAnimationFrame(emAnimationId);
    }
    
    if (emScene) {
        emScene.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
        emScene.clear();
    }
    
    if (emRenderer) {
        emRenderer.dispose();
    }
    
    // Clear arrays
    correlationNetwork = [];
    evidenceNodes = [];
    emConnectionLines = [];
    dataStreams = [];
    patternClusters = [];
    quantumCorrelations = [];
    holoDisplays = [];
}

// Handle resize
window.addEventListener('resize', () => {
    if (window.evidenceMatrixResizeTimeout) clearTimeout(window.evidenceMatrixResizeTimeout);
    window.evidenceMatrixResizeTimeout = setTimeout(() => {
        const container = document.getElementById('evidence-container');
        if (container && emCamera && emRenderer) {
            const isMobile = window.mobileUtils && window.mobileUtils.isMobile();
            const width = container.clientWidth;
            const height = container.clientHeight || (isMobile ? 400 : 800);
        
        emCamera.aspect = width / height;
        emCamera.updateProjectionMatrix();
        
            emRenderer.setSize(width, height);
            if (emComposer) {
                emComposer.setSize(width, height);
            }
        }
    }, 250);
});

// Export
window.initEvidence = initEvidence;
window.cleanupEvidenceMatrix = cleanupEvidenceMatrix;