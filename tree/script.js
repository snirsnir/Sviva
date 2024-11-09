// Global Variables
let videoElement = document.getElementById('cameraView');
let classifier;
let detecting = true;
let detectionInterval = null;

// מאזיני טעינת הדף
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('guideModal').style.display = 'block';
    }, 2000);

    // הוספת מאזיני אירועים למצלמה
    document.getElementById('closeCamera').addEventListener('click', function(e) {
        e.stopPropagation();
        closeCamera();
    });
    
    document.getElementById('cameraOverlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeCamera();
        }
    });
});

// Character Modal Configuration
const characters = {
    monkey: {
        question: "מי אני? אני אוהב לקפץ מעץ לעץ ולאכול בננות 🍌",
        info: "יצור חברתי וחכם זה חיוני ליער! הוא מפיץ זרעים דרך תזונתו, שומר על האיזון האקולוגי ועוזר לעצים להתרבות דרך אכילת הפירות והפצתם.",
        answer: "קוף"
    },
    bird: {
        question: "מי אני? אני עף בשמיים ושר שירים מקסימים 🎵",
        info: "יצורי הכנף האלה חיוניים למערכת האקולוגית! הם מפיצים זרעים למרחקים ארוכים, מבקרים פרחים ושומרים על איזון אוכלוסיית החרקים.",
        answer: "ציפור"
    },
    tree: {
        question: "מי אני? אני גבוה וירוק, נותן צל ומייצר חמצן 🌳",
        info: "הענקים הירוקים האלה הם הריאות של כדור הארץ! הם מייצרים חמצן, סופגים פחמן דו-חמצני ומספקים בית למגוון רחב של יצורים חיים.",
        answer: "עץ"
    },
    deer: {
        question: "מי אני? אני מדלג ביער בעדינות עם קרניים מרשימות 🦌",
        info: "יצורי הבר העדינים האלה חיוניים למערכת האקולוגית! הם עוזרים בהפצת זרעים דרך הפרווה והצואה ושומרים על איזון הצמחייה ביער.",
        answer: "אייל"
    },
    boar: {
        question: "מי אני? אני חופר באדמה ומחפש מזון עם האף שלי 🐗",
        info: "החופרים החרוצים האלה חיוניים לבריאות היער! הם מערבבים את האדמה, מפיצים זרעים ושומרים על איזון אוכלוסיות החרקים והצמחים.",
        answer: "חזיר בר"
    },
    fox: {
        question: "מי אני? אני ערמומי וחכם, עם זנב ארוך ואדמוני 🦊",
        info: "הטורפים החכמים האלה חיוניים לשמירה על איזון ביער! הם עוזרים בבקרת אוכלוסיות המכרסמים ומפיצים זרעים באופן טבעי.",
        answer: "שועל"
    }
};

// Modal Functions
function showGuideModal() {
    document.getElementById('guideModal').style.display = 'block';
    const iframe = document.querySelector('.modal-iframe');
    iframe.contentWindow.showSection(1);
}

function closeModal() {
    document.getElementById('guideModal').style.display = 'none';
}

function showCharacterModal(characterType) {
    const modal = document.getElementById('characterModal');
    const character = characters[characterType];
    
    document.getElementById('characterQuestion').textContent = character.question;
    document.getElementById('characterInfo').textContent = character.info;
    
    const input = document.getElementById('characterInput');
    input.value = '';
    document.querySelector('.validation-mark').style.display = 'none';
    document.getElementById('scanBtn').classList.remove('active');
    
    modal.style.display = 'block';
    input.focus();

    modal.dataset.characterType = characterType;
}

// Camera Functions
async function openCamera() {
    videoElement.style.display = 'block';
    document.getElementById('cameraOverlay').style.display = 'block';
    document.getElementById('closeCamera').style.display = 'flex';
}

function closeCamera() {
    videoElement.style.display = 'none';
    document.getElementById('cameraOverlay').style.display = 'none';
    document.getElementById('closeCamera').style.display = 'none';
    detecting = false;
    const stream = videoElement.srcObject;
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    clearInterval(detectionInterval);
}

// Error Handler
function handleError(error) {
    console.error('Error during detection:', error);
    if (error.name === 'NotAllowedError') {
        alert('נדרשת גישה למצלמה כדי להשתמש בתכונה זו.');
    } else {
        alert('אירעה שגיאה. אנא נסו שוב.');
    }
    closeCamera();
}

// Input Validation
document.getElementById('characterInput').addEventListener('input', function(e) {
    const modal = document.getElementById('characterModal');
    const characterType = modal.dataset.characterType;
    const correctAnswer = characters[characterType].answer;
    
    const isCorrect = e.target.value.trim().toLowerCase() === correctAnswer.toLowerCase();
    document.querySelector('.validation-mark').style.display = isCorrect ? 'block' : 'none';
    document.getElementById('scanBtn').classList.toggle('active', isCorrect);
});

// Scanning Functions
function startScanning() {
    const modal = document.getElementById('characterModal');
    const characterType = modal.dataset.characterType;
    modal.style.display = 'none';
    
    switch(characterType) {
        case 'monkey': detectMonkey(); break;
        case 'bird': detectBirds(); break;
        case 'tree': detectTree(); break;
        case 'deer': detectDeer(); break;
        case 'boar': detectBoar(); break;
        case 'fox': detectFox(); break;
    }
}

// Detection Functions
async function detectTree() {
    clearInterval(detectionInterval);
    detecting = true;
    await openCamera();

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        classifier = await ml5.imageClassifier('MobileNet', videoElement);
        detectionInterval = setInterval(classifyVideoForTree, 3000);
    } catch (error) {
        handleError(error);
    }
}

async function detectBirds() {
    clearInterval(detectionInterval);
    detecting = true;
    await openCamera();

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        classifier = await ml5.imageClassifier('MobileNet', videoElement);
        detectionInterval = setInterval(classifyVideoForBirds, 3000);
    } catch (error) {
        handleError(error);
    }
}

async function detectMonkey() {
    clearInterval(detectionInterval);
    detecting = true;
    await openCamera();

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        classifier = await ml5.imageClassifier('MobileNet', videoElement);
        detectionInterval = setInterval(classifyVideoForMonkey, 3000);
    } catch (error) {
        handleError(error);
    }
}

async function detectDeer() {
    clearInterval(detectionInterval);
    detecting = true;
    await openCamera();

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        classifier = await ml5.imageClassifier('MobileNet', videoElement);
        detectionInterval = setInterval(classifyVideoForDeer, 3000);
    } catch (error) {
        handleError(error);
    }
}

async function detectBoar() {
    clearInterval(detectionInterval);
    detecting = true;
    await openCamera();

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        classifier = await ml5.imageClassifier('MobileNet', videoElement);
        detectionInterval = setInterval(classifyVideoForBoar, 3000);
    } catch (error) {
        handleError(error);
    }
}

async function detectFox() {
    clearInterval(detectionInterval);
    detecting = true;
    await openCamera();

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        classifier = await ml5.imageClassifier('MobileNet', videoElement);
        detectionInterval = setInterval(classifyVideoForFox, 3000);
    } catch (error) {
        handleError(error);
    }
}

// Classification Functions
function classifyVideoForTree() {
    if (!detecting) return;
    classifier.classify(videoElement)
        .then(handleTreeResults)
        .catch(handleError);
}

function classifyVideoForBirds() {
    if (!detecting) return;
    classifier.classify(videoElement)
        .then(handleBirdResults)
        .catch(handleError);
}

function classifyVideoForMonkey() {
    if (!detecting) return;
    classifier.classify(videoElement)
        .then(handleMonkeyResults)
        .catch(handleError);
}

function classifyVideoForDeer() {
    if (!detecting) return;
    classifier.classify(videoElement)
        .then(handleDeerResults)
        .catch(handleError);
}

function classifyVideoForBoar() {
    if (!detecting) return;
    classifier.classify(videoElement)
        .then(handleBoarResults)
        .catch(handleError);
}

function classifyVideoForFox() {
    if (!detecting) return;
    classifier.classify(videoElement)
        .then(handleFoxResults)
        .catch(handleError);
}

// Result Handlers
function handleTreeResults(results) {
    if (!detecting) return;
    if (Array.isArray(results) && results.length > 0) {
        const treeFound = results.some(result => {
            const label = result.label ? result.label.toLowerCase() : '';
            const confidence = result.confidence || 0;
            return (label.includes('broccoli') || label.includes('tree')) && confidence > 0.05;
        });

        if (treeFound) {
            detecting = false;
            closeCamera();
            removeTreeButton();
            addTreeModel();
        }
    }
}

function handleBirdResults(results) {
    if (!detecting) return;
    if (Array.isArray(results) && results.length > 0) {
        const birdFound = results.some(result => {
            const label = result.label ? result.label.toLowerCase() : '';
            const confidence = result.confidence || 0;
            return (label.includes('chickadee') || label.includes('bird')) && confidence > 0.05;
        });

        if (birdFound) {
            detecting = false;
            closeCamera();
            removeBirdButton();
            addBirdModel();
        }
    }
}

function handleMonkeyResults(results) {
    if (!detecting) return;
    if (Array.isArray(results) && results.length > 0) {
        const monkeyFound = results.some(result => {
            const label = result.label ? result.label.toLowerCase() : '';
            const confidence = result.confidence || 0;
            return (label.includes('monkey') || label.includes('ape') || label.includes('dough')) && confidence > 0.05;
        });

        if (monkeyFound) {
            detecting = false;
            closeCamera();
            removeMonkeyButton();
            addMonkeyModel();
        }
    }
}

function handleDeerResults(results) {
    if (!detecting) return;
    if (Array.isArray(results) && results.length > 0) {
        const deerFound = results.some(result => {
            const label = result.label ? result.label.toLowerCase() : '';
            const confidence = result.confidence || 0;
            return (label.includes('deer') || label.includes('corn') || label.includes('hotdog')) && confidence > 0.05;
        });

        if (deerFound) {
            detecting = false;
            closeCamera();
            removeDeerButton();
            addDeerModel();
        }
    }
}

function handleBoarResults(results) {
    if (!detecting) return;
    if (Array.isArray(results) && results.length > 0) {
        const boarFound = results.some(result => {
            const label = result.label ? result.label.toLowerCase() : '';
            const confidence = result.confidence || 0;
            return (label.includes('barbershop') || label.includes('polecat') || label.includes('fitch')) && confidence > 0.05;
        });

        if (boarFound) {
            detecting = false;
            closeCamera();
            removeBoarButton();
            addBoarModel();
        }
    }
}

function handleFoxResults(results) {
    if (!detecting) return;
    if (Array.isArray(results) && results.length > 0) {
        const foxFound = results.some(result => {
            const label = result.label ? result.label.toLowerCase() : '';
            const confidence = result.confidence || 0;
            return (label.includes('fox') || label.includes('canine') || label.includes('wolf')) && confidence > 0.05;
        });

        if (foxFound) {
            detecting = false;
            closeCamera();
            removeFoxButton();
            addFoxModel();
        }
    }
}

// Remove Button Functions
function removeTreeButton() {
    const button = document.querySelector('a-box[color="green"]');
    if (button) button.parentNode.removeChild(button);
}

function removeBirdButton() {
    const button = document.querySelector('a-box[color="purple"]');
    if (button) button.parentNode.removeChild(button);
}

function removeMonkeyButton() {
    const button = document.querySelector('a-box[color="orange"]');
    if (button) button.parentNode.removeChild(button);
}

function removeDeerButton() {
    const button = document.querySelector('a-box[data-animal="deer"]');
    if (button) button.parentNode.removeChild(button);
}

function removeBoarButton() {
    const button = document.querySelector('a-box[data-animal="boar"]');
    if (button) button.parentNode.removeChild(button);
}

function removeFoxButton() {
    const button = document.querySelector('a-box[data-animal="fox"]');
    if (button) button.parentNode.removeChild(button);
}

// Add Model Functions
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
        }
    ];

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
                        node.material = node.name.toLowerCase().includes('tree') ? barkMaterial : leavesMaterial;
                        node.material.needsUpdate = true;
                    }
                });
            }
        });

        container.appendChild(treeEntity);
        scene.appendChild(container);
    });
}

function addBirdModel() {
    const scene = document.querySelector('a-scene');
    const birdConfigs = [
        {
            position: { x: 1, y: 1, z: -4 },
            rotation: { x: 270, y: 220, z: 180 },
            scale: { x: 0.1, y: 0.1, z: 0.1 }
        },
        {
            position: { x: 4, y: 1, z: -4 },
            rotation: { x: 270, y: 220, z: 120 },
            scale: { x: 0.1, y: 0.1, z: 0.1 }
        },
        {
            position: { x: 6, y: 1, z: -4 },
            rotation: { x: 270, y: 220, z: 140 },
            scale: { x: 0.1, y: 0.1, z: 0.1 }
        },
        {
            position: { x: 8, y: 1, z: -4 },
            rotation: { x: 270, y: 220, z: 190 },
            scale: { x: 0.1, y: 0.1, z: 0.1 }
        }
    ];

    birdConfigs.forEach((config, index) => {
        const container = document.createElement('a-entity');
        container.setAttribute('position', config.position);
        container.setAttribute('rotation', config.rotation);
        container.setAttribute('scale', config.scale);

        const birdEntity = document.createElement('a-entity');
        birdEntity.setAttribute('obj-model', {
            obj: '#bird-obj'
        });

        birdEntity.addEventListener('model-loaded', (ev) => {
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

        container.appendChild(birdEntity);
        scene.appendChild(container);
    });
}

function addMonkeyModel() {
    const scene = document.querySelector('a-scene');
    const monkeyConfigs = [
        {
            position: { x: -10, y: -1.8, z: 3 },
            rotation: { x: 270, y: 0, z: 275 },
            scale: { x: 0.02, y: 0.02, z: 0.02 }
        },
        {
            position: { x: -9, y: -1.8, z: 3.2 },
            rotation: { x: 270, y: 0, z: 295 },
            scale: { x: 0.018, y: 0.018, z: 0.018 }
        },
        {
            position: { x: -8, y: -1.8, z: 3.4 },
            rotation: { x: 270, y: 0, z: 255 },
            scale: { x: 0.022, y: 0.022, z: 0.022 }
        },
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

        container.appendChild(monkeyEntity);
        scene.appendChild(container);
    });
}

function addDeerModel() {
    const scene = document.querySelector('a-scene');
    const deerConfigs = [
        {
            position: { x: -5, y: -1.8, z: 3 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 0.1, y: 0.1, z: 0.1 }
        },
        {
            position: { x: -9, y: -1.8, z: 3.5 },
            rotation: { x: 0, y: 30, z: 0 },
            scale: { x: 0.1, y: 0.1, z: 0.1 }
        },
        {
            position: { x: -13, y: -1.8, z: 3 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 0.1, y: 0.1, z: 0.1 }
        }
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
            const mesh = deerEntity.getObject3D('mesh');
            if (mesh) {
                mesh.traverse((node) => {
                    if (node.isMesh) {
                        const texture = new THREE.TextureLoader().load(
                            document.querySelector('#deer-texture').src,
                            (texture) => {
                                texture.flipY = false;
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

        container.appendChild(deerEntity);
        scene.appendChild(container);
    });
}

function addBoarModel() {
    const scene = document.querySelector('a-scene');
    const boarConfigs = [
        {
            position: { x: -10, y: -1.8, z: 3 },
            rotation: { x: 0, y: 180, z: 0 },
            scale: { x: 0.1, y: 0.1, z: 0.1 }
        },
        {
            position: { x: -14, y: -1.8, z: 4 },
            rotation: { x: 0, y: 160, z: 0 },
            scale: { x: 0.2, y: 0.2, z: 0.2 }
        },
        {
            position: { x: -8, y: -1.8, z: 5 },
            rotation: { x: 0, y: 200, z: 0 },
            scale: { x: 0.15, y: 0.15, z: 0.15 }
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
            const mesh = boarEntity.getObject3D('mesh');
            if (mesh) {
                mesh.traverse((node) => {
                    if (node.isMesh) {
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

function addFoxModel() {
    const scene = document.querySelector('a-scene');
    const foxConfigs = [
        {
            position: { x: -6, y: -1.8, z: 3 },
            rotation: { x: 0, y: 180, z: 0 },
            scale: { x: 0.1, y: 0.1, z: 0.1 }
        },
        {
            position: { x: -8, y: -1.8, z: 4 },
            rotation: { x: 0, y: 160, z: 0 },
            scale: { x: 0.12, y: 0.12, z: 0.12 }
        },
        {
            position: { x: -4, y: -1.8, z: 5 },
            rotation: { x: 0, y: 200, z: 0 },
            scale: { x: 0.3, y: 0.3, z: 0.3 }
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
            const mesh = foxEntity.getObject3D('mesh');
            if (mesh) {
                mesh.traverse((node) => {
                    if (node.isMesh) {
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

// Event Listeners for Input Validation
document.addEventListener('DOMContentLoaded', function() {
    // Character Input Validation
    const characterInput = document.getElementById('characterInput');
    if (characterInput) {
        characterInput.addEventListener('input', function(e) {
            const modal = document.getElementById('characterModal');
            const characterType = modal.dataset.characterType;
            const correctAnswer = characters[characterType].answer;
            
            const isCorrect = e.target.value.trim().toLowerCase() === correctAnswer.toLowerCase();
            document.querySelector('.validation-mark').style.display = isCorrect ? 'block' : 'none';
            document.getElementById('scanBtn').classList.toggle('active', isCorrect);
        });
    }

    // Camera Controls
    const closeButton = document.getElementById('closeCamera');
    if (closeButton) {
        closeButton.addEventListener('click', function(e) {
            e.stopPropagation();
            closeCamera();
        });
    }

    const cameraOverlay = document.getElementById('cameraOverlay');
    if (cameraOverlay) {
        cameraOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCamera();
            }
        });
    }
});

// Initialize detection handlers
function updateDetectionHandlers() {
    const originalHandlers = {
        handleTreeResults: window.handleTreeResults,
        handleBirdResults: window.handleBirdResults,
        handleMonkeyResults: window.handleMonkeyResults,
        handleDeerResults: window.handleDeerResults,
        handleBoarResults: window.handleBoarResults,
        handleFoxResults: window.handleFoxResults
    };

    for (let handler in originalHandlers) {
        window[handler] = function(results) {
            originalHandlers[handler].call(this, results);
            if (document.getElementById('characterModal')) {
                document.getElementById('characterModal').style.display = 'none';
            }
        };
    }
}

// Initialize when the page loads
window.addEventListener('load', function() {
    // Show initial guide
    setTimeout(() => {
        document.getElementById('guideModal').style.display = 'block';
    }, 2000);

    // Update detection handlers
    updateDetectionHandlers();
});