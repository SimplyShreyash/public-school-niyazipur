# 🚀 Deployment Guide — Public School Niyazipur

> **Institution:** Public School, Niyazipur  
> **Official UDISE+ Code:** 10301901109 (Ministry of Education, Govt. of India Verified)  
> **Establishment Year:** 2011  
> **Headmaster & Administrator:** Shri Ajit Kumar Thakur  
> **Official Email:** ajitkumarthakur3066@gmail.com  
> **Helpline & WhatsApp:** +91 99056 63403  
> **Campus Location:** Niyazipur, Simri Block, Buxar District, Bihar — PIN: 802131 (GPS: 25.4986°N, 83.7188°E)  
> **Design Pattern:** Narayana Group of Schools Model (Asia's Largest Network)

---

## 📋 Table of Contents
1. [Local Development & Quick Launch](#1-local-development--quick-launch)
2. [Deploying Free on GitHub Pages](#2-deploying-free-on-github-pages)
3. [Deploying Free on Vercel](#3-deploying-free-on-vercel)
4. [Deploying Free on Netlify](#4-deploying-free-on-netlify)
5. [Connecting a Custom Domain (`publicschoolniyazipur.com`)](#5-connecting-a-custom-domain)
6. [Updating Content & Contact Details](#6-updating-content--contact-details)

---

## 1. Local Development & Quick Launch

### Option A: 1-Click Desktop Launcher
Simply double-click the included batch launcher in the project root:
```cmd
open-website.bat
```
This automatically starts the zero-dependency Node.js HTTP server and opens `http://localhost:3000` directly in your default browser.

### Option B: Command Prompt / PowerShell
Run the built-in HTTP server:
```bash
node server.js
```
Then visit `http://localhost:3000`.

---

## 2. Deploying Free on GitHub Pages

GitHub Pages is 100% free forever and provides high-speed global SSL hosting.

1. **Initialize Git Repository (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial release of Public School Niyazipur website"
   ```

2. **Create a GitHub Repository:**
   - Go to [GitHub.com/new](https://github.com/new).
   - Name your repository (e.g. `publicschoolniyazipur`).
   - Leave it public and click **Create repository**.

3. **Push your code to GitHub:**
   ```bash
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/publicschoolniyazipur.git
   git branch -M main
   git push -u origin main
   ```

4. **Activate GitHub Pages:**
   - Open your repository on GitHub.
   - Go to **Settings** > **Pages** (under Code and automation).
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select Branch: `main` and Folder: `/ (root)`.
   - Click **Save**.
   - Within 1–2 minutes, your website will be live at:
     ```
     https://<YOUR_GITHUB_USERNAME>.github.io/publicschoolniyazipur/
     ```

---

## 3. Deploying Free on Vercel

Vercel provides ultra-fast CDN edge hosting with automatic SSL and zero configuration:

1. Visit [vercel.com](https://vercel.com) and sign in with GitHub or email.
2. Click **Add New...** > **Project**.
3. Import your `publicschoolniyazipur` GitHub repository.
4. Framework Preset: **Other** (Pure HTML/CSS/JS static site).
5. Click **Deploy**.
6. Your website is live with an instant `.vercel.app` URL and free HTTPS.

---

## 4. Deploying Free on Netlify

Netlify supports instant Drag-and-Drop deployment without using Git:

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the entire `Major project` folder into the browser window.
3. Your website deploys in under 10 seconds!
4. You can change your site subdomain under **Site configuration** > **Domain management**.

---

## 5. Connecting a Custom Domain

To connect a professional domain like **`publicschoolniyazipur.com`** or **`publicschoolniyazipur.edu.in`**:

1. **Purchase Domain:**
   Buy your domain from any registrar (GoDaddy, Namecheap, Hostinger, or Google Domains).

2. **In GitHub Pages / Vercel / Netlify:**
   - Add your custom domain under **Domain Settings**.
   - It will show you DNS records to add.

3. **In Your Domain Registrar DNS Manager:**
   - Add **CNAME Record**:
     - Host: `www`
     - Value: `<your-site>.vercel.app` (or `<username>.github.io`)
   - Add **A Records** (for apex `@` domain pointing to Vercel/GitHub IP addresses):
     - `76.76.21.21` (Vercel) OR
     - `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (GitHub Pages)

---

## 6. Updating Content & Contact Details

All key school data is structured cleanly for easy updates:

- **School Name:** `Public School Niyazipur`
- **UDISE+ Identifier:** `10301901109` (Ministry of Education, Govt. of India)
- **Year Established:** `2011` (15 Years of Educational Service)
- **Headmaster & Administrator:** `Shri Ajit Kumar Thakur`
- **Official Email:** `ajitkumarthakur3066@gmail.com`
- **Helpline & WhatsApp:** `+91 99056 63403`
  - WhatsApp chat link format:
    `https://wa.me/919905663403?text=...`
- **Location:** `Niyazipur, Simri Block, Buxar District, Bihar — PIN: 802131`
- **GPS Coordinates:** `25.4986°N, 83.7188°E`
- **RTE Compliance:** 25% Free Seats reserved under Section 12(1)(c) of RTE Act for EWS children.
- **Fee Structures:** Configured in `index.html` under `#fees` and calculated dynamically in `js/main.js`.
- **PSAT Scholarship Exam:** Dates and slots configured in `index.html` under `#psat-modal`.
- **4 Student Houses:** Kalam, Aryabhata, Tagore, and Raman house badges located in `assets/house-*.svg`.

---
© 2026 Public School Niyazipur (UDISE+: 10301901109 • Estd. 2011). Simri, Buxar, Bihar. Administered by Shri Ajit Kumar Thakur.
