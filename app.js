// Kuro AI Auto-Coding Streamer & Background Earning Simulator

// Application State
const state = {
  isRunning: false,
  soundEnabled: false,
  speed: 'fast', // 'human', 'fast', 'turbo', 'instant'
  hourlyRate: 100, // ₹100 per hour default
  apiKey: localStorage.getItem('kuro_gemini_api_key') || '',
  activeTab: 'script.py',
  totalKeystrokes: 0,
  totalLines: 0,
  totalSeconds: 0,
  totalEarnings: 0,
  currentCodeBuffer: '',
  bufferIndex: 0,
  isFetchingAI: false,
  files: {
    'script.py': { lang: 'python', name: 'script.py', icon: '🐍' },
    'App.jsx': { lang: 'javascript', name: 'App.jsx', icon: '⚛️' },
    'algo.cpp': { lang: 'cpp', name: 'algo.cpp', icon: '⚡' },
    'game.js': { lang: 'javascript', name: 'game.js', icon: '🎮' },
    'server.go': { lang: 'go', name: 'server.go', icon: '🐹' },
    'neural_net.py': { lang: 'python', name: 'neural_net.py', icon: '🧠' },
    'database.sql': { lang: 'sql', name: 'database.sql', icon: '💾' }
  },
  fileContents: {}
};

// Fallback high-quality diverse code templates (when API key isn't provided or offline)
const fallbackSnippets = [
  {
    file: 'script.py',
    code: `import asyncio
import hashlib
import time
from dataclasses import dataclass

@dataclass
class Transaction:
    sender: str
    recipient: str
    amount: float
    timestamp: float = time.time()

    def calculate_hash(self) -> str:
        payload = f"{self.sender}:{self.recipient}:{self.amount}:{self.timestamp}"
        return hashlib.sha256(payload.encode()).hexdigest()

class HighFrequencyTradingEngine:
    def __init__(self, initial_balance: float):
        self.balance = initial_balance
        self.order_book = []
        self.is_active = True

    async def execute_arbitrage(self, token_pair: str, spread_threshold: float):
        print(f"[ENGINE] Monitoring depth of market for {token_pair}...")
        while self.is_active:
            # Simulated real-time price tick
            bid_price = 142.50 + (time.time() % 3.5)
            ask_price = 142.95 + (time.time() % 2.1)
            spread = (ask_price - bid_price) / bid_price

            if spread > spread_threshold:
                tx = Transaction("Wallet_Alpha", f"Pool_{token_pair}", amount=self.balance * 0.15)
                tx_hash = tx.calculate_hash()
                print(f"[ARBITRAGE] Spread {spread:.4f}% detected. Executing Tx: {tx_hash[:12]}...")
                self.balance += (self.balance * spread * 0.8)
            
            await asyncio.sleep(0.5)

if __name__ == "__main__":
    engine = HighFrequencyTradingEngine(initial_balance=50000.0)
    asyncio.run(engine.execute_arbitrage("ETH/USDC", spread_threshold=0.002))`
  },
  {
    file: 'App.jsx',
    code: `import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DistributedTelemetryDashboard() {
  const [nodes, setNodes] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState('asia-south1');

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => [
        ...prev.slice(-20),
        {
          id: Math.random().toString(36).substring(7),
          latency: Math.floor(Math.random() * 45) + 12,
          throughput: (Math.random() * 1.8 + 0.4).toFixed(2),
          status: Math.random() > 0.05 ? 'healthy' : 'degraded',
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const averageLatency = useMemo(() => {
    if (!nodes.length) return 0;
    return (nodes.reduce((acc, n) => acc + n.latency, 0) / nodes.length).toFixed(1);
  }, [nodes]);

  return (
    <div className="telemetry-wrapper p-6 bg-slate-950 text-white min-h-screen">
      <header className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-cyan-400">Node Cluster Stream</h1>
          <p className="text-sm text-slate-400">Active Region: {selectedCluster}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg">
            <span className="text-xs uppercase text-slate-400">Avg Latency</span>
            <p className="text-lg font-mono text-emerald-400">{averageLatency} ms</p>
          </div>
        </div>
      </header>
    </div>
  );
}`
  },
  {
    file: 'algo.cpp',
    code: `#include <iostream>
#include <vector>
#include <queue>
#include <limits>

using namespace std;

struct Edge {
    int to;
    int weight;
};

class GraphNetwork {
private:
    int vertices;
    vector<vector<Edge>> adjList;

public:
    GraphNetwork(int v) : vertices(v), adjList(v) {}

    void addBidirectionalRoute(int u, int v, int w) {
        adjList[u].push_back({v, w});
        adjList[v].push_back({u, w});
    }

    vector<int> findShortestOptimizedPath(int startNode) {
        priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
        vector<int> dist(vertices, numeric_limits<int>::max());

        dist[startNode] = 0;
        pq.push({0, startNode});

        while (!pq.empty()) {
            int currentDist = pq.top().first;
            int u = pq.top().second;
            pq.pop();

            if (currentDist > dist[u]) continue;

            for (const auto& edge : adjList[u]) {
                if (dist[u] + edge.weight < dist[edge.to]) {
                    dist[edge.to] = dist[u] + edge.weight;
                    pq.push({dist[edge.to], edge.to});
                }
            }
        }
        return dist;
    }
};

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    GraphNetwork meshNet(8);
    meshNet.addBidirectionalRoute(0, 1, 4);
    meshNet.addBidirectionalRoute(0, 2, 7);
    meshNet.addBidirectionalRoute(1, 3, 2);
    meshNet.addBidirectionalRoute(2, 3, 3);
    meshNet.addBidirectionalRoute(3, 4, 6);

    auto result = meshNet.findShortestOptimizedPath(0);
    for (int i = 0; i < 5; ++i) {
        cout << "Optimal Latency to Node " << i << " : " << result[i] << " ms\\n";
    }
    return 0;
}`
  },
  {
    file: 'game.js',
    code: `// 3D Matrix & Particle Physics Canvas Engine
class PhysicsParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId) || document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 120;
    this.gravity = 0.05;
    this.friction = 0.98;
    this.init();
  }

  init() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: Math.random() * 2.5 + 1,
        color: \`hsl(\${Math.floor(Math.random() * 60) + 180}, 90%, 65%)\`
      });
    }
    this.animate();
  }

  animate() {
    this.ctx.fillStyle = 'rgba(10, 13, 20, 0.2)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.vy += this.gravity;
      p.vx *= this.friction;
      p.vy *= this.friction;
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y > this.canvas.height) {
        p.y = this.canvas.height;
        p.vy *= -0.7;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
    }
    requestAnimationFrame(() => this.animate());
  }
}`
  },
  {
    file: 'server.go',
    code: `package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"
)

type WorkerTask struct {
	ID        string    \`json:"id"\`
	Payload   string    \`json:"payload"\`
	CreatedAt time.Time \`json:"created_at"\`
	Status    string    \`json:"status"\`
}

type TaskDispatcher struct {
	sync.RWMutex
	tasks map[string]*WorkerTask
}

func (td *TaskDispatcher) HandleProcess(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	task := &WorkerTask{
		ID:        fmt.Sprintf("tsk_%d", time.Now().UnixNano()),
		CreatedAt: time.Now(),
		Status:    "DISPATCHED",
	}

	td.Lock()
	td.tasks[task.ID] = task
	td.Unlock()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)
}

func main() {
	dispatcher := &TaskDispatcher{tasks: make(map[string]*WorkerTask)}
	http.HandleFunc("/api/v1/dispatch", dispatcher.HandleProcess)

	fmt.Println("[GO SERVER] Kuro background worker daemon listening on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}`
  }
];

// Web Audio API Keyclick Synthesizer
let audioCtx = null;
function playKeyClick() {
  if (!state.soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    // Subtle realistic mechanical switch sound
    const freqs = [1200, 1600, 2000, 2400, 900];
    const chosenFreq = freqs[Math.floor(Math.random() * freqs.length)];

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(chosenFreq, audioCtx.currentTime);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, audioCtx.currentTime);
    filter.Q.setValueAtTime(2.0, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.04);
  } catch (err) {
    // Audio policy handling
  }
}

// Keep Alive Web Worker setup
let worker = null;
function initWorker() {
  try {
    worker = new Worker('worker.js');
    worker.onmessage = function (e) {
      if (e.data.type === 'tick' && state.isRunning) {
        handleTypingTick();
      }
    };
  } catch (err) {
    console.warn("Worker fallback to standard intervals", err);
  }
}

// Request WakeLock to prevent screen sleep
let wakeLock = null;
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      logTerminal('SYSTEM', 'Screen WakeLock engaged. Browser tab will stay active.');
    }
  } catch (err) {
    console.log('WakeLock not supported or denied');
  }
}

// Dispatch simulated genuine DOM keyboard & input events
function dispatchKeystrokeActivity(char) {
  try {
    const keyEventDown = new KeyboardEvent('keydown', {
      key: char,
      code: 'Key' + (char.toUpperCase() || 'A'),
      bubbles: true,
      cancelable: true
    });
    const keyEventUp = new KeyboardEvent('keyup', {
      key: char,
      code: 'Key' + (char.toUpperCase() || 'A'),
      bubbles: true,
      cancelable: true
    });
    document.dispatchEvent(keyEventDown);
    document.dispatchEvent(keyEventUp);

    // Also trigger custom activity heartbeat
    window.dispatchEvent(new CustomEvent('kuro_activity_heartbeat', { detail: { time: Date.now() } }));
  } catch (e) {}
}

// Terminal logger
function logTerminal(tag, message) {
  const logsContainer = document.getElementById('terminal-logs');
  if (!logsContainer) return;
  const now = new Date().toTimeString().split(' ')[0];
  const div = document.createElement('div');
  div.className = 'log-entry';
  
  let tagClass = 'system';
  if (tag === 'GEMINI') tagClass = 'gemini';
  if (tag === 'ACTIVITY') tagClass = 'activity';
  if (tag === 'WARN') tagClass = 'warning';

  div.innerHTML = `
    <span class="log-time">[${now}]</span>
    <span class="log-tag ${tagClass}">[${tag}]</span>
    <span class="log-msg">${escapeHtml(message)}</span>
  `;
  logsContainer.appendChild(div);
  logsContainer.scrollTop = logsContainer.scrollHeight;

  // Limit terminal history
  while (logsContainer.children.length > 80) {
    logsContainer.removeChild(logsContainer.firstChild);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

// Highlight Code syntax smoothly
function syntaxHighlight(code, lang) {
  let escaped = escapeHtml(code);
  
  // Keyword highlighting
  const keywords = ['import', 'from', 'export', 'default', 'function', 'class', 'const', 'let', 'var', 'async', 'await', 'return', 'def', 'if', 'else', 'elif', 'for', 'while', 'in', 'package', 'struct', 'type', 'using', 'namespace', 'public', 'private'];
  const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  escaped = escaped.replace(keywordRegex, '<span class="token-keyword">$1</span>');

  // Strings
  escaped = escaped.replace(/(["'`])(.*?)\1/g, '<span class="token-string">$1$2$1</span>');

  // Numbers
  escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="token-number">$1</span>');

  // Comments
  escaped = escaped.replace(/(\/\/.*?$|#.*?$|\/\*[\s\S]*?\*\/)/gm, '<span class="token-comment">$1</span>');

  // Functions
  escaped = escaped.replace(/\b([a-zA-Z0-9_]+)(?=\()/g, '<span class="token-function">$1</span>');

  return escaped;
}

// Gemini API Code Generator
async function fetchGeminiCode() {
  if (!state.apiKey) {
    logTerminal('GEMINI', 'No Gemini API Key provided. Switching seamlessly to Local Infinite Mega-Library.');
    return getLocalRandomSnippet();
  }

  state.isFetchingAI = true;
  document.getElementById('ai-status').textContent = 'Generating with Gemini AI...';
  logTerminal('GEMINI', 'Querying Gemini API for next high-impact coding challenge...');

  const activeFile = state.files[state.activeTab];
  const lang = activeFile ? activeFile.lang : 'javascript';

  const topics = [
    'Write a high-performance concurrent task pipeline with worker pool in ' + lang,
    'Write a complete mini 2D game physics engine with collision detection in ' + lang,
    'Write a real-time WebSocket distributed pub-sub message broker in ' + lang,
    'Write an advanced data structure like Red-Black Tree or Skip List with unit tests in ' + lang,
    'Write an automated quantitative trading algorithm with risk management in ' + lang,
    'Write a decentralized blockchain ledger with proof-of-work mining in ' + lang,
    'Write a neural network forward/backpropagation implementation from scratch in ' + lang,
    'Write an optimized microservice API with cache layer and rate limiting in ' + lang
  ];

  const randomTopic = topics[Math.floor(Math.random() * topics.length)];

  const prompt = `You are a world-class senior software engineer. Write a realistic, clean, beautiful, and complete code solution for:
${randomTopic}

Rules:
1. ONLY return pure executable code.
2. Do NOT use markdown code blocks (\`\`\`), no conversational intro or outro.
3. Include realistic comments, variables, and comprehensive logic (around 40-70 lines).`;

  try {
    const isBearer = state.apiKey.startsWith('AQ.') || state.apiKey.startsWith('ya29.');
    const url = isBearer 
      ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
      : `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${state.apiKey}`;

    const headers = { 'Content-Type': 'application/json' };
    if (isBearer) {
      headers['Authorization'] = `Bearer ${state.apiKey}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1200
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    rawText = rawText.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();

    if (rawText.length > 20) {
      logTerminal('GEMINI', `Generated ${rawText.split('\n').length} lines of AI code successfully.`);
      state.isFetchingAI = false;
      document.getElementById('ai-status').textContent = 'Gemini 1.5 Flash Connected';
      return rawText;
    } else {
      throw new Error('Empty response from Gemini');
    }
  } catch (err) {
    logTerminal('WARN', `Gemini API Request failed: ${err.message}. Using built-in engine.`);
    state.isFetchingAI = false;
    document.getElementById('ai-status').textContent = 'Using Local Engine';
    return getLocalRandomSnippet();
  }
}

// Get Random fallback code
function getLocalRandomSnippet() {
  const snippet = fallbackSnippets[Math.floor(Math.random() * fallbackSnippets.length)];
  if (snippet.file !== state.activeTab && state.files[snippet.file]) {
    switchTab(snippet.file);
  }
  return snippet.code;
}

// Switch active file tab
function switchTab(fileName) {
  if (!state.files[fileName]) return;
  state.activeTab = fileName;

  // Update tabs UI
  document.querySelectorAll('.tab').forEach(el => {
    el.classList.toggle('active', el.dataset.file === fileName);
  });
  document.querySelectorAll('.file-item').forEach(el => {
    el.classList.toggle('active', el.dataset.file === fileName);
  });

  const activeFile = state.files[fileName];
  document.getElementById('status-lang').textContent = activeFile.lang.toUpperCase();

  // Reset or continue buffer for file
  if (!state.fileContents[fileName]) {
    state.fileContents[fileName] = '';
  }
  renderEditor();
}

// Next buffer loader
async function prepareNextCodeBuffer() {
  const nextCode = await fetchGeminiCode();
  state.currentCodeBuffer = `\n\n// ==========================================\n// [AUTO-STREAM SESSION TICK] ${new Date().toLocaleTimeString()}\n// ==========================================\n` + nextCode;
  state.bufferIndex = 0;
}

// Main Typing Logic
async function handleTypingTick() {
  if (!state.isRunning) return;

  if (state.bufferIndex >= state.currentCodeBuffer.length) {
    if (!state.isFetchingAI) {
      await prepareNextCodeBuffer();
    }
    return;
  }

  // Calculate characters to type based on speed
  let charsToType = 1;
  if (state.speed === 'human') {
    charsToType = Math.random() > 0.3 ? 1 : 0; // Natural rhythm & pauses
  } else if (state.speed === 'fast') {
    charsToType = Math.floor(Math.random() * 2) + 1; // 1-2 chars
  } else if (state.speed === 'turbo') {
    charsToType = Math.floor(Math.random() * 6) + 3; // 3-8 chars
  } else if (state.speed === 'instant') {
    charsToType = 25; // Massive chunk
  }

  if (charsToType <= 0) return;

  const nextChunk = state.currentCodeBuffer.slice(state.bufferIndex, state.bufferIndex + charsToType);
  state.bufferIndex += charsToType;

  // Append to current file content
  state.fileContents[state.activeTab] = (state.fileContents[state.activeTab] || '') + nextChunk;
  state.totalKeystrokes += nextChunk.length;

  // Play keyboard sound
  playKeyClick();

  // Dispatch simulated events
  dispatchKeystrokeActivity(nextChunk.slice(-1));

  // Render editor
  renderEditor();

  // Auto-switch tabs periodically to simulate multi-file developer workflow
  if (Math.random() < 0.003 && Object.keys(state.files).length > 1) {
    const fileKeys = Object.keys(state.files);
    const randomFile = fileKeys[Math.floor(Math.random() * fileKeys.length)];
    if (randomFile !== state.activeTab) {
      logTerminal('ACTIVITY', `Switched active editor workspace to ${randomFile}`);
      switchTab(randomFile);
    }
  }
}

// Render Editor DOM
function renderEditor() {
  const content = state.fileContents[state.activeTab] || '';
  const lines = content.split('\n');
  state.totalLines = lines.length;

  const lineNumbersEl = document.getElementById('line-numbers');
  const codeContentEl = document.getElementById('code-content');
  const activeFile = state.files[state.activeTab];

  // Generate line numbers
  let lineNumbersHtml = '';
  for (let i = 1; i <= Math.max(lines.length, 25); i++) {
    lineNumbersHtml += `<div>${i}</div>`;
  }
  lineNumbersEl.innerHTML = lineNumbersHtml;

  // Render code with syntax highlighting & cursor
  codeContentEl.innerHTML = syntaxHighlight(content, activeFile ? activeFile.lang : 'javascript') + '<span class="cursor-blink"></span>';

  // Auto-scroll to bottom
  const codeWindow = document.getElementById('code-window');
  codeWindow.scrollTop = codeWindow.scrollHeight;

  // Update counters
  document.getElementById('stat-lines').textContent = state.totalLines.toLocaleString();
  document.getElementById('stat-keystrokes').textContent = state.totalKeystrokes.toLocaleString();
}

// Session Timer and Earning Calculator Loop
setInterval(() => {
  if (!state.isRunning) return;

  state.totalSeconds += 1;

  // Calculate earnings: rate / 3600 per second
  const perSecondRate = state.hourlyRate / 3600;
  state.totalEarnings = state.totalSeconds * perSecondRate;

  // Format Timer
  const hrs = Math.floor(state.totalSeconds / 3600).toString().padStart(2, '0');
  const mins = Math.floor((state.totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const secs = (state.totalSeconds % 60).toString().padStart(2, '0');
  document.getElementById('stat-timer').textContent = `${hrs}:${mins}:${secs}`;

  // Format Earnings
  document.getElementById('stat-earnings').textContent = `₹${state.totalEarnings.toFixed(2)}`;

  // Status bar updates
  document.getElementById('footer-cursor-pos').textContent = `Ln ${state.totalLines}, Col ${state.bufferIndex % 40}`;

  // Periodic heartbeat log
  if (state.totalSeconds % 60 === 0) {
    logTerminal('ACTIVITY', `Heartbeat ping: Active ${hrs}h ${mins}m | Total Earned: ₹${state.totalEarnings.toFixed(2)}`);
  }
}, 1000);

// Set typing speed interval
function updateSpeed(newSpeed) {
  state.speed = newSpeed;
  let interval = 30;
  if (newSpeed === 'human') interval = 75;
  if (newSpeed === 'fast') interval = 35;
  if (newSpeed === 'turbo') interval = 15;
  if (newSpeed === 'instant') interval = 10;

  if (worker) {
    worker.postMessage({ action: 'setInterval', interval });
  }
}

// Toggle Start / Pause
function toggleRunning() {
  state.isRunning = !state.isRunning;
  const toggleBtn = document.getElementById('btn-toggle');
  const statusBadge = document.getElementById('status-badge');
  const statusText = document.getElementById('status-text');

  if (state.isRunning) {
    toggleBtn.innerHTML = `<span>⏸️</span> Pause`;
    toggleBtn.className = 'btn btn-secondary';
    statusBadge.className = 'status-badge';
    statusText.textContent = 'LIVE CODING ACTIVE';
    logTerminal('SYSTEM', 'Auto-Coding loop started. Activity tracker active.');
    requestWakeLock();

    if (!state.currentCodeBuffer) {
      prepareNextCodeBuffer();
    }

    let interval = 35;
    if (state.speed === 'human') interval = 75;
    if (state.speed === 'turbo') interval = 15;
    if (state.speed === 'instant') interval = 10;
    if (worker) worker.postMessage({ action: 'start', interval });
  } else {
    toggleBtn.innerHTML = `<span>▶️</span> Start Auto-Code`;
    toggleBtn.className = 'btn btn-primary';
    statusBadge.className = 'status-badge paused';
    statusText.textContent = 'PAUSED';
    logTerminal('SYSTEM', 'Session paused.');
    if (worker) worker.postMessage({ action: 'stop' });
  }
}

// Sound Toggle
function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  const soundBtn = document.getElementById('btn-sound');
  if (state.soundEnabled) {
    soundBtn.innerHTML = `<span>🔊</span> Sound ON`;
    soundBtn.className = 'btn btn-primary';
    playKeyClick();
  } else {
    soundBtn.innerHTML = `<span>🔇</span> Sound Muted`;
    soundBtn.className = 'btn btn-secondary';
  }
}

// Clear Editor
function clearEditor() {
  state.fileContents[state.activeTab] = '';
  state.bufferIndex = 0;
  renderEditor();
  logTerminal('SYSTEM', `Cleared workspace for ${state.activeTab}`);
}

// Settings Modal
function openSettingsModal() {
  document.getElementById('input-api-key').value = state.apiKey;
  document.getElementById('input-hourly-rate').value = state.hourlyRate;
  document.getElementById('settings-modal').classList.add('active');
}

function closeSettingsModal() {
  document.getElementById('settings-modal').classList.remove('active');
}

function saveSettings() {
  const newApiKey = document.getElementById('input-api-key').value.trim();
  const newRate = parseFloat(document.getElementById('input-hourly-rate').value) || 100;

  state.apiKey = newApiKey;
  state.hourlyRate = newRate;
  localStorage.setItem('kuro_gemini_api_key', newApiKey);

  document.getElementById('rate-label').textContent = `₹${newRate}/hr`;
  logTerminal('SYSTEM', `Settings updated: Rate = ₹${newRate}/hr, Gemini API Key = ${newApiKey ? 'Configured (Active)' : 'None'}`);
  closeSettingsModal();
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initWorker();

  // Populate sidebar file list
  const fileListEl = document.getElementById('file-list');
  const tabsContainer = document.getElementById('editor-tabs');

  fileListEl.innerHTML = '';
  tabsContainer.innerHTML = '';

  Object.entries(state.files).forEach(([fileName, data], index) => {
    // Sidebar item
    const li = document.createElement('li');
    li.className = `file-item ${index === 0 ? 'active' : ''}`;
    li.dataset.file = fileName;
    li.innerHTML = `<span class="file-icon">${data.icon}</span> <span>${data.name}</span>`;
    li.addEventListener('click', () => switchTab(fileName));
    fileListEl.appendChild(li);

    // Tab
    const tab = document.createElement('div');
    tab.className = `tab ${index === 0 ? 'active' : ''}`;
    tab.dataset.file = fileName;
    tab.innerHTML = `<span>${data.icon}</span> <span>${data.name}</span>`;
    tab.addEventListener('click', () => switchTab(fileName));
    tabsContainer.appendChild(tab);
  });

  // Event Listeners
  document.getElementById('btn-toggle').addEventListener('click', toggleRunning);
  document.getElementById('btn-sound').addEventListener('click', toggleSound);
  document.getElementById('btn-clear').addEventListener('click', clearEditor);
  document.getElementById('btn-settings').addEventListener('click', openSettingsModal);
  document.getElementById('btn-save-settings').addEventListener('click', saveSettings);
  document.getElementById('btn-close-modal').addEventListener('click', closeSettingsModal);

  document.getElementById('speed-select').addEventListener('change', (e) => {
    updateSpeed(e.target.value);
  });

  // Initial logs & editor render
  logTerminal('SYSTEM', 'Kuro AI Auto-Coder initialized successfully.');
  logTerminal('SYSTEM', 'Background Worker & Anti-Throttle Keep-Alive initialized.');
  if (state.apiKey) {
    logTerminal('GEMINI', 'Gemini API Key loaded from local cache.');
    document.getElementById('ai-status').textContent = 'Gemini 1.5 Flash Connected';
  } else {
    document.getElementById('ai-status').textContent = 'Local Mega-Library Ready';
  }

  renderEditor();
});
