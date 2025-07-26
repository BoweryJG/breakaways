// 3D Earth Hidden Architecture - Underground Networks & Hollow Earth Visualization

let scene, camera, renderer, controls;
let earth, atmosphere, tunnelSystem;
let underground = {
    bases: [],
    tunnels: [],
    caverns: [],
    energyNodes: []
};
let animationId;
let selectedRegion = null;
let particleSystems = [];

function initEarth3d() {
    const container = document.getElementById('earth-3d-container');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Setup Three.js scene
    setupScene(container);
    
    // Create Earth and layers
    createEarth();
    createAtmosphere();
    createUndergroundLayers();
    createTunnelNetworks();
    createHollowEarthSystems();
    createEnergyFlows();
    createSurfaceMonuments();
    
    // Setup controls and interactions
    setupInteractions();
    
    // Add UI overlay
    createDepthControls();
    
    // Start animation loop
    animate();
}

function setupScene(container) {
    const width = container.clientWidth;
    const height = 600;
    
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 100, 1000);
    
    // Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    camera.position.set(0, 0, 500);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 150;
    controls.maxDistance = 800;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add starfield
    createStarfield();
}

function createStarfield() {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
        const radius = 1000 + Math.random() * 2000;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i + 2] = radius * Math.cos(phi);
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.8
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

function createEarth() {
    const earthGroup = new THREE.Group();
    
    // Earth surface
    const earthGeometry = new THREE.SphereGeometry(100, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x2233ff,
        emissive: 0x112244,
        shininess: 10,
        opacity: 0.9,
        transparent: true
    });
    
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.receiveShadow = true;
    earth.castShadow = true;
    earthGroup.add(earth);
    
    // Add continent outlines
    const continentGeometry = new THREE.SphereGeometry(101, 64, 64);
    const continentMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff99,
        opacity: 0.3,
        transparent: true,
        wireframe: true
    });
    
    const continents = new THREE.Mesh(continentGeometry, continentMaterial);
    earthGroup.add(continents);
    
    // Add grid overlay
    const gridHelper = new THREE.Mesh(
        new THREE.SphereGeometry(102, 24, 16),
        new THREE.MeshBasicMaterial({
            color: 0x00ffcc,
            opacity: 0.2,
            transparent: true,
            wireframe: true
        })
    );
    earthGroup.add(gridHelper);
    
    scene.add(earthGroup);
}

function createAtmosphere() {
    const atmosphereGeometry = new THREE.SphereGeometry(120, 32, 32);
    const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            opacity: { value: 0.5 }
        },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform float opacity;
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                vec3 color = vec3(0.0, 1.0, 0.8) * intensity;
                gl_FragColor = vec4(color, intensity * opacity);
            }
        `,
        transparent: true,
        side: THREE.BackSide
    });
    
    atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);
}

function createUndergroundLayers() {
    // Create multiple underground shells
    const layers = [
        { radius: 90, color: 0x006666, name: 'shallow', opacity: 0.3 },
        { radius: 70, color: 0x004466, name: 'deep', opacity: 0.4 },
        { radius: 50, color: 0x003366, name: 'mantle', opacity: 0.5 },
        { radius: 30, color: 0x002244, name: 'core', opacity: 0.6 },
        { radius: 20, color: 0xff6600, name: 'core', opacity: 0.8 }
    ];
    
    layers.forEach(layer => {
        const geometry = new THREE.SphereGeometry(layer.radius, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: layer.color,
            transparent: true,
            opacity: layer.opacity,
            side: THREE.DoubleSide,
            emissive: layer.color,
            emissiveIntensity: 0.2
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = layer.name;
        mesh.visible = false; // Initially hidden
        scene.add(mesh);
    });
}

function createTunnelNetworks() {
    // Major underground bases and their connections
    const majorBases = [
        { name: 'Dulce', lat: 36.9, lon: -106.9, depth: 20, type: 'military' },
        { name: 'Area 51', lat: 37.2, lon: -115.8, depth: 25, type: 'military' },
        { name: 'Denver Airport', lat: 39.8, lon: -104.6, depth: 15, type: 'civilian' },
        { name: 'Pine Gap', lat: -23.7, lon: 133.7, depth: 30, type: 'military' },
        { name: 'CERN', lat: 46.2, lon: 6.1, depth: 10, type: 'research' },
        { name: 'Antarctica Base', lat: -90, lon: 0, depth: 40, type: 'ancient' },
        { name: 'Tibet Complex', lat: 29.6, lon: 91.1, depth: 35, type: 'ancient' },
        { name: 'Bucegi Mountains', lat: 45.4, lon: 25.5, depth: 20, type: 'ancient' },
        { name: 'Mount Shasta', lat: 41.4, lon: -122.2, depth: 25, type: 'spiritual' },
        { name: 'Mammoth Cave', lat: 37.2, lon: -86.1, depth: 15, type: 'natural' }
    ];
    
    // Create base nodes
    majorBases.forEach(base => {
        const position = latLonToVector3(base.lat, base.lon, 100 - base.depth);
        
        // Base structure
        const baseGeometry = new THREE.OctahedronGeometry(3, 0);
        const baseMaterial = new THREE.MeshPhongMaterial({
            color: getBaseColor(base.type),
            emissive: getBaseColor(base.type),
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
        baseMesh.position.copy(position);
        baseMesh.userData = base;
        scene.add(baseMesh);
        underground.bases.push(baseMesh);
        
        // Add pulsing glow
        createPulsingGlow(baseMesh, getBaseColor(base.type));
    });
    
    // Create tunnel connections
    createTunnelConnections(majorBases);
}

function createTunnelConnections(bases) {
    const connections = [
        [0, 1], [0, 2], [1, 2], [1, 9], // US West connections
        [2, 9], [4, 7], [3, 5], [5, 6], // International connections
        [6, 7], [0, 8], [8, 9], [3, 6]  // Spiritual/Ancient connections
    ];
    
    connections.forEach(([from, to]) => {
        const fromBase = bases[from];
        const toBase = bases[to];
        
        const fromPos = latLonToVector3(fromBase.lat, fromBase.lon, 100 - fromBase.depth);
        const toPos = latLonToVector3(toBase.lat, toBase.lon, 100 - toBase.depth);
        
        // Create curved tunnel path
        const curve = new THREE.CatmullRomCurve3([
            fromPos,
            fromPos.clone().multiplyScalar(0.8),
            toPos.clone().multiplyScalar(0.8),
            toPos
        ]);
        
        const tubeGeometry = new THREE.TubeGeometry(curve, 64, 1, 8, false);
        const tubeMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ffcc,
            emissive: 0x00ffcc,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.6
        });
        
        const tunnel = new THREE.Mesh(tubeGeometry, tubeMaterial);
        tunnel.userData = { from: fromBase, to: toBase };
        scene.add(tunnel);
        underground.tunnels.push(tunnel);
        
        // Add energy flow particles
        createEnergyFlow(curve, fromBase.type);
    });
}

function createHollowEarthSystems() {
    // Inner Sun
    const innerSunGeometry = new THREE.SphereGeometry(10, 32, 32);
    const innerSunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 1
    });
    
    const innerSun = new THREE.Mesh(innerSunGeometry, innerSunMaterial);
    innerSun.position.set(0, 0, 0);
    scene.add(innerSun);
    
    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(15, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff66,
        transparent: true,
        opacity: 0.3
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    innerSun.add(glow);
    
    // Inner Earth cavern systems
    const cavernCount = 12;
    for (let i = 0; i < cavernCount; i++) {
        const angle = (i / cavernCount) * Math.PI * 2;
        const radius = 40 + Math.random() * 20;
        const height = (Math.random() - 0.5) * 40;
        
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        const cavernGeometry = new THREE.IcosahedronGeometry(5 + Math.random() * 5, 1);
        const cavernMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ccff,
            emissive: 0x006699,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.7
        });
        
        const cavern = new THREE.Mesh(cavernGeometry, cavernMaterial);
        cavern.position.set(x, height, z);
        cavern.userData = { type: 'hollow_earth_cavern', id: i };
        scene.add(cavern);
        underground.caverns.push(cavern);
    }
}

function createEnergyFlows() {
    // Create particle systems for energy flows
    underground.tunnels.forEach(tunnel => {
        const curve = tunnel.geometry.parameters.path;
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const t = Math.random();
            const point = curve.getPoint(t);
            
            positions[i * 3] = point.x;
            positions[i * 3 + 1] = point.y;
            positions[i * 3 + 2] = point.z;
            
            colors[i * 3] = 0;
            colors[i * 3 + 1] = 1;
            colors[i * 3 + 2] = 0.8;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particleSystem = new THREE.Points(particles, particleMaterial);
        particleSystem.userData = { curve: curve, speed: 0.001 + Math.random() * 0.002 };
        scene.add(particleSystem);
        particleSystems.push(particleSystem);
    });
}

function createSurfaceMonuments() {
    // Major surface monuments connected to underground
    const monuments = [
        { name: 'Great Pyramid', lat: 29.9792, lon: 31.1342, type: 'pyramid' },
        { name: 'Stonehenge', lat: 51.1789, lon: -1.8262, type: 'circle' },
        { name: 'Machu Picchu', lat: -13.1631, lon: -72.5450, type: 'city' },
        { name: 'Angkor Wat', lat: 13.4125, lon: 103.8670, type: 'temple' },
        { name: 'Easter Island', lat: -27.1127, lon: -109.3497, type: 'statue' },
        { name: 'Nazca Lines', lat: -14.7390, lon: -75.1300, type: 'lines' },
        { name: 'Teotihuacan', lat: 19.6925, lon: -98.8438, type: 'pyramid' },
        { name: 'Göbekli Tepe', lat: 37.2237, lon: 38.9218, type: 'circle' }
    ];
    
    monuments.forEach(monument => {
        const position = latLonToVector3(monument.lat, monument.lon, 102);
        
        const geometry = new THREE.ConeGeometry(2, 4, 4);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffcc00,
            emissive: 0xff9900,
            emissiveIntensity: 0.3
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.lookAt(0, 0, 0);
        mesh.rotateX(Math.PI);
        mesh.userData = monument;
        scene.add(mesh);
        
        // Connect to nearest underground base
        const nearestBase = findNearestBase(monument);
        if (nearestBase) {
            createSurfaceConnection(position, nearestBase.position);
        }
    });
}

function createSurfaceConnection(surfacePos, undergroundPos) {
    const curve = new THREE.CatmullRomCurve3([
        surfacePos,
        surfacePos.clone().multiplyScalar(0.95),
        undergroundPos.clone().multiplyScalar(1.05),
        undergroundPos
    ]);
    
    const geometry = new THREE.TubeGeometry(curve, 32, 0.5, 8, false);
    const material = new THREE.MeshPhongMaterial({
        color: 0xff9900,
        emissive: 0xff6600,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.4
    });
    
    const connection = new THREE.Mesh(geometry, material);
    connection.visible = false; // Initially hidden
    scene.add(connection);
}

function setupInteractions() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    renderer.domElement.addEventListener('click', onMouseClick);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    
    function onMouseClick(event) {
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        const allObjects = [...underground.bases, ...underground.caverns];
        const intersects = raycaster.intersectObjects(allObjects);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            showInfoPanel(object.userData);
            
            // Highlight selected
            if (selectedRegion) {
                selectedRegion.material.emissiveIntensity = 0.5;
            }
            selectedRegion = object;
            object.material.emissiveIntensity = 1;
        }
    }
    
    function onMouseMove(event) {
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    }
}

function createDepthControls() {
    const controlsHtml = `
        <div class="depth-controls" style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.8); padding: 20px; border: 1px solid #00ffcc;">
            <h4 style="color: #00ffcc; margin-top: 0;">Depth Layers</h4>
            <label style="display: block; margin: 5px 0; color: #fff;">
                <input type="checkbox" class="layer-toggle" data-layer="surface" checked> Surface Monuments
            </label>
            <label style="display: block; margin: 5px 0; color: #fff;">
                <input type="checkbox" class="layer-toggle" data-layer="shallow" checked> Shallow (0-5km)
            </label>
            <label style="display: block; margin: 5px 0; color: #fff;">
                <input type="checkbox" class="layer-toggle" data-layer="deep" checked> Deep (5-50km)
            </label>
            <label style="display: block; margin: 5px 0; color: #fff;">
                <input type="checkbox" class="layer-toggle" data-layer="mantle"> Mantle (50-400km)
            </label>
            <label style="display: block; margin: 5px 0; color: #fff;">
                <input type="checkbox" class="layer-toggle" data-layer="core"> Core Systems
            </label>
            <hr style="border-color: #00ffcc; margin: 10px 0;">
            <label style="display: block; margin: 5px 0; color: #fff;">
                <input type="checkbox" class="layer-toggle" data-layer="tunnels" checked> Tunnel Networks
            </label>
            <label style="display: block; margin: 5px 0; color: #fff;">
                <input type="checkbox" class="layer-toggle" data-layer="energy" checked> Energy Flows
            </label>
            <label style="display: block; margin: 5px 0; color: #fff;">
                <input type="checkbox" class="layer-toggle" data-layer="hollow"> Hollow Earth
            </label>
        </div>
        <div id="earth-info-panel" style="position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.8); padding: 20px; border: 1px solid #00ffcc; display: none; max-width: 300px;">
            <h4 style="color: #00ffcc; margin-top: 0;">Location Info</h4>
            <div id="earth-info-content" style="color: #fff;"></div>
        </div>
    `;
    
    const container = document.getElementById('earth-3d-container');
    container.insertAdjacentHTML('beforeend', controlsHtml);
    
    // Add event listeners
    container.querySelectorAll('.layer-toggle').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            toggleLayer(e.target.dataset.layer, e.target.checked);
        });
    });
}

function toggleLayer(layer, visible) {
    switch(layer) {
        case 'surface':
            if (earth) earth.visible = visible;
            if (atmosphere) atmosphere.visible = visible;
            break;
        case 'tunnels':
            underground.tunnels.forEach(t => t.visible = visible);
            break;
        case 'energy':
            particleSystems.forEach(p => p.visible = visible);
            break;
        case 'hollow':
            underground.caverns.forEach(c => c.visible = visible);
            break;
        case 'core':
            // Handle both core layers
            scene.children.forEach(child => {
                if (child.name === 'core') {
                    child.visible = visible;
                }
            });
            break;
        default:
            const layerMesh = scene.getObjectByName(layer);
            if (layerMesh) layerMesh.visible = visible;
    }
}

function showInfoPanel(data) {
    const panel = document.getElementById('earth-info-panel');
    const content = document.getElementById('earth-info-content');
    
    let info = `<strong>${data.name || 'Unknown Location'}</strong><br>`;
    
    if (data.type) {
        info += `Type: ${data.type}<br>`;
    }
    if (data.depth) {
        info += `Depth: ${data.depth}km<br>`;
    }
    if (data.lat && data.lon) {
        info += `Coordinates: ${data.lat.toFixed(2)}°, ${data.lon.toFixed(2)}°<br>`;
    }
    
    // Add specific descriptions
    const descriptions = {
        'Dulce': 'Multi-level underground military facility. Alleged human-alien collaboration site.',
        'Area 51': 'Classified USAF facility connected to vast underground complex.',
        'Antarctica Base': 'Pre-flood civilization base. Massive cavern systems beneath ice.',
        'CERN': 'Particle physics facility with deep underground installations.',
        'Tibet Complex': 'Ancient tunnel system connecting to Agartha network.'
    };
    
    if (descriptions[data.name]) {
        info += `<br><em>${descriptions[data.name]}</em>`;
    }
    
    content.innerHTML = info;
    panel.style.display = 'block';
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

function getBaseColor(type) {
    const colors = {
        military: 0xff0000,
        civilian: 0x0099ff,
        ancient: 0xffcc00,
        spiritual: 0xff00ff,
        research: 0x00ff99,
        natural: 0x66ff66
    };
    return colors[type] || 0xffffff;
}

function createPulsingGlow(mesh, color) {
    const glowGeometry = new THREE.SphereGeometry(5, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3
    });
    
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    mesh.add(glow);
    
    // Store for animation
    glow.userData = { baseScale: 1, phase: Math.random() * Math.PI * 2 };
}

function findNearestBase(monument) {
    let nearest = null;
    let minDistance = Infinity;
    
    const monumentPos = latLonToVector3(monument.lat, monument.lon, 100);
    
    underground.bases.forEach(base => {
        const distance = monumentPos.distanceTo(base.position);
        if (distance < minDistance) {
            minDistance = distance;
            nearest = base;
        }
    });
    
    return nearest;
}

function createEnergyFlow(curve, type) {
    // Energy flow animation along tunnels will be handled in animate()
}

function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Rotate Earth slowly
    if (earth) {
        earth.rotation.y += 0.001;
    }
    
    // Animate atmosphere
    if (atmosphere) {
        atmosphere.material.uniforms.time.value += 0.01;
    }
    
    // Animate particle flows
    particleSystems.forEach(system => {
        const positions = system.geometry.attributes.position.array;
        const curve = system.userData.curve;
        const speed = system.userData.speed;
        
        for (let i = 0; i < positions.length; i += 3) {
            // Move particles along curve
            const t = (Date.now() * speed + i * 0.01) % 1;
            const point = curve.getPoint(t);
            
            positions[i] = point.x;
            positions[i + 1] = point.y;
            positions[i + 2] = point.z;
        }
        
        system.geometry.attributes.position.needsUpdate = true;
    });
    
    // Animate pulsing glows
    scene.traverse(child => {
        if (child.userData.phase !== undefined) {
            const scale = 1 + Math.sin(Date.now() * 0.001 + child.userData.phase) * 0.3;
            child.scale.setScalar(scale);
        }
    });
    
    // Render
    renderer.render(scene, camera);
}

// Cleanup function
function cleanupEarth3d() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    if (renderer) {
        renderer.dispose();
    }
    
    if (scene) {
        scene.traverse(child => {
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
    const container = document.getElementById('earth-3d-container');
    if (container && camera && renderer) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, 600);
    }
});

// Export for use
window.initEarth3d = initEarth3d;
window.cleanupEarth3d = cleanupEarth3d;