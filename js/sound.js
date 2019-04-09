'use strict';

class Sound {

	constructor() {
		this.volume = 1;
		this.soundScrolls = Array.from(document.querySelectorAll('.sound-scr'));
		this.volumeRange = document.querySelector('#volume');
		this.soundControl = document.querySelector('#soundoff');
		this.soundOptions = Array.from(document.querySelector('#sound-panel').querySelectorAll('.option'));
		this.audio = Array.from(document.querySelectorAll('audio'));
		this.soundFocus(this.audio);
	}

	soundFocus(sounds) {
		window.addEventListener("blur", function() {
			sounds.forEach(e => {
				e.prevVolume = e.volume;
				e.volume = 0;
			});
		})
		window.addEventListener("focus", function() {
			sounds.forEach(e => e.volume = e.prevVolume);
		})
	}

	soundOff(sound) {
		if (sound.soundControl.checked === true) {
			sound.audio.forEach( e => e.volume = 0);
			sound.soundScrolls.forEach( e => e.setAttribute('disabled', 'true'));
			sound.soundOptions.forEach(function(e, index) { 
				if (index !== 0) { 
					e.style.display = 'none'; 
				}
			});
		} else {
			sound.audio.forEach( e => { 
				sound.sound(); 
				e.currentTime = 0; 
			});
			sound.soundScrolls.forEach( e => e.removeAttribute('disabled'));
			sound.soundOptions.forEach(function(e, index) { 
				if (index !== 0) { 
					e.style.display = 'flex'; 
				}
			});
		}
	}

	soundInit(sound) {
		sound.soundScrolls.forEach( e => setAttributes(e, { 'min': '0', 'max': '1', 'step': 'any', 'value': sound.volume }));
		sound.audio.forEach( e => e.volume = sound.volume );
		sound.soundControl.addEventListener('click', function() { sound.soundOff(sound); });
		sound.soundScrolls.forEach( e => 
			e.id === 'volume' ? e.addEventListener('change', function() { sound.sound(sound); }) :
			e.addEventListener('change', function() { 
				sound.supportSound('#' + e.name, '.' + e.name)
			})
		);
	}

	sound() {
		this.volume = document.querySelector('#volume').value;
		this.supportSound('#effects', '.effects');
		this.supportSound('#music', '.music');
	}

	supportSound(id, cls) {
		this.volume = document.querySelector('#volume').value;
		const scroll = document.querySelector(id).value;
		let audio = Array.from(document.querySelectorAll(cls));
		audio.forEach( e => e.volume = this.volume * scroll );
	}

	useItem(e) {
		const elem = document.querySelector(e);
		let supportElem = document.createElement('audio');
		supportElem.src = this.getSrc(elem.innerHTML);
		supportElem.currentTime = 0;
		supportElem.volume = elem.volume;
		supportElem.addEventListener('ended', function() {
			supportElem.remove();
		});
		supportElem.play();
	}

	soundEffects(sound) {
		let items = Array.from(document.querySelectorAll('.menu-item'));
		let inputs = Array.from(document.querySelectorAll('input'));
		let range = Array.from(document.querySelectorAll('.range'));
		range.forEach( e => {
			e.addEventListener('keydown', function() {
				sound.useItem('#m-item-focus');
			});
			e.addEventListener('mouseover', function() {
				sound.useItem('#m-item-focus');
			});
		});
		inputs.forEach( e => { 
			e.addEventListener('click', function() {
				sound.useItem('#m-item-back');
			});
			e.addEventListener('focusin', function() {
				sound.useItem('#m-item-focus');
			});
			e.nextElementSibling.addEventListener('mouseover', function() {
				sound.useItem('#m-item-focus');
			});
		});
		items.forEach( e => {
			e.addEventListener('mouseover', function() {
				sound.useItem('#m-item-focus');
			});
			e.addEventListener('focus', function() {
				sound.useItem('#m-item-focus');
			});
			if (e.innerHTML === 'Back' || e.innerHTML === 'Cancel') {
				e.addEventListener('click', function() {
					sound.useItem('#m-item-back');
				});
			} else {
				e.addEventListener('click', function() {
					sound.useItem('#m-item-click');
				});
			}
		});
	}

	getSrc(str) {
		let arr = str.match('src="(.+?)"');
		return arr[arr.length-1];
	}

}