/**
 * SORKEN
 */
window.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const score = { cheeseCount: 0, catEncounters: 0, eagleEncounters: 0 };
  const body = document.querySelector('body');

  // Enemy data
  const enemies = [
    {
      id: 55,
      type: 'cat',
      sound: { file: new Audio('sounds/cat-meow-401729.mp3'), volume: 0.8 },
      hp: 1,
    },
    {
      id: 56,
      type: 'cat',
      sound: { file: new Audio('sounds/cat-meow-297927.mp3'), volume: 0.8 },
      hp: 1,
    },
    {
      id: 57,
      type: 'cat',
      sound: {
        file: new Audio('sounds/cat-meowing-type-02-293290.mp3'),
        volume: 0.8,
      },
      hp: 1,
    },
    {
      id: 58,
      type: 'cat',
      sound: { file: new Audio('sounds/cat-meow-6226.mp3'), volume: 0.8 },
      hp: 1,
    },
    {
      id: 59,
      type: 'cat',
      sound: {
        file: new Audio('sounds/cat-meowing-type-01-293291.mp3'),
        volume: 0.9,
      },
      hp: 1,
    },
    {
      id: 70,
      type: 'eagle',
      sound: { file: new Audio('sounds/eagle.mp3'), volume: 0.8 },
      hp: 2,
    },
    { id: null, type: 'badCheese', sound: { file: null, volume: null }, hp: 1 },
  ];
  for (let enemy of enemies)
    enemy.sound.file ? (enemy.sound.file.preload = 'auto') : null; // Preload sounds

  // Event data
  const gameEvents = [
    {
      id: null,
      type: 'eagleSpawn',
      sound: { file: new Audio('sounds/eagle.mp3'), volume: 0.9 },
      hp: null,
    },
    { id: 90, type: 'digging', sound: { file: null, volume: null }, hp: null },
    {
      id: null,
      type: 'timesup',
      sound: {
        file: new Audio('sounds/clock-ticking-365218.mp3'),
        volume: 0.8,
      },
      hp: null,
    },
  ];
  for (let gameEvent of gameEvents)
    gameEvent.sound.file ? (gameEvent.sound.file.preload = 'auto') : null; // Preload sounds

  let rockford = document.getElementById('baddie1'),
    shakeWrap = document.getElementById('shake-wrap'),
    area = document.getElementById('flash'),
    left = area.offsetLeft, // CSS positioning
    top = area.offsetTop,
    posLeft = 0, // Steps right/left
    posTop = 0, // Steps up/down
    tileSize = smallDevice() ? 14 : 32, // Tile size in height/width
    gridSize = 24, // Grid size 24x24
    gameStarted = false,
    livesCount = Number(),
    lastItemIndex,
    /**
     * This is the background for the game area.
     */
    gameArea = [
      11,24,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,24,11
    ],
    gameBlocks = [
      30,10,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,
      30,10,10,10,10,30,90,10,10,10,10,10,30,10,10,10,10,10,10,30,91,10,10,30,
      30,10,30,30,10,30,30,30,30,30,30,10,30,10,10,10,10,10,10,30,30,30,10,30,
      30,10,30,22,10,10,10,30,55,10,10,10,30,10,10,10,90,10,10,10,10,30,10,30,
      30,10,30,30,30,30,10,30,10,30,30,30,30,30,10,30,30,30,30,30,10,30,10,30,
      30,20,10,10,10,10,10,10,10,10,10,10,20,30,10,10,10,10,10,56,10,10,10,30,
      30,30,30,30,30,30,30,30,30,30,10,30,30,30,30,30,10,30,30,30,30,30,10,30,
      30,10,10,10,10,10,10,30,10,10,10,10,10,10,10,30,10,10,10,10,10,10,10,30,
      30,10,10,10,10,10,10,30,10,30,30,30,30,30,10,30,30,30,30,30,30,30,10,30,
      30,10,10,10,10,10,10,10,10,10,10,30,10,10,10,10,10,10,10,30,10,10,10,30,
      30,30,30,30,10,30,30,30,30,30,10,30,10,10,10,10,10,10,10,30,10,30,30,30,
      30,10,10,10,10,10,10,30,10,10,10,30,10,10,22,10,10,10,10,10,10,10,10,30,
      30,10,30,30,30,30,10,30,10,30,30,30,10,10,58,10,10,10,10,30,30,30,10,30,
      30,10,90,30,20,10,10,30,10,10,10,30,30,30,30,30,30,30,30,30,10,10,10,30,
      30,30,30,30,30,30,10,30,30,30,10,10,10,10,10,10,10,10,10,10,10,30,30,30,
      30,10,10,10,10,10,10,30,10,10,10,30,30,30,30,30,10,30,30,30,30,30,20,30,
      30,10,30,30,30,30,30,30,10,30,30,30,10,10,92,30,10,10,10,10,10,30,10,30,
      30,91,10,10,57,10,10,10,10,10,10,10,10,30,30,30,30,30,30,30,10,59,93,30,
      30,30,30,30,30,30,30,30,30,30,30,30,10,10,10,10,10,10,20,30,10,30,30,30,
      30,10,10,10,10,10,10,30,10,10,10,30,30,30,30,30,10,30,30,30,10,30,93,30,
      30,10,10,10,10,10,10,30,10,30,10,10,92,30,20,30,10,10,10,30,10,30,10,30,
      30,10,22,10,10,10,10,30,10,30,30,30,30,30,10,30,30,30,10,30,10,10,10,30,
      30,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,30,10,30,10,30,
      30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,10,30
    ];
  initTouchControls();
  initLives();

  area.classList.add('lightsout');

  /**
   * Draw the initial gameplan
   */
  function drawGamePlan(gameArea, gameBlocks) {
    let e;
    for (let i = 0; i < gameArea.length; i++) {
      e = document.createElement('div');
      e.className = 'tile t' + gameArea[i] + ' b' + gameBlocks[i];
      e.id = 'n' + i;
      area.appendChild(e);
    }
  }
  console.log('Drawing gameplan.');
  drawGamePlan(gameArea, gameBlocks);

  /**
   * Cats
   */
  const catBlocks = new Set([55, 56, 57, 58, 59]);
  let gameOver = false;

  // Game over, returnera meddelande och ev ljud.
  function loseGame(reason, soundId = null) {
    gameOver = true;

    const enemy = enemies.find(obj => obj.type === reason) ?? null;
    const gameEvent = gameEvents.find(obj => obj.type === reason) ?? null;
    if (!enemy && !gameEvent && !reason.length) return;

    let returnString;

    switch (reason) {
      case 'eagle':
        playSound(enemy.sound);
        returnString = `GAME OVER 💀\nDu blev tagen av örnen!`;
        break;

      case 'cat':
        playSound(enemy.sound);
        returnString = `GAME OVER 💀\nDu blev uppäten av en katt!`;
        break;

      case 'timesup':
        playSound(gameEvent.sound);
        returnString = `GAME OVER ⏰\nTiden gick ut!`;
        break;
    }

    body.classList.add('gameover');
    shakeWrap.classList.add('eaten');
    gameAlert(returnString ?? reason);
  }

  function eagleAlert(message) {
    const el = document.createElement('div');
    el.id = 'game-alert';
    el.classList.add('eagle-alert');
    el.innerText = message;

    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    el.style.position = 'absolute';
    el.style.top = scrollY + window.innerHeight / 2 + 'px';
    el.style.left = scrollX + window.innerWidth / 2 + 'px';
    el.style.transform = 'translate(-50%, -50%)';

    body.append(el);

    setTimeout(() => el.remove(), 2000);
  }

  function CountCheeses(blockNr) {
    let Cheeses = 0;

    gameBlocks.forEach(block => {
      if (block === blockNr) {
        Cheeses++;
      }
    });
    console.log(Cheeses);
    return Cheeses;
  }

  const CheeseToOpenDoor = CountCheeses(20);
  // let collectedCheese = score.cheeseCount;

  function openDoor(target, collected) {
    if (collected >= target) {
      gameBlocks[550] = 10;
    }
  }

  function bindPortals(blockNr) {
    const isPortal = blockNr; // Define what block numbers are portals
    const portals = [];
    const targetPortals = [];
    let portalId = 0;

    // Iterate through gameBlocks to find all portals
    gameBlocks.forEach((block, index) => {
      if (block === isPortal) {
        const x = index % gridSize; // Convert index to x position
        const y = Math.floor(index / gridSize); // Convert index to y position

        portals.push({
          // blockValue: block,
          id: portalId,
          x: x,
          y: y,
          index: index,
        });

        targetPortals.push(portalId);

        portalId++;
      }
    });

    portals.forEach(portalObject => {
      let target =
        targetPortals[Math.floor(Math.random() * targetPortals.length)];

      while (portalObject.id === target && targetPortals.length > 1) {
        // console.log('clash!');
        target =
          targetPortals[Math.floor(Math.random() * targetPortals.length)];
      }

      portalObject.targetPortal = target;
      targetPortals.splice(targetPortals.indexOf(target), 1);

      // console.log(`portal ${portalObject.id} targets ${portalObject.targetPortal}`);
    });

    // console.log(portals);

    return portals;
  }
  // Store the portals array so move() and portal() can access it
  const boundPortals = bindPortals(90);

  /**
   * Move Sorken
   */
  let move = function (moveLeft, moveTop, which) {
    function moveIt() {
      rockford.style.left = posLeft * tileSize + 'px';
      rockford.style.top = posTop * tileSize + 'px';
    }

    function portal(BlockNr, singleUse) {
      let portalIndex = posLeft + moveLeft + (posTop + moveTop) * gridSize;

      let enteredPortal = boundPortals.find(
        portal => portal.index === portalIndex,
      );

      let targetPortalID = enteredPortal.targetPortal;

      let targetPortal = boundPortals.find(
        portal => portal.id === targetPortalID,
      );

      if (gameBlocks[targetPortal.index] === BlockNr) {
        posLeft = targetPortal.x;
        posTop = targetPortal.y;
        moveIt();
      }
      if (singleUse) {
        // Let the portal cave in.
        gameBlocks[portalIndex] = 10;
        gameArea[portalIndex] = 89;
        drawGamePlan(gameArea, gameBlocks);
      }
    }

    if (which) {
      rockford.className = 'baddie ' + which;
    }

    /**
     * Cats
     */

    if (gameOver) return;

    const nextIndex = posLeft + moveLeft + (posTop + moveTop) * gridSize;

    if (nextIndex < 0 || nextIndex >= gameBlocks.length) return;

    const nextBlock = gameBlocks[nextIndex];

    // 🐱 KATT = FÖRLUST
    if (catBlocks.has(nextBlock)) {
      damage(nextBlock);
      return;
    }

    // First if means the baddie can movie
    if (!(nextBlock - 10)) {
      posLeft += moveLeft;
      posTop += moveTop;
      moveIt();
    } else {
      // If not possible to move:
      // Checks if player has moved since last updateScore.
      if (lastItemIndex === nextIndex) return;
      lastItemIndex = nextIndex;
      switch (nextBlock) {
        case 20: // Eat cheese
          checkEagleSpawn();
          openDoor(CheeseToOpenDoor, score.cheeseCount);

          updateScore(score.cheeseCount++);
          if (score.cheeseCount % 3 === 0) {
            addLives(1);
            console.log(
              score.cheeseCount === 3
                ? `Ate 3 cheeses (+1 HP).`
                : `Ate 3 more cheeses (+1 HP).`,
            );
          }

          shakeWrap.classList.add('eating');
          shakeWrap.addEventListener(
            'animationend',
            () => {
              shakeWrap.classList.remove('eating');

              area.innerHTML = "<div id='baddie1' class='baddie down'></div>"; // Empty the gameplan, except for baddie.
              gameBlocks[nextIndex] = 10;
              gameArea[nextIndex] = 28;
              drawGamePlan(gameArea, gameBlocks);
              rockford = document.getElementById('baddie1');
              moveIt();
            },
            { once: true },
          );
          break;

        case 22: // Get the Power Rod of Enlightment
          gameBlocks[nextIndex] = 10;
          gameArea[nextIndex] = 28;
          drawGamePlan(gameArea, gameBlocks);
          rockford = document.getElementById('baddie1');
          moveIt();
          area.classList.toggle('lightsout');
          break;

        case 90: // Get into portal
        case 91:
        case 92:
        case 93:
        case 94:
        case 95:
          shakeWrap.classList.add('digging');
          shakeWrap.addEventListener('animationend', () => shakeWrap.classList.remove('digging'));
          portal(nextBlock, true);
          break;

        case 99:
          // gameWon();
          alert('Du vann!');
          break;

        default:
          console.log('Block detected, cant move.');
      }
    }
  };
  console.log('Moving Sorken to spawn.');
  move(1, 0, 'down');

  function xyToTile(x, y) {
    return (x + y) * gridSize;
  }

  /**
   * Keep track on keys (and toch controls) pressed and move Sorken accordingly.
   */
  // Key codes.
  const k = {
    space: 32,
    left: 37,
    right: 39,
    up: 38,
    down: 40,
  };

  document.onkeydown = event => keyDown(event.keyCode || event.which);

  if (isTouchDevice()) {
    const touchControls = body.querySelector('#touch-controls');
    const touchKeys = touchControls?.querySelectorAll('button[id^="touch-"]');
    for (let key of touchKeys)
      key.addEventListener('touchstart', () => {
        const keyCode = Number(k[key.id.trim().split('-')[1]]);
        keyDown(keyCode);
      });
  }

  function keyDown(keyCode) {
    if (!gameStarted) {
      timer(true);
      gameStarted = true;
    }

    switch (keyCode) {
      case k.left:
        move(-1, 0, 'left');
        break;

      case k.right:
        move(1, 0, 'right');
        break;

      case k.up:
        move(0, -1, 'up');
        break;

      case k.down:
        move(0, 1, 'down');
        break;

      default:
        move(0, 0, 'down');
        break;
    }
    // console.log(
    //   "Keypress: " +
    //     event +
    //     " key: " +
    //     keyCode +
    //     " new pos: " +
    //     rockford.offsetLeft +
    //     ", " +
    //     rockford.offsetTop
    // );
  }

  function updateScore(val) {
    const scoreBoard = document.getElementById('scoreboard');
    const scoreCheeses = scoreBoard?.querySelector('#score-cheeses');
    const scoreCats = scoreBoard?.querySelector('#score-cats');

    scoreCheeses.innerText = score.cheeseCount;
    scoreCats.innerText = score.catEncounters;
  }

  // Set the timelimit argument in mm:ss format.
  ((timeLimit = '1:00') => {
    const timer = document.querySelector('#timer > span');
    if (!timer) return;

    timer.innerText = timeLimit;
  })();

  function timer(action) {
    const timer = document.querySelector('#timer > span');
    if (!timer) return;

    let [minutes, seconds] = timer.innerText.trim().split(':');
    const totSeconds = parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
    const end = Date.now() + totSeconds * 1000;

    const now = new Date();

    const x = setInterval(() => {
      const msLeft = Math.max(0, end - Date.now());

      const secsLeft = Math.ceil(msLeft / 1000);
      const minutes = Math.floor(secsLeft / 60);
      const seconds = secsLeft % 60;

      timer.innerHTML = `${minutes}:${String(seconds).padStart(2, '0')}`;

      if (msLeft === 0) {
        clearInterval(x);
        timer.classList.add('timesup');
        loseGame('timesup');
      }
    }, 250);
  }

  function gameAlert(message) {
    const el = document.createElement('div');
    el.id = 'game-alert';
    el.innerText = message;
    body.append(el);

    document.onkeydown = event => {
      if ((event.keyCode || event.which) === 32) location.reload();
    };
  }

  // Cats moving around (SMART CATS!)

  (function startMovingCats() {
    const CAT_IDS = [55, 56, 57, 58, 59];
    const EMPTY = 10;
    const INTERVAL = 600;
    const HUNT_RANGE = 7;

    const playerIndex = () => posLeft + posTop * gridSize;

    const dist = (a, b) => {
      const ax = a % gridSize,
        ay = Math.floor(a / gridSize);
      const bx = b % gridSize,
        by = Math.floor(b / gridSize);
      return Math.abs(ax - bx) + Math.abs(ay - by);
    };

    const neighbors = i => {
      const x = i % gridSize,
        y = Math.floor(i / gridSize);
      return [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1],
      ]
        .filter(
          ([nx, ny]) => nx >= 0 && ny >= 0 && nx < gridSize && ny < gridSize,
        )
        .map(([nx, ny]) => nx + ny * gridSize)
        .filter(n => gameBlocks[n] === EMPTY || n === playerIndex());
    };

    function moveCats() {
      if (gameOver) return;

      const cats = gameBlocks
        .map((v, i) => (CAT_IDS.includes(v) ? i : -1))
        .filter(i => i !== -1);

      cats.forEach(catIndex => {
        const pIndex = playerIndex();
        const opts = neighbors(catIndex);
        if (!opts.length) return;

        let target;

        if (dist(catIndex, pIndex) <= HUNT_RANGE) {
          target = opts.reduce((best, cur) =>
            dist(cur, pIndex) < dist(best, pIndex) ? cur : best,
          );
        } else {
          target = opts[Math.floor(Math.random() * opts.length)];
        }

        const catValue = gameBlocks[catIndex];
        gameBlocks[catIndex] = EMPTY;
        gameBlocks[target] = catValue;

        if (target === pIndex) damage(catValue);
      });

      area.querySelectorAll('.tile').forEach(t => t.remove());
      drawGamePlan(gameArea, gameBlocks);
    }

    setInterval(moveCats, INTERVAL);
  })();

  // Check if player is on touch device
  function isTouchDevice() {
    return navigator.maxTouchPoints > 0;
  }

  // Check viewport width
  function smallDevice() {
    return window.innerWidth <= 960;
  }

  // Initialize touch controls
  function initTouchControls() {
    if (isTouchDevice()) {
      const touchControls = [
        { id: 'touch-controls', type: 'div', parent: 'body' },
        { id: 'touch-left', type: 'button', parent: '#touch-controls' },
        { id: 'touch-right', type: 'button', parent: '#touch-controls' },
        { id: 'touch-up', type: 'button', parent: '#touch-controls' },
        { id: 'touch-down', type: 'button', parent: '#touch-controls' },
      ];

      for (let obj of touchControls) {
        const parent = document.querySelector(obj.parent),
          el = document.createElement(obj.type);
        el.addEventListener('pointerdown', () => el.classList.add('active'));
        ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => {
          el.addEventListener(ev, () => el.classList.remove('active'));
        });

        el.id = obj.id;
        parent.append(el);
      }

      let lastTouchEnd = 0;

      document.addEventListener(
        'touchend',
        function (e) {
          const now = Date.now();
          if (now - lastTouchEnd <= 300) {
            e.preventDefault();
          }
          lastTouchEnd = now;
        },
        { passive: false },
      );
    }
  }

  // Enemies Above DLC

  const EAGLE_ID = 70;
  let eagleIndex = null;
  let eagleInterval = null;

  function countRemainingCheese() {
    return gameBlocks.filter(b => b === 20).length;
  }

  function checkEagleSpawn() {
    if (eagleIndex !== null) return;
    if (countRemainingCheese() > 2) return;

    const gameEvent = gameEvents.find(obj => obj.type === 'eagleSpawn') ?? null;

    // Random Eagle Spawn

    const emptyTiles = gameBlocks
      .map((v, i) => (v === 10 ? i : -1))
      .filter(i => i !== -1);

    eagleIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    gameBlocks[eagleIndex] = EAGLE_ID;

    eagleAlert('EN VILD ÖRN DYKER UPP! 🦅');

    playSound(gameEvent.sound);
    startEagle();
  }

  function startEagle() {
    eagleInterval = setInterval(() => {
      if (gameOver) return;

      const px = posLeft;
      const py = posTop;

      const ex = eagleIndex % gridSize;
      const ey = Math.floor(eagleIndex / gridSize);

      const dx = Math.sign(px - ex);
      const dy = Math.sign(py - ey);

      let nx = ex + dx;
      let ny = ey + dy;

      // Clamp inside grid (but ignores walls)
      nx = Math.max(0, Math.min(gridSize - 1, nx));
      ny = Math.max(0, Math.min(gridSize - 1, ny));

      const nextIndex = nx + ny * gridSize;

      gameBlocks[eagleIndex] = 10;
      eagleIndex = nextIndex;
      gameBlocks[eagleIndex] = EAGLE_ID;

      // Collision
      if (eagleIndex === px + py * gridSize) {
        damage('eagle');
      }

      area.querySelectorAll('.tile').forEach(t => t.remove());
      drawGamePlan(gameArea, gameBlocks);
    }, 400);
  }

  // Initialize life-bar
  function initLives(numLives = 3) {
    const lifeBar = document.createElement('ul');
    lifeBar.id = 'life-bar';
    area.before(lifeBar);
    addLives(numLives);
  }

  // Add lives (hp)
  function addLives(numLives = 1) {
    const lifeBar = document.querySelector('#life-bar');
    if (!lifeBar) return;

    let el,
      intervalId,
      i = 0;
    intervalId ??= setInterval(() => {
      el = document.createElement('li');
      el.classList.add = 'life';
      lifeBar.append(el);
      livesCount++;
      i++;
      if (i === numLives) clearInterval(intervalId);
    }, 500);
  }

  // Remove lives (hp)
  function removeLives(numLives = 1) {
    const lifeBar = document.querySelector('#life-bar');
    if (!lifeBar) return;

    let el = lifeBar.querySelectorAll('li'),
      intervalId,
      i = 0;

    if (!el.length) return;

    intervalId ??= setInterval(() => {
      el[i].remove();
      livesCount--;
      i++;
      if (i === numLives) clearInterval(intervalId);
    }, 500);
  }

  // Inflict damage
  function damage(enemyType) {
    if (!enemyType || !enemies) return;

    let enemy;
    for (let obj of enemies) {
      if (obj.id === enemyType || obj.type == enemyType) {
        // Hämta första objektet som innehåller antingen id eller typ.
        enemy = obj;
        break;
      }
    }

    updateScore(score[enemy.type + 'Encounters']++); // Update scores.

    console.log(`Damage from ${enemy.type} (-${enemy.hp} HP).`);

    if (livesCount > 1) {
      // Om mer än 1hp finns kvar
      // shakeWrap.classList.remove('nibbed'); // Ta bort nibbed-classen för säkerhets skull.
      // void shakeWrap.offsetWidth; // Återställ för att kunna köra animation direkt igen.
      shakeWrap.classList.add('nibbed'); // Lägg till nibbeed-classen för att köra animation.
      shakeWrap.addEventListener('animationend', () => {
        shakeWrap.classList.remove('nibbed');
      });

      playSound(enemy.sound);
      removeLives(enemy.hp); // Ta bort hp.
    } else {
      console.log(`Killed by ${enemy.type}.`);
      loseGame(enemy.type); // Om ingen hälsa kvar, förlora.
    }
  }

  //   function addTime(seconds) {

  //   }

  function playSound(sound) {
    sound.file.volume = sound.volume;
    sound.file.currentTime = 0;
    sound.file.play().catch(err => console.log('Audio blocked:', err));
  }

  console.log('Everything is ready.');
});
