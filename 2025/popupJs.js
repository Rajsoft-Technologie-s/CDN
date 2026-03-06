(function (window) {

class PopupJs {
    constructor() {
        this.modal = null;
        this.closeBtn = null;
        this.confirmBtn = null;
        this.cancelBtn = null;
        this._onKeyDown = this._onKeyDown.bind(this);
    }

    _createModal() {
        if (this.modal) return;

        this.modal = document.createElement("div");

        const style = document.createElement("style");
        style.innerHTML = `
        .popupjs-footer button{ color:black !important; }
        .model-box {width: 400px;}
        @media (max-width: 600px) { .model-box {width: 90%;}}
        `;
        document.head.appendChild(style);

        Object.assign(this.modal.style, {
            display: "none",
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "200000"
        });

        this.modal.innerHTML = `
        <div class="model-box" style="background:white;border-radius:4px;text-align:left;box-shadow:0 0 10px rgba(0,0,0,0.3);position:relative;">
        
        <span style="position:absolute;margin-top:12px;right:11px;font-size:23px;cursor:pointer;" class="popupjs-modal-close">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
        <path d="M4.707 3.293 3.293 4.707 10.586 12 3.293 19.293 4.707 20.707 12 13.414 19.293 20.707 20.707 19.293 13.414 12 20.707 4.707 19.293 3.293 12 10.586z"/>
        </svg>
        </span>

        <b style="position:absolute;top:12px;left:15px;font-size:14px;color:#000" class="popupjs-modal-title"></b>

        <div style="display:flex;align-items:center;gap:10px;padding:20px;margin-top:30px;" class="popupjs-modal-body">
        <div class="popupjs-modal-icon"></div>
        <div style="color:#000" class="popupjs-modal-message"></div>
        </div>

        <div class="popupjs-footer" style="padding:10px;border-top:1px solid #e3e3e3;text-align:right;border-bottom-left-radius:3px;border-bottom-right-radius:3px;">
        <button class="btn border-0 pb-1 pt-1 confirm-btn">Close</button>
        <button class="btn border-0 pb-1 pt-1 cancel-btn">Cancel</button>
        </div>

        </div>`;

        this.closeBtn = this.modal.querySelector(".popupjs-modal-close");
        this.confirmBtn = this.modal.querySelector(".confirm-btn");
        this.cancelBtn = this.modal.querySelector(".cancel-btn");

        this.closeBtn.addEventListener("click", () => this.close());
        this.cancelBtn.addEventListener("click", () => this.close());
    }

    show({ title, message, type = "info", showCancel = false, onConfirm = null }) {

        this._createModal();

        if (!document.body.contains(this.modal)) {
            document.body.appendChild(this.modal);
        }

        document.body.style.overflow = "hidden";

        this.modal.querySelector(".popupjs-modal-title").innerHTML = title;
        this.modal.querySelector(".popupjs-modal-message").innerHTML =
            `<p style="margin:0">${message}</p>`;

        this.modal.querySelector(".popupjs-modal-icon").innerHTML =
            this.getIcon(type);

        this.modal.style.display = "flex";

        if (showCancel) {
            this.confirmBtn.innerText = "Yes";
            this.cancelBtn.innerText = "Cancel";
            this.cancelBtn.style.display = "inline-block";
        } else {
            this.confirmBtn.innerText = "Close";
            this.cancelBtn.style.display = "none";
        }

        this.confirmBtn.onclick = () => {
            if (onConfirm) onConfirm();
            this.close();
        };

        window.addEventListener("keydown", this._onKeyDown);
    }

    close() {
        if (this.modal) {
            this.modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
        window.removeEventListener("keydown", this._onKeyDown);
    }

    _onKeyDown(e) {
        if (e.key === "Escape") this.close();
    }

    getIcon(type) {

        const icons = {
            success: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAA...", 
            error: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAA...", 
            info: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAA...", 
            confirm: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAA..."
        };

        return `<img style="opacity:0.9;width:35px" src="${icons[type]}">`;
    }
}

const popup = new PopupJs();

/* PUBLIC API */

const PopupJS = {

    alert(message) {
        popup.show({
            title: "Info",
            message,
            type: "info"
        });
    },

    success(message) {
        popup.show({
            title: "Success",
            message,
            type: "success"
        });
    },

    error(message) {
        popup.show({
            title: "Error",
            message,
            type: "error"
        });
    },

    confirm(message) {

        return new Promise((resolve) => {

            popup.show({
                title: "Confirm",
                message,
                type: "confirm",
                showCancel: true,
                onConfirm: () => resolve(true)
            });

        });
    }
};

window.PopupJS = PopupJS;

})(window);
