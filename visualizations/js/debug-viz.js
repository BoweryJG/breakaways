// Debug visualization to test if functions are working

function debugVisualization(containerId, vizName) {
    console.log(`[DEBUG] Starting ${vizName} in container: ${containerId}`);
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`[DEBUG] Container not found: ${containerId}`);
        return false;
    }
    
    console.log(`[DEBUG] Container found, dimensions: ${container.clientWidth}x${container.clientHeight}`);
    
    // Clear container
    container.innerHTML = '';
    
    // Add debug message
    const debugDiv = document.createElement('div');
    debugDiv.style.cssText = `
        padding: 20px;
        background: rgba(0, 255, 204, 0.1);
        border: 2px solid #00ffcc;
        color: #00ffcc;
        font-family: monospace;
        text-align: center;
    `;
    debugDiv.innerHTML = `
        <h3>${vizName} Debug Mode</h3>
        <p>Container: ${containerId}</p>
        <p>Dimensions: ${container.clientWidth}x${container.clientHeight}</p>
        <p>Three.js: ${typeof THREE !== 'undefined' ? 'Loaded' : 'Not Loaded'}</p>
        <p>D3.js: ${typeof d3 !== 'undefined' ? 'Loaded' : 'Not Loaded'}</p>
        <p>Time: ${new Date().toLocaleTimeString()}</p>
    `;
    container.appendChild(debugDiv);
    
    // Try to create a simple Three.js scene if available
    if (typeof THREE !== 'undefined') {
        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, container.clientWidth / 300, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(container.clientWidth, 300);
            container.appendChild(renderer.domElement);
            
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);
            
            camera.position.z = 5;
            
            function animate() {
                if (!renderer.domElement.parentNode) return; // Stop if removed
                requestAnimationFrame(animate);
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
                renderer.render(scene, camera);
            }
            animate();
            
            console.log(`[DEBUG] ${vizName} Three.js scene created successfully`);
        } catch (e) {
            console.error(`[DEBUG] ${vizName} Three.js error:`, e);
        }
    }
    
    return true;
}

// Override init functions with debug versions
window.debugMode = false;

window.initPopulationGeneticsDebug = function() {
    debugVisualization('population-genetics-container', 'Population Genetics');
};

window.initEarth3dDebug = function() {
    debugVisualization('earth-3d-container', 'Earth 3D');
};

window.initMasterConvergenceDebug = function() {
    debugVisualization('master-convergence-container', 'Master Convergence');
};

window.initEvidenceDebug = function() {
    debugVisualization('evidence-container', 'Evidence Matrix');
};

console.log('[DEBUG] Debug visualization functions loaded');