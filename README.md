# Modern Developer Portfolio Website

A high-performance, responsive portfolio website built with **React 19**, **Tailwind CSS v4**, and **Vite**, structured around the 7 essential portfolio sections.

---

## 🌟 Included Sections

1. **Hero Section**
   - Sticky responsive Navbar with active section scrollspy
   - Professional name, role, and dynamic badge (`Open to Work`)
   - Short introduction & interactive code terminal component
   - Direct CTA buttons: **Resume Download / View**, **GitHub**, **LinkedIn**, and **Explore Projects**
   - Quick statistics counter (Years Coding, Completed Projects, Internships, PRs)

2. **About Me**
   - Profile avatar with glowing ambient ring and fallback initials
   - Short bio and extended engineering journey
   - Education highlight card (Degree, Institution, GPA, graduation date)
   - 4 Dedicated **Career Interest** cards (Cloud & Distributed Systems, Full-Stack Engineering, API Architecture, AI Tooling)
   - Core engineering principles breakdown

3. **Technical Skills**
   - Organized categories:
     - **Programming Languages** (TypeScript, JavaScript, Python, Go, Java, C++, SQL, HTML5/CSS3)
     - **Frameworks & Libraries** (React 19, Next.js, Node.js, Express, Tailwind CSS, FastAPI, Spring Boot, GraphQL)
     - **Databases & Storage** (PostgreSQL, MongoDB, Redis, Prisma ORM, Supabase, MySQL)
     - **Developer Tools & DevOps** (Git/GitHub, Docker, AWS, Linux/Bash, Postman, Vite, CI/CD Actions)
   - Real-time search filter bar & category tab switcher
   - Skill icons with proficiency percentage bars and level badges (`Expert`, `Advanced`, `Proficient`)

4. **Projects & Case Studies**
   - Responsive project cards with high-definition screenshots & hover previews
   - Technology stack badges for every project
   - Direct links to **GitHub Repository** and **Live Demo**
   - **Quick View Modal** detailing project architecture, core features, and live links
   - Category filtering (All, Full Stack, AI & Cloud, Developer Tools)

5. **Work Experience & Internships**
   - Interactive vertical timeline layout
   - Organization name, role title, duration, location, and employment type badges
   - Comprehensive bulleted list of responsibilities and measurable achievements
   - Associated technology stack tags for each role

6. **Education & Certifications**
   - Formal university education details (Degree, College, GPA, honors, core coursework, campus leadership)
   - Industry-recognized verified certifications (AWS, Meta, Linux Foundation, Docker) with verification links
   - Specialized technical workshops & intensive bootcamps attended

7. **Contact & Socials**
   - Interactive contact form with client-side validation, submit states, and instant success notification
   - Direct email card with one-click **"Copy Email"** to clipboard
   - Direct links to **LinkedIn** and **GitHub**
   - Location, local timezone, and expected response time indicators

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```
Generates production-ready optimized static bundles in the `/dist` directory.

---

## ⚙️ How to Personalize Your Content

All data is centralized in **[`src/data/portfolioData.js`](file:///c:/portfolio/src/data/portfolioData.js)**. Simply update the fields:

- **Personal Info & Socials**: Name, role, bio, avatar, email, GitHub/LinkedIn URLs
- **Career Interests**: Customize your focus areas and descriptions
- **Skills**: Add or remove languages, frameworks, databases, and tools
- **Projects**: Update titles, descriptions, images, tags, GitHub links, and live URLs
- **Experience**: Add your internship history, organizations, and achievements
- **Education & Certifications**: Edit your college degree, GPA, certificates, and workshops
- **Contact Details**: Update your email, phone, and timezone
