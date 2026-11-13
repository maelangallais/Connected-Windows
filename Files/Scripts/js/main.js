
const thisWindow = new WindowManager();


window.addEventListener('visibilitychange', UpdateWindowPresence);
window.addEventListener('focus', UpdateWindowPresence);
function UpdateWindowPresence() {
    if (document.visibilityState != 'hidden') {
        const windows = JSON.parse(localStorage.getItem('windows'));
        const winId = thisWindow.GetWindowId();

        if (!windows.some(win => win.id == winId)) thisWindow.Init();
    }
}


const workerCode = /* js */ `
    let intervalId;
    self.onmessage = function(e) {
        if (e.data === 'start') {
            intervalId = setInterval(() => {
                self.postMessage('tick');
            }, 16);
        } else if (e.data === 'stop') {
            clearInterval(intervalId);
        }
    };
`;
const blob = new Blob([workerCode], { type: "application/javascript" });
const worker = new Worker(URL.createObjectURL(blob));

worker.onmessage = function (e) {
    if (e.data === 'tick') {
        VitalUpdate();
    }
};


function Tick() {
    VitalUpdate();

    requestAnimationFrame(Tick);
}


function VitalUpdate() {
    const windows = JSON.parse(localStorage.getItem('windows'));
    thisWindow.SetWindows(windows);

    thisWindow.UpdateShape();
    thisWindow.UpdateLocalStorage();
    thisWindow.UpdateRank();
}


//These two methods work the same but the worker keeps updating a little more often than the rAF when the window is visible elsewhere on the screen but not focused. The worker is more reliable because sometimes if the window is partially hidden, chrom consider it completely hidden and stop every rAF so it doesn't update at all...
// requestAnimationFrame(Tick);
worker.postMessage('start');
