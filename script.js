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

    // Permite arrastar com toque no celular
    paper.style.touchAction = "none";

    paper.addEventListener("pointerdown", (e) => {

      // Ignora clique com botão direito ou outros botões do mouse
      if (e.pointerType === "mouse" && e.button !== 0) {
        return;
      }

      e.preventDefault();

      // Inicia a música no primeiro toque/clique
      iniciarMusica();

      // Começa a segurar o papel
      this.holdingPaper = true;
      this.pointerId = e.pointerId;

      // Coloca o papel na frente dos outros
      paper.style.zIndex = highestZ;
      highestZ++;

      // Guarda a posição inicial
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;

      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;

      // Mantém o controle do toque/mouse mesmo fora do papel
      try {
        paper.setPointerCapture(e.pointerId);
      } catch (error) {}

      // Impede seleção de texto enquanto arrasta
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
    });


    paper.addEventListener("pointermove", (e) => {

      // Só movimenta se estiver segurando este papel
      if (!this.holdingPaper || e.pointerId !== this.pointerId) {
        return;
      }

      e.preventDefault();

      // Calcula quanto o mouse/dedo se moveu
      const moveX = e.clientX - this.prevMouseX;
      const moveY = e.clientY - this.prevMouseY;

      // Soma o movimento à posição atual
      this.currentPaperX += moveX;
      this.currentPaperY += moveY;

      // Atualiza a posição anterior
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;

      // Move o papel mantendo sua rotação
      paper.style.transform =
        `translate3d(
          ${this.currentPaperX}px,
          ${this.currentPaperY}px,
          0
        ) rotateZ(${this.rotation}deg)`;
    });


    const stopDragging = (e) => {

      // Se não estava segurando, não faz nada
      if (!this.holdingPaper) {
        return;
      }

      // Ignora outro toque/mouse
      if (
        e.pointerId !== undefined &&
        e.pointerId !== this.pointerId
      ) {
        return;
      }

      // Para de arrastar
      this.holdingPaper = false;
      this.pointerId = null;

      // Libera a seleção de texto
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";

      // Libera o controle do toque/mouse
      try {
        if (paper.hasPointerCapture(e.pointerId)) {
          paper.releasePointerCapture(e.pointerId);
        }
      } catch (error) {}
    };


    // Quando soltar o mouse/dedo
    paper.addEventListener("pointerup", stopDragging);

    // Quando o navegador cancelar o toque
    paper.addEventListener("pointercancel", stopDragging);

    // Quando perder o controle do toque
    paper.addEventListener("lostpointercapture", stopDragging);
  }
}


// ========================================
// MÚSICA
// ========================================

const musica = document.getElementById("musica");


function iniciarMusica() {

  // Se a música já estiver tocando, não reinicia
  if (!musica.paused) {
    return;
  }

  // Começa com volume zero
  musica.volume = 0;

  musica.play().then(() => {

    // Tempo do fade: 10 segundos
    const duracaoFade = 10000;

    // Guarda o momento em que começou
    const inicio = performance.now();


    function aumentarVolume(agora) {

      // Quanto tempo já passou
      const tempoPassado = agora - inicio;

      // Calcula o progresso de 0 até 1
      const progresso = Math.min(
        tempoPassado / duracaoFade,
        1
      );

      // Aumenta o volume gradualmente
      musica.volume = progresso;


      // Continua aumentando enquanto não chegar a 100%
      if (progresso < 1) {

        requestAnimationFrame(aumentarVolume);

      } else {

        // Garante volume máximo
        musica.volume = 1;
      }
    }


    // Começa o fade
    requestAnimationFrame(aumentarVolume);


  }).catch((erro) => {

    console.log(
      "Não foi possível iniciar a música:",
      erro
    );

  });
}


// ========================================
// ATIVAÇÃO DOS PAPÉIS
// ========================================

const papers = document.querySelectorAll(".paper");


papers.forEach((paper) => {

  const p = new Paper();

  p.init(paper);

});
