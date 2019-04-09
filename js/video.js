'use strict';

class Video {

	constructor() {
		this.brightnessRange = document.querySelector('#brightness');
	}

	videoInit() {
		setAttributes(this.brightnessRange, { 'min': '0', 'max': '1', 'step': 'any', 'value': '1' });
		this.brightnessRange.addEventListener('change', this.brightness);
	}

	brightness() {
		const val = this.value || this.brightnessRange.value;
		let bright = document.documentElement;
		bright.style.opacity = val;
	}

}