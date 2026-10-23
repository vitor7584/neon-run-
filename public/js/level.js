// Dados de cada mundo e geração de obstáculos/coletáveis.
const LEVELS = [
  { name:"FLORESTA NEON", goal:650, speed:245, sky:"#102b35", horizon:"#174d52", road:"#172b36", accent:"#4df6e8", hazard:"#ff557d", item:"#ffe66d", scenery:"forest" },
  { name:"DUNAS SOLARES", goal:850, speed:290, sky:"#482b48", horizon:"#a64e57", road:"#39283d", accent:"#ffc66d", hazard:"#ff5c78", item:"#fff18b", scenery:"desert" },
  { name:"METRÓPOLE ZERO", goal:1050, speed:340, sky:"#101633", horizon:"#293b72", road:"#171b31", accent:"#a58bff", hazard:"#ff4fa3", item:"#4df6e8", scenery:"city" }
];

function makeObstacle(lane, distance, type = "block") {
  return { lane, distance, type, hit:false, width:type === "barrier" ? 56 : 38, height:type === "barrier" ? 30 : 40 };
}
function makeCollectible(lane, distance, type = "coin") {
  return { lane, distance, type, collected:false };
}
