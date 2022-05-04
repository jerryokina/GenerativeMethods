class WindParticleSystem {
	constructor(p) {
		this.particles = []

		let count = 800;
		for (var i = 0; i < count; i++) {
			// Create a random particle
			let pt = new Vector(Math.random()*p.width, Math.random()*p.height)
			
			// Add a velocity, 10 in ANY direction
			pt.velocity = Vector.polar(30, Math.random()*2*Math.PI)
			
			// Add an empty force
			pt.force = new Vector(0,0)

			// Add to my particles
			this.particles.push(pt)
		}
	}

	update(p, time) {
		this.particles.forEach((pt,index) => {
			// Recalculate forces
			pt.force.mult(0)
			
			let wind = this.getWind(p, time, pt)
			pt.force.addMultiples(wind,70)
			
			// Move the particle
			pt.velocity.mult(.97)
			pt.velocity.addMultiples(pt.force, time.dt)
			pt.addMultiples(pt.velocity, time.dt)

			pt.wrap(0, p.width, 0, p.height)
		})
	}

	getWind(p, time, pt) {
		// How much the wind changes over distance
		let windScale = .01
		// How much the wind changes with time
		let timeScale = .8
		let windSpeed = (60*sliders.temperature)*(p.noise(pt[0]*windScale + 100, pt[1]*windScale + 100, time.t*timeScale) - .5)
		
		let windDir = 30*p.noise(pt[0]*windScale + 100, pt[1]*windScale + 400, .3*time.t*timeScale)
		return Vector.polar(windSpeed, windDir)


	}

	draw(p, time) {
		p.fill(220, 50, 80, 0.3)
		p.noStroke()
		this.particles.forEach((pt,index) => {
			let radius = 10 + 5*Math.sin(index)
			pt.draw(p, radius)
		})
	}

	drawDebug(p, time) {
		// Draw the current wind map
		let tileSize = 20
		let cols = Math.floor(p.width/tileSize)
		let rows = Math.floor(p.height/tileSize)
		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < cols; j++) {
				let pt = new Vector(j + .5, i + .5)
				pt.mult(tileSize)

				let wind = this.getWind(p, time, pt)
				p.stroke(100)
				wind.drawLine({p:p, center: pt, multiple:4})
			}
		}
	
	}
}