let videoElement = document.getElementById('cameraView');
let classifier;
let detecting = true;
let detectionInterval = null; // To keep track of the interval

// Function to open the camera and start detecting trees
async function detectTree() {
    clearInterval(detectionInterval); // Stop any ongoing detection intervals
    detecting = true; // Enable detection
    videoElement.style.display = 'block'; // Show camera view

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;

        // Load the MobileNet classifier with the video input
        classifier = await ml5.imageClassifier('MobileNet', videoElement);
        console.log('Model loaded for tree detection');
        
        detectionInterval = setInterval(classifyVideoForTree, 3000); // Check every 3 seconds for tree detection
    } catch (error) {
        console.error("Error accessing camera or loading model:", error);
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

function addBirdModel() {
    const scene = document.querySelector('a-scene');
    const bird = document.createElement('a-entity');
    bird.innerHTML = `
        <a-sphere position="0 0.5 0" radius="0.3" color="white"></a-sphere>
        <a-sphere position="0 0.75 0" radius="0.15" color="grey"></a-sphere>
        <a-cone position="0 0.75 0.3" rotation="0 0 0" radius-bottom="0.05" height="0.2" color="orange"></a-cone>
        <a-cone position="-0.35 0.5 0" rotation="0 0 -90" radius-bottom="0.15" height="0.4" color="grey"></a-cone>
        <a-cone position="0.35 0.5 0" rotation="0 0 90" radius-bottom="0.15" height="0.4" color="white"></a-cone>
        <a-cone position="0 0.35 -0.3" rotation="0 0 0" radius-bottom="0.1" height="0.3" color="orange"></a-cone>
        <a-image src="text/bird-text.png" position="0 1.5 0" width="2" height="0.5"></a-image>
    `;
    bird.setAttribute('position', { x: 2, y: 2, z: -4 });
    scene.appendChild(bird);
}




// Handle errors during classification
function handleError(error) {
    console.error('Error during classification:', error);
}
