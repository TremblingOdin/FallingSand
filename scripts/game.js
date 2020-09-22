


class Game {
    constructor(width, height) {
	/* Scaling for device */
	const onscreenPixelRatio = window.devicePixelRatio;
	const onscreenScaledWidth = onscreenPixelRatio * width;
	const onscreenScaledHeight = onscreenPixelRatio * height;
 
        const onscreenCanvas = document.getElementById("mainCanvas");
	onscreenCanvas.width = onscreenScaledWidth;
	onscreenCanvas.height = onscreenScaledHeight;
	onscreenCanvas.style.width = width + "px";
	onscreenCanvas.style.height = height + "px";
	const onscreenCtx = onscreenCanvas.getContext("2d", {alpha: false});
    }

}
