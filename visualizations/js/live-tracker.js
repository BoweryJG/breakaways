// Live Global Awakening Tracker - Real-time monitoring system
// Simulates real-time data feeds for various phenomena

class LiveTracker {
    constructor() {
        this.container = document.getElementById('live-tracker');
        this.map = null;
        this.eventFeeds = new Map();
        this.alerts = [];
        this.correlations = new Map();
        this.websocket = null;
        this.isActive = false;
        
        // Event type configurations
        this.eventTypes = {
            uap: {
                name: 'UAP Sightings',
                color: '#ff00ff',
                icon: '●',
                threshold: 5,
                heatIntensity: 0.8
            },
            missing411: {
                name: 'Missing 411',
                color: '#ff6b6b',
                icon: '⚠',
                threshold: 3,
                heatIntensity: 1.0
            },
            seismic: {
                name: 'Seismic Anomalies',
                color: '#ffa500',
                icon: '◆',
                threshold: 4,
                heatIntensity: 0.6
            },
            emSpike: {
                name: 'EM Field Spikes',
                color: '#00ffcc',
                icon: '⚡',
                threshold: 10,
                heatIntensity: 0.7
            },
            cropCircle: {
                name: 'Crop Formations',
                color: '#90ee90',
                icon: '⊕',
                threshold: 2,
                heatIntensity: 0.5
            },
            consciousness: {
                name: 'Consciousness Shifts',
                color: '#ffffff',
                icon: '◉',
                threshold: 15,
                heatIntensity: 0.4
            }
        };
        
        // Regional consciousness levels
        this.consciousnessData = {
            'North America': { level: 72, trend: 'rising', sentiment: 0.65 },
            'Europe': { level: 78, trend: 'stable', sentiment: 0.71 },
            'Asia': { level: 81, trend: 'rising', sentiment: 0.73 },
            'South America': { level: 69, trend: 'falling', sentiment: 0.62 },
            'Africa': { level: 64, trend: 'rising', sentiment: 0.58 },
            'Australia': { level: 75, trend: 'stable', sentiment: 0.68 },
            'Antarctica': { level: 95, trend: 'critical', sentiment: 0.89 }
        };
        
        // Statistics tracking
        this.stats = {
            totalEvents: 0,
            eventsByType: {},
            correlationStrength: 0,
            awakeningIndex: 75,
            criticalLocations: [],
            predictedHotspots: []
        };
        
        // Initialize event counts
        Object.keys(this.eventTypes).forEach(type => {
            this.stats.eventsByType[type] = 0;
        });
    }
    
    init() {
        this.isActive = true;
        this.createUI();
        this.initializeMap();
        this.initializeWebSocket();
        this.startDataFeeds();
        this.initializeControls();
        this.updateDashboard();
    }
    
    cleanup() {
        this.isActive = false;
        if (this.websocket) {
            this.websocket.close();
        }
        if (this.map) {
            this.map.remove();
        }
        // Clear all intervals
        if (this.dataInterval) clearInterval(this.dataInterval);
        if (this.correlationInterval) clearInterval(this.correlationInterval);
        if (this.consciousnessInterval) clearInterval(this.consciousnessInterval);
        if (this.predictiveInterval) clearInterval(this.predictiveInterval);
    }
    
    createUI() {
        this.container.innerHTML = `
            <div class="live-tracker-container">
                <div class="tracker-header">
                    <h2>Live Global Awakening Tracker</h2>
                    <div class="tracker-status">
                        <span class="status-indicator active"></span>
                        <span>SYSTEM ACTIVE</span>
                        <span class="timestamp">${new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
                
                <div class="tracker-grid">
                    <!-- Main Map -->
                    <div class="map-section">
                        <div id="live-map"></div>
                        <div class="map-overlays">
                            <div class="heat-map-toggle">
                                <label>
                                    <input type="checkbox" id="heat-overlay" checked>
                                    Awakening Heat Map
                                </label>
                            </div>
                            <div class="event-filters">
                                ${Object.entries(this.eventTypes).map(([key, type]) => `
                                    <label class="event-filter">
                                        <input type="checkbox" data-event="${key}" checked>
                                        <span style="color: ${type.color}">${type.icon}</span>
                                        ${type.name}
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Alert Panel -->
                    <div class="alert-panel">
                        <h3>ALERT SYSTEM</h3>
                        <div class="alert-list" id="alert-list"></div>
                    </div>
                    
                    <!-- Event Timeline -->
                    <div class="event-timeline">
                        <h3>EVENT TIMELINE</h3>
                        <div class="timeline-filters">
                            <select id="timeline-filter">
                                <option value="all">All Events</option>
                                ${Object.entries(this.eventTypes).map(([key, type]) => 
                                    `<option value="${key}">${type.name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="timeline-container" id="timeline-container"></div>
                    </div>
                    
                    <!-- Statistics Dashboard -->
                    <div class="stats-dashboard">
                        <h3>LIVE STATISTICS</h3>
                        <div class="stats-grid">
                            <div class="stat-card">
                                <h4>Total Events</h4>
                                <div class="stat-value" id="total-events">0</div>
                            </div>
                            <div class="stat-card">
                                <h4>Correlation Index</h4>
                                <div class="stat-value" id="correlation-index">0%</div>
                            </div>
                            <div class="stat-card">
                                <h4>Awakening Level</h4>
                                <div class="stat-value glowing" id="awakening-level">75%</div>
                            </div>
                            <div class="stat-card">
                                <h4>Critical Zones</h4>
                                <div class="stat-value warning" id="critical-zones">0</div>
                            </div>
                        </div>
                        <div class="event-breakdown">
                            <h4>Event Breakdown</h4>
                            <div id="event-chart"></div>
                        </div>
                    </div>
                    
                    <!-- Consciousness Monitor -->
                    <div class="consciousness-monitor">
                        <h3>CONSCIOUSNESS LEVELS BY REGION</h3>
                        <div id="consciousness-chart"></div>
                        <div class="consciousness-details" id="consciousness-details"></div>
                    </div>
                    
                    <!-- Social Media Sentiment -->
                    <div class="sentiment-analysis">
                        <h3>SOCIAL MEDIA SENTIMENT</h3>
                        <div class="sentiment-meter">
                            <div class="meter-container">
                                <div class="meter-fill" id="sentiment-fill"></div>
                                <div class="meter-labels">
                                    <span>Fear</span>
                                    <span>Neutral</span>
                                    <span>Awakening</span>
                                </div>
                            </div>
                        </div>
                        <div class="trending-topics">
                            <h4>Trending Awakening Topics</h4>
                            <div id="trending-list"></div>
                        </div>
                    </div>
                    
                    <!-- Predictive Analysis -->
                    <div class="predictive-panel">
                        <h3>PREDICTIVE ALERTS</h3>
                        <div class="prediction-list" id="prediction-list"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    initializeMap() {
        // Create world map using D3
        const mapContainer = d3.select('#live-map');
        const width = mapContainer.node().getBoundingClientRect().width;
        const height = 500;
        
        const svg = mapContainer.append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('background', '#0a0a0a');
        
        const projection = d3.geoNaturalEarth1()
            .scale(width / 7)
            .translate([width / 2, height / 2]);
        
        const path = d3.geoPath().projection(projection);
        
        // Add map layers
        const g = svg.append('g');
        
        // Load world map data
        d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(world => {
            // Draw countries
            g.selectAll('path')
                .data(topojson.feature(world, world.objects.countries).features)
                .enter().append('path')
                .attr('d', path)
                .attr('fill', '#1a1a1a')
                .attr('stroke', '#2a2a2a')
                .attr('stroke-width', 0.5);
            
            // Create layers for different event types
            this.eventLayers = {};
            Object.keys(this.eventTypes).forEach(type => {
                this.eventLayers[type] = g.append('g')
                    .attr('class', `event-layer ${type}-layer`);
            });
            
            // Heat map layer
            this.heatMapLayer = g.append('g')
                .attr('class', 'heat-map-layer')
                .style('opacity', 0.6);
            
            // Initialize heat map
            this.initializeHeatMap();
        });
        
        this.mapSvg = svg;
        this.mapG = g;
        this.projection = projection;
    }
    
    initializeHeatMap() {
        // Create heat map grid
        const gridSize = 20;
        const width = this.mapSvg.node().getBoundingClientRect().width;
        const height = 500;
        
        const heatData = [];
        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
                heatData.push({
                    x: x,
                    y: y,
                    intensity: 0
                });
            }
        }
        
        this.heatData = heatData;
        
        // Create color scale
        const colorScale = d3.scaleLinear()
            .domain([0, 0.3, 0.6, 1])
            .range(['transparent', '#00ffcc', '#ff00ff', '#ff0000']);
        
        // Draw heat map cells
        this.heatCells = this.heatMapLayer.selectAll('rect')
            .data(heatData)
            .enter().append('rect')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('width', gridSize)
            .attr('height', gridSize)
            .attr('fill', d => colorScale(d.intensity))
            .style('mix-blend-mode', 'screen');
    }
    
    initializeWebSocket() {
        // Simulate WebSocket connection
        this.websocket = {
            readyState: 1,
            close: () => {}
        };
        
        // Simulate incoming messages
        this.simulateWebSocketMessages();
    }
    
    simulateWebSocketMessages() {
        // Generate random events at intervals
        this.dataInterval = setInterval(() => {
            if (!this.isActive) return;
            
            // Generate 1-3 random events
            const numEvents = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numEvents; i++) {
                this.generateRandomEvent();
            }
        }, 2000);
        
        // Update correlations
        this.correlationInterval = setInterval(() => {
            if (!this.isActive) return;
            this.updateCorrelations();
        }, 5000);
        
        // Update consciousness levels
        this.consciousnessInterval = setInterval(() => {
            if (!this.isActive) return;
            this.updateConsciousnessLevels();
        }, 10000);
        
        // Generate predictions
        this.predictiveInterval = setInterval(() => {
            if (!this.isActive) return;
            this.generatePredictions();
        }, 15000);
    }
    
    generateRandomEvent() {
        const eventTypeKeys = Object.keys(this.eventTypes);
        const type = eventTypeKeys[Math.floor(Math.random() * eventTypeKeys.length)];
        
        // Generate random location with bias towards certain hotspots
        const hotspots = [
            { lat: 19.5, lon: -155.5, name: 'Hawaii' },
            { lat: 51.5, lon: -0.1, name: 'London' },
            { lat: 37.8, lon: -122.4, name: 'San Francisco' },
            { lat: -33.9, lon: 18.4, name: 'Cape Town' },
            { lat: 35.7, lon: 139.7, name: 'Tokyo' },
            { lat: -78.0, lon: 0.0, name: 'Antarctica' },
            { lat: 27.2, lon: 78.0, name: 'Agra' },
            { lat: -13.2, lon: -72.5, name: 'Machu Picchu' },
            { lat: 29.9, lon: 31.1, name: 'Giza' },
            { lat: 51.2, lon: -1.8, name: 'Stonehenge' }
        ];
        
        let location;
        if (Math.random() < 0.7) {
            // Use hotspot
            const hotspot = hotspots[Math.floor(Math.random() * hotspots.length)];
            location = {
                lat: hotspot.lat + (Math.random() - 0.5) * 5,
                lon: hotspot.lon + (Math.random() - 0.5) * 5,
                name: hotspot.name
            };
        } else {
            // Random location
            location = {
                lat: (Math.random() - 0.5) * 180,
                lon: (Math.random() - 0.5) * 360,
                name: 'Unknown'
            };
        }
        
        const event = {
            id: Date.now() + Math.random(),
            type: type,
            location: location,
            timestamp: new Date(),
            magnitude: Math.random() * 10,
            description: this.generateEventDescription(type),
            confidence: Math.random()
        };
        
        this.processEvent(event);
    }
    
    generateEventDescription(type) {
        const descriptions = {
            uap: [
                'Triangular craft observed',
                'Multiple orbs in formation',
                'Cigar-shaped object detected',
                'Rapid acceleration recorded',
                'Metallic sphere sighting'
            ],
            missing411: [
                'Hiker vanished near stream',
                'Child disappeared from campsite',
                'Hunter missing in clear weather',
                'Group separated, one missing',
                'Vehicle found, occupant gone'
            ],
            seismic: [
                'Unnatural seismic pattern',
                'Deep earth vibration detected',
                'Harmonic tremor recorded',
                'Non-tectonic movement',
                'Artificial signature detected'
            ],
            emSpike: [
                'Magnetic field anomaly',
                'Radio frequency burst',
                'Ionospheric disturbance',
                'Scalar wave detection',
                'Torsion field fluctuation'
            ],
            cropCircle: [
                'Complex geometric pattern',
                'Sacred geometry formation',
                'Binary code pattern found',
                'Magnetic anomaly in crops',
                'Overnight formation appeared'
            ],
            consciousness: [
                'Mass meditation spike',
                'Collective dream reported',
                'Synchronicity cluster',
                'Telepathic experience surge',
                'Group consciousness shift'
            ]
        };
        
        const typeDescriptions = descriptions[type];
        return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
    }
    
    processEvent(event) {
        // Update statistics
        this.stats.totalEvents++;
        this.stats.eventsByType[event.type]++;
        
        // Add to map
        this.addEventToMap(event);
        
        // Update heat map
        this.updateHeatMap(event);
        
        // Add to timeline
        this.addToTimeline(event);
        
        // Check for alerts
        this.checkForAlerts(event);
        
        // Store for correlation analysis
        if (!this.eventFeeds.has(event.type)) {
            this.eventFeeds.set(event.type, []);
        }
        this.eventFeeds.get(event.type).push(event);
        
        // Keep only last 100 events per type
        if (this.eventFeeds.get(event.type).length > 100) {
            this.eventFeeds.get(event.type).shift();
        }
        
        // Update dashboard
        this.updateDashboard();
    }
    
    addEventToMap(event) {
        const eventConfig = this.eventTypes[event.type];
        const coords = this.projection([event.location.lon, event.location.lat]);
        
        if (!coords) return;
        
        const layer = this.eventLayers[event.type];
        
        // Add event marker
        const marker = layer.append('g')
            .attr('class', 'event-marker')
            .attr('transform', `translate(${coords[0]}, ${coords[1]})`);
        
        // Pulsing circle
        marker.append('circle')
            .attr('r', 0)
            .attr('fill', 'none')
            .attr('stroke', eventConfig.color)
            .attr('stroke-width', 2)
            .transition()
            .duration(1000)
            .attr('r', 20)
            .style('opacity', 0)
            .remove();
        
        // Event icon
        const icon = marker.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', eventConfig.color)
            .attr('font-size', '16px')
            .text(eventConfig.icon)
            .style('opacity', 0)
            .transition()
            .duration(300)
            .style('opacity', 1);
        
        // Tooltip
        marker.on('mouseover', () => {
            const tooltip = d3.select('body').append('div')
                .attr('class', 'live-tooltip')
                .style('opacity', 0);
            
            tooltip.transition()
                .duration(200)
                .style('opacity', 0.9);
            
            tooltip.html(`
                <strong>${eventConfig.name}</strong><br/>
                Location: ${event.location.name}<br/>
                Time: ${event.timestamp.toLocaleTimeString()}<br/>
                Magnitude: ${event.magnitude.toFixed(1)}<br/>
                ${event.description}
            `)
            .style('left', (d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', () => {
            d3.selectAll('.live-tooltip').remove();
        });
        
        // Fade out after 30 seconds
        setTimeout(() => {
            icon.transition()
                .duration(1000)
                .style('opacity', 0)
                .remove();
        }, 30000);
    }
    
    updateHeatMap(event) {
        const coords = this.projection([event.location.lon, event.location.lat]);
        if (!coords) return;
        
        const eventConfig = this.eventTypes[event.type];
        const impactRadius = 100;
        
        // Update heat data
        this.heatData.forEach(cell => {
            const distance = Math.sqrt(
                Math.pow(cell.x - coords[0], 2) + 
                Math.pow(cell.y - coords[1], 2)
            );
            
            if (distance < impactRadius) {
                const impact = (1 - distance / impactRadius) * eventConfig.heatIntensity * 0.3;
                cell.intensity = Math.min(1, cell.intensity + impact);
            }
        });
        
        // Update visualization
        const colorScale = d3.scaleLinear()
            .domain([0, 0.3, 0.6, 1])
            .range(['transparent', '#00ffcc', '#ff00ff', '#ff0000']);
        
        this.heatCells
            .transition()
            .duration(500)
            .attr('fill', d => colorScale(d.intensity));
        
        // Decay heat over time
        setTimeout(() => {
            this.heatData.forEach(cell => {
                cell.intensity *= 0.95;
            });
            this.updateHeatMapVisual();
        }, 1000);
    }
    
    updateHeatMapVisual() {
        const colorScale = d3.scaleLinear()
            .domain([0, 0.3, 0.6, 1])
            .range(['transparent', '#00ffcc', '#ff00ff', '#ff0000']);
        
        this.heatCells
            .attr('fill', d => colorScale(d.intensity));
    }
    
    addToTimeline(event) {
        const timeline = document.getElementById('timeline-container');
        const eventConfig = this.eventTypes[event.type];
        
        const eventDiv = document.createElement('div');
        eventDiv.className = 'timeline-event';
        eventDiv.dataset.type = event.type;
        eventDiv.innerHTML = `
            <div class="event-time">${event.timestamp.toLocaleTimeString()}</div>
            <div class="event-content">
                <span class="event-icon" style="color: ${eventConfig.color}">${eventConfig.icon}</span>
                <span class="event-location">${event.location.name}</span>
                <span class="event-desc">${event.description}</span>
            </div>
        `;
        
        timeline.insertBefore(eventDiv, timeline.firstChild);
        
        // Keep only last 50 events
        while (timeline.children.length > 50) {
            timeline.removeChild(timeline.lastChild);
        }
        
        // Apply filter
        this.filterTimeline();
    }
    
    filterTimeline() {
        const filter = document.getElementById('timeline-filter').value;
        const events = document.querySelectorAll('.timeline-event');
        
        events.forEach(event => {
            if (filter === 'all' || event.dataset.type === filter) {
                event.style.display = 'block';
            } else {
                event.style.display = 'none';
            }
        });
    }
    
    checkForAlerts(event) {
        const eventConfig = this.eventTypes[event.type];
        
        // Check for threshold alerts
        const recentEvents = this.eventFeeds.get(event.type) || [];
        const last5Minutes = recentEvents.filter(e => 
            new Date() - e.timestamp < 5 * 60 * 1000
        );
        
        if (last5Minutes.length >= eventConfig.threshold) {
            this.createAlert({
                type: 'threshold',
                severity: 'high',
                message: `${eventConfig.name} activity surge detected: ${last5Minutes.length} events in 5 minutes`,
                location: event.location.name
            });
        }
        
        // Check for pattern alerts
        this.checkPatternAlerts(event);
    }
    
    checkPatternAlerts(event) {
        // Check for multi-type events at same location
        const locationEvents = [];
        this.eventFeeds.forEach((events, type) => {
            const nearby = events.filter(e => {
                const distance = Math.sqrt(
                    Math.pow(e.location.lat - event.location.lat, 2) +
                    Math.pow(e.location.lon - event.location.lon, 2)
                );
                return distance < 5 && (new Date() - e.timestamp < 10 * 60 * 1000);
            });
            if (nearby.length > 0) {
                locationEvents.push({ type, count: nearby.length });
            }
        });
        
        if (locationEvents.length >= 3) {
            this.createAlert({
                type: 'correlation',
                severity: 'critical',
                message: `Multi-phenomena convergence detected at ${event.location.name}`,
                details: locationEvents.map(e => `${this.eventTypes[e.type].name}: ${e.count}`).join(', ')
            });
        }
    }
    
    createAlert(alert) {
        alert.id = Date.now();
        alert.timestamp = new Date();
        this.alerts.unshift(alert);
        
        const alertList = document.getElementById('alert-list');
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${alert.severity}`;
        alertDiv.innerHTML = `
            <div class="alert-header">
                <span class="alert-severity">${alert.severity.toUpperCase()}</span>
                <span class="alert-time">${alert.timestamp.toLocaleTimeString()}</span>
            </div>
            <div class="alert-message">${alert.message}</div>
            ${alert.details ? `<div class="alert-details">${alert.details}</div>` : ''}
        `;
        
        alertList.insertBefore(alertDiv, alertList.firstChild);
        
        // Flash animation
        alertDiv.classList.add('alert-flash');
        setTimeout(() => alertDiv.classList.remove('alert-flash'), 1000);
        
        // Keep only last 20 alerts
        while (alertList.children.length > 20) {
            alertList.removeChild(alertList.lastChild);
        }
    }
    
    updateCorrelations() {
        // Calculate correlation strength between different event types
        let totalCorrelation = 0;
        let correlationCount = 0;
        
        const types = Object.keys(this.eventTypes);
        for (let i = 0; i < types.length; i++) {
            for (let j = i + 1; j < types.length; j++) {
                const type1Events = this.eventFeeds.get(types[i]) || [];
                const type2Events = this.eventFeeds.get(types[j]) || [];
                
                // Find spatial-temporal correlations
                let matches = 0;
                type1Events.forEach(e1 => {
                    type2Events.forEach(e2 => {
                        const timeDiff = Math.abs(e1.timestamp - e2.timestamp);
                        const distance = Math.sqrt(
                            Math.pow(e1.location.lat - e2.location.lat, 2) +
                            Math.pow(e1.location.lon - e2.location.lon, 2)
                        );
                        
                        if (timeDiff < 30 * 60 * 1000 && distance < 10) {
                            matches++;
                        }
                    });
                });
                
                if (type1Events.length > 0 && type2Events.length > 0) {
                    const correlation = matches / Math.min(type1Events.length, type2Events.length);
                    totalCorrelation += correlation;
                    correlationCount++;
                    
                    // Store significant correlations
                    if (correlation > 0.3) {
                        this.correlations.set(`${types[i]}-${types[j]}`, correlation);
                    }
                }
            }
        }
        
        // Update correlation index
        if (correlationCount > 0) {
            this.stats.correlationStrength = (totalCorrelation / correlationCount) * 100;
        }
    }
    
    updateConsciousnessLevels() {
        // Simulate consciousness level changes
        Object.keys(this.consciousnessData).forEach(region => {
            const data = this.consciousnessData[region];
            const change = (Math.random() - 0.5) * 5;
            data.level = Math.max(0, Math.min(100, data.level + change));
            
            // Update trend
            if (change > 2) data.trend = 'rising';
            else if (change < -2) data.trend = 'falling';
            else data.trend = 'stable';
            
            // Update sentiment
            data.sentiment = Math.max(0, Math.min(1, data.sentiment + (Math.random() - 0.5) * 0.1));
        });
        
        this.updateConsciousnessChart();
        this.updateSentimentMeter();
    }
    
    updateConsciousnessChart() {
        const container = document.getElementById('consciousness-chart');
        container.innerHTML = '';
        
        const width = container.offsetWidth;
        const height = 200;
        const margin = { top: 20, right: 20, bottom: 40, left: 60 };
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const data = Object.entries(this.consciousnessData).map(([region, info]) => ({
            region,
            level: info.level,
            trend: info.trend
        }));
        
        const x = d3.scaleBand()
            .domain(data.map(d => d.region))
            .range([margin.left, width - margin.right])
            .padding(0.1);
        
        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([height - margin.bottom, margin.top]);
        
        // Bars
        svg.selectAll('rect')
            .data(data)
            .enter().append('rect')
            .attr('x', d => x(d.region))
            .attr('y', d => y(d.level))
            .attr('width', x.bandwidth())
            .attr('height', d => height - margin.bottom - y(d.level))
            .attr('fill', d => {
                if (d.level > 80) return '#ff0000';
                if (d.level > 60) return '#ff00ff';
                return '#00ffcc';
            })
            .attr('opacity', 0.8);
        
        // Trend indicators
        svg.selectAll('.trend')
            .data(data)
            .enter().append('text')
            .attr('class', 'trend')
            .attr('x', d => x(d.region) + x.bandwidth() / 2)
            .attr('y', d => y(d.level) - 5)
            .attr('text-anchor', 'middle')
            .attr('fill', d => d.trend === 'rising' ? '#00ff00' : d.trend === 'falling' ? '#ff0000' : '#ffff00')
            .text(d => d.trend === 'rising' ? '▲' : d.trend === 'falling' ? '▼' : '●');
        
        // X axis
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-45)')
            .style('fill', '#a0a0a0');
        
        // Y axis
        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .selectAll('text')
            .style('fill', '#a0a0a0');
    }
    
    updateSentimentMeter() {
        // Calculate global sentiment
        const sentiments = Object.values(this.consciousnessData).map(d => d.sentiment);
        const avgSentiment = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
        
        const fill = document.getElementById('sentiment-fill');
        fill.style.width = `${avgSentiment * 100}%`;
        
        // Update color based on sentiment
        if (avgSentiment > 0.7) {
            fill.style.background = 'linear-gradient(90deg, #00ffcc, #00ff00)';
        } else if (avgSentiment > 0.5) {
            fill.style.background = 'linear-gradient(90deg, #ffff00, #00ffcc)';
        } else {
            fill.style.background = 'linear-gradient(90deg, #ff0000, #ffff00)';
        }
        
        // Update trending topics
        this.updateTrendingTopics(avgSentiment);
    }
    
    updateTrendingTopics(sentiment) {
        const topics = [
            { text: '#GreatAwakening', weight: sentiment * 100 },
            { text: '#ConsciousnessShift', weight: (sentiment * 80) + 20 },
            { text: '#AntarcticDisclosure', weight: Math.random() * 50 + 50 },
            { text: '#GalacticFederation', weight: Math.random() * 40 + 30 },
            { text: '#5DReality', weight: sentiment * 70 },
            { text: '#MassAwakening', weight: (sentiment * 90) + 10 },
            { text: '#TruthRevealed', weight: Math.random() * 60 + 20 },
            { text: '#QuantumLeap', weight: sentiment * 60 }
        ];
        
        const list = document.getElementById('trending-list');
        list.innerHTML = topics
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 5)
            .map(topic => `
                <div class="trending-topic">
                    <span class="topic-text">${topic.text}</span>
                    <div class="topic-bar">
                        <div class="topic-fill" style="width: ${topic.weight}%"></div>
                    </div>
                </div>
            `).join('');
    }
    
    generatePredictions() {
        const predictions = [];
        
        // Analyze recent patterns
        const allEvents = [];
        this.eventFeeds.forEach(events => allEvents.push(...events));
        
        // Find hotspots
        const locationClusters = new Map();
        allEvents.forEach(event => {
            const key = `${Math.round(event.location.lat / 10)},${Math.round(event.location.lon / 10)}`;
            if (!locationClusters.has(key)) {
                locationClusters.set(key, {
                    count: 0,
                    types: new Set(),
                    lastEvent: null,
                    center: { lat: 0, lon: 0 }
                });
            }
            const cluster = locationClusters.get(key);
            cluster.count++;
            cluster.types.add(event.type);
            cluster.lastEvent = event.timestamp;
            cluster.center.lat += event.location.lat;
            cluster.center.lon += event.location.lon;
        });
        
        // Generate predictions based on clusters
        locationClusters.forEach((cluster, key) => {
            if (cluster.count > 5 && cluster.types.size > 2) {
                cluster.center.lat /= cluster.count;
                cluster.center.lon /= cluster.count;
                
                predictions.push({
                    type: 'hotspot',
                    location: cluster.center,
                    probability: Math.min(0.9, cluster.count / 10),
                    timeframe: '2-6 hours',
                    description: `Multi-phenomena convergence likely. ${cluster.types.size} different event types detected.`
                });
            }
        });
        
        // Add consciousness-based predictions
        Object.entries(this.consciousnessData).forEach(([region, data]) => {
            if (data.level > 85 && data.trend === 'rising') {
                predictions.push({
                    type: 'awakening',
                    location: { name: region },
                    probability: data.level / 100,
                    timeframe: '24-48 hours',
                    description: `Mass awakening event predicted in ${region}. Consciousness level critical.`
                });
            }
        });
        
        // Update predictions panel
        this.updatePredictions(predictions);
    }
    
    updatePredictions(predictions) {
        const list = document.getElementById('prediction-list');
        list.innerHTML = predictions
            .sort((a, b) => b.probability - a.probability)
            .slice(0, 5)
            .map(pred => `
                <div class="prediction ${pred.type}">
                    <div class="prediction-header">
                        <span class="prediction-type">${pred.type.toUpperCase()}</span>
                        <span class="prediction-probability">${(pred.probability * 100).toFixed(0)}%</span>
                    </div>
                    <div class="prediction-location">${pred.location.name || `${pred.location.lat.toFixed(2)}, ${pred.location.lon.toFixed(2)}`}</div>
                    <div class="prediction-timeframe">Timeframe: ${pred.timeframe}</div>
                    <div class="prediction-description">${pred.description}</div>
                </div>
            `).join('');
    }
    
    updateDashboard() {
        // Update statistics
        document.getElementById('total-events').textContent = this.stats.totalEvents;
        document.getElementById('correlation-index').textContent = `${this.stats.correlationStrength.toFixed(0)}%`;
        
        // Update awakening level based on various factors
        const eventRate = this.stats.totalEvents / (Date.now() - this.startTime) * 1000 * 60; // events per minute
        const avgConsciousness = Object.values(this.consciousnessData)
            .reduce((sum, d) => sum + d.level, 0) / Object.keys(this.consciousnessData).length;
        
        this.stats.awakeningIndex = Math.min(100, 
            (eventRate * 10) * 0.3 + 
            avgConsciousness * 0.5 + 
            this.stats.correlationStrength * 0.2
        );
        
        document.getElementById('awakening-level').textContent = `${this.stats.awakeningIndex.toFixed(0)}%`;
        
        // Update critical zones
        const criticalZones = Object.entries(this.consciousnessData)
            .filter(([region, data]) => data.level > 80)
            .length;
        document.getElementById('critical-zones').textContent = criticalZones;
        
        // Update event breakdown chart
        this.updateEventChart();
    }
    
    updateEventChart() {
        const container = document.getElementById('event-chart');
        container.innerHTML = '';
        
        const data = Object.entries(this.stats.eventsByType).map(([type, count]) => ({
            type: this.eventTypes[type].name,
            count: count,
            color: this.eventTypes[type].color
        }));
        
        const total = data.reduce((sum, d) => sum + d.count, 0);
        
        const width = container.offsetWidth;
        const height = 150;
        const radius = Math.min(width, height) / 2;
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);
        
        const pie = d3.pie()
            .value(d => d.count);
        
        const arc = d3.arc()
            .innerRadius(radius * 0.6)
            .outerRadius(radius);
        
        const arcs = g.selectAll('arc')
            .data(pie(data))
            .enter().append('g');
        
        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => d.data.color)
            .attr('opacity', 0.8)
            .attr('stroke', '#000')
            .attr('stroke-width', 1);
        
        // Add percentage labels
        arcs.append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff')
            .attr('font-size', '12px')
            .text(d => total > 0 ? `${((d.data.count / total) * 100).toFixed(0)}%` : '');
    }
    
    initializeControls() {
        // Heat map toggle
        document.getElementById('heat-overlay').addEventListener('change', (e) => {
            this.heatMapLayer.style('display', e.target.checked ? 'block' : 'none');
        });
        
        // Event filters
        document.querySelectorAll('.event-filter input').forEach(input => {
            input.addEventListener('change', (e) => {
                const eventType = e.target.dataset.event;
                this.eventLayers[eventType].style('display', e.target.checked ? 'block' : 'none');
            });
        });
        
        // Timeline filter
        document.getElementById('timeline-filter').addEventListener('change', () => {
            this.filterTimeline();
        });
        
        // Store start time
        this.startTime = Date.now();
    }
}

// Initialize when view is activated
window.initLiveTracker = function() {
    if (!window.liveTracker) {
        window.liveTracker = new LiveTracker();
    }
    window.liveTracker.init();
};

// Cleanup when leaving view
window.cleanupLiveTracker = function() {
    if (window.liveTracker) {
        window.liveTracker.cleanup();
    }
};

// Add CSS for live tracker
const style = document.createElement('style');
style.textContent = `
.live-tracker-container {
    width: 100%;
    min-height: 100vh;
    background: var(--primary-bg);
}

.tracker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: var(--secondary-bg);
    border-bottom: 2px solid var(--accent-color);
}

.tracker-status {
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 0.9em;
    color: var(--text-secondary);
}

.status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #00ff00;
}

.status-indicator.active {
    animation: pulse-glow 1s infinite;
}

@keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 5px #00ff00; }
    50% { box-shadow: 0 0 20px #00ff00; }
}

.tracker-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: auto auto auto;
    gap: 20px;
    padding: 20px;
}

.map-section {
    grid-column: 1;
    grid-row: 1 / 3;
    position: relative;
}

#live-map {
    width: 100%;
    height: 500px;
    background: var(--primary-bg);
    border: 1px solid var(--grid-color);
    position: relative;
    overflow: hidden;
}

.map-overlays {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.8);
    padding: 15px;
    border: 1px solid var(--accent-color);
    border-radius: 5px;
    z-index: 10;
}

.event-filters {
    margin-top: 10px;
}

.event-filter {
    display: block;
    margin: 5px 0;
    font-size: 0.85em;
}

.alert-panel {
    grid-column: 2;
    grid-row: 1;
    background: var(--secondary-bg);
    border: 1px solid var(--grid-color);
    padding: 15px;
    max-height: 400px;
    overflow-y: auto;
}

.alert-panel h3 {
    color: var(--warning-color);
    margin-bottom: 15px;
    font-size: 1.1em;
}

.alert {
    background: rgba(255, 0, 0, 0.1);
    border: 1px solid;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
}

.alert-high {
    border-color: #ff6b6b;
}

.alert-critical {
    border-color: #ff0000;
    background: rgba(255, 0, 0, 0.2);
}

.alert-flash {
    animation: alert-flash 0.5s ease-in-out;
}

@keyframes alert-flash {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.alert-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
}

.alert-severity {
    color: var(--warning-color);
    font-weight: bold;
    font-size: 0.8em;
}

.alert-time {
    color: var(--text-secondary);
    font-size: 0.8em;
}

.alert-message {
    color: var(--text-primary);
    font-size: 0.9em;
}

.alert-details {
    color: var(--text-secondary);
    font-size: 0.8em;
    margin-top: 5px;
}

.event-timeline {
    grid-column: 2;
    grid-row: 2;
    background: var(--secondary-bg);
    border: 1px solid var(--grid-color);
    padding: 15px;
}

.timeline-filters {
    margin-bottom: 10px;
}

#timeline-filter {
    width: 100%;
    background: var(--primary-bg);
    color: var(--text-primary);
    border: 1px solid var(--grid-color);
    padding: 5px;
}

.timeline-container {
    max-height: 300px;
    overflow-y: auto;
}

.timeline-event {
    border-left: 2px solid var(--accent-color);
    padding-left: 10px;
    margin-bottom: 10px;
    font-size: 0.85em;
}

.event-time {
    color: var(--text-secondary);
    font-size: 0.8em;
}

.event-content {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 2px;
}

.event-icon {
    font-size: 1.2em;
}

.event-location {
    color: var(--accent-color);
    font-weight: bold;
}

.event-desc {
    color: var(--text-primary);
}

.stats-dashboard {
    grid-column: 1;
    grid-row: 3;
    background: var(--secondary-bg);
    border: 1px solid var(--grid-color);
    padding: 20px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    margin-bottom: 20px;
}

.stat-card {
    text-align: center;
    padding: 15px;
    background: var(--primary-bg);
    border: 1px solid var(--grid-color);
    border-radius: 5px;
}

.stat-card h4 {
    color: var(--text-secondary);
    font-size: 0.9em;
    margin-bottom: 10px;
}

.stat-value {
    font-size: 2em;
    font-weight: bold;
    color: var(--accent-color);
}

.stat-value.warning {
    color: var(--warning-color);
}

.stat-value.glowing {
    text-shadow: 0 0 10px currentColor;
}

.event-breakdown {
    margin-top: 20px;
}

.event-breakdown h4 {
    color: var(--accent-color);
    margin-bottom: 10px;
}

.consciousness-monitor {
    grid-column: 2;
    grid-row: 3;
    background: var(--secondary-bg);
    border: 1px solid var(--grid-color);
    padding: 15px;
}

.consciousness-monitor h3 {
    color: var(--accent-color);
    margin-bottom: 15px;
    font-size: 1.1em;
}

.sentiment-analysis {
    grid-column: 1 / 3;
    background: var(--secondary-bg);
    border: 1px solid var(--grid-color);
    padding: 20px;
    margin-top: 20px;
}

.sentiment-meter {
    margin: 20px 0;
}

.meter-container {
    position: relative;
    height: 40px;
    background: var(--primary-bg);
    border: 1px solid var(--grid-color);
    border-radius: 20px;
    overflow: hidden;
}

.meter-fill {
    height: 100%;
    background: linear-gradient(90deg, #ff0000, #ffff00, #00ff00);
    transition: width 0.5s ease;
}

.meter-labels {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    color: var(--text-primary);
    font-size: 0.85em;
    pointer-events: none;
}

.trending-topics {
    margin-top: 20px;
}

.trending-topic {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
}

.topic-text {
    color: var(--accent-color);
    font-weight: bold;
}

.topic-bar {
    width: 100px;
    height: 10px;
    background: var(--primary-bg);
    border: 1px solid var(--grid-color);
    border-radius: 5px;
    overflow: hidden;
}

.topic-fill {
    height: 100%;
    background: var(--accent-color);
    transition: width 0.5s ease;
}

.predictive-panel {
    grid-column: 1 / 3;
    background: var(--secondary-bg);
    border: 2px solid var(--warning-color);
    padding: 20px;
    margin-top: 20px;
}

.predictive-panel h3 {
    color: var(--warning-color);
    margin-bottom: 15px;
}

.prediction {
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid var(--warning-color);
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 5px;
}

.prediction.awakening {
    border-color: var(--pulse-color);
    background: rgba(255, 0, 255, 0.1);
}

.prediction-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.prediction-type {
    color: var(--warning-color);
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.9em;
}

.prediction-probability {
    color: var(--accent-color);
    font-weight: bold;
}

.prediction-location {
    color: var(--text-primary);
    font-weight: bold;
    margin-bottom: 5px;
}

.prediction-timeframe {
    color: var(--text-secondary);
    font-size: 0.85em;
    margin-bottom: 5px;
}

.prediction-description {
    color: var(--text-primary);
    font-size: 0.9em;
}

.live-tooltip {
    position: absolute;
    text-align: left;
    padding: 10px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid var(--accent-color);
    border-radius: 5px;
    pointer-events: none;
    color: var(--text-primary);
    z-index: 1000;
}

.event-marker {
    cursor: pointer;
}

.heat-map-layer {
    pointer-events: none;
}

/* Scrollbar styling */
.alert-panel::-webkit-scrollbar,
.timeline-container::-webkit-scrollbar {
    width: 8px;
}

.alert-panel::-webkit-scrollbar-track,
.timeline-container::-webkit-scrollbar-track {
    background: var(--primary-bg);
}

.alert-panel::-webkit-scrollbar-thumb,
.timeline-container::-webkit-scrollbar-thumb {
    background: var(--grid-color);
    border-radius: 4px;
}

.alert-panel::-webkit-scrollbar-thumb:hover,
.timeline-container::-webkit-scrollbar-thumb:hover {
    background: var(--accent-color);
}
`;

document.head.appendChild(style);