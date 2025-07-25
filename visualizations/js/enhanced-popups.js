// Enhanced popup system for all map elements

class EnhancedPopup {
    constructor() {
        this.popup = null;
        this.createPopupElement();
    }
    
    createPopupElement() {
        // Remove any existing popup
        const existing = document.getElementById('enhanced-popup');
        if (existing) existing.remove();
        
        // Create new popup element
        this.popup = document.createElement('div');
        this.popup.id = 'enhanced-popup';
        this.popup.className = 'enhanced-popup hidden';
        this.popup.innerHTML = `
            <div class="popup-header">
                <h3 class="popup-title"></h3>
                <button class="popup-close">×</button>
            </div>
            <div class="popup-content"></div>
        `;
        
        document.body.appendChild(this.popup);
        
        // Add close handler
        this.popup.querySelector('.popup-close').addEventListener('click', () => this.hide());
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!this.popup.contains(e.target) && !e.target.closest('.clickable-element')) {
                this.hide();
            }
        });
    }
    
    show(data, x, y) {
        const title = this.popup.querySelector('.popup-title');
        const content = this.popup.querySelector('.popup-content');
        
        // Set title
        title.textContent = data.name || data.location || 'Information';
        
        // Generate content based on type
        content.innerHTML = this.generateContent(data);
        
        // Position popup
        this.popup.classList.remove('hidden');
        
        // Calculate position to keep popup on screen
        const rect = this.popup.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        let left = x + 10;
        let top = y + 10;
        
        if (left + rect.width > windowWidth) {
            left = x - rect.width - 10;
        }
        if (top + rect.height > windowHeight) {
            top = y - rect.height - 10;
        }
        
        this.popup.style.left = left + 'px';
        this.popup.style.top = top + 'px';
    }
    
    hide() {
        this.popup.classList.add('hidden');
    }
    
    generateContent(data) {
        let html = '';
        
        // Monument content
        if (data.power !== undefined) {
            html = `
                <div class="popup-section">
                    <div class="popup-field">
                        <span class="field-label">Coordinates:</span>
                        <span class="field-value">${data.coords[0].toFixed(4)}°, ${data.coords[1].toFixed(4)}°</span>
                    </div>
                    <div class="popup-field">
                        <span class="field-label">Power Level:</span>
                        <span class="field-value">${this.generatePowerBar(data.power)}</span>
                    </div>
                    <div class="popup-field">
                        <span class="field-label">Age:</span>
                        <span class="field-value">${data.age ? data.age.toLocaleString() + ' years' : 'Unknown'}</span>
                    </div>
                </div>
                ${data.description ? `<div class="popup-description">${data.description}</div>` : ''}
                ${data.alignments ? `
                    <div class="popup-section">
                        <h4>Alignments</h4>
                        <ul class="alignment-list">
                            ${data.alignments.map(a => `<li>${a}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            `;
        }
        
        // Underground base content
        else if (data.depth !== undefined) {
            html = `
                <div class="popup-section">
                    <div class="popup-field">
                        <span class="field-label">Coordinates:</span>
                        <span class="field-value">${data.coords[0].toFixed(4)}°, ${data.coords[1].toFixed(4)}°</span>
                    </div>
                    <div class="popup-field">
                        <span class="field-label">Depth:</span>
                        <span class="field-value">Level ${data.depth} (${data.depth * 1000}m)</span>
                    </div>
                    <div class="popup-field">
                        <span class="field-label">Type:</span>
                        <span class="field-value type-${data.type}">${data.type.toUpperCase()}</span>
                    </div>
                    <div class="popup-field">
                        <span class="field-label">Population:</span>
                        <span class="field-value">${data.population ? data.population.toLocaleString() : 'Classified'}</span>
                    </div>
                    <div class="popup-field">
                        <span class="field-label">Discovered:</span>
                        <span class="field-value">${data.discovered || 'Unknown'}</span>
                    </div>
                </div>
            `;
        }
        
        // Missing 411 cluster content
        else if (data.cases !== undefined) {
            html = `
                <div class="popup-section">
                    <div class="popup-field">
                        <span class="field-label">Location:</span>
                        <span class="field-value">${data.location}</span>
                    </div>
                    <div class="popup-field">
                        <span class="field-label">Cases:</span>
                        <span class="field-value warning">${data.cases}</span>
                    </div>
                    <div class="popup-field">
                        <span class="field-label">Profile:</span>
                        <span class="field-value">${data.profile}</span>
                    </div>
                    <div class="popup-field">
                        <span class="field-label">Nearest Base:</span>
                        <span class="field-value">${data.nearestBase}km</span>
                    </div>
                </div>
                <div class="popup-warning">
                    ⚠️ High-risk area for unexplained disappearances
                </div>
            `;
        }
        
        // Ley line content
        else if (data.frequency !== undefined) {
            html = `
                <div class="popup-section">
                    <div class="popup-field">
                        <span class="field-label">Energy Line:</span>
                        <span class="field-value">${data.name}</span>
                    </div>
                    <div class="popup-field">
                        <span class="field-label">Frequency:</span>
                        <span class="field-value">${data.frequency} Hz</span>
                    </div>
                    <div class="popup-field">
                        <span class="field-label">Status:</span>
                        <span class="field-value status-${data.status}">${data.status.toUpperCase()}</span>
                    </div>
                    <div class="popup-field">
                        <span class="field-label">Connected Nodes:</span>
                        <span class="field-value">${data.nodes.join(' → ')}</span>
                    </div>
                </div>
            `;
        }
        
        // Crop circle content
        else if (data.complexity !== undefined) {
            html = `
                <div class="popup-section">
                    <div class="popup-field">
                        <span class="field-label">Date:</span>
                        <span class="field-value">${data.date}</span>
                    </div>
                    <div class="popup-field">
                        <span class="field-label">Complexity:</span>
                        <span class="field-value">${this.generateComplexityStars(data.complexity)}</span>
                    </div>
                    <div class="popup-field">
                        <span class="field-label">Location:</span>
                        <span class="field-value">${data.coords[0].toFixed(4)}°, ${data.coords[1].toFixed(4)}°</span>
                    </div>
                </div>
                <div class="popup-description">
                    Sacred geometry pattern detected. Possible activation code.
                </div>
            `;
        }
        
        // UAP sighting content
        else if (data.type) {
            html = `
                <div class="popup-section">
                    <div class="popup-field">
                        <span class="field-label">Date:</span>
                        <span class="field-value">${data.date}</span>
                    </div>
                    <div class="popup-field">
                        <span class="field-label">Type:</span>
                        <span class="field-value">${data.type.toUpperCase()}</span>
                    </div>
                    <div class="popup-field">
                        <span class="field-label">Location:</span>
                        <span class="field-value">${data.coords[0].toFixed(4)}°, ${data.coords[1].toFixed(4)}°</span>
                    </div>
                </div>
            `;
        }
        
        return html;
    }
    
    generatePowerBar(power) {
        const maxPower = 10;
        const percentage = (power / maxPower) * 100;
        return `
            <div class="power-bar">
                <div class="power-fill" style="width: ${percentage}%"></div>
                <span class="power-text">${power}/${maxPower}</span>
            </div>
        `;
    }
    
    generateComplexityStars(complexity) {
        const maxStars = 10;
        let stars = '';
        for (let i = 0; i < maxStars; i++) {
            stars += i < complexity ? '★' : '☆';
        }
        return `<span class="complexity-stars">${stars}</span>`;
    }
}

// Create global instance
window.enhancedPopup = new EnhancedPopup();

// Add CSS styles
const popupStyles = document.createElement('style');
popupStyles.textContent = `
.enhanced-popup {
    position: absolute;
    background: rgba(0, 0, 0, 0.95);
    border: 2px solid var(--accent-color);
    border-radius: 8px;
    padding: 0;
    min-width: 300px;
    max-width: 400px;
    box-shadow: 0 0 20px rgba(0, 255, 204, 0.5);
    z-index: 1000;
    font-size: 14px;
    color: #ffffff;
}

.enhanced-popup.hidden {
    display: none;
}

.popup-header {
    background: rgba(0, 255, 204, 0.1);
    border-bottom: 1px solid var(--accent-color);
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.popup-title {
    margin: 0;
    color: var(--accent-color);
    font-size: 18px;
}

.popup-close {
    background: none;
    border: 1px solid var(--accent-color);
    color: var(--accent-color);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.popup-close:hover {
    background: var(--accent-color);
    color: #000;
}

.popup-content {
    padding: 15px;
}

.popup-section {
    margin-bottom: 15px;
}

.popup-section:last-child {
    margin-bottom: 0;
}

.popup-section h4 {
    color: var(--accent-color);
    margin: 0 0 10px 0;
    font-size: 14px;
}

.popup-field {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    padding: 5px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.field-label {
    color: #999;
    font-weight: bold;
}

.field-value {
    color: #fff;
    text-align: right;
}

.field-value.warning {
    color: #ff6b6b;
    font-weight: bold;
}

.field-value.type-primary {
    color: #ff00ff;
}

.field-value.type-genetics {
    color: #00ff00;
}

.field-value.type-communications {
    color: #00ffcc;
}

.field-value.status-active {
    color: #00ff00;
}

.field-value.status-activating {
    color: #ffcc00;
    animation: pulse 2s infinite;
}

.popup-description {
    margin-top: 10px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    font-style: italic;
    color: #ccc;
}

.popup-warning {
    margin-top: 10px;
    padding: 10px;
    background: rgba(255, 107, 107, 0.2);
    border: 1px solid #ff6b6b;
    border-radius: 4px;
    color: #ff6b6b;
}

.alignment-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.alignment-list li {
    padding: 5px 10px;
    background: rgba(0, 255, 204, 0.1);
    margin-bottom: 5px;
    border-radius: 4px;
    border-left: 3px solid var(--accent-color);
}

.power-bar {
    width: 150px;
    height: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
}

.power-fill {
    height: 100%;
    background: linear-gradient(90deg, #00ff00, #00ffcc);
    transition: width 0.5s ease;
}

.power-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #000;
    font-weight: bold;
    font-size: 12px;
}

.complexity-stars {
    color: #ffcc00;
    font-size: 16px;
}

.clickable-element {
    cursor: pointer;
}

.clickable-element:hover {
    filter: brightness(1.5);
}

@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
}
`;

document.head.appendChild(popupStyles);