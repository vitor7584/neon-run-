// Loop principal, renderização do cenário, colisões, fases e pontuação.
class NeonRunGame {
  constructor(canvas, ui) {
    this.canvas = canvas; this.ctx = canvas.getContext("2d"); this.ui = ui;
    this.player = new Player(); this.keys = new Set(); this.state = "menu";
    this.levelIndex = 0; this.score = 0; this.distance = 0; this.energy = 100;
    this.elapsed = 0; this.spawnAt = 0; this.obstacles = []; this.items = [];
    this.particles = []; this.bgTime = 0; this.lastFrame = 0; this.soundOn = false;
    this.best = Number(localStorage.getItem("neonRunBest") || 0); this.ui.setBest(this.best);
    this.bindKeys(); this.bindTouch();
    requestAnimationFrame(t => this.loop(t));
  }
  get level() { return LEVELS[this.levelIndex]; }
  bindKeys() {
    window.addEventListener("keydown", e => {
      if (["ArrowLeft","ArrowRight","ArrowUp"," ","KeyA","KeyD","KeyW"].includes(e.key) || e.code === "Space") e.preventDefault();
      if (this.state !== "playing" || e.repeat) return;
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") this.player.move(-1);
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") this.player.move(1);
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w" || e.code === "Space") this.player.startJump();
    });
  }
  bindTouch() {
    let startX = 0, startY = 0;
    this.canvas.addEventListener("touchstart", e => { startX=e.changedTouches[0].clientX; startY=e.changedTouches[0].clientY; }, {passive:true});
    this.canvas.addEventListener("touchend", e => {
      if (this.state !== "playing") return;
      const dx=e.changedTouches[0].clientX-startX, dy=e.changedTouches[0].clientY-startY;
      if (Math.abs(dx)>Math.abs(dy) && Math.abs(dx)>25) this.player.move(dx>0?1:-1);
      else if (dy < -20 || (Math.abs(dx)<20 && Math.abs(dy)<20)) this.player.startJump();
    }, {passive:true});
  }
  start() {
    this.state="playing"; this.levelIndex=0; this.score=0; this.distance=0; this.energy=100; this.elapsed=0;
    this.obstacles=[]; this.items=[]; this.particles=[]; this.spawnAt=100; this.player.reset();
    this.ui.hideMenu(); this.ui.announce("FASE 1 — FLORESTA NEON");
  }
  spawn() {
    const lane = Math.floor(Math.random()*3);
    this.obstacles.push(makeObstacle(lane, this.distance + 500 + Math.random()*180, Math.random()<.25?"barrier":"block"));
    const itemLane = Math.floor(Math.random()*3);
    this.items.push(makeCollectible(itemLane, this.distance + 360 + Math.random()*140, Math.random()<.12?"energy":"coin"));
  }
  update(dt) {
    this.elapsed += dt; this.bgTime += dt;
    if (this.state !== "playing") return;
    const level=this.level;
    this.distance += level.speed*dt/10;
    this.score += level.speed*dt*.045;
    const laneX=[this.canvas.width*.31,this.canvas.width*.5,this.canvas.width*.69];
    const ground=this.canvas.height*.82;
    this.player.update(dt,laneX,ground);
    this.spawnAt -= level.speed*dt;
    if(this.spawnAt<=0){this.spawn();this.spawnAt=390+Math.random()*250;}
    for(const o of this.obstacles){
      const z=o.distance-this.distance;
      if(!o.hit && z<48 && z>-35 && o.lane===this.player.lane && this.player.jump<24 && this.player.invulnerable<=0){
        o.hit=true; this.energy-=25; this.player.invulnerable=1.2; this.burst(this.player.x,this.player.y+20,level.hazard,14);
        this.ui.announce("IMPACTO! ENERGIA -25");
        if(this.energy<=0){this.end(false);return;}
      }
    }
    for(const item of this.items){
      const z=item.distance-this.distance;
      if(!item.collected && z<35 && z>-30 && item.lane===this.player.lane){
        item.collected=true;
        if(item.type==="energy") this.energy=Math.min(100,this.energy+25);
        else this.score+=150;
        this.burst(laneX[item.lane],ground-70,level.item,10);
      }
    }
    this.obstacles=this.obstacles.filter(o=>!o.hit && o.distance-this.distance>-100);
    this.items=this.items.filter(i=>!i.collected && i.distance-this.distance>-100);
    this.particles=this.particles.filter(p=>p.life>0);
    for(const p of this.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;p.vy+=25*dt;}
    this.ui.updateHUD(this.levelIndex,this.score,this.distance,this.energy);
    if(this.distance>=level.goal){
      if(this.levelIndex<LEVELS.length-1){
        this.levelIndex++; this.distance=0; this.obstacles=[]; this.items=[]; this.spawnAt=120;
        this.ui.announce(`FASE ${this.levelIndex+1}: ${this.level.name}`);
      } else this.end(true);
    }
  }
  burst(x,y,color,count){for(let i=0;i<count;i++)this.particles.push({x,y,vx:(Math.random()-.5)*190,vy:(Math.random()-.8)*180,life:.35+Math.random()*.45,color,size:2+Math.random()*4});}
  polygon(points,fill){const c=this.ctx;c.fillStyle=fill;c.beginPath();points.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();}
  drawBackground() {
    const c=this.ctx,w=this.canvas.width,h=this.canvas.height,l=this.level||LEVELS[2];
    const grad=c.createLinearGradient(0,0,0,h);grad.addColorStop(0,l.sky);grad.addColorStop(.65,l.horizon);grad.addColorStop(1,l.road);c.fillStyle=grad;c.fillRect(0,0,w,h);
    // Estrelas/partículas no céu.
    for(let i=0;i<65;i++){const x=(i*137+this.bgTime*(10+i%5))%w,y=(i*67)% (h*.52);c.fillStyle=`rgba(180,230,255,${.18+(i%5)*.1})`;c.fillRect(x,y,2,2);}
    // Silhuetas de cenário em parallax.
    const offset=(this.bgTime*35)%150;
    for(let i=-1;i<9;i++){
      const x=i*150-offset;
      if(l.scenery==="forest"){
        this.polygon([[x+15,h*.62],[x+60,h*.28],[x+105,h*.62]],i%2?"#123b45":"#15505a");
        this.polygon([[x+35,h*.68],[x+72,h*.4],[x+112,h*.68]],"#0e343f");
      } else if(l.scenery==="desert"){
        this.polygon([[x-20,h*.64],[x+65,h*.43],[x+155,h*.65]],i%2?"#8e4558":"#bd5960");
        this.polygon([[x+10,h*.67],[x+80,h*.53],[x+160,h*.68]],"#6b3a55");
      } else {
        const bh=90+(i*37%110);
        c.fillStyle=i%2?"#202c55":"#1a2346";c.fillRect(x+20,h*.62-bh,70,bh);
        c.fillStyle="#4df6e8";for(let yy=h*.64-bh;yy<h*.6;yy+=15)for(let xx=x+30;xx<x+80;xx+=17)c.fillRect(xx,yy,4,5);
      }
    }
    // Pista em perspectiva.
    this.polygon([[w*.38,h*.46],[w*.62,h*.46],[w*.91,h],[w*.09,h]],l.road);
    c.strokeStyle=l.accent;c.globalAlpha=.65;c.lineWidth=3;
    c.beginPath();c.moveTo(w*.38,h*.46);c.lineTo(w*.09,h);c.moveTo(w*.62,h*.46);c.lineTo(w*.91,h);c.stroke();c.globalAlpha=1;
    // Faixas centrais animadas.
    for(let i=0;i<7;i++){const z=((i/7+(this.bgTime*.6)%1)%1);const y=h*.46+z*z*h*.54;const half= w*(.015+z*.13);c.fillStyle="#d8faff";c.globalAlpha=.15+z*.5;c.fillRect(w/2-half*.03,y,half*.06,Math.max(2,z*19));}c.globalAlpha=1;
    // Brilho de horizonte.
    const glow=c.createRadialGradient(w/2,h*.56,1,w/2,h*.56,w*.4);glow.addColorStop(0,l.accent+"35");glow.addColorStop(1,l.accent+"00");c.fillStyle=glow;c.fillRect(0,h*.35,w,h*.45);
  }
  drawObjects() {
    const c=this.ctx,w=this.canvas.width,h=this.canvas.height,l=this.level;
    const laneX=[w*.31,w*.5,w*.69],ground=h*.82;
    const project=(z)=>{const p=Math.max(0,Math.min(1,1-z/600));return {y:h*.46+p*p*(ground-h*.46),scale:.25+p*1.1};};
    for(const o of this.obstacles){
      const z=o.distance-this.distance;if(z>650||z<0)continue;
      const p=project(z),x=w/2+(laneX[o.lane]-w/2)*p.scale;
      c.save();c.translate(x,p.y);c.scale(p.scale,p.scale);
      c.shadowColor=l.hazard;c.shadowBlur=18;c.fillStyle="#2a1834";c.strokeStyle=l.hazard;c.lineWidth=3;
      c.beginPath();c.roundRect(-22,-o.height,44,o.height,5);c.fill();c.stroke();c.shadowBlur=0;
      c.strokeStyle=l.hazard;c.lineWidth=5;c.beginPath();c.moveTo(-14,-o.height+8);c.lineTo(14,-8);c.moveTo(14,-o.height+8);c.lineTo(-14,-8);c.stroke();
      c.restore();
    }
    for(const item of this.items){
      const z=item.distance-this.distance;if(z>650||z<0)continue;
      const p=project(z),x=w/2+(laneX[item.lane]-w/2)*p.scale,y=p.y-25*p.scale;
      c.save();c.translate(x,y);c.scale(p.scale,p.scale);c.shadowColor=item.type==="energy"?"#4df6e8":l.item;c.shadowBlur=20;
      c.fillStyle=item.type==="energy"?"#4df6e8":l.item;c.beginPath();c.arc(0,0,11,0,Math.PI*2);c.fill();
      c.shadowBlur=0;c.fillStyle="#152039";c.font="bold 14px sans-serif";c.textAlign="center";c.textBaseline="middle";c.fillText(item.type==="energy"?"+":"$",0,1);c.restore();
    }
    for(const p of this.particles){c.globalAlpha=Math.max(0,p.life);c.fillStyle=p.color;c.shadowColor=p.color;c.shadowBlur=10;c.fillRect(p.x,p.y,p.size,p.size);}c.globalAlpha=1;c.shadowBlur=0;
  }
  draw() {
    const c=this.ctx,w=this.canvas.width,h=this.canvas.height;
    c.clearRect(0,0,w,h);this.drawBackground();this.drawObjects();
    if(this.state==="playing")this.player.draw(c,this.elapsed);
    else if(this.state==="menu"){
      const old=this.player.x;this.player.x=w*.72;this.player.y=h*.55;this.player.draw(c,this.bgTime);this.player.x=old;
    }
    // Vinheta discreta para profundidade.
    const v=c.createRadialGradient(w/2,h/2,h*.25,w/2,h/2,h*.75);v.addColorStop(0,"#00000000");v.addColorStop(1,"#03061199");c.fillStyle=v;c.fillRect(0,0,w,h);
  }
  end(won) {
    this.state=won?"won":"over";
    const score=Math.floor(this.score+this.distance);
    if(score>this.best){this.best=score;localStorage.setItem("neonRunBest",String(score));this.ui.setBest(score);}
    this.ui.showMenu(won?{
      kicker:"MISSÃO CONCLUÍDA",title:"VOCÊ É<br><span>LENDA.</span>",
      text:`Você venceu os três mundos com ${score} pontos. Seu recorde foi atualizado quando necessário.`,button:"↻ JOGAR NOVAMENTE"
    }:{
      kicker:"FIM DE JOGO",title:"TENTE<br><span>OUTRA VEZ.</span>",
      text:`Sua corrida terminou com ${score} pontos. Desvie dos obstáculos e pegue os itens de energia para durar mais.`,button:"↻ TENTAR NOVAMENTE"
    });
  }
  loop(timestamp) {
    const dt=Math.min((timestamp-this.lastFrame)/1000||0,0.033);this.lastFrame=timestamp;
    this.update(dt);this.draw();requestAnimationFrame(t=>this.loop(t));
  }
}
