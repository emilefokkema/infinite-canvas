class Overlay {
    constructor(overlayEl, infCanvas) {
      this.overlayEl = overlayEl;
      this.infCanvas = infCanvas;
      this.opacity = 0;
      infCanvas.addEventListener('wheelignored', (e) => {
        e.preventDefault();
        this.displayMessage('use ctrl + scroll to zoom');
      });
      infCanvas.addEventListener('touchignored', (e) => {
        e.preventDefault();
        this.displayMessage('use two fingers to move');
      });
      this.hideTimeout = undefined;
    }
    displayMessage(message) {
      if (this.hideTimeout !== undefined) {
        clearTimeout(this.hideTimeout);
      }
      this.overlayEl.classList.add('active');
      this.overlayEl.style.opacity = 1;
      this.overlayEl.querySelector('.message').innerHTML = message;
      this.opacity = 1;
      this.hideTimeout = setTimeout(() => this.hide(), 200);
    }
    hide() {
      this.opacity -= 0.1;
      if (this.opacity <= 0) {
        this.opacity = 0;
        this.overlayEl.classList.remove('active');
      } else {
        this.overlayEl.style.opacity = this.opacity;
        this.hideTimeout = setTimeout(() => this.hide(), 50);
      }
    }
  }

  export default Overlay;