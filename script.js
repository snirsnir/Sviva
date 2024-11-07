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
            // שמור את מיקום הגלילה הנוכחי
            const scrollY = window.scrollY;
            html.style.top = `-${scrollY}px`;
            
            html.classList.add('modal-open');
            body.classList.add('modal-open');

            // הוסף מאזינים לכל אירועי הגלילה
            scrollEvents.forEach(event => {
                window.addEventListener(event, preventScroll, { passive: false });
            });
        } else {
            // הסר את כל המאזינים
            scrollEvents.forEach(event => {
                window.removeEventListener(event, preventScroll);
            });

            // שחזר את מיקום הגלילה
            html.classList.remove('modal-open');
            body.classList.remove('modal-open');
            
            const scrollY = parseInt(html.style.top || '0') * -1;
            html.style.top = '';
            window.scrollTo(0, scrollY);
        }
    }

    // עדכון פתיחת המודל האוטומטי
    setTimeout(() => {
        document.getElementById('autoModal').style.display = 'block';
        toggleModalState(true);
    }, 3000);

    // עדכון כפתור העזרה
    const helpButton = document.getElementById('helpButton');
    helpButton.addEventListener('click', function() {
        const autoModal = document.getElementById('autoModal');
        const modalIframe = autoModal.querySelector('iframe');
        modalIframe.src = modalIframe.src;
        autoModal.style.display = 'block';
        toggleModalState(true);
    });

    // הוסף את הטיפול בהודעת הסגירה
    window.addEventListener("message", (event) => {
        if (event.data.message === "closeTut") {
            document.getElementById('autoModal').style.display = 'none';
            toggleModalState(false);
        }
    });

    // מנע גלילה גם על אלמנט ה-body עצמו
    document.body.addEventListener('wheel', preventScroll, { passive: false });
    document.body.addEventListener('touchmove', preventScroll, { passive: false });
});


    // פתיחה אוטומטית של המודל בטעינה ראשונית
    setTimeout(() => {
        document.getElementById('autoModal').style.display = 'block';
    }, 3000);

    const audioToggle = document.getElementById('audioToggle');
    const audio = document.getElementById('bgAudio');
    let isPlaying = true; // מתחילים עם מצב מופעל

    // פונקציה להפעלת האודיו
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

    // פונקציה לעדכון הכפתור
    function updateButtonState() {
        const icon = audioToggle.querySelector('.audio-icon');
        icon.textContent = isPlaying ? '🔊' : '🔇';
        audioToggle.classList.toggle('muted', !isPlaying);
    }

    // ניסיון להפעיל אוטומטית בטעינה
    playAudio();

    // הפעלה אוטומטית בכל אינטראקציה של המשתמש עם העמוד
    document.addEventListener('click', function() {
        if (!isPlaying) {
            playAudio();
        }
    }, { once: true }); // רק פעם אחת

    // טיפול בלחיצה על הכפתור
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

    // טיפול במקרה שהאודיו נגמר
    audio.addEventListener('ended', function() {
        if (!audio.loop) {
            isPlaying = false;
            updateButtonState();
        }
    });

    // ניסיון נוסף להפעיל את האודיו באירועי משתמש שונים
    const userActions = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    userActions.forEach(action => {
        document.addEventListener(action, function() {
            if (!isPlaying) {
                playAudio();
            }
        }, { once: true });
    });


// המשך הקוד הקיים
function closeModalOnClickOutside(event, modalId) {
    const modal = document.getElementById(modalId);
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
window.addEventListener("message", (event) => {
    if (event.data.message === "closeTut") {
        document.getElementById('autoModal').style.display = 'none';
    }
})
const modalChannel = new BroadcastChannel("modalChannel");

// האזנה להודעות מהערוץ
modalChannel.onmessage = (event) => {
  if (event.data === "closeModal") {
    const elecModal = document.getElementById("powerModal");
    if (elecModal) {
        elecModal.style.display = "none"; // סגירת המודל
      console.log("powerModal has been closed.");
    }
  }
};
