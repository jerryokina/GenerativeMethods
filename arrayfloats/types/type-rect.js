
class Rectangle {
	// Create a branching system  Each branch can hold other branches
	constructor(aof) {
		
		this.aof = aof
		this.center = new Vector()

		
	}


	update(p, t, dt) {
		
	}	

	draw(p) {
		let angle = this.aof.get("angle")
		p.push()
		p.rotate(angle)
		let w = this.aof.get("width")*100 + 50
		let h = this.aof.get("height")*300 + 100
		let hue = this.aof.get("hue")*360

		p.fill(hue, 100, 50)
		p.rect(0, 0, w, -h)
		p.pop()
	}
}






// Optional background: drawn once per population
Rectangle.drawBackground = function(p) {
	p.background(190, 80, 90)
}

// Static properties for this class
Rectangle.landmarks = {
	"christine": [0.24,0.86,0.47,0.81,0.44,0.31,0.01],
	"herbert": [0.80,0.00,0.00,0.86,0.93,0.94,0.84],
	"sharon": [0.98,0.39,0.15,0.89,0.74,0.44,0.49],
	"carlos": [0.88,0.60,0.24,0.44,0.44,0.70,0.53],
	"tyler": [0.67,0.16,1.00,0.81,0.21,0.00,0.01]
}
Rectangle.labels = ["width", "height", "hue", "angle"]

