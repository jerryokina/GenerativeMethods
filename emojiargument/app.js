	
let simCount = 0

let noise = (new p5()).noise



	// <simulation type="DustSimulation" mode="gol" :dimensions="[40,30]" :tileSize="10" speed="100"/>

	// What if much bigger?
	// <simulation type="DustSimulation" mode="gol" :dimensions="[50,70]" :tileSize="10" speed="50"/>

	// <simulation type="DustSimulation" mode="gol" :dimensions="[40,30]" :tileSize="10" speed="100"/>
	// type information here

	// <simulation type="GameOfLifeSimulation" mode="gol" :dimensions="[20,16]" :tileSize="26"/>
	// <simulation type="SheepSimulation" mode="gol" :dimensions="[20,16]" :tileSize="26"/>
	// <simulation type="DustSimulation" mode="gol" :dimensions="[20,16]" :tileSize="26"/>

document.addEventListener("DOMContentLoaded", function(){

	// 
	new Vue({
		el : "#app",
		template: `<div id="app">
			<h2>Sea, Beach, Tree and Fish</h2>
			<h3>No.1: A good simulation</h3>
			<simulation type="SeaShoreSimulation" mode="good" :dimensions="[30,20]" :tileSize="20"/>
			<br></br>

			#1: The first simulation randomly generates 60% of sea🌊 (including 10% of fish🐠), 20% of beach🧽, 20% of trees🌵. 
			<br></br>

			A beach🧽 will become a sea🌊 if most of its eight neighbors (>= 5) are sea.
			Similarly, a sea🌊 will become a beach🧽 if most of its eight neighbors (>= 5) are beach.
			Tree🌵 only appears on a beach with no sea within its eight neighbors. Fish🐠 moves randomly in the sea connected with it, so a fish may die (disappear) if it has no sea to live in.
			<br></br>
			
			Under these settings, the picture usually end up being a nice scene with sea, beaches, trees and several fishes survive.
			<h3>No.2: With different initial proportions </h3>
			<simulation type="SeaShoreSimulation" mode="dif" :dimensions="[30,20]" :tileSize="20"/>
			<br></br>

			#2: The second simulation randomly generates 40% of sea🌊 (including 10% of fish🐠), 40% of beach🧽, 20% of trees🌵. 
			<br></br>

			Under these settings, most of the grids are trees at the end, leaving small spaces for seas (seems like lakes) and only few fishes survive. 
			Beaches that are not close to seas will convert to trees, so many trees suddenly emerge in the 2nd and 3rd step.
			<br></br>

			<h3>No.3: With easier standards for converting </h3>
			<simulation type="SeaShoreSimulation" mode="std" :dimensions="[30,20]" :tileSize="20"/>
			<br></br>
			
			#3: The third simulation uses the same initial proportions as the 1st simulation, but the converting between a beach and a sea is easier. It only requires 4 (instead of 5 in #1 and #2) of its 8 neighbors to convert from beach to sea and from sea to beach.
			<br></br>

			Under these settings, the simulation takes longer time to reach its final stable state. Almost all of the grids are seas at the end, leaving few beaches or trees. 
			It is surprising that although the difficulties of converting from 🧽 to 🌊 is always the same as converting from 🌊 to 🧽, the final state only contain seas.

			<br></br>
			

		</div>`,
		
	}) 
})



//==================================
// Grid utilities

// Create a grid of columns
function createGrid(w, h) {
	const grid = Array.from(new Array(w),()=>Array.from(new Array(h),()=>"-"));
	return grid
}

// Set a grid equal to a function
function setGrid(grid, fxn) {
	if (grid === undefined)
		console.warn("no grid!")
	if (fxn === undefined)
		console.warn("no function for setting the grid!")
	for (var i = 0; i < grid.length; i++) {
		for (var j = 0; j < grid[i].length; j++) {
			grid[i][j] = fxn(i,j)
		}
	}
}


// Set a grid equal to a function
function forGrid(grid, fxn) {
	if (grid === undefined)
		console.warn("no grid!")
	if (fxn === undefined)
		console.warn("no function for setting the grid!")
	for (var i = 0; i < grid.length; i++) {
		for (var j = 0; j < grid[i].length; j++) {
			fxn(i,j)
		}
	}
}


// Copy a grid
function copyGrid(dest, src) {
	for (var i = 0; i < src.length; i++) {
		for (var j = 0; j < src[i].length; j++) {
			dest[i][j] = src[i][j]
		}
	}
}
