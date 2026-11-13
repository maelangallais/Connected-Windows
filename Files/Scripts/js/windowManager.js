
class WindowManager {
    #id;
    #rank;
    #count;
    #shape;
    #windows;

    constructor() {
        window.onload = this.Init();
        //I only have one eventListener because it isn't really reliable so I check everything by myself
        window.addEventListener("beforeunload", () => { this.Close(); });
    }

    Init() {
        let data = localStorage.getItem('windows');
        if (!data) localStorage.setItem('windows', []);
        this.#windows = data ? JSON.parse(data) : [];

        this.UpdateLocalStorage();

        const id = crypto.randomUUID();
        this.#id = id;
        document.querySelector('#id .value').textContent = this.#id;

        const shape = this.GetWindowShape();
        this.#shape = shape;
        document.querySelector('#shape .value').textContent = JSON.stringify(this.#shape);

        this.#windows.push({
            id: id,
            shape: shape,
            timestamp: Date.now()
        });
        this.UpdateWindowsLocalStorage();

        const count = this.#windows.length;
        this.#count = count;
        document.querySelector('#count .value').textContent = this.#count;

        const rank = count - 1;
        this.#rank = rank;
        document.querySelector('#rank .value').textContent = this.#rank;
    }
    Close() {
        for (let i = 0; i < this.#windows.length; i++) {
            if (this.#windows[i].id == this.#id) {
                this.#windows.splice(i, 1);
                break;
            }
        }
        this.UpdateWindowsLocalStorage();
    }



    UpdateShape() {
        const winShape = this.GetWindowShape();

        if (this.#shape.x != winShape.x ||
            this.#shape.y != winShape.y ||
            this.#shape.w != winShape.w ||
            this.#shape.h != winShape.h
        ) {
            const index = this.GetWindowIndexFromId(this.#id);

            this.#shape = winShape;
            this.#windows[index].shape = this.#shape;
            document.querySelector('#shape .value').textContent = JSON.stringify(this.#shape);

            this.UpdateWindowsLocalStorage();
        }
    }
    UpdateLocalStorage() {
        const idToDelete = [];
        for (const win of this.#windows) {
            if (win.id == this.#id) {
                win.timestamp = Date.now();
            } else if (Date.now() - win.timestamp > 3000) {
                idToDelete.push(win.id);
            }
        }

        for (const id of idToDelete) {
            const index = this.GetWindowIndexFromId(id);
            this.#windows.splice(index, 1);
        }

        this.UpdateWindowsLocalStorage();
    }
    UpdateRank() {
        const windows = this.#windows;
        const numWins = windows.length;

        for (let i = 0; i < numWins; i++) {
            if (windows[i].id == this.#id) {
                this.#rank = i;
                document.querySelector('#rank .value').textContent = this.#rank;
                break;
            }
        }

        this.#count = numWins;
        document.querySelector('#count .value').textContent = this.#count;
    }



    UpdateWindowsLocalStorage() {
        localStorage.setItem('windows', JSON.stringify(this.#windows));
    }



    GetWindowIndexFromId(id) {
        const windows = this.#windows;
        let index = -1;

        for (let i = 0; i < windows.length; i++) {
            if (windows[i].id == id) {
                index = i;
                break;
            }
        }

        return index;
    }
    GetWindowShape() {
        const shape = {
            x: window.screenLeft,
            y: window.screenTop,
            w: window.innerWidth,
            h: window.innerHeight
        };

        return shape;
    }



    GetWindowId() {
        return this.#id;
    }
    SetWindows(windows) {
        this.#windows = windows;
    }
}
