let videoElement = document.getElementById('cameraView');
let openCameraButton = document.getElementById('openCameraButton');
let classifier;
let detecting = true; // דגל לבקרת הלולאה

// גישה למצלמה והפעלת זיהוי עצמים
async function detectTree() {
    videoElement.style.display = 'block'; // הצג את הווידאו

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;

        // טען את המודל MobileNet בעזרת ml5.js
        classifier = ml5.imageClassifier('MobileNet', videoElement, modelReady);
    } catch (error) {
        console.error("Error accessing camera:", error);
    }
}

// כאשר המודל מוכן
function modelReady() {
    console.log('Model is ready');
    // התחל את הבדיקה כל 3 שניות
    setInterval(classifyVideo, 3000);
}

// סיווג הווידאו
function classifyVideo() {
    if (!detecting) return;  // עצור אם זוהה אובייקט מתאים

    classifier.classify(videoElement, (error, results) => {
        if (error) {
            // הדפס את השגיאה
            console.error('Error during classification:', error);
            return;
        }

        // תוצאות נכונות, הדפסן לקונסול
        if (results && results.length > 0) {
            console.log('Classification results (correctly handled):', results);  // הדפסת התוצאות לקונסול

            // בדיקה אם זוהה אובייקט עם רמת ביטחון גבוהה מ-0.05
            const treeFound = results.some(result => {
                const label = result.label.toLowerCase();
                return (label.includes('tree') || label.includes('plant') || label.includes('cellular telephone')) && result.confidence > 0.05;
            });

            if (treeFound) {
                alert('found');  // הצגת הודעת "found" כאשר נמצא זיהוי מתאים
                detecting = false;  // עצור את הבדיקה
            }
        } else {
            console.log('No classification results received.');
        }
    });
}

// האזנה ללחיצה על כפתור הפעלת המצלמה
openCameraButton.addEventListener('click', detectTree);
