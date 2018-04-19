function reqListener(){

  var canvas = document.getElementById('lineplot'); // in your HTML this element appears as <canvas id="myCanvas"></canvas>
  var ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth - 50;
  canvas.height = window.innerHeight - 50;

  // var line = document.getElementById("rawdata").innerHTML.split("\n");
  var line = this.responseText.split("\n")
  // var texties = readTextFile("rawdata.txt")
  // console.log(typeof line)


  var temps = [];
  var dates = [];


  // console.log(line);

  for (let i = 1; i < line.length-1; i++) {
      line[i] = line[i].split(",");

      let dateString = line[i][0].trim()

      // Months are not in correct format for Date, therefore we make sure january is 0
      let month = Number(dateString.substring(4,6)) - 1
      // console.log(dateString.substring(0,4), dateString.substring(4,6),dateString.substring(6,8))
      dates[i-1] = new Date(dateString.substring(0,4), month, dateString.substring(6,8))
      temps[i-1] = Number(line[i][1]);
      // console.log(line[i][1])

  }
  // console.log(temps, dates);



  var dates_ms = [];
  for (let i = 0; i < dates.length; i++) {
      dates_ms[i] = dates[i].getTime();
  }

  // console.log(temps, dates_ms);

  var range_width = [0, canvas.width];
  var range_heigth = [canvas.height, 0];

  var domain_temps = [Math.min(...temps), Math.max(...temps)];
  var domain_dates = [Math.min(...dates_ms), Math.max(...dates_ms)];


  var temp_transform = createTransform(domain_temps, range_heigth);
  var dates_transform = createTransform(domain_dates, range_width);

  var temp_transform_BACK = createTransform(domain_temps, range_heigth, "backwards");
  var dates_transform_BACK = createTransform(domain_dates, range_width, "backwards");


  // var temp_transformed = []
  // var dates_transformed = []

  // for (let i = 0; i < dates_ms.length; i++) {
  //
  //
  // }


  // console.log(temp_transformed[1].toFixed(0), dates_transformed[1].toFixed(0))
  var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop("0.3", "red");
  gradient.addColorStop("0.6", "black");
  gradient.addColorStop("1.0", "blue");

  ctx.beginPath();
  for (let i = 0; i < temps.length; i++) {
      let dates_transformed = dates_transform(dates_ms[i]);
      let temp_transformed = temp_transform(temps[i]);

      let y = Math.floor(temp_transformed)
      let x = Math.floor(dates_transformed)
      // console.log(x,y)
      ctx.lineTo(x, y)
  }

  ctx.strokeStyle = gradient;
  ctx.stroke();


  var months_ms = numeric.linspace(domain_dates[0], domain_dates[1], 13).map(x => Math.floor(x));
  var months_text = months_ms.map(x => new Date(x).toString());
  // console.log(months_text)

  ctx.font = "15px Arial";
  for (let i = 0; i < months_text.length; i++) {
    ctx.fillText(months_text[i].substring(4,7), dates_transform(months_ms[i]) + 15, canvas.height - 5);
  }

  var tempuratura = numeric.linspace(domain_temps[0], domain_temps[1], 10).map(x => Math.floor(x));
  // console.log(tempuratura)

  for (let i = 0; i < tempuratura.length; i++) {
    ctx.fillText(Math.floor(tempuratura[i]*0.1), 2, temp_transform(tempuratura[i]) - 10);
  }

  ctx.font = "20px Arial";
  ctx.fillText("Temperature: De Bilt (NL) 2017 - 2018", 700, 50)


  var crosshair_canvas = document.getElementById('crosshair');
  var ctx_crosshair = crosshair_canvas.getContext('2d');

  crosshair_canvas.width = canvas.width;
  crosshair_canvas.height = canvas.height;
  //
  function getMousePos(canvas, evt) {
    var rect = crosshair_canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  crosshair_canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    // console.log(mousePos);
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

    ctx_crosshair.font = "20px Arial";
    let tempo = temp_transform_BACK(mousePos.y);
    let dato = new Date(dates_transform_BACK(mousePos.x)).toString().substring(0,15);
    tempo = String(Math.round(tempo * 0.1)) + " degrees celcius"
    console.log(dato, tempo)
    // new Date(x).toString());
    ctx_crosshair.fillText(tempo, Math.floor(mousePos.x*0.5), mousePos.y);
    ctx_crosshair.fillText(dato, mousePos.x, Math.floor(Math.abs(-crosshair_canvas.height - mousePos.y) * 0.5));
  }, false);




  function createTransform(domain, range, condition){
  	// domain is a two-element array of the data bounds [domain_min, domain_max]
  	// range is a two-element array of the screen bounds [range_min, range_max]
  	// this gives you two equations to solve:
  	// range_min = alpha * domain_min + beta
  	// range_max = alpha * domain_max + beta
   		// a solution would be:
      if (condition === "backwards"){
        var domain_min = domain[0]
        var domain_max = domain[1]
        var range_min = range[0]
        var range_max = range[1]

        // formulas to calculate the alpha and the beta
        var alpha = (domain_max - domain_min) / (range_max - range_min)
        var beta = domain_max - alpha * range_max

        // returns the function for the linear transformation (y= a * x + b)
        return function(x){
          return alpha * x + beta;
        }
      } else {
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
  }

  // https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file
  function readTextFile()
  {
      var rawFile = new XMLHttpRequest();
      rawFile.open("POST", file, true);
      rawFile.onreadystatechange = function ()
      {
          if(rawFile.readyState === 4)
          {
              if(rawFile.status === 200 || rawFile.status == 0)
              {
                var allText = rawFile.responseText;
                // alert(allText);
                //
              }
          }
      }
      rawFile.send();
  }
}

var requester = new XMLHttpRequest()

var gitthingy = "https://github.com/oranguh/dataprocessing/blob/master/Homework/Week_2/rawdata.txt"

requester.addEventListener("load", reqListener);
requester.open("GET", "rawdata.txt")
requester.send()
