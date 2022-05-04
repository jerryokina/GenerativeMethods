// Create P5 
const GIF_SIZE = 300
const LOOP_LENGTH = 3000

window.addEventListener("load", function() {
	let holderEl = document.getElementById("main-column")
	for (id in animations) {
		
		anim = animations[id]
		console.log(anim)
		if (!anim.skip) {
			createP5Swatch(holderEl, anim)
		}
	}
	
})

// Make a swatch to hold an animation canvas
function createP5Swatch(holderEl, animation) {
	// Create a new P5 canvas

	// Create the swatch holder
	let el = document.createElement("div")
	el.classList.add("swatch");
	holderEl.append(el)
	
	// Create the title
	let titleEl = document.createElement("h3")
	titleEl.innerHTML = animation.title
	el.append(titleEl)
	
	// Create the canvas
	let canvasHolder = document.createElement("div")
	canvasHolder.classList.add("canvas-holder");
	el.append(canvasHolder)

	let captionEl = document.createElement("p")
	captionEl.innerHTML = animation.caption
	el.append(captionEl)
	

	mainP5 = new p5(

		// Run after processing is initialized
		function(p) {
			// Set the size of the canvas that P5 thinks its using
			// Use HSL mode (WAAAYYY better than RGB!)
			p.colorMode(p.HSL);
			// p.ellipseMode(p.RADIUS);

			p.setup = () => {
				p.createCanvas(GIF_SIZE, GIF_SIZE);
				if (animation.setup)
					animation.setup(p)
			}
			p.draw = () => {
				let t = (p.millis()%LOOP_LENGTH)/LOOP_LENGTH
				
				if (animation.draw)
					animation.draw(p, t)
			}
		}, 
	canvasHolder)
}
