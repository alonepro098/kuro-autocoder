"""
KURO WINDOWS APP - AI PROMPT & CODE STREAMER BOT
Simulates a real developer workflow like ChatGPT / DeepSeek / Claude:
1. Types a realistic coding prompt / question with comment tags.
2. Simulates "Thinking & Generating..." pause with square mouse inspection.
3. Streams the complete, production-grade code response character-by-character.
4. Smooth square mouse movement to keep Kuro App active and rewarded.
"""

import os
import ctypes
import json
import random
import sys
import time
import math
import urllib.request
from ctypes import wintypes

user32 = ctypes.windll.user32
kernel32 = ctypes.windll.kernel32

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")

PROMPT_LIBRARY = [
    {
        "prompt": "Create a high-performance LRU Cache with O(1) get and put operations in Python.",
        "code": """class Node:
    def __init__(self, key, value):
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

    def _remove(self, node):
        prev = node.prev
        nxt = node.next
        prev.next = nxt
        nxt.prev = prev

    def _add(self, node):
        nxt = self.head.next
        self.head.next = node
        node.prev = self.head
        node.next = nxt
        nxt.prev = node

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._add(node)
            return node.value
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        node = Node(key, value)
        self._add(node)
        self.cache[key] = node
        if len(self.cache) > self.capacity:
            lru = self.tail.prev
            self._remove(lru)
            del self.cache[lru.key]

# Testing LRU Cache Implementation
cache = LRUCache(2)
cache.put(1, 100)
cache.put(2, 200)
print("Get 1:", cache.get(1))
cache.put(3, 300)
print("Get 2 (evicted):", cache.get(2))
"""
    },
    {
        "prompt": "Write a WebSocket real-time pub/sub client with auto-reconnection in JavaScript.",
        "code": """class ResilientWebSocketClient {
  constructor(url, options = {}) {
    this.url = url;
    this.reconnectInterval = options.reconnectInterval || 3000;
    this.maxRetries = options.maxRetries || 10;
    this.retryCount = 0;
    this.subscriptions = new Map();
    this.ws = null;
    this.init();
  }

  init() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      console.log('[WS] Connected successfully to telemetry server.');
      this.retryCount = 0;
      this.resubscribeAll();
    };

    this.ws.onmessage = (event) => {
      try {
        const { channel, payload } = JSON.parse(event.data);
        if (this.subscriptions.has(channel)) {
          this.subscriptions.get(channel).forEach(cb => cb(payload));
        }
      } catch (err) {
        console.error('[WS] Parse error:', err);
      }
    };

    this.ws.onclose = () => {
      console.warn('[WS] Connection closed. Attempting reconnect...');
      this.handleReconnect();
    };
  }

  handleReconnect() {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      setTimeout(() => this.init(), this.reconnectInterval);
    }
  }

  subscribe(channel, callback) {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, []);
    }
    this.subscriptions.get(channel).push(callback);
  }

  resubscribeAll() {
    for (const channel of this.subscriptions.keys()) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ action: 'subscribe', channel }));
      }
    }
  }
}
"""
    },
    {
        "prompt": "Implement a Thread-Safe Concurrent Queue in C++ with condition variables.",
        "code": """#include <iostream>
#include <queue>
#include <mutex>
#include <condition_variable>
#include <thread>
#include <vector>

template <typename T>
class ConcurrentQueue {
private:
    std::queue<T> queue_;
    mutable std::mutex mutex_;
    std::condition_variable cond_;

public:
    void push(T value) {
        std::lock_guard<std::mutex> lock(mutex_);
        queue_.push(std::move(value));
        cond_.notify_one();
    }

    bool pop(T& value) {
        std::unique_lock<std::mutex> lock(mutex_);
        cond_.wait(lock, [this] { return !queue_.empty(); });
        value = std::move(queue_.front());
        queue_.pop();
        return true;
    }

    bool empty() const {
        std::lock_guard<std::mutex> lock(mutex_);
        return queue_.empty();
    }
};

int main() {
    ConcurrentQueue<int> taskQueue;
    std::vector<std::thread> producers;
    for (int i = 0; i < 3; ++i) {
        producers.emplace_back([&taskQueue, i] {
            taskQueue.push(i * 10);
        });
    }
    for (auto& p : producers) p.join();
    return 0;
}
"""
    },
    {
        "prompt": "Design a Distributed Token Bucket Rate Limiter with Redis in Python.",
        "code": """import time
import redis

class RedisTokenBucketRateLimiter:
    def __init__(self, redis_client, key_prefix="rate_limit:", capacity=60, fill_rate=1.0):
        self.client = redis_client
        self.prefix = key_prefix
        self.capacity = capacity
        self.fill_rate = fill_rate

    def is_allowed(self, user_id: str, tokens_requested: int = 1) -> bool:
        key = f"{self.prefix}{user_id}"
        now = time.time()
        
        pipe = self.client.pipeline()
        pipe.hgetall(key)
        res = pipe.execute()[0]

        if not res:
            tokens = self.capacity - tokens_requested
            last_updated = now
            self.client.hset(key, mapping={"tokens": tokens, "last_updated": last_updated})
            return True

        last_tokens = float(res.get(b"tokens", self.capacity))
        last_updated = float(res.get(b"last_updated", now))

        # Calculate replenished tokens
        elapsed = now - last_updated
        current_tokens = min(self.capacity, last_tokens + elapsed * self.fill_rate)

        if current_tokens >= tokens_requested:
            current_tokens -= tokens_requested
            self.client.hset(key, mapping={"tokens": current_tokens, "last_updated": now})
            return True
        return False
"""
    }
]

AI_TOPICS = [
    "Write a complete A* pathfinding algorithm on 2D grid with visualization in Python",
    "Build a custom reactive State Management Store similar to Zustand in TypeScript/JavaScript",
    "Write an async task queue worker pipeline with retry exponential backoff in Python",
    "Implement an efficient Trie (Prefix Tree) with auto-complete search in C++",
    "Create a JWT authentication middleware with CSRF protection in Node.js/Express",
    "Write a Convolutional Neural Network forward pass from scratch in Python",
    "Implement a Memory-Mapped File IPC mechanism in C++"
]

def fetch_ai_prompt_and_code():
    chosen_topic = random.choice(AI_TOPICS)
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
        headers = {"Content-Type": "application/json"}
        prompt_instruction = f"""Generate a detailed, realistic user coding question/prompt about: "{chosen_topic}".
Then provide the complete, clean, professional code solution.
Format your output EXACTLY as:
PROMPT: <The user question / task prompt>
CODE:
<The complete pure code solution without backticks>"""

        payload = json.dumps({
            "contents": [{"parts": [{"text": prompt_instruction}]}],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 1400
            }
        }).encode("utf-8")

        req = urllib.request.Request(url, data=payload, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            text = res_data["candidates"][0]["content"]["parts"][0]["text"]
            
            if "PROMPT:" in text and "CODE:" in text:
                parts = text.split("CODE:")
                prompt_part = parts[0].replace("PROMPT:", "").strip()
                code_part = parts[1].replace("```python", "").replace("```javascript", "").replace("```cpp", "").replace("```", "").strip()
                return {"prompt": prompt_part, "code": code_part}
    except Exception as e:
        pass
    return random.choice(PROMPT_LIBRARY)

class POINT(ctypes.Structure):
    _fields_ = [("x", wintypes.LONG), ("y", wintypes.LONG)]

class KEYBDINPUT(ctypes.Structure):
    _fields_ = [
        ("wVk", wintypes.WORD),
        ("wScan", wintypes.WORD),
        ("dwFlags", wintypes.DWORD),
        ("time", wintypes.DWORD),
        ("dwExtraInfo", ctypes.c_ulong)
    ]

class MOUSEINPUT(ctypes.Structure):
    _fields_ = [
        ("dx", wintypes.LONG),
        ("dy", wintypes.LONG),
        ("mouseData", wintypes.DWORD),
        ("dwFlags", wintypes.DWORD),
        ("time", wintypes.DWORD),
        ("dwExtraInfo", ctypes.c_ulong)
    ]

class INPUT(ctypes.Structure):
    class _INPUT_UNION(ctypes.Union):
        _fields_ = [("ki", KEYBDINPUT), ("mi", MOUSEINPUT)]
    _anonymous_ = ("_input",)
    _fields_ = [
        ("type", wintypes.DWORD),
        ("_input", _INPUT_UNION)
    ]

INPUT_MOUSE = 0
INPUT_KEYBOARD = 1
KEYEVENTF_UNICODE = 0x0004
KEYEVENTF_KEYUP = 0x0002

def get_mouse_pos():
    pt = POINT()
    user32.GetCursorPos(ctypes.byref(pt))
    return pt.x, pt.y

def set_mouse_pos(x, y):
    user32.SetCursorPos(int(x), int(y))

def move_mouse_smooth(start_x, start_y, target_x, target_y, steps=10, delay=0.007):
    for step in range(1, steps + 1):
        t = step / steps
        ease = t * t * (3.0 - 2.0 * t)
        curr_x = start_x + (target_x - start_x) * ease
        curr_y = start_y + (target_y - start_y) * ease
        set_mouse_pos(curr_x, curr_y)
        time.sleep(delay)

def draw_square_mouse_motion(side_length=70, duration_speed=0.006):
    """Draws a smooth visible square on screen."""
    origin_x, origin_y = get_mouse_pos()
    corners = [
        (origin_x + side_length, origin_y),
        (origin_x + side_length, origin_y + side_length),
        (origin_x, origin_y + side_length),
        (origin_x, origin_y)
    ]
    current_x, current_y = origin_x, origin_y
    for target_x, target_y in corners:
        move_mouse_smooth(current_x, current_y, target_x, target_y, steps=12, delay=duration_speed)
        current_x, current_y = target_x, target_y
        time.sleep(0.015)

def send_character(char):
    code = ord(char)
    inp_down = INPUT()
    inp_down.type = INPUT_KEYBOARD
    inp_down.ki = KEYBDINPUT(0, code, KEYEVENTF_UNICODE, 0, 0)
    user32.SendInput(1, ctypes.byref(inp_down), ctypes.sizeof(INPUT))

    time.sleep(random.uniform(0.012, 0.035))

    inp_up = INPUT()
    inp_up.type = INPUT_KEYBOARD
    inp_up.ki = KEYBDINPUT(0, code, KEYEVENTF_UNICODE | KEYEVENTF_KEYUP, 0, 0)
    user32.SendInput(1, ctypes.byref(inp_up), ctypes.sizeof(INPUT))

    time.sleep(random.uniform(0.008, 0.02))

def type_text(text, speed_multiplier=1.0):
    for char in text:
        send_character(char)
        if random.random() < 0.05:
            time.sleep(random.uniform(0.05, 0.12))

def main():
    print("=" * 70)
    print("    ðŸ¤– KURO AI: CHATGPT / DEEPSEEK STYLE PROMPT & CODE ENGINE ðŸ¤–")
    print("=" * 70)
    print("-> How it works:")
    print("1. Types realistic Coding Questions / Prompts (like user asking ChatGPT/DeepSeek).")
    print("2. Simulates Thinking & Code Synthesis with smooth Square Mouse inspection.")
    print("3. Streams the complete clean code solution into Kuro App.")
    print("4. Keeps Kuro App 100% active with square mouse motions to credit earnings.")
    print("=" * 70)
    print("Click inside the Kuro Desktop App coding editor now!")
    print("Starting in 5 SECONDS countdown...")
    print("=" * 70)

    for i in range(5, 0, -1):
        print(f"Starting in {i} seconds... (Focus Kuro editor now!)")
        time.sleep(1)

    print("\n[+] BOT LIVE! Running interactive Q&A Coding Cycles...\n")
    print("[+] Press Ctrl + C in this window to stop anytime.\n")

    cycle = 1
    start_time = time.time()
    total_chars = 0

    while True:
        elapsed = int(time.time() - start_time)
        hrs = elapsed // 3600
        mins = (elapsed % 3600) // 60
        secs = elapsed % 60
        earnings = (elapsed / 3600.0) * 100.0

        item = fetch_ai_prompt_and_code()
        user_prompt = item["prompt"]
        ai_code = item["code"]

        print(f"[{hrs:02d}:{mins:02d}:{secs:02d}] Cycle #{cycle} | Earned: Rs {earnings:.2f}")
        print(f"  [Q] Question: {user_prompt[:60]}...")

        # 1. Type the User Prompt as a comment / prompt header
        header = f"\n# ========================================================\n" \
                 f"# [USER PROMPT / QUERY]:\n" \
                 f"# {user_prompt}\n" \
                 f"# ========================================================\n" \
                 f"# [AI ASSISTANT (DeepSeek/ChatGPT) RESPONSE]:\n\n"
        
        type_text(header)
        total_chars += len(header)

        # 2. Simulate AI "Thinking" pause with a visible square mouse motion
        print("  [*] Simulating AI Thinking & Code Generation...")
        draw_square_mouse_motion(side_length=random.randint(60, 95))
        time.sleep(0.5)

        # 3. Stream the code response line by line
        lines = ai_code.split("\n")
        for line in lines:
            type_text(line + "\n")
            total_chars += len(line) + 1

            # Square movement during code streaming
            if random.random() < 0.35:
                draw_square_mouse_motion(side_length=random.randint(50, 85))

        # 4. End of cycle inspection
        draw_square_mouse_motion(side_length=75)
        print(f"  [âœ“] Cycle #{cycle} completed successfully!\n")
        time.sleep(1.2)
        cycle += 1

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n[!] Kuro Bot stopped by user.")
