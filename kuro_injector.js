// ==UserScript==
// @name         Kuro Auto-Coding & Anti-Idle Injector
// @namespace    https://kuro.local/
// @version      1.0
// @description  Injects directly inside Kuro website to auto-type Gemini code and maintain continuous active status
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
  let isRunning = true;
  let keystrokeCount = 0;

  console.log("%c[KURO INJECTOR] Direct DOM Auto-Coding & Mouse Engine Initialized!", "background: #0ea5e9; color: white; font-weight: bold; padding: 4px 8px; border-radius: 4px;");

  // Diverse Fallback Code Library
  const fallbackCodeBlocks = [
    `def calculate_fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nprint(list(calculate_fibonacci(25)))\n`,
    `function quicksort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[arr.length - 1];\n  const left = arr.filter((x, i) => x <= pivot && i < arr.length - 1);\n  const right = arr.filter(x => x > pivot);\n  return [...quicksort(left), pivot, ...quicksort(right)];\n}\n`,
    `#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    vector<int> nums = {10, 20, 30, 40, 50};\n    for(int n : nums) cout << "Processing Node: " << n << endl;\n    return 0;\n}\n`
  ];

  // Fetch Code from Gemini
  async function fetchNextCode() {
    try {
      const isBearer = GEMINI_API_KEY.startsWith("AQ.") || GEMINI_API_KEY.startsWith("ya29.");
      const url = isBearer
        ? "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
        : `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const headers = { "Content-Type": "application/json" };
      if (isBearer) headers["Authorization"] = `Bearer ${GEMINI_API_KEY}`;

      const res = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Write 20-30 lines of clean, real, executable programming code in Python or JavaScript with comments. No markdown code blocks." }] }]
        })
      });
      const data = await res.json();
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      text = text.replace(/```[a-z]*\n?/gi, "").replace(/```/g, "").trim();
      return text.length > 10 ? text : fallbackCodeBlocks[Math.floor(Math.random() * fallbackCodeBlocks.length)];
    } catch (e) {
      return fallbackCodeBlocks[Math.floor(Math.random() * fallbackCodeBlocks.length)];
    }
  }

  // Find the active Code Editor element on Kuro website (textarea, input, contenteditable, Monaco, Ace, CodeMirror)
  function getEditorElement() {
    const active = document.activeElement;
    if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT" || active.isContentEditable)) {
      return active;
    }
    const candidates = document.querySelectorAll("textarea, [contenteditable='true'], .monaco-editor textarea, .ace_text-input, .cm-content, input[type='text']");
    return candidates.length > 0 ? candidates[0] : null;
  }

  // Dispatch Native Keystrokes & DOM Events
  function typeCharacterIntoDOM(char) {
    const editor = getEditorElement();
    const target = editor || document.body;

    // Focus editor
    if (editor && document.activeElement !== editor) {
      editor.focus();
    }

    // 1. Dispatch Keyboard Events
    const opts = { key: char, code: "Key" + char.toUpperCase(), bubbles: true, cancelable: true };
    target.dispatchEvent(new KeyboardEvent("keydown", opts));
    target.dispatchEvent(new KeyboardEvent("keypress", opts));

    // 2. Insert into input/textarea/contenteditable
    if (editor) {
      if (editor.tagName === "TEXTAREA" || editor.tagName === "INPUT") {
        editor.value = (editor.value || "") + char;
        editor.dispatchEvent(new Event("input", { bubbles: true }));
        editor.dispatchEvent(new Event("change", { bubbles: true }));
      } else if (editor.isContentEditable) {
        document.execCommand("insertText", false, char);
      }
    }

    target.dispatchEvent(new KeyboardEvent("keyup", opts));

    // 3. Dispatch Mouse Movement to prevent idle detection
    const randomX = Math.floor(Math.random() * window.innerWidth);
    const randomY = Math.floor(Math.random() * window.innerHeight);
    const mouseOpts = { clientX: randomX, clientY: randomY, bubbles: true, cancelable: true };
    document.dispatchEvent(new MouseEvent("mousemove", mouseOpts));
    document.dispatchEvent(new PointerEvent("pointermove", mouseOpts));

    keystrokeCount++;
    if (keystrokeCount % 100 === 0) {
      console.log(`[KURO INJECTOR] Active: ${keystrokeCount} keystrokes typed.`);
    }
  }

  // Continuous Auto-Type Stream Loop
  async function startTypingLoop() {
    while (isRunning) {
      const codeToType = await fetchNextCode();
      for (let i = 0; i < codeToType.length; i++) {
        if (!isRunning) break;
        typeCharacterIntoDOM(codeToType[i]);
        // Random typing delay (30ms - 80ms)
        const delay = Math.floor(Math.random() * 50) + 30;
        await new Promise(r => setTimeout(r, delay));
      }
      // Small pause between code blocks
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  // Floating Control Widget on Kuro
  const widget = document.createElement("div");
  widget.style.cssText = "position:fixed;bottom:20px;right:20px;z-index:999999;background:#0f172a;border:2px solid #38bdf8;padding:12px 16px;border-radius:10px;box-shadow:0 0 20px rgba(56,189,248,0.4);font-family:sans-serif;color:white;display:flex;gap:10px;align-items:center;";
  widget.innerHTML = `
    <span style="font-size:12px;font-weight:bold;color:#38bdf8;">âš¡ KURO BOT ACTIVE</span>
    <button id="kuro-toggle-btn" style="background:#0284c7;color:white;border:none;padding:5px 12px;border-radius:6px;cursor:pointer;font-weight:bold;">PAUSE</button>
  `;
  document.body.appendChild(widget);

  document.getElementById("kuro-toggle-btn").onclick = function () {
    isRunning = !isRunning;
    this.innerText = isRunning ? "PAUSE" : "RESUME";
    this.style.background = isRunning ? "#0284c7" : "#10b981";
    if (isRunning) startTypingLoop();
  };

  startTypingLoop();
})();
