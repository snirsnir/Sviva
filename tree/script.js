let videoElement = document.getElementById('cameraView');
let classifier;
let detecting = true;
let detectionInterval = null;

// Define handleError function that was missing
function handleError(error) {
    console.error('Error during detection:', error);
    if (error.name === 'NotAllowedError') {
        alert('Camera access denied. Please allow camera access to use this feature.');
    } else {
        alert('An error occurred during detection. Please try again.');
    }
}

// Function to open the camera and start detecting trees
async function detectTree() {
    clearInterval(detectionInterval);
    detecting = true;
    videoElement.style.display = 'block';

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        classifier = await ml5.imageClassifier('MobileNet', videoElement);
        console.log('Model loaded for tree detection');
        detectionInterval = setInterval(classifyVideoForTree, 3000);
    } catch (error) {
        console.error("Error accessing camera or loading model:", error);
        handleError(error);
    }
}

// Function to classify the video input for trees
function classifyVideoForTree() {
    if (!detecting) return; // Stop if detection is disabled

    classifier.classify(videoElement)
        .then(handleTreeResults)
        .catch(handleError);
}

// Handle classification results for trees
function handleTreeResults(results) {
    console.log('Classification results for trees:', results);

    if (Array.isArray(results) && results.length > 0) {
        const treeFound = results.some(result => {
            const label = result.label ? result.label.toLowerCase() : '';
            const confidence = result.confidence || 0;
            return (label.includes('boa') || label.includes('tree')) && confidence > 0.05;
        });

        if (treeFound) {
            alert('Tree found!');
            detecting = false; // Stop further detections
            closeCamera();
            removeTreeButton(); // Remove the tree button from the scene
            addTreeModel(); // Add a small tree model in the 3D scene
        }
    }
}

// Function to open the camera and start detecting birds
async function detectBirds() {
    clearInterval(detectionInterval); // Stop any ongoing detection intervals
    detecting = true; // Enable detection
    videoElement.style.display = 'block'; // Show camera view

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;

        // Load the MobileNet classifier for bird detection
        classifier = await ml5.imageClassifier('MobileNet', videoElement);
        console.log('Model loaded for bird detection');
        
        detectionInterval = setInterval(classifyVideoForBirds, 3000); // Check every 3 seconds for bird detection
    } catch (error) {
        console.error("Error accessing camera or loading model:", error);
    }
}

// Function to classify the video input for birds
function classifyVideoForBirds() {
    if (!detecting) return; // Stop if detection is disabled

    classifier.classify(videoElement)
        .then(handleBirdResults)
        .catch(handleError);
}

// Handle classification results for birds
function handleBirdResults(results) {
    console.log('Classification results for birds:', results);

    if (Array.isArray(results) && results.length > 0) {
        const birdFound = results.some(result => {
            const label = result.label ? result.label.toLowerCase() : '';
            const confidence = result.confidence || 0;
            return (label.includes('robin') || label.includes('bird')) && confidence > 0.05;
        });

        if (birdFound) {
            alert('Bird found!');
            detecting = false; // Stop further detections
            closeCamera();
            removeBirdButton(); // Remove the bird button from the scene
            addBirdModel(); // Add a bird model in the 3D scene
        }
    }
}

// Function to close the camera and hide the video element
function closeCamera() {
    videoElement.style.display = 'none'; // Hide the video feed
    const stream = videoElement.srcObject;
    if (stream) {
        stream.getTracks().forEach(track => track.stop()); // Stop the camera stream
    }
    clearInterval(detectionInterval); // Stop the current detection interval
}

// Function to remove the tree button after detection
function removeTreeButton() {
    const treeButton = document.querySelector('a-box[color="green"]');
    if (treeButton) {
        treeButton.parentNode.removeChild(treeButton); // Remove the tree button
    }
}

// Function to remove the bird button after detection
function removeBirdButton() {
    const birdButton = document.querySelector('a-box[color="purple"]');
    if (birdButton) {
        birdButton.parentNode.removeChild(birdButton); // Remove the bird button
    }
}

function addTreeModel() {
    const scene = document.querySelector('a-scene');
    const tree = document.createElement('a-entity');
    tree.innerHTML = `
        <a-cylinder position="0 0.75 0" radius="0.2" height="1.5" color="saddlebrown"></a-cylinder>
        <a-cone position="0 2.2 0" radius-bottom="0.8" height="1.5" color="green"></a-cone>
        <a-image src="text/bird-text.png" position="0 3.5 0" width="2" height="0.5"></a-image>
    `;
    tree.setAttribute('position', { x: -4, y: 0, z: -3 });
    scene.appendChild(tree);
}


document.querySelector('a-scene').addEventListener('loaded', function () {
    console.log('Scene loaded');
});

// מוסיף מאזין לטעינת הנכסים
document.querySelector('a-assets').addEventListener('loaded', function () {
    console.log('Assets loaded');
});

function addBirdModel() {
    const scene = document.querySelector('a-scene');
    
    // מערך של קונפיגורציות לכל ציפור
    const birdConfigs = [
        {
            position: { x: 1, y: 1, z: -4 },
            rotation: { x: 270, y: 220, z: 180 },
            scale: { x: 0.1, y: 0.1, z: 0.1 }
        },
        {
            position: { x: 4, y: 1, z: -4 },
            rotation: { x: 270, y: 220, z: 120 },
            scale: { x: 0.1, y: 0.1, z: 0.1  }
        },
        {
            position: { x: 6, y: 1, z: -4 },
            rotation: { x: 270, y: 220, z: 140 },
            scale: { x: 0.1, y: 0.1, z: 0.1  }
        },
        {
            position: { x: 8, y: 1, z: -4 },
            rotation: { x: 270, y: 220, z: 190 },
            scale: { x: 0.1, y: 0.1, z: 0.1  }
        }
    ];
    // יצירת כל הציפורים
    birdConfigs.forEach((config, index) => {
        // יצירת container לכל ציפור
        const container = document.createElement('a-entity');
        container.setAttribute('position', config.position);
        container.setAttribute('rotation', config.rotation);
        container.setAttribute('scale', config.scale);

        // יצירת הציפור עצמה
        const birdEntity = document.createElement('a-entity');
        
        birdEntity.setAttribute('obj-model', {
            obj: '#bird-obj'
        });

        birdEntity.setAttribute('material', {
            shader: 'standard',
            src: '#bird-diffuse',
            normalMap: '#bird-normal',
            normalScale: { x: 1, y: 1 },
            roughness: 0.5,
            metalness: 0.1
        });

        // אירועי דיבוג
        birdEntity.addEventListener('model-loaded', (ev) => {
            console.log(`Bird ${index + 1} loaded successfully`);
            
            // עדכון המטריאל אחרי טעינת המודל
            const mesh = birdEntity.getObject3D('mesh');
            if (mesh) {
                mesh.traverse((node) => {
                    if (node.isMesh) {
                        node.material = new THREE.MeshStandardMaterial({
                            map: new THREE.TextureLoader().load(document.querySelector('#bird-diffuse').src),
                            normalMap: new THREE.TextureLoader().load(document.querySelector('#bird-normal').src),
                            normalScale: new THREE.Vector2(1, 1),
                            roughness: 0.5,
                            metalness: 0.1
                        });
                        node.material.needsUpdate = true;
                    }
                });
            }
        });

        birdEntity.addEventListener('materialtextureloaded', () => {
            console.log(`Texture loaded for bird ${index + 1}`);
        });

        birdEntity.addEventListener('model-error', (error) => {
            console.error(`Error loading bird ${index + 1}:`, error);
        });

        // הוספת טקסט מעל כל ציפור
        const textEntity = document.createElement('a-entity');
        textEntity.setAttribute('position', { x: 0, y: 1.5, z: 0 });
        textEntity.setAttribute('text', {
            value: `Bird ${index + 1}`,
            align: 'center',
            width: 2,
            color: 'white'
        });

        // הרכבת המודל
        container.appendChild(birdEntity);
        container.appendChild(textEntity);
        scene.appendChild(container);
    });
}