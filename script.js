// script.js - נעדכן את הלוגיקה של האודיו
document.addEventListener('DOMContentLoaded', function() {
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
});

// המשך הקוד הקיים
function closeModalOnClickOutside(event, modalId) {
    const modal = document.getElementById(modalId);
    if (event.target === modal) {
        modal.style.display = "none";
    }
}