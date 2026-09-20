// Kuro AI Studio - DeepSeek / ChatGPT Style Q&A & Code Streamer

const state = {
  isRunning: false,
  soundEnabled: false,
  mouseMovementEnabled: true,
  speed: 'fast',
  hourlyRate: 100,
  apiKey: localStorage.getItem('kuro_gemini_api_key') || '',
  totalKeystrokes: 0,
  totalLines: 0,
  totalPrompts: 0,
  totalSeconds: 0,
  totalEarnings: 0,
  currentCodeBuffer: '',
  bufferIndex: 0,
  isFetchingAI: false,
  mousePos: { x: 350, y: 260 },
  promptHistory: [],
  editorContent: ''
};

const PROMPT_DATABASE = [
  {
    topic: "Algorithms",
    prompt: "Write a high-performance Least Recently Used (LRU) Cache with O(1) get & put in Python.",
    thinking: "Analyzing requirement: Needs O(1) time complexity for lookup and insertion. A doubly-linked list combined with a hash map provides constant time node removal and head insertion.",
    code: `class Node:
    def __init__(self, key: int, value: int):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node: Node):
        prev, nxt = node.prev, node.next
        prev.next = nxt
        nxt.prev = prev

    def _insert(self, node: Node):
        nxt = self.head.next
        self.head.next = node
        node.prev = self.head
        node.next = nxt
        nxt.prev = node

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._insert(node)
            return node.value
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self._insert(node)
        self.cache[key] = node
        if len(self.cache) > self.capacity:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]

# Testing LRU Cache Operations
cache = LRUCache(2)
cache.put(1, 100)
cache.put(2, 200)
print("Lookup Key 1:", cache.get(1))
cache.put(3, 300) # Key 2 gets evicted
print("Lookup Evicted Key 2:", cache.get(2))
`
  },
  {
    topic: "WebSockets",
    prompt: "Build an auto-reconnecting WebSocket pub/sub telemetry client with backoff in JavaScript.",
    thinking: "Designing WebSocket architecture: Handling abrupt dropouts, exponentially backing off retry intervals, and preserving channel subscription state.",
    code: `class ResilientWebSocketClient {
  constructor(endpoint, options = {}) {
    this.endpoint = endpoint;
    this.maxRetries = options.maxRetries || 8;
    this.retryDelay = options.retryDelay || 1500;
    this.attempts = 0;
    this.channels = new Map();
    this.socket = null;
    this.connect();
  }

  connect() {
    this.socket = new WebSocket(this.endpoint);
    this.socket.onopen = () => {
      console.log('[WS] Connected to telemetry node.');
      this.attempts = 0;
      this.resubscribeAll();
    };

    this.socket.onmessage = (event) => {
      try {
        const { channel, payload } = JSON.parse(event.data);
        if (this.channels.has(channel)) {
          this.channels.get(channel).forEach(handler => handler(payload));
        }
      } catch (err) {
        console.error('[WS] Payload parse error:', err);
      }
    };

    this.socket.onclose = () => {
      console.warn('[WS] Stream disconnected. Scheduling reconnect...');
      this.scheduleReconnect();
    };
  }

  scheduleReconnect() {
    if (this.attempts < this.maxRetries) {
      const backoff = this.retryDelay * Math.pow(1.5, this.attempts);
      this.attempts++;
      setTimeout(() => this.connect(), backoff);
    }
  }

  subscribe(channel, handler) {
    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set());
    }
    this.channels.get(channel).add(handler);
  }

  resubscribeAll() {
    for (const channel of this.channels.keys()) {
      if (this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ action: 'subscribe', channel }));
      }
    }
  }
}
`
  },
  {
    topic: "Concurrency",
    prompt: "Implement a thread-safe worker pool pipeline with graceful cancellation in Go.",
    thinking: "Designing Go concurrency model: Utilizing sync.WaitGroup, context.Context for cancellation propagation, and buffered channels for load distribution.",
    code: `package main

import (
	"context"
	"fmt"
	"sync"
	"time"
)

type Job struct {
	ID    int
	Data  string
}

type Result struct {
	JobID  int
	Output string
}

func Worker(ctx context.Context, id int, jobs <-chan Job, results chan<- Result, wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		select {
		case <-ctx.Done():
			fmt.Printf("[Worker %d] Received cancellation signal. Exiting.\\n", id)
			return
		case job, ok := <-jobs:
			if !ok {
				return
			}
			time.Sleep(100 * time.Millisecond)
			results <- Result{JobID: job.ID, Output: fmt.Sprintf("Processed by worker %d", id)}
		}
	}
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	jobs := make(chan Job, 20)
	results := make(chan Result, 20)
	var wg sync.WaitGroup

	for w := 1; w <= 3; w++ {
		wg.Add(1)
		go Worker(ctx, w, jobs, results, &wg)
	}

	for j := 1; j <= 10; j++ {
		jobs <- Job{ID: j, Data: fmt.Sprintf("Telemetry Packet #%d", j)}
	}
	close(jobs)

	wg.Wait()
	close(results)
}
`
  }
];

// Audio Synth
let audioCtx = null;
function playKeyClick() {
  if (!state.soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400 + Math.random() * 400, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.035);
  } catch (err) {}
}

// Terminal logger
function logTerminal(tag, message) {
  const logsContainer = document.getElementById('terminal-logs');
  if (!logsContainer) return;
  const now = new Date().toTimeString().split(' ')[0];
  const div = document.createElement('div');
  div.className = 'log-entry';
  
  let tagClass = 'system';
  if (tag === 'AI' || tag === 'DEEPSEEK') tagClass = 'ai';
  if (tag === 'SQUARE') tagClass = 'square';

  div.innerHTML = `
    <span class="log-time">[${now}]</span>
    <span class="log-tag ${tagClass}">[${tag}]</span>
    <span class="log-msg">${escapeHtml(message)}</span>
  `;
  logsContainer.appendChild(div);
  logsContainer.scrollTop = logsContainer.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

// Square Mouse Mover on Webpage
let squareStep = 0;
let squareCenter = { x: 450, y: 320 };
const SQUARE_SIZE = 90;

function animateSquareMouse() {
  if (!state.mouseMovementEnabled || !state.isRunning) {
    requestAnimationFrame(animateSquareMouse);
    return;
  }

  const cursorEl = document.getElementById('ghost-cursor');
  if (!cursorEl) return;

  // Move in 4 corners of a square:
  // 0: Top-Left -> Top-Right
  // 1: Top-Right -> Bottom-Right
  // 2: Bottom-Right -> Bottom-Left
  // 3: Bottom-Left -> Top-Left
  const corners = [
    { x: squareCenter.x - SQUARE_SIZE/2, y: squareCenter.y - SQUARE_SIZE/2 },
    { x: squareCenter.x + SQUARE_SIZE/2, y: squareCenter.y - SQUARE_SIZE/2 },
    { x: squareCenter.x + SQUARE_SIZE/2, y: squareCenter.y + SQUARE_SIZE/2 },
    { x: squareCenter.x - SQUARE_SIZE/2, y: squareCenter.y + SQUARE_SIZE/2 }
  ];

  const targetCorner = corners[squareStep % 4];
  
  // Smooth motion towards corner
  state.mousePos.x += (targetCorner.x - state.mousePos.x) * 0.15;
  state.mousePos.y += (targetCorner.y - state.mousePos.y) * 0.15;

  cursorEl.style.transform = `translate(${state.mousePos.x}px, ${state.mousePos.y}px)`;

  // Dispatch browser DOM pointer events
  try {
    const el = document.elementFromPoint(state.mousePos.x, state.mousePos.y) || document.body;
    el.dispatchEvent(new MouseEvent('mousemove', { clientX: state.mousePos.x, clientY: state.mousePos.y, bubbles: true }));
  } catch (e) {}

  // Next corner when close
  const dist = Math.hypot(targetCorner.x - state.mousePos.x, targetCorner.y - state.mousePos.y);
  if (dist < 4) {
    squareStep++;
    // Periodically reposition square around editor
    if (squareStep % 16 === 0) {
      squareCenter = {
        x: Math.random() * (window.innerWidth - 400) + 350,
        y: Math.random() * (window.innerHeight - 300) + 200
      };
    }
  }

  requestAnimationFrame(animateSquareMouse);
}

// Fetch Gemini / DeepSeek Q&A Item
async function fetchAIQnA() {
  if (!state.apiKey) {
    return PROMPT_DATABASE[Math.floor(Math.random() * PROMPT_DATABASE.length)];
  }

  const topics = [
    "distributed rate limiter with Redis in Python",
    "concurrent priority queue in C++",
    "custom React virtualized list hook with smooth scrolling",
    "A* pathfinding algorithm on 2D grid in JavaScript",
    "JWT authentication and token refresh pipeline in Go"
  ];
  const chosen = topics[Math.floor(Math.random() * topics.length)];

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${state.apiKey}`;
    const promptText = `Generate a realistic user coding question/prompt about: "${chosen}".
Then provide a brief 2-sentence "thinking process" and the complete clean code solution.
Format EXACTLY as:
PROMPT: <user question>
THINKING: <brief 2-sentence reasoning>
CODE:
<complete clean code without backticks>`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1200 }
      })
    });
    const data = await res.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (raw.includes('PROMPT:') && raw.includes('CODE:')) {
      const prompt = raw.split('THINKING:')[0].replace('PROMPT:', '').trim();
      const thinking = raw.split('THINKING:')[1].split('CODE:')[0].trim();
      const code = raw.split('CODE:')[1].replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
      return { topic: chosen, prompt, thinking, code };
    }
  } catch (err) {}
  return PROMPT_DATABASE[Math.floor(Math.random() * PROMPT_DATABASE.length)];
}

// Add prompt card to left sidebar
function addPromptToHistory(item) {
  const listEl = document.getElementById('ai-prompt-list');
  const card = document.createElement('div');
  card.className = 'ai-prompt-card active';
  card.innerHTML = `
    <div class="prompt-user-badge">👤 User Query #${state.totalPrompts + 1}</div>
    <div class="prompt-text">${escapeHtml(item.prompt)}</div>
    <div class="prompt-meta">
      <span>⚡ DeepSeek-R1 Stream</span>
      <span>${new Date().toLocaleTimeString()}</span>
    </div>
  `;
  document.querySelectorAll('.ai-prompt-card').forEach(c => c.classList.remove('active'));
  listEl.prepend(card);
}

// Syntax Highlighter
function syntaxHighlight(code) {
  let escaped = escapeHtml(code);
  const keywords = ['import', 'from', 'export', 'default', 'function', 'class', 'const', 'let', 'var', 'async', 'await', 'return', 'def', 'if', 'else', 'for', 'while', 'package', 'struct', 'type'];
  const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  escaped = escaped.replace(keywordRegex, '<span class="token-keyword">$1</span>');
  escaped = escaped.replace(/(["'`])(.*?)\1/g, '<span class="token-string">$1$2$1</span>');
  escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="token-number">$1</span>');
  escaped = escaped.replace(/(\/\/.*?$|#.*?$)/gm, '<span class="token-comment">$1</span>');
  escaped = escaped.replace(/\b([a-zA-Z0-9_]+)(?=\()/g, '<span class="token-function">$1</span>');
  return escaped;
}

// Typing Loop
async function runQnALoop() {
  while (state.isRunning) {
    logTerminal('AI', 'Receiving new coding query from user...');
    const item = await fetchAIQnA();
    state.totalPrompts++;
    document.getElementById('stat-prompts').textContent = state.totalPrompts;
    addPromptToHistory(item);

    // Update Thinking box
    document.getElementById('thinking-content').textContent = item.thinking;
    logTerminal('DEEPSEEK', `Thinking & Synthesizing solution...`);

    // Stream formatted response into editor
    const header = `\n\n// ========================================================\n// [USER QUERY #${state.totalPrompts}]: ${item.prompt}\n// [DEEPSEEK / CHATGPT AI RESPONSE STREAM]:\n// ========================================================\n`;
    const fullText = header + item.code;

    for (let i = 0; i < fullText.length; i++) {
      if (!state.isRunning) break;
      const char = fullText[i];
      state.editorContent += char;
      state.totalKeystrokes++;

      // Render
      const lines = state.editorContent.split('\n');
      state.totalLines = lines.length;
      
      let lineNumbersHtml = '';
      for (let l = 1; l <= Math.max(lines.length, 25); l++) {
        lineNumbersHtml += `<div>${l}</div>`;
      }
      document.getElementById('line-numbers').innerHTML = lineNumbersHtml;
      document.getElementById('code-content').innerHTML = syntaxHighlight(state.editorContent) + '<span class="cursor-blink"></span>';
      
      const codeWin = document.getElementById('code-window');
      codeWin.scrollTop = codeWin.scrollHeight;

      document.getElementById('stat-keystrokes').textContent = state.totalKeystrokes.toLocaleString();
      document.getElementById('footer-cursor-pos').textContent = `Ln ${lines.length}, Col ${(i % 30) + 1}`;

      playKeyClick();

      let delay = state.speed === 'human' ? Math.random() * 45 + 20 : (state.speed === 'turbo' ? 4 : 16);
      await new Promise(r => setTimeout(r, delay));
    }

    logTerminal('SQUARE', `Solution streamed successfully. Moving square mouse inspection...`);
    await new Promise(r => setTimeout(r, 1800));
  }
}

// Session Timer Loop
setInterval(() => {
  if (!state.isRunning) return;
  state.totalSeconds += 1;
  state.totalEarnings = state.totalSeconds * (state.hourlyRate / 3600);

  const hrs = Math.floor(state.totalSeconds / 3600).toString().padStart(2, '0');
  const mins = Math.floor((state.totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (state.totalSeconds % 60).toString().padStart(2, '0');

  document.getElementById('stat-timer').textContent = `${hrs}:${mins}:${secs}`;
  document.getElementById('stat-earnings').textContent = `₹${state.totalEarnings.toFixed(2)}`;
}, 1000);

// Start / Pause toggle
function toggleRunning() {
  state.isRunning = !state.isRunning;
  const toggleBtn = document.getElementById('btn-toggle');
  const statusBadge = document.getElementById('status-badge');
  const statusText = document.getElementById('status-text');

  if (state.isRunning) {
    toggleBtn.innerHTML = `<span>⏸️</span> Pause`;
    toggleBtn.className = 'btn btn-secondary';
    statusBadge.className = 'status-badge';
    statusText.textContent = 'STREAMING LIVE';
    logTerminal('SYSTEM', 'ChatGPT / DeepSeek continuous Q&A loop started.');
    runQnALoop();
  } else {
    toggleBtn.innerHTML = `<span>▶️</span> Start AI Q&A Loop`;
    toggleBtn.className = 'btn btn-primary';
    statusBadge.className = 'status-badge paused';
    statusText.textContent = 'PAUSED';
    logTerminal('SYSTEM', 'Streaming paused.');
  }
}

// Mouse Toggle
function toggleMouse() {
  state.mouseMovementEnabled = !state.mouseMovementEnabled;
  const btn = document.getElementById('btn-mouse');
  if (state.mouseMovementEnabled) {
    btn.innerHTML = `<span>⏹️</span> Square Mouse: ON`;
    btn.className = 'btn btn-primary';
  } else {
    btn.innerHTML = `<span>🚫</span> Square Mouse: OFF`;
    btn.className = 'btn btn-secondary';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  animateSquareMouse();

  document.getElementById('btn-toggle').addEventListener('click', toggleRunning);
  document.getElementById('btn-mouse').addEventListener('click', toggleMouse);
  document.getElementById('btn-sound').addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    const btn = document.getElementById('btn-sound');
    btn.innerHTML = state.soundEnabled ? `<span>🔊</span> Sound ON` : `<span>🔇</span> Sound Muted`;
    btn.className = state.soundEnabled ? 'btn btn-primary' : 'btn btn-secondary';
  });

  document.getElementById('speed-select').addEventListener('change', (e) => {
    state.speed = e.target.value;
  });

  document.getElementById('btn-settings').addEventListener('click', () => {
    document.getElementById('input-api-key').value = state.apiKey;
    document.getElementById('input-hourly-rate').value = state.hourlyRate;
    document.getElementById('settings-modal').classList.add('active');
  });

  document.getElementById('btn-close-modal').addEventListener('click', () => {
    document.getElementById('settings-modal').classList.remove('active');
  });

  document.getElementById('btn-save-settings').addEventListener('click', () => {
    state.apiKey = document.getElementById('input-api-key').value.trim();
    state.hourlyRate = parseFloat(document.getElementById('input-hourly-rate').value) || 100;
    localStorage.setItem('kuro_gemini_api_key', state.apiKey);
    document.getElementById('rate-label').textContent = `₹${state.hourlyRate}/hr`;
    document.getElementById('settings-modal').classList.remove('active');
    logTerminal('SYSTEM', 'Configuration saved.');
  });

  logTerminal('SYSTEM', 'Kuro AI Studio initialized with DeepSeek-R1 / ChatGPT streaming engine.');
});
