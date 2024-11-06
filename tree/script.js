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
            return (label.includes('broccoli') || label.includes('tree')) && confidence > 0.05;
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
            return (label.includes('chickadee') || label.includes('bird')) && confidence > 0.05;
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
    
    const treeConfigs = [
        // קבוצה ראשונה - קדמית
        {
            position: { x: -15, y: -2, z: -2 },
            rotation: { x: 0, y: 45, z: 0 },
            scale: { x: 0.22, y: 0.22, z: 0.22 }
        },
        {
            position: { x: -8, y: -2, z: -3 },
            rotation: { x: 0, y: -30, z: 0 },
            scale: { x: 0.2, y: 0.2, z: 0.2 }
        },
        {
            position: { x: 2, y: -2, z: -2.5 },
            rotation: { x: 0, y: 15, z: 0 },
            scale: { x: 0.21, y: 0.21, z: 0.21 }
        },

        // קבוצה שנייה - אמצעית
        {
            position: { x: -12, y: -2, z: -5 },
            rotation: { x: 0, y: -45, z: 0 },
            scale: { x: 0.19, y: 0.19, z: 0.19 }
        },
        {
            position: { x: -3, y: -2, z: -6 },
            rotation: { x: 0, y: 180, z: 0 },
            scale: { x: 0.23, y: 0.23, z: 0.23 }
        },
        {
            position: { x: 5, y: -2, z: -5 },
            rotation: { x: 0, y: 90, z: 0 },
            scale: { x: 0.2, y: 0.2, z: 0.2 }
        },

        // קבוצה שלישית - רחוקה
        {
            position: { x: -18, y: -2, z: -8 },
            rotation: { x: 0, y: 60, z: 0 },
            scale: { x: 0.24, y: 0.24, z: 0.24 }
        },
        {
            position: { x: -10, y: -2, z: -9 },
            rotation: { x: 0, y: -75, z: 0 },
            scale: { x: 0.22, y: 0.22, z: 0.22 }
        },
        {
            position: { x: -2, y: -2, z: -8 },
            rotation: { x: 0, y: 30, z: 0 },
            scale: { x: 0.21, y: 0.21, z: 0.21 }
        },
        {
            position: { x: 8, y: -2, z: -7 },
            rotation: { x: 0, y: -15, z: 0 },
            scale: { x: 0.23, y: 0.23, z: 0.23 }
        }
    ];

    // יצירת העצים
    treeConfigs.forEach((config, index) => {
        const container = document.createElement('a-entity');
        container.setAttribute('position', config.position);
        container.setAttribute('rotation', config.rotation);
        container.setAttribute('scale', config.scale);

        const treeEntity = document.createElement('a-entity');
        treeEntity.setAttribute('obj-model', {
            obj: '#tree-obj'
        });

        treeEntity.addEventListener('model-loaded', (ev) => {
            console.log(`Tree ${index + 1} loaded, applying materials...`);
            const mesh = treeEntity.getObject3D('mesh');
            
            if (mesh) {
                const barkMaterial = new THREE.MeshStandardMaterial({
                    map: new THREE.TextureLoader().load(document.querySelector('#tree-bark').src),
                    roughness: 1.0,
                    metalness: 0.0,
                    side: THREE.DoubleSide
                });

                const leavesMaterial = new THREE.MeshStandardMaterial({
                    map: new THREE.TextureLoader().load(document.querySelector('#tree-leaves').src),
                    transparent: true,
                    alphaTest: 0.5,
                    side: THREE.DoubleSide,
                    roughness: 0.7,
                    metalness: 0.0
                });

                mesh.traverse((node) => {
                    if (node.isMesh) {
                        if (node.name.toLowerCase().includes('tree')) {
                            node.material = barkMaterial;
                        } else {
                            node.material = leavesMaterial;
                        }
                        node.material.needsUpdate = true;
                    }
                });
            }
        });

        treeEntity.addEventListener('model-error', (error) => {
            console.error(`Error loading tree ${index + 1}:`, error);
        });

        container.appendChild(treeEntity);
        scene.appendChild(container);
    });
}
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
// Function to detect monkey
async function detectMonkey() {
    clearInterval(detectionInterval);
    detecting = true;
    videoElement.style.display = 'block';

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        classifier = await ml5.imageClassifier('MobileNet', videoElement);
        console.log('Model loaded for monkey detection');
        detectionInterval = setInterval(classifyVideoForMonkey, 3000);
    } catch (error) {
        console.error("Error accessing camera or loading model:", error);
        handleError(error);
    }
}

// Function to classify video for monkey
function classifyVideoForMonkey() {
    if (!detecting) return;
    classifier.classify(videoElement)
        .then(handleMonkeyResults)
        .catch(handleError);
}

// Handle monkey detection results
function handleMonkeyResults(results) {
    console.log('Classification results for monkey:', results);

    if (Array.isArray(results) && results.length > 0) {
        const monkeyFound = results.some(result => {
            const label = result.label ? result.label.toLowerCase() : '';
            const confidence = result.confidence || 0;
            return (label.includes('monkey') || label.includes('ape') || label.includes('dough')) && confidence > 0.05;
        });

        if (monkeyFound) {
            alert('Monkey found!');
            detecting = false;
            closeCamera();
            removeMonkeyButton();
            addMonkeyModel();
        }
    }
}

// Remove monkey button
function removeMonkeyButton() {
    const monkeyButton = document.querySelector('a-box[color="orange"]');
    if (monkeyButton) {
        monkeyButton.parentNode.removeChild(monkeyButton);
    }
}

// Add monkey model
function addMonkeyModel() {
    const scene = document.querySelector('a-scene');
    
    const monkeyConfigs = [
        // קוף ראשון - שמאל
        {
            position: { x: -10, y: -1.8, z: 3 },
            rotation: { x: 270, y: 0, z: 275 },
            scale: { x: 0.02, y: 0.02, z: 0.02 }    // הקטנה משמעותית
        },
        // קוף שני - שמאל מרכז
        {
            position: { x: -9, y: -1.8, z: 3.2 },
            rotation: { x: 270, y: 0, z: 295 },
            scale: { x: 0.018, y: 0.018, z: 0.018 }
        },
        // קוף שלישי - מרכז
        {
            position: { x: -8, y: -1.8, z: 3.4 },
            rotation: { x: 270, y: 0, z: 255 },
            scale: { x: 0.022, y: 0.022, z: 0.022 }
        },
        // קוף רביעי - ימין
        {
            position: { x: -7, y: -1.8, z: 3.6 },
            rotation: { x: 270, y: 0, z: 285 },
            scale: { x: 0.02, y: 0.02, z: 0.02 }
        }
    ];

    monkeyConfigs.forEach((config, index) => {
        const container = document.createElement('a-entity');
        container.setAttribute('position', config.position);
        container.setAttribute('rotation', config.rotation);
        container.setAttribute('scale', config.scale);

        const monkeyEntity = document.createElement('a-entity');
        monkeyEntity.setAttribute('obj-model', {
            obj: '#monkey-obj'
        });

        monkeyEntity.addEventListener('model-loaded', (ev) => {
            console.log(`Monkey ${index + 1} loaded successfully`);
            const mesh = monkeyEntity.getObject3D('mesh');
            
            if (mesh) {
                mesh.traverse((node) => {
                    if (node.isMesh) {
                        node.material = new THREE.MeshStandardMaterial({
                            map: new THREE.TextureLoader().load(document.querySelector('#monkey-diffuse').src),
                            normalMap: new THREE.TextureLoader().load(document.querySelector('#monkey-normal').src),
                            alphaMap: new THREE.TextureLoader().load(document.querySelector('#monkey-opacity').src),
                            transparent: true,
                            normalScale: new THREE.Vector2(1, 1),
                            roughness: 0.7,
                            metalness: 0.2
                        });
                        node.material.needsUpdate = true;
                    }
                });
            }
        });

        // Add debug events
        monkeyEntity.addEventListener('materialtextureloaded', () => {
            console.log(`Texture loaded for monkey ${index + 1}`);
        });

        monkeyEntity.addEventListener('model-error', (error) => {
            console.error(`Error loading monkey ${index + 1}:`, error);
        });

        container.appendChild(monkeyEntity);
        scene.appendChild(container);
    });
}

function addDeerModel() {
    const scene = document.querySelector('a-scene');
    
    const deerConfigs = [
        {
            position: { x: -5, y: -1.8, z: 3 },
            rotation: { x: 0, y: 0, z: 0 },  // התאמה ראשונית לכיוון
            scale: { x: 0.1, y: 0.1, z: 0.1 }  // התחלה עם סקייל קטן
        },
        {
            position: { x: -9, y: -1.8, z: 3.5 },
            rotation: { x: 0, y: 30, z: 0 },
            scale: { x: 0.1, y: 0.1, z: 0.1 }
        },
        // אפשר להוסיף עוד קונפיגורציות לאיילים נוספים
        {
            position: { x: -13, y: -1.8, z: 3 },
            rotation: { x: 0, y: 0, z: 0 },  // התאמה ראשונית לכיוון
            scale: { x: 0.1, y: 0.1, z: 0.1 }  // התחלה עם סקייל קטן
        },
        {
            position: { x: -26, y: -1.8, z: 3.5 },
            rotation: { x: 0, y: 30, z: 0 },
            scale: { x: 0.1, y: 0.1, z: 0.1 }
        },
        // אפשר להוסיף עוד קונפיגורציות לאיילים נוספים
    ];

    deerConfigs.forEach((config, index) => {
        const container = document.createElement('a-entity');
        container.setAttribute('position', config.position);
        container.setAttribute('rotation', config.rotation);
        container.setAttribute('scale', config.scale);

        const deerEntity = document.createElement('a-entity');
        deerEntity.setAttribute('obj-model', {
            obj: '#deer-obj'
        });

        deerEntity.addEventListener('model-loaded', (ev) => {
            console.log(`Deer ${index + 1} loaded successfully`);
            const mesh = deerEntity.getObject3D('mesh');
            
            if (mesh) {
                mesh.traverse((node) => {
                    if (node.isMesh) {
                        // טעינת טקסטורת ה-TGA
                        const texture = new THREE.TextureLoader().load(
                            document.querySelector('#deer-texture').src,
                            (texture) => {
                                console.log('TGA texture loaded successfully');
                                texture.flipY = false; // לפעמים נדרש לטקסטורות TGA
                            }
                        );

                        node.material = new THREE.MeshStandardMaterial({
                            map: texture,
                            roughness: 0.7,
                            metalness: 0.2
                        });
                        node.material.needsUpdate = true;
                    }
                });
            }
        });

        deerEntity.addEventListener('model-error', (error) => {
            console.error(`Error loading deer ${index + 1}:`, error);
        });

        container.appendChild(deerEntity);
        scene.appendChild(container);
    });
}

// הוספת פונקציה לזיהוי איילים (בדומה לזיהוי קופים)
async function detectDeer() {
    clearInterval(detectionInterval);
    detecting = true;
    videoElement.style.display = 'block';

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        classifier = await ml5.imageClassifier('MobileNet', videoElement);
        console.log('Model loaded for deer detection');
        detectionInterval = setInterval(classifyVideoForDeer, 3000);
    } catch (error) {
        console.error("Error accessing camera or loading model:", error);
        handleError(error);
    }
}

function classifyVideoForDeer() {
    if (!detecting) return;
    classifier.classify(videoElement)
        .then(handleDeerResults)
        .catch(handleError);
}

function handleDeerResults(results) {
    console.log('Classification results for deer:', results);
    if (Array.isArray(results) && results.length > 0) {
        const deerFound = results.some(result => {
            const label = result.label ? result.label.toLowerCase() : '';
            const confidence = result.confidence || 0;
            return (label.includes('deer') || 
                   label.includes('corn') || 
                   label.includes('hotdog')) && 
                   confidence > 0.05;
        });

        if (deerFound) {
            alert('Deer found!');
            detecting = false;
            closeCamera();
            removeDeerButton();
            addDeerModel();
        }
    }
}

function removeDeerButton() {
    const deerButton = document.querySelector('a-box[data-animal="deer"]');
    if (deerButton) {
        deerButton.parentNode.removeChild(deerButton);
    }
}
// פונקציית הוספת מודל החזיר
function addBoarModel() {
    const scene = document.querySelector('a-scene');
    
    const boarConfigs = [
        // חזיר ראשון
        {
            position: { x: -10, y: -1.8, z: 3 },
            rotation: { x: 0, y: 180, z: 0 },
            scale: { x: 0.1, y: 0.1, z: 0.1 }  // נתחיל עם סקייל קטן
        },
        // חזיר שני
        {
            position: { x: -14, y: -1.8, z: 4 },
            rotation: { x: 0, y: 160, z: 0 },
            scale: { x: 0.2, y: 0.2, z: 0.2 }
        },
        // חזיר שלישי
        {
            position: { x: -8, y: -1.8, z: 5 },
            rotation: { x: 0, y: 200, z: 0 },
            scale: { x: 0.15, y: 0.15, z: 0.15 }
        },
        // חזיר רביעי
        {
            position: { x: -20, y: -1.8, z: 3.5 },
            rotation: { x: 0, y: 170, z: 0 },
            scale: { x: 0.3, y: 0.3, z: 0.3 }
        }
    ];

    boarConfigs.forEach((config, index) => {
        const container = document.createElement('a-entity');
        container.setAttribute('position', config.position);
        container.setAttribute('rotation', config.rotation);
        container.setAttribute('scale', config.scale);

        const boarEntity = document.createElement('a-entity');
        boarEntity.setAttribute('obj-model', {
            obj: '#boar-obj',
            mtl: '#boar-mtl'
        });

        boarEntity.addEventListener('model-loaded', (ev) => {
            console.log(`Boar ${index + 1} loaded successfully`);
            const mesh = boarEntity.getObject3D('mesh');
            
            if (mesh) {
                mesh.traverse((node) => {
                    if (node.isMesh) {
                        // עדכון החומר עם הטקסטורה
                        const material = new THREE.MeshStandardMaterial({
                            map: new THREE.TextureLoader().load(document.querySelector('#boar-texture').src),
                            roughness: 0.7,
                            metalness: 0.2
                        });
                        node.material = material;
                        node.material.needsUpdate = true;
                    }
                });
            }
        });

        container.appendChild(boarEntity);
        scene.appendChild(container);
    });
}

// פונקציות זיהוי החזיר
async function detectBoar() {
    clearInterval(detectionInterval);
    detecting = true;
    videoElement.style.display = 'block';

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        classifier = await ml5.imageClassifier('MobileNet', videoElement);
        console.log('Model loaded for boar detection');
        detectionInterval = setInterval(classifyVideoForBoar, 3000);
    } catch (error) {
        console.error("Error accessing camera or loading model:", error);
        handleError(error);
    }
}

function classifyVideoForBoar() {
    if (!detecting) return;
    classifier.classify(videoElement)
        .then(handleBoarResults)
        .catch(handleError);
}

function handleBoarResults(results) {
    console.log('Classification results for boar:', results);
    if (Array.isArray(results) && results.length > 0) {
        const boarFound = results.some(result => {
            const label = result.label ? result.label.toLowerCase() : '';
            const confidence = result.confidence || 0;
            return (label.includes('barbershop') || 
                   label.includes('polecat') || 
                   label.includes('fitch')) && 
                   confidence > 0.05;
        });

        if (boarFound) {
            alert('Boar found!');
            detecting = false;
            closeCamera();
            removeBoarButton();
            addBoarModel();
        }
    }
}

function removeBoarButton() {
    const boarButton = document.querySelector('a-box[data-animal="boar"]');
    if (boarButton) {
        boarButton.parentNode.removeChild(boarButton);
    }
}

function addFoxModel() {
    const scene = document.querySelector('a-scene');
    
    const foxConfigs = [
        // שועל ראשון
        {
            position: { x: -6, y: -1.8, z: 3 },
            rotation: { x: 0, y: 180, z: 0 },
            scale: { x: 0.1, y: 0.1, z: 0.1 }  // סקייל קטן יותר משום ששועלים קטנים יותר
        },
        // שועל שני
        {
            position: { x: -8, y: -1.8, z: 4 },
            rotation: { x: 0, y: 160, z: 0 },
            scale: { x: 0.12, y: 0.12, z: 0.12 }
        },
        // שועל שלישי
        {
            position: { x: -4, y: -1.8, z: 5 },
            rotation: { x: 0, y: 200, z: 0 },
            scale: { x: 0.3, y: 0.3, z: 0.3 }
        },
        // שועל רביעי
        {
            position: { x: -7, y: -1.8, z: 3.5 },
            rotation: { x: 0, y: 170, z: 0 },
            scale: { x: 0.1, y: 0.1, z: 0.1 }
        }
    ];

    foxConfigs.forEach((config, index) => {
        const container = document.createElement('a-entity');
        container.setAttribute('position', config.position);
        container.setAttribute('rotation', config.rotation);
        container.setAttribute('scale', config.scale);

        const foxEntity = document.createElement('a-entity');
        foxEntity.setAttribute('obj-model', {
            obj: '#fox-obj',
            mtl: '#fox-mtl'
        });

        foxEntity.addEventListener('model-loaded', (ev) => {
            console.log(`Fox ${index + 1} loaded successfully`);
            const mesh = foxEntity.getObject3D('mesh');
            
            if (mesh) {
                mesh.traverse((node) => {
                    if (node.isMesh) {
                        // עדכון החומר עם הטקסטורה
                        const material = new THREE.MeshStandardMaterial({
                            map: new THREE.TextureLoader().load(document.querySelector('#fox-texture').src),
                            roughness: 0.7,
                            metalness: 0.2
                        });
                        node.material = material;
                        node.material.needsUpdate = true;
                    }
                });
            }
        });

        container.appendChild(foxEntity);
        scene.appendChild(container);
    });
}

// פונקציות זיהוי השועל
async function detectFox() {
    clearInterval(detectionInterval);
    detecting = true;
    videoElement.style.display = 'block';

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        classifier = await ml5.imageClassifier('MobileNet', videoElement);
        console.log('Model loaded for fox detection');
        detectionInterval = setInterval(classifyVideoForFox, 3000);
    } catch (error) {
        console.error("Error accessing camera or loading model:", error);
        handleError(error);
    }
}

function classifyVideoForFox() {
    if (!detecting) return;
    classifier.classify(videoElement)
        .then(handleFoxResults)
        .catch(handleError);
}

function handleFoxResults(results) {
    console.log('Classification results for fox:', results);
    if (Array.isArray(results) && results.length > 0) {
        const foxFound = results.some(result => {
            const label = result.label ? result.label.toLowerCase() : '';
            const confidence = result.confidence || 0;
            return (label.includes('fox') || 
                   label.includes('canine') || 
                   label.includes('wolf')) && 
                   confidence > 0.05;
        });

        if (foxFound) {
            alert('Fox found!');
            detecting = false;
            closeCamera();
            removeFoxButton();
            addFoxModel();
        }
    }
}

function removeFoxButton() {
    const foxButton = document.querySelector('a-box[data-animal="fox"]');
    if (foxButton) {
        foxButton.parentNode.removeChild(foxButton);
    }
}