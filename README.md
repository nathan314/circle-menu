# 🎡 Circular Menu UI v.4.5 — Interactive Radial Navigation Engine

> An ultra-modern, high-performance **Circular / Radial Navigation Menu Engine** built with pure Vanilla JavaScript, trigonometric calculus, physics-based rotation inertia, dynamic tangent light beams, and mobile thumb-zone ergonomics.

<p align="center">
  <img src="circlemenu_nstar-concepts_expo-bento-demo.png" alt="Circular Menu UI v.4.5 — Expo Bento Grid Showcase" width="100%" style="border-radius: 12px; box-shadow: 0 12px 36px rgba(0,0,0,0.3);">
</p>

<p align="center">
  <a href="https://codepen.io/nstargina/pen/circle-menu"><img src="https://img.shields.io/badge/CodePen-Live%20Demo-black?style=flat&logo=codepen&logoColor=white" alt="CodePen Live Demo"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="#"><img src="https://img.shields.io/badge/Engine-Vanilla%20JS%20(ES6+)-blue.svg" alt="Engine: Vanilla JS"></a>
  <a href="https://greensock.com/gsap/"><img src="https://img.shields.io/badge/Animation-GSAP%203-green.svg" alt="Animation: GSAP 3"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Styling-Tailwind%20CSS%203-38bdf8.svg" alt="Styling: Tailwind CSS"></a>
</p>

---

## 📦 Componentized Architecture & Available Formats

To give developers and designers maximum flexibility, this project is delivered in **two independent, standalone component bundles** alongside the complete multi-instance showcase:

| Component / Format | HTML File | JavaScript File | Description |
| :--- | :--- | :--- | :--- |
| **Complete Showcase** (Multi-Instance) | [`index.html`](index.html) | [`circle-menu.js`](circle-menu.js) | Full experiential showcase combining the Desktop Header Capsule, the Hero Radial Engine, and the Mobile Dock in a single interconnected page. |
| **Header Component** (Standalone) | [`header-circle-menu.html`](header-circle-menu.html) | [`circle-menu-header.js`](circle-menu-header.js) | Isolated, zero-overhead component featuring the **Floating Header Capsule** (Desktop) morphing into the **Centered Bottom Thumb-Zone Dock** (Mobile) with top screen apex projection. Zero hero radial menu dependencies. |
| **Hero Component** (Standalone) | [`hero-circle-menu.html`](hero-circle-menu.html) | [`circle-menu-hero.js`](circle-menu-hero.js) | Isolated, zero-overhead component featuring the **Hero Radial Engine** with physics-based inertia rotation, tangent light beams, and interactive output card. Zero header dial dependencies. |
| **CodePen Edition** (Single-File) | [`codepen-index.html`](codepen-index.html) | *Inline Script* | 100% self-contained single-file edition ready to copy and paste into CodePen with inline SVG symbols. |

---

## ✨ Features & Architecture

- 🎯 **Modular Zero-Overhead Components:** Choose between standalone Header Capsule, standalone Hero Radial Engine, or both together. No need to clean up unused code!
- 🛡️ **Intelligent Hover Isolation:** Automatic mutual suppression between floating header capsules and background hero menus to prevent overlapping activations.
- 📐 **Real-Time Trigonometric Angular Tracking:** Pull rotation calculation via `Math.atan2(dx, dy)` and distance proximity check with `Math.hypot(dx, dy)`.
- ⚡ **Dynamic Tangent Light Beams:** Radial rays aligned tangentially to each dash sector, firing on hover/touch without alpha-blending lag. Full-coverage mouse hit-testing for effortless clickability.
- 📱 **Mobile Thumb-Zone Ergonomics:** Dual counter-rotation engine (`(baseAngle + 2 * currentAngle) % 360 == 0`) with apex locking, haptic pulses, and projected top category labels.
- 🎨 **Concentric Outer Guide Rings:** Concentric guides with 12 o'clock Apex indicator dots that maintain 100% geometric center during rotation.
- 🔗 **Direct URL Link Integration:** Built-in support for live links (`target="_blank"`), flash ripple animations, and custom callbacks (`onSelect`).
- 🎨 **SVG Symbols Vector Architecture:** SVG `<symbol>` and `<use>` vector rendering, allowing complete freedom to change dash counts, shapes, or artwork in any vector software (Figma, Illustrator, Inkscape).
- 🚀 **Zero Build Setup Required:** Runs directly via Tailwind CSS CDN + GSAP 3 CDN — 100% copy-paste ready for **CodePen**, **GitHub Pages**, **WordPress**, or any web framework.

---

## 📂 File Directory

```
circle-menu/
├── index.html                   # Combined Multi-Instance Showcase (Header + Hero + Mobile Dock)
├── circle-menu.js               # Multi-Instance Universal JavaScript Engine
│
├── header-circle-menu.html      # [COMPONENT 1] Standalone Header & Mobile Dock Showcase
├── circle-menu-header.js        # [COMPONENT 1] Dedicated JS Engine for Header Capsule & Mobile Dock
│
├── hero-circle-menu.html        # [COMPONENT 2] Standalone Hero Radial Engine Showcase
├── circle-menu-hero.js          # [COMPONENT 2] Dedicated JS Engine for Hero Radial Navigation
│
├── codepen-index.html           # Standalone Single-File Copy-Paste Edition for CodePen
├── README.md                    # Complete Architecture and API Documentation
├── COMO_FUNCIONA_MATEMATICA_E_JS.md # Trigonometry, Calculus & Physics Technical Manual
├── circlemenu_nstar-concepts_expo-bento-demo.png # Showcase Preview Banner
└── LICENSE                      # MIT Open Source License
```

---

## 🚀 Quick Start: Using the Independent Components

### Option A: Using the Header & Mobile Dock Component
If you only need the sleek floating capsule header on desktop that morphs into a bottom thumb-zone dock on mobile:

1. Copy [`circle-menu-header.js`](circle-menu-header.js) into your project scripts.
2. Include the HTML structure from [`header-circle-menu.html`](header-circle-menu.html).
3. Initialize the header engine:

```javascript
// Initialize Standalone Header Capsule & Mobile Bottom Dock
const headerMenu = new HeaderCircleMenuEngine({
    stageId: 'header-dial-container',
    wheelId: 'header-menu-wheel',
    wheelWrapperId: 'header-wheel-wrapper',
    labelId: 'header-active-title',
    centerHubId: 'header-center-logo',
    centerHubScalerId: 'header-center-scaler',
    triggerAreaId: 'header-dial-container',
    isCompact: true,
    data: menuData,
    onSelect: (item, idx) => {
        console.log('Selected:', item.label);
    }
});
```

---

### Option B: Using the Hero Radial Engine Component
If you want the central hero radial dial with gamer-style inertia pulling and tangent light beams:

1. Copy [`circle-menu-hero.js`](circle-menu-hero.js) into your project scripts.
2. Include the hero section markup from [`hero-circle-menu.html`](hero-circle-menu.html).
3. Initialize the hero engine:

```javascript
// Initialize Standalone Hero Radial Menu Engine
const heroMenu = new HeroCircleMenuEngine({
    stageId: 'hero-dial-stage',
    wheelId: 'menu-wheel',
    wheelWrapperId: 'menu-wheel-wrapper',
    outerRingId: 'outer-hub-ring',
    centerHubId: 'center-hub',
    centerHubScalerId: 'center-hub-scaler',
    flashEffectId: 'flash-effect',
    triggerAreaId: 'hero-interaction-zone', // Focused 70% aspect ratio interaction zone
    labelId: 'active-category-title',
    data: menuData,
    onSelect: (item, idx) => {
        console.log('Hero Sector Selected:', item.label, idx);
    }
});
```

---

## ⚙️ Customization Guide: JavaScript Parameters

All geometric, radial, offset, and hit-testing properties are centralized inside the **`getDimensions()`** method of each engine. You can calibrate each parameter directly in options or inside the script:

```javascript
getDimensions() {
    const w = window.innerWidth;
    const isDesktop = w >= 1024;
    const stageRect = this.stage.getBoundingClientRect();
    const stageW = stageRect.width || (this.isCompact ? 176 : (this.isMobileDock ? 176 : (w >= 1536 ? 737 : (w >= 1024 ? 600 : (w >= 640 ? 480 : 340)))));

    // =========================================================================
    // 1. DESKTOP FLOATING HEADER CAPSULE (isCompact)
    // =========================================================================
    if (this.isCompact) {
        return {
            stageW,
            radius: this.options.radius || 52,            // Distance (px) from center to dashes
            beamRadialOffset: this.options.beamRadialOffset ?? 2, // Radial push (px) outward from dash edge
            dashWidth: this.options.dashWidth || 36,         // Base width of the active arc
            beamSVGWidth: this.options.beamSVGWidth || 96,   // Base width of the light beam cone (full arc span)
            beamHeight: this.options.beamHeight || 90,       // Longitudinal height/reach of the light beam
            hitDistance: this.options.hitDistance || 130     // Sensitivity radius (px) for cursor activation
        };
    }

    // =========================================================================
    // 2. MOBILE BOTTOM DOCKED NAV (isMobileDock)
    // =========================================================================
    if (this.isMobileDock) {
        return {
            stageW,
            radius: this.options.radius || 78,            // Dash ring radius in the mobile bottom bar
            beamRadialOffset: this.options.beamRadialOffset ?? 3, // Push beam base flush outward
            dashWidth: this.options.dashWidth || 50,         // Dash chord width
            beamSVGWidth: this.options.beamSVGWidth || 110,  // Light beam width
            beamHeight: this.options.beamHeight || 140,      // Upward light beam projection reach
            hitDistance: this.options.hitDistance || 160     // Proximity trigger distance
        };
    }

    // =========================================================================
    // 3. MAIN HERO RADIAL ENGINE (isHero / Default)
    // =========================================================================
    const radiusRatio = isDesktop ? (359.07 / 737) : (174.99 / 360);
    const radius = Math.round(stageW * radiusRatio);

    // Dynamic responsive calibration for Hero Beam & Interaction Zone
    let beamRadialOffset = 3; // Positive value keeps beam flush outside perimeter
    let beamHeight = 620;     // Beam length
    let hitDistance = 580;    // Focused central interaction zone radius (60%~80% hero)

    if (w >= 1536) {
        beamRadialOffset = 4;
        beamHeight = 620;
        hitDistance = 580;
    } else if (w >= 1024) {
        beamRadialOffset = 3;
        beamHeight = Math.min(Math.round(stageW * 0.95), 560);
        hitDistance = Math.min(Math.round(stageW * 0.85), 520);
    } else if (w >= 640) {
        beamRadialOffset = 4;
        beamHeight = 380;
        hitDistance = 420;
    } else {
        beamRadialOffset = 3;
        beamHeight = 270;
        hitDistance = 300;
    }

    const dashRatio = isDesktop ? (208.41 / 737) : (132.47 / 360);
    const dashWidth = Math.round(stageW * dashRatio);
    const beamSVGWidth = Math.round(dashWidth * 3.86856);

    return {
        stageW,
        radius,
        beamRadialOffset,
        dashWidth,
        beamSVGWidth,
        beamHeight,
        hitDistance
    };
}
```

---

## 🎨 Concentric Outer Ring Customization

The Outer Ring provides a visual guide with an indicator marker at the 12 o'clock Apex position.

### Sizing and Alignment
In the HTML markup, the outer ring is centered with `left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2` and controlled via Tailwind width/height utility classes:

```html
<!-- Mobile Bottom Outer Ring (Concentric guide with Apex dot) -->
<div id="mobile-dock-outer-ring"
    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ns-red/80 pointer-events-none opacity-0 will-change-transform drop-shadow-[0_0_12px_rgba(255,234,71,0.7)] w-[14.5rem] h-[14.5rem]">
    <!-- Upward Apex Indicator Dot (Top 12 o'clock marker) -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-ns-red">
    </div>
</div>
```

- **Adjust Ring Diameter:** Simply modify `w-[14.5rem] h-[14.5rem]` (e.g., `w-[16rem] h-[16rem]` for a wider ring, or `w-[13rem] h-[13rem]` for a tighter fit).
- **Rotation Centering Integrity:** In `touchmove` and the render loop ticker, the engine ensures centering remains rock-solid by always preserving `translate(-50%, -50%)`:
  ```javascript
  this.outerRing.style.transform = `translate(-50%, -50%) rotate(${-this.currentAngle}deg)`;
  ```

---

## 📐 SVG Symbols Architecture & Vector Customization

The radial dial utilizes SVG `<symbol>` and `<use>` definitions for ultra-lightweight DOM rendering and instant vector scaling.

```html
<svg xmlns="http://www.w3.org/2000/svg" class="sr-only">
    <!-- Desktop 7 Unified Sectors (Radius: 358.99, ViewBox: 737x737) -->
    <symbol id="circle-items-desktop" viewBox="0 0 737 737">
        <circle cx="368.5" cy="368.5" r="358.99" fill="none" stroke="currentColor" stroke-linecap="round"
            stroke-linejoin="round" stroke-width="3.5" stroke-dasharray="211.43 110.80"
            transform="rotate(-106.88 368.5 368.5)" />
    </symbol>

    <!-- Desktop Active Arc Highlight -->
    <symbol id="circle-item-desktop" viewBox="0 0 737 737">
        <circle cx="368.5" cy="368.5" r="358.99" fill="none" stroke="currentColor" stroke-linecap="round"
            stroke-linejoin="round" stroke-width="4.2" stroke-dasharray="211.43 2044.19"
            transform="rotate(-106.88 368.5 368.5)" />
    </symbol>
</svg>
```

### 🖌️ How to Alter Sectors, Dash Counts or Shapes
You can edit or replace these vectors with any vector graphic design software (**Figma**, **Adobe Illustrator**, **Inkscape**, **Affinity Designer**):

1. **Changing Item Count ($N$):**
   - The perimeter of the circle is $C = 2 \pi r$.
   - Divide $C$ by the number of items ($N$). For 7 items, each sector takes $C / 7$.
   - In `stroke-dasharray="[dashLength] [gapLength]"`, adjust the dash and gap lengths to fit your desired aesthetic spacing.
2. **Custom Vector Glyphs & Shapes:**
   - Instead of a `<circle stroke-dasharray="...">`, you can place custom `<path>`, polygon vertices, icons, or futuristic cyberpunk dashes inside the `<symbol>` tags.
   - The engine will rotate and highlight whatever artwork you place inside the symbol!

---

## 🔗 Data Schema & URL Navigation

Configure items, labels, descriptions, and destination links directly in `menuData`:

```javascript
const menuData = [
    { 
        id: 'btUI', 
        label: 'UI DESIGN', 
        title: 'UI Design Patterns', 
        desc: 'Design Systems, tactile micro-interactions, and component architecture.', 
        url: 'https://nstarconcepts.com/category/ui-design/' 
    },
    { 
        id: 'btGraphic', 
        label: 'GRAPHIC DESIGN', 
        title: 'Identity & Modular Grid', 
        desc: 'Typographic hierarchy, visual balance, and brand consistency.', 
        url: 'https://nstarconcepts.com/category/design-grafico/' 
    },
    { 
        id: 'btIlustra', 
        label: 'ILLUSTRATION', 
        title: 'Vector Art & Concept', 
        desc: 'Original artwork, digital illustrations, and visual concept storytelling.', 
        url: 'https://nstarconcepts.com/category/ilustracao/' 
    },
    { 
        id: 'btAnima', 
        label: '2D ANIMATION', 
        title: 'Motion & Physics', 
        desc: 'Real-time 60fps kinetic motion graphics with vector interpolation.', 
        url: 'https://nstarconcepts.com/category/animations2d/' 
    },
    { 
        id: 'btSobre', 
        label: 'ABOUT', 
        title: 'Creative Engineering', 
        desc: 'The synergy of human-centered UX/UI Design and modern front-end technology.', 
        url: 'https://nstarconcepts.com/#about-section' 
    },
    { 
        id: 'btContato', 
        label: 'CONTACT', 
        title: 'Start Collaboration', 
        desc: 'Custom digital experiences, high-performance web apps, and bespoke interfaces.', 
        url: 'https://nstarconcepts.com/#cta-section' 
    },
    { 
        id: 'btTodos', 
        label: 'ALL POSTS', 
        title: 'Portfolio Directory', 
        desc: 'Explore the complete directory of case studies, interactive UI demos, and articles.', 
        url: 'https://nstarconcepts.com/all/' 
    }
];
```

- Clicking on any active **light beam**, **dash sector**, or **category title label** triggers a tactile ripple flash and opens the destination URL in a new tab (`window.open(item.url, '_blank', 'noopener,noreferrer')`).

---

## 📄 License & Author

- **Author:** [Natã da Silva Targina](https://www.linkedin.com/in/nstargina/) (NStar Concepts)
- **Portfolio & Case Studies:** [nstarconcepts.com](https://nstarconcepts.com)
- **License:** [MIT License](LICENSE) — free for personal, educational, and commercial projects.
