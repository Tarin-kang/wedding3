/**
 * Warangkana & Tarin Wedding Invitation - Interactive Engine
 */

// --------------------------------------------------------------------------
// Global YouTube IFrame Player State
// Video: "Christina Perri - A Thousand Years (Piano & Cello Cover) - The Piano Guys"
// Video ID: QgaTQ5-XfMM
// --------------------------------------------------------------------------
var ytPlayer = null;
var isMusicPlaying = false;

function onYouTubeIframeAPIReady() {
    try {
        ytPlayer = new YT.Player('youtube-player-iframe', {
            events: {
                'onReady': function() {
                    console.log("YouTube Player is ready");
                },
                'onStateChange': function(event) {
                    if (event.data === YT.PlayerState.PLAYING) {
                        isMusicPlaying = true;
                        updateMusicUI(true);
                    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
                        isMusicPlaying = false;
                        updateMusicUI(false);
                    }
                }
            }
        });
    } catch(e) {
        console.log("YT API Init fallback:", e);
    }
}

window.playYouTubeMusic = function() {
    isMusicPlaying = true;
    updateMusicUI(true);

    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        try {
            ytPlayer.playVideo();
            if (typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
        } catch (e) {
            console.log("YT Player API play fallback", e);
        }
    }
    
    // PostMessage fallback for Mobile (iOS Safari / Android Chrome / In-app browsers)
    var iframe = document.getElementById('youtube-player-iframe');
    if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        iframe.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
    }
};

window.toggleYouTubeMusic = function() {
    if (isMusicPlaying) {
        isMusicPlaying = false;
        updateMusicUI(false);
        if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
            try { ytPlayer.pauseVideo(); } catch(e) {}
        }
        var iframe = document.getElementById('youtube-player-iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
    } else {
        window.playYouTubeMusic();
    }
};

function updateMusicUI(playing) {
    const musicBtn = document.getElementById('music-toggle-btn');
    const label = document.getElementById('music-label');
    const icon = document.getElementById('music-icon');

    if (musicBtn) {
        if (playing) {
            musicBtn.classList.add('playing');
            if (label) label.innerText = 'ปิดเสียงเพลงบรรยากาศ';
            if (icon) icon.className = 'fas fa-volume-up';
        } else {
            musicBtn.classList.remove('playing');
            if (label) label.innerText = 'เล่นเพลงบรรยากาศ';
            if (icon) icon.className = 'fas fa-music';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    // --------------------------------------------------------------------------
    // 1. Countdown Timer (Target: 12 Dec 2026 15:00:00)
    // --------------------------------------------------------------------------
    const targetDate = new Date('2026-12-12T15:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            const dEl = document.getElementById('days');
            const hEl = document.getElementById('hours');
            const mEl = document.getElementById('minutes');
            const sEl = document.getElementById('seconds');

            if (dEl) dEl.innerText = days < 10 ? '0' + days : days;
            if (hEl) hEl.innerText = hours < 10 ? '0' + hours : hours;
            if (mEl) mEl.innerText = minutes < 10 ? '0' + minutes : minutes;
            if (sEl) sEl.innerText = seconds < 10 ? '0' + seconds : seconds;
        } else {
            const dEl = document.getElementById('days');
            const hEl = document.getElementById('hours');
            const mEl = document.getElementById('minutes');
            const sEl = document.getElementById('seconds');

            if (dEl) dEl.innerText = '00';
            if (hEl) hEl.innerText = '00';
            if (mEl) mEl.innerText = '00';
            if (sEl) sEl.innerText = '00';
        }
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --------------------------------------------------------------------------
    // 2. Running Cat Speech Bubble Rotator Engine
    // --------------------------------------------------------------------------
    initRunningCatWishes();

    // --------------------------------------------------------------------------
    // 3. Falling Petals Canvas Effect
    // --------------------------------------------------------------------------
    initFallingPetals();

    // --------------------------------------------------------------------------
    // 4. Scroll Reveal Animation
    // --------------------------------------------------------------------------
    initScrollReveal();

    // --------------------------------------------------------------------------
    // 5. Load Guest Wishes
    // --------------------------------------------------------------------------
    loadWishes();
});

// --------------------------------------------------------------------------
// Running Cat Wish Rotator Engine
// --------------------------------------------------------------------------
function initRunningCatWishes() {
    const catWishes = [
        "ยินดีกับพี่วรังค์และพี่ธารินทร์ด้วยนะคะ 💕",
        "ขอให้ครองรักกันยาวนาน 1000 ปี ✨",
        "มีความสุขมากๆ สมหวังในทุกเรื่องครับ 🎉",
        "ขอให้มีเบบี้ไวๆ น้าา 👶",
        "เจ้าบ่าวเจ้าสาวน่ารักมากๆ ครับ 💖"
    ];

    let currentWishIndex = 0;
    const bubbleEl = document.getElementById('cat-speech-bubble');

    if (!bubbleEl) return;

    setInterval(() => {
        currentWishIndex = (currentWishIndex + 1) % catWishes.length;
        bubbleEl.style.opacity = '0';
        setTimeout(() => {
            bubbleEl.innerText = catWishes[currentWishIndex];
            bubbleEl.style.opacity = '1';
        }, 400);
    }, 4500);
}

// --------------------------------------------------------------------------
// Color Swatch Selection Handler
// --------------------------------------------------------------------------
function selectSwatch(element) {
    const swatches = document.querySelectorAll('.swatch');
    swatches.forEach(s => s.classList.remove('selected'));
    
    element.classList.add('selected');
    const name = element.getAttribute('data-name');
    const hex = element.getAttribute('data-hex');
    
    const infoEl = document.getElementById('swatch-info');
    if (infoEl) {
        infoEl.style.opacity = '0';
        setTimeout(() => {
            infoEl.innerHTML = `โทนสีที่เลือก: <strong>${name}</strong> (${hex})`;
            infoEl.style.opacity = '1';
        }, 150);
    }
}

// --------------------------------------------------------------------------
// QR Code Lightbox Modal
// --------------------------------------------------------------------------
function openQrModal() {
    const modal = document.getElementById('qr-modal');
    if (modal) modal.classList.add('active');
}

function closeQrModal() {
    const modal = document.getElementById('qr-modal');
    if (modal) modal.classList.remove('active');
}

// --------------------------------------------------------------------------
// Add to Calendar Function (.ics / Google Calendar)
// --------------------------------------------------------------------------
function addToCalendar() {
    const title = encodeURIComponent('งานมงคลสมรส Warangkana & Tarin');
    const details = encodeURIComponent('ขอเชิญร่วมงานมงคลสมรส วรังคณา & ธารินทร์ ณ โกดังเจ๊ชิง & เฮียฟู่');
    const location = encodeURIComponent('โกดังเจ๊ชิง & เฮียฟู่');
    const startTime = '20261212T080000Z'; // UTC time equivalent to 15:00 ICT
    const endTime = '20261212T140000Z';   // UTC time equivalent to 21:00 ICT

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
    
    window.open(googleCalendarUrl, '_blank');
}

// --------------------------------------------------------------------------
// Best Wishes / Interactive Guestbook System
// --------------------------------------------------------------------------
const defaultWishes = [
    { name: "คุณแม่เจ๊ชิง & เฮียฟู่", text: "ยินดีกับลูกๆ ทั้งสองคนมากๆ ขอให้ครองคู่กันด้วยความรัก ความเข้าใจ และมีความสุขตลอดไปจ้า", time: "14 ส.ค. 2026" },
    { name: "เพื่อนเจ้าสาว", text: "กรี๊ดดดด ยินดีด้วยนะแป้ง&ธารินทร์! เจ้าสาวสวยมากกกก ตื่นเต้นวันงานแล้ว!", time: "14 ส.ค. 2026" },
    { name: "กลุ่มเพื่อน ม.ปลาย", text: "ขอให้ทั้งคู่มีความสุขมากๆ ครองรักกันยั่งยืนมีตัวเล็กไวๆ น้า!", time: "14 ส.ค. 2026" }
];

function loadWishes() {
    const container = document.getElementById('wishes-list');
    if (!container) return;

    let stored = localStorage.getItem('wt_wedding_wishes');
    let list = stored ? JSON.parse(stored) : defaultWishes;

    container.innerHTML = list.map(item => `
        <div class="wish-card">
            <div class="wish-author"><i class="fas fa-user-circle"></i> ${escapeHtml(item.name)}</div>
            <div class="wish-text">${escapeHtml(item.text)}</div>
            <div class="wish-time">${item.time}</div>
        </div>
    `).join('');
}

function submitWish(event) {
    event.preventDefault();
    const nameInput = document.getElementById('guest-name');
    const msgInput = document.getElementById('guest-message');

    if (!nameInput || !msgInput) return;

    const name = nameInput.value.trim();
    const message = msgInput.value.trim();

    if (!name || !message) return;

    const nowStr = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });

    let stored = localStorage.getItem('wt_wedding_wishes');
    let list = stored ? JSON.parse(stored) : [...defaultWishes];

    list.unshift({ name: name, text: message, time: nowStr });
    localStorage.setItem('wt_wedding_wishes', JSON.stringify(list));

    loadWishes();

    nameInput.value = '';
    msgInput.value = '';

    if (window.confetti) {
        window.confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 }
        });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

// --------------------------------------------------------------------------
// Confetti Animation Trigger
// --------------------------------------------------------------------------
window.triggerConfetti = function() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#8a9a86', '#b5c0b3', '#d2b48c', '#ffffff']
        });
    }
};

// --------------------------------------------------------------------------
// Scroll Reveal Observer
// --------------------------------------------------------------------------
function initScrollReveal() {
    const elements = document.querySelectorAll('.fade-in');
    if (!('IntersectionObserver' in window)) {
        elements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
}

// --------------------------------------------------------------------------
// Falling Petals Canvas Engine
// --------------------------------------------------------------------------
function initFallingPetals() {
    const canvas = document.getElementById('petals-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const petalColors = ['rgba(138, 154, 134, 0.4)', 'rgba(181, 192, 179, 0.4)', 'rgba(210, 180, 140, 0.4)', 'rgba(200, 211, 197, 0.5)'];
    const petals = [];
    const petalCount = 20;

    for (let i = 0; i < petalCount; i++) {
        petals.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 8 + 6,
            speedY: Math.random() * 0.8 + 0.3,
            speedX: Math.random() * 0.6 - 0.3,
            rotation: Math.random() * 360,
            rotSpeed: Math.random() * 1 - 0.5,
            color: petalColors[Math.floor(Math.random() * petalColors.length)]
        });
    }

    function animatePetals() {
        ctx.clearRect(0, 0, width, height);

        petals.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotSpeed;

            if (p.y > height) {
                p.y = -10;
                p.x = Math.random() * width;
            }
            if (p.x > width) p.x = 0;
            if (p.x < 0) p.x = width;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        requestAnimationFrame(animatePetals);
    }

    animatePetals();
}
