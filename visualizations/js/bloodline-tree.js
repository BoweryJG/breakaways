// Awakening Bloodlines - Ultra-thin Interactive Genetic Tree Visualization

let bloodlineScene, bloodlineCamera, bloodlineRenderer, bloodlineControls;
let bloodlineContainer;
let nodeGroups = {};
let connectionLines = [];
let particleFlows = [];
let glowEffects = [];
let selectedNode = null;
let animationFrame;

// Bloodline data structure
const bloodlineData = {
    root: {
        id: 'origin',
        name: 'Pre-Flood Civilization',
        date: '10,000 BCE',
        rh: 100,
        position: [0, 200, 0],
        children: [
            {
                id: 'atlantis',
                name: 'Atlantean Survivors',
                date: '9,600 BCE',
                rh: 85,
                position: [-150, 150, 0],
                children: [
                    {
                        id: 'egypt',
                        name: 'Egyptian Pharaohs',
                        date: '3,100 BCE',
                        rh: 65,
                        position: [-200, 100, 50],
                        children: [
                            {
                                id: 'akhenaten',
                                name: 'Akhenaten Lineage',
                                date: '1,350 BCE',
                                rh: 70,
                                position: [-250, 50, 100]
                            }
                        ]
                    },
                    {
                        id: 'maya',
                        name: 'Maya Elite',
                        date: '2,000 BCE',
                        rh: 60,
                        position: [-100, 100, -50],
                        children: [
                            {
                                id: 'olmec',
                                name: 'Olmec Rulers',
                                date: '1,200 BCE',
                                rh: 55,
                                position: [-50, 50, -100]
                            }
                        ]
                    }
                ]
            },
            {
                id: 'hyperborea',
                name: 'Hyperborean Descendants',
                date: '8,000 BCE',
                rh: 90,
                position: [150, 150, 0],
                children: [
                    {
                        id: 'celtic',
                        name: 'Celtic Druids',
                        date: '500 BCE',
                        rh: 45,
                        position: [200, 100, 50],
                        children: [
                            {
                                id: 'merovingian',
                                name: 'Merovingian Dynasty',
                                date: '450 CE',
                                rh: 50,
                                position: [250, 50, 100]
                            }
                        ]
                    },
                    {
                        id: 'norse',
                        name: 'Norse Royal Lines',
                        date: '100 CE',
                        rh: 40,
                        position: [100, 100, -50]
                    }
                ]
            },
            {
                id: 'lemuria',
                name: 'Lemurian Priesthood',
                date: '7,500 BCE',
                rh: 80,
                position: [0, 150, -100],
                children: [
                    {
                        id: 'tibet',
                        name: 'Tibetan Masters',
                        date: '600 BCE',
                        rh: 35,
                        position: [0, 100, -150]
                    },
                    {
                        id: 'inca',
                        name: 'Inca Nobility',
                        date: '1,200 CE',
                        rh: 30,
                        position: [-50, 100, -200]
                    }
                ]
            }
        ]
    }
};

function initBloodlineTree() {
    bloodlineContainer = document.getElementById('bloodline-tree-container');
    if (!bloodlineContainer) return;
    
    bloodlineContainer.innerHTML = '';
    
    setupBloodlineScene();
    createBloodlineTree();
    createRhDistribution();
    createActivationTimeline();
    createGeneticMarkers();
    setupBloodlineInteractions();
    animateBloodline();
}

function setupBloodlineScene() {
    const width = bloodlineContainer.clientWidth;
    const height = window.innerWidth <= 768 ? 400 : 600;
    const isMobile = window.mobileUtils && window.mobileUtils.isMobile();
    
    // Scene
    bloodlineScene = new THREE.Scene();
    bloodlineScene.background = new THREE.Color(0x000000);
    bloodlineScene.fog = new THREE.FogExp2(0x000000, 0.002);
    
    // Camera
    bloodlineCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    bloodlineCamera.position.set(0, 100, 400);
    bloodlineCamera.lookAt(0, 100, 0);
    
    // Renderer with mobile optimization
    bloodlineRenderer = new THREE.WebGLRenderer({ 
        antialias: !isMobile,
        alpha: true,
        powerPreference: isMobile ? "low-power" : "high-performance"
    });
    bloodlineRenderer.setSize(width, height);
    bloodlineRenderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    bloodlineRenderer.shadowMap.enabled = !isMobile;
    bloodlineRenderer.shadowMap.type = isMobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
    
    // Apply mobile optimizations
    if (window.mobileUtils) {
        window.mobileUtils.optimizeRenderer(bloodlineRenderer);
    }
    bloodlineContainer.appendChild(bloodlineRenderer.domElement);
    
    // Post-processing for glow effects
    bloodlineRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    bloodlineRenderer.toneMappingExposure = 1.5;
    
    // Controls with mobile support
    bloodlineControls = new THREE.OrbitControls(bloodlineCamera, bloodlineRenderer.domElement);
    bloodlineControls.enableDamping = true;
    bloodlineControls.dampingFactor = 0.05;
    bloodlineControls.maxPolarAngle = Math.PI * 0.85;
    bloodlineControls.minDistance = isMobile ? 150 : 100;
    bloodlineControls.maxDistance = isMobile ? 500 : 600;
    
    // Add mobile touch controls
    if (window.mobileUtils) {
        window.mobileUtils.addTouchControls(bloodlineControls);
    }
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x0a0a0a);
    bloodlineScene.add(ambientLight);
    
    // Key light with shadows
    const keyLight = new THREE.DirectionalLight(0x00ffcc, 0.5);
    keyLight.position.set(50, 100, 50);
    keyLight.castShadow = true;
    bloodlineScene.add(keyLight);
    
    // Rim lights for dramatic effect
    const rimLight1 = new THREE.DirectionalLight(0xff00ff, 0.3);
    rimLight1.position.set(-100, 50, -50);
    bloodlineScene.add(rimLight1);
    
    const rimLight2 = new THREE.DirectionalLight(0x00ff00, 0.2);
    rimLight2.position.set(100, 50, -50);
    bloodlineScene.add(rimLight2);
}

function createBloodlineTree() {
    createNode(bloodlineData.root, null);
    
    // Add floating DNA helixes
    createDNAHelixes();
    
    // Add energy field
    createBloodlineEnergyField();
}

function createNode(nodeData, parentPosition) {
    const nodeGroup = new THREE.Group();
    
    // Ultra-thin glowing ring
    const ringGeometry = new THREE.TorusGeometry(15, 0.3, 16, 100);
    const ringMaterial = new THREE.MeshPhysicalMaterial({
        color: getRhColor(nodeData.rh),
        emissive: getRhColor(nodeData.rh),
        emissiveIntensity: 0.5,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        transparent: true,
        opacity: 0.9
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.castShadow = true;
    nodeGroup.add(ring);
    
    // Inner glowing core
    const coreGeometry = new THREE.SphereGeometry(5, 32, 32);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: getRhColor(nodeData.rh),
        emissiveIntensity: 1.0,
        transparent: true,
        opacity: 0.8,
        metalness: 0.5,
        roughness: 0.0
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    nodeGroup.add(core);
    
    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(20, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            c: { value: 0.5 },
            p: { value: 2.5 },
            glowColor: { value: new THREE.Color(getRhColor(nodeData.rh)) },
            viewVector: { value: bloodlineCamera.position }
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
                gl_FragColor = vec4(glow, intensity);
            }
        `,
        transparent: true,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glowEffects.push(glow);
    nodeGroup.add(glow);
    
    // Position the node
    nodeGroup.position.set(...nodeData.position);
    
    // Add text label (ultra-thin font style)
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, 512, 128);
    
    context.font = '300 24px "Helvetica Neue", Arial'; // Ultra-light font
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.fillText(nodeData.name, 256, 50);
    context.font = '100 18px "Helvetica Neue", Arial'; // Ultra-thin
    context.fillText(nodeData.date, 256, 80);
    context.fillText(`RH-: ${nodeData.rh}%`, 256, 105);
    
    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.9
    });
    const label = new THREE.Sprite(labelMaterial);
    label.scale.set(60, 15, 1);
    label.position.y = 30;
    nodeGroup.add(label);
    
    // Store node data
    nodeGroup.userData = nodeData;
    nodeGroups[nodeData.id] = nodeGroup;
    
    // Add to scene
    bloodlineScene.add(nodeGroup);
    
    // Create ultra-thin connection to parent
    if (parentPosition) {
        createConnection(parentPosition, nodeData.position, nodeData.rh);
    }
    
    // Process children
    if (nodeData.children) {
        nodeData.children.forEach(child => {
            createNode(child, nodeData.position);
        });
    }
    
    // Add rotating particles around important nodes
    if (nodeData.rh > 70) {
        createNodeParticles(nodeGroup);
    }
}

function createConnection(start, end, rhLevel) {
    // Create ultra-thin glowing tube connection
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(...start),
        new THREE.Vector3(
            (start[0] + end[0]) / 2,
            (start[1] + end[1]) / 2 + 20,
            (start[2] + end[2]) / 2
        ),
        new THREE.Vector3(...end)
    ]);
    
    const tubeGeometry = new THREE.TubeGeometry(curve, 50, 0.5, 8, false);
    const tubeMaterial = new THREE.MeshPhysicalMaterial({
        color: getRhColor(rhLevel),
        emissive: getRhColor(rhLevel),
        emissiveIntensity: 0.3,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });
    
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    bloodlineScene.add(tube);
    connectionLines.push(tube);
    
    // Add flowing particles
    createFlowingParticles(curve, rhLevel);
}

function createFlowingParticles(curve, rhLevel) {
    const isMobile = window.mobileUtils && window.mobileUtils.isMobile();
    let particleCount = 20;
    if (window.mobileUtils) {
        particleCount = window.mobileUtils.optimizeParticles(particleCount);
    }
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        const t = i / particleCount;
        const point = curve.getPoint(t);
        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z;
        sizes[i] = Math.random() * 3 + 1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
        color: getRhColor(rhLevel),
        size: 2,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        vertexColors: false
    });
    
    const particles = new THREE.Points(geometry, material);
    particles.userData = { curve: curve, offset: Math.random() };
    bloodlineScene.add(particles);
    particleFlows.push(particles);
}

function createNodeParticles(nodeGroup) {
    const isMobile = window.mobileUtils && window.mobileUtils.isMobile();
    let particleCount = 30;
    if (window.mobileUtils) {
        particleCount = window.mobileUtils.optimizeParticles(particleCount);
    }
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 25 + Math.random() * 10;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.random() * 20 - 10;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0x00ffcc,
        size: 1,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(geometry, material);
    nodeGroup.add(particles);
}

function createDNAHelixes() {
    // Create floating DNA strands in the background
    for (let i = 0; i < 3; i++) {
        const helixGroup = new THREE.Group();
        
        const height = 200;
        const radius = 5;
        const turns = 3;
        
        // Create double helix
        for (let strand = 0; strand < 2; strand++) {
            const points = [];
            for (let j = 0; j <= 100; j++) {
                const t = j / 100;
                const angle = t * Math.PI * 2 * turns + (strand * Math.PI);
                const y = t * height - height / 2;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                points.push(new THREE.Vector3(x, y, z));
            }
            
            const curve = new THREE.CatmullRomCurve3(points);
            const tubeGeometry = new THREE.TubeGeometry(curve, 100, 0.3, 8, false);
            const tubeMaterial = new THREE.MeshPhysicalMaterial({
                color: strand === 0 ? 0x00ffcc : 0xff00ff,
                emissive: strand === 0 ? 0x00ffcc : 0xff00ff,
                emissiveIntensity: 0.2,
                metalness: 0.9,
                roughness: 0.1,
                transparent: true,
                opacity: 0.3
            });
            
            const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
            helixGroup.add(tube);
        }
        
        // Add connecting bars
        for (let j = 0; j < 20; j++) {
            const t = j / 20;
            const angle1 = t * Math.PI * 2 * turns;
            const angle2 = angle1 + Math.PI;
            const y = t * height - height / 2;
            
            const barGeometry = new THREE.CylinderGeometry(0.2, 0.2, radius * 2);
            const barMaterial = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 0.1,
                metalness: 0.8,
                roughness: 0.2,
                transparent: true,
                opacity: 0.2
            });
            
            const bar = new THREE.Mesh(barGeometry, barMaterial);
            bar.position.y = y;
            bar.rotation.z = angle1;
            helixGroup.add(bar);
        }
        
        helixGroup.position.set(
            (i - 1) * 200,
            100,
            -150
        );
        helixGroup.rotation.y = Math.random() * Math.PI;
        helixGroup.userData = { rotationSpeed: 0.001 + Math.random() * 0.002 };
        bloodlineScene.add(helixGroup);
    }
}

function createBloodlineEnergyField() {
    // Create ambient energy field particles
    const fieldParticles = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(fieldParticles * 3);
    const colors = new Float32Array(fieldParticles * 3);
    
    for (let i = 0; i < fieldParticles; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 600;
        positions[i * 3 + 1] = Math.random() * 400 - 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 600;
        
        const color = new THREE.Color(Math.random() > 0.5 ? 0x00ffcc : 0xff00ff);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    
    const field = new THREE.Points(geometry, material);
    bloodlineScene.add(field);
}

function createRhDistribution() {
    const container = document.getElementById('rh-distribution');
    if (!container) return;
    
    // Create ultra-thin bar chart
    const width = container.clientWidth;
    const height = 200;
    
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const data = [
        { region: 'Basque', percentage: 35 },
        { region: 'Celtic', percentage: 16 },
        { region: 'Nordic', percentage: 15 },
        { region: 'Berber', percentage: 18 },
        { region: 'Global Avg', percentage: 7 }
    ];
    
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.region))
        .range([40, width - 20])
        .padding(0.3);
    
    const yScale = d3.scaleLinear()
        .domain([0, 40])
        .range([height - 30, 20]);
    
    // Ultra-thin bars
    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.region))
        .attr('y', height - 30)
        .attr('width', xScale.bandwidth())
        .attr('height', 0)
        .attr('fill', 'none')
        .attr('stroke', d => d.percentage > 15 ? '#ff00ff' : '#00ffcc')
        .attr('stroke-width', 0.5)
        .transition()
        .duration(1000)
        .attr('y', d => yScale(d.percentage))
        .attr('height', d => height - 30 - yScale(d.percentage));
    
    // Add percentage labels
    svg.selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('x', d => xScale(d.region) + xScale.bandwidth() / 2)
        .attr('y', d => yScale(d.percentage) - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .attr('font-size', '11px')
        .attr('font-weight', '100')
        .text(d => d.percentage + '%');
    
    // X-axis labels
    svg.selectAll('.x-label')
        .data(data)
        .enter()
        .append('text')
        .attr('x', d => xScale(d.region) + xScale.bandwidth() / 2)
        .attr('y', height - 10)
        .attr('text-anchor', 'middle')
        .attr('fill', '#888')
        .attr('font-size', '10px')
        .attr('font-weight', '300')
        .text(d => d.region);
}

function createActivationTimeline() {
    const container = document.getElementById('activation-timeline');
    if (!container) return;
    
    const width = container.clientWidth;
    const height = 200;
    
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Timeline data
    const events = [
        { year: 2012, event: 'Mayan Calendar End', intensity: 0.3 },
        { year: 2020, event: 'Global Awakening', intensity: 0.6 },
        { year: 2024, event: 'Genetic Activation', intensity: 0.8 },
        { year: 2030, event: 'Full Disclosure', intensity: 1.0 }
    ];
    
    const xScale = d3.scaleLinear()
        .domain([2010, 2035])
        .range([40, width - 40]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height - 40, 20]);
    
    // Create ultra-thin timeline line
    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.intensity))
        .curve(d3.curveMonotoneX);
    
    // Add glow effect
    const defs = svg.append('defs');
    const filter = defs.append('filter')
        .attr('id', 'glow');
    filter.append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode')
        .attr('in', 'coloredBlur');
    feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');
    
    // Draw timeline
    svg.append('path')
        .datum(events)
        .attr('fill', 'none')
        .attr('stroke', '#00ffcc')
        .attr('stroke-width', 0.5)
        .attr('filter', 'url(#glow)')
        .attr('d', line);
    
    // Add event markers
    svg.selectAll('.event-marker')
        .data(events)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.year))
        .attr('cy', d => yScale(d.intensity))
        .attr('r', 0)
        .attr('fill', 'none')
        .attr('stroke', '#ff00ff')
        .attr('stroke-width', 0.5)
        .transition()
        .delay((d, i) => i * 200)
        .duration(500)
        .attr('r', 6);
    
    // Add labels
    svg.selectAll('.event-label')
        .data(events)
        .enter()
        .append('text')
        .attr('x', d => xScale(d.year))
        .attr('y', d => yScale(d.intensity) - 15)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .attr('font-size', '10px')
        .attr('font-weight', '100')
        .attr('opacity', 0)
        .text(d => d.event)
        .transition()
        .delay((d, i) => i * 200 + 300)
        .duration(500)
        .attr('opacity', 0.8);
    
    // Year labels
    svg.selectAll('.year-label')
        .data(events)
        .enter()
        .append('text')
        .attr('x', d => xScale(d.year))
        .attr('y', height - 20)
        .attr('text-anchor', 'middle')
        .attr('fill', '#666')
        .attr('font-size', '9px')
        .attr('font-weight', '300')
        .text(d => d.year);
}

function createGeneticMarkers() {
    // Add genetic marker indicators to the scene
    const markerData = [
        { marker: 'FOXP2', position: [-100, 0, 100], color: 0x00ff00 },
        { marker: 'MAOA-2R', position: [100, 0, 100], color: 0xff0000 },
        { marker: 'DRD4-7R', position: [0, 0, -100], color: 0x0000ff }
    ];
    
    markerData.forEach(data => {
        const group = new THREE.Group();
        
        // Create marker visualization
        const geometry = new THREE.OctahedronGeometry(5, 0);
        const material = new THREE.MeshPhysicalMaterial({
            color: data.color,
            emissive: data.color,
            emissiveIntensity: 0.5,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.8
        });
        
        const marker = new THREE.Mesh(geometry, material);
        group.add(marker);
        
        // Add label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.font = '100 20px "Helvetica Neue", Arial';
        context.fillStyle = '#ffffff';
        context.textAlign = 'center';
        context.fillText(data.marker, 128, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        const label = new THREE.Sprite(labelMaterial);
        label.scale.set(40, 10, 1);
        label.position.y = 15;
        group.add(label);
        
        group.position.set(...data.position);
        bloodlineScene.add(group);
    });
}

function setupBloodlineInteractions() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    bloodlineContainer.addEventListener('mousemove', (event) => {
        const rect = bloodlineContainer.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, bloodlineCamera);
        
        const intersects = raycaster.intersectObjects(Object.values(nodeGroups), true);
        
        if (intersects.length > 0) {
            bloodlineContainer.style.cursor = 'pointer';
            
            const node = intersects[0].object.parent;
            if (node !== selectedNode) {
                if (selectedNode) {
                    // Reset previous selection
                    selectedNode.scale.set(1, 1, 1);
                }
                selectedNode = node;
                // Highlight selected node
                node.scale.set(1.2, 1.2, 1.2);
            }
        } else {
            bloodlineContainer.style.cursor = 'default';
            if (selectedNode) {
                selectedNode.scale.set(1, 1, 1);
                selectedNode = null;
            }
        }
    });
    
    bloodlineContainer.addEventListener('click', (event) => {
        if (selectedNode && selectedNode.userData) {
            showBloodlineDetails(selectedNode.userData);
        }
    });
}

function showBloodlineDetails(nodeData) {
    // Create or update details panel
    let detailsPanel = document.getElementById('bloodline-details');
    if (!detailsPanel) {
        detailsPanel = document.createElement('div');
        detailsPanel.id = 'bloodline-details';
        detailsPanel.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #00ffcc;
            padding: 20px;
            color: #fff;
            font-family: 'Helvetica Neue', Arial, sans-serif;
            font-weight: 100;
            max-width: 300px;
            box-shadow: 0 0 20px rgba(0, 255, 204, 0.3);
        `;
        bloodlineContainer.appendChild(detailsPanel);
    }
    
    detailsPanel.innerHTML = `
        <h3 style="color: #00ffcc; margin-top: 0; font-weight: 300;">${nodeData.name}</h3>
        <p style="color: #888; font-size: 14px;">${nodeData.date}</p>
        <div style="margin: 15px 0;">
            <div style="background: rgba(255, 0, 255, 0.2); padding: 10px; margin: 5px 0; border-left: 2px solid #ff00ff;">
                <strong>RH Negative:</strong> ${nodeData.rh}%
            </div>
        </div>
        <p style="font-size: 12px; line-height: 1.6; color: #ccc;">
            ${getBloodlineDescription(nodeData.id)}
        </p>
        <button onclick="closeBloodlineDetails()" style="
            background: none;
            border: 1px solid #00ffcc;
            color: #00ffcc;
            padding: 5px 15px;
            margin-top: 10px;
            cursor: pointer;
            font-family: inherit;
            font-weight: 100;
        ">Close</button>
    `;
}

function getBloodlineDescription(id) {
    const descriptions = {
        'origin': 'The original advanced civilization before the great cataclysm. Pure RH negative bloodline with full genetic activation.',
        'atlantis': 'Survivors of the Atlantean destruction who preserved the ancient knowledge and genetic codes.',
        'hyperborea': 'Northern descendants who maintained the purest bloodlines through isolation and selective breeding.',
        'lemuria': 'Pacific survivors who developed unique psychic abilities and maintained connection to inner Earth.',
        'egypt': 'Pharaonic bloodlines engineered to rule. Elongated skulls and advanced consciousness.',
        'celtic': 'Druidic priest class maintaining star knowledge and earth grid activation codes.',
        'maya': 'Time keepers and calendar masters with advanced astronomical knowledge.',
        'tibet': 'Masters of consciousness and keepers of the inner Earth entrances.',
        'merovingian': 'The sacred bloodline of European royalty claiming divine right to rule.',
        'norse': 'Warrior bloodlines with enhanced strength and connection to the gods.',
        'inca': 'Solar dynasty with advanced metallurgy and anti-gravity technology.',
        'olmec': 'The mother culture with direct African-Atlantean connections.',
        'akhenaten': 'The heretic pharaoh who tried to restore monotheistic sun worship and original teachings.'
    };
    
    return descriptions[id] || 'Ancient bloodline with unique genetic markers and consciousness potential.';
}

window.closeBloodlineDetails = function() {
    const panel = document.getElementById('bloodline-details');
    if (panel) panel.remove();
};

function getRhColor(rhPercentage) {
    if (rhPercentage > 70) return 0xff00ff;
    if (rhPercentage > 50) return 0xff66cc;
    if (rhPercentage > 30) return 0x00ffcc;
    return 0x00ff66;
}

function animateBloodline() {
    animationFrame = requestAnimationFrame(animateBloodline);
    
    // Update controls
    bloodlineControls.update();
    
    // Rotate DNA helixes
    bloodlineScene.children.forEach(child => {
        if (child.userData.rotationSpeed) {
            child.rotation.y += child.userData.rotationSpeed;
        }
    });
    
    // Animate particle flows along connections
    particleFlows.forEach((particles, index) => {
        if (particles.userData.curve) {
            particles.userData.offset += 0.005;
            if (particles.userData.offset > 1) particles.userData.offset = 0;
            
            const positions = particles.geometry.attributes.position.array;
            const particleCount = positions.length / 3;
            
            for (let i = 0; i < particleCount; i++) {
                const t = (i / particleCount + particles.userData.offset) % 1;
                const point = particles.userData.curve.getPoint(t);
                positions[i * 3] = point.x;
                positions[i * 3 + 1] = point.y;
                positions[i * 3 + 2] = point.z;
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
        }
    });
    
    // Pulse selected node
    if (selectedNode) {
        const scale = 1.2 + Math.sin(Date.now() * 0.003) * 0.05;
        selectedNode.scale.set(scale, scale, scale);
    }
    
    // Update glow effects
    glowEffects.forEach(glow => {
        if (glow.material.uniforms && glow.material.uniforms.viewVector) {
            glow.material.uniforms.viewVector.value = new THREE.Vector3()
                .subVectors(bloodlineCamera.position, glow.position);
        }
    });
    
    // Rotate node particles
    Object.values(nodeGroups).forEach(group => {
        group.children.forEach(child => {
            if (child.type === 'Points' && child.geometry.attributes.position.count === 30) {
                child.rotation.y += 0.002;
            }
        });
    });
    
    // Render
    bloodlineRenderer.render(bloodlineScene, bloodlineCamera);
}

function cleanupBloodlineTree() {
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    
    if (bloodlineScene) {
        bloodlineScene.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
        bloodlineScene.clear();
    }
    
    if (bloodlineRenderer) {
        bloodlineRenderer.dispose();
    }
    
    nodeGroups = {};
    connectionLines = [];
    particleFlows = [];
    glowEffects = [];
    selectedNode = null;
}

// Handle window resize
function handleBloodlineResize() {
    if (!bloodlineContainer || !bloodlineRenderer || !bloodlineCamera) return;
    
    const width = bloodlineContainer.clientWidth;
    const height = window.innerWidth <= 768 ? 400 : 600;
    
    bloodlineCamera.aspect = width / height;
    bloodlineCamera.updateProjectionMatrix();
    bloodlineRenderer.setSize(width, height);
}

// Add resize listener with debouncing
let bloodlineResizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(bloodlineResizeTimeout);
    bloodlineResizeTimeout = setTimeout(() => {
        if (bloodlineContainer && bloodlineRenderer) {
            if (window.mobileUtils && window.mobileUtils.isMobile()) {
                window.mobileUtils.handleResize(handleBloodlineResize);
            } else {
                handleBloodlineResize();
            }
        }
    }, 250);
});

// Export functions
window.initBloodlineTree = initBloodlineTree;
window.cleanupBloodlineTree = cleanupBloodlineTree;