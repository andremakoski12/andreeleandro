let highestZ = 1;

class Paper {
  holdingPaper = false;

  mouseX = 0;
  mouseY = 0;

  prevMouseX = 0;
  prevMouseY = 0;

  currentPaperX = 0;
  currentPaperY = 0;

  rotation = Math.random() * 30 - 15;

  pointerId = null;

  init(paper) {

    paper.style.touchAction = "none";

    paper.addEventListener("pointerdown", (e) => {

      if (e.pointerType === "mouse" && e.button !== 0) {
        return;
      }

      e.preventDefault();

      this.holdingPaper = true;
      this.pointerId = e.pointerId;

      paper.style.zIndex = highestZ;
      highestZ++;

      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;

      try {
        paper.setPointerCapture(e.pointerId);
      } catch (error) {}

      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
    });

    paper.addEventListener("pointermove", (e) => {

      if (!this.holdingPaper || e.pointerId !== this.pointerId) {
        return;
      }

      e.preventDefault();

      const moveX = e.clientX - this.prevMouseX;
      const moveY = e.clientY - this.prevMouseY;

      this.currentPaperX += moveX;
      this.currentPaperY += moveY;

      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;

      paper.style.transform =
        `translate3d(
          ${this.currentPaperX}px,
          ${this.currentPaperY}px,
          0
        ) rotateZ(${this.rotation}deg)`;
    });

    const stopDragging = (e) => {

      if (!this.holdingPaper) {
        return;
      }

      if (
        e.pointerId !== undefined &&
        e.pointerId !== this.pointerId
      ) {
        return;
      }

      this.holdingPaper = false;
      this.pointerId = null;

      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";

      try {
        if (paper.hasPointerCapture(e.pointerId)) {
          paper.releasePointerCapture(e.pointerId);
        }
      } catch (error) {}
    };

    paper.addEventListener("pointerup", stopDragging);
    paper.addEventListener("pointercancel", stopDragging);
    paper.addEventListener("lostpointercapture", stopDragging);
  }
}

const musica = document.getElementById("musica");

document.addEventListener("pointerdown", () => {

  if (!musica.paused) return;

  musica.volume = 0;

  musica.play().then(() => {

    const duracaoFade = 10000; // 10 segundos
    const inicio = performance.now();

    function aumentarVolume(agora) {

      const tempoPassado = agora - inicio;
      const progresso = Math.min(tempoPassado / duracaoFade, 1);

      musica.volume = progresso;

      if (progresso < 1) {
        requestAnimationFrame(aumentarVolume);
      } else {
        musica.volume = 1;
      }
    }

    requestAnimationFrame(aumentarVolume);

  }).catch((erro) => {
    console.log("Não foi possível iniciar a música:", erro);
  });

}, { once: true });
