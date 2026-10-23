# 🏁 Neon Run — Corrida Aventura 2D

Jogo de corrida/aventura em três fases, feito com HTML5 Canvas, CSS3 e JavaScript puro. O Node.js serve os arquivos localmente; não há dependências externas no backend.

## Requisitos
- Node.js 18 ou superior (recomendado)
- Visual Studio Code
- Navegador moderno

## Executar
1. Abra a pasta `corrida-aventura-2d` no VS Code.
2. Abra o terminal integrado (**Terminal → Novo Terminal**).
3. Execute `npm start`.
4. Acesse `http://localhost:3000`.

Também pode executar `node server.js`.

## Controles
- Setas esquerda/direita ou A/D: mudar de faixa
- Espaço, seta para cima ou W: pular
- Celular: deslize para os lados ou para cima dentro da área do jogo

## Módulos
- `server.js`: servidor HTTP estático com módulos nativos do Node.
- `public/index.html`: estrutura e elementos da interface.
- `public/css/style.css`: layout, cores neon e responsividade.
- `public/js/player.js`: estado, movimento e desenho do corredor.
- `public/js/level.js`: dados dos mundos e fábricas de objetos.
- `public/js/ui.js`: menu, HUD, recorde e avisos.
- `public/js/game.js`: loop de jogo, renderização, colisões, progressão e pontuação.
- `public/js/main.js`: ponto de entrada e eventos dos botões.

## Como funciona
O jogo desenha tudo no Canvas usando `requestAnimationFrame`. O cenário é renderizado em camadas para simular parallax. A pista tem três faixas; os obstáculos são aproximados em perspectiva. O progresso, pontuação, colisões e energia são atualizados por frame. O recorde fica no `localStorage` do navegador.

## Personalização
- Mundos, velocidade e distância-alvo: `public/js/level.js`, array `LEVELS`.
- Cores e layout: variáveis no início de `public/css/style.css`.
- Desenho do corredor: método `draw()` em `public/js/player.js`.
- Frequência de obstáculos: método `spawn()` e variável `spawnAt` em `public/js/game.js`.

## Observações
- O botão de som é demonstrativo; áudio ainda não foi implementado.
- A fonte Google Fonts exige internet; com conexão indisponível, fontes de sistema são usadas.
- O jogo usa `CanvasRenderingContext2D.roundRect`, disponível nos navegadores modernos.

## Publicar no GitHub
1. Crie um repositório vazio no GitHub.
2. No terminal, dentro da pasta do projeto:
   ```bash
   git init
   git add .
   git commit -m "Cria jogo Neon Run"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/corrida-aventura-2d.git
   git push -u origin main
   ```
3. O `server.js` serve para execução local. Para publicar como site estático no GitHub Pages, os arquivos em `public/` precisam ficar na raiz publicada ou ser configurados em uma pasta/branch de publicação, pois o GitHub Pages não executa Node.js. Uma alternativa é usar Render, Railway ou outro host que execute Node.

## Melhorias futuras
- Efeitos sonoros reais usando Web Audio API.
- Novos obstáculos, chefes e fases.
- Itens temporários (escudo, ímã de moedas, turbo).
- Animações sprite e trilha sonora.
- Ranking online com backend e banco de dados.
- Multiplayer local por teclado.
