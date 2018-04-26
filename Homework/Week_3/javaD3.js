function reqListener(){


  // Marco Heuvelman 10176306
  //
  // This code works inside simle_html.html in conjuction with styler.css
  //
  // Cool project. d3 was frustrating. Sometimes it was really rough,
  // but not as rough as Enron's dawnfall
  //
  // Uses d3 and d3_tip
  var jsondata = JSON.parse(this.responseText);
  // d3.max did not work for me so I had to calculate it differently
  var maxfinder = []
  for (i in jsondata.DATA) {
    jsondata.DATA[i]["month"] = new Date(jsondata.DATA[i]["month"]*1000).toString();
    maxfinder[i] = jsondata.DATA[i].fraud_count
  }

  // height width, margins, etc.
  var w = window.innerWidth - 150;
  var h = window.innerHeight - 100;
  var margins = {"right": 20, "left":60, "bottom": 50, "top": 50};
  var barPadding = 3;

  // SCALES
  var xs = d3.scale.ordinal()
      .rangeRoundBands([margins.left, (w - margins.right)]);
  var ys = d3.scale.linear()
      .domain([Math.max(...maxfinder), 0])
      .range([margins.top, (h - margins.bottom)]);

  // make them axes
  var xAxis = d3.svg.axis()
      .scale(xs)
      .orient("bottom");
  var yAxis = d3.svg.axis()
      .scale(ys)
      .orient("left")
      .ticks(5);
  // create the svg element
  var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
  // hover over tip thingy. Inspired from internet http://bl.ocks.org/Caged/6476579*
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>Frequency:</strong> <span style='color:red'>" + d.fraud_count + "</span>";
    })
  svg.call(tip);

  // creates the bar chart
  svg.selectAll("rect")
    .data(jsondata.DATA)
    .enter()
    .append("rect")
    .attr("class", "bar") // look at stylers.css for additional attributes
    .attr("x", function(d, i) {
    return Math.floor(i * ((w - (margins.right + margins.left)) / jsondata.DATA.length) + margins.left)
    })
    .attr("y", function(d) {
    return (h - (h -ys(d.fraud_count)));  //Height was complicated
    })

    .attr("width", Math.floor(w / jsondata.DATA.length - barPadding))
    .attr("height", function(d) {
    return h - ys(d.fraud_count) - margins.bottom;
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);
  // months labels
  svg.selectAll("text")
   .data(jsondata.DATA)
   .enter()
   .append("text")
   .attr("class", "texto")
   .text(function(d) {
     return d.month.substring(3,7) // this looks messy but it works
   })
   .attr("x", function(d, i) {
        return Math.floor(i * ((w - (margins.right + margins.left)) / jsondata.DATA.length) + margins.left) ;
   })
   .attr("y", function(d) {
        return h - margins.bottom * 0.6;
   });
  //  years labels
   svg.selectAll("text1")
    .data(jsondata.DATA)
    .enter()
    .append("text")
    .attr("class", "texto dato")
    .text(function(d) {
      return d.month.substring(10,15)
    })
    .attr("x", function(d, i) {
         return Math.floor(i * ((w - (margins.right + margins.left)) / jsondata.DATA.length) + margins.left) ;
    })
    .attr("y", function(d) {
         return h - margins.bottom * 0.4 ;
    });
  // make axis appear
  svg.append('g')
    .attr("transform", "translate(0," + (h - margins.bottom) + ")")
    .call(xAxis)
  svg.append('g')
    .attr("transform", "translate(" + margins.left + ", 0)")
    .call(yAxis)

  // axis labels https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
  svg.append("text")
      .attr("y", 0)
      .attr("x",0 - (h / 2))
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em")
      .attr("fill", "red")
      .style("text-anchor", "middle")
      .text("Count");
    // x-axis
    svg.append("text")
      .attr("fill", "red")
      .attr("transform",
            "translate(" + (w/2) + " ," +
                           (h) + ")")
      .style("text-anchor", "middle")
      .text("Time");

  //  I used this helpful link to make this http://jsfiddle.net/nhHww/1/
  //  see stylers.css for additional hover over action
  svg.append("text")
    .attr("class", "texturl")
    .attr("x", "50")
    .attr("y", "20")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "blue")
    .text("Enron Email Dataset")
    .on("click", function() { window.open("https://www.cs.cmu.edu/~enron/");
    });
  svg.append("text")
    .attr("x", "50")
    .attr("y", "40")
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("fill", "green")
    .text("Marco Heuvelman 10176306");
  svg.append("text")
    .attr("x", "100")
    .attr("y", "100")
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("font-weight", "bold")
    .attr("fill", "darkgreen")
    .text("Enron e-mails containing corporate-accounting-fraud-lawsuit related words in time");
    function type(d) {
      d.frequency = +d.frequency;
      return d;
    }

}

var requester = new XMLHttpRequest();
var gitthingy = "https://oranguh.github.io/dataprocessing/Homework/Week_3/enron.json";
// var gitthingy = "enron.json"
requester.addEventListener("load", reqListener);
requester.open("GET", gitthingy);
requester.send();
