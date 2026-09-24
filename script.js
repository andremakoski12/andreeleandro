let highestZ = 1;

class Paper {
holdingPaper = false;

mouseX = 0;
mouseY = 0;

prevMouseX = 0;
prevMouseY = 0;

velX = 0;
velY = 0;

rotation = Math.random() * 30 - 15;

currentPaperX = 0;
currentPaperY = 0;

init(paper) {


// Garante que o navegador trate o elemento como área de toque/arraste
paper.style.touchAction = "none";
paper.style.userSelect = "none";
paper.style.webkitUserSelect = "none";

paper.addEventListener("pointerdown", (e) => {

  // Apenas botão esquerdo no mouse
  if (e.pointerType === "mouse" && e.button !== 0) {
    return;
  }

  e.preventDefault();

  this.holdingPaper = true;

  // Coloca o papel na frente
  paper.style.zIndex = highestZ;
  highestZ++;

  // Guarda posição inicial
  this.mouseX = e.clientX;
  this.mouseY = e.clientY;

  this.prevMouseX = e.clientX;
  this.prevMouseY = e.clientY;

  // Captura o dedo/mouse mesmo se sair do elemento
  try {
    paper.setPointerCapture(e.pointerId);
  } catch (error) {
    // Alguns navegadores podem não suportar captura
  }
});

paper.addEventListener("pointermove", (e) => {

  if (!this.holdingPaper) {
    return;
  }

  e.preventDefault();

  // Calcula quanto o dedo/mouse se moveu
  this.velX = e.clientX - this.prevMouseX;
  this.velY = e.clientY - this.prevMouseY;

  // Atualiza posição do papel
  this.currentPaperX += this.velX;
  this.currentPaperY += this.velY;

  // Guarda posição atual
  this.prevMouseX = e.clientX;
  this.prevMouseY = e.clientY;

  // Aplica movimento mantendo a rotação
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

  e.preventDefault();

  this.holdingPaper = false;

  try {
    if (paper.hasPointerCapture(e.pointerId)) {
      paper.releasePointerCapture(e.pointerId);
    }
  } catch (error) {
    // Ignora caso o navegador não suporte
  }
};

paper.addEventListener("pointerup", stopDragging);
paper.addEventListener("pointercancel", stopDragging);
paper.addEventListener("lostpointercapture", () => {
  this.holdingPaper = false;
});


}
}

const papers = Array.from(
document.querySelectorAll(".paper")
);

papers.forEach((paper) => {

const p = new Paper();

p.init(paper);
});
