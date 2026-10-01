# DRIVEFORGE — Vehicle Sales Resource & Knowledge Network

> **"Knowledge That Moves Sales Forward."**  
> *Practical resources, proven sales knowledge, and a community built for vehicle sales professionals.*

A production-quality, premium website template crafted for vehicle sales consultants, dealership sales managers, automotive training academies, and BDC teams.

Built with clean **HTML5**, **Bootstrap 5.3.3**, **CSS3 Custom Properties**, **Vanilla JavaScript**, and **GSAP 3.12.5**.

---

## 🚀 Key Features

* **Editorial-Tech Aesthetic:** Sharp, sophisticated visual language combining automotive energy with clean, modern knowledge-hub architecture.
* **Compact, Purpose-Driven Structure:** No bloat, no fake CRM/dealer management portals, no ecommerce cart, and strictly no Home-2 variations.
* **Instant Client-Side Search:** Search across guides, scripts, checklists, and templates with live suggestions and keyboard hotkey (`/` or `Ctrl+K`).
* **Multi-Format Resource Discovery:** Distinct visual treatments for Playbooks, Sales Guides, Checklists, Scripts, Downloadable Worksheets, and Video Lessons.
* **Curriculum & Learning Paths:** Structured module roadmaps covering onboarding, negotiation, EV consultative sales, and BDC show-rate optimization.
* **Scenario Video Learning:** Interactive video player modal simulating real showroom roleplay masterclasses with syllabus notes.
* **Interactive Toolkits & Planners:** Downloadable field tools in PDF, Excel, and Word with automated download feedback and toast alerts.
* **Active Peer Community:** Discussion feed with categories, trending markers, and a functional "Start Discussion" modal with live instant feed prepending.
* **Dual Theme Engine:** Full Light and Dark mode support with smooth transitions, OS preference detection, and `localStorage` persistence.
* **Standalone Auth (No Dashboard Redirects):** Polished split-screen Login and Sign Up interfaces with accessible validation and in-place activation states.
* **Robust Mobile Navigation:** Engineered offcanvas menu with nested dropdowns, keyboard escape handling, and guaranteed viewport containment across all phone sizes.

---

## 📂 File & Directory Structure

```text
driveforge/
│
├── index.html                  # Homepage (Hero, Search, Categories, Featured, Videos, Downloads, Community)
├── resources.html              # Searchable Resource Library (Live Filtering, Categories, Sorting)
├── resource-details.html       # Single Resource Detail (Talk Tracks, Interactive Checklist, Sticky Sidebar)
├── learn.html                  # Curriculum Architecture (4 Learning Paths & Featured Modules)
├── video-tutorials.html        # Video Learning Hub (Featured Masterclass, Category Filters, Modal Player)
├── templates.html              # Downloadable Sales Toolkits (PDF, XLSX, DOCX with instant download feedback)
├── community.html              # Peer Discussion Network (Filters, Stats, Start Discussion Modal)
├── about.html                  # Brand Mission, 4 Pillars, Target Audience & Community Standards
├── contact.html                # Inquiry Form with Front-End Validation & Feedback
│
├── login.html                  # Front-End Sign In (Split-Screen, Password Toggle, In-Place Alert)
├── signup.html                 # Front-End Sign Up (Role Picker, Terms Agreement, In-Place Alert)
├── forgot-password.html        # Compact Password Reset Request Card
├── 404.html                    # Themed Detour 404 Error Page with Search
│
├── assets/
│   ├── css/
│   │   ├── bootstrap.min.css   # Bootstrap 5.3.3 Core Styles
│   │   ├── bootstrap-icons.min.css # Bootstrap Icons 1.11.3
│   │   ├── fonts/              # WOFF2 & WOFF Icon Font Files
│   │   └── style.css           # Master CSS Design System & Theme Variables
│   ├── js/
│   │   ├── bootstrap.bundle.min.js # Bootstrap 5.3.3 Bundle with Popper
│   │   ├── gsap.min.js         # GSAP 3.12.5 Animation Library
│   │   └── main.js             # Theme Engine, Search, Filters, Modals, Forms
│   └── images/
│       ├── hero/               # Executive Showroom Atmosphere Imagery
│       ├── automotive/         # Vehicle Handover & Walkaround Assets
│       ├── resources/          # Consultative Lounge Presentations
│       └── videos/             # Masterclass & Desking Visuals
│
├── documentation/
│   └── index.html              # Comprehensive Template Setup & Customization Guide
└── README.md                   # Project Overview & Setup Instructions
```

---

## 🛠️ Technology Stack

* **Markup:** Semantic HTML5 with accessible ARIA roles and landmark elements.
* **Grid & Layout:** Bootstrap 5.3.3 (CSS & Bundle JS).
* **Styles:** Custom Vanilla CSS3 with CSS variables for seamless theme toggling.
* **Typography:** Space Grotesk (Headlines), Inter (Body & UI), DM Serif Display (Editorial accents).
* **Icons:** Bootstrap Icons 1.11.3 (locally bundled WOFF2/WOFF).
* **Animations:** GSAP 3.12.5 (respects `prefers-reduced-motion`).
* **Scripting:** Pure Vanilla ES6+ JavaScript.

---

## 💻 How to Run Locally

Because DRIVEFORGE is built with pure static web standards, there are no dependencies to install and no build steps:

### Option 1: Direct File Access
Simply double-click `index.html` to open it directly in any modern browser.

### Option 2: Local HTTP Server (PowerShell / VS Code)
If using VS Code, use the **Live Server** extension.  
Alternatively, launch a local server using Python, Node, or PowerShell:

```bash
# Python 3
python -m http.server 8080

# Or npx
npx serve .
```
Then navigate to `http://localhost:8080`.

---

## 📱 Responsive Testing & Breakpoints

DRIVEFORGE has been engineered and tested across standard mobile, tablet, and desktop viewports:
* **Mobile (Small & Compact):** 320×568, 360×800, 375×812, 390×844, 414×896, 425×900
* **Tablets & Foldables:** 768×1024, 800×1280, 1024×1366
* **Laptops & Desktops:** 1280×720, 1366×768, 1440×900, 1920×1080, 2560px+

---

## ⚖️ Fictional Brand Disclosure

**DRIVEFORGE** is a demonstration brand created for template marketplaces (such as ThemeForest, TemplateMonster, Creative Market) and commercial sales enablement presentations. All dealership scenarios, participant avatars, statistics, and downloadable resources are demonstration assets.

---

## 📄 License & Credits

* Bootstrap 5.3.3 — MIT License
* Bootstrap Icons — MIT License
* GSAP 3.12.5 — GreenSock Standard Web License
* Google Fonts — SIL Open Font License (OFL)

© 2026 DRIVEFORGE. All rights reserved.
