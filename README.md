# 🪟 Connected Windows

A lightweight browser utility that synchronizes multiple open tabs or windows in real time using `localStorage` and a Web Worker heartbeat. Each window tracks and displays its unique UUID, active rank, total window count, and screen geometry (`x`, `y`, `w`, `h`).

While minimal on its own, it is designed as a clean building block for multi-window visual effects, synchronized canvases, or cross-window web experiments.

## ✨ Features

- **Real-Time Window Registry**: Assigns each window a `crypto.randomUUID()` identifier and stores its screen position (`window.screenLeft`, `window.screenTop`) and viewport size (`window.innerWidth`, `window.innerHeight`) in `localStorage`.
- **Web Worker Heartbeat (~60 Hz)**: Uses an inline Blob Web Worker (`setInterval` at 16 ms) instead of `requestAnimationFrame` so updates continue reliably even when a window is unfocused or partially occluded.
- **Automatic Stale Cleanup**: Removes windows whose timestamp has not been updated for more than 3000 ms, alongside `beforeunload` cleanup and `visibilitychange` / `focus` re-registration.
- **Live Rank & Count**: Automatically recalculates each window's rank and the total number of active windows.

## 📂 Project Structure

```text
Connected-Windows/
├── index.html
└── Files/
    └── Scripts/
        ├── css/
        │   └── main.css
        └── js/
            ├── windowManager.js    # WindowManager class & localStorage state sync
            └── main.js             # Web Worker loop & lifecycle listeners
```

## 🖥️ Requirements & Platform

- Any modern web browser supporting `localStorage`, Web Workers (`Blob` URLs), and `crypto.randomUUID()`.
- Open `index.html` in two or more tabs/windows under the **same origin** to see them synchronize.

## ⚠️ Notes & Limitations

- Because `localStorage` is scoped by origin, serving the project over a local HTTP server (e.g., `localhost`) is recommended; `file://` origin isolation varies between browsers.
- `crypto.randomUUID()` requires a secure context (`https://` or `localhost`, though most browsers also allow it on `file://`).
- If a tab is completely backgrounded/hidden, browsers may still throttle timers or `localStorage` writes, causing it to be temporarily pruned after 3000 ms until focused again (at which point `UpdateWindowPresence` re-initializes it).

## 🛠️ Details

The project has been created the January 31st of 2026.
