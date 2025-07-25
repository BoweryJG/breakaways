// Population Genetics Distribution Visualization for Breakaway Civilization Dashboard
// Tracks ethnic groups, migration patterns, haplogroups, and genetic diversity

// Initialize Population Genetics Visualization
function initPopulationGenetics() {
    const container = document.getElementById('population-genetics-container');
    const width = container.clientWidth;
    const height = 600;

    // Clear any existing content
    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#0a1929');

    // Create projection for world map
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

    // Create main group
    const g = svg.append('g');

    // Define ethnic groups and their historical migrations
    const ethnicGroups = {
        'Indo-European': {
            color: '#00ffcc',
            origins: [[45, 45]], // Pontic-Caspian steppe
            migrations: [
                {from: [45, 45], to: [10, 50], time: -3500, group: 'Proto-Europeans'},
                {from: [45, 45], to: [70, 30], time: -3000, group: 'Indo-Iranians'},
                {from: [10, 50], to: [-5, 40], time: -2500, group: 'Celts'},
                {from: [10, 50], to: [25, 55], time: -2000, group: 'Germanics'},
                {from: [10, 50], to: [12, 42], time: -2000, group: 'Italic'}
            ]
        },
        'Semitic': {
            color: '#ff6b6b',
            origins: [[35, 30]], // Arabian Peninsula
            migrations: [
                {from: [35, 30], to: [35, 33], time: -3000, group: 'Levantine'},
                {from: [35, 30], to: [30, 15], time: -2500, group: 'Ethiopian'},
                {from: [35, 33], to: [33, 30], time: -2000, group: 'Phoenician'},
                {from: [35, 33], to: [-5, 35], time: -1000, group: 'Carthaginian'}
            ]
        },
        'Hamitic': {
            color: '#ffcc00',
            origins: [[30, 25]], // Northeast Africa
            migrations: [
                {from: [30, 25], to: [20, 10], time: -4000, group: 'Nilotic'},
                {from: [30, 25], to: [0, 20], time: -3500, group: 'Cushitic'},
                {from: [30, 25], to: [-10, 30], time: -3000, group: 'Berber'}
            ]
        },
        'Turkic-Mongolic': {
            color: '#ff00ff',
            origins: [[90, 45]], // Central Asian steppes
            migrations: [
                {from: [90, 45], to: [70, 50], time: -1000, group: 'Huns'},
                {from: [90, 45], to: [100, 40], time: -500, group: 'Mongols'},
                {from: [90, 45], to: [30, 40], time: -1500, group: 'Early Turkic'},
                {from: [30, 40], to: [28, 41], time: -600, group: 'Ottoman'}
            ]
        },
        'Sino-Tibetan': {
            color: '#00ff00',
            origins: [[100, 35]], // Yellow River valley
            migrations: [
                {from: [100, 35], to: [105, 23], time: -3000, group: 'Proto-Chinese'},
                {from: [100, 35], to: [90, 30], time: -2500, group: 'Tibetan'},
                {from: [105, 23], to: [100, 15], time: -2000, group: 'Austro-Asiatic'}
            ]
        },
        'Dravidian': {
            color: '#ff8c00',
            origins: [[75, 20]], // Indian subcontinent
            migrations: [
                {from: [75, 20], to: [80, 10], time: -3500, group: 'South Dravidian'},
                {from: [75, 20], to: [73, 25], time: -3000, group: 'North Dravidian'}
            ]
        },
        'Austronesian': {
            color: '#00ccff',
            origins: [[120, 23]], // Taiwan
            migrations: [
                {from: [120, 23], to: [125, 10], time: -3000, group: 'Philippines'},
                {from: [125, 10], to: [110, -5], time: -2500, group: 'Indonesian'},
                {from: [110, -5], to: [150, -20], time: -2000, group: 'Melanesian'},
                {from: [150, -20], to: [-150, -10], time: -1500, group: 'Polynesian'}
            ]
        },
        'Sub-Saharan African': {
            color: '#8b4513',
            origins: [[20, 0]], // Central Africa
            migrations: [
                {from: [20, 0], to: [30, -20], time: -2000, group: 'Bantu Expansion'},
                {from: [20, 0], to: [10, 5], time: -3000, group: 'West African'},
                {from: [30, -20], to: [35, -30], time: -1500, group: 'Southern Bantu'}
            ]
        },
        'Native American': {
            color: '#dc143c',
            origins: [[170, 65]], // Beringia
            migrations: [
                {from: [170, 65], to: [-150, 60], time: -15000, group: 'First Americans'},
                {from: [-150, 60], to: [-100, 40], time: -12000, group: 'Clovis'},
                {from: [-100, 40], to: [-90, 20], time: -10000, group: 'Mesoamerican'},
                {from: [-90, 20], to: [-70, -10], time: -8000, group: 'Andean'}
            ]
        }
    };

    // RH negative blood type distribution data
    const rhNegativeData = [
        {region: 'Basque Country', coords: [-2, 43], percentage: 35, note: 'Highest concentration globally'},
        {region: 'Morocco Atlas', coords: [-5, 32], percentage: 29, note: 'Berber populations'},
        {region: 'Scottish Highlands', coords: [-4, 57], percentage: 26, note: 'Celtic populations'},
        {region: 'Catalonia', coords: [2, 41], percentage: 25, note: 'Mediterranean anomaly'},
        {region: 'Ireland', coords: [-8, 53], percentage: 25, note: 'Celtic stronghold'},
        {region: 'Iceland', coords: [-20, 65], percentage: 23, note: 'Isolated population'},
        {region: 'Ethiopia', coords: [38, 8], percentage: 20, note: 'African anomaly'},
        {region: 'Iran', coords: [51, 32], percentage: 18, note: 'Persian populations'},
        {region: 'Egypt', coords: [30, 26], percentage: 17, note: 'Ancient bloodlines'},
        {region: 'India North', coords: [77, 28], percentage: 15, note: 'Indo-European influence'},
        {region: 'Scandinavia', coords: [10, 60], percentage: 15, note: 'Nordic populations'},
        {region: 'China', coords: [105, 35], percentage: 1, note: 'Lowest globally'},
        {region: 'Native Americas', coords: [-90, 15], percentage: 1, note: 'Pre-Columbian'},
        {region: 'Sub-Saharan Africa', coords: [20, 0], percentage: 3, note: 'Low frequency'},
        {region: 'Japan', coords: [138, 36], percentage: 0.5, note: 'Extremely rare'}
    ];

    // Ancient DNA haplogroups
    const haplogroups = {
        'R1b': {
            color: '#00ffcc',
            regions: [
                {coords: [-5, 40], density: 70, name: 'Iberia'},
                {coords: [-3, 54], density: 65, name: 'British Isles'},
                {coords: [2, 47], density: 60, name: 'France'},
                {coords: [-2, 43], density: 85, name: 'Basque'}
            ]
        },
        'R1a': {
            color: '#ff6b6b',
            regions: [
                {coords: [20, 52], density: 55, name: 'Poland'},
                {coords: [40, 55], density: 50, name: 'Russia'},
                {coords: [75, 30], density: 45, name: 'North India'}
            ]
        },
        'J2': {
            color: '#ffcc00',
            regions: [
                {coords: [35, 33], density: 40, name: 'Levant'},
                {coords: [45, 40], density: 35, name: 'Caucasus'},
                {coords: [23, 38], density: 30, name: 'Greece'}
            ]
        },
        'E1b1b': {
            color: '#ff00ff',
            regions: [
                {coords: [30, 25], density: 60, name: 'Egypt'},
                {coords: [10, 35], density: 45, name: 'North Africa'},
                {coords: [38, 8], density: 40, name: 'Ethiopia'}
            ]
        },
        'O': {
            color: '#00ff00',
            regions: [
                {coords: [105, 35], density: 75, name: 'China'},
                {coords: [127, 37], density: 70, name: 'Korea'},
                {coords: [138, 36], density: 65, name: 'Japan'}
            ]
        },
        'Q': {
            color: '#dc143c',
            regions: [
                {coords: [-100, 40], density: 80, name: 'Native North America'},
                {coords: [-70, -10], density: 75, name: 'Andes'},
                {coords: [90, 50], density: 20, name: 'Siberia'}
            ]
        }
    };

    // Load world map
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json').then(world => {
        // Draw ocean
        g.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', '#0a1929');

        // Draw land
        g.append('g')
            .selectAll('path')
            .data(topojson.feature(world, world.objects.land).features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', '#1a2332')
            .attr('stroke', '#2a3442')
            .attr('stroke-width', 0.5);

        // Initialize visualization layers
        drawMigrationPaths(g, projection, ethnicGroups);
        drawGeneticDiversityHeatmap(g, projection);
        drawRhNegativeDistribution(g, projection, rhNegativeData);
        drawHaplogroupDistribution(g, projection, haplogroups);
        drawAncientCivilizationConnections(g, projection);
        
        // Add interactive timeline
        createMigrationTimeline(svg, width, height, ethnicGroups);
        
        // Add legend
        createLegend(svg, width, ethnicGroups, haplogroups);
    });
}

function drawMigrationPaths(g, projection, ethnicGroups) {
    const migrationG = g.append('g').attr('class', 'migration-paths');
    
    Object.entries(ethnicGroups).forEach(([groupName, groupData]) => {
        // Draw origin points
        groupData.origins.forEach(origin => {
            const [x, y] = projection(origin);
            
            migrationG.append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 8)
                .attr('fill', groupData.color)
                .attr('opacity', 0.8)
                .attr('class', 'origin-point')
                .on('mouseover', function() {
                    showTooltip(`${groupName} Origin`, x, y);
                })
                .on('mouseout', hideTooltip);
        });
        
        // Draw migration arrows
        groupData.migrations.forEach((migration, i) => {
            const lineGenerator = d3.line()
                .x(d => projection(d)[0])
                .y(d => projection(d)[1])
                .curve(d3.curveCardinal);
            
            const pathData = [migration.from, migration.to];
            
            migrationG.append('path')
                .datum(pathData)
                .attr('d', lineGenerator)
                .attr('fill', 'none')
                .attr('stroke', groupData.color)
                .attr('stroke-width', 2)
                .attr('opacity', 0.6)
                .attr('class', `migration-path ${groupName}`)
                .style('stroke-dasharray', '5,5')
                .on('mouseover', function() {
                    d3.select(this).attr('stroke-width', 3);
                    const [mx, my] = projection(migration.to);
                    showTooltip(`${migration.group} (${migration.time} BCE)`, mx, my);
                })
                .on('mouseout', function() {
                    d3.select(this).attr('stroke-width', 2);
                    hideTooltip();
                });
            
            // Add arrowheads
            const [endX, endY] = projection(migration.to);
            migrationG.append('polygon')
                .attr('points', '0,-5 10,0 0,5')
                .attr('fill', groupData.color)
                .attr('transform', `translate(${endX},${endY}) rotate(${getAngle(migration.from, migration.to, projection)})`)
                .attr('opacity', 0.6);
        });
    });
}

function drawGeneticDiversityHeatmap(g, projection) {
    const heatmapG = g.append('g').attr('class', 'genetic-diversity-heatmap');
    
    // Genetic diversity hotspots
    const diversityHotspots = [
        {coords: [20, 0], diversity: 95, name: 'Central Africa - Highest diversity'},
        {coords: [35, -5], diversity: 90, name: 'East Africa - Cradle of humanity'},
        {coords: [45, 40], diversity: 75, name: 'Caucasus - Crossroads'},
        {coords: [70, 30], diversity: 70, name: 'Central Asia - Silk Road'},
        {coords: [35, 35], diversity: 65, name: 'Mediterranean - Maritime mixing'},
        {coords: [-90, 15], diversity: 60, name: 'Mesoamerica - Indigenous diversity'},
        {coords: [110, -5], diversity: 65, name: 'Indonesia - Island diversity'},
        {coords: [150, -25], diversity: 55, name: 'Australia - Aboriginal isolation'}
    ];
    
    diversityHotspots.forEach(spot => {
        const [x, y] = projection(spot.coords);
        
        const gradient = heatmapG.append('defs')
            .append('radialGradient')
            .attr('id', `diversity-gradient-${x}-${y}`);
        
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#ff00ff')
            .attr('stop-opacity', spot.diversity / 100 * 0.8);
        
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#ff00ff')
            .attr('stop-opacity', 0);
        
        heatmapG.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', spot.diversity / 2)
            .attr('fill', `url(#diversity-gradient-${x}-${y})`)
            .attr('class', 'diversity-hotspot')
            .on('mouseover', function() {
                showTooltip(spot.name, x, y);
            })
            .on('mouseout', hideTooltip);
    });
}

function drawRhNegativeDistribution(g, projection, rhNegativeData) {
    const rhG = g.append('g').attr('class', 'rh-negative-distribution');
    
    rhNegativeData.forEach(data => {
        const [x, y] = projection(data.coords);
        const radius = Math.sqrt(data.percentage) * 3;
        
        // Outer glow for RH negative concentrations
        rhG.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', radius * 2)
            .attr('fill', 'none')
            .attr('stroke', '#00ffcc')
            .attr('stroke-width', 1)
            .attr('opacity', 0.3)
            .attr('class', 'rh-glow');
        
        // Inner circle sized by percentage
        rhG.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', radius)
            .attr('fill', '#00ffcc')
            .attr('opacity', 0.7)
            .attr('class', 'rh-marker')
            .on('mouseover', function() {
                d3.select(this).attr('r', radius * 1.5);
                showTooltip(`${data.region}: ${data.percentage}% RH- (${data.note})`, x, y);
            })
            .on('mouseout', function() {
                d3.select(this).attr('r', radius);
                hideTooltip();
            });
        
        // Add percentage text for high concentrations
        if (data.percentage > 20) {
            rhG.append('text')
                .attr('x', x)
                .attr('y', y)
                .attr('text-anchor', 'middle')
                .attr('dy', '0.35em')
                .attr('font-size', '10px')
                .attr('fill', '#000')
                .attr('font-weight', 'bold')
                .text(`${data.percentage}%`);
        }
    });
}

function drawHaplogroupDistribution(g, projection, haplogroups) {
    const haploG = g.append('g').attr('class', 'haplogroup-distribution');
    
    Object.entries(haplogroups).forEach(([haplo, data]) => {
        data.regions.forEach(region => {
            const [x, y] = projection(region.coords);
            
            // Create pie slice for haplogroup density
            const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(region.density / 4);
            
            haploG.append('path')
                .attr('d', arc({
                    startAngle: 0,
                    endAngle: (region.density / 100) * 2 * Math.PI
                }))
                .attr('transform', `translate(${x},${y})`)
                .attr('fill', data.color)
                .attr('opacity', 0.6)
                .attr('class', `haplogroup-${haplo}`)
                .on('mouseover', function() {
                    showTooltip(`${haplo} - ${region.name}: ${region.density}%`, x, y);
                })
                .on('mouseout', hideTooltip);
        });
    });
}

function drawAncientCivilizationConnections(g, projection) {
    const civilizationG = g.append('g').attr('class', 'ancient-civilizations');
    
    // Ancient civilization genetic connections
    const connections = [
        {
            name: 'Sumerian-Egyptian',
            path: [[45, 30], [35, 30], [30, 25]],
            color: '#ffd700',
            note: 'Shared R1b haplogroups'
        },
        {
            name: 'Indus Valley-Mesopotamian',
            path: [[70, 25], [50, 30], [45, 30]],
            color: '#ff8c00',
            note: 'J2 haplogroup connection'
        },
        {
            name: 'Minoan-Egyptian',
            path: [[25, 35], [30, 32], [31, 30]],
            color: '#00ccff',
            note: 'Maritime genetic exchange'
        },
        {
            name: 'Olmec-Asian',
            path: [[-95, 18], [-150, 20], [120, 25]],
            color: '#dc143c',
            note: 'Trans-Pacific connection theory'
        }
    ];
    
    connections.forEach(conn => {
        const lineGenerator = d3.line()
            .x(d => projection(d)[0])
            .y(d => projection(d)[1])
            .curve(d3.curveBasis);
        
        civilizationG.append('path')
            .datum(conn.path)
            .attr('d', lineGenerator)
            .attr('fill', 'none')
            .attr('stroke', conn.color)
            .attr('stroke-width', 2)
            .attr('opacity', 0.4)
            .attr('stroke-dasharray', '10,5')
            .attr('class', 'civilization-connection')
            .on('mouseover', function() {
                d3.select(this).attr('stroke-width', 3).attr('opacity', 0.8);
                const midPoint = conn.path[Math.floor(conn.path.length / 2)];
                const [mx, my] = projection(midPoint);
                showTooltip(`${conn.name}: ${conn.note}`, mx, my);
            })
            .on('mouseout', function() {
                d3.select(this).attr('stroke-width', 2).attr('opacity', 0.4);
                hideTooltip();
            });
    });
}

function createMigrationTimeline(svg, width, height, ethnicGroups) {
    const timelineHeight = 100;
    const timelineY = height - timelineHeight - 20;
    
    const timelineG = svg.append('g')
        .attr('class', 'migration-timeline')
        .attr('transform', `translate(50, ${timelineY})`);
    
    // Time scale from -15000 to present
    const timeScale = d3.scaleLinear()
        .domain([-15000, 0])
        .range([0, width - 100]);
    
    // Add timeline axis
    const timeAxis = d3.axisBottom(timeScale)
        .tickValues([-15000, -10000, -5000, -3000, -1000, 0])
        .tickFormat(d => `${Math.abs(d)} BCE`);
    
    timelineG.append('g')
        .attr('class', 'timeline-axis')
        .call(timeAxis)
        .style('color', '#00ffcc');
    
    // Add migration events on timeline
    Object.entries(ethnicGroups).forEach(([group, data], i) => {
        data.migrations.forEach(migration => {
            const x = timeScale(migration.time);
            const y = -10 - (i * 5);
            
            timelineG.append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 3)
                .attr('fill', data.color)
                .attr('class', 'timeline-event')
                .on('mouseover', function() {
                    showTooltip(`${migration.group} migration`, x + 50, timelineY + y);
                })
                .on('mouseout', hideTooltip);
        });
    });
    
    // Add time period labels
    const periods = [
        {start: -15000, end: -10000, name: 'Ice Age Migrations'},
        {start: -10000, end: -5000, name: 'Neolithic Revolution'},
        {start: -5000, end: -3000, name: 'Bronze Age'},
        {start: -3000, end: -1000, name: 'Iron Age'},
        {start: -1000, end: 0, name: 'Classical Period'}
    ];
    
    periods.forEach(period => {
        const x1 = timeScale(period.start);
        const x2 = timeScale(period.end);
        
        timelineG.append('rect')
            .attr('x', x1)
            .attr('y', 20)
            .attr('width', x2 - x1)
            .attr('height', 20)
            .attr('fill', '#00ffcc')
            .attr('opacity', 0.1)
            .attr('class', 'time-period');
        
        timelineG.append('text')
            .attr('x', (x1 + x2) / 2)
            .attr('y', 35)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('fill', '#00ffcc')
            .text(period.name);
    });
}

function createLegend(svg, width, ethnicGroups, haplogroups) {
    const legendG = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 200}, 20)`);
    
    // Ethnic groups legend
    legendG.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('font-size', '14px')
        .attr('fill', '#00ffcc')
        .attr('font-weight', 'bold')
        .text('Ethnic Groups');
    
    Object.entries(ethnicGroups).forEach(([group, data], i) => {
        const y = 20 + (i * 15);
        
        legendG.append('line')
            .attr('x1', 0)
            .attr('y1', y)
            .attr('x2', 20)
            .attr('y2', y)
            .attr('stroke', data.color)
            .attr('stroke-width', 2);
        
        legendG.append('text')
            .attr('x', 25)
            .attr('y', y)
            .attr('dy', '0.35em')
            .attr('font-size', '10px')
            .attr('fill', '#a0a0a0')
            .text(group);
    });
    
    // Haplogroups legend
    const haploY = 20 + (Object.keys(ethnicGroups).length * 15) + 20;
    
    legendG.append('text')
        .attr('x', 0)
        .attr('y', haploY)
        .attr('font-size', '14px')
        .attr('fill', '#00ffcc')
        .attr('font-weight', 'bold')
        .text('Haplogroups');
    
    Object.entries(haplogroups).forEach(([haplo, data], i) => {
        const y = haploY + 20 + (i * 15);
        
        legendG.append('circle')
            .attr('cx', 10)
            .attr('cy', y)
            .attr('r', 5)
            .attr('fill', data.color)
            .attr('opacity', 0.6);
        
        legendG.append('text')
            .attr('x', 25)
            .attr('y', y)
            .attr('dy', '0.35em')
            .attr('font-size', '10px')
            .attr('fill', '#a0a0a0')
            .text(haplo);
    });
}

function getAngle(from, to, projection) {
    const [x1, y1] = projection(from);
    const [x2, y2] = projection(to);
    return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
}

function showTooltip(text, x, y) {
    let tooltip = d3.select('body').select('.genetics-tooltip');
    if (tooltip.empty()) {
        tooltip = d3.select('body')
            .append('div')
            .attr('class', 'genetics-tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.9)')
            .style('color', '#00ffcc')
            .style('padding', '8px 12px')
            .style('border', '1px solid #00ffcc')
            .style('border-radius', '4px')
            .style('pointer-events', 'none')
            .style('font-size', '12px')
            .style('box-shadow', '0 0 10px rgba(0, 255, 204, 0.5)')
            .style('z-index', 1000);
    }
    
    tooltip
        .style('opacity', 1)
        .style('left', (x + 10) + 'px')
        .style('top', (y - 30) + 'px')
        .html(text);
}

function hideTooltip() {
    d3.select('.genetics-tooltip').style('opacity', 0);
}

// Layer visibility control
function setupLayerControls() {
    const layerCheckboxes = document.querySelectorAll('.genetics-layer');
    
    layerCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const layer = e.target.dataset.layer;
            const isVisible = e.target.checked;
            
            // Update visibility based on layer
            switch(layer) {
                case 'migrations':
                    d3.selectAll('.migration-paths').style('visibility', isVisible ? 'visible' : 'hidden');
                    break;
                case 'diversity':
                    d3.selectAll('.genetic-diversity-heatmap').style('visibility', isVisible ? 'visible' : 'hidden');
                    break;
                case 'rh-negative':
                    d3.selectAll('.rh-negative-distribution').style('visibility', isVisible ? 'visible' : 'hidden');
                    break;
                case 'haplogroups':
                    d3.selectAll('.haplogroup-distribution').style('visibility', isVisible ? 'visible' : 'hidden');
                    break;
                case 'ancient':
                    d3.selectAll('.ancient-civilizations').style('visibility', isVisible ? 'visible' : 'hidden');
                    break;
            }
        });
    });
}

// Initialize when called
function initPopulationGeneticsWithControls() {
    initPopulationGeneticsBase();
    setupLayerControls();
}

// Rename the base function to avoid naming conflict
const initPopulationGeneticsBase = initPopulationGenetics;

// Export function for use in main visualization system
window.initPopulationGenetics = initPopulationGeneticsWithControls;