# A6
## Junhao Xu

### Inspirations:
Simulate the evolution between beaches, seas and trees.

### What layers are in your simulation, and what does each layer contain?
Only one layer, which contains the type of the cell including tree, beach, water, fish.

### What are the update rules for each cell?
A beach🧽 will become a sea🌊 if most of its eight neighbors (>= 5) are sea.Similarly, a sea🌊 will become a beach🧽 if most of its eight neighbors (>= 5) are beach.

Tree🌵 only appears on a beach with no sea within its eight neighbors. Fish🐠 moves randomly in the sea connected with it, so a fish may die (disappear) if it has no sea to live in.

### What argument are you trying to make?
I want to show how the initial proportions of each type effect the final state, and how the different standards for evolution effect the final state.

### Does the simulation currently support your argument?
Yes.
  
### One related thought from the reading:
From Parable of the Polygons https://ncase.me/polygons/:
* 1. Small individual bias → Large collective bias.
When someone says a culture is shapist, they're not saying the individuals in it are shapist. They're not attacking you personally. 2. The past haunts the present.
Your bedroom floor doesn't stop being dirty just coz you stopped dropping food all over the carpet. Creating equality is like staying clean: it takes work. And it's always a work in progress.

These kinds of simulations show that how a small difference or change in nearby neighbors will have large impact on macro states. So it would be very useful if we can clearly understand the relationship between the micro and macro when executing the simulations.


### Citations:
Reference: Starter code from Prof. Kate Compton.

