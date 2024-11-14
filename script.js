document.addEventListener('DOMContentLoaded', function() {
    const helpButton = document.getElementById('helpButton');
    const autoModal = document.getElementById('autoModal');
    
    // פתיחה אוטומטית של המודל אחרי 2 שניות
    setTimeout(function() {
        if (autoModal) {
            autoModal.style.display = 'block';
        }
    }, 2000);
    
    // טיפול בלחיצה על כפתור העזרה
    helpButton.addEventListener('click', function() {
        if (autoModal) {
            if (autoModal.style.display === 'block') {
                autoModal.style.display = 'none';
            } else {
                // מחדש את התוכן של ה-iframe לפני הצגת המודל
                const iframe = autoModal.querySelector('iframe');
                if (iframe) {
                    const currentSrc = iframe.src;
                    iframe.src = '';
                    iframe.src = currentSrc;
                }
                autoModal.style.display = 'block';
            }
        }
    });
    
    // טיפול בהודעת הסגירה מה-iframe
    window.addEventListener("message", (event) => {
        if (event.data.message === "closeTut" && autoModal) {
            autoModal.style.display = 'none';
        }
    });

    if (AFRAME.utils.device.isMobile()) {
        AFRAME.utils.device.requestFullscreen();
    }
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
    
        // בדיקה שיש event.data ו-message לפני השימוש בהם
        if (event.data && event.data.message) {
            if (event.data.message === "closeTut") {
                document.getElementById('autoModal').style.display = 'none';
                return; // חשוב! מונע המשך עיבוד של ההודעה
            }
    
            if (envMeterFill) {
                const validCloseMessages = ['closeCar', 'closeTable', 'closeMifal', 'closeMed', 'closeTree'];
                
                if (validCloseMessages.includes(event.data.message)) {
                    const currentHeight = parseFloat(getComputedStyle(envMeterFill).height);
                    const newHeight = currentHeight * 0.8;
                    envMeterFill.style.height = `${newHeight}px`;
                    
                    environmentalDrops++;
                    updateEnvMeterColor(envMeterFill);
                }
            }
        

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
                <strong>הפכתם את העולם לנקי יותר</strong>
            </h2>
            <p style="color: #34495e; font-size: 18px;">
                חפשו את השולחן ולחצו על הדו"ח סיכום
            </p>
        `;
        
        document.body.appendChild(messageDiv);
        
        // הצגת המחברת במרחב 360
        const notebookImage = document.getElementById('notebookImage');
        if (notebookImage) {
            notebookImage.setAttribute('visible', 'true');
        }

        // מעקב אחר לחיצה על המחברת
        const notebook = document.querySelector('#notebookImage');
        notebook.addEventListener('click', function() {
            messageDiv.remove(); // הסרת ההודעה כאשר לוחצים על המחברת
        });
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

// פונקציה מעודכנת לסימולציה למחוק
function simulateAllTasksCompleted() {
    // משנה את כל התמונות בבת אחת
    document.getElementById('hospitalImg').src = "img/hospitalV.png";
    document.getElementById('treesImg').src = "img/treesV.png";
    document.getElementById('mifalImg').src = "img/mifalV.png";
    document.getElementById('trafficImg').src = "img/trafficV.png";
    document.getElementById('energyImg').src = "img/energyV.png";
    
    // מציג את כל התמונות הנוספות
    document.getElementById('arubaGif').setAttribute('visible', 'true');
    document.getElementById('busImage').setAttribute('visible', 'true');
    document.getElementById('treesi').setAttribute('visible', 'true');
    document.getElementById('solarImage').setAttribute('visible', 'true');
    document.getElementById('airP').setAttribute('visible', 'true');
    const notebookImage = document.getElementById('notebookImage');
    if (notebookImage) {
        notebookImage.setAttribute('visible', 'true');
    }
    // הסרת האפשרות ללחוץ על הקוביות
    const boxes = document.querySelectorAll('a-box');
    boxes.forEach(box => {
        box.classList.remove('clickable');
        box.removeAttribute('onclick');
        box.removeAttribute('event-set__click');
    });

    // סימולציה של עדכון מד הסביבה
    const envMeterFill = document.querySelector('.env-meter-fill');
    if (envMeterFill) {
        // מעדכן את המד 5 פעמים (עבור כל משימה)
        for (let i = 0; i < 5; i++) {
            const currentHeight = parseFloat(getComputedStyle(envMeterFill).height);
            const newHeight = currentHeight * 0.8;
            envMeterFill.style.height = `${newHeight}px`;
            environmentalDrops++;
            updateEnvMeterColor(envMeterFill);
        }
    }

    // מפעיל את בדיקת השלמת המשימות
    all();
}
let secretClickCount = 0;
// הוסף כפתור נסתר ל-HTML (אופציונלי)
document.body.insertAdjacentHTML('beforeend', `
    <button 
        id="secretCompleteButton"
        style="position: fixed; 
               bottom: 10px; 
               right: 10px; 
               z-index: 9999; 
               opacity: 0; 
               width: 50px; 
               height: 50px; 
               cursor: default;
               background: transparent;
               border: none;">
    </button>
`);
document.getElementById('secretCompleteButton').addEventListener('click', function() {
    secretClickCount++;
    
    // מפעילים את הפונקציה רק אחרי 5 לחיצות
    if (secretClickCount === 5) {
        simulateAllTasksCompleted();
        secretClickCount = 0; // מאפסים את המונה
    }
});

function closeNotebookModal() {
    document.getElementById('summaryModal').style.display = 'none';
    
    // הוספת המחלקה clickable והאירועים לכל התמונות
    const images = [
        { id: 'arubaGif', type: 'powerplant' },
        { id: 'busImage', type: 'bus' },
        { id: 'treesi', type: 'forest' },
        { id: 'solarImage', type: 'solar' },
        { id: 'airP', type: 'air' }
    ];

    images.forEach(img => {
        const element = document.getElementById(img.id);
        if (element) {
            element.setAttribute('class', 'clickable');
            element.setAttribute('onclick', `showInfoModal('${img.type}')`);
            
            // אופציונלי: הוספת אפקט hover
            element.setAttribute('event-set__mouseenter', '_event: mouseenter; scale: 1.1 1.1 1');
            element.setAttribute('event-set__mouseleave', '_event: mouseleave; scale: 1 1 1');
        }
    });
}

// אם צריך לפתוח את המודל מבחוץ
function openNotebookModal() {
    document.getElementById('summaryModal').style.display = 'block';
}
const modalContent = {
    powerplant: {
        title: "תחנת הכוח - ארובת קיטור",
        points: [
            "במקום לשרוף דלקים מזהמים, תחנת הכוח עברה לשימוש באנרגיה נקייה",
            "הקיטור הלבן שאתם רואים הוא בעיקר אדי מים, בניגוד לעשן השחור המזהם"
        ]
    },
    forest: {
        title: "היער המשוקם",
        points: [
            "העצים החדשים שנשתלו מסייעים בטיהור האוויר",
            "בעלי החיים תורמים רבות לאיכות הסביבה"
        ]
    },
    bus: {
        title: "מערך התחבורה הציבורית",
        points: [
            "אוטובוס אחד יכול להחליף עשרות מכוניות פרטיות",
            "פחות כלי רכב = פחות זיהום אוויר"
        ]
    },
    air: {
        title: "מטהרי האוויר בבית החולים",
        points: [
            "שימוש במטהרי אוויר עוזר לשמור על אוויר נקי בתוך המבנים"
        ]
    },
    solar: {
        title: "תאים סולאריים במפעל",
        points: [
            "שימוש באנרגיית השמש במקום דלקים מזהמים",
            "אנרגיה נקייה ומתחדשת שאינה פוגעת בסביבה"
        ]
    }
};

function showInfoModal(type) {
    const modal = document.getElementById('infoModal');
    const title = document.getElementById('infoTitle');
    const content = document.getElementById('infoContent');
    const info = modalContent[type];
    
    title.textContent = info.title;
    
    content.innerHTML = info.points.map(point => `
        <div class="info-point">
            <span class="info-point-icon">•</span>
            <span>${point}</span>
        </div>
    `).join('');
    
    modal.style.display = 'block';
}

function closeInfoModal() {
    document.getElementById('infoModal').style.display = 'none';
}

// סגירת המודל בלחיצה מחוץ לתוכן
document.querySelector('.info-modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeInfoModal();
    }
});
// משתנה גלובלי לספירת הלחיצות על התמונות
let discoveredChanges = 0;
const totalChanges = 5;

// נעדכן את פונקציית closeNotebookModal
function closeNotebookModal() {
    document.getElementById('summaryModal').style.display = 'none';
    
    // הצגת המדליה והטקסט
    const medalProgress = document.getElementById('medalProgress');
    medalProgress.style.display = 'block';
    updateMedalProgress();

    // הוספת המחלקה clickable והאירועים לכל התמונות
    const images = [
        { id: 'arubaGif', type: 'powerplant' },
        { id: 'busImage', type: 'bus' },
        { id: 'treesi', type: 'forest' },
        { id: 'solarImage', type: 'solar' },
        { id: 'airP', type: 'air' }
    ];

    images.forEach(img => {
        const element = document.getElementById(img.id);
        if (element) {
            element.setAttribute('class', 'clickable');
            // עדכון ה-onclick כדי לעקוב אחרי הלחיצות
            element.setAttribute('onclick', `handleImageClick('${img.type}')`);
            element.setAttribute('event-set__mouseenter', '_event: mouseenter; scale: 1.1 1.1 1');
            element.setAttribute('event-set__mouseleave', '_event: mouseleave; scale: 1 1 1');
        }
    });
}

// פונקציה לטיפול בלחיצה על תמונה
function handleImageClick(type) {
    // מערך לשמירת התמונות שכבר נלחצו
    if (!window.clickedImages) {
        window.clickedImages = new Set();
    }

    // אם התמונה עוד לא נלחצה
    if (!window.clickedImages.has(type)) {
        window.clickedImages.add(type);
        discoveredChanges++;
        updateMedalProgress();
        
        // בדיקה אם הגענו ל-5 שינויים
        if (discoveredChanges === totalChanges) {
            makeMedalClickable();
        }
    }

    // הצגת המודל הרגיל
    showInfoModal(type);
}

// פונקציה לעדכון הטקסט והמדליה
function updateMedalProgress() {
    const progressText = document.getElementById('progressText');
    const remainingChanges = totalChanges - discoveredChanges;
    progressText.textContent = `עוד ${remainingChanges} שלבים למדליה`;

    const medalIcon = document.getElementById('medalIcon');
    if (discoveredChanges === totalChanges) {
        medalIcon.style.animation = 'medalGlow 2s infinite';
        progressText.textContent = 'לחצו לקבלת המדליה';
    }
}

// פונקציה להפיכת המדליה ללחיצה
// עדכון פונקציית makeMedalClickable
function makeMedalClickable() {
    const medalIcon = document.getElementById('medalIcon');
    const medalProgress = document.getElementById('medalProgress');
    
    // מגדילים את המדליה והטקסט
    medalIcon.style.fontSize = '4rem'; // הגדלת האייקון פי 2
    medalProgress.style.transform = 'translateX(-50%) scale(1.2)'; // הגדלת כל הקונטיינר
    
    medalIcon.style.cursor = 'pointer';
    // עדכון אנימציית הזוהר
    const style = document.createElement('style');
    style.textContent = `
        @keyframes medalGlow {
            0% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.2); filter: brightness(1.5) drop-shadow(0 0 10px gold); }
            100% { transform: scale(1); filter: brightness(1); }
        }
    `;
    document.head.appendChild(style);

    // הוספת האנימציה
    medalIcon.style.animation = 'medalGlow 2s infinite';
    
    // עדכון סגנונות נוספים לבליטות
    medalProgress.style.transition = 'all 0.5s ease';
    medalProgress.style.background = 'rgba(255, 255, 255, 0.95)';
    medalProgress.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2), 0 0 20px rgba(255, 215, 0, 0.5)';
    
    // עדכון הטקסט עם סגנון בולט יותר
    const progressText = document.getElementById('progressText');
    progressText.style.fontSize = '1.4rem';
    progressText.style.fontWeight = '700';
    progressText.style.color = '#FF8C00';
    progressText.textContent = 'לחץ על המדליה!';
}

// נעדכן גם את ה-HTML הראשוני של המדליה והטקסט
// (להוסיף את זה בתחילת הקוד או לעדכן את הקיים)
const medalProgressHTML = `
<div id="medalProgress" style="display: none; position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000;">
    <div style="display: flex; align-items: center; gap: 15px; background: rgba(255, 255, 255, 0.9); padding: 15px 30px; border-radius: 35px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); transition: all 0.5s ease;">
        <div id="medalIcon" style="font-size: 2rem; transition: all 0.5s ease;">🏅</div>
        <div id="progressText" style="font-family: 'Rubik', sans-serif; font-weight: 500; color: #2C5E1A; font-size: 1.2rem; transition: all 0.5s ease;"></div>
    </div>
</div>
`;
function showMedalModal() {
    const medalModal = document.createElement('div');
    medalModal.innerHTML = `
        <div class="medal-modal-overlay" style="display: block;">
            <div class="medal-modal">
                <div class="medal-header">
                    <h2>🏆 כל הכבוד!</h2>
                </div>
                <div class="medal-content">
                    <div class="success-animation">🌟</div>
                    <h3>סיימתם בהצלחה את כל המשימות!</h3>
                    <p>הוכחתם שאתם אלופים אמיתיים של איכות הסביבה.<br>
                    בזכותכם העולם יהיה מקום טוב יותר!</p>
                    <button class="next-btn" onclick="showRecommendationsModal()">
                        <span class="btn-icon">👉</span>
                        בואו נמשיך לשמור על העולם שלנו
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(medalModal);
}
function showRecommendationsModal() {
    // מסתיר את המודל הקודם
    document.querySelector('.medal-modal-overlay').style.display = 'none';
    
    const recommendationsModal = document.createElement('div');
    recommendationsModal.innerHTML = `
        <div class="recommendations-modal-overlay" style="display: block;">
            <div class="recommendations-modal">
                <div class="recommendations-header">
                    <h2>🌱 איך נשמור על העולם שלנו?</h2>
                </div>
                <div class="recommendations-content">
                    <p class="intro-text">אם כל אחד יעשה משהו קטן, ביחד נוכל לעשות שינוי גדול!</p>
                    
                    <div class="recommendations-grid">
                        <div class="recommendation-section">
                            <h3>🏫 בבית הספר</h3>
                            <ul>
                                <li>עידוד הגעה בהסעות משותפות</li>
                                <li>הליכה ברגל / רכיבה על אופניים לבית הספר</li>
                                <li>כיבוי אורות ומזגן כשיוצאים מהכיתה</li>
                                <li>הקמת גינה בית ספרית</li>
                            </ul>
                        </div>
                        
                        <div class="recommendation-section">
                            <h3>🏠 בבית</h3>
                            <ul>
                                <li>כיבוי מכשירי חשמל שלא בשימוש</li>
                                <li>שימוש בתחבורה ציבורית עם ההורים</li>
                                <li>שתילת צמחים במרפסת או בגינה</li>
                                <li>ממעטים להשתמש בכלים חד פעמיים</li>
                            </ul>
                        </div>
                        
                        <div class="recommendation-section">
                            <h3>👥 בקהילה</h3>
                            <ul>
                                <li>השתתפות במבצעי ניקיון</li>
                                <li>עידוד מחזור</li>
                                <li>הפצת המודעות בין חברים</li>
                                <li>רכישת בגדים יד שנייה</li>
                            </ul>
                        </div>
                        
                        <div class="recommendation-section">
                            <h3>👤 הרגלים אישיים</h3>
                            <ul>
                                <li>הליכה ברגל למקומות קרובים</li>
                                <li>שימוש בבקבוק רב-פעמי</li>
                                <li>הימנעות מצריכת מוצרים מיותרים</li>
                            </ul>
                        </div>
                    </div>

                    <button class="finish-btn" onclick="location.href='https://view.genially.com/66db8202d805be0a58831769';">
                        <span class="btn-icon">🏠</span>
                        התחילו מחדש
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(recommendationsModal);
}
const styles = `
    .medal-modal-overlay,
    .recommendations-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        z-index: 1000;
        backdrop-filter: blur(5px);
    }

    .medal-modal,
    .recommendations-modal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 800px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 20px;
        box-shadow: 0 0 30px rgba(104, 181, 80, 0.3);
        border: 2px solid #69B550;
        direction: rtl;
        font-family: 'Rubik', sans-serif;
    }

    .medal-header,
    .recommendations-header {
        background: #69B550;
        color: white;
        padding: 1.2rem;
        border-radius: 18px 18px 0 0;
        text-align: center;
    }

    .medal-content,
    .recommendations-content {
        padding: 2rem;
        text-align: center;
    }

    .success-animation {
        font-size: 4rem;
        margin: 1rem 0;
        animation: bounce 1s infinite;
    }

    .recommendations-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        margin: 2rem 0;
    }

    .recommendation-section {
        background: rgba(104, 181, 80, 0.1);
        padding: 1.5rem;
        border-radius: 12px;
        text-align: right;
    }

    .recommendation-section h3 {
        color: #2C5E1A;
        margin-bottom: 1rem;
        font-size: 1.3rem;
    }

    .recommendation-section ul {
        list-style: none;
        padding: 0;
    }

    .recommendation-section li {
        margin-bottom: 0.8rem;
        padding-right: 1.5rem;
        position: relative;
        font-size: 1.1rem;
    }

    .recommendation-section li:before {
        content: "•";
        color: #69B550;
        position: absolute;
        right: 0;
    }

    .next-btn,
    .finish-btn {
        background: #69B550;
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 25px;
        font-size: 1.2rem;
        font-weight: 500;
        cursor: pointer;
        margin-top: 2rem;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-family: 'Rubik', sans-serif;
    }

    .next-btn:hover,
    .finish-btn:hover {
        transform: scale(1.05);
        background: #5ca344;
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }

    @media (max-width: 768px) {
        .recommendations-grid {
            grid-template-columns: 1fr;
        }
    }
`;

// הוספת הסגנונות לדף
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// עדכון הפונקציה שמטפלת בלחיצה על המדליה
medalIcon.onclick = function() {
    if (discoveredChanges === totalChanges) {
        showMedalModal();
    }
};
