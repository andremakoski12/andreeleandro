let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {

    paper.addEventListener("pointerdown", (e) => {

      if (this.holdingPaper) return;

      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ++;

      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;

      this.mouseTouchX = e.clientX;
      this.mouseTouchY = e.clientY;

      paper.setPointerCapture(e.pointerId);

      e.preventDefault();
    });

    paper.addEventListener("pointermove", (e) => {

      if (!this.holdingPaper) return;

      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;

      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;

      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      paper.style.transform =
        `translateX(${this.currentPaperX}px) 
         translateY(${this.currentPaperY}px) 
         rotateZ(${this.rotation}deg)`;

      e.preventDefault();
    });

    const stopDragging = (e) => {

      this.holdingPaper = false;
      this.rotating = false;

      if (paper.hasPointerCapture(e.pointerId)) {
        paper.releasePointerCapture(e.pointerId);
      }
    };

    paper.addEventListener("pointerup", stopDragging);
    paper.addEventListener("pointercancel", stopDragging);
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
