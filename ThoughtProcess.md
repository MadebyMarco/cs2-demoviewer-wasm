1st. find out how to get information from ticks
2nd. Get information from ticks about players
2.1 Get for multi layered maps (like nuke, vertigo, mirage) get Y
2.2 yaw (where players aiming)
2.3 Get health, utility, armor, money

3rd. Get information from game events and add to players
3.1 All utility - decoys, deaths, kills, round start, round end, bomb planted, bomb being defused
4th. Be able to draw the players, events, and maps using this information.

// 1. we need to go to a tick, there is 10 ticks for each player
// 2. render out that tick, using cavas2d we can clear the canves and rerender the circles representing their position
// 3.then when we play a game we run that render tick function, framerate will be decided by how many times we run this function.
Now this will loop a function that will, 1. How will the circles appear? clear the previous circles, render knew ones 2. How will the function know which circle to update? Well need to sort the players by teams, then set them to 10 objects, then when new positions are obtained, we will loop the
objects and update their position.
// 4. render method I decided to with canvas2d because its easy to understand and use. However, i am considering using webgpu if I feel like it can help with performance once I animate utility and bullets.  
// 5. In order for the X and Y to map to the canvas I have to map a 4 quadrant, cross style graph, into one positive only graph. + -> L
5.1 I need the size of a maps max X and Y coordinates.
5.2 For the coordinates already in the top right(positive x, positive y), we only need to apply scaling.
I first tried simply multiplying the negative value by -1 to get a positive value but the ticks would teleport and would be in the wrong position.
ex: x value is -500, maxXValue = -2000; multiplying by -1 gets 500, but adding by positive 2000 gets 1500. This is because adding 2000 acts as shifting the starting point. If my x value was -2000, multiplying results in 2000 instead of 0. Adding however results in 0, as it should.
Therefore, for coordinates in the negative, we need to add the max negative value of that axis, as a positive, to the negative coordinate.
5.3 Now we need to add the max total values of each axis to create our scale
By adding the totals of each axis we get an axis where all points are on the positive quadrant(positive x, positive y), same as our canvas.
Now we can calculate our scale. Take the new canvas height and divide it by the total max height of the map. Now do the same for X. Now we have our scaleX and scaleY variables!
5.4 Next is processing, take each x and y coordinate from our player info object and
