// Moon Control System - Orbital Mechanics Visualization
// Reveals the Moon as an artificial control satellite monitoring and influencing Earth

let moonScene, moonCamera, moonRenderer, moonControls;
let moon, earth, controlGrid, lunarBases, tidalField;
let moonSystem = {
    structures: [],
    beams: [],
    resonanceChambers: [],
    harvestingNodes: [],
    orbitPath: null,
    communicationLinks: []
};
let moonAnimationId;
let selectedFeature = null;
let moonPhase = 0;
let orbitalTime = 0;

// Moon constants for accurate simulation
const MOON_RADIUS = 35; // Visual scale
const EARTH_RADIUS = 100; // Visual scale
const ORBITAL_DISTANCE = 380; // Visual distance
const MOON_ROTATION_SPEED = 0.00002; // Tidally locked
const ORBITAL_PERIOD = 27.322; // days

function initMoonControl() {
    const container = document.getElementById('moon-control-container');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Setup Three.js scene
    setupMoonScene(container);
    
    // Create celestial bodies
    createEarthSystem();
    createMoonSystem();
    createControlGrid();
    createLunarBases();
    createResonanceChambers();
    createCommunicationNetwork();
    createTidalInfluence();
    createEnergyHarvesting();
    createOrbitalPath();
    
    // Setup controls and interactions
    setupMoonInteractions();
    
    // Add UI overlay
    createMoonControls();
    
    // Start animation loop
    animateMoon();
}

function setupMoonScene(container) {
    const width = container.clientWidth;
    const height = 600;
    
    // Scene with deep space background
    moonScene = new THREE.Scene();
    moonScene.background = new THREE.Color(0x000000);
    moonScene.fog = new THREE.Fog(0x000000, 500, 2000);
    
    // Camera positioned to view Earth-Moon system
    moonCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    moonCamera.position.set(0, 200, 800);
    
    // Renderer with enhanced settings
    moonRenderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    moonRenderer.setSize(width, height);
    moonRenderer.setPixelRatio(window.devicePixelRatio);
    moonRenderer.shadowMap.enabled = true;
    moonRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(moonRenderer.domElement);
    
    // Orbital controls
    moonControls = new THREE.OrbitControls(moonCamera, moonRenderer.domElement);
    moonControls.enableDamping = true;
    moonControls.dampingFactor = 0.05;
    moonControls.minDistance = 300;
    moonControls.maxDistance = 1500;
    moonControls.autoRotate = false; // Manual control for precise viewing
    
    // Lighting setup - simulating solar illumination
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(1000, 500, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    moonScene.add(sunLight);
    
    const ambientLight = new THREE.AmbientLight(0x222244, 0.3);
    moonScene.add(ambientLight);
    
    // Add cosmic background
    createCosmicBackground();
}

function createCosmicBackground() {
    // Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
        const radius = 1500 + Math.random() * 3000;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
        
        // Varying star colors
        const intensity = 0.5 + Math.random() * 0.5;
        colors[i] = intensity;
        colors[i + 1] = intensity * (0.8 + Math.random() * 0.2);
        colors[i + 2] = intensity * (0.7 + Math.random() * 0.3);
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.9
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    moonScene.add(stars);
}

function createEarthSystem() {
    const earthGroup = new THREE.Group();
    
    // Earth sphere with cyberpunk aesthetic
    const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x0066cc,
        emissive: 0x001144,
        emissiveIntensity: 0.3,
        shininess: 50,
        opacity: 0.9,
        transparent: true
    });
    
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.receiveShadow = true;
    earth.castShadow = true;
    earthGroup.add(earth);
    
    // Continental grid overlay
    const gridGeometry = new THREE.SphereGeometry(EARTH_RADIUS + 1, 36, 18);
    const gridMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        opacity: 0.2,
        transparent: true,
        wireframe: true
    });
    
    const earthGrid = new THREE.Mesh(gridGeometry, gridMaterial);
    earthGroup.add(earthGrid);
    
    // Atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(EARTH_RADIUS + 15, 32, 32);
    const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            opacity: { value: 0.4 }
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float opacity;
            varying vec3 vNormal;
            varying vec3 vPosition;
            void main() {
                float intensity = pow(0.8 - dot(vNormal, vec3(0, 0, 1.0)), 1.5);
                vec3 color = vec3(0.0, 0.8, 1.0) * intensity;
                float pulse = sin(time * 2.0) * 0.1 + 0.9;
                gl_FragColor = vec4(color, intensity * opacity * pulse);
            }
        `,
        transparent: true,
        side: THREE.BackSide
    });
    
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earthGroup.add(atmosphere);
    
    // Add control sites on Earth
    addEarthControlSites(earthGroup);
    
    moonScene.add(earthGroup);
}

function addEarthControlSites(earthGroup) {
    // Major control points that communicate with Moon
    const controlSites = [
        { name: 'HAARP Alaska', lat: 62.4, lon: -145.2, type: 'transmitter' },
        { name: 'Arecibo', lat: 18.3, lon: -66.7, type: 'receiver' },
        { name: 'Pine Gap', lat: -23.8, lon: 133.7, type: 'relay' },
        { name: 'CERN', lat: 46.2, lon: 6.1, type: 'portal' },
        { name: 'Giza Complex', lat: 29.9, lon: 31.1, type: 'ancient' },
        { name: 'Stonehenge', lat: 51.2, lon: -1.8, type: 'ancient' },
        { name: 'Antarctica Array', lat: -75.0, lon: 0, type: 'hidden' },
        { name: 'Tibet Pyramid', lat: 30.0, lon: 90.0, type: 'ancient' }
    ];
    
    controlSites.forEach(site => {
        const position = latLonToSphere(site.lat, site.lon, EARTH_RADIUS + 2);
        
        // Control point marker
        const markerGeometry = new THREE.OctahedronGeometry(3, 0);
        const markerMaterial = new THREE.MeshPhongMaterial({
            color: getSiteColor(site.type),
            emissive: getSiteColor(site.type),
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.9
        });
        
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.copy(position);
        marker.userData = site;
        earthGroup.add(marker);
        
        // Pulsing glow effect
        const glowGeometry = new THREE.SphereGeometry(5, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: getSiteColor(site.type),
            transparent: true,
            opacity: 0.3
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.userData = { baseScale: 1, phase: Math.random() * Math.PI * 2 };
        marker.add(glow);
    });
}

function createMoonSystem() {
    const moonGroup = new THREE.Group();
    moonGroup.position.x = ORBITAL_DISTANCE;
    
    // Moon surface - revealing artificial nature
    const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 64, 64);
    const moonMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888,
        emissive: 0x222222,
        emissiveIntensity: 0.2,
        shininess: 5,
        bumpScale: 0.5
    });
    
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.receiveShadow = true;
    moon.castShadow = true;
    moonGroup.add(moon);
    
    // Subsurface metallic layer (visible through transparency)
    const metallicGeometry = new THREE.SphereGeometry(MOON_RADIUS - 1, 32, 32);
    const metallicMaterial = new THREE.MeshPhongMaterial({
        color: 0x4444ff,
        emissive: 0x2222ff,
        emissiveIntensity: 0.3,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.3
    });
    
    const metallicLayer = new THREE.Mesh(metallicGeometry, metallicMaterial);
    moonGroup.add(metallicLayer);
    
    // Artificial core reactor
    const coreGeometry = new THREE.IcosahedronGeometry(10, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.8
    });
    
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.userData = { rotationSpeed: 0.01 };
    moonGroup.add(core);
    
    // Holographic projection layer
    const holoGeometry = new THREE.SphereGeometry(MOON_RADIUS + 5, 24, 24);
    const holoMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    
    const holoLayer = new THREE.Mesh(holoGeometry, holoMaterial);
    holoLayer.userData = { phase: 0 };
    moonGroup.add(holoLayer);
    
    moonScene.add(moonGroup);
    moonSystem.moonGroup = moonGroup;
}

function createControlGrid() {
    // Hexagonal control grid covering Moon surface
    const gridGroup = new THREE.Group();
    const hexRadius = 8;
    const hexHeight = Math.sqrt(3) * hexRadius;
    
    for (let lat = -80; lat <= 80; lat += 10) {
        for (let lon = -180; lon <= 180; lon += 15) {
            const position = latLonToSphere(lat, lon, MOON_RADIUS + 0.5);
            
            // Create hexagonal cell
            const hexGeometry = new THREE.CircleGeometry(hexRadius / 2, 6);
            const hexMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffcc,
                transparent: true,
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            
            const hexCell = new THREE.Mesh(hexGeometry, hexMaterial);
            hexCell.position.copy(position);
            hexCell.lookAt(moonSystem.moonGroup.position);
            
            // Add energy level variation
            hexCell.userData = {
                energyLevel: Math.random(),
                lat: lat,
                lon: lon,
                active: Math.random() > 0.3
            };
            
            if (hexCell.userData.active) {
                hexCell.material.opacity = 0.6;
                hexCell.material.emissive = new THREE.Color(0x00ffcc);
                hexCell.material.emissiveIntensity = 0.3;
            }
            
            gridGroup.add(hexCell);
        }
    }
    
    moonSystem.moonGroup.add(gridGroup);
    controlGrid = gridGroup;
}

function createLunarBases() {
    // Major lunar installations (emphasis on far side)
    const lunarBases = [
        { name: 'Mare Orientale Complex', lat: -19.4, lon: -92.8, type: 'command', side: 'far' },
        { name: 'Tsiolkovsky Station', lat: -21.2, lon: 128.9, type: 'research', side: 'far' },
        { name: 'Daedalus Base', lat: -5.9, lon: 179.4, type: 'mining', side: 'far' },
        { name: 'Apollo Anomaly Site', lat: 26.1, lon: 3.6, type: 'ancient', side: 'near' },
        { name: 'Tycho Observatory', lat: -43.3, lon: -11.2, type: 'observation', side: 'near' },
        { name: 'Shackleton Rim', lat: -89.9, lon: 0, type: 'power', side: 'pole' },
        { name: 'Clavius Array', lat: -58.4, lon: -14.4, type: 'transmission', side: 'near' },
        { name: 'Von Kármán Hub', lat: -44.4, lon: 175.9, type: 'portal', side: 'far' }
    ];
    
    lunarBases.forEach(base => {
        const position = latLonToSphere(base.lat, base.lon, MOON_RADIUS + 1);
        
        // Base structure
        const baseGroup = new THREE.Group();
        baseGroup.position.copy(position);
        
        // Main structure
        const structureGeometry = new THREE.CylinderGeometry(3, 5, 4, 6);
        const structureMaterial = new THREE.MeshPhongMaterial({
            color: getBaseTypeColor(base.type),
            emissive: getBaseTypeColor(base.type),
            emissiveIntensity: 0.3,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const structure = new THREE.Mesh(structureGeometry, structureMaterial);
        structure.lookAt(moonSystem.moonGroup.position);
        structure.rotateX(Math.PI / 2);
        baseGroup.add(structure);
        
        // Energy dome
        const domeGeometry = new THREE.SphereGeometry(6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        
        const dome = new THREE.Mesh(domeGeometry, domeMaterial);
        dome.lookAt(moonSystem.moonGroup.position);
        dome.rotateX(Math.PI / 2);
        baseGroup.add(dome);
        
        // Add antenna array for far side bases
        if (base.side === 'far') {
            const antennaGeometry = new THREE.ConeGeometry(1, 8, 4);
            const antennaMaterial = new THREE.MeshPhongMaterial({
                color: 0xffcc00,
                emissive: 0xff9900,
                emissiveIntensity: 0.5
            });
            
            for (let i = 0; i < 3; i++) {
                const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
                antenna.position.set(
                    Math.cos(i * Math.PI * 2 / 3) * 4,
                    4,
                    Math.sin(i * Math.PI * 2 / 3) * 4
                );
                antenna.lookAt(moonSystem.moonGroup.position);
                antenna.rotateX(Math.PI);
                baseGroup.add(antenna);
            }
        }
        
        baseGroup.userData = base;
        moonSystem.moonGroup.add(baseGroup);
        moonSystem.structures.push(baseGroup);
    });
}

function createResonanceChambers() {
    // Hollow Moon resonance chambers
    const chamberCount = 7;
    const chamberRadius = MOON_RADIUS * 0.7;
    
    for (let i = 0; i < chamberCount; i++) {
        const theta = (i / chamberCount) * Math.PI * 2;
        const phi = Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 3;
        
        const x = chamberRadius * Math.sin(phi) * Math.cos(theta);
        const y = chamberRadius * Math.cos(phi);
        const z = chamberRadius * Math.sin(phi) * Math.sin(theta);
        
        // Chamber structure
        const chamberGeometry = new THREE.IcosahedronGeometry(8, 1);
        const chamberMaterial = new THREE.MeshPhongMaterial({
            color: 0xff00ff,
            emissive: 0xff00ff,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.6,
            wireframe: true
        });
        
        const chamber = new THREE.Mesh(chamberGeometry, chamberMaterial);
        chamber.position.set(x, y, z);
        chamber.userData = {
            frequency: 7.83 * (i + 1), // Harmonic of Schumann resonance
            amplitude: 0.5 + Math.random() * 0.5,
            phase: Math.random() * Math.PI * 2
        };
        
        moonSystem.moonGroup.add(chamber);
        moonSystem.resonanceChambers.push(chamber);
        
        // Resonance waves
        const waveGeometry = new THREE.SphereGeometry(12, 32, 32);
        const waveMaterial = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        
        const wave = new THREE.Mesh(waveGeometry, waveMaterial);
        wave.userData = { baseScale: 1, expansionRate: 0.02 };
        chamber.add(wave);
    }
}

function createCommunicationNetwork() {
    // Create communication beams between Moon bases and Earth sites
    const earthSites = [
        { lat: 62.4, lon: -145.2 }, // HAARP
        { lat: 46.2, lon: 6.1 }, // CERN
        { lat: 29.9, lon: 31.1 }, // Giza
        { lat: -75.0, lon: 0 } // Antarctica
    ];
    
    moonSystem.structures.forEach((base, index) => {
        if (base.userData.type === 'transmission' || base.userData.type === 'command') {
            // Connect to Earth sites
            const earthSite = earthSites[index % earthSites.length];
            const earthPos = latLonToSphere(earthSite.lat, earthSite.lon, EARTH_RADIUS);
            
            // Create beam geometry
            const beamGeometry = new THREE.CylinderGeometry(0.5, 2, 1000, 8);
            const beamMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ffff,
                transparent: true,
                opacity: 0.3,
                emissive: 0x00ffff,
                emissiveIntensity: 0.5
            });
            
            const beam = new THREE.Mesh(beamGeometry, beamMaterial);
            beam.userData = {
                start: base.position,
                end: earthPos,
                active: true,
                power: Math.random()
            };
            
            moonScene.add(beam);
            moonSystem.beams.push(beam);
            
            // Add particle flow
            createBeamParticles(beam);
        }
    });
}

function createBeamParticles(beam) {
    const particleCount = 50;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const t = i / particleCount;
        positions[i * 3] = 0;
        positions[i * 3 + 1] = -500 + t * 1000;
        positions[i * 3 + 2] = 0;
        
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.userData = { speed: 0.01, beam: beam };
    beam.add(particles);
}

function createTidalInfluence() {
    // Tidal force field visualization
    const tidalGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    const tidalMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            moonPosition: { value: new THREE.Vector3() },
            strength: { value: 1.0 }
        },
        vertexShader: `
            uniform float time;
            uniform vec3 moonPosition;
            uniform float strength;
            varying float vDistortion;
            
            void main() {
                vec3 pos = position;
                float distance = length(pos.xz - moonPosition.xz);
                float influence = strength / (1.0 + distance * 0.01);
                
                pos.y += sin(time + distance * 0.1) * influence * 10.0;
                vDistortion = influence;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            varying float vDistortion;
            
            void main() {
                vec3 color = mix(vec3(0.0, 0.3, 0.8), vec3(0.0, 1.0, 0.8), vDistortion);
                gl_FragColor = vec4(color, vDistortion * 0.5);
            }
        `,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    tidalField = new THREE.Mesh(tidalGeometry, tidalMaterial);
    tidalField.rotation.x = -Math.PI / 2;
    tidalField.position.y = -EARTH_RADIUS - 50;
    moonScene.add(tidalField);
}

function createEnergyHarvesting() {
    // Energy collection nodes on Moon surface
    const nodeCount = 20;
    
    for (let i = 0; i < nodeCount; i++) {
        const lat = (Math.random() - 0.5) * 160;
        const lon = (Math.random() - 0.5) * 360;
        const position = latLonToSphere(lat, lon, MOON_RADIUS + 2);
        
        // Harvesting node
        const nodeGeometry = new THREE.TetrahedronGeometry(2, 0);
        const nodeMaterial = new THREE.MeshPhongMaterial({
            color: 0xffff00,
            emissive: 0xffaa00,
            emissiveIntensity: 0.5
        });
        
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(position);
        node.lookAt(moonSystem.moonGroup.position);
        
        // Collection field
        const fieldGeometry = new THREE.RingGeometry(3, 8, 6);
        const fieldMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        
        const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
        field.lookAt(new THREE.Vector3(0, 0, 0));
        node.add(field);
        
        node.userData = {
            harvestRate: Math.random(),
            efficiency: 0.7 + Math.random() * 0.3
        };
        
        moonSystem.moonGroup.add(node);
        moonSystem.harvestingNodes.push(node);
    }
}

function createOrbitalPath() {
    // Moon's orbital path
    const orbitCurve = new THREE.EllipseCurve(
        0, 0,
        ORBITAL_DISTANCE, ORBITAL_DISTANCE,
        0, 2 * Math.PI,
        false,
        0
    );
    
    const points = orbitCurve.getPoints(100);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x444466,
        transparent: true,
        opacity: 0.5
    });
    
    moonSystem.orbitPath = new THREE.Line(orbitGeometry, orbitMaterial);
    moonSystem.orbitPath.rotation.x = Math.PI / 2;
    moonScene.add(moonSystem.orbitPath);
    
    // Lagrange points
    const lagrangePoints = [
        { name: 'L1', angle: 0, distance: ORBITAL_DISTANCE * 0.85 },
        { name: 'L2', angle: 0, distance: ORBITAL_DISTANCE * 1.15 },
        { name: 'L3', angle: Math.PI, distance: ORBITAL_DISTANCE },
        { name: 'L4', angle: Math.PI / 3, distance: ORBITAL_DISTANCE },
        { name: 'L5', angle: -Math.PI / 3, distance: ORBITAL_DISTANCE }
    ];
    
    lagrangePoints.forEach(point => {
        const x = Math.cos(point.angle) * point.distance;
        const z = Math.sin(point.angle) * point.distance;
        
        const lpGeometry = new THREE.OctahedronGeometry(5, 0);
        const lpMaterial = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.8
        });
        
        const lp = new THREE.Mesh(lpGeometry, lpMaterial);
        lp.position.set(x, 0, z);
        lp.userData = point;
        moonScene.add(lp);
    });
}

function setupMoonInteractions() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    moonRenderer.domElement.addEventListener('click', onMoonClick);
    moonRenderer.domElement.addEventListener('mousemove', onMoonMouseMove);
    
    function onMoonClick(event) {
        const rect = moonRenderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, moonCamera);
        
        const objects = [
            ...moonSystem.structures,
            ...moonSystem.resonanceChambers,
            ...moonSystem.harvestingNodes
        ];
        
        const intersects = raycaster.intersectObjects(objects, true);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            let data = object.userData;
            
            // Check parent objects for data
            if (!data || Object.keys(data).length === 0) {
                data = object.parent?.userData || {};
            }
            
            if (data && Object.keys(data).length > 0) {
                showMoonInfoPanel(data);
                
                // Highlight selected
                if (selectedFeature) {
                    if (selectedFeature.material.emissiveIntensity !== undefined) {
                        selectedFeature.material.emissiveIntensity = 0.3;
                    }
                }
                selectedFeature = object;
                if (object.material.emissiveIntensity !== undefined) {
                    object.material.emissiveIntensity = 1;
                }
            }
        }
    }
    
    function onMoonMouseMove(event) {
        const rect = moonRenderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
}

function createMoonControls() {
    const controlsHtml = `
        <div class="moon-controls" style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.8); padding: 20px; border: 1px solid #00ffcc; border-radius: 5px;">
            <h4 style="color: #00ffcc; margin-top: 0;">Moon Control Systems</h4>
            <label style="display: block; margin: 5px 0; color: #fff;">
                <input type="checkbox" class="moon-layer-toggle" data-layer="grid" checked> Control Grid
            </label>
            <label style="display: block; margin: 5px 0; color: #fff;">
                <input type="checkbox" class="moon-layer-toggle" data-layer="bases" checked> Lunar Bases
            </label>
            <label style="display: block; margin: 5px 0; color: #fff;">
                <input type="checkbox" class="moon-layer-toggle" data-layer="resonance" checked> Resonance Chambers
            </label>
            <label style="display: block; margin: 5px 0; color: #fff;">
                <input type="checkbox" class="moon-layer-toggle" data-layer="beams" checked> Communication Beams
            </label>
            <label style="display: block; margin: 5px 0; color: #fff;">
                <input type="checkbox" class="moon-layer-toggle" data-layer="tidal" checked> Tidal Influence
            </label>
            <label style="display: block; margin: 5px 0; color: #fff;">
                <input type="checkbox" class="moon-layer-toggle" data-layer="harvesting" checked> Energy Harvesting
            </label>
            <hr style="border-color: #00ffcc; margin: 10px 0;">
            <div style="color: #fff; font-size: 0.9em;">
                <div>Phase: <span id="moon-phase-display" style="color: #00ffcc;">New Moon</span></div>
                <div>Orbital Day: <span id="orbital-day" style="color: #00ffcc;">1</span></div>
                <div>Eclipse Status: <span id="eclipse-status" style="color: #00ffcc;">None</span></div>
            </div>
        </div>
        <div id="moon-info-panel" style="position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.8); padding: 20px; border: 1px solid #00ffcc; display: none; max-width: 300px; border-radius: 5px;">
            <h4 style="color: #00ffcc; margin-top: 0;">Facility Info</h4>
            <div id="moon-info-content" style="color: #fff;"></div>
        </div>
        <div class="consciousness-meter" style="position: absolute; bottom: 20px; left: 20px; background: rgba(0,0,0,0.8); padding: 15px; border: 1px solid #ff00ff; border-radius: 5px;">
            <h4 style="color: #ff00ff; margin-top: 0; margin-bottom: 10px;">Consciousness Influence</h4>
            <div style="width: 200px; height: 20px; background: #222; border: 1px solid #ff00ff;">
                <div id="consciousness-level" style="width: 50%; height: 100%; background: linear-gradient(90deg, #ff00ff, #00ffff); transition: width 0.5s;"></div>
            </div>
            <div style="color: #fff; font-size: 0.8em; margin-top: 5px;">Level: <span id="influence-percent" style="color: #ff00ff;">50%</span></div>
        </div>
    `;
    
    const container = document.getElementById('moon-control-container');
    container.insertAdjacentHTML('beforeend', controlsHtml);
    
    // Add event listeners
    container.querySelectorAll('.moon-layer-toggle').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            toggleMoonLayer(e.target.dataset.layer, e.target.checked);
        });
    });
}

function toggleMoonLayer(layer, visible) {
    switch(layer) {
        case 'grid':
            if (controlGrid) controlGrid.visible = visible;
            break;
        case 'bases':
            moonSystem.structures.forEach(s => s.visible = visible);
            break;
        case 'resonance':
            moonSystem.resonanceChambers.forEach(c => c.visible = visible);
            break;
        case 'beams':
            moonSystem.beams.forEach(b => b.visible = visible);
            break;
        case 'tidal':
            if (tidalField) tidalField.visible = visible;
            break;
        case 'harvesting':
            moonSystem.harvestingNodes.forEach(n => n.visible = visible);
            break;
    }
}

function showMoonInfoPanel(data) {
    const panel = document.getElementById('moon-info-panel');
    const content = document.getElementById('moon-info-content');
    
    let info = `<strong style="color: #00ffcc;">${data.name || 'Unknown Facility'}</strong><br>`;
    
    if (data.type) {
        info += `Type: ${data.type}<br>`;
    }
    if (data.side) {
        info += `Side: ${data.side}<br>`;
    }
    if (data.lat && data.lon) {
        info += `Coordinates: ${data.lat.toFixed(2)}°, ${data.lon.toFixed(2)}°<br>`;
    }
    if (data.frequency) {
        info += `Frequency: ${data.frequency.toFixed(2)} Hz<br>`;
    }
    if (data.harvestRate !== undefined) {
        info += `Harvest Rate: ${(data.harvestRate * 100).toFixed(0)}%<br>`;
    }
    
    // Add specific descriptions
    const descriptions = {
        'Mare Orientale Complex': 'Primary command center for lunar operations. Controls all far side activities.',
        'Tsiolkovsky Station': 'Advanced research facility studying consciousness manipulation techniques.',
        'Apollo Anomaly Site': 'Location of discovered ancient artifacts. Pre-flood technology preserved.',
        'Shackleton Rim': 'Solar energy collection array. Powers the entire lunar infrastructure.',
        'Von Kármán Hub': 'Interdimensional portal facility. Connects to off-world locations.'
    };
    
    if (descriptions[data.name]) {
        info += `<br><em style="color: #aaa;">${descriptions[data.name]}</em>`;
    }
    
    content.innerHTML = info;
    panel.style.display = 'block';
}

// Utility functions
function latLonToSphere(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return new THREE.Vector3(x, y, z);
}

function getSiteColor(type) {
    const colors = {
        transmitter: 0xff0000,
        receiver: 0x00ff00,
        relay: 0xffff00,
        portal: 0xff00ff,
        ancient: 0xffaa00,
        hidden: 0x0000ff
    };
    return colors[type] || 0xffffff;
}

function getBaseTypeColor(type) {
    const colors = {
        command: 0xff0000,
        research: 0x00ffff,
        mining: 0xffff00,
        ancient: 0xffaa00,
        observation: 0x00ff00,
        power: 0xffff00,
        transmission: 0xff00ff,
        portal: 0xff00ff
    };
    return colors[type] || 0xffffff;
}

function calculateMoonPhase() {
    // Simple moon phase calculation based on orbital position
    const angle = orbitalTime % 1;
    const phases = [
        { range: [0, 0.125], name: 'New Moon', influence: 0.9 },
        { range: [0.125, 0.25], name: 'Waxing Crescent', influence: 0.7 },
        { range: [0.25, 0.375], name: 'First Quarter', influence: 0.5 },
        { range: [0.375, 0.5], name: 'Waxing Gibbous', influence: 0.6 },
        { range: [0.5, 0.625], name: 'Full Moon', influence: 1.0 },
        { range: [0.625, 0.75], name: 'Waning Gibbous', influence: 0.6 },
        { range: [0.75, 0.875], name: 'Last Quarter', influence: 0.5 },
        { range: [0.875, 1], name: 'Waning Crescent', influence: 0.7 }
    ];
    
    for (let phase of phases) {
        if (angle >= phase.range[0] && angle < phase.range[1]) {
            return phase;
        }
    }
    return phases[0];
}

function checkEclipse() {
    // Simple eclipse detection based on alignment
    const moonAngle = orbitalTime * Math.PI * 2;
    const moonX = Math.cos(moonAngle) * ORBITAL_DISTANCE;
    const moonZ = Math.sin(moonAngle) * ORBITAL_DISTANCE;
    
    // Check alignment with sun (assumed at positive X)
    const alignment = Math.abs(moonZ) / ORBITAL_DISTANCE;
    
    if (alignment < 0.05) {
        if (moonX > 0) {
            return 'Lunar Eclipse';
        } else {
            return 'Solar Eclipse';
        }
    }
    return 'None';
}

function updateCommunicationBeams() {
    // Update beam positions and orientations
    moonSystem.beams.forEach((beam, index) => {
        if (beam.userData.active) {
            const start = beam.userData.start;
            const end = beam.userData.end;
            
            // Calculate beam position and orientation
            const distance = start.distanceTo(end);
            const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
            
            beam.position.copy(midpoint);
            beam.lookAt(end);
            beam.rotateX(Math.PI / 2);
            beam.scale.y = distance / 1000;
            
            // Pulse effect
            const pulse = Math.sin(Date.now() * 0.001 + index) * 0.3 + 0.7;
            beam.material.opacity = 0.3 * pulse;
        }
    });
}

function animateMoon() {
    moonAnimationId = requestAnimationFrame(animateMoon);
    
    // Update controls
    moonControls.update();
    
    // Update orbital position
    orbitalTime += 0.0001;
    const moonAngle = orbitalTime * Math.PI * 2;
    moonSystem.moonGroup.position.x = Math.cos(moonAngle) * ORBITAL_DISTANCE;
    moonSystem.moonGroup.position.z = Math.sin(moonAngle) * ORBITAL_DISTANCE;
    
    // Tidal lock rotation
    moonSystem.moonGroup.rotation.y = -moonAngle;
    
    // Rotate Earth
    if (earth) {
        earth.rotation.y += 0.002;
    }
    
    // Update atmosphere shader
    moonScene.traverse(child => {
        if (child.material && child.material.uniforms && child.material.uniforms.time) {
            child.material.uniforms.time.value += 0.01;
        }
    });
    
    // Animate resonance chambers
    moonSystem.resonanceChambers.forEach(chamber => {
        const scale = 1 + Math.sin(Date.now() * 0.001 * chamber.userData.frequency / 7.83) * 0.2;
        chamber.scale.setScalar(scale);
        
        // Animate resonance waves
        chamber.children.forEach(child => {
            if (child.userData.baseScale) {
                const waveScale = child.userData.baseScale + 
                    Math.sin(Date.now() * 0.001) * child.userData.expansionRate;
                child.scale.setScalar(waveScale);
                child.material.opacity = 0.1 * (2 - waveScale);
            }
        });
    });
    
    // Animate harvesting nodes
    moonSystem.harvestingNodes.forEach(node => {
        node.rotation.y += 0.01 * node.userData.harvestRate;
        
        // Pulse collection field
        node.children.forEach(child => {
            const scale = 1 + Math.sin(Date.now() * 0.002) * 0.3;
            child.scale.setScalar(scale);
        });
    });
    
    // Update tidal field
    if (tidalField && tidalField.material.uniforms) {
        tidalField.material.uniforms.time.value += 0.01;
        tidalField.material.uniforms.moonPosition.value.copy(moonSystem.moonGroup.position);
    }
    
    // Update communication beams
    updateCommunicationBeams();
    
    // Animate control grid
    if (controlGrid) {
        controlGrid.children.forEach(cell => {
            if (cell.userData.active) {
                const pulse = Math.sin(Date.now() * 0.001 + cell.userData.lat * 0.1) * 0.3 + 0.7;
                cell.material.opacity = 0.3 + pulse * 0.3;
            }
        });
    }
    
    // Update moon phase display
    const phase = calculateMoonPhase();
    document.getElementById('moon-phase-display').textContent = phase.name;
    document.getElementById('orbital-day').textContent = Math.floor(orbitalTime * ORBITAL_PERIOD);
    document.getElementById('eclipse-status').textContent = checkEclipse();
    
    // Update consciousness influence
    const influence = phase.influence * 100;
    document.getElementById('consciousness-level').style.width = influence + '%';
    document.getElementById('influence-percent').textContent = influence.toFixed(0) + '%';
    
    // Animate core reactor
    moonScene.traverse(child => {
        if (child.userData.rotationSpeed) {
            child.rotation.x += child.userData.rotationSpeed;
            child.rotation.y += child.userData.rotationSpeed * 0.7;
        }
    });
    
    // Animate holographic layer
    moonScene.traverse(child => {
        if (child.userData.phase !== undefined) {
            child.userData.phase += 0.01;
            child.material.opacity = 0.1 + Math.sin(child.userData.phase) * 0.05;
        }
    });
    
    // Render
    moonRenderer.render(moonScene, moonCamera);
}

// Cleanup function
function cleanupMoonControl() {
    if (moonAnimationId) {
        cancelAnimationFrame(moonAnimationId);
    }
    
    if (moonRenderer) {
        moonRenderer.dispose();
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
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('moon-control-container');
    if (container && moonCamera && moonRenderer) {
        moonCamera.aspect = container.clientWidth / container.clientHeight;
        moonCamera.updateProjectionMatrix();
        moonRenderer.setSize(container.clientWidth, 600);
    }
});

// Export for use
window.initMoonControl = initMoonControl;
window.cleanupMoonControl = cleanupMoonControl;