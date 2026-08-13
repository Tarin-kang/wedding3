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
var isUserPaused = false;

function onYouTubeIframeAPIReady() {
    try {
        ytPlayer = new YT.Player('youtube-player-div', {
            height: '1',
            width: '1',
            videoId: 'QgaTQ5-XfMM',
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'disablekb': 1,
                'fs': 0,
                'loop': 1,
                'playlist': 'QgaTQ5-XfMM', // Required by YouTube for infinite looping
                'playsinline': 1,
                'rel': 0,
                'enablejsapi': 1
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
    } catch(e) {
        console.log("YT API Init fallback:", e);
    }
}

function onPlayerReady(event) {
    console.log("YouTube Player is ready");
    if (ytPlayer && typeof ytPlayer.setVolume === 'function') {
        ytPlayer.setVolume(100);
    }
}

function onPlayerStateChange(event) {
    // YT.PlayerState: ENDED (0), PLAYING (1), PAUSED (2), BUFFERING (3), CUED (5)
    if (event.data === YT.PlayerState.PLAYING) {
        isMusicPlaying = true;
        updateMusicUI(true);
    } else if (event.data === YT.PlayerState.ENDED) {
        // If ended, replay automatically from beginning!
        if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
            ytPlayer.seekTo(0);
            ytPlayer.playVideo();
        }
    } else if (event.data === YT.PlayerState.PAUSED) {
        // If unexpectedly paused (e.g. background throttling), auto-resume if user hasn't paused manually!
        if (isMusicPlaying && !isUserPaused) {
            setTimeout(function() {
                if (isMusicPlaying && !isUserPaused && ytPlayer && typeof ytPlayer.playVideo === 'function') {
                    ytPlayer.playVideo();
                }
            }, 500);
        } else {
            isMusicPlaying = false;
            updateMusicUI(false);
        }
    }
}

function onPlayerError(event) {
    console.log("YT Error code:", event.data);
    if (isMusicPlaying && window.startAmbientSynth) {
        window.startAmbientSynth();
    }
}

window.playYouTubeMusic = function() {
    isUserPaused = false;
    isMusicPlaying = true;
    updateMusicUI(true);

    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        try {
            if (typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
            if (typeof ytPlayer.setVolume === 'function') ytPlayer.setVolume(100);
            ytPlayer.playVideo();
        } catch (e) {
            console.log("YT Player play error:", e);
        }
    }
window.openWeddingCard = function() {
    var overlay = document.getElementById('cover-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        overlay.classList.add('opened');
    }
    document.body.style.overflow = 'auto';
    document.body.classList.add('card-opened');

    var controlBar = document.getElementById('audio-control-bar');
    if (controlBar) controlBar.classList.remove('hidden');

    if (window.playYouTubeMusic) {
        try { window.playYouTubeMusic(); } catch(e){}
    }

    if (window.triggerConfetti) {
        try { window.triggerConfetti(); } catch(e){}
    }
};

window.toggleYouTubeMusic = function() {
    if (isMusicPlaying) {
        isUserPaused = true;
        isMusicPlaying = false;
        updateMusicUI(false);
        if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
            try { ytPlayer.pauseVideo(); } catch(e) {}
        }
        if (window.stopAmbientSynth) window.stopAmbientSynth();
    } else {
        isUserPaused = false;
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

    // --------------------------------------------------------------------------
    // 6. Ambient Piano Fallback Setup
    // --------------------------------------------------------------------------
    setupAmbientSynth();
});

// --------------------------------------------------------------------------
// 2. Animated Running White Cat Engine (น้องแมวขาว 🐱🤍)
// --------------------------------------------------------------------------
function initRunningCatWishes() {
    const catCharacter = document.getElementById('catCharacter');
    const catBubble = document.getElementById('catBubble');
    const catBodyFlip = document.querySelector('.cat-body-flip');
    
    const catMessages = [
        "ยินดีกับพี่วรังค์และพี่ธารินทร์ด้วยนะคะ 💕",
        "ขอให้ครองรักกันยาวนาน 1000 ปี ✨",
        "มีความสุขมากๆ สมหวังในทุกเรื่องครับ 🎉",
        "ขอให้มีเบบี้ไวๆ น้าา 👶",
        "เจ้าบ่าวเจ้าสาวน่ารักมากๆ ครับ 💖",
        "Meow~ 🤍",
        "ยินดีต้อนรับนะคะ! 🐾",
        "ขอให้เป็นวันที่ดีค่ะ ✨",
        "รักน้าา~ 💕"
    ];

    let catPauseTimer = null;
    let catClickCount = 0;
    let catFastTimer = null;
    let lastCatInteractTime = 0;
    let autoRotateInterval = null;

    if (catCharacter && catBubble) {
        const handleCatInteract = (e) => {
            if (e) {
                if (e.cancelable) e.preventDefault();
                e.stopPropagation();
            }

            const nowTime = Date.now();
            if (nowTime - lastCatInteractTime < 220) return;
            lastCatInteractTime = nowTime;

            // 1. Play Meow Sounds (Synthesized Web Audio + Audio File Fallback)
            playSynthesizedMeow();
            if (window.playCatSound) window.playCatSound();

            // 2. Count Clicks
            catClickCount++;

            // 3. Every 3 clicks -> Jump Prep + High Speed Sprint!
            if (catClickCount % 3 === 0) {
                catBubble.textContent = "ย่อตัวกระโดด... ซิ่งเลย! 💨🐱⚡";
                catBubble.style.animation = 'none';
                void catBubble.offsetWidth;
                catBubble.style.animation = 'catBubblePulse 0.5s ease';

                catCharacter.classList.remove('paused');
                if (catBodyFlip) catBodyFlip.classList.remove('paused');
                if (catBodyFlip) catBodyFlip.classList.add('jump-prep');
                spawnCatHeartParticles(catCharacter);

                setTimeout(() => {
                    if (catBodyFlip) catBodyFlip.classList.remove('jump-prep');
                    catCharacter.classList.add('fast-speed');
                    if (catBodyFlip) catBodyFlip.classList.add('fast-speed');

                    if (catFastTimer) clearTimeout(catFastTimer);
                    catFastTimer = setTimeout(() => {
                        catCharacter.classList.remove('fast-speed');
                        if (catBodyFlip) catBodyFlip.classList.remove('fast-speed');
                    }, 2500);
                }, 450);

                return;
            }

            // 4. Normal Click -> Pause 2.5s + Random Wish Speech
            catCharacter.classList.add('paused');
            if (catBodyFlip) catBodyFlip.classList.add('paused');

            const randomMsg = catMessages[Math.floor(Math.random() * catMessages.length)];
            catBubble.textContent = randomMsg;
            catBubble.style.animation = 'none';
            void catBubble.offsetWidth;
            catBubble.style.animation = 'catBubblePulse 0.5s ease';

            spawnCatHeartParticles(catCharacter);

            if (catPauseTimer) clearTimeout(catPauseTimer);
            catPauseTimer = setTimeout(() => {
                catCharacter.classList.remove('paused');
                if (catBodyFlip) catBodyFlip.classList.remove('paused');
            }, 2500);
        };

        catCharacter.addEventListener('click', handleCatInteract);
        catCharacter.addEventListener('touchstart', handleCatInteract, { passive: false });

        // Auto rotate wishes when idling
        let wishIndex = 0;
        autoRotateInterval = setInterval(() => {
            if (catCharacter.classList.contains('paused')) return;
            wishIndex = (wishIndex + 1) % catMessages.length;
            catBubble.style.opacity = '0';
            setTimeout(() => {
                catBubble.textContent = catMessages[wishIndex];
                catBubble.style.opacity = '1';
            }, 300);
        }, 4500);
    }
}

// Web Audio API Synthesized Meow Sound
function playSynthesizedMeow() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const now = ctx.currentTime;
        
        // Cat Meow Pitch Envelope: 700Hz -> 1150Hz -> 450Hz
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(1150, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.45);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.5);
    } catch (e) {
        console.log('Synth meow error:', e);
    }
}

// Floating Heart & Star Particle Generator around Cat
function spawnCatHeartParticles(el) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const particles = ['💖', '🐾', '✨', '🌸', '🤍'];
    for (let i = 0; i < 5; i++) {
        const p = document.createElement('span');
        p.textContent = particles[Math.floor(Math.random() * particles.length)];
        p.style.position = 'fixed';
        p.style.left = (rect.left + 20 + Math.random() * 30) + 'px';
        p.style.top = (rect.top - 10 + Math.random() * 20) + 'px';
        p.style.fontSize = '1.2rem';
        p.style.pointerEvents = 'none';
        p.style.zIndex = '10002';
        p.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
        document.body.appendChild(p);

        requestAnimationFrame(() => {
            p.style.transform = `translate(${(Math.random() - 0.5) * 60}px, -${40 + Math.random() * 40}px) scale(1.3)`;
            p.style.opacity = '0';
        });

        setTimeout(() => p.remove(), 1000);
    }
}

// --------------------------------------------------------------------------
// Copy Account Number to Clipboard
// --------------------------------------------------------------------------
function copyAccountNo() {
    const accEl = document.getElementById('accountNo');
    const toast = document.getElementById('copyToast');

    if (!accEl) return;
    const textToCopy = accEl.innerText.replace(/-/g, '');

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            if (toast) {
                toast.classList.add('show');
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 2500);
            }
        }).catch(err => {
            console.log('Copy failed:', err);
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        if (toast) {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
        }
    }
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
    { name: "คุณแม่เจ๊ชิง & เฮียฟู่", count: "2 ท่าน", text: "ยินดีกับลูกๆ ทั้งสองคนมากๆ ขอให้ครองคู่กันด้วยความรัก ความเข้าใจ และมีความสุขตลอดไปจ้า", time: "14 ส.ค. 2026" },
    { name: "เพื่อนเจ้าสาว", count: "1 ท่าน", text: "กรี๊ดดดด ยินดีด้วยนะแป้ง&ธารินทร์! เจ้าสาวสวยมากกกก ตื่นเต้นวันงานแล้ว!", time: "14 ส.ค. 2026" },
    { name: "กลุ่มเพื่อน ม.ปลาย", count: "4 ท่าน", text: "ขอให้ทั้งคู่มีความสุขมากๆ ครองรักกันยั่งยืนมีตัวเล็กไวๆ น้า!", time: "14 ส.ค. 2026" }
];

function loadWishes() {
    const container = document.getElementById('wishes-list');
    if (!container) return;

    let stored = localStorage.getItem('wt_wedding_wishes');
    let list = stored ? JSON.parse(stored) : defaultWishes;

    container.innerHTML = list.map(item => `
        <div class="wish-card">
            <div class="wish-author">
                <i class="fas fa-user-circle"></i> ${escapeHtml(item.name)}
                ${item.count ? `<span class="wish-guest-count-badge">👥 ${escapeHtml(item.count)}</span>` : ''}
            </div>
            <div class="wish-text">${escapeHtml(item.text)}</div>
            <div class="wish-time">${item.time}</div>
        </div>
    `).join('');
}

function submitWish(event) {
    event.preventDefault();
    const nameInput = document.getElementById('guest-name');
    const countInput = document.getElementById('guest-count');
    const msgInput = document.getElementById('guest-message');

    if (!nameInput || !msgInput) return;

    const name = nameInput.value.trim();
    const count = countInput ? countInput.value : '';
    const message = msgInput.value.trim();

    if (!name || !message) return;

    const nowStr = new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });

    let stored = localStorage.getItem('wt_wedding_wishes');
    let list = stored ? JSON.parse(stored) : [...defaultWishes];

    list.unshift({ name: name, count: count, text: message, time: nowStr });
    localStorage.setItem('wt_wedding_wishes', JSON.stringify(list));

    loadWishes();

    nameInput.value = '';
    if (countInput) countInput.selectedIndex = 0;
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
// 3. Falling Petals Canvas Effect
// --------------------------------------------------------------------------
function initFallingPetals() {
    const canvas = document.getElementById('petalsCanvas') || document.getElementById('petals-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    let petals = [];
    let animationFrameId = null;
    class Petal {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * -canvas.height;
            this.size = Math.random() * 8 + 6;
            this.speedY = Math.random() * 1.2 + 0.6;
            this.speedX = Math.random() * 0.6 - 0.3;
            this.rotation = Math.random() * 360;
            this.rotSpeed = Math.random() * 1.5 - 0.75;
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.01) + this.speedX;
            this.rotation += this.rotSpeed;
            if (this.y > canvas.height + 20) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#9caf88'; // สีกลีบดอกไม้เขียวเซจอ่อน
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size, -this.size / 2, -this.size, this.size, 0, this.size * 1.5);
            ctx.bezierCurveTo(this.size, this.size, this.size, -this.size / 2, 0, 0);
            ctx.fill();
            ctx.restore();
        }
    }
    // สร้างกลีบดอกไม้ 28 กลีบ
    petals = Array.from({ length: 28 }, () => new Petal());
    function renderPetals() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(p => {
            p.update();
            p.draw();
        });
        animationFrameId = requestAnimationFrame(renderPetals);
    }
    
    renderPetals(); // เริ่มทำงานอนิเมชันกลีบดอกไม้ลอยล่อง
}

// --------------------------------------------------------------------------
// Ambient Piano Audio Fallback Engine
// --------------------------------------------------------------------------
let synthCtx = null;
let synthInterval = null;

function setupAmbientSynth() {
    window.startAmbientSynth = function() {
        if (!synthCtx) {
            synthCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (synthCtx.state === 'suspended') {
            synthCtx.resume();
        }
        if (synthInterval) clearInterval(synthInterval);

        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 392.00];
        let idx = 0;

        synthInterval = setInterval(() => {
            if (!isMusicPlaying || isUserPaused) return;
            playPianoTone(notes[idx % notes.length]);
            idx++;
        }, 1100);
    };

    window.stopAmbientSynth = function() {
        if (synthInterval) clearInterval(synthInterval);
    };

    function playPianoTone(freq) {
        if (!synthCtx) return;
        const osc = synthCtx.createOscillator();
        const gain = synthCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, synthCtx.currentTime);

        gain.gain.setValueAtTime(0, synthCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.06, synthCtx.currentTime + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, synthCtx.currentTime + 2.4);

        osc.connect(gain);
        gain.connect(synthCtx.destination);

        osc.start();
        osc.stop(synthCtx.currentTime + 2.5);
    }
}
