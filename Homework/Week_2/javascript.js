var canvas = document.getElementById('lineplot'); // in your HTML this element appears as <canvas id="myCanvas"></canvas>
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;
readTextFile('rawdata.txt');

// let texties = allText;

let texties = document.getElementById("rawdata").innerHTML;

let line = texties.split("\n");

let temps = [];
let dates = [];


// console.log(allText);

for (let i = 1; i < line.length-1; i++) {
    line[i] = line[i].split(",");

    let dateString = line[i][0].trim()
    // console.log(dateString.substring(0,4), dateString.substring(4,6),dateString.substring(6,8))
    dates[i-1] = new Date(dateString.substring(0,4), dateString.substring(4,6),dateString.substring(6,8))
    temps[i-1] = Number(line[i][1]);
    // console.log(line[i][1])

}
// console.log(temps, dates);



let dates_ms = [];
for (let i = 0; i < dates.length; i++) {
    dates_ms[i] = dates[i].getTime();
}

// console.log(temps, dates_ms);

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


// console.log(temp_transformed[1].toFixed(0), dates_transformed[1].toFixed(0))

ctx.beginPath();
for (let i = 0; i < temps.length; i++) {

    let y = Math.floor(temp_transformed[i])
    let x = Math.floor(dates_transformed[i])

    // console.log(x,y)
    ctx.lineTo(x, y)
}
// ctx.fill()
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

// https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file
function readTextFile(file)
{
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                // alert(allText);
            }
        }
    }
    rawFile.send(null);
}
