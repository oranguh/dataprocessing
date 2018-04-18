var canvas = document.getElementById('myCanvas'); // in your HTML this element appears as <canvas id="myCanvas"></canvas>
var ctx = canvas.getContext('2d');

ctx.fillStyle = 'rgb(200,0,0)'; // sets the color to fill in the rectangle with
ctx.fillRect(10, 10, 55, 50);   // draws the rectangle at position 10, 10 with a width of 55 and a height of 50
