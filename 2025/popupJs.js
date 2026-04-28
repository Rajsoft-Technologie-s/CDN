(function (window) {
    class PopupJs {
        constructor() {
            this.modal = null;
            this.toastContainers = {};
            this._injectStyles();
        }

        _injectStyles() {
            if (document.getElementById("popupjs-shared-styles")) return;
            const style = document.createElement("style");
            style.id = "popupjs-shared-styles";
            style.innerHTML = `
                /* --- Overlay & Modal --- */
                .popupjs-overlay {
                    display: none; position: fixed; top: 0; left: 0;
                    width: 100%; height: 100%; background: rgba(0,0,0,0.5);
                    justify-content: center; align-items: center; z-index: 999999; padding: 20px;
                }
                .model-box { 
                    width: 100%; max-width: 440px; border-radius: 6px; padding: 24px; 
                    position: relative; animation: popupEnter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .model-box.theme-light { background: white; color: #212529; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
                .model-box.theme-dark { background: #1a1a1a; color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                
                @keyframes popupEnter { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }

                .m-close-btn { position: absolute; top: 18px; right: 18px; cursor: pointer; border: none; background: none; color: #adb5bd; }
                .m-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
                .m-icon-box { width: 28px; height: 28px; flex-shrink: 0; }
                .m-title { margin: 0; font-size: 1.25rem; font-weight: 700; }
                .m-body { font-size: 1rem; margin-bottom: 24px; opacity: 0.8; }
                .popupjs-actions { display: flex; justify-content: flex-end; gap: 10px; }

                /* --- Toasts --- */
                .popupjs-t-container { position: fixed; z-index: 1000000; display: flex; flex-direction: column; gap: 10px; padding: 20px; pointer-events: none; }
                .t-top-right { top: 0; right: 0; }
                .t-top-left { top: 0; left: 0; }
                .t-bottom-right { bottom: 0; right: 0; }
                .t-bottom-left { bottom: 0; left: 0; }
                .t-top-center { top: 0; left: 50%; transform: translateX(-50%); }
                .t-bottom-center { bottom: 0; left: 50%; transform: translateX(-50%); }

                .popupjs-toast {
                    padding: 12px 18px; border-radius: 10px; display: flex; align-items: center; 
                    gap: 12px; min-width: 260px; pointer-events: auto; position: relative;
                    animation: toastIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
                    transition: 0.3s;
                }
                .popupjs-toast.theme-dark { background: #1a1a1a; color: #fff; box-shadow: 0 8px 16px rgba(0,0,0,0.3); }
                .popupjs-toast.theme-light { background: #fff; color: #000; border: 1px solid #ddd; box-shadow: 0 8px 16px rgba(0,0,0,0.1); }
                
                .toast-icon { width: 22px; height: 22px; flex-shrink: 0; display: flex; align-items: center; }
                .toast-custom-img img { width: 22px; height: 22px; object-fit: contain; }
                
                .toast-close-x { cursor: pointer; margin-left: auto; opacity: 0.6; display: flex; align-items: center; padding-left: 8px; transition: 0.2s; }
                .toast-close-x:hover { opacity: 1; }

                @keyframes toastIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
            `;
            document.head.appendChild(style);
        }

        _getIcon(type, colorOverride) {
            const icons = {
                error: `<svg viewBox="0 0 24 24" fill="${colorOverride || '#ff5252'}"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z"></path></svg>`,
                success: `<svg viewBox="0 0 24 24" fill="${colorOverride || '#00c853'}"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM17.4571 9.45711L11 15.9142L6.79289 11.7071L8.20711 10.2929L11 13.0858L16.0429 8.04289L17.4571 9.45711Z"></path></svg>`,
                info: `<svg viewBox="0 0 24 24" fill="${colorOverride || '#2196f3'}"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 11V17H13V11H11ZM11 7V9H13V7H11Z"></path></svg>`,
                confirm: `<svg viewBox="0 0 24 24" fill="${colorOverride || '#111111'}"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM13 13.3551V14H11V12.5C11 11.9477 11.4477 11.5 12 11.5C12.8284 11.5 13.5 10.8284 13.5 10C13.5 9.17157 12.8284 8.5 12 8.5C11.2723 8.5 10.6656 9.01823 10.5288 9.70577L8.56731 9.31346C8.88637 7.70919 10.302 6.5 12 6.5C13.933 6.5 15.5 8.067 15.5 10C15.5 11.5855 14.4457 12.9248 13 13.3551Z"></path></svg>`
            };
            return icons[type] || icons.info;
        }

        show(opt) {
            if (!this.modal) {
                this.modal = document.createElement("div");
                this.modal.className = "popupjs-overlay";
                this.modal.innerHTML = `
                    <div class="model-box">
                        <button class="m-close-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                        <div class="m-header"><div class="m-icon-box"></div><h3 class="m-title"></h3></div>
                        <div class="m-body"></div>
                        <div class="popupjs-actions">
                            <button class="btn btn-light m-cancel">Cancel</button>
                            <button class="btn btn-primary m-confirm">Confirm</button>
                        </div>
                    </div>`;
                document.body.appendChild(this.modal);
            }

            const theme = opt.theme || 'light';
            const box = this.modal.querySelector(".model-box");
            box.className = `model-box theme-${theme}`;

            this.modal.querySelector(".m-icon-box").innerHTML = this._getIcon(opt.type);
            this.modal.querySelector(".m-title").innerText = opt.title;
            this.modal.querySelector(".m-body").innerHTML = opt.message;
            
            const btnOk = this.modal.querySelector(".m-confirm");
            const btnNo = this.modal.querySelector(".m-cancel");
            btnNo.style.display = opt.showCancel ? "inline-block" : "none";
            btnOk.innerText = opt.showCancel ? "Confirm" : "OK";

            const hide = () => this.modal.style.display = "none";
            btnOk.onclick = () => { if(opt.onConfirm) opt.onConfirm(); hide(); };
            btnNo.onclick = hide;
            this.modal.querySelector(".m-close-btn").onclick = hide;
            this.modal.style.display = "flex";
        }

        toast(opt) {
            const pos = opt.position || 'bottom-center';
            let cont = document.querySelector(`.t-${pos}`);
            if (!cont) {
                cont = document.createElement("div");
                cont.className = `popupjs-t-container t-${pos}`;
                document.body.appendChild(cont);
            }
            
            const toast = document.createElement("div");
            toast.className = `popupjs-toast theme-${opt.theme || 'dark'}`;
            
            const iconHtml = (opt.icon === 'success' || opt.icon === 'error' || opt.icon === 'info') 
                ? `<div class="toast-icon">${this._getIcon(opt.icon)}</div>` 
                : `<div class="toast-custom-img">${opt.icon}</div>`;
            
            toast.innerHTML = `
                ${iconHtml}
                <div style="font-size:14px; font-weight:500;">${opt.message}</div>
                <div class="toast-close-x">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </div>
            `;
            
            cont.appendChild(toast);

            const removeToast = () => {
                toast.style.opacity = "0";
                setTimeout(() => toast.remove(), 300);
            };

            toast.querySelector(".toast-close-x").onclick = removeToast;
            setTimeout(removeToast, opt.duration || 4500);
        }
    }

    const instance = new PopupJs();

    window.PopupJS = {
        alert: (msg, theme) => instance.show({ title: "Info", message: msg, type: "info", theme: theme }),
        confirm: (msg, theme) => new Promise(res => instance.show({ title: "Confirm", message: msg, type: "confirm", showCancel: true, theme: theme, onConfirm: () => res(true) })),
        toast: (msg, opts = {}) => instance.toast({ message: msg, icon: opts.icon || "success", position: opts.position, theme: opts.theme, duration: opts.duration })
    };

})(window);
