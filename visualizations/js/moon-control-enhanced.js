// Lunar Control Matrix - Ultra-Advanced Moon-Earth Interaction Visualization

let moonScene, moonCamera, moonRenderer, moonControls;
let moonSphere, earthSphere, skyboxMesh;
let gravitationalField = [];
let tidalForces = [];
let energyBeams = [];
let lunarBases = [];
let orbitalPath;
let lagrangePoints = [];
let anomalyIndicators = [];
let moonAnimationId;
let moonPhase = 0;
let librationAngle = 0;

// Lunar data
const lunarData = {
    bases: [
        { name: 'Mare Crisium Complex', coords: [17.0, 59.1], type: 'ancient', active: true },
        { name: 'Tycho Installation', coords: [-43.3, -11.4], type: 'modern', active: true },
        { name: 'Sinus Medii Hub', coords: [0.0, 0.0], type: 'relay', active: true },
        { name: 'Mare Orientale Array', coords: [-19.4, -92.8], type: 'energy', active: false },
        { name: 'South Pole Station', coords: [-89.9, 0.0], type: 'research', active: true }
    ],
    
    anomalies: [
        { name: 'Tower Structure', coords: [20.0, 30.0], height: 5, type: 'artificial' },
        { name: 'Bridge Formation', coords: [-10.0, -45.0], length: 12, type: 'unknown' },
        { name: 'Dome Complex', coords: [35.0, -20.0], radius: 8, type: 'artificial' },
        { name: 'Geometric Patterns', coords: [-25.0, 60.0], size: 15, type: 'surface' }
    ],
    
    earthConnections: [
        { from: 'Mare Crisium Complex', to: [29.9792, 31.1342], name: 'Giza', active: true },
        { from: 'Tycho Installation', to: [51.1789, -1.8262], name: 'Stonehenge', active: true },
        { from: 'Sinus Medii Hub', to: [-13.1631, -72.5450], name: 'Machu Picchu', active: false },
        { from: 'South Pole Station', to: [-71.9475, 23.3467], name: 'Antarctica', active: true }
    ],
    
    tidalInfluence: {
        physical: { ocean: 0.7, land: 0.3 },
        biological: { circadian: 0.8, fertility: 0.6, behavior: 0.5 },
        consciousness: { dreams: 0.9, psychic: 0.7, emotional: 0.8 }
    }
};

function initMoonControl() {
    const container = document.getElementById('moon-control-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create description panel first
    createLunarDescriptionPanel(container);
    
    // Create visualization container
    const vizContainer = document.createElement('div');
    vizContainer.id = 'moon-viz-container';
    vizContainer.style.cssText = 'width: 100%; height: 600px; position: relative; background: #000511; border: 1px solid #00ffcc; border-radius: 5px; margin: 20px 0;';
    container.appendChild(vizContainer);
    
    // Add loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'moon-loading';
    loadingDiv.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #00ffcc; font-size: 18px; text-align: center;';
    loadingDiv.innerHTML = '<div>Initializing Lunar Control System...</div><div style="margin-top: 10px; font-size: 14px;">Loading 3D visualization</div>';
    vizContainer.appendChild(loadingDiv);
    
    // Create control panel
    createLunarControls(container);
    
    // Setup scene
    setupMoonScene(vizContainer);
    
    // Create objects
    createEarthMoonSystem();
    createGravitationalField();
    createTidalVisualization();
    createLunarBases();
    createEnergyConnections();
    createLagrangePoints();
    createOrbitalMechanics();
    
    // Start animation
    animateMoon();
    
    // Remove loading indicator after a short delay
    setTimeout(() => {
        const loadingDiv = document.getElementById('moon-loading');
        if (loadingDiv) {
            loadingDiv.style.opacity = '0';
            setTimeout(() => loadingDiv.remove(), 500);
        }
    }, 1000);
}

function setupMoonScene(container) {
    const isMobile = window.mobileUtils && window.mobileUtils.isMobile();
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Check for WebGL support
    if (!window.WebGLRenderingContext) {
        container.innerHTML = `
            <div style="color: #ff0000; text-align: center; padding: 50px;">
                <h3>WebGL Not Supported</h3>
                <p>This visualization requires WebGL support. Please use a modern browser.</p>
            </div>
        `;
        return;
    }
    
    // Scene
    moonScene = new THREE.Scene();
    moonScene.background = new THREE.Color(0x000000);
    
    // Camera
    moonCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    moonCamera.position.set(500, 200, 500);
    
    // Renderer with mobile optimization
    moonRenderer = new THREE.WebGLRenderer({ 
        antialias: !isMobile,
        logarithmicDepthBuffer: true,
        powerPreference: isMobile ? "low-power" : "high-performance"
    });
    moonRenderer.setSize(width, height);
    moonRenderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    moonRenderer.shadowMap.enabled = !isMobile;
    moonRenderer.shadowMap.type = isMobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
    moonRenderer.toneMapping = isMobile ? THREE.LinearToneMapping : THREE.ACESFilmicToneMapping;
    moonRenderer.toneMappingExposure = 0.5;
    
    // Apply mobile optimizations
    if (window.mobileUtils) {
        window.mobileUtils.optimizeRenderer(moonRenderer);
    }
    container.appendChild(moonRenderer.domElement);
    
    // Controls with mobile support
    moonControls = new THREE.OrbitControls(moonCamera, moonRenderer.domElement);
    moonControls.enableDamping = true;
    moonControls.dampingFactor = 0.05;
    moonControls.minDistance = isMobile ? 200 : 100;
    moonControls.maxDistance = isMobile ? 1500 : 2000;
    
    // Add mobile touch controls
    if (window.mobileUtils) {
        window.mobileUtils.addTouchControls(moonControls);
    }
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x111122, 0.3);
    moonScene.add(ambientLight);
    
    const sunlight = new THREE.DirectionalLight(0xffffff, 1.0);
    sunlight.position.set(1000, 0, 0);
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.width = 2048;
    sunlight.shadow.mapSize.height = 2048;
    moonScene.add(sunlight);
    
    // Add starfield skybox
    createStarfieldSkybox();
}

function createEarthMoonSystem() {
    // Add scale indicator
    createScaleIndicator();
    
    // Add distance measurement
    createDistanceMeasurement();
    
    // Create Earth
    const earthGeometry = new THREE.SphereGeometry(100, 64, 64);
    const earthMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uDayTexture: { value: null },
            uNightTexture: { value: null },
            uCloudsTexture: { value: null },
            uSunDirection: { value: new THREE.Vector3(1, 0, 0) }
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
            uniform vec3 uSunDirection;
            
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                // Day/night calculation
                float sunDot = dot(vNormal, normalize(uSunDirection));
                float dayNight = smoothstep(-0.2, 0.2, sunDot);
                
                // Base colors
                vec3 dayColor = vec3(0.2, 0.4, 0.7);
                vec3 nightColor = vec3(0.05, 0.05, 0.1);
                
                // City lights on night side
                vec3 cityLights = vec3(1.0, 0.8, 0.4) * (1.0 - dayNight) * 0.3;
                
                // Atmosphere
                float atmosphere = pow(1.0 - abs(dot(vNormal, normalize(cameraPosition - vPosition))), 2.0);
                vec3 atmosColor = vec3(0.3, 0.6, 1.0) * atmosphere;
                
                // Combine
                vec3 finalColor = mix(nightColor + cityLights, dayColor, dayNight) + atmosColor;
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `
    });
    
    earthSphere = new THREE.Mesh(earthGeometry, earthMaterial);
    earthSphere.position.x = -200;
    earthSphere.castShadow = true;
    earthSphere.receiveShadow = true;
    moonScene.add(earthSphere);
    
    // Create Moon with detailed surface
    const moonGeometry = new THREE.SphereGeometry(27.3, 64, 64); // To scale (1:3.67)
    const moonMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uPhase: { value: 0 },
            uLibration: { value: 0 },
            uBaseColor: { value: new THREE.Color(0xcccccc) },
            uHighlightColor: { value: new THREE.Color(0x00ffcc) }
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
            uniform float uPhase;
            uniform vec3 uBaseColor;
            uniform vec3 uHighlightColor;
            
            varying vec2 vUv;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            // Simplex noise for surface detail
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            
            float snoise(vec3 v) {
                const vec2 C = vec2(1.0/6.0, 1.0/3.0);
                const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
                
                vec3 i  = floor(v + dot(v, C.yyy));
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
                
                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                
                vec4 b0 = vec4(x.xy, y.xy);
                vec4 b1 = vec4(x.zw, y.zw);
                
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
                
                vec3 p0 = vec3(a0.xy, h.x);
                vec3 p1 = vec3(a0.zw, h.y);
                vec3 p2 = vec3(a1.xy, h.z);
                vec3 p3 = vec3(a1.zw, h.w);
                
                vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;
                
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
            }
            
            void main() {
                // Surface detail noise
                float noise = snoise(vPosition * 0.1);
                float craters = smoothstep(0.2, 0.3, noise) * 0.3;
                
                // Base moon color with craters
                vec3 surfaceColor = uBaseColor * (1.0 - craters * 0.5);
                
                // Hidden base locations glow
                float baseGlow = 0.0;
                vec2 base1 = vec2(0.3, 0.5); // Mare Crisium
                vec2 base2 = vec2(0.7, 0.2); // Tycho
                
                float dist1 = distance(vUv, base1);
                float dist2 = distance(vUv, base2);
                
                baseGlow += exp(-dist1 * 20.0) * sin(uTime * 3.0) * 0.5 + 0.5;
                baseGlow += exp(-dist2 * 20.0) * sin(uTime * 2.0 + 1.0) * 0.5 + 0.5;
                
                // Energy field
                float energyField = sin(vUv.x * 20.0 + uTime) * sin(vUv.y * 20.0 - uTime) * 0.1;
                
                // Combine all effects
                vec3 finalColor = surfaceColor + uHighlightColor * baseGlow * 0.5 + vec3(energyField) * uHighlightColor;
                
                // Phase lighting
                vec3 lightDir = normalize(vec3(1.0, 0.0, 0.0));
                float diffuse = max(dot(vNormal, lightDir), 0.0);
                finalColor *= diffuse * 0.7 + 0.3;
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `
    });
    
    moonSphere = new THREE.Mesh(moonGeometry, moonMaterial);
    moonSphere.position.x = 200;
    moonSphere.castShadow = true;
    moonSphere.receiveShadow = true;
    moonScene.add(moonSphere);
    
    // Add glow around moon
    const glowGeometry = new THREE.SphereGeometry(35, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            c: { value: 0.5 },
            p: { value: 3.0 },
            glowColor: { value: new THREE.Color(0x00ffcc) },
            viewVector: { value: moonCamera.position }
        },
        vertexShader: `
            uniform vec3 viewVector;
            uniform float c;
            uniform float p;
            varying float intensity;
            
            void main() {
                vec3 vNormal = normalize(normalMatrix * normal);
                vec3 vNormel = normalize(normalMatrix * viewVector);
                intensity = pow(c - dot(vNormal, vNormel), p);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            varying float intensity;
            
            void main() {
                vec3 glow = glowColor * intensity;
                gl_FragColor = vec4(glow, intensity * 0.5);
            }
        `,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    
    const moonGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    moonSphere.add(moonGlow);
}

function createGravitationalField() {
    // Create gravitational field visualization
    const fieldSize = 50;
    const spacing = 20;
    
    for (let x = -fieldSize; x <= fieldSize; x++) {
        for (let y = -fieldSize; y <= fieldSize; y++) {
            for (let z = -fieldSize; z <= fieldSize; z++) {
                if (x % spacing === 0 && y % spacing === 0 && z % spacing === 0) {
                    const position = new THREE.Vector3(x * 10, y * 10, z * 10);
                    
                    // Skip if too close to Earth or Moon
                    const distToEarth = position.distanceTo(earthSphere.position);
                    const distToMoon = position.distanceTo(moonSphere.position);
                    
                    if (distToEarth < 150 || distToMoon < 50) continue;
                    
                    // Create field indicator
                    const geometry = new THREE.SphereGeometry(1, 8, 8);
                    const material = new THREE.MeshBasicMaterial({
                        color: 0x00ffcc,
                        transparent: true,
                        opacity: 0.3
                    });
                    
                    const indicator = new THREE.Mesh(geometry, material);
                    indicator.position.copy(position);
                    
                    gravitationalField.push(indicator);
                    moonScene.add(indicator);
                }
            }
        }
    }
}

function createTidalVisualization() {
    // Create tidal force streams between Earth and Moon
    for (let i = 0; i < 20; i++) {
        const curve = new THREE.CatmullRomCurve3([
            earthSphere.position.clone().add(new THREE.Vector3(
                100 * Math.cos(i * Math.PI / 10),
                100 * Math.sin(i * Math.PI / 10),
                0
            )),
            new THREE.Vector3(0, 0, 0),
            moonSphere.position.clone().add(new THREE.Vector3(
                -30 * Math.cos(i * Math.PI / 10),
                -30 * Math.sin(i * Math.PI / 10),
                0
            ))
        ]);
        
        const tubeGeometry = new THREE.TubeGeometry(curve, 50, 0.5, 8, false);
        const tubeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ccff,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        tube.userData = { curve: curve, phase: i / 20 };
        tidalForces.push(tube);
        moonScene.add(tube);
    }
}

function createLunarBases() {
    lunarData.bases.forEach(base => {
        const position = moonCoordToVector3(base.coords[0], base.coords[1], 28);
        
        // Base structure
        const baseGroup = new THREE.Group();
        
        // Main dome
        const domeGeometry = new THREE.SphereGeometry(2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMaterial = new THREE.MeshPhysicalMaterial({
            color: base.active ? 0x00ffcc : 0x666666,
            emissive: base.active ? 0x00ffcc : 0x000000,
            emissiveIntensity: base.active ? 0.5 : 0,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.8
        });
        const dome = new THREE.Mesh(domeGeometry, domeMaterial);
        baseGroup.add(dome);
        
        // Energy beacon
        if (base.active) {
            const beaconGeometry = new THREE.CylinderGeometry(0.1, 0.5, 100, 8);
            const beaconMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffcc,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending
            });
            const beacon = new THREE.Mesh(beaconGeometry, beaconMaterial);
            beacon.position.y = 50;
            baseGroup.add(beacon);
        }
        
        // Position on moon surface
        baseGroup.position.copy(position);
        baseGroup.lookAt(moonSphere.position);
        
        base.object = baseGroup;
        lunarBases.push(baseGroup);
        moonSphere.add(baseGroup);
    });
}

function createEnergyConnections() {
    lunarData.earthConnections.forEach(connection => {
        if (!connection.active) return;
        
        const base = lunarData.bases.find(b => b.name === connection.from);
        if (!base || !base.object) return;
        
        // Create energy beam
        const earthPoint = latLonToVector3(connection.to[0], connection.to[1], 100);
        earthPoint.add(earthSphere.position);
        
        const moonPoint = base.object.position.clone();
        moonPoint.applyMatrix4(moonSphere.matrixWorld);
        
        // Create curved beam
        const curve = new THREE.QuadraticBezierCurve3(
            moonPoint,
            new THREE.Vector3(0, 100, 0),
            earthPoint
        );
        
        // Beam geometry
        const beamGeometry = new THREE.TubeGeometry(curve, 50, 1, 8, false);
        const beamMaterial = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });
        
        const beam = new THREE.Mesh(beamGeometry, beamMaterial);
        beam.userData = { connection: connection, curve: curve };
        energyBeams.push(beam);
        moonScene.add(beam);
        
        // Add particle flow with mobile optimization
        const isMobile = window.mobileUtils && window.mobileUtils.isMobile();
        let particleCount = 50;
        if (window.mobileUtils) {
            particleCount = window.mobileUtils.optimizeParticles(particleCount);
        }
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const t = i / particleCount;
            const point = curve.getPoint(t);
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = point.z;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0xff00ff,
            size: 3,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.userData = { curve: curve, offset: 0 };
        beam.userData.particles = particles;
        moonScene.add(particles);
    });
}

function createLagrangePoints() {
    // L1-L5 Lagrange points
    const lagrangeData = [
        { name: 'L1', position: new THREE.Vector3(170, 0, 0), color: 0xff0000 },
        { name: 'L2', position: new THREE.Vector3(230, 0, 0), color: 0xff6600 },
        { name: 'L3', position: new THREE.Vector3(-200, 0, 0), color: 0xffff00 },
        { name: 'L4', position: new THREE.Vector3(100, 0, 173), color: 0x00ff00 },
        { name: 'L5', position: new THREE.Vector3(100, 0, -173), color: 0x0066ff }
    ];
    
    lagrangeData.forEach(point => {
        // Create point visualization
        const geometry = new THREE.OctahedronGeometry(5, 2);
        const material = new THREE.MeshPhysicalMaterial({
            color: point.color,
            emissive: point.color,
            emissiveIntensity: 0.5,
            metalness: 0.9,
            roughness: 0.1
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(point.position);
        
        // Add rotating rings
        const ringGeometry = new THREE.TorusGeometry(10, 0.5, 8, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: point.color,
            transparent: true,
            opacity: 0.5
        });
        
        const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
        const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
        const ring3 = new THREE.Mesh(ringGeometry, ringMaterial);
        
        ring1.rotation.x = Math.PI / 2;
        ring2.rotation.y = Math.PI / 2;
        
        mesh.add(ring1);
        mesh.add(ring2);
        mesh.add(ring3);
        
        // Add label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 64;
        
        context.font = 'bold 48px Arial';
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.fillText(point.name, 64, 48);
        
        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.SpriteMaterial({ map: texture });
        const label = new THREE.Sprite(labelMaterial);
        label.scale.set(20, 10, 1);
        label.position.y = 15;
        mesh.add(label);
        
        mesh.userData = point;
        lagrangePoints.push(mesh);
        moonScene.add(mesh);
    });
}

function createOrbitalMechanics() {
    // Moon's orbital path
    const orbitCurve = new THREE.EllipseCurve(
        -200, 0,  // Center
        400, 400, // RadiusX, RadiusY
        0, 2 * Math.PI,
        false,
        0
    );
    
    const points = orbitCurve.getPoints(100);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x444444,
        transparent: true,
        opacity: 0.5
    });
    
    orbitalPath = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitalPath.rotation.x = Math.PI / 2;
    moonScene.add(orbitalPath);
    
    // Add anomaly indicators along orbit
    for (let i = 0; i < 8; i++) {
        const t = i / 8;
        const point = orbitCurve.getPoint(t);
        
        const indicatorGeometry = new THREE.SphereGeometry(2, 8, 8);
        const indicatorMaterial = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.6
        });
        
        const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
        indicator.position.set(point.x, 0, -point.y);
        indicator.userData = { phase: t };
        
        anomalyIndicators.push(indicator);
        moonScene.add(indicator);
    }
}

function createStarfieldSkybox() {
    const size = 5000;
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    
    // Create starfield texture
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add stars
    for (let i = 0; i < 2000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.5;
        const opacity = Math.random() * 0.8 + 0.2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
    }
    
    // Add some colored stars
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2 + 1;
        
        const colors = ['#ffcccc', '#ccccff', '#ffffcc', '#ccffcc'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
    });
    
    skyboxMesh = new THREE.Mesh(geometry, material);
    moonScene.add(skyboxMesh);
}

function createLunarDescriptionPanel(container) {
    const descPanel = document.createElement('div');
    descPanel.style.cssText = `
        background: rgba(10, 25, 41, 0.95);
        border: 1px solid #00ffcc;
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 5px;
    `;
    
    descPanel.innerHTML = `
        <h3 style="color: #00ffcc; margin-top: 0;">What You're Seeing in the 3D Visualization</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; color: #ffffff; margin-bottom: 20px;">
            <div>
                <h4 style="color: #ff00ff;">The System</h4>
                <ul style="font-size: 14px; line-height: 1.6;">
                    <li><strong style="color: #00aaff;">Blue Sphere (Large):</strong> Earth</li>
                    <li><strong style="color: #cccccc;">Gray Sphere (Small):</strong> Moon (to scale - 27% of Earth)</li>
                    <li><strong style="color: #ffcc00;">Yellow Dashed Line:</strong> Distance measurement (384,400 km)</li>
                    <li><strong style="color: #9370db;">Purple Grid:</strong> Gravitational field lines</li>
                </ul>
            </div>
            
            <div>
                <h4 style="color: #ff00ff;">Interactive Elements</h4>
                <ul style="font-size: 14px; line-height: 1.6;">
                    <li><strong style="color: #ff0000;">Red Markers:</strong> Lunar base locations</li>
                    <li><strong style="color: #00ffcc;">Cyan Beams:</strong> Energy connections to Earth sites</li>
                    <li><strong style="color: #ff00ff;">Purple Pulses:</strong> Tidal force visualization</li>
                    <li><strong style="color: #ffffff;">White Points:</strong> Lagrange points (L1-L5)</li>
                </ul>
            </div>
        </div>
        
        <div style="background: rgba(255, 0, 255, 0.1); padding: 15px; border-radius: 5px; margin-bottom: 15px;">
            <h4 style="color: #ff00ff; margin-top: 0;">Navigation Instructions</h4>
            <p style="margin: 0; color: #ffffff; font-size: 14px;">
                <strong>Mouse/Touch:</strong> Click and drag to rotate view | Scroll/Pinch to zoom<br>
                <strong>Right-click drag:</strong> Pan the camera view<br>
                <strong>View Buttons:</strong> Switch between Earth and Moon perspectives
            </p>
        </div>
        
        <div style="color: #ffcc00; font-size: 13px; text-align: center;">
            If the 3D visualization doesn't appear, try refreshing the page or checking WebGL support in your browser.
        </div>
    `;
    
    container.appendChild(descPanel);
}

function createScaleIndicator() {
    // Create scale legend
    const scaleLegend = document.createElement('div');
    scaleLegend.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 20px;
        background: rgba(10, 25, 41, 0.9);
        border: 1px solid #00ffcc;
        padding: 15px;
        color: #ffffff;
        font-family: monospace;
        font-size: 12px;
        border-radius: 5px;
    `;
    
    scaleLegend.innerHTML = `
        <h4 style="color: #00ffcc; margin: 0 0 10px 0;">Scale Reference</h4>
        <div style="margin-bottom: 5px;">
            <span style="color: #00aaff;">Earth Diameter:</span> 12,742 km
        </div>
        <div style="margin-bottom: 5px;">
            <span style="color: #cccccc;">Moon Diameter:</span> 3,475 km (27% of Earth)
        </div>
        <div style="margin-bottom: 5px;">
            <span style="color: #ffcc00;">Distance:</span> 384,400 km avg
        </div>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #444;">
            <span style="color: #ff00ff;">Current View:</span> 1:1000 scale
        </div>
    `;
    
    document.getElementById('moon-viz-container').appendChild(scaleLegend);
}

function createDistanceMeasurement() {
    // Create distance line between Earth and Moon
    const points = [
        new THREE.Vector3(-200, 0, 0), // Earth position
        new THREE.Vector3(184, 0, 0)   // Moon position (to scale)
    ];
    
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineMaterial = new THREE.LineDashedMaterial({
        color: 0xffcc00,
        dashSize: 5,
        gapSize: 5,
        opacity: 0.5,
        transparent: true
    });
    
    const distanceLine = new THREE.Line(lineGeometry, lineMaterial);
    distanceLine.computeLineDistances();
    moonScene.add(distanceLine);
    
    // Add distance label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    context.font = '20px Arial';
    context.fillStyle = '#ffcc00';
    context.textAlign = 'center';
    context.fillText('384,400 km', 128, 32);
    context.fillText('(30 Earth diameters)', 128, 52);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(100, 25, 1);
    sprite.position.set(-8, 20, 0);
    moonScene.add(sprite);
}

function createLunarControls(container) {
    const controlsDiv = document.createElement('div');
    controlsDiv.style.cssText = `
        margin-top: 20px;
        padding: 20px;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #00ffcc;
        border-radius: 10px;
    `;
    
    controlsDiv.innerHTML = `
        <h3 style="color: #00ffcc; margin-top: 0;">Lunar Control Matrix</h3>
        
        <div style="margin-bottom: 15px; padding: 10px; background: rgba(255, 0, 255, 0.1); border-radius: 5px;">
            <p style="margin: 0; color: #ffffff; font-size: 14px;">
                The Moon's position and properties are impossibly precise for natural formation. 
                View controls allow exploration of gravitational anomalies and energy connections.
            </p>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 15px;">
            <button class="lunar-control" onclick="toggleGravField()">Toggle Gravitational Field</button>
            <button class="lunar-control" onclick="toggleTidalForces()">Toggle Tidal Forces</button>
            <button class="lunar-control" onclick="toggleEnergyBeams()">Toggle Energy Beams</button>
            <button class="lunar-control" onclick="focusOnBase()">Focus on Lunar Bases</button>
            <button class="lunar-control" onclick="showLagrangeInfo()">Lagrange Point Analysis</button>
            <button class="lunar-control" onclick="toggleLibration()">Toggle Libration</button>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px;">
            <button class="lunar-control special" onclick="viewFromEarth()">View from Earth</button>
            <button class="lunar-control special" onclick="viewFromMoon()">View from Moon</button>
        </div>
        <div id="lunar-info" style="margin-top: 20px; color: #ccc;">
            <h4>Tidal Influence Metrics</h4>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px;">
                <div style="background: rgba(0, 255, 204, 0.1); padding: 10px; border-radius: 5px;">
                    <strong>Physical</strong><br>
                    Ocean: ${(lunarData.tidalInfluence.physical.ocean * 100).toFixed(0)}%<br>
                    Land: ${(lunarData.tidalInfluence.physical.land * 100).toFixed(0)}%
                </div>
                <div style="background: rgba(255, 0, 255, 0.1); padding: 10px; border-radius: 5px;">
                    <strong>Biological</strong><br>
                    Circadian: ${(lunarData.tidalInfluence.biological.circadian * 100).toFixed(0)}%<br>
                    Behavior: ${(lunarData.tidalInfluence.biological.behavior * 100).toFixed(0)}%
                </div>
                <div style="background: rgba(0, 102, 255, 0.1); padding: 10px; border-radius: 5px;">
                    <strong>Consciousness</strong><br>
                    Dreams: ${(lunarData.tidalInfluence.consciousness.dreams * 100).toFixed(0)}%<br>
                    Psychic: ${(lunarData.tidalInfluence.consciousness.psychic * 100).toFixed(0)}%
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(controlsDiv);
    
    // Style buttons
    const style = document.createElement('style');
    style.textContent = `
        .lunar-control {
            background: #1a1a1a;
            color: #00ffcc;
            border: 1px solid #00ffcc;
            padding: 10px;
            cursor: pointer;
            transition: all 0.3s;
            font-family: monospace;
        }
        .lunar-control:hover {
            background: #00ffcc;
            color: #0a0a0a;
            box-shadow: 0 0 20px #00ffcc;
        }
        .lunar-control.special {
            background: rgba(255, 0, 255, 0.1);
            border-color: #ff00ff;
            color: #ff00ff;
        }
        .lunar-control.special:hover {
            background: #ff00ff;
            color: #0a0a0a;
            box-shadow: 0 0 20px #ff00ff;
        }
    `;
    document.head.appendChild(style);
}

// Control functions
window.toggleGravField = function() {
    gravitationalField.forEach(indicator => {
        indicator.visible = !indicator.visible;
    });
};

window.toggleTidalForces = function() {
    tidalForces.forEach(force => {
        force.visible = !force.visible;
    });
};

window.toggleEnergyBeams = function() {
    energyBeams.forEach(beam => {
        beam.visible = !beam.visible;
        if (beam.userData.particles) {
            beam.userData.particles.visible = !beam.userData.particles.visible;
        }
    });
};

window.focusOnBase = function() {
    // Focus camera on moon
    const targetPosition = moonSphere.position.clone();
    targetPosition.x += 100;
    targetPosition.y += 50;
    targetPosition.z += 100;
    
    moonCamera.position.lerp(targetPosition, 0.1);
    moonControls.target.copy(moonSphere.position);
};

window.viewFromEarth = function() {
    // Animate camera to Earth perspective
    const targetPosition = new THREE.Vector3(-350, 50, 200);
    const targetLookAt = moonSphere.position.clone();
    
    const startPosition = moonCamera.position.clone();
    const startTime = Date.now();
    const duration = 2000;
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        moonCamera.position.lerpVectors(startPosition, targetPosition, eased);
        moonControls.target.copy(targetLookAt);
        moonControls.update();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    animate();
};

window.viewFromMoon = function() {
    // Animate camera to Moon perspective
    const targetPosition = moonSphere.position.clone();
    targetPosition.x += 100;
    targetPosition.y += 50;
    targetPosition.z += 50;
    
    const targetLookAt = earthSphere.position.clone();
    
    const startPosition = moonCamera.position.clone();
    const startTime = Date.now();
    const duration = 2000;
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        
        moonCamera.position.lerpVectors(startPosition, targetPosition, eased);
        moonControls.target.copy(targetLookAt);
        moonControls.update();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    animate();
};

window.showLagrangeInfo = function() {
    const infoDiv = document.getElementById('lunar-info');
    let html = '<h4>Lagrange Points Analysis</h4>';
    
    lagrangePoints.forEach(point => {
        const data = point.userData;
        html += `
            <div style="margin: 10px 0; padding: 10px; background: rgba(${parseInt(data.color.toString(16).slice(0,2), 16)}, ${parseInt(data.color.toString(16).slice(2,4), 16)}, ${parseInt(data.color.toString(16).slice(4,6), 16)}, 0.2); border-radius: 5px;">
                <strong>${data.name}</strong><br>
                Position: (${data.position.x.toFixed(0)}, ${data.position.y.toFixed(0)}, ${data.position.z.toFixed(0)})<br>
                Stability: ${data.name === 'L4' || data.name === 'L5' ? 'Stable' : 'Unstable'}<br>
                Status: ${Math.random() > 0.5 ? 'Anomaly Detected' : 'Normal'}
            </div>
        `;
    });
    
    infoDiv.innerHTML = html;
};

window.toggleLibration = function() {
    librationAngle = librationAngle > 0 ? 0 : 5.145; // Moon's actual libration angle
};

// Utility functions
function moonCoordToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return new THREE.Vector3(x, y, z);
}

function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return new THREE.Vector3(x, y, z);
}

function animateMoon() {
    moonAnimationId = requestAnimationFrame(animateMoon);
    
    // Update controls
    moonControls.update();
    
    // Rotate Moon (tidally locked but with libration)
    moonPhase += 0.001;
    moonSphere.rotation.y = moonPhase + Math.sin(moonPhase * 2) * librationAngle * Math.PI / 180;
    
    // Update Moon position (orbit)
    const orbitRadius = 400;
    moonSphere.position.x = -200 + Math.cos(moonPhase) * orbitRadius;
    moonSphere.position.z = Math.sin(moonPhase) * orbitRadius * 0.2; // Slight inclination
    
    // Update shader uniforms
    if (moonSphere.material.uniforms) {
        moonSphere.material.uniforms.uTime.value += 0.01;
        moonSphere.material.uniforms.uPhase.value = moonPhase;
        moonSphere.material.uniforms.uLibration.value = librationAngle;
    }
    
    if (earthSphere.material.uniforms) {
        earthSphere.material.uniforms.uTime.value += 0.01;
    }
    
    // Rotate Earth
    earthSphere.rotation.y += 0.002;
    
    // Update gravitational field
    gravitationalField.forEach(indicator => {
        const earthDist = indicator.position.distanceTo(earthSphere.position);
        const moonDist = indicator.position.distanceTo(moonSphere.position);
        
        const earthForce = 100 / (earthDist * earthDist);
        const moonForce = 27.3 / (moonDist * moonDist);
        
        const totalForce = earthForce + moonForce;
        indicator.scale.setScalar(Math.min(totalForce * 10, 2));
        
        // Color based on dominant force
        if (earthForce > moonForce * 2) {
            indicator.material.color.setHex(0x0066ff);
        } else if (moonForce > earthForce * 2) {
            indicator.material.color.setHex(0xffff00);
        } else {
            indicator.material.color.setHex(0x00ffcc);
        }
    });
    
    // Animate tidal forces
    tidalForces.forEach(force => {
        const phase = force.userData.phase + moonPhase;
        const scale = 1 + Math.sin(phase * 4) * 0.2;
        force.scale.y = scale;
        force.material.opacity = 0.3 + Math.sin(phase * 2) * 0.1;
    });
    
    // Update energy beam particles
    energyBeams.forEach(beam => {
        if (beam.userData.particles && beam.userData.particles.visible) {
            beam.userData.particles.userData.offset += 0.01;
            if (beam.userData.particles.userData.offset > 1) {
                beam.userData.particles.userData.offset = 0;
            }
            
            const positions = beam.userData.particles.geometry.attributes.position.array;
            const curve = beam.userData.curve;
            const particleCount = positions.length / 3;
            
            for (let i = 0; i < particleCount; i++) {
                const t = (i / particleCount + beam.userData.particles.userData.offset) % 1;
                const point = curve.getPoint(t);
                
                positions[i * 3] = point.x;
                positions[i * 3 + 1] = point.y;
                positions[i * 3 + 2] = point.z;
            }
            
            beam.userData.particles.geometry.attributes.position.needsUpdate = true;
        }
    });
    
    // Rotate Lagrange point indicators
    lagrangePoints.forEach(point => {
        point.rotation.y += 0.01;
        point.children.forEach((child, idx) => {
            if (child.type === 'Mesh' && child.geometry.type === 'TorusGeometry') {
                child.rotation.x += 0.02 * (idx + 1);
                child.rotation.y += 0.01 * (idx + 1);
            }
        });
    });
    
    // Pulse anomaly indicators
    anomalyIndicators.forEach((indicator, idx) => {
        const scale = 1 + Math.sin(Date.now() * 0.002 + idx) * 0.5;
        indicator.scale.setScalar(scale);
    });
    
    // Update glow shader
    const moonGlow = moonSphere.children.find(child => child.material && child.material.uniforms);
    if (moonGlow && moonGlow.material.uniforms.viewVector) {
        moonGlow.material.uniforms.viewVector.value = new THREE.Vector3().subVectors(
            moonCamera.position,
            moonSphere.position
        );
    }
    
    // Render
    moonRenderer.render(moonScene, moonCamera);
}

function cleanupMoonControl() {
    if (moonAnimationId) {
        cancelAnimationFrame(moonAnimationId);
    }
    
    if (moonScene) {
        moonScene.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
        moonScene.clear();
    }
    
    if (moonRenderer) {
        moonRenderer.dispose();
    }
    
    gravitationalField = [];
    tidalForces = [];
    energyBeams = [];
    lunarBases = [];
    lagrangePoints = [];
    anomalyIndicators = [];
}

// Handle window resize
function handleMoonResize() {
    const container = document.getElementById('moon-control-container');
    if (!container || !moonRenderer || !moonCamera) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    moonCamera.aspect = width / height;
    moonCamera.updateProjectionMatrix();
    moonRenderer.setSize(width, height);
}

// Add resize listener with debouncing
let moonResizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(moonResizeTimeout);
    moonResizeTimeout = setTimeout(() => {
        const container = document.getElementById('moon-control-container');
        if (container && moonRenderer) {
            if (window.mobileUtils && window.mobileUtils.isMobile()) {
                window.mobileUtils.handleResize(handleMoonResize);
            } else {
                handleMoonResize();
            }
        }
    }, 250);
});

// Export
window.initMoonControl = initMoonControl;
window.cleanupMoonControl = cleanupMoonControl;