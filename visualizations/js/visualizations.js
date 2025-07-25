// Complex Visualizations for Breakaway Civilization Dashboard

// Global Energy Grid Map
function initGridMap() {
    const container = document.getElementById('world-map-container');
    const width = container.clientWidth;
    const height = 500;

    // Clear any existing content
    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create projection
    const projection = d3.geoNaturalEarth1()
        .scale(width / 6.5)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Add zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
            svg.selectAll('g').attr('transform', event.transform);
        });

    svg.call(zoom);

    // Create groups for layers
    const g = svg.append('g');
    const oceanG = g.append('g').attr('class', 'ocean-layer');
    const landG = g.append('g').attr('class', 'land-layer');
    const leyLinesG = g.append('g').attr('class', 'ley-lines-layer');
    const monumentsG = g.append('g').attr('class', 'monuments-layer');
    const undergroundG = g.append('g').attr('class', 'underground-layer');
    const missing411G = g.append('g').attr('class', 'missing411-layer');
    const cropCirclesG = g.append('g').attr('class', 'crop-circles-layer');
    const uapG = g.append('g').attr('class', 'uap-layer');
    const fiveGG = g.append('g').attr('class', '5g-layer');

    // Load world map data
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json').then(world => {
        // Draw ocean
        oceanG.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', '#0a1929');

        // Draw land
        landG.selectAll('path')
            .data(topojson.feature(world, world.objects.land).features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', '#1a2332')
            .attr('stroke', '#2a3442')
            .attr('stroke-width', 0.5);

        // Add ley lines
        drawLeyLines(leyLinesG, projection);
        
        // Add monuments
        drawMonuments(monumentsG, projection);
        
        // Add other layers
        drawUndergroundBases(undergroundG, projection);
        drawMissing411(missing411G, projection);
        drawCropCircles(cropCirclesG, projection);
        drawUAPSightings(uapG, projection);
        draw5GTowers(fiveGG, projection);

        // Update visibility based on state
        updateLayerVisibility();
    });
}

function drawLeyLines(g, projection) {
    // Major ley lines connecting sacred sites
    const leyLines = [
        // Great Circle through Giza
        {start: [31.1342, 29.9792], end: [-77.0369, 38.9072]}, // Giza to DC
        {start: [31.1342, 29.9792], end: [-3.4360, 55.3781]}, // Giza to Stonehenge
        {start: [31.1342, 29.9792], end: [78.0419, 27.1751]}, // Giza to Taj Mahal
        // Pacific Ring
        {start: [-109.9167, -27.1167], end: [-71.5450, -13.1631]}, // Easter Island to Machu Picchu
        {start: [-109.9167, -27.1167], end: [103.8670, 1.3521]}, // Easter Island to Singapore
        // Atlantic connections
        {start: [-3.4360, 55.3781], end: [-71.0589, 42.3601]}, // Stonehenge to Boston
        {start: [2.3522, 48.8566], end: [-71.5450, -13.1631]}, // Paris to Machu Picchu
    ];

    const lineGenerator = d3.geoPath()
        .projection(projection);

    leyLines.forEach(line => {
        const greatCircle = {
            type: "LineString",
            coordinates: [line.start, line.end]
        };

        g.append('path')
            .datum(greatCircle)
            .attr('d', lineGenerator)
            .attr('fill', 'none')
            .attr('stroke', '#00ffcc')
            .attr('stroke-width', 1)
            .attr('opacity', 0.6)
            .attr('class', 'ley-line')
            .style('filter', 'drop-shadow(0 0 3px #00ffcc)');
    });
}

function drawMonuments(g, projection) {
    const monuments = [
        {name: "Great Pyramid", coords: [31.1342, 29.9792], power: 10},
        {name: "Stonehenge", coords: [-1.8262, 51.1789], power: 8},
        {name: "Machu Picchu", coords: [-72.5450, -13.1631], power: 7},
        {name: "Easter Island", coords: [-109.3667, -27.1167], power: 6},
        {name: "Angkor Wat", coords: [103.8670, 13.4125], power: 8},
        {name: "Chichen Itza", coords: [-88.5683, 20.6843], power: 7},
        {name: "Göbekli Tepe", coords: [38.9224, 37.2231], power: 9},
        {name: "Sacsayhuamán", coords: [-71.9822, -13.5078], power: 6},
        {name: "Teotihuacan", coords: [-98.8438, 19.6925], power: 8},
        {name: "Newgrange", coords: [-6.4754, 53.6947], power: 5},
        {name: "Borobudur", coords: [110.2038, -7.6079], power: 6},
        {name: "Petra", coords: [35.4444, 30.3285], power: 5},
        {name: "Tiwanaku", coords: [-68.6737, -16.5547], power: 7},
        {name: "Nan Madol", coords: [158.3517, 6.8447], power: 5}
    ];

    monuments.forEach(monument => {
        const [x, y] = projection(monument.coords);
        
        // Outer glow
        g.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', monument.power * 3)
            .attr('fill', 'none')
            .attr('stroke', '#00ffcc')
            .attr('stroke-width', 0.5)
            .attr('opacity', 0.3)
            .attr('class', 'monument-glow');

        // Inner circle
        g.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', monument.power)
            .attr('fill', '#00ffcc')
            .attr('opacity', 0.8)
            .attr('class', 'monument')
            .style('cursor', 'pointer')
            .on('mouseover', function() {
                d3.select(this).attr('r', monument.power * 1.5);
                showTooltip(monument.name, x, y);
            })
            .on('mouseout', function() {
                d3.select(this).attr('r', monument.power);
                hideTooltip();
            })
            .on('click', () => {
                showLocationInfo(monument);
            });

        // Pulsing animation
        g.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', monument.power)
            .attr('fill', 'none')
            .attr('stroke', '#00ffcc')
            .attr('stroke-width', 2)
            .attr('opacity', 0)
            .attr('class', 'monument-pulse')
            .style('pointer-events', 'none')
            .append('animate')
            .attr('attributeName', 'r')
            .attr('from', monument.power)
            .attr('to', monument.power * 4)
            .attr('dur', '3s')
            .attr('repeatCount', 'indefinite')
            .append('animate')
            .attr('attributeName', 'opacity')
            .attr('from', 0.8)
            .attr('to', 0)
            .attr('dur', '3s')
            .attr('repeatCount', 'indefinite');
    });
}

function drawUndergroundBases(g, projection) {
    const bases = [
        {name: "Dulce Base", coords: [-107.0000, 36.7919], depth: 7},
        {name: "Pine Gap", coords: [133.7370, -23.7990], depth: 5},
        {name: "Cheyenne Mountain", coords: [-104.8438, 38.7440], depth: 6},
        {name: "Mount Weather", coords: [-77.8889, 39.0626], depth: 4},
        {name: "Greenbrier", coords: [-80.3084, 37.7857], depth: 3},
        {name: "Area 51", coords: [-115.8111, 37.2350], depth: 8},
        {name: "Wright-Patterson", coords: [-84.0483, 39.8261], depth: 4},
        {name: "Camp Hero", coords: [-71.8674, 41.0637], depth: 5}
    ];

    bases.forEach(base => {
        const [x, y] = projection(base.coords);
        
        g.append('rect')
            .attr('x', x - 5)
            .attr('y', y - 5)
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', 'none')
            .attr('stroke', '#ff6b6b')
            .attr('stroke-width', 1)
            .attr('transform', `rotate(45 ${x} ${y})`)
            .attr('class', 'underground-base')
            .on('click', () => showLocationInfo(base));
    });
}

function drawMissing411(g, projection) {
    // Heat map areas of high disappearances
    const hotspots = [
        {coords: [-120.7401, 38.5816], intensity: 9}, // Yosemite
        {coords: [-83.4314, 35.5175], intensity: 8}, // Great Smoky Mountains
        {coords: [-122.1217, 46.8523], intensity: 7}, // Mount Rainier
        {coords: [-107.3025, 43.8791], intensity: 8}, // Yellowstone
        {coords: [-113.7870, 48.7596], intensity: 6}, // Glacier NP
        {coords: [-105.6836, 40.3428], intensity: 7}, // Rocky Mountain NP
    ];

    hotspots.forEach(spot => {
        const [x, y] = projection(spot.coords);
        
        const gradient = g.append('defs')
            .append('radialGradient')
            .attr('id', `missing-gradient-${x}-${y}`);

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#ff6b6b')
            .attr('stop-opacity', spot.intensity / 10);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#ff6b6b')
            .attr('stop-opacity', 0);

        g.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', spot.intensity * 5)
            .attr('fill', `url(#missing-gradient-${x}-${y})`)
            .attr('class', 'missing-411');
    });
}

function drawCropCircles(g, projection) {
    const cropCircles = [
        {coords: [-1.8262, 51.1789], date: "2023-07-15", complexity: 8}, // Near Stonehenge
        {coords: [-1.5874, 51.4545], date: "2023-08-03", complexity: 9}, // Wiltshire
        {coords: [-2.0107, 51.0871], date: "2023-06-21", complexity: 7}, // Avebury
        {coords: [8.2275, 47.3769], date: "2023-09-01", complexity: 6}, // Switzerland
    ];

    cropCircles.forEach(circle => {
        const [x, y] = projection(circle.coords);
        
        // Create sacred geometry pattern
        g.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 3)
            .attr('fill', 'none')
            .attr('stroke', '#ffcc00')
            .attr('stroke-width', 0.5)
            .attr('class', 'crop-circle');

        // Add complexity indicator
        for (let i = 0; i < circle.complexity / 3; i++) {
            g.append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 3 + (i * 2))
                .attr('fill', 'none')
                .attr('stroke', '#ffcc00')
                .attr('stroke-width', 0.3)
                .attr('opacity', 0.5 - (i * 0.1))
                .attr('class', 'crop-circle-ring');
        }
    });
}

function drawUAPSightings(g, projection) {
    // Recent UAP sightings
    const sightings = [
        {coords: [-74.0060, 40.7128], date: "2024-11-18", type: "formation"},
        {coords: [-71.0589, 42.3601], date: "2024-11-19", type: "orb"},
        {coords: [-77.0369, 38.9072], date: "2024-11-20", type: "triangle"},
        {coords: [-118.2437, 34.0522], date: "2024-10-15", type: "disc"},
        {coords: [-122.4194, 37.7749], date: "2024-09-22", type: "formation"},
    ];

    sightings.forEach(sighting => {
        const [x, y] = projection(sighting.coords);
        
        const symbol = g.append('g')
            .attr('transform', `translate(${x}, ${y})`)
            .attr('class', 'uap-sighting');

        // Different symbols for different types
        if (sighting.type === 'formation') {
            [-3, 0, 3].forEach(offset => {
                symbol.append('circle')
                    .attr('cx', offset)
                    .attr('cy', 0)
                    .attr('r', 1.5)
                    .attr('fill', '#ff00ff');
            });
        } else if (sighting.type === 'triangle') {
            symbol.append('polygon')
                .attr('points', '0,-4 -3,3 3,3')
                .attr('fill', '#ff00ff');
        } else {
            symbol.append('circle')
                .attr('r', 2)
                .attr('fill', '#ff00ff');
        }

        // Add pulsing effect
        symbol.append('circle')
            .attr('r', 2)
            .attr('fill', 'none')
            .attr('stroke', '#ff00ff')
            .attr('stroke-width', 1)
            .attr('opacity', 0)
            .append('animate')
            .attr('attributeName', 'r')
            .attr('from', 2)
            .attr('to', 10)
            .attr('dur', '2s')
            .attr('repeatCount', 'indefinite')
            .append('animate')
            .attr('attributeName', 'opacity')
            .attr('from', 0.8)
            .attr('to', 0)
            .attr('dur', '2s')
            .attr('repeatCount', 'indefinite');
    });
}

function draw5GTowers(g, projection) {
    // 5G towers on ley line intersections
    const towers = [
        {coords: [-0.1278, 51.5074]}, // London
        {coords: [2.3522, 48.8566]}, // Paris
        {coords: [13.4050, 52.5200]}, // Berlin
        {coords: [-73.9352, 40.7306]}, // NYC
        {coords: [-87.6298, 41.8781]}, // Chicago
    ];

    towers.forEach(tower => {
        const [x, y] = projection(tower.coords);
        
        g.append('rect')
            .attr('x', x - 2)
            .attr('y', y - 6)
            .attr('width', 4)
            .attr('height', 12)
            .attr('fill', '#ff0000')
            .attr('opacity', 0.6)
            .attr('class', '5g-tower');

        // Radio waves
        g.append('circle')
            .attr('cx', x)
            .attr('cy', y - 6)
            .attr('r', 0)
            .attr('fill', 'none')
            .attr('stroke', '#ff0000')
            .attr('stroke-width', 0.5)
            .attr('opacity', 0.5)
            .append('animate')
            .attr('attributeName', 'r')
            .attr('from', 0)
            .attr('to', 15)
            .attr('dur', '3s')
            .attr('repeatCount', 'indefinite');
    });
}

function updateLayerVisibility() {
    Object.keys(window.appState.layers).forEach(layer => {
        const visibility = window.appState.layers[layer] ? 'visible' : 'hidden';
        d3.selectAll(`.${layer}-layer`).style('visibility', visibility);
    });
}

function showTooltip(text, x, y) {
    // Create tooltip if it doesn't exist
    let tooltip = d3.select('body').select('.map-tooltip');
    if (tooltip.empty()) {
        tooltip = d3.select('body')
            .append('div')
            .attr('class', 'map-tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.8)')
            .style('color', '#00ffcc')
            .style('padding', '5px 10px')
            .style('border', '1px solid #00ffcc')
            .style('border-radius', '3px')
            .style('pointer-events', 'none')
            .style('font-size', '12px');
    }

    tooltip
        .style('opacity', 1)
        .style('left', (x + 10) + 'px')
        .style('top', (y - 30) + 'px')
        .text(text);
}

function hideTooltip() {
    d3.select('.map-tooltip').style('opacity', 0);
}

function showLocationInfo(location) {
    const infoDiv = document.getElementById('location-info');
    infoDiv.innerHTML = `
        <h5>${location.name}</h5>
        <p>Coordinates: ${location.coords[0].toFixed(4)}, ${location.coords[1].toFixed(4)}</p>
        ${location.power ? `<p>Power Level: ${location.power}/10</p>` : ''}
        ${location.depth ? `<p>Depth: Level ${location.depth}</p>` : ''}
        ${location.date ? `<p>Date: ${location.date}</p>` : ''}
        ${location.type ? `<p>Type: ${location.type}</p>` : ''}
    `;
}

// Initialize specific visualizations when their tabs are clicked
window.initGridMap = initGridMap;

// Call initGridMap when page loads if on that view
if (window.appState && window.appState.currentView === 'grid-map') {
    initGridMap();
}