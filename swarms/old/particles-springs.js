// Create a particle system with an initialize, update, and draw function

// let mySystem = new BasicParticleSystem()
// mySystem.update()
// mySystem.draw()

class SpringyParticleSystem {
	constructor() {
		console.log("Make springy!")
		this.nodes = []
		this.edges = []

		let nodeCount = 4
		for (var i = 0; i < nodeCount; i++) {
			this.nodes.push(new SpringNode())
		}

		for (var i = 0; i < nodeCount*2; i++) {
			let n0 = this.nodes[i%nodeCount]
			let n1 = this.nodes[Math.floor(Math.random()*this.nodes.length)]
			if (n0 != n1) {
				this.edges.push(new SpringEdge(n0, n1))
			}
		}


	}

	drawHeatmap(p, heatmapScale) {
		p.push()
		p.scale(1/heatmapScale)
		p.noStroke()
		p.background(0, 0, 0, 4)
		this.nodes.forEach(b => {
			p.fill(0, 255, 0)

			// Draw *behind* the bug
			let pos = Vector.addMultiples(b.position, 1)
			// console.log(pos)
			p.circle(...pos, 20)
		})
		p.pop()
	}


	getClosest(point, range) {
		let closestDist = range
		let closest = undefined

		this.nodes.forEach(b => {
			let d = Vector.getDistance(b.position, point)
			if (d < closestDist) {
				closest = b
				closestDist = d
			}
		})
		if (closest)
			return closest.position 
	}

	update(p) {
		// Reset the spring force on these nodes, it will get set by edges
		this.nodes.forEach(node => node.springForce.mult(0))
		this.edges.forEach(edge => edge.update(p))
		this.nodes.forEach(node => node.update(p))
		
	}

	draw(p) {
		this.nodes.forEach(node => node.draw(p))
		this.edges.forEach(edge => edge.draw(p))
	}
}

let nodeCount = 0
class SpringNode {
	constructor() {
		this.id = nodeCount++
		this.radius = Math.random()*30 + 10
		this.position = new Vector(Math.random()*canvasSize[0],Math.random()*canvasSize[1])
		this.velocity = new Vector(0,0)
		this.springForce = new Vector(0,0)
		this.force = new Vector(0,0)
	}

	update(p) {
		let dt = Math.min(.1, p.deltaTime*.001)
		let t = p.millis()*.001

		this.force.mult(0)

		// Borderforce 
		let borderStrength = .3
		this.force.addMultiples(this.position, -borderStrength, [p.width/2,p.height/2], borderStrength)

		// Wander
		this.force.addPolar(500*p.noise(this.id, .2*t)**2, 30*p.noise(this.id, .1*t))

		// Add in the spring force
		this.force.addMultiples(this.springForce, (SLIDER.springForce+1)**3)


		this.velocity.addMultiples(this.force, dt)
		this.position.addMultiples(this.velocity, dt)

		this.velocity.mult(1 - .1*SLIDER.drag)

	}

	
	draw(p) {
		let count = 5
		let hue = (this.id*39)%360
		for (var i = 0; i < count; i++) {
			let pct = 1 - i/count
			p.noStroke()
			p.fill(hue, 100, (1 - pct)*100)


			p.circle(this.position[0],this.position[1] + -.2*this.radius*(1 - pct)**.5, pct**.3*this.radius)
		}

		this.springForce.drawArrow({p, 
			multiple:1,
			center:this.position, 
			color:[100,100,30]}) 
		// this.force.drawArrow({p, 
		// 	multiple:1,
		// 	center:this.position, 
		// 	color:[300,100,30]}) 
	}
}

class SpringEdge {
	constructor(n0, n1) {
		this.n0 = n0
		this.n1 = n1
		
		this.baseLength = 100
		this.stretch = 1
	}



	update(p) {
		let edgeVector = Vector.getDifference(this.n1.position, this.n0.position)
		let m = edgeVector.magnitude
		this.stretch = (this.baseLength - m)/m
		// console.log(edgeVector)
		if (m !== 0) {

			this.n0.springForce.addMultiples(edgeVector, this.stretch)
			this.n1.springForce.addMultiples(edgeVector, -this.stretch)
		}

		this.n0.position.addMultiples(edgeVector, this.stretch*SLIDER.springEasing)
		this.n1.position.addMultiples(edgeVector, -this.stretch*SLIDER.springEasing)

	}



	draw(p) {
		p.stroke(150 + this.stretch*170, 100, 0 + 50*Math.abs(this.stretch))
		p.strokeWeight(3)
		Vector.drawLineBetween({p:p,
			v0:this.n0.position,
			v1:this.n1.position,
			offsetStart:this.n0.radius/ + 2,
			offsetEnd:this.n1.radius/2 + 2
		})
	}
}
