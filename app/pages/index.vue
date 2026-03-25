<template>
  <main class="root">

    <!-- NAV -->
    <nav class="nav">
      <span class="nav-logo">Sober.<span class="cyan">Spend</span></span>
      <span class="nav-tag">HS 4.0 Hackathon</span>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">✦ SMART FINANCE APP</div>
        <h1 class="hero-title">
          STOP<br />
          SPENDING<br />
          LIKE<br />
          <span class="cyan">YOU'RE RICH.</span>
        </h1>
        <p class="hero-sub">
          Intelligent UPI payment interceptor. See your risk score <em>before</em> you tap pay.
        </p>
      </div>
      <div class="hero-graphics">
        <img src="/ss-logo.png" alt="SoberSpend Logo" class="hero-logo" />
      </div>
    </section>

    <!-- 3 CTA CARDS -->
    <section class="cta-section">
      <div class="cta-grid">

        <!-- 1. DOWNLOAD PPT -->
        <a href="/SpendSober.pptx" download class="cta-card" style="background: var(--yellow); color: var(--black);">
          <div class="cta-icon">📊</div>
          <div class="cta-content">
            <div class="cta-title">PRESENTATION</div>
            <div class="cta-body">Download our full project pitch deck</div>
          </div>
          <div class="cta-arrow">↓</div>
        </a>

        <!-- 2. VIEW VIDEO -->
        <button class="cta-card"
          style="background: var(--cyan); color: var(--black); border:3px solid var(--black); cursor:pointer; text-align:left;"
          @click="showVideo = true">
          <div class="cta-icon">▶</div>
          <div class="cta-content">
            <div class="cta-title">DEMO VIDEO</div>
            <div class="cta-body">Watch SoberSpend in action</div>
          </div>
          <div class="cta-arrow">↗</div>
        </button>

        <!-- 3. DOWNLOAD APK -->
        <a href="https://github.com/NormVg/SoberSpend.app/releases/download/sddd/application-346b777e-dd3c-422f-8fdd-f31c31da1f6c.apk"
          download class="cta-card" style="background: var(--pink); color: var(--black);">
          <div class="cta-icon">📱</div>
          <div class="cta-content">
            <div class="cta-title">ANDROID APK</div>
            <div class="cta-body">Install & try the app right now</div>
          </div>
          <div class="cta-arrow">↓</div>
        </a>

      </div>
    </section>

    <!-- APP GALLERY -->
    <section class="gallery-section">
      <div class="gallery-inner">
        <h2 class="section-title">See the <span class="cyan">Reality.</span></h2>
        <div class="gallery-scroll">
          <img src="/show/screen-1.jpg" alt="App Screenshot 1" class="gallery-img" />
          <img src="/show/screen-3.jpg" alt="App Screenshot 3" class="gallery-img" />
          <img src="/show/screen-4.jpg" alt="App Screenshot 4" class="gallery-img" />
          <img src="/show/screen-5.jpg" alt="App Screenshot 5" class="gallery-img" />
          <img src="/show/screen-6.jpg" alt="App Screenshot 6" class="gallery-img" />
          <img src="/show/screen-7.jpg" alt="App Screenshot 7" class="gallery-img" />
          <img src="/show/screen-8.jpg" alt="App Screenshot 8" class="gallery-img" />
        </div>
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

// 👇 The actual YouTube embed URL
const videoSrc = 'https://www.youtube.com/embed/drfokWK9iyQ'

useHead({
  title: 'SoberSpend — Stop Spending Like You\'re Rich',
  meta: [
    { name: 'description', content: 'Intelligent UPI payment interceptor. See your risk score before you pay.' },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/ss-logo.png' },
    { rel: 'apple-touch-icon', href: '/ss-logo.png' },
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
  --black: #111111;
  --surface: #F9F9F9;
  --white: #FFFFFF;
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
  background: var(--surface);
  color: var(--black);
  font-family: var(--font-body);
  min-height: 100vh;
}

.cyan {
  color: var(--black);
  background: var(--cyan);
  padding: 0 4px;
  display: inline-block;
}

/* NAV */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 48px;
  border-bottom: 3px solid var(--black);
  background: var(--white);
}

.nav-logo {
  font-family: var(--font-display);
  font-size: 28px;
  letter-spacing: 1px;
  color: var(--black);
}

.nav-tag {
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--black);
  border: 2px solid var(--black);
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--yellow);
  font-weight: 700;
}

.nav-link {
  font-weight: 700;
  text-decoration: underline;
  text-transform: uppercase;
}

/* HERO */
.hero {
  padding: 80px 48px 48px;
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  gap: 64px;
}

.hero-content {
  flex: 1;
}

.hero-graphics {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column-reverse;
    text-align: center;
    padding: 40px 24px 40px;
    gap: 32px;
  }
}

.hero-logo {
  width: 180px;
  height: 180px;
  margin: 0;
  border: 4px solid var(--black);
  border-radius: 40px;
  box-shadow: 6px 6px 0 var(--black);
}

.hero-badge {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--black);
  border: 2px solid var(--black);
  background: var(--pink);
  padding: 6px 16px;
  border-radius: 999px;
  display: inline-block;
  margin-bottom: 28px;
  box-shadow: 2px 2px 0 var(--black);
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(72px, 10vw, 160px);
  line-height: 0.9;
  margin-bottom: 28px;
  color: var(--black);
}

.hero-sub {
  font-size: 18px;
  color: #333;
  line-height: 1.7;
  font-weight: 500;
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
  border: 3px solid var(--black);
  box-shadow: 5px 5px 0 var(--black);
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
  font-family: inherit;
}

.cta-card:hover {
  transform: translate(-3px, -3px);
  box-shadow: 8px 8px 0 var(--black);
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
  color: var(--black);
}

.cta-body {
  font-size: 15px;
  opacity: 0.85;
  line-height: 1.5;
  font-weight: 600;
  color: var(--black);
}

.cta-arrow {
  font-family: var(--font-display);
  font-size: 36px;
  color: var(--black);
}

/* RISK SECTION */
.risk-section {
  padding: 0 48px 80px;
}

.risk-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--black);
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
  border: 2px solid var(--black);
  box-shadow: 3px 3px 0 var(--black);
  font-weight: 700;
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

/* APP GALLERY */
.gallery-section {
  padding: 48px 48px 80px;
  background: var(--surface);
  border-top: 3px solid var(--black);
  border-bottom: 3px solid var(--black);
  margin-bottom: 80px;
}

.gallery-inner {
  max-width: 1000px;
  margin: 0 auto;
}

.gallery-scroll {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  padding: 24px 0 48px;
  scrollbar-width: none;
}

.gallery-scroll::-webkit-scrollbar {
  display: none;
}

.gallery-img {
  height: 500px;
  width: auto;
  border: 4px solid var(--black);
  border-radius: 24px;
  box-shadow: 6px 6px 0 var(--black);
  object-fit: cover;
  flex-shrink: 0;
}

/* VIDEO MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(8px);
}

.modal-box {
  width: min(860px, 93vw);
  background: var(--white);
  border: 3px solid var(--black);
  box-shadow: 8px 8px 0 var(--black);
  overflow: hidden;
}

.modal-close {
  width: 100%;
  padding: 14px 20px;
  background: var(--surface);
  border: none;
  border-bottom: 3px solid var(--black);
  color: var(--black);
  font-family: var(--font-display);
  font-size: 20px;
  letter-spacing: 2px;
  cursor: pointer;
  text-align: left;
}

.modal-close:hover {
  background: var(--cyan);
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
  border-top: 3px solid var(--black);
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-sub {
  font-size: 14px;
  font-weight: 600;
  color: var(--black);
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
