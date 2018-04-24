function reqListener(){

  var jsondata = JSON.parse(this.responseText);
  var json_values = []
  var json_percentage = []
  var json_months = []

  for (i in jsondata) {
    json_values[i] = jsondata[i]["fraud_count"]
    json_months[i] = jsondata[i]["month"]
  }
  console.log(json_percentage)
  var svg = d3.select("div.output svg")
    .attr('width', window.innerWidth)
    .attr('height', window.innerHeight)
  // console.log(svg)
  svg.selectAll("rect")
    .data(json_values)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", function(d,i) { return i*15 })
      .attr("width", function(d,i) { return d*2; })
      .attr("height", 15)
      .style("fill", "steelblue")
}

var requester = new XMLHttpRequest();
// var gitthingy = "https://oranguh.github.io/dataprocessing/Homework/Week_3/enron.json";
var gitthingy = "enron.json"
requester.addEventListener("load", reqListener);
requester.open("GET", gitthingy);
requester.send();
