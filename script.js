/* ═══════════════════════════════════════════════
   SOCIAL CARDS
   Edit SOCIALS for your social platform links.
   Edit SUPPORT for donation / support links.
   Each entry: { "name", "image", "link", "color" }
═══════════════════════════════════════════════ */
const SOCIALS = [
    { name: "Discord", image: "discord.jpg", link: "https://discord.gg/fjNXpRHxhj", color: "#5865F2" },
    { name: "YouTube", image: "youtube.png", link: "https://www.youtube.com/@BFTGaming4U?sub_confirmation=1", color: "#FF0000" },
    { name: "Twitch", image: "twitch.png", link: "https://www.twitch.tv/bftgaming4u", color: "#9146FF" },
    { name: "TikTok", image: "tiktok.png", link: "https://www.tiktok.com/@discoverieswidfun", color: "#69C9D0" },
    { name: "Instagram", image: "instagram.png", link: "https://www.instagram.com/bftgaming4u/", color: "#E1306C" },
];

const SUPPORT = [
    { name: "Ko-fi", image: "kofi.png", link: "https://ko-fi.com/bftgaming4u", color: "#FF5E5B" },
    { name: "Throne", image: "throne.jpg", link: "https://throne.com/bftgaming4u", color: "#6e7af8" },
];

/* ── Card builder ─────────────────────────────── */
function buildCards(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    data.forEach((item, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.setProperty('--card-color', item.color || 'transparent');
        card.style.transitionDelay = `${i * 60}ms`;

        card.innerHTML = `
        <div class="card-img-wrap">
          <img
            src="assets/${item.image}"
            alt="${item.name}"
            loading="lazy"
            onerror="this.src='assets/${item.image.replace(/\.[^.]+$/, '.svg')}'; this.onerror=null;"
          >
        </div>
        <p>${item.name}</p>
        <span class="card-accent"></span>
      `;

        card.addEventListener('click', () => window.open(item.link, '_blank', 'noopener'));

        /* Keyboard accessible */
        card.setAttribute('role', 'link');
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.open(item.link, '_blank', 'noopener');
            }
        });

        container.appendChild(card);
    });
}

buildCards(SOCIALS, 'social-container');
buildCards(SUPPORT, 'support-container');

/* ── Staggered entrance ───────────────────────── */
if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card').forEach(c => obs.observe(c));
} else {
    document.querySelectorAll('.card').forEach(c => c.classList.add('visible'));
}


/* ═══════════════════════════════════════════════
   MUSIC TOGGLE
═══════════════════════════════════════════════ */
const music = document.getElementById('bg-music');
const toggle = document.getElementById('music-toggle');
const icon = document.getElementById('music-icon');
let playing = false;

toggle.addEventListener('click', () => {
    if (playing) {
        music.pause();
        icon.textContent = '🔇';
    } else {
        music.play().catch(() => { }); /* autoplay policy: silently fail */
        icon.textContent = '🔊';
    }
    playing = !playing;
});


/* ═══════════════════════════════════════════════
   PARTICLE BACKGROUND
═══════════════════════════════════════════════ */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let W, H, particles;

function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildParticles();
}

function buildParticles() {
    const count = Math.min(70, Math.floor((W * H) / 14000));
    particles = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.2,
    }));
}

resize();
window.addEventListener('resize', resize);

const COLORS = ['#38bdf8', '#38bdf8', '#38bdf8', '#818cf8', '#67e8f9'];

function animate() {
    ctx.clearRect(0, 0, W, H);

    const MAX_DIST = 130;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MAX_DIST) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(56,189,248,${0.12 * (1 - dist / MAX_DIST)})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }

    particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[idx % COLORS.length];
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
    });

    requestAnimationFrame(animate);
}

animate();