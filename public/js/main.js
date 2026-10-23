// Ponto de entrada: conecta botões da página à interface e ao jogo.
document.addEventListener("DOMContentLoaded", () => {
  const ui = new GameUI();
  const game = new NeonRunGame(document.getElementById("gameCanvas"), ui);

  ui.playBtn.addEventListener("click", () => {
    if (game.state === "menu" || game.state === "over" || game.state === "won") game.start();
    else ui.showMenu({kicker:"PAUSA",title:"RESPIRA.<br><span>RECARREGA.</span>",text:"Pronto para voltar à pista?",button:"▶ CONTINUAR"});
  });
  ui.instructionsBtn.addEventListener("click", () => ui.showInfo("DOMINE<br><span>A PISTA.</span>",
    "Use ← e → ou A/D para trocar de faixa. Use Espaço, ↑ ou W para pular obstáculos. Colete círculos dourados para ganhar pontos e itens ciano para recuperar energia. Cada mundo fica mais rápido. No celular, deslize para os lados ou para cima para pular."));
  ui.creditsBtn.addEventListener("click", () => ui.showInfo("FEITO COM<br><span>CRIATIVIDADE.</span>",
    "Neon Run é um projeto educacional feito com HTML5 Canvas, CSS3 e JavaScript puro. Cenários, personagem, efeitos e objetos são desenhados em tempo real, sem bibliotecas ou imagens externas."));
  // Clique no botão principal quando uma tela informativa está aberta volta ao menu.
  ui.soundBtn.addEventListener("click", () => {
    game.soundOn = !game.soundOn;
    ui.soundBtn.textContent = game.soundOn ? "♫ SOM: ON*" : "♫ SOM: OFF";
    ui.announce(game.soundOn ? "ÁUDIO AINDA NÃO IMPLEMENTADO" : "SOM DESATIVADO");
  });
});
