
// Cyberpunk DJ mask.  Could make the ears vibrate with music

masks.coolFace = function( p) {
	let t = p.millis()*.001
		
	p.background(0)


	// Make an outline but also make it weird
	let outlineCount = 80
	for (var i = 0; i < outlineCount; i++) {
		let pct = (i/outlineCount + t*.5)%1
		let opacity = Math.sin(pct*Math.PI)
		let faceOutline = joinSides(face.sides[0].faceRings[0],face.sides[1].faceRings[0]).map(((pt,index) => {
			let pt2 = new Vector()
			pt2.setToLerp(face.center, pt, .8 +pct + pct*noise(t + index*1.4 + pct))
			pt2[0] *= 9
			return pt2
		}))
		p.stroke(SLIDER.tunnelColor*360, 100, 70, opacity)
		p.strokeWeight(2)
		drawContour(p, faceOutline.slice(1), true)
	}
	outlineCount = 7
	for (var i = 0; i < outlineCount; i++) {
		let pct = (i/outlineCount + t*.5)%1
		let opacity = Math.sin(pct*Math.PI)
		let faceOutline = joinSides(face.sides[0].faceRings[0],face.sides[1].faceRings[0]).map(((pt,index) => {
			let pt2 = new Vector()
			pt2.setToLerp(face.center, pt, .8 +pct + pct*noise(t + index*1.4 + pct))
			pt2[0] *= 1.5
			return pt2
		}))
		p.stroke(0, 100, 60, opacity)
		p.strokeWeight(opacity*15)
		drawContour(p, faceOutline.slice(1), true)
	}


	let countEar = 0
	face.sideOrder.forEach((side) => {
		countEar +=1
		// Draw the three ear points
		p.noStroke()
		p.noFill()
		if(countEar==1){
			p.stroke(50, 100, 50)
		}
		else{
			p.stroke(0, 100, 50)
		}
		side.ear[2].draw(p, 15*face.scale*SLIDER.earSize*2.0)
		side.ear[1].draw(p, 10*face.scale*SLIDER.earSize*2.0)

		// Draw the face background by filling in between the face side and the centerline
		// side.index is either 1 or -1, so we can use that to change color between sides
		p.fill(200, 100, 20 + side.index*10)
		// drawStrip(p, side.faceRings[0], face.centerLine)
		
		p.noStroke()

		// // Draw multiple strips around the face
		for (var i = 0; i < 3; i++) {
			
			p.fill((i*30 + 50 + 40*t)%360, 100, 50)

			// Draw the triangle mesh
			p.strokeWeight(10)
			// drawStrip(p, side.faceRings[i + 1], side.faceRings[i])
			drawNeonContour(p, side.faceRings[i], [i*50, 100, 50], 5, true)
		}	


		hand.forEach(h => {
			h.fingers.forEach(finger => {
				let h = Math.random()*360
				drawNeonContour(p, finger, [h, 100, 50], 9, false)

				finger.forEach(f => {
					f.draw(p, 3)
				})
				let tip = finger[3]
				p.push()

				p.noStroke()
				p.translate(...tip)
				p.textSize(40)
				p.fill(100, 100, 100)
				// p.text("Genmeth", 0, 0)
				p.pop()
			})
		})
	})


	// Draw lines between each of the face points on either side
	for (var i = 0; i < 18; i++) {
		p.strokeWeight(3)
		p.stroke(i*20, 100, 50)
		let p0 = face.sideOrder[0].faceRings[2][i]
		let p1 = face.sideOrder[1].faceRings[2][i]
		Vector.drawLineBetween({p:p, v0: p0, v1: p1})
	}
	

	// Draw the eye on either side
	let countEye = 0
	face.sideOrder.forEach((side) => {
		// Draw the eye lines
		countEye += 1
		side.eyeRings.forEach((eyeRing,eyeIndex) => {

			let h = 300*SLIDER.eyeColor
			if (countEye==1){
				drawNeonContour(p, eyeRing, [h+0, 100, 50], 7, true)
			}
			else {
				drawNeonContour(p, eyeRing, [h+50, 100, 50], 7, true)
			}
		})


	})

	// Draw the center face line
	p.noFill()
	drawNeonContour(p, face.centerLine.slice(0,15), [320, 100, 50], 5, false)
	drawNeonContour(p, face.centerLine.slice(0,12), [70, 100, 50], 15, false)
	drawNeonContour(p, face.centerLine.slice(0,9), [140, 100, 50], 10, false)
	drawNeonContour(p, face.centerLine.slice(0,6), [210, 100, 50], 5, false)
	drawNeonContour(p, face.centerLine.slice(0,2), [0, 100, 50], 20, false)

	drawNeonContour(p, face.centerLine.slice(22), [0, 100, 50], 20, false)
	drawNeonContour(p, face.centerLine.slice(23), [70, 100, 50], 10, false)
	drawNeonContour(p, face.centerLine.slice(24), [140, 100, 50], 20, false)
	drawNeonContour(p, face.centerLine.slice(25), [210, 100, 50], 10, false)
	drawNeonContour(p, face.centerLine.slice(26), [320, 100, 50], 10, false)
	p.noFill()
	
	// Draw the mouth lines
	p.stroke(0,100,50)
	p.strokeWeight(7)
	drawRibbon(p, face.mouth[4].concat(face.mouth[4].slice(0,1)), (pct, sideIndex) => Math.abs(10*Math.sin(pct*Math.PI*2)), true)

}
