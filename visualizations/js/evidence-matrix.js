// Evidence Correlation Matrix Visualization
// Interactive matrix showing connections between paranormal phenomena

// Global variables for the matrix
let matrixSvg, matrixData, tooltip, selectedCell = null;
let filterThreshold = 0.3;

// Categories of phenomena to correlate
const categories = [
    'Ancient Sites',
    'Missing 411',
    'UAPs',
    'Underground Bases',
    'Genetic Anomalies',
    'Ley Lines',
    'Crop Circles',
    'Electromagnetic',
    'Bloodlines',
    'Antarctica',
    'Time Anomalies',
    'Cryptids'
];

// Initialize the evidence matrix visualization
function initEvidence() {
    const container = document.getElementById('evidence-container');
    if (!container) return;
    
    // Clear any existing content
    d3.select(container).selectAll('*').remove();
    
    // Create control panel
    createMatrixControls(container);
    
    // Create main visualization area
    const vizContainer = d3.select(container)
        .append('div')
        .attr('class', 'matrix-viz-container');
    
    // Generate correlation data
    matrixData = generateCorrelationData();
    
    // Create the matrix visualization
    createCorrelationMatrix(vizContainer);
    
    // Create details panel
    createDetailsPanel(container);
    
    // Initialize filters and interactions
    initializeMatrixInteractions();
}

// Generate realistic correlation data between phenomena
function generateCorrelationData() {
    const data = [];
    
    // Define known strong correlations based on "research"
    const strongCorrelations = {
        'Ancient Sites': {
            'Ley Lines': 0.95,
            'Electromagnetic': 0.87,
            'Underground Bases': 0.72,
            'UAPs': 0.68
        },
        'Missing 411': {
            'Underground Bases': 0.83,
            'Cryptids': 0.76,
            'Time Anomalies': 0.64,
            'Electromagnetic': 0.71
        },
        'UAPs': {
            'Electromagnetic': 0.91,
            'Time Anomalies': 0.78,
            'Antarctica': 0.65,
            'Underground Bases': 0.74
        },
        'Bloodlines': {
            'Genetic Anomalies': 0.94,
            'Ancient Sites': 0.67,
            'Antarctica': 0.58
        },
        'Antarctica': {
            'Underground Bases': 0.89,
            'Ancient Sites': 0.71,
            'Time Anomalies': 0.66
        }
    };
    
    // Generate full correlation matrix
    categories.forEach((cat1, i) => {
        categories.forEach((cat2, j) => {
            let correlation;
            
            if (i === j) {
                correlation = 1.0; // Self-correlation
            } else if (strongCorrelations[cat1] && strongCorrelations[cat1][cat2]) {
                correlation = strongCorrelations[cat1][cat2];
            } else if (strongCorrelations[cat2] && strongCorrelations[cat2][cat1]) {
                correlation = strongCorrelations[cat2][cat1];
            } else {
                // Generate weaker correlations for other relationships
                correlation = Math.random() * 0.5 + 0.1;
            }
            
            // Add temporal component
            const temporalPattern = generateTemporalPattern();
            
            // Generate evidence links
            const evidence = generateEvidenceLinks(cat1, cat2, correlation);
            
            data.push({
                source: cat1,
                target: cat2,
                value: correlation,
                significance: calculateSignificance(correlation, evidence.length),
                quality: calculateQuality(evidence),
                temporal: temporalPattern,
                evidence: evidence,
                i: i,
                j: j
            });
        });
    });
    
    return data;
}

// Create the correlation matrix visualization
function createCorrelationMatrix(container) {
    const margin = {top: 100, right: 100, bottom: 100, left: 150};
    const width = 800 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;
    
    // Create SVG
    matrixSvg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Create scales
    const xScale = d3.scaleBand()
        .domain(categories)
        .range([0, width])
        .padding(0.05);
    
    const yScale = d3.scaleBand()
        .domain(categories)
        .range([0, height])
        .padding(0.05);
    
    // Color scale for correlation strength
    const colorScale = d3.scaleSequential()
        .domain([0, 1])
        .interpolator(d3.interpolateInferno);
    
    // Size scale for significance
    const sizeScale = d3.scaleLinear()
        .domain([0, 1])
        .range([xScale.bandwidth() * 0.3, xScale.bandwidth() * 0.9]);
    
    // Add background grid
    matrixSvg.append('g')
        .attr('class', 'matrix-grid')
        .selectAll('line')
        .data(categories)
        .enter()
        .append('line')
        .attr('x1', d => xScale(d))
        .attr('x2', d => xScale(d))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', 'var(--grid-color)')
        .attr('stroke-width', 0.5);
    
    matrixSvg.append('g')
        .attr('class', 'matrix-grid')
        .selectAll('line')
        .data(categories)
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d))
        .attr('stroke', 'var(--grid-color)')
        .attr('stroke-width', 0.5);
    
    // Create matrix cells
    const cells = matrixSvg.selectAll('.matrix-cell')
        .data(matrixData)
        .enter()
        .append('g')
        .attr('class', 'matrix-cell')
        .attr('transform', d => `translate(${xScale(d.target) + xScale.bandwidth()/2},${yScale(d.source) + yScale.bandwidth()/2})`);
    
    // Add cell backgrounds
    cells.append('rect')
        .attr('class', 'cell-bg')
        .attr('x', -xScale.bandwidth()/2)
        .attr('y', -yScale.bandwidth()/2)
        .attr('width', xScale.bandwidth())
        .attr('height', yScale.bandwidth())
        .attr('fill', 'transparent')
        .attr('stroke', 'var(--grid-color)')
        .attr('stroke-width', 0.5);
    
    // Add correlation indicators
    cells.append('circle')
        .attr('class', 'correlation-indicator')
        .attr('r', d => sizeScale(d.significance))
        .attr('fill', d => colorScale(d.value))
        .attr('opacity', d => d.value > filterThreshold ? 0.8 : 0.2)
        .attr('stroke', d => d.quality > 0.7 ? 'var(--accent-color)' : 'none')
        .attr('stroke-width', 2);
    
    // Add significance markers
    cells.filter(d => d.significance > 0.8)
        .append('text')
        .attr('class', 'significance-marker')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.3em')
        .attr('fill', 'white')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text('!');
    
    // Add temporal indicators
    cells.filter(d => d.temporal.peak)
        .append('path')
        .attr('class', 'temporal-indicator')
        .attr('d', d3.symbol().type(d3.symbolTriangle).size(50))
        .attr('fill', 'var(--pulse-color)')
        .attr('transform', 'translate(15,-15)');
    
    // Add X axis labels
    matrixSvg.append('g')
        .attr('class', 'x-axis')
        .selectAll('text')
        .data(categories)
        .enter()
        .append('text')
        .attr('x', d => xScale(d) + xScale.bandwidth()/2)
        .attr('y', -10)
        .attr('text-anchor', 'end')
        .attr('transform', d => `rotate(-45, ${xScale(d) + xScale.bandwidth()/2}, -10)`)
        .attr('fill', 'var(--text-primary)')
        .attr('font-size', '12px')
        .text(d => d);
    
    // Add Y axis labels
    matrixSvg.append('g')
        .attr('class', 'y-axis')
        .selectAll('text')
        .data(categories)
        .enter()
        .append('text')
        .attr('x', -10)
        .attr('y', d => yScale(d) + yScale.bandwidth()/2)
        .attr('text-anchor', 'end')
        .attr('dy', '0.3em')
        .attr('fill', 'var(--text-primary)')
        .attr('font-size', '12px')
        .text(d => d);
    
    // Add interactions
    cells.on('click', function(event, d) {
        selectCell(d, this);
    })
    .on('mouseover', function(event, d) {
        showTooltip(event, d);
        highlightConnections(d);
    })
    .on('mouseout', function() {
        hideTooltip();
        clearHighlights();
    });
    
    // Add legend
    createLegend(container);
}

// Create control panel for the matrix
function createMatrixControls(container) {
    const controls = d3.select(container)
        .append('div')
        .attr('class', 'matrix-controls');
    
    controls.append('h3')
        .text('Correlation Analysis Controls');
    
    // Threshold slider
    const thresholdControl = controls.append('div')
        .attr('class', 'control-group');
    
    thresholdControl.append('label')
        .text('Correlation Threshold: ');
    
    const thresholdValue = thresholdControl.append('span')
        .attr('id', 'threshold-value')
        .text(filterThreshold.toFixed(2));
    
    thresholdControl.append('input')
        .attr('type', 'range')
        .attr('min', '0')
        .attr('max', '1')
        .attr('step', '0.05')
        .attr('value', filterThreshold)
        .on('input', function() {
            filterThreshold = +this.value;
            thresholdValue.text(filterThreshold.toFixed(2));
            updateMatrixFilter();
        });
    
    // Quality filter
    controls.append('div')
        .attr('class', 'control-group')
        .append('label')
        .html('<input type="checkbox" id="quality-filter"> Show only high-quality evidence');
    
    // Temporal filter
    controls.append('div')
        .attr('class', 'control-group')
        .append('label')
        .html('<input type="checkbox" id="temporal-filter"> Show temporal correlations');
    
    // Statistical significance
    controls.append('div')
        .attr('class', 'control-group')
        .append('label')
        .html('<input type="checkbox" id="significance-filter" checked> Show statistical significance');
}

// Create details panel
function createDetailsPanel(container) {
    const panel = d3.select(container)
        .append('div')
        .attr('class', 'matrix-details-panel')
        .style('display', 'none');
    
    panel.append('h3')
        .attr('class', 'details-title');
    
    panel.append('div')
        .attr('class', 'correlation-info');
    
    panel.append('div')
        .attr('class', 'evidence-list');
    
    panel.append('div')
        .attr('class', 'temporal-chart');
    
    panel.append('button')
        .attr('class', 'close-details')
        .text('Close')
        .on('click', () => {
            panel.style('display', 'none');
            if (selectedCell) {
                d3.select(selectedCell).classed('selected', false);
                selectedCell = null;
            }
        });
}

// Select and show details for a cell
function selectCell(data, element) {
    // Update selection
    if (selectedCell) {
        d3.select(selectedCell).classed('selected', false);
    }
    selectedCell = element;
    d3.select(element).classed('selected', true);
    
    // Update details panel
    const panel = d3.select('.matrix-details-panel');
    panel.style('display', 'block');
    
    panel.select('.details-title')
        .text(`${data.source} ↔ ${data.target}`);
    
    const info = panel.select('.correlation-info');
    info.html('');
    
    info.append('p')
        .html(`<strong>Correlation Strength:</strong> ${(data.value * 100).toFixed(1)}%`);
    
    info.append('p')
        .html(`<strong>Statistical Significance:</strong> ${(data.significance * 100).toFixed(1)}%`);
    
    info.append('p')
        .html(`<strong>Evidence Quality:</strong> ${getQualityRating(data.quality)}`);
    
    // Show evidence
    const evidenceList = panel.select('.evidence-list');
    evidenceList.html('<h4>Supporting Evidence:</h4>');
    
    const list = evidenceList.append('ul');
    data.evidence.forEach(e => {
        const item = list.append('li');
        item.append('span')
            .attr('class', 'evidence-type')
            .text(`[${e.type}] `);
        item.append('a')
            .attr('href', e.source)
            .attr('target', '_blank')
            .text(e.description);
        item.append('span')
            .attr('class', 'evidence-date')
            .text(` (${e.date})`);
    });
    
    // Show temporal chart
    if (data.temporal.data && data.temporal.data.length > 0) {
        createTemporalChart(panel.select('.temporal-chart'), data.temporal);
    }
}

// Create temporal correlation chart
function createTemporalChart(container, temporalData) {
    container.html('<h4>Temporal Correlation:</h4>');
    
    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Scales
    const xScale = d3.scaleTime()
        .domain(d3.extent(temporalData.data, d => new Date(d.date)))
        .range([0, width]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);
    
    // Line generator
    const line = d3.line()
        .x(d => xScale(new Date(d.date)))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);
    
    // Add line
    svg.append('path')
        .datum(temporalData.data)
        .attr('fill', 'none')
        .attr('stroke', 'var(--accent-color)')
        .attr('stroke-width', 2)
        .attr('d', line);
    
    // Add axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y')));
    
    svg.append('g')
        .call(d3.axisLeft(yScale).ticks(5));
    
    // Add peak marker
    if (temporalData.peak) {
        const peakDate = new Date(temporalData.peakDate);
        svg.append('line')
            .attr('x1', xScale(peakDate))
            .attr('x2', xScale(peakDate))
            .attr('y1', 0)
            .attr('y2', height)
            .attr('stroke', 'var(--warning-color)')
            .attr('stroke-dasharray', '3,3');
        
        svg.append('text')
            .attr('x', xScale(peakDate))
            .attr('y', -5)
            .attr('text-anchor', 'middle')
            .attr('fill', 'var(--warning-color)')
            .attr('font-size', '12px')
            .text('Peak Activity');
    }
}

// Generate evidence links
function generateEvidenceLinks(cat1, cat2, correlation) {
    const evidence = [];
    const numEvidence = Math.floor(correlation * 10) + Math.floor(Math.random() * 3);
    
    const evidenceTypes = [
        { type: 'Document', sources: ['CIA Archive', 'FBI Vault', 'NSA Release', 'WikiLeaks'] },
        { type: 'Witness', sources: ['Military Personnel', 'Government Official', 'Researcher', 'Local Resident'] },
        { type: 'Physical', sources: ['Site Analysis', 'Material Sample', 'Photograph', 'Video Recording'] },
        { type: 'Data', sources: ['Sensor Reading', 'Satellite Image', 'Statistical Analysis', 'Pattern Match'] }
    ];
    
    for (let i = 0; i < numEvidence; i++) {
        const type = evidenceTypes[Math.floor(Math.random() * evidenceTypes.length)];
        const source = type.sources[Math.floor(Math.random() * type.sources.length)];
        
        evidence.push({
            type: type.type,
            description: `${source} - ${cat1}/${cat2} correlation`,
            date: generateRandomDate(),
            quality: Math.random() * 0.5 + 0.5,
            source: '#' // Would link to actual evidence
        });
    }
    
    return evidence;
}

// Generate temporal pattern
function generateTemporalPattern() {
    const hasPattern = Math.random() > 0.5;
    if (!hasPattern) return { peak: false, data: [] };
    
    const data = [];
    const startYear = 1950;
    const endYear = 2025;
    const peakYear = startYear + Math.floor(Math.random() * (endYear - startYear));
    
    for (let year = startYear; year <= endYear; year += 5) {
        const distance = Math.abs(year - peakYear);
        const value = Math.max(0.1, 1 - (distance / 50)) + (Math.random() * 0.2 - 0.1);
        data.push({
            date: `${year}-01-01`,
            value: Math.min(1, Math.max(0, value))
        });
    }
    
    return {
        peak: true,
        peakDate: `${peakYear}-01-01`,
        data: data
    };
}

// Calculate statistical significance
function calculateSignificance(correlation, evidenceCount) {
    const base = correlation * 0.7;
    const evidenceBonus = Math.min(0.3, evidenceCount * 0.05);
    return Math.min(1, base + evidenceBonus);
}

// Calculate evidence quality
function calculateQuality(evidence) {
    if (evidence.length === 0) return 0;
    const avgQuality = evidence.reduce((sum, e) => sum + e.quality, 0) / evidence.length;
    return avgQuality;
}

// Get quality rating text
function getQualityRating(quality) {
    if (quality > 0.8) return '⭐⭐⭐⭐⭐ Excellent';
    if (quality > 0.6) return '⭐⭐⭐⭐ Good';
    if (quality > 0.4) return '⭐⭐⭐ Moderate';
    if (quality > 0.2) return '⭐⭐ Limited';
    return '⭐ Poor';
}

// Generate random date
function generateRandomDate() {
    const start = new Date(1950, 0, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
}

// Update matrix filter
function updateMatrixFilter() {
    matrixSvg.selectAll('.correlation-indicator')
        .transition()
        .duration(300)
        .attr('opacity', d => d.value > filterThreshold ? 0.8 : 0.2);
}

// Highlight connections
function highlightConnections(data) {
    // Dim all cells
    matrixSvg.selectAll('.matrix-cell')
        .classed('dimmed', true);
    
    // Highlight connected cells
    matrixSvg.selectAll('.matrix-cell')
        .filter(d => d.source === data.source || d.target === data.target)
        .classed('dimmed', false)
        .classed('highlighted', true);
}

// Clear highlights
function clearHighlights() {
    matrixSvg.selectAll('.matrix-cell')
        .classed('dimmed', false)
        .classed('highlighted', false);
}

// Create tooltip
function showTooltip(event, data) {
    if (!tooltip) {
        tooltip = d3.select('body')
            .append('div')
            .attr('class', 'matrix-tooltip')
            .style('position', 'absolute')
            .style('display', 'none');
    }
    
    tooltip.html(`
        <strong>${data.source} ↔ ${data.target}</strong><br>
        Correlation: ${(data.value * 100).toFixed(1)}%<br>
        Evidence Count: ${data.evidence.length}<br>
        Quality: ${getQualityRating(data.quality)}
    `)
    .style('left', (event.pageX + 10) + 'px')
    .style('top', (event.pageY - 10) + 'px')
    .style('display', 'block');
}

// Hide tooltip
function hideTooltip() {
    if (tooltip) {
        tooltip.style('display', 'none');
    }
}

// Create legend
function createLegend(container) {
    const legend = container.append('div')
        .attr('class', 'matrix-legend');
    
    legend.append('h4')
        .text('Legend');
    
    // Color scale
    const colorLegend = legend.append('div')
        .attr('class', 'color-legend');
    
    colorLegend.append('span')
        .text('Correlation Strength: ');
    
    const gradient = colorLegend.append('div')
        .attr('class', 'gradient-bar')
        .style('background', 'linear-gradient(to right, #000428, #5d1049, #c2356c, #ee7555, #fbda61)');
    
    colorLegend.append('span')
        .text('0% — 100%');
    
    // Symbols
    const symbols = legend.append('div')
        .attr('class', 'symbol-legend');
    
    symbols.append('div')
        .html('⭐ Evidence Quality Rating');
    
    symbols.append('div')
        .html('! High Statistical Significance');
    
    symbols.append('div')
        .html('▲ Temporal Peak Activity');
}

// Initialize matrix interactions
function initializeMatrixInteractions() {
    // Quality filter
    d3.select('#quality-filter').on('change', function() {
        const showOnlyHigh = this.checked;
        matrixSvg.selectAll('.matrix-cell')
            .style('display', d => {
                if (showOnlyHigh && d.quality < 0.7) return 'none';
                return 'block';
            });
    });
    
    // Temporal filter
    d3.select('#temporal-filter').on('change', function() {
        const showTemporal = this.checked;
        matrixSvg.selectAll('.temporal-indicator')
            .style('display', showTemporal ? 'block' : 'none');
    });
    
    // Significance filter
    d3.select('#significance-filter').on('change', function() {
        const showSignificance = this.checked;
        matrixSvg.selectAll('.significance-marker')
            .style('display', showSignificance ? 'block' : 'none');
    });
}

// Cleanup function
function cleanupEvidenceMatrix() {
    if (tooltip) {
        tooltip.remove();
        tooltip = null;
    }
    selectedCell = null;
}

// Export functions
window.initEvidence = initEvidence;
window.cleanupEvidenceMatrix = cleanupEvidenceMatrix;