/**
 * Work with strings.
 */
window.addEventListener("DOMContentLoaded", function() {
  'use strict';
  let rockford = document.getElementById('baddie1'),
    area = document.getElementById('flash'),
    left = area.offsetLeft, // CSS positioning
    top  = area.offsetTop,
    posLeft = 0,    // Steps right/left
    posTop = 0,     // Steps up/down
    tileSize = 32,  // Tile size in height/width -> 32px
    gridSize = 24,  // Grid size 24x24
    
    

    /**
     * This is the background for the game area.
     */
    gameArea = [
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
      10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,
      10,10,10,10,10,10,10,10,10,10,10,10,99,99,99,99,99,99,99,99,99,10,10,10
    ],

    gameBlocks = [
      19,10,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,
      19,10,10,10,10,19,10,10,10,10,10,10,19,10,10,10,10,10,10,19,10,10,10,19,
      19,10,19,19,10,19,19,19,19,19,19,10,19,10,10,10,10,10,10,19,19,19,10,19,
      19,10,19,10,10,10,10,19,10,10,10,10,19,10,10,10,10,10,10,10,10,19,10,19,
      19,10,19,19,19,19,10,19,10,19,19,19,19,19,10,19,19,19,19,19,10,19,10,19,
      19,10,10,10,10,10,10,10,10,10,10,10,10,19,10,10,10,10,10,10,10,10,10,19,
      19,19,19,19,19,19,19,19,19,19,10,19,19,19,19,19,10,19,19,19,19,19,10,19,
      19,10,10,10,10,10,10,19,10,10,10,10,10,10,10,19,10,10,10,10,10,10,10,19,
      19,10,10,10,10,10,10,19,10,19,19,19,19,19,10,19,19,19,19,19,19,19,10,19,
      19,10,10,10,10,10,10,10,10,10,10,19,10,10,10,10,10,10,10,19,10,10,10,19,
      19,19,19,19,10,19,19,19,19,19,10,19,10,10,10,10,10,10,10,19,10,19,19,19,
      19,10,10,10,10,10,10,19,10,10,10,19,10,10,10,10,10,10,10,10,10,10,10,19,
      19,10,19,19,19,19,10,19,10,19,19,19,10,10,10,10,10,10,10,19,19,19,10,19,
      19,10,10,19,10,10,10,19,10,10,10,19,19,19,19,19,19,19,19,19,10,10,10,19,
      19,19,19,19,19,19,10,19,19,19,10,10,10,10,10,10,10,10,10,10,10,19,19,19,
      19,10,10,10,10,10,10,19,10,10,10,19,19,19,19,19,10,19,19,19,19,19,10,19,
      19,10,19,19,19,19,19,19,10,19,19,19,10,10,10,19,10,10,10,10,10,19,10,19,
      19,10,10,10,10,10,10,10,10,10,10,10,10,19,19,19,19,19,19,19,10,10,10,19,
      19,19,19,19,19,19,19,19,19,19,19,19,10,10,10,10,10,10,10,19,10,19,19,19,
      19,10,10,10,10,10,10,19,10,10,10,19,19,19,19,19,10,19,19,19,10,19,10,19,
      19,10,10,10,10,10,10,19,10,19,10,10,10,19,10,19,10,10,10,19,10,19,10,19,
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
     * Move Rockford
    */
   let move = function(moveLeft, moveTop, which) {
     
     function moveIt() {
       rockford.style.left = (area.offsetLeft + posLeft*tileSize + tileSize/2) + 'px';
       rockford.style.top  = (area.offsetTop + posTop*tileSize + tileSize/2) + 'px';      
      // console.log("Moved to: " + rockford.style.left + "x" + rockford.style.top);
      };
      if(which) { rockford.className='baddie ' + which; }
      
      
      // First if means the baddie can movie

      console.log((posLeft+moveLeft)+(posTop+moveTop)*gridSize);

      if(!(gameBlocks[(posLeft+moveLeft)+(posTop+moveTop)*gridSize]-10)) {
        posLeft += moveLeft; 
        posTop  += moveTop;
        moveIt();
      } else if ((posLeft+moveLeft)+(posTop+moveTop)*gridSize === 11) {
        alert('TADA!!');
        gameBlocks[344] = 10;
        drawGamePlan(gameArea, gameBlocks);
        rockford = document.getElementById('baddie1');
        moveIt();
      } else if ((posLeft+moveLeft)+(posTop+moveTop)*gridSize === 457) {
        
        // Cheese
        alert('TADA!!');
        gameBlocks[457] = 10;
        drawGamePlan(gameArea, gameBlocks);
        rockford = document.getElementById('baddie1');
        moveIt();
      } else {  // Else means the baddie cannot move because of a wall
        console.log('Block detected, cant move.');
      }

      
    };
    console.log('Moving Mickey Mos (Rockford) to initial spot.');  
    move(1, 1, 'down');
    

    function xyToTile (x, y) {
      return (x + y) * gridSize;
    }

    /**
     * Keep track on keys pressed and move Rockford accordingly.
    */
   document.onkeydown = function(event) {
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

    console.log('Everything is ready.');  
});