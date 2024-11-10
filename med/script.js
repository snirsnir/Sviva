const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const alertDiv = document.createElement('div');
alertDiv.id = 'successAlert';
alertDiv.style.display = 'none';
alertDiv.style.color = 'red';
alertDiv.style.fontSize = '24px';
alertDiv.style.fontWeight = 'bold';
alertDiv.innerText = 'הצלחה!';
document.body.appendChild(alertDiv);

const context = canvas.getContext('2d', { willReadFrequently: true });

// הפעלת המצלמה
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(error => console.error('Error accessing the camera:', error));

// כאשר הווידאו מוכן, מתחילים את זיהוי הרקע והכדור
video.addEventListener('loadeddata', () => {
    setInterval(detectBackgroundAndBall, 500);  // ביצוע זיהוי כל חצי שניה
});

function detectBackgroundAndBall() {
    if (video.videoWidth === 0 || video.videoHeight === 0) {
        return; // בדיקה אם הווידאו נטען במלואו
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const frame = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = frame.data;

    let greenPixelCount = 0;
    let grayPixelCount = 0;
    const greenPixelThreshold = 25000;          // מעל 25,000 פיקסלים ירוקים נדרשים לרקע ירוק
    const grayPixelThreshold = 500;             // מספר מינימלי לפיקסלים אפורים כדי לזהות כדור אפור

    // מעבר על הפיקסלים ובדיקת רקע ירוק או כדור אפור
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // בדיקת צבע ירוק
        if (g > 150 && r < 120 && b < 120) {
            greenPixelCount++;
        }
        // בדיקת צבע אפור (ערכי RGB קרובים בין 120 ל-160 והפרש מקסימלי של 10 בין הערוצים)
        else if (Math.abs(r - g) <= 10 && Math.abs(g - b) <= 10 && Math.abs(r - b) <= 10 && r >= 120 && r <= 160) {
            grayPixelCount++;
        }
    }

    const isGreenBackground = greenPixelCount >= greenPixelThreshold;
    const isGrayBallDetected = grayPixelCount >= grayPixelThreshold;

    // אם יש גם רקע ירוק מעל 25,000 פיקסלים וגם כדור אפור, הצג התראה
    if (isGreenBackground && isGrayBallDetected) {
        alertDiv.style.display = 'block';
    } else {
        alertDiv.style.display = 'none';
    }
}
