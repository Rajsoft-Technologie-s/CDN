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
            success: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAADbElEQVR4nO1YPUwUQRQe4j8iolGC0djY2pEYQkgm+94sbPAq9ayMtYmNIfGn0NBYSAzCvlnBq9QoGqmMQkQsrFWijVqoaGOMEfGHGGNQg3l3s+d67O0tx92BCV+yzd2bmW/ee/PmeyPEEpYQgRlRpbRqU6ROIGE/El4HggEg6AMNxy3Pam/ual4nFgpIeBA1zhT4fgLBHXBhH2+oogQtz2oHDb+ZCGh4hxpfAcE4anyfh+yYRRZUlKT0ZINKqfWzfu+RdeihAwSEhBM5RK8lUolqsViQSCWqOSeB4ItPEgieqF61XSwmOK6zGQhGsp4kfCtdua3oyVDjMyR8GhbCYpEcTC5DwjNZT2p4XFS4UeOgP4nda+8sFUEfSNgbCPeAmAu4JAQG3xBlQDLjyWF/HeUpjDdyRlSlQ5vJkQm7z64XZYLdZ9ejxinjiEex6iRqTATy40i5yPlAwlNZL5LaIwoBNAyZAZ8rcU3ZZ+21QPDRRGw40thxnVWg4ZsheKEUBJq6m9YAwU1OFyDYFWYDGs4bgtPSkzV5JwMXrDm5OwY5JBwNpMzhMDtFane2Nnro5J0QNXb4hjIlN5WSHBKOyotydZhta3frxoDd0SiCXcbw+3zIOZlUGQqSY8JRY/w85HBHGV0yk77JZ2O51g4guI+Ep8PKQpjnCpFjIOFLM+ZKfoIarppdvIiTBkjYHyRZLLn02hmZxmtfjtpFvzH6kM+GcxMInueSbJp9IO7FJWfW/mTG6qhdHMsekh5Zl5ekJxuCJIEgNR9yRpj4WrEjUiHHOu4hJLFIciG3lx21k1ruIQq6Og9JKIIcg5ssM/4H3yyFjEeyQqGQsciSvM0VoBhyXBtBw2Ssqy5XaiHhSVFmWK7Vmo0Ad34x5daYcflXTuByEpSZqvAQNd5qTDWuiDVIuUr+c0V1yuVisQEIBgIke8RiQxMXXo0PgrUudggqBW4JuTUM1Lm782kBHNepBYIDbefatpSMJPTDVv/QmG+KZXqcEpSjbg7xFerXS1FKGFX8Nyczi0yyNGKx2dLXsiFM46VvJsKe3KcP0OCKcoAVN3dfoQ9DlJb046DhNZenMBv+vxRKPU6d3JvuaQmnCz2/AcEvzl3lqf3JzuRKUUlIT9awqGCZzuFmPcl6jsPKj5rcjC/oA+YSxH+AP6vVpKHGs3HVAAAAAElFTkSuQmCC",
            error: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAADVElEQVR4nO2YTU8UQRCGRzDxQpToxYtEovEjngyGkCz9Fhs4bGLwthf9ASQeMIgHbwYP6H9Qg/8AJejRgB6ERIhB0YPG6AGM33rhI1NNmxp6Ni07M8wOs4QY3mQvu9XVT213V1W35+1qV/EyRMcZuKyBO5pojIHnDLxgYEIDIwwMmmKxzXheg7ddMkRNMjED7zSRSfNhok+aaMgQNdcTbC8TXWeiHxEAX5hoVhM90sADJppkosUqO+A7A1dNqbQvX7jOzhMMTG2Y7FUwWbF4JnZcodDCSvUx0fSGgOaMUq35wBE1M/Dbde4Dvcbz9tTiR8Yw8Nrx89UohbwAfzHAmuj2VpbHlMuNGhhmojULuZoX5GFTLB7zchIDFxlYdv7JfJY7T7FSl5x/ci73g5OHNHDL2ZMDqQZJJLIEhuhorA1Rk+noOJgWRGxlTNX35XJjeHCY6Gcqnxq4adPIyzg4yXFMtOR3dZ3fzJ/YiK2MiYKU0+2koKFNAZnojY3oaSRgd/chmdAGsZIEGcABK9bfkoyNnNPmWKk4iWVRaquzJ67FTkxUck7hqg9cyGJTAVSqL5xXancsIANXHMOTsYabAPg1wIUVx6lQg7GGmuheWFuTHCaB+DXChWKiBQt5PwnwiY3iWRqnon+AAJ+B1VrhRNJgWB8TSUYzNoqHaR1XIIkCMPn4gF8LnEi6IBvYbKyRbZmMGG8FkLMAEj22gNPxgNIJrxtNZlliX5bYgmZY4nD1xuKjAEas88VtPyTAZwt4N8losJJmCoWWWuG8FL9FSVKasz36kwzbKoZK9WWBy5Sogf5U+VfKjL3gxG7WepQ6HeZf4GMsnGM85KSL3no3CyIDnJXUFjVflUxPzwG5fdmI3sptrl7tVmZJ81hpgYBhb6fJSNNKNGf3zpo0sN5Ok1GqVS40dqmXdyoknMqwJncIadMz+ysF14kbDLzPLeAAEvjmNLLzqU6bI7nk23o97+ztUS/n5Q72pJPxpySZG6WOxI4DTksSdl8UbJAzhuhUboDOwRkIU9CGCReCfg4Y1cC4JHlpeiPs/shVIip15QdK1CzJPKw4Ot3z24fgrbC9fX/dwKpAPa/BEJ0LGgx5rFx/cpsJXrKAcSlf8riZ+1Lu6n/TX7L4t56sSGuqAAAAAElFTkSuQmCC",
            info: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAChklEQVR4nO2YS2sUQRSFvzG+NRoDo4JZ+AcERV0JvkWNLqLOzpX+ABc+NwluRRFFGR+gKDjRlRtBoi7ci+JSwaC4CBISQ1CJYhRGKpyGi0z3VHW6O4LzQUMv7ul7qKquuregRYtEFgN7gFPANaAG9Ov9DNANtFMwJaAHGAB+AvUmzy/FVqTNnbMxRkaB93qGY2JeAduLMjgOXAX2Ap0N4jo0/Vdk3hq9DyzMy6CbpvXAggDNIqAX+PLXaHZN10wbMJfsKANPjMmh6Zh00zYIjAGrMzTZBpwzJl+nne4H5iObyJ7L5vtuawqiYsQPA3QbgQ0BI/nY5Nnhm2QW8EaiYa0bH46aZEc8NcuBr9K89N0ne0yiY/hz2+huBej6jO6gj2BAwWM6ynxZB3zQRr02cAv6rJxuyhOZD3xXsDtPi6KqnJPNBmWnGW431UWxz+R1p08sJ0xgo+PL5++vpNB1mryuMorlvIImUiRZY5K491CideimO5a7CnKLPZStxqB7D2VQ2ntJQTUFvZsBgx+lvZMUdF1BIzNgcEJat8xiOW2SdBRosGy0J5MCu31/94wNHjLazUmBS9RD1FUtF2XwhnQ/dFgkEhWUozqG8jbYbgqGR6GlVm8BBo8bnetvmlJSv1BXD1HO0eAKNV9O81alnhdbTLJnwGwPzUolG9e7DxdMnt0E0m/Elzw1S/X4Ep39rr0IxrWVL4zJm8AcsqcrZGobiYeMyacq0/8pVpmfpq4toS9wCyoB83L0ODXddk1GLUFVxeayBhp3VO4CLgKfgG+BrUAqtqn7anZ5NBITc4ACKOnsdA3OZMK1W/T8Bp4Dh4u6fou7wKyqnqyZC8z9KaqiFv8XfwAAE/f0kvwhvgAAAABJRU5ErkJggg==",
            confirm: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEFElEQVR4nO1YX4iUVRT/JiPTLF3Xae79dtKXpYcQKsjetSg1CPwzFOn2nfNtDLWw9GQllNJb6INiaYiCgm4PG/imaWvcc2Zrs9zoZeshKwoiLLf/ULRRE2fm7uy1ne/PfDtjBfuDCxe+c+/93XPvPed3Ps+bxzyi0Tt4ZqEO+QGN9IwGPqSQh6RJXwM9q4A2dodv3+xdW1RzCmizRh7WQD9r5GpsA/5DI7+hsLJVxnaUmo/mfg18sTkZ+kYDfVZvfDnCZrwAvK7txFYF5kYNdMJdTCFPaqTj4s1VgVnWZMwyFZj1CumAAr5y1Vjg13R5fHFbyK0os9ZAF5wj+0Uhv7R824Vb0s4hZOROauAfnQ1+qPtGV86ZoEaacI7oLYWVfNa5FFbyCumsQ/KrnidMsT0EgV7xdpvrvbmiNLxAAe1z72WxNLYo83xd5ZGlhdCsTjTcXb3OB75NmvSTzBXyfseTQ17nUM0pNE9d9XKBL6uQn4wNK6XhBRr59PQYP6jc1xF6Sl5kRAxM8kxh+zu3NmIp8MW2x0kd8rYZr9FHGqlca8AfO555NHaDyC/MhB/anLhoD47eqZE2pdmNRhq3u//CTWnSV0hf2oXfj5ujsP3cTfWYWrM9HbtgfsAskThnX9emJIIK+TfrvT1NyO+tHzP9mrxRPmjnmRIO0bsJaa3j7o0pCE7W7AMzOPsbHbBZ40rSPIWQH2qsG5j1cTt5znrvL102KxIn7ud7FdCAqJrZL7QRP99LmqfYP7Z8mmAh5B2Rho1dI096GXFHaeIGDXTMeTxPpxnn3MODkUbTgkABX8pCTkvORTYzYYY+EKGRiiDwJbuhEzFGdNJ68JNMBIEPOXHwXYlzacfKmvbun4xZgF61u/i2VXLd9dDyu/Xc+Vn3MgGNTAR8ONpIpLv1QDONFwc/pLsbwTmkh1vdXO1h1gnujDSU0JLquTdBPjBKIf8gTfqtjtVAf1qCD0Yaigi1NYQc08teBuXTVR5Z6mWAOEcFpi8xg00LSgmwkoa8/xoUVrY6tcPzLY0FWqNCc4/XWVRzDRGA9FNaie+jQScbQEcpSmnoBNuzkrqSxiikI04eP5pqndCsznpnJXAOOQvuS7L3A3OXBvpc6mLpJ89Pu+wpTWQiKIXMzFHXssv+NJ5MRjWngV90ha6XFVISSmnoePJcK+nrn/D7Rro10OsOua+L/abXmwuKj5/vcT0pNYTI9FZCUO/gmYUiy9zCSsSB31e5fU7kGiRLY4vcO2m9+Z1IIxGbKx8b7WrmrZhfH6fku9du1BR3xM8jJSTszyOF9H1EpfepAip5nUU1p0LeUqtpgaaiSk7nSkwp5Dd94EdEzHrXEvkBs0SOUWS6HHdNT9ZFrxz9DoW04V/4gTmP/xf+BqlXF2+DkpvOAAAAAElFTkSuQmCC",
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
