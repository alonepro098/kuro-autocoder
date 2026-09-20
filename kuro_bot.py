"""
Kuro AI Windows Auto-Typer & Physical Mouse Mover
Directly types Gemini code into Kuro / any code editor and moves the physical mouse cursor.
Zero pip packages required (Built-in Windows CTypes API).
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

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")

FALLBACK_CODE = [
    """def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

data = [64, 34, 25, 12, 22, 11, 90]
print("Sorted Array:", merge_sort(data))
""",
    """function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  const copy = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepClone(obj[key]);
    }
  }
  return copy;
}

const original = { user: 'Alice', scores: [98, 87, 95] };
const cloned = deepClone(original);
console.log('Cloned Object:', cloned);
""",
    """#include <iostream>
#include <vector>
#include <numeric>

using namespace std;

int main() {
    vector<int> numbers = {5, 10, 15, 20, 25};
    int total = accumulate(numbers.begin(), numbers.end(), 0);
    double avg = static_cast<double>(total) / numbers.size();
    cout << "Sum: " << total << ", Avg: " << avg << endl;
    return 0;
}
"""
]

def fetch_gemini_code():
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
        headers = {"Content-Type": "application/json"}
        payload = json.dumps({
            "contents": [{"parts": [{"text": "Write 20-30 lines of clean, real, executable programming code in Python or JavaScript with comments. No markdown code blocks."}]}]
        }).encode("utf-8")

        req = urllib.request.Request(url, data=payload, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            text = res_data["candidates"][0]["content"]["parts"][0]["text"]
            text = text.replace("```python", "").replace("```javascript", "").replace("```", "").strip()
            if len(text) > 20:
                return text
    except Exception as e:
        print(f"[!] Gemini API fallback: {e}")
    return random.choice(FALLBACK_CODE)

def move_physical_mouse():
    """Gently moves the real OS physical mouse cursor around active area."""
    class POINT(ctypes.Structure):
        _fields_ = [("x", wintypes.LONG), ("y", wintypes.LONG)]
    
    pt = POINT()
    user32.GetCursorPos(ctypes.byref(pt))
    dx = random.randint(-4, 4)
    dy = random.randint(-4, 4)
    user32.SetCursorPos(pt.x + dx, pt.y + dy)

def type_string(text):
    """Sends real Windows keystrokes for characters."""
    INPUT_KEYBOARD = 1
    KEYEVENTF_UNICODE = 0x0004
    KEYEVENTF_KEYUP = 0x0002

    class KEYBDINPUT(ctypes.Structure):
        _fields_ = [
            ("wVk", wintypes.WORD),
            ("wScan", wintypes.WORD),
            ("dwFlags", wintypes.DWORD),
            ("time", wintypes.DWORD),
            ("dwExtraInfo", ctypes.c_ulong)
        ]

    class INPUT(ctypes.Structure):
        class _INPUT_UNION(ctypes.Union):
            _fields_ = [("ki", KEYBDINPUT)]
        _anonymous_ = ("_input",)
        _fields_ = [
            ("type", wintypes.DWORD),
            ("_input", _INPUT_UNION)
        ]

    for char in text:
        # Move mouse slightly every few chars
        if random.random() < 0.15:
            move_physical_mouse()

        code = ord(char)
        
        # Key down
        inp_down = INPUT()
        inp_down.type = INPUT_KEYBOARD
        inp_down.ki = KEYBDINPUT(0, code, KEYEVENTF_UNICODE, 0, 0)
        user32.SendInput(1, ctypes.byref(inp_down), ctypes.sizeof(INPUT))

        time.sleep(random.uniform(0.02, 0.06))

        # Key up
        inp_up = INPUT()
        inp_up.type = INPUT_KEYBOARD
        inp_up.ki = KEYBDINPUT(0, code, KEYEVENTF_UNICODE | KEYEVENTF_KEYUP, 0, 0)
        user32.SendInput(1, ctypes.byref(inp_up), ctypes.sizeof(INPUT))

        time.sleep(random.uniform(0.01, 0.03))

def main():
    print("=" * 60)
    print("      KURO AI PHYSICAL AUTO-TYPER & MOUSE BOT")
    print("=" * 60)
    print("-> Instructions:")
    print("1. Open your Kuro website editor in Chrome/Edge.")
    print("2. Click inside the Kuro code editor box to focus cursor.")
    print("3. You have 5 SECONDS countdown now before typing begins!")
    print("4. To STOP the bot anytime, simply close this terminal window.")
    print("=" * 60)

    for i in range(5, 0, -1):
        print(f"Starting in {i} seconds... (Click on Kuro editor now!)")
        time.sleep(1)

    print("\n[+] BOT ACTIVE! Typing code and moving mouse automatically...")
    
    cycle = 1
    while True:
        print(f"\n--- [Cycle #{cycle}] Fetching & Typing Code ---")
        code = fetch_gemini_code()
        type_string(code + "\n\n")
        
        # Nudge mouse and rest briefly
        for _ in range(5):
            move_physical_mouse()
            time.sleep(0.5)
            
        cycle += 1

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n[!] Bot stopped by user.")
