function reqListener(){

  var canvas = document.getElementById('lineplot'); // in your HTML this element appears as <canvas id="myCanvas"></canvas>
  var ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth - 50;
  canvas.height = window.innerHeight - 50;

  var line = this.responseText.split("\n");

  var temps = [];
  var dates = [];

  // getting the data in the correct formats
  for (let i = 1; i < line.length-1; i++) {
      line[i] = line[i].split(",");
      // make sure date_string is nice
      let date_string = line[i][0].trim();
      // months are not in correct format for Date(), we make sure january is 0
      let month = Number(date_string.substring(4,6)) - 1;
      dates[i-1] = new Date(date_string.substring(0,4), month, date_string.substring(6,8));
      temps[i-1] = Number(line[i][1]);
  }
  // set the dates to be in ms from 1970 or something
  var dates_ms = [];
  for (let i = 0; i < dates.length; i++) {
      dates_ms[i] = dates[i].getTime();
  }

  // setting range and domain for the transform functions
  var range_width = [0, canvas.width];
  var range_heigth = [canvas.height, 0];
  var domain_temps = [Math.min(...temps), Math.max(...temps)];
  var domain_dates = [Math.min(...dates_ms), Math.max(...dates_ms)];

  // making the transform functions
  var temp_transform = createTransform(domain_temps, range_heigth);
  var dates_transform = createTransform(domain_dates, range_width);

  // pretty gradient colors
  var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop("0.3", "red");
  gradient.addColorStop("0.6", "black");
  gradient.addColorStop("1.0", "blue");

  // making the graph
  ctx.beginPath();
  for (let i = 0; i < temps.length; i++) {
      let y = Math.floor(temp_transform(temps[i]));
      let x = Math.floor(dates_transform(dates_ms[i]));
      ctx.lineTo(x, y);
  }
  ctx.strokeStyle = gradient;
  ctx.stroke();

  // making the labels for the x-axis
  var months_ms = numeric.linspace(domain_dates[0], domain_dates[1], 13).map(x => Math.floor(x));
  var months_text = months_ms.map(x => new Date(x).toString());

  // for loop for months
  ctx.font = "15px Arial";
  for (let i = 0; i < months_text.length; i++) {
    ctx.fillText(months_text[i].substring(4,7), dates_transform(months_ms[i]) + 15, canvas.height - 5);
  }

  // making the labels for y-axis
  var tempuratura = numeric.linspace(domain_temps[0], domain_temps[1], 10).map(x => Math.floor(x));

  for (let i = 0; i < tempuratura.length; i++) {
    ctx.fillText(Math.floor(tempuratura[i]*0.1), 2, temp_transform(tempuratura[i]));
  }

  // random title
  ctx.font = "20px Arial";
  ctx.fillText("Temperature: De Bilt (NL) 2017 - 2018", 700, 50);

  // crosshairs and data tag canvas
  var crosshair_canvas = document.getElementById('crosshair');
  var ctx_crosshair = crosshair_canvas.getContext('2d');

  crosshair_canvas.width = canvas.width;
  crosshair_canvas.height = canvas.height;
  // get mousePos function inspired from internet
  function getMousePos(canvas, evt) {
    var rect = crosshair_canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  // backwards tranforms for crosshair labels
  var temp_transform_back = createTransform(domain_temps, range_heigth, "backwards");
  var dates_transform_back = createTransform(domain_dates, range_width, "backwards");

  // drawing the crosshair and the labels
  crosshair_canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);

    let radius = 15
    ctx_crosshair.clearRect(0, 0, crosshair_canvas.width, crosshair_canvas.height);
    ctx_crosshair.beginPath();
    ctx_crosshair.moveTo(0, mousePos.y);
    ctx_crosshair.lineTo(mousePos.x - radius, mousePos.y);
    ctx_crosshair.moveTo(mousePos.x, crosshair_canvas.height);
    ctx_crosshair.lineTo(mousePos.x, mousePos.y + radius);
    ctx_crosshair.moveTo(mousePos.x + radius, mousePos.y);
    ctx_crosshair.arc(mousePos.x, mousePos.y, radius, 0, Math.PI * 2, true);
    ctx_crosshair.stroke();

    // getting labels data using transform_Back
    ctx_crosshair.font = "20px Arial";
    let tempo = temp_transform_back(mousePos.y);
    let dato = new Date(dates_transform_back(mousePos.x)).toString().substring(0,15);
    tempo = String(Math.round(tempo * 0.1)) + " degrees celcius";

    // labels drawing
    ctx_crosshair.fillText(tempo, Math.floor(mousePos.x*0.5), mousePos.y);
    ctx_crosshair.fillText(dato, mousePos.x, Math.floor(Math.abs(-crosshair_canvas.height - mousePos.y) * 0.5));
  }, false);



// transform function
  function createTransform(domain, range, condition){

      // made a backwards function so I could go backwards.
      if (condition === "backwards"){
        var domain_min = domain[0];
        var domain_max = domain[1];
        var range_min = range[0];
        var range_max = range[1];

        // formulas to calculate the alpha and the beta
        var alpha = (domain_max - domain_min) / (range_max - range_min);
        var beta = domain_max - alpha * range_max;

        // returns the function for the linear transformation (y= a * x + b)
        return function(x){
          return alpha * x + beta;
        }
      } else {
        var domain_min = domain[0];
        var domain_max = domain[1];
        var range_min = range[0];
        var range_max = range[1];

        // formulas to calculate the alpha and the beta
       	var alpha = (range_max - range_min) / (domain_max - domain_min);
        var beta = range_max - alpha * domain_max;

        // returns the function for the linear transformation (y= a * x + b)
        return function(x){
          return alpha * x + beta;
        }
      }
  }
}

// confusing XMLHttpRequest
var requester = new XMLHttpRequest();
var gitthingy = "https://oranguh.github.io/dataprocessing/Homework/Week_2/rawdata.txt";

requester.addEventListener("load", reqListener);
requester.open("GET", gitthingy);
requester.send();
