// Complex Visualizations for Breakaway Civilization Dashboard

// Global data storage
let gridData = null;

// Global Energy Grid Map
async function initGridMap() {
    const container = document.getElementById('world-map-container');
    const width = container.clientWidth;
    const height = 500;

    // Clear any existing content
    d3.select(container).selectAll('*').remove();

    // Load grid data
    if (!gridData) {
        try {
            gridData = await d3.json('data/grid-data.json');
        } catch (error) {
            console.error('Error loading grid data:', error);
            // Fall back to hardcoded data if file fails
            gridData = null;
        }
    }

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Add zoom controls
    const zoomControls = d3.select(container)
        .append('div')
        .attr('class', 'zoom-controls')
        .style('position', 'absolute')
        .style('top', '10px')
        .style('right', '10px')
        .style('z-index', '1000');

    // Add region buttons
    const regions = [
        { name: 'Global', bounds: null },
        { name: 'NE US', bounds: [[-85, 35], [-65, 47]] },
        { name: 'Europe', bounds: [[-10, 35], [40, 65]] },
        { name: 'Pacific', bounds: [[100, -50], [180, 20]] }
    ];

    regions.forEach(region => {
        zoomControls.append('button')
            .text(region.name)
            .style('display', 'block')
            .style('margin', '5px')
            .style('padding', '5px 10px')
            .style('background', '#1a2332')
            .style('border', '1px solid #00ffcc')
            .style('color', '#00ffcc')
            .style('cursor', 'pointer')
            .on('click', () => zoomToRegion(region.bounds));
    });

    // Add legend
    const legend = svg.append('g')
        .attr('class', 'map-legend')
        .attr('transform', `translate(20, ${height - 150})`);

    const legendItems = [
        { color: '#00ffcc', label: 'Ancient Sites', shape: 'circle' },
        { color: '#ffcc00', label: 'Ley Lines', shape: 'line' },
        { color: '#ff6b6b', label: 'Underground Bases', shape: 'square' },
        { color: '#ff00ff', label: 'UAP Sightings', shape: 'circle' },
        { color: '#ff0000', label: '5G Towers', shape: 'rect' }
    ];

    legendItems.forEach((item, i) => {
        const legendItem = legend.append('g')
            .attr('transform', `translate(0, ${i * 25})`);

        if (item.shape === 'circle') {
            legendItem.append('circle')
                .attr('cx', 10)
                .attr('cy', 10)
                .attr('r', 5)
                .attr('fill', item.color);
        } else if (item.shape === 'line') {
            legendItem.append('line')
                .attr('x1', 5)
                .attr('y1', 10)
                .attr('x2', 15)
                .attr('y2', 10)
                .attr('stroke', item.color)
                .attr('stroke-width', 2);
        } else if (item.shape === 'square') {
            legendItem.append('rect')
                .attr('x', 5)
                .attr('y', 5)
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', item.color)
                .attr('transform', 'rotate(45, 10, 10)');
        } else if (item.shape === 'rect') {
            legendItem.append('rect')
                .attr('x', 8)
                .attr('y', 5)
                .attr('width', 4)
                .attr('height', 10)
                .attr('fill', item.color);
        }

        legendItem.append('text')
            .attr('x', 25)
            .attr('y', 14)
            .text(item.label)
            .style('fill', '#00ffcc')
            .style('font-size', '12px');
    });

    // Create projection
    const projection = d3.geoNaturalEarth1()
        .scale(width / 6.5)
        .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Add zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([1, 20])
        .on('zoom', (event) => {
            svg.selectAll('g.map-content').attr('transform', event.transform);
        });

    svg.call(zoom);

    // Zoom to region function
    function zoomToRegion(bounds) {
        if (!bounds) {
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity
            );
            return;
        }

        const [[x0, y0], [x1, y1]] = bounds.map(projection);
        const scale = Math.min(width / (x1 - x0), height / (y1 - y0)) * 0.8;
        const translate = [width / 2 - scale * (x0 + x1) / 2, height / 2 - scale * (y0 + y1) / 2];

        svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
        );
    }

    // Create groups for layers
    const g = svg.append('g').attr('class', 'map-content');
    const oceanG = g.append('g').attr('class', 'ocean-layer');
    const landG = g.append('g').attr('class', 'land-layer');
    const leyLinesG = g.append('g').attr('class', 'ley-lines-layer');
    const energyFlowG = g.append('g').attr('class', 'energy-flow-layer');
    const monumentsG = g.append('g').attr('class', 'monuments-layer');
    const undergroundG = g.append('g').attr('class', 'underground-layer');
    const missing411G = g.append('g').attr('class', 'missing411-layer');
    const cropCirclesG = g.append('g').attr('class', 'crop-circles-layer');
    const uapG = g.append('g').attr('class', 'uap-layer');
    const fiveGG = g.append('g').attr('class', 'five-g-layer');
    const northeastG = g.append('g').attr('class', 'northeast-detail-layer');

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
        
        // Add energy flow animations
        drawEnergyFlow(energyFlowG, projection);
        
        // Add monuments
        drawMonuments(monumentsG, projection);
        
        // Add other layers
        drawUndergroundBases(undergroundG, projection);
        drawMissing411(missing411G, projection);
        drawCropCircles(cropCirclesG, projection);
        drawUAPSightings(uapG, projection);
        draw5GTowers(fiveGG, projection);
        
        // Add enhanced northeastern US detail
        drawNortheastDetail(northeastG, projection);

        // Update visibility based on state
        updateLayerVisibility();
    });
}

function drawLeyLines(g, projection) {
    // Use data from grid-data.json if available
    const leyLinesData = gridData && gridData.leyLines ? gridData.leyLines : [];
    
    // Major ley lines connecting sacred sites
    const leyLines = [
        // Great Circle through Giza
        {start: [31.1342, 29.9792], end: [-77.0369, 38.9072], name: "Giza-DC Power Line", frequency: 7.83, status: "active"}, // Giza to DC
        {start: [31.1342, 29.9792], end: [-3.4360, 55.3781], name: "Giza-Stonehenge Line", frequency: 8.1, status: "active"}, // Giza to Stonehenge
        {start: [31.1342, 29.9792], end: [78.0419, 27.1751], name: "Giza-Taj Mahal Line", frequency: 9.2, status: "activating"}, // Giza to Taj Mahal
        // Pacific Ring
        {start: [-109.9167, -27.1167], end: [-71.5450, -13.1631], name: "Pacific Power Ring", frequency: 11.2, status: "active"}, // Easter Island to Machu Picchu
        {start: [-109.9167, -27.1167], end: [103.8670, 1.3521], name: "Trans-Pacific Line", frequency: 10.5, status: "active"}, // Easter Island to Singapore
        // Atlantic connections
        {start: [-3.4360, 55.3781], end: [-71.0589, 42.3601], name: "Atlantic Bridge", frequency: 7.9, status: "active"}, // Stonehenge to Boston
        {start: [2.3522, 48.8566], end: [-71.5450, -13.1631], name: "Paris-Peru Line", frequency: 8.7, status: "activating"}, // Paris to Machu Picchu
    ];

    const lineGenerator = d3.geoPath()
        .projection(projection);

    leyLines.forEach(line => {
        const greatCircle = {
            type: "LineString",
            coordinates: [line.start, line.end]
        };

        const leyPath = g.append('path')
            .datum(greatCircle)
            .attr('d', lineGenerator)
            .attr('fill', 'none')
            .attr('stroke', line.status === 'activating' ? '#ffcc00' : '#00ffcc')
            .attr('stroke-width', 2)
            .attr('opacity', 0.6)
            .attr('class', 'ley-line clickable-element')
            .style('filter', `drop-shadow(0 0 3px ${line.status === 'activating' ? '#ffcc00' : '#00ffcc'})`)
            .style('cursor', 'pointer')
            .on('click', function(event) {
                event.stopPropagation();
                const [x, y] = [event.pageX, event.pageY];
                
                // Find connected nodes from gridData if available
                let nodes = ['Unknown', 'Unknown'];
                if (gridData && gridData.leyLines) {
                    const matchingLine = gridData.leyLines.find(l => l.name.includes(line.name.split(' ')[0]));
                    if (matchingLine) {
                        nodes = matchingLine.nodes.slice(0, 2);
                    }
                }
                
                window.enhancedPopup.show({
                    name: line.name,
                    frequency: line.frequency,
                    status: line.status,
                    nodes: nodes
                }, x, y);
            })
            .on('mouseover', function() {
                d3.select(this)
                    .attr('stroke-width', 3)
                    .attr('opacity', 0.8);
            })
            .on('mouseout', function() {
                d3.select(this)
                    .attr('stroke-width', 2)
                    .attr('opacity', 0.6);
            });
            
        // Add pulsing animation for activating lines
        if (line.status === 'activating') {
            leyPath
                .style('stroke-dasharray', '5,5')
                .style('animation', 'dash 2s linear infinite');
        }
    });
}

function drawMonuments(g, projection) {
    // Use data from grid-data.json if available, otherwise use defaults
    let monuments = gridData && gridData.monuments ? gridData.monuments : [
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
            .attr('class', 'monument clickable-element')
            .style('cursor', 'pointer')
            .on('mouseover', function() {
                d3.select(this).attr('r', monument.power * 1.5);
            })
            .on('mouseout', function() {
                d3.select(this).attr('r', monument.power);
            })
            .on('click', function(event) {
                event.stopPropagation();
                const [pageX, pageY] = [event.pageX, event.pageY];
                window.enhancedPopup.show(monument, pageX, pageY);
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
    // Use data from grid-data.json if available
    let bases = gridData && gridData.undergroundBases ? 
        gridData.undergroundBases : [
        {name: "Dulce Base", coords: [-107.0000, 36.7919], depth: 7, type: "genetics", population: 18000},
        {name: "Pine Gap", coords: [133.7370, -23.7990], depth: 5, type: "communications", population: 5000},
        {name: "Cheyenne Mountain", coords: [-104.8438, 38.7440], depth: 6, type: "command", population: 10000},
        {name: "Mount Weather", coords: [-77.8889, 39.0626], depth: 4, type: "continuity", population: 3000},
        {name: "Greenbrier", coords: [-80.3084, 37.7857], depth: 3, type: "shelter", population: 1000},
        {name: "Area 51", coords: [-115.8111, 37.2350], depth: 8, type: "research", population: 15000},
        {name: "Wright-Patterson", coords: [-84.0483, 39.8261], depth: 4, type: "storage", population: 5000},
        {name: "Camp Hero", coords: [-71.8674, 41.0637], depth: 5, type: "temporal", population: 2000}
    ];

    bases.forEach(base => {
        const [x, y] = projection(base.coords);
        
        const baseGroup = g.append('g')
            .attr('transform', `translate(${x}, ${y})`);
            
        // Base indicator
        baseGroup.append('rect')
            .attr('x', -5)
            .attr('y', -5)
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', '#ff6b6b')
            .attr('fill-opacity', 0.3)
            .attr('stroke', '#ff6b6b')
            .attr('stroke-width', 1)
            .attr('transform', 'rotate(45)')
            .attr('class', 'underground-base clickable-element')
            .style('cursor', 'pointer')
            .on('mouseover', function() {
                d3.select(this)
                    .attr('fill-opacity', 0.6)
                    .attr('stroke-width', 2);
            })
            .on('mouseout', function() {
                d3.select(this)
                    .attr('fill-opacity', 0.3)
                    .attr('stroke-width', 1);
            })
            .on('click', function(event) {
                event.stopPropagation();
                const [pageX, pageY] = [event.pageX, event.pageY];
                window.enhancedPopup.show(base, pageX, pageY);
            });
            
        // Add depth rings
        for (let i = 1; i <= Math.min(base.depth, 3); i++) {
            baseGroup.append('rect')
                .attr('x', -5 - (i * 3))
                .attr('y', -5 - (i * 3))
                .attr('width', 10 + (i * 6))
                .attr('height', 10 + (i * 6))
                .attr('fill', 'none')
                .attr('stroke', '#ff6b6b')
                .attr('stroke-width', 0.5)
                .attr('opacity', 0.3 - (i * 0.1))
                .attr('transform', 'rotate(45)')
                .style('pointer-events', 'none');
        }
    });
}

function drawMissing411(g, projection) {
    // Use data from grid-data.json if available
    const clusters = gridData && gridData.missing411Clusters ? 
        gridData.missing411Clusters : [];
        
    // Heat map areas of high disappearances
    const hotspots = [
        {coords: [-120.7401, 38.5816], intensity: 9, location: "Yosemite", cases: 563, profile: "High intelligence, German ancestry", nearestBase: 47},
        {coords: [-83.4314, 35.5175], intensity: 8, location: "Great Smoky Mountains", cases: 892, profile: "Children 2-6, experienced hikers", nearestBase: 72},
        {coords: [-122.1217, 46.8523], intensity: 7, location: "Mount Rainier", cases: 421, profile: "Bright clothing, found elevated", nearestBase: 89},
        {coords: [-107.3025, 43.8791], intensity: 8, location: "Yellowstone", cases: 677, profile: "Near water, shoes missing", nearestBase: 123},
        {coords: [-113.7870, 48.7596], intensity: 6, location: "Glacier NP", cases: 234, profile: "Boulder fields, sudden weather", nearestBase: 156},
        {coords: [-105.6836, 40.3428], intensity: 7, location: "Rocky Mountain NP", cases: 345, profile: "High altitude, time distortion", nearestBase: 65},
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
            .attr('class', 'missing-411 clickable-element')
            .style('cursor', 'pointer')
            .on('click', function(event) {
                event.stopPropagation();
                const [pageX, pageY] = [event.pageX, event.pageY];
                window.enhancedPopup.show(spot, pageX, pageY);
            })
            .on('mouseover', function() {
                d3.select(this).attr('opacity', 0.8);
            })
            .on('mouseout', function() {
                d3.select(this).attr('opacity', 1);
            });
    });
}

function drawCropCircles(g, projection) {
    const cropCircles = [
        {coords: [-1.8262, 51.1789], date: "2023-07-15", complexity: 8, location: "Near Stonehenge"}, // Near Stonehenge
        {coords: [-1.5874, 51.4545], date: "2023-08-03", complexity: 9, location: "Wiltshire"}, // Wiltshire
        {coords: [-2.0107, 51.0871], date: "2023-06-21", complexity: 7, location: "Avebury"}, // Avebury
        {coords: [8.2275, 47.3769], date: "2023-09-01", complexity: 6, location: "Switzerland"}, // Switzerland
    ];

    cropCircles.forEach(circle => {
        const [x, y] = projection(circle.coords);
        
        const circleGroup = g.append('g')
            .attr('transform', `translate(${x}, ${y})`)
            .attr('class', 'crop-circle-group clickable-element')
            .style('cursor', 'pointer')
            .on('click', function(event) {
                event.stopPropagation();
                const [pageX, pageY] = [event.pageX, event.pageY];
                window.enhancedPopup.show(circle, pageX, pageY);
            });
        
        // Create sacred geometry pattern
        circleGroup.append('circle')
            .attr('r', 3)
            .attr('fill', 'none')
            .attr('stroke', '#ffcc00')
            .attr('stroke-width', 0.5)
            .attr('class', 'crop-circle');

        // Add complexity indicator
        for (let i = 0; i < circle.complexity / 3; i++) {
            circleGroup.append('circle')
                .attr('r', 3 + (i * 2))
                .attr('fill', 'none')
                .attr('stroke', '#ffcc00')
                .attr('stroke-width', 0.3)
                .attr('opacity', 0.5 - (i * 0.1))
                .attr('class', 'crop-circle-ring');
        }
        
        // Add hover effect
        circleGroup.on('mouseover', function() {
            d3.select(this).selectAll('circle')
                .attr('stroke-width', function() {
                    return parseFloat(d3.select(this).attr('stroke-width')) * 2;
                });
        })
        .on('mouseout', function() {
            d3.select(this).selectAll('circle')
                .attr('stroke-width', function() {
                    return parseFloat(d3.select(this).attr('stroke-width')) / 2;
                });
        });
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
            .attr('class', 'uap-sighting clickable-element')
            .style('cursor', 'pointer')
            .on('click', function(event) {
                event.stopPropagation();
                const [pageX, pageY] = [event.pageX, event.pageY];
                window.enhancedPopup.show(sighting, pageX, pageY);
            });

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
        {coords: [-0.1278, 51.5074], location: "London", frequency: "28 GHz", power: "100W"}, // London
        {coords: [2.3522, 48.8566], location: "Paris", frequency: "39 GHz", power: "120W"}, // Paris
        {coords: [13.4050, 52.5200], location: "Berlin", frequency: "26 GHz", power: "90W"}, // Berlin
        {coords: [-73.9352, 40.7306], location: "NYC", frequency: "28 GHz", power: "150W"}, // NYC
        {coords: [-87.6298, 41.8781], location: "Chicago", frequency: "39 GHz", power: "110W"}, // Chicago
    ];

    towers.forEach(tower => {
        const [x, y] = projection(tower.coords);
        
        const towerGroup = g.append('g')
            .attr('transform', `translate(${x}, ${y})`)
            .attr('class', '5g-tower-group clickable-element')
            .style('cursor', 'pointer')
            .on('click', function(event) {
                event.stopPropagation();
                const [pageX, pageY] = [event.pageX, event.pageY];
                window.enhancedPopup.show({
                    name: `5G Tower - ${tower.location}`,
                    type: '5G Transmission',
                    coords: tower.coords,
                    frequency: tower.frequency,
                    power: tower.power,
                    status: 'active'
                }, pageX, pageY);
            });
        
        towerGroup.append('rect')
            .attr('x', -2)
            .attr('y', -6)
            .attr('width', 4)
            .attr('height', 12)
            .attr('fill', '#ff0000')
            .attr('opacity', 0.6)
            .attr('class', '5g-tower');

        // Radio waves
        const wave = towerGroup.append('circle')
            .attr('cy', -6)
            .attr('r', 0)
            .attr('fill', 'none')
            .attr('stroke', '#ff0000')
            .attr('stroke-width', 0.5)
            .attr('opacity', 0.5);
            
        wave.append('animate')
            .attr('attributeName', 'r')
            .attr('from', 0)
            .attr('to', 15)
            .attr('dur', '3s')
            .attr('repeatCount', 'indefinite');
            
        wave.append('animate')
            .attr('attributeName', 'opacity')
            .attr('from', 0.5)
            .attr('to', 0)
            .attr('dur', '3s')
            .attr('repeatCount', 'indefinite');
            
        // Add hover effect
        towerGroup.on('mouseover', function() {
            d3.select(this).select('rect')
                .attr('opacity', 0.9)
                .attr('fill', '#ff3333');
        })
        .on('mouseout', function() {
            d3.select(this).select('rect')
                .attr('opacity', 0.6)
                .attr('fill', '#ff0000');
        });
    });
}

function updateLayerVisibility() {
    Object.keys(window.appState.layers).forEach(layer => {
        const visibility = window.appState.layers[layer] ? 'visible' : 'hidden';
        d3.selectAll(`.${layer}-layer`).style('visibility', visibility);
    });
    
    // Always show energy flow and northeast detail layers if ley lines are visible
    if (window.appState.layers['ley-lines']) {
        d3.selectAll('.energy-flow-layer').style('visibility', 'visible');
        d3.selectAll('.northeast-detail-layer').style('visibility', 'visible');
    } else {
        d3.selectAll('.energy-flow-layer').style('visibility', 'hidden');
        d3.selectAll('.northeast-detail-layer').style('visibility', 'hidden');
    }
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

// Draw energy flow animations between connected nodes
function drawEnergyFlow(g, projection) {
    const energyPaths = [
        {start: [31.1342, 29.9792], end: [-77.0369, 38.9072], power: 10}, // Giza to DC
        {start: [-3.4360, 55.3781], end: [-71.0589, 42.3601], power: 8}, // Stonehenge to Boston
        {start: [-71.0589, 42.3601], end: [-74.0060, 40.7128], power: 9}, // Boston to NYC
        {start: [-74.0060, 40.7128], end: [-75.1652, 39.9526], power: 8}, // NYC to Philadelphia
        {start: [-75.1652, 39.9526], end: [-77.0369, 38.9072], power: 9}, // Philadelphia to DC
    ];

    energyPaths.forEach((path, i) => {
        const lineGenerator = d3.geoPath().projection(projection);
        const greatCircle = {
            type: "LineString",
            coordinates: [path.start, path.end]
        };

        // Create gradient for energy flow
        const gradient = g.append('defs')
            .append('linearGradient')
            .attr('id', `energy-gradient-${i}`)
            .attr('gradientUnits', 'userSpaceOnUse');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#00ffcc')
            .attr('stop-opacity', 0);

        gradient.append('stop')
            .attr('offset', '50%')
            .attr('stop-color', '#00ffcc')
            .attr('stop-opacity', 1);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#00ffcc')
            .attr('stop-opacity', 0);

        // Energy flow path
        const flowPath = g.append('path')
            .datum(greatCircle)
            .attr('d', lineGenerator)
            .attr('fill', 'none')
            .attr('stroke', `url(#energy-gradient-${i})`)
            .attr('stroke-width', path.power / 3)
            .attr('opacity', 0.6)
            .style('filter', 'drop-shadow(0 0 3px #00ffcc)');

        // Animate the gradient
        gradient.append('animateTransform')
            .attr('attributeName', 'gradientTransform')
            .attr('type', 'translate')
            .attr('from', '-1 0')
            .attr('to', '1 0')
            .attr('dur', `${10 - path.power / 2}s`)
            .attr('repeatCount', 'indefinite');

        // Add energy particles
        const particleGroup = g.append('g');
        
        for (let j = 0; j < 3; j++) {
            const particle = particleGroup.append('circle')
                .attr('r', 2)
                .attr('fill', '#00ffcc')
                .style('filter', 'drop-shadow(0 0 5px #00ffcc)');

            const pathElement = flowPath.node();
            const pathLength = pathElement.getTotalLength();

            particle.append('animateMotion')
                .attr('path', lineGenerator(greatCircle))
                .attr('dur', `${15 - path.power}s`)
                .attr('begin', `${j * 3}s`)
                .attr('repeatCount', 'indefinite');
        }
    });
}

// Draw enhanced northeastern US detail
function drawNortheastDetail(g, projection) {
    // Major northeastern US locations
    const neLocations = [
        // Major cities
        {name: "New York City", coords: [-74.0060, 40.7128], type: "city", power: 9, population: 8336817},
        {name: "Boston", coords: [-71.0589, 42.3601], type: "city", power: 8, population: 692600},
        {name: "Philadelphia", coords: [-75.1652, 39.9526], type: "city", power: 7, population: 1584064},
        {name: "Washington DC", coords: [-77.0369, 38.9072], type: "city", power: 10, population: 705749},
        {name: "Baltimore", coords: [-76.6122, 39.2904], type: "city", power: 6, population: 593490},
        {name: "Pittsburgh", coords: [-79.9959, 40.4406], type: "city", power: 5, population: 302407},
        
        // Special energy sites
        {name: "Harriman State Park", coords: [-74.1404, 41.2370], type: "vortex", power: 8, 
         description: "Major ley line intersection, 89 Missing 411 cases, ancient stone structures"},
        {name: "Bear Mountain", coords: [-73.9885, 41.3134], type: "vortex", power: 7,
         description: "Energy vortex, solstice alignments, 47 disappearances"},
        {name: "Mount Weather", coords: [-77.8889, 39.0626], type: "underground", depth: 4,
         description: "FEMA continuity of government facility"},
        {name: "Camp Hero/Montauk", coords: [-71.8674, 41.0637], type: "underground", depth: 5,
         description: "Temporal experiments, Project Montauk site"},
        {name: "West Point", coords: [-73.9556, 41.3915], type: "energy", power: 6,
         description: "Hudson Valley energy channel intersection"},
        {name: "Greenbrier Bunker", coords: [-80.3084, 37.7857], type: "underground", depth: 3,
         description: "Congressional fallout shelter"},
        {name: "Wright-Patterson AFB", coords: [-84.0483, 39.8261], type: "underground", depth: 4,
         description: "UFO storage facility, Hangar 18"}
    ];

    // Hudson Valley energy channel
    const hudsonChannel = [
        [-73.7569, 42.6526], // Albany
        [-73.9556, 41.3915], // West Point
        [-74.1404, 41.2370], // Harriman
        [-73.9885, 41.3134], // Bear Mountain
        [-74.0060, 40.7128]  // NYC
    ];

    // Draw Hudson Valley energy channel
    const channelPath = d3.line()
        .x(d => projection(d)[0])
        .y(d => projection(d)[1])
        .curve(d3.curveBasis);

    g.append('path')
        .datum(hudsonChannel)
        .attr('d', channelPath)
        .attr('fill', 'none')
        .attr('stroke', '#9370db')
        .attr('stroke-width', 3)
        .attr('opacity', 0.6)
        .style('stroke-dasharray', '10,5')
        .style('filter', 'drop-shadow(0 0 5px #9370db)')
        .attr('class', 'hudson-channel');

    // Add location markers
    neLocations.forEach(loc => {
        const [x, y] = projection(loc.coords);
        
        const locGroup = g.append('g')
            .attr('transform', `translate(${x}, ${y})`)
            .attr('class', `ne-location ${loc.type}`)
            .style('cursor', 'pointer');

        // Different markers for different types
        if (loc.type === 'city') {
            // City marker
            locGroup.append('circle')
                .attr('r', Math.sqrt(loc.power) * 2)
                .attr('fill', '#00aaff')
                .attr('stroke', '#00ffcc')
                .attr('stroke-width', 1)
                .attr('opacity', 0.8);
                
            // Add population indicator
            locGroup.append('circle')
                .attr('r', Math.sqrt(loc.population / 100000))
                .attr('fill', 'none')
                .attr('stroke', '#00aaff')
                .attr('stroke-width', 0.5)
                .attr('opacity', 0.5);
                
        } else if (loc.type === 'vortex') {
            // Vortex marker - spiral pattern
            const spiral = d3.lineRadial()
                .angle(d => d * 2 * Math.PI)
                .radius(d => d * loc.power / 2)
                .curve(d3.curveBasis);
                
            locGroup.append('path')
                .datum(d3.range(0, 3, 0.1))
                .attr('d', spiral)
                .attr('fill', 'none')
                .attr('stroke', '#ff00ff')
                .attr('stroke-width', 1.5)
                .attr('opacity', 0.8)
                .style('filter', 'drop-shadow(0 0 3px #ff00ff)');
                
            // Add rotation animation
            locGroup.append('animateTransform')
                .attr('attributeName', 'transform')
                .attr('type', 'rotate')
                .attr('from', `0 ${x} ${y}`)
                .attr('to', `360 ${x} ${y}`)
                .attr('dur', '20s')
                .attr('repeatCount', 'indefinite');
                
        } else if (loc.type === 'underground') {
            // Underground base marker
            locGroup.append('rect')
                .attr('x', -5)
                .attr('y', -5)
                .attr('width', 10)
                .attr('height', 10)
                .attr('fill', '#ff6b6b')
                .attr('fill-opacity', 0.6)
                .attr('stroke', '#ff0000')
                .attr('stroke-width', 1)
                .attr('transform', 'rotate(45)');
                
            // Depth rings
            for (let i = 1; i <= loc.depth / 2; i++) {
                locGroup.append('rect')
                    .attr('x', -5 - (i * 3))
                    .attr('y', -5 - (i * 3))
                    .attr('width', 10 + (i * 6))
                    .attr('height', 10 + (i * 6))
                    .attr('fill', 'none')
                    .attr('stroke', '#ff6b6b')
                    .attr('stroke-width', 0.5)
                    .attr('opacity', 0.4 - (i * 0.1))
                    .attr('transform', 'rotate(45)');
            }
        } else if (loc.type === 'energy') {
            // Energy node marker
            locGroup.append('circle')
                .attr('r', loc.power)
                .attr('fill', '#ffcc00')
                .attr('opacity', 0.6);
                
            // Pulsing ring
            locGroup.append('circle')
                .attr('r', loc.power)
                .attr('fill', 'none')
                .attr('stroke', '#ffcc00')
                .attr('stroke-width', 2)
                .attr('opacity', 0)
                .append('animate')
                .attr('attributeName', 'r')
                .attr('from', loc.power)
                .attr('to', loc.power * 3)
                .attr('dur', '3s')
                .attr('repeatCount', 'indefinite');
        }

        // Add label for important locations
        if (loc.power >= 7 || loc.type === 'vortex') {
            locGroup.append('text')
                .attr('x', 10)
                .attr('y', -5)
                .text(loc.name)
                .style('font-size', '10px')
                .style('fill', '#00ffcc')
                .style('text-shadow', '0 0 3px rgba(0, 0, 0, 0.8)');
        }

        // Enhanced tooltip
        locGroup.on('click', function(event) {
            event.stopPropagation();
            const [pageX, pageY] = [event.pageX, event.pageY];
            
            const details = {
                name: loc.name,
                type: loc.type,
                coords: loc.coords,
                ...loc
            };
            
            window.enhancedPopup.show(details, pageX, pageY);
        })
        .on('mouseover', function() {
            d3.select(this).selectAll('*')
                .attr('opacity', function() {
                    return parseFloat(d3.select(this).attr('opacity') || 1) * 1.2;
                });
        })
        .on('mouseout', function() {
            d3.select(this).selectAll('*')
                .attr('opacity', function() {
                    return parseFloat(d3.select(this).attr('opacity') || 1) / 1.2;
                });
        });
    });

    // Add Appalachian energy spine
    const appalachianSpine = [
        [-82.5, 46.5], // Northern terminus
        [-78.9, 43.2], // Adirondacks
        [-74.5, 41.5], // Catskills
        [-77.5, 39.7], // Pennsylvania
        [-79.5, 38.5], // West Virginia
        [-82.5, 36.5], // Tennessee
        [-84.3, 34.0]  // Georgia
    ];

    g.append('path')
        .datum(appalachianSpine)
        .attr('d', channelPath)
        .attr('fill', 'none')
        .attr('stroke', '#228b22')
        .attr('stroke-width', 2)
        .attr('opacity', 0.5)
        .style('stroke-dasharray', '5,3')
        .style('filter', 'drop-shadow(0 0 3px #228b22)')
        .attr('class', 'appalachian-spine');

    // Add regional ley lines
    const regionalLeyLines = [
        {start: [-71.0589, 42.3601], end: [-74.0060, 40.7128], name: "Boston-NYC Line", frequency: 8.3},
        {start: [-74.0060, 40.7128], end: [-75.1652, 39.9526], name: "NYC-Philadelphia Line", frequency: 8.7},
        {start: [-75.1652, 39.9526], end: [-77.0369, 38.9072], name: "Philadelphia-DC Line", frequency: 9.1},
        {start: [-74.1404, 41.2370], end: [-71.8674, 41.0637], name: "Harriman-Montauk Line", frequency: 11.5}
    ];

    regionalLeyLines.forEach(line => {
        const lineGen = d3.geoPath().projection(projection);
        const linePath = {
            type: "LineString",
            coordinates: [line.start, line.end]
        };

        g.append('path')
            .datum(linePath)
            .attr('d', lineGen)
            .attr('fill', 'none')
            .attr('stroke', '#00ffcc')
            .attr('stroke-width', 1.5)
            .attr('opacity', 0.5)
            .style('stroke-dasharray', '3,2')
            .attr('class', 'regional-ley-line');
    });
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