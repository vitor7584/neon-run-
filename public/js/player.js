// Estado e desenho do corredor. O Canvas desenha o personagem sem imagens externas.
class Player {
  constructor() { this.reset(); }
  reset() { this.lane = 1; this.x = 480; this.y = 410; this.width = 34; this.height = 48; this.jump = 0; this.jumpVelocity = 0; this.invulnerable = 0; }
  move(direction) { this.lane = Math.max(0, Math.min(2, this.lane + direction)); }
  startJump() { if (this.jump <= 0) this.jumpVelocity = 11; }
  update(dt, laneX, groundY) {
    this.x += (laneX[this.lane] - this.x) * Math.min(1, dt * 12);
    if (this.jumpVelocity !== 0 || this.jump > 0) {
      this.jump += this.jumpVelocity * dt * 60;
      this.jumpVelocity -= 0.55 * dt * 60;
      if (this.jump <= 0) { this.jump = 0; this.jumpVelocity = 0; }
    }
    this.y = groundY - this.height - this.jump;
    if (this.invulnerable > 0) this.invulnerable -= dt;
  }
  draw(ctx, time) {
    if (this.invulnerable > 0 && Math.floor(time * 16) % 2 === 0) return;
    const x = this.x, y = this.y, run = Math.sin(time * 17) * 5;
    ctx.save(); ctx.translate(x, y);
    // Sombra que se afasta do corpo durante o pulo.
    ctx.globalAlpha = Math.max(.12, 1 - this.jump / 150);
    ctx.fillStyle = "#050817"; ctx.beginPath(); ctx.ellipse(0, this.height + this.jump, 24, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    // Pernas animadas.
    ctx.strokeStyle = "#182343"; ctx.lineWidth = 9; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-7, 33); ctx.lineTo(-10 + run, 45); ctx.moveTo(7, 33); ctx.lineTo(10 - run, 45); ctx.stroke();
    ctx.strokeStyle = "#4df6e8"; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-10 + run, 45); ctx.lineTo(-4 + run, 46); ctx.moveTo(10 - run, 45); ctx.lineTo(16 - run, 46); ctx.stroke();
    // Tronco, braços e capacete.
    ctx.shadowColor = "#4df6e8"; ctx.shadowBlur = 16; ctx.fillStyle = "#4df6e8";
    ctx.beginPath(); ctx.roundRect(-14, 12, 28, 24, 7); ctx.fill();
    ctx.shadowBlur = 0; ctx.fillStyle = "#17203a"; ctx.fillRect(-9, 18, 18, 8);
    ctx.strokeStyle = "#ff4fa3"; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-12, 17); ctx.lineTo(-19, 28 + run * .4); ctx.moveTo(12, 17); ctx.lineTo(19, 25 - run * .4); ctx.stroke();
    ctx.fillStyle = "#dbeeff"; ctx.shadowColor = "#ff4fa3"; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.roundRect(-12, 0, 24, 19, 7); ctx.fill();
    ctx.fillStyle = "#ff4fa3"; ctx.fillRect(-9, 7, 18, 4);
    ctx.restore();
  }
}
