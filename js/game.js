'use strict';

class Screen {

	constructor(menu, sound) {
		this.screen = document.querySelector('#game-screen');
		this.staticBackground = document.querySelector('#static-game-bg');
		this.activeBackground = document.querySelector('#active-game-bg');
		this.gameLayer = document.querySelector('#game-layer');
		this.interface = document.querySelector('#interface');
		this.music = document.querySelector('#game-music');
		this.mode = document.querySelector('#hardmode')
		this.hitpoints = [];
		this.yourShots = [];
		this.enemyShots = [];
		this.enemyShips = [];
		this.damage = 1;
		this.enemyMovement = false;
		this.backgroundPosX = 0;
		this.yourShotsCounter = 0;
		this.enemyShotsCounter = 0;
		this.enemiesCount = 0;
		this.shotCount = 0;
		this.scoreValue = 0;
		this.lastShipPauseDif = 0;
		this.state = 'deactivated';
		this.you = new Ship('your-ship', '0vw', 'right', '1vw', '41vh', 0);
		this.you.ship.classList += 'cobra';
		this.staticBackground.style.backgroundPositionX = '0%';
		this.lastFire = Date.now();
		this.lastShip = Date.now();
		this.startTime = Date.now();
		this.health;
		this.score;
		this.menu = menu;
		this.sound = sound;
	}

	createInteface() {
		let score = document.createElement('span');
		let health = document.createElement('div');
		score.id = 'score';
		score.classList += 'game-text';
		score.innerHTML = 'Score: ' + this.scoreValue;
		health.id = 'health';
		health.classList += 'health';
		this.score = score;
		this.health = health;
		this.interface.appendChild(this.score);
		this.interface.appendChild(this.health);
		this.gameLayer.appendChild(this.you.ship);
		this.mode.checked === true ? this.addHp() : this.addHp(3); 
	}

	active(random, context) {
		if (Date.now() - context.lastShip > random) {
			if (context.enemiesCount > 20) { context.enemiesCount = 0; }
			let ship = new Ship('enemy-' + context.enemiesCount++, '0.05vw' , 'left', '-11vw' , Math.random() * (90 - 10) + 'vh', 3);
			ship.ship.classList += 'eagle';
			context.enemyShips.push(ship);
			context.gameLayer.appendChild(ship.ship);
			context.lastShip = Date.now();
			ship.strike(ship, context);
			context.lastShipPauseDif = 0;
		} else {
			context.lastShipPauseDif = Date.now() - context.lastShip;
		}
	}

	initActive() {
		this.menu.screen = new Screen(this.menu, this.sound);
		this.createInteface();
		this.state = 'active';
		let menuVideo = document.querySelector('#menu-layer-bg-dinamic');
		let menuMusic = document.querySelector('#menu-player');
		menuVideo.pause();
		menuMusic.pause();
		menuMusic.currentTime = 0;
		this.music.currentTime = 0;
		this.music.play();
		this.moveShots(this.yourShots, this);
		this.moveShots(this.enemyShots, this);
		this.youDamaged(this);
		this.enemyDamaged(this);
		this.moveBg(this);
		this.gameControlInit(this);
		this.moveEnemies(this);
		let context = this;
		let random = Math.random() * (15000 - 12000) + 500;
		(function loop() {
			random = Math.random() * (15000 - 12000) + 500;
			setTimeout(function() {
				if (context.state === 'active') {
					context.active(random, context);
					loop();
				}
			}, random);
		}());

		//initiation of double shots (60000 = 1 min)
		this.shotCountTimerInit(1, 60000);
	}

	pause() {
		this.sound.useItem('#m-item-back');
		this.shotCountTimerPause();
		this.backgroundPositionX = 0;
		this.enemyMovement = false;
		this.menu.mainMenu.style.display = 'block';
		this.menu.mainNav.style.display = 'inline-block';
		this.screen.style.display = 'none';
		this.music.pause();
		let menuVideo = document.querySelector('#menu-layer-bg-dinamic');
		let menuMusic = document.querySelector('#menu-player');
		menuMusic.currentTime = 0;
		menuMusic.play();
		menuVideo.play();
		this.menu.menuControl(this.menu);
		this.menu.screen = this;
		return this;
	}

	resume() {
		let menuVideo = document.querySelector('#menu-layer-bg-dinamic');
		let menuMusic = document.querySelector('#menu-player');
		menuVideo.pause();
		menuMusic.pause();
		menuMusic.currentTime = 0;
		this.music.play();
		this.shotCountTimerResume();
		this.moveShots(this.yourShots, this);
		this.moveShots(this.enemyShots, this);
		this.youDamaged(this);
		this.enemyDamaged(this);
		this.moveBg(this);
		this.gameControlInit(this);
		this.moveEnemies(this);
		this.lastShip = Date.now() - this.lastShipPauseDif;
		let context = this;
		let random = Math.random() * (15000 - 12000) + 500;
		(function loop() {
			random = Math.random() * (15000 - 12000) + 500;
			setTimeout(function() {
				if (context.state === 'resumed') {
					context.active(random, context);
					loop();
				}
			}, random);
		}());
	}

	exit() {
		this.menu.mainMenu.style.display = 'block';
		this.menu.mainNav.style.display = 'inline-block';
		this.screen.style.display = 'none';
		this.music.pause();
		this.music.currentTime = 0;
		let menuVideo = document.querySelector('#menu-layer-bg-dinamic');
		let menuMusic = document.querySelector('#menu-player');
		menuMusic.currentTime = 0;
		menuMusic.play();
		menuVideo.play();
		document.querySelector('#game-layer').innerHTML = '';
		document.querySelector('#interface').innerHTML = '';
		this.menu.menuControl(this.menu);
		this.menu.screen = new Screen(this.menu, this.menu.sound);
	}

	addHp(num, counter) {
		let n = num || 1;
		let c = counter || 0;
		if (c < n) {
			c++;
			let hitpoint = document.createElement('div');
			hitpoint.classList += 'hit-point';
			this.hitpoints.push(hitpoint);
			this.health.appendChild(hitpoint);
			this.you.health++;
			return this.addHp(n, c);
		}
	}

	decHp(context) {
		context.you.health--;
		let elem = document.querySelector('.hit-point').remove();
		if (context.you.health <= 0) {
			document.querySelector('#your-ship').remove();
			context.handleInput = undefined;
			setTimeout(function() {
				context.init('deactivated');
			}, 5000);
		}
	}

	setScore(score) {
		this.score = document.querySelector('#score');
		this.score.innerHTML = 'Score: ' + score;
	}

	shotCountTimerInit(val, delay) {
		this.shotCountTimerVal = val;
		this.shotCountTimerStart = Date.now();
		this.shotCountTimerDelay = delay;
		this.shotCountTimer = setTimeout(() => {
			this.shotCount = val;
		}, delay);
	}

	shotCountTimerAction() {
		this.shotCount = this.shotCountTimerVal;
	}

	shotCountTimerPause() {
		window.clearTimeout(this.shotCountTimer);
		this.shotCountTimerRemaining = Date.now() - this.shotCountTimerStart;
	}

	shotCountTimerResume() {
		this.shotCountTimerStart = Date.now();
		this.shotCountTimerDelay = this.shotCountTimerDelay - this.shotCountTimerRemaining;
		window.clearTimeout(this.shotCountTimer);
		this.shotCountTimer = window.setTimeout(() => this.shotCountTimerAction(), this.shotCountTimerDelay);
	}

	moveShots(arr, context) {
		let shotsMovement = setInterval(function() {
			if (context.state === 'active' || context.state === 'resumed') {
				arr.forEach( e => {
					let shot = document.querySelector('#' + e.item.id);
					if (arr === context.enemyShots) {
						if (toNumber(shot.style.right) > 100) {
							shot.remove();
							arr.splice(arr.indexOf(e), 1);
						} else {
							shot.style.right = updateString(shot.style.right, e.speed);
							e.x = shot.style.right;
							e.item = shot;
						}
					} else {
						if (toNumber(shot.style.left) > 100) {
							shot.remove();
							arr.splice(arr.indexOf(e), 1);
						} else {
							shot.style.left = updateString(shot.style.left, e.speed);
							e.x = shot.style.left;
							e.item = shot;
						}
					}
				});			
			}
			else {
				clearInterval(shotsMovement);
			}
		} , 1000 / 30);
	}

	moveBg(context) {
		let bgMovement = setInterval(function() {
			if (context.state === 'active' || context.state === 'resumed') {
				if (context.backgroundPosX > -2560) {
					context.backgroundPosX -= 10;
					context.staticBackground.style.backgroundPositionX = context.backgroundPosX + 'px';
				} else {
					context.backgroundPosX = 0;
					context.staticBackground.style.backgroundPositionX = '0px';
				}
			} else {
				clearInterval(bgMovement);
			}
		}, 1000 / 30);
	}

	moveEnemies(context) {
		let enemiesMove = setInterval(function() {
			if (context.state === 'active' || context.state === 'resumed') {
				let enemies = Array.from(document.querySelectorAll('.eagle'));
				enemies.forEach( e => {
				e.style.right = updateString(e.style.right, 1);
					if (e.style.right === '100vw' || e.style.right === '101vw' || e.style.right === '102vw') { 
						context.enemyShips.shift(); e.remove(); 
					} 
				});
				for (let i = 0; i < context.enemyShips.length; i++) {
					context.enemyShips[i].ship = enemies[i];
				}
				return enemies;
			} else {
				clearInterval(enemiesMove);
			}
		} , 1000 / 30);
	}

	youDamaged(context) {
		let interval = setInterval(function() {
			if (context.state === 'active' || context.state === 'resumed') {
				context.enemyShots.forEach( e => {
					if (context.you.ship !== null) {
						let elemCords = e.item.getBoundingClientRect();
						let yourCords = context.you.ship.getBoundingClientRect();
						if (elemCords.left <= yourCords.right - 20 && elemCords.left >= yourCords.left) {
							if (elemCords.top >= yourCords.top && elemCords.bottom <= yourCords.bottom) {
								let boom = new Explosion(elemCords.left, elemCords.top + (elemCords.bottom - elemCords.top) / 2, 'enemy');
								context.gameLayer.appendChild(boom.item);
								boom.remove(boom);
								context.sound.useItem('#boom-effect');
								context.decHp(context);
								e.item.remove();
								context.enemyShots.splice(context.enemyShots.indexOf(e), 1);
							}
						}
					}
				});
			}
		}, 1000 / 30);
	}

	enemyDamaged(context) {
		let interval = setInterval(function(){
			if (context.state === 'active' || context.state === 'resumed') {
				context.yourShots.forEach( e => {
					let elemCords = e.item.getBoundingClientRect();
					context.enemyShips.forEach( s => {
						let enemyCords = s.ship.getBoundingClientRect();
						if (elemCords.left <= enemyCords.right - 20 && elemCords.left >= enemyCords.left) {
							if (elemCords.top >= enemyCords.top && elemCords.bottom <= enemyCords.bottom) {
								context.setScore(++context.scoreValue);
								let boom = new Explosion(enemyCords.left - window.innerWidth / 100 * 2, elemCords.top + (elemCords.bottom - elemCords.top) / 2, 'you');
								context.gameLayer.appendChild(boom.item);
								boom.remove(boom);
								s.health = s.health - context.damage;
								context.sound.useItem('#boom-effect');
								if (s.health <= 0) {
									s.ship.remove();
									context.enemyShips.splice(context.enemyShips.indexOf(s), 1);
									context.scoreValue += 4; 
									context.setScore(context.scoreValue);
								}
								e.item.remove();
								context.yourShots.splice(context.yourShots.indexOf(e), 1);
							}
						}
					});
				});
			}
		}, 1000 / 30);
	}

	gameControlInit(context) {
		document.onmousedown = undefined;
		window.onkeydown = undefined;
		context.gameControl(context);
		let interval = setInterval(function() {
			if (context.state === 'active' || context.state === 'resumed') {
				if (context.you.ship !== null && context.handleInput !== undefined) {
					context.handleInput();
				}
			} else {
				clearInterval(interval);
			}
		}, 1000 / 30);
	}

	gameControl(context) { 
		(function() {
			let pressedKeys = {};
			function setKey (event, status) {
				let code = event.keyCode;
				let key;
				switch(code) {
					case 27:
						key = 'ESC'; break;
					case 32:
						key = 'SPACE'; break;
					case 37:
						key = 'LEFT'; break;
					case 38:
						key = 'UP'; break;
					case 39:
						key = 'RIGHT'; break;
					case 40:
						key = 'DOWN'; break;
					default:
						key = String.fromCharCode(code);
					}
				pressedKeys[key] = status;
			}
			document.addEventListener('keydown', function(e) {
				setKey(e, true);
			});
			document.addEventListener('keyup', function(e) {
				setKey(e, false);
			});
			window.addEventListener('blur', function() {
				pressedKeys = {};
				context.init('paused');
			});
			window.input = {
				isDown: function (key) {
					return pressedKeys[key.toUpperCase()];
				}
			};
		})();
	}

	handleInput() {
		if (input.isDown('ESC')) {
			this.init('paused');
		}
		if (input.isDown('DOWN') || input.isDown('s')) {
			this.you.move(40);
		}
		if (input.isDown('UP') || input.isDown('w')) {
			this.you.move(38);
		}
		if (input.isDown('SPACE') && Date.now() - this.lastFire > 300) {
			this.you.strike(this.you, this);
			this.lastFire = Date.now();
			this.sound.useItem('#your-shot-effect'); 
		}
	}

	init(state) {
		this.state = state;
		if (this.state === 'active') {
			this.initActive();
		} else if (this.state === 'paused') {
			this.pause();
		} else if (this.state === 'resumed') {
			return this.resume();
		} else if (this.state === 'deactivated') {
			this.exit();
		}
	}

}

class Ship {

	constructor (id, speed, side, x, y, health) {
		this.ship = document.createElement('div');
		this.ship.id = id;
		this.speed = speed;
		this.side = side;
		if (side === 'left') {
			this.ship.style.right = x;
		}
		if (side === 'right') {
			this.ship.style.left = x;
			y = '41vh';
		}
		this.ship.style.top = y;
		this.health = health;
	}

	move(keyCode) {
		if (this.ship !== null) {
			let ship = document.querySelector('#' + this.ship.id);
			if (ship !== null) {
				if (keyCode === 38 || keyCode === 87) { //move up your ship
					if (ship.style.top !== '7vh') {
						ship.style.top = updateString(this.ship.style.top, -1);
					}
				}
				if (keyCode === 40 || keyCode === 83) { //move down your ship
					if (ship.style.top !== '83vh') {
						ship.style.top = updateString(this.ship.style.top, 1);
					}
				}
			}
			if (ship !== null) {
				this.ship.style.top = ship.style.top;
			}
		}
	}

	createEnemyShots(context, ship, y) {
		let shot = new Shot(
			'enemy-shot-' + context.enemyShotsCounter++, 
			ship.style.right,
			updateString(ship.style.top, (toNumber(window.getComputedStyle(ship).height) / y) / (window.innerHeight / 100)),
			'left', 
			'enemy-shot'
		);
		shot.state = 'active';
		context.enemyShots.push(shot);
		context.gameLayer.appendChild(shot.item);
		context.sound.useItem('#enemy-shot-effect');
	}

	strike(el, context) {
		if(el.ship !== null) {
			if (el.ship.id !== 'your-ship') {
				let random = Math.random() * (10000 - 7000) + 500;
				(function loop() {
				    let random = Math.random() * (10000 - 7000) + 500;
				    setTimeout(function() {
						if (context.state === 'active' || context.state === 'resumed') {
							if (el !== undefined) {
								if (context.enemyShotsCounter >= 20) {
									context.enemyShotsCounter = 0;
								}
								let ship = document.querySelector('#' + el.ship.id);
								let y = 0;
								if (ship === null) {
									el = undefined;
								} else {
									if (context.shotCount === 0) {
										y = 2.5;
										el.createEnemyShots(context, ship, y);
									} else if (context.shotCount === 1) {
										y = 1.7;
										el.createEnemyShots(context, ship, y);
										y = 10;
										el.createEnemyShots(context, ship, y);
									}
								}
								loop();
							} else {
								return;
							}
							loop();
						} else {
							return;
						}
					}, random);
				}());
			} else if (el.ship.id === 'your-ship') {
				if (context.yourShotsCounter > 20) {
					context.yourShotsCounter = 0;
				}
				if (this.ship !== null) {
					this.y = this.ship.style.top;
					this.x = this.ship.style.left;
					let shot = new Shot(
						this.ship.id + '-shot-' + context.yourShotsCounter++, 
						this.x, 
						updateString(this.y, (toNumber(window.getComputedStyle(this.ship).height) / 2.5) / (window.innerHeight / 100)), 
						this.side, 
						'your-shot'
					);
					context.yourShots.push(shot);
					context.gameLayer.appendChild(shot.item);
				}
			}
		}	
	}

	remove(e) {
		return e = undefined;
	}

}

class Shot {

	constructor(id, x, y, side, cls) {
		this.item = document.createElement('div');
		this.item.id = id;
		this.item.classList += 'shot ' + cls;
		this.speed = 3;
		this.side = side;
		this.x = x;
		this.y = y;
		this.item.style.top = this.y;
		if (this.side === 'left') {
			this.item.style.right = this.x;
		} else {
			this.item.style.left = this.x;
		}		
	}

	remove(e) {
		return e = undefined;
	}

}

class Explosion {

	constructor(x, y, cls) {
		this.item = document.createElement('div');
		this.item.classList += 'explosion-' + cls;
		this.item.style.left = x + 'px';
		this.item.style.top = y + 'px';
	}

	remove(elem) {
		setTimeout(function() {
			elem.item.remove();
			elem = undefined;
		}, 1000)
	}

}