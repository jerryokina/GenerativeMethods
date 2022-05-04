class SelfPortrait {
	constructor(count) {
		this.glassPath = new Curve([[0, 0], [20, -20], 
			[120, -20], [80, 40], 
			[20, 40], [0, 10]])


		this.faceParticles = []
		for (var i = 0; i < 30; i++) {
			let pt = Vector.polar(i**.7*10, i)
			pt.v = Vector.polar(Math.random()*100, Math.random()*100)
			pt.a = Vector.polar(Math.random()*100, Math.random()*100)

			this.faceParticles.push(pt)
		}


		this.hairParticles = []
		for (var i = 0; i < 220; i++) {
			let pt = Vector.polar(i**.7*10, i)
			pt.v = Vector.polar(Math.random()*100, Math.random()*100)
			pt.a = Vector.polar(Math.random()*100, Math.random()*100)

			this.hairParticles.push(pt)
		}

		this.hairCurves = this.hairParticles.map(pt => {
			return new Curve([[0, -40], pt])
		})
	}

	
	drawEye(p, eyeIndex) {


		let t = p.millis()*.001
		let eyeRadius = 50
		let eyeCenter = new Vector(20 + 40*p.noise(t*.4 + 100 + eyeIndex*2), -10  + 20*p.noise(t*2 + 100))

		p.noStroke()
		p.fill(20, 40, 40, .1)
		p.circle(...eyeCenter, eyeRadius*2.5)

		let count = 5
		for (var i = 0; i < count; i++) {
			let pct = i/count
			p.fill(210, 50, 20 + 40*pct)
			p.noStroke()
			p.circle(...eyeCenter, (1-pct)**.2*eyeRadius)
		}
		p.fill(0)
		p.circle(...eyeCenter, eyeRadius * (.5 + .4*noise(t)))
		
		count = 5
		for (var i = 0; i < count; i++) {
			let pct = i/count
			p.fill(0, 0, 100, .5)
			p.noStroke()
			p.circle(...eyeCenter.clonePolarOffset(eyeRadius*p.noise(i, t), i), 4 + i*2)
		}

		p.stroke(320, 100, 50)
		p.strokeWeight(6)
		p.fill(0, 0, 100, .3)
		p.beginShape()
		this.glassPath.drawVertices(p, {})
		p.endShape()

		p.stroke(320, 100, 90)
		p.strokeWeight(2)
		p.fill(0, 0, 100, .3)
		p.beginShape()
		this.glassPath.drawVertices(p, {})
		p.endShape()


	}


	draw(p, time) {



		p.push()
		p.translate(p.width/2, p.height/2)
		let center = Vector.polar(100*p.noise(time.t*.5), 20*p.noise(time.t*.2))
		p.translate(...center)
		p.rotate(p.noise(time.t*.1) - .4)

		this.hairParticles.forEach((pt, index)=> {
			pt.a.setToMultiple(pt, -.3)
			pt.v.addMultiples(pt.a, time.dt)

			pt.addMultiples(pt.v, time.dt)
			p.fill(0)
			// pt.draw(p, 10)

		})

		this.hairCurves.forEach(curve => {
			p.stroke(320, 100, 50)
			p.fill(50, 100, 90, .2)
			p.beginShape()
			curve.draw(p, 100)
			p.endShape()
		})

		// Face-ish
		this.faceParticles.forEach((pt, index)=> {
			pt.a.setToMultiple(pt, -.5)
			pt.v.addMultiples(pt.a, time.dt)

			pt.addMultiples(pt.v, time.dt)
			p.noStroke()
			p.fill(20, 40 + index, 70 + index, .2)
			pt.draw(p, 100)
		})



		this.glassPath = new Curve([[0, 0], [20, -20], 
			[120, -20], [80, 40], 
			[20, 40], [0, 10]])

		p.push()
		
		this.drawEye(p, 0)
		
		p.scale(-1, 1)
		this.drawEye(p, 1)
		p.pop()
		
		// p.beginShape()
		// p.stroke(320, 0, 0)
		// p.vertex(0, 0)
		// p.vertex(20, -20)
		// p.vertex(120, -20)
		// p.vertex(80, 40)
		// p.vertex(20, 40)
		// p.vertex(10, 10)
		// p.endShape()
		p.pop()
	
	}
}