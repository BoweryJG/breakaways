// Antarctic Revelation - Multi-Layered Truth Map
// Exposing what lies beneath the ice

let antarcticMap;
let currentLayer = 'surface';
let timelineYear = 2024;
let layers = {};
let overlays = {};
let markers = {};
let heatmapLayer;
let isPlaying = false;
let playInterval;

// Antarctic bounds
const antarcticBounds = [[-90, -180], [-60, 180]];
const mapCenter = [-75, 0];

// Color schemes for cyberpunk aesthetic
const colors = {
    ice: '#00ffcc',
    bedrock: '#ff00ff',
    underground: '#ffaa00',
    ancient: '#ff0066',
    nazi: '#ff3333',
    highjump: '#00aaff',
    restricted: '#ff0000',
    thermal: '#ffff00',
    magnetic: '#aa00ff',
    pyramid: '#00ff00',
    lake: '#0099ff'
};

function initAntarcticRevelation() {
    const container = document.getElementById('antarctica-layers');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Create map container
    const mapDiv = document.createElement('div');
    mapDiv.id = 'antarctic-map';
    mapDiv.style.width = '100%';
    mapDiv.style.height = '600px';
    container.appendChild(mapDiv);
    
    // Initialize Leaflet map
    initializeMap();
    
    // Load all data layers
    loadDataLayers();
    
    // Create controls
    createLayerControls();
    createTimelineControls();
    
    // Add info panel
    createInfoPanel();
    
    // Start with surface layer
    showLayer('surface');
}

function initializeMap() {
    // Create map with dark theme
    antarcticMap = L.map('antarctic-map', {
        center: mapCenter,
        zoom: 3,
        minZoom: 2,
        maxZoom: 8,
        worldCopyJump: false,
        maxBounds: [[-90, -360], [-30, 360]]
    });
    
    // Add dark tile layer with mobile optimization
    const isMobileLayer = window.mobileUtils && window.mobileUtils.isMobile();
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: 'Hidden Truth Revealed',
        subdomains: 'abcd',
        maxZoom: isMobileLayer ? 15 : 19,
        detectRetina: !isMobileLayer // Disable retina on mobile for performance
    }).addTo(antarcticMap);
    
    // Add custom CSS for cyberpunk styling
    addMapStyling();
}

function addMapStyling() {
    const style = document.createElement('style');
    style.textContent = `
        #antarctic-map {
            background: #0a0a0a;
            border: 2px solid ${colors.ice};
            box-shadow: 0 0 20px ${colors.ice};
        }
        
        .leaflet-container {
            background: #0a0a0a;
            font-family: 'Courier New', monospace;
        }
        
        .leaflet-popup-content-wrapper {
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid ${colors.ice};
            box-shadow: 0 0 10px ${colors.ice};
        }
        
        .leaflet-popup-content {
            color: ${colors.ice};
            font-size: 12px;
        }
        
        .leaflet-popup-tip {
            background: rgba(0, 0, 0, 0.9);
            border-color: ${colors.ice};
        }
        
        .layer-control {
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid ${colors.ice};
            padding: 15px;
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 1000;
            color: #e0e0e0;
        }
        
        .layer-btn {
            display: block;
            width: 100%;
            padding: 8px;
            margin: 5px 0;
            background: #1a1a1a;
            border: 1px solid #2a2a2a;
            color: #e0e0e0;
            cursor: pointer;
            transition: all 0.3s;
            font-family: 'Courier New', monospace;
            text-transform: uppercase;
            font-size: 12px;
        }
        
        .layer-btn:hover {
            background: ${colors.ice};
            color: #0a0a0a;
            transform: translateX(-2px);
            box-shadow: 2px 0 10px ${colors.ice};
        }
        
        .layer-btn.active {
            background: ${colors.ice};
            color: #0a0a0a;
            font-weight: bold;
        }
        
        .timeline-control {
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid ${colors.ice};
            padding: 15px;
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            width: 80%;
            max-width: 600px;
        }
        
        .info-panel {
            background: rgba(0, 0, 0, 0.95);
            border: 1px solid ${colors.ice};
            padding: 20px;
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 1000;
            max-width: 300px;
            color: #e0e0e0;
            display: none;
        }
        
        .info-panel.active {
            display: block;
        }
        
        .anomaly-marker {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        .restricted-zone {
            fill: ${colors.restricted};
            fill-opacity: 0.3;
            stroke: ${colors.restricted};
            stroke-width: 2;
            stroke-dasharray: 5, 5;
            animation: dash 20s linear infinite;
        }
        
        @keyframes dash {
            to { stroke-dashoffset: -100; }
        }
    `;
    document.head.appendChild(style);
}

function loadDataLayers() {
    // Surface ice layer
    layers.surface = createIceSurfaceLayer();
    
    // Bedrock topography layer
    layers.bedrock = createBedrockLayer();
    
    // Underground structures layer
    layers.underground = createUndergroundLayer();
    
    // Load overlay data
    loadPreFreezeRemains();
    loadNaziExpeditions();
    loadOperationHighjump();
    loadRestrictedZones();
    loadThermalAnomalies();
    loadUndergroundLakes();
    loadPyramidStructures();
    loadMagneticAnomalies();
}

function createIceSurfaceLayer() {
    const icePolygons = [
        // Simplified Antarctic ice sheet outline
        [[-90, -180], [-90, 180], [-75, 180], [-70, 90], [-65, 0], [-70, -90], [-75, -180], [-90, -180]]
    ];
    
    return L.polygon(icePolygons, {
        color: colors.ice,
        weight: 2,
        opacity: 0.8,
        fillColor: colors.ice,
        fillOpacity: 0.2
    });
}

function createBedrockLayer() {
    // Bedrock topography showing land beneath ice
    const bedrockFeatures = L.layerGroup();
    
    // Major mountain ranges
    const transantarcticMountains = L.polyline([
        [-84, 170], [-82, 160], [-80, 140], [-78, 120], [-76, 100], [-74, 80]
    ], {
        color: colors.bedrock,
        weight: 3,
        opacity: 0.8
    }).bindPopup('Transantarctic Mountains<br>Ancient geological boundary<br>Contains pre-freeze artifacts');
    
    bedrockFeatures.addLayer(transantarcticMountains);
    
    // Subglacial basins
    const wilkesBasin = L.circle([-74, 120], {
        radius: 500000,
        color: colors.bedrock,
        fillColor: colors.bedrock,
        fillOpacity: 0.3
    }).bindPopup('Wilkes Subglacial Basin<br>Impact crater from ancient cataclysm<br>Contains metallic anomalies');
    
    bedrockFeatures.addLayer(wilkesBasin);
    
    return bedrockFeatures;
}

function createUndergroundLayer() {
    const undergroundFeatures = L.layerGroup();
    
    // Deep underground tunnel network
    const tunnelPaths = [
        // Main arterial tunnels
        [[-75, 0], [-78, 30], [-80, 60], [-82, 90]],
        [[-75, 0], [-77, -30], [-79, -60], [-81, -90]],
        [[-75, 0], [-73, -120], [-71, -150], [-70, 180]],
        // Cross connections
        [[-78, 30], [-78, -30]],
        [[-80, 60], [-80, -60]],
        [[-82, 90], [-82, -90]]
    ];
    
    tunnelPaths.forEach(path => {
        const tunnel = L.polyline(path, {
            color: colors.underground,
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 5'
        }).bindPopup('Underground Maglev Tunnel<br>Depth: 2-5km<br>Connects major installations');
        undergroundFeatures.addLayer(tunnel);
    });
    
    // Major underground bases
    const bases = [
        {coords: [-75, 0], name: 'Central Command', depth: '3km'},
        {coords: [-80, 45], name: 'Research Alpha', depth: '2.5km'},
        {coords: [-77, -60], name: 'Mining Complex', depth: '4km'},
        {coords: [-82, 120], name: 'Energy Station', depth: '5km'}
    ];
    
    bases.forEach(base => {
        const marker = L.circleMarker(base.coords, {
            radius: 10,
            color: colors.underground,
            fillColor: colors.underground,
            fillOpacity: 0.8
        }).bindPopup(`<b>${base.name}</b><br>Depth: ${base.depth}<br>Status: CLASSIFIED`);
        undergroundFeatures.addLayer(marker);
    });
    
    return undergroundFeatures;
}

function loadPreFreezeRemains() {
    overlays.preFreezeRemains = L.layerGroup();
    
    const ancientSites = [
        {coords: [-71.95, 23.35], name: 'Pre-Flood City Complex', age: '12,000+ years'},
        {coords: [-79.47, -83.25], name: 'Crystal Power Station', age: '15,000+ years'},
        {coords: [-69.37, 76.38], name: 'Star Navigation Temple', age: '11,000+ years'},
        {coords: [-81.5, 111.5], name: 'Genetic Laboratory', age: '13,000+ years'}
    ];
    
    ancientSites.forEach(site => {
        const marker = L.marker(site.coords, {
            icon: L.divIcon({
                className: 'ancient-marker',
                html: `<div style="color: ${colors.ancient}; font-size: 20px;">⬟</div>`,
                iconSize: [20, 20]
            })
        }).bindPopup(`<b>${site.name}</b><br>Estimated age: ${site.age}<br>Advanced technology detected`);
        overlays.preFreezeRemains.addLayer(marker);
    });
}

function loadNaziExpeditions() {
    overlays.naziRoutes = L.layerGroup();
    
    // Neuschwabenland expedition routes
    const expeditionRoutes = [
        {
            path: [[-70, 0], [-71, 5], [-72, 10], [-73, 15], [-74, 20]],
            year: 1939,
            ship: 'MS Schwabenland'
        },
        {
            path: [[-69, -10], [-70, -5], [-71, 0], [-72, 5]],
            year: 1942,
            ship: 'U-boat convoy'
        }
    ];
    
    expeditionRoutes.forEach(route => {
        const line = L.polyline(route.path, {
            color: colors.nazi,
            weight: 3,
            opacity: 0.7,
            dashArray: '5, 10'
        }).bindPopup(`Nazi Expedition ${route.year}<br>Vessel: ${route.ship}<br>Mission: CLASSIFIED`);
        overlays.naziRoutes.addLayer(line);
    });
    
    // Base 211 location
    const base211 = L.circleMarker([-71, 2], {
        radius: 15,
        color: colors.nazi,
        fillColor: colors.nazi,
        fillOpacity: 0.6
    }).bindPopup('Base 211<br>Established: 1942<br>Status: Unknown<br>Deep underground facility');
    overlays.naziRoutes.addLayer(base211);
}

function loadOperationHighjump() {
    overlays.highjump = L.layerGroup();
    
    // Battle locations
    const battles = [
        {coords: [-68.5, 2.5], desc: 'First Contact - UFO engagement', losses: '3 aircraft'},
        {coords: [-70.2, -5.3], desc: 'Destroyer attacked', losses: 'USS Murdoch damaged'},
        {coords: [-72.8, 10.1], desc: 'Aerial dogfight', losses: '2 fighters downed'}
    ];
    
    battles.forEach(battle => {
        const marker = L.marker(battle.coords, {
            icon: L.divIcon({
                className: 'battle-marker',
                html: `<div style="color: ${colors.highjump}; font-size: 24px;">⚔</div>`,
                iconSize: [24, 24]
            })
        }).bindPopup(`<b>Battle Site</b><br>${battle.desc}<br>Losses: ${battle.losses}`);
        overlays.highjump.addLayer(marker);
    });
    
    // Fleet route
    const fleetPath = L.polyline([
        [-60, -60], [-65, -40], [-68, -20], [-70, 0], [-68, 20], [-65, 40], [-60, 60]
    ], {
        color: colors.highjump,
        weight: 2,
        opacity: 0.6
    }).bindPopup('Operation Highjump Fleet Path<br>4,700 personnel<br>13 ships<br>33 aircraft');
    overlays.highjump.addLayer(fleetPath);
}

function loadRestrictedZones() {
    overlays.restricted = L.layerGroup();
    
    const noFlyZones = [
        {
            coords: [[-74, -5], [-70, -5], [-70, 10], [-74, 10]],
            name: 'Sector Alpha',
            reason: 'Electromagnetic interference'
        },
        {
            coords: [[-80, 100], [-77, 100], [-77, 120], [-80, 120]],
            name: 'Sector Omega',
            reason: 'Temporal anomalies detected'
        },
        {
            coords: [[-72, -90], [-69, -90], [-69, -70], [-72, -70]],
            name: 'Sector Zeta',
            reason: 'Extreme radiation levels'
        }
    ];
    
    noFlyZones.forEach(zone => {
        const polygon = L.polygon(zone.coords, {
            color: colors.restricted,
            weight: 2,
            opacity: 0.8,
            fillColor: colors.restricted,
            fillOpacity: 0.3,
            className: 'restricted-zone'
        }).bindPopup(`<b>${zone.name}</b><br>ACCESS DENIED<br>Reason: ${zone.reason}`);
        overlays.restricted.addLayer(polygon);
    });
}

function loadThermalAnomalies() {
    // Create heatmap data
    const thermalData = [
        {lat: -75, lng: 0, intensity: 0.9},
        {lat: -72, lng: 15, intensity: 0.7},
        {lat: -78, lng: -45, intensity: 0.8},
        {lat: -70, lng: 90, intensity: 0.6},
        {lat: -82, lng: -120, intensity: 0.85},
        {lat: -69, lng: 160, intensity: 0.75}
    ];
    
    // Convert to heatmap format
    const heatPoints = thermalData.map(point => [point.lat, point.lng, point.intensity]);
    
    // Create heatmap layer
    heatmapLayer = L.heatLayer(heatPoints, {
        radius: 50,
        blur: 30,
        maxZoom: 17,
        gradient: {
            0.0: 'blue',
            0.3: 'cyan',
            0.5: 'yellow',
            0.7: 'orange',
            0.9: 'red',
            1.0: 'white'
        }
    });
}

function loadUndergroundLakes() {
    overlays.lakes = L.layerGroup();
    
    const lakes = [
        {
            coords: [-77.5, 106.8],
            name: 'Lake Vostok',
            depth: '4km below surface',
            temp: '89°F',
            anomaly: 'Magnetic anomaly at north end'
        },
        {
            coords: [-69, 120],
            name: 'Lake Concordia',
            depth: '3.5km below surface',
            temp: '72°F',
            anomaly: 'Unknown metallic mass detected'
        },
        {
            coords: [-81, 155],
            name: 'Lake Whillans',
            depth: '2.5km below surface',
            temp: '65°F',
            anomaly: 'Microbial life unlike any on surface'
        }
    ];
    
    lakes.forEach(lake => {
        const marker = L.circleMarker(lake.coords, {
            radius: 20,
            color: colors.lake,
            fillColor: colors.lake,
            fillOpacity: 0.5
        }).bindPopup(`<b>${lake.name}</b><br>Depth: ${lake.depth}<br>Temperature: ${lake.temp}<br>Anomaly: ${lake.anomaly}`);
        overlays.lakes.addLayer(marker);
    });
}

function loadPyramidStructures() {
    overlays.pyramids = L.layerGroup();
    
    const pyramids = [
        {
            coords: [-79.977, -81.962],
            name: 'Primary Pyramid Complex',
            height: '1.2km',
            alignment: 'Orion constellation'
        },
        {
            coords: [-71.945, 13.42],
            name: 'Eastern Pyramid',
            height: '800m',
            alignment: 'Magnetic north (pre-shift)'
        },
        {
            coords: [-84.23, 164.13],
            name: 'Subglacial Pyramid',
            height: '600m',
            alignment: 'Unknown star system'
        }
    ];
    
    pyramids.forEach(pyramid => {
        const marker = L.marker(pyramid.coords, {
            icon: L.divIcon({
                className: 'pyramid-marker',
                html: `<div style="color: ${colors.pyramid}; font-size: 24px;">▲</div>`,
                iconSize: [24, 24]
            })
        }).bindPopup(`<b>${pyramid.name}</b><br>Height: ${pyramid.height}<br>Stellar alignment: ${pyramid.alignment}<br>Energy signature: ACTIVE`);
        overlays.pyramids.addLayer(marker);
    });
}

function loadMagneticAnomalies() {
    overlays.magnetic = L.layerGroup();
    
    const anomalies = [
        {
            center: [-80, 120],
            radius: 100000,
            strength: 'Extreme',
            effect: 'Compass deviation 180°'
        },
        {
            center: [-70, -45],
            radius: 75000,
            strength: 'High',
            effect: 'Electronic interference'
        },
        {
            center: [-75, 60],
            radius: 50000,
            strength: 'Moderate',
            effect: 'Navigation errors'
        }
    ];
    
    anomalies.forEach(anomaly => {
        const circle = L.circle(anomaly.center, {
            radius: anomaly.radius,
            color: colors.magnetic,
            fillColor: colors.magnetic,
            fillOpacity: 0.2,
            weight: 2,
            dashArray: '10, 5'
        }).bindPopup(`<b>Magnetic Anomaly</b><br>Strength: ${anomaly.strength}<br>Effect: ${anomaly.effect}`);
        overlays.magnetic.addLayer(circle);
    });
}

function createLayerControls() {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'layer-control';
    controlDiv.innerHTML = `
        <h4 style="margin-top: 0; color: ${colors.ice};">LAYERS</h4>
        <button class="layer-btn active" data-layer="surface">Ice Surface</button>
        <button class="layer-btn" data-layer="bedrock">Bedrock</button>
        <button class="layer-btn" data-layer="underground">Underground</button>
        <hr style="border-color: ${colors.ice}; margin: 10px 0;">
        <h4 style="color: ${colors.ice};">OVERLAYS</h4>
        <label style="display: block; margin: 5px 0;">
            <input type="checkbox" id="pre-freeze" checked> Ancient Remains
        </label>
        <label style="display: block; margin: 5px 0;">
            <input type="checkbox" id="nazi-routes" checked> Nazi Expeditions
        </label>
        <label style="display: block; margin: 5px 0;">
            <input type="checkbox" id="highjump" checked> Operation Highjump
        </label>
        <label style="display: block; margin: 5px 0;">
            <input type="checkbox" id="restricted" checked> No-Fly Zones
        </label>
        <label style="display: block; margin: 5px 0;">
            <input type="checkbox" id="thermal" checked> Thermal Anomalies
        </label>
        <label style="display: block; margin: 5px 0;">
            <input type="checkbox" id="lakes" checked> Underground Lakes
        </label>
        <label style="display: block; margin: 5px 0;">
            <input type="checkbox" id="pyramids" checked> Pyramid Structures
        </label>
        <label style="display: block; margin: 5px 0;">
            <input type="checkbox" id="magnetic" checked> Magnetic Anomalies
        </label>
    `;
    
    document.getElementById('antarctic-map').appendChild(controlDiv);
    
    // Layer button handlers
    controlDiv.querySelectorAll('.layer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            showLayer(e.target.dataset.layer);
        });
    });
    
    // Overlay checkbox handlers
    document.getElementById('pre-freeze').addEventListener('change', (e) => {
        toggleOverlay('preFreezeRemains', e.target.checked);
    });
    
    document.getElementById('nazi-routes').addEventListener('change', (e) => {
        toggleOverlay('naziRoutes', e.target.checked);
    });
    
    document.getElementById('highjump').addEventListener('change', (e) => {
        toggleOverlay('highjump', e.target.checked);
    });
    
    document.getElementById('restricted').addEventListener('change', (e) => {
        toggleOverlay('restricted', e.target.checked);
    });
    
    document.getElementById('thermal').addEventListener('change', (e) => {
        if (e.target.checked) {
            antarcticMap.addLayer(heatmapLayer);
        } else {
            antarcticMap.removeLayer(heatmapLayer);
        }
    });
    
    document.getElementById('lakes').addEventListener('change', (e) => {
        toggleOverlay('lakes', e.target.checked);
    });
    
    document.getElementById('pyramids').addEventListener('change', (e) => {
        toggleOverlay('pyramids', e.target.checked);
    });
    
    document.getElementById('magnetic').addEventListener('change', (e) => {
        toggleOverlay('magnetic', e.target.checked);
    });
}

function createTimelineControls() {
    const timelineDiv = document.createElement('div');
    timelineDiv.className = 'timeline-control';
    timelineDiv.innerHTML = `
        <h4 style="margin: 0 0 10px 0; color: ${colors.ice};">ICE COVERAGE TIMELINE</h4>
        <div style="display: flex; align-items: center; gap: 20px;">
            <span style="color: ${colors.ice};">12,000 BCE</span>
            <input type="range" id="timeline-slider" min="-12000" max="2024" value="2024" style="flex: 1;">
            <span style="color: ${colors.ice};" id="timeline-year">2024 CE</span>
            <button id="play-timeline" style="margin-left: 20px;">PLAY</button>
        </div>
        <div style="margin-top: 10px; font-size: 12px; color: #a0a0a0;">
            <span id="timeline-event">Current configuration</span>
        </div>
    `;
    
    document.getElementById('antarctic-map').appendChild(timelineDiv);
    
    const slider = document.getElementById('timeline-slider');
    const yearDisplay = document.getElementById('timeline-year');
    const eventDisplay = document.getElementById('timeline-event');
    const playButton = document.getElementById('play-timeline');
    
    slider.addEventListener('input', (e) => {
        timelineYear = parseInt(e.target.value);
        updateTimelineDisplay();
    });
    
    playButton.addEventListener('click', () => {
        if (isPlaying) {
            stopTimeline();
        } else {
            playTimeline();
        }
    });
    
    function updateTimelineDisplay() {
        const displayYear = timelineYear < 0 ? 
            `${Math.abs(timelineYear)} BCE` : 
            `${timelineYear} CE`;
        yearDisplay.textContent = displayYear;
        
        // Update event description
        let event = 'Current configuration';
        if (timelineYear < -11000) event = 'Pre-flood advanced civilization';
        else if (timelineYear < -10000) event = 'Great cataclysm begins';
        else if (timelineYear < -8000) event = 'Flash freezing event';
        else if (timelineYear < -6000) event = 'Ice sheet formation';
        else if (timelineYear < 0) event = 'Complete glaciation';
        else if (timelineYear < 1939) event = 'Hidden beneath ice';
        else if (timelineYear < 1946) event = 'Nazi expeditions';
        else if (timelineYear < 1947) event = 'Operation Highjump';
        else if (timelineYear < 1959) event = 'International lockdown begins';
        else if (timelineYear < 2000) event = 'Antarctic Treaty - Truth suppressed';
        else event = 'Accelerated melting reveals secrets';
        
        eventDisplay.textContent = event;
        
        // Update ice coverage
        updateIceCoverage();
    }
    
    function playTimeline() {
        isPlaying = true;
        playButton.textContent = 'PAUSE';
        slider.value = -12000;
        
        playInterval = setInterval(() => {
            timelineYear += 100;
            if (timelineYear > 2024) {
                stopTimeline();
                return;
            }
            slider.value = timelineYear;
            updateTimelineDisplay();
        }, 50);
    }
    
    function stopTimeline() {
        isPlaying = false;
        playButton.textContent = 'PLAY';
        clearInterval(playInterval);
    }
}

function updateIceCoverage() {
    // Adjust ice opacity based on timeline
    let iceOpacity = 0.2;
    if (timelineYear < -10000) {
        iceOpacity = 0; // No ice, show land
    } else if (timelineYear < -8000) {
        iceOpacity = (timelineYear + 10000) / 2000 * 0.2; // Gradual freezing
    } else if (timelineYear > 2000) {
        iceOpacity = 0.2 - ((timelineYear - 2000) / 24 * 0.1); // Recent melting
    }
    
    if (layers.surface) {
        layers.surface.setStyle({ fillOpacity: iceOpacity });
    }
    
    // Show/hide features based on timeline
    if (timelineYear < -8000) {
        // Show ancient features prominently
        if (overlays.preFreezeRemains) {
            overlays.preFreezeRemains.setZIndex(1000);
        }
    }
}

function createInfoPanel() {
    const infoDiv = document.createElement('div');
    infoDiv.className = 'info-panel';
    infoDiv.id = 'antarctic-info';
    infoDiv.innerHTML = `
        <h3 style="margin-top: 0; color: ${colors.ice};">ANTARCTIC TRUTH</h3>
        <div id="info-content">
            <p style="font-size: 14px; line-height: 1.6;">
                What lies beneath Antarctica's ice has been hidden from humanity 
                for millennia. This visualization reveals:
            </p>
            <ul style="font-size: 12px; padding-left: 20px;">
                <li>Pre-flood advanced civilizations</li>
                <li>Nazi Base 211 and New Swabia</li>
                <li>Operation Highjump battle sites</li>
                <li>Current restricted zones</li>
                <li>Underground tunnel networks</li>
                <li>Thermal anomalies from active bases</li>
                <li>Ancient pyramid structures</li>
                <li>Magnetic pole shift evidence</li>
            </ul>
            <p style="font-size: 11px; color: #ff6b6b; margin-top: 15px;">
                ⚠️ CLASSIFIED INFORMATION<br>
                Viewing may trigger monitoring protocols
            </p>
        </div>
    `;
    
    document.getElementById('antarctic-map').appendChild(infoDiv);
    
    // Show info panel after a delay
    setTimeout(() => {
        infoDiv.classList.add('active');
    }, 1000);
}

function showLayer(layerName) {
    // Remove all base layers
    Object.values(layers).forEach(layer => {
        if (antarcticMap.hasLayer(layer)) {
            antarcticMap.removeLayer(layer);
        }
    });
    
    // Add selected layer
    if (layers[layerName]) {
        antarcticMap.addLayer(layers[layerName]);
    }
    
    currentLayer = layerName;
    
    // Update map style based on layer
    updateMapStyle(layerName);
}

function toggleOverlay(overlayName, show) {
    if (overlays[overlayName]) {
        if (show) {
            antarcticMap.addLayer(overlays[overlayName]);
        } else {
            antarcticMap.removeLayer(overlays[overlayName]);
        }
    }
}

function updateMapStyle(layerName) {
    const mapContainer = document.getElementById('antarctic-map');
    
    // Remove existing filters
    mapContainer.style.filter = '';
    
    // Apply layer-specific styling
    switch(layerName) {
        case 'bedrock':
            mapContainer.style.filter = 'hue-rotate(270deg) brightness(0.8)';
            break;
        case 'underground':
            mapContainer.style.filter = 'hue-rotate(30deg) brightness(0.6) contrast(1.2)';
            break;
    }
}

// Initialize all overlays on map
function initializeOverlays() {
    // Add all overlays to map by default
    Object.values(overlays).forEach(overlay => {
        if (overlay && overlay !== heatmapLayer) {
            antarcticMap.addLayer(overlay);
        }
    });
    
    // Add heatmap
    if (heatmapLayer) {
        antarcticMap.addLayer(heatmapLayer);
    }
}

// Clean up function
function cleanupAntarcticRevelation() {
    if (isPlaying) {
        stopTimeline();
    }
    if (antarcticMap) {
        antarcticMap.remove();
        antarcticMap = null;
    }
}

// Handle window resize
function handleAntarcticResize() {
    if (antarcticMap) {
        antarcticMap.invalidateSize();
        
        // Adjust map container height on mobile
        const container = document.getElementById('antarctic-map');
        if (container && window.mobileUtils && window.mobileUtils.isMobile()) {
            container.style.height = '400px';
        }
    }
}

// Add resize listener with debouncing
let antarcticResizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(antarcticResizeTimeout);
    antarcticResizeTimeout = setTimeout(() => {
        handleAntarcticResize();
    }, 250);
});

// Make functions available globally
window.initAntarcticRevelation = initAntarcticRevelation;
window.cleanupAntarcticRevelation = cleanupAntarcticRevelation;

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('antarctica-layers')) {
        initAntarcticRevelation();
    }
});

// Initialize overlays after map loads
if (antarcticMap) {
    antarcticMap.on('load', initializeOverlays);
}