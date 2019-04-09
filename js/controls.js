'use strict';

class MainMenu {

	constructor(sound, video) {
		this.elem;
		this.counter = 0;
		this.codes = [];
		this.sound = sound;
		this.video = video;
		this.mainMenu = document.querySelector('#main-menu');
		this.mainNav = document.querySelector('#main-nav');
		this.intro = Array.from(document.querySelectorAll('.intro-video'));
		this.introvids = document.querySelector('#intro');
		this.ranges = Array.from(document.querySelectorAll('.range'));
		this.menuItem = Array.from(document.querySelectorAll('.menu-item'));
		this.optionPanels = Array.from(document.querySelectorAll('.option-panel'));
		this.optionsNav = document.querySelector('#options-nav');
		this.screen = new Screen(this, this.sound);
	}

	menuControl(menu) {
		window.captureEvents(Event.KEYDOWN | Event.KEYPRESS | Event.MOUSEDOWN);
		document.onmousedown = menu.pressed.bind(menu);
		window.onkeydown = menu.pressed.bind(menu);
		window.onkeypress = menu.pressed.bind(menu);
	}

	introEnd() {
		this.introSkip(this.counter, this.introvids, this.intro);
		let introBackup = this.intro[0];
		this.counter++;
		if (this.counter > 3) {
			this.introvids.remove();
			this.introvids = undefined;
			this.mainMenu.style.display = 'block';
			this.mainNav.style.display = 'inline-block';
			this.counter = -1;
		}
	}

	pressed(e) {
		//right click
		if (e.which === 2 || e.which === 3) {
			e.preventDefault();
		}
		//F1 - F12
		if (e.which <= 123 && e.which >= 112) {
			e.preventDefault();
		}
		//tab, shift+tab
		if (e.which === 9) {
			if (e.which === 16) {
				e.preventDefault();
			}
		}
		//esc
		if (e.which === 27) {
			this.escControl(); 
		}
		//left arrow, up arrow, a, w
		if (e.which === 37 || e.which === 38 || e.which === 65 || e.which === 87) {
			if (this.mainMenu.style.display !== 'none') {
				if (e.which === 38 || e.which === 87) {
					this.menuUp();	
				}
				if (e.which === 37 || e.which === 65) {
					if (this.elem !== undefined) {
						this.rangeControl(this.elem, e.which, this.sound);
					}
				}
			}	
		}
		//right arrow, down arrow, d, s
		if (e.which === 39 || e.which === 40 || e.which === 68 || e.which === 83) {
			if (this.mainMenu.style.display !== 'none') {
				if (e.which === 40 || e.which === 83) {
					this.menuDown();
				}
				if (e.which === 39 || e.which === 68) {
					if (this.elem !== undefined) {
						this.rangeControl(this.elem, e.which, this.sound);
					}
				}
			}
		}
	}

	introSkip(counter, introvids, intro) { 
		if (this.counter < 3 && this.intro[0] !== undefined) {
			this.intro[0].remove();
			this.intro.shift();
			if (this.intro[0] !== undefined) {
				this.intro[0].setAttribute('autoplay', 'autoplay');
				this.intro[0].play();
			}
		} else {
			this.introvids.remove();
			this.introvids = undefined;
			document.querySelector('#menu-layer-bg-dinamic').play();
			document.querySelector('#menu-player').play();
			this.mainMenu.style.display = 'block';
			this.mainNav.style.display = 'inline-block';
			this.counter = -1;
		}
	}

	escControl() {
		if (this.introvids !== undefined) {
			this.intro[0].currentTime += 200;
		} else if (this.mainNav.style.display === 'inline-block') {
			this.exitWindow(this);
		}
	}

	menuUp() {
		let menu = Array.from(document.querySelectorAll('.menu'));
		menu.forEach( e => {
			if (e.style.display === 'inline-block' || e.style.display === 'flex') {
				let currentMenu = e.querySelectorAll('.m-item');
				if (this.counter === -1) {
					this.counter = 0;
				}
				if (this.counter === 0) {
					currentMenu[this.counter].focus();
				}
				if (this.counter > 0) {
					this.counter--;
					this.detectDisabledItem(currentMenu, true);
				}
			}
		});
	}

	menuDown() {	
		let menu = Array.from(document.querySelectorAll('.menu'));
		menu.forEach( e => {
			if (e.style.display === 'inline-block' || e.style.display === 'flex') {
				let currentMenu = e.querySelectorAll('.m-item');
				if (this.counter < currentMenu.length-1) {
					this.counter++;
					this.detectDisabledItem(currentMenu, false);
				}
				if (this.counter === currentMenu.length-1) {
					currentMenu[this.counter].focus();
				}
			}
		});
	}

	detectDisabledItem(e, func) {
		if (func === true && e[this.counter].disabled === true) {
			this.counter--;
			this.detectDisabledItem(e, true); 
		} else if (e[this.counter].disabled === true) {
			this.counter++;
			this.detectDisabledItem(e, false);
		}
		e[this.counter].focus();
	}

	menuStart(menu) {
		menu.mainNav.style.display = 'none';
		menu.mainMenu.style.display = 'none';
		menu.screen.screen.style.display = 'block';
		menu.screen.menu = menu;
		menu.screen.sound = menu.sound;
		if (menu.screen.state === 'deactivated') {
			menu.screen.init('active', menu.screen);
		}
		else {
			menu.screen.init('resumed', menu.screen);
		}
	}

	exitWindow(menu) {
		let exitWindow = document.querySelector('#exit-window');
		menu.mainNav.style.display = 'inline-table';
		exitWindow.style.display = 'flex';
		menu.counter = -1;
	}

	exitConfirm() {
		window.open(window.location, '_self').close();
		window.close();
		top.close()
	}

	exitCancel(menu) {
		let exitWindow = document.querySelector('#exit-window');
		menu.mainNav.style.display = 'inline-block';
		exitWindow.style.display = 'none';
		menu.counter = -1;
	}

	showMain(main) {
		let item = document.querySelector(main);
		this.optionPanels.forEach( e => e.style.display = 'none' );
		this.optionsNav.style.display = 'none';
		this.mainNav.style.display = 'inline-block';
		this.counter = -1;
	}

	showOptions(menu) {
		menu.mainNav.style.display = 'none';
		menu.optionsNav.style.display = 'inline-block';
		menu.counter = -1;
	}

	optionPanelShow(oPanel) {
		let panel = document.querySelector(oPanel);
		this.optionPanels.forEach( e => {
			if (e !== panel) { e.style.display = 'none'; };
		});
		this.optionsNav.style.display = 'inline-table';
		panel.style.display = 'inline-block';
		this.counter = -1;
	}

	optionPanelHidden(oPanel) {
		let panel = document.querySelector(oPanel);
		panel.style.display = 'none';
		this.optionsNav.style.display = 'inline-block';
		this.counter = -1;
	}

	rangeControl(e, key, context) {
		if (key !== 37 && key !== 65 && key !== 39 && key !== 68) {
			return false;
		}
		if (key === 37 || key === 65) {
			if (e.value > 0) {
				e.value = parseFloat(e.value) - 0.01;
				e.focus(); 
			}
		} else if (key === 39 || key === 68) {
			if (e.value < 1) {
				e.value = parseFloat(e.value) + 0.01;
				e.focus();
			}
		} 
		if (e.id === 'volume') {
			this.sound.sound(context);
		} else if (e.id === 'effects') {
			this.sound.supportSound('#effects','.effects');
		} else if (e.id === 'music') {
			this.sound.supportSound('#music','.music');
		} else if (e.id === 'brightness') {
			this.video.brightness();
		}	
	}

	initEventListeners(menu) {
		menu.ranges.forEach( e => e.addEventListener('focus', function() { 
			return menu.detectElem('#' + e.id);
		}));
		menu.ranges.forEach( e => e.addEventListener('blur', function() { 
			return menu.elem = undefined;
		}));
		menu.intro.forEach( e => { e.addEventListener('ended', 
			function() {
				menu.introEnd();
				e.remove();
			})
		});
		menu.menuItem.forEach(e => {
			if (e.id === 'options-back') {
				e.addEventListener('click', function() { return menu.showMain('#' + e.id)});
			} else if (e.name === '#option-back' || e.classList.contains('option-back') === true) {
				e.addEventListener('click', function() { return menu.optionPanelHidden(e.name)});
			} else if (e.id === 'menu-options') {
				e.addEventListener('click', function() { return menu.showOptions(menu)});
			} else if (e.id === 'menu-exit') {
				e.addEventListener('click', function() { return menu.exitWindow(menu)});
			} else if (e.id === 'exit-exit') {
				e.addEventListener('click', menu.exitConfirm);
			} else if (e.id === 'exit-cancel') {
				e.addEventListener('click', function() { return menu.exitCancel(menu)});
			} else if (e.classList.contains('show-option')) {
				e.addEventListener('click', function() { return menu.optionPanelShow(e.name)});
			} else if (e.id === 'menu-start') {
				e.addEventListener('click', function() { return menu.menuStart(menu)});
			}
		});
	}

	detectElem(e) {
		this.elem = document.querySelector(e);
	}

	//remove default events to element
	stopDefAction(e) {
	  e.preventDefault();
	}

	//set default actions to element
	defAct(element) {
		let e = Array.from(document.querySelectorAll(element)); 
		e.forEach( el => {
			el.addEventListener('keydown', this.stopDefAction, false);
			el.addEventListener('keypress', this.stopDefAction, false);
			el.addEventListener('keyup', this.stopDefAction, false);
			el.addEventListener('focusout', this.elem = undefined, false);
		});	
	}

	//this.counter = focus state
	checkFocus() {
		let checkLabes = Array.from(document.querySelectorAll('.check'));
		checkLabes.forEach( e => e.addEventListener('click', function() { this.counter = 0; }));
	}

}

