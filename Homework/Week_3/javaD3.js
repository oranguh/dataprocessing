function reqListener(){

  var jsondata = JSON.parse(this.responseText);
  var json_values = [];
  var json_percentage = [];
  var json_months = [];

  // console.log(typeof this.responseText)
  // console.log(typeof jsondata)


  for (i in jsondata.DATA) {
    json_values[i] = Number(jsondata.DATA[i]["fraud_count"]);
    json_months[i] = new Date(jsondata.DATA[i]["month"]*1000).toString();
  }
  // console.log(json_values)
  var w = window.innerWidth - 100;
  var h = window.innerHeight - 100;
  var margins = {"right": 5, "left":50, "bottom": 20, "top": 20};
  var barPadding = 3;


  var xs = d3.scale.ordinal()
      .rangeRoundBands([0, w], .1);

  var ys = d3.scale.linear()
      .range([h, 0]);

  var xAxis = d3.svg.axis()
      .scale(xs)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(ys)
      .orient("left")
      .tickFormat(d3.format(".0%"));

  var svg = d3.select("body")
              .append("svg")
              .attr("width", w)
              .attr("height", h);

  // var g = svg.append("g")
  //     .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

  svg.selectAll("rect")
    .data(json_values)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d, i) {
    return i * (w / json_values.length) + margins.left;
    })
    .attr("y", function(d) {
    return (h - margins.bottom) - d;  //Height minus data value
    })
    .attr("width", w / json_values.length - barPadding)
    .attr("height", function(d) {
    return d;  //Just the data value
  });
    // .attr("fill", function(d) {
    // return "rgb(0, " + (d * 0.5) + ", 0)";
    // });


  // svg.append("g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + h + ")")
  //     .call(xAxis);
  // svg.append("g")
  //     .attr("class", "y axis")
  //     .call(yAxis)
  //   .append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 6)
  //     .attr("dy", ".71em")
  //     .style("text-anchor", "end")
  //     .text("Frequency");

  svg.selectAll("text")
   .data(json_months)
   .enter()
   .append("text")
   .attr("class", "texto")
   .text(function(d) {
     return d.substring(3,7)
   })
   .attr("x", function(d, i) {
        return i * (w / json_values.length) + margins.left + 4;
   })
   .attr("y", function(d) {
        return h - 5;
   });

  //  I used this helpful link to make this http://jsfiddle.net/nhHww/1/


var requester = new XMLHttpRequest();
// var gitthingy = "https://oranguh.github.io/dataprocessing/Homework/Week_3/enron.json";
var gitthingy = "enron.json"
requester.addEventListener("load", reqListener);
requester.open("GET", gitthingy);
requester.send();