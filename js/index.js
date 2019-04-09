'use strict';

window.onload = (function() {

	let sound = new Sound();
	let video = new Video();
	let fullScreen = new FullScreen();
	let menu = new MainMenu(sound, video);
	
	menu.defAct('.range');
	menu.checkFocus();
	menu.initEventListeners(menu);
	menu.menuControl(menu);
	sound.soundInit(sound);
	sound.soundEffects(sound);
	video.videoInit();
	video.brightness();

	document.oncontextmenu = function(e) {
		return false;
	};

	window.onresize = (function() {
		fullScreen.checkFullScreen();
	});

  document.querySelector('iframe').remove();

});

function updateString(str, n) {
	const s = Array.from(str);
	let numbers = [];
	let letters = [];
	s.forEach( e => {
		isNaN(Number(e)) === true && e !== '-' && e !== '.' ? letters.push(e) : numbers.push(e);
	});
	n = Number(numbers.join('')) + n;
	str = n + letters.join('');
	return str;
}

function toNumber(str) {
	const s = Array.from(str);
	let numbers = [];
	s.forEach( e => {
		isNaN(Number(e)) === true && e !== '-' && e !== '.' ? e = e : numbers.push(e);
	});
	const num = Number(numbers.join(''));
	return num;
}

function setAttributes(el, attrs) {
	for (let key in attrs) {
		el.setAttribute(key, attrs[key]);
	}
}