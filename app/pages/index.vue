<template>
  <main class="root">

    <!-- NAV -->
    <nav class="nav">
      <span class="nav-logo">Sober.<span class="cyan">Spend</span></span>
      <span class="nav-tag">HS 4.0 Hackathon</span>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-badge">✦ AI-POWERED FINANCE APP</div>
      <h1 class="hero-title">
        STOP<br />
        SPENDING<br />
        LIKE<br />
        <span class="cyan">YOU'RE RICH.</span>
      </h1>
      <p class="hero-sub">
        AI-powered UPI payment interceptor. See your risk score <em>before</em> you tap pay.
      </p>
    </section>

    <!-- 3 CTA CARDS -->
    <section class="cta-section">
      <div class="cta-grid">

        <!-- 1. DOWNLOAD PPT -->
        <a href="/SoberSpend-Presentation.pptx" download class="cta-card" style="background: #DFFF00; color:#111;">
          <div class="cta-icon">📊</div>
          <div class="cta-content">
            <div class="cta-title">PRESENTATION</div>
            <div class="cta-body">Download our full project pitch deck</div>
          </div>
          <div class="cta-arrow">↓</div>
        </a>

        <!-- 2. VIEW VIDEO -->
        <button class="cta-card" style="background:#00FFFF; color:#111; border:none; cursor:pointer; text-align:left;"
          @click="showVideo = true">
          <div class="cta-icon">▶</div>
          <div class="cta-content">
            <div class="cta-title">DEMO VIDEO</div>
            <div class="cta-body">Watch SoberSpend in action</div>
          </div>
          <div class="cta-arrow">↗</div>
        </button>

        <!-- 3. DOWNLOAD APK -->
        <a href="/SoberSpend.apk" download class="cta-card" style="background:#FF85A2; color:#111;">
          <div class="cta-icon">📱</div>
          <div class="cta-content">
            <div class="cta-title">ANDROID APK</div>
            <div class="cta-body">Install & try the app right now</div>
          </div>
          <div class="cta-arrow">↓</div>
        </a>

      </div>
    </section>

    <!-- RISK BADGES (visual flair) -->
    <section class="risk-section">
      <p class="risk-label">YOUR RISK LEVEL RIGHT NOW:</p>
      <div class="risk-strip">
        <span class="risk-tag broke">BROKE</span>
        <span class="risk-tag danger">DANGER</span>
        <span class="risk-tag wasted">WASTED</span>
        <span class="risk-tag warning">WARNING</span>
        <span class="risk-tag sus">SUS</span>
        <span class="risk-tag safe">SAFE</span>
        <span class="risk-tag chill">CHILL</span>
      </div>
    </section>

    <!-- VIDEO MODAL -->
    <Teleport to="body">
      <div v-if="showVideo" class="modal-overlay" @click.self="showVideo = false">
        <div class="modal-box">
          <button class="modal-close" @click="showVideo = false">✕ CLOSE</button>
          <div class="video-placeholder">
            <div class="video-inner">
              <!-- Replace src below with the actual demo video embed URL -->
              <iframe width="100%" height="100%" :src="videoSrc" title="SoberSpend Demo" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen />
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- FOOTER -->
    <footer class="footer">
      <span class="nav-logo">Sober.<span class="cyan">Spend</span></span>
      <span class="footer-sub">Team SoberSpend · HS 4.0 Hackathon · {{ new Date().getFullYear() }}</span>
    </footer>

  </main>
</template>

<script setup lang="ts">
const showVideo = ref(false)

// 👇 Replace this with your actual YouTube embed URL or direct video URL
const videoSrc = 'https://www.youtube.com/embed/dQw4w9WgXcQ'

useHead({
  title: 'SoberSpend — Stop Spending Like You\'re Rich',
  meta: [
    { name: 'description', content: 'AI-powered UPI payment interceptor. See your risk score before you pay.' },
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Bebas+Neue&display=swap' },
  ]
})
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --black: #0A0A0A;
  --surface: #111111;
  --white: #F5F5F5;
  --cyan: #00FFFF;
  --yellow: #DFFF00;
  --pink: #FF85A2;
  --font-display: 'Bebas Neue', sans-serif;
  --font-body: 'Space Grotesk', sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--black);
  color: var(--white);
  font-family: var(--font-body);
  min-height: 100vh;
}

.cyan {
  color: var(--cyan);
}

/* NAV */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 48px;
  border-bottom: 2px solid #1A1A1A;
}

.nav-logo {
  font-family: var(--font-display);
  font-size: 28px;
  letter-spacing: 1px;
}

.nav-tag {
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #555;
  border: 1px solid #222;
  padding: 6px 14px;
  border-radius: 999px;
}

/* HERO */
.hero {
  padding: 80px 48px 48px;
  max-width: 900px;
}

.hero-badge {
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--cyan);
  border: 1px solid var(--cyan);
  padding: 6px 16px;
  border-radius: 999px;
  display: inline-block;
  margin-bottom: 28px;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(72px, 10vw, 160px);
  line-height: 0.9;
  margin-bottom: 28px;
}

.hero-sub {
  font-size: 18px;
  color: #777;
  line-height: 1.7;
}

/* 3 CTA CARDS */
.cta-section {
  padding: 48px 48px 64px;
}

.cta-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1000px;
}

.cta-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 36px 28px;
  border: 3px solid #000;
  box-shadow: 5px 5px 0 #000;
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
  font-family: inherit;
}

.cta-card:hover {
  transform: translate(-3px, -3px);
  box-shadow: 8px 8px 0 #000;
}

.cta-icon {
  font-size: 40px;
}

.cta-content {
  flex: 1;
}

.cta-title {
  font-family: var(--font-display);
  font-size: 28px;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.cta-body {
  font-size: 14px;
  opacity: 0.7;
  line-height: 1.5;
  font-weight: 500;
}

.cta-arrow {
  font-family: var(--font-display);
  font-size: 36px;
}

/* RISK SECTION */
.risk-section {
  padding: 0 48px 80px;
}

.risk-label {
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #444;
  margin-bottom: 16px;
}

.risk-strip {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.risk-tag {
  padding: 8px 20px;
  font-family: var(--font-display);
  font-size: 18px;
  letter-spacing: 1px;
  border: 2px solid #000;
  box-shadow: 3px 3px 0 #000;
}

.risk-tag.broke {
  background: #FF1A1A;
  color: #fff;
}

.risk-tag.danger {
  background: #FF4444;
  color: #fff;
}

.risk-tag.wasted {
  background: #FF85A2;
  color: #111;
}

.risk-tag.warning {
  background: #FF9944;
  color: #111;
}

.risk-tag.sus {
  background: #DFFF00;
  color: #111;
}

.risk-tag.safe {
  background: #44FF88;
  color: #111;
}

.risk-tag.chill {
  background: #00FFFF;
  color: #111;
}

/* VIDEO MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(8px);
}

.modal-box {
  width: min(860px, 93vw);
  background: #111;
  border: 3px solid #000;
  box-shadow: 8px 8px 0 #000;
  overflow: hidden;
}

.modal-close {
  width: 100%;
  padding: 14px 20px;
  background: #1A1A1A;
  border: none;
  border-bottom: 2px solid #222;
  color: #888;
  font-family: var(--font-display);
  font-size: 18px;
  letter-spacing: 2px;
  cursor: pointer;
  text-align: left;
}

.modal-close:hover {
  color: var(--white);
}

.video-placeholder {
  width: 100%;
  aspect-ratio: 16/9;
}

.video-inner {
  width: 100%;
  height: 100%;
}

/* FOOTER */
.footer {
  padding: 28px 48px;
  border-top: 2px solid #1A1A1A;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-sub {
  font-size: 12px;
  color: #444;
  letter-spacing: 1px;
}

@media (max-width: 768px) {

  .nav,
  .hero,
  .cta-section,
  .risk-section,
  .footer {
    padding-left: 20px;
    padding-right: 20px;
  }

  .cta-grid {
    grid-template-columns: 1fr;
  }

  .hero {
    padding-top: 48px;
  }
}
</style>
