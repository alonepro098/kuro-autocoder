# ⚡ Kuro AI Auto-Coding Streamer & Earning Simulator

Ek modern, VS Code styled **Live AI Coding Web Application** jo continuous high-quality code generate aur stream karta hai. Isme Gemini API, realistic human keystroke simulation, un-throttled background worker, aur live ₹100/hr earning ticker built-in hai.

---

## 🚀 Features

1. **🤖 Gemini AI 1.5 / 2.0 Integration**:
   - Real-time intelligent code generation across Python, React, C++, Go, JavaScript, SQL.
   - Built-in mega-library fallback (agar API key na ho ya quota limit ho tab bhi continuous chalta rahega).

2. **⚡ Realistic Keystroke & Typing Simulator**:
   - 4 Typing Speeds:
     - `Human Natural`: Realistic typing intervals with random human jitter.
     - `Fast Developer`: Smooth rapid typing.
     - `Cyberpunk Turbo`: Ultra fast line bursts.
     - `Instant Chunks`: Bulk generation blocks.
   - Real DOM `KeyboardEvent` aur `InputEvent` continuous activity dispatch karta hai.

3. **🛡️ Uninterrupted Background Mode**:
   - Web Worker + Web Audio keep-alive technique use karta hai taaki jab aap doosre tab me kaam karein ya browser minimize ho, tab bhi typing aur session **pause na ho**.
   - Built-in Screen WakeLock.

4. **💰 Live Earning Dashboard**:
   - ₹100/hr live ticker (har second ₹0.0278 automatically add hota hai).
   - Session timer (HH:MM:SS), Keystrokes counter, aur Lines of code counter.

5. **🔊 Mechanical Keyboard Sound Synth**:
   - Real tactile click sound on every keystroke (built-in Web Audio API, zero external files required).

---

## 🌐 1-Click Vercel Deployment

Aap is website ko direct Vercel par 2 minutes me live kar sakte hain:

### Method 1: GitHub + Vercel
1. Apne GitHub par ek naya repository banaiye (e.g. `kuro-autocoder`).
2. Is folder ke saare files (`index.html`, `style.css`, `app.js`, `worker.js`, `vercel.json`) ko GitHub repo me push/upload kar dijiye.
3. [vercel.com](https://vercel.com) par login karke **"Add New Project"** select kijiye aur apna GitHub repo connect karke **Deploy** par click kar dijiye!

### Method 2: Local Run
Bina kisi installation ke, direct `index.html` file par double click karke kisi bhi browser (Chrome, Edge, Brave) me open karke use kar sakte hain!

---

## ⚙️ How to Add Gemini API Key
1. Web app open kijiye.
2. Top right me **⚙️ Settings** button par click kijiye.
3. Apni **Gemini API Key** paste karke **Save & Apply** dabaiye.
4. **▶️ Start Auto-Code** par click kijiye!
