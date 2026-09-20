// Web Worker to maintain continuous typing and timer ticks even when the browser tab is in the background
let timerId = null;

self.onmessage = function (e) {
  const { action, interval } = e.data;
  if (action === 'start') {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      self.postMessage({ type: 'tick' });
    }, interval || 25);
  } else if (action === 'setInterval') {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      self.postMessage({ type: 'tick' });
    }, interval || 25);
  } else if (action === 'stop') {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }
};
