document.addEventListener('DOMContentLoaded', function() {
    // פונקציה משופרת למניעת גלילה
    function preventScroll(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    // רשימת כל אירועי הגלילה שנרצה למנוע
    const scrollEvents = [
        'wheel',
        'touchmove',
        'scroll',
        'mousewheel',
        'DOMMouseScroll'
    ];

    function toggleModalState(show) {
        const html = document.documentElement;
        const body = document.body;

        if (show) {
            const scrollY = window.scrollY;
            html.style.top = `-${scrollY}px`;
            
            html.classList.add('modal-open');
            body.classList.add('modal-open');

            scrollEvents.forEach(event => {
                window.addEventListener(event, preventScroll, { passive: false });
            });
        } else {
            scrollEvents.forEach(event => {
                window.removeEventListener(event, preventScroll);
            });

            html.classList.remove('modal-open');
            body.classList.remove('modal-open');
            
            const scrollY = parseInt(html.style.top || '0') * -1;
            html.style.top = '';
            window.scrollTo(0, scrollY);
        }
    }

    // טיפול באודיו
    const audioToggle = document.getElementById('audioToggle');
    const audio = document.getElementById('bgAudio');
    let isPlaying = true;

    function playAudio() {
        audio.muted = false;
        audio.play()
            .then(() => {
                isPlaying = true;
                updateButtonState();
            })
            .catch(error => {
                console.log("Playback failed:", error);
                isPlaying = false;
                updateButtonState();
            });
    }

    function updateButtonState() {
        const icon = audioToggle.querySelector('.audio-icon');
        icon.textContent = isPlaying ? '🔊' : '🔇';
        audioToggle.classList.toggle('muted', !isPlaying);
    }

    playAudio();

    audioToggle.addEventListener('click', function() {
        if (isPlaying) {
            audio.pause();
            audio.muted = true;
            isPlaying = false;
        } else {
            playAudio();
        }
        updateButtonState();
    });

    let environmentalDrops = 0;

    // פונקציה מעודכנת לעדכון צבע המד
    function updateEnvMeterColor(envMeterFill) {
        switch(environmentalDrops) {
            case 0:
                newColor = 'linear-gradient(to top, #ff0000, #ff4444)'; // אדום
                break;
            case 1:
                newColor = 'linear-gradient(to top, #FFA500, #FFB833)'; // כתום
                break;
            case 2:
                newColor = 'linear-gradient(to top, #FFB833, #FFD700)'; // כתום בהיר
                break;
            case 3:
                newColor = 'linear-gradient(to top, #FFD700, #FFFF00)'; // צהבהב
                break;
            case 4:
                newColor = 'linear-gradient(to top, #90EE90, #ADFF2F)'; // צהבהב-ירקרק
                break;
            case 5:
                newColor = 'linear-gradient(to top, #32CD32, #00FF00)'; // ירוק
                break;
            default:
                newColor = 'linear-gradient(to top, #32CD32, #00FF00)'; // ירוק כברירת מחדל
        }
        
        envMeterFill.style.background = newColor;
    }
    // האזנה להודעות מהמשימות השונות
    window.addEventListener("message", (event) => {
        const envMeterFill = document.querySelector('.env-meter-fill');

        switch(event.data.message) {
            case "closeCar":
                document.getElementById('trafficModal').style.display = 'none';
                const trafficImg = document.getElementById('trafficImg');
                if (trafficImg) trafficImg.src = "img/trafficV.png";
                
                const busImage = document.getElementById('busImage');
                if (busImage) busImage.setAttribute('visible', 'true');
                
                const carBox = document.querySelector('a-box[position="-15 -2 20"]');
                if (carBox) {
                    carBox.classList.remove('clickable');
                    carBox.removeAttribute('onclick');
                    carBox.removeAttribute('event-set__click');
                }
                break;

            case "closeTable":
                document.getElementById('powerModal').style.display = 'none';
                const energyImg = document.getElementById('energyImg');
                if (energyImg) energyImg.src = "img/energyV.png";
                
                const arubaGif = document.getElementById('arubaGif');
                if (arubaGif) arubaGif.setAttribute('visible', 'true');
                
                const powerBox = document.querySelector('a-box[position="26 7 30"]');
                if (powerBox) {
                    powerBox.classList.remove('clickable');
                    powerBox.removeAttribute('onclick');
                    powerBox.removeAttribute('event-set__click');
                }
                break;
            
                case "closeMifal":
                    document.getElementById('factoryModal').style.display = 'none';
                    const mifalImg = document.getElementById('mifalImg');
                    if (mifalImg) mifalImg.src = "img/mifalV.png";
                    
                    const solarImg = document.getElementById('solarImage');
                    if (solarImg) solarImg.setAttribute('visible', 'true');
                    const mifalBox = document.querySelector('a-box[position="-9 2 5"]');
                    if (mifalBox) {
                        mifalBox.classList.remove('clickable');
                        mifalBox.removeAttribute('onclick');
                        mifalBox.removeAttribute('event-set__click');
                    }

                    break;
                    case "closeMed":
                        document.getElementById('hospitalModal').style.display = 'none';
                        const medImg = document.getElementById('hospitalImg');
                        if (medImg) medImg.src = "img/hospitalV.png";
                        const airP = document.getElementById('airP');
                        if (airP) airP.setAttribute('visible', 'true');
                       
                        const medBox = document.querySelector('a-box[position="-3.5 1.6 -8"]');
                        if (medBox) {
                            medBox.classList.remove('clickable');
                            medBox.removeAttribute('onclick');
                            medBox.removeAttribute('event-set__click');
                        }
    
                        break;
            // הוסף כאן case נוספים לפי הצורך
            case "closeTree":
                document.getElementById('treeModal').style.display = 'none';
                const treesImg = document.getElementById('treesImg');
                if (treesImg) treesImg.src = "img/treesV.png";
                const treesi = document.getElementById('treesi');
                if (treesi) treesi.setAttribute('visible', 'true');
               
                const treesBox = document.querySelector('a-box[position="-19.5 -0.6 -15"]');
                if (treesBox) {
                    treesBox.classList.remove('clickable');
                    treesBox.removeAttribute('onclick');
                    treesBox.removeAttribute('event-set__click');
                }

                break;
    // הוסף כאן case נוספים לפי הצורך
}
        

        if (envMeterFill && event.data.message.startsWith('close')) {
            const currentHeight = parseFloat(getComputedStyle(envMeterFill).height);
            const newHeight = currentHeight * 0.8;
            envMeterFill.style.height = `${newHeight}px`;
            
            // מעלים את מספר הירידות ומעדכנים את הצבע
            environmentalDrops++;
            updateEnvMeterColor(envMeterFill);
        }
    });

    // סגירת מודל בלחיצה מחוץ לתוכן
    function closeModalOnClickOutside(event, modalId) {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    window.closeModalOnClickOutside = closeModalOnClickOutside;
});
// הוספת פונקציה לבדיקת השלמת המשימות
function checkAllTasksCompleted() {
    const images = [
        'hospitalV.png',
        'treesV.png',
        'mifalV.png',
        'trafficV.png',
        'energyV.png'
    ];
    
    let allCompleted = true;
    images.forEach(imageName => {
        const elements = Array.from(document.getElementsByTagName('img')).filter(img => 
            img.src.endsWith(imageName)
        );
        if (elements.length === 0) {
            allCompleted = false;
        }
    });
    
    if (allCompleted) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            z-index: 1001;
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
        `;
        
        messageDiv.innerHTML = `
            <h2 style="color: #2c3e50; margin-bottom: 15px; font-size: 24px;">
                <strong>הפכתם את העולם לנקי יותר!</strong>
            </h2>
            <p style="color: #34495e; font-size: 18px;">
                חפשו את השולחן ולחצו על הדו"ח סיכום
            </p>
        `;
        
        document.body.appendChild(messageDiv);
        
        // הסרת ההודעה אחרי 5 שניות
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transition = 'opacity 1s ease-out';
            setTimeout(() => messageDiv.remove(), 1000);
        }, 60000);
    }
}

// הוספת מאזין אירועים לשינויים בתמונות
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
            checkAllTasksCompleted();
        }
    });
});

// הפעלת המעקב אחר שינויי תמונות
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.circle img');
    images.forEach(img => {
        observer.observe(img, { attributes: true });
    });
});