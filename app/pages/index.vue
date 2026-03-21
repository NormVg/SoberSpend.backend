<template>
  <main class="root">

    <!-- NAV -->
    <nav class="nav">
      <span class="nav-logo">Sober.<span class="cyan">Spend</span></span>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#how">How It Works</a>
        <a href="#stack">Stack</a>
      </div>
      <a href="#download" class="nav-cta">GET THE APP ↗</a>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-badge">✦ AI-POWERED FINANCE</div>
      <h1 class="hero-title">
        STOP<br />
        SPENDING<br />
        LIKE<br />
        <span class="cyan">YOU'RE RICH.</span>
      </h1>
      <p class="hero-sub">
        SoberSpend intercepts your UPI payments in real-time,<br />
        analyzes your habits, and roasts you into financial sanity.
      </p>
      <div class="hero-actions">
        <a href="#download" class="btn-primary">DOWNLOAD APP ↗</a>
        <a href="#how" class="btn-ghost">SEE HOW IT WORKS</a>
      </div>

      <!-- Risk badge strip -->
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

    <!-- PROBLEM STATEMENT -->
    <section class="section alt-bg" id="problem">
      <div class="section-inner two-col">
        <div>
          <div class="label">THE PROBLEM</div>
          <h2 class="section-title">You track money<br /><span class="cyan">after the damage.</span></h2>
          <p class="section-body">Every budgeting app shows you what you spent last week. By then it's too late.
            SoberSpend steps in at the moment of payment — every single time you tap pay.</p>
        </div>
        <div class="stat-grid">
          <div class="stat-card" style="background:#FF85A2;">
            <div class="stat-num">73%</div>
            <div class="stat-label">of Indians overspend their monthly limit</div>
          </div>
          <div class="stat-card" style="background:#00FFFF;">
            <div class="stat-num black">₹12K</div>
            <div class="stat-label black">avg monthly impulse spend per urban millennial</div>
          </div>
          <div class="stat-card" style="background:#DFFF00;">
            <div class="stat-num black">0</div>
            <div class="stat-label black">existing apps that intervene before you pay</div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="section" id="how">
      <div class="section-inner">
        <div class="label">HOW IT WORKS</div>
        <h2 class="section-title">From scan to <span class="cyan">save.</span></h2>
        <div class="steps">
          <div class="step">
            <div class="step-num">01</div>
            <div class="step-title">SCAN QR / RECEIPT</div>
            <div class="step-body">Point your camera at a UPI QR code or receipt. Our parser extracts the merchant,
              amount, and metadata instantly.</div>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-num">02</div>
            <div class="step-title">AI ANALYZES</div>
            <div class="step-body">Gemini AI classifies the transaction against your budget, category limits, and
              spending personality.</div>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-num">03</div>
            <div class="step-title">RISK SCORE</div>
            <div class="step-body">You get a brutal, honest risk level — BROKE, DANGER, WASTED, WARNING, SUS, SAFE, or
              CHILL — shown before you pay.</div>
          </div>
          <div class="step-arrow">→</div>
          <div class="step">
            <div class="step-num">04</div>
            <div class="step-title">DECIDE & TRACK</div>
            <div class="step-body">Pay via UPI deep-link or cancel. Every transaction is saved and immediately reflected
              in your live Insights dashboard.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="section alt-bg" id="features">
      <div class="section-inner">
        <div class="label">FEATURES</div>
        <h2 class="section-title">Built different.<br /><span class="cyan">Actually useful.</span></h2>
        <div class="features-grid">
          <div class="feature-card" style="background:#00FFFF; color:#111;">
            <div class="feature-icon">⚡</div>
            <div class="feature-title">Real-Time UPI Intercept</div>
            <div class="feature-body">Scan any UPI QR. Get a risk score before you confirm the payment.</div>
          </div>
          <div class="feature-card" style="background:#DFFF00; color:#111;">
            <div class="feature-icon">🤖</div>
            <div class="feature-title">AI Budget Advisor</div>
            <div class="feature-body">Tell us your financial personality. Gemini builds a personalized monthly budget
              and category limits.</div>
          </div>
          <div class="feature-card" style="background:#FF85A2; color:#111;">
            <div class="feature-icon">📊</div>
            <div class="feature-title">Live Insights</div>
            <div class="feature-body">Spending trends, peak spend hours, pattern detection (Weekend Overspender?) — all
              updated the moment you transact.</div>
          </div>
          <div class="feature-card" style="background:#1A1A1A; color:#fff;">
            <div class="feature-icon">🎯</div>
            <div class="feature-title">Savings Goals</div>
            <div class="feature-body">Add wishlist items. SoberSpend calculates exactly how many days it'll take based
              on your savings target.</div>
          </div>
          <div class="feature-card" style="background:#1A1A1A; color:#fff;">
            <div class="feature-icon">🧾</div>
            <div class="feature-title">Receipt Scanner</div>
            <div class="feature-body">Point at a paper receipt. Gemini extracts merchant, amount, and category
              automatically.</div>
          </div>
          <div class="feature-card" style="background:#1A1A1A; color:#fff;">
            <div class="feature-icon">🏆</div>
            <div class="feature-title">Financial Wrapped</div>
            <div class="feature-body">A Spotify Wrapped-style year-end summary of your worst (and best) financial
              moments.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- TECH STACK -->
    <section class="section" id="stack">
      <div class="section-inner">
        <div class="label">BUILT WITH</div>
        <h2 class="section-title">Production-grade<br /><span class="cyan">from day one.</span></h2>
        <div class="stack-grid">
          <div class="stack-pill">React Native (Expo)</div>
          <div class="stack-pill">TypeScript</div>
          <div class="stack-pill">Zustand</div>
          <div class="stack-pill">Supabase</div>
          <div class="stack-pill">Nuxt.js</div>
          <div class="stack-pill">Google Gemini AI</div>
          <div class="stack-pill">UPI Deep-link</div>
          <div class="stack-pill">Expo Camera</div>
        </div>
      </div>
    </section>

    <!-- CTA / DOWNLOAD -->
    <section class="section cta-section" id="download">
      <div class="section-inner cta-inner">
        <h2 class="cta-title">YOUR WALLET<br />IS <span class="cyan">WAITING.</span></h2>
        <p class="cta-sub">Download SoberSpend. Start intercepting bad financial decisions today.</p>
        <div class="hero-actions">
          <a href="https://github.com/NormVg/SoberSpend.app" target="_blank" class="btn-primary">VIEW ON GITHUB ↗</a>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <span class="nav-logo">Sober.<span class="cyan">Spend</span></span>
      <span class="footer-sub">Built for HS 4.0 Hackathon · Team SoberSpend</span>
    </footer>

  </main>
</template>

<script setup lang="ts">
useHead({
  title: 'SoberSpend — Stop Spending Like You\'re Rich',
  meta: [
    { name: 'description', content: 'AI-powered UPI payment interceptor that roasts you into financial sanity. Real-time risk scoring before you pay.' },
    { property: 'og:title', content: 'SoberSpend' },
    { property: 'og:description', content: 'Stop spending like you\'re rich.' },
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Bebas+Neue&display=swap' },
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
  --surface2: #1A1A1A;
  --white: #F5F5F5;
  --cyan: #00FFFF;
  --yellow: #DFFF00;
  --pink: #FF85A2;
  --border: #222;
  --border-thick: 3px solid #000;
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
  line-height: 1.6;
}

.root {
  min-height: 100vh;
}

.cyan {
  color: var(--cyan);
}

.black {
  color: #111 !important;
}

/* NAV */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 48px;
  border-bottom: 2px solid var(--border);
  position: sticky;
  top: 0;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(12px);
  z-index: 100;
}

.nav-logo {
  font-family: var(--font-display);
  font-size: 28px;
  letter-spacing: 1px;
  color: var(--white);
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-links a {
  font-family: var(--font-body);
  font-size: 13px;
  color: #888;
  text-decoration: none;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--white);
}

.nav-cta {
  background: var(--cyan);
  color: #000;
  padding: 10px 24px;
  font-family: var(--font-display);
  font-size: 16px;
  letter-spacing: 1px;
  border: var(--border-thick);
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 3px 3px 0 #000;
}

.nav-cta:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 #000;
}

/* HERO */
.hero {
  padding: 100px 48px 80px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--cyan);
  border: 1px solid var(--cyan);
  padding: 6px 16px;
  border-radius: 999px;
  margin-bottom: 32px;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(80px, 12vw, 180px);
  line-height: 0.9;
  color: var(--white);
  margin-bottom: 32px;
}

.hero-sub {
  font-size: 18px;
  color: #888;
  max-width: 560px;
  margin-bottom: 48px;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 64px;
}

.btn-primary {
  background: var(--cyan);
  color: #000;
  padding: 16px 36px;
  font-family: var(--font-display);
  font-size: 20px;
  letter-spacing: 1px;
  border: var(--border-thick);
  text-decoration: none;
  box-shadow: 4px 4px 0 #000;
  transition: transform 0.15s, box-shadow 0.15s;
}

.btn-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 #000;
}

.btn-ghost {
  background: transparent;
  color: var(--white);
  padding: 16px 36px;
  font-family: var(--font-display);
  font-size: 20px;
  letter-spacing: 1px;
  border: 3px solid #333;
  text-decoration: none;
  transition: border-color 0.2s;
}

.btn-ghost:hover {
  border-color: var(--white);
}

/* RISK STRIP */
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

/* SECTIONS */
.section {
  padding: 100px 48px;
}

.alt-bg {
  background: var(--surface);
}

.section-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.label {
  font-family: var(--font-body);
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--cyan);
  margin-bottom: 16px;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(40px, 5vw, 72px);
  color: var(--white);
  line-height: 1;
  margin-bottom: 24px;
}

.section-body {
  font-size: 17px;
  color: #888;
  max-width: 480px;
  line-height: 1.8;
}

/* STATS */
.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-card {
  padding: 28px;
  border: var(--border-thick);
  box-shadow: 4px 4px 0 #000;
}

.stat-card:first-child {
  grid-column: 1 / -1;
}

.stat-num {
  font-family: var(--font-display);
  font-size: 56px;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  font-weight: 600;
  margin-top: 8px;
}

/* STEPS */
.steps {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-top: 48px;
  flex-wrap: wrap;
}

.step {
  flex: 1;
  min-width: 200px;
  background: var(--surface2);
  border: 2px solid var(--border);
  padding: 32px 24px;
}

.step-num {
  font-family: var(--font-display);
  font-size: 48px;
  color: var(--cyan);
  line-height: 1;
  margin-bottom: 12px;
}

.step-title {
  font-family: var(--font-display);
  font-size: 22px;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.step-body {
  font-size: 14px;
  color: #888;
  line-height: 1.7;
}

.step-arrow {
  font-size: 32px;
  color: #333;
  padding-top: 48px;
}

/* FEATURES GRID */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 48px;
}

.feature-card {
  padding: 36px 28px;
  border: var(--border-thick);
  box-shadow: 4px 4px 0 #000;
  transition: transform 0.15s, box-shadow 0.15s;
}

.feature-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 #000;
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.feature-title {
  font-family: var(--font-display);
  font-size: 22px;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.feature-body {
  font-size: 14px;
  opacity: 0.75;
  line-height: 1.7;
}

/* STACK */
.stack-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 48px;
}

.stack-pill {
  padding: 12px 28px;
  font-family: var(--font-display);
  font-size: 20px;
  letter-spacing: 1px;
  border: 2px solid var(--border);
  color: var(--white);
  box-shadow: 3px 3px 0 #222;
  transition: background 0.2s, color 0.2s;
}

.stack-pill:hover {
  background: var(--cyan);
  color: #000;
  border-color: #000;
}

/* CTA */
.cta-section {
  background: var(--surface);
}

.cta-inner {
  text-align: center;
}

.cta-title {
  font-family: var(--font-display);
  font-size: clamp(60px, 10vw, 140px);
  line-height: 0.9;
  margin-bottom: 24px;
}

.cta-sub {
  font-size: 18px;
  color: #888;
  margin-bottom: 48px;
}

/* FOOTER */
.footer {
  padding: 32px 48px;
  border-top: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-sub {
  font-size: 13px;
  color: #555;
  letter-spacing: 1px;
}

@media (max-width: 900px) {
  .nav {
    padding: 16px 24px;
  }

  .nav-links {
    display: none;
  }

  .hero {
    padding: 60px 24px 60px;
  }

  .section {
    padding: 64px 24px;
  }

  .two-col {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .steps {
    flex-direction: column;
  }

  .step-arrow {
    display: none;
  }

  .footer {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}
</style>
