/**
 * Work with strings.
 */
window.addEventListener("DOMContentLoaded", function() {
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
      console.log('Drawing gameplan.');
    };
    drawGamePlan(gameArea, gameBlocks);
    
    /**
     * Move Rockford
    */
   let move = function(moveLeft, moveTop, which) {
    
      function moveIt() {
        rockford.style.left = (posLeft * tileSize) + 'px';
        rockford.style.top  = (posTop  * tileSize) + 'px';
      }
      if(which) { rockford.className='baddie ' + which; }
      
      
      // First if means the baddie can movie
      
      let tilePosition = (posLeft + moveLeft) + (posTop + moveTop) * gridSize;
      console.log(tilePosition);
      if (!(gameBlocks[tilePosition]-10)) {
        // If possible to move.
        posLeft += moveLeft; 
        posTop  += moveTop;
        moveIt();
        
      } else {
        // If not possible to move:
        switch(tilePosition) {
          case 121:
          case 132:
          case 316:
          case 382:
          case 450:
          case 494:
            const wrap = area.closest('#shake-wrap');
        
            updateScore(score.cheeseCount++);
            wrap.classList.add('eating');

            wrap.addEventListener('animationend', () => {
              wrap.classList.remove('eating');

              area.innerHTML = "<div id='baddie1' class='baddie down'></div>"; // Empty the gameplan, except for baddie.
              gameBlocks[tilePosition] = 10;
              gameArea[tilePosition] = 28;
              drawGamePlan(gameArea, gameBlocks);
              rockford = document.getElementById('baddie1');
              moveIt();
              
            }, { once: true });
            break;

          default:
            console.log('Block detected, cant move.');
        }
      }
      
    };
    console.log('Flyttar sork till utgångsposition.');  
    move(1, 0, 'down');
    

    function xyToTile (x, y) {
      return (x + y) * gridSize;
    }

    /**
     * Keep track on keys pressed and move Rockford accordingly.
    */
   document.onkeydown = function(event) {
    if (!gameStarted) {
      timer();
      gameStarted = true;
    }
    let key;
    key = event.keyCode || event.which;

    const k = {
      left:   37,
      right:  39,
      up:     38,
      down:   40
    }

    switch(key) {
      case k.left: move(-1, 0, 'left'); break;
      case k.right: move(1, 0, 'right'); break;
      case k.up: move(0, -1, 'up'); break;
      case k.down: move(0, 1, 'down'); break; 
      default: move(0, 0, 'down'); break;
    };
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

    // Update the count down every 1 second
    let x = setInterval(function() {

      // Find the distance between now and the count down date
      let distance = countDownDate - new Date();

      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);

      timer.innerHTML = minutes + ":" + seconds;

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        timer.classList.add('timesup');
        timer.innerHTML = "TIDEN ÄR UTE!";
      }
    }, 1000);
  }

  console.log('Everything is ready.');  
});