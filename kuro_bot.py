"""
KURO WINDOWS APP AUTO-TYPER & PHYSICAL MOUSE ENGINE
Specialized for KuroWindows desktop application.
Uses native Windows Win32 API (Zero pip dependencies).
"""

import os
import ctypes
import json
import random
import sys
import time
import urllib.request
from ctypes import wintypes

user32 = ctypes.windll.user32
kernel32 = ctypes.windll.kernel32

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")

FALLBACK_CODE = [
    """def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

numbers = [38, 27, 43, 3, 9, 82, 10]
print("Sorted output:", quick_sort(numbers))
""",
    """import asyncio
import time

async def worker_task(task_id, delay):
    print(f"Starting async worker task #{task_id}...")
    await asyncio.sleep(delay)
    return f"Task #{task_id} completed successfully at {time.time()}"

async def main():
    tasks = [worker_task(i, 0.5) for i in range(1, 6)]
    results = await asyncio.gather(*tasks)
    for res in results:
        print(res)

if __name__ == "__main__":
    asyncio.run(main())
""",
    """function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const handleResize = debounce(() => {
  console.log('Window resized efficiently');
}, 250);
window.addEventListener('resize', handleResize);
""",
    """#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    vector<int> v = {4, 2, 5, 1, 3};
    sort(v.begin(), v.end());
    for(int n : v) {
        cout << "Element: " << n << endl;
    }
    return 0;
}
"""
]

def fetch_gemini_code():
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
        headers = {"Content-Type": "application/json"}
        payload = json.dumps({
            "contents": [{"parts": [{"text": "Write 20-30 lines of clean real python or javascript code for algorithmic tasks. No markdown code blocks."}]}]
        }).encode("utf-8")

        req = urllib.request.Request(url, data=payload, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            text = res_data["candidates"][0]["content"]["parts"][0]["text"]
            text = text.replace("```python", "").replace("```javascript", "").replace("```", "").strip()
            if len(text) > 20:
                return text
    except Exception as e:
        pass
    return random.choice(FALLBACK_CODE)

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
MOUSEEVENTF_LEFTDOWN = 0x0002
MOUSEEVENTF_LEFTUP = 0x0004
MOUSEEVENTF_MOVE = 0x0001

def move_and_click_mouse():
    """Gently moves the OS mouse cursor and clicks to ensure Kuro App editor is active."""
    pt = POINT()
    user32.GetCursorPos(ctypes.byref(pt))
    
    # Slight smooth jitter
    dx = random.randint(-5, 5)
    dy = random.randint(-5, 5)
    user32.SetCursorPos(pt.x + dx, pt.y + dy)

def send_character(char):
    """Sends authentic OS Unicode keystroke to currently focused Kuro window."""
    code = ord(char)

    # Key down
    inp_down = INPUT()
    inp_down.type = INPUT_KEYBOARD
    inp_down.ki = KEYBDINPUT(0, code, KEYEVENTF_UNICODE, 0, 0)
    user32.SendInput(1, ctypes.byref(inp_down), ctypes.sizeof(INPUT))

    time.sleep(random.uniform(0.015, 0.045))

    # Key up
    inp_up = INPUT()
    inp_up.type = INPUT_KEYBOARD
    inp_up.ki = KEYBDINPUT(0, code, KEYEVENTF_UNICODE | KEYEVENTF_KEYUP, 0, 0)
    user32.SendInput(1, ctypes.byref(inp_up), ctypes.sizeof(INPUT))

    time.sleep(random.uniform(0.01, 0.03))

def type_code_stream(text):
    for char in text:
        # Move mouse gently during typing
        if random.random() < 0.12:
            move_and_click_mouse()

        send_character(char)

def main():
    print("=" * 65)
    print("      ðŸš€ KURO WINDOWS DESKTOP APP AUTO-CODER ACTIVE ðŸš€")
    print("=" * 65)
    print("1. Open your 'Kuro' Desktop App on your screen.")
    print("2. Click inside the Kuro code editor box to focus it.")
    print("3. Starting auto-coding in 5 SECONDS countdown below...")
    print("=" * 65)

    for i in range(5, 0, -1):
        print(f"Starting in {i} seconds... (Click Kuro code editor now!)")
        time.sleep(1)

    print("\n[+] LIVE! Continuous coding & mouse activity running...")
    print("[+] Press Ctrl + C in this window to stop anytime.\n")

    cycle = 1
    total_chars = 0
    start_time = time.time()

    while True:
        elapsed = int(time.time() - start_time)
        hrs = elapsed // 3600
        mins = (elapsed % 3600) // 60
        secs = elapsed % 60
        earnings = (elapsed / 3600.0) * 100.0

        print(f"[{hrs:02d}:{mins:02d}:{secs:02d}] Cycle #{cycle} | Total Typed: {total_chars} chars | Estimated: Rs {earnings:.2f}")

        # Fetch fresh AI code
        code = fetch_gemini_code()
        
        # Type into Kuro
        type_code_stream(code + "\n\n")
        total_chars += len(code) + 2

        # Idle micro-movement
        for _ in range(4):
            move_and_click_mouse()
            time.sleep(0.4)

        cycle += 1

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n[!] Kuro Bot stopped by user.")
