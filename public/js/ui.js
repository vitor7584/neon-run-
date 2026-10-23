// Atualiza textos e telas HTML sem misturar UI com a lógica principal.
class GameUI {
  constructor() {
    this.overlay = document.getElementById("overlay");
    this.kicker = document.getElementById("overlayKicker");
    this.title = document.getElementById("overlayTitle");
    this.text = document.getElementById("overlayText");
    this.playBtn = document.getElementById("playBtn");
    this.instructionsBtn = document.getElementById("instructionsBtn");
    this.creditsBtn = document.getElementById("creditsBtn");
    this.hud = document.getElementById("hud");
    this.toast = document.getElementById("toast");
    this.best = document.getElementById("bestScore");
    this.soundBtn = document.getElementById("soundBtn");
    this.toastTimer = null;
  }
  showMenu({kicker, title, text, button = "▶ JOGAR"}) {
    this.overlay.classList.remove("hidden"); this.hud.hidden = true;
    this.kicker.textContent = kicker; this.title.innerHTML = title; this.text.textContent = text;
    this.playBtn.textContent = button; this.playBtn.hidden = false;
    this.instructionsBtn.hidden = false; this.creditsBtn.hidden = false;
  }
  hideMenu() { this.overlay.classList.add("hidden"); this.hud.hidden = false; }
  showInfo(title, text) {
    this.showMenu({kicker:"CENTRAL DE INFORMAÇÕES", title, text, button:"VOLTAR AO MENU"});
    this.instructionsBtn.hidden = true; this.creditsBtn.hidden = true;
  }
  updateHUD(level, score, distance, energy) {
    document.getElementById("hudLevel").textContent = `${String(level + 1).padStart(2,"0")} / 03`;
    document.getElementById("hudScore").textContent = String(Math.floor(score)).padStart(5,"0");
    document.getElementById("hudDistance").textContent = `${Math.floor(distance)} m`;
    document.getElementById("healthBar").style.width = `${Math.max(0, energy)}%`;
  }
  setBest(score) { this.best.textContent = String(score).padStart(5,"0"); }
  announce(message) {
    this.toast.textContent = message; this.toast.hidden = false;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => { this.toast.hidden = true; }, 1600);
  }
}
