/**
 * Work with strings.
 */
window.addEventListener('DOMContentLoaded', function () {
  'use strict';
  const score = {cheeseCount: 0, catEncounters: 0};
  let rockford = document.getElementById('baddie1'),
    area = document.getElementById('flash'),
    left = area.offsetLeft, // CSS positioning
    top  = area.offsetTop,
    posLeft = 0,    // Steps right/left
    posTop = 0,     // Steps up/down
    tileSize = 32,  // Tile size in height/width -> 32px
    gridSize = 24,  // Grid size 24x24
    gameStarted = false,
    
    

    /**
     * This is the background for the game area.
     */
    // prettier-ignore
    gameArea = [
      10,24,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,24,10
    ],

    // prettier-ignore
    gameBlocks = [
      19,10,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,
      19,10,10,10,10,19,99,10,10,10,10,10,19,10,10,10,10,10,10,19,99,10,10,19,
      19,10,19,19,10,19,19,19,19,19,19,10,19,10,10,10,10,10,10,19,19,19,10,19,
      19,10,19,10,10,10,10,19,10,10,10,10,19,10,10,10,10,10,10,10,10,19,10,19,
      19,10,19,19,19,19,10,19,10,19,19,19,19,19,10,19,19,19,19,19,10,19,10,19,
      19,20,10,10,10,10,10,10,10,10,10,10,20,19,10,10,10,10,10,10,10,10,10,19,
      19,19,19,19,19,19,19,19,19,19,10,19,19,19,19,19,10,19,19,19,19,19,10,19,
      19,10,10,10,10,10,10,19,10,10,10,10,10,10,10,19,10,10,10,10,10,10,10,19,
      19,10,10,10,10,10,10,19,10,19,19,19,19,19,10,19,19,19,19,19,19,19,10,19,
      19,10,10,10,10,10,10,10,10,10,10,19,10,10,10,10,10,10,10,19,10,10,10,19,
      19,19,19,19,10,19,19,19,19,19,10,19,10,10,10,10,10,10,10,19,10,19,19,19,
      19,10,10,10,10,10,10,19,10,10,10,19,10,10,10,10,10,10,10,10,10,10,10,19,
      19,10,19,19,19,19,10,19,10,19,19,19,10,10,10,10,10,10,10,19,19,19,10,19,
      19,10,99,19,20,10,10,19,10,10,10,19,19,19,19,19,19,19,19,19,10,10,10,19,
      19,19,19,19,19,19,10,19,19,19,10,10,10,10,10,10,10,10,10,10,10,19,19,19,
      19,10,10,10,10,10,10,19,10,10,10,19,19,19,19,19,10,19,19,19,19,19,20,19,
      19,10,19,19,19,19,19,19,10,19,19,19,10,10,99,19,10,10,10,10,10,19,10,19,
      19,10,10,10,10,10,10,10,10,10,10,10,10,19,19,19,19,19,19,19,10,10,10,19,
      19,19,19,19,19,19,19,19,19,19,19,19,10,10,10,10,10,10,20,19,10,19,19,19,
      19,10,10,10,10,10,10,19,10,10,10,19,19,19,19,19,10,19,19,19,10,19,99,19,
      19,10,10,10,10,10,10,19,10,19,10,10,99,19,20,19,10,10,10,19,10,19,10,19,
      19,10,10,10,10,10,10,19,10,19,19,19,19,19,10,19,19,19,10,19,10,10,10,19,
      19,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,19,10,19,10,19,
      19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,10,19
    ];

    /**
     * Draw the initial gameplan
    */
   function drawGamePlan(gameArea, gameBlocks) {
     let e;
     for(let i = 0; i < gameArea.length; i++) {
       e = document.createElement('div');
       e.className = 'tile t' + gameArea[i] + ' b' + gameBlocks[i];

       e.id = 'n' + i;
       area.appendChild(e);
      } 
    };
    console.log('Drawing gameplan.');  
    drawGamePlan(gameArea, gameBlocks);
    
      /**
   * Cats
   */
  const catBlocks = new Set([55, 56, 57, 58, 59]);
  let gameOver = false;

  // MEOW (läggs UTANFÖR loseGame, så den finns innan den används)
  const catSounds = {
    55: new Audio('sounds/cat-meow-401729.mp3'),
    56: new Audio('sounds/cat-meow-297927.mp3'),
    57: new Audio('sounds/cat-meowing-type-02-293290.mp3'),
    58: new Audio('sounds/cat-meow-6226.mp3'),
    59: new Audio('sounds/cat-meowing-type-01-293291.mp3'),
  };

  Object.values(catSounds).forEach(a => {
    a.preload = 'auto';
    a.volume = 0.8;
  });

  function loseGame(catValue) {
    gameOver = true;

    const sound = catSounds[catValue];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(err => console.log('Audio blocked:', err));
    }

    alert(`GAME OVER 💀 Du blev uppäten av en katt!`);

    location.reload();
  }
    
    /**
     * Move Rockford
    */
   let move = function(moveLeft, moveTop, which) {
     
      function moveIt() {
        rockford.style.left = (posLeft * tileSize) + 'px';
        rockford.style.top  = (posTop  * tileSize) + 'px';
      }
      if(which) { rockford.className='baddie ' + which; }
      
    function portal(portal1, portal2) { // Make a pair of gameblocks into two-way portals. (n.index of portal 1, n.index portal 2)
      let portalIndex = posLeft + moveLeft + (posTop + moveTop) * gridSize; // position of enter portal/player
      let targetIndex = portalIndex === portal1 ? portal2 : portal1; // position of portal player exits
      posLeft = targetIndex % gridSize; // calculates the new column position of player - Had to leverage AI for this calculation ._.
      posTop = Math.floor(targetIndex / gridSize); // calculates the new row position of player
      moveIt();
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
      loseGame(nextBlock);
      return;
    }


      // First if means the baddie can movie
      let tilePosition = (posLeft + moveLeft) + (posTop + moveTop) * gridSize;
      console.log(tilePosition);

      if(!(gameBlocks[(posLeft+moveLeft)+(posTop+moveTop)*gridSize]-10)) {
        posLeft += moveLeft; 
        posTop  += moveTop;
        moveIt();
      } else if (gameBlocks[(posLeft+moveLeft)+(posTop+moveTop)*gridSize] === 11) {
        alert('TADA!!');
        gameBlocks[344] = 10;
        drawGamePlan(gameArea, gameBlocks);
        rockford = document.getElementById('baddie1');
        moveIt();
      } else if (nextBlock === 90) {
        portal(88, 409);
      } else {
        console.log('Block detected, cant move.');
      }
    };
    console.log('Moving Mickey Mos (Rockford) to initial spot.');  
    move(1, 1, 'down');
    
    
    /**
     * Keep track on keys pressed and move Rockford accordingly.
    */
   document.onkeydown = function(event) {
    let key;
    key = event.keyCode || event.which;

    const k = {
      left: 37,
      right: 39,
      up: 38,
      down: 40,
    };

    switch (key) {
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
    console.log('Keypress: ' + event + ' key: ' + key + ' new pos: ' + rockford.offsetLeft + ', ' + rockford.offsetTop);
  };

  function updateScore(val) {
    const scoreBoard = document.getElementById('scoreboard');
    const scoreCheeses = scoreBoard?.querySelector('#score-cheeses');
    const scoreCats = scoreBoard?.querySelector('#score-cats');

    scoreCheeses.innerText = (score.cheeseCount);
    scoreCats.innerText = (score.catEncounters);
  }

  function timer() {
    const timer = document.querySelector("#timer > span");
    if (!timer) return;

    const now = new Date();
    let countDownDate = new Date(now.getTime() + 2 * 60 * 1000);

    console.log(countDownDate);

    let x = setInterval(function() {

      let distance = countDownDate - new Date();

      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      timer.innerHTML = minutes + ":" + seconds;

      if (distance < 0) {
        clearInterval(x);
        timer.classList.add('timesup');
        timer.innerHTML = "TIDEN ÄR UTE!";
      }
    }, 1000);
  }

  console.log('Everything is ready.');  
});
