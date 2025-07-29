// Galactic Cycle Spiral Timeline - The 12,000 Year Pattern Revealed

function initTimeline() {
    const container = document.getElementById('spiral-timeline-container');
    const isMobile = window.mobileUtils && window.mobileUtils.isMobile();
    const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
    
    // Better responsive sizing
    const width = container.clientWidth;
    let height;
    
    if (window.innerWidth < 768) {
        // Phone
        height = Math.min(400, window.innerHeight * 0.6);
    } else if (isTablet) {
        // iPad/Tablet - use more vertical space
        height = Math.min(window.innerHeight * 0.7, 800);
    } else {
        // Desktop
        height = 600;
    }
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear existing content
    d3.select(container).selectAll('*').remove();
    
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', 'radial-gradient(circle at center, #0a1929 0%, #000000 100%)');
    
    // Create main group for zooming/panning
    const g = svg.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`);
    
    // Add galactic background
    createGalacticBackground(g, width, height);
    
    // Timeline data - 50,000 years of cycles
    const timelineData = generateTimelineData();
    
    // Create the spiral
    const spiral = createSpiral(g, timelineData);
    
    // Add cycle markers
    addCycleMarkers(g, timelineData);
    
    // Add current position indicator
    const currentIndicator = addCurrentPosition(g, timelineData);
    
    // Add catastrophe zones
    addCatastropheZones(g);
    
    // Add explanatory legend
    addTimelineLegend(svg, width, height);
    
    // Add interactive controls
    setupTimelineControls(g, spiral, timelineData, currentIndicator);
    
    // Start animation
    animateSpiral(g);
    
    // Add mobile touch support
    addMobileTouchSupport();
}

function createGalacticBackground(g, width, height) {
    // Create starfield with mobile optimization
    const isMobile = window.mobileUtils && window.mobileUtils.isMobile();
    const starCount = isMobile ? 200 : 500;
    const stars = d3.range(starCount).map(() => ({
        x: (Math.random() - 0.5) * width,
        y: (Math.random() - 0.5) * height,
        r: Math.random() * 2,
        opacity: Math.random()
    }));
    
    g.append('g')
        .attr('class', 'starfield')
        .selectAll('circle')
        .data(stars)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.r)
        .attr('fill', '#ffffff')
        .attr('opacity', d => d.opacity * 0.6);
    
    // Add galactic plane visualization
    const galacticPlane = g.append('g')
        .attr('class', 'galactic-plane');
    
    // Create gradient for galactic current sheet
    const defs = g.append('defs');
    const gradient = defs.append('linearGradient')
        .attr('id', 'galactic-gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');
    
    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#ff00ff')
        .attr('stop-opacity', 0);
    
    gradient.append('stop')
        .attr('offset', '50%')
        .attr('stop-color', '#ff00ff')
        .attr('stop-opacity', 0.3);
    
    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#ff00ff')
        .attr('stop-opacity', 0);
    
    // Add galactic current sheet wave
    galacticPlane.append('rect')
        .attr('x', -width/2)
        .attr('y', -20)
        .attr('width', width)
        .attr('height', 40)
        .attr('fill', 'url(#galactic-gradient)')
        .attr('transform', 'rotate(23.5)'); // Earth's axial tilt
}

function generateTimelineData() {
    const events = [
        // Major cycles and events
        {year: -50000, event: "Elder Race Emergence", type: "origin", importance: 10},
        {year: -48000, event: "First Global Infrastructure", type: "construction", importance: 7},
        {year: -38000, event: "Galactic Alignment - Minor Crossing", type: "crossing", importance: 5},
        {year: -36000, event: "Technological Peak", type: "achievement", importance: 8},
        {year: -26000, event: "Previous Major Crossing", type: "catastrophe", importance: 9},
        {year: -24000, event: "Mass Extinction Event", type: "catastrophe", importance: 10},
        {year: -20000, event: "Reconstruction Begins", type: "recovery", importance: 6},
        {year: -15000, event: "Monument Building Resumes", type: "construction", importance: 7},
        {year: -12800, event: "YOUNGER DRYAS IMPACT", type: "catastrophe", importance: 10},
        {year: -12000, event: "Antarctica Flash Freezes", type: "catastrophe", importance: 9},
        {year: -11600, event: "Climate Stabilizes", type: "recovery", importance: 7},
        {year: -10500, event: "Survivors Emerge", type: "emergence", importance: 8},
        {year: -10000, event: "Hybridization Program", type: "genetics", importance: 9},
        {year: -9000, event: "Göbekli Tepe Built", type: "construction", importance: 8},
        {year: -8000, event: "Agricultural Revolution", type: "achievement", importance: 7},
        {year: -7000, event: "Megalithic Explosion", type: "construction", importance: 8},
        {year: -5000, event: "Pyramid Construction", type: "construction", importance: 9},
        {year: -4000, event: "Writing Systems Emerge", type: "achievement", importance: 7},
        {year: -3000, event: "Bronze Age Begins", type: "achievement", importance: 6},
        {year: -2000, event: "Mystery Schools Peak", type: "knowledge", importance: 7},
        {year: -1200, event: "Bronze Age Collapse", type: "catastrophe", importance: 8},
        {year: -500, event: "Classical Period", type: "achievement", importance: 6},
        {year: 0, event: "Calendar Reset", type: "marker", importance: 5},
        {year: 500, event: "Dark Ages Begin", type: "decline", importance: 6},
        {year: 1000, event: "Medieval Warming", type: "recovery", importance: 5},
        {year: 1500, event: "FINAL RETREAT UNDERGROUND", type: "retreat", importance: 9},
        {year: 1600, event: "Little Ice Age", type: "warning", importance: 6},
        {year: 1859, event: "Carrington Event", type: "warning", importance: 7},
        {year: 1908, event: "Tunguska Event", type: "warning", importance: 7},
        {year: 1938, event: "Nazi Antarctic Expedition", type: "discovery", importance: 8},
        {year: 1947, event: "OPERATION HIGHJUMP", type: "contact", importance: 9},
        {year: 1959, event: "Antarctic Treaty", type: "treaty", importance: 8},
        {year: 1969, event: "Moon Landing (?)", type: "achievement", importance: 7},
        {year: 2001, event: "Arecibo Reply", type: "contact", importance: 8},
        {year: 2012, event: "Galactic Plane Entry", type: "crossing", importance: 9},
        {year: 2020, event: "Pandemic/Reset Attempt", type: "control", importance: 8},
        {year: 2023, event: "ANTARCTIC ACTIVATION", type: "activation", importance: 10},
        {year: 2024, event: "Drone Emergence", type: "revelation", importance: 9},
        {year: 2025, event: "NOW - Acceleration Phase", type: "current", importance: 10},
        {year: 2030, event: "Projected Disclosure", type: "future", importance: 9},
        {year: 2035, event: "Peak Crossing Window", type: "future_catastrophe", importance: 10},
        {year: 2040, event: "New Earth Configuration", type: "future_achievement", importance: 10}
    ];
    
    // Scale radius based on viewport
    const maxRadius = Math.min(
        document.getElementById('spiral-timeline-container').clientWidth / 2 - 50,
        document.getElementById('spiral-timeline-container').clientHeight / 2 - 50,
        250
    );
    
    return events.map(e => ({
        ...e,
        angle: (e.year + 50000) / 50000 * Math.PI * 20, // 20 rotations for 50,000 years
        radius: Math.sqrt((e.year + 50000) / 50000) * maxRadius // Sqrt for tighter inner spiral
    }));
}

function createSpiral(g, data) {
    // Create spiral path
    const spiralLine = d3.lineRadial()
        .angle(d => d.angle)
        .radius(d => d.radius)
        .curve(d3.curveCardinal);
    
    // Main timeline spiral
    const spiral = g.append('path')
        .datum(data)
        .attr('d', spiralLine)
        .attr('fill', 'none')
        .attr('stroke', '#00ffcc')
        .attr('stroke-width', 2)
        .attr('opacity', 0.6)
        .style('filter', 'drop-shadow(0 0 5px #00ffcc)');
    
    // Add 12,000 year cycle indicators
    const cycleData = d3.range(-48000, 2040, 12000).map(year => ({
        year,
        angle: (year + 50000) / 50000 * Math.PI * 20,
        radius: Math.sqrt((year + 50000) / 50000) * 250
    }));
    
    // Get max radius from data for consistent scaling
    const maxRadius = data[data.length - 1].radius;
    
    g.selectAll('.cycle-ring')
        .data(cycleData)
        .enter()
        .append('circle')
        .attr('class', 'cycle-ring')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', d => Math.sqrt((d.year + 50000) / 50000) * maxRadius)
        .attr('fill', 'none')
        .attr('stroke', '#ff00ff')
        .attr('stroke-width', 1)
        .attr('opacity', 0.3)
        .attr('stroke-dasharray', '5,5');
    
    return spiral;
}

function addCycleMarkers(g, data) {
    const markers = g.selectAll('.timeline-marker')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'timeline-marker')
        .attr('transform', d => {
            const x = Math.cos(d.angle - Math.PI/2) * d.radius;
            const y = Math.sin(d.angle - Math.PI/2) * d.radius;
            return `translate(${x}, ${y})`;
        });
    
    // Event dots
    markers.append('circle')
        .attr('r', d => d.importance / 2)
        .attr('fill', d => getEventColor(d.type))
        .attr('opacity', 0.8)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
            showEventTooltip(d, this);
            // Pulse effect
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', d.importance);
        })
        .on('mouseout', function(event, d) {
            hideEventTooltip();
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', d.importance / 2);
        });
    
    // Major event labels
    markers.filter(d => d.importance >= 8)
        .append('text')
        .attr('dx', 10)
        .attr('dy', 3)
        .text(d => `${d.year > 0 ? d.year : Math.abs(d.year) + ' BCE'}: ${d.event}`)
        .attr('font-size', '10px')
        .attr('fill', '#ffffff')
        .attr('opacity', 0.7);
}

function addCurrentPosition(g, data) {
    const currentYear = 2025;
    const currentData = data.find(d => d.year === currentYear);
    
    if (!currentData) return;
    
    const x = Math.cos(currentData.angle - Math.PI/2) * currentData.radius;
    const y = Math.sin(currentData.angle - Math.PI/2) * currentData.radius;
    
    const indicator = g.append('g')
        .attr('class', 'current-position')
        .attr('transform', `translate(${x}, ${y})`);
    
    // Pulsing beacon
    indicator.append('circle')
        .attr('r', 5)
        .attr('fill', '#ff0000')
        .style('filter', 'drop-shadow(0 0 10px #ff0000)');
    
    // Expanding rings
    for (let i = 0; i < 3; i++) {
        indicator.append('circle')
            .attr('r', 5)
            .attr('fill', 'none')
            .attr('stroke', '#ff0000')
            .attr('stroke-width', 2)
            .attr('opacity', 0)
            .transition()
            .delay(i * 1000)
            .duration(3000)
            .attr('r', 30)
            .attr('opacity', 0)
            .on('end', function() {
                d3.select(this).remove();
            });
    }
    
    // "YOU ARE HERE" label
    indicator.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .text('YOU ARE HERE')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', '#ff0000')
        .style('filter', 'drop-shadow(0 0 5px #ff0000)');
    
    return indicator;
}

function addTimelineLegend(svg, width, height) {
    // Position legend better for tablets
    const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1024;
    const isMobile = window.innerWidth < 768;
    
    let legendX, legendY;
    if (isMobile) {
        legendX = 10;
        legendY = height - 250;
    } else if (isTablet) {
        legendX = width - 220;
        legendY = 10;
    } else {
        legendX = width - 220;
        legendY = 20;
    }
    
    const legend = svg.append('g')
        .attr('class', 'timeline-legend')
        .attr('transform', `translate(${legendX}, ${legendY})`);
    
    // Legend background
    legend.append('rect')
        .attr('x', -10)
        .attr('y', -10)
        .attr('width', 210)
        .attr('height', 240)
        .attr('fill', 'rgba(10, 25, 41, 0.9)')
        .attr('stroke', '#00ffcc')
        .attr('stroke-width', 1);
    
    // Title
    legend.append('text')
        .attr('x', 5)
        .attr('y', 5)
        .text('Galactic Cycle Guide')
        .style('fill', '#00ffcc')
        .style('font-size', '14px')
        .style('font-weight', 'bold');
    
    // Explanation text
    const explanations = [
        'Reading the Spiral:',
        '• Time flows outward',
        '• Each ring = 12,000 years',
        '• Purple rings = danger zones',
        '',
        'Event Types:'
    ];
    
    explanations.forEach((text, i) => {
        legend.append('text')
            .attr('x', 5)
            .attr('y', 25 + (i * 15))
            .text(text)
            .style('fill', '#ffffff')
            .style('font-size', '11px')
            .style('font-weight', text.includes(':') ? 'bold' : 'normal');
    });
    
    // Event type legend
    const eventTypes = [
        { type: 'catastrophe', color: '#ff0000', label: 'Catastrophe' },
        { type: 'achievement', color: '#9900ff', label: 'Achievement' },
        { type: 'activation', color: '#00ffcc', label: 'Activation' },
        { type: 'current', color: '#ff0000', label: 'Current Position' }
    ];
    
    eventTypes.forEach((item, i) => {
        const y = 120 + (i * 20);
        legend.append('circle')
            .attr('cx', 10)
            .attr('cy', y)
            .attr('r', 5)
            .attr('fill', item.color)
            .attr('opacity', 0.8);
        
        legend.append('text')
            .attr('x', 20)
            .attr('y', y + 4)
            .text(item.label)
            .style('fill', '#cccccc')
            .style('font-size', '10px');
    });
    
    // Current cycle info
    legend.append('text')
        .attr('x', 5)
        .attr('y', 210)
        .text('Cycle Progress: 97%')
        .style('fill', '#ff00ff')
        .style('font-size', '12px')
        .style('font-weight', 'bold');
}

function addCatastropheZones(g) {
    // Mark the catastrophe crossing zones
    const catastropheYears = [-24000, -12800, 0, 12000, 24000];
    
    // Get max radius from parent group's data
    const maxRadius = g.selectAll('.timeline-marker').data()[0] ? 
        g.selectAll('.timeline-marker').data()[g.selectAll('.timeline-marker').data().length - 1].radius : 250;
    
    catastropheYears.forEach(year => {
        if (year > 2040) return; // Don't show beyond our timeline
        
        const angle = (year + 50000) / 50000 * Math.PI * 20;
        const radius = Math.sqrt((year + 50000) / 50000) * maxRadius;
        
        // Create danger zone arc
        const arcGenerator = d3.arc()
            .innerRadius(radius - 20)
            .outerRadius(radius + 20)
            .startAngle(angle - 0.2)
            .endAngle(angle + 0.2);
        
        g.append('path')
            .attr('d', arcGenerator)
            .attr('fill', 'url(#danger-gradient)')
            .attr('opacity', 0.5)
            .attr('class', 'catastrophe-zone');
    });
    
    // Create danger gradient
    const dangerGradient = g.select('defs').append('radialGradient')
        .attr('id', 'danger-gradient');
    
    dangerGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#ff0000')
        .attr('stop-opacity', 0.8);
    
    dangerGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#ff6b6b')
        .attr('stop-opacity', 0.3);
}

function setupTimelineControls(g, spiral, data, indicator) {
    const slider = document.getElementById('timeline-slider');
    const yearDisplay = document.getElementById('timeline-year');
    const playButton = document.getElementById('play-timeline');
    
    // Add speed control
    const controlContainer = document.querySelector('.timeline-controls');
    const speedControl = document.createElement('div');
    speedControl.innerHTML = `
        <label style="color: #00ffcc; margin-left: 20px;">
            Speed: <select id="timeline-speed" style="background: #1a2332; color: #00ffcc; border: 1px solid #00ffcc;">
                <option value="0.25">0.25x</option>
                <option value="0.5">0.5x</option>
                <option value="1" selected>1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
            </select>
        </label>
        <button id="step-timeline" style="margin-left: 10px; padding: 5px 10px; background: #1a2332; color: #00ffcc; border: 1px solid #00ffcc; cursor: pointer;">Step →</button>
    `;
    speedControl.style.display = 'inline-block';
    controlContainer.appendChild(speedControl);
    
    let playing = false;
    let currentYearIndex = data.findIndex(d => d.year === 2025);
    let playSpeed = 1;
    
    // Update slider
    slider.min = 0;
    slider.max = data.length - 1;
    slider.value = currentYearIndex;
    
    slider.addEventListener('input', (e) => {
        const index = parseInt(e.target.value);
        const yearData = data[index];
        updateTimelinePosition(yearData, indicator, yearDisplay);
    });
    
    // Speed control
    const speedSelect = document.getElementById('timeline-speed');
    speedSelect.addEventListener('change', (e) => {
        playSpeed = parseFloat(e.target.value);
    });
    
    // Step button
    const stepButton = document.getElementById('step-timeline');
    stepButton.addEventListener('click', () => {
        currentYearIndex = (currentYearIndex + 1) % data.length;
        slider.value = currentYearIndex;
        updateTimelinePosition(data[currentYearIndex], indicator, yearDisplay);
        highlightCurrentEvent(data[currentYearIndex]);
    });
    
    playButton.addEventListener('click', () => {
        playing = !playing;
        playButton.textContent = playing ? 'Pause' : 'Play';
        
        if (playing) {
            animateTimeline();
        }
    });
    
    function animateTimeline() {
        if (!playing) return;
        
        currentYearIndex = (currentYearIndex + 1) % data.length;
        slider.value = currentYearIndex;
        updateTimelinePosition(data[currentYearIndex], indicator, yearDisplay);
        highlightCurrentEvent(data[currentYearIndex]);
        
        // Slower base speed (500ms) modified by speed control
        setTimeout(animateTimeline, 500 / playSpeed);
    }
    
    function highlightCurrentEvent(yearData) {
        // Remove previous highlights
        d3.selectAll('.timeline-marker').classed('highlighted', false);
        
        // Highlight current event
        d3.selectAll('.timeline-marker')
            .filter(d => d.year === yearData.year)
            .classed('highlighted', true)
            .select('circle')
            .transition()
            .duration(300)
            .attr('r', d => d.importance)
            .transition()
            .duration(300)
            .attr('r', d => d.importance / 2);
    }
}

function updateTimelinePosition(yearData, indicator, display) {
    const x = Math.cos(yearData.angle - Math.PI/2) * yearData.radius;
    const y = Math.sin(yearData.angle - Math.PI/2) * yearData.radius;
    
    indicator.transition()
        .duration(100)
        .attr('transform', `translate(${x}, ${y})`);
    
    const yearText = yearData.year > 0 ? 
        `${yearData.year} CE` : 
        `${Math.abs(yearData.year)} BCE`;
    
    display.textContent = yearText;
}

function animateSpiral(g) {
    // Rotate the entire spiral slowly
    function rotate() {
        g.transition()
            .duration(60000)
            .ease(d3.easeLinear)
            .attr('transform', `translate(${g.node().getBBox().width/2}, ${g.node().getBBox().height/2}) rotate(360)`)
            .on('end', () => {
                g.attr('transform', `translate(${g.node().getBBox().width/2}, ${g.node().getBBox().height/2}) rotate(0)`);
                rotate();
            });
    }
    
    // Subtle rotation
    // rotate();
}

function getEventColor(type) {
    const colors = {
        origin: '#00ff00',
        construction: '#0099ff',
        catastrophe: '#ff0000',
        recovery: '#ffcc00',
        achievement: '#9900ff',
        genetics: '#ff00ff',
        knowledge: '#00ccff',
        marker: '#ffffff',
        decline: '#666666',
        retreat: '#ff6600',
        discovery: '#00ff99',
        contact: '#ff00cc',
        treaty: '#9999ff',
        activation: '#00ffcc',
        control: '#ff3333',
        revelation: '#ffff00',
        current: '#ff0000',
        future: '#ff99cc',
        future_catastrophe: '#ff0066',
        future_achievement: '#00ff66',
        emergence: '#66ff00',
        crossing: '#ff00ff',
        warning: '#ff9900'
    };
    
    return colors[type] || '#ffffff';
}

function showEventTooltip(event, element) {
    const tooltip = d3.select('body').append('div')
        .attr('class', 'spiral-tooltip')
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.9)')
        .style('color', '#00ffcc')
        .style('padding', '10px')
        .style('border', '2px solid #00ffcc')
        .style('border-radius', '5px')
        .style('pointer-events', 'none')
        .style('font-size', '14px')
        .style('z-index', 1000);
    
    const rect = element.getBoundingClientRect();
    
    tooltip.html(`
        <strong>${event.event}</strong><br>
        Year: ${event.year > 0 ? event.year + ' CE' : Math.abs(event.year) + ' BCE'}<br>
        Type: ${event.type}<br>
        Importance: ${event.importance}/10<br>
        ${getEventDescription(event)}
    `)
    .style('left', (rect.left + 20) + 'px')
    .style('top', (rect.top - 10) + 'px');
}

function hideEventTooltip() {
    d3.select('.spiral-tooltip').remove();
}

function getEventDescription(event) {
    const descriptions = {
        "Elder Race Emergence": "The beginning of the advanced civilization that would shape Earth's destiny.",
        "YOUNGER DRYAS IMPACT": "Comet fragments destroy global civilization. Antarctica flash-freezes.",
        "ANTARCTIC ACTIVATION": "October 2023 - The frozen city awakens, triggering global changes.",
        "NOW - Acceleration Phase": "All systems activating. The crossing approaches.",
        "Peak Crossing Window": "2035-2040: Earth passes through galactic current sheet. Massive changes expected."
    };
    
    return descriptions[event.event] || '';
}

// Add mobile touch support to event markers
function addMobileTouchSupport() {
    if (window.mobileUtils) {
        const eventMarkers = d3.selectAll('.cycle-event');
        window.mobileUtils.addTouchToD3Selection(eventMarkers);
    }
}

// Handle window resize
function handleTimelineResize() {
    const container = document.getElementById('spiral-timeline-container');
    if (container) {
        // Reinitialize the entire timeline on resize
        initTimeline();
    }
}

// Add resize listener with debouncing
let timelineResizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(timelineResizeTimeout);
    timelineResizeTimeout = setTimeout(() => {
        const container = document.getElementById('spiral-timeline-container');
        if (container && container.querySelector('svg')) {
            handleTimelineResize();
        }
    }, 250);
});

// Export for use
window.initTimeline = initTimeline;