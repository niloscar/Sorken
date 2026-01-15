/**
 * SORKEN
 */
window.addEventListener('DOMContentLoaded', function () {
	'use strict';
  	const score = {cheeseCount: 0, catEncounters: 0};
  	let rockford = document.getElementById('baddie1'),
	shakeWrap = document.getElementById('shake-wrap'),
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
      19,10,10,10,10,19,90,10,10,10,10,10,19,10,10,10,10,10,10,19,91,10,10,19,
      19,10,19,19,10,19,19,19,19,19,19,10,19,10,10,10,10,10,10,19,19,19,10,19,
      19,10,19,10,10,10,10,19,55,10,10,10,19,10,10,10,90,10,10,10,10,19,10,19,
      19,10,19,19,19,19,10,19,10,19,19,19,19,19,10,19,19,19,19,19,10,19,10,19,
      19,20,10,10,10,10,10,10,10,10,10,10,20,19,10,10,10,10,10,56,10,10,10,19,
      19,19,19,19,19,19,19,19,19,19,10,19,19,19,19,19,10,19,19,19,19,19,10,19,
      19,10,10,10,10,10,10,19,10,10,10,10,10,10,10,19,10,10,10,10,10,10,10,19,
      19,10,10,10,10,10,10,19,10,19,19,19,19,19,10,19,19,19,19,19,19,19,10,19,
      19,10,10,10,10,10,10,10,10,10,10,19,10,10,10,10,10,10,10,19,10,10,10,19,
      19,19,19,19,10,19,19,19,19,19,10,19,10,10,10,10,10,10,10,19,10,19,19,19,
      19,10,10,10,10,10,10,19,10,10,10,19,10,10,10,10,10,10,10,10,10,10,10,19,
      19,10,19,19,19,19,10,19,10,19,19,19,10,10,58,10,10,10,10,19,19,19,10,19,
      19,10,90,19,20,10,10,19,10,10,10,19,19,19,19,19,19,19,19,19,10,10,10,19,
      19,19,19,19,19,19,10,19,19,19,10,10,10,10,10,10,10,10,10,10,10,19,19,19,
      19,10,10,10,10,10,10,19,10,10,10,19,19,19,19,19,10,19,19,19,19,19,20,19,
      19,10,19,19,19,19,19,19,10,19,19,19,10,10,92,19,10,10,10,10,10,19,10,19,
      19,91,10,10,57,10,10,10,10,10,10,10,10,19,19,19,19,19,19,19,10,59,93,19,
      19,19,19,19,19,19,19,19,19,19,19,19,10,10,10,10,10,10,20,19,10,19,19,19,
      19,10,10,10,10,10,10,19,10,10,10,19,19,19,19,19,10,19,19,19,10,19,93,19,
      19,10,10,10,10,10,10,19,10,19,10,10,92,19,20,19,10,10,10,19,10,19,10,19,
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

		shakeWrap.classList.add('eaten');

    	const sound = catSounds[catValue];
    	if (sound) {
      		sound.currentTime = 0;
      		sound.play().catch(err => console.log('Audio blocked:', err));
    	}

		gameAlert(`GAME OVER 💀 Du blev uppäten av en katt!`);
  	}
    
    /**
     * Move Sorken
     */
   	let move = function(moveLeft, moveTop, which) {
		
		function moveIt() {
			rockford.style.left = (posLeft * tileSize) + 'px';
			rockford.style.top  = (posTop  * tileSize) + 'px';
		}
		
		function portal(portal1, portal2) { // Make a pair of gameblocks into two-way portals. (n.index of portal 1, n.index portal 2)
			let portalIndex = posLeft + moveLeft + (posTop + moveTop) * gridSize; // position of enter portal/player
			let targetIndex = portalIndex === portal1 ? portal2 : portal1; // position of portal player exits
			posLeft = targetIndex % gridSize; // calculates the new column position of player - Had to leverage AI for this calculation ._.
			posTop = Math.floor(targetIndex / gridSize); // calculates the new row position of player
			moveIt();
		}

		if(which) { rockford.className='baddie ' + which; }

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

		if (!(nextBlock - 10)) {
			posLeft += moveLeft; 
			posTop  += moveTop;
			moveIt();
		} else if (nextBlock === 90) {
			portal(88, 409);
		} else {
			// If not possible to move:
			switch(tilePosition) {
				case 121:
				case 132:
				case 316:
				case 382:
				case 450:
				case 494:
				
					updateScore(score.cheeseCount++);
					shakeWrap.classList.add('eating');
					
					shakeWrap.addEventListener('animationend', () => {
						shakeWrap.classList.remove('eating');

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
     * Keep track on keys pressed and move Sorken accordingly.
    */
	document.onkeydown = function(event) {
		let key;
		key = event.keyCode || event.which;

		if (!gameStarted) {
			timer(true);
			gameStarted = true;
		}

		const k = {
			space: 32,
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

	// Set the timelimit argument in mm:ss format.
	((timeLimit = '1:00') => {
		const timer = document.querySelector("#timer > span");
		if (!timer) return;

		timer.innerText = timeLimit;
	})();

	function timer(action) {
		const timer = document.querySelector("#timer > span");
		if (!timer) return;

 		let [minutes, seconds] = timer.innerText.trim().split(":");
		const totSeconds = (parseInt(minutes, 10) * 60) + parseInt(seconds, 10);
		const end = Date.now() + totSeconds * 1000;

		const now = new Date();
		let countDownTime = new Date(now.getTime() + minutes * (seconds == 0 ? 60 : seconds) * 1000);

		const x = setInterval(() => {
			const msLeft = Math.max(0, end - Date.now());

			const secsLeft = Math.ceil(msLeft / 1000);
			const minutes = Math.floor(secsLeft / 60);
			const seconds = secsLeft % 60;

			timer.innerHTML = `${minutes}:${String(seconds).padStart(2, "0")}`;

			if (msLeft === 0) {
				clearInterval(x);
				timer.classList.add("timesup");
				gameAlert("TIDEN ÄR UTE!");
			}
		}, 250);
	}

	function gameAlert(message) {
		const el = document.createElement('div');
		el.id = 'game-alert';
		el.innerText = message;
		document.querySelector('body').append(el);

		document.onkeydown = (event) => {
			if ((event.keyCode || event.which) === 32) location.reload();
		}
	}
	
  	console.log('Everything is ready.');  
});


