// Master Convergence Enhanced - The Ultimate Reality Matrix Visualization
// Category-defining holographic integration of all breakaway civilization systems
// with quantum consciousness mapping and multidimensional portal effects

// Global state for Enhanced Master Convergence
let emcScene, emcCamera, emcRenderer, emcControls, emcComposer;
let emcRaycaster, emcMouse;
let quantumField, consciousnessGrid, realityMatrix;
let portalSystems = [];
let quantumEntanglements = [];
let consciousnessNodes = [];
let realityGlitches = [];
let convergenceCore;
let emcAnimationId;
let emcTime = 0;
let emcConvergenceLevel = 0.873;
let emcQuantumCoherence = 0;
let emcRealityStability = 1.0;

// Enhanced configuration
const EMC_CONFIG = {
    earthRadius: 100,
    quantumFieldRadius: 500,
    consciousnessLayers: 7,
    portalCount: 13,
    entanglementPairs: 144,
    glitchProbability: 0.001,
    convergenceThreshold: 0.95,
    quantumFoamDensity: 10000,
    realityThreads: 1000
};

// Shader chunks for reuse
const shaderChunks = {
    noise: `
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        
        float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            
            vec3 i = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            
            i = mod289(i);
            vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
                
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            
            vec4 s0 = floor(b0) * 2.0 + 1.0;
            vec4 s1 = floor(b1) * 2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            
            vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
            
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }
    `,
    quantumField: `
        float quantumFluctuation(vec3 p, float time) {
            float n1 = snoise(p * 0.1 + time * 0.1);
            float n2 = snoise(p * 0.3 - time * 0.2) * 0.5;
            float n3 = snoise(p * 0.7 + time * 0.3) * 0.25;
            return n1 + n2 + n3;
        }
    `,
    glitch: `
        vec3 glitchColor(vec3 color, vec2 uv, float time, float intensity) {
            float glitch = step(0.99, sin(time * 50.0 + uv.y * 100.0)) * intensity;
            vec3 shift = vec3(
                sin(time * 123.45) * glitch,
                sin(time * 234.56) * glitch,
                sin(time * 345.67) * glitch
            );
            return color + shift;
        }
    `
};

function initMasterConvergence() {
    console.log('Initializing Enhanced Master Convergence System...');
    
    const container = document.getElementById('master-convergence-container');
    if (!container) {
        console.error('Master Convergence container not found');
        return;
    }
    
    // Clear and setup
    container.innerHTML = '';
    
    // Initialize core systems
    setupEnhancedScene(container);
    
    // Create all enhanced components
    createQuantumRealityCore();
    createConsciousnessField();
    createMultidimensionalPortals();
    createQuantumEntanglementNetwork();
    createRealityGlitchSystem();
    createConvergenceCore();
    createHolographicInterface();
    createTemporalFluxSystem();
    createCosmicAlignmentMatrix();
    createUnifiedFieldVisualization();
    
    // Advanced UI
    createEnhancedUI();
    
    // Start quantum animation
    animateQuantumConvergence();
}

function setupEnhancedScene(container) {
    const isMobile = window.mobileUtils && window.mobileUtils.isMobile();
    const width = container.clientWidth;
    const height = container.clientHeight || (isMobile ? 400 : 800);
    
    // Scene with quantum field background
    emcScene = new THREE.Scene();
    emcScene.background = new THREE.Color(0x000000);
    emcScene.fog = new THREE.FogExp2(0x000011, 0.0002);
    
    // Enhanced camera
    emcCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 10000);
    emcCamera.position.set(0, 150, 400);
    
    // Quantum-enhanced renderer with mobile optimization
    emcRenderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: isMobile ? "low-power" : "high-performance",
        logarithmicDepthBuffer: true,
        preserveDrawingBuffer: !isMobile
    });
    emcRenderer.setSize(width, height);
    emcRenderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    emcRenderer.shadowMap.enabled = !isMobile;
    emcRenderer.shadowMap.type = isMobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
    emcRenderer.toneMapping = isMobile ? THREE.LinearToneMapping : THREE.ACESFilmicToneMapping;
    emcRenderer.toneMappingExposure = 1.2;
    
    // Apply mobile optimizations
    if (window.mobileUtils) {
        window.mobileUtils.optimizeRenderer(emcRenderer);
    }
    container.appendChild(emcRenderer.domElement);
    
    // Advanced post-processing (disable on mobile for performance)
    if (!isMobile) {
        setupQuantumPostProcessing();
    }
    
    // Controls with mobile support
    emcControls = new THREE.OrbitControls(emcCamera, emcRenderer.domElement);
    emcControls.enableDamping = true;
    emcControls.dampingFactor = 0.05;
    emcControls.minDistance = isMobile ? 150 : 100;
    emcControls.maxDistance = isMobile ? 1500 : 2000;
    emcControls.autoRotate = !isMobile;
    emcControls.autoRotateSpeed = 0.1;
    
    // Add mobile touch controls
    if (window.mobileUtils) {
        window.mobileUtils.addTouchControls(emcControls);
    }
    
    // Raycaster for interactions
    emcRaycaster = new THREE.Raycaster();
    emcMouse = new THREE.Vector2();
    
    // Quantum lighting
    setupQuantumLighting();
    
    // Create quantum environment
    createQuantumEnvironment();
}

function setupQuantumPostProcessing() {
    emcComposer = new THREE.EffectComposer(emcRenderer);
    
    const renderPass = new THREE.RenderPass(emcScene, emcCamera);
    emcComposer.addPass(renderPass);
    
    // Quantum bloom
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        2.0,  // strength
        0.5,  // radius
        0.8   // threshold
    );
    emcComposer.addPass(bloomPass);
    
    // Reality distortion shader
    const distortionShader = {
        uniforms: {
            tDiffuse: { value: null },
            time: { value: 0 },
            distortion: { value: 0.001 },
            glitchIntensity: { value: 0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform float time;
            uniform float distortion;
            uniform float glitchIntensity;
            varying vec2 vUv;
            
            ${shaderChunks.noise}
            
            void main() {
                vec2 uv = vUv;
                
                // Reality warping
                float warp = snoise(vec3(uv * 10.0, time * 0.5)) * distortion;
                uv += vec2(warp);
                
                // Chromatic aberration
                vec3 color;
                color.r = texture2D(tDiffuse, uv + vec2(0.001, 0.0)).r;
                color.g = texture2D(tDiffuse, uv).g;
                color.b = texture2D(tDiffuse, uv - vec2(0.001, 0.0)).b;
                
                // Glitch effects
                if (glitchIntensity > 0.0) {
                    float glitch = step(0.98, sin(time * 50.0 + uv.y * 200.0)) * glitchIntensity;
                    color.rgb = mix(color.rgb, 1.0 - color.rgb, glitch);
                }
                
                // Scan lines
                float scanline = sin(uv.y * 800.0 + time * 5.0) * 0.04;
                color.rgb += scanline;
                
                gl_FragColor = vec4(color, 1.0);
            }
        `
    };
    
    const distortionPass = new THREE.ShaderPass(distortionShader);
    emcComposer.addPass(distortionPass);
    
    // Film grain
    const filmPass = new THREE.FilmPass(0.35, 0.025, 648, false);
    emcComposer.addPass(filmPass);
}

function setupQuantumLighting() {
    // Ambient quantum field
    const ambientLight = new THREE.AmbientLight(0x111133, 0.3);
    emcScene.add(ambientLight);
    
    // Central convergence light
    const convergenceLight = new THREE.PointLight(0x00ffcc, 2, 1000);
    convergenceLight.position.set(0, 0, 0);
    emcScene.add(convergenceLight);
    
    // Consciousness field lights
    const consciousnessColors = [0xff00ff, 0x00ff66, 0xffaa00, 0x00aaff, 0xff0066];
    consciousnessColors.forEach((color, i) => {
        const angle = (i / consciousnessColors.length) * Math.PI * 2;
        const radius = 300;
        const light = new THREE.PointLight(color, 0.5, 400);
        light.position.set(
            Math.cos(angle) * radius,
            100 + Math.sin(i) * 50,
            Math.sin(angle) * radius
        );
        emcScene.add(light);
    });
    
    // Dynamic light probes
    const lightProbe = new THREE.LightProbe();
    emcScene.add(lightProbe);
}

function createQuantumEnvironment() {
    // Quantum foam background
    const foamCount = EMC_CONFIG.quantumFoamDensity;
    const foamGeometry = new THREE.BufferGeometry();
    const foamPositions = new Float32Array(foamCount * 3);
    const foamColors = new Float32Array(foamCount * 3);
    const foamSizes = new Float32Array(foamCount);
    
    for (let i = 0; i < foamCount; i++) {
        const i3 = i * 3;
        const radius = 200 + Math.random() * 800;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        foamPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        foamPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        foamPositions[i3 + 2] = radius * Math.cos(phi);
        
        const intensity = Math.random();
        foamColors[i3] = intensity * 0.3;
        foamColors[i3 + 1] = intensity * 0.5;
        foamColors[i3 + 2] = intensity;
        
        foamSizes[i] = Math.random() * 2;
    }
    
    foamGeometry.setAttribute('position', new THREE.BufferAttribute(foamPositions, 3));
    foamGeometry.setAttribute('color', new THREE.BufferAttribute(foamColors, 3));
    foamGeometry.setAttribute('size', new THREE.BufferAttribute(foamSizes, 1));
    
    const foamMaterial = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    quantumField = new THREE.Points(foamGeometry, foamMaterial);
    quantumField.name = 'QuantumFoam';
    emcScene.add(quantumField);
}

function createQuantumRealityCore() {
    const coreGroup = new THREE.Group();
    coreGroup.name = 'QuantumRealityCore';
    
    // Multi-layered Earth with quantum properties
    const earthGeometry = new THREE.SphereGeometry(EMC_CONFIG.earthRadius, 128, 128);
    
    // Quantum Earth shader
    const quantumEarthMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            quantumCoherence: { value: 0 },
            convergenceLevel: { value: 0 },
            realityStability: { value: 1.0 },
            glitchIntensity: { value: 0 },
            baseColor: { value: new THREE.Color(0x0066ff) },
            quantumColor: { value: new THREE.Color(0x00ffcc) },
            convergenceColor: { value: new THREE.Color(0xff00ff) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec3 vWorldPosition;
            
            uniform float time;
            uniform float quantumCoherence;
            
            ${shaderChunks.noise}
            
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                
                vec3 pos = position;
                
                // Quantum fluctuations
                float quantumNoise = snoise(position * 0.05 + time * 0.1);
                pos += normal * quantumNoise * quantumCoherence * 2.0;
                
                // Reality waves
                float wave = sin(position.y * 10.0 + time * 2.0) * 0.5;
                pos += normal * wave * (1.0 - quantumCoherence);
                
                vec4 worldPos = modelMatrix * vec4(pos, 1.0);
                vWorldPosition = worldPos.xyz;
                
                gl_Position = projectionMatrix * viewMatrix * worldPos;
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float quantumCoherence;
            uniform float convergenceLevel;
            uniform float realityStability;
            uniform float glitchIntensity;
            uniform vec3 baseColor;
            uniform vec3 quantumColor;
            uniform vec3 convergenceColor;
            
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying vec3 vWorldPosition;
            
            ${shaderChunks.noise}
            ${shaderChunks.quantumField}
            ${shaderChunks.glitch}
            
            void main() {
                // Base holographic pattern
                float grid = step(0.98, sin(vUv.x * 100.0)) + step(0.98, sin(vUv.y * 100.0));
                
                // Quantum field visualization
                float quantum = quantumFluctuation(vWorldPosition, time);
                
                // Reality layers
                vec3 realityColor = baseColor;
                realityColor = mix(realityColor, quantumColor, quantumCoherence);
                realityColor = mix(realityColor, convergenceColor, convergenceLevel);
                
                // Holographic interference
                float interference = sin(vUv.x * 200.0 + time * 5.0) * sin(vUv.y * 200.0 - time * 3.0);
                realityColor += vec3(interference * 0.1);
                
                // Grid overlay
                realityColor += vec3(grid * 0.2);
                
                // Quantum foam
                realityColor += vec3(quantum * 0.3 * quantumCoherence);
                
                // Glitch effects
                realityColor = glitchColor(realityColor, vUv, time, glitchIntensity);
                
                // Edge glow
                float fresnel = pow(1.0 - abs(dot(vNormal, normalize(cameraPosition - vWorldPosition))), 2.0);
                realityColor += convergenceColor * fresnel * convergenceLevel;
                
                // Reality stability
                float alpha = mix(0.3, 1.0, realityStability) + fresnel * 0.5;
                
                gl_FragColor = vec4(realityColor, alpha);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    
    const quantumEarth = new THREE.Mesh(earthGeometry, quantumEarthMaterial);
    quantumEarth.name = 'QuantumEarth';
    coreGroup.add(quantumEarth);
    
    // Reality matrix grid
    createRealityMatrix(coreGroup);
    
    // Quantum field lines
    createQuantumFieldLines(coreGroup);
    
    emcScene.add(coreGroup);
    realityMatrix = coreGroup;
}

function createRealityMatrix(parent) {
    // 3D grid representing the fabric of reality
    const gridSize = 20;
    const gridSpacing = 15;
    const gridGeometry = new THREE.BufferGeometry();
    const gridPositions = [];
    const gridColors = [];
    
    for (let x = -gridSize; x <= gridSize; x++) {
        for (let y = -gridSize; y <= gridSize; y++) {
            for (let z = -gridSize; z <= gridSize; z++) {
                if (x % 5 === 0 && y % 5 === 0 && z % 5 === 0) {
                    const pos = new THREE.Vector3(
                        x * gridSpacing,
                        y * gridSpacing,
                        z * gridSpacing
                    );
                    
                    // Only include points outside Earth
                    if (pos.length() > EMC_CONFIG.earthRadius + 20) {
                        gridPositions.push(pos.x, pos.y, pos.z);
                        
                        const intensity = 1.0 - pos.length() / 400;
                        gridColors.push(0, intensity, intensity * 0.8);
                    }
                }
            }
        }
    }
    
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
    gridGeometry.setAttribute('color', new THREE.Float32BufferAttribute(gridColors, 3));
    
    const gridMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });
    
    const realityGrid = new THREE.Points(gridGeometry, gridMaterial);
    realityGrid.name = 'RealityGrid';
    parent.add(realityGrid);
}

function createQuantumFieldLines(parent) {
    // Flowing energy lines through quantum field
    const lineCount = 50;
    
    for (let i = 0; i < lineCount; i++) {
        const curve = new THREE.CatmullRomCurve3(
            Array.from({ length: 5 }, () => {
                const radius = EMC_CONFIG.earthRadius + 50 + Math.random() * 200;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                
                return new THREE.Vector3(
                    radius * Math.sin(phi) * Math.cos(theta),
                    radius * Math.sin(phi) * Math.sin(theta),
                    radius * Math.cos(phi)
                );
            })
        );
        
        const geometry = new THREE.TubeGeometry(curve, 64, 0.5, 8, false);
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        const line = new THREE.Mesh(geometry, material);
        line.userData = { curve: curve, flow: Math.random() };
        parent.add(line);
    }
}

function createConsciousnessField() {
    const consciousnessGroup = new THREE.Group();
    consciousnessGroup.name = 'ConsciousnessField';
    
    // Multi-layered consciousness visualization
    for (let layer = 0; layer < EMC_CONFIG.consciousnessLayers; layer++) {
        const radius = EMC_CONFIG.earthRadius + 50 + layer * 30;
        const geometry = new THREE.SphereGeometry(radius, 64, 64);
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                layer: { value: layer },
                alpha: { value: 0.1 + layer * 0.05 },
                frequency: { value: 7.83 + layer * 1.5 },
                color: { value: new THREE.Color().setHSL(layer / EMC_CONFIG.consciousnessLayers, 1, 0.5) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                uniform float time;
                uniform float frequency;
                
                void main() {
                    vUv = uv;
                    vNormal = normal;
                    
                    vec3 pos = position;
                    float wave = sin(uv.x * frequency + time) * sin(uv.y * frequency - time) * 2.0;
                    pos += normal * wave;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float layer;
                uniform float alpha;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vNormal;
                
                void main() {
                    float pattern = sin(vUv.x * 50.0 + time) * sin(vUv.y * 50.0 - time);
                    vec3 finalColor = color + vec3(pattern * 0.2);
                    
                    float edge = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
                    
                    gl_FragColor = vec4(finalColor, alpha * edge);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const consciousnessLayer = new THREE.Mesh(geometry, material);
        consciousnessLayer.name = `ConsciousnessLayer${layer}`;
        consciousnessGroup.add(consciousnessLayer);
    }
    
    // Consciousness nodes - key awareness points
    createConsciousnessNodes(consciousnessGroup);
    
    emcScene.add(consciousnessGroup);
    consciousnessGrid = consciousnessGroup;
}

function createConsciousnessNodes(parent) {
    const nodeData = [
        { name: 'Gaia Core', lat: 0, lon: 0, type: 'planetary', power: 10 },
        { name: 'Tibetan Vortex', lat: 30, lon: 91, type: 'spiritual', power: 9 },
        { name: 'Sedona Portal', lat: 34.8, lon: -111.8, type: 'vortex', power: 8 },
        { name: 'Stonehenge Matrix', lat: 51.2, lon: -1.8, type: 'ancient', power: 9 },
        { name: 'Giza Pyramid', lat: 30.0, lon: 31.1, type: 'ancient', power: 10 },
        { name: 'Machu Picchu', lat: -13.2, lon: -72.5, type: 'ancient', power: 8 },
        { name: 'Easter Island', lat: -27.1, lon: -109.4, type: 'mystery', power: 7 },
        { name: 'Bermuda Triangle', lat: 25.0, lon: -71.0, type: 'anomaly', power: 9 }
    ];
    
    nodeData.forEach(node => {
        const position = latLonToVector3(node.lat, node.lon, EMC_CONFIG.earthRadius + 30);
        
        // Create consciousness beacon
        const beaconGroup = new THREE.Group();
        
        // Core orb
        const orbGeometry = new THREE.SphereGeometry(5, 32, 32);
        const orbMaterial = new THREE.MeshPhysicalMaterial({
            color: getConsciousnessColor(node.type),
            emissive: getConsciousnessColor(node.type),
            emissiveIntensity: node.power / 10,
            metalness: 0.8,
            roughness: 0.2,
            transmission: 0.5,
            thickness: 1,
            transparent: true,
            opacity: 0.8
        });
        
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        beaconGroup.add(orb);
        
        // Energy rings
        for (let i = 0; i < 3; i++) {
            const ringRadius = 10 + i * 5;
            const ringGeometry = new THREE.TorusGeometry(ringRadius, 0.5, 16, 100);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: getConsciousnessColor(node.type),
                transparent: true,
                opacity: 0.5 - i * 0.1,
                blending: THREE.AdditiveBlending
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            ring.userData = { rotationSpeed: 0.02 * (i + 1) };
            beaconGroup.add(ring);
        }
        
        // Particle field
        const isMobile = window.mobileUtils && window.mobileUtils.isMobile();
        let particleCount = 100 * node.power;
        if (window.mobileUtils) {
            particleCount = window.mobileUtils.optimizeParticles(particleCount);
        }
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const radius = 20 + Math.random() * 30;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            particlePositions[i * 3 + 2] = radius * Math.cos(phi);
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: getConsciousnessColor(node.type),
            size: 1,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        beaconGroup.add(particles);
        
        beaconGroup.position.copy(position);
        beaconGroup.lookAt(0, 0, 0);
        beaconGroup.userData = node;
        
        parent.add(beaconGroup);
        consciousnessNodes.push(beaconGroup);
    });
}

function createMultidimensionalPortals() {
    const portalGroup = new THREE.Group();
    portalGroup.name = 'MultidimensionalPortals';
    
    // Create portals at key dimensional intersection points
    for (let i = 0; i < EMC_CONFIG.portalCount; i++) {
        const angle = (i / EMC_CONFIG.portalCount) * Math.PI * 2;
        const radius = EMC_CONFIG.earthRadius + 100 + Math.sin(i * 0.5) * 50;
        const height = Math.sin(i * 0.7) * 100;
        
        const position = new THREE.Vector3(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );
        
        const portal = createPortal(i, position);
        portalGroup.add(portal);
        portalSystems.push(portal);
    }
    
    emcScene.add(portalGroup);
}

function createPortal(index, position) {
    const portalGroup = new THREE.Group();
    
    // Portal ring geometry
    const ringGeometry = new THREE.TorusGeometry(20, 3, 16, 100);
    
    // Portal shader material
    const portalMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            portalId: { value: index },
            dimension: { value: Math.floor(index / 3) },
            colorShift: { value: new THREE.Color().setHSL(index / EMC_CONFIG.portalCount, 1, 0.5) }
        },
        vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            uniform float time;
            
            void main() {
                vUv = uv;
                vPosition = position;
                
                vec3 pos = position;
                float twist = sin(time + float(gl_VertexID) * 0.1) * 0.1;
                pos.x += twist;
                pos.y += cos(time + float(gl_VertexID) * 0.1) * 0.1;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float portalId;
            uniform float dimension;
            uniform vec3 colorShift;
            
            varying vec2 vUv;
            varying vec3 vPosition;
            
            ${shaderChunks.noise}
            
            void main() {
                // Dimensional rift effect
                float rift = snoise(vPosition * 0.1 + time * 0.5 + portalId);
                
                // Swirling portal colors
                vec3 color1 = colorShift;
                vec3 color2 = vec3(1.0) - colorShift;
                vec3 portalColor = mix(color1, color2, sin(rift * 10.0 + time) * 0.5 + 0.5);
                
                // Energy pulse
                float pulse = sin(time * 3.0 + portalId * 1.5) * 0.5 + 0.5;
                portalColor *= 1.0 + pulse;
                
                // Dimensional bleed
                float bleed = sin(dimension * 2.0 + time) * 0.3;
                portalColor += vec3(bleed, -bleed * 0.5, bleed * 0.8);
                
                gl_FragColor = vec4(portalColor, 0.9);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    
    const portalRing = new THREE.Mesh(ringGeometry, portalMaterial);
    portalGroup.add(portalRing);
    
    // Portal center - event horizon
    const centerGeometry = new THREE.PlaneGeometry(35, 35, 32, 32);
    const centerMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            portalId: { value: index },
            warpFactor: { value: 5.0 }
        },
        vertexShader: `
            varying vec2 vUv;
            uniform float time;
            uniform float warpFactor;
            
            void main() {
                vUv = uv;
                
                vec3 pos = position;
                float dist = length(uv - 0.5);
                float warp = sin(dist * warpFactor - time * 2.0) * (1.0 - dist) * 5.0;
                pos.z += warp;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float portalId;
            varying vec2 vUv;
            
            ${shaderChunks.noise}
            
            void main() {
                vec2 center = vec2(0.5);
                float dist = length(vUv - center);
                
                // Swirling vortex
                vec2 spiral = vUv - center;
                float angle = atan(spiral.y, spiral.x);
                float radius = length(spiral);
                angle += time + radius * 5.0;
                
                vec2 newUv = center + vec2(cos(angle), sin(angle)) * radius;
                
                // Dimensional texture
                float n1 = snoise(vec3(newUv * 10.0, time * 0.5 + portalId));
                float n2 = snoise(vec3(newUv * 20.0, time * 0.3 + portalId * 2.0));
                float n3 = snoise(vec3(newUv * 40.0, time * 0.1 + portalId * 3.0));
                
                vec3 color = vec3(n1, n2, n3);
                color = normalize(color) * 0.8;
                
                // Event horizon fade
                float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const portalCenter = new THREE.Mesh(centerGeometry, centerMaterial);
    portalGroup.add(portalCenter);
    
    // Particle system for portal energy
    const isMobile = window.mobileUtils && window.mobileUtils.isMobile();
    let particleCount = 500;
    if (window.mobileUtils) {
        particleCount = window.mobileUtils.optimizeParticles(particleCount);
    }
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 25;
        
        particlePositions[i * 3] = Math.cos(angle) * radius;
        particlePositions[i * 3 + 1] = Math.sin(angle) * radius;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        
        particleVelocities[i * 3] = (Math.random() - 0.5) * 0.5;
        particleVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
        particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: new THREE.Color().setHSL(index / EMC_CONFIG.portalCount, 1, 0.8),
        size: 2,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.userData = { velocities: particleVelocities };
    portalGroup.add(particles);
    
    portalGroup.position.copy(position);
    portalGroup.lookAt(0, 0, 0);
    portalGroup.userData = { id: index, active: true, connections: [] };
    
    return portalGroup;
}

function createQuantumEntanglementNetwork() {
    // Create quantum entangled pairs between consciousness nodes
    const entanglementGroup = new THREE.Group();
    entanglementGroup.name = 'QuantumEntanglement';
    
    // Create entangled connections
    for (let i = 0; i < consciousnessNodes.length; i++) {
        for (let j = i + 1; j < consciousnessNodes.length; j++) {
            if (Math.random() > 0.6) { // 40% chance of entanglement
                const node1 = consciousnessNodes[i];
                const node2 = consciousnessNodes[j];
                
                const entanglement = createQuantumEntanglement(node1, node2);
                entanglementGroup.add(entanglement);
                quantumEntanglements.push(entanglement);
            }
        }
    }
    
    emcScene.add(entanglementGroup);
}

function createQuantumEntanglement(node1, node2) {
    const curve = new THREE.CatmullRomCurve3([
        node1.position,
        node1.position.clone().lerp(node2.position, 0.3).add(new THREE.Vector3(0, 50, 0)),
        node2.position.clone().lerp(node1.position, 0.3).add(new THREE.Vector3(0, 50, 0)),
        node2.position
    ]);
    
    const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.5, 8, false);
    
    const tubeMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            entanglementStrength: { value: Math.random() * 0.5 + 0.5 }
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
            uniform float entanglementStrength;
            varying vec2 vUv;
            
            void main() {
                // Quantum correlation visualization
                float pulse = sin(vUv.x * 20.0 - time * 5.0) * 0.5 + 0.5;
                vec3 color = mix(
                    vec3(0.0, 1.0, 1.0),
                    vec3(1.0, 0.0, 1.0),
                    pulse
                );
                
                float alpha = entanglementStrength * (0.3 + pulse * 0.3);
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const entanglement = new THREE.Mesh(tubeGeometry, tubeMaterial);
    entanglement.userData = {
        node1: node1,
        node2: node2,
        curve: curve,
        strength: tubeMaterial.uniforms.entanglementStrength.value
    };
    
    return entanglement;
}

function createRealityGlitchSystem() {
    // System for reality anomalies and glitches
    const glitchGroup = new THREE.Group();
    glitchGroup.name = 'RealityGlitches';
    
    // Glitch zones
    const glitchZones = [
        { position: new THREE.Vector3(150, 0, 0), radius: 30, intensity: 0.8 },
        { position: new THREE.Vector3(-100, 100, -100), radius: 25, intensity: 0.6 },
        { position: new THREE.Vector3(0, -150, 100), radius: 35, intensity: 0.9 }
    ];
    
    glitchZones.forEach((zone, index) => {
        const glitch = createGlitchZone(zone, index);
        glitchGroup.add(glitch);
        realityGlitches.push(glitch);
    });
    
    emcScene.add(glitchGroup);
}

function createGlitchZone(zone, index) {
    const glitchGroup = new THREE.Group();
    
    // Distortion field
    const fieldGeometry = new THREE.IcosahedronGeometry(zone.radius, 3);
    const fieldMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            glitchIntensity: { value: zone.intensity },
            glitchId: { value: index }
        },
        vertexShader: `
            varying vec3 vPosition;
            uniform float time;
            uniform float glitchIntensity;
            
            ${shaderChunks.noise}
            
            void main() {
                vPosition = position;
                
                vec3 pos = position;
                float distortion = snoise(position * 0.1 + time) * glitchIntensity * 10.0;
                pos += normalize(position) * distortion;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float glitchIntensity;
            uniform float glitchId;
            varying vec3 vPosition;
            
            ${shaderChunks.noise}
            
            void main() {
                // Glitch patterns
                float n = snoise(vPosition * 0.05 + time + glitchId);
                
                vec3 color;
                if (n > 0.5) {
                    color = vec3(1.0, 0.0, 0.0);
                } else if (n > 0.0) {
                    color = vec3(0.0, 1.0, 0.0);
                } else if (n > -0.5) {
                    color = vec3(0.0, 0.0, 1.0);
                } else {
                    color = vec3(1.0, 1.0, 1.0);
                }
                
                // Digital artifacts
                float artifact = step(0.98, sin(vPosition.x * 50.0) * sin(vPosition.y * 50.0));
                color = mix(color, vec3(1.0) - color, artifact);
                
                float alpha = glitchIntensity * (0.2 + abs(n) * 0.3);
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        wireframe: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const distortionField = new THREE.Mesh(fieldGeometry, fieldMaterial);
    glitchGroup.add(distortionField);
    
    // Glitch particles
    const isMobile = window.mobileUtils && window.mobileUtils.isMobile();
    let particleCount = 200;
    if (window.mobileUtils) {
        particleCount = window.mobileUtils.optimizeParticles(particleCount);
    }
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = zone.radius * (0.5 + Math.random() * 0.5);
        
        particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: 0xff0066,
        size: 3,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    glitchGroup.add(particles);
    
    glitchGroup.position.copy(zone.position);
    glitchGroup.userData = zone;
    
    return glitchGroup;
}

function createConvergenceCore() {
    // Central convergence point where all systems meet
    const coreGroup = new THREE.Group();
    coreGroup.name = 'ConvergenceCore';
    
    // Multi-layered core structure
    const layers = [
        { radius: 10, color: 0x00ffcc, opacity: 0.8 },
        { radius: 15, color: 0xff00ff, opacity: 0.6 },
        { radius: 20, color: 0xffaa00, opacity: 0.4 },
        { radius: 25, color: 0x00aaff, opacity: 0.2 }
    ];
    
    layers.forEach((layer, index) => {
        const geometry = new THREE.IcosahedronGeometry(layer.radius, 4);
        const material = new THREE.MeshPhysicalMaterial({
            color: layer.color,
            emissive: layer.color,
            emissiveIntensity: 0.5,
            metalness: 0.9,
            roughness: 0.1,
            transmission: 0.8,
            thickness: 1,
            transparent: true,
            opacity: layer.opacity,
            side: THREE.DoubleSide
        });
        
        const coreMesh = new THREE.Mesh(geometry, material);
        coreMesh.userData = { rotationSpeed: 0.01 * (index + 1) };
        coreGroup.add(coreMesh);
    });
    
    // Convergence field
    const fieldGeometry = new THREE.SphereGeometry(30, 32, 32);
    const fieldMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            convergenceLevel: { value: 0 }
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            uniform float time;
            uniform float convergenceLevel;
            
            void main() {
                vNormal = normal;
                vPosition = position;
                
                vec3 pos = position;
                float pulse = sin(time * 2.0) * convergenceLevel * 2.0;
                pos *= 1.0 + pulse * 0.1;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float convergenceLevel;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
                
                vec3 color = mix(
                    vec3(0.0, 1.0, 0.8),
                    vec3(1.0, 0.0, 1.0),
                    convergenceLevel
                );
                
                float alpha = fresnel * convergenceLevel;
                
                gl_FragColor = vec4(color, alpha);
            }
        `,
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const convergenceField = new THREE.Mesh(fieldGeometry, fieldMaterial);
    coreGroup.add(convergenceField);
    
    emcScene.add(coreGroup);
    convergenceCore = coreGroup;
}

function createHolographicInterface() {
    // 3D holographic UI elements floating in space
    const interfaceGroup = new THREE.Group();
    interfaceGroup.name = 'HolographicInterface';
    
    // Data panels
    const panelPositions = [
        new THREE.Vector3(200, 100, 0),
        new THREE.Vector3(-200, 100, 0),
        new THREE.Vector3(0, 100, 200),
        new THREE.Vector3(0, 100, -200)
    ];
    
    panelPositions.forEach((pos, index) => {
        const panel = createHolographicPanel(index);
        panel.position.copy(pos);
        panel.lookAt(0, 0, 0);
        interfaceGroup.add(panel);
    });
    
    emcScene.add(interfaceGroup);
}

function createHolographicPanel(index) {
    const panelGroup = new THREE.Group();
    
    // Panel frame
    const frameGeometry = new THREE.BoxGeometry(80, 60, 1);
    const frameMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.2,
        wireframe: true
    });
    
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    panelGroup.add(frame);
    
    // Data display
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    
    // Initial data render
    updatePanelData(ctx, index);
    
    const texture = new THREE.CanvasTexture(canvas);
    const displayMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    
    const displayGeometry = new THREE.PlaneGeometry(75, 55);
    const display = new THREE.Mesh(displayGeometry, displayMaterial);
    display.userData = { canvas: canvas, context: ctx, texture: texture, panelId: index };
    panelGroup.add(display);
    
    return panelGroup;
}

function updatePanelData(ctx, panelId) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, 512, 384);
    
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 492, 364);
    
    ctx.font = '24px monospace';
    ctx.fillStyle = '#00ffcc';
    
    const titles = [
        'QUANTUM COHERENCE',
        'CONSCIOUSNESS FIELD',
        'PORTAL NETWORK',
        'CONVERGENCE MATRIX'
    ];
    
    ctx.fillText(titles[panelId], 20, 40);
    
    // Draw data visualization
    ctx.strokeStyle = '#00ffcc';
    ctx.beginPath();
    for (let i = 0; i < 100; i++) {
        const x = 20 + i * 4.7;
        const y = 200 + Math.sin(i * 0.1 + Date.now() * 0.001) * 50;
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Data readouts
    ctx.font = '16px monospace';
    ctx.fillStyle = '#00ffcc';
    const data = [
        `Level: ${(emcQuantumCoherence * 100).toFixed(1)}%`,
        `Nodes: ${consciousnessNodes.length}`,
        `Active: ${portalSystems.filter(p => p.userData.active).length}`,
        `Status: ${emcConvergenceLevel > 0.9 ? 'CRITICAL' : 'NOMINAL'}`
    ];
    
    ctx.fillText(data[panelId], 20, 350);
}

function createTemporalFluxSystem() {
    // Time manipulation visualization
    const temporalGroup = new THREE.Group();
    temporalGroup.name = 'TemporalFlux';
    
    // Time streams
    const streamCount = 20;
    for (let i = 0; i < streamCount; i++) {
        const streamGeometry = new THREE.BufferGeometry();
        const streamPositions = [];
        
        const baseRadius = EMC_CONFIG.earthRadius + 150;
        const streamLength = 300;
        
        for (let j = 0; j < 100; j++) {
            const t = j / 100;
            const angle = (i / streamCount) * Math.PI * 2;
            
            const x = Math.cos(angle) * baseRadius;
            const y = -streamLength / 2 + t * streamLength;
            const z = Math.sin(angle) * baseRadius;
            
            streamPositions.push(x, y, z);
        }
        
        streamGeometry.setAttribute('position', new THREE.Float32BufferAttribute(streamPositions, 3));
        
        const streamMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color().setHSL(i / streamCount, 1, 0.5),
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });
        
        const stream = new THREE.Line(streamGeometry, streamMaterial);
        stream.userData = { phase: i / streamCount };
        temporalGroup.add(stream);
    }
    
    emcScene.add(temporalGroup);
}

function createCosmicAlignmentMatrix() {
    // Galactic alignment visualization
    const alignmentGroup = new THREE.Group();
    alignmentGroup.name = 'CosmicAlignment';
    
    // Galactic plane
    const planeGeometry = new THREE.RingGeometry(1000, 2000, 64, 8);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x4444ff,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    
    const galacticPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    galacticPlane.rotation.x = Math.PI / 2;
    alignmentGroup.add(galacticPlane);
    
    // Star connections
    const starPositions = [
        new THREE.Vector3(800, 200, -600),
        new THREE.Vector3(-700, 300, -800),
        new THREE.Vector3(900, -100, 700),
        new THREE.Vector3(-600, -200, 900)
    ];
    
    starPositions.forEach((pos, index) => {
        // Star
        const starGeometry = new THREE.OctahedronGeometry(20, 2);
        const starMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(index / starPositions.length, 0.8, 0.7),
            emissive: new THREE.Color().setHSL(index / starPositions.length, 0.8, 0.7),
            emissiveIntensity: 1
        });
        
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.copy(pos);
        alignmentGroup.add(star);
        
        // Connection beam to Earth
        const beamGeometry = new THREE.CylinderGeometry(1, 5, pos.length(), 8);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: starMaterial.color,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.position.set(pos.x / 2, pos.y / 2, pos.z / 2);
        beam.lookAt(0, 0, 0);
        beam.rotateX(Math.PI / 2);
        alignmentGroup.add(beam);
    });
    
    emcScene.add(alignmentGroup);
}

function createUnifiedFieldVisualization() {
    // Unified field that connects all systems
    const fieldGroup = new THREE.Group();
    fieldGroup.name = 'UnifiedField';
    
    // Field geometry - complex 3D grid
    const fieldSize = 1000;
    const fieldResolution = 50;
    const fieldGeometry = new THREE.BufferGeometry();
    const fieldPositions = [];
    const fieldColors = [];
    
    for (let i = 0; i < fieldResolution; i++) {
        for (let j = 0; j < fieldResolution; j++) {
            const x = (i / fieldResolution - 0.5) * fieldSize;
            const z = (j / fieldResolution - 0.5) * fieldSize;
            
            // Create vertical lines
            for (let k = 0; k < 10; k++) {
                const y = (k / 10 - 0.5) * 300;
                fieldPositions.push(x, y, z);
                
                const intensity = Math.sqrt(x * x + z * z) / fieldSize;
                fieldColors.push(intensity, 1 - intensity, 0.5);
            }
        }
    }
    
    fieldGeometry.setAttribute('position', new THREE.Float32BufferAttribute(fieldPositions, 3));
    fieldGeometry.setAttribute('color', new THREE.Float32BufferAttribute(fieldColors, 3));
    
    const fieldMaterial = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    
    const unifiedField = new THREE.Points(fieldGeometry, fieldMaterial);
    fieldGroup.add(unifiedField);
    
    emcScene.add(fieldGroup);
}

function createEnhancedUI() {
    const uiHTML = `
        <div id="emc-ui" style="position: absolute; top: 20px; left: 20px; max-width: 400px; background: rgba(0,0,0,0.8); padding: 20px; border: 2px solid #00ffcc; font-family: 'Courier New', monospace; color: #00ffcc; backdrop-filter: blur(10px);">
            <h2 style="margin-top: 0; text-shadow: 0 0 20px #00ffcc; font-size: 24px;">QUANTUM CONVERGENCE MATRIX</h2>
            
            <div class="emc-status" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0;">
                <div class="status-item">
                    <label style="font-size: 12px; color: #888;">CONVERGENCE</label>
                    <div id="convergence-meter" style="font-size: 24px; font-weight: bold;">87.3%</div>
                </div>
                <div class="status-item">
                    <label style="font-size: 12px; color: #888;">QUANTUM COHERENCE</label>
                    <div id="coherence-meter" style="font-size: 24px; font-weight: bold;">0.0%</div>
                </div>
                <div class="status-item">
                    <label style="font-size: 12px; color: #888;">REALITY STABILITY</label>
                    <div id="stability-meter" style="font-size: 24px; font-weight: bold;">100%</div>
                </div>
                <div class="status-item">
                    <label style="font-size: 12px; color: #888;">PORTAL NETWORK</label>
                    <div id="portal-status" style="font-size: 24px; font-weight: bold;">ACTIVE</div>
                </div>
            </div>
            
            <div class="emc-controls" style="margin: 20px 0;">
                <h3 style="font-size: 16px; margin-bottom: 10px;">SYSTEM CONTROL</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
                    <button class="emc-btn" onclick="toggleQuantumField()">Quantum Field</button>
                    <button class="emc-btn" onclick="toggleConsciousness()">Consciousness</button>
                    <button class="emc-btn" onclick="togglePortals()">Portal Network</button>
                    <button class="emc-btn" onclick="toggleEntanglement()">Entanglement</button>
                    <button class="emc-btn" onclick="toggleGlitches()">Reality Glitches</button>
                    <button class="emc-btn" onclick="toggleTemporal()">Temporal Flux</button>
                    <button class="emc-btn" onclick="activateConvergence()">INITIATE CONVERGENCE</button>
                    <button class="emc-btn critical" onclick="emergencyShutdown()">EMERGENCY SHUTDOWN</button>
                </div>
            </div>
            
            <div class="emc-readout" style="margin: 20px 0; font-size: 12px; font-family: monospace;">
                <div id="quantum-readout" style="color: #0ff; margin: 5px 0;">QUANTUM FIELD: STABLE</div>
                <div id="consciousness-readout" style="color: #f0f; margin: 5px 0;">CONSCIOUSNESS GRID: ONLINE</div>
                <div id="portal-readout" style="color: #ff0; margin: 5px 0;">PORTALS: 13/13 ACTIVE</div>
                <div id="timeline-readout" style="color: #0f0; margin: 5px 0;">TIMELINE: PRESENT [2025.01]</div>
            </div>
            
            <div class="emc-warning" id="warning-panel" style="margin: 20px 0; padding: 10px; border: 1px solid #ff0066; background: rgba(255, 0, 102, 0.1); display: none;">
                <strong style="color: #ff0066;">⚠️ WARNING</strong>
                <div id="warning-text" style="color: #ff6666; font-size: 12px; margin-top: 5px;"></div>
            </div>
        </div>
        
        <div id="emc-visualization" style="position: absolute; bottom: 20px; right: 20px; width: 300px; height: 200px; background: rgba(0,0,0,0.8); border: 1px solid #00ffcc; padding: 10px;">
            <canvas id="waveform-canvas" style="width: 100%; height: 100%;"></canvas>
        </div>
        
        <style>
            .emc-btn {
                background: rgba(0, 255, 204, 0.1);
                border: 1px solid #00ffcc;
                color: #00ffcc;
                padding: 8px 12px;
                cursor: pointer;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                transition: all 0.3s;
                text-transform: uppercase;
            }
            .emc-btn:hover {
                background: rgba(0, 255, 204, 0.3);
                box-shadow: 0 0 20px #00ffcc;
                transform: translateY(-2px);
            }
            .emc-btn.critical {
                border-color: #ff0066;
                color: #ff0066;
                background: rgba(255, 0, 102, 0.1);
            }
            .emc-btn.critical:hover {
                background: rgba(255, 0, 102, 0.3);
                box-shadow: 0 0 20px #ff0066;
            }
            .status-item {
                text-align: center;
                padding: 10px;
                background: rgba(0, 255, 204, 0.05);
                border: 1px solid rgba(0, 255, 204, 0.2);
                border-radius: 5px;
            }
            #emc-ui * {
                user-select: none;
            }
        </style>
    `;
    
    const container = document.getElementById('master-convergence-container');
    container.insertAdjacentHTML('beforeend', uiHTML);
    
    // Initialize waveform visualization
    initializeWaveformVisualizer();
    
    // Setup UI interactions
    setupEnhancedUIEvents();
}

function initializeWaveformVisualizer() {
    const canvas = document.getElementById('waveform-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 280;
    canvas.height = 180;
    
    // This will be animated in the main loop
    canvas.userData = { ctx: ctx };
}

function setupEnhancedUIEvents() {
    // Mouse interactions
    emcRenderer.domElement.addEventListener('mousemove', onEnhancedMouseMove);
    emcRenderer.domElement.addEventListener('click', onEnhancedClick);
    
    // Touch support
    emcRenderer.domElement.addEventListener('touchstart', onEnhancedTouch);
    emcRenderer.domElement.addEventListener('touchmove', onEnhancedTouch);
}

function onEnhancedMouseMove(event) {
    const rect = emcRenderer.domElement.getBoundingClientRect();
    emcMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    emcMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Update quantum field based on mouse
    updateQuantumFieldInteraction();
}

function onEnhancedClick(event) {
    emcRaycaster.setFromCamera(emcMouse, emcCamera);
    
    // Check for consciousness node clicks
    const nodeIntersects = emcRaycaster.intersectObjects(consciousnessNodes, true);
    if (nodeIntersects.length > 0) {
        const node = nodeIntersects[0].object.parent;
        activateConsciousnessNode(node);
    }
    
    // Check for portal clicks
    const portalIntersects = emcRaycaster.intersectObjects(portalSystems, true);
    if (portalIntersects.length > 0) {
        const portal = portalIntersects[0].object.parent;
        togglePortalState(portal);
    }
}

function onEnhancedTouch(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const rect = emcRenderer.domElement.getBoundingClientRect();
    emcMouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
    emcMouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
}

// Control functions
window.toggleQuantumField = function() {
    quantumField.visible = !quantumField.visible;
    updateReadout('quantum', quantumField.visible ? 'STABLE' : 'OFFLINE');
};

window.toggleConsciousness = function() {
    consciousnessGrid.visible = !consciousnessGrid.visible;
    updateReadout('consciousness', consciousnessGrid.visible ? 'ONLINE' : 'OFFLINE');
};

window.togglePortals = function() {
    const portalGroup = emcScene.getObjectByName('MultidimensionalPortals');
    portalGroup.visible = !portalGroup.visible;
    updateReadout('portal', portalGroup.visible ? '13/13 ACTIVE' : 'NETWORK OFFLINE');
};

window.toggleEntanglement = function() {
    const entanglementGroup = emcScene.getObjectByName('QuantumEntanglement');
    entanglementGroup.visible = !entanglementGroup.visible;
};

window.toggleGlitches = function() {
    const glitchGroup = emcScene.getObjectByName('RealityGlitches');
    glitchGroup.visible = !glitchGroup.visible;
};

window.toggleTemporal = function() {
    const temporalGroup = emcScene.getObjectByName('TemporalFlux');
    temporalGroup.visible = !temporalGroup.visible;
};

window.activateConvergence = function() {
    emcConvergenceLevel = Math.min(1.0, emcConvergenceLevel + 0.1);
    showWarning('CONVERGENCE ACCELERATION INITIATED');
};

window.emergencyShutdown = function() {
    emcConvergenceLevel = 0;
    emcQuantumCoherence = 0;
    emcRealityStability = 1.0;
    showWarning('EMERGENCY SHUTDOWN ACTIVATED', true);
    
    // Visual shutdown effect
    emcComposer.passes.forEach(pass => {
        if (pass.uniforms && pass.uniforms.glitchIntensity) {
            pass.uniforms.glitchIntensity.value = 1.0;
        }
    });
    
    setTimeout(() => {
        emcComposer.passes.forEach(pass => {
            if (pass.uniforms && pass.uniforms.glitchIntensity) {
                pass.uniforms.glitchIntensity.value = 0;
            }
        });
    }, 1000);
};

function updateReadout(system, status) {
    const element = document.getElementById(`${system}-readout`);
    if (element) {
        element.textContent = `${system.toUpperCase()}: ${status}`;
    }
}

function showWarning(message, critical = false) {
    const panel = document.getElementById('warning-panel');
    const text = document.getElementById('warning-text');
    
    panel.style.display = 'block';
    text.textContent = message;
    
    if (critical) {
        panel.style.borderColor = '#ff0066';
        panel.style.background = 'rgba(255, 0, 102, 0.2)';
    } else {
        panel.style.borderColor = '#ffaa00';
        panel.style.background = 'rgba(255, 170, 0, 0.1)';
    }
    
    setTimeout(() => {
        panel.style.display = 'none';
    }, 5000);
}

function activateConsciousnessNode(node) {
    // Pulse effect
    const scale = node.scale.x;
    node.scale.setScalar(scale * 1.5);
    
    setTimeout(() => {
        node.scale.setScalar(scale);
    }, 500);
    
    // Create energy burst
    createEnergyBurst(node.position);
    
    // Update coherence
    emcQuantumCoherence = Math.min(1.0, emcQuantumCoherence + 0.05);
}

function togglePortalState(portal) {
    portal.userData.active = !portal.userData.active;
    
    // Visual feedback
    portal.traverse(child => {
        if (child.material) {
            child.material.opacity = portal.userData.active ? 0.9 : 0.2;
        }
    });
}

function createEnergyBurst(position) {
    const burstGeometry = new THREE.SphereGeometry(5, 32, 32);
    const burstMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
    });
    
    const burst = new THREE.Mesh(burstGeometry, burstMaterial);
    burst.position.copy(position);
    emcScene.add(burst);
    
    // Animate burst
    const startTime = Date.now();
    const animateBurst = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const scale = 1 + elapsed * 10;
        burst.scale.setScalar(scale);
        burst.material.opacity = Math.max(0, 1 - elapsed);
        
        if (elapsed < 1) {
            requestAnimationFrame(animateBurst);
        } else {
            emcScene.remove(burst);
            burst.geometry.dispose();
            burst.material.dispose();
        }
    };
    
    animateBurst();
}

function updateQuantumFieldInteraction() {
    // Make quantum field respond to mouse position
    const positions = quantumField.geometry.attributes.position.array;
    const basePositions = quantumField.geometry.userData.basePositions;
    
    if (!basePositions) {
        // Store original positions
        quantumField.geometry.userData.basePositions = new Float32Array(positions);
        return;
    }
    
    // Apply attraction/repulsion based on mouse
    for (let i = 0; i < positions.length; i += 3) {
        const x = basePositions[i];
        const y = basePositions[i + 1];
        const z = basePositions[i + 2];
        
        const worldPos = new THREE.Vector3(x, y, z);
        worldPos.project(emcCamera);
        
        const dist = worldPos.distanceTo(new THREE.Vector3(emcMouse.x, emcMouse.y, worldPos.z));
        
        if (dist < 0.2) {
            const force = (0.2 - dist) * 10;
            positions[i] = x + (worldPos.x - emcMouse.x) * force;
            positions[i + 1] = y + (worldPos.y - emcMouse.y) * force;
            positions[i + 2] = z;
        } else {
            positions[i] = x;
            positions[i + 1] = y;
            positions[i + 2] = z;
        }
    }
    
    quantumField.geometry.attributes.position.needsUpdate = true;
}

// Animation loop
function animateQuantumConvergence() {
    emcAnimationId = requestAnimationFrame(animateQuantumConvergence);
    
    // Update time
    emcTime += 0.01;
    
    // Update controls
    emcControls.update();
    
    // Update quantum systems
    updateQuantumCore();
    updateConsciousnessField();
    updatePortalSystems();
    updateQuantumEntanglements();
    updateRealityGlitches();
    updateConvergenceCore();
    updateTemporalFlux();
    updateCosmicAlignment();
    updateHolographicInterface();
    
    // Update physics
    updateQuantumCoherence();
    updateConvergenceLevel();
    updateRealityStability();
    
    // Update UI
    updateUIMeters();
    updateWaveformVisualizer();
    
    // Check for critical events
    checkConvergenceThreshold();
    
    // Render
    emcComposer.render();
}

function updateQuantumCore() {
    // Update quantum Earth
    const earth = realityMatrix.children[0];
    if (earth && earth.material.uniforms) {
        earth.material.uniforms.time.value = emcTime;
        earth.material.uniforms.quantumCoherence.value = emcQuantumCoherence;
        earth.material.uniforms.convergenceLevel.value = emcConvergenceLevel;
        earth.material.uniforms.realityStability.value = emcRealityStability;
        earth.material.uniforms.glitchIntensity.value = emcRealityStability < 0.5 ? 1 - emcRealityStability : 0;
    }
    
    // Rotate reality matrix
    realityMatrix.rotation.y += 0.0005;
    
    // Update reality grid
    const grid = realityMatrix.getObjectByName('RealityGrid');
    if (grid) {
        grid.rotation.x += 0.001;
        grid.rotation.z += 0.0005;
    }
}

function updateConsciousnessField() {
    // Update consciousness layers
    consciousnessGrid.children.forEach((layer, index) => {
        if (layer.material && layer.material.uniforms) {
            layer.material.uniforms.time.value = emcTime;
            layer.rotation.y += 0.001 * (index + 1);
        }
    });
    
    // Update consciousness nodes
    consciousnessNodes.forEach((node, index) => {
        // Pulse effect
        const scale = 1 + Math.sin(emcTime * 2 + index) * 0.1;
        node.scale.setScalar(scale);
        
        // Rotate rings
        node.children.forEach(child => {
            if (child.userData.rotationSpeed) {
                child.rotation.z += child.userData.rotationSpeed;
            }
        });
        
        // Update particles
        const particles = node.children.find(child => child.type === 'Points');
        if (particles) {
            particles.rotation.y += 0.01;
        }
    });
}

function updatePortalSystems() {
    portalSystems.forEach((portal, index) => {
        if (!portal.userData.active) return;
        
        // Update portal shaders
        portal.children.forEach(child => {
            if (child.material && child.material.uniforms) {
                child.material.uniforms.time.value = emcTime;
            }
        });
        
        // Rotate portal ring
        const ring = portal.children[0];
        if (ring) {
            ring.rotation.x += 0.01;
            ring.rotation.y += 0.02;
        }
        
        // Update particles
        const particles = portal.children.find(child => child.type === 'Points');
        if (particles && particles.userData.velocities) {
            const positions = particles.geometry.attributes.position.array;
            const velocities = particles.userData.velocities;
            
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];
                
                // Spiral motion
                const r = Math.sqrt(positions[i] * positions[i] + positions[i + 1] * positions[i + 1]);
                if (r > 25 || r < 1) {
                    // Reset particle
                    const angle = Math.random() * Math.PI * 2;
                    positions[i] = Math.cos(angle) * 20;
                    positions[i + 1] = Math.sin(angle) * 20;
                    positions[i + 2] = (Math.random() - 0.5) * 10;
                }
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
        }
    });
}

function updateQuantumEntanglements() {
    quantumEntanglements.forEach(entanglement => {
        if (entanglement.material && entanglement.material.uniforms) {
            entanglement.material.uniforms.time.value = emcTime;
            
            // Pulse based on quantum coherence
            const strength = entanglement.userData.strength;
            entanglement.material.uniforms.entanglementStrength.value = 
                strength * (0.5 + emcQuantumCoherence * 0.5);
        }
    });
}

function updateRealityGlitches() {
    realityGlitches.forEach((glitch, index) => {
        // Update glitch shaders
        glitch.children.forEach(child => {
            if (child.material && child.material.uniforms) {
                child.material.uniforms.time.value = emcTime;
                
                // Increase glitch intensity as reality stability decreases
                child.material.uniforms.glitchIntensity.value = 
                    glitch.userData.intensity * (1 - emcRealityStability);
            }
        });
        
        // Rotate and scale based on instability
        glitch.rotation.x += 0.01 * (2 - emcRealityStability);
        glitch.rotation.y += 0.02 * (2 - emcRealityStability);
        
        const scale = 1 + (1 - emcRealityStability) * Math.sin(emcTime * 10 + index);
        glitch.scale.setScalar(scale);
    });
}

function updateConvergenceCore() {
    // Update core layers
    convergenceCore.children.forEach((layer, index) => {
        if (layer.userData.rotationSpeed) {
            layer.rotation.x += layer.userData.rotationSpeed;
            layer.rotation.y += layer.userData.rotationSpeed * 1.5;
            layer.rotation.z += layer.userData.rotationSpeed * 0.5;
        }
        
        // Pulse based on convergence level
        if (layer.material && layer.material.emissiveIntensity !== undefined) {
            layer.material.emissiveIntensity = 0.5 + emcConvergenceLevel * 0.5;
        }
    });
    
    // Update convergence field
    const field = convergenceCore.children.find(child => 
        child.material && child.material.uniforms
    );
    if (field) {
        field.material.uniforms.time.value = emcTime;
        field.material.uniforms.convergenceLevel.value = emcConvergenceLevel;
    }
}

function updateTemporalFlux() {
    const temporalGroup = emcScene.getObjectByName('TemporalFlux');
    if (!temporalGroup) return;
    
    temporalGroup.children.forEach((stream, index) => {
        if (stream.userData.phase !== undefined) {
            // Wave motion through time streams
            const positions = stream.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                const t = i / positions.length;
                const wave = Math.sin(t * 10 + emcTime * 2 + stream.userData.phase * Math.PI * 2) * 10;
                positions[i + 1] += wave * 0.01;
            }
            stream.geometry.attributes.position.needsUpdate = true;
        }
    });
}

function updateCosmicAlignment() {
    const alignmentGroup = emcScene.getObjectByName('CosmicAlignment');
    if (!alignmentGroup) return;
    
    // Rotate galactic plane
    const plane = alignmentGroup.children[0];
    if (plane) {
        plane.rotation.z += 0.0001;
    }
    
    // Pulse star connections
    alignmentGroup.children.forEach(child => {
        if (child.material && child.material.opacity !== undefined) {
            child.material.opacity = 0.3 + Math.sin(emcTime * 0.5) * 0.2;
        }
    });
}

function updateHolographicInterface() {
    const interfaceGroup = emcScene.getObjectByName('HolographicInterface');
    if (!interfaceGroup) return;
    
    // Update panel data
    interfaceGroup.children.forEach(panel => {
        const display = panel.children.find(child => 
            child.userData.canvas && child.userData.context
        );
        
        if (display && Math.random() < 0.1) { // Update 10% of frames
            updatePanelData(display.userData.context, display.userData.panelId);
            display.userData.texture.needsUpdate = true;
        }
        
        // Slight floating motion
        panel.position.y += Math.sin(emcTime + panel.position.x * 0.01) * 0.1;
    });
}

function updateQuantumCoherence() {
    // Natural decay
    emcQuantumCoherence *= 0.995;
    
    // Boost from active consciousness nodes
    const activeNodes = consciousnessNodes.filter(node => 
        node.scale.x > 1.1
    ).length;
    emcQuantumCoherence += activeNodes * 0.001;
    
    // Cap at 1.0
    emcQuantumCoherence = Math.min(1.0, emcQuantumCoherence);
}

function updateConvergenceLevel() {
    // Natural progression based on quantum coherence
    if (emcQuantumCoherence > 0.5) {
        emcConvergenceLevel += 0.0001;
    }
    
    // Boost from portal network
    const activePortals = portalSystems.filter(p => p.userData.active).length;
    emcConvergenceLevel += activePortals * 0.00001;
    
    // Cap at 1.0
    emcConvergenceLevel = Math.min(1.0, emcConvergenceLevel);
}

function updateRealityStability() {
    // Stability decreases as convergence increases
    emcRealityStability = 1.0 - (emcConvergenceLevel * 0.5);
    
    // Random glitches
    if (Math.random() < EMC_CONFIG.glitchProbability * (1 - emcRealityStability)) {
        emcRealityStability -= 0.1;
        showWarning('REALITY DISTORTION DETECTED');
    }
    
    // Recover slowly
    emcRealityStability += 0.001;
    
    // Clamp between 0 and 1
    emcRealityStability = Math.max(0, Math.min(1, emcRealityStability));
    
    // Update post-processing
    if (emcComposer.passes[2] && emcComposer.passes[2].uniforms) {
        emcComposer.passes[2].uniforms.distortion.value = 0.001 + (1 - emcRealityStability) * 0.01;
        emcComposer.passes[2].uniforms.glitchIntensity.value = emcRealityStability < 0.3 ? 0.5 : 0;
    }
}

function updateUIMeters() {
    document.getElementById('convergence-meter').textContent = 
        `${(emcConvergenceLevel * 100).toFixed(1)}%`;
    document.getElementById('coherence-meter').textContent = 
        `${(emcQuantumCoherence * 100).toFixed(1)}%`;
    document.getElementById('stability-meter').textContent = 
        `${(emcRealityStability * 100).toFixed(0)}%`;
    
    // Color coding based on values
    const convergenceElement = document.getElementById('convergence-meter');
    if (emcConvergenceLevel > 0.9) {
        convergenceElement.style.color = '#ff0066';
        convergenceElement.style.textShadow = '0 0 10px #ff0066';
    } else if (emcConvergenceLevel > 0.8) {
        convergenceElement.style.color = '#ffaa00';
    } else {
        convergenceElement.style.color = '#00ffcc';
    }
    
    const stabilityElement = document.getElementById('stability-meter');
    if (emcRealityStability < 0.3) {
        stabilityElement.style.color = '#ff0066';
        stabilityElement.style.textShadow = '0 0 10px #ff0066';
    } else if (emcRealityStability < 0.5) {
        stabilityElement.style.color = '#ffaa00';
    } else {
        stabilityElement.style.color = '#00ff66';
    }
}

function updateWaveformVisualizer() {
    const canvas = document.getElementById('waveform-canvas');
    if (!canvas || !canvas.userData) return;
    
    const ctx = canvas.userData.ctx;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Draw waveforms
    const waveforms = [
        { freq: 7.83, amp: 30, color: '#00ffcc', offset: 0 },
        { freq: 14.1, amp: 20, color: '#ff00ff', offset: 1 },
        { freq: 20.3, amp: 15, color: '#ffaa00', offset: 2 }
    ];
    
    waveforms.forEach(wave => {
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let x = 0; x < width; x++) {
            const t = x / width;
            const y = height / 2 + 
                Math.sin(t * wave.freq + emcTime * 2 + wave.offset) * wave.amp * emcQuantumCoherence;
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        
        ctx.stroke();
    });
    
    // Draw convergence indicator
    const convergenceX = width * emcConvergenceLevel;
    ctx.strokeStyle = '#ff0066';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(convergenceX, 0);
    ctx.lineTo(convergenceX, height);
    ctx.stroke();
}

function checkConvergenceThreshold() {
    if (emcConvergenceLevel > EMC_CONFIG.convergenceThreshold && !convergenceCore.userData.critical) {
        convergenceCore.userData.critical = true;
        showWarning('CONVERGENCE THRESHOLD EXCEEDED - REALITY MATRIX UNSTABLE', true);
        
        // Trigger visual effects
        emcScene.fog.density = 0.001;
        
        // Accelerate all systems
        consciousnessNodes.forEach(node => {
            node.scale.setScalar(1.5);
        });
        
        portalSystems.forEach(portal => {
            portal.userData.active = true;
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

function getConsciousnessColor(type) {
    const colors = {
        planetary: 0x00ff66,
        spiritual: 0xff00ff,
        vortex: 0x00ccff,
        ancient: 0xffaa00,
        mystery: 0xff0066,
        anomaly: 0xff0000
    };
    return colors[type] || 0xffffff;
}

// Cleanup function
function cleanupMasterConvergence() {
    if (emcAnimationId) {
        cancelAnimationFrame(emcAnimationId);
    }
    
    if (emcScene) {
        emcScene.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
        emcScene.clear();
    }
    
    if (emcRenderer) {
        emcRenderer.dispose();
    }
    
    if (emcComposer) {
        emcComposer.dispose();
    }
    
    // Clear arrays
    portalSystems = [];
    quantumEntanglements = [];
    consciousnessNodes = [];
    realityGlitches = [];
}

// Handle window resize
let emcResizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(emcResizeTimeout);
    emcResizeTimeout = setTimeout(() => {
        const container = document.getElementById('master-convergence-container');
        if (container && emcCamera && emcRenderer) {
            const isMobile = window.mobileUtils && window.mobileUtils.isMobile();
            const width = container.clientWidth;
            const height = container.clientHeight || (isMobile ? 400 : 800);
        
        emcCamera.aspect = width / height;
        emcCamera.updateProjectionMatrix();
        
            emcRenderer.setSize(width, height);
            if (emcComposer) {
                emcComposer.setSize(width, height);
            }
        }
    }, 250);
});

// Export for global access
window.initMasterConvergence = initMasterConvergence;
window.cleanupMasterConvergence = cleanupMasterConvergence;