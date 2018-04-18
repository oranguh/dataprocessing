var canvas = document.getElementById('lineplot'); // in your HTML this element appears as <canvas id="myCanvas"></canvas>
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = 'rgb(0,200,0)'; // sets the color to fill in the rectangle with
ctx.fillRect(10, 10, 50, 50);   // draws the rectangle at position 10, 10 with a width of 55 and a height of 50


let texties = document.getElementById("rawdata").innerHTML;
let line = texties.split("\n");

let temps = [];
let dates = [];

for (let i = 1; i < line.length-1; i++) {
    line[i] = line[i].split(",");

    let date = line[i][0].trim()
    // console.log(date)
    let why_DOES_THIS_WORK = Date(date)
    console.log(why_DOES_THIS_WORK)

    dates[i-1] = new Date(why_DOES_THIS_WORK);
    temps[i-1] = Number(line[i][1]);
    // console.log(line[i][1])

}
temps.pop

console.log(temps, dates);
console.log(typeof temps[254],typeof dates[0]);
console.log(temps[254]);

let dates_ms = [];
for (let i = 0; i < dates.length; i++) {
    dates_ms[i] = dates[i].getTime();
}


let range_width = [0, canvas.width];
let range_heigth = [0, canvas.height];

let domain_temps = [Math.min(...temps), Math.max(...temps)];
let domain_dates = [Math.min(...dates_ms), Math.max(...dates_ms)];


let temp_transform = createTransform(domain_temps, range_heigth);
let dates_transform = createTransform(domain_dates, range_width);


let temp_transformed = []
let dates_transformed = []

for (let i = 0; i < dates_ms.length; i++) {

  dates_transformed[i] = dates_transform(dates_ms[i]);
  temp_transformed[i] = temp_transform(temps[i]);
}


// console.log(temp_transformed, dates_transformed)
ctx.beginPath();
for (let i = 0; i < temps.length; i++) {
    // ctx.lineTo(temp_transform[i], dates_transform[i])

}
ctx.stroke();

function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}
